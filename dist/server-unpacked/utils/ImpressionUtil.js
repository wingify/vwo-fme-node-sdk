"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndSendImpressionForVariationShown = void 0;
var NetworkUtil_1 = require("./NetworkUtil");
var EventEnum_1 = require("../enums/EventEnum");
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
var createAndSendImpressionForVariationShown = function (settings, campaignId, variationId, context) {
    // Get base properties for the event
    var properties = (0, NetworkUtil_1.getEventsBaseProperties)(settings, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()), // Encode user agent to ensure URL safety
    context.getIpAddress());
    // Construct payload data for tracking the user
    var payload = (0, NetworkUtil_1.getTrackUserPayloadData)(settings, context.getId(), EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, campaignId, variationId, context.getUserAgent(), context.getIpAddress());
    // Send the constructed properties and payload as a POST request
    (0, NetworkUtil_1.sendPostApiRequest)(properties, payload);
};
exports.createAndSendImpressionForVariationShown = createAndSendImpressionForVariationShown;
//# sourceMappingURL=ImpressionUtil.js.map