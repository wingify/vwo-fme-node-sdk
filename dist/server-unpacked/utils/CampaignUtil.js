"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVariationAllocation = setVariationAllocation;
exports.assignRangeValues = assignRangeValues;
exports.scaleVariationWeights = scaleVariationWeights;
exports.getBucketingSeed = getBucketingSeed;
exports.getVariationFromCampaignKey = getVariationFromCampaignKey;
exports.setCampaignAllocation = setCampaignAllocation;
exports.getGroupDetailsIfCampaignPartOfIt = getGroupDetailsIfCampaignPartOfIt;
exports.findGroupsFeaturePartOf = findGroupsFeaturePartOf;
exports.getCampaignsByGroupId = getCampaignsByGroupId;
exports.getFeatureKeysFromCampaignIds = getFeatureKeysFromCampaignIds;
exports.getCampaignIdsFromFeatureKey = getCampaignIdsFromFeatureKey;
exports.assignRangeValuesMEG = assignRangeValuesMEG;
exports.getRuleTypeUsingCampaignIdFromFeature = getRuleTypeUsingCampaignIdFromFeature;
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
var constants_1 = require("../constants");
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var log_messages_1 = require("../enums/log-messages");
var VariationModel_1 = require("../models/campaign/VariationModel");
var logger_1 = require("../packages/logger");
var LogMessageUtil_1 = require("./LogMessageUtil");
/**
 * Sets the variation allocation for a given campaign based on its type.
 * If the campaign type is ROLLOUT or PERSONALIZE, it handles the campaign using `_handleRolloutCampaign`.
 * Otherwise, it assigns range values to each variation in the campaign.
 * @param {CampaignModel} campaign - The campaign for which to set the variation allocation.
 */
function setVariationAllocation(campaign) {
    // Check if the campaign type is ROLLOUT or PERSONALIZE
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
        _handleRolloutCampaign(campaign);
    }
    else {
        var currentAllocation_1 = 0;
        // Iterate over each variation in the campaign
        campaign.getVariations().forEach(function (variation) {
            // Assign range values to the variation and update the current allocation
            var stepFactor = assignRangeValues(variation, currentAllocation_1);
            currentAllocation_1 += stepFactor;
            // Log the range allocation for debugging
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.VARIATION_RANGE_ALLOCATION, {
                variationKey: variation.getKey(),
                campaignKey: campaign.getKey(),
                variationWeight: variation.getWeight(),
                startRange: variation.getStartRangeVariation(),
                endRange: variation.getEndRangeVariation(),
            }));
        });
    }
}
/**
 * Assigns start and end range values to a variation based on its weight.
 * @param {VariationModel} data - The variation model to assign range values.
 * @param {number} currentAllocation - The current allocation value before this variation.
 * @returns {number} The step factor calculated from the variation's weight.
 */
function assignRangeValues(data, currentAllocation) {
    // Calculate the bucket range based on the variation's weight
    var stepFactor = _getVariationBucketRange(data.getWeight());
    // Set the start and end range of the variation
    if (stepFactor) {
        data.setStartRange(currentAllocation + 1);
        data.setEndRange(currentAllocation + stepFactor);
    }
    else {
        data.setStartRange(-1);
        data.setEndRange(-1);
    }
    return stepFactor;
}
/**
 * Scales the weights of variations to sum up to 100%.
 * @param {any[]} variations - The list of variations to scale.
 */
function scaleVariationWeights(variations) {
    // Calculate the total weight of all variations
    var totalWeight = variations.reduce(function (acc, variation) {
        return acc + variation.weight;
    }, 0);
    // If total weight is zero, assign equal weight to each variation
    if (!totalWeight) {
        var equalWeight_1 = 100 / variations.length;
        variations.forEach(function (variation) { return (variation.weight = equalWeight_1); });
    }
    else {
        // Scale each variation's weight to make the total 100%
        variations.forEach(function (variation) { return (variation.weight = (variation.weight / totalWeight) * 100); });
    }
}
/**
 * Generates a bucketing seed based on user ID, campaign, and optional group ID.
 * @param {string} userId - The user ID.
 * @param {any} campaign - The campaign object.
 * @param {string} [groupId] - The optional group ID.
 * @returns {string} The bucketing seed.
 */
