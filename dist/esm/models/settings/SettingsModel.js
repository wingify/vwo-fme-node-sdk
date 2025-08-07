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
const CampaignModel_1 = require("../campaign/CampaignModel");
const FeatureModel_1 = require("../campaign/FeatureModel");
class SettingsModel {
    constructor(settings) {
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
        if ((settings.f && settings.f.constructor !== {}.constructor) ||
            (settings.features && settings.features.constructor !== {}.constructor)) {
            const featureList = settings.f || settings.features;
            featureList.forEach((feature) => {
                this.features.push(new FeatureModel_1.FeatureModel().modelFromDictionary(feature));
            });
        }
        if ((settings.c && settings.c.constructor !== {}.constructor) ||
            (settings.campaigns && settings.campaigns.constructor !== {}.constructor)) {
            const campaignList = settings.c || settings.campaigns;
            campaignList.forEach((campaign) => {
                this.campaigns.push(new CampaignModel_1.CampaignModel().modelFromDictionary(campaign));
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
    getFeatures() {
        return this.features;
    }
    getCampaigns() {
        return this.campaigns;
    }
    getSdkkey() {
        return this.sdkKey;
    }
    getAccountId() {
        return this.accountId;
    }
    getVersion() {
        return this.version;
    }
    getCollectionPrefix() {
        return this.collectionPrefix;
    }
    getCampaignGroups() {
        return this.campaignGroups;
    }
    getGroups() {
        return this.groups;
    }
    setPollInterval(value) {
        this.pollInterval = value;
    }
    getPollInterval() {
        return this.pollInterval;
    }
}
exports.SettingsModel = SettingsModel;
//# sourceMappingURL=SettingsModel.js.map