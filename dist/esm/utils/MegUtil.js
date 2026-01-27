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
import { Constants } from '../constants/index.js';
import { StorageDecorator } from '../decorators/StorageDecorator.js';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum.js';
import { InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { CampaignModel } from '../models/campaign/CampaignModel.js';
import { VariationModel } from '../models/campaign/VariationModel.js';
import { DecisionMaker } from '../packages/decision-maker/index.js';
import { CampaignDecisionService } from '../services/CampaignDecisionService.js';
import { evaluateRule } from '../utils/RuleEvaluationUtil.js';
import { getBucketingSeed, getCampaignIdsFromFeatureKey, getCampaignsByGroupId, getFeatureKeysFromCampaignIds, getVariationFromCampaignKey, setCampaignAllocation, } from './CampaignUtil.js';
import { isObject, isUndefined } from './DataTypeUtil.js';
import { evaluateTrafficAndGetVariation } from './DecisionUtil.js';
import { cloneObject, getFeatureFromKey, getSpecificRulesBasedOnType } from './FunctionUtil.js';
import { buildMessage } from './LogMessageUtil.js';
/**
 * Evaluates groups for a given feature and group ID.
 *
 * @param serviceContainer - The service container instance.
 * @param feature - The feature model to evaluate.
 * @param groupId - The ID of the group.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to the evaluation result.
 */
export const evaluateGroups = async (serviceContainer, feature, groupId, evaluatedFeatureMap, context, storageService) => {
    const featureToSkip = [];
    const campaignMap = new Map();
    // get all feature keys and all campaignIds from the groupId
    const { featureKeys, groupCampaignIds } = getFeatureKeysFromGroup(serviceContainer.getSettings(), groupId);
    for (const featureKey of featureKeys) {
        const feature = getFeatureFromKey(serviceContainer.getSettings(), featureKey);
        // check if the feature is already evaluated
        if (featureToSkip.includes(featureKey)) {
            continue;
        }
        // evaluate the feature rollout rules
        const isRolloutRulePassed = await _isRolloutRuleForFeaturePassed(serviceContainer, feature, evaluatedFeatureMap, featureToSkip, storageService, context);
        if (isRolloutRulePassed) {
            serviceContainer
                .getSettings()
                .getFeatures()
                .forEach((feature) => {
                if (feature.getKey() === featureKey) {
                    feature.getRulesLinkedCampaign().forEach((rule) => {
                        if (groupCampaignIds.includes(rule.getId().toString()) ||
                            groupCampaignIds.includes(`${rule.getId()}_${rule.getVariations()[0].getId()}`.toString())) {
                            if (!campaignMap.has(featureKey)) {
                                campaignMap.set(featureKey, []);
                            }
                            // check if the campaign is already present in the campaignMap for the feature
                            if (campaignMap.get(featureKey).findIndex((item) => item.ruleKey === rule.getRuleKey()) === -1) {
                                campaignMap.get(featureKey).push(rule);
                            }
                        }
                    });
                }
            });
        }
    }
    const { eligibleCampaigns, eligibleCampaignsWithStorage } = await _getEligbleCampaigns(serviceContainer, campaignMap, context, storageService);
    return await _findWinnerCampaignAmongEligibleCampaigns(serviceContainer, feature.getKey(), eligibleCampaigns, eligibleCampaignsWithStorage, groupId, context, storageService);
};
/**
 * Retrieves feature keys associated with a group based on the group ID.
 *
 * @param settings - The settings model.
 * @param groupId - The ID of the group.
 * @returns An object containing feature keys and group campaign IDs.
 */
export function getFeatureKeysFromGroup(settings, groupId) {
    const groupCampaignIds = getCampaignsByGroupId(settings, groupId);
    const featureKeys = getFeatureKeysFromCampaignIds(settings, groupCampaignIds);
    return { featureKeys, groupCampaignIds };
}
/*******************************
 * PRIVATE methods - MegUtil
 ******************************/
/**
 * Evaluates the feature rollout rules for a given feature.
 *
 * @param serviceContainer - The service container instance.
 * @param feature - The feature model to evaluate.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param featureToSkip - An array of features to skip during evaluation.
 * @param storageService - The storage service.
 * @param context - The context model.
 * @returns A promise that resolves to true if the feature passes the rollout rules, false otherwise.
 */
const _isRolloutRuleForFeaturePassed = async (serviceContainer, feature, evaluatedFeatureMap, featureToSkip, storageService, context) => {
    if (evaluatedFeatureMap.has(feature.getKey()) && 'rolloutId' in evaluatedFeatureMap.get(feature.getKey())) {
        return true;
    }
    const rollOutRules = getSpecificRulesBasedOnType(feature, CampaignTypeEnum.ROLLOUT);
    if (rollOutRules.length > 0) {
        let ruleToTestForTraffic = null;
        for (const rule of rollOutRules) {
            const { preSegmentationResult } = await evaluateRule(serviceContainer, feature, rule, context, evaluatedFeatureMap, null, storageService, {});
            if (preSegmentationResult) {
                ruleToTestForTraffic = rule;
                break;
            }
            continue;
        }
        if (ruleToTestForTraffic !== null) {
            const campaign = new CampaignModel().modelFromDictionary(ruleToTestForTraffic);
            const variation = evaluateTrafficAndGetVariation(serviceContainer, campaign, context.getId());
            if (isObject(variation) && Object.keys(variation).length > 0) {
                evaluatedFeatureMap.set(feature.getKey(), {
                    rolloutId: ruleToTestForTraffic.id,
                    rolloutKey: ruleToTestForTraffic.key,
                    rolloutVariationId: ruleToTestForTraffic.variations[0].id,
                });
                return true;
            }
        }
        // no rollout rule passed
        featureToSkip.push(feature.getKey());
        return false;
    }
    // no rollout rule, evaluate experiments
    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.MEG_SKIP_ROLLOUT_EVALUATE_EXPERIMENTS, {
        featureKey: feature.getKey(),
    }));
    return true;
};
/**
 * Retrieves eligible campaigns based on the provided campaign map and context.
 *
 * @param serviceContainer - The service container instance.
 * @param campaignMap - A map containing feature keys and corresponding campaigns.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to an object containing eligible campaigns, campaigns with storage, and ineligible campaigns.
 */
