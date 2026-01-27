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
import { ServiceContainer } from '../services/ServiceContainer';
/**
 * Utility functions for handling debugger service operations including
 * filtering sensitive properties and extracting decision keys.
 */
/**
 * Extracts only the required fields from a decision object.
 * @param decisionObj - The decision object to extract fields from
 * @returns An object containing only rolloutKey and experimentKey if they exist
 */
export declare function extractDecisionKeys(decisionObj?: Record<string, any>): Record<string, any>;
/**
 * Sends a debug event to VWO.
 * @param eventProps - The properties for the event.
 * @returns A promise that resolves when the event is sent.
 */
export declare function sendDebugEventToVWO(
  serviceContainer: ServiceContainer,
  eventProps?: Record<string, any>,
): Promise<void>;
