"use strict";
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
exports.evaluateGroups = void 0;
exports.getFeatureKeysFromGroup = getFeatureKeysFromGroup;
/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
var constants_1 = require("../constants");
var StorageDecorator_1 = require("../decorators/StorageDecorator");
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var log_messages_1 = require("../enums/log-messages");
var CampaignModel_1 = require("../models/campaign/CampaignModel");
var VariationModel_1 = require("../models/campaign/VariationModel");
var decision_maker_1 = require("../packages/decision-maker");
var logger_1 = require("../packages/logger");
var CampaignDecisionService_1 = require("../services/CampaignDecisionService");
var RuleEvaluationUtil_1 = require("../utils/RuleEvaluationUtil");
var CampaignUtil_1 = require("./CampaignUtil");
var DataTypeUtil_1 = require("./DataTypeUtil");
var DecisionUtil_1 = require("./DecisionUtil");
var FunctionUtil_1 = require("./FunctionUtil");
var LogMessageUtil_1 = require("./LogMessageUtil");
/**
 * Evaluates groups for a given feature and group ID.
 *
 * @param settings - The settings model.
 * @param feature - The feature model to evaluate.
 * @param groupId - The ID of the group.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to the evaluation result.
 */
var evaluateGroups = function (settings, feature, groupId, evaluatedFeatureMap, context, storageService) { return __awaiter(void 0, void 0, void 0, function () {
    var featureToSkip, campaignMap, _a, featureKeys, groupCampaignIds, _loop_1, _i, featureKeys_1, featureKey, _b, eligibleCampaigns, eligibleCampaignsWithStorage;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                featureToSkip = [];
                campaignMap = new Map();
                _a = getFeatureKeysFromGroup(settings, groupId), featureKeys = _a.featureKeys, groupCampaignIds = _a.groupCampaignIds;
                _loop_1 = function (featureKey) {
                    var feature_1, isRolloutRulePassed;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                feature_1 = (0, FunctionUtil_1.getFeatureFromKey)(settings, featureKey);
                                // check if the feature is already evaluated
                                if (featureToSkip.includes(featureKey)) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, _isRolloutRuleForFeaturePassed(settings, feature_1, evaluatedFeatureMap, featureToSkip, storageService, context)];
                            case 1:
                                isRolloutRulePassed = _d.sent();
                                if (isRolloutRulePassed) {
                                    settings.getFeatures().forEach(function (feature) {
                                        if (feature.getKey() === featureKey) {
                                            feature.getRulesLinkedCampaign().forEach(function (rule) {
                                                if (groupCampaignIds.includes(rule.getId().toString()) ||
                                                    groupCampaignIds.includes("".concat(rule.getId(), "_").concat(rule.getVariations()[0].getId()).toString())) {
                                                    if (!campaignMap.has(featureKey)) {
                                                        campaignMap.set(featureKey, []);
                                                    }
                                                    // check if the campaign is already present in the campaignMap for the feature
                                                    if (campaignMap.get(featureKey).findIndex(function (item) { return item.ruleKey === rule.getRuleKey(); }) === -1) {
                                                        campaignMap.get(featureKey).push(rule);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, featureKeys_1 = featureKeys;
                _c.label = 1;
            case 1:
                if (!(_i < featureKeys_1.length)) return [3 /*break*/, 4];
                featureKey = featureKeys_1[_i];
                return [5 /*yield**/, _loop_1(featureKey)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [4 /*yield*/, _getEligbleCampaigns(settings, campaignMap, context, storageService)];
            case 5:
                _b = _c.sent(), eligibleCampaigns = _b.eligibleCampaigns, eligibleCampaignsWithStorage = _b.eligibleCampaignsWithStorage;
                return [4 /*yield*/, _findWinnerCampaignAmongEligibleCampaigns(settings, feature.getKey(), eligibleCampaigns, eligibleCampaignsWithStorage, groupId, context, storageService)];
            case 6: return [2 /*return*/, _c.sent()];
        }
    });
}); };
exports.evaluateGroups = evaluateGroups;
/**
 * Retrieves feature keys associated with a group based on the group ID.
 *
 * @param settings - The settings model.
 * @param groupId - The ID of the group.
 * @returns An object containing feature keys and group campaign IDs.
 */
function getFeatureKeysFromGroup(settings, groupId) {
    var groupCampaignIds = (0, CampaignUtil_1.getCampaignsByGroupId)(settings, groupId);
    var featureKeys = (0, CampaignUtil_1.getFeatureKeysFromCampaignIds)(settings, groupCampaignIds);
    return { featureKeys: featureKeys, groupCampaignIds: groupCampaignIds };
}
/*******************************
 * PRIVATE methods - MegUtil
 ******************************/
/**
 * Evaluates the feature rollout rules for a given feature.
 *
 * @param settings - The settings model.
 * @param feature - The feature model to evaluate.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param featureToSkip - An array of features to skip during evaluation.
 * @param storageService - The storage service.
 * @param context - The context model.
 * @returns A promise that resolves to true if the feature passes the rollout rules, false otherwise.
 */
var _isRolloutRuleForFeaturePassed = function (settings, feature, evaluatedFeatureMap, featureToSkip, storageService, context) { return __awaiter(void 0, void 0, void 0, function () {
    var rollOutRules, ruleToTestForTraffic, _i, rollOutRules_1, rule, preSegmentationResult, campaign, variation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (evaluatedFeatureMap.has(feature.getKey()) && 'rolloutId' in evaluatedFeatureMap.get(feature.getKey())) {
                    return [2 /*return*/, true];
                }
                rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT);
                if (!(rollOutRules.length > 0)) return [3 /*break*/, 5];
                ruleToTestForTraffic = null;
                _i = 0, rollOutRules_1 = rollOutRules;
                _a.label = 1;
            case 1:
                if (!(_i < rollOutRules_1.length)) return [3 /*break*/, 4];
                rule = rollOutRules_1[_i];
                return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, null, storageService, {})];
            case 2:
                preSegmentationResult = (_a.sent()).preSegmentationResult;
                if (preSegmentationResult) {
                    ruleToTestForTraffic = rule;
                    return [3 /*break*/, 4];
                }
                return [3 /*break*/, 3];
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                if (ruleToTestForTraffic !== null) {
                    campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(ruleToTestForTraffic);
                    variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, campaign, context.getId());
                    if ((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0) {
                        evaluatedFeatureMap.set(feature.getKey(), {
                            rolloutId: ruleToTestForTraffic.id,
                            rolloutKey: ruleToTestForTraffic.key,
                            rolloutVariationId: ruleToTestForTraffic.variations[0].id,
                        });
                        return [2 /*return*/, true];
                    }
                }
                // no rollout rule passed
                featureToSkip.push(feature.getKey());
                return [2 /*return*/, false];
            case 5:
                // no rollout rule, evaluate experiments
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_SKIP_ROLLOUT_EVALUATE_EXPERIMENTS, {
                    featureKey: feature.getKey(),
                }));
                return [2 /*return*/, true];
        }
    });
}); };
/**
 * Retrieves eligible campaigns based on the provided campaign map and context.
 *
 * @param settings - The settings model.
 * @param campaignMap - A map containing feature keys and corresponding campaigns.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to an object containing eligible campaigns, campaigns with storage, and ineligible campaigns.
 */
