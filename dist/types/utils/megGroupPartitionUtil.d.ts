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
import { SettingsModel } from '../models/settings/SettingsModel';
/**
 * Feature keys that must be evaluated sequentially within one getFlags worker.
 */
export interface EvaluationBatch {
  featureKeys: string[];
}
/**
 * Partitions requested keys into evaluation batches for getFlags().
 * MEG-linked keys share a batch; independent keys form single-key batches.
 *
 * @param requestedFeatureKeys - Distinct feature keys requested by the caller.
 * @param settings - Account settings used to resolve MEG group membership.
 * @returns Batches where MEG-linked keys share a batch and independent keys are alone.
 */
export declare function getFeatureFlagBatches(
  requestedFeatureKeys: string[],
  settings: SettingsModel,
): EvaluationBatch[];
