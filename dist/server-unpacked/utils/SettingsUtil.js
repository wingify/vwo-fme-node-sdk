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
 * @param wingifyClientInstance WingifyClient instance
 * @param logManager Log manager instance
 */
function setSettingsAndAddCampaignsToRules(settings, wingifyClientInstance, logManager) {
    // create settings model and set it to wingifyClientInstance
    wingifyClientInstance.settings = new SettingsModel_1.SettingsModel(settings);
    wingifyClientInstance.originalSettings = settings;
    // Optimize loop by avoiding multiple calls to `getCampaigns()`
    var campaigns = wingifyClientInstance.settings.getCampaigns();
    campaigns.forEach(function (campaign, index) {
        (0, CampaignUtil_1.setVariationAllocation)(campaign, logManager);
        campaigns[index] = campaign;
    });
    (0, FunctionUtil_1.addLinkedCampaignsToSettings)(wingifyClientInstance.settings);
    (0, GatewayServiceUtil_1.addIsGatewayServiceRequiredFlag)(wingifyClientInstance.settings);
}
//# sourceMappingURL=SettingsUtil.js.map