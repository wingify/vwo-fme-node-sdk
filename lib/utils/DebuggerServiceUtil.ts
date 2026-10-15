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

import { getDebuggerEventPayload, getEventsBaseProperties, sendEvent } from './NetworkUtil';
import { EventEnum } from '../enums/EventEnum';
import { ServiceContainer } from '../services/ServiceContainer';
import { getCurrentGetFlagsBatchContext } from '../services/GetFlagsBatchContext';
import { isSampledDebugErrorTemplateKey } from './InternalEventsRuntimeUtil';

/**
 * Utility functions for handling debugger service operations including
 * filtering sensitive properties and extracting decision keys.
 */

/**
 * Extracts only the required fields from a decision object.
 * @param decisionObj - The decision object to extract fields from
 * @returns An object containing only rolloutKey and experimentKey if they exist
 */
export function extractDecisionKeys(decisionObj: Record<string, any> = {}): Record<string, any> {
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
 * Sends a debug event to Wingify after applying sampled-event sampling rules.
 * @param serviceContainer - The SDK service container.
 * @param eventProps - The properties for the debug event.
 * @returns A promise that resolves when the event is sent or skipped.
 */
export async function sendDebugEventToWingify(
  serviceContainer: ServiceContainer,
  eventProps: Record<string, any> = {},
): Promise<void> {
  if (serviceContainer.getSuppressTrackingCalls() || getCurrentGetFlagsBatchContext()?.suppressTrackingCalls) {
    return;
  }

  const messageTemplateKey = eventProps.msg_t;
  // check if the message template key is sampled
  const isSampledDebugEvent = messageTemplateKey ? isSampledDebugErrorTemplateKey(messageTemplateKey) : false;
  const settings = serviceContainer.getOriginalSettingsDocument();

  // check if the sampled debug event should be sent.
  // if the sampled debug event should not be sent, return.
  if (
    isSampledDebugEvent &&
    !serviceContainer.getInternalEventsThrottleService().shouldSendSampledDebugEvent(settings)
  ) {
    return;
  }

  const properties = getEventsBaseProperties(
    serviceContainer.getSettingsService(),
    EventEnum.DEBUGGER_EVENT,
    null,
    null,
  );

  const payload = getDebuggerEventPayload(serviceContainer.getSettingsService(), eventProps);

  if (serviceContainer.getBatchEventsQueue()) {
    serviceContainer.getBatchEventsQueue().enqueue(payload);
    return;
  }

  // send the debug event to the server.
  await sendEvent(serviceContainer, properties, payload, EventEnum.DEBUGGER_EVENT).catch(() => {});
}
