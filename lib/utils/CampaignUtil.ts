import { VariationModel } from '../models/VariationModel';
import { VariableModel } from '../models/VariableModel';
import { Constants } from '../constants';
import { CampaignModel } from '../models/CampaignModel';
import { LogManager } from '../modules/logger';
import { CampaignTypeEnum } from '../enums/campaignTypeEnum';
import { SettingsModel } from '../models/SettingsModel';

export function setVariationAllocation(campaign: CampaignModel): void {
  if (campaign.getType() === CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum.PERSONALIZE) {
    // Handle special logic for rollout or personalize campaigns
    handleRolloutCampaign(campaign);
  } else {
    let stepFactor = 0;
    const numberOfVariations = campaign.getVariations().length;
    for (let i = 0, currentAllocation = 0; i < numberOfVariations; i++) {
      let variation = campaign.getVariations()[i];

      stepFactor = assignRangeValues(variation, currentAllocation);
      currentAllocation += stepFactor;
      LogManager.Instance.debug(
        `VARIATION_RANGE_ALLOCATION: Variation:${variation.getKey()} of Campaign:${campaign.getKey()} having weight:${variation.getWeight()} got bucketing range: ( ${variation.getStartRangeVariation()} - ${variation.getEndRangeVariation()} )`,
      );
    }
  }
}

function handleRolloutCampaign(campaign: CampaignModel): void {
  // Set start and end ranges for all variations in the campaign
  for (let i = 0; i < campaign.getVariations().length; i++) {
    let variation = campaign.getVariations()[i];
    let endRange = campaign.getVariations()[i].getWeight() * 100;
    variation.setStartRange(1);
    variation.setEndRange(endRange);
    LogManager.Instance.debug(
      `VARIATION_RANGE_ALLOCATION: Variation:${variation.getKey()} of Campaign:${campaign.getKey()} got bucketing range: ( ${1} - ${endRange} )`,
    );
  }
}

function copyVariableData(variationVariable: Array<VariableModel>, featureVariable: Array<VariableModel>): void {
  // create a featureVariableMap
  const featureVariableMap: Record<number, VariableModel> = {};
  featureVariable.forEach((variable: VariableModel) => {
    featureVariableMap[variable.getId()] = variable;
  });
  variationVariable.forEach((variable: VariableModel) => {
    const featureVariable: VariableModel = featureVariableMap[variable.getId()];
    if (featureVariable) {
      variable.setKey(featureVariable.getKey());
      variable.setType(featureVariable.getType());
    }
  });
}

export function assignRangeValues(data: VariationModel, currentAllocation: number) {
  const stepFactor: number = getVariationBucketRange(data.getWeight());

  if (stepFactor) {
    data.setStartRange(currentAllocation + 1);
    data.setEndRange(currentAllocation + stepFactor);
  } else {
    data.setStartRange(-1);
    data.setEndRange(-1);
  }
  return stepFactor;
}

function getVariationBucketRange(variationWeight: number) {
  if (!variationWeight || variationWeight === 0) {
    return 0;
  }

  const startRange = Math.ceil(variationWeight * 100);

  return Math.min(startRange, Constants.MAX_TRAFFIC_VALUE);
}

export function scaleVariationWeights(variations: any) {
  const totalWeight = variations.reduce((acc, variation) => {
    return acc + variation.weight;
  }, 0);
  if (!totalWeight) {
    const weight = 100 / variations.length;
    variations.forEach((variation) => (variation.weight = weight));
  } else {
    variations.forEach((variation) => (variation.weight = (variation.weight / totalWeight) * 100));
  }
}

export function getBucketingSeed(userId, campaign, groupId) {
  if (groupId) {
    return `${groupId}_${userId}`;
  }
  return `${campaign.id}_${userId}`;
}

export function getCampaignVariation(settings, campaignKey, variationId) {
  const campaign: CampaignModel = settings.getCampaigns().find((campaign: CampaignModel) => {
    return campaign.getKey() === campaignKey;
  });

  if (campaign) {
    const variation:VariationModel = campaign.getVariations().find((variation: VariationModel) => {
      return variation.getId() === variationId;
    });

    if (variation) {
      return new VariationModel().modelFromDictionary(variation);
    }
  }
  return null;;
}

export function getRolloutVariation(settings, rolloutKey, variationId) {
  const rolloutCampaign: CampaignModel = settings.getCampaigns().find((campaign: CampaignModel) => {
    return campaign.getKey() === rolloutKey;
  });

  if (rolloutCampaign) {
    const variation:VariationModel = rolloutCampaign.getVariations().find((variation: VariationModel) => {
      return variation.getId() === variationId;
    });

    if (variation) {
      return new VariationModel().modelFromDictionary(variation);
    }
  }
  return null;;
}

export function setCampaignAllocation (campaigns: any[]) {
  let stepFactor = 0;
  for (let i = 0, currentAllocation = 0; i < campaigns.length; i++) {
    let campaign = campaigns[i];

    stepFactor = assignRangeValuesMEG(campaign, currentAllocation);
    currentAllocation += stepFactor;
  }
}

export function isPartOfGroup(settings: any, campaignId: any) {
  if (settings.campaignGroups && settings.campaignGroups.hasOwnProperty(campaignId)) {
    return {
      groupId: settings.campaignGroups[campaignId],
      groupName: settings.groups[settings.campaignGroups[campaignId]].name
    };
  }
  return {};
}

export function findGroupsFeaturePartOf(settings: any, featureKey: string) {
  const campaignIds: Array<number> = [];
  // loop over all rules inside feature where feature key is given featureKey and get all campaignIds
  settings.features.forEach((feature) => {
    if (feature.key === featureKey) {
      feature.rules.forEach((rule) => {
        if (campaignIds.indexOf(rule.campaignId) === -1) {
          campaignIds.push(rule.campaignId);
        }
      });
    }
  });

  // loop over all campaigns and find the group for the campaign
  const groups: Array<any> = [];
  campaignIds.forEach((campaignId) => {
    const group = isPartOfGroup(settings, campaignId);
    if (group.groupId) {
      // check if group is already added to groups array
      const groupIndex = groups.findIndex((grp) => grp.groupId === group.groupId);
      if (groupIndex === -1) {
        groups.push(group);
      }
    }
  });
  return groups;
}

export function getCampaignsByGroupId(settings: SettingsModel, groupId: any) {
  const group = settings.getGroups()[groupId];
  if (group) {
    return group.campaigns;
  } else {
    return []; // Return an empty array if the group ID is not found
  }
}

export function getFeatureKeysFromCampaignIds(settings: SettingsModel, campaignIds: any) {
  const featureKeys = [];
  for (const campaignId of campaignIds) {
    settings.getFeatures().forEach((feature) => {
      feature.getRules().forEach((rule) => {
        if (rule.getCampaignId() === campaignId) {
          featureKeys.push(feature.getKey());
        }
      });
    }
  )}
  return featureKeys;
}

export function getCampaignIdsFromFeatureKey(settings: SettingsModel, featureKey: string) {
  const campaignIds = [];
  settings.getFeatures().forEach((feature) => {
    if (feature.getKey() === featureKey) {
      feature.getRules().forEach((rule) => {
        campaignIds.push(rule.getCampaignId());
      });
    }
  });
  return campaignIds;
}

export function assignRangeValuesMEG(data: any, currentAllocation: number) {
  const stepFactor: number = getVariationBucketRange(data.weight);

  if (stepFactor) {
    data.startRangeVariation = currentAllocation + 1;
    data.endRangeVariation = currentAllocation + stepFactor;
  } else {
    data.startRangeVariation = -1;
    data.endRangeVariation = -1;
  }
  return stepFactor;
}

export function getRuleTypeUsingCampaignIdFromFeature(feature:any, campaignId: number) {
  let ruleType = '';
  feature.rules.forEach((rule) => {
    if (rule.campaignId === campaignId) {
      ruleType = rule.type;
    }
  });
  return ruleType;
}
