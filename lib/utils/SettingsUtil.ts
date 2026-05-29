/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { IWingifyClient } from './../WingifyClient';
import { SettingsModel } from '../models/settings/SettingsModel';
import { setVariationAllocation } from './CampaignUtil';
import { addLinkedCampaignsToSettings } from './FunctionUtil';
import { addIsGatewayServiceRequiredFlag } from './GatewayServiceUtil';
import { LogManager } from '../packages/logger';

/**
 * Sets settings and adds campaigns to rules
 * @param settings settings
 * @param wingifyClientInstance WingifyClient instance
 * @param logManager Log manager instance
 */
export function setSettingsAndAddCampaignsToRules(
  settings: any,
  wingifyClientInstance: IWingifyClient,
  logManager: LogManager,
) {
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