var _getEligbleCampaigns = function (settings, campaignMap, context, storageService) { return __awaiter(void 0, void 0, void 0, function () {
    var eligibleCampaigns, eligibleCampaignsWithStorage, inEligibleCampaigns, campaignMapArray, _i, campaignMapArray_1, _a, featureKey, campaigns, _loop_2, _b, campaigns_1, campaign;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                eligibleCampaigns = [];
                eligibleCampaignsWithStorage = [];
                inEligibleCampaigns = [];
                campaignMapArray = Array.from(campaignMap);
                _i = 0, campaignMapArray_1 = campaignMapArray;
                _c.label = 1;
            case 1:
                if (!(_i < campaignMapArray_1.length)) return [3 /*break*/, 6];
                _a = campaignMapArray_1[_i], featureKey = _a[0], campaigns = _a[1];
                _loop_2 = function (campaign) {
                    var storedData, variation;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService)];
                            case 1:
                                storedData = _d.sent();
                                // Check if campaign is stored in storage
                                if (storedData === null || storedData === void 0 ? void 0 : storedData.experimentVariationId) {
                                    if (storedData.experimentKey && storedData.experimentKey === campaign.getKey()) {
                                        variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.experimentKey, storedData.experimentVariationId);
                                        if (variation) {
                                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
                                                campaignKey: storedData.experimentKey,
                                                userId: context.getId(),
                                            }));
                                            if (eligibleCampaignsWithStorage.findIndex(function (item) { return item.key === campaign.getKey(); }) === -1) {
                                                eligibleCampaignsWithStorage.push(campaign);
                                            }
                                            return [2 /*return*/, "continue"];
                                        }
                                    }
                                }
                                return [4 /*yield*/, new CampaignDecisionService_1.CampaignDecisionService().getPreSegmentationDecision(new CampaignModel_1.CampaignModel().modelFromDictionary(campaign), context)];
                            case 2:
                                // Check if user is eligible for the campaign
                                if ((_d.sent()) &&
                                    new CampaignDecisionService_1.CampaignDecisionService().isUserPartOfCampaign(context.getId(), campaign)) {
                                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_ELIGIBLE, {
                                        campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                            ? campaign.getKey()
                                            : campaign.getName() + '_' + campaign.getRuleKey(),
                                        userId: context.getId(),
                                    }));
                                    eligibleCampaigns.push(campaign);
                                    return [2 /*return*/, "continue"];
                                }
                                inEligibleCampaigns.push(campaign);
                                return [2 /*return*/];
                        }
                    });
                };
                _b = 0, campaigns_1 = campaigns;
                _c.label = 2;
            case 2:
                if (!(_b < campaigns_1.length)) return [3 /*break*/, 5];
                campaign = campaigns_1[_b];
                return [5 /*yield**/, _loop_2(campaign)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _b++;
                return [3 /*break*/, 2];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, Promise.resolve({
                    eligibleCampaigns: eligibleCampaigns,
                    eligibleCampaignsWithStorage: eligibleCampaignsWithStorage,
                    inEligibleCampaigns: inEligibleCampaigns,
                })];
        }
    });
}); };
/**
 * Evaluates the eligible campaigns and determines the winner campaign based on the provided settings, feature key, eligible campaigns, eligible campaigns with storage, group ID, and context.
 *
 * @param settings - The settings model.
 * @param featureKey - The key of the feature.
 * @param eligibleCampaigns - An array of eligible campaigns.
 * @param eligibleCampaignsWithStorage - An array of eligible campaigns with storage.
 * @param groupId - The ID of the group.
 * @param context - The context model.
 * @returns A promise that resolves to the winner campaign.
 */
