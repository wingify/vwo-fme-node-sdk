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
exports.evaluateTrafficAndGetVariation = exports.checkWhitelistingAndPreSeg = void 0;
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
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var StatusEnum_1 = require("../enums/StatusEnum");
var log_messages_1 = require("../enums/log-messages");
var VariationModel_1 = require("../models/campaign/VariationModel");
var decision_maker_1 = require("../packages/decision-maker");
var CampaignDecisionService_1 = require("../services/CampaignDecisionService");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var constants_1 = require("../constants");
var CampaignUtil_1 = require("./CampaignUtil");
var LogMessageUtil_1 = require("./LogMessageUtil");
var MegUtil_1 = require("./MegUtil");
var UuidUtil_1 = require("./UuidUtil");
var StorageDecorator_1 = require("../decorators/StorageDecorator");
var checkWhitelistingAndPreSeg = function (serviceContainer, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) { return __awaiter(void 0, void 0, void 0, function () {
    var vwoUserId, campaignId, _a, whitelistedVariation, groupId, groupWinnerCampaignId, storedData, isPreSegmentationPassed, winnerCampaign;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                vwoUserId = (0, UuidUtil_1.getUUID)(context.getId(), serviceContainer.getSettings().getAccountId());
                campaignId = campaign.getId();
                if (!_isForceWhitelistingEligible(campaign)) return [3 /*break*/, 5];
                // Rollout/Personalize force lists store UUID hashes; Testing keeps plain ids unless isUserListEnabled
                context.setVariationTargetingVariables(Object.assign({}, context.getVariationTargetingVariables(), {
                    _wingifyUserId: _forceMatchUserId(campaign, context.getId(), vwoUserId),
                }));
                Object.assign(decision, { variationTargetingVariables: context.getVariationTargetingVariables() }); // for integration
                if (!campaign.getIsForcedVariationEnabled()) return [3 /*break*/, 4];
                _a = _isRolloutCampaign(campaign);
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, _isUserOnRolloutForceOffList(campaign, context, serviceContainer)];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                // Forced OUT (Rollout only): user must not get this rollout at all
                // check if the user is on the forced off list
                if (_a) {
                    // Log that Forced OUT matched for this user
                    serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_FORCED_OFF, {
                        userId: context.getId(),
                        ruleType: _forceRuleTypeLabel(campaign),
                        campaignKey: _forceCampaignKey(campaign),
                    }));
                    return [2 /*return*/, [false, null]];
                }
                return [4 /*yield*/, _checkCampaignWhitelisting(campaign, context, serviceContainer)];
            case 3:
                whitelistedVariation = _b.sent();
                if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
                    return [2 /*return*/, [true, whitelistedVariation]];
                }
                return [3 /*break*/, 5];
            case 4:
                serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                    userId: context.getId(),
                    ruleType: _forceRuleTypeLabel(campaign),
                    campaignKey: _forceCampaignKey(campaign),
                    variation: '',
                }));
                _b.label = 5;
            case 5:
                // userlist segment is also available for campaign pre segmentation
                context.setCustomVariables(Object.assign({}, context.getCustomVariables(), {
                    _wingifyUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
                }));
                Object.assign(decision, { customVariables: context.getCustomVariables() }); // for integeration
                groupId = (0, CampaignUtil_1.getGroupDetailsIfCampaignPartOfIt)(serviceContainer.getSettings(), campaign.getId(), campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? campaign.getVariations()[0].getId() : null).groupId;
                groupWinnerCampaignId = megGroupWinnerCampaigns === null || megGroupWinnerCampaigns === void 0 ? void 0 : megGroupWinnerCampaigns.get(groupId);
                if (!groupWinnerCampaignId) return [3 /*break*/, 6];
                if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                    // check if the campaign is the winner of the group
                    if (groupWinnerCampaignId === campaignId) {
                        return [2 /*return*/, [true, null]];
                    }
                }
                else if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                    // check if the campaign is the winner of the group
                    if (groupWinnerCampaignId === campaignId + '_' + campaign.getVariations()[0].getId()) {
                        return [2 /*return*/, [true, null]];
                    }
                }
                // as group is already evaluated, no need to check again, return false directly
                return [2 /*return*/, [false, null]];
            case 6:
                if (!groupId) return [3 /*break*/, 8];
                return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage("".concat(constants_1.Constants.META_MEG_KEY).concat(groupId), context, storageService, serviceContainer)];
            case 7:
                storedData = _b.sent();
                if (storedData && storedData.experimentKey && storedData.experimentId) {
                    serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
                        campaignKey: storedData.experimentKey,
                        userId: context.getId(),
                    }));
                    if (storedData.experimentId === campaignId) {
                        // return the campaign if the called campaignId matches
                        if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                            if (storedData.experimentVariationId === campaign.getVariations()[0].getId()) {
                                // if personalise then check if the reqeusted variation is the winner
                                return [2 /*return*/, [true, null]];
                            }
                            else {
                                // if requested variation is not the winner then set the winner campaign in the map and return
                                megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
                                return [2 /*return*/, [false, null]];
                            }
                        }
                        else {
                            return [2 /*return*/, [true, null]];
                        }
                    }
                    if (storedData.experimentVariationId != -1) {
                        megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
                    }
                    else {
                        megGroupWinnerCampaigns.set(groupId, storedData.experimentId);
                    }
                    return [2 /*return*/, [false, null]];
                }
                _b.label = 8;
            case 8: return [4 /*yield*/, new CampaignDecisionService_1.CampaignDecisionService().getPreSegmentationDecision(campaign, context, serviceContainer)];
            case 9:
                isPreSegmentationPassed = _b.sent();
                if (!(isPreSegmentationPassed && groupId)) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, MegUtil_1.evaluateGroups)(serviceContainer, feature, groupId, evaluatedFeatureMap, context, storageService)];
            case 10:
                winnerCampaign = _b.sent();
                if (winnerCampaign && winnerCampaign.id === campaignId) {
                    if (winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                        return [2 /*return*/, [true, null]];
                    }
                    else {
                        // if personalise then check if the reqeusted variation is the winner
                        if (winnerCampaign.variations[0].id === campaign.getVariations()[0].getId()) {
                            return [2 /*return*/, [true, null]];
                        }
                        else {
                            megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
                            return [2 /*return*/, [false, null]];
                        }
                    }
                }
                else if (winnerCampaign) {
                    if (winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                        megGroupWinnerCampaigns.set(groupId, winnerCampaign.id);
                    }
                    else {
                        megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
                    }
                    return [2 /*return*/, [false, null]];
                }
                megGroupWinnerCampaigns.set(groupId, -1);
                return [2 /*return*/, [false, null]];
            case 11: return [2 /*return*/, [isPreSegmentationPassed, null]];
        }
    });
}); };
exports.checkWhitelistingAndPreSeg = checkWhitelistingAndPreSeg;
var evaluateTrafficAndGetVariation = function (serviceContainer, campaign, context) {
    var variation = new CampaignDecisionService_1.CampaignDecisionService().getVariationAlloted(context, serviceContainer.getSettings().getAccountId(), campaign, serviceContainer);
    var userId = context.getId();
    var bucketingSeed = context.getBucketingSeed();
    var bucketingId = bucketingSeed || userId;
    if (!variation) {
        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
            userId: bucketingId !== userId ? "".concat(userId, " (Seed: ").concat(bucketingId, ")") : userId,
            status: 'did not get any variation',
        }));
        return null;
    }
    serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
        campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        userId: bucketingId !== userId ? "".concat(userId, " (Seed: ").concat(bucketingId, ")") : userId,
        status: "got variation:".concat(variation.getKey()),
    }));
    return variation;
};
exports.evaluateTrafficAndGetVariation = evaluateTrafficAndGetVariation;
/******************
 * PRIVATE METHODS
 ******************/
