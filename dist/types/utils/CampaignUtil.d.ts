import { CampaignModel } from '../models/campaign/CampaignModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { SettingsModel } from '../models/settings/SettingsModel';
/**
 * Sets the variation allocation for a given campaign based on its type.
 * If the campaign type is ROLLOUT or PERSONALIZE, it handles the campaign using `_handleRolloutCampaign`.
 * Otherwise, it assigns range values to each variation in the campaign.
 * @param {CampaignModel} campaign - The campaign for which to set the variation allocation.
 */
export declare function setVariationAllocation(campaign: CampaignModel): void;
/**
 * Assigns start and end range values to a variation based on its weight.
 * @param {VariationModel} data - The variation model to assign range values.
 * @param {number} currentAllocation - The current allocation value before this variation.
 * @returns {number} The step factor calculated from the variation's weight.
 */
export declare function assignRangeValues(data: VariationModel, currentAllocation: number): number;
/**
 * Scales the weights of variations to sum up to 100%.
 * @param {any[]} variations - The list of variations to scale.
 */
export declare function scaleVariationWeights(variations: any): void;
/**
 * Generates a bucketing seed based on user ID, campaign, and optional group ID.
 * @param {string} userId - The user ID.
 * @param {any} campaign - The campaign object.
 * @param {string} [groupId] - The optional group ID.
 * @returns {string} The bucketing seed.
 */
export declare function getBucketingSeed(userId: string, campaign: CampaignModel, groupId: number): string;
/**
 * Retrieves a variation by its ID within a specific campaign identified by its key.
 * @param {SettingsModel} settings - The settings model containing all campaigns.
 * @param {string} campaignKey - The key of the campaign.
 * @param {string} variationId - The ID of the variation to retrieve.
 * @returns {VariationModel | null} The found variation model or null if not found.
 */
export declare function getVariationFromCampaignKey(settings: SettingsModel, campaignKey: string, variationId: number): VariationModel;
/**
 * Sets the allocation ranges for a list of campaigns.
 * @param {CampaignModel[]} campaigns - The list of campaigns to set allocations for.
 */
export declare function setCampaignAllocation(campaigns: any[]): void;
/**
 * Determines if a campaign is part of a group.
 * @param {SettingsModel} settings - The settings model containing group associations.
 * @param {string} campaignId - The ID of the campaign to check.
 * @param {any} [variationId=null] - The optional variation ID.
 * @returns {Object} An object containing the group ID and name if the campaign is part of a group, otherwise an empty object.
 */
export declare function getGroupDetailsIfCampaignPartOfIt(settings: SettingsModel, campaignId: any, variationId?: any): {
    groupId: number;
    groupName: any;
} | {
    groupId?: undefined;
    groupName?: undefined;
};
/**
 * Retrieves campaigns by a specific group ID.
 * @param {SettingsModel} settings - The settings model containing all groups.
 * @param {any} groupId - The ID of the group.
 * @returns {Array} An array of campaigns associated with the specified group ID.
 */
export declare function getCampaignsByGroupId(settings: SettingsModel, groupId: number): any;
/**
 * Retrieves feature keys from a list of campaign IDs.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {any} campaignIdWithVariation - An array of campaign IDs and variation IDs in format campaignId_variationId.
 * @returns {Array} An array of feature keys associated with the provided campaign IDs.
 */
export declare function getFeatureKeysFromCampaignIds(settings: SettingsModel, campaignIdWithVariation: any): any[];
/**
 * Retrieves campaign IDs from a specific feature key.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of campaign IDs associated with the specified feature key.
 */
export declare function getCampaignIdsFromFeatureKey(settings: SettingsModel, featureKey: string): any[];
/**
 * Assigns range values to a campaign based on its weight.
 * @param {any} data - The campaign data containing weight.
 * @param {number} currentAllocation - The current allocation value before this campaign.
 * @returns {number} The step factor calculated from the campaign's weight.
 */
export declare function assignRangeValuesMEG(data: any, currentAllocation: number): number;
