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
import { ContextModel } from '../models/user/ContextModel';
/**
 * Creates and sends an impression for a variation shown event.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation shown to the user.
 * @param {ContextModel} context - The user context model containing user-specific data.
 * @param {string} featureKey - The feature key the impression belongs to.
 * @param {any} payload - The variationShown payload; held for exposeResult() when impressions are deferred.
 * @returns {Promise<void>} Resolves when the impression is sent, stashed, or dropped.
 */
export declare const sendImpressionForVariationShown: (
  serviceContainer: any,
  campaignId: number,
  variationId: number,
  context: ContextModel,
  featureKey: string,
  payload: any,
) => Promise<void>;
/**
 * Sends batched event payloads through the SDK batch pipeline.
 * Legacy getFlags suppression drops the whole batch. Otherwise payloads are filtered by the active event dispatch policy.
 *
 * @param serviceContainer - The service container instance.
 * @param payloads - Event payloads to send.
 * @returns {Promise<void>} Resolves when allowed payloads are enqueued, dispatched, or dropped.
 */
export declare const sendImpressionForVariationShownInBatch: (serviceContainer: any, payloads: any[]) => Promise<void>;
