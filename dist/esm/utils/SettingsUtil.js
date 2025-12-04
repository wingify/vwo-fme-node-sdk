import { SettingsModel } from '../models/settings/SettingsModel.js';
import { setVariationAllocation } from './CampaignUtil.js';
import { addLinkedCampaignsToSettings } from './FunctionUtil.js';
import { addIsGatewayServiceRequiredFlag } from './GatewayServiceUtil.js';
/**
 * Sets settings and adds campaigns to rules
 * @param settings settings
 * @param vwoClientInstance VWOClient instance
 */
export function setSettingsAndAddCampaignsToRules(settings, vwoClientInstance) {
    // create settings model and set it to vwoClientInstance
    vwoClientInstance.settings = new SettingsModel(settings);
    vwoClientInstance.originalSettings = settings;
    // Optimize loop by avoiding multiple calls to `getCampaigns()`
    const campaigns = vwoClientInstance.settings.getCampaigns();
    campaigns.forEach((campaign, index) => {
        setVariationAllocation(campaign);
        campaigns[index] = campaign;
    });
    addLinkedCampaignsToSettings(vwoClientInstance.settings);
    addIsGatewayServiceRequiredFlag(vwoClientInstance.settings);
}
//# sourceMappingURL=SettingsUtil.js.map