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
var HoldoutUtil_1 = require("../utils/HoldoutUtil");
var ImpressionUtil_1 = require("../utils/ImpressionUtil");
var EventEnum_1 = require("../enums/EventEnum");
var NetworkUtil_1 = require("../utils/NetworkUtil");
var Flag = /** @class */ (function () {
    function Flag(isEnabled, sessionId, uuid, variation) {
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
    return Flag;
}());
exports.Flag = Flag;
var FlagApi = /** @class */ (function () {
    function FlagApi() {
    }
    FlagApi.get = function (featureKey, context, serviceContainer) {
        return __awaiter(this, void 0, void 0, function () {
            var isEnabled, rolloutVariationToReturn, experimentVariationToReturn, shouldCheckForExperimentsRules, passedRulesInformation, deferredObject, evaluatedFeatureMap, notInHoldoutIds, batchPayload, feature, decision, debugEventProps, storageService, storedData, storedIsInHoldoutId, storedNotInHoldoutId, applicableHoldouts, _i, applicableHoldouts_1, holdout, _a, matchedHoldouts, notMatchedHoldouts, holdoutPayloads, updatedHoldoutIds, updatedNotInHoldoutIds, _b, holdoutPayloads_1, payload, _c, holdoutPayloads_2, payload, variation, variation, updatedNotInHoldoutIds, featureInfo, _d, matchedHoldouts, notMatchedHoldouts, holdoutPayloads, qualifiedHoldoutNames, _e, holdoutPayloads_3, payload, _f, holdoutPayloads_4, payload, _g, holdoutPayloads_5, payload, _h, holdoutPayloads_6, payload, rollOutRules, rolloutRulesToEvaluate, _j, rollOutRules_1, rule, _k, preSegmentationResult, updatedDecision, payload, passedRolloutCampaign, variation, payload, experimentRulesToEvaluate, experimentRules, megGroupWinnerCampaigns, _l, experimentRules_1, rule, _m, preSegmentationResult, whitelistedObject, updatedDecision, campaign, variation, payload, payload;
            var _o, _p, _q, _r, _s, _t, _u, _v, _w;
            return __generator(this, function (_x) {
                switch (_x.label) {
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
                        storedData = _x.sent();
                        storedIsInHoldoutId = (_o = storedData === null || storedData === void 0 ? void 0 : storedData.isInHoldoutId) !== null && _o !== void 0 ? _o : storedData === null || storedData === void 0 ? void 0 : storedData.holdoutGroupId;
                        storedNotInHoldoutId = (_p = storedData === null || storedData === void 0 ? void 0 : storedData.notInHoldoutId) !== null && _p !== void 0 ? _p : [];
                        if (!(storedIsInHoldoutId && ((0, DataTypeUtil_1.isArray)(storedIsInHoldoutId) ? storedIsInHoldoutId.length > 0 : true))) return [3 /*break*/, 10];
                        applicableHoldouts = (0, HoldoutUtil_1.getApplicableHoldouts)(serviceContainer.getSettings(), feature.getId());
                        if (!(applicableHoldouts.length > 0)) return [3 /*break*/, 10];
                        _i = 0, applicableHoldouts_1 = applicableHoldouts;
                        _x.label = 2;
                    case 2:
                        if (!(_i < applicableHoldouts_1.length)) return [3 /*break*/, 10];
                        holdout = applicableHoldouts_1[_i];
                        if (!storedIsInHoldoutId.includes(holdout.getId())) return [3 /*break*/, 9];
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_HOLDOUT_DECISION_FOUND, {
                            featureKey: featureKey,
                            userId: context.getId(),
                            holdoutId: storedIsInHoldoutId,
                        }));
                        return [4 /*yield*/, (0, HoldoutUtil_1.getMatchedHoldouts)(serviceContainer, feature, context, storedData)];
                    case 3:
                        _a = _x.sent(), matchedHoldouts = _a.matchedHoldouts, notMatchedHoldouts = _a.notMatchedHoldouts, holdoutPayloads = _a.holdoutPayloads;
                        updatedHoldoutIds = __spreadArray(__spreadArray([], storedIsInHoldoutId, true), matchedHoldouts.map(function (holdout) { return holdout.getId(); }), true);
                        updatedNotInHoldoutIds = __spreadArray(__spreadArray([], storedNotInHoldoutId, true), notMatchedHoldouts.map(function (holdout) { return holdout.getId(); }), true);
                        // store the updated holdout ids in storage and push the updated not in holdout ids to the notInHoldoutIds array
                        new StorageDecorator_1.StorageDecorator().setDataInStorage({
                            featureKey: featureKey,
                            context: context,
                            isInHoldoutId: updatedHoldoutIds,
                            notInHoldoutId: updatedNotInHoldoutIds,
                        }, storageService, serviceContainer);
                        if (!serviceContainer.getSettingsService().isGatewayServiceProvided) return [3 /*break*/, 4];
                        for (_b = 0, holdoutPayloads_1 = holdoutPayloads; _b < holdoutPayloads_1.length; _b++) {
                            payload = holdoutPayloads_1[_b];
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                        }
                        return [3 /*break*/, 8];
                    case 4:
                        if (!serviceContainer.getBatchEventsQueue()) return [3 /*break*/, 5];
                        for (_c = 0, holdoutPayloads_2 = holdoutPayloads; _c < holdoutPayloads_2.length; _c++) {
                            payload = holdoutPayloads_2[_c];
                            serviceContainer.getBatchEventsQueue().enqueue(payload);
                        }
                        return [3 /*break*/, 8];
                    case 5:
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, holdoutPayloads)];
                    case 6:
                        _x.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, holdoutPayloads);
                        _x.label = 8;
                    case 8:
                        deferredObject.resolve(new Flag(false, context.getSessionId(), context.getUuid(), new VariationModel_1.VariationModel()));
                        return [2 /*return*/, deferredObject.promise];
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10:
                        if (!((storedData === null || storedData === void 0 ? void 0 : storedData.featureId) && (0, CampaignUtil_1.isFeatureIdPresentInSettings)(serviceContainer.getSettings(), storedData.featureId))) return [3 /*break*/, 15];
                        if (!(storedData === null || storedData === void 0 ? void 0 : storedData.experimentVariationId)) return [3 /*break*/, 13];
                        if (!storedData.experimentKey) return [3 /*break*/, 12];
                        variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(serviceContainer.getSettings(), storedData.experimentKey, storedData.experimentVariationId);
                        if (!variation) return [3 /*break*/, 12];
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                            variationKey: variation.getKey(),
                            userId: context.getId(),
                            experimentType: 'experiment',
                            experimentKey: storedData.experimentKey,
                        }));
                        decision.isUserPartOfCampaign = true;
                        // network calls for holdouts that are newly added in settings and are not present in storage
                        return [4 /*yield*/, (0, HoldoutUtil_1.sendNetworkCallsForNotInHoldouts)(serviceContainer, feature, context, decision, storedData, storageService)];
                    case 11:
                        // network calls for holdouts that are newly added in settings and are not present in storage
                        _x.sent();
                        deferredObject.resolve(new Flag(true, context.getSessionId(), context.getUuid(), variation));
                        return [2 /*return*/, deferredObject.promise];
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        if (!((storedData === null || storedData === void 0 ? void 0 : storedData.rolloutKey) && (storedData === null || storedData === void 0 ? void 0 : storedData.rolloutId))) return [3 /*break*/, 15];
                        variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(serviceContainer.getSettings(), storedData.rolloutKey, storedData.rolloutVariationId);
                        if (!variation) return [3 /*break*/, 15];
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
                    case 14:
                        updatedNotInHoldoutIds = _x.sent();
                        // push the updated not in holdout ids to the notInHoldoutIds array
                        notInHoldoutIds.push.apply(notInHoldoutIds, updatedNotInHoldoutIds);
                        isEnabled = true;
                        shouldCheckForExperimentsRules = true;
                        rolloutVariationToReturn = variation;
                        featureInfo = {
                            rolloutId: storedData.rolloutId,
                            rolloutKey: storedData.rolloutKey,
                            rolloutVariationId: storedData.rolloutVariationId,
                        };
                        evaluatedFeatureMap.set(featureKey, featureInfo);
                        Object.assign(passedRulesInformation, featureInfo);
                        _x.label = 15;
                    case 15:
                        if (!(0, DataTypeUtil_1.isObject)(feature) || feature === undefined) {
                            serviceContainer.getLogManager().errorLog('FEATURE_NOT_FOUND', {
                                featureKey: featureKey,
                            }, debugEventProps);
                            deferredObject.reject({});
                            return [2 /*return*/, deferredObject.promise];
                        }
                        return [4 /*yield*/, serviceContainer.getSegmentationManager().setContextualData(serviceContainer, feature, context)];
                    case 16:
                        _x.sent();
                        if (!!isEnabled) return [3 /*break*/, 24];
                        return [4 /*yield*/, (0, HoldoutUtil_1.getMatchedHoldouts)(serviceContainer, feature, context, storedData)];
                    case 17:
                        _d = _x.sent(), matchedHoldouts = _d.matchedHoldouts, notMatchedHoldouts = _d.notMatchedHoldouts, holdoutPayloads = _d.holdoutPayloads;
                        decision.isPartOfHoldout = matchedHoldouts !== null && matchedHoldouts.length > 0;
                        if ((matchedHoldouts !== null && matchedHoldouts.length > 0) ||
                            (notMatchedHoldouts !== null && notMatchedHoldouts.length > 0)) {
                            decision.isHoldoutPresent = true;
                        }
                        if (!(matchedHoldouts !== null && matchedHoldouts.length > 0)) return [3 /*break*/, 23];
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
                        if (!serviceContainer.getSettingsService().isGatewayServiceProvided) return [3 /*break*/, 18];
                        for (_e = 0, holdoutPayloads_3 = holdoutPayloads; _e < holdoutPayloads_3.length; _e++) {
                            payload = holdoutPayloads_3[_e];
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                        }
                        return [3 /*break*/, 22];
                    case 18:
                        if (!serviceContainer.getBatchEventsQueue()) return [3 /*break*/, 19];
                        for (_f = 0, holdoutPayloads_4 = holdoutPayloads; _f < holdoutPayloads_4.length; _f++) {
                            payload = holdoutPayloads_4[_f];
                            serviceContainer.getBatchEventsQueue().enqueue(payload);
                        }
                        return [3 /*break*/, 22];
                    case 19:
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 21];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, holdoutPayloads)];
                    case 20:
                        _x.sent();
                        return [3 /*break*/, 22];
                    case 21:
                        (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, holdoutPayloads);
                        _x.label = 22;
                    case 22:
                        deferredObject.resolve(new Flag(false, context.getSessionId(), context.getUuid(), new VariationModel_1.VariationModel()));
                        return [2 /*return*/, deferredObject.promise];
                    case 23:
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_NOT_EXCLUDED_DUE_TO_HOLDOUT, {
                            featureKey: featureKey,
                            userId: context.getId(),
                        }));
                        notInHoldoutIds.push.apply(notInHoldoutIds, notMatchedHoldouts.map(function (holdout) { return holdout.getId(); }));
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
                            for (_g = 0, holdoutPayloads_5 = holdoutPayloads; _g < holdoutPayloads_5.length; _g++) {
                                payload = holdoutPayloads_5[_g];
                                (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                            }
                        }
                        else if (serviceContainer.getBatchEventsQueue()) {
                            for (_h = 0, holdoutPayloads_6 = holdoutPayloads; _h < holdoutPayloads_6.length; _h++) {
                                payload = holdoutPayloads_6[_h];
                                serviceContainer.getBatchEventsQueue().enqueue(payload);
                            }
                        }
                        else {
                            batchPayload.push.apply(batchPayload, holdoutPayloads);
                        }
                        _x.label = 24;
                    case 24:
                        rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT);
                        if (!(rollOutRules.length > 0 && !isEnabled)) return [3 /*break*/, 40];
                        rolloutRulesToEvaluate = [];
                        _j = 0, rollOutRules_1 = rollOutRules;
                        _x.label = 25;
                    case 25:
                        if (!(_j < rollOutRules_1.length)) return [3 /*break*/, 34];
                        rule = rollOutRules_1[_j];
                        return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(serviceContainer, feature, rule, context, evaluatedFeatureMap, null, storageService, decision)];
                    case 26:
                        _k = _x.sent(), preSegmentationResult = _k.preSegmentationResult, updatedDecision = _k.updatedDecision, payload = _k.payload;
                        Object.assign(decision, updatedDecision);
                        if (!preSegmentationResult) return [3 /*break*/, 32];
                        // if pre segment passed, then break the loop and check the traffic allocation
                        rolloutRulesToEvaluate.push(rule);
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 30];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 28];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, rule.getId(), (_q = rule.getVariations()[0]) === null || _q === void 0 ? void 0 : _q.getId(), context, featureKey, payload)];
                    case 27:
                        _x.sent();
                        return [3 /*break*/, 29];
                    case 28:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _x.label = 29;
                    case 29: return [3 /*break*/, 31];
                    case 30:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, rule.getId(), (_r = rule.getVariations()[0]) === null || _r === void 0 ? void 0 : _r.getId(), context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _x.label = 31;
                    case 31:
                        evaluatedFeatureMap.set(featureKey, {
                            rolloutId: rule.getId(),
                            rolloutKey: rule.getKey(),
                            rolloutVariationId: (_s = rule.getVariations()[0]) === null || _s === void 0 ? void 0 : _s.getId(),
                        });
                        return [3 /*break*/, 34];
                    case 32: return [3 /*break*/, 33]; // if rule does not satisfy, then check for other ROLLOUT rules
                    case 33:
                        _j++;
                        return [3 /*break*/, 25];
                    case 34:
                        if (!(rolloutRulesToEvaluate.length > 0)) return [3 /*break*/, 39];
                        passedRolloutCampaign = new CampaignModel_1.CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
                        variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(serviceContainer, passedRolloutCampaign, context.getId());
                        if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 39];
                        isEnabled = true;
                        shouldCheckForExperimentsRules = true;
                        rolloutVariationToReturn = variation;
                        decision['isUserPartOfCampaign'] = true;
                        _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);
                        payload = (0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, passedRolloutCampaign.getId(), variation.getId(), context);
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 38];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 36];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey, payload)];
                    case 35:
                        _x.sent();
                        return [3 /*break*/, 37];
                    case 36:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _x.label = 37;
                    case 37: return [3 /*break*/, 39];
                    case 38:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _x.label = 39;
                    case 39: return [3 /*break*/, 41];
                    case 40:
                        if (rollOutRules.length === 0) {
                            serviceContainer.getLogManager().debug(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT);
                            shouldCheckForExperimentsRules = true;
                        }
                        _x.label = 41;
                    case 41:
                        if (!shouldCheckForExperimentsRules) return [3 /*break*/, 50];
                        experimentRulesToEvaluate = [];
                        experimentRules = (0, FunctionUtil_1.getAllExperimentRules)(feature);
                        megGroupWinnerCampaigns = new Map();
                        _l = 0, experimentRules_1 = experimentRules;
                        _x.label = 42;
                    case 42:
                        if (!(_l < experimentRules_1.length)) return [3 /*break*/, 45];
                        rule = experimentRules_1[_l];
                        return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(serviceContainer, feature, rule, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision)];
                    case 43:
                        _m = _x.sent(), preSegmentationResult = _m.preSegmentationResult, whitelistedObject = _m.whitelistedObject, updatedDecision = _m.updatedDecision;
                        Object.assign(decision, updatedDecision);
                        if (preSegmentationResult) {
                            if (whitelistedObject === null) {
                                // whitelistedObject will be null if pre segment passed but whitelisting failed
                                experimentRulesToEvaluate.push(rule);
                            }
                            else {
                                isEnabled = true;
                                decision['isUserPartOfCampaign'] = true;
                                experimentVariationToReturn = whitelistedObject.variation;
                                Object.assign(passedRulesInformation, {
                                    experimentId: rule.getId(),
                                    experimentKey: rule.getKey(),
                                    experimentVariationId: whitelistedObject.variationId,
                                });
                            }
                            return [3 /*break*/, 45];
                        }
                        return [3 /*break*/, 44];
                    case 44:
                        _l++;
                        return [3 /*break*/, 42];
                    case 45:
                        if (!(experimentRulesToEvaluate.length > 0)) return [3 /*break*/, 50];
                        campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
                        variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(serviceContainer, campaign, context.getId());
                        if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 50];
                        isEnabled = true;
                        decision['isUserPartOfCampaign'] = true;
                        experimentVariationToReturn = variation;
                        _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
                        payload = (0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, campaign.getId(), variation.getId(), context);
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 49];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 47];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, campaign.getId(), variation.getId(), context, featureKey, payload)];
                    case 46:
                        _x.sent();
                        return [3 /*break*/, 48];
                    case 47:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _x.label = 48;
                    case 48: return [3 /*break*/, 50];
                    case 49:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, campaign.getId(), variation.getId(), context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _x.label = 50;
                    case 50:
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
                            (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(serviceContainer, debugEventProps);
                        }
                        if (!((_t = feature.getImpactCampaign()) === null || _t === void 0 ? void 0 : _t.getCampaignId())) return [3 /*break*/, 55];
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPACT_ANALYSIS, {
                            userId: context.getId(),
                            featureKey: featureKey,
                            status: isEnabled ? 'enabled' : 'disabled',
                        }));
                        payload = (0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, (_u = feature.getImpactCampaign()) === null || _u === void 0 ? void 0 : _u.getCampaignId(), isEnabled ? 2 : 1, context);
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 54];
                        if (!(serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null)) return [3 /*break*/, 52];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, (_v = feature.getImpactCampaign()) === null || _v === void 0 ? void 0 : _v.getCampaignId(), isEnabled ? 2 : 1, context, featureKey, payload)];
                    case 51:
                        _x.sent();
                        return [3 /*break*/, 53];
                    case 52:
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                        _x.label = 53;
                    case 53: return [3 /*break*/, 55];
                    case 54:
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            (0, ImpressionUtil_1.sendImpressionForVariationShown)(serviceContainer, (_w = feature.getImpactCampaign()) === null || _w === void 0 ? void 0 : _w.getCampaignId(), isEnabled ? 2 : 1, context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                        _x.label = 55;
                    case 55:
                        deferredObject.resolve(new Flag(isEnabled, context.getSessionId(), context.getUuid(), new VariationModel_1.VariationModel().modelFromDictionary(experimentVariationToReturn !== null && experimentVariationToReturn !== void 0 ? experimentVariationToReturn : rolloutVariationToReturn)));
                        if (!(!serviceContainer.getSettingsService().isGatewayServiceProvided && batchPayload.length > 0)) return [3 /*break*/, 58];
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 57];
                        return [4 /*yield*/, (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, batchPayload)];
                    case 56:
                        _x.sent();
                        return [3 /*break*/, 58];
                    case 57:
                        (0, ImpressionUtil_1.sendImpressionForVariationShownInBatch)(serviceContainer, batchPayload);
                        _x.label = 58;
                    case 58: return [2 /*return*/, deferredObject.promise];
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
//# sourceMappingURL=GetFlag.js.map