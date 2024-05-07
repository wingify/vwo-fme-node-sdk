import { evaluateRule } from '../api/GetFlag';
import { Constants } from '../constants';
import { StorageDecorator } from '../decorators/StorageDecorator';
import { CampaignTypeEnum } from '../enums/campaignTypeEnum';
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
  getCampaignVariation,
  getFeatureKeysFromCampaignIds,
  getRuleTypeUsingCampaignIdFromFeature,
  setCampaignAllocation,
} from './CampaignUtil';
import { isObject } from './DataTypeUtil';
import { evaluateTrafficAndGetVariation } from './DecisionUtil';
import { cloneObject, getFeatureFromKey, getSpecificRulesBasedOnType } from './FunctionUtil';

export const evaluateGroups = async (
  settings: SettingsModel,
  featureKey: any,
  feature: any,
  listOfMegCampaignsGroups: any[],
  evaluatedFeatureMap: Map<string, any>,
  context: any,
  storageService: StorageService,
  campaignToSkip: any[],
  decision: any,
): Promise<any> => {
  let featureToSkip = [];
  let eligibleCampaignsForGroup: Map<string, any[]> = new Map();

  // get all feature keys from the list of meg campaigns
  // evaluate each feature and get all campaigns for the feature
  // add the campaigns if they are present in the groupto campaignMap
  // check the eligible campaigns
  for (let i = 0; i < listOfMegCampaignsGroups.length; i++) {
    let campaignMap: Map<string, any[]> = new Map();
    let groupId = listOfMegCampaignsGroups[i];
    const { featureKeys, groupCampaignIds } = getFeatureKeysFromGroup(settings, groupId);
    for (const featureKey of featureKeys) {
      const feature = getFeatureFromKey(settings, featureKey);
      const featureCampaignIds = getCampaignIdsFromFeatureKey(settings, featureKey);
      if (featureToSkip.includes(featureKey)) {
        continue;
      }
      const result = await evaluateFeatureRollOutRules(settings, feature, evaluatedFeatureMap, featureToSkip, context);
      if (result) {
        settings.getCampaigns().forEach((campaign) => {
          // groupCampaignIds.includes(campaign.getId()) -> campaig we are adding should be in the group
          // featureCampaignIds.includes(campaign.getId()) -> checks that campaign should be part of the feature that we evaluated
          if (groupCampaignIds.includes(campaign.getId()) && featureCampaignIds.includes(campaign.getId())) {
            if (!campaignMap.has(featureKey)) {
              campaignMap.set(featureKey, []);
            }
            if (campaignMap.get(featureKey).findIndex((item) => item.key === campaign.getKey()) === -1) {
              campaignMap.get(featureKey).push(campaign);
            }
          }
        });
      }
    }
    let campaignList = await getEligbleCampaigns(settings, campaignMap, context, storageService);
    eligibleCampaignsForGroup.set(groupId, campaignList);
  }
  return await evaluateEligibleCampaigns(
    settings,
    featureKey,
    feature,
    eligibleCampaignsForGroup,
    context,
    campaignToSkip,
    decision,
  );
};

export function getFeatureKeysFromGroup(settings: SettingsModel, groupId: any) {
  let groupCampaignIds = getCampaignsByGroupId(settings, groupId);
  let featureKeys = getFeatureKeysFromCampaignIds(settings, groupCampaignIds);
  return { featureKeys, groupCampaignIds };
}

const evaluateFeatureRollOutRules = async (
  settings: any,
  feature: any,
  evaluatedFeatureMap: Map<string, any>,
  featureToSkip: any[],
  context: any,
): Promise<any> => {
  if (evaluatedFeatureMap.has(feature.key) && evaluatedFeatureMap.get(feature.key).hasOwnProperty('rolloutId')) {
    return true;
  }
  const rollOutRules = getSpecificRulesBasedOnType(settings, feature.key, CampaignTypeEnum.ROLLOUT);
  if (rollOutRules.length > 0) {
    let ruleToTestForTraffic = null;
    for (const rule of rollOutRules) {
      const [evaluateRuleResult] = await evaluateRule(settings, feature, rule, context, false, {});
      if (evaluateRuleResult) {
        ruleToTestForTraffic = rule;
        break;
      }
      continue;
    }
    if (ruleToTestForTraffic !== null) {
      const campaign = new CampaignModel().modelFromDictionary(ruleToTestForTraffic);
      const variation = evaluateTrafficAndGetVariation(settings, campaign, context.user.id);
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
  let eligibleCampaigns = [];
  let eligibleCampaignsWithStorage = [];
  let inEligibleCampaigns = [];
  const campaignMapArray = Array.from<[string, CampaignModel[]]>(campaignMap);
  for (const [featureKey, campaigns] of campaignMapArray) {
    for (const campaign of campaigns) {
      const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(
        featureKey,
        context.user,
        storageService,
      );
      if (storedData?.experimentVariationId) {
        if (storedData.experimentKey && storedData.experimentKey === campaign.getKey()) {
          const variation: VariationModel = getCampaignVariation(
            settings,
            storedData.experimentKey,
            storedData.experimentVariationId,
          );
          if (variation) {
            LogManager.Instance.debug(
              `MEG: Campaign ${storedData.experimentKey} found in storage for user ${context.user.id}`,
            );
            eligibleCampaignsWithStorage.push(campaign);
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
        new CampaignDecisionService().isUserPartOfCampaign(context.user.id, campaign)
      ) {
        LogManager.Instance.debug(`MEG: Campaign ${campaign.getKey()} is eligible for user ${context.user.id}`);
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
  feature: any,
  eligibleCampaignsForGroup: Map<string, any[]>,
  context: any,
  campaignToSkip: any[],
  decision: any,
): Promise<any> => {
  // getCampaignIds from featureKey
  let winnerFromEachGroup = [];
  const campaignIds = getCampaignIdsFromFeatureKey(settings, featureKey);
  eligibleCampaignsForGroup.forEach((campaignList: any, groupId) => {
    let megAlgoNumber =
      typeof settings.groups[groupId].et !== 'undefined' ? settings.groups[groupId].et : Constants.RANDOM_ALGO;
    if (campaignList.eligibleCampaignsWithStorage.length === 1) {
      winnerFromEachGroup.push(campaignList.eligibleCampaignsWithStorage[0]);
      LogManager.Instance.debug(
        `MEG: Campaign ${campaignList.eligibleCampaignsWithStorage[0].getKey()} is the winner for group ${groupId} for user ${context.user.id}`,
      );
    } else if (campaignList.eligibleCampaignsWithStorage.length > 1 && megAlgoNumber === Constants.RANDOM_ALGO) {
      winnerFromEachGroup.push(
        normalizeAndFindWinningCampaign(campaignList.eligibleCampaignsWithStorage, context, campaignIds, groupId),
      );
    } else if (campaignList.eligibleCampaignsWithStorage.length > 1) {
      winnerFromEachGroup.push(
        advancedAlgoFindWinningCampaign(
          settings,
          campaignList.eligibleCampaignsWithStorage,
          context,
          campaignIds,
          groupId,
        ),
      );
    }

    if (campaignList.eligibleCampaignsWithStorage.length === 0) {
      if (campaignList.eligibleCampaigns.length === 1) {
        winnerFromEachGroup.push(campaignList.eligibleCampaigns[0]);
        LogManager.Instance.debug(
          `MEG: Campaign ${campaignList.eligibleCampaigns[0].getKey()} is the winner for group ${groupId} for user ${context.user.id}`,
        );
      } else if (campaignList.eligibleCampaigns.length > 1 && megAlgoNumber === Constants.RANDOM_ALGO) {
        winnerFromEachGroup.push(
          normalizeAndFindWinningCampaign(campaignList.eligibleCampaigns, context, campaignIds, groupId),
        );
      } else if (campaignList.eligibleCampaigns.length > 1) {
        winnerFromEachGroup.push(
          advancedAlgoFindWinningCampaign(settings, campaignList.eligibleCampaigns, context, campaignIds, groupId),
        );
      }
    }
  });
  return await campaignToReturn(
    settings,
    feature,
    eligibleCampaignsForGroup,
    winnerFromEachGroup,
    context,
    campaignIds,
    campaignToSkip,
    decision,
  );
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
  let winnerCampaign = new CampaignDecisionService().getVariation(
    shortlistedCampaigns,
    new DecisionMaker().calculateBucketValue(getBucketingSeed(context.user.id, undefined, groupId)),
  );

  LogManager.Instance.debug(
    `MEG Random: Campaign ${winnerCampaign.getKey()} is the winner for group ${groupId} for user ${context.user.id}`,
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
  let priorityOrder = typeof settings.groups[groupId].p !== 'undefined' ? settings.groups[groupId].p : {};
  let wt = typeof settings.groups[groupId].wt !== 'undefined' ? settings.groups[groupId].wt : {};

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
      let campaignId = shortlistedCampaigns[i].id;
      if (typeof wt[campaignId] !== 'undefined') {
        let clonedCampaign = cloneObject(shortlistedCampaigns[i]);
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
      new DecisionMaker().calculateBucketValue(getBucketingSeed(context.user.id, undefined, groupId)),
    );
  }
  // WinnerCampaign should not be null, in case when winnerCampaign hasn't been found through PriorityOrder and
  // also shortlistedCampaigns and wt array does not have a single campaign id in common
  LogManager.Instance.debug(
    `MEG Advance: Campaign ${winnerCampaign.key} is the winner for group ${groupId} for user ${context.user.id}`,
  );
  if (calledCampaignIds.includes(winnerCampaign.id)) {
    return winnerCampaign;
  }
  return null;
};

const campaignToReturn = async (
  settings: any,
  feature: any,
  eligibleCampaignsForGroup: any,
  winnerCampaigns: any,
  context: any,
  priorityCampaignIds: any,
  campaignToSkip: any[],
  decision: any,
): Promise<any> => {
  const eligibleCampaignsForGroupArray = Array.from<[string, any[]]>(eligibleCampaignsForGroup);
  for (const [groupId, campaignList] of eligibleCampaignsForGroupArray) {
    let winnerFound = false;
    let campaignToReturn = null;
    for (const campaignId of priorityCampaignIds) {
      const winnerCampaign = winnerCampaigns.find((campaign) => campaign?.id === campaignId);
      if (winnerCampaign) {
        campaignToReturn = winnerCampaign;
        winnerFound = true;
        break;
      }
      if (
        campaignToSkip.includes(campaignId) ||
        getRuleTypeUsingCampaignIdFromFeature(feature, campaignId) === CampaignTypeEnum.ROLLOUT
      ) {
        continue;
      }
      // check if campaignId is present in eligibleCampaignsWithStorage or eligibleCampaigns or inEligibleCampaigns
      const campaign =
        campaignList['eligibleCampaignsWithStorage'].find((campaign) => campaign.id === campaignId) ||
        campaignList['eligibleCampaigns'].find((campaign) => campaign.id === campaignId) ||
        campaignList['inEligibleCampaigns'].find((campaign) => campaign.id === campaignId);
      if (campaign) {
        continue;
      } else {
        campaignToSkip.push(campaignId);
        return [false, null, null];
      }
    }
    if (winnerFound) {
      LogManager.Instance.info(`MEG: Campaign ${campaignToReturn.key} is the winner for user ${context.user.id}`);
      const [megResult, whitelistedVariationInfoWithCampaign] = await evaluateRule(
        settings,
        feature,
        campaignToReturn,
        context,
        true,
        decision,
      );
      if (
        isObject(whitelistedVariationInfoWithCampaign) &&
        Object.keys(whitelistedVariationInfoWithCampaign).length > 0
      ) {
        whitelistedVariationInfoWithCampaign.experiementId = campaignToReturn.id;
        whitelistedVariationInfoWithCampaign.experiementKey = campaignToReturn.key;
        return [true, whitelistedVariationInfoWithCampaign, null];
      }
      return [true, whitelistedVariationInfoWithCampaign, campaignToReturn];
    }
  }
  return [false, null, null];
};
