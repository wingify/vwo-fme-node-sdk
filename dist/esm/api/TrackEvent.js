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
import { ApiEnum } from '../enums/ApiEnum.js';
import { doesEventBelongToAnyFeature } from '../utils/FunctionUtil.js';
import { getEventsBaseProperties, getTrackGoalPayloadData, sendPostApiRequest } from '../utils/NetworkUtil.js';
export class TrackApi {
    /**
     * Implementation of the track method to handle event tracking.
     * Checks if the event exists, creates an impression, and executes hooks.
     */
    async track(serviceContainer, eventName, context, eventProperties) {
        if (doesEventBelongToAnyFeature(eventName, serviceContainer.getSettings())) {
            // Create an impression for the track event
            if (serviceContainer.getShouldWaitForTrackingCalls()) {
                await createImpressionForTrack(serviceContainer, eventName, context, eventProperties);
            }
            else {
                createImpressionForTrack(serviceContainer, eventName, context, eventProperties);
            }
            // Set and execute integration callback for the track event
            serviceContainer.getHooksService().set({ eventName: eventName, api: ApiEnum.TRACK_EVENT });
            serviceContainer.getHooksService().execute(serviceContainer.getHooksService().get());
            return { [eventName]: true };
        }
        // Log an error if the event does not exist
        serviceContainer.getLogManager().errorLog('EVENT_NOT_FOUND', {
            eventName,
        }, { an: ApiEnum.TRACK_EVENT, uuid: context.getUuid(), sId: context.getSessionId() });
        return { [eventName]: false };
    }
}
/**
 * Creates an impression for a track event and sends it via a POST API request.
 * @param serviceContainer Service container.
 * @param eventName Name of the event to track.
 * @param user User details.
 * @param eventProperties Properties associated with the event.
 */
const createImpressionForTrack = async (serviceContainer, eventName, context, eventProperties) => {
    // Get base properties for the event
    const properties = getEventsBaseProperties(serviceContainer.getSettingsService(), eventName, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
    // Prepare the payload for the track goal
    const payload = getTrackGoalPayloadData(serviceContainer, context.getId(), eventName, eventProperties, context?.getUserAgent(), context?.getIpAddress(), context.getSessionId());
    // Send the prepared payload via POST API request
    if (serviceContainer.getBatchEventsQueue()) {
        serviceContainer.getBatchEventsQueue().enqueue(payload);
    }
    else {
        // Send the constructed payload via POST request
        await sendPostApiRequest(serviceContainer, properties, payload, context.getId(), eventProperties);
    }
};
//# sourceMappingURL=TrackEvent.js.map