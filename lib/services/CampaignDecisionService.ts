import { DecisionMaker } from '../modules/decision-maker';
import { LogManager } from '../modules/logger';
import { SegmentationManager } from '../modules/segmentor';

import { VariationModel } from '../models/VariationModel';
// import { Campaign } from '../adapters/campaign';
import { Constants } from '../constants';

import { isObject } from '../utils/DataTypeUtil';

interface ICampaignDecisionService {
  isUserPartOfCampaign(campaign: any): boolean;
  getVariation(variations: Array<VariationModel>, bucketValue: number): VariationModel;
  checkInRange(variation: VariationModel, bucketValue: number): VariationModel;
  bucketUserToVariation(campaign: any): VariationModel;
  getDecision(campaign: any): VariationModel;
  getVariationAlloted(campaign: any): VariationModel;
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
  isUserPartOfCampaign(campaign: any): boolean {
    // if (!ValidateUtil.isValidValue(userId) || !campaign) {
    //   return false;
    // }

    if (!campaign || !campaign.getUser()) {
      return false;
    }

    const userId = campaign.getUser().userId;
    const trafficAllocation = campaign.getTraffic();
    const valueAssignedToUser = new DecisionMaker().getBucketValueForUser(`${userId}${campaign.getKey()}`);
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
  bucketUserToVariation(campaign: any): VariationModel {
    let multiplier;
    // if (!ValidateUtil.isValidValue(userId)) {
    //   return null;
    // }

    if (!campaign || !campaign.getUser()) {
      return null;
    }
    if (campaign.getTraffic()) {
      multiplier = Constants.MAX_TRAFFIC_VALUE / campaign.getTraffic() / 100;
    }
    const userId = campaign.getUser().userId;
    const hashValue = new DecisionMaker().generateHashValue(`${userId}${campaign.getKey()}`);
    const bucketValue = new DecisionMaker().generateBucketValue(hashValue, Constants.MAX_TRAFFIC_VALUE, multiplier);
    LogManager.Instance.debug(
      `user:${userId} for campaign:${campaign.getKey()} having percenttraffic:${campaign.getTraffic()} got bucketValue as ${bucketValue} and hashvalue:${hashValue}`
    );

    return this.getVariation(campaign.getVariations(), bucketValue);
  }

  getDecision(campaign: any): VariationModel {
    // validate segmentation
    if (isObject(campaign.getSegments()) && !Object.keys(campaign.getSegments()).length) {
      LogManager.Instance.debug(
        `For userId:${
          campaign.getUser().userId
        } of Campaign:${campaign.getKey()}, segment was missing, hence skipping segmentation`
      );
    } else {
      const preSegmentationResult = SegmentationManager.Instance.validateSegmentation(
        campaign.getSegments(),
        campaign.getUser().getProperties()
      );
      if (!preSegmentationResult) {
        LogManager.Instance.info(
          `Segmentation failed for userId:${campaign.getUser().userId} of Campaign:${campaign.getKey()}`
        );
        campaign.setDecision(null);
        return null;
      }
      LogManager.Instance.info(
        `Segmentation passed for userId:${campaign.getUser().userId} of Campaign:${campaign.getKey()}`
      );
    }

    const variation: VariationModel = this.getVariationAlloted(campaign);
    campaign.setDecision(variation);
    campaign.setWhitelistedStatus(false);
    return variation;
  }

  getVariationAlloted(campaign: any): VariationModel {
    if (this.isUserPartOfCampaign(campaign)) {
      return this.bucketUserToVariation(campaign) || null;
    } else {
      return null;
    }
  }
}
