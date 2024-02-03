// import { APIDecorator } from '../decorators/apiDecorator';
import { FeatureModel } from '../models/FeatureModel';
import { SettingsModel } from '../models/SettingsModel';

import { Deferred } from '../utils/PromiseUtil';
import { getSpecificRulesBasedOnType } from '../utils/FunctionUtil';
import { checkWhitelistingAndPreSeg, evaluateTrafficAndGetVariation } from '../utils/DecisionUtil';
import { CampaignModel } from '../models/CampaignModel';
import { CampaignTypeEnum } from '../enums/campaignTypeEnum';
import { NetworkUtil } from '../utils/NetworkUtil';
import { EventEnum } from '../enums/EventEnum';
import { isObject } from '../utils/DataTypeUtil';
import { getCampaignVariation, getRolloutVariation } from '../utils/CampaignUtil';
import { LogManager } from '../modules/logger';
import { StorageDecorator } from '../decorators/StorageDecorator';
import { StorageService } from '../services/StorageService';
import { VariationModel } from '../models/VariationModel';
import { VariableModel } from '../models/VariableModel';

interface IGetFlag {
  get(featureKey: string, settings: SettingsModel, user: any): Promise<FeatureModel>;
}

export class FlagApi implements IGetFlag {
  async get(featureKey: string, settings: SettingsModel, user: any): Promise<FeatureModel> {
    let isEnabled = false;
    let rolloutVariationToReturn = null;
    let expVariationToReturn = null;
    const deferredObject = new Deferred();

    const storageService = new StorageService();
    const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(featureKey, user, storageService);

    if (storedData?.experimentVariationId) {
      if (storedData.campaignKey) {
        const variation:VariationModel = getCampaignVariation(settings, storedData.campaignKey, storedData.variationId);

        if (variation) {
          deferredObject.resolve({
            isEnabled: isEnabled,
            getVariables: () => variation?.getVariables(),
            getVariable: (key: string, defaultValue: string) => // loop over all variables object and return the value where key is equal to given key else return given default value
            variation?.getVariables().find((variable) => (new VariableModel().modelFromDictionary(variable)).getKey() === key)?.getValue() || defaultValue,
          });

          return deferredObject.promise;
        }
      }
    } else if (storedData?.rolloutKey && storedData.rolloutId) {
        const variation:VariationModel = getRolloutVariation(settings, storedData.rolloutKey, storedData.rolloutVariationId);

        if (variation) {
          deferredObject.resolve({
            isEnabled: isEnabled,
            getVariables: () => variation?.getVariables(),
            getVariable: (key: string, defaultValue: string) => // loop over all variables object and return the value where key is equal to given key else return given default value
            variation?.getVariables().find((variable) => (new VariableModel().modelFromDictionary(variable)).getKey() === key)?.getValue() || defaultValue,
          });

          return deferredObject.promise;
        }
      }



    // if no rollout rules are present, then check for AB
    let shouldCheckForAB = false;
    let ruleToTrack = [];
    // get all rollout rules
    const rollOutRules = getSpecificRulesBasedOnType(settings, featureKey, CampaignTypeEnum.ROLLOUT);
    if (rollOutRules.length === 0) {
      LogManager.Instance.info('No Rollout rules present for the feature, checking rules for AB/Personalize');
      // if no rollout rules are present, then check for AB
      shouldCheckForAB = true;
    } else {
      // if rollout rules are present, then check if all are off
      const enabledRollOutRules = rollOutRules.filter((rule) => rule.status === 'ON');
      if (enabledRollOutRules.length > 0) {
        for (const rule of enabledRollOutRules) {
          // evaluate rule
          // shouldCheckForAB - true/ false , rollOutVariation will be null if track call not yet sent / not whitelisted for the campaign
          const [evaluateRuleResult, rollOutVariation] = await evaluateRule(settings, rule, user);
          // if rule satisfy, then break the loop and check for AB
          if (evaluateRuleResult) {
            isEnabled = true;  // for getFlag return value
            shouldCheckForAB = true;  // for checking AB
            if (rollOutVariation === null) {
              // this means user is part of the campaign but is not yet tracked
              ruleToTrack.push(rule);
            } else {
              rolloutVariationToReturn = rollOutVariation.variation;
            }

            new StorageDecorator().setDataInStorage({
              featureKey,
              user,
              rolloutKey: rule.key,
              rolloutVariationId: rolloutVariationToReturn.id
            }, storageService);
            break;
          }
          // if not, then continue to check for other rules
          continue;
        }
      } else {
        LogManager.Instance.info('No Rollout rules are enabled for the feature');
      }
    }
    // if shouldCheckForAB is true, then check for AB / Personalize
    if (shouldCheckForAB) {
      // get all rules
      const allRules = getSpecificRulesBasedOnType(settings, featureKey);
      // loop over all the rules
      for (const rule of allRules) {
        // only evaluate if rule is not of type rollout
        if (rule.type !== CampaignTypeEnum.ROLLOUT && rule.status === 'ON') {
          // evaluate the rule
          // abPersonalizeResult - true/ false , experimentVariation will be null  if track call not yet sent/ not whitelisted for the campaign
          const [abPersonalizeResult, experimentVariation] = await evaluateRule(settings, rule, user);
          if (abPersonalizeResult) {
            isEnabled = true;
            if (experimentVariation === null) {
              // this means user is part of the campaign but is not yet tracked
              ruleToTrack.push(rule);
            } else {
              expVariationToReturn = experimentVariation.variation;
            }
            break;
          }
          continue;
        }
      }
    }

    // if any rule satisfy, then get the variation and send post call
    if (ruleToTrack.length !== 0) {
      // loop over all the rulesToTrack
      for (const rule of ruleToTrack) {
        // get variation and send post call
        const campaign = new CampaignModel().modelFromDictionary(rule);
        const variation = evaluateTrafficAndGetVariation(settings, campaign, user.id);
        expVariationToReturn = variation;
        if (isObject(variation) && Object.keys(variation).length > 0) {
          new StorageDecorator().setDataInStorage({
            featureKey,
            user,
            rolloutKey: rule.key,
            rolloutVariationId: rolloutVariationToReturn.id,
            experimentKey: campaign.getKey(),
            experimentVariationId: expVariationToReturn.id
          }, storageService);
          createImpressionForVariationShown(settings, campaign, user, variation);
        }
      }
    }

    deferredObject.resolve({
      isEnabled: isEnabled,
      getVariables: () => expVariationToReturn?.variables || rolloutVariationToReturn?.variables,
      getVariable: (key: string, defaultValue: string) => // loop over all variables object and return the value where key is equal to given key else return given default value
        (expVariationToReturn?.variables || rolloutVariationToReturn?.variables).find((variable) => variable.key === key)?.value || defaultValue,
    });

    return deferredObject.promise;
  }
}

