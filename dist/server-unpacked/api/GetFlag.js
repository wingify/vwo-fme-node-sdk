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
exports.FlagApi = exports.Flag = void 0;
var StorageDecorator_1 = require("../decorators/StorageDecorator");
var ApiEnum_1 = require("../enums/ApiEnum");
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var log_messages_1 = require("../enums/log-messages");
var CampaignModel_1 = require("../models/campaign/CampaignModel");
var VariableModel_1 = require("../models/campaign/VariableModel");
var VariationModel_1 = require("../models/campaign/VariationModel");
var logger_1 = require("../packages/logger");
var StorageService_1 = require("../services/StorageService");
var CampaignUtil_1 = require("../utils/CampaignUtil");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var DecisionUtil_1 = require("../utils/DecisionUtil");
var FunctionUtil_1 = require("../utils/FunctionUtil");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var PromiseUtil_1 = require("../utils/PromiseUtil");
var RuleEvaluationUtil_1 = require("../utils/RuleEvaluationUtil");
var DebuggerServiceUtil_1 = require("../utils/DebuggerServiceUtil");
var DebuggerCategoryEnum_1 = require("../enums/DebuggerCategoryEnum");
var constants_1 = require("../constants");
var EventDispatchPolicyUtil_1 = require("../utils/EventDispatchPolicyUtil");
var GetFlagsBatchContext_1 = require("../services/GetFlagsBatchContext");
var HoldoutUtil_1 = require("../utils/HoldoutUtil");
var ImpressionUtil_1 = require("../utils/ImpressionUtil");
var DeferredImpressionCollector_1 = require("../utils/DeferredImpressionCollector");
var ImpressionExposureUtil_1 = require("../utils/ImpressionExposureUtil");
var EventEnum_1 = require("../enums/EventEnum");
var NetworkUtil_1 = require("../utils/NetworkUtil");
var Flag = /** @class */ (function () {
    function Flag(isEnabled, sessionId, uuid, variation) {
        this.deferredImpressionPayloads = [];
        this.hasImpressionBeenSent = false;
        this.enabled = isEnabled;
        this.variation = variation;
        this.sessionId = sessionId;
        this.uuid = uuid;
    }
    Flag.prototype.isEnabled = function () {
        return this.enabled;
    };
    Flag.prototype.getSessionId = function () {
        return this.sessionId;
    };
    Flag.prototype.getUUID = function () {
        return this.uuid;
    };
    Flag.prototype.getVariables = function () {
        var _a;
        return ((_a = this.variation) === null || _a === void 0 ? void 0 : _a.getVariables()) || [];
    };
    Flag.prototype.getVariable = function (key, defaultValue) {
        var _a, _b;
        var value = (_b = (_a = this.variation) === null || _a === void 0 ? void 0 : _a.getVariables().find(function (variable) { return VariableModel_1.VariableModel.modelFromDictionary(variable).getKey() === key; })) === null || _b === void 0 ? void 0 : _b.getValue();
        return value !== undefined ? value : defaultValue;
    };
    /**
     * Sends deferred variationShown impressions stashed during fetchFlags.
     * Idempotent: subsequent calls are no-ops after the stash is cleared.
     *
     * @returns {boolean} True when an impression was enqueued or sent, false otherwise.
     */
    Flag.prototype.exposeResult = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Transport and the second-call guard live in the util so Flag stays free of the network stack.
                return [2 /*return*/, (0, ImpressionExposureUtil_1.exposeFlagResult)(this)];
            });
        });
    };
    /**
     * Stores the dependencies needed to send deferred impressions from exposeResult().
     *
     * @internal
     * @param exposeDependencies - Service container, context, and feature key used when exposing.
     * @returns {void}
     */
    Flag.prototype.attachExposeDependencies = function (exposeDependencies) {
        // Keep this flag's enabled state, not whatever the caller passed in.
        this.exposeDependencies = __assign(__assign({}, exposeDependencies), { isEnabled: this.enabled });
    };
    /**
     * Returns the dependencies attached for exposeResult().
     *
     * @internal
     * @returns {ExposeDependencies | undefined} Expose dependencies, or undefined when none were attached (e.g. error flags).
     */
    Flag.prototype.getExposeDependencies = function () {
        return this.exposeDependencies;
    };
    /**
     * Appends deferred variationShown payloads collected during evaluation.
     *
     * @internal
     * @param deferredPayloads - Deferred impression payloads to hold until exposeResult().
     * @returns {void}
     */
    Flag.prototype.addDeferredImpressions = function (deferredPayloads) {
        var _a;
        // An empty list means this rule path produced nothing to expose later.
        if (!(deferredPayloads === null || deferredPayloads === void 0 ? void 0 : deferredPayloads.length)) {
            return;
        }
        (_a = this.deferredImpressionPayloads).push.apply(_a, deferredPayloads);
    };
    /**
     * Returns all held impression payloads and clears the stash.
     *
     * @internal
     * @returns {any[]} Copy of the held impression payloads.
     */
    Flag.prototype.consumeDeferredImpressions = function () {
        // Copy before clearing so the caller still has the payloads after the stash is emptied.
        var consumedPayloads = this.deferredImpressionPayloads.slice();
        // Empty now so a second exposeResult cannot send the same payloads.
        this.deferredImpressionPayloads = [];
        return consumedPayloads;
    };
    /**
     * Marks impressions as sent and clears any held payloads, making exposeResult() a no-op.
     *
     * @internal
     * @returns {void}
     */
    Flag.prototype.markImpressionSent = function () {
        // Later exposeResult calls should no-op even if another payload is added.
        this.hasImpressionBeenSent = true;
        this.deferredImpressionPayloads = [];
    };
    /**
     * Returns whether impressions for this flag were already sent.
     *
     * @internal
     * @returns {boolean} True when impressions were sent during evaluation or by exposeResult().
     */
    Flag.prototype.isImpressionAlreadySent = function () {
        return this.hasImpressionBeenSent;
    };
    /**
     * Returns whether this flag still holds deferred impression payloads.
     *
     * @internal
     * @returns {boolean} True when at least one impression payload is waiting for exposeResult().
     */
    Flag.prototype.hasPendingImpressions = function () {
        return this.deferredImpressionPayloads.length > 0;
    };
    return Flag;
}());
exports.Flag = Flag;
var FlagApi = /** @class */ (function () {
    function FlagApi() {
    }
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
    FlagApi.prepareFlagForExposeResult = function (flag, serviceContainer, context, featureKey, isImpressionDispatchEnabled) {
        // exposeResult needs the same client, user, and feature that produced this decision.
        flag.attachExposeDependencies({
            serviceContainer: serviceContainer,
            context: context,
            featureKey: featureKey,
            isEnabled: flag.isEnabled(),
        });
        var deferredPayloads = (0, DeferredImpressionCollector_1.takeDeferredImpressions)();
        if (deferredPayloads.length > 0) {
            // fetchFlags held these back so exposeResult can send them later.
            flag.addDeferredImpressions(deferredPayloads);
        }
        else if (isImpressionDispatchEnabled) {
            // Nothing left to expose: impressions already went out, or this decision had none.
            flag.markImpressionSent();
        }
        return flag;
    };
    /**
     * Evaluates a feature flag for a user inside a deferred-impression collection scope.
     *
     * @param featureKey - Feature key to evaluate.
     * @param context - User context for the evaluation.
     * @param serviceContainer - Shared SDK service container.
     * @returns {Promise<Flag>} The evaluated flag.
     */
    FlagApi.get = function (featureKey, context, serviceContainer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Keep this feature's deferred payloads separate from any parallel evaluation.
                return [2 /*return*/, (0, DeferredImpressionCollector_1.runWithDeferredImpressionScope)(featureKey, function () {
                        return FlagApi.evaluateFlag(featureKey, context, serviceContainer);
                    })];
            });
        });
    };
    /**
     * Runs the full flag evaluation: stored decisions, holdouts, rollout and experiment rules,
     * impressions, MAU usage tracking, and storage writes.
     *
     * @param featureKey - Feature key to evaluate.
     * @param context - User context for the evaluation.
     * @param serviceContainer - Shared SDK service container.
     * @returns {Promise<Flag>} The evaluated flag, finalized for exposeResult().
     */
    FlagApi.evaluateFlag = function (featureKey, context, serviceContainer) {
        return __awaiter(this, void 0, void 0, function () {
            var isEnabled, rolloutVariationToReturn, experimentVariationToReturn, shouldCheckForExperimentsRules, passedRulesInformation, deferredObject, evaluatedFeatureMap, notInHoldoutIds, batchPayload, isSettingsDevModeEnabled, isUserDevModeEnabled, isDevModeForUser, eventDispatchPolicy, isTrackingSuppressed, isImpressionDispatchEnabled, shouldFireImpressionEvents, isTrackingUsageEnabled, isVariationShownFired, feature, decision, debugEventProps, storageService, storedData, storedIsInHoldoutId, storedNotInHoldoutId, applicableHoldouts, _i, applicableHoldouts_1, holdout, _a, matchedHoldouts, notMatchedHoldouts, holdoutPayloads, updatedHoldoutIds, updatedNotInHoldoutIds, _b, holdoutPayloads_1, payload, variation, variation, updatedNotInHoldoutIds, featureInfo, _c, matchedHoldouts, notMatchedHoldouts, holdoutPayloads, qualifiedHoldoutNames, _d, holdoutPayloads_2, payload, _e, holdoutPayloads_3, payload, rollOutRules, rolloutRulesToEvaluate, _f, rollOutRules_1, rule, evaluateRuleResult, isForceUserApplicable, whitelistedObject, updatedDecision, payload, passedRolloutCampaign, variation, payload, experimentRulesToEvaluate, experimentRules, megGroupWinnerCampaigns, _g, experimentRules_1, rule, _h, preSegmentationResult, whitelistedObject, updatedDecision, payload, campaign, variation, payload, payload, variationToReturn, variationModel;
            var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
            return __generator(this, function (_z) {
                switch (_z.label) {
                    case 0:
                        isEnabled = false;
                        rolloutVariationToReturn = null;
                        experimentVariationToReturn = null;
                        shouldCheckForExperimentsRules = false;
                        passedRulesInformation = {};
                        deferredObject = new PromiseUtil_1.Deferred();
                        evaluatedFeatureMap = new Map();
                        notInHoldoutIds = [];
                        batchPayload = [];
                        isSettingsDevModeEnabled = ((_k = (_j = serviceContainer.getSettings()) === null || _j === void 0 ? void 0 : _j.getDevMode) === null || _k === void 0 ? void 0 : _k.call(_j)) === true;
                        isUserDevModeEnabled = ((_l = context === null || context === void 0 ? void 0 : context.getIsDevMode) === null || _l === void 0 ? void 0 : _l.call(context)) === true;
                        isDevModeForUser = isSettingsDevModeEnabled && isUserDevModeEnabled;
                        eventDispatchPolicy = (0, EventDispatchPolicyUtil_1.getActiveEventDispatchPolicy)(serviceContainer);
                        isTrackingSuppressed = !!(serviceContainer.getSuppressTrackingCalls() || ((_m = (0, GetFlagsBatchContext_1.getCurrentGetFlagsBatchContext)()) === null || _m === void 0 ? void 0 : _m.suppressTrackingCalls));
                        isImpressionDispatchEnabled = !isDevModeForUser && eventDispatchPolicy.shouldDispatchImpressions && !isTrackingSuppressed;
                        shouldFireImpressionEvents = !isDevModeForUser && !isTrackingSuppressed;
                        isTrackingUsageEnabled = ((_p = (_o = serviceContainer.getSettings()) === null || _o === void 0 ? void 0 : _o.getIsTrackingUsageEnabled) === null || _p === void 0 ? void 0 : _p.call(_o)) === true;
                        isVariationShownFired = false;
                        feature = (0, FunctionUtil_1.getFeatureFromKey)(serviceContainer.getSettings(), featureKey);
                        decision = {
                            featureName: feature === null || feature === void 0 ? void 0 : feature.getName(),
                            featureId: feature === null || feature === void 0 ? void 0 : feature.getId(),
                            featureKey: feature === null || feature === void 0 ? void 0 : feature.getKey(),
                            userId: context === null || context === void 0 ? void 0 : context.getId(),
                            api: ApiEnum_1.ApiEnum.GET_FLAG,
                            holdoutIDs: [],
                            isPartOfHoldout: false,
                            isHoldoutPresent: false,
                            isUserPartOfCampaign: false,
                        };
                        debugEventProps = {
                            an: ApiEnum_1.ApiEnum.GET_FLAG,
                            uuid: context.getUuid(),
                            fk: feature === null || feature === void 0 ? void 0 : feature.getKey(),
                            sId: context.getSessionId(),
                        };
                        storageService = new StorageService_1.StorageService(serviceContainer);
                        return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService, serviceContainer)];
                    case 1:
                        storedData = _z.sent();
                        storedIsInHoldoutId = (_q = storedData === null || storedData === void 0 ? void 0 : storedData.isInHoldoutId) !== null && _q !== void 0 ? _q : storedData === null || storedData === void 0 ? void 0 : storedData.holdoutGroupId;
                        storedNotInHoldoutId = (_r = storedData === null || storedData === void 0 ? void 0 : storedData.notInHoldoutId) !== null && _r !== void 0 ? _r : [];
                        if (!(storedIsInHoldoutId && ((0, DataTypeUtil_1.isArray)(storedIsInHoldoutId) ? storedIsInHoldoutId.length > 0 : true))) return [3 /*break*/, 9];
                        applicableHoldouts = (0, HoldoutUtil_1.getApplicableHoldouts)(serviceContainer.getSettings(), feature.getId());
                        if (!(applicableHoldouts.length > 0)) return [3 /*break*/, 9];
                        _i = 0, applicableHoldouts_1 = applicableHoldouts;
                        _z.label = 2;
                    case 2:
                        if (!(_i < applicableHoldouts_1.length)) return [3 /*break*/, 9];
                        holdout = applicableHoldouts_1[_i];
                        if (!storedIsInHoldoutId.includes(holdout.getId())) return [3 /*break*/, 8];
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_HOLDOUT_DECISION_FOUND, {
                            featureKey: featureKey,
                            userId: context.getId(),
                            holdoutId: storedIsInHoldoutId,
                        }));
                        return [4 /*yield*/, (0, HoldoutUtil_1.getMatchedHoldouts)(serviceContainer, feature, context, storedData)];
                    case 3:
                        _a = _z.sent(), matchedHoldouts = _a.matchedHoldouts, notMatchedHoldouts = _a.notMatchedHoldouts, holdoutPayloads = _a.holdoutPayloads;
                        updatedHoldoutIds = __spreadArray(__spreadArray([], storedIsInHoldoutId, true), matchedHoldouts.map(function (holdout) { return holdout.getId(); }), true);
                        updatedNotInHoldoutIds = __spreadArray(__spreadArray([], storedNotInHoldoutId, true), notMatchedHoldouts.map(function (holdout) { return holdout.getId(); }), true);
                        // store the updated holdout ids in storage and push the updated not in holdout ids to the notInHoldoutIds array
                        new StorageDecorator_1.StorageDecorator().setDataInStorage({
                            featureKey: featureKey,
                            context: context,
                            isInHoldoutId: updatedHoldoutIds,
                            notInHoldoutId: updatedNotInHoldoutIds,
                        }, storageService, serviceContainer);
                        if (!shouldFireImpressionEvents) return [3 /*break*/, 7];
                        if (!serviceContainer.getSettingsService().isGatewayServiceProvided) return [3 /*break*/, 4];
                        for (_b = 0, holdoutPayloads_1 = holdoutPayloads; _b < holdoutPayloads_1.length; _b++) {
                            payload = holdoutPayloads_1[_b];
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                        }
                        return [3 /*break*/, 7];
                    case 4:
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, holdoutPayloads)];
                    case 5:
                        _z.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, holdoutPayloads);
                        _z.label = 7;
                    case 7:
                        // Decision served from holdout storage cache.
                        // The cached holdout variationShown is NOT re-fired, so server has no usage tracking signal.
                        // Send usage tracking call before returning.
                        sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey); // fire-and-forget
                        // fetchFlags only: rebuild held impressions from the stored holdout so exposeResult()
                        // still has payloads after a reload. No-op for getFlag / getFlags.
                        if (shouldFireImpressionEvents) {
                            collectStoredDecisionImpressions(serviceContainer, feature, context, storedData, {
                                shouldIncludeExperiment: false,
                                shouldIncludeImpactCampaign: false,
                                isEnabled: false,
                            });
                        }
                        deferredObject.resolve(FlagApi.prepareFlagForExposeResult(new Flag(false, context.getSessionId(), context.getUuid(), new VariationModel_1.VariationModel()), serviceContainer, context, featureKey, isImpressionDispatchEnabled));
                        return [2 /*return*/, deferredObject.promise];
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9:
                        if (!((storedData === null || storedData === void 0 ? void 0 : storedData.featureId) && (0, CampaignUtil_1.isFeatureIdPresentInSettings)(serviceContainer.getSettings(), storedData.featureId))) return [3 /*break*/, 14];
                        if (!(storedData === null || storedData === void 0 ? void 0 : storedData.experimentVariationId)) return [3 /*break*/, 12];
                        if (!storedData.experimentKey) return [3 /*break*/, 11];
                        variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(serviceContainer.getSettings(), storedData.experimentKey, storedData.experimentVariationId);
                        if (!variation) return [3 /*break*/, 11];
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                            variationKey: variation.getKey(),
                            userId: context.getId(),
                            experimentType: 'experiment',
                            experimentKey: storedData.experimentKey,
                        }));
                        decision.isUserPartOfCampaign = true;
                        // network calls for holdouts that are newly added in settings and are not present in storage
                        return [4 /*yield*/, (0, HoldoutUtil_1.sendNetworkCallsForNotInHoldouts)(serviceContainer, feature, context, decision, storedData, storageService)];
                    case 10:
                        // network calls for holdouts that are newly added in settings and are not present in storage
                        _z.sent();
                        // Experiment decision served from storage cache.
                        // variationShown is NOT re-fired for cached decisions, so server has no usage tracking signal.
                        // Send usage tracking call before returning.
                        sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey); // fire-and-forget
                        // fetchFlags only: rebuild held impressions from the stored experiment (plus rollout
                        // and impact, if present) so exposeResult() still has payloads after a reload.
                        // No-op for getFlag / getFlags.
                        if (shouldFireImpressionEvents) {
                            collectStoredDecisionImpressions(serviceContainer, feature, context, storedData, {
                                shouldIncludeExperiment: true,
                                shouldIncludeImpactCampaign: true,
                                isEnabled: true,
                            });
                        }
                        deferredObject.resolve(FlagApi.prepareFlagForExposeResult(new Flag(true, context.getSessionId(), context.getUuid(), variation), serviceContainer, context, featureKey, isImpressionDispatchEnabled));
                        return [2 /*return*/, deferredObject.promise];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        if (!((storedData === null || storedData === void 0 ? void 0 : storedData.rolloutKey) && (storedData === null || storedData === void 0 ? void 0 : storedData.rolloutId))) return [3 /*break*/, 14];
                        variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(serviceContainer.getSettings(), storedData.rolloutKey, storedData.rolloutVariationId);
                        if (!variation) return [3 /*break*/, 14];
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                            variationKey: variation.getKey(),
                            userId: context.getId(),
                            experimentType: 'rollout',
                            experimentKey: storedData.rolloutKey,
                        }));
                        decision.isUserPartOfCampaign = true;
                        serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED, {
                            userId: context.getId(),
                        }));
                        return [4 /*yield*/, (0, HoldoutUtil_1.sendNetworkCallsForNotInHoldouts)(serviceContainer, feature, context, decision, storedData, storageService)];
                    case 13:
                        updatedNotInHoldoutIds = _z.sent();
                        // push the updated not in holdout ids to the notInHoldoutIds array
                        notInHoldoutIds.push.apply(notInHoldoutIds, updatedNotInHoldoutIds);
                        // Rollout decision served from storage cache.
                        // variationShown is NOT re-fired for cached rollout decisions.
                        // Usage tracking call will be dispatched at the end if no other experiment rule matches.
                        isEnabled = true;
                        shouldCheckForExperimentsRules = true;
                        rolloutVariationToReturn = variation;
                        // fetchFlags only: rebuild the stored rollout (and previously stored holdouts).
                        // Experiment rules and the impact campaign are evaluated fresh below, so they are
                        // omitted here. No-op for getFlag / getFlags.
                        if (shouldFireImpressionEvents) {
                            collectStoredDecisionImpressions(serviceContainer, feature, context, storedData, {
                                shouldIncludeExperiment: false,
                                shouldIncludeImpactCampaign: false,
                                isEnabled: true,
                            });
                        }
                        featureInfo = {
                            rolloutId: storedData.rolloutId,
                            rolloutKey: storedData.rolloutKey,
                            rolloutVariationId: storedData.rolloutVariationId,
                        };
                        evaluatedFeatureMap.set(featureKey, featureInfo);
                        Object.assign(passedRulesInformation, featureInfo);
                        _z.label = 14;
                    case 14:
                        if (!(0, DataTypeUtil_1.isObject)(feature) || feature === undefined) {
                            serviceContainer.getLogManager().errorLog('FEATURE_NOT_FOUND', {
                                featureKey: featureKey,
                            }, debugEventProps);
                            // Feature key not found in settings (flag is OFF or not yet created).
                            // No variationShown possible. Send usage tracking call before rejecting.
                            sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey); // fire-and-forget
                            deferredObject.reject({});
                            return [2 /*return*/, deferredObject.promise];
                        }
                        return [4 /*yield*/, serviceContainer.getSegmentationManager().setContextualData(serviceContainer, feature, context)];
                    case 15:
                        _z.sent();
                        if (!!isEnabled) return [3 /*break*/, 22];
                        return [4 /*yield*/, (0, HoldoutUtil_1.getMatchedHoldouts)(serviceContainer, feature, context, storedData)];
                    case 16:
                        _c = _z.sent(), matchedHoldouts = _c.matchedHoldouts, notMatchedHoldouts = _c.notMatchedHoldouts, holdoutPayloads = _c.holdoutPayloads;
                        decision.isPartOfHoldout = matchedHoldouts !== null && matchedHoldouts.length > 0;
                        if ((matchedHoldouts !== null && matchedHoldouts.length > 0) ||
                            (notMatchedHoldouts !== null && notMatchedHoldouts.length > 0)) {
                            decision.isHoldoutPresent = true;
                        }
                        if (!(matchedHoldouts !== null && matchedHoldouts.length > 0)) return [3 /*break*/, 21];
                        qualifiedHoldoutNames = matchedHoldouts.map(function (holdout) { return holdout.getName(); }).join(',');
                        decision.holdoutIDs = matchedHoldouts.map(function (holdout) { return holdout.getId(); });
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_IN_HOLDOUT_GROUP, {
                            userId: context.getId(),
                            holdoutGroupName: qualifiedHoldoutNames,
                            featureKey: featureKey,
                        }));
                        // Store holdout decision in storage
                        new StorageDecorator_1.StorageDecorator().setDataInStorage({
                            featureKey: featureKey,
                            context: context,
                            isInHoldoutId: matchedHoldouts.map(function (holdout) { return holdout.getId(); }),
                            notInHoldoutId: notMatchedHoldouts.map(function (holdout) { return holdout.getId(); }),
                        }, storageService, serviceContainer);
                        decision['isEnabled'] = false;
                        serviceContainer.getHooksService().set(decision);
                        serviceContainer.getHooksService().execute(serviceContainer.getHooksService().get());
                        if (!shouldFireImpressionEvents) return [3 /*break*/, 20];
                        if (!serviceContainer.getSettingsService().isGatewayServiceProvided) return [3 /*break*/, 17];
                        for (_d = 0, holdoutPayloads_2 = holdoutPayloads; _d < holdoutPayloads_2.length; _d++) {
                            payload = holdoutPayloads_2[_d];
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                        }
                        return [3 /*break*/, 20];
                    case 17:
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 19];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, holdoutPayloads)];
                    case 18:
                        _z.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, holdoutPayloads);
                        _z.label = 20;
                    case 20:
                        // Holdout variationShown(variation=1) was fired above — server handles usage tracking.
                        // No explicit usage tracking call needed here.
                        deferredObject.resolve(FlagApi.prepareFlagForExposeResult(new Flag(false, context.getSessionId(), context.getUuid(), new VariationModel_1.VariationModel()), serviceContainer, context, featureKey, isImpressionDispatchEnabled));
                        return [2 /*return*/, deferredObject.promise];
                    case 21:
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_NOT_EXCLUDED_DUE_TO_HOLDOUT, {
                            featureKey: featureKey,
                            userId: context.getId(),
                        }));
                        notInHoldoutIds.push.apply(notInHoldoutIds, notMatchedHoldouts.map(function (holdout) { return holdout.getId(); }));
                        if (shouldFireImpressionEvents) {
                            if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
                                for (_e = 0, holdoutPayloads_3 = holdoutPayloads; _e < holdoutPayloads_3.length; _e++) {
                                    payload = holdoutPayloads_3[_e];
                                    (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                                }
                            }
                            else {
                                batchPayload.push.apply(batchPayload, holdoutPayloads);
                            }
                            // Usage tracking optimization: holdout variationShown(variation=2) was dispatched above.
                            // server will handle usage tracking from that event. Mark flag so Point 4 skips our usage tracking call
                            // to avoid an unnecessary duplicate network round trip.
                            if (holdoutPayloads.length > 0 && isImpressionDispatchEnabled) {
                                isVariationShownFired = true;
                            }
                        }
                        _z.label = 22;
                    case 22:
                        rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT);
                        if (!(rollOutRules.length > 0 && !isEnabled)) return [3 /*break*/, 44];
                        rolloutRulesToEvaluate = [];
                        _f = 0, rollOutRules_1 = rollOutRules;
                        _z.label = 23;
                    case 23:
                        if (!(_f < rollOutRules_1.length)) return [3 /*break*/, 38];
                        rule = rollOutRules_1[_f];
                        return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(serviceContainer, feature, rule, context, evaluatedFeatureMap, null, storageService, decision)];
                    case 24:
                        evaluateRuleResult = _z.sent();
                        isForceUserApplicable = evaluateRuleResult[constants_1.Constants.KEY_FORCED_USER_CHECK];
                        whitelistedObject = evaluateRuleResult.whitelistedObject, updatedDecision = evaluateRuleResult.updatedDecision, payload = evaluateRuleResult.payload;
                        Object.assign(decision, updatedDecision);
                        if (payload && isImpressionDispatchEnabled) {
                            isVariationShownFired = true;
                        }
                        if (!isForceUserApplicable) return [3 /*break*/, 36];
                        if (!((0, DataTypeUtil_1.isObject)(whitelistedObject) && Object.keys(whitelistedObject).length > 0)) return [3 /*break*/, 30];
                        // set the flag to true if the whitelisted object is not null and has some variations
                        isEnabled = true;
                        shouldCheckForExperimentsRules = true;
                        rolloutVariationToReturn = whitelistedObject.variation;
                        decision['isUserPartOfCampaign'] = true;
                        // set the evaluated feature map with the rollout id, rollout key, and rollout variation id
                        evaluatedFeatureMap.set(featureKey, {
                            rolloutId: rule.getId(),
                            rolloutKey: rule.getKey(),
                            rolloutVariationId: whitelistedObject.variationId,
                        });
                        _updateIntegrationsDecisionObject(rule, whitelistedObject.variation, passedRulesInformation, decision);
                        if (!!isDevModeForUser) return [3 /*break*/, 29];
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 28];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 26];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, rule.getId(), whitelistedObject.variationId, context, featureKey, payload)];
                    case 25:
                        _z.sent();
                        return [3 /*break*/, 27];
                    case 26:
                        if (payload != null) {
                            // push payload to batch payload if gateway service is not provided
                            batchPayload.push(payload);
                        }
                        _z.label = 27;
                    case 27: return [3 /*break*/, 29];
                    case 28:
                        // send impression for variation shown
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, rule.getId(), whitelistedObject.variationId, context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                // push payload to batch payload if gateway service is not provided
                                batchPayload.push(payload);
                            }
                        }
                        _z.label = 29;
                    case 29: return [3 /*break*/, 38];
                    case 30:
                        // if pre segment passed, then break the loop and check the traffic allocation
                        rolloutRulesToEvaluate.push(rule);
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 34];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 32];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, rule.getId(), (_s = rule.getVariations()[0]) === null || _s === void 0 ? void 0 : _s.getId(), context, featureKey, payload)];
                    case 31:
                        _z.sent();
                        return [3 /*break*/, 33];
                    case 32:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _z.label = 33;
                    case 33: return [3 /*break*/, 35];
                    case 34:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, rule.getId(), (_t = rule.getVariations()[0]) === null || _t === void 0 ? void 0 : _t.getId(), context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _z.label = 35;
                    case 35:
                        evaluatedFeatureMap.set(featureKey, {
                            rolloutId: rule.getId(),
                            rolloutKey: rule.getKey(),
                            rolloutVariationId: (_u = rule.getVariations()[0]) === null || _u === void 0 ? void 0 : _u.getId(),
                        });
                        return [3 /*break*/, 38];
                    case 36: return [3 /*break*/, 37]; // if rule does not satisfy, then check for other ROLLOUT rules
                    case 37:
                        _f++;
                        return [3 /*break*/, 23];
                    case 38:
                        if (!(rolloutRulesToEvaluate.length > 0)) return [3 /*break*/, 43];
                        passedRolloutCampaign = new CampaignModel_1.CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
                        variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(serviceContainer, passedRolloutCampaign, context);
                        if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 43];
                        isEnabled = true;
                        shouldCheckForExperimentsRules = true;
                        rolloutVariationToReturn = variation;
                        decision['isUserPartOfCampaign'] = true;
                        _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);
                        if (!shouldFireImpressionEvents) return [3 /*break*/, 43];
                        payload = (0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VARIATION_SHOWN, passedRolloutCampaign.getId(), variation.getId(), context);
                        if (payload && isImpressionDispatchEnabled) {
                            isVariationShownFired = true;
                        }
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 42];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 40];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey, payload)];
                    case 39:
                        _z.sent();
                        return [3 /*break*/, 41];
                    case 40:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _z.label = 41;
                    case 41: return [3 /*break*/, 43];
                    case 42:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _z.label = 43;
                    case 43: return [3 /*break*/, 45];
                    case 44:
                        if (rollOutRules.length === 0) {
                            serviceContainer
                                .getLogManager()
                                .debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT));
                            shouldCheckForExperimentsRules = true;
                        }
                        _z.label = 45;
                    case 45:
                        if (!shouldCheckForExperimentsRules) return [3 /*break*/, 61];
                        experimentRulesToEvaluate = [];
                        experimentRules = (0, FunctionUtil_1.getAllExperimentRules)(feature);
                        megGroupWinnerCampaigns = new Map();
                        _g = 0, experimentRules_1 = experimentRules;
                        _z.label = 46;
                    case 46:
                        if (!(_g < experimentRules_1.length)) return [3 /*break*/, 56];
                        rule = experimentRules_1[_g];
                        return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(serviceContainer, feature, rule, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision)];
                    case 47:
                        _h = _z.sent(), preSegmentationResult = _h.preSegmentationResult, whitelistedObject = _h.whitelistedObject, updatedDecision = _h.updatedDecision, payload = _h.payload;
                        Object.assign(decision, updatedDecision);
                        if (payload && isImpressionDispatchEnabled) {
                            isVariationShownFired = true;
                        }
                        if (!preSegmentationResult) return [3 /*break*/, 54];
                        if (!(whitelistedObject === null)) return [3 /*break*/, 48];
                        // whitelistedObject will be null if pre segment passed but whitelisting failed
                        experimentRulesToEvaluate.push(rule);
                        return [3 /*break*/, 53];
                    case 48:
                        isEnabled = true;
                        decision['isUserPartOfCampaign'] = true;
                        experimentVariationToReturn = whitelistedObject.variation;
                        Object.assign(passedRulesInformation, {
                            experimentId: rule.getId(),
                            experimentKey: rule.getKey(),
                            experimentVariationId: whitelistedObject.variationId,
                        });
                        if (!shouldFireImpressionEvents) return [3 /*break*/, 53];
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 52];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 50];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, rule.getId(), whitelistedObject.variationId, context, featureKey, payload)];
                    case 49:
                        _z.sent();
                        return [3 /*break*/, 51];
                    case 50:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _z.label = 51;
                    case 51: return [3 /*break*/, 53];
                    case 52:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, rule.getId(), whitelistedObject.variationId, context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _z.label = 53;
                    case 53: return [3 /*break*/, 56];
                    case 54: return [3 /*break*/, 55];
                    case 55:
                        _g++;
                        return [3 /*break*/, 46];
                    case 56:
                        if (!(experimentRulesToEvaluate.length > 0)) return [3 /*break*/, 61];
                        campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
                        variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(serviceContainer, campaign, context);
                        if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 61];
                        isEnabled = true;
                        decision['isUserPartOfCampaign'] = true;
                        experimentVariationToReturn = variation;
                        _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
                        if (!shouldFireImpressionEvents) return [3 /*break*/, 61];
                        payload = (0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VARIATION_SHOWN, campaign.getId(), variation.getId(), context);
                        if (payload && isImpressionDispatchEnabled) {
                            isVariationShownFired = true;
                        }
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 60];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 58];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, campaign.getId(), variation.getId(), context, featureKey, payload)];
                    case 57:
                        _z.sent();
                        return [3 /*break*/, 59];
                    case 58:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _z.label = 59;
                    case 59: return [3 /*break*/, 61];
                    case 60:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, campaign.getId(), variation.getId(), context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _z.label = 61;
                    case 61:
                        // If flag is enabled, store it in data
                        if (isEnabled) {
                            // set storage data
                            new StorageDecorator_1.StorageDecorator().setDataInStorage(__assign(__assign({ featureKey: featureKey, featureId: feature.getId(), context: context }, passedRulesInformation), { notInHoldoutId: notInHoldoutIds }), storageService, serviceContainer);
                        }
                        else {
                            new StorageDecorator_1.StorageDecorator().setDataInStorage({
                                featureKey: featureKey,
                                context: context,
                                notInHoldoutId: notInHoldoutIds,
                            }, storageService, serviceContainer);
                        }
                        // call integration callback, if defined
                        serviceContainer.getHooksService().set(decision);
                        serviceContainer.getHooksService().execute(serviceContainer.getHooksService().get());
                        // send debug event, if debugger is enabled
                        if (feature.getIsDebuggerEnabled()) {
                            debugEventProps.cg = DebuggerCategoryEnum_1.DebuggerCategoryEnum.DECISION;
                            debugEventProps.lt = logger_1.LogLevelEnum.INFO.toString();
                            debugEventProps.msg_t = constants_1.Constants.FLAG_DECISION_GIVEN;
                            // update debug event props with decision keys
                            _updateDebugEventProps(debugEventProps, decision);
                            // send debug event
                            (0, DebuggerServiceUtil_1.sendDebugEventToWingify)(serviceContainer, debugEventProps);
                        }
                        if (!((_v = feature.getImpactCampaign()) === null || _v === void 0 ? void 0 : _v.getCampaignId())) return [3 /*break*/, 66];
                        if (isImpressionDispatchEnabled) {
                            serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPACT_ANALYSIS, {
                                userId: context.getId(),
                                featureKey: featureKey,
                                status: isEnabled ? 'enabled' : 'disabled',
                            }));
                        }
                        if (!shouldFireImpressionEvents) return [3 /*break*/, 66];
                        payload = (0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VARIATION_SHOWN, (_w = feature.getImpactCampaign()) === null || _w === void 0 ? void 0 : _w.getCampaignId(), isEnabled ? 2 : 1, context);
                        if (payload && isImpressionDispatchEnabled) {
                            isVariationShownFired = true;
                        }
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 65];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 63];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, (_x = feature.getImpactCampaign()) === null || _x === void 0 ? void 0 : _x.getCampaignId(), isEnabled ? 2 : 1, context, featureKey, payload)];
                    case 62:
                        _z.sent();
                        return [3 /*break*/, 64];
                    case 63:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _z.label = 64;
                    case 64: return [3 /*break*/, 66];
                    case 65:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, (_y = feature.getImpactCampaign()) === null || _y === void 0 ? void 0 : _y.getCampaignId(), isEnabled ? 2 : 1, context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _z.label = 66;
                    case 66:
                        if (!!isVariationShownFired) return [3 /*break*/, 69];
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 68];
                        return [4 /*yield*/, sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey, true)];
                    case 67:
                        _z.sent();
                        return [3 /*break*/, 69];
                    case 68:
                        sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey); // fire-and-forget
                        _z.label = 69;
                    case 69:
                        variationToReturn = experimentVariationToReturn !== null && experimentVariationToReturn !== void 0 ? experimentVariationToReturn : rolloutVariationToReturn;
                        variationModel = variationToReturn
                            ? new VariationModel_1.VariationModel().modelFromDictionary(variationToReturn)
                            : new VariationModel_1.VariationModel();
                        if (!(!serviceContainer.getSettingsService().isGatewayServiceProvided && batchPayload.length > 0)) return [3 /*break*/, 72];
                        if (!shouldFireImpressionEvents) return [3 /*break*/, 72];
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 71];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, batchPayload)];
                    case 70:
                        _z.sent();
                        return [3 /*break*/, 72];
                    case 71:
                        (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, batchPayload);
                        _z.label = 72;
                    case 72:
                        deferredObject.resolve(FlagApi.prepareFlagForExposeResult(new Flag(isEnabled, context.getSessionId(), context.getUuid(), variationModel), serviceContainer, context, featureKey, isImpressionDispatchEnabled));
                        return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    return FlagApi;
}());
exports.FlagApi = FlagApi;
// Not PRIVATE methods but helper methods. If need be, move them to some util file to be reused by other API(s)
function _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision) {
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT) {
        Object.assign(passedRulesInformation, {
            rolloutId: campaign.getId(),
            rolloutKey: campaign.getKey(),
            rolloutVariationId: variation.getId(),
        });
    }
    else {
        Object.assign(passedRulesInformation, {
            experimentId: campaign.getId(),
            experimentKey: campaign.getKey(),
            experimentVariationId: variation.getId(),
        });
    }
    Object.assign(decision, passedRulesInformation);
}
/**
 * Update debug event props with decision keys
 * @param debugEventProps - Debug event props
 * @param decision - Decision
 */
