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
import { isPromise } from 'util/types';
import { StatusEnum } from '../enums/StatusEnum';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { CampaignModel } from '../models/CampaignModel';
import { VariationModel } from '../models/VariationModel';
import { DecisionMaker } from '../modules/decision-maker';
import { LogManager } from '../modules/logger';
import { SegmentationManager } from '../modules/segmentor';
import { CampaignDecisionService } from '../services/CampaignDecisionService';
import { isObject } from '../utils/DataTypeUtil';
import { SettingsModel } from './../models/SettingsModel';
import { assignRangeValues, getBucketingSeed, isPartOfGroup, scaleVariationWeights } from './CampaignUtil';
import { cloneObject } from './FunctionUtil';
import { getUUID } from './UuidUtil';
import { evaluateGroups } from './MegUtil';
import { StorageService } from '../services/StorageService';

export const checkWhitelistingAndPreSeg = async (
  settings: any,
  feature: any,
  campaign: CampaignModel,
  context: any,
  isMegWinnerRule: boolean,
  evaluatedFeatureMap: Map<string, any>,
  megGroupWinnerCampaigns: Map<string, number>,
  storageService: StorageService,
  decision: any,
): Promise<[boolean, any]> => {
  const vwoUserId = getUUID(context.id, settings.accountId);

  if (campaign.getType() === CampaignTypeEnum.AB) {
    // set _vwoUserId for variation targeting variables
    context.variationTargetingVariables = Object.assign({}, context.variationTargetingVariables, {
      _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.id,
    });
    Object.assign(decision, { variationTargetingVariables: context.variationTargetingVariables }); // for integration
    // check if the campaign satisfies the whitelisting
    if (campaign.getIsForcedVariationEnabled()) {
      const whitelistedVariation = await checkForWhitelisting(campaign, campaign.getKey(), settings, context);
      if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
        return [true, whitelistedVariation];
      }
    } else {
      LogManager.Instance.info(
        `WHITELISTING_SKIPPED: Whitelisting is not used for Campaign:${campaign.getKey()}, hence skipping evaluating whitelisting for User ID:${context.id}`,
      );
    }
  }

  if (isMegWinnerRule) {
    return [true, null]; // for MEG winner rule, no need to check for pre segmentation as it's already evaluated
  }
  // userlist segment is also available for campaign pre segmentation
  context.customVariables = Object.assign({}, context.customVariables, {
    _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.id,
  });
  Object.assign(decision, { customVariables: context.customVariables }); // for integeration

  const { groupId, groupName } = isPartOfGroup(settings, campaign.getId());

  // true if group is already evaluated
  if (megGroupWinnerCampaigns && megGroupWinnerCampaigns.get(groupId)) {
    // check if the campaign is the winner of the group
    if (campaign.getId() == megGroupWinnerCampaigns.get(groupId)) {
      return [true, null];
    }
    // as group is already evaluated, no need to check again, return false directly
    return [false, null];
  }

  // check for campaign pre segmentation
  const preSegmentationResult = await new CampaignDecisionService().getDecision(campaign, settings, context);

  if (preSegmentationResult && groupId) {
    const winnerCampaign = await evaluateGroups(
      settings,
      feature.key,
      feature,
      groupId,
      evaluatedFeatureMap,
      context,
      storageService,
      decision,
    );

    if (winnerCampaign && winnerCampaign.id === campaign.getId()) {
      return [true, null];
    }
    megGroupWinnerCampaigns.set(groupId, winnerCampaign?.id || 0);
    return [false, null];
  }

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
    `SEGMENTATION_STATUS: User ID:${context.id} for Campaign:${campaignKey} with variables:${JSON.stringify(context.variationTargetingVariables)} ${status} whitelisting ${variationString}`,
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
        `SEGMENTATION_SKIPPED: Segmentation is not used for Campaign:${campaignKey}, hence skipping evaluating segmentation ${variation} for User ID:${context.id}`,
      );
      return;
    }
    // check for segmentation and evaluate
    if (isObject(variation.getSegments())) {
      const SegmentEvaluatorResult = SegmentationManager.Instance.validateSegmentation(
        variation.getSegments(),
        context.variationTargetingVariables,
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
      new DecisionMaker().calculateBucketValue(getBucketingSeed(context.id, campaign, null)),
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
  settings: any,
  campaign: CampaignModel,
  userId: any,
): VariationModel => {
  const variation = new CampaignDecisionService().getVariationAlloted(userId, settings.accountId, campaign);
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
