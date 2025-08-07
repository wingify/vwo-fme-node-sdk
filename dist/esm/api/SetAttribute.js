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
exports.SetAttributeApi = void 0;
const EventEnum_1 = require("../enums/EventEnum");
const NetworkUtil_1 = require("../utils/NetworkUtil");
const BatchEventsQueue_1 = require("../services/BatchEventsQueue");
class SetAttributeApi {
    /**
     * Implementation of setAttributes to create an impression for multiple user attributes.
     * @param settings Configuration settings.
     * @param attributes Key-value map of attributes.
     * @param context Context containing user information.
     */
    async setAttribute(settings, attributes, context) {
        if ((0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) {
            await createImpressionForAttributes(settings, attributes, context);
        }
        else {
            createImpressionForAttributes(settings, attributes, context);
        }
    }
}
exports.SetAttributeApi = SetAttributeApi;
/**
 * Creates an impression for multiple user attributes and sends it to the server.
 * @param settings Configuration settings.
 * @param attributes Key-value map of attributes.
 * @param context Context containing user information.
 */
const createImpressionForAttributes = async (settings, attributes, context) => {
    // Retrieve base properties for the event
    const properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
    // Construct payload data for multiple attributes
    const payload = (0, NetworkUtil_1.getAttributePayloadData)(settings, context.getId(), EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP, attributes, context.getUserAgent(), context.getIpAddress());
    if (BatchEventsQueue_1.BatchEventsQueue.Instance) {
        BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
    }
    else {
        // Send the constructed payload via POST request
        await (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId());
    }
};
//# sourceMappingURL=SetAttribute.js.map