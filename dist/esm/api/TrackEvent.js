"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackApi = void 0;
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
const ApiEnum_1 = require("../enums/ApiEnum");
const logger_1 = require("../packages/logger");
const FunctionUtil_1 = require("../utils/FunctionUtil");
const BatchEventsQueue_1 = require("../services/BatchEventsQueue");
const NetworkUtil_1 = require("../utils/NetworkUtil");
class TrackApi {
    /**
     * Implementation of the track method to handle event tracking.
     * Checks if the event exists, creates an impression, and executes hooks.
     */
    async track(settings, eventName, context, eventProperties, hooksService) {
        if ((0, FunctionUtil_1.doesEventBelongToAnyFeature)(eventName, settings)) {
            // Create an impression for the track event
            if ((0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) {
                await createImpressionForTrack(settings, eventName, context, eventProperties);
            }
            else {
                createImpressionForTrack(settings, eventName, context, eventProperties);
            }
            // Set and execute integration callback for the track event
            hooksService.set({ eventName: eventName, api: ApiEnum_1.ApiEnum.TRACK_EVENT });
            hooksService.execute(hooksService.get());
            return { [eventName]: true };
        }
        // Log an error if the event does not exist
        logger_1.LogManager.Instance.errorLog('EVENT_NOT_FOUND', {
            eventName,
        }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT, uuid: context.getUuid(), sId: context.getSessionId() });
        return { [eventName]: false };
    }
}
exports.TrackApi = TrackApi;
/**
 * Creates an impression for a track event and sends it via a POST API request.
 * @param settings Configuration settings for the tracking.
 * @param eventName Name of the event to track.
 * @param user User details.
 * @param eventProperties Properties associated with the event.
 */
const createImpressionForTrack = async (settings, eventName, context, eventProperties) => {
    // Get base properties for the event
    const properties = (0, NetworkUtil_1.getEventsBaseProperties)(eventName, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
    // Prepare the payload for the track goal
    const payload = (0, NetworkUtil_1.getTrackGoalPayloadData)(settings, context.getId(), eventName, eventProperties, context?.getUserAgent(), context?.getIpAddress(), context.getSessionId());
    // Send the prepared payload via POST API request
    if (BatchEventsQueue_1.BatchEventsQueue.Instance) {
        BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
    }
    else {
        // Send the constructed payload via POST request
        await (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId(), eventProperties);
    }
};
//# sourceMappingURL=TrackEvent.js.map