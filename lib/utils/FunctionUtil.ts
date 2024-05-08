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
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { SettingsModel } from '../models/SettingsModel';
import { dynamic } from '../types/Common';
import { isString } from './DataTypeUtil';

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
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature.
 * @param {string|null} type - The type of the rules to retrieve.
 * @returns {Array} An array of rules that match the type.
 */
export function getSpecificRulesBasedOnType(settings, featureKey, type = null) {
  // Retrieve the feature by its key
  const feature = getFeatureFromKey(settings, featureKey);
  // Return an empty array if no linked campaigns are found
  if (feature && !feature.rulesLinkedCampaign) {
    return [];
  }

  // Filter the rules by type if a type is specified and is a string
  if (feature && feature.rulesLinkedCampaign && type && isString(type)) {
    return feature.rulesLinkedCampaign.filter((rule) => rule.type === type);
  }

  // Return all linked campaigns if no type is specified
  return feature.rulesLinkedCampaign;
}

/**
 * Retrieves all AB and Personalize rules from a feature.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of AB and Personalize rules.
 */
export function getAllAbAndPersonaliseRules(settings, featureKey) {
  // Retrieve the feature by its key
  const feature = getFeatureFromKey(settings, featureKey);
  // Filter the rules to include only AB and Personalize types
  return feature.rulesLinkedCampaign.filter(
    (rule) => rule.type === CampaignTypeEnum.AB || rule.type === CampaignTypeEnum.PERSONALIZE,
  );
}

/**
 * Retrieves a feature by its key from the settings.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {any} The feature if found, otherwise undefined.
 */
export function getFeatureFromKey(settings, featureKey) {
  // Find the feature by its key
  return settings?.features?.find((feature) => feature.key === featureKey);
}

/**
 * Checks if an event exists within any feature's metrics.
 * @param {string} eventName - The name of the event to check.
 * @param {any} settings - The settings containing features.
 * @returns {boolean} True if the event exists, otherwise false.
 */
export function eventExists(eventName: string, settings: any): boolean {
  // Iterate over features and their metrics to find the event
  for (const feature of settings.features) {
    for (const metric of feature.metrics) {
      if (metric.identifier === eventName) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Adds linked campaigns to each feature in the settings based on rules.
 * @param {any} settingsFile - The settings file to modify.
 */
export function addLinkedCampaignsToSettings(settingsFile: any): void {
  // Create maps for quick access to campaigns and variations
  const campaignMap = new Map(settingsFile.campaigns.map(campaign => [campaign.id, campaign]));

  // Loop over all features
  for (const feature of settingsFile.features) {
    const rulesLinkedCampaign = feature.rules.map(rule => {
      const campaign: any = campaignMap.get(rule.campaignId);
      if (!campaign) return null;

      // Create a linked campaign object with the rule and campaign
      const linkedCampaign = { key: campaign.key, ...rule, ...campaign };

      // If a variationId is specified, find and add the variation
      if (rule.variationId) {
        const variation = campaign.variations.find(v => v.id === rule.variationId);
        if (variation) {
          linkedCampaign.variations = [variation];
        }
      }

      return linkedCampaign;
    }).filter(campaign => campaign !== null); // Filter out any null entries

    // Assign the linked campaigns to the feature
    feature.rulesLinkedCampaign = rulesLinkedCampaign;
  }
}

/**
 * Retrieves the name of a feature based on its key from the provided settings.
 * @param {SettingsModel} settings - The settings model containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {string} The name of the feature if found, otherwise an empty string.
 */
export function getFeatureNameFromKey(settings: SettingsModel, featureKey: string): string {
  // Attempt to find the feature by its key in the settings
  const feature = settings.getFeatures().find((f) => f.getKey() === featureKey);
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
  const feature = settings.getFeatures().find((f) => f.getKey() === featureKey);
  // Return the ID of the feature if it exists, otherwise return null
  return feature ? feature.getId() : null;
}
