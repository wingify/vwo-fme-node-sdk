/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
import { Constants } from '../constants';
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
import { StorageDecorator } from '../decorators/StorageDecorator';

export const checkWhitelistingAndPreSeg = async (
  settings: SettingsModel,
  feature: FeatureModel,
  campaign: CampaignModel,
  context: ContextModel,
  evaluatedFeatureMap: Map<string, any>,
  megGroupWinnerCampaigns: Map<number, any>,
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
  const { groupId } = getGroupDetailsIfCampaignPartOfIt(
    settings,
    campaign.getId(),
    campaign.getType() === CampaignTypeEnum.PERSONALIZE ? campaign.getVariations()[0].getId() : null,
  );
  // Check if group is already evaluated and we have eligible winner campaigns
  const groupWinnerCampaignId = megGroupWinnerCampaigns?.get(groupId);
  if (groupWinnerCampaignId) {
    if (campaign.getType() === CampaignTypeEnum.AB) {
      // check if the campaign is the winner of the group
      if (groupWinnerCampaignId === campaignId) {
        return [true, null];
      }
    } else if (campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
      // check if the campaign is the winner of the group
      if (groupWinnerCampaignId === campaignId + '_' + campaign.getVariations()[0].getId()) {
        return [true, null];
      }
    }
    // as group is already evaluated, no need to check again, return false directly
    return [false, null];
  } else if (groupId) {
    // check in storage if the group is already evaluated for the user
    const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(
      `${Constants.VWO_META_MEG_KEY}${groupId}`,
      context,
      storageService,
    );
    if (storedData && storedData.experimentKey && storedData.experimentId) {
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
          campaignKey: storedData.experimentKey,
          userId: context.getId(),
        }),
      );
      if (storedData.experimentId === campaignId) {
        // return the campaign if the called campaignId matches
        if (campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
          if (storedData.experimentVariationId === campaign.getVariations()[0].getId()) {
            // if personalise then check if the reqeusted variation is the winner
            return [true, null];
          } else {
            // if requested variation is not the winner then set the winner campaign in the map and return
            megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
            return [false, null];
          }
        } else {
          return [true, null];
        }
      }
      if (storedData.experimentVariationId != -1) {
        megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
      } else {
        megGroupWinnerCampaigns.set(groupId, storedData.experimentId);
      }
      return [false, null];
    }
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
      if (winnerCampaign.type === CampaignTypeEnum.AB) {
        return [true, null];
      } else {
        // if personalise then check if the reqeusted variation is the winner
        if (winnerCampaign.variations[0].id === campaign.getVariations()[0].getId()) {
          return [true, null];
        } else {
          megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
          return [false, null];
        }
      }
    } else if (winnerCampaign) {
      if (winnerCampaign.type === CampaignTypeEnum.AB) {
        megGroupWinnerCampaigns.set(groupId, winnerCampaign.id);
      } else {
        megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
      }
      return [false, null];
    }
    megGroupWinnerCampaigns.set(groupId, -1);
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
        campaignKey:
          campaign.getType() === CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        userId,
        status: 'did not get any variation',
      }),
    );

    return null;
  }
  LogManager.Instance.info(
    buildMessage(InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
      campaignKey:
        campaign.getType() === CampaignTypeEnum.AB
          ? campaign.getKey()
          : campaign.getName() + '_' + campaign.getRuleKey(),
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
      campaignKey:
        campaign.getType() === CampaignTypeEnum.AB
          ? campaign.getKey()
          : campaign.getName() + '_' + campaign.getRuleKey(),
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
          campaignKey:
            campaign.getType() === CampaignTypeEnum.AB
              ? campaign.getKey()
              : campaign.getName() + '_' + campaign.getRuleKey(),
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
