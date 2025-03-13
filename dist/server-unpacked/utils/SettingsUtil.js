"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSettingsAndAddCampaignsToRules = setSettingsAndAddCampaignsToRules;
var SettingsModel_1 = require("../models/settings/SettingsModel");
var CampaignUtil_1 = require("./CampaignUtil");
var FunctionUtil_1 = require("./FunctionUtil");
var GatewayServiceUtil_1 = require("./GatewayServiceUtil");
/**
 * Sets settings and adds campaigns to rules
 * @param settings settings
 * @param vwoClientInstance VWOClient instance
 */
function setSettingsAndAddCampaignsToRules(settings, vwoClientInstance) {
    // create settings model and set it to vwoClientInstance
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
//# sourceMappingURL=SettingsUtil.js.map