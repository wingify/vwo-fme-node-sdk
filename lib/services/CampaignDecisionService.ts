/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { DecisionMaker } from '../packages/decision-maker';

import { Constants } from '../constants';
import { VariationModel } from '../models/campaign/VariationModel';

import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { ContextModel } from '../models/user/ContextModel';
import { isObject } from '../utils/DataTypeUtil';
import { buildMessage } from '../utils/LogMessageUtil';
import { ServiceContainer } from './ServiceContainer';

interface ICampaignDecisionService {
  isUserPartOfCampaign(userId: any, campaign: CampaignModel, serviceContainer: ServiceContainer): boolean;
  getVariation(variations: Array<VariationModel>, bucketValue: number): VariationModel;
  checkInRange(variation: VariationModel, bucketValue: number): VariationModel;
  bucketUserToVariation(
    userId: any,
    accountId: any,
    campaign: CampaignModel,
    serviceContainer: ServiceContainer,
  ): VariationModel;
  getPreSegmentationDecision(
    campaign: CampaignModel,
    context: ContextModel,
    serviceContainer: ServiceContainer,
  ): Promise<any>;
  getVariationAlloted(
    userId: any,
    accountId: any,
    campaign: CampaignModel,
    serviceContainer: ServiceContainer,
  ): VariationModel;
}

export class CampaignDecisionService implements ICampaignDecisionService {
  /**
   * Calculate if this user should become part of the campaign or not
   *
   * @param {String} userId the unique ID assigned to a user
   * @param {Object} campaign fot getting the value of traffic allotted to the campaign
   *
   * @return {Boolean} if User is a part of Campaign or not
   */
  isUserPartOfCampaign(userId: any, campaign: CampaignModel, serviceContainer: ServiceContainer): boolean {
    // if (!ValidateUtil.isValidValue(userId) || !campaign) {
    //   return false;
    // }

    if (!campaign || !userId) {
      return false;
    }

    // check if campaign is rollout or personalize
    const isRolloutOrPersonalize =
      campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE;
    // get salt
    const salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
    // get traffic allocation
    const trafficAllocation = isRolloutOrPersonalize ? campaign.getVariations()[0].getWeight() : campaign.getTraffic();
    // get bucket key
    const bucketKey = salt ? `${salt}_${userId}` : `${campaign.getId()}_${userId}`;
    // get bucket value for user
    const valueAssignedToUser = new DecisionMaker().getBucketValueForUser(bucketKey);
    // check if user is part of campaign
    const isUserPart = valueAssignedToUser !== 0 && valueAssignedToUser <= trafficAllocation;

    serviceContainer.getLogManager().info(
      buildMessage(InfoLogMessagesEnum.USER_PART_OF_CAMPAIGN, {
        userId,
        notPart: isUserPart ? '' : 'not',
        campaignKey:
          campaign.getType() === CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
      }),
    );

    return isUserPart;
  }

  /**
   * Returns the Variation by checking the Start and End Bucket Allocations of each Variation
   *
   * @param {Object} campaign which contains the variations
   * @param {Number} bucketValue the bucket Value of the user
   *
   * @return {Object|null} variation data allotted to the user or null if not
   */
  getVariation(variations: Array<VariationModel>, bucketValue: number): VariationModel {
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
        return variation;
      }
    }

    return null;
  }

  checkInRange(variation: VariationModel, bucketValue: number): VariationModel {
    if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
      return variation;
    }
  }

  /**
   * Validates the User ID and generates Variation into which the User is bucketed in.
   *
   * @param {String} userId the unique ID assigned to User
   * @param {Object} campaign the Campaign of which User is a part of
   *
   * @return {Object|null} variation data into which user is bucketed in or null if not
   */
  bucketUserToVariation(
    userId: any,
    accountId: any,
    campaign: CampaignModel,
    serviceContainer: ServiceContainer,
  ): VariationModel {
    let multiplier;

    if (!campaign || !userId) {
      return null;
    }

    if (campaign.getTraffic()) {
      multiplier = 1;
    }

    const percentTraffic = campaign.getTraffic();
    // get salt
    const salt = campaign.getSalt();
    // get bucket key
    const bucketKey = salt ? `${salt}_${accountId}_${userId}` : `${campaign.getId()}_${accountId}_${userId}`;
    // get hash value
    const hashValue = new DecisionMaker().generateHashValue(bucketKey);
    const bucketValue = new DecisionMaker().generateBucketValue(hashValue, Constants.MAX_TRAFFIC_VALUE, multiplier);

    serviceContainer.getLogManager().debug(
      buildMessage(DebugLogMessagesEnum.USER_BUCKET_TO_VARIATION, {
        userId,
        campaignKey: campaign.getKey(),
        percentTraffic,
        bucketValue,
        hashValue,
      }),
    );

    return this.getVariation(campaign.getVariations(), bucketValue);
  }

  async getPreSegmentationDecision(
    campaign: CampaignModel,
    context: ContextModel,
    serviceContainer: ServiceContainer,
  ): Promise<boolean> {
    // validate segmentation
    const campaignType = campaign.getType();
    let segments = {};

    if (campaignType === CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum.PERSONALIZE) {
      segments = campaign.getVariations()[0].getSegments();
    } else if (campaignType === CampaignTypeEnum.AB) {
      segments = campaign.getSegments();
    }
    if (isObject(segments) && !Object.keys(segments).length) {
      serviceContainer.getLogManager().info(
        buildMessage(InfoLogMessagesEnum.SEGMENTATION_SKIP, {
          userId: context.getId(),
          campaignKey:
            campaign.getType() === CampaignTypeEnum.AB
              ? campaign.getKey()
              : campaign.getName() + '_' + campaign.getRuleKey(),
        }),
      );

      return true;
    } else {
      const preSegmentationResult = await serviceContainer
        .getSegmentationManager()
        .validateSegmentation(segments, context.getCustomVariables());

      if (!preSegmentationResult) {
        serviceContainer.getLogManager().info(
          buildMessage(InfoLogMessagesEnum.SEGMENTATION_STATUS, {
            userId: context.getId(),
            campaignKey:
              campaign.getType() === CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
            status: 'failed',
          }),
        );

        return false;
      }

      serviceContainer.getLogManager().info(
        buildMessage(InfoLogMessagesEnum.SEGMENTATION_STATUS, {
          userId: context.getId(),
          campaignKey:
            campaign.getType() === CampaignTypeEnum.AB
              ? campaign.getKey()
              : campaign.getName() + '_' + campaign.getRuleKey(),
          status: 'passed',
        }),
      );

      return true;
    }
  }

  getVariationAlloted(
    userId: any,
    accountId: any,
    campaign: CampaignModel,
    serviceContainer: ServiceContainer,
  ): VariationModel {
    const isUserPart = this.isUserPartOfCampaign(userId, campaign, serviceContainer);
    if (campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
      if (isUserPart) {
        return campaign.getVariations()[0];
      } else {
        return null;
      }
    } else {
      if (isUserPart) {
        return this.bucketUserToVariation(userId, accountId, campaign, serviceContainer);
      } else {
        return null;
      }
    }
  }
}
