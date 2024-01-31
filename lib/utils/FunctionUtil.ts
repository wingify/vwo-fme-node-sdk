import { dynamic } from '../types/common';
import { isString } from './DataTypeUtil';

export function cloneObject(obj: dynamic): any {
  if (!obj) {
    return obj;
  }
  const clonedObj = JSON.parse(JSON.stringify(obj));
  return clonedObj;
}

export function getCurrentUnixTimestamp(): number {
  return Math.ceil(+new Date() / 1000);
}

export function getCurrentUnixTimestampInMillis(): number {
  return +new Date();
}

export function getRandomNumber(): number {
  return Math.random();
}

export function getSpecificRulesBasedOnType(settingsFile, featureKey, type = null) {
  let feature = settingsFile.features.find(feature => feature.key === featureKey);
  if (type && isString(type)){
    return feature.rulesLinkedCampaign.filter(rule => rule.type === type);
  }
  return feature.rulesLinkedCampaign;
}

export function eventExists(eventName: string, settings: any): boolean {
  for (const feature of settings.features) {
    for (const metric of feature.metrics) {
      if (metric.eventName === eventName) {
        return true;
      }
    }
  }
  return false;
}

export function addLInkedCampaignsToSettings(settingsFile: any): void {
  // loop over all features
  for (const feature of settingsFile.features) {
    const { rules } = feature;
    const campaigns = settingsFile.campaigns;
    const rulesLinkedCampaign = [];

    // loop over all rules of a feature
    for (const rule of rules) {
      const { campaignId, variationId } = rule;
      if (campaignId) {
        // find the campaign with the given campaignId
        const campaign = campaigns.find((c) => c.id === campaignId);
        if (campaign) {
          // create a linked campaign object with the rule and campaign
          const linkedCampaign = { key: campaign.key, ...rule, ...campaign };

          if (variationId) {
            // find the variation with the given variationId
            const variation = campaign.variations.find((v) => v.id === variationId);
            if (variation) {
              // add the variation to the linked campaign
              linkedCampaign.variations = [variation];
            }
          }
          // add the linked campaign to the rulesLinkedCampaign array
          rulesLinkedCampaign.push(linkedCampaign);
        }
      }
    }
    feature.rulesLinkedCampaign = rulesLinkedCampaign;
  }
}
