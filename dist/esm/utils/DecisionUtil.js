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
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum.js';
import { StatusEnum } from '../enums/StatusEnum.js';
import { InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { VariationModel } from '../models/campaign/VariationModel.js';
import { DecisionMaker } from '../packages/decision-maker/index.js';
import { CampaignDecisionService } from '../services/CampaignDecisionService.js';
import { isObject } from '../utils/DataTypeUtil.js';
import { Constants } from '../constants/index.js';
import { assignRangeValues, getBucketingSeed, getGroupDetailsIfCampaignPartOfIt, scaleVariationWeights, } from './CampaignUtil.js';
import { buildMessage } from './LogMessageUtil.js';
import { evaluateGroups } from './MegUtil.js';
import { getUUID } from './UuidUtil.js';
import { StorageDecorator } from '../decorators/StorageDecorator.js';
export const checkWhitelistingAndPreSeg = async (serviceContainer, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) => {
    const vwoUserId = getUUID(context.getId(), serviceContainer.getSettings().getAccountId());
    const campaignId = campaign.getId();
    // Force/whitelist for Testing, Rollout, and Personalize when enabled
    if (_isForceWhitelistingEligible(campaign)) {
        // Rollout/Personalize force lists store UUID hashes; Testing keeps plain ids unless isUserListEnabled
        context.setVariationTargetingVariables(Object.assign({}, context.getVariationTargetingVariables(), {
            _wingifyUserId: _forceMatchUserId(campaign, context.getId(), vwoUserId),
        }));
        Object.assign(decision, { variationTargetingVariables: context.getVariationTargetingVariables() }); // for integration
        if (campaign.getIsForcedVariationEnabled()) {
            // Forced OUT (Rollout only): user must not get this rollout at all
            // check if the user is on the forced off list
            if (_isRolloutCampaign(campaign) && (await _isUserOnRolloutForceOffList(campaign, context, serviceContainer))) {
                // Log that Forced OUT matched for this user
                serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.WHITELISTING_FORCED_OFF, {
                    userId: context.getId(),
                    ruleType: _forceRuleTypeLabel(campaign),
                    campaignKey: _forceCampaignKey(campaign),
                }));
                return [false, null];
            }
            const whitelistedVariation = await _checkCampaignWhitelisting(campaign, context, serviceContainer);
            if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
                return [true, whitelistedVariation];
            }
        }
        else {
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.WHITELISTING_SKIP, {
                userId: context.getId(),
                ruleType: _forceRuleTypeLabel(campaign),
                campaignKey: _forceCampaignKey(campaign),
                variation: '',
            }));
        }
    }
    // userlist segment is also available for campaign pre segmentation
    context.setCustomVariables(Object.assign({}, context.getCustomVariables(), {
        _wingifyUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
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
        const storedData = await new StorageDecorator().getFeatureFromStorage(`${Constants.META_MEG_KEY}${groupId}`, context, storageService, serviceContainer);
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
export const evaluateTrafficAndGetVariation = (serviceContainer, campaign, context) => {
    const variation = new CampaignDecisionService().getVariationAlloted(context, serviceContainer.getSettings().getAccountId(), campaign, serviceContainer);
    const userId = context.getId();
    const bucketingSeed = context.getBucketingSeed();
    const bucketingId = bucketingSeed || userId;
    if (!variation) {
        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
            campaignKey: campaign.getType() === CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
            userId: bucketingId !== userId ? `${userId} (Seed: ${bucketingId})` : userId,
            status: 'did not get any variation',
        }));
        return null;
    }
    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
        campaignKey: campaign.getType() === CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        userId: bucketingId !== userId ? `${userId} (Seed: ${bucketingId})` : userId,
        status: `got variation:${variation.getKey()}`,
    }));
    return variation;
};
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
const _checkCampaignWhitelisting = async (campaign, context, serviceContainer) => {
    const whitelistingResult = await _evaluateWhitelisting(campaign, context, serviceContainer);
    const status = whitelistingResult ? StatusEnum.PASSED : StatusEnum.FAILED;
    const variationName = whitelistingResult ? whitelistingResult.variation.getKey() : '';
    const variationString = variationName ? `for variation: ${variationName}` : '';
    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.WHITELISTING_STATUS, {
        userId: context.getId(),
        ruleType: _forceRuleTypeLabel(campaign),
        campaignKey: _forceCampaignKey(campaign),
        status,
        variationString,
    }));
    return whitelistingResult;
};
/**
 * Deep copy for bucketing among multiple matches without mutating campaign variation weights/ranges.
 * JSON + modelFromDictionary restores VariationModel methods (getWeight, setStartRange, …).
 */
const _cloneVariationModelForWhitelisting = (variation) => {
    return new VariationModel().modelFromDictionary(JSON.parse(JSON.stringify(variation)));
};
/**
 * Evaluate whitelisting for a campaign.
 * Rollout / Personalize use variations[0].whitelistedSegments; Testing uses variation segments.
 * @param campaign Campaign object
 * @param context User context
 * @param serviceContainer Service container
 * @returns Whitelisted variation map or undefined if not whitelisted
 */
const _evaluateWhitelisting = async (campaign, context, serviceContainer) => {
    // Rollout / Personalize: force list lives on variations[0].whitelistedSegments
    if (campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
        return _evaluateVariationWhitelistedSegments(campaign, context, serviceContainer);
    }
    // Testing: variation-level segments
    const variations = campaign.getVariations();
    const results = await Promise.all(variations.map(async (variation) => {
        if (isObject(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.WHITELISTING_SKIP, {
                userId: context.getId(),
                ruleType: _forceRuleTypeLabel(campaign),
                campaignKey: _forceCampaignKey(campaign),
                variation: variation.getKey() ? `for variation: ${variation.getKey()}` : '',
            }));
            return { matched: false, variation };
        }
        if (!isObject(variation.getSegments())) {
            return { matched: false, variation };
        }
        const evaluationResult = await serviceContainer
            .getSegmentationManager()
            .validateSegmentation(variation.getSegments(), context.getVariationTargetingVariables());
        return { matched: evaluationResult, variation };
    }));
    const matched = results.filter((r) => r.matched).map((r) => r.variation);
    if (matched.length === 0) {
        return;
    }
    if (matched.length === 1) {
        // return the variation if only one variation is matched
        return _whitelistingResultMap(matched[0]);
    }
    const targetedVariations = matched.map((v) => _cloneVariationModelForWhitelisting(v));
    scaleVariationWeights(targetedVariations);
    for (let i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
        stepFactor = assignRangeValues(targetedVariations[i], currentAllocation);
        currentAllocation += stepFactor;
    }
    const whitelistedVariation = new CampaignDecisionService().getVariation(targetedVariations, new DecisionMaker().calculateBucketValue(getBucketingSeed(context.getBucketingSeed() || context.getId(), campaign, null)));
    return _whitelistingResultMap(whitelistedVariation);
};
/**
 * Log label for force/whitelist messages (parity with Testing "experiment").
 * @param campaign Campaign being evaluated
 * @returns Rule type label used in WHITELISTING_* messages
 */
const _forceRuleTypeLabel = (campaign) => {
    if (campaign.getType() === CampaignTypeEnum.ROLLOUT) {
        return 'rollout';
    }
    if (campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
        return 'personalize';
    }
    return 'experiment';
};
/**
 * Campaign key used in force/whitelist log messages.
 * @param campaign Campaign being evaluated
 * @returns Campaign key string for logs
 */
const _forceCampaignKey = (campaign) => {
    // Testing: variation-level segments
    if (campaign.getType() === CampaignTypeEnum.AB) {
        return campaign.getKey();
    }
    const campaignName = campaign.getName() || '';
    const ruleKey = campaign.getRuleKey() || '';
    if (campaignName && ruleKey) {
        return `${campaignName}_${ruleKey}`;
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
const _isRolloutCampaign = (campaign) => {
    return campaign.getType() === CampaignTypeEnum.ROLLOUT;
};
/**
 * Whether this campaign type supports force/whitelisting evaluation.
 * @param campaign Campaign being evaluated
 * @returns True if AB, Rollout, or Personalize
 */
const _isForceWhitelistingEligible = (campaign) => {
    const type = campaign.getType();
    return type === CampaignTypeEnum.AB || type === CampaignTypeEnum.ROLLOUT || type === CampaignTypeEnum.PERSONALIZE;
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
const _forceMatchUserId = (campaign, userId, hashedUserId) => {
    const type = campaign.getType();
    // return the hashed user id if the campaign is a rollout or personalize
    if (type === CampaignTypeEnum.ROLLOUT || type === CampaignTypeEnum.PERSONALIZE) {
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
const _isUserOnRolloutForceOffList = async (campaign, context, serviceContainer) => {
    if (!_isRolloutCampaign(campaign)) {
        return false;
    }
    // return false if the campaign does not have any variations
    const variations = campaign.getVariations();
    if (!variations || variations.length === 0) {
        return false;
    }
    // return false if the first variation does not have any whitelisted segments
    const rolloutForceSegments = variations[0].getWhitelistedSegments();
    if (!isObject(rolloutForceSegments) || !Object.keys(rolloutForceSegments).length) {
        return false;
    }
    // Pull out every "not" block — that is the Forced OUT user list
    const rolloutForceOffOperands = [];
    _collectRolloutForceOffNotOperands(rolloutForceSegments, rolloutForceOffOperands);
    if (rolloutForceOffOperands.length === 0) {
        return false;
    }
    // Match current user (_wingifyUserId) against each Forced OUT list
    const targetingVariables = context.getVariationTargetingVariables();
    for (const rolloutForceOffOperand of rolloutForceOffOperands) {
        if (!isObject(rolloutForceOffOperand)) {
            continue;
        }
        // validate the segmentation against the targeting variables
        const matched = await serviceContainer
            .getSegmentationManager()
            .validateSegmentation(rolloutForceOffOperand, targetingVariables);
        if (matched) {
            return true;
        }
    }
    return false;
};
/**
 * Collects every value under a "not" key in Rollout force-list DSL (Forced OUT lists only).
 * @param node Current DSL node (object / array / other)
 * @param results Accumulator for "not" operand values
 */
const _collectRolloutForceOffNotOperands = (node, results) => {
    if (isObject(node)) {
        for (const [key, value] of Object.entries(node)) {
            // Found a Forced OUT list — keep its inner operand
            if (key === 'not') {
                results.push(value);
            }
            // Keep searching nested maps/lists for more "not" blocks
            _collectRolloutForceOffNotOperands(value, results);
        }
    }
    else if (Array.isArray(node)) {
        for (const item of node) {
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
const _forceOnSegmentsOnly = (node) => {
    if (Array.isArray(node)) {
        const kept = node.map((item) => _forceOnSegmentsOnly(item)).filter((item) => item !== undefined);
        return kept.length > 0 ? kept : undefined;
    }
    if (!isObject(node)) {
        return node;
    }
    const result = {};
    for (const [key, value] of Object.entries(node)) {
        if (key === 'not') {
            continue;
        }
        const stripped = _forceOnSegmentsOnly(value);
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
const _evaluateVariationWhitelistedSegments = async (campaign, context, serviceContainer) => {
    const variations = campaign.getVariations();
    if (!variations || variations.length === 0) {
        return;
    }
    // Force On list lives on the first (only) variation
    const variation = variations[0];
    const whitelistSegments = variation.getWhitelistedSegments();
    // return if the variation does not have any whitelisted segments
    if (!isObject(whitelistSegments) || !Object.keys(whitelistSegments).length) {
        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.WHITELISTING_SKIP, {
            userId: context.getId(),
            ruleType: _forceRuleTypeLabel(campaign),
            campaignKey: _forceCampaignKey(campaign),
            variation: '',
        }));
        return;
    }
    // Forced OUT is a "not" list (Rollout applies it earlier as a hard exclude).
    // Evaluating that "not" here would pass every user who is not on the list and skip pre-segmentation.
    // Keep only the Forced IN clauses for this check.
    const forceOnSegments = _forceOnSegmentsOnly(whitelistSegments);
    if (!isObject(forceOnSegments) || !Object.keys(forceOnSegments).length) {
        return;
    }
    // Match hashed _wingifyUserId against whitelistedSegments (Force On)
    const segmentationResult = await serviceContainer
        .getSegmentationManager()
        .validateSegmentation(forceOnSegments, context.getVariationTargetingVariables());
    if (!segmentationResult) {
        return;
    }
    // Force On hit → return a clone of this variation
    return _whitelistingResultMap(_cloneVariationModelForWhitelisting(variation));
};
/**
 * Build the standard whitelisting result map from a variation.
 * @param whitelistedVariation Variation to wrap, or null/undefined
 * @returns Map with variation / variationName / variationId, or undefined
 */
const _whitelistingResultMap = (whitelistedVariation) => {
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