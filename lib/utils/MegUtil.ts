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
import { Constants } from '../constants';
import { StorageDecorator } from '../decorators/StorageDecorator';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { InfoLogMessagesEnum } from '../enums/log-messages';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { ContextModel } from '../models/user/ContextModel';
import { DecisionMaker } from '../packages/decision-maker';
import { LogManager } from '../packages/logger';
import { CampaignDecisionService } from '../services/CampaignDecisionService';
import { StorageService } from '../services/StorageService';
import { evaluateRule } from '../utils/RuleEvaluationUtil';
import {
  getBucketingSeed,
  getCampaignIdsFromFeatureKey,
  getCampaignsByGroupId,
  getFeatureKeysFromCampaignIds,
  getVariationFromCampaignKey,
  setCampaignAllocation,
} from './CampaignUtil';
import { isObject, isUndefined } from './DataTypeUtil';
import { evaluateTrafficAndGetVariation } from './DecisionUtil';
import { cloneObject, getFeatureFromKey, getSpecificRulesBasedOnType } from './FunctionUtil';
import { buildMessage } from './LogMessageUtil';

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
export const evaluateGroups = async (
  settings: SettingsModel,
  feature: FeatureModel,
  groupId: number,
  evaluatedFeatureMap: Map<string, any>,
  context: ContextModel,
  storageService: StorageService
): Promise<any> => {
  const featureToSkip = [];
  const campaignMap: Map<string, any[]> = new Map();
  // get all feature keys and all campaignIds from the groupId
  const { featureKeys, groupCampaignIds } = getFeatureKeysFromGroup(settings, groupId);
  for (const featureKey of featureKeys) {
    const feature = getFeatureFromKey(settings, featureKey);
    // get all campaignIds from the featureKey
    const featureCampaignIds = getCampaignIdsFromFeatureKey(settings, featureKey);
    // check if the feature is already evaluated
    if (featureToSkip.includes(featureKey)) {
      continue;
    }
    // evaluate the feature rollout rules
    const isRolloutRulePassed = await _isRolloutRuleForFeaturePassed(
      settings,
      feature,
      evaluatedFeatureMap,
      featureToSkip,
      storageService,
      context
    );
    if (isRolloutRulePassed) {
      settings.getCampaigns().forEach((campaign) => {
        // groupCampaignIds.includes(campaign.getId()) -> campaign we are adding should be in the group
        // featureCampaignIds.includes(campaign.getId()) -> checks that campaign should be part of the feature that we evaluated
        if (groupCampaignIds.includes(campaign.getId()) && featureCampaignIds.includes(campaign.getId())) {
          if (!campaignMap.has(featureKey)) {
            campaignMap.set(featureKey, []);
          }
          // check if the campaign is already present in the campaignMap for the feature
          if (campaignMap.get(featureKey).findIndex((item) => item.key === campaign.getKey()) === -1) {
            campaignMap.get(featureKey).push(campaign);
          }
        }
      });
    }
  }
  const { eligibleCampaigns, eligibleCampaignsWithStorage } = await _getEligbleCampaigns(
    settings,
    campaignMap,
    context,
    storageService,
  );

  return await _findWinnerCampaignAmongEligibleCampaigns(
    settings,
    feature.getKey(),
    eligibleCampaigns,
    eligibleCampaignsWithStorage,
    groupId,
    context,
  );
};

/**
 * Retrieves feature keys associated with a group based on the group ID.
 *
 * @param settings - The settings model.
 * @param groupId - The ID of the group.
 * @returns An object containing feature keys and group campaign IDs.
 */
export function getFeatureKeysFromGroup(settings: SettingsModel, groupId: number) {
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
 * @param settings - The settings model.
 * @param feature - The feature model to evaluate.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param featureToSkip - An array of features to skip during evaluation.
 * @param storageService - The storage service.
 * @param context - The context model.
 * @returns A promise that resolves to true if the feature passes the rollout rules, false otherwise.
 */
const _isRolloutRuleForFeaturePassed = async (
  settings: SettingsModel,
  feature: FeatureModel,
  evaluatedFeatureMap: Map<string, any>,
  featureToSkip: any[],
  storageService: StorageService,
  context: ContextModel,
): Promise<boolean> => {
  if (
    evaluatedFeatureMap.has(feature.getKey()) &&
    evaluatedFeatureMap.get(feature.getKey()).hasOwnProperty('rolloutId')
  ) {
    return true;
  }
  const rollOutRules = getSpecificRulesBasedOnType(feature, CampaignTypeEnum.ROLLOUT);
  if (rollOutRules.length > 0) {
    let ruleToTestForTraffic = null;
    for (const rule of rollOutRules) {
      const { preSegmentationResult } = await evaluateRule(
        settings,
        feature,
        rule,
        context,
        evaluatedFeatureMap,
        null,
        storageService,
        {}
      );
      if (preSegmentationResult) {
        ruleToTestForTraffic = rule;
        break;
      }
      continue;
    }
    if (ruleToTestForTraffic !== null) {
      const campaign = new CampaignModel().modelFromDictionary(ruleToTestForTraffic);
      const variation = evaluateTrafficAndGetVariation(settings, campaign, context.getId());
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
  LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.MEG_SKIP_ROLLOUT_EVALUATE_EXPERIMENTS, {
    featureKey: feature.getKey()
  }));
  return true;
};

/**
 * Retrieves eligible campaigns based on the provided campaign map and context.
 *
 * @param settings - The settings model.
 * @param campaignMap - A map containing feature keys and corresponding campaigns.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to an object containing eligible campaigns, campaigns with storage, and ineligible campaigns.
 */
const _getEligbleCampaigns = async (
  settings: SettingsModel,
  campaignMap: Map<string, any[]>,
  context: ContextModel,
  storageService: StorageService,
): Promise<any> => {
  const eligibleCampaigns = [];
  const eligibleCampaignsWithStorage = [];
  const inEligibleCampaigns = [];
  const campaignMapArray = Array.from<[string, CampaignModel[]]>(campaignMap);

  // Iterate over the campaign map to determine eligible campaigns
  for (const [featureKey, campaigns] of campaignMapArray) {
    for (const campaign of campaigns) {
      const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(
        featureKey,
        context,
        storageService,
      );

      // Check if campaign is stored in storage
      if (storedData?.experimentVariationId) {
        if (storedData.experimentKey && storedData.experimentKey === campaign.getKey()) {
          const variation: VariationModel = getVariationFromCampaignKey(
            settings,
            storedData.experimentKey,
            storedData.experimentVariationId,
          );
          if (variation) {
            LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
              campaignKey: storedData.experimentKey,
              userId: context.getId()
            }));

            if (eligibleCampaignsWithStorage.findIndex((item) => item.key === campaign.getKey()) === -1) {
              eligibleCampaignsWithStorage.push(campaign);
            }
            continue;
          }
        }
      }

      // Check if user is eligible for the campaign
      if (
        (await new CampaignDecisionService().getPreSegmentationDecision(
          new CampaignModel().modelFromDictionary(campaign),
          context
        )) &&
        new CampaignDecisionService().isUserPartOfCampaign(context.getId(), campaign)
      ) {
        LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
          campaignKey: campaign.getKey(),
          userId: context.getId()
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
 * @param settings - The settings model.
 * @param featureKey - The key of the feature.
 * @param eligibleCampaigns - An array of eligible campaigns.
 * @param eligibleCampaignsWithStorage - An array of eligible campaigns with storage.
 * @param groupId - The ID of the group.
 * @param context - The context model.
 * @returns A promise that resolves to the winner campaign.
 */
const _findWinnerCampaignAmongEligibleCampaigns = async (
  settings: SettingsModel,
  featureKey: string,
  eligibleCampaigns: any[],
  eligibleCampaignsWithStorage: any[],
  groupId: number,
  context: ContextModel,
): Promise<any> => {
  // getCampaignIds from featureKey
  let winnerCampaign = null;
  const campaignIds = getCampaignIdsFromFeatureKey(settings, featureKey);
  // get the winner from each group and store it in winnerFromEachGroup
  const megAlgoNumber = !isUndefined(settings?.getGroups()[groupId]?.et)
    ? settings.getGroups()[groupId].et
    : Constants.RANDOM_ALGO;

  // if eligibleCampaignsWithStorage has only one campaign, then that campaign is the winner
  if (eligibleCampaignsWithStorage.length === 1) {
    winnerCampaign = eligibleCampaignsWithStorage[0];
    LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
      campaignKey: eligibleCampaignsWithStorage[0].getKey(),
      groupId,
      userId: context.getId(),
      algo: ''
    }));
  } else if (eligibleCampaignsWithStorage.length > 1 && megAlgoNumber === Constants.RANDOM_ALGO) {
    // if eligibleCampaignsWithStorage has more than one campaign and algo is random, then find the winner using random algo
    winnerCampaign = _normalizeWeightsAndFindWinningCampaign(
      eligibleCampaignsWithStorage,
      context,
      campaignIds,
      groupId,
    );
  } else if (eligibleCampaignsWithStorage.length > 1) {
    // if eligibleCampaignsWithStorage has more than one campaign and algo is not random, then find the winner using advanced algo
    winnerCampaign = _getCampaignUsingAdvancedAlgo(
      settings,
      eligibleCampaignsWithStorage,
      context,
      campaignIds,
      groupId,
    );
  }

  if (eligibleCampaignsWithStorage.length === 0) {
    if (eligibleCampaigns.length === 1) {
      winnerCampaign = eligibleCampaigns[0];

      LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
        campaignKey: eligibleCampaigns[0].getKey(),
        groupId,
        userId: context.getId(),
        algo: ''
      }));

    } else if (eligibleCampaigns.length > 1 && megAlgoNumber === Constants.RANDOM_ALGO) {
      winnerCampaign = _normalizeWeightsAndFindWinningCampaign(eligibleCampaigns, context, campaignIds, groupId);
    } else if (eligibleCampaigns.length > 1) {
      winnerCampaign = _getCampaignUsingAdvancedAlgo(settings, eligibleCampaigns, context, campaignIds, groupId);
    }
  }

  return winnerCampaign;
};

/**
 * Normalizes the weights of shortlisted campaigns and determines the winning campaign using random allocation.
 *
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @returns The winning campaign or null if none is found.
 */
const _normalizeWeightsAndFindWinningCampaign = (
  shortlistedCampaigns: any[],
  context: ContextModel,
  calledCampaignIds: any[],
  groupId: number,
): any => {
  // Normalize the weights of all the shortlisted campaigns
  shortlistedCampaigns.forEach((campaign) => {
    campaign.weight = Math.floor(100 / shortlistedCampaigns.length);
  });

  // make shortlistedCampaigns as array of VariationModel
  shortlistedCampaigns = shortlistedCampaigns.map((campaign) => new VariationModel().modelFromDictionary(campaign));

  // re-distribute the traffic for each camapign
  setCampaignAllocation(shortlistedCampaigns);
  const winnerCampaign = new CampaignDecisionService().getVariation(
    shortlistedCampaigns,
    new DecisionMaker().calculateBucketValue(getBucketingSeed(context.getId(), undefined, groupId)),
  );

  LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
    campaignKey: winnerCampaign.getKey(),
    groupId,
    userId: context.getId(),
    algo: 'using random algorithm'
  }));

  if (winnerCampaign && calledCampaignIds.includes(winnerCampaign.getId())) {
    return winnerCampaign;
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
const _getCampaignUsingAdvancedAlgo = (
  settings: SettingsModel,
  shortlistedCampaigns: any[],
  context: ContextModel,
  calledCampaignIds: any[],
  groupId: number,
) => {
  let winnerCampaign = null;
  let found = false; // flag to check whether winnerCampaign has been found or not and helps to break from the outer loop
  const priorityOrder = !isUndefined(settings.getGroups()[groupId].p) ? settings.getGroups()[groupId].p : {};
  const wt = !isUndefined(settings.getGroups()[groupId].wt) ? settings.getGroups()[groupId].wt : {};

  for (let i = 0; i < priorityOrder.length; i++) {
    for (let j = 0; j < shortlistedCampaigns.length; j++) {
      if (shortlistedCampaigns[j].id === priorityOrder[i]) {
        winnerCampaign = cloneObject(shortlistedCampaigns[j]);
        found = true;
        break;
      }
    }
    if (found === true) break;
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
    }
    /* Finding winner campaign using weighted Distibution :
      1. Re-distribute the traffic by assigning range values for each camapign in particaptingCampaignList
      2. Calculate bucket value for the given userId and groupId
      3. Get the winnerCampaign by checking the Start and End Bucket Allocations of each campaign
    */

    // make participatingCampaignList as array of VariationModel
    participatingCampaignList = participatingCampaignList.map((campaign) =>
      new VariationModel().modelFromDictionary(campaign),
    );
    setCampaignAllocation(participatingCampaignList);
    winnerCampaign = new CampaignDecisionService().getVariation(
      participatingCampaignList,
      new DecisionMaker().calculateBucketValue(getBucketingSeed(context.getId(), undefined, groupId)),
    );
  }
  // WinnerCampaign should not be null, in case when winnerCampaign hasn't been found through PriorityOrder and
  // also shortlistedCampaigns and wt array does not have a single campaign id in common
  LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
    campaignKey: winnerCampaign.key,
    groupId,
    userId: context.getId(),
    algo: 'using advanced algorithm'
  }));

  if (calledCampaignIds.includes(winnerCampaign.id)) {
    return winnerCampaign;
  }
  return null;
};