const _getEligbleCampaigns = async (serviceContainer, campaignMap, context, storageService) => {
    const eligibleCampaigns = [];
    const eligibleCampaignsWithStorage = [];
    const inEligibleCampaigns = [];
    const campaignMapArray = Array.from(campaignMap);
    // Iterate over the campaign map to determine eligible campaigns
    for (const [featureKey, campaigns] of campaignMapArray) {
        for (const campaign of campaigns) {
            const storedData = await new StorageDecorator().getFeatureFromStorage(featureKey, context, storageService, serviceContainer);
            // Check if campaign is stored in storage
            if (storedData?.experimentVariationId) {
                if (storedData.experimentKey && storedData.experimentKey === campaign.getKey()) {
                    const variation = getVariationFromCampaignKey(serviceContainer.getSettings(), storedData.experimentKey, storedData.experimentVariationId);
                    if (variation) {
                        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
                            campaignKey: storedData.experimentKey,
                            userId: context.getId(),
                        }));
                        if (eligibleCampaignsWithStorage.findIndex((item) => item.key === campaign.getKey()) === -1) {
                            eligibleCampaignsWithStorage.push(campaign);
                        }
                        continue;
                    }
                }
            }
            // Check if user is eligible for the campaign
            if ((await new CampaignDecisionService().getPreSegmentationDecision(new CampaignModel().modelFromDictionary(campaign), context, serviceContainer)) &&
                new CampaignDecisionService().isUserPartOfCampaign(context.getId(), campaign, serviceContainer)) {
                serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.MEG_CAMPAIGN_ELIGIBLE, {
                    campaignKey: campaign.getType() === CampaignTypeEnum.AB
                        ? campaign.getKey()
                        : campaign.getName() + '_' + campaign.getRuleKey(),
                    userId: context.getId(),
                }));
                eligibleCampaigns.push(campaign);
                continue;
            }
            inEligibleCampaigns.push(campaign);
        }
    }
    return Promise.resolve({
        eligibleCampaigns,
        eligibleCampaignsWithStorage,
        inEligibleCampaigns,
    });
};
/**
 * Evaluates the eligible campaigns and determines the winner campaign based on the provided settings, feature key, eligible campaigns, eligible campaigns with storage, group ID, and context.
 *
 * @param serviceContainer - The service container instance.
 * @param featureKey - The key of the feature.
 * @param eligibleCampaigns - An array of eligible campaigns.
 * @param eligibleCampaignsWithStorage - An array of eligible campaigns with storage.
 * @param groupId - The ID of the group.
 * @param context - The context model.
 * @returns A promise that resolves to the winner campaign.
 */
