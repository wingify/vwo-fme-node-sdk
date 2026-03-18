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
import { DecisionMaker } from '../packages/decision-maker/index.js';
import { Constants } from '../constants/index.js';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum.js';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { isObject } from '../utils/DataTypeUtil.js';
import { buildMessage } from '../utils/LogMessageUtil.js';
export class CampaignDecisionService {
    /**
     * Calculate if this user should become part of the campaign or not
     *
     * @param {String} userId the unique ID assigned to a user
     * @param {Object} campaign fot getting the value of traffic allotted to the campaign
     *
     * @return {Boolean} if User is a part of Campaign or not
     */
    isUserPartOfCampaign(context, campaign, serviceContainer) {
        if (!campaign || !context.getId()) {
            return false;
        }
        const userId = context.getId();
        const bucketingSeed = context.getBucketingSeed();
        const bucketingId = bucketingSeed || userId;
        // check if campaign is rollout or personalize
        const isRolloutOrPersonalize = campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE;
        // get salt
        const salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
        // get traffic allocation
        const trafficAllocation = isRolloutOrPersonalize ? campaign.getVariations()[0].getWeight() : campaign.getTraffic();
        // get bucket key using resolved bucketingId
        const bucketKey = salt ? `${salt}_${bucketingId}` : `${campaign.getId()}_${bucketingId}`;
        // get bucket value for user
        const valueAssignedToUser = new DecisionMaker().getBucketValueForUser(bucketKey);
        // check if user is part of campaign
        const isUserPart = valueAssignedToUser !== 0 && valueAssignedToUser <= trafficAllocation;
        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USER_PART_OF_CAMPAIGN, {
            userId: bucketingId !== userId ? `${userId} (Seed: ${bucketingId})` : userId,
            notPart: isUserPart ? '' : 'not',
            campaignKey: campaign.getType() === CampaignTypeEnum.AB
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
    bucketUserToVariation(context, accountId, campaign, serviceContainer) {
        let multiplier;
        const userId = context.getId();
        const bucketingSeed = context.getBucketingSeed();
        const bucketingId = bucketingSeed || userId;
        if (!campaign || !bucketingId) {
            return null;
        }
        if (campaign.getTraffic()) {
            multiplier = 1;
        }
        const percentTraffic = campaign.getTraffic();
        // get salt
        const salt = campaign.getSalt();
        // get bucket key using resolved bucketingId
        const bucketKey = salt ? `${salt}_${accountId}_${bucketingId}` : `${campaign.getId()}_${accountId}_${bucketingId}`;
        // get hash value
        const hashValue = new DecisionMaker().generateHashValue(bucketKey);
        const bucketValue = new DecisionMaker().generateBucketValue(hashValue, Constants.MAX_TRAFFIC_VALUE, multiplier);
        serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.USER_BUCKET_TO_VARIATION, {
            userId: bucketingId !== userId ? `${userId} (Seed: ${bucketingId})` : userId,
            campaignKey: campaign.getKey(),
            percentTraffic,
            bucketValue,
            hashValue,
        }));
        return this.getVariation(campaign.getVariations(), bucketValue);
    }
    async getPreSegmentationDecision(campaign, context, serviceContainer) {
        // validate segmentation
        const campaignType = campaign.getType();
        let segments = {};
        if (campaignType === CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum.PERSONALIZE) {
            segments = campaign.getVariations()[0].getSegments();
        }
        else if (campaignType === CampaignTypeEnum.AB) {
            segments = campaign.getSegments();
        }
        if (isObject(segments) && !Object.keys(segments).length) {
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SEGMENTATION_SKIP, {
                userId: context.getId(),
                campaignKey: campaign.getType() === CampaignTypeEnum.AB
                    ? campaign.getKey()
                    : campaign.getName() + '_' + campaign.getRuleKey(),
            }));
            return true;
        }
        else {
            const preSegmentationResult = await serviceContainer
                .getSegmentationManager()
                .validateSegmentation(segments, context.getCustomVariables());
            if (!preSegmentationResult) {
                serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                    userId: context.getId(),
                    campaignKey: campaign.getType() === CampaignTypeEnum.AB
                        ? campaign.getKey()
                        : campaign.getName() + '_' + campaign.getRuleKey(),
                    status: 'failed',
                }));
                return false;
            }
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                userId: context.getId(),
                campaignKey: campaign.getType() === CampaignTypeEnum.AB
                    ? campaign.getKey()
                    : campaign.getName() + '_' + campaign.getRuleKey(),
                status: 'passed',
            }));
            return true;
        }
    }
    getVariationAlloted(context, accountId, campaign, serviceContainer) {
        const isUserPart = this.isUserPartOfCampaign(context, campaign, serviceContainer);
        if (campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
            if (isUserPart) {
                return campaign.getVariations()[0];
            }
            else {
                return null;
            }
        }
        else {
            if (isUserPart) {
                return this.bucketUserToVariation(context, accountId, campaign, serviceContainer);
            }
            else {
                return null;
            }
        }
    }
}
//# sourceMappingURL=CampaignDecisionService.js.map