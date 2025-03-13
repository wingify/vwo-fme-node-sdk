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
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var StatusEnum_1 = require("../enums/StatusEnum");
var log_messages_1 = require("../enums/log-messages");
var decision_maker_1 = require("../packages/decision-maker");
var logger_1 = require("../packages/logger");
var segmentation_evaluator_1 = require("../packages/segmentation-evaluator");
var CampaignDecisionService_1 = require("../services/CampaignDecisionService");
var DataTypeUtil_2 = require("../utils/DataTypeUtil");
var constants_1 = require("../constants");
var CampaignUtil_1 = require("./CampaignUtil");
var FunctionUtil_1 = require("./FunctionUtil");
var LogMessageUtil_1 = require("./LogMessageUtil");
var MegUtil_1 = require("./MegUtil");
var UuidUtil_1 = require("./UuidUtil");
var StorageDecorator_1 = require("../decorators/StorageDecorator");
var checkWhitelistingAndPreSeg = function (settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) { return __awaiter(void 0, void 0, void 0, function () {
    var vwoUserId, campaignId, whitelistedVariation, groupId, groupWinnerCampaignId, storedData, isPreSegmentationPassed, winnerCampaign;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vwoUserId = (0, UuidUtil_1.getUUID)(context.getId(), settings.getAccountId());
                campaignId = campaign.getId();
                if (!(campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB)) return [3 /*break*/, 3];
                // set _vwoUserId for variation targeting variables
                context.setVariationTargetingVariables(Object.assign({}, context.getVariationTargetingVariables(), {
                    _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
                }));
                Object.assign(decision, { variationTargetingVariables: context.getVariationTargetingVariables() }); // for integration
                if (!campaign.getIsForcedVariationEnabled()) return [3 /*break*/, 2];
                return [4 /*yield*/, _checkCampaignWhitelisting(campaign, context)];
            case 1:
                whitelistedVariation = _a.sent();
                if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
                    return [2 /*return*/, [true, whitelistedVariation]];
                }
                return [3 /*break*/, 3];
            case 2:
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                    campaignKey: campaign.getRuleKey(),
                    userId: context.getId(),
                }));
                _a.label = 3;
            case 3:
                // userlist segment is also available for campaign pre segmentation
                context.setCustomVariables(Object.assign({}, context.getCustomVariables(), {
                    _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
                }));
                Object.assign(decision, { customVariables: context.getCustomVariables() }); // for integeration
                groupId = (0, CampaignUtil_1.getGroupDetailsIfCampaignPartOfIt)(settings, campaign.getId(), campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? campaign.getVariations()[0].getId() : null).groupId;
                groupWinnerCampaignId = megGroupWinnerCampaigns === null || megGroupWinnerCampaigns === void 0 ? void 0 : megGroupWinnerCampaigns.get(groupId);
                if (!groupWinnerCampaignId) return [3 /*break*/, 4];
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
            case 4: return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage("".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId), context, storageService)];
            case 5:
                storedData = _a.sent();
                if (storedData && storedData.experimentKey && storedData.experimentId) {
                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
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
                _a.label = 6;
            case 6: return [4 /*yield*/, new CampaignDecisionService_1.CampaignDecisionService().getPreSegmentationDecision(campaign, context)];
            case 7:
                isPreSegmentationPassed = _a.sent();
                if (!(isPreSegmentationPassed && groupId)) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, MegUtil_1.evaluateGroups)(settings, feature, groupId, evaluatedFeatureMap, context, storageService)];
            case 8:
                winnerCampaign = _a.sent();
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
            case 9: return [2 /*return*/, [isPreSegmentationPassed, null]];
        }
    });
}); };
exports.checkWhitelistingAndPreSeg = checkWhitelistingAndPreSeg;
var evaluateTrafficAndGetVariation = function (settings, campaign, userId) {
    var variation = new CampaignDecisionService_1.CampaignDecisionService().getVariationAlloted(userId, settings.getAccountId(), campaign);
    if (!variation) {
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
            userId: userId,
            status: 'did not get any variation',
        }));
        return null;
    }
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
        campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        userId: userId,
        status: "got variation:".concat(variation.getKey()),
    }));
    return variation;
};
exports.evaluateTrafficAndGetVariation = evaluateTrafficAndGetVariation;
/******************
 * PRIVATE METHODS
 ******************/
/**
 * Check for whitelisting
 * @param campaign      Campaign object
 * @param userId        User ID
 * @param variationTargetingVariables   Variation targeting variables
 * @returns
 */
var _checkCampaignWhitelisting = function (campaign, context) { return __awaiter(void 0, void 0, void 0, function () {
    var whitelistingResult, status, variationString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _evaluateWhitelisting(campaign, context)];
            case 1:
                whitelistingResult = _a.sent();
                status = whitelistingResult ? StatusEnum_1.StatusEnum.PASSED : StatusEnum_1.StatusEnum.FAILED;
                variationString = whitelistingResult ? whitelistingResult.variation.key : '';
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_STATUS, {
                    userId: context.getId(),
                    campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                        ? campaign.getKey()
                        : campaign.getName() + '_' + campaign.getRuleKey(),
                    status: status,
                    variationString: variationString,
                }));
                return [2 /*return*/, whitelistingResult];
        }
    });
}); };
var _evaluateWhitelisting = function (campaign, context) { return __awaiter(void 0, void 0, void 0, function () {
    var targetedVariations, promises, whitelistedVariation, i, currentAllocation, stepFactor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                targetedVariations = [];
                promises = [];
                campaign.getVariations().forEach(function (variation) {
                    if ((0, DataTypeUtil_2.isObject)(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                ? campaign.getKey()
                                : campaign.getName() + '_' + campaign.getRuleKey(),
                            userId: context.getId(),
                            variation: variation.getKey() ? "for variation: ".concat(variation.getKey()) : '',
                        }));
                        return;
                    }
                    // check for segmentation and evaluate
                    if ((0, DataTypeUtil_2.isObject)(variation.getSegments())) {
                        var SegmentEvaluatorResult = segmentation_evaluator_1.SegmentationManager.Instance.validateSegmentation(variation.getSegments(), context.getVariationTargetingVariables());
                        SegmentEvaluatorResult = (0, DataTypeUtil_1.isPromise)(SegmentEvaluatorResult)
                            ? SegmentEvaluatorResult
                            : Promise.resolve(SegmentEvaluatorResult);
                        SegmentEvaluatorResult.then(function (evaluationResult) {
                            if (evaluationResult) {
                                targetedVariations.push((0, FunctionUtil_1.cloneObject)(variation));
                            }
                        });
                        promises.push(SegmentEvaluatorResult);
                    }
                });
                // Wait for all promises to resolve
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                // Wait for all promises to resolve
                _a.sent();
                if (targetedVariations.length > 1) {
                    (0, CampaignUtil_1.scaleVariationWeights)(targetedVariations);
                    for (i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
                        stepFactor = (0, CampaignUtil_1.assignRangeValues)(targetedVariations[i], currentAllocation);
                        currentAllocation += stepFactor;
                    }
                    whitelistedVariation = new CampaignDecisionService_1.CampaignDecisionService().getVariation(targetedVariations, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), campaign, null)));
                }
                else {
                    whitelistedVariation = targetedVariations[0];
                }
                if (whitelistedVariation) {
                    return [2 /*return*/, {
                            variation: whitelistedVariation,
                            variationName: whitelistedVariation.name,
                            variationId: whitelistedVariation.id,
                        }];
                }
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=DecisionUtil.js.map