/**
 * Evaluate the rule
 * @param rule    rule to evaluate
 * @param user    user object
 * @returns
 */
const evaluateRule = async (settings: any, rule: any, user: any): Promise<[Boolean, any]> => {
  // evaluate the dsl
  const campaign: CampaignModel = new CampaignModel();
  campaign.modelFromDictionary(rule);
  // check for whitelisting and pre segmentation
  const [preSegmentationResult, whitelistedObject] = await checkWhitelistingAndPreSeg(
    settings,
    campaign,
    user.id,
    user.customVariables,
    user.variationTargetingVariables,
  );

  // if pre segmentation result is true and whitelisted object is present, then send post call
  if (preSegmentationResult && isObject(whitelistedObject) && Object.keys(whitelistedObject).length > 0) {
    createImpressionForVariationShown(settings, campaign, user, whitelistedObject.variation);
  }
  return [preSegmentationResult, whitelistedObject];
};

const createImpressionForVariationShown = async (settings: any, campaign: any, user: any, variation: any) => {
  const networkUtil = new NetworkUtil();
  const properties =networkUtil.getEventsBaseProperties(
    settings,
    EventEnum.VWO_VARIATION_SHOWN,
    user.userAgent,
    user.userIpAddress,
  );
  const payload = networkUtil.getTrackUserPayloadData(
    settings,
    user.id,
    EventEnum.VWO_VARIATION_SHOWN,
    campaign.id,
    variation.id,
  );
  networkUtil.sendPostApiRequest(properties, payload);
}
