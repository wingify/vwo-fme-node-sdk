"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateTrafficAndGetVariation = exports.checkWhitelistingAndPreSeg = void 0;
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
const DataTypeUtil_1 = require("../utils/DataTypeUtil");
const CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
const StatusEnum_1 = require("../enums/StatusEnum");
const log_messages_1 = require("../enums/log-messages");
const decision_maker_1 = require("../packages/decision-maker");
const logger_1 = require("../packages/logger");
const segmentation_evaluator_1 = require("../packages/segmentation-evaluator");
const CampaignDecisionService_1 = require("../services/CampaignDecisionService");
const DataTypeUtil_2 = require("../utils/DataTypeUtil");
const constants_1 = require("../constants");
const CampaignUtil_1 = require("./CampaignUtil");
const FunctionUtil_1 = require("./FunctionUtil");
const LogMessageUtil_1 = require("./LogMessageUtil");
const MegUtil_1 = require("./MegUtil");
const UuidUtil_1 = require("./UuidUtil");
const StorageDecorator_1 = require("../decorators/StorageDecorator");
const checkWhitelistingAndPreSeg = async (settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) => {
    const vwoUserId = (0, UuidUtil_1.getUUID)(context.getId(), settings.getAccountId());
    const campaignId = campaign.getId();
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
        // set _vwoUserId for variation targeting variables
        context.setVariationTargetingVariables(Object.assign({}, context.getVariationTargetingVariables(), {
            _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
        }));
        Object.assign(decision, { variationTargetingVariables: context.getVariationTargetingVariables() }); // for integration
        // check if the campaign satisfies the whitelisting
        if (campaign.getIsForcedVariationEnabled()) {
            const whitelistedVariation = await _checkCampaignWhitelisting(campaign, context);
            if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
                return [true, whitelistedVariation];
            }
        }
        else {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                campaignKey: campaign.getRuleKey(),
                userId: context.getId(),
            }));
        }
    }
    // userlist segment is also available for campaign pre segmentation
    context.setCustomVariables(Object.assign({}, context.getCustomVariables(), {
        _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
    }));
    Object.assign(decision, { customVariables: context.getCustomVariables() }); // for integeration
    // Check if RUle being evaluated is part of Mutually Exclusive Group
    const { groupId } = (0, CampaignUtil_1.getGroupDetailsIfCampaignPartOfIt)(settings, campaign.getId(), campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? campaign.getVariations()[0].getId() : null);
    // Check if group is already evaluated and we have eligible winner campaigns
    const groupWinnerCampaignId = megGroupWinnerCampaigns?.get(groupId);
    if (groupWinnerCampaignId) {
        if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
            // check if the campaign is the winner of the group
            if (groupWinnerCampaignId === campaignId) {
                return [true, null];
            }
        }
        else if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
            // check if the campaign is the winner of the group
            if (groupWinnerCampaignId === campaignId + '_' + campaign.getVariations()[0].getId()) {
                return [true, null];
            }
        }
        // as group is already evaluated, no need to check again, return false directly
        return [false, null];
    }
    else if (groupId) {
        // check in storage if the group is already evaluated for the user
        const storedData = await new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(`${constants_1.Constants.VWO_META_MEG_KEY}${groupId}`, context, storageService);
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
                        return [true, null];
                    }
                    else {
                        // if requested variation is not the winner then set the winner campaign in the map and return
                        megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
                        return [false, null];
                    }
                }
                else {
                    return [true, null];
                }
            }
            if (storedData.experimentVariationId != -1) {
                megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
            }
            else {
                megGroupWinnerCampaigns.set(groupId, storedData.experimentId);
            }
            return [false, null];
        }
    }
    // If Whitelisting is skipped/failed and campaign not part of any MEG Groups
    // Check campaign's pre-segmentation
    const isPreSegmentationPassed = await new CampaignDecisionService_1.CampaignDecisionService().getPreSegmentationDecision(campaign, context);
    if (isPreSegmentationPassed && groupId) {
        const winnerCampaign = await (0, MegUtil_1.evaluateGroups)(settings, feature, groupId, evaluatedFeatureMap, context, storageService);
        if (winnerCampaign && winnerCampaign.id === campaignId) {
            if (winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                return [true, null];
            }
            else {
                // if personalise then check if the reqeusted variation is the winner
                if (winnerCampaign.variations[0].id === campaign.getVariations()[0].getId()) {
                    return [true, null];
                }
                else {
                    megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
                    return [false, null];
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
            return [false, null];
        }
        megGroupWinnerCampaigns.set(groupId, -1);
        return [false, null];
    }
    return [isPreSegmentationPassed, null];
};
exports.checkWhitelistingAndPreSeg = checkWhitelistingAndPreSeg;
const evaluateTrafficAndGetVariation = (settings, campaign, userId) => {
    const variation = new CampaignDecisionService_1.CampaignDecisionService().getVariationAlloted(userId, settings.getAccountId(), campaign);
    if (!variation) {
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
            userId,
            status: 'did not get any variation',
        }));
        return null;
    }
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
        campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        userId,
        status: `got variation:${variation.getKey()}`,
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
const _checkCampaignWhitelisting = async (campaign, context) => {
    // check if the campaign satisfies the whitelisting
    const whitelistingResult = await _evaluateWhitelisting(campaign, context);
    const status = whitelistingResult ? StatusEnum_1.StatusEnum.PASSED : StatusEnum_1.StatusEnum.FAILED;
    const variationString = whitelistingResult ? whitelistingResult.variation.key : '';
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_STATUS, {
        userId: context.getId(),
        campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        status,
        variationString,
    }));
    return whitelistingResult;
};
const _evaluateWhitelisting = async (campaign, context) => {
    const targetedVariations = [];
    const promises = [];
    let whitelistedVariation;
    campaign.getVariations().forEach((variation) => {
        if ((0, DataTypeUtil_2.isObject)(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                    ? campaign.getKey()
                    : campaign.getName() + '_' + campaign.getRuleKey(),
                userId: context.getId(),
                variation: variation.getKey() ? `for variation: ${variation.getKey()}` : '',
            }));
            return;
        }
        // check for segmentation and evaluate
        if ((0, DataTypeUtil_2.isObject)(variation.getSegments())) {
            let SegmentEvaluatorResult = segmentation_evaluator_1.SegmentationManager.Instance.validateSegmentation(variation.getSegments(), context.getVariationTargetingVariables());
            SegmentEvaluatorResult = (0, DataTypeUtil_1.isPromise)(SegmentEvaluatorResult)
                ? SegmentEvaluatorResult
                : Promise.resolve(SegmentEvaluatorResult);
            SegmentEvaluatorResult.then((evaluationResult) => {
                if (evaluationResult) {
                    targetedVariations.push((0, FunctionUtil_1.cloneObject)(variation));
                }
            });
            promises.push(SegmentEvaluatorResult);
        }
    });
    // Wait for all promises to resolve
    await Promise.all(promises);
    if (targetedVariations.length > 1) {
        (0, CampaignUtil_1.scaleVariationWeights)(targetedVariations);
        for (let i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
            stepFactor = (0, CampaignUtil_1.assignRangeValues)(targetedVariations[i], currentAllocation);
            currentAllocation += stepFactor;
        }
        whitelistedVariation = new CampaignDecisionService_1.CampaignDecisionService().getVariation(targetedVariations, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), campaign, null)));
    }
    else {
        whitelistedVariation = targetedVariations[0];
    }
    if (whitelistedVariation) {
        return {
            variation: whitelistedVariation,
            variationName: whitelistedVariation.name,
            variationId: whitelistedVariation.id,
        };
    }
};
//# sourceMappingURL=DecisionUtil.js.map