const _findWinnerCampaignAmongEligibleCampaigns = async (serviceContainer, featureKey, eligibleCampaigns, eligibleCampaignsWithStorage, groupId, context, storageService) => {
    // getCampaignIds from featureKey
    let winnerCampaign = null;
    const campaignIds = getCampaignIdsFromFeatureKey(serviceContainer.getSettings(), featureKey);
    // get the winner from each group and store it in winnerFromEachGroup
    const megAlgoNumber = !isUndefined(serviceContainer.getSettings()?.getGroups()[groupId]?.et)
        ? serviceContainer.getSettings().getGroups()[groupId].et
        : Constants.RANDOM_ALGO;
    // if eligibleCampaignsWithStorage has only one campaign, then that campaign is the winner
    if (eligibleCampaignsWithStorage.length === 1) {
        winnerCampaign = eligibleCampaignsWithStorage[0];
        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
            campaignKey: eligibleCampaignsWithStorage[0].getType() === CampaignTypeEnum.AB
                ? eligibleCampaignsWithStorage[0].getKey()
                : eligibleCampaignsWithStorage[0].getName() + '_' + eligibleCampaignsWithStorage[0].getRuleKey(),
            groupId,
            userId: context.getId(),
            algo: '',
        }));
    }
    else if (eligibleCampaignsWithStorage.length > 1 && megAlgoNumber === Constants.RANDOM_ALGO) {
        // if eligibleCampaignsWithStorage has more than one campaign and algo is random, then find the winner using random algo
        winnerCampaign = _normalizeWeightsAndFindWinningCampaign(serviceContainer, eligibleCampaignsWithStorage, context, campaignIds, groupId, storageService);
    }
    else if (eligibleCampaignsWithStorage.length > 1) {
        // if eligibleCampaignsWithStorage has more than one campaign and algo is not random, then find the winner using advanced algo
        winnerCampaign = _getCampaignUsingAdvancedAlgo(serviceContainer, eligibleCampaignsWithStorage, context, campaignIds, groupId, storageService);
    }
    if (eligibleCampaignsWithStorage.length === 0) {
        if (eligibleCampaigns.length === 1) {
            winnerCampaign = eligibleCampaigns[0];
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
                campaignKey: eligibleCampaigns[0].getType() === CampaignTypeEnum.AB
                    ? eligibleCampaigns[0].getKey()
                    : eligibleCampaigns[0].getName() + '_' + eligibleCampaigns[0].getRuleKey(),
                groupId,
                userId: context.getId(),
                algo: '',
            }));
        }
        else if (eligibleCampaigns.length > 1 && megAlgoNumber === Constants.RANDOM_ALGO) {
            winnerCampaign = _normalizeWeightsAndFindWinningCampaign(serviceContainer, eligibleCampaigns, context, campaignIds, groupId, storageService);
        }
        else if (eligibleCampaigns.length > 1) {
            winnerCampaign = _getCampaignUsingAdvancedAlgo(serviceContainer, eligibleCampaigns, context, campaignIds, groupId, storageService);
        }
    }
    return winnerCampaign;
};
/**
 * Normalizes the weights of shortlisted campaigns and determines the winning campaign using random allocation.
 *
 * @param serviceContainer - The service container instance.
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @param storageService - The storage service.
 * @returns The winning campaign or null if none is found.
 */
