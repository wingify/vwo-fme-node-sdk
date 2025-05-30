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
import { IVWOClient } from './../VWOClient';
import { SettingsModel } from '../models/settings/SettingsModel';
import { setVariationAllocation } from './CampaignUtil';
import { addLinkedCampaignsToSettings } from './FunctionUtil';
import { addIsGatewayServiceRequiredFlag } from './GatewayServiceUtil';

/**
 * Sets settings and adds campaigns to rules
 * @param settings settings
 * @param vwoClientInstance VWOClient instance
 */
export function setSettingsAndAddCampaignsToRules(settings: any, vwoClientInstance: IVWOClient) {
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
