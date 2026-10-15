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
import { SegmentationManager } from '../packages/segmentation-evaluator/core/SegmentationManger.js';
let getFlagsBatchAsyncLocalStorage = null;
/**
 * Initializes AsyncLocalStorage on Node so getFlags batch workers stay isolated from getFlag().
 *
 * @returns AsyncLocalStorage wrapper when running on Node, otherwise null.
 */
function initGetFlagsBatchAsyncLocalStorage() {
    if (typeof process === 'undefined' || !process.versions?.node) {
        // Browser bundle has no Node async_hooks support.
        return null;
    }
    try {
        // eval('require') keeps browser bundlers from resolving async_hooks at build time.
        const { AsyncLocalStorage } = eval('require')('async_hooks');
        const asyncLocalStorage = new AsyncLocalStorage();
        return {
            run: (batchWorkerContext, batchEvaluationCallback) => asyncLocalStorage.run(batchWorkerContext, batchEvaluationCallback),
            getStore: () => asyncLocalStorage.getStore(),
        };
    }
    catch {
        return null;
    }
}
getFlagsBatchAsyncLocalStorage = initGetFlagsBatchAsyncLocalStorage();
/**
 * Returns true when parallel getFlags batches can run with AsyncLocalStorage isolation.
 *
 * @returns Whether parallel batch evaluation is supported in the current runtime.
 */
export function supportsParallelGetFlagsBatches() {
    return getFlagsBatchAsyncLocalStorage !== null;
}
/**
 * Returns the segmentation manager scoped to the current getFlags batch worker, if any.
 *
 * @returns Batch-scoped segmentation manager, or undefined outside getFlags batch evaluation.
 */
export function getBatchScopedSegmentationManager() {
    // Undefined outside an active getFlags batch worker.
    return getFlagsBatchAsyncLocalStorage?.getStore()?.segmentationManager;
}
/**
 * Returns the active getFlags batch worker context, if any.
 *
 * @returns Batch worker context, or undefined outside getFlags batch evaluation.
 */
export function getCurrentGetFlagsBatchContext() {
    return getFlagsBatchAsyncLocalStorage?.getStore();
}
/**
 * Runs getFlags batch evaluation with an isolated segmentation manager and hooks decision.
 *
 * @param batchEvaluationCallback - Batch evaluation callback to run inside the scoped context.
 * @param suppressTrackingCalls - When true, suppresses tracking/impression network calls for this batch worker.
 * @param suppressMAU - When true, suppresses MAU tracking calls for this batch worker.
 * @returns The callback result.
 */
export function runWithGetFlagsBatchContext(batchEvaluationCallback, suppressTrackingCalls = false, suppressMAU = false) {
    if (!getFlagsBatchAsyncLocalStorage) {
        // Browser path: no ALS wrapper, caller must keep batches sequential.
        return batchEvaluationCallback();
    }
    return getFlagsBatchAsyncLocalStorage.run({
        // Fresh manager per batch worker.
        segmentationManager: new SegmentationManager(),
        hooksDecision: null,
        suppressTrackingCalls,
        suppressMAU,
    }, batchEvaluationCallback);
}
//# sourceMappingURL=GetFlagsBatchContext.js.map