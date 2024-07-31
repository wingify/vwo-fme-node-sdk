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
import { isPromise } from '../utils/DataTypeUtil';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { StatusEnum } from '../enums/StatusEnum';
import { InfoLogMessagesEnum } from '../enums/log-messages';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { ContextModel } from '../models/user/ContextModel';
import { DecisionMaker } from '../packages/decision-maker';
import { LogManager } from '../packages/logger';
import { SegmentationManager } from '../packages/segmentation-evaluator';
import { CampaignDecisionService } from '../services/CampaignDecisionService';
import { IStorageService } from '../services/StorageService';
import { isObject } from '../utils/DataTypeUtil';
import {
  assignRangeValues,
  getBucketingSeed,
  getGroupDetailsIfCampaignPartOfIt,
  scaleVariationWeights,
} from './CampaignUtil';
import { cloneObject } from './FunctionUtil';
import { buildMessage } from './LogMessageUtil';
import { evaluateGroups } from './MegUtil';
import { getUUID } from './UuidUtil';

export const checkWhitelistingAndPreSeg = async (
  settings: SettingsModel,
  feature: FeatureModel,
  campaign: CampaignModel,
  context: ContextModel,
  evaluatedFeatureMap: Map<string, any>,
  megGroupWinnerCampaigns: Map<number, number>,
  storageService: IStorageService,
  decision: any,
): Promise<[boolean, any]> => {
  const vwoUserId = getUUID(context.getId(), settings.getAccountId());
  const campaignId = campaign.getId();

  if (campaign.getType() === CampaignTypeEnum.AB) {
    // set _vwoUserId for variation targeting variables
    context.setVariationTargetingVariables(
      Object.assign({}, context.getVariationTargetingVariables(), {
        _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
      }),
    );

    Object.assign(decision, { variationTargetingVariables: context.getVariationTargetingVariables() }); // for integration

    // check if the campaign satisfies the whitelisting
    if (campaign.getIsForcedVariationEnabled()) {
      const whitelistedVariation = await _checkCampaignWhitelisting(campaign, context);
      if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
        return [true, whitelistedVariation];
      }
    } else {
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.WHITELISTING_SKIP, {
          campaignKey: campaign.getRuleKey(),
          userId: context.getId(),
        }),
      );
    }
  }
  // userlist segment is also available for campaign pre segmentation
  context.setCustomVariables(
    Object.assign({}, context.getCustomVariables(), {
      _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
    }),
  );

  Object.assign(decision, { customVariables: context.getCustomVariables() }); // for integeration

  // Check if RUle being evaluated is part of Mutually Exclusive Group
  const { groupId } = getGroupDetailsIfCampaignPartOfIt(settings, campaignId);
  // Check if group is already evaluated and we have eligible winner campaigns
  const groupWinnerCampaignId = megGroupWinnerCampaigns?.get(groupId);
  if (groupWinnerCampaignId) {
    // check if the campaign is the winner of the group
    if (groupWinnerCampaignId === campaignId) {
      return [true, null];
    }
    // as group is already evaluated, no need to check again, return false directly
    return [false, null];
  }

  // If Whitelisting is skipped/failed and campaign not part of any MEG Groups
  // Check campaign's pre-segmentation
  const isPreSegmentationPassed = await new CampaignDecisionService().getPreSegmentationDecision(campaign, context);

  if (isPreSegmentationPassed && groupId) {
    const winnerCampaign = await evaluateGroups(
      settings,
      feature,
      groupId,
      evaluatedFeatureMap,
      context,
      storageService,
    );

    if (winnerCampaign && winnerCampaign.id === campaignId) {
      return [true, null];
    }
    megGroupWinnerCampaigns.set(groupId, winnerCampaign?.id || 0);
    return [false, null];
  }

  return [isPreSegmentationPassed, null];
};

export const evaluateTrafficAndGetVariation = (
  settings: SettingsModel,
  campaign: CampaignModel,
  userId: string | number,
): VariationModel => {
  const variation = new CampaignDecisionService().getVariationAlloted(userId, settings.getAccountId(), campaign);
  if (!variation) {
    LogManager.Instance.info(
      buildMessage(InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
        campaignKey: campaign.getKey(),
        userId,
        status: 'did not get any variation',
      }),
    );

    return null;
  }
  LogManager.Instance.info(
    buildMessage(InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
      campaignKey: campaign.getKey(),
      userId,
      status: `got variation:${variation.getKey()}`,
    }),
  );

  return variation;
};

/******************
 * PRIVATE METHODS
 ******************/

/**
 * Check for whitelisting
 * @param campaign      Campaign object
 * @param userId        User ID
 * @param variationTargetingVariables   Variation targeting variables
 * @returns
 */
const _checkCampaignWhitelisting = async (campaign: CampaignModel, context: ContextModel): Promise<any> => {
  // check if the campaign satisfies the whitelisting
  const whitelistingResult = await _evaluateWhitelisting(campaign, context);
  const status = whitelistingResult ? StatusEnum.PASSED : StatusEnum.FAILED;
  const variationString = whitelistingResult ? whitelistingResult.variation.key : '';

  LogManager.Instance.info(
    buildMessage(InfoLogMessagesEnum.WHITELISTING_STATUS, {
      userId: context.getId(),
      campaignKey: campaign.getRuleKey(),
      status,
      variationString,
    }),
  );

  return whitelistingResult;
};

const _evaluateWhitelisting = async (campaign: CampaignModel, context: ContextModel): Promise<any> => {
  const targetedVariations = [];
  const promises: Promise<any>[] = [];

  let whitelistedVariation;

  campaign.getVariations().forEach((variation) => {
    if (isObject(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.WHITELISTING_SKIP, {
          campaignKey: campaign.getRuleKey(),
          userId: context.getId(),
          variation: variation.getKey() ? `for variation: ${variation.getKey()}` : '',
        }),
      );

      return;
    }
    // check for segmentation and evaluate
    if (isObject(variation.getSegments())) {
      let SegmentEvaluatorResult = SegmentationManager.Instance.validateSegmentation(
        variation.getSegments(),
        context.getVariationTargetingVariables(),
      );
      SegmentEvaluatorResult = isPromise(SegmentEvaluatorResult)
        ? SegmentEvaluatorResult
        : Promise.resolve(SegmentEvaluatorResult);
      SegmentEvaluatorResult.then((evaluationResult) => {
        if (evaluationResult) {
          targetedVariations.push(cloneObject(variation));
        }
      });

      promises.push(SegmentEvaluatorResult);
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
      new DecisionMaker().calculateBucketValue(getBucketingSeed(context.getId(), campaign, null)),
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
