"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSettingsAndAddCampaignsToRules = void 0;
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
var SettingsModel_1 = require("../models/settings/SettingsModel");
var CampaignUtil_1 = require("./CampaignUtil");
var FunctionUtil_1 = require("./FunctionUtil");
var GatewayServiceUtil_1 = require("./GatewayServiceUtil");
function setSettingsAndAddCampaignsToRules(settings, vwoClientInstance) {
    vwoClientInstance.settings = new SettingsModel_1.SettingsModel(settings);
    vwoClientInstance.originalSettings = settings;
    // Optimize loop by avoiding multiple calls to `getCampaigns()`
    var campaigns = vwoClientInstance.settings.getCampaigns();
    campaigns.forEach(function (campaign, index) {
        (0, CampaignUtil_1.setVariationAllocation)(campaign);
        campaigns[index] = campaign;
    });
    (0, FunctionUtil_1.addLinkedCampaignsToSettings)(vwoClientInstance.settings);
    (0, GatewayServiceUtil_1.addIsGatewayServiceRequiredFlag)(vwoClientInstance.settings);
}
exports.setSettingsAndAddCampaignsToRules = setSettingsAndAddCampaignsToRules;
//# sourceMappingURL=SettingsUtil.js.map