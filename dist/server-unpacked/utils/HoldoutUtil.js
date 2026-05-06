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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNetworkCallsForNotInHoldouts = exports.getMatchedHoldouts = exports.getApplicableHoldouts = void 0;
var decision_maker_1 = require("../packages/decision-maker");
var LogMessageUtil_1 = require("./LogMessageUtil");
var log_messages_1 = require("../enums/log-messages");
var NetworkUtil_1 = require("./NetworkUtil");
var EventEnum_1 = require("../enums/EventEnum");
var ImpressionUtil_1 = require("./ImpressionUtil");
var index_1 = require("../constants/index");
var StorageDecorator_1 = require("../decorators/StorageDecorator");
/**
 * Gets the applicable holdouts for a given feature ID.
 * @param settings - The settings object.
 * @param featureId - The feature ID.
 * @returns The applicable holdouts.
 */
function getApplicableHoldouts(settings, featureId) {
    var holdouts = settings.getHoldouts() || [];
    // filter the holdouts to only include global holdouts and holdouts that have the given feature ID
    return holdouts.filter(function (holdout) { return holdout.getIsGlobal() || holdout.getFeatureIds().includes(featureId); });
}
exports.getApplicableHoldouts = getApplicableHoldouts;
/**
 * Gets the matched holdout(s) for a given feature ID and context.
 * Evaluates all applicable holdouts, creates batched impressions for all of them,
 * and returns all matched holdouts (i.e. holdouts the user is part of).
 * @param settings - The settings object.
 * @param feature - The feature object.
 * @param context - The context object.
 * @returns The matched holdouts or null if no holdout is matched.
 */
function getMatchedHoldouts(serviceContainer, feature, context, storedData) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, isInHoldoutIds, notInHoldoutIds, alreadyEvaluatedHoldoutIds, featureId, applicableHoldouts, notMatchedHoldouts, matchedHoldouts, holdoutPayloads, _i, applicableHoldouts_1, holdout, segments, segmentPass, variationId, isInHoldout, hashKey, bucket, payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    settings = serviceContainer.getSettings();
                    isInHoldoutIds = (_a = storedData === null || storedData === void 0 ? void 0 : storedData.isInHoldoutId) !== null && _a !== void 0 ? _a : [];
                    notInHoldoutIds = (_b = storedData === null || storedData === void 0 ? void 0 : storedData.notInHoldoutId) !== null && _b !== void 0 ? _b : [];
                    alreadyEvaluatedHoldoutIds = __spreadArray(__spreadArray([], isInHoldoutIds, true), notInHoldoutIds, true);
                    featureId = feature.getId();
                    applicableHoldouts = getApplicableHoldouts(settings, featureId);
                    notMatchedHoldouts = [];
                    // if there are no applicable holdouts, return null
                    if (!applicableHoldouts.length)
                        return [2 /*return*/, { matchedHoldouts: [], notMatchedHoldouts: [], holdoutPayloads: [] }];
                    matchedHoldouts = [];
                    holdoutPayloads = [];
                    _i = 0, applicableHoldouts_1 = applicableHoldouts;
                    _c.label = 1;
                case 1:
                    if (!(_i < applicableHoldouts_1.length)) return [3 /*break*/, 6];
                    holdout = applicableHoldouts_1[_i];
                    if (alreadyEvaluatedHoldoutIds.includes(holdout.getId())) {
                        serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.HOLDOUT_SKIP_EVALUATION, {
                            holdoutId: holdout.getId(),
                            reason: "user ".concat(context.getId(), " was already evaluated for feature with id: ").concat(featureId, "; SKIP decision making altogether."),
                        }));
                        return [3 /*break*/, 5];
                    }
                    segments = holdout.getSegments() || {};
                    segmentPass = true;
                    if (!(segments && Object.keys(segments).length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, serviceContainer
                            .getSegmentationManager()
                            .validateSegmentation(segments, context.getCustomVariables())];
                case 2:
                    segmentPass = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.HOLDOUT_SEGMENTATION_SKIP, {
                        holdoutId: holdout.getId(),
                        userId: context.getId(),
                    }));
                    _c.label = 4;
                case 4:
                    variationId = void 0;
                    isInHoldout = false;
                    // if the segmentation fails, user is NOT IN holdout (variationId = 2)
                    if (!segmentPass) {
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.HOLDOUT_SEGMENTATION_FAIL, {
                            userId: context.getId(),
                            holdoutGroupName: holdout.getName(),
                        }));
                        variationId = index_1.Constants.VARIATION_NOT_PART_OF_HOLDOUT; // NOT IN holdout
                        notMatchedHoldouts.push(holdout);
                    }
                    else {
                        hashKey = "".concat(settings.getAccountId(), "_").concat(holdout.getId(), "_").concat(context.getId());
                        bucket = new decision_maker_1.DecisionMaker().getBucketValueForUser(hashKey, 100);
                        // If bucket is within percentTraffic, user is IN holdout (variationId = 1)
                        // Otherwise, user is NOT IN holdout (variationId = 2)
                        isInHoldout = bucket !== 0 && bucket <= holdout.getPercentTraffic();
                        variationId = isInHoldout ? index_1.Constants.VARIATION_IS_PART_OF_HOLDOUT : index_1.Constants.VARIATION_NOT_PART_OF_HOLDOUT;
                        // Add all matched holdouts (user is IN)
                        if (isInHoldout) {
                            serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.HOLDOUT_SHOULD_EXCLUDE_USER, {
                                userId: context.getId(),
                                bucketValue: bucket,
                                holdoutGroupName: holdout.getName(),
                                percentTraffic: holdout.getPercentTraffic(),
                                featureId: featureId,
                            }));
                            matchedHoldouts.push(holdout);
                        }
                        else {
                            serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.HOLDOUT_SHOULD_NOT_EXCLUDE_USER, {
                                userId: context.getId(),
                                holdoutGroupName: holdout.getName(),
                                featureId: featureId,
                            }));
                            notMatchedHoldouts.push(holdout);
                        }
                    }
                    payload = (0, NetworkUtil_1.createHoldoutPayload)(serviceContainer, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, holdout.getId(), // campaignId is the holdoutId
                    variationId, // 1 if IN holdout, 2 if NOT IN holdout
                    context, featureId);
                    holdoutPayloads.push(payload);
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, {
                        matchedHoldouts: matchedHoldouts,
                        notMatchedHoldouts: notMatchedHoldouts,
                        holdoutPayloads: holdoutPayloads,
                    }];
            }
        });
    });
}
exports.getMatchedHoldouts = getMatchedHoldouts;
/**
 * Sends network calls for not in holdouts that are applicable but not stored in storage.
 * @param serviceContainer - The service container.
 * @param feature - The feature model.
 * @param context - The context model.
 * @param storedData - The stored data.
 * @param storageService - The storage service.
 */
