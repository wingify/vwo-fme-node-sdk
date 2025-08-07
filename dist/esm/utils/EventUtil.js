"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSdkInitEvent = sendSdkInitEvent;
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
const NetworkUtil_1 = require("./NetworkUtil");
const EventEnum_1 = require("../enums/EventEnum");
const BatchEventsQueue_1 = require("../services/BatchEventsQueue");
/**
 * Sends an init called event to VWO.
 * This event is triggered when the init function is called.
 * @param {number} settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param {number} sdkInitTime - Time taken to initialize the SDK in milliseconds.
 */
async function sendSdkInitEvent(settingsFetchTime, sdkInitTime) {
    // create the query parameters
    const properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_INIT_CALLED);
    // create the payload with required fields
    const payload = (0, NetworkUtil_1.getSDKInitEventPayload)(EventEnum_1.EventEnum.VWO_INIT_CALLED, settingsFetchTime, sdkInitTime);
    if (BatchEventsQueue_1.BatchEventsQueue.Instance) {
        BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
    }
    else {
        // Send the constructed properties and payload as a POST request
        //send eventName in parameters so that we can enable retry for this event
        await (0, NetworkUtil_1.sendEvent)(properties, payload, EventEnum_1.EventEnum.VWO_INIT_CALLED).catch(() => { });
    }
}
//# sourceMappingURL=EventUtil.js.map