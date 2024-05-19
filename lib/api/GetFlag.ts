/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FeatureModel } from '../models/campaign/FeatureModel';
import { SettingsModel } from '../models/settings/SettingsModel';

import { StorageDecorator } from '../decorators/StorageDecorator';
import { ApiEnum } from '../enums/ApiEnum';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { VariableModel } from '../models/campaign/VariableModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { LogManager } from '../modules/logger';
import { SegmentationManager } from '../modules/segmentor';
import HooksManager from '../services/HooksManager';
import { StorageService } from '../services/StorageService';
import { getVariationByCampaignKey } from '../utils/CampaignUtil';
import { isObject } from '../utils/DataTypeUtil';
import { evaluateTrafficAndGetVariation } from '../utils/DecisionUtil';
import {
  getAllExperimentRules,
  getFeatureFromKey,
  getSpecificRulesBasedOnType,
} from '../utils/FunctionUtil';
import { ContextModel } from '../models/user/ContextModel';
import { createAndSendImpressionForVariationShown } from "../utils/ImpressionUtil";
import { Deferred } from '../utils/PromiseUtil';
import { evaluateRule } from '../utils/RuleEvaluationUtil';

interface IGetFlag {
  get(featureKey: string, settings: SettingsModel, context: ContextModel, hookManager: HooksManager): Promise<FeatureModel>;
}

export class FlagApi implements IGetFlag {
  async get(
    featureKey: string,
    settings: SettingsModel,
    context: ContextModel,
    hookManager: HooksManager,
  ): Promise<FeatureModel> {
    let isEnabled = false;
    let rolloutVariationToReturn = null;
    let experimentVariationToReturn = null;
    let shouldCheckForExperimentsRules = false;

    const passedRulesInformation = {}; // for storing and integration callback
    const deferredObject = new Deferred();
    const evaluatedFeatureMap: Map<string, any> = new Map();

    // get feature object from feature key
    const feature = getFeatureFromKey(settings, featureKey);
    const decision = {
      featureName: feature?.getName(),
      featureId: feature?.getId(),
      featureKey: feature?.getKey(),
      userId: context?.getId(),
      api: ApiEnum.GET_FLAG
    }

    const storageService = new StorageService();
    const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(
      featureKey,
      context,
      storageService,
    );

    if (storedData?.experimentVariationId) {
      if (storedData.experimentKey) {
        const variation: VariationModel = getVariationByCampaignKey(
          settings,
          storedData.experimentKey,
          storedData.experimentVariationId,
        );

        if (variation) {
          LogManager.Instance.info(
            `Variation ${variation.getKey()} found in storage for the user ${context.getId()} for the experiment campaign ${storedData.experimentKey}`,
          );
          deferredObject.resolve({
            isEnabled: () => true,
            getVariables: () => variation?.getVariables(),
            getVariable: (
              key: string,
              defaultValue: string, // loop over all variables object and return the value where key is equal to given key else return given default value
            ) =>
              variation
                ?.getVariables()
                .find((variable) => new VariableModel().modelFromDictionary(variable).getKey() === key)
                ?.getValue() || defaultValue,
          });

          return deferredObject.promise;
        }
      }
    } else if (storedData?.rolloutKey && storedData?.rolloutId) {
      const variation: VariationModel = getVariationByCampaignKey(
        settings,
        storedData.rolloutKey,
        storedData.rolloutVariationId,
      );
      if (variation) {
        LogManager.Instance.info(
          `Variation ${variation.getKey()} found in storage for the user ${context.getId()} for the rollout campaign ${storedData.rolloutKey}`,
        );
        LogManager.Instance.info(`Evaluate experiments for the user ${context.getId()}`);
        isEnabled = true;
        shouldCheckForExperimentsRules = true;
        rolloutVariationToReturn = variation;
        const featureInfo = {
          rolloutId: storedData.rolloutId,
          rolloutKey: storedData.rolloutKey,
          rolloutVariationId: storedData.rolloutVariationId,
        };
        evaluatedFeatureMap.set(featureKey, featureInfo);
        Object.assign(passedRulesInformation, featureInfo);
      }
    }

    if (!isObject(feature) || feature === undefined) {
      LogManager.Instance.error(`Feature not found for the key ${featureKey}`);
      deferredObject.reject({});

      return deferredObject.promise;
    }

    // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
    await SegmentationManager.Instance.setContextualData(settings, feature, context);

    const rollOutRules = getSpecificRulesBasedOnType(feature, CampaignTypeEnum.ROLLOUT); // get all rollout rules

    if (rollOutRules.length > 0 && !isEnabled) {
      const rolloutRulesToEvaluate = [];

      for (const rule of rollOutRules) {
        const { preSegmentationResult, updatedDecision } = await evaluateRule(
          settings,
          feature,
          rule,
          context,
          evaluatedFeatureMap,
          null,
          storageService,
          decision,
        );

        Object.assign(decision, updatedDecision);

        if (preSegmentationResult) {
          // if pre segment passed, then break the loop and check the traffic allocation
          rolloutRulesToEvaluate.push(rule);

          evaluatedFeatureMap.set(featureKey, {
            rolloutId: rule.getId(),
            rolloutKey: rule.getKey(),
            rolloutVariationId: rule.getVariations()[0]?.getId(),
          });

          break;
        }

        continue; // if rule does not satisfy, then check for other ROLLOUT rules
      }

      if (rolloutRulesToEvaluate.length > 0) {
        const passedRolloutCampaign = new CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
        const variation = evaluateTrafficAndGetVariation(settings, passedRolloutCampaign, context.getId());

        if (isObject(variation) && Object.keys(variation).length > 0) {
          isEnabled = true;
          shouldCheckForExperimentsRules = true;
          rolloutVariationToReturn = variation;

          _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);

          createAndSendImpressionForVariationShown(settings, passedRolloutCampaign.getId(), variation.getId(), context);
        }
      }

    } else if (rollOutRules.length === 0) {
      LogManager.Instance.info('No Rollout rules present for the feature. Hence, checking Experiment rules');
      shouldCheckForExperimentsRules = true;
    }

