"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLinkedCampaignsToSettings = exports.doesEventBelongToAnyFeature = exports.getFeatureFromKey = exports.getAllExperimentRules = exports.getSpecificRulesBasedOnType = exports.getRandomNumber = exports.getCurrentUnixTimestampInMillis = exports.getCurrentUnixTimestamp = exports.getCurrentTime = exports.cloneObject = void 0;
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
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var CampaignModel_1 = require("../models/campaign/CampaignModel");
var DataTypeUtil_1 = require("./DataTypeUtil");
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
    var clonedObj = JSON.parse(JSON.stringify(obj));
    return clonedObj;
}
exports.cloneObject = cloneObject;
/**
 * Gets the current time in ISO string format.
 * @returns {string} The current time in ISO string format.
 */
function getCurrentTime() {
    return new Date().toISOString();
}
exports.getCurrentTime = getCurrentTime;
/**
 * Gets the current Unix timestamp in seconds.
 * @returns {number} The current Unix timestamp.
 */
function getCurrentUnixTimestamp() {
    // Convert the current date to Unix timestamp in seconds
    return Math.ceil(+new Date() / 1000);
}
exports.getCurrentUnixTimestamp = getCurrentUnixTimestamp;
/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns {number} The current Unix timestamp in milliseconds.
 */
function getCurrentUnixTimestampInMillis() {
    // Convert the current date to Unix timestamp in milliseconds
    return +new Date();
}
exports.getCurrentUnixTimestampInMillis = getCurrentUnixTimestampInMillis;
/**
 * Generates a random number between 0 and 1.
 * @returns {number} A random number.
 */
function getRandomNumber() {
    // Use Math.random to generate a random number
    return Math.random();
}
exports.getRandomNumber = getRandomNumber;
/**
 * Retrieves specific rules based on the type from a feature.
 * @param {FeatureModel} feature - The key of the feature.
 * @param {CampaignTypeEnum | null} type - The type of the rules to retrieve.
 * @returns {Array} An array of rules that match the type.
 */
function getSpecificRulesBasedOnType(feature, type) {
    if (type === void 0) { type = null; }
    // Return an empty array if no linked campaigns are found
    if (feature && !(feature === null || feature === void 0 ? void 0 : feature.getRulesLinkedCampaign())) {
        return [];
    }
    // Filter the rules by type if a type is specified and is a string
    if (feature && feature.getRulesLinkedCampaign() && type && (0, DataTypeUtil_1.isString)(type)) {
        return feature.getRulesLinkedCampaign().filter(function (rule) {
            var ruleModel = new CampaignModel_1.CampaignModel().modelFromDictionary(rule);
            return ruleModel.getType() === type;
        });
    }
    // Return all linked campaigns if no type is specified
    return feature.getRulesLinkedCampaign();
}
exports.getSpecificRulesBasedOnType = getSpecificRulesBasedOnType;
/**
 * Retrieves all AB and Personalize rules from a feature.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of AB and Personalize rules.
 */
function getAllExperimentRules(feature) {
    // Retrieve the feature by its key
    // Filter the rules to include only AB and Personalize types
    return ((feature === null || feature === void 0 ? void 0 : feature.getRulesLinkedCampaign().filter(function (rule) { return rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB || rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE; })) || []);
}
exports.getAllExperimentRules = getAllExperimentRules;
/**
 * Retrieves a feature by its key from the settings.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {any} The feature if found, otherwise undefined.
 */
function getFeatureFromKey(settings, featureKey) {
    var _a;
    // Find the feature by its key
    return (_a = settings === null || settings === void 0 ? void 0 : settings.getFeatures()) === null || _a === void 0 ? void 0 : _a.find(function (feature) { return feature.getKey() === featureKey; });
}
exports.getFeatureFromKey = getFeatureFromKey;
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
        .some(function (feature) { return feature.getMetrics().some(function (metric) { return metric.getIdentifier() === eventName; }); });
}
exports.doesEventBelongToAnyFeature = doesEventBelongToAnyFeature;
/**
 * Adds linked campaigns to each feature in the settings based on rules.
 * @param {any} settings - The settings file to modify.
 */
function addLinkedCampaignsToSettings(settings) {
    // Create maps for quick access to campaigns and variations
    var campaignMap = new Map(settings.getCampaigns().map(function (campaign) { return [campaign.getId(), campaign]; }));
    // Loop over all features
    for (var _i = 0, _a = settings.getFeatures(); _i < _a.length; _i++) {
        var feature = _a[_i];
        var rulesLinkedCampaign = feature
            .getRules()
            .map(function (rule) {
            var campaign = campaignMap.get(rule.getCampaignId());
            if (!campaign)
                return null;
            // Create a linked campaign object with the rule and campaign
            var linkedCampaign = __assign(__assign({ key: campaign.getKey() }, campaign), { ruleKey: rule.getRuleKey() });
            // If a variationId is specified, find and add the variation
            if (rule.getVariationId()) {
                var variation = campaign.getVariations().find(function (v) { return v.getId() === rule.getVariationId(); });
                if (variation) {
                    linkedCampaign.variations = [variation];
                }
            }
            return linkedCampaign;
        })
            .filter(function (campaign) { return campaign !== null; }); // Filter out any null entries
        var rulesLinkedCampaignModel = rulesLinkedCampaign.map(function (campaign) {
            var campaignModel = new CampaignModel_1.CampaignModel();
            campaignModel.modelFromDictionary(campaign);
            return campaignModel;
        });
        // Assign the linked campaigns to the feature
        feature.setRulesLinkedCampaign(rulesLinkedCampaignModel);
    }
}
exports.addLinkedCampaignsToSettings = addLinkedCampaignsToSettings;
//# sourceMappingURL=FunctionUtil.js.map