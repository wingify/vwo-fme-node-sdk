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
import { StorageDecorator } from '../../../decorators/StorageDecorator';
import { SettingsModel } from '../../../models/settings/SettingsModel';
import { LogManager } from '../../logger';
import { StorageService } from '../../../services/StorageService';
import { dynamic } from '../../../types/Common';
import { isObject } from '../../../utils/DataTypeUtil';
import { SegmentOperatorValueEnum } from '../enums/SegmentOperatorValueEnum';
import { Segmentation } from '../Segmentation';
import { getKeyValue } from '../utils/SegmentUtil';
import { SegmentOperandEvaluator } from './SegmentOperandEvaluator';
import { ContextModel } from '../../../models/user/ContextModel';
import { FeatureModel } from '../../../models/campaign/FeatureModel';

export class SegmentEvaluator implements Segmentation {
  context: ContextModel;
  settings: SettingsModel;
  feature: FeatureModel;

  /**
   * Validates if the segmentation defined in the DSL is applicable based on the provided properties.
   * @param dsl The domain-specific language defining the segmentation rules.
   * @param properties The properties against which the DSL rules are evaluated.
   * @returns A Promise resolving to a boolean indicating if the segmentation is valid.
   */
  async isSegmentationValid(dsl: Record<string, dynamic>, properties: Record<string, dynamic>): Promise<boolean> {
    const { key, value } = getKeyValue(dsl);
    const operator = key;
    const subDsl = value;

    // Evaluate based on the type of segmentation operator
    switch (operator) {
      case SegmentOperatorValueEnum.NOT:
        const result = await this.isSegmentationValid(subDsl, properties);
        return !result;
      case SegmentOperatorValueEnum.AND:
        return await this.every(subDsl, properties);
      case SegmentOperatorValueEnum.OR:
        return await this.some(subDsl, properties);
      case SegmentOperatorValueEnum.CUSTOM_VARIABLE:
        return await new SegmentOperandEvaluator().evaluateCustomVariableDSL(subDsl, properties);
      case SegmentOperatorValueEnum.USER:
        return new SegmentOperandEvaluator().evaluateUserDSL(subDsl, properties);
      case SegmentOperatorValueEnum.UA:
        return new SegmentOperandEvaluator().evaluateUserAgentDSL(subDsl, this.context);
      default:
        return false;
    }
  }

  /**
   * Evaluates if any of the DSL nodes are valid using the OR logic.
   * @param dslNodes Array of DSL nodes to evaluate.
   * @param customVariables Custom variables provided for evaluation.
   * @returns A Promise resolving to a boolean indicating if any of the nodes are valid.
   */
  async some(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>): Promise<boolean> {
    const uaParserMap: Record<string, string[]> = {};
    let keyCount: number = 0; // Initialize count of keys encountered
    let isUaParser = false;

    for (const dsl of dslNodes) {
      for (const key in dsl) {
        // Check for user agent related keys
        if (
          key === SegmentOperatorValueEnum.OPERATING_SYSTEM ||
          key === SegmentOperatorValueEnum.BROWSER_AGENT ||
          key === SegmentOperatorValueEnum.DEVICE_TYPE ||
          key === SegmentOperatorValueEnum.DEVICE
        ) {
          isUaParser = true;
          const value = dsl[key];

          if (!uaParserMap[key]) {
            uaParserMap[key] = [];
          }

          // Ensure value is treated as an array of strings
          const valuesArray = Array.isArray(value) ? value : [value];
          valuesArray.forEach((val: dynamic) => {
            if (typeof val === 'string') {
              uaParserMap[key].push(val);
            }
          });

          keyCount++; // Increment count of keys encountered
        }

        // Check for feature toggle based on feature ID
        if (key === SegmentOperatorValueEnum.FEATURE_ID) {
          const featureIdObject = dsl[key] as Record<string, string>;
          const featureIdKey: string = Object.keys(featureIdObject)[0];
          const featureIdValue: string = featureIdObject[featureIdKey];

          if (featureIdValue === 'on') {
            const features = this.settings.getFeatures();
            const feature = features.find((feature) => feature.getId() === parseInt(featureIdKey));

            if (feature) {
              const featureKey = feature.getKey();
              const result = await this.checkInUserStorage(this.settings, featureKey, this.context);
              return result;
            } else {
              console.error('Feature not found with featureIdKey:', featureIdKey);
              return null; // Handle the case when feature is not found
            }
          }
        }
      }

      // Check if the count of keys encountered is equal to dslNodes.length
      if (isUaParser && keyCount === dslNodes.length) {
        try {
          const uaParserResult = await this.checkUserAgentParser(uaParserMap);
          return uaParserResult;
        } catch (err) {
          LogManager.Instance.error('Failed to validate User Agent. Erro: ' + err);
        }
      }

      // Recursively check each DSL node
      if (await this.isSegmentationValid(dsl, customVariables)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Evaluates all DSL nodes using the AND logic.
   * @param dslNodes Array of DSL nodes to evaluate.
   * @param customVariables Custom variables provided for evaluation.
   * @returns A Promise resolving to a boolean indicating if all nodes are valid.
   */
  async every(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>): Promise<boolean> {
    const locationMap: Record<string, dynamic> = {};
    for (const dsl of dslNodes) {
      // Check if the DSL node contains location-related keys
      if (
        dsl.hasOwnProperty(SegmentOperatorValueEnum.COUNTRY) ||
        dsl.hasOwnProperty(SegmentOperatorValueEnum.REGION) ||
        dsl.hasOwnProperty(SegmentOperatorValueEnum.CITY)
      ) {
        this.addLocationValuesToMap(dsl, locationMap);
        // Check if the number of location keys matches the number of DSL nodes
        if (Object.keys(locationMap).length === dslNodes.length) {
          const segmentResult = await this.checkLocationPreSegmentation(locationMap);
          return segmentResult;
        }
        continue;
      }
      const res = await this.isSegmentationValid(dsl, customVariables);
      if (!res) {
        return false;
      }
    }
    return true;
  }

  /**
   * Adds location values from a DSL node to a map.
   * @param dsl DSL node containing location data.
   * @param locationMap Map to store location data.
   */
  addLocationValuesToMap(dsl: Record<string, dynamic>, locationMap: Record<string, dynamic>): void {
    // Add country, region, and city information to the location map if present
    if (dsl.hasOwnProperty(SegmentOperatorValueEnum.COUNTRY)) {
      locationMap[SegmentOperatorValueEnum.COUNTRY] = dsl[SegmentOperatorValueEnum.COUNTRY];
    }
    if (dsl.hasOwnProperty(SegmentOperatorValueEnum.REGION)) {
      locationMap[SegmentOperatorValueEnum.REGION] = dsl[SegmentOperatorValueEnum.REGION];
    }
    if (dsl.hasOwnProperty(SegmentOperatorValueEnum.CITY)) {
      locationMap[SegmentOperatorValueEnum.CITY] = dsl[SegmentOperatorValueEnum.CITY];
    }
  }

  /**
   * Checks if the user's location matches the expected location criteria.
   * @param locationMap Map of expected location values.
   * @returns A Promise resolving to a boolean indicating if the location matches.
   */
  async checkLocationPreSegmentation(locationMap: Record<string, dynamic>): Promise<boolean> {
    // Ensure user's IP address is available
    if (this.context?.getIpAddress() === undefined) {
      LogManager.Instance.info('To evaluate location pre Segment, please pass ipAddress in context object');
      return false;
    }
    // Check if location data is available and matches the expected values
    if (
      !this.context?.getVwo()?.getLocation() ||
      this.context?.getVwo()?.getLocation() === undefined ||
      this.context?.getVwo()?.getLocation() === null
    ) {
      return false;
    }
    return this.valuesMatch(locationMap, this.context?.getVwo()?.getLocation());
  }

  /**
   * Checks if the user's device information matches the expected criteria.
   * @param uaParserMap Map of expected user agent values.
   * @returns A Promise resolving to a boolean indicating if the user agent matches.
   */
  async checkUserAgentParser(uaParserMap: Record<string, string[]>): Promise<boolean> {
    // Ensure user's user agent is available
    if (!this.context?.getUserAgent() || this.context?.getUserAgent() === undefined) {
      LogManager.Instance.info('To evaluate user agent related segments, please pass userAgent in context object');
      return false;
    }
    // Check if user agent data is available and matches the expected values
    if (!this.context?.getVwo()?.getUaInfo() || this.context?.getVwo()?.getUaInfo() === undefined) {
      return false;
    }

    return this.checkValuePresent(uaParserMap, this.context?.getVwo()?.getUaInfo());
  }

  /**
   * Checks if the feature is enabled for the user by querying the storage.
   * @param settings The settings model containing configuration.
   * @param featureKey The key of the feature to check.
   * @param user The user object to check against.
   * @returns A Promise resolving to a boolean indicating if the feature is enabled for the user.
   */
  async checkInUserStorage(settings: SettingsModel, featureKey: string, context: ContextModel): Promise<any> {
    const storageService = new StorageService();
    // Retrieve feature data from storage
    const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(
      featureKey,
      context,
      storageService,
    );

    // Check if the stored data is an object and not empty
    if (isObject(storedData) && Object.keys(storedData).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the actual values match the expected values specified in the map.
   * @param expectedMap A map of expected values for different keys.
   * @param actualMap A map of actual values to compare against.
   * @returns A Promise resolving to a boolean indicating if all actual values match the expected values.
   */
  async checkValuePresent(expectedMap: Record<string, string[]>, actualMap: Record<string, string>): Promise<boolean> {
    for (const key in actualMap) {
      if (Object.prototype.hasOwnProperty.call(expectedMap, key)) {
        const expectedValues = expectedMap[key];
        const actualValue = actualMap[key];

        // Handle wildcard patterns for all keys
        for (const val of expectedValues) {
          // Check if the value is a wildcard pattern and matches the actual value using regex
          if (val.startsWith('wildcard(') && val.endsWith(')')) {
            // Extract pattern from wildcard string
            const wildcardPattern = val.slice(9, -1);
            // Convert wildcard pattern to regex and check if it matches the actual value
            const regex = new RegExp(wildcardPattern.replace(/\*/g, '.*')); // Convert wildcard pattern to regex
            // Check if the actual value matches the regex pattern for the key
            if (regex.test(actualValue)) {
              // match found, return true as we only need to check if any of the expected values match the actual value
              return true;
            }
          }
        }

        // this will be checked for all cases where wildcard is not present
        if (expectedValues.includes(actualValue?.toLowerCase())) {
          return true; // Direct value match found, return true
        }
      }
    }
    return false; // No matches found
  }

  /**
   * Compares expected location values with user's location to determine a match.
   * @param expectedLocationMap A map of expected location values.
   * @param userLocation The user's actual location.
   * @returns A boolean indicating if the user's location matches the expected values.
   */
  async valuesMatch(expectedLocationMap, userLocation) {
    for (const [key, value] of Object.entries(expectedLocationMap)) {
      if (userLocation.hasOwnProperty(key)) {
        const normalizedValue1 = this.normalizeValue(value);
        const normalizedValue2 = this.normalizeValue(userLocation[key]);
        if (normalizedValue1 !== normalizedValue2) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true; // If all values match, return true
  }

  /**
   * Normalizes a value to a consistent format for comparison.
   * @param value The value to normalize.
   * @returns The normalized value.
   */
  normalizeValue(value) {
    if (value === null || value === undefined) {
      return null;
    }
    // Remove quotes and trim whitespace
    return value.toString().replace(/^"|"$/g, '').trim();
  }
}
