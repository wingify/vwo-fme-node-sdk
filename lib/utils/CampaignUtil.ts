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
import { Constants } from '../constants';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { InfoLogMessagesEnum } from '../enums/log-messages';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { LogManager } from '../packages/logger';
import { buildMessage } from './LogMessageUtil';
import { RuleModel } from '../models/campaign/RuleModel';
/**
 * Sets the variation allocation for a given campaign based on its type.
 * If the campaign type is ROLLOUT or PERSONALIZE, it handles the campaign using `_handleRolloutCampaign`.
 * Otherwise, it assigns range values to each variation in the campaign.
 * @param {CampaignModel} campaign - The campaign for which to set the variation allocation.
 */
export function setVariationAllocation(campaign: CampaignModel): void {
  // Check if the campaign type is ROLLOUT or PERSONALIZE
  if (campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
    _handleRolloutCampaign(campaign);
  } else {
    let currentAllocation = 0;
    // Iterate over each variation in the campaign
    campaign.getVariations().forEach((variation) => {
      // Assign range values to the variation and update the current allocation
      const stepFactor = assignRangeValues(variation, currentAllocation);
      currentAllocation += stepFactor;
      // Log the range allocation for debugging
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.VARIATION_RANGE_ALLOCATION, {
          variationKey: variation.getKey(),
          campaignKey: campaign.getKey(),
          variationWeight: variation.getWeight(),
          startRange: variation.getStartRangeVariation(),
          endRange: variation.getEndRangeVariation(),
        }),
      );
    });
  }
}

/**
 * Assigns start and end range values to a variation based on its weight.
 * @param {VariationModel} data - The variation model to assign range values.
 * @param {number} currentAllocation - The current allocation value before this variation.
 * @returns {number} The step factor calculated from the variation's weight.
 */
export function assignRangeValues(data: VariationModel, currentAllocation: number) {
  // Calculate the bucket range based on the variation's weight
  const stepFactor: number = _getVariationBucketRange(data.getWeight());

  // Set the start and end range of the variation
  if (stepFactor) {
    data.setStartRange(currentAllocation + 1);
    data.setEndRange(currentAllocation + stepFactor);
  } else {
    data.setStartRange(-1);
    data.setEndRange(-1);
  }
  return stepFactor;
}

/**
 * Scales the weights of variations to sum up to 100%.
 * @param {any[]} variations - The list of variations to scale.
 */
export function scaleVariationWeights(variations: any) {
  // Calculate the total weight of all variations
  const totalWeight = variations.reduce((acc, variation) => {
    return acc + variation.weight;
  }, 0);
  // If total weight is zero, assign equal weight to each variation
  if (!totalWeight) {
    const equalWeight = 100 / variations.length;
    variations.forEach((variation) => (variation.weight = equalWeight));
  } else {
    // Scale each variation's weight to make the total 100%
    variations.forEach((variation) => (variation.weight = (variation.weight / totalWeight) * 100));
  }
}

/**
 * Generates a bucketing seed based on user ID, campaign, and optional group ID.
 * @param {string} userId - The user ID.
 * @param {any} campaign - The campaign object.
 * @param {string} [groupId] - The optional group ID.
 * @returns {string} The bucketing seed.
 */
export function getBucketingSeed(userId: string, campaign: CampaignModel, groupId: number) {
  // Return a seed combining group ID and user ID if group ID is provided
  if (groupId) {
    return `${groupId}_${userId}`;
  }
  const isRolloutOrPersonalize =
    campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE;
  // get salt
  const salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
  // get bucket key
  const bucketKey = salt ? `${salt}_${userId}` : `${campaign.getId()}_${userId}`;
  // Return a seed combining campaign ID and user ID otherwise
  return bucketKey;
}

/**
 * Retrieves a variation by its ID within a specific campaign identified by its key.
 * @param {SettingsModel} settings - The settings model containing all campaigns.
 * @param {string} campaignKey - The key of the campaign.
 * @param {string} variationId - The ID of the variation to retrieve.
 * @returns {VariationModel | null} The found variation model or null if not found.
 */
