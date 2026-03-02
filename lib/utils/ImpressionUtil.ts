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

import { getEventsBaseProperties, sendPostApiRequest } from './NetworkUtil';
import { ContextModel } from '../models/user/ContextModel';
import { EventEnum } from '../enums/EventEnum';
import { getCampaignKeyFromCampaignId, getCampaignTypeFromCampaignId } from './CampaignUtil';
import { getVariationNameFromCampaignIdAndVariationId } from './CampaignUtil';
import { Constants } from '../constants';
import { BatchEventsDispatcher } from './BatchEventsDispatcher';
import { SDKMetaUtil } from './SDKMetaUtil';

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
export const sendImpressionForVariationShown = async (
  serviceContainer,
  campaignId: number,
  variationId: number,
  context: ContextModel,
  featureKey: string,
  payload: any,
) => {
  // Get base properties for the event
  const properties = getEventsBaseProperties(
    serviceContainer.getSettingsService(),
    EventEnum.VWO_VARIATION_SHOWN,
    encodeURIComponent(context.getUserAgent()), // Encode user agent to ensure URL safety
    context.getIpAddress(),
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

/**
 * Sends an impression for a variation shown event in batch.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {any[]} payloads - The payloads to send.
 * @param {ContextModel} context - The user context model containing user-specific data.
 * @param {string} featureKey - The feature key.
 */
export const sendImpressionForVariationShownInBatch = async (serviceContainer, payloads: any[]) => {
  if (serviceContainer.getBatchEventsQueue()) {
    for (const payload of payloads) {
      serviceContainer.getBatchEventsQueue().enqueue(payload);
    }
  } else {
    BatchEventsDispatcher.dispatch(serviceContainer, { ev: payloads }, () => {}, {
      a: serviceContainer.getSettingsService().accountId,
      env: serviceContainer.getSettingsService().sdkKey,
      sn: SDKMetaUtil.getInstance().getSdkName(),
      sv: SDKMetaUtil.getInstance().getVersion(),
    });
  }
};
