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
import { getDebuggerEventPayload, getEventsBaseProperties, sendEvent } from './NetworkUtil.js';
import { EventEnum } from '../enums/EventEnum.js';
import { BatchEventsQueue } from '../services/BatchEventsQueue.js';
/**
 * Utility functions for handling debugger service operations including
 * filtering sensitive properties and extracting decision keys.
 */
/**
 * Extracts only the required fields from a decision object.
 * @param decisionObj - The decision object to extract fields from
 * @returns An object containing only rolloutKey and experimentKey if they exist
 */
export function extractDecisionKeys(decisionObj = {}) {
    const extractedKeys = {};
    // Extract rolloutKey if present
    if (decisionObj.rolloutId) {
        extractedKeys['rId'] = decisionObj.rolloutId;
    }
    // Extract rolloutVariationId if present
    if (decisionObj.rolloutVariationId) {
        extractedKeys['rvId'] = decisionObj.rolloutVariationId;
    }
    // Extract experimentKey if present
    if (decisionObj.experimentId) {
        extractedKeys['eId'] = decisionObj.experimentId;
    }
    // Extract experimentVariationId if present
    if (decisionObj.experimentVariationId) {
        extractedKeys['evId'] = decisionObj.experimentVariationId;
    }
    return extractedKeys;
}
/**
 * Sends a debug event to VWO.
 * @param eventProps - The properties for the event.
 * @returns A promise that resolves when the event is sent.
 */
export async function sendDebugEventToVWO(eventProps = {}) {
    // create query parameters
    const properties = getEventsBaseProperties(EventEnum.VWO_DEBUGGER_EVENT, null, null);
    // create payload
    const payload = getDebuggerEventPayload(eventProps);
    if (BatchEventsQueue.Instance) {
        BatchEventsQueue.Instance.enqueue(payload);
    }
    else {
        await sendEvent(properties, payload, EventEnum.VWO_DEBUGGER_EVENT).catch(() => { });
    }
}
//# sourceMappingURL=DebuggerServiceUtil.js.map