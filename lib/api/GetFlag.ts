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
import { LogManager } from '../modules/logger';

interface IGetFlag {
  get(featureKey: string, settings: SettingsModel, user: any): Promise<FeatureModel>;
}

export class FlagApi implements IGetFlag {
  async get(featureKey: string, settings: SettingsModel, user: any): Promise<FeatureModel> {
    let isEnabled = false;
    let variationToReturn = null;
    const deferredObject = new Deferred();
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
              variationToReturn = rollOutVariation.variation;
            }
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
              variationToReturn = experimentVariation.variation;
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
        variationToReturn = variation;
        if (isObject(variation) && Object.keys(variation).length > 0) {
          createImpressionForVariationShown(settings, campaign, user, variation);
        }
      }
    }

    deferredObject.resolve({
      isEnabled: isEnabled,
      getVariables: () => variationToReturn?.variables,
      getVariable: (key: string, defaultValue: string) => // loop over all variables object and return the value where key is equal to given key else return given default value
        variationToReturn?.variables.find((variable) => variable.key === key)?.value || defaultValue,
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
  // networkUtil.sendPostApiRequest(properties, payload);
}