var _findWinnerCampaignAmongEligibleCampaigns = function (settings, featureKey, eligibleCampaigns, eligibleCampaignsWithStorage, groupId, context, storageService) { return __awaiter(void 0, void 0, void 0, function () {
    var winnerCampaign, campaignIds, megAlgoNumber;
    var _a;
    return __generator(this, function (_b) {
        winnerCampaign = null;
        campaignIds = (0, CampaignUtil_1.getCampaignIdsFromFeatureKey)(settings, featureKey);
        megAlgoNumber = !(0, DataTypeUtil_1.isUndefined)((_a = settings === null || settings === void 0 ? void 0 : settings.getGroups()[groupId]) === null || _a === void 0 ? void 0 : _a.et)
            ? settings.getGroups()[groupId].et
            : constants_1.Constants.RANDOM_ALGO;
        // if eligibleCampaignsWithStorage has only one campaign, then that campaign is the winner
        if (eligibleCampaignsWithStorage.length === 1) {
            winnerCampaign = eligibleCampaignsWithStorage[0];
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
                campaignKey: eligibleCampaignsWithStorage[0].getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                    ? eligibleCampaignsWithStorage[0].getKey()
                    : eligibleCampaignsWithStorage[0].getName() + '_' + eligibleCampaignsWithStorage[0].getRuleKey(),
                groupId: groupId,
                userId: context.getId(),
                algo: '',
            }));
        }
        else if (eligibleCampaignsWithStorage.length > 1 && megAlgoNumber === constants_1.Constants.RANDOM_ALGO) {
            // if eligibleCampaignsWithStorage has more than one campaign and algo is random, then find the winner using random algo
            winnerCampaign = _normalizeWeightsAndFindWinningCampaign(eligibleCampaignsWithStorage, context, campaignIds, groupId, storageService);
        }
        else if (eligibleCampaignsWithStorage.length > 1) {
            // if eligibleCampaignsWithStorage has more than one campaign and algo is not random, then find the winner using advanced algo
            winnerCampaign = _getCampaignUsingAdvancedAlgo(settings, eligibleCampaignsWithStorage, context, campaignIds, groupId, storageService);
        }
        if (eligibleCampaignsWithStorage.length === 0) {
            if (eligibleCampaigns.length === 1) {
                winnerCampaign = eligibleCampaigns[0];
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
                    campaignKey: eligibleCampaigns[0].getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                        ? eligibleCampaigns[0].getKey()
                        : eligibleCampaigns[0].getName() + '_' + eligibleCampaigns[0].getRuleKey(),
                    groupId: groupId,
                    userId: context.getId(),
                    algo: '',
                }));
            }
            else if (eligibleCampaigns.length > 1 && megAlgoNumber === constants_1.Constants.RANDOM_ALGO) {
                winnerCampaign = _normalizeWeightsAndFindWinningCampaign(eligibleCampaigns, context, campaignIds, groupId, storageService);
            }
            else if (eligibleCampaigns.length > 1) {
                winnerCampaign = _getCampaignUsingAdvancedAlgo(settings, eligibleCampaigns, context, campaignIds, groupId, storageService);
            }
        }
        return [2 /*return*/, winnerCampaign];
    });
}); };
/**
 * Normalizes the weights of shortlisted campaigns and determines the winning campaign using random allocation.
 *
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @returns The winning campaign or null if none is found.
 */
