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
import { CampaignModel } from '../models/CampaignModel';
import { SettingsModel } from '../models/SettingsModel';
// import { VariableModel } from '../models/VariableModel';
import { VariationModel } from '../models/VariationModel';
import { LogManager } from '../modules/logger';

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
    campaign.getVariations().forEach(variation => {
      // Assign range values to the variation and update the current allocation
      const stepFactor = assignRangeValues(variation, currentAllocation);
      currentAllocation += stepFactor;
      // Log the range allocation for debugging
      LogManager.Instance.debug(
        `VARIATION_RANGE_ALLOCATION: Variation:${variation.getKey()} of Campaign:${campaign.getKey()} having weight:${variation.getWeight()} got bucketing range: (${variation.getStartRangeVariation()} - ${variation.getEndRangeVariation()})`,
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
export function getBucketingSeed(userId, campaign, groupId) {
  // Return a seed combining group ID and user ID if group ID is provided
  if (groupId) {
    return `${groupId}_${userId}`;
  }
  // Return a seed combining campaign ID and user ID otherwise
  return `${campaign.id}_${userId}`;
}

/**
 * Retrieves a variation by its ID within a specific campaign identified by its key.
 * @param {SettingsModel} settings - The settings model containing all campaigns.
 * @param {string} campaignKey - The key of the campaign.
 * @param {string} variationId - The ID of the variation to retrieve.
 * @returns {VariationModel | null} The found variation model or null if not found.
 */
export function getVariationByCampaignKey(settings, campaignKey, variationId) {
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
 * @returns {Object} An object containing the group ID and name if the campaign is part of a group, otherwise an empty object.
 */
export function isPartOfGroup(settings: any, campaignId: any) {
  // Check if the campaign is associated with a group and return the group details
  if (settings.campaignGroups && settings.campaignGroups.hasOwnProperty(campaignId)) {
    return {
      groupId: settings.campaignGroups[campaignId],
      groupName: settings.groups[settings.campaignGroups[campaignId]].name,
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
export function findGroupsFeaturePartOf(settings: any, featureKey: string) {
  const campaignIds: Array<number> = [];
  // Loop over all rules inside the feature where the feature key matches and collect all campaign IDs
  settings.features.forEach((feature) => {
    if (feature.key === featureKey) {
      feature.rules.forEach((rule) => {
        if (campaignIds.indexOf(rule.campaignId) === -1) {
          campaignIds.push(rule.campaignId);
        }
      });
    }
  });

  // Loop over all campaigns and find the group for each campaign
  const groups: Array<any> = [];
  campaignIds.forEach((campaignId) => {
    const group = isPartOfGroup(settings, campaignId);
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
export function getCampaignsByGroupId(settings: SettingsModel, groupId: any) {
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
 * @param {any} campaignIds - An array of campaign IDs.
 * @returns {Array} An array of feature keys associated with the provided campaign IDs.
 */
export function getFeatureKeysFromCampaignIds(settings: SettingsModel, campaignIds: any) {
  const featureKeys = [];
  for (const campaignId of campaignIds) {
    settings.getFeatures().forEach((feature) => {
      feature.getRules().forEach((rule) => {
        if (rule.getCampaignId() === campaignId) {
          featureKeys.push(feature.getKey()); // Add feature key if campaign ID matches
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
export function getRuleTypeUsingCampaignIdFromFeature(feature: any, campaignId: number) {
  const rule = feature.rules.find((rule) => rule.campaignId === campaignId);
  return rule ? rule.type : ''; // Return the rule type if found
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
    LogManager.Instance.debug(
      `VARIATION_RANGE_ALLOCATION: Variation:${variation.getKey()} of Campaign:${campaign.getKey()} got bucketing range: ( ${1} - ${endRange} )`,
    );
  }
}

/* function copyVariableData(variationVariable: Array<VariableModel>, featureVariable: Array<VariableModel>): void {
  // create a featureVariableMap
  const featureVariableMap: Record<number, VariableModel> = {};
  featureVariable.forEach((variable: VariableModel) => {
    featureVariableMap[variable.getId()] = variable;
  });
  variationVariable.forEach((variable: VariableModel) => {
    const featureVariable: VariableModel = featureVariableMap[variable.getId()];
    if (featureVariable) {
      variable.setKey(featureVariable.getKey());
      variable.setType(featureVariable.getType());
    }
  });
} */