const _normalizeWeightsAndFindWinningCampaign = (serviceContainer, shortlistedCampaigns, context, calledCampaignIds, groupId, storageService) => {
    // Normalize the weights of all the shortlisted campaigns
    shortlistedCampaigns.forEach((campaign) => {
        campaign.weight = Math.round((100 / shortlistedCampaigns.length) * 10000) / 10000;
    });
    // make shortlistedCampaigns as array of VariationModel
    shortlistedCampaigns = shortlistedCampaigns.map((campaign) => new VariationModel().modelFromDictionary(campaign));
    // re-distribute the traffic for each camapign
    setCampaignAllocation(shortlistedCampaigns);
    const winnerCampaign = new CampaignDecisionService().getVariation(shortlistedCampaigns, new DecisionMaker().calculateBucketValue(getBucketingSeed(context.getId(), undefined, groupId)));
    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
        campaignKey: winnerCampaign.getType() === CampaignTypeEnum.AB
            ? winnerCampaign.getKey()
            : winnerCampaign.getKey() + '_' + winnerCampaign.getRuleKey(),
        groupId,
        userId: context.getId(),
        algo: 'using random algorithm',
    }));
    if (winnerCampaign) {
        new StorageDecorator().setDataInStorage({
            featureKey: `${Constants.VWO_META_MEG_KEY}${groupId}`,
            context,
            experimentId: winnerCampaign.getId(),
            experimentKey: winnerCampaign.getKey(),
            experimentVariationId: winnerCampaign.getType() === CampaignTypeEnum.PERSONALIZE ? winnerCampaign.getVariations()[0].getId() : -1,
        }, storageService, serviceContainer);
        if (calledCampaignIds.includes(winnerCampaign.getId())) {
            return winnerCampaign;
        }
    }
    return null;
};
/**
 * Advanced algorithm to find the winning campaign based on priority order and weighted random distribution.
 *
 * @param serviceContainer - The service container instance.
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @param storageService - The storage service.
 * @returns The winning campaign or null if none is found.
 */
const _getCampaignUsingAdvancedAlgo = (serviceContainer, shortlistedCampaigns, context, calledCampaignIds, groupId, storageService) => {
    let winnerCampaign = null;
    let found = false; // flag to check whether winnerCampaign has been found or not and helps to break from the outer loop
    const priorityOrder = !isUndefined(serviceContainer.getSettings().getGroups()[groupId].p)
        ? serviceContainer.getSettings().getGroups()[groupId].p
        : {};
    const wt = !isUndefined(serviceContainer.getSettings().getGroups()[groupId].wt)
        ? serviceContainer.getSettings().getGroups()[groupId].wt
        : {};
    for (let i = 0; i < priorityOrder.length; i++) {
        for (let j = 0; j < shortlistedCampaigns.length; j++) {
            if (shortlistedCampaigns[j].id == priorityOrder[i]) {
                winnerCampaign = cloneObject(shortlistedCampaigns[j]);
                found = true;
                break;
            }
            else if (shortlistedCampaigns[j].id + '_' + shortlistedCampaigns[j].variations[0].id === priorityOrder[i]) {
                winnerCampaign = cloneObject(shortlistedCampaigns[j]);
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
        let participatingCampaignList = [];
        // iterate over shortlisted campaigns and add weights from the weight array
        for (let i = 0; i < shortlistedCampaigns.length; i++) {
            const campaignId = shortlistedCampaigns[i].id;
            if (!isUndefined(wt[campaignId])) {
                const clonedCampaign = cloneObject(shortlistedCampaigns[i]);
                clonedCampaign.weight = wt[campaignId];
                participatingCampaignList.push(clonedCampaign);
            }
            else if (!isUndefined(wt[campaignId + '_' + shortlistedCampaigns[i].variations[0].id])) {
                const clonedCampaign = cloneObject(shortlistedCampaigns[i]);
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
        participatingCampaignList = participatingCampaignList.map((campaign) => new VariationModel().modelFromDictionary(campaign));
        setCampaignAllocation(participatingCampaignList);
        winnerCampaign = new CampaignDecisionService().getVariation(participatingCampaignList, new DecisionMaker().calculateBucketValue(getBucketingSeed(context.getId(), undefined, groupId)));
    }
    // WinnerCampaign should not be null, in case when winnerCampaign hasn't been found through PriorityOrder and
    // also shortlistedCampaigns and wt array does not have a single campaign id in common
    if (winnerCampaign) {
        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
            campaignKey: winnerCampaign.type === CampaignTypeEnum.AB
                ? winnerCampaign.key
                : winnerCampaign.key + '_' + winnerCampaign.ruleKey,
            groupId,
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
        serviceContainer.getLogManager().info(`No winner campaign found for MEG group: ${groupId}`);
    }
    if (winnerCampaign) {
        new StorageDecorator().setDataInStorage({
            featureKey: `${Constants.VWO_META_MEG_KEY}${groupId}`,
            context,
            experimentId: winnerCampaign.id,
            experimentKey: winnerCampaign.key,
            experimentVariationId: winnerCampaign.type === CampaignTypeEnum.PERSONALIZE ? winnerCampaign.variations[0].id : -1,
        }, storageService, serviceContainer);
        if (calledCampaignIds.includes(winnerCampaign.id)) {
            return winnerCampaign;
        }
    }
    return null;
};
//# sourceMappingURL=MegUtil.js.map