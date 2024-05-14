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

import { FeatureModel } from '../models/FeatureModel';
import { SettingsModel } from '../models/SettingsModel';

import { StorageDecorator } from '../decorators/StorageDecorator';
import { ApiEnum } from '../enums/ApiEnum';
import { EventEnum } from '../enums/EventEnum';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { CampaignModel } from '../models/CampaignModel';
import { VariableModel } from '../models/VariableModel';
import { VariationModel } from '../models/VariationModel';
import { LogManager } from '../modules/logger';
import { SegmentationManager } from '../modules/segmentor';
import HooksManager from '../services/HooksManager';
import { StorageService } from '../services/StorageService';
import { getVariationByCampaignKey } from '../utils/CampaignUtil';
import { isObject } from '../utils/DataTypeUtil';
import { checkWhitelistingAndPreSeg, evaluateTrafficAndGetVariation } from '../utils/DecisionUtil';
import {
  getAllAbAndPersonaliseRules,
  getFeatureFromKey,
  getFeatureIdFromKey,
  getFeatureNameFromKey,
  getSpecificRulesBasedOnType,
} from '../utils/FunctionUtil';
import { NetworkUtil } from '../utils/NetworkUtil';
import { Deferred } from '../utils/PromiseUtil';

interface IGetFlag {
  get(featureKey: string, settings: SettingsModel, context: any, hookManager: HooksManager): Promise<FeatureModel>;
}

export class FlagApi implements IGetFlag {
  async get(
    featureKey: string,
    settings: SettingsModel,
    context: any,
    hookManager: HooksManager,
  ): Promise<FeatureModel> {
    // initialize contextUtil object
    const decision = this.createDecision(settings, featureKey, context);
    let isEnabled = false;
    let rolloutVariationToReturn = null;
    let experimentVariationToReturn = null;
    const rulesInformation = {}; // for storing and integration callback

    const deferredObject = new Deferred();
    const evaluatedFeatureMap: Map<string, any> = new Map();
    let shouldCheckForAbPersonalise = false;

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
            `Variation ${variation.getKey()} found in storage for the user ${context.id} for the experiment campaign ${storedData.experimentKey}`,
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
    } else if (storedData?.rolloutKey && storedData.rolloutId) {
      const variation: VariationModel = getVariationByCampaignKey(
        settings,
        storedData.rolloutKey,
        storedData.rolloutVariationId,
      );
      if (variation) {
        LogManager.Instance.info(
          `Variation ${variation.getKey()} found in storage for the user ${context.id} for the rollout campaign ${storedData.rolloutKey}`,
        );
        LogManager.Instance.info(`Evaluation experiement campaigns now for the user ${context.id}`);
        isEnabled = true;
        shouldCheckForAbPersonalise = true;
        rolloutVariationToReturn = variation;
        const featureInfo = {
          rolloutId: storedData.rolloutId,
          rolloutKey: storedData.rolloutKey,
          rolloutVariationId: storedData.rolloutVariationId,
        };
        evaluatedFeatureMap.set(featureKey, featureInfo);
        Object.assign(rulesInformation, featureInfo);
      }
    }

    let ruleToTrack = [];

    // get feature object from feature key
    const feature = getFeatureFromKey(settings, featureKey);

    await SegmentationManager.Instance.setContextualData(settings, feature, context);

    if (!isObject(feature) || feature === undefined) {
      LogManager.Instance.info(`Feature not found for the key ${featureKey}`);
      deferredObject.resolve({
        isEnabled: () => false,
        getVariables: () => [],
        getVariable: (key: string, defaultValue: string) => defaultValue,
      });
      return deferredObject.promise;
    }
    const rollOutRules = getSpecificRulesBasedOnType(settings, featureKey, CampaignTypeEnum.ROLLOUT); // get all rollout rules
    if (rollOutRules.length > 0 && !isEnabled) {
      // if rollout rules are present and shouldCheckForAB is false, then check for rollout rules only
      for (const rule of rollOutRules) {
        // evaluateRuleResult - true/ false (based pre segment condition)
        const [evaluateRuleResult, ] = await evaluateRule(
          settings,
          feature,
          rule,
          context,
          false,
          evaluatedFeatureMap,
          null,
          storageService,
          decision,
        );
        if (evaluateRuleResult) {
          // if pre segment passed, then break the loop and check the traffic allocation
          ruleToTrack.push(rule);
          evaluatedFeatureMap.set(featureKey, {
            rolloutId: rule.id,
            rolloutKey: rule.key,
            rolloutVariationId: rule.variations[0].id,
          });
          break;
        }
        continue; // if rule does not satisfy, then check for other rule
      }
    } else if (rollOutRules.length === 0) {
      LogManager.Instance.info('No Rollout rules present for the feature, checking rules for AB/Personalize');
      shouldCheckForAbPersonalise = true;
    }

    if (ruleToTrack.length > 0) {
      const campaign = new CampaignModel().modelFromDictionary(ruleToTrack.pop());
      const variation = this.trafficCheckAndReturnVariation(
        settings,
        campaign,
        context,
        rulesInformation,
        decision,
      );
      if (isObject(variation) && Object.keys(variation).length > 0) {
        isEnabled = true;
        shouldCheckForAbPersonalise = true;
        rolloutVariationToReturn = variation;
      }
      ruleToTrack = [];
    }
    if (shouldCheckForAbPersonalise) {
      // if rollout rule is passed, get all ab and personalise rules
      const allRules = getAllAbAndPersonaliseRules(settings, featureKey);
      const megGroupWinnerCampaigns: Map<string, number> = new Map();
      for (const rule of allRules) {
        // abPersonalizeResult - true/ false (based on whitelisting condition || pre segment condition)
        const [abPersonalizeResult, whitelistedVariation] = await evaluateRule(
          settings,
          feature,
          rule,
          context,
          false,
          evaluatedFeatureMap,
          megGroupWinnerCampaigns,
          storageService,
          decision,
        );
        if (abPersonalizeResult) {
          if (whitelistedVariation === null) {
            // whitelistedVariation will be null if pre segment passed but whitelisting failed
            ruleToTrack.push(rule);
          } else {
            isEnabled = true;
            experimentVariationToReturn = whitelistedVariation.variation;
            Object.assign(rulesInformation, {
              experimentId: rule.id,
              experimentKey: whitelistedVariation.experimentKey,
              experimentVariationId: whitelistedVariation.variationId,
            });
          }
          break;
        }
        continue;
      }
    }
    if (ruleToTrack.length > 0) {
      const campaign = new CampaignModel().modelFromDictionary(ruleToTrack.pop());
      const variation = this.trafficCheckAndReturnVariation(
        settings,
        campaign,
        context,
        rulesInformation,
        decision,
      );
      if (isObject(variation) && Object.keys(variation).length > 0) {
        isEnabled = true;
        experimentVariationToReturn = variation;
      }
    }
    if (isEnabled) {
      // set storage data
      new StorageDecorator().setDataInStorage(
        {
          featureKey,
          user: context,
          ...rulesInformation,
        },
        storageService,
      );
      hookManager.set(decision);
      hookManager.execute(hookManager.get());
    }
    if (feature.impactCampaign?.campaignId) {
      LogManager.Instance.info(`Sending data for Impact Campaign for the user ${context.id}`);
      createImpressionForVariationShown(
        settings,
        { id: feature.impactCampaign?.campaignId },
        context,
        { id: isEnabled ? 2 : 1 },
      )
    }
    deferredObject.resolve({
      isEnabled: () => isEnabled,
      getVariables: () => experimentVariationToReturn?.variables ?? rolloutVariationToReturn?.variables ?? [],
      getVariable: (
        key: string,
        defaultValue: string, // loop over all variables object and return the value where key is equal to given key else return given default value
      ) => {
        const variables = experimentVariationToReturn?.variables ?? rolloutVariationToReturn?.variables ?? [];
        const variable = variables.find((variable) => variable.key === key);
        return variable?.value ?? defaultValue;
      },
    });

    return deferredObject.promise;
  }

  private createDecision(settings: SettingsModel, featureKey: string, context: any): any {
    return {
      featureName: getFeatureNameFromKey(settings, featureKey),
      featureId: getFeatureIdFromKey(settings, featureKey),
      featureKey,
      userId: context.id,
      api: ApiEnum.GET_FLAG,
    };
  }

  private trafficCheckAndReturnVariation(
    settings: any,
    campaign: any,
    context: any,
    rulesInformation: any,
    decision: any,
  ): VariationModel {
    const variation = evaluateTrafficAndGetVariation(settings, campaign, context.id);
    if (isObject(variation) && Object.keys(variation).length > 0) {
      if (campaign.getType() === CampaignTypeEnum.ROLLOUT) {
        Object.assign(rulesInformation, {
          rolloutId: campaign.getId(),
          rolloutKey: campaign.getKey(),
          rolloutVariationId: variation.getId(),
        });
      } else {
        Object.assign(rulesInformation, {
          experimentId: campaign.getId(),
          experimentKey: campaign.getKey(),
          experimentVariationId: variation.getId(),
        });
      }
      Object.assign(decision, rulesInformation);
      createImpressionForVariationShown(settings, campaign, context, variation);
      return variation;
    }
    return null;
  }
}

/**
 * Evaluate the rule
 * @param rule    rule to evaluate
 * @param user    user object
 * @returns
 */
export const evaluateRule = async (
  settings: any,
  feature: any,
  rule: any,
  context: any,
  isMegWinnerRule: boolean,
  evaluatedFeatureMap: Map<string, any>,
  megGroupWinnerCampaigns: Map<string, number>,
  storageService: StorageService,
  decision: any,
): Promise<[boolean, any]> => {
  // evaluate the dsl
  const campaign: CampaignModel = new CampaignModel();
  campaign.modelFromDictionary(rule);
  // check for whitelisting and pre segmentation
  const [preSegmentationResult, whitelistedObject] = await checkWhitelistingAndPreSeg(
    settings,
    feature,
    campaign,
    context,
    isMegWinnerRule,
    evaluatedFeatureMap,
    megGroupWinnerCampaigns,
    storageService,
    decision,
  );

  // if pre segmentation result is true and whitelisted object is present, then send post call
  if (preSegmentationResult && isObject(whitelistedObject) && Object.keys(whitelistedObject).length > 0) {
    Object.assign(decision, {
      experimentId: campaign.getId(),
      experimentKey: campaign.getKey(),
      experimentVariationId: whitelistedObject.variationId,
    });
    createImpressionForVariationShown(
      settings,
      campaign,
      context,
      whitelistedObject.variation,
    );
  }

  return [preSegmentationResult, whitelistedObject];
};

const createImpressionForVariationShown = (
  settings: any,
  campaign: any,
  user: any,
  variation: any,
) => {
  const networkUtil = new NetworkUtil();
  const properties = networkUtil.getEventsBaseProperties(
    settings,
    EventEnum.VWO_VARIATION_SHOWN,
    encodeURIComponent(user.userAgent),
    user.ipAddress,
  );
  const payload = networkUtil.getTrackUserPayloadData(
    settings,
    user.id,
    EventEnum.VWO_VARIATION_SHOWN,
    campaign.id,
    variation.id,
    user.userAgent,
    user.ipAddress,
  );
  networkUtil.sendPostApiRequest(properties, payload);
};
