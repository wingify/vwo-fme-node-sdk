import { DecisionMaker } from '../modules/decision-maker';
import { LogManager } from '../modules/logger';
import { SegmentationManager } from '../modules/segmentor';

import { VariationModel } from '../models/VariationModel';
// import { Campaign } from '../adapters/campaign';
import { Constants } from '../constants';

import { isObject } from '../utils/DataTypeUtil';
import { CampaignModel } from '../models/CampaignModel';
import { CampaignTypeEnum } from '../enums/campaignTypeEnum';

interface ICampaignDecisionService {
  isUserPartOfCampaign(userId: any, campaign: CampaignModel): boolean;
  getVariation(variations: Array<VariationModel>, bucketValue: number): VariationModel;
  checkInRange(variation: VariationModel, bucketValue: number): VariationModel;
  bucketUserToVariation(userId: any, accountId: any, campaign: CampaignModel): VariationModel;
  getDecision(campaign: CampaignModel, dsl: any, properties: any): VariationModel;
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
    if (campaign.getType() === CampaignTypeEnum.ROLLOUT) {
      trafficAllocation = campaign.getVariations()[0].getWeight();
    } else {
      trafficAllocation = campaign.getTraffic();
    }
    const valueAssignedToUser = new DecisionMaker().getBucketValueForUser(`${campaign.getId()}_${userId}`);
    const isUserPart = valueAssignedToUser !== 0 && valueAssignedToUser <= trafficAllocation;

    LogManager.Instance.debug(`user:${userId} part of campaign? ${isUserPart}`);

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
    if (campaign.getTraffic() || campaign.getVariations()[0].getWeight()) {
      multiplier = 1;
    }
    const percentTraffic = campaign.getTraffic() || campaign.getVariations()[0].getWeight();
    const hashValue = new DecisionMaker().generateHashValue(`${campaign.getId()}_${accountId}_${userId}`);
    const bucketValue = new DecisionMaker().generateBucketValue(hashValue, Constants.MAX_TRAFFIC_VALUE, multiplier);
    LogManager.Instance.debug(
      `user:${userId} for campaign:${campaign.getKey()} having percenttraffic:${percentTraffic} got bucketValue as ${bucketValue} and hashvalue:${hashValue}`
    );

    return this.getVariation(campaign.getVariations(), bucketValue);
  }

  getDecision(campaign: CampaignModel, userId: any, customVariables: any): any {
    // validate segmentation
    if (isObject(campaign.getSegments()) && !Object.keys(campaign.getSegments()).length) {
      LogManager.Instance.debug(
        `For userId:${
          userId
        } of Campaign:${campaign.getKey()}, segment was missing, hence skipping segmentation`
      );
      return true;
    } else {
      const preSegmentationResult = SegmentationManager.Instance.validateSegmentation(
        campaign.getSegments(),
        customVariables
      );
      if (!preSegmentationResult) {
        LogManager.Instance.info(
          `Segmentation failed for userId:${userId} of Campaign:${campaign.getKey()}`
        );
        return false;
      }
      LogManager.Instance.info(
        `Segmentation passed for userId:${userId} of Campaign:${campaign.getKey()}`
      );
      return true;
    }
  }

  getVariationAlloted(userId: any, accountId: any, campaign: CampaignModel): VariationModel {
    if (this.isUserPartOfCampaign(userId, campaign)) {
      return this.bucketUserToVariation(userId, accountId, campaign) || null;
    } else {
      return null;
    }
  }
}
