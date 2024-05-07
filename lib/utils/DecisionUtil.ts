import { isPromise } from 'util/types';
import { StatusEnum } from '../enums/StatusEnum';
import { CampaignTypeEnum } from '../enums/campaignTypeEnum';
import { CampaignModel } from '../models/CampaignModel';
import { VariationModel } from '../models/VariationModel';
import { DecisionMaker } from '../modules/decision-maker';
import { LogManager } from '../modules/logger';
import { SegmentationManager } from '../modules/segmentor';
import { CampaignDecisionService } from '../services/CampaignDecisionService';
import { isObject } from '../utils/DataTypeUtil';
import { SettingsModel } from './../models/SettingsModel';
import { assignRangeValues, getBucketingSeed, scaleVariationWeights } from './CampaignUtil';
import { cloneObject } from './FunctionUtil';
import { getUUID } from './UuidUtil';

export const checkWhitelistingAndPreSeg = async (
  settings: any,
  campaign: CampaignModel,
  context: any,
  isMegWinnerRule: Boolean,
  decision: any,
): Promise<[Boolean, any]> => {
  let vwoUserId = getUUID(context.user.id, settings.accountId);

  // only check whitelisting for ab campaigns
  if (campaign.getType() === CampaignTypeEnum.AB) {
    // set _vwoUserId for variation targeting variables
    context.user.variationTargetingVariables = Object.assign({}, context.user.variationTargetingVariables, {
      _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.user.id,
    });
    Object.assign(decision, { variationTargetingVariables: context.user.variationTargetingVariables }); // for integration
    // check if the campaign satisfies the whitelisting
    if (campaign.getIsForcedVariationEnabled()) {
      const whitelistedVariation = await checkForWhitelisting(campaign, campaign.getKey(), settings, context);
      if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
        return [true, whitelistedVariation];
      }
    } else {
      LogManager.Instance.info(
        `WHITELISTING_SKIPPED: Whitelisting is not used for Campaign:${campaign.getKey()}, hence skipping evaluating whitelisting for User ID:${context.user.id}`,
      );
    }
  }

  if (isMegWinnerRule) {
    return [true, null]; // for MEG winner rule, no need to check for pre segmentation as it's already evaluated
  }
  // userlist segment is also available for campaign pre segmentation
  context.user.customVariables = Object.assign({}, context.user.customVariables, {
    _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.user.id,
  });
  Object.assign(decision, { customVariables: context.user.customVariables }); // for integeration

  // check for campaign pre segmentation
  const preSegmentationResult = await new CampaignDecisionService().getDecision(campaign, settings, context);
  return [preSegmentationResult, null];
};

/**
 * Check for whitelisting
 * @param campaign      Campaign object
 * @param campaignKey   Campaign key
 * @param userId        User ID
 * @param variationTargetingVariables   Variation targeting variables
 * @returns
 */
const checkForWhitelisting = async (
  campaign: any,
  campaignKey: string,
  settings: SettingsModel,
  context: any,
): Promise<any> => {
  let status;
  // check if the campaign satisfies the whitelisting
  const whitelistingResult = await _evaluateWhitelisting(campaign, campaignKey, settings, context);
  let variationString;
  if (whitelistingResult) {
    status = StatusEnum.PASSED;
    variationString = whitelistingResult.variation.key;
  } else {
    status = StatusEnum.FAILED;
    variationString = '';
  }
  LogManager.Instance.info(
    `SEGMENTATION_STATUS: User ID:${context.user.id} for Campaign:${campaignKey} with variables:${JSON.stringify(context.user.variationTargetingVariables)} ${status} whitelisting ${variationString}`,
  );
  return whitelistingResult;
};

const _evaluateWhitelisting = async (
  campaign: CampaignModel,
  campaignKey: string,
  settings: SettingsModel,
  context: any,
): Promise<any> => {
  let whitelistedVariation;
  let status;
  const targetedVariations = [];
  const promises: Promise<any>[] = [];
  campaign.getVariations().forEach((variation) => {
    if (isObject(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
      LogManager.Instance.debug(
        `SEGMENTATION_SKIPPED: Segmentation is not used for Campaign:${campaignKey}, hence skipping evaluating segmentation ${variation} for User ID:${context.user.id}`,
      );
      return;
    }
    // check for segmentation and evaluate
    if (isObject(variation.getSegments())) {
      const SegmentEvaluatorResult = SegmentationManager.Instance.validateSegmentation(
        variation.getSegments(),
        context.user.variationTargetingVariables,
        settings,
      );
      const promise = isPromise(SegmentEvaluatorResult)
        ? SegmentEvaluatorResult.then((evaluationResult) => {
            if (evaluationResult) {
              status = StatusEnum.PASSED;
              targetedVariations.push(cloneObject(variation));
            } else {
              status = StatusEnum.FAILED;
            }
          })
        : Promise.resolve(SegmentEvaluatorResult).then((evaluationResult) => {
            if (evaluationResult) {
              status = StatusEnum.PASSED;
              targetedVariations.push(cloneObject(variation));
            } else {
              status = StatusEnum.FAILED;
            }
          });
      promises.push(promise);
    } else {
      status = StatusEnum.FAILED;
    }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);
  if (targetedVariations.length > 1) {
    scaleVariationWeights(targetedVariations);
    for (let i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
      stepFactor = assignRangeValues(targetedVariations[i], currentAllocation);
      currentAllocation += stepFactor;
    }
    whitelistedVariation = new CampaignDecisionService().getVariation(
      targetedVariations,
      new DecisionMaker().calculateBucketValue(getBucketingSeed(context.user.id, campaign, null)),
    );
  } else {
    whitelistedVariation = targetedVariations[0];
  }

  if (whitelistedVariation) {
    return {
      variation: whitelistedVariation,
      variationName: whitelistedVariation.name,
      variationId: whitelistedVariation.id,
    };
  }
};

export const evaluateTrafficAndGetVariation = (
  settingsFile: any,
  campaign: CampaignModel,
  userId: any,
): VariationModel => {
  const variation = new CampaignDecisionService().getVariationAlloted(userId, settingsFile.accountId, campaign);
  if (!variation) {
    LogManager.Instance.debug(
      `USER_NOT_BUCKETED: User ID:${userId} for Campaign:${campaign.getKey()} did not get any variation`,
    );
    return null;
  }
  LogManager.Instance.debug(
    `USER_BUCKETED: User ID:${userId} for Campaign:${campaign.getKey()} ${variation.getKey() ? `got variation:${variation.getKey()}` : 'did not get any variation'}`,
  );
  return variation;
};
