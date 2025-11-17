"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneObject = cloneObject;
exports.getCurrentTime = getCurrentTime;
exports.getCurrentUnixTimestamp = getCurrentUnixTimestamp;
exports.getCurrentUnixTimestampInMillis = getCurrentUnixTimestampInMillis;
exports.getRandomNumber = getRandomNumber;
exports.getSpecificRulesBasedOnType = getSpecificRulesBasedOnType;
exports.getAllExperimentRules = getAllExperimentRules;
exports.getFeatureFromKey = getFeatureFromKey;
exports.doesEventBelongToAnyFeature = doesEventBelongToAnyFeature;
exports.addLinkedCampaignsToSettings = addLinkedCampaignsToSettings;
exports.getFormattedErrorMessage = getFormattedErrorMessage;
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
const CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
const CampaignModel_1 = require("../models/campaign/CampaignModel");
const DataTypeUtil_1 = require("./DataTypeUtil");
/**
 * Clones an object deeply.
 * @param {dynamic} obj - The object to clone.
 * @returns {any} The cloned object.
 */
function cloneObject(obj) {
    if (!obj) {
        // Return the original object if it is null or undefined
        return obj;
    }
    // Use JSON stringify and parse method to perform a deep clone
    const clonedObj = JSON.parse(JSON.stringify(obj));
    return clonedObj;
}
/**
 * Gets the current time in ISO string format.
 * @returns {string} The current time in ISO string format.
 */
function getCurrentTime() {
    return new Date().toISOString();
}
/**
 * Gets the current Unix timestamp in seconds.
 * @returns {number} The current Unix timestamp.
 */
function getCurrentUnixTimestamp() {
    // Convert the current date to Unix timestamp in seconds
    return Math.ceil(+new Date() / 1000);
}
/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns {number} The current Unix timestamp in milliseconds.
 */
function getCurrentUnixTimestampInMillis() {
    // Convert the current date to Unix timestamp in milliseconds
    return +new Date();
}
/**
 * Generates a random number between 0 and 1.
 * @returns {number} A random number.
 */
function getRandomNumber() {
    // Use Math.random to generate a random number
    return Math.random();
}
/**
 * Retrieves specific rules based on the type from a feature.
 * @param {FeatureModel} feature - The key of the feature.
 * @param {CampaignTypeEnum | null} type - The type of the rules to retrieve.
 * @returns {Array} An array of rules that match the type.
 */
function getSpecificRulesBasedOnType(feature, type = null) {
    // Return an empty array if no linked campaigns are found
    if (feature && !feature?.getRulesLinkedCampaign()) {
        return [];
    }
    // Filter the rules by type if a type is specified and is a string
    if (feature && feature.getRulesLinkedCampaign() && type && (0, DataTypeUtil_1.isString)(type)) {
        return feature.getRulesLinkedCampaign().filter((rule) => {
            const ruleModel = new CampaignModel_1.CampaignModel().modelFromDictionary(rule);
            return ruleModel.getType() === type;
        });
    }
    // Return all linked campaigns if no type is specified
    return feature.getRulesLinkedCampaign();
}
/**
 * Retrieves all AB and Personalize rules from a feature.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of AB and Personalize rules.
 */
function getAllExperimentRules(feature) {
    // Retrieve the feature by its key
    // Filter the rules to include only AB and Personalize types
    return (feature
        ?.getRulesLinkedCampaign()
        .filter((rule) => rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB || rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) || []);
}
/**
 * Retrieves a feature by its key from the settings.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {any} The feature if found, otherwise undefined.
 */
function getFeatureFromKey(settings, featureKey) {
    // Find the feature by its key
    return settings?.getFeatures()?.find((feature) => feature.getKey() === featureKey);
}
/**
 * Checks if an event exists within any feature's metrics.
 * @param {string} eventName - The name of the event to check.
 * @param {any} settings - The settings containing features.
 * @returns {boolean} True if the event exists, otherwise false.
 */
function doesEventBelongToAnyFeature(eventName, settings) {
    // Use the `some` method to check if any feature contains the event in its metrics
    return settings
        .getFeatures()
        .some((feature) => feature.getMetrics().some((metric) => metric.getIdentifier() === eventName));
}
/**
 * Adds linked campaigns to each feature in the settings based on rules.
 * @param {any} settings - The settings file to modify.
 */
function addLinkedCampaignsToSettings(settings) {
    // Create maps for quick access to campaigns and variations
    const campaignMap = new Map(settings.getCampaigns().map((campaign) => [campaign.getId(), campaign]));
    // Loop over all features
    for (const feature of settings.getFeatures()) {
        const rulesLinkedCampaign = feature
            .getRules()
            .map((rule) => {
            const campaign = campaignMap.get(rule.getCampaignId());
            if (!campaign)
                return null;
            // Create a linked campaign object with the rule and campaign
            const linkedCampaign = { key: campaign.getKey(), ...campaign, ruleKey: rule.getRuleKey() };
            // If a variationId is specified, find and add the variation
            if (rule.getVariationId()) {
                const variation = campaign.getVariations().find((v) => v.getId() === rule.getVariationId());
                if (variation) {
                    linkedCampaign.variations = [variation];
                }
            }
            return linkedCampaign;
        })
            .filter((campaign) => campaign !== null); // Filter out any null entries
        const rulesLinkedCampaignModel = rulesLinkedCampaign.map((campaign) => {
            const campaignModel = new CampaignModel_1.CampaignModel();
            campaignModel.modelFromDictionary(campaign);
            return campaignModel;
        });
        // Assign the linked campaigns to the feature
        feature.setRulesLinkedCampaign(rulesLinkedCampaignModel);
    }
}
/**
 * Formats an error message.
 * @param {any} error - The error to format.
 * @returns {string} The formatted error message.
 */
function getFormattedErrorMessage(error) {
    let errorMessage = '';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    else if (typeof error === 'string') {
        errorMessage = error;
    }
    else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
    }
    return errorMessage;
}
//# sourceMappingURL=FunctionUtil.js.map