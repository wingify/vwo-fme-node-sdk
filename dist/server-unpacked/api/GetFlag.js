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
var ImpressionUtil_1 = require("../utils/ImpressionUtil");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var PromiseUtil_1 = require("../utils/PromiseUtil");
var RuleEvaluationUtil_1 = require("../utils/RuleEvaluationUtil");
var DebuggerServiceUtil_1 = require("../utils/DebuggerServiceUtil");
var DebuggerCategoryEnum_1 = require("../enums/DebuggerCategoryEnum");
var constants_1 = require("../constants");
var CampaignUtil_2 = require("../utils/CampaignUtil");
var Flag = /** @class */ (function () {
    function Flag(isEnabled, sessionId, variation) {
        this.enabled = isEnabled;
        this.variation = variation;
        this.sessionId = sessionId;
    }
    Flag.prototype.isEnabled = function () {
        return this.enabled;
    };
    Flag.prototype.getSessionId = function () {
        return this.sessionId;
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
            var isEnabled, rolloutVariationToReturn, experimentVariationToReturn, shouldCheckForExperimentsRules, passedRulesInformation, deferredObject, evaluatedFeatureMap, feature, decision, debugEventProps, storageService, storedData, variation, variation, featureInfo, rollOutRules, rolloutRulesToEvaluate, _i, rollOutRules_1, rule, _a, preSegmentationResult, updatedDecision, passedRolloutCampaign, variation, experimentRulesToEvaluate, experimentRules, megGroupWinnerCampaigns, _b, experimentRules_1, rule, _c, preSegmentationResult, whitelistedObject, updatedDecision, campaign, variation;
            var _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        isEnabled = false;
                        rolloutVariationToReturn = null;
                        experimentVariationToReturn = null;
                        shouldCheckForExperimentsRules = false;
                        passedRulesInformation = {};
                        deferredObject = new PromiseUtil_1.Deferred();
                        evaluatedFeatureMap = new Map();
                        feature = (0, FunctionUtil_1.getFeatureFromKey)(serviceContainer.getSettings(), featureKey);
                        decision = {
                            featureName: feature === null || feature === void 0 ? void 0 : feature.getName(),
                            featureId: feature === null || feature === void 0 ? void 0 : feature.getId(),
                            featureKey: feature === null || feature === void 0 ? void 0 : feature.getKey(),
                            userId: context === null || context === void 0 ? void 0 : context.getId(),
                            api: ApiEnum_1.ApiEnum.GET_FLAG,
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
                        storedData = _h.sent();
                        if ((storedData === null || storedData === void 0 ? void 0 : storedData.featureId) && (0, CampaignUtil_2.isFeatureIdPresentInSettings)(serviceContainer.getSettings(), storedData.featureId)) {
                            if (storedData === null || storedData === void 0 ? void 0 : storedData.experimentVariationId) {
                                if (storedData.experimentKey) {
                                    variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(serviceContainer.getSettings(), storedData.experimentKey, storedData.experimentVariationId);
                                    if (variation) {
                                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                                            variationKey: variation.getKey(),
                                            userId: context.getId(),
                                            experimentType: 'experiment',
                                            experimentKey: storedData.experimentKey,
                                        }));
                                        deferredObject.resolve(new Flag(true, context.getSessionId(), variation));
                                        return [2 /*return*/, deferredObject.promise];
                                    }
                                }
                            }
                            else if ((storedData === null || storedData === void 0 ? void 0 : storedData.rolloutKey) && (storedData === null || storedData === void 0 ? void 0 : storedData.rolloutId)) {
                                variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(serviceContainer.getSettings(), storedData.rolloutKey, storedData.rolloutVariationId);
                                if (variation) {
                                    serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                                        variationKey: variation.getKey(),
                                        userId: context.getId(),
                                        experimentType: 'rollout',
                                        experimentKey: storedData.rolloutKey,
                                    }));
                                    serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED, {
                                        userId: context.getId(),
                                    }));
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
                                }
                            }
                        }
                        if (!(0, DataTypeUtil_1.isObject)(feature) || feature === undefined) {
                            serviceContainer.getLogManager().errorLog('FEATURE_NOT_FOUND', {
                                featureKey: featureKey,
                            }, debugEventProps);
                            deferredObject.reject({});
                            return [2 /*return*/, deferredObject.promise];
                        }
                        // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
                        return [4 /*yield*/, serviceContainer.getSegmentationManager().setContextualData(serviceContainer, feature, context)];
                    case 2:
                        // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
                        _h.sent();
                        rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT);
                        if (!(rollOutRules.length > 0 && !isEnabled)) return [3 /*break*/, 10];
                        rolloutRulesToEvaluate = [];
                        _i = 0, rollOutRules_1 = rollOutRules;
                        _h.label = 3;
                    case 3:
                        if (!(_i < rollOutRules_1.length)) return [3 /*break*/, 6];
                        rule = rollOutRules_1[_i];
                        return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(serviceContainer, feature, rule, context, evaluatedFeatureMap, null, storageService, decision)];
                    case 4:
                        _a = _h.sent(), preSegmentationResult = _a.preSegmentationResult, updatedDecision = _a.updatedDecision;
                        Object.assign(decision, updatedDecision);
                        if (preSegmentationResult) {
                            // if pre segment passed, then break the loop and check the traffic allocation
                            rolloutRulesToEvaluate.push(rule);
                            evaluatedFeatureMap.set(featureKey, {
                                rolloutId: rule.getId(),
                                rolloutKey: rule.getKey(),
                                rolloutVariationId: (_d = rule.getVariations()[0]) === null || _d === void 0 ? void 0 : _d.getId(),
                            });
                            return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 5]; // if rule does not satisfy, then check for other ROLLOUT rules
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!(rolloutRulesToEvaluate.length > 0)) return [3 /*break*/, 9];
                        passedRolloutCampaign = new CampaignModel_1.CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
                        variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(serviceContainer, passedRolloutCampaign, context.getId());
                        if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 9];
                        isEnabled = true;
                        shouldCheckForExperimentsRules = true;
                        rolloutVariationToReturn = variation;
                        _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey)];
                    case 7:
                        _h.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey);
                        _h.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (rollOutRules.length === 0) {
                            serviceContainer.getLogManager().debug(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT);
                            shouldCheckForExperimentsRules = true;
                        }
                        _h.label = 11;
                    case 11:
                        if (!shouldCheckForExperimentsRules) return [3 /*break*/, 18];
                        experimentRulesToEvaluate = [];
                        experimentRules = (0, FunctionUtil_1.getAllExperimentRules)(feature);
                        megGroupWinnerCampaigns = new Map();
                        _b = 0, experimentRules_1 = experimentRules;
                        _h.label = 12;
                    case 12:
                        if (!(_b < experimentRules_1.length)) return [3 /*break*/, 15];
                        rule = experimentRules_1[_b];
                        return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(serviceContainer, feature, rule, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision)];
                    case 13:
                        _c = _h.sent(), preSegmentationResult = _c.preSegmentationResult, whitelistedObject = _c.whitelistedObject, updatedDecision = _c.updatedDecision;
                        Object.assign(decision, updatedDecision);
                        if (preSegmentationResult) {
                            if (whitelistedObject === null) {
                                // whitelistedObject will be null if pre segment passed but whitelisting failed
                                experimentRulesToEvaluate.push(rule);
                            }
                            else {
                                isEnabled = true;
                                experimentVariationToReturn = whitelistedObject.variation;
                                Object.assign(passedRulesInformation, {
                                    experimentId: rule.getId(),
                                    experimentKey: rule.getKey(),
                                    experimentVariationId: whitelistedObject.variationId,
                                });
                            }
                            return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 14];
                    case 14:
                        _b++;
                        return [3 /*break*/, 12];
                    case 15:
                        if (!(experimentRulesToEvaluate.length > 0)) return [3 /*break*/, 18];
                        campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
                        variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(serviceContainer, campaign, context.getId());
                        if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 18];
                        isEnabled = true;
                        experimentVariationToReturn = variation;
                        _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 17];
                        return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(serviceContainer, campaign.getId(), variation.getId(), context, featureKey)];
                    case 16:
                        _h.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(serviceContainer, campaign.getId(), variation.getId(), context, featureKey);
                        _h.label = 18;
                    case 18:
                        // If flag is enabled, store it in data
                        if (isEnabled) {
                            // set storage data
                            new StorageDecorator_1.StorageDecorator().setDataInStorage(__assign({ featureKey: featureKey, featureId: feature.getId(), context: context }, passedRulesInformation), storageService, serviceContainer);
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
                        if (!((_e = feature.getImpactCampaign()) === null || _e === void 0 ? void 0 : _e.getCampaignId())) return [3 /*break*/, 21];
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPACT_ANALYSIS, {
                            userId: context.getId(),
                            featureKey: featureKey,
                            status: isEnabled ? 'enabled' : 'disabled',
                        }));
                        if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 20];
                        return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(serviceContainer, (_f = feature.getImpactCampaign()) === null || _f === void 0 ? void 0 : _f.getCampaignId(), isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
                            context, featureKey)];
                    case 19:
                        _h.sent();
                        return [3 /*break*/, 21];
                    case 20:
                        (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(serviceContainer, (_g = feature.getImpactCampaign()) === null || _g === void 0 ? void 0 : _g.getCampaignId(), isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
                        context, featureKey);
                        _h.label = 21;
                    case 21:
                        deferredObject.resolve(new Flag(isEnabled, context.getSessionId(), new VariationModel_1.VariationModel().modelFromDictionary(experimentVariationToReturn !== null && experimentVariationToReturn !== void 0 ? experimentVariationToReturn : rolloutVariationToReturn)));
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
//# sourceMappingURL=GetFlag.js.map