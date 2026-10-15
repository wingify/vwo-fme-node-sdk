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
import { SegmentationManager } from '../packages/segmentation-evaluator/core/SegmentationManger';
interface GetFlagsBatchWorkerContext {
  segmentationManager: SegmentationManager;
  hooksDecision: Record<string, any> | null;
  suppressTrackingCalls: boolean;
  suppressMAU: boolean;
}
/**
 * Returns true when parallel getFlags batches can run with AsyncLocalStorage isolation.
 *
 * @returns Whether parallel batch evaluation is supported in the current runtime.
 */
export declare function supportsParallelGetFlagsBatches(): boolean;
/**
 * Returns the segmentation manager scoped to the current getFlags batch worker, if any.
 *
 * @returns Batch-scoped segmentation manager, or undefined outside getFlags batch evaluation.
 */
export declare function getBatchScopedSegmentationManager(): SegmentationManager | undefined;
/**
 * Returns the active getFlags batch worker context, if any.
 *
 * @returns Batch worker context, or undefined outside getFlags batch evaluation.
 */
export declare function getCurrentGetFlagsBatchContext(): GetFlagsBatchWorkerContext | undefined;
/**
 * Runs getFlags batch evaluation with an isolated segmentation manager and hooks decision.
 *
 * @param batchEvaluationCallback - Batch evaluation callback to run inside the scoped context.
 * @param suppressTrackingCalls - When true, suppresses tracking/impression network calls for this batch worker.
 * @param suppressMAU - When true, suppresses MAU tracking calls for this batch worker.
 * @returns The callback result.
 */
export declare function runWithGetFlagsBatchContext<T>(
  batchEvaluationCallback: () => T,
  suppressTrackingCalls?: boolean,
  suppressMAU?: boolean,
): T;
export {};