    if (shouldCheckForExperimentsRules) {
      const experimentRulesToEvaluate = [];

      // if rollout rule is passed, get all ab and personalise rules
      const experimentRules = getAllExperimentRules(feature);
      const megGroupWinnerCampaigns: Map<number, number> = new Map();

      for (const rule of experimentRules) {
        const { preSegmentationResult, whitelistedObject, updatedDecision } = await evaluateRule(
          settings,
          feature,
          rule,
          context,
          evaluatedFeatureMap,
          megGroupWinnerCampaigns,
          storageService,
          decision,
        );

        Object.assign(decision, updatedDecision);

        if (preSegmentationResult) {
          if (whitelistedObject === null) {
            // whitelistedObject will be null if pre segment passed but whitelisting failed
            experimentRulesToEvaluate.push(rule);
          } else {
            isEnabled = true;
            experimentVariationToReturn = whitelistedObject.variation;
            Object.assign(passedRulesInformation, {
              experimentId: rule.getId(),
              experimentKey: whitelistedObject.experimentKey,
              experimentVariationId: whitelistedObject.variationId,
            });
          }

          break;
        }
        continue;
      }

      if (experimentRulesToEvaluate.length > 0) {
        const campaign = new CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
        const variation = evaluateTrafficAndGetVariation(settings, campaign, context.getId());

        if (isObject(variation) && Object.keys(variation).length > 0) {
          isEnabled = true;
          experimentVariationToReturn = variation;

          _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);

          createAndSendImpressionForVariationShown(settings, campaign.getId(), variation.getId(), context);
        }
      }
    }

    // If flag is enabled, store it in data
    if (isEnabled) {
      // set storage data
      new StorageDecorator().setDataInStorage(
        {
          featureKey,
          context,
          ...passedRulesInformation,
        },
        storageService,
      );
    }

    // call integration callback, if defined
    hookManager.set(decision);
    hookManager.execute(hookManager.get());

    // Send data for Impact Campaign, if defined
    if (feature.getImpactCampaign()?.getCampaignId()) {
      LogManager.Instance.info(`Sending data for Impact Campaign for the user ${context.getId()}`);

      createAndSendImpressionForVariationShown(
        settings,
        feature.getImpactCampaign()?.getCampaignId(),
        isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
        context
      )
    }

    const variablesForEvaluatedFlag = experimentVariationToReturn?.variables ?? rolloutVariationToReturn?.variables ?? [];

    deferredObject.resolve({
      isEnabled: () => isEnabled,
      getVariables: () => variablesForEvaluatedFlag,
      getVariable: (
        key: string,
        defaultValue: string, // loop over all variables object and return the value where key is equal to given key else return given default value
      ) => {
        const variable = variablesForEvaluatedFlag.find((variable) => variable.key === key);

        return variable?.value ?? defaultValue;
      },
    });

    return deferredObject.promise;
  }
}

// Not PRIVATE methods but helper methods. If need be, move them to some util file to be reused by other API(s)

function _updateIntegrationsDecisionObject(
  campaign: CampaignModel,
  variation: VariationModel,
  passedRulesInformation: any,
  decision: any,
): void {
  if (campaign.getType() === CampaignTypeEnum.ROLLOUT) {
    Object.assign(passedRulesInformation, {
      rolloutId: campaign.getId(),
      rolloutKey: campaign.getKey(),
      rolloutVariationId: variation.getId(),
    });
  } else {
    Object.assign(passedRulesInformation, {
      experimentId: campaign.getId(),
      experimentKey: campaign.getKey(),
      experimentVariationId: variation.getId(),
    });
  }
  Object.assign(decision, passedRulesInformation);
}