export function getVariationFromCampaignKey(settings: SettingsModel, campaignKey: string, variationId: number) {
  // Find the campaign by its key
  const campaign: CampaignModel = settings.getCampaigns().find((campaign: CampaignModel) => {
    return campaign.getKey() === campaignKey;
  });

  if (campaign) {
    // Find the variation by its ID within the found campaign
    const variation: VariationModel = campaign.getVariations().find((variation: VariationModel) => {
      return variation.getId() === variationId;
    });

    if (variation) {
      // Return a new instance of VariationModel based on the found variation
      return new VariationModel().modelFromDictionary(variation);
    }
  }
  return null;
}

/**
 * Sets the allocation ranges for a list of campaigns.
 * @param {CampaignModel[]} campaigns - The list of campaigns to set allocations for.
 */
export function setCampaignAllocation(campaigns: any[]) {
  let stepFactor = 0;
  for (let i = 0, currentAllocation = 0; i < campaigns.length; i++) {
    const campaign = campaigns[i];

    // Assign range values to each campaign and update the current allocation
    stepFactor = assignRangeValuesMEG(campaign, currentAllocation);
    currentAllocation += stepFactor;
  }
}

/**
 * Determines if a campaign is part of a group.
 * @param {SettingsModel} settings - The settings model containing group associations.
 * @param {string} campaignId - The ID of the campaign to check.
 * @param {any} [variationId=null] - The optional variation ID.
 * @returns {Object} An object containing the group ID and name if the campaign is part of a group, otherwise an empty object.
 */
export function getGroupDetailsIfCampaignPartOfIt(settings: SettingsModel, campaignId: any, variationId: any = null) {
  /**
   * If variationId is null, that means that campaign is testing campaign
   * If variationId is not null, that means that campaign is personalization campaign and we need to append variationId to campaignId using _
   * then check if the current campaign is part of any group
   */
  let campaignToCheck = campaignId.toString();
  // check if variationId is not null
  if (variationId !== null) {
    // if variationId is not null, then append it to the campaignId like campaignId_variationId
    campaignToCheck = `${campaignId}_${variationId}`.toString();
  }
  if (
    settings.getCampaignGroups() &&
    Object.prototype.hasOwnProperty.call(settings.getCampaignGroups(), campaignToCheck)
  ) {
    return {
      groupId: settings.getCampaignGroups()[campaignToCheck],
      groupName: settings.getGroups()[settings.getCampaignGroups()[campaignToCheck]].name,
    };
  }
  return {};
}

/**
 * Finds all groups associated with a feature specified by its key.
 * @param {SettingsModel} settings - The settings model containing all features and groups.
 * @param {string} featureKey - The key of the feature to find groups for.
 * @returns {Array} An array of groups associated with the feature.
 */
export function findGroupsFeaturePartOf(settings: SettingsModel, featureKey: string) {
  // Initialize an array to store all rules for the given feature to fetch campaignId and variationId later
  const ruleArray: Array<RuleModel> = [];
  // Loop over all rules inside the feature where the feature key matches and collect all rules
  settings.getFeatures().forEach((feature) => {
    if (feature.getKey() === featureKey) {
      feature.getRules().forEach((rule) => {
        if (ruleArray.indexOf(rule) === -1) {
          ruleArray.push(rule);
        }
      });
    }
  });

  // Loop over all campaigns and find the group for each campaign
  const groups: Array<any> = [];
  ruleArray.forEach((rule) => {
    const group = getGroupDetailsIfCampaignPartOfIt(
      settings,
      rule.getCampaignId(),
      rule.getType() === CampaignTypeEnum.PERSONALIZE ? rule.getVariationId() : null,
    );
    if (group.groupId) {
      // Check if the group is already added to the groups array to avoid duplicates
      const groupIndex = groups.findIndex((grp) => grp.groupId === group.groupId);
      if (groupIndex === -1) {
        groups.push(group);
      }
    }
  });
  return groups;
}

/**
 * Retrieves campaigns by a specific group ID.
 * @param {SettingsModel} settings - The settings model containing all groups.
 * @param {any} groupId - The ID of the group.
 * @returns {Array} An array of campaigns associated with the specified group ID.
 */
export function getCampaignsByGroupId(settings: SettingsModel, groupId: number) {
  const group = settings.getGroups()[groupId];
  if (group) {
    return group.campaigns; // Return the campaigns associated with the group
  } else {
    return []; // Return an empty array if the group ID is not found
  }
}

/**
 * Retrieves feature keys from a list of campaign IDs.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {any} campaignIdWithVariation - An array of campaign IDs and variation IDs in format campaignId_variationId.
 * @returns {Array} An array of feature keys associated with the provided campaign IDs.
 */
export function getFeatureKeysFromCampaignIds(settings: SettingsModel, campaignIdWithVariation: any) {
  const featureKeys = [];
  for (const campaign of campaignIdWithVariation) {
    // split key with _ to separate campaignId and variationId
    const [campaignId, variationId] = campaign.split('_').map(Number);
    settings.getFeatures().forEach((feature) => {
      // check if feature already exists in the featureKeys array
      if (featureKeys.indexOf(feature.getKey()) !== -1) {
        return;
      }
      feature.getRules().forEach((rule) => {
        if (rule.getCampaignId() === campaignId) {
          // Check if variationId is provided and matches the rule's variationId
          if (variationId !== undefined && variationId !== null) {
            // Add feature key if variationId matches
            if (rule.getVariationId() === variationId) {
              featureKeys.push(feature.getKey());
            }
          } else {
            // Add feature key if no variationId is provided
            featureKeys.push(feature.getKey());
          }
        }
      });
    });
  }
  return featureKeys;
}

/**
 * Retrieves campaign IDs from a specific feature key.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of campaign IDs associated with the specified feature key.
 */
export function getCampaignIdsFromFeatureKey(settings: SettingsModel, featureKey: string) {
  const campaignIds = [];
  settings.getFeatures().forEach((feature) => {
    if (feature.getKey() === featureKey) {
      feature.getRules().forEach((rule) => {
        campaignIds.push(rule.getCampaignId()); // Add campaign ID if feature key matches
      });
    }
  });
  return campaignIds;
}

/**
 * Assigns range values to a campaign based on its weight.
 * @param {any} data - The campaign data containing weight.
 * @param {number} currentAllocation - The current allocation value before this campaign.
 * @returns {number} The step factor calculated from the campaign's weight.
 */
export function assignRangeValuesMEG(data: any, currentAllocation: number) {
  const stepFactor: number = _getVariationBucketRange(data.weight);

  if (stepFactor) {
    data.startRangeVariation = currentAllocation + 1; // Set the start range
    data.endRangeVariation = currentAllocation + stepFactor; // Set the end range
  } else {
    data.startRangeVariation = -1; // Set invalid range if step factor is zero
    data.endRangeVariation = -1;
  }
  return stepFactor;
}

/**
 * Retrieves the rule type using a campaign ID from a specific feature.
 * @param {any} feature - The feature containing rules.
 * @param {number} campaignId - The campaign ID to find the rule type for.
 * @returns {string} The rule type if found, otherwise an empty string.
 */
export function getRuleTypeUsingCampaignIdFromFeature(feature: FeatureModel, campaignId: number) {
  const rule = feature.getRules().find((rule) => rule.getCampaignId() === campaignId);
  return rule ? rule.getType() : ''; // Return the rule type if found
}

/**
 * Calculates the bucket range for a variation based on its weight.
 * @param {number} variationWeight - The weight of the variation.
 * @returns {number} The calculated bucket range.
 */
function _getVariationBucketRange(variationWeight: number) {
  if (!variationWeight || variationWeight === 0) {
    return 0; // Return zero if weight is invalid or zero
  }

  const startRange = Math.ceil(variationWeight * 100);

  return Math.min(startRange, Constants.MAX_TRAFFIC_VALUE); // Ensure the range does not exceed the max traffic value
}

/**
 * Handles the rollout campaign by setting start and end ranges for all variations.
 * @param {CampaignModel} campaign - The campaign to handle.
 */
function _handleRolloutCampaign(campaign: CampaignModel): void {
  // Set start and end ranges for all variations in the campaign
  for (let i = 0; i < campaign.getVariations().length; i++) {
    const variation = campaign.getVariations()[i];
    const endRange = campaign.getVariations()[i].getWeight() * 100;

    variation.setStartRange(1);
    variation.setEndRange(endRange);

    LogManager.Instance.info(
      buildMessage(InfoLogMessagesEnum.VARIATION_RANGE_ALLOCATION, {
        variationKey: variation.getKey(),
        campaignKey: campaign.getKey(),
        variationWeight: variation.getWeight(),
        startRange: 1,
        endRange,
      }),
    );
  }
}