function _updateDebugEventProps(debugEventProps, decision) {
    var decisionKeys = (0, DebuggerServiceUtil_1.extractDecisionKeys)(decision);
    var message = "Flag decision given for feature:".concat(decision.featureKey, ".");
    if (decision.rolloutKey && decision.rolloutVariationId) {
        message += " Got rollout:".concat(decision.rolloutKey.substring((decision.featureKey + '_').length), " with variation:").concat(decision.rolloutVariationId);
    }
    if (decision.experimentKey && decision.experimentVariationId) {
        message += " and experiment:".concat(decision.experimentKey.substring((decision.featureKey + '_').length), " with variation:").concat(decision.experimentVariationId);
    }
    debugEventProps.msg = message;
    Object.assign(debugEventProps, decisionKeys);
}
/**
 * Rebuilds variationShown payloads for a decision served from storage and collects them
 * for Flag.exposeResult().
 *
 * Only fetchFlags uses this. Impressions are deferred there, so a stored decision would
 * otherwise leave exposeResult() with nothing to send after a reload. getFlag / getFlags
 * dispatch impressions immediately, so this returns without collecting anything on those paths.
 *
 * Campaigns, variations, or holdouts that are no longer in settings are skipped.
 *
 * @param serviceContainer - Shared SDK service container.
 * @param feature - Feature being evaluated; used for holdouts and the impact campaign.
 * @param context - User context for the evaluation.
 * @param storedData - Decision previously written to storage for this user and feature.
 * @param options - Which stored campaigns to rebuild. Experiment and impact are omitted
 *   on the stored-rollout path because those are evaluated fresh afterwards.
 * @returns {void}
 */
function collectStoredDecisionImpressions(serviceContainer, feature, context, storedData, options) {
    var _a, _b, _c, _d, _e;
    // Immediate-dispatch APIs (getFlag / getFlags) must keep skipping stored-path impressions.
    if ((0, EventDispatchPolicyUtil_1.getActiveEventDispatchPolicy)(serviceContainer).shouldDispatchImpressions) {
        return;
    }
    // Without an active collector there is nowhere to hold the payloads until exposeResult().
    if (!(0, DeferredImpressionCollector_1.hasDeferredImpressionScope)() || !storedData || !feature) {
        return;
    }
    var settings = serviceContainer.getSettings();
    // Rebuild only holdouts already decided for this user. Holdouts added after the decision
    // was stored are collected by the existing holdout evaluation above.
    var storedInHoldoutIds = (_b = (_a = storedData.isInHoldoutId) !== null && _a !== void 0 ? _a : storedData.holdoutGroupId) !== null && _b !== void 0 ? _b : [];
    var storedNotInHoldoutIds = (_c = storedData.notInHoldoutId) !== null && _c !== void 0 ? _c : [];
    for (var _i = 0, _f = (0, HoldoutUtil_1.getApplicableHoldouts)(settings, feature.getId()); _i < _f.length; _i++) {
        var holdout = _f[_i];
        var holdoutId = holdout.getId();
        if (storedInHoldoutIds.includes(holdoutId)) {
            // This user was already decided into the holdout, so rebuild that impression for exposeResult.
            (0, DeferredImpressionCollector_1.collectDeferredImpression)((0, NetworkUtil_1.createHoldoutPayload)(serviceContainer, EventEnum_1.EventEnum.VARIATION_SHOWN, holdoutId, constants_1.Constants.VARIATION_IS_PART_OF_HOLDOUT, context, feature.getId()));
            // If the user is not in the holdout, collect the payload for the holdout not part of holdout event.
        }
        else if (storedNotInHoldoutIds.includes(holdoutId)) {
            (0, DeferredImpressionCollector_1.collectDeferredImpression)((0, NetworkUtil_1.createHoldoutPayload)(serviceContainer, EventEnum_1.EventEnum.VARIATION_SHOWN, holdoutId, constants_1.Constants.VARIATION_NOT_PART_OF_HOLDOUT, context, feature.getId()));
        }
    }
    // If the user is in the rollout, collect the payload for the rollout variation shown event.
    if (storedData.rolloutId && storedData.rolloutVariationId) {
        // Skip a stored rollout that was removed from settings.
        if ((0, CampaignUtil_1.getCampaignKeyFromCampaignId)(settings, storedData.rolloutId)) {
            (0, DeferredImpressionCollector_1.collectDeferredImpression)((0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VARIATION_SHOWN, storedData.rolloutId, storedData.rolloutVariationId, context));
        }
    }
    // If the user is in the experiment, collect the payload for the experiment variation shown event.
    if (options.shouldIncludeExperiment && storedData.experimentId && storedData.experimentVariationId) {
        // Skip a stored experiment that was removed from settings.
        if ((0, CampaignUtil_1.getCampaignKeyFromCampaignId)(settings, storedData.experimentId)) {
            (0, DeferredImpressionCollector_1.collectDeferredImpression)((0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VARIATION_SHOWN, storedData.experimentId, storedData.experimentVariationId, context));
        }
    }
    // If the user is in the impact campaign, collect the payload for the impact campaign variation shown event.
    var impactCampaignId = (_e = (_d = feature.getImpactCampaign()) === null || _d === void 0 ? void 0 : _d.getCampaignId) === null || _e === void 0 ? void 0 : _e.call(_d);
    if (options.shouldIncludeImpactCampaign && impactCampaignId) {
        (0, DeferredImpressionCollector_1.collectDeferredImpression)((0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VARIATION_SHOWN, impactCampaignId, options.isEnabled ? 2 : 1, context));
    }
}
/**
 * Sends the usage tracking payload to server.
 * Called whenever a user is evaluated via getFlag() but no variationShown event is
 * dispatched by the SDK for that evaluation (decision from storage cache, flag=false, etc.).
 *
 * Routes through BatchEventsQueue when configured, otherwise fire-and-forget
 * (or awaited when shouldAwait is true).
 *
 * @param serviceContainer - The service container instance.
 * @param context - The user context model.
 * @param isTrackingUsageEnabled - Whether usage tracking is active for this account.
 * @param shouldFireImpressionEvents - Whether tracking/impression network calls should be dispatched.
 * @param featureKey - Feature key being evaluated, used for logging.
 * @param shouldAwait - When true, awaits the network call (for shouldWaitForTrackingCalls flows).
 * @returns {Promise<void>} Resolves once the usage tracking call is enqueued or sent.
 */