function sendNetworkCallsForNotInHoldouts(serviceContainer, feature, context, decision, storedData, storageService) {
    return __awaiter(this, void 0, void 0, function () {
        var applicableHoldouts, updatedNotInHoldoutIds, isInHoldoutIds, batchPayload, initialNotInHoldoutCount, _i, applicableHoldouts_2, holdout, payload, response;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    applicableHoldouts = getApplicableHoldouts(serviceContainer.getSettings(), feature.getId());
                    updatedNotInHoldoutIds = __spreadArray([], ((_a = storedData === null || storedData === void 0 ? void 0 : storedData.notInHoldoutId) !== null && _a !== void 0 ? _a : []), true);
                    isInHoldoutIds = __spreadArray([], ((_b = storedData === null || storedData === void 0 ? void 0 : storedData.isInHoldoutId) !== null && _b !== void 0 ? _b : []), true);
                    batchPayload = [];
                    initialNotInHoldoutCount = updatedNotInHoldoutIds.length;
                    if (applicableHoldouts.length > 0) {
                        decision.isHoldoutPresent = true;
                    }
                    _i = 0, applicableHoldouts_2 = applicableHoldouts;
                    _c.label = 1;
                case 1:
                    if (!(_i < applicableHoldouts_2.length)) return [3 /*break*/, 6];
                    holdout = applicableHoldouts_2[_i];
                    if (!(!(updatedNotInHoldoutIds === null || updatedNotInHoldoutIds === void 0 ? void 0 : updatedNotInHoldoutIds.includes(holdout.getId())) && !(isInHoldoutIds === null || isInHoldoutIds === void 0 ? void 0 : isInHoldoutIds.includes(holdout.getId())))) return [3 /*break*/, 5];
                    //update the holdout ids in storage
                    updatedNotInHoldoutIds.push(holdout.getId());
                    payload = (0, NetworkUtil_1.createHoldoutPayload)(serviceContainer, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, holdout.getId(), index_1.Constants.VARIATION_NOT_PART_OF_HOLDOUT, context, feature.getId());
                    if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 4];
                    response = (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, holdout.getId(), index_1.Constants.VARIATION_NOT_PART_OF_HOLDOUT, context, feature.getKey(), payload);
                    if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 3];
                    return [4 /*yield*/, response];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    if (payload != null) {
                        batchPayload.push(payload);
                    }
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (updatedNotInHoldoutIds.length > initialNotInHoldoutCount) {
                        new StorageDecorator_1.StorageDecorator().setDataInStorage({ featureKey: feature.getKey(), context: context, notInHoldoutId: updatedNotInHoldoutIds }, storageService, serviceContainer);
                    }
                    if (!(batchPayload.length > 0)) return [3 /*break*/, 9];
                    if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, batchPayload)];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, batchPayload);
                    _c.label = 9;
                case 9: return [2 /*return*/, updatedNotInHoldoutIds];
            }
        });
    });
}
exports.sendNetworkCallsForNotInHoldouts = sendNetworkCallsForNotInHoldouts;
//# sourceMappingURL=HoldoutUtil.js.map