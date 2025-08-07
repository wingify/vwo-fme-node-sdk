"use strict";
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
const decision_maker_1 = require("../packages/decision-maker");
const logger_1 = require("../packages/logger");
const segmentation_evaluator_1 = require("../packages/segmentation-evaluator");
const constants_1 = require("../constants");
const CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
const log_messages_1 = require("../enums/log-messages");
const DataTypeUtil_1 = require("../utils/DataTypeUtil");
const LogMessageUtil_1 = require("../utils/LogMessageUtil");
class CampaignDecisionService {
    /**
     * Calculate if this user should become part of the campaign or not
     *
     * @param {String} userId the unique ID assigned to a user
     * @param {Object} campaign fot getting the value of traffic allotted to the campaign
     *
     * @return {Boolean} if User is a part of Campaign or not
     */
    isUserPartOfCampaign(userId, campaign) {
        // if (!ValidateUtil.isValidValue(userId) || !campaign) {
        //   return false;
        // }
        if (!campaign || !userId) {
            return false;
        }
        // check if campaign is rollout or personalize
        const isRolloutOrPersonalize = campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
        // get salt
        const salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
        // get traffic allocation
        const trafficAllocation = isRolloutOrPersonalize ? campaign.getVariations()[0].getWeight() : campaign.getTraffic();
        // get bucket key
        const bucketKey = salt ? `${salt}_${userId}` : `${campaign.getId()}_${userId}`;
        // get bucket value for user
        const valueAssignedToUser = new decision_maker_1.DecisionMaker().getBucketValueForUser(bucketKey);
        // check if user is part of campaign
        const isUserPart = valueAssignedToUser !== 0 && valueAssignedToUser <= trafficAllocation;
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_PART_OF_CAMPAIGN, {
            userId,
            notPart: isUserPart ? '' : 'not',
            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
        }));
        return isUserPart;
    }
    /**
     * Returns the Variation by checking the Start and End Bucket Allocations of each Variation
     *
     * @param {Object} campaign which contains the variations
     * @param {Number} bucketValue the bucket Value of the user
     *
     * @return {Object|null} variation data allotted to the user or null if not
     */
    getVariation(variations, bucketValue) {
        for (let i = 0; i < variations.length; i++) {
            const variation = variations[i];
            if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
                return variation;
            }
        }
        return null;
    }
    checkInRange(variation, bucketValue) {
        if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
            return variation;
        }
    }
    /**
     * Validates the User ID and generates Variation into which the User is bucketed in.
     *
     * @param {String} userId the unique ID assigned to User
     * @param {Object} campaign the Campaign of which User is a part of
     *
     * @return {Object|null} variation data into which user is bucketed in or null if not
     */
    bucketUserToVariation(userId, accountId, campaign) {
        let multiplier;
        if (!campaign || !userId) {
            return null;
        }
        if (campaign.getTraffic()) {
            multiplier = 1;
        }
        const percentTraffic = campaign.getTraffic();
        // get salt
        const salt = campaign.getSalt();
        // get bucket key
        const bucketKey = salt ? `${salt}_${accountId}_${userId}` : `${campaign.getId()}_${accountId}_${userId}`;
        // get hash value
        const hashValue = new decision_maker_1.DecisionMaker().generateHashValue(bucketKey);
        const bucketValue = new decision_maker_1.DecisionMaker().generateBucketValue(hashValue, constants_1.Constants.MAX_TRAFFIC_VALUE, multiplier);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USER_BUCKET_TO_VARIATION, {
            userId,
            campaignKey: campaign.getKey(),
            percentTraffic,
            bucketValue,
            hashValue,
        }));
        return this.getVariation(campaign.getVariations(), bucketValue);
    }
    async getPreSegmentationDecision(campaign, context) {
        // validate segmentation
        const campaignType = campaign.getType();
        let segments = {};
        if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
            segments = campaign.getVariations()[0].getSegments();
        }
        else if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
            segments = campaign.getSegments();
        }
        if ((0, DataTypeUtil_1.isObject)(segments) && !Object.keys(segments).length) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_SKIP, {
                userId: context.getId(),
                campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                    ? campaign.getKey()
                    : campaign.getName() + '_' + campaign.getRuleKey(),
            }));
            return true;
        }
        else {
            const preSegmentationResult = await segmentation_evaluator_1.SegmentationManager.Instance.validateSegmentation(segments, context.getCustomVariables());
            if (!preSegmentationResult) {
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                    userId: context.getId(),
                    campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                        ? campaign.getKey()
                        : campaign.getName() + '_' + campaign.getRuleKey(),
                    status: 'failed',
                }));
                return false;
            }
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                userId: context.getId(),
                campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                    ? campaign.getKey()
                    : campaign.getName() + '_' + campaign.getRuleKey(),
                status: 'passed',
            }));
            return true;
        }
    }
    getVariationAlloted(userId, accountId, campaign) {
        const isUserPart = this.isUserPartOfCampaign(userId, campaign);
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
    }
}
exports.CampaignDecisionService = CampaignDecisionService;
//# sourceMappingURL=CampaignDecisionService.js.map