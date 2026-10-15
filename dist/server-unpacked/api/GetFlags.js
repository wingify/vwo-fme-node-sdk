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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFlagsApi = void 0;
var GetFlag_1 = require("./GetFlag");
var VariationModel_1 = require("../models/campaign/VariationModel");
var ContextModel_1 = require("../models/user/ContextModel");
var GetFlagsBatchContext_1 = require("../services/GetFlagsBatchContext");
var megGroupPartitionUtil_1 = require("../utils/megGroupPartitionUtil");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var FunctionUtil_1 = require("../utils/FunctionUtil");
/**
 * Browser-only promise queue to serialize getFlags calls.
 * Prevents tracking mode contamination when multiple calls execute concurrently without await.
 * On Node, parallel execution is safe due to AsyncLocalStorage isolation.
 */
var browserGetFlagsQueue = Promise.resolve({});
/**
 * Resolves the distinct feature keys to evaluate for getFlags.
 *
 * @param flagNames - Requested keys, or null/empty to evaluate all settings features.
 * @param settings - Processed account settings.
 * @returns Distinct feature keys to evaluate.
 */
function resolveFlagKeys(flagNames, settings) {
    if (!(flagNames === null || flagNames === void 0 ? void 0 : flagNames.length)) {
        // Null/empty means evaluate every feature key present in settings.
        return settings
            .getFeatures()
            .map(function (feature) { return feature.getKey(); })
            .filter(function (featureKey) { return (0, DataTypeUtil_1.isString)(featureKey) && featureKey.trim().length > 0; });
    }
    // Deduplicate caller input.
    return Array.from(new Set(flagNames.filter(function (featureKey) { return (0, DataTypeUtil_1.isString)(featureKey) && featureKey.trim(); })));
}
/**
 * Builds a disabled Flag for an unknown or failed feature key.
 *
 * @param baseContextCopy - Validated plain context used for sessionId and uuid.
 * @returns Disabled Flag instance.
 */
function createDisabledFlag(baseContextCopy) {
    var _a, _b;
    var sessionId = (_a = baseContextCopy === null || baseContextCopy === void 0 ? void 0 : baseContextCopy.sessionId) !== null && _a !== void 0 ? _a : (0, FunctionUtil_1.getCurrentUnixTimestamp)();
    var uuid = (_b = baseContextCopy === null || baseContextCopy === void 0 ? void 0 : baseContextCopy.uuid) !== null && _b !== void 0 ? _b : '';
    return new GetFlag_1.Flag(false, sessionId, uuid, new VariationModel_1.VariationModel());
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
    var completeFlagsByKey = __assign({}, evaluatedFlagsByKey);
    var disabledFlag = createDisabledFlag(baseContextCopy);
    for (var _i = 0, requestedFeatureKeys_1 = requestedFeatureKeys; _i < requestedFeatureKeys_1.length; _i++) {
        var featureKey = requestedFeatureKeys_1[_i];
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
function evaluateBatch(evaluationBatch, baseContextCopy, serviceContainer, options, suppressTrackingCalls, suppressMAU) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            // Each parallel batch worker gets its own SegmentationManager and hooks decision via ALS.
            return [2 /*return*/, (0, GetFlagsBatchContext_1.runWithGetFlagsBatchContext)(function () { return __awaiter(_this, void 0, void 0, function () {
                    var evaluatedFlagsInBatch, _i, _a, featureKey, contextModel, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                evaluatedFlagsInBatch = {};
                                _i = 0, _a = evaluationBatch.featureKeys;
                                _e.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 6];
                                featureKey = _a[_i];
                                contextModel = new ContextModel_1.ContextModel().modelFromDictionary(__assign({}, baseContextCopy), options);
                                _e.label = 2;
                            case 2:
                                _e.trys.push([2, 4, , 5]);
                                // Same evaluation path as single getFlag. Unknown/failed keys become disabled Flags.
                                _b = evaluatedFlagsInBatch;
                                _c = featureKey;
                                return [4 /*yield*/, GetFlag_1.FlagApi.get(featureKey, contextModel, serviceContainer)];
                            case 3:
                                // Same evaluation path as single getFlag. Unknown/failed keys become disabled Flags.
                                _b[_c] = _e.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                _d = _e.sent();
                                evaluatedFlagsInBatch[featureKey] = createDisabledFlag(baseContextCopy);
                                return [3 /*break*/, 5];
                            case 5:
                                _i++;
                                return [3 /*break*/, 1];
                            case 6: return [2 /*return*/, evaluatedFlagsInBatch];
                        }
                    });
                }); }, suppressTrackingCalls, suppressMAU)];
        });
    });
}
/**
 * Batch feature-flag evaluation used by WingifyClient.getFlags.
 */
var GetFlagsApi = /** @class */ (function () {
    function GetFlagsApi() {
    }
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
    GetFlagsApi.get = function (flagNames_1, baseContextCopy_1, serviceContainer_1, options_1) {
        return __awaiter(this, arguments, void 0, function (flagNames, baseContextCopy, serviceContainer, options, shouldSendTrackingCalls, // Default to true so that tracking calls are sent in case of getFlags.
        shouldSendMAU) {
            var settings, requestedFeatureKeys, suppressTrackingCalls, suppressMAU, evaluationBatches, evaluateFlags_1, batchEvaluationOutcomes, evaluatedFlagsByKey, _i, batchEvaluationOutcomes_1, batchEvaluationOutcome;
            var _this = this;
            if (shouldSendTrackingCalls === void 0) { shouldSendTrackingCalls = true; }
            if (shouldSendMAU === void 0) { shouldSendMAU = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = serviceContainer.getSettings();
                        requestedFeatureKeys = resolveFlagKeys(flagNames, settings);
                        suppressTrackingCalls = !shouldSendTrackingCalls;
                        suppressMAU = !shouldSendMAU;
                        if (!requestedFeatureKeys.length) {
                            return [2 /*return*/, {}];
                        }
                        evaluationBatches = (0, megGroupPartitionUtil_1.getFeatureFlagBatches)(requestedFeatureKeys, settings);
                        if (!(0, GetFlagsBatchContext_1.supportsParallelGetFlagsBatches)()) {
                            evaluateFlags_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                var evaluatedFlagsByKey_1, _i, evaluationBatches_1, evaluationBatch, _a, _b, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            serviceContainer.setSuppressTrackingCalls(suppressTrackingCalls);
                                            serviceContainer.setSuppressMAU(suppressMAU);
                                            _e.label = 1;
                                        case 1:
                                            _e.trys.push([1, , 8, 9]);
                                            evaluatedFlagsByKey_1 = {};
                                            _i = 0, evaluationBatches_1 = evaluationBatches;
                                            _e.label = 2;
                                        case 2:
                                            if (!(_i < evaluationBatches_1.length)) return [3 /*break*/, 7];
                                            evaluationBatch = evaluationBatches_1[_i];
                                            _e.label = 3;
                                        case 3:
                                            _e.trys.push([3, 5, , 6]);
                                            _b = (_a = Object).assign;
                                            _c = [evaluatedFlagsByKey_1];
                                            return [4 /*yield*/, evaluateBatch(evaluationBatch, baseContextCopy, serviceContainer, options, suppressTrackingCalls, suppressMAU)];
                                        case 4:
                                            _b.apply(_a, _c.concat([_e.sent()]));
                                            return [3 /*break*/, 6];
                                        case 5:
                                            _d = _e.sent();
                                            return [3 /*break*/, 6];
                                        case 6:
                                            _i++;
                                            return [3 /*break*/, 2];
                                        case 7: return [2 /*return*/, ensureAllRequestedFlags(requestedFeatureKeys, evaluatedFlagsByKey_1, baseContextCopy)];
                                        case 8:
                                            // Reset shared container flags after this getFlags completes
                                            serviceContainer.setSuppressTrackingCalls(false);
                                            serviceContainer.setSuppressMAU(false);
                                            return [7 /*endfinally*/];
                                        case 9: return [2 /*return*/];
                                    }
                                });
                            }); };
                            // Chain to queue: ignore previous results/errors, then evaluate
                            browserGetFlagsQueue = browserGetFlagsQueue.then(function () { return evaluateFlags_1(); }, function () { return evaluateFlags_1(); });
                            return [2 /*return*/, browserGetFlagsQueue];
                        }
                        return [4 /*yield*/, Promise.allSettled(evaluationBatches.map(function (evaluationBatch) {
                                return evaluateBatch(evaluationBatch, baseContextCopy, serviceContainer, options, suppressTrackingCalls, suppressMAU);
                            }))];
                    case 1:
                        batchEvaluationOutcomes = _a.sent();
                        evaluatedFlagsByKey = {};
                        for (_i = 0, batchEvaluationOutcomes_1 = batchEvaluationOutcomes; _i < batchEvaluationOutcomes_1.length; _i++) {
                            batchEvaluationOutcome = batchEvaluationOutcomes_1[_i];
                            if (batchEvaluationOutcome.status === 'fulfilled') {
                                // Skip rejected batches instead of failing the whole getFlags call.
                                Object.assign(evaluatedFlagsByKey, batchEvaluationOutcome.value);
                            }
                        }
                        // Fill any keys missing from rejected batches with disabled Flags.
                        return [2 /*return*/, ensureAllRequestedFlags(requestedFeatureKeys, evaluatedFlagsByKey, baseContextCopy)];
                }
            });
        });
    };
    return GetFlagsApi;
}());
exports.GetFlagsApi = GetFlagsApi;
//# sourceMappingURL=GetFlags.js.map