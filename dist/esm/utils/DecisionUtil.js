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
import { isPromise } from '../utils/DataTypeUtil.js';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum.js';
import { StatusEnum } from '../enums/StatusEnum.js';
import { InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { DecisionMaker } from '../packages/decision-maker/index.js';
import { CampaignDecisionService } from '../services/CampaignDecisionService.js';
import { isObject } from '../utils/DataTypeUtil.js';
import { Constants } from '../constants/index.js';
import { assignRangeValues, getBucketingSeed, getGroupDetailsIfCampaignPartOfIt, scaleVariationWeights, } from './CampaignUtil.js';
import { cloneObject } from './FunctionUtil.js';
import { buildMessage } from './LogMessageUtil.js';
import { evaluateGroups } from './MegUtil.js';
import { getUUID } from './UuidUtil.js';
import { StorageDecorator } from '../decorators/StorageDecorator.js';
export const checkWhitelistingAndPreSeg = async (serviceContainer, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) => {
    const vwoUserId = getUUID(context.getId(), serviceContainer.getSettings().getAccountId());
    const campaignId = campaign.getId();
    if (campaign.getType() === CampaignTypeEnum.AB) {
        // set _vwoUserId for variation targeting variables
        context.setVariationTargetingVariables(Object.assign({}, context.getVariationTargetingVariables(), {
            _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
        }));
        Object.assign(decision, { variationTargetingVariables: context.getVariationTargetingVariables() }); // for integration
        // check if the campaign satisfies the whitelisting
        if (campaign.getIsForcedVariationEnabled()) {
            const whitelistedVariation = await _checkCampaignWhitelisting(campaign, context, serviceContainer);
            if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
                return [true, whitelistedVariation];
            }
        }
        else {
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.WHITELISTING_SKIP, {
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
    const { groupId } = getGroupDetailsIfCampaignPartOfIt(serviceContainer.getSettings(), campaign.getId(), campaign.getType() === CampaignTypeEnum.PERSONALIZE ? campaign.getVariations()[0].getId() : null);
    // Check if group is already evaluated and we have eligible winner campaigns
    const groupWinnerCampaignId = megGroupWinnerCampaigns?.get(groupId);
    if (groupWinnerCampaignId) {
        if (campaign.getType() === CampaignTypeEnum.AB) {
            // check if the campaign is the winner of the group
            if (groupWinnerCampaignId === campaignId) {
                return [true, null];
            }
        }
        else if (campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
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
        const storedData = await new StorageDecorator().getFeatureFromStorage(`${Constants.VWO_META_MEG_KEY}${groupId}`, context, storageService, serviceContainer);
        if (storedData && storedData.experimentKey && storedData.experimentId) {
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
                campaignKey: storedData.experimentKey,
                userId: context.getId(),
            }));
            if (storedData.experimentId === campaignId) {
                // return the campaign if the called campaignId matches
                if (campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
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
    const isPreSegmentationPassed = await new CampaignDecisionService().getPreSegmentationDecision(campaign, context, serviceContainer);
    if (isPreSegmentationPassed && groupId) {
        const winnerCampaign = await evaluateGroups(serviceContainer, feature, groupId, evaluatedFeatureMap, context, storageService);
        if (winnerCampaign && winnerCampaign.id === campaignId) {
            if (winnerCampaign.type === CampaignTypeEnum.AB) {
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
            if (winnerCampaign.type === CampaignTypeEnum.AB) {
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
export const evaluateTrafficAndGetVariation = (serviceContainer, campaign, userId) => {
    const variation = new CampaignDecisionService().getVariationAlloted(userId, serviceContainer.getSettings().getAccountId(), campaign, serviceContainer);
    if (!variation) {
        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
            campaignKey: campaign.getType() === CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
            userId,
            status: 'did not get any variation',
        }));
        return null;
    }
    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
        campaignKey: campaign.getType() === CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        userId,
        status: `got variation:${variation.getKey()}`,
    }));
    return variation;
};
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
const _checkCampaignWhitelisting = async (campaign, context, serviceContainer) => {
    // check if the campaign satisfies the whitelisting
    const whitelistingResult = await _evaluateWhitelisting(campaign, context, serviceContainer);
    const status = whitelistingResult ? StatusEnum.PASSED : StatusEnum.FAILED;
    const variationString = whitelistingResult ? whitelistingResult.variation.key : '';
    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.WHITELISTING_STATUS, {
        userId: context.getId(),
        campaignKey: campaign.getType() === CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        status,
        variationString,
    }));
    return whitelistingResult;
};
const _evaluateWhitelisting = async (campaign, context, serviceContainer) => {
    const targetedVariations = [];
    const promises = [];
    let whitelistedVariation;
    campaign.getVariations().forEach((variation) => {
        if (isObject(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.WHITELISTING_SKIP, {
                campaignKey: campaign.getType() === CampaignTypeEnum.AB
                    ? campaign.getKey()
                    : campaign.getName() + '_' + campaign.getRuleKey(),
                userId: context.getId(),
                variation: variation.getKey() ? `for variation: ${variation.getKey()}` : '',
            }));
            return;
        }
        // check for segmentation and evaluate
        if (isObject(variation.getSegments())) {
            let SegmentEvaluatorResult = serviceContainer
                .getSegmentationManager()
                .validateSegmentation(variation.getSegments(), context.getVariationTargetingVariables());
            SegmentEvaluatorResult = isPromise(SegmentEvaluatorResult)
                ? SegmentEvaluatorResult
                : Promise.resolve(SegmentEvaluatorResult);
            SegmentEvaluatorResult.then((evaluationResult) => {
                if (evaluationResult) {
                    targetedVariations.push(cloneObject(variation));
                }
            });
            promises.push(SegmentEvaluatorResult);
        }
    });
    // Wait for all promises to resolve
    await Promise.all(promises);
    if (targetedVariations.length > 1) {
        scaleVariationWeights(targetedVariations);
        for (let i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
            stepFactor = assignRangeValues(targetedVariations[i], currentAllocation);
            currentAllocation += stepFactor;
        }
        whitelistedVariation = new CampaignDecisionService().getVariation(targetedVariations, new DecisionMaker().calculateBucketValue(getBucketingSeed(context.getId(), campaign, null)));
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