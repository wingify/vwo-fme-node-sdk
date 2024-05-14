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
import { evaluateRule } from '../api/GetFlag';
import { Constants } from '../constants';
import { StorageDecorator } from '../decorators/StorageDecorator';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { CampaignModel } from '../models/CampaignModel';
import { SettingsModel } from '../models/SettingsModel';
import { VariationModel } from '../models/VariationModel';
import { DecisionMaker } from '../modules/decision-maker';
import { LogManager } from '../modules/logger';
import { CampaignDecisionService } from '../services/CampaignDecisionService';
import { StorageService } from '../services/StorageService';
import {
  getBucketingSeed,
  getCampaignIdsFromFeatureKey,
  getCampaignsByGroupId,
  getVariationByCampaignKey,
  getFeatureKeysFromCampaignIds,
  getRuleTypeUsingCampaignIdFromFeature,
  setCampaignAllocation,
} from './CampaignUtil';
import { isObject } from './DataTypeUtil';
import { evaluateTrafficAndGetVariation } from './DecisionUtil';
import { cloneObject, getFeatureFromKey, getSpecificRulesBasedOnType } from './FunctionUtil';

/**
 * Evaluate groups for the feature
 * get all feature keys from the list of meg campaigns
 * evaluate each feature and get all campaigns for the feature
 * add the campaigns to campaignMap if they are present in the group
 * check the eligible campaigns
 * @param settings
 * @param featureKey
 * @param feature
 * @param groupId
 * @param evaluatedFeatureMap
 * @param context
 * @param storageService
 * @param decision
 * @returns
 */
export const evaluateGroups = async (
  settings: SettingsModel,
  featureKey: any,
  feature: any,
  groupId: any,
  evaluatedFeatureMap: Map<string, any>,
  context: any,
  storageService: StorageService,
  decision: any,
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
    const result = await evaluateFeatureRollOutRules(settings, feature, evaluatedFeatureMap, featureToSkip, storageService, context);
    if (result) {
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
  const { eligibleCampaigns, eligibleCampaignsWithStorage, } = await getEligbleCampaigns(
    settings,
    campaignMap,
    context,
    storageService,
  );
  return await evaluateEligibleCampaigns(
    settings,
    featureKey,
    eligibleCampaigns,
    eligibleCampaignsWithStorage,
    groupId,
    context,
  );
};

export function getFeatureKeysFromGroup(settings: SettingsModel, groupId: any) {
  const groupCampaignIds = getCampaignsByGroupId(settings, groupId);
  const featureKeys = getFeatureKeysFromCampaignIds(settings, groupCampaignIds);
  return { featureKeys, groupCampaignIds };
}

const evaluateFeatureRollOutRules = async (
  settings: any,
  feature: any,
  evaluatedFeatureMap: Map<string, any>,
  featureToSkip: any[],
  storageService: StorageService,
  context: any,
): Promise<any> => {
  if (evaluatedFeatureMap.has(feature.key) && evaluatedFeatureMap.get(feature.key).hasOwnProperty('rolloutId')) {
    return true;
  }
  const rollOutRules = getSpecificRulesBasedOnType(settings, feature.key, CampaignTypeEnum.ROLLOUT);
  if (rollOutRules.length > 0) {
    let ruleToTestForTraffic = null;
    for (const rule of rollOutRules) {
      const [evaluateRuleResult] = await evaluateRule(settings, feature, rule, context, false, evaluatedFeatureMap, null, storageService, {});
      if (evaluateRuleResult) {
        ruleToTestForTraffic = rule;
        break;
      }
      continue;
    }
    if (ruleToTestForTraffic !== null) {
      const campaign = new CampaignModel().modelFromDictionary(ruleToTestForTraffic);
      const variation = evaluateTrafficAndGetVariation(settings, campaign, context.id);
      if (isObject(variation) && Object.keys(variation).length > 0) {
        evaluatedFeatureMap.set(feature.key, {
          rolloutId: ruleToTestForTraffic.id,
          rolloutKey: ruleToTestForTraffic.key,
          rolloutVariationId: ruleToTestForTraffic.variations[0].id,
        });
        return true;
      }
    }
    // no rollout rule passed
    featureToSkip.push(feature.key);
    return false;
  }
  // no rollout rule, evaluate experiments
  LogManager.Instance.debug(`MEG: No rollout rule found for feature ${feature.key}, evaluating experiments...`);
  return true;
};

const getEligbleCampaigns = async (
  settings: any,
  campaignMap: any,
  context: any,
  storageService: StorageService,
): Promise<any> => {
  const eligibleCampaigns = [];
  const eligibleCampaignsWithStorage = [];
  const inEligibleCampaigns = [];
  const campaignMapArray = Array.from<[string, CampaignModel[]]>(campaignMap);
  for (const [featureKey, campaigns] of campaignMapArray) {
    for (const campaign of campaigns) {
      const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(
        featureKey,
        context,
        storageService,
      );
      if (storedData?.experimentVariationId) {
        if (storedData.experimentKey && storedData.experimentKey === campaign.getKey()) {
          const variation: VariationModel = getVariationByCampaignKey(
            settings,
            storedData.experimentKey,
            storedData.experimentVariationId,
          );
          if (variation) {
            LogManager.Instance.debug(
              `MEG: Campaign ${storedData.experimentKey} found in storage for user ${context.id}`,
            );
            if (eligibleCampaignsWithStorage.findIndex((item) => item.key === campaign.getKey()) === -1) {
              eligibleCampaignsWithStorage.push(campaign);
            }
            continue;
          }
        }
      }
      if (
        (await new CampaignDecisionService().getDecision(
          new CampaignModel().modelFromDictionary(campaign),
          settings,
          context,
        )) &&
        new CampaignDecisionService().isUserPartOfCampaign(context.id, campaign)
      ) {
        LogManager.Instance.debug(`MEG: Campaign ${campaign.getKey()} is eligible for user ${context.id}`);
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

const evaluateEligibleCampaigns = async (
  settings: any,
  featureKey: any,
  eligibleCampaigns: any[],
  eligibleCampaignsWithStorage: any[],
  groupId: any,
  context: any,
): Promise<any> => {
  // getCampaignIds from featureKey
  let winnerCampaign = null;
  const campaignIds = getCampaignIdsFromFeatureKey(settings, featureKey);
  // get the winner from each group and store it in winnerFromEachGroup
  const megAlgoNumber =
    typeof settings.groups[groupId].et !== 'undefined' ? settings.groups[groupId].et : Constants.RANDOM_ALGO;

  // if eligibleCampaignsWithStorage has only one campaign, then that campaign is the winner
  if (eligibleCampaignsWithStorage.length === 1) {
    winnerCampaign = eligibleCampaignsWithStorage[0];
    LogManager.Instance.debug(
      `MEG: Campaign ${eligibleCampaignsWithStorage[0].getKey()} is the winner for group ${groupId} for user ${context.id}`,
    );
  } else if (eligibleCampaignsWithStorage.length > 1 && megAlgoNumber === Constants.RANDOM_ALGO) {
    // if eligibleCampaignsWithStorage has more than one campaign and algo is random, then find the winner using random algo
    winnerCampaign = normalizeAndFindWinningCampaign(eligibleCampaignsWithStorage, context, campaignIds, groupId);
  } else if (eligibleCampaignsWithStorage.length > 1) {
    // if eligibleCampaignsWithStorage has more than one campaign and algo is not random, then find the winner using advanced algo
    winnerCampaign = advancedAlgoFindWinningCampaign(
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
      LogManager.Instance.debug(
        `MEG: Campaign ${eligibleCampaigns[0].getKey()} is the winner for group ${groupId} for user ${context.id}`,
      );
    } else if (eligibleCampaigns.length > 1 && megAlgoNumber === Constants.RANDOM_ALGO) {
      winnerCampaign = normalizeAndFindWinningCampaign(eligibleCampaigns, context, campaignIds, groupId);
    } else if (eligibleCampaigns.length > 1) {
      winnerCampaign = advancedAlgoFindWinningCampaign(settings, eligibleCampaigns, context, campaignIds, groupId);
    }
  }
  return winnerCampaign;
};

const normalizeAndFindWinningCampaign = (
  shortlistedCampaigns: any[],
  context: any,
  calledCampaignIds: any[],
  groupId: any,
): any => {
  // normalise the weights of all the shortlisted campaigns
  shortlistedCampaigns.forEach((campaign) => {
    campaign.weight = Math.floor(100 / shortlistedCampaigns.length);
  });

  // make shortlistedCampaigns as array of VariationModel
  shortlistedCampaigns = shortlistedCampaigns.map((campaign) => new VariationModel().modelFromDictionary(campaign));

  // re-distribute the traffic for each camapign
  setCampaignAllocation(shortlistedCampaigns);
  const winnerCampaign = new CampaignDecisionService().getVariation(
    shortlistedCampaigns,
    new DecisionMaker().calculateBucketValue(getBucketingSeed(context.id, undefined, groupId)),
  );

  LogManager.Instance.debug(
    `MEG Random: Campaign ${winnerCampaign.getKey()} is the winner for group ${groupId} for user ${context.id}`,
  );

  if (winnerCampaign && calledCampaignIds.includes(winnerCampaign.getId())) {
    return winnerCampaign;
  }
  return null;
};

const advancedAlgoFindWinningCampaign = (
  settings: any,
  shortlistedCampaigns: any[],
  context: any,
  calledCampaignIds: any[],
  groupId: any,
) => {
  let winnerCampaign = null;
  let found = false; // flag to check whether winnerCampaign has been found or not and helps to break from the outer loop
  const priorityOrder = typeof settings.groups[groupId].p !== 'undefined' ? settings.groups[groupId].p : {};
  const wt = typeof settings.groups[groupId].wt !== 'undefined' ? settings.groups[groupId].wt : {};

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
      if (typeof wt[campaignId] !== 'undefined') {
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
      new DecisionMaker().calculateBucketValue(getBucketingSeed(context.id, undefined, groupId)),
    );
  }
  // WinnerCampaign should not be null, in case when winnerCampaign hasn't been found through PriorityOrder and
  // also shortlistedCampaigns and wt array does not have a single campaign id in common
  LogManager.Instance.debug(
    `MEG Advance: Campaign ${winnerCampaign.key} is the winner for group ${groupId} for user ${context.id}`,
  );
  if (calledCampaignIds.includes(winnerCampaign.id)) {
    return winnerCampaign;
  }
  return null;
};
