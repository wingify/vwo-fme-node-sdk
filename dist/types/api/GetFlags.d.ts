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
import { Flag } from './GetFlag';
import { IWingifyOptions } from '../models/WingifyOptionsModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { ServiceContainer } from '../services/ServiceContainer';
/**
 * Resolves the distinct feature keys to evaluate for getFlags.
 *
 * @param flagNames - Requested keys, or null/empty to evaluate all settings features.
 * @param settings - Processed account settings.
 * @returns Distinct feature keys to evaluate.
 */
export declare function resolveFlagKeys(flagNames: string[] | null | undefined, settings: SettingsModel): string[];
/**
 * Batch feature-flag evaluation used by WingifyClient.getFlags and WingifyClient.fetchFlags.
 */
export declare class GetFlagsApi {
  /**
   * Evaluates multiple feature flags in MEG-safe batches; unknown or failed keys become disabled Flags.
   * Node runs independent batches in parallel via ALS; browser evaluates sequentially via a queue.
   *
   * @param flagNames - Feature keys to evaluate, or null/empty for all settings features.
   * @param baseContextCopy - Validated plain context object shared across evaluations.
   * @param serviceContainer - Shared SDK service container.
   * @param options - SDK init options used to build per-flag ContextModel instances.
   * @param shouldSendTrackingCalls - When false, suppresses tracking/impression network calls.
   * @param shouldSendMAU - When false, suppresses MAU tracking calls.
   * @param shouldApplyLegacySuppression - When true, getFlags drops impressions via suppress flags. fetchFlags passes false so impressions are deferred instead.
   * @returns {Promise<Record<string, Flag>>} Evaluated flags keyed by feature key (disabled Flag for unknown/failed keys).
   */
  static get(
    flagNames: string[] | null | undefined,
    baseContextCopy: Record<string, any>,
    serviceContainer: ServiceContainer,
    options: IWingifyOptions,
    shouldSendTrackingCalls?: boolean, // Default to true so that tracking calls are sent in case of getFlags.
    shouldSendMAU?: boolean, // Default to true so that MAU calls are sent
    shouldApplyLegacySuppression?: boolean,
  ): Promise<Record<string, Flag>>;
}