var _normalizeWeightsAndFindWinningCampaign = function (shortlistedCampaigns, context, calledCampaignIds, groupId, storageService) {
    // Normalize the weights of all the shortlisted campaigns
    shortlistedCampaigns.forEach(function (campaign) {
        campaign.weight = Math.round((100 / shortlistedCampaigns.length) * 10000) / 10000;
    });
    // make shortlistedCampaigns as array of VariationModel
    shortlistedCampaigns = shortlistedCampaigns.map(function (campaign) { return new VariationModel_1.VariationModel().modelFromDictionary(campaign); });
    // re-distribute the traffic for each camapign
    (0, CampaignUtil_1.setCampaignAllocation)(shortlistedCampaigns);
    var winnerCampaign = new CampaignDecisionService_1.CampaignDecisionService().getVariation(shortlistedCampaigns, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), undefined, groupId)));
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
        campaignKey: winnerCampaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
            ? winnerCampaign.getKey()
            : winnerCampaign.getKey() + '_' + winnerCampaign.getRuleKey(),
        groupId: groupId,
        userId: context.getId(),
        algo: 'using random algorithm',
    }));
    if (winnerCampaign) {
        new StorageDecorator_1.StorageDecorator().setDataInStorage({
            featureKey: "".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId),
            context: context,
            experimentId: winnerCampaign.getId(),
            experimentKey: winnerCampaign.getKey(),
            experimentVariationId: winnerCampaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? winnerCampaign.getVariations()[0].getId() : -1,
        }, storageService);
        if (calledCampaignIds.includes(winnerCampaign.getId())) {
            return winnerCampaign;
        }
    }
    return null;
};
/**
 * Advanced algorithm to find the winning campaign based on priority order and weighted random distribution.
 *
 * @param settings - The settings model.
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @returns The winning campaign or null if none is found.
 */