function sendTrackingUsage(serviceContainer_1, context_1, isTrackingUsageEnabled_1, shouldFireImpressionEvents_1, featureKey_1) {
    return __awaiter(this, arguments, void 0, function (serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey, shouldAwait) {
        var eventDispatchPolicy, isTrackingSuppressed, isMAUSuppressed, trackingPayload, properties;
        var _a, _b;
        if (shouldAwait === void 0) { shouldAwait = false; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    eventDispatchPolicy = (0, EventDispatchPolicyUtil_1.getActiveEventDispatchPolicy)(serviceContainer);
                    isTrackingSuppressed = !!(serviceContainer.getSuppressTrackingCalls() || ((_a = (0, GetFlagsBatchContext_1.getCurrentGetFlagsBatchContext)()) === null || _a === void 0 ? void 0 : _a.suppressTrackingCalls));
                    isMAUSuppressed = !!(serviceContainer.getSuppressMAU() || ((_b = (0, GetFlagsBatchContext_1.getCurrentGetFlagsBatchContext)()) === null || _b === void 0 ? void 0 : _b.suppressMAU));
                    // Account setting, the MAU toggle, and getFlags suppressMAU can each block this call.
                    if (!isTrackingUsageEnabled || !eventDispatchPolicy.shouldDispatchUsageEvents || isMAUSuppressed)
                        return [2 /*return*/];
                    // Skip MAU in dev mode. Still send it for fetchFlags (policy blocks impressions) and for getFlags tracking suppression.
                    if (!shouldFireImpressionEvents && eventDispatchPolicy.shouldDispatchImpressions && !isTrackingSuppressed)
                        return [2 /*return*/];
                    trackingPayload = (0, NetworkUtil_1.getTrackingUsagePayloadData)(serviceContainer, context);
                    serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USAGE_TRACKING_CALL_SENT, {
                        accountId: serviceContainer.getSettingsService().accountId.toString(),
                        userId: context.getId(),
                        featureKey: featureKey,
                    }));
                    if (!serviceContainer.getBatchEventsQueue()) return [3 /*break*/, 1];
                    serviceContainer.getBatchEventsQueue().enqueue(trackingPayload);
                    return [3 /*break*/, 8];
                case 1:
                    if (!serviceContainer.getSettingsService().isGatewayServiceProvided) return [3 /*break*/, 5];
                    properties = (0, NetworkUtil_1.getEventsBaseProperties)(serviceContainer.getSettingsService(), EventEnum_1.EventEnum.USER_EVALUATED, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
                    if (!shouldAwait) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(serviceContainer, properties, trackingPayload, context.getId())];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    (0, NetworkUtil_1.sendPostApiRequest)(serviceContainer, properties, trackingPayload, context.getId()); // fire-and-forget
                    _c.label = 4;
                case 4: return [3 /*break*/, 8];
                case 5:
                    if (!shouldAwait) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, [trackingPayload])];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, [trackingPayload]); // fire-and-forget
                    _c.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=GetFlag.js.map