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
import { getEventsBaseProperties, getSDKInitEventPayload, sendEvent } from './NetworkUtil';
import { EventEnum } from '../enums/EventEnum';
import { BatchEventsQueue } from '../services/BatchEventsQueue';

/**
 * Sends an init called event to VWO.
 * This event is triggered when the init function is called.
 * @param {number} settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param {number} sdkInitTime - Time taken to initialize the SDK in milliseconds.
 */
export async function sendSdkInitEvent(settingsFetchTime?: number, sdkInitTime?: number) {
  // create the query parameters
  const properties = getEventsBaseProperties(EventEnum.VWO_INIT_CALLED);

  // create the payload with required fields
  const payload = getSDKInitEventPayload(EventEnum.VWO_INIT_CALLED, settingsFetchTime, sdkInitTime);

  if (BatchEventsQueue.Instance) {
    BatchEventsQueue.Instance.enqueue(payload);
  } else {
    // Send the constructed properties and payload as a POST request
    //send eventName in parameters so that we can enable retry for this event
    await sendEvent(properties, payload, EventEnum.VWO_INIT_CALLED).catch(() => {});
  }
}
