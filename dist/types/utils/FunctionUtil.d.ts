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
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { dynamic } from '../types/Common';
/**
 * Clones an object deeply.
 * @param {dynamic} obj - The object to clone.
 * @returns {any} The cloned object.
 */
export declare function cloneObject(obj: dynamic): any;
/**
 * Gets the current time in ISO string format.
 * @returns {string} The current time in ISO string format.
 */
export declare function getCurrentTime(): string;
/**
 * Gets the current Unix timestamp in seconds.
 * @returns {number} The current Unix timestamp.
 */
export declare function getCurrentUnixTimestamp(): number;
/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns {number} The current Unix timestamp in milliseconds.
 */
export declare function getCurrentUnixTimestampInMillis(): number;
/**
 * Generates a random number between 0 and 1.
 * @returns {number} A random number.
 */
export declare function getRandomNumber(): number;
/**
 * Retrieves specific rules based on the type from a feature.
 * @param {FeatureModel} feature - The key of the feature.
 * @param {CampaignTypeEnum | null} type - The type of the rules to retrieve.
 * @returns {Array} An array of rules that match the type.
 */
export declare function getSpecificRulesBasedOnType(feature: FeatureModel, type?: CampaignTypeEnum): CampaignModel[];
/**
 * Retrieves all AB and Personalize rules from a feature.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of AB and Personalize rules.
 */
export declare function getAllExperimentRules(feature: FeatureModel): CampaignModel[];
/**
 * Retrieves a feature by its key from the settings.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {any} The feature if found, otherwise undefined.
 */
export declare function getFeatureFromKey(settings: SettingsModel, featureKey: string): FeatureModel;
/**
 * Checks if an event exists within any feature's metrics.
 * @param {string} eventName - The name of the event to check.
 * @param {any} settings - The settings containing features.
 * @returns {boolean} True if the event exists, otherwise false.
 */
export declare function doesEventBelongToAnyFeature(eventName: string, settings: SettingsModel): boolean;
/**
 * Adds linked campaigns to each feature in the settings based on rules.
 * @param {any} settings - The settings file to modify.
 */
export declare function addLinkedCampaignsToSettings(settings: SettingsModel): void;
/**
 * Formats an error message.
 * @param {any} error - The error to format.
 * @returns {string} The formatted error message.
 */
export declare function getFormattedErrorMessage(error: any): string;