/**
 * Check for whitelisting and log the result.
 * @param campaign Campaign object
 * @param context User context
 * @param serviceContainer Service container
 * @returns Whitelisted variation map or undefined if not whitelisted
 */
var _checkCampaignWhitelisting = function (campaign, context, serviceContainer) { return __awaiter(void 0, void 0, void 0, function () {
    var whitelistingResult, status, variationName, variationString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _evaluateWhitelisting(campaign, context, serviceContainer)];
            case 1:
                whitelistingResult = _a.sent();
                status = whitelistingResult ? StatusEnum_1.StatusEnum.PASSED : StatusEnum_1.StatusEnum.FAILED;
                variationName = whitelistingResult ? whitelistingResult.variation.getKey() : '';
                variationString = variationName ? "for variation: ".concat(variationName) : '';
                serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_STATUS, {
                    userId: context.getId(),
                    ruleType: _forceRuleTypeLabel(campaign),
                    campaignKey: _forceCampaignKey(campaign),
                    status: status,
                    variationString: variationString,
                }));
                return [2 /*return*/, whitelistingResult];
        }
    });
}); };
/**
 * Deep copy for bucketing among multiple matches without mutating campaign variation weights/ranges.
 * JSON + modelFromDictionary restores VariationModel methods (getWeight, setStartRange, …).
 */
