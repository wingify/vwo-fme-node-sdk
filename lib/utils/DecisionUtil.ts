import { LogManager } from '../modules/logger';
import { StatusEnum } from '../enums/StatusEnum';
import { isObject } from '../utils/DataTypeUtil';
import { SegmentEvaluator } from '../modules/segmentor';
import { getUUID } from './UuidUtil';
import { isPromise } from 'util/types';
import { cloneObject } from './FunctionUtil';
import { scaleVariationWeights, assignRangeValues, getBucketingSeed } from './CampaignUtil';
import { DecisionMaker } from '../modules/decision-maker';
import { CampaignDecisionService } from '../services/CampaignDecisionService';
import { CampaignModel } from '../models/CampaignModel';
import { VariationModel } from '../models/VariationModel'; // Import the missing VariationModel type

export const checkWhitelistingAndPreSeg = async (
  settings: any,
  campaign: CampaignModel,
  userId: any,
  customVariables: any,
  variationTargetingVariables: any,
): Promise<[Boolean, any]> => {

  let vwoUserId = getUUID(userId, settings.accountId);

  variationTargetingVariables = Object.assign({}, variationTargetingVariables, {
    _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : userId,
  });


  // check if the campaign satisfies the whitelisting
  if (campaign.getIsForcedVariationEnabled()) {
    const whitelistedVariation = await checkForWhitelisting(
      campaign,
      campaign.getKey(),
      userId,
      variationTargetingVariables,
    );
    if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
      return [true, whitelistedVariation];
    }
  } else {
    LogManager.Instance.info(
      `WHITELISTING_SKIPPED: Whitelisting is not used for Campaign:${campaign.getKey()}, hence skipping evaluating whitelisting for User ID:${userId}`,
    );
  }

  // check for campaign pre segmentation
  const preSegmentationResult = await new CampaignDecisionService().getDecision(campaign, userId, customVariables);
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
  userId: any,
  variationTargetingVariables: any,
): Promise<any> => {
  let status;
  // check if the campaign satisfies the whitelisting
  const whitelistingResult = await _evaluateWhitelisting(campaign, campaignKey, userId, variationTargetingVariables);
  let variationString;
  if (whitelistingResult) {
    status = StatusEnum.PASSED;
    variationString = whitelistingResult.variation.key;
  } else {
    status = StatusEnum.FAILED;
    variationString = '';
  }
  LogManager.Instance.info(
    `SEGMENTATION_STATUS: User ID:${userId} for Campaign:${campaignKey} with variables:${JSON.stringify(variationTargetingVariables)} ${status} whitelisting ${variationString}`,
  );
  return whitelistingResult;
};

const _evaluateWhitelisting = (
  campaign: CampaignModel,
  campaignKey: string,
  userId: any,
  variationTargetingVariables: any,
): any => {
  let whitelistedVariation;
  let status;
  const targetedVariations = [];
  campaign.getVariations().forEach((variation) => {
    if (isObject(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
      LogManager.Instance.debug(
        `SEGMENTATION_SKIPPED: Segmentation is not used for Campaign:${campaignKey}, hence skipping evaluating segmentation ${variation} for User ID:${userId}`,
      );
      return;
    }
    // check for segmentation and evaluate
    if (isObject(variation.getSegments())) {
      const SegmentEvaluatorResult = new SegmentEvaluator().isSegmentationValid(
        variation.getSegments(),
        variationTargetingVariables,
      );
      if (isPromise(SegmentEvaluatorResult)) {
        SegmentEvaluatorResult.then((evaluationResult) => {
          if (evaluationResult) {
            status = StatusEnum.PASSED;
            targetedVariations.push(cloneObject(variation));
          } else {
            status = StatusEnum.FAILED;
          }
        });
      } else {
        if (SegmentEvaluatorResult) {
          status = StatusEnum.PASSED;
          targetedVariations.push(cloneObject(variation));
        } else {
          status = StatusEnum.FAILED;
        }
      }
    } else {
      status = StatusEnum.FAILED;
    }
  });

  if (targetedVariations.length > 1) {
    scaleVariationWeights(targetedVariations);
    for (let i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
      stepFactor = assignRangeValues(targetedVariations[i], currentAllocation);
      currentAllocation += stepFactor;
    }
    whitelistedVariation = new CampaignDecisionService().getVariation(
      targetedVariations,
      new DecisionMaker().calculateBucketValue(getBucketingSeed(userId, campaign, null)),
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

export const evaluateTrafficAndGetVariation = (settingsFile: any, campaign: CampaignModel, userId: any): VariationModel => {
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
