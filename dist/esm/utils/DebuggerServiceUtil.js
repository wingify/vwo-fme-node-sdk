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
exports.extractDecisionKeys = extractDecisionKeys;
exports.sendDebugEventToVWO = sendDebugEventToVWO;
const NetworkUtil_1 = require("./NetworkUtil");
const EventEnum_1 = require("../enums/EventEnum");
/**
 * Utility functions for handling debugger service operations including
 * filtering sensitive properties and extracting decision keys.
 */
/**
 * Extracts only the required fields from a decision object.
 * @param decisionObj - The decision object to extract fields from
 * @returns An object containing only rolloutKey and experimentKey if they exist
 */
function extractDecisionKeys(decisionObj = {}) {
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
async function sendDebugEventToVWO(eventProps = {}) {
    // create query parameters
    const properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT, null, null);
    // create payload
    const payload = (0, NetworkUtil_1.getDebuggerEventPayload)(eventProps);
    // send event
    await (0, NetworkUtil_1.sendEvent)(properties, payload, EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT).catch(() => { });
}
//# sourceMappingURL=DebuggerServiceUtil.js.map