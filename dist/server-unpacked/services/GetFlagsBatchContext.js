"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsParallelGetFlagsBatches = supportsParallelGetFlagsBatches;
exports.getBatchScopedSegmentationManager = getBatchScopedSegmentationManager;
exports.getCurrentGetFlagsBatchContext = getCurrentGetFlagsBatchContext;
exports.runWithGetFlagsBatchContext = runWithGetFlagsBatchContext;
var SegmentationManger_1 = require("../packages/segmentation-evaluator/core/SegmentationManger");
var getFlagsBatchAsyncLocalStorage = null;
/**
 * Initializes AsyncLocalStorage on Node so getFlags batch workers stay isolated from getFlag().
 *
 * @returns AsyncLocalStorage wrapper when running on Node, otherwise null.
 */
function initGetFlagsBatchAsyncLocalStorage() {
    var _a;
    if (typeof process === 'undefined' || !((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node)) {
        // Browser bundle has no Node async_hooks support.
        return null;
    }
    try {
        // eval('require') keeps browser bundlers from resolving async_hooks at build time.
        var AsyncLocalStorage = eval('require')('async_hooks').AsyncLocalStorage;
        var asyncLocalStorage_1 = new AsyncLocalStorage();
        return {
            run: function (batchWorkerContext, batchEvaluationCallback) {
                return asyncLocalStorage_1.run(batchWorkerContext, batchEvaluationCallback);
            },
            getStore: function () { return asyncLocalStorage_1.getStore(); },
        };
    }
    catch (_b) {
        return null;
    }
}
getFlagsBatchAsyncLocalStorage = initGetFlagsBatchAsyncLocalStorage();
/**
 * Returns true when parallel getFlags batches can run with AsyncLocalStorage isolation.
 *
 * @returns Whether parallel batch evaluation is supported in the current runtime.
 */
function supportsParallelGetFlagsBatches() {
    return getFlagsBatchAsyncLocalStorage !== null;
}
/**
 * Returns the segmentation manager scoped to the current getFlags batch worker, if any.
 *
 * @returns Batch-scoped segmentation manager, or undefined outside getFlags batch evaluation.
 */
function getBatchScopedSegmentationManager() {
    var _a;
    // Undefined outside an active getFlags batch worker.
    return (_a = getFlagsBatchAsyncLocalStorage === null || getFlagsBatchAsyncLocalStorage === void 0 ? void 0 : getFlagsBatchAsyncLocalStorage.getStore()) === null || _a === void 0 ? void 0 : _a.segmentationManager;
}
/**
 * Returns the active getFlags batch worker context, if any.
 *
 * @returns Batch worker context, or undefined outside getFlags batch evaluation.
 */
function getCurrentGetFlagsBatchContext() {
    return getFlagsBatchAsyncLocalStorage === null || getFlagsBatchAsyncLocalStorage === void 0 ? void 0 : getFlagsBatchAsyncLocalStorage.getStore();
}
/**
 * Runs getFlags batch evaluation with an isolated segmentation manager and hooks decision.
 *
 * @param batchEvaluationCallback - Batch evaluation callback to run inside the scoped context.
 * @param suppressTrackingCalls - When true, suppresses tracking/impression network calls for this batch worker.
 * @param suppressMAU - When true, suppresses MAU tracking calls for this batch worker.
 * @returns The callback result.
 */
function runWithGetFlagsBatchContext(batchEvaluationCallback, suppressTrackingCalls, suppressMAU) {
    if (suppressTrackingCalls === void 0) { suppressTrackingCalls = false; }
    if (suppressMAU === void 0) { suppressMAU = false; }
    if (!getFlagsBatchAsyncLocalStorage) {
        // Browser path: no ALS wrapper, caller must keep batches sequential.
        return batchEvaluationCallback();
    }
    return getFlagsBatchAsyncLocalStorage.run({
        // Fresh manager per batch worker.
        segmentationManager: new SegmentationManger_1.SegmentationManager(),
        hooksDecision: null,
        suppressTrackingCalls: suppressTrackingCalls,
        suppressMAU: suppressMAU,
    }, batchEvaluationCallback);
}
//# sourceMappingURL=GetFlagsBatchContext.js.map