function getBucketingSeed(userId, campaign, groupId) {
    // Return a seed combining group ID and user ID if group ID is provided
    if (groupId) {
        return "".concat(groupId, "_").concat(userId);
    }
    var isRolloutOrPersonalize = campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
    // get salt
    var salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
    // get bucket key
    var bucketKey = salt ? "".concat(salt, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(userId);
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
function getVariationFromCampaignKey(settings, campaignKey, variationId) {
    // Find the campaign by its key
    var campaign = settings.getCampaigns().find(function (campaign) {
        return campaign.getKey() === campaignKey;
    });
    if (campaign) {
        // Find the variation by its ID within the found campaign
        var variation = campaign.getVariations().find(function (variation) {
            return variation.getId() === variationId;
        });
        if (variation) {
            // Return a new instance of VariationModel based on the found variation
            return new VariationModel_1.VariationModel().modelFromDictionary(variation);
        }
    }
    return null;
}
/**
 * Sets the allocation ranges for a list of campaigns.
 * @param {CampaignModel[]} campaigns - The list of campaigns to set allocations for.
 */
function setCampaignAllocation(campaigns) {
    var stepFactor = 0;
    for (var i = 0, currentAllocation = 0; i < campaigns.length; i++) {
        var campaign = campaigns[i];
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
function getGroupDetailsIfCampaignPartOfIt(settings, campaignId, variationId) {
    if (variationId === void 0) { variationId = null; }
    /**
     * If variationId is null, that means that campaign is testing campaign
     * If variationId is not null, that means that campaign is personalization campaign and we need to append variationId to campaignId using _
     * then check if the current campaign is part of any group
     */
    var campaignToCheck = campaignId.toString();
    // check if variationId is not null
    if (variationId !== null) {
        // if variationId is not null, then append it to the campaignId like campaignId_variationId
        campaignToCheck = "".concat(campaignId, "_").concat(variationId).toString();
    }
    if (settings.getCampaignGroups() &&
        Object.prototype.hasOwnProperty.call(settings.getCampaignGroups(), campaignToCheck)) {
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
function findGroupsFeaturePartOf(settings, featureKey) {
    // Initialize an array to store all rules for the given feature to fetch campaignId and variationId later
    var ruleArray = [];
    // Loop over all rules inside the feature where the feature key matches and collect all rules
    settings.getFeatures().forEach(function (feature) {
        if (feature.getKey() === featureKey) {
            feature.getRules().forEach(function (rule) {
                if (ruleArray.indexOf(rule) === -1) {
                    ruleArray.push(rule);
                }
            });
        }
    });
    // Loop over all campaigns and find the group for each campaign
    var groups = [];
    ruleArray.forEach(function (rule) {
        var group = getGroupDetailsIfCampaignPartOfIt(settings, rule.getCampaignId(), rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? rule.getVariationId() : null);
        if (group.groupId) {
            // Check if the group is already added to the groups array to avoid duplicates
            var groupIndex = groups.findIndex(function (grp) { return grp.groupId === group.groupId; });
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
function getCampaignsByGroupId(settings, groupId) {
    var group = settings.getGroups()[groupId];
    if (group) {
        return group.campaigns; // Return the campaigns associated with the group
    }
    else {
        return []; // Return an empty array if the group ID is not found
    }
}
/**
 * Retrieves feature keys from a list of campaign IDs.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {any} campaignIdWithVariation - An array of campaign IDs and variation IDs in format campaignId_variationId.
 * @returns {Array} An array of feature keys associated with the provided campaign IDs.
 */
function getFeatureKeysFromCampaignIds(settings, campaignIdWithVariation) {
    var featureKeys = [];
    var _loop_1 = function (campaign) {
        // split key with _ to separate campaignId and variationId
        var _a = campaign.split('_').map(Number), campaignId = _a[0], variationId = _a[1];
        settings.getFeatures().forEach(function (feature) {
            // check if feature already exists in the featureKeys array
            if (featureKeys.indexOf(feature.getKey()) !== -1) {
                return;
            }
            feature.getRules().forEach(function (rule) {
                if (rule.getCampaignId() === campaignId) {
                    // Check if variationId is provided and matches the rule's variationId
                    if (variationId !== undefined && variationId !== null) {
                        // Add feature key if variationId matches
                        if (rule.getVariationId() === variationId) {
                            featureKeys.push(feature.getKey());
                        }
                    }
                    else {
                        // Add feature key if no variationId is provided
                        featureKeys.push(feature.getKey());
                    }
                }
            });
        });
    };
    for (var _i = 0, campaignIdWithVariation_1 = campaignIdWithVariation; _i < campaignIdWithVariation_1.length; _i++) {
        var campaign = campaignIdWithVariation_1[_i];
        _loop_1(campaign);
    }
    return featureKeys;
}
/**
 * Retrieves campaign IDs from a specific feature key.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of campaign IDs associated with the specified feature key.
 */
function getCampaignIdsFromFeatureKey(settings, featureKey) {
    var campaignIds = [];
    settings.getFeatures().forEach(function (feature) {
        if (feature.getKey() === featureKey) {
            feature.getRules().forEach(function (rule) {
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
function assignRangeValuesMEG(data, currentAllocation) {
    var stepFactor = _getVariationBucketRange(data.weight);
    if (stepFactor) {
        data.startRangeVariation = currentAllocation + 1; // Set the start range
        data.endRangeVariation = currentAllocation + stepFactor; // Set the end range
    }
    else {
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
function getRuleTypeUsingCampaignIdFromFeature(feature, campaignId) {
    var rule = feature.getRules().find(function (rule) { return rule.getCampaignId() === campaignId; });
    return rule ? rule.getType() : ''; // Return the rule type if found
}
/**
 * Calculates the bucket range for a variation based on its weight.
 * @param {number} variationWeight - The weight of the variation.
 * @returns {number} The calculated bucket range.
 */
function _getVariationBucketRange(variationWeight) {
    if (!variationWeight || variationWeight === 0) {
        return 0; // Return zero if weight is invalid or zero
    }
    var startRange = Math.ceil(variationWeight * 100);
    return Math.min(startRange, constants_1.Constants.MAX_TRAFFIC_VALUE); // Ensure the range does not exceed the max traffic value
}
/**
 * Handles the rollout campaign by setting start and end ranges for all variations.
 * @param {CampaignModel} campaign - The campaign to handle.
 */
function _handleRolloutCampaign(campaign) {
    // Set start and end ranges for all variations in the campaign
    for (var i = 0; i < campaign.getVariations().length; i++) {
        var variation = campaign.getVariations()[i];
        var endRange = campaign.getVariations()[i].getWeight() * 100;
        variation.setStartRange(1);
        variation.setEndRange(endRange);
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.VARIATION_RANGE_ALLOCATION, {
            variationKey: variation.getKey(),
            campaignKey: campaign.getKey(),
            variationWeight: variation.getWeight(),
            startRange: 1,
            endRange: endRange,
        }));
    }
}
//# sourceMappingURL=CampaignUtil.js.map