var _cloneVariationModelForWhitelisting = function (variation) {
    return new VariationModel_1.VariationModel().modelFromDictionary(JSON.parse(JSON.stringify(variation)));
};
/**
 * Evaluate whitelisting for a campaign.
 * Rollout / Personalize use variations[0].whitelistedSegments; Testing uses variation segments.
 * @param campaign Campaign object
 * @param context User context
 * @param serviceContainer Service container
 * @returns Whitelisted variation map or undefined if not whitelisted
 */
var _evaluateWhitelisting = function (campaign, context, serviceContainer) { return __awaiter(void 0, void 0, void 0, function () {
    var variations, results, matched, targetedVariations, i, currentAllocation, stepFactor, whitelistedVariation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Rollout / Personalize: force list lives on variations[0].whitelistedSegments
                if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                    return [2 /*return*/, _evaluateVariationWhitelistedSegments(campaign, context, serviceContainer)];
                }
                variations = campaign.getVariations();
                return [4 /*yield*/, Promise.all(variations.map(function (variation) { return __awaiter(void 0, void 0, void 0, function () {
                        var evaluationResult;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if ((0, DataTypeUtil_1.isObject)(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
                                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                                            userId: context.getId(),
                                            ruleType: _forceRuleTypeLabel(campaign),
                                            campaignKey: _forceCampaignKey(campaign),
                                            variation: variation.getKey() ? "for variation: ".concat(variation.getKey()) : '',
                                        }));
                                        return [2 /*return*/, { matched: false, variation: variation }];
                                    }
                                    if (!(0, DataTypeUtil_1.isObject)(variation.getSegments())) {
                                        return [2 /*return*/, { matched: false, variation: variation }];
                                    }
                                    return [4 /*yield*/, serviceContainer
                                            .getSegmentationManager()
                                            .validateSegmentation(variation.getSegments(), context.getVariationTargetingVariables())];
                                case 1:
                                    evaluationResult = _a.sent();
                                    return [2 /*return*/, { matched: evaluationResult, variation: variation }];
                            }
                        });
                    }); }))];
            case 1:
                results = _a.sent();
                matched = results.filter(function (r) { return r.matched; }).map(function (r) { return r.variation; });
                if (matched.length === 0) {
                    return [2 /*return*/];
                }
                if (matched.length === 1) {
                    // return the variation if only one variation is matched
                    return [2 /*return*/, _whitelistingResultMap(matched[0])];
                }
                targetedVariations = matched.map(function (v) { return _cloneVariationModelForWhitelisting(v); });
                (0, CampaignUtil_1.scaleVariationWeights)(targetedVariations);
                for (i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
                    stepFactor = (0, CampaignUtil_1.assignRangeValues)(targetedVariations[i], currentAllocation);
                    currentAllocation += stepFactor;
                }
                whitelistedVariation = new CampaignDecisionService_1.CampaignDecisionService().getVariation(targetedVariations, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getBucketingSeed() || context.getId(), campaign, null)));
                return [2 /*return*/, _whitelistingResultMap(whitelistedVariation)];
        }
    });
}); };
/**
 * Log label for force/whitelist messages (parity with Testing "experiment").
 * @param campaign Campaign being evaluated
 * @returns Rule type label used in WHITELISTING_* messages
 */
var _forceRuleTypeLabel = function (campaign) {
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT) {
        return 'rollout';
    }
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
        return 'personalize';
    }
    return 'experiment';
};
/**
 * Campaign key used in force/whitelist log messages.
 * @param campaign Campaign being evaluated
 * @returns Campaign key string for logs
 */
var _forceCampaignKey = function (campaign) {
    // Testing: variation-level segments
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
        return campaign.getKey();
    }
    var campaignName = campaign.getName() || '';
    var ruleKey = campaign.getRuleKey() || '';
    if (campaignName && ruleKey) {
        return "".concat(campaignName, "_").concat(ruleKey);
    }
    // return the campaign key if it is available
    if (campaign.getKey()) {
        return campaign.getKey();
    }
    // return the rule key or campaign name if it is available
    return ruleKey || campaignName;
};
/**
 * Whether this campaign is a Rollout rule.
 * @param campaign Campaign being evaluated
 * @returns True for FLAG_ROLLOUT
 */
var _isRolloutCampaign = function (campaign) {
    return campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT;
};
/**
 * Whether this campaign type supports force/whitelisting evaluation.
 * @param campaign Campaign being evaluated
 * @returns True if AB, Rollout, or Personalize
 */
var _isForceWhitelistingEligible = function (campaign) {
    var type = campaign.getType();
    return type === CampaignTypeEnum_1.CampaignTypeEnum.AB || type === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || type === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
};
/**
 * User id compared against force lists in variation targeting variables.
 * Rollout / Personalize always use the hashed UUID (settings store hashed ids).
 * Testing (AB) uses the hashed id only when isUserListEnabled; otherwise the raw user id.
 * @param campaign Campaign being evaluated
 * @param userId Raw user id from context
 * @param hashedUserId Precomputed getUUID hash
 * @returns Id to put into _wingifyUserId
 */
var _forceMatchUserId = function (campaign, userId, hashedUserId) {
    var type = campaign.getType();
    // return the hashed user id if the campaign is a rollout or personalize
    if (type === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || type === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
        return hashedUserId;
    }
    return campaign.getIsUserListEnabled() ? hashedUserId : userId;
};
/**
 * Rollout-only: true when the user is on the Forced OUT list in whitelistedSegments.
 * Personalize has Forced IN only (no not / Forced OUT list).
 * BE encodes Forced OUT as a not operand around a comma-separated user hash list.
 * @param campaign Rollout campaign
 * @param context User context (must already have _wingifyUserId set)
 * @param serviceContainer Service container
 * @returns True if this user must be hard-excluded from the rollout rule
 */
var _isUserOnRolloutForceOffList = function (campaign, context, serviceContainer) { return __awaiter(void 0, void 0, void 0, function () {
    var variations, rolloutForceSegments, rolloutForceOffOperands, targetingVariables, _i, rolloutForceOffOperands_1, rolloutForceOffOperand, matched;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!_isRolloutCampaign(campaign)) {
                    return [2 /*return*/, false];
                }
                variations = campaign.getVariations();
                if (!variations || variations.length === 0) {
                    return [2 /*return*/, false];
                }
                rolloutForceSegments = variations[0].getWhitelistedSegments();
                if (!(0, DataTypeUtil_1.isObject)(rolloutForceSegments) || !Object.keys(rolloutForceSegments).length) {
                    return [2 /*return*/, false];
                }
                rolloutForceOffOperands = [];
                _collectRolloutForceOffNotOperands(rolloutForceSegments, rolloutForceOffOperands);
                if (rolloutForceOffOperands.length === 0) {
                    return [2 /*return*/, false];
                }
                targetingVariables = context.getVariationTargetingVariables();
                _i = 0, rolloutForceOffOperands_1 = rolloutForceOffOperands;
                _a.label = 1;
            case 1:
                if (!(_i < rolloutForceOffOperands_1.length)) return [3 /*break*/, 4];
                rolloutForceOffOperand = rolloutForceOffOperands_1[_i];
                if (!(0, DataTypeUtil_1.isObject)(rolloutForceOffOperand)) {
                    return [3 /*break*/, 3];
                }
                return [4 /*yield*/, serviceContainer
                        .getSegmentationManager()
                        .validateSegmentation(rolloutForceOffOperand, targetingVariables)];
            case 2:
                matched = _a.sent();
                if (matched) {
                    return [2 /*return*/, true];
                }
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, false];
        }
    });
}); };
/**
 * Collects every value under a "not" key in Rollout force-list DSL (Forced OUT lists only).
 * @param node Current DSL node (object / array / other)
 * @param results Accumulator for "not" operand values
 */
var _collectRolloutForceOffNotOperands = function (node, results) {
    if ((0, DataTypeUtil_1.isObject)(node)) {
        for (var _i = 0, _a = Object.entries(node); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            // Found a Forced OUT list — keep its inner operand
            if (key === 'not') {
                results.push(value);
            }
            // Keep searching nested maps/lists for more "not" blocks
            _collectRolloutForceOffNotOperands(value, results);
        }
    }
    else if (Array.isArray(node)) {
        for (var _c = 0, node_1 = node; _c < node_1.length; _c++) {
            var item = node_1[_c];
            _collectRolloutForceOffNotOperands(item, results);
        }
    }
};
/**
 * Drop Forced OUT ("not") nodes so a force-off-only list is not treated as Force On.
 * Returns undefined when nothing but Forced OUT remains.
 * @param node Current DSL node
 * @returns DSL with "not" nodes removed, or undefined when empty
 */
var _forceOnSegmentsOnly = function (node) {
    if (Array.isArray(node)) {
        var kept = node.map(function (item) { return _forceOnSegmentsOnly(item); }).filter(function (item) { return item !== undefined; });
        return kept.length > 0 ? kept : undefined;
    }
    if (!(0, DataTypeUtil_1.isObject)(node)) {
        return node;
    }
    var result = {};
    for (var _i = 0, _a = Object.entries(node); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (key === 'not') {
            continue;
        }
        var stripped = _forceOnSegmentsOnly(value);
        if (stripped !== undefined) {
            result[key] = stripped;
        }
    }
    return Object.keys(result).length > 0 ? result : undefined;
};
/**
 * Force On for Rollout / Personalize using VariationModel.getWhitelistedSegments().
 * Rollout may also include Force Off (not); that is handled upstream as hard-exclude.
 * A list that contains only Force Off must not count as a whitelist pass.
 * Personalize supports Force On only; any "not" there is ignored rather than inverted.
 * @param campaign Campaign object
 * @param context User context
 * @param serviceContainer Service container
 * @returns Whitelisted variation map or undefined if not forced on
 */
var _evaluateVariationWhitelistedSegments = function (campaign, context, serviceContainer) { return __awaiter(void 0, void 0, void 0, function () {
    var variations, variation, whitelistSegments, forceOnSegments, segmentationResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                variations = campaign.getVariations();
                if (!variations || variations.length === 0) {
                    return [2 /*return*/];
                }
                variation = variations[0];
                whitelistSegments = variation.getWhitelistedSegments();
                // return if the variation does not have any whitelisted segments
                if (!(0, DataTypeUtil_1.isObject)(whitelistSegments) || !Object.keys(whitelistSegments).length) {
                    serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                        userId: context.getId(),
                        ruleType: _forceRuleTypeLabel(campaign),
                        campaignKey: _forceCampaignKey(campaign),
                        variation: '',
                    }));
                    return [2 /*return*/];
                }
                forceOnSegments = _forceOnSegmentsOnly(whitelistSegments);
                if (!(0, DataTypeUtil_1.isObject)(forceOnSegments) || !Object.keys(forceOnSegments).length) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, serviceContainer
                        .getSegmentationManager()
                        .validateSegmentation(forceOnSegments, context.getVariationTargetingVariables())];
            case 1:
                segmentationResult = _a.sent();
                if (!segmentationResult) {
                    return [2 /*return*/];
                }
                // Force On hit → return a clone of this variation
                return [2 /*return*/, _whitelistingResultMap(_cloneVariationModelForWhitelisting(variation))];
        }
    });
}); };
/**
 * Build the standard whitelisting result map from a variation.
 * @param whitelistedVariation Variation to wrap, or null/undefined
 * @returns Map with variation / variationName / variationId, or undefined
 */
var _whitelistingResultMap = function (whitelistedVariation) {
    // return if the variation is not found
    if (!whitelistedVariation) {
        return;
    }
    // return the variation, variation name, and variation id if it is found
    return {
        variation: whitelistedVariation,
        variationName: whitelistedVariation.getKey(),
        variationId: whitelistedVariation.getId(),
    };
};
//# sourceMappingURL=DecisionUtil.js.map