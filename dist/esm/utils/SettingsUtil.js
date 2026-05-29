import { SettingsModel } from '../models/settings/SettingsModel.js';
import { setVariationAllocation } from './CampaignUtil.js';
import { addLinkedCampaignsToSettings } from './FunctionUtil.js';
import { addIsGatewayServiceRequiredFlag } from './GatewayServiceUtil.js';
/**
 * Sets settings and adds campaigns to rules
 * @param settings settings
 * @param wingifyClientInstance WingifyClient instance
 * @param logManager Log manager instance
 */
export function setSettingsAndAddCampaignsToRules(settings, wingifyClientInstance, logManager) {
    // create settings model and set it to wingifyClientInstance
    wingifyClientInstance.settings = new SettingsModel(settings);
    wingifyClientInstance.originalSettings = settings;
    // Optimize loop by avoiding multiple calls to `getCampaigns()`
    const campaigns = wingifyClientInstance.settings.getCampaigns();
    campaigns.forEach((campaign, index) => {
        setVariationAllocation(campaign, logManager);
        campaigns[index] = campaign;
    });
    addLinkedCampaignsToSettings(wingifyClientInstance.settings);
    addIsGatewayServiceRequiredFlag(wingifyClientInstance.settings);
}
//# sourceMappingURL=SettingsUtil.js.map