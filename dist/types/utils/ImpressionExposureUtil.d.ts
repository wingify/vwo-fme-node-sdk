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
import { ServiceContainer } from '../services/ServiceContainer';
/**
 * Dependencies needed to send deferred variationShown impressions via Flag.exposeResult().
 */
export type ExposeDependencies = {
  serviceContainer: ServiceContainer;
  context: ContextModel;
  featureKey: string;
  isEnabled: boolean;
};
/**
 * Sends deferred variationShown payloads, bypassing the fetchFlags dispatch policy.
 * Uses the same transport paths as normal impression sending.
 *
 * @param serviceContainer - Shared SDK service container.
 * @param context - User context from the original evaluation.
 * @param featureKey - Feature key the payloads belong to.
 * @param payloads - Deferred variationShown payloads to send.
 * @returns {boolean} True when payloads were enqueued or sent, false when there was nothing to send.
 */
export declare function sendDeferredVariationShownPayloads(
  serviceContainer: ServiceContainer,
  context: ContextModel,
  featureKey: string,
  payloads: any[],
): Promise<boolean>;
/** Minimal Flag surface needed by exposeResult (avoids circular import with GetFlag). */
export interface ExposableFlag {
  isImpressionAlreadySent(): boolean;
  getExposeDependencies(): ExposeDependencies | undefined;
  consumeDeferredImpressions(): any[];
  markImpressionSent(): void;
}
/**
 * Enqueues deferred variationShown impressions for a Flag result (Android-style exposeResult).
 * Idempotent: second call is a no-op after stash is cleared / marked sent.
 *
 * @param flag - Flag holding deferred impressions and expose deps.
 * @returns {boolean} True when impressions were enqueued or sent, false otherwise.
 */
export declare function exposeFlagResult(flag: ExposableFlag): Promise<boolean>;
