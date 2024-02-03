import { VariationModel } from '../models/VariationModel';
import { VariableModel } from '../models/VariableModel';
import { Constants } from '../constants';
import { CampaignModel } from '../models/CampaignModel';
import { LogManager } from '../modules/logger';
import { CampaignTypeEnum } from '../enums/campaignTypeEnum';

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
