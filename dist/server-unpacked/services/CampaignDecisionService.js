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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignDecisionService = void 0;
/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
var decision_maker_1 = require("../packages/decision-maker");
var logger_1 = require("../packages/logger");
var segmentation_evaluator_1 = require("../packages/segmentation-evaluator");
var constants_1 = require("../constants");
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var log_messages_1 = require("../enums/log-messages");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var CampaignDecisionService = /** @class */ (function () {
    function CampaignDecisionService() {
    }
    /**
     * Calculate if this user should become part of the campaign or not
     *
     * @param {String} userId the unique ID assigned to a user
     * @param {Object} campaign fot getting the value of traffic allotted to the campaign
     *
     * @return {Boolean} if User is a part of Campaign or not
     */
    CampaignDecisionService.prototype.isUserPartOfCampaign = function (userId, campaign) {
        // if (!ValidateUtil.isValidValue(userId) || !campaign) {
        //   return false;
        // }
        if (!campaign || !userId) {
            return false;
        }
        // check if campaign is rollout or personalize
        var isRolloutOrPersonalize = campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
        // get salt
        var salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
        // get traffic allocation
        var trafficAllocation = isRolloutOrPersonalize ? campaign.getVariations()[0].getWeight() : campaign.getTraffic();
        // get bucket key
        var bucketKey = salt ? "".concat(salt, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(userId);
        // get bucket value for user
        var valueAssignedToUser = new decision_maker_1.DecisionMaker().getBucketValueForUser(bucketKey);
        // check if user is part of campaign
        var isUserPart = valueAssignedToUser !== 0 && valueAssignedToUser <= trafficAllocation;
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_PART_OF_CAMPAIGN, {
            userId: userId,
            notPart: isUserPart ? '' : 'not',
            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
        }));
        return isUserPart;
    };
    /**
     * Returns the Variation by checking the Start and End Bucket Allocations of each Variation
     *
     * @param {Object} campaign which contains the variations
     * @param {Number} bucketValue the bucket Value of the user
     *
     * @return {Object|null} variation data allotted to the user or null if not
     */
    CampaignDecisionService.prototype.getVariation = function (variations, bucketValue) {
        for (var i = 0; i < variations.length; i++) {
            var variation = variations[i];
            if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
                return variation;
            }
        }
        return null;
    };
    CampaignDecisionService.prototype.checkInRange = function (variation, bucketValue) {
        if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
            return variation;
        }
    };
    /**
     * Validates the User ID and generates Variation into which the User is bucketed in.
     *
     * @param {String} userId the unique ID assigned to User
     * @param {Object} campaign the Campaign of which User is a part of
     *
     * @return {Object|null} variation data into which user is bucketed in or null if not
     */
    CampaignDecisionService.prototype.bucketUserToVariation = function (userId, accountId, campaign) {
        var multiplier;
        if (!campaign || !userId) {
            return null;
        }
        if (campaign.getTraffic()) {
            multiplier = 1;
        }
        var percentTraffic = campaign.getTraffic();
        // get salt
        var salt = campaign.getSalt();
        // get bucket key
        var bucketKey = salt ? "".concat(salt, "_").concat(accountId, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(accountId, "_").concat(userId);
        // get hash value
        var hashValue = new decision_maker_1.DecisionMaker().generateHashValue(bucketKey);
        var bucketValue = new decision_maker_1.DecisionMaker().generateBucketValue(hashValue, constants_1.Constants.MAX_TRAFFIC_VALUE, multiplier);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USER_BUCKET_TO_VARIATION, {
            userId: userId,
            campaignKey: campaign.getKey(),
            percentTraffic: percentTraffic,
            bucketValue: bucketValue,
            hashValue: hashValue,
        }));
        return this.getVariation(campaign.getVariations(), bucketValue);
    };
    CampaignDecisionService.prototype.getPreSegmentationDecision = function (campaign, context) {
        return __awaiter(this, void 0, void 0, function () {
            var campaignType, segments, preSegmentationResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        campaignType = campaign.getType();
                        segments = {};
                        if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                            segments = campaign.getVariations()[0].getSegments();
                        }
                        else if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                            segments = campaign.getSegments();
                        }
                        if (!((0, DataTypeUtil_1.isObject)(segments) && !Object.keys(segments).length)) return [3 /*break*/, 1];
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_SKIP, {
                            userId: context.getId(),
                            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                ? campaign.getKey()
                                : campaign.getName() + '_' + campaign.getRuleKey(),
                        }));
                        return [2 /*return*/, true];
                    case 1: return [4 /*yield*/, segmentation_evaluator_1.SegmentationManager.Instance.validateSegmentation(segments, context.getCustomVariables())];
                    case 2:
                        preSegmentationResult = _a.sent();
                        if (!preSegmentationResult) {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                                userId: context.getId(),
                                campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                    ? campaign.getKey()
                                    : campaign.getName() + '_' + campaign.getRuleKey(),
                                status: 'failed',
                            }));
                            return [2 /*return*/, false];
                        }
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                            userId: context.getId(),
                            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                ? campaign.getKey()
                                : campaign.getName() + '_' + campaign.getRuleKey(),
                            status: 'passed',
                        }));
                        return [2 /*return*/, true];
                }
            });
        });
    };
    CampaignDecisionService.prototype.getVariationAlloted = function (userId, accountId, campaign) {
        var isUserPart = this.isUserPartOfCampaign(userId, campaign);
        if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
            if (isUserPart) {
                return campaign.getVariations()[0];
            }
            else {
                return null;
            }
        }
        else {
            if (isUserPart) {
                return this.bucketUserToVariation(userId, accountId, campaign);
            }
            else {
                return null;
            }
        }
    };
    return CampaignDecisionService;
}());
exports.CampaignDecisionService = CampaignDecisionService;
//# sourceMappingURL=CampaignDecisionService.js.map