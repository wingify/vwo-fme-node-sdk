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

import { EventEnum } from '../enums/EventEnum';
import { getCurrentGetFlagsBatchContext } from '../services/GetFlagsBatchContext';
import { ServiceContainer } from '../services/ServiceContainer';

/**
 * Controls which network events may be dispatched during flag evaluation.
 */
export interface EventDispatchPolicy {
  shouldDispatchImpressions: boolean;
  shouldDispatchUsageEvents: boolean;
  shouldDispatchDebuggerEvents: boolean;
}

/** Default policy for getFlag/getFlags: all events enabled. */
export const DEFAULT_EVENT_DISPATCH_POLICY: EventDispatchPolicy = {
  shouldDispatchImpressions: true,
  shouldDispatchUsageEvents: true,
  shouldDispatchDebuggerEvents: true,
};

/**
 * Builds an event dispatch policy from getFlags/fetchFlags network toggles.
 *
 * @param shouldSendTrackingCalls - When false, blocks impressions and debugger events.
 * @param shouldSendMAU - When false, blocks MAU usage events.
 * @returns {EventDispatchPolicy} Event dispatch policy for the current evaluation.
 */
export function createEventDispatchPolicy(
  shouldSendTrackingCalls: boolean,
  shouldSendMAU: boolean,
): EventDispatchPolicy {
  // Impressions and debugger calls share the tracking toggle. MAU stays separate so fetchFlags can still send usage.
  return {
    shouldDispatchImpressions: shouldSendTrackingCalls,
    shouldDispatchUsageEvents: shouldSendMAU,
    shouldDispatchDebuggerEvents: shouldSendTrackingCalls,
  };
}

/**
 * Resolves the active event dispatch policy for the current evaluation worker.
 * Batch ALS policy takes precedence; browser falls back to the service container.
 *
 * @param serviceContainer - Shared SDK service container.
 * @returns {EventDispatchPolicy} Active event dispatch policy.
 */
export function getActiveEventDispatchPolicy(serviceContainer: ServiceContainer): EventDispatchPolicy {
  // Parallel workers keep their own policy so one batch cannot overwrite another.
  const batchEventDispatchPolicy = getCurrentGetFlagsBatchContext()?.eventDispatchPolicy;
  if (batchEventDispatchPolicy) {
    return batchEventDispatchPolicy;
  }

  // Browser runs one getFlags call at a time, so the shared container holds the policy.
  return serviceContainer.getEventDispatchPolicy();
}

/**
 * Returns whether an event may be dispatched under the given policy.
 *
 * @param eventDispatchPolicy - Active event dispatch policy.
 * @param eventName - Event name from the payload, when present.
 * @returns {boolean} True when the event should be dispatched.
 */
export function canDispatchEvent(eventDispatchPolicy: EventDispatchPolicy, eventName: string | undefined): boolean {
  // Usage tracking follows the MAU toggle, not the impression toggle.
  if (eventName === EventEnum.USER_EVALUATED) {
    return eventDispatchPolicy.shouldDispatchUsageEvents;
  }

  // Debugger events follow the same tracking toggle as impressions.
  if (eventName === EventEnum.DEBUGGER_EVENT) {
    return eventDispatchPolicy.shouldDispatchDebuggerEvents;
  }

  // variationShown, and any payload without a name, is treated as an impression.
  return eventDispatchPolicy.shouldDispatchImpressions;
}
