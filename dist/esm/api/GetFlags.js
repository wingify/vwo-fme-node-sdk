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
import { Flag, FlagApi } from './GetFlag.js';
import { VariationModel } from '../models/campaign/VariationModel.js';
import { ContextModel } from '../models/user/ContextModel.js';
import { runWithGetFlagsBatchContext, supportsParallelGetFlagsBatches } from '../services/GetFlagsBatchContext.js';
import { getFeatureFlagBatches } from '../utils/megGroupPartitionUtil.js';
import { isString } from '../utils/DataTypeUtil.js';
import { getCurrentUnixTimestamp } from '../utils/FunctionUtil.js';
/**
 * Browser-only promise queue to serialize getFlags calls.
 * Prevents tracking mode contamination when multiple calls execute concurrently without await.
 * On Node, parallel execution is safe due to AsyncLocalStorage isolation.
 */
let browserGetFlagsQueue = Promise.resolve({});
/**
 * Resolves the distinct feature keys to evaluate for getFlags.
 *
 * @param flagNames - Requested keys, or null/empty to evaluate all settings features.
 * @param settings - Processed account settings.
 * @returns Distinct feature keys to evaluate.
 */
function resolveFlagKeys(flagNames, settings) {
    if (!flagNames?.length) {
        // Null/empty means evaluate every feature key present in settings.
        return settings
            .getFeatures()
            .map((feature) => feature.getKey())
            .filter((featureKey) => isString(featureKey) && featureKey.trim().length > 0);
    }
    // Deduplicate caller input.
    return Array.from(new Set(flagNames.filter((featureKey) => isString(featureKey) && featureKey.trim())));
}
/**
 * Builds a disabled Flag for an unknown or failed feature key.
 *
 * @param baseContextCopy - Validated plain context used for sessionId and uuid.
 * @returns Disabled Flag instance.
 */
function createDisabledFlag(baseContextCopy) {
    const sessionId = baseContextCopy?.sessionId ?? getCurrentUnixTimestamp();
    const uuid = baseContextCopy?.uuid ?? '';
    return new Flag(false, sessionId, uuid, new VariationModel());
}
/**
 * Ensures every requested key has a Flag entry, filling gaps with disabled Flags.
 *
 * @param requestedFeatureKeys - Feature keys that must appear in the result map.
 * @param evaluatedFlagsByKey - Flags already evaluated successfully.
 * @param baseContextCopy - Validated plain context used to build disabled Flags.
 * @returns Complete flags map keyed by feature key.
 */
function ensureAllRequestedFlags(requestedFeatureKeys, evaluatedFlagsByKey, baseContextCopy) {
    const completeFlagsByKey = { ...evaluatedFlagsByKey };
    const disabledFlag = createDisabledFlag(baseContextCopy);
    for (const featureKey of requestedFeatureKeys) {
        if (!completeFlagsByKey[featureKey]) {
            completeFlagsByKey[featureKey] = disabledFlag;
        }
    }
    return completeFlagsByKey;
}
/**
 * Evaluates one batch sequentially so MEG-linked flags stay ordered within a worker.
 *
 * @param evaluationBatch - Feature keys that must stay sequential within one worker.
 * @param baseContextCopy - Validated plain context object shared across evaluations.
 * @param serviceContainer - Shared SDK service container.
 * @param options - SDK init options used to build per-flag ContextModel instances.
 * @param suppressTrackingCalls - Whether to suppress tracking/impression network calls.
 * @param suppressMAU - Whether to suppress MAU tracking calls.
 * @returns Evaluated flags keyed by feature key for this batch.
 */
async function evaluateBatch(evaluationBatch, baseContextCopy, serviceContainer, options, suppressTrackingCalls, suppressMAU) {
    // Each parallel batch worker gets its own SegmentationManager and hooks decision via ALS.
    return runWithGetFlagsBatchContext(async () => {
        const evaluatedFlagsInBatch = {};
        for (const featureKey of evaluationBatch.featureKeys) {
            // MEG flags in the same batch must stay sequential. Independent batches can run in parallel.
            // Clone context per flag so gateway/segmentation mutations stay isolated.
            const contextModel = new ContextModel().modelFromDictionary({ ...baseContextCopy }, options);
            try {
                // Same evaluation path as single getFlag. Unknown/failed keys become disabled Flags.
                evaluatedFlagsInBatch[featureKey] = await FlagApi.get(featureKey, contextModel, serviceContainer);
            }
            catch {
                evaluatedFlagsInBatch[featureKey] = createDisabledFlag(baseContextCopy);
            }
        }
        return evaluatedFlagsInBatch;
    }, suppressTrackingCalls, suppressMAU);
}
/**
 * Batch feature-flag evaluation used by WingifyClient.getFlags.
 */
export class GetFlagsApi {
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
     * @returns Evaluated flags keyed by feature key (disabled Flag for unknown/failed keys).
     */
    static async get(flagNames, baseContextCopy, serviceContainer, options, shouldSendTrackingCalls = true, // Default to true so that tracking calls are sent in case of getFlags.
    shouldSendMAU = true) {
        const settings = serviceContainer.getSettings();
        const requestedFeatureKeys = resolveFlagKeys(flagNames, settings);
        const suppressTrackingCalls = !shouldSendTrackingCalls; // If shouldSendTrackingCalls is false, suppress tracking calls.
        const suppressMAU = !shouldSendMAU; // If shouldSendMAU is false, suppress MAU calls.
        if (!requestedFeatureKeys.length) {
            return {};
        }
        // Partition requested keys into evaluation batches for getFlags.
        // MEG-linked keys share a batch and independent keys form single-key batches.
        const evaluationBatches = getFeatureFlagBatches(requestedFeatureKeys, settings);
        if (!supportsParallelGetFlagsBatches()) {
            // Browser has no AsyncLocalStorage, so:
            // 1. Serialize getFlags calls via promise queue to prevent concurrent ServiceContainer flag contamination
            // 2. Run batches sequentially within each getFlags call to avoid shared-manager races
            /**
             * Runs browser getFlags evaluation with shared suppress flags and sequential batches.
             *
             * @returns Complete flags map for the requested keys.
             */
            const evaluateFlags = async () => {
                serviceContainer.setSuppressTrackingCalls(suppressTrackingCalls);
                serviceContainer.setSuppressMAU(suppressMAU);
                try {
                    const evaluatedFlagsByKey = {};
                    for (const evaluationBatch of evaluationBatches) {
                        try {
                            Object.assign(evaluatedFlagsByKey, await evaluateBatch(evaluationBatch, baseContextCopy, serviceContainer, options, suppressTrackingCalls, suppressMAU));
                        }
                        catch {
                            // Failed batch keys are filled as disabled Flags below.
                        }
                    }
                    return ensureAllRequestedFlags(requestedFeatureKeys, evaluatedFlagsByKey, baseContextCopy);
                }
                finally {
                    // Reset shared container flags after this getFlags completes
                    serviceContainer.setSuppressTrackingCalls(false);
                    serviceContainer.setSuppressMAU(false);
                }
            };
            // Chain to queue: ignore previous results/errors, then evaluate
            browserGetFlagsQueue = browserGetFlagsQueue.then(() => evaluateFlags(), () => evaluateFlags());
            return browserGetFlagsQueue;
        }
        // On Node (Server-side), start every batch without awaiting so independent batches evaluate in parallel.
        const batchEvaluationOutcomes = await Promise.allSettled(evaluationBatches.map((evaluationBatch) => evaluateBatch(evaluationBatch, baseContextCopy, serviceContainer, options, suppressTrackingCalls, suppressMAU)));
        const evaluatedFlagsByKey = {};
        for (const batchEvaluationOutcome of batchEvaluationOutcomes) {
            if (batchEvaluationOutcome.status === 'fulfilled') {
                // Skip rejected batches instead of failing the whole getFlags call.
                Object.assign(evaluatedFlagsByKey, batchEvaluationOutcome.value);
            }
        }
        // Fill any keys missing from rejected batches with disabled Flags.
        return ensureAllRequestedFlags(requestedFeatureKeys, evaluatedFlagsByKey, baseContextCopy);
    }
}
//# sourceMappingURL=GetFlags.js.map