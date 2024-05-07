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
import { UrlEnum } from '../../../enums/UrlEnum';
import { SettingsModel } from '../../../models/SettingsModel';
import { LogManager } from '../../logger';
import { StorageService } from '../../../services/StorageService';
import { dynamic } from '../../../types/Common';
import { isObject } from '../../../utils/DataTypeUtil';
import { getFromWebService, getQueryParamForLocationPreSegment, getQueryParamForUaParser } from '../../../utils/WebServiceUtil';
import { SegmentOperatorValueEnum } from '../enums/SegmentOperatorValueEnum';
import { Segmentation } from '../Segmentation';
import { getKeyValue } from '../utils/SegmentUtil';
import { SegmentOperandEvaluator } from './SegmentOperandEvaluator';

export class SegmentEvaluator implements Segmentation {
  context: any;
  settings: any;
  feature: any;

  async isSegmentationValid(dsl: Record<string, dynamic>, properties: Record<string, dynamic>): Promise<boolean> {
    const { key, value } = getKeyValue(dsl);
    const operator = key;
    const subDsl = value;

    if (operator === SegmentOperatorValueEnum.NOT) {
      const result = await this.isSegmentationValid(subDsl, properties);
      return !result;
    } else if (operator === SegmentOperatorValueEnum.AND) {
      return await this.every(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.OR) {
      return await this.some(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.CUSTOM_VARIABLE) {
      return await new SegmentOperandEvaluator().evaluateCustomVariableDSL(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.USER) {
      return new SegmentOperandEvaluator().evaluateUserDSL(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.UA) {
      return new SegmentOperandEvaluator().evaluateUserAgentDSL(subDsl, this.context.user);
    }
    return false;
  }

  async some(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>): Promise<boolean> {
    const uaParserMap: Record<string, string[]> = {};
    let keyCount: number = 0; // Initialize count of keys encountered
    let isUaParser = false;
    for (const dsl of dslNodes) {
      for (const key in dsl) {
        if (key === SegmentOperatorValueEnum.OPERATING_SYSTEM || key === SegmentOperatorValueEnum.BROWSER_AGENT || key === SegmentOperatorValueEnum.DEVICE_TYPE) {
          isUaParser = true;
          const value = dsl[key];

          if (!uaParserMap[key]) {
            uaParserMap[key] = [];
          }

          // Ensure value is treated as an array of strings
          const valuesArray = Array.isArray(value) ? value : [value];

          // Push each value from valueArray to uaParserMap[key]
          valuesArray.forEach((val: dynamic) => {
            if (typeof val === "string") {
              uaParserMap[key].push(val);
            }
          });

          keyCount++; // Increment count of keys encountered
        }

        if (key === SegmentOperatorValueEnum.FEATURE_ID) {
          const featureIdObject = dsl[key] as Record<string, string>; // Type assertion to specify the shape of the object
          const featureIdKey: string = Object.keys(featureIdObject)[0]; // Extract the key '4'
          const featureIdValue: string = featureIdObject[featureIdKey]; // Extract the value 'on'


          if (featureIdValue === 'on') {

            const features = this.settings.getFeatures(); // Access features using the getter method
            const feature = features.find(feature => feature.getId() === parseInt(featureIdKey)); // Find feature by featureIdKey

            if (feature) {
                const featureKey = feature.getKey(); // Get the key of the found feature
                const result = await this.checkInUserStorage(this.settings, featureKey, this.context.user);
                return result;
            } else {
                console.error("Feature not found with featureIdKey:", featureIdKey);
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
        }
        catch (err) {
          console.log(err);
        }
      }

      if (await this.isSegmentationValid(dsl, customVariables)) {
        return true;
      }
    }
    return false;
  }

  async every(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>): Promise<boolean> {
    const locationMap: Record<string, dynamic> = {};
    for (const dsl of dslNodes) {
      if (dsl.hasOwnProperty(SegmentOperatorValueEnum.COUNTRY) || dsl.hasOwnProperty(SegmentOperatorValueEnum.REGION) || dsl.hasOwnProperty(SegmentOperatorValueEnum.CITY)) {
        this.addLocationValuesToMap(dsl, locationMap);
        // check if location map size is equal to dslNodes size
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

  addLocationValuesToMap(dsl: Record<string, dynamic>, locationMap: Record<string, dynamic>): void {
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

  async checkLocationPreSegmentation(locationMap: Record<string, dynamic>): Promise<boolean> {
    if (!this.context.user.ipAddress || this.context.user.ipAddress === undefined){
      LogManager.Instance.info('To evaluate location pre Segment, please pass ipAddress in context.user object');
      return false;
    }
    if (this.context._vwo.location === undefined || this.context._vwo.location === null) {
      const queryParams = getQueryParamForLocationPreSegment(this.context.user.ipAddress);
      this.context._vwo.location = (await getFromWebService(queryParams, UrlEnum.LOCATION_CHECK)).location;
    }
    if (!this.context._vwo.location || this.context._vwo.location === undefined || this.context._vwo.location === null) {
      return false;
    }
    return this.valuesMatch(locationMap, this.context._vwo.location);
  }

  async checkUserAgentParser(uaParserMap: Record<string, string[]>): Promise<boolean> {
    if (!this.context.user.userAgent || this.context.user.userAgent === undefined){
      LogManager.Instance.info('To evaluate user agent related segments, please pass userAgent in context object');
      return false;
    }
    if (this.context._vwo.ua_info === undefined || this.context._vwo.ua_info === null) {
      const queryParams = getQueryParamForUaParser(this.context.user.userAgent);
      this.context._vwo.ua_info = await getFromWebService(queryParams, UrlEnum.UAPARSER);
    }
    if (!this.context._vwo.ua_info  || this.context._vwo.ua_info  === undefined || this.context._vwo.ua_info  === 'false') {
      return false;
    }

    return this.checkValuePresent(uaParserMap, this.context._vwo.ua_info);
  }

  async checkInUserStorage( settings: SettingsModel, featureKey: string, user: any): Promise<any> {
    const storageService = new StorageService();
    const storedData: Record<any, any> = await new StorageDecorator().getFeatureFromStorage(featureKey, user, storageService);

    //check only in userStorage
    if(isObject(storedData) && Object.keys(storedData).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  async checkValuePresent(expectedMap: Record<string, string[]>, actualMap: Record<string, string>): Promise<boolean> {
    for (const key in actualMap) {
      if (Object.prototype.hasOwnProperty.call(expectedMap, key)) {
        const expectedValues = expectedMap[key];
        const actualValue = actualMap[key];

        if (key === SegmentOperatorValueEnum.DEVICE_TYPE) {
          const wildcardPatterns = expectedValues.filter(val => val.startsWith('wildcard(') && val.endsWith(')'));
          if (wildcardPatterns.length > 0) {
            // If any wildcard pattern matches, return true
            if (wildcardPatterns.some(pattern => {
              const wildcardPattern = pattern.slice(9, -1); // Extract pattern from wildcard string
              const regex = new RegExp(wildcardPattern.replace(/\*/g, '.*')); // Convert wildcard pattern to regex
              return regex.test(actualValue);
            })) {
              continue; // Value matches, continue to next key
            } else {
              return false; // No wildcard pattern matched, return false
            }
          }
        } else {
          if (expectedValues.includes(actualValue)) {
            continue; // Value found, continue to next key
          } else {
            return false; // Value not found, return false
          }
        }
      }
    }
    return true; // All keys checked and values found, return true
  }


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
    // If all values match, return true
    return true;
  }

  normalizeValue(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value.toString().replace(/^"|"$/g, "").trim();
  }


}
