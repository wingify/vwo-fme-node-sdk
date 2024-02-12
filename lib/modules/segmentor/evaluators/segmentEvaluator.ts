import { object } from 'superstruct';
import { getKeyValue } from '../utils/SegmentUtil';
import { SegmentOperandEvaluator } from './segmentOperandEvaluator';
import { SegmentOperatorValueEnum } from '../enums/segmentOperatorValueEnum';
import { Segmentation } from '../segmentation';
import { dynamic } from '../../../types/common';
import { getFromWebService, getQueryParamForLocationPreSegment, getQueryParamForUaParser } from '../../../utils/WebServiceUtil';
import { UrlEnum } from '../../../enums/UrlEnum';
import { StorageDecorator } from '../../../decorators/StorageDecorator';
import { StorageService } from '../../../services/StorageService';
import { getCampaignVariation, getRolloutVariation } from '../../../utils/CampaignUtil';
import { VariationModel } from '../../../models/VariationModel';
import { VariableModel } from '../../../models/VariableModel';
import { LogManager } from '../../../modules/logger';
import { Deferred } from '../../../utils/PromiseUtil';
import { SettingsModel } from '../../../models/SettingsModel';
import { isObject } from '../../../utils/DataTypeUtil';

export class SegmentEvaluator implements Segmentation {
  async isSegmentationValid(dsl: Record<string, dynamic>, properties: Record<string, dynamic>, settings: SettingsModel, context?: any): Promise<boolean> {
    const { key, value } = getKeyValue(dsl);
    const operator = key;
    const subDsl = value;

    if (operator === SegmentOperatorValueEnum.NOT) {
      const result = await this.isSegmentationValid(subDsl, properties, settings, context);
      return !result;
    } else if (operator === SegmentOperatorValueEnum.AND) {
      return await this.every(subDsl, properties, settings, context);
    } else if (operator === SegmentOperatorValueEnum.OR) {
      return await this.some(subDsl, properties, settings, context);
    } else if (operator === SegmentOperatorValueEnum.CUSTOM_VARIABLE) {
      return await new SegmentOperandEvaluator().evaluateCustomVariableDSL(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.USER) {
      return new SegmentOperandEvaluator().evaluateUserDSL(subDsl, properties);
    } else if (operator === SegmentOperatorValueEnum.UA) {
      return new SegmentOperandEvaluator().evaluateUserAgentDSL(subDsl, context);
    }
    return false;
  }

  async some(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>, settings: SettingsModel, context: any): Promise<boolean> {
    let uaParserMap: Record<string, string[]> = {};
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
            
            const features = settings.getFeatures(); // Access features using the getter method
            const feature = features.find(feature => feature.getId() === parseInt(featureIdKey)); // Find feature by featureIdKey

            if (feature) {
                const featureKey = feature.getKey(); // Get the key of the found feature
                const result = await this.checkInUserStorage(settings, featureKey, context);
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
          const uaParserResult = await this.checkUserAgentParser(uaParserMap, context.userAgent);
          return uaParserResult;
        }
        catch (err) {
          console.log(err);
        }
      }

      if (await this.isSegmentationValid(dsl, customVariables, settings, context)) {
        return true;
      }
    }
    return false;
  }

  async every(dslNodes: Array<Record<string, dynamic>>, customVariables: Record<string, dynamic>, settings: SettingsModel, context: any): Promise<boolean> {
    let locationMap: Record<string, dynamic> = {};
    for (const dsl of dslNodes) {
      if (dsl.hasOwnProperty(SegmentOperatorValueEnum.COUNTRY) || dsl.hasOwnProperty(SegmentOperatorValueEnum.REGION) || dsl.hasOwnProperty(SegmentOperatorValueEnum.CITY)) {
        this.addLocationValuesToMap(dsl, locationMap);
        // check if location map size is equal to dslNodes size
        if (Object.keys(locationMap).length === dslNodes.length) {
          if (!context.ipAddress || context.ipAddress === undefined){
            LogManager.Instance.info('To evaluate location pre Segment, please pass ipAddress in context.user object');
            return false;
          }
          const segmentResult = await this.checkLocationPreSegmentation(locationMap, context.ipAddress || '0.0.0.0');
          return segmentResult;
        }
        continue;
      }
      const res = await this.isSegmentationValid(dsl, customVariables, settings, context);
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

  async checkLocationPreSegmentation(locationMap: Record<string, dynamic>, ipAddress: string): Promise<boolean> {
    const queryParams = getQueryParamForLocationPreSegment(ipAddress);
    const userLocation = await getFromWebService(queryParams, UrlEnum.LOCATION_CHECK);
    if (!userLocation || userLocation === undefined || userLocation === 'false' || userLocation.status === 0) {
      return false;
    }
    return this.valuesMatch(locationMap, userLocation.location);
  }

  async checkUserAgentParser(uaParserMap: Record<string, string[]>, userAgent: string): Promise<boolean> {
    const queryParams = getQueryParamForUaParser(userAgent);
    if (!userAgent || userAgent === undefined){
      LogManager.Instance.info('To evaluate user agent related segments, please pass userAgent in context object');
      return false;
    }
    const uaParser = await getFromWebService(queryParams, UrlEnum.UAPARSER);
    if (!uaParser || uaParser === undefined || uaParser === 'false' || uaParser.status === 0) {
      return false;
    }

    return this.checkValuePresent(uaParserMap, uaParser);
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
    for (let [key, value] of Object.entries(expectedLocationMap)) {
      if (userLocation.hasOwnProperty(key)) {
        let normalizedValue1 = this.normalizeValue(value);
        let normalizedValue2 = this.normalizeValue(userLocation[key]);
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
