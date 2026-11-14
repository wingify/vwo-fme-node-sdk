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
/**
 * Runs flag evaluation inside a deferred-impression collection scope.
 * Supports async callbacks (scope stays active until the promise settles).
 *
 * @param featureKey - Feature key being evaluated.
 * @param flagEvaluationCallback - Evaluation callback to run inside the scope.
 * @returns {T} The callback result.
 */
export declare function runWithDeferredImpressionScope<T>(featureKey: string, flagEvaluationCallback: () => T): T;
/**
 * Collects a variationShown payload when impressions are deferred (fetchFlags).
 *
 * @param payload - Impression payload to hold in the active scope.
 * @returns {void}
 */
export declare function collectDeferredImpression(payload: any): void;
/**
 * Returns (and clears) payloads collected in the active evaluation scope.
 *
 * @returns {any[]} Collected payloads, or an empty array when no scope is active.
 */
export declare function takeDeferredImpressions(): any[];
/**
 * Returns whether an active deferred-impression scope exists.
 *
 * @returns {boolean} True when called during a flag evaluation.
 */
export declare function hasDeferredImpressionScope(): boolean;
