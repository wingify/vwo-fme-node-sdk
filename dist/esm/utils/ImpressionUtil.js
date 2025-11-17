"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndSendImpressionForVariationShown = void 0;
const NetworkUtil_1 = require("./NetworkUtil");
const EventEnum_1 = require("../enums/EventEnum");
const BatchEventsQueue_1 = require("../services/BatchEventsQueue");
const CampaignUtil_1 = require("./CampaignUtil");
const CampaignUtil_2 = require("./CampaignUtil");
const constants_1 = require("../constants");
/**
 * Creates and sends an impression for a variation shown event.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {SettingsModel} settings - The settings model containing configuration.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation shown to the user.
 * @param {ContextModel} context - The user context model containing user-specific data.
 */
const createAndSendImpressionForVariationShown = async (settings, campaignId, variationId, context, featureKey) => {
    // Get base properties for the event
    const properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()), // Encode user agent to ensure URL safety
    context.getIpAddress());
    // Construct payload data for tracking the user
    const payload = (0, NetworkUtil_1.getTrackUserPayloadData)(settings, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, campaignId, variationId, context);
    const campaignKeyWithFeatureName = (0, CampaignUtil_1.getCampaignKeyFromCampaignId)(settings, campaignId);
    const variationName = (0, CampaignUtil_2.getVariationNameFromCampaignIdAndVariationId)(settings, campaignId, variationId);
    let campaignKey = '';
    if (featureKey === campaignKeyWithFeatureName) {
        campaignKey = constants_1.Constants.IMPACT_ANALYSIS;
    }
    else {
        campaignKey = campaignKeyWithFeatureName?.split(`${featureKey}_`)[1];
    }
    const campaignType = (0, CampaignUtil_1.getCampaignTypeFromCampaignId)(settings, campaignId);
    if (BatchEventsQueue_1.BatchEventsQueue.Instance) {
        BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
    }
    else {
        // Send the constructed properties and payload as a POST request
        await (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId(), {}, { campaignKey, variationName, featureKey, campaignType });
    }
};
exports.createAndSendImpressionForVariationShown = createAndSendImpressionForVariationShown;
//# sourceMappingURL=ImpressionUtil.js.map