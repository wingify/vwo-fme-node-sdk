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
import { DecisionMaker } from '../packages/decision-maker';
import { LogManager } from '../packages/logger';
import { SegmentationManager } from '../packages/segmentation-evaluator';

import { VariationModel } from '../models/campaign/VariationModel';
import { Constants } from '../constants';

import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { isObject } from '../utils/DataTypeUtil';
import { ContextModel } from '../models/user/ContextModel';

interface ICampaignDecisionService {
  isUserPartOfCampaign(userId: any, campaign: CampaignModel): boolean;
  getVariation(variations: Array<VariationModel>, bucketValue: number): VariationModel;
  checkInRange(variation: VariationModel, bucketValue: number): VariationModel;
  bucketUserToVariation(userId: any, accountId: any, campaign: CampaignModel): VariationModel;
  getPreSegmentationDecision(campaign: CampaignModel, context: ContextModel): Promise<any>;
  getVariationAlloted(userId: any, accountId: any, campaign: CampaignModel): VariationModel;
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
  isUserPartOfCampaign(userId: any, campaign: CampaignModel): boolean {
    // if (!ValidateUtil.isValidValue(userId) || !campaign) {
    //   return false;
    // }

    if (!campaign || !userId) {
      return false;
    }
    let trafficAllocation;
    if (campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
      trafficAllocation = campaign.getVariations()[0].getWeight();
    } else {
      trafficAllocation = campaign.getTraffic();
    }
    const valueAssignedToUser = new DecisionMaker().getBucketValueForUser(`${campaign.getId()}_${userId}`);
    const isUserPart = valueAssignedToUser !== 0 && valueAssignedToUser <= trafficAllocation;

    LogManager.Instance.debug(`user:${userId} part of campaign ${campaign.getKey()} ? ${isUserPart}`);

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
  bucketUserToVariation(userId: any, accountId: any, campaign: CampaignModel): VariationModel {
    let multiplier;
    // if (!ValidateUtil.isValidValue(userId)) {
    //   return null;
    // }

    if (!campaign || !userId) {
      return null;
    }
    if (campaign.getTraffic()) {
      multiplier = 1;
    }
    const percentTraffic = campaign.getTraffic();
    const hashValue = new DecisionMaker().generateHashValue(`${campaign.getId()}_${accountId}_${userId}`);
    const bucketValue = new DecisionMaker().generateBucketValue(hashValue, Constants.MAX_TRAFFIC_VALUE, multiplier);
    LogManager.Instance.debug(
      `user:${userId} for campaign:${campaign.getKey()} having percenttraffic:${percentTraffic} got bucketValue as ${bucketValue} and hashvalue:${hashValue}`,
    );

    return this.getVariation(campaign.getVariations(), bucketValue);
  }

  async getPreSegmentationDecision(campaign: CampaignModel, context: ContextModel): Promise<boolean> {
    // validate segmentation
    const campaignType = campaign.getType();
    let segments = {};

    if (campaignType === CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum.PERSONALIZE) {
      segments = campaign.getVariations()[0].getSegments();
    } else if (campaignType === CampaignTypeEnum.AB) {
      segments = campaign.getSegments();
    }
    if (isObject(segments) && !Object.keys(segments).length) {
      LogManager.Instance.debug(
        `For userId:${
          context.getId()
        } of Campaign:${campaign.getKey()}, segments was missing. Hence, skipping segmentation`
      );

      return true;
    } else {
      const preSegmentationResult = await SegmentationManager.Instance.validateSegmentation(
        segments,
        context.getCustomVariables()
      );

      if (!preSegmentationResult) {
        LogManager.Instance.info(`Segmentation failed for userId:${context.getId()} of Campaign:${campaign.getKey()}`);
        return false;
      }
      LogManager.Instance.info(`Segmentation passed for userId:${context.getId()} of Campaign:${campaign.getKey()}`);
      return true;
    }
  }

  getVariationAlloted(userId: any, accountId: any, campaign: CampaignModel): VariationModel {
    const isUserPart = this.isUserPartOfCampaign(userId, campaign);
    if (campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
      if (isUserPart) {
        return campaign.getVariations()[0];
      } else {
        return null;
      }
    } else {
      if (isUserPart) {
        return this.bucketUserToVariation(userId, accountId, campaign);
      } else {
        return null;
      }
    }
  }
}
