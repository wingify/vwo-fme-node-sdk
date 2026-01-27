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

import { getEventsBaseProperties, getTrackUserPayloadData, sendPostApiRequest } from './NetworkUtil';
import { ContextModel } from '../models/user/ContextModel';
import { EventEnum } from '../enums/EventEnum';
import { getCampaignKeyFromCampaignId, getCampaignTypeFromCampaignId } from './CampaignUtil';
import { getVariationNameFromCampaignIdAndVariationId } from './CampaignUtil';
import { Constants } from '../constants';
import { ServiceContainer } from '../services/ServiceContainer';

/**
 * Creates and sends an impression for a variation shown event.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation shown to the user.
 * @param {ContextModel} context - The user context model containing user-specific data.
 */
export const createAndSendImpressionForVariationShown = async (
  serviceContainer: ServiceContainer,
  campaignId: number,
  variationId: number,
  context: ContextModel,
  featureKey: string,
) => {
  // Get base properties for the event
  const properties = getEventsBaseProperties(
    serviceContainer.getSettingsService(),
    EventEnum.VWO_VARIATION_SHOWN,
    encodeURIComponent(context.getUserAgent()), // Encode user agent to ensure URL safety
    context.getIpAddress(),
  );

  // Construct payload data for tracking the user
  const payload = getTrackUserPayloadData(
    serviceContainer,
    EventEnum.VWO_VARIATION_SHOWN,
    campaignId,
    variationId,
    context,
  );

  const campaignKeyWithFeatureName = getCampaignKeyFromCampaignId(serviceContainer.getSettings(), campaignId);
  const variationName = getVariationNameFromCampaignIdAndVariationId(
    serviceContainer.getSettings(),
    campaignId,
    variationId,
  );
  let campaignKey = '';
  if (featureKey === campaignKeyWithFeatureName) {
    campaignKey = Constants.IMPACT_ANALYSIS;
  } else {
    campaignKey = campaignKeyWithFeatureName?.split(`${featureKey}_`)[1];
  }
  const campaignType = getCampaignTypeFromCampaignId(serviceContainer.getSettings(), campaignId);

  if (serviceContainer.getBatchEventsQueue()) {
    serviceContainer.getBatchEventsQueue().enqueue(payload);
  } else {
    // Send the constructed properties and payload as a POST request
    await sendPostApiRequest(
      serviceContainer,
      properties,
      payload,
      context.getId(),
      {},
      { campaignKey, variationName, featureKey, campaignType },
    );
  }
};
