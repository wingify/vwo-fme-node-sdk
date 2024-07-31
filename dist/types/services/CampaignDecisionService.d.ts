import { VariationModel } from '../models/campaign/VariationModel';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { ContextModel } from '../models/user/ContextModel';
interface ICampaignDecisionService {
  isUserPartOfCampaign(userId: any, campaign: CampaignModel): boolean;
  getVariation(variations: Array<VariationModel>, bucketValue: number): VariationModel;
  checkInRange(variation: VariationModel, bucketValue: number): VariationModel;
  bucketUserToVariation(userId: any, accountId: any, campaign: CampaignModel): VariationModel;
  getPreSegmentationDecision(campaign: CampaignModel, context: ContextModel): Promise<any>;
  getVariationAlloted(userId: any, accountId: any, campaign: CampaignModel): VariationModel;
}
export declare class CampaignDecisionService implements ICampaignDecisionService {
  /**
   * Calculate if this user should become part of the campaign or not
   *
   * @param {String} userId the unique ID assigned to a user
   * @param {Object} campaign fot getting the value of traffic allotted to the campaign
   *
   * @return {Boolean} if User is a part of Campaign or not
   */
  isUserPartOfCampaign(userId: any, campaign: CampaignModel): boolean;
  /**
   * Returns the Variation by checking the Start and End Bucket Allocations of each Variation
   *
   * @param {Object} campaign which contains the variations
   * @param {Number} bucketValue the bucket Value of the user
   *
   * @return {Object|null} variation data allotted to the user or null if not
   */
  getVariation(variations: Array<VariationModel>, bucketValue: number): VariationModel;
  checkInRange(variation: VariationModel, bucketValue: number): VariationModel;
  /**
   * Validates the User ID and generates Variation into which the User is bucketed in.
   *
   * @param {String} userId the unique ID assigned to User
   * @param {Object} campaign the Campaign of which User is a part of
   *
   * @return {Object|null} variation data into which user is bucketed in or null if not
   */
  bucketUserToVariation(userId: any, accountId: any, campaign: CampaignModel): VariationModel;
  getPreSegmentationDecision(campaign: CampaignModel, context: ContextModel): Promise<boolean>;
  getVariationAlloted(userId: any, accountId: any, campaign: CampaignModel): VariationModel;
}
export {};