var _getCampaignUsingAdvancedAlgo = function (settings, shortlistedCampaigns, context, calledCampaignIds, groupId, storageService) {
    var winnerCampaign = null;
    var found = false; // flag to check whether winnerCampaign has been found or not and helps to break from the outer loop
    var priorityOrder = !(0, DataTypeUtil_1.isUndefined)(settings.getGroups()[groupId].p) ? settings.getGroups()[groupId].p : {};
    var wt = !(0, DataTypeUtil_1.isUndefined)(settings.getGroups()[groupId].wt) ? settings.getGroups()[groupId].wt : {};
    for (var i = 0; i < priorityOrder.length; i++) {
        for (var j = 0; j < shortlistedCampaigns.length; j++) {
            if (shortlistedCampaigns[j].id == priorityOrder[i]) {
                winnerCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[j]);
                found = true;
                break;
            }
            else if (shortlistedCampaigns[j].id + '_' + shortlistedCampaigns[j].variations[0].id === priorityOrder[i]) {
                winnerCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[j]);
                found = true;
                break;
            }
        }
        if (found === true)
            break;
    }
    // If winnerCampaign not found through Priority, then go for weighted Random distribution and for that,
    // Store the list of campaigns (participatingCampaigns) out of shortlistedCampaigns and their corresponding weights present in weightage distribution array (wt)
    if (winnerCampaign === null) {
        var participatingCampaignList = [];
        // iterate over shortlisted campaigns and add weights from the weight array
        for (var i = 0; i < shortlistedCampaigns.length; i++) {
            var campaignId = shortlistedCampaigns[i].id;
            if (!(0, DataTypeUtil_1.isUndefined)(wt[campaignId])) {
                var clonedCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[i]);
                clonedCampaign.weight = wt[campaignId];
                participatingCampaignList.push(clonedCampaign);
            }
            else if (!(0, DataTypeUtil_1.isUndefined)(wt[campaignId + '_' + shortlistedCampaigns[i].variations[0].id])) {
                var clonedCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[i]);
                clonedCampaign.weight = wt[campaignId + '_' + shortlistedCampaigns[i].variations[0].id];
                participatingCampaignList.push(clonedCampaign);
            }
        }
        /* Finding winner campaign using weighted Distibution :
          1. Re-distribute the traffic by assigning range values for each camapign in particaptingCampaignList
          2. Calculate bucket value for the given userId and groupId
          3. Get the winnerCampaign by checking the Start and End Bucket Allocations of each campaign
        */
        // make participatingCampaignList as array of VariationModel
        participatingCampaignList = participatingCampaignList.map(function (campaign) {
            return new VariationModel_1.VariationModel().modelFromDictionary(campaign);
        });
        (0, CampaignUtil_1.setCampaignAllocation)(participatingCampaignList);
        winnerCampaign = new CampaignDecisionService_1.CampaignDecisionService().getVariation(participatingCampaignList, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), undefined, groupId)));
    }
    // WinnerCampaign should not be null, in case when winnerCampaign hasn't been found through PriorityOrder and
    // also shortlistedCampaigns and wt array does not have a single campaign id in common
    if (winnerCampaign) {
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
            campaignKey: winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? winnerCampaign.key
                : winnerCampaign.key + '_' + winnerCampaign.ruleKey,
            groupId: groupId,
            userId: context.getId(),
            algo: 'using advanced algorithm',
        }));
    }
    else {
        // TODO -- Log the error message
        // LogManager.Instance.info(
        //   buildMessage(InfoLogMessagesEnum.MEG_NO_WINNER_CAMPAIGN, {
        //     groupId,
        //     userId: context.getId(),
        //   }),
        // );
        logger_1.LogManager.Instance.info("No winner campaign found for MEG group: ".concat(groupId));
    }
    if (winnerCampaign) {
        new StorageDecorator_1.StorageDecorator().setDataInStorage({
            featureKey: "".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId),
            context: context,
            experimentId: winnerCampaign.id,
            experimentKey: winnerCampaign.key,
            experimentVariationId: winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? winnerCampaign.variations[0].id : -1,
        }, storageService);
        if (calledCampaignIds.includes(winnerCampaign.id)) {
            return winnerCampaign;
        }
    }
    return null;
};
//# sourceMappingURL=MegUtil.js.map