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
import { VariationModel } from '../models/campaign/VariationModel';
import { ContextModel } from '../models/user/ContextModel';
import { ServiceContainer } from '../services/ServiceContainer';
import { ExposeDependencies } from '../utils/ImpressionExposureUtil';
export declare class Flag {
  private readonly enabled;
  private variation;
  private readonly sessionId;
  private readonly uuid;
  private deferredImpressionPayloads;
  private exposeDependencies;
  private hasImpressionBeenSent;
  constructor(
    isEnabled: boolean,
    sessionId: number,
    uuid: string,
    variation?: VariationModel | Record<string, any> | undefined,
  );
  isEnabled(): boolean;
  getSessionId(): number;
  getUUID(): string;
  getVariables(): Record<string, unknown>[];
  getVariable<T = unknown>(key: string): T | undefined;
  getVariable<T = unknown>(key: string, defaultValue: T): T;
  /**
   * Sends deferred variationShown impressions stashed during fetchFlags.
   * Idempotent: subsequent calls are no-ops after the stash is cleared.
   *
   * @returns {boolean} True when an impression was enqueued or sent, false otherwise.
   */
  exposeResult(): Promise<boolean>;
  /**
   * Stores the dependencies needed to send deferred impressions from exposeResult().
   *
   * @internal
   * @param exposeDependencies - Service container, context, and feature key used when exposing.
   * @returns {void}
   */
  attachExposeDependencies(exposeDependencies: ExposeDependencies): void;
  /**
   * Returns the dependencies attached for exposeResult().
   *
   * @internal
   * @returns {ExposeDependencies | undefined} Expose dependencies, or undefined when none were attached (e.g. error flags).
   */
  getExposeDependencies(): ExposeDependencies | undefined;
  /**
   * Appends deferred variationShown payloads collected during evaluation.
   *
   * @internal
   * @param deferredPayloads - Deferred impression payloads to hold until exposeResult().
   * @returns {void}
   */
  addDeferredImpressions(deferredPayloads: any[]): void;
  /**
   * Returns all held impression payloads and clears the stash.
   *
   * @internal
   * @returns {any[]} Copy of the held impression payloads.
   */
  consumeDeferredImpressions(): any[];
  /**
   * Marks impressions as sent and clears any held payloads, making exposeResult() a no-op.
   *
   * @internal
   * @returns {void}
   */
  markImpressionSent(): void;
  /**
   * Returns whether impressions for this flag were already sent.
   *
   * @internal
   * @returns {boolean} True when impressions were sent during evaluation or by exposeResult().
   */
  isImpressionAlreadySent(): boolean;
  /**
   * Returns whether this flag still holds deferred impression payloads.
   *
   * @internal
   * @returns {boolean} True when at least one impression payload is waiting for exposeResult().
   */
  hasPendingImpressions(): boolean;
}
export declare class FlagApi {
  /**
   * Attaches deferred impression stash + expose deps for Flag.exposeResult().
   *
   * @param flag - Evaluated flag to finalize.
   * @param serviceContainer - Shared SDK service container.
   * @param context - User context used for the evaluation.
   * @param featureKey - Feature key of the evaluated flag.
   * @param isImpressionDispatchEnabled - Whether impressions were dispatched during evaluation.
   * @returns {Flag} The same flag with expose deps and any deferred impressions attached.
   */
  private static prepareFlagForExposeResult;
  /**
   * Evaluates a feature flag for a user inside a deferred-impression collection scope.
   *
   * @param featureKey - Feature key to evaluate.
   * @param context - User context for the evaluation.
   * @param serviceContainer - Shared SDK service container.
   * @returns {Promise<Flag>} The evaluated flag.
   */
  static get(featureKey: string, context: ContextModel, serviceContainer: ServiceContainer): Promise<Flag>;
  /**
   * Runs the full flag evaluation: stored decisions, holdouts, rollout and experiment rules,
   * impressions, MAU usage tracking, and storage writes.
   *
   * @param featureKey - Feature key to evaluate.
   * @param context - User context for the evaluation.
   * @param serviceContainer - Shared SDK service container.
   * @returns {Promise<Flag>} The evaluated flag, finalized for exposeResult().
   */
  private static evaluateFlag;
}
