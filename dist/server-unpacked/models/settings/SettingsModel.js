"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModel = void 0;
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
var CampaignModel_1 = require("../campaign/CampaignModel");
var FeatureModel_1 = require("../campaign/FeatureModel");
var SettingsModel = /** @class */ (function () {
    function SettingsModel(settings) {
        var _this = this;
        this.f = [];
        this.features = [];
        this.c = [];
        this.campaigns = [];
        this.campaignGroups = {};
        this.cG = {};
        this.groups = {};
        this.g = {};
        this.sdkKey = settings.sK || settings.sdkKey;
        this.accountId = settings.a || settings.accountId;
        this.version = settings.v || settings.version;
        this.collectionPrefix = settings.collectionPrefix;
        this.usageStatsAccountId = settings.usageStatsAccountId;
        if ((settings.f && settings.f.constructor !== {}.constructor) ||
            (settings.features && settings.features.constructor !== {}.constructor)) {
            var featureList = settings.f || settings.features;
            featureList.forEach(function (feature) {
                _this.features.push(new FeatureModel_1.FeatureModel().modelFromDictionary(feature));
            });
        }
        if ((settings.c && settings.c.constructor !== {}.constructor) ||
            (settings.campaigns && settings.campaigns.constructor !== {}.constructor)) {
            var campaignList = settings.c || settings.campaigns;
            campaignList.forEach(function (campaign) {
                _this.campaigns.push(new CampaignModel_1.CampaignModel().modelFromDictionary(campaign));
            });
        }
        if (settings.cG || settings.campaignGroups) {
            this.campaignGroups = settings.cG || settings.campaignGroups;
        }
        if (settings.g || settings.groups) {
            this.groups = settings.g || settings.groups;
        }
        if (settings.pollInterval) {
            this.pollInterval = settings.pollInterval;
        }
        return this;
    }
    SettingsModel.prototype.getFeatures = function () {
        return this.features;
    };
    SettingsModel.prototype.getCampaigns = function () {
        return this.campaigns;
    };
    SettingsModel.prototype.getSdkkey = function () {
        return this.sdkKey;
    };
    SettingsModel.prototype.getAccountId = function () {
        return this.accountId;
    };
    SettingsModel.prototype.getVersion = function () {
        return this.version;
    };
    SettingsModel.prototype.getCollectionPrefix = function () {
        return this.collectionPrefix;
    };
    SettingsModel.prototype.getCampaignGroups = function () {
        return this.campaignGroups;
    };
    SettingsModel.prototype.getGroups = function () {
        return this.groups;
    };
    SettingsModel.prototype.setPollInterval = function (value) {
        this.pollInterval = value;
    };
    SettingsModel.prototype.getPollInterval = function () {
        return this.pollInterval;
    };
    SettingsModel.prototype.getUsageStatsAccountId = function () {
        return this.usageStatsAccountId;
    };
    return SettingsModel;
}());
exports.SettingsModel = SettingsModel;
//# sourceMappingURL=SettingsModel.js.map