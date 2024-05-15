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
import { CampaignModel } from '../models/campaign/CampaignModel';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { SettingsModel } from '../models/settings/SettingsModel';
import { dynamic } from '../types/Common';
import { isString } from './DataTypeUtil';
import { FeatureModel } from '../models/campaign/FeatureModel';

/**
 * Clones an object deeply.
 * @param {dynamic} obj - The object to clone.
 * @returns {any} The cloned object.
 */
export function cloneObject(obj: dynamic): any {
  if (!obj) {
    // Return the original object if it is null or undefined
    return obj;
  }
  // Use JSON stringify and parse method to perform a deep clone
  const clonedObj = JSON.parse(JSON.stringify(obj));
  return clonedObj;
}

/**
 * Gets the current Unix timestamp in seconds.
 * @returns {number} The current Unix timestamp.
 */
export function getCurrentUnixTimestamp(): number {
  // Convert the current date to Unix timestamp in seconds
  return Math.ceil(+new Date() / 1000);
}

/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns {number} The current Unix timestamp in milliseconds.
 */
export function getCurrentUnixTimestampInMillis(): number {
  // Convert the current date to Unix timestamp in milliseconds
  return +new Date();
}

/**
 * Generates a random number between 0 and 1.
 * @returns {number} A random number.
 */
export function getRandomNumber(): number {
  // Use Math.random to generate a random number
  return Math.random();
}

/**
 * Retrieves specific rules based on the type from a feature.
 * @param {FeatureModel} feature - The key of the feature.
 * @param {CampaignTypeEnum | null} type - The type of the rules to retrieve.
 * @returns {Array} An array of rules that match the type.
 */
export function getSpecificRulesBasedOnType(feature: FeatureModel, type: CampaignTypeEnum = null) {
  // Return an empty array if no linked campaigns are found
  if (feature && !feature.getRulesLinkedCampaign()) {
    return [];
  }
  // Filter the rules by type if a type is specified and is a string
  if (feature && feature.getRulesLinkedCampaign() && type && isString(type)) {
    return feature.getRulesLinkedCampaign().filter((rule) => rule.getType() === type);
  }
  // Return all linked campaigns if no type is specified
  return feature.getRulesLinkedCampaign();
}

/**
 * Retrieves all AB and Personalize rules from a feature.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of AB and Personalize rules.
 */
export function getAllAbAndPersonaliseRules(settings: SettingsModel, featureKey: string) {
  // Retrieve the feature by its key
  const feature = getFeatureFromKey(settings, featureKey);
  // Filter the rules to include only AB and Personalize types
  return feature?.getRulesLinkedCampaign().filter(
    (rule) => rule.getType() === CampaignTypeEnum.AB || rule.getType() === CampaignTypeEnum.PERSONALIZE,
  ) || [];
}

/**
 * Retrieves a feature by its key from the settings.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {any} The feature if found, otherwise undefined.
 */
export function getFeatureFromKey(settings: SettingsModel, featureKey: string) {
  // Find the feature by its key
  return settings?.getFeatures()?.find((feature) => feature.getKey() === featureKey);
}

/**
 * Retrieves the name of a feature based on its key from the provided settings.
 * @param {SettingsModel} settings - The settings model containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {string} The name of the feature if found, otherwise an empty string.
 */
export function getFeatureNameFromKey(settings: SettingsModel, featureKey: string): string {
  // Attempt to find the feature by its key in the settings
  const feature = getFeatureFromKey(settings, featureKey);
  // Return the name of the feature if it exists, otherwise return an empty string
  return feature ? feature.getName() : '';
}

/**
 * Retrieves the ID of a feature based on its key from the provided settings.
 * @param {SettingsModel} settings - The settings model containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {number|null} The ID of the feature if found, otherwise null.
 */
export function getFeatureIdFromKey(settings: SettingsModel, featureKey: string): number {
  // Attempt to find the feature by its key in the settings
  const feature = getFeatureFromKey(settings, featureKey);
  // Return the ID of the feature if it exists, otherwise return null
  return feature ? feature.getId() : null;
}


/**
 * Checks if an event exists within any feature's metrics.
 * @param {string} eventName - The name of the event to check.
 * @param {any} settings - The settings containing features.
 * @returns {boolean} True if the event exists, otherwise false.
 */
export function doesEventBelongToAnyFeature(eventName: string, settings: SettingsModel): boolean {
  // Use the `some` method to check if any feature contains the event in its metrics
  return settings.getFeatures().some(feature =>
    feature.getMetrics().some(metric => metric.getIdentifier() === eventName)
  );
}

/**
 * Adds linked campaigns to each feature in the settings based on rules.
 * @param {any} settings - The settings file to modify.
 */
export function addLinkedCampaignsToSettings(settings: SettingsModel): void {
  // Create maps for quick access to campaigns and variations
  const campaignMap = new Map<number, CampaignModel>(settings.getCampaigns().map(campaign => [campaign.getId(), campaign]));

  // Loop over all features
  for (const feature of settings.getFeatures()) {
    const rulesLinkedCampaign = feature.getRules().map(rule => {
      const campaign: CampaignModel = campaignMap.get(rule.getCampaignId());
      if (!campaign) return null;

      // Create a linked campaign object with the rule and campaign
      const linkedCampaign: any = { key: campaign.getKey(), ...rule, ...campaign };

      // If a variationId is specified, find and add the variation
      if (rule.getVariationId()) {
        const variation = campaign.getVariations().find(v => v.getId() === rule.getVariationId());
        if (variation) {
          linkedCampaign.variations = [variation];
        }
      }

      return linkedCampaign;
    }).filter(campaign => campaign !== null); // Filter out any null entries
    
    const rulesLinkedCampaignModel = rulesLinkedCampaign.map((campaign) => {
      const campaignModel = new CampaignModel();
      campaignModel.modelFromDictionary(campaign);
      return campaignModel;
    });
    // Assign the linked campaigns to the feature
    feature.setRulesLinkedCampaign(rulesLinkedCampaignModel);
  }
}
