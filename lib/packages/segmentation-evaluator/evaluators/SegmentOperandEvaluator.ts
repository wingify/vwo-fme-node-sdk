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
import { getKeyValue, matchWithRegex } from '../utils/SegmentUtil';
import { SegmentOperandValueEnum } from '../enums/SegmentOperandValueEnum';
import { SegmentOperandRegexEnum } from '../enums/SegmentOperandRegexEnum';
import { isBoolean } from '../../../utils/DataTypeUtil';
import { dynamic } from '../../../types/Common';
import { getFromGatewayService } from '../../../utils/GatewayServiceUtil';
import { UrlEnum } from '../../../enums/UrlEnum';
import { LogManager } from '../../logger';
import { ContextModel } from '../../../models/user/ContextModel';

/**
 * SegmentOperandEvaluator class provides methods to evaluate different types of DSL (Domain Specific Language)
 * expressions based on the segment conditions defined for custom variables, user IDs, and user agents.
 */
export class SegmentOperandEvaluator {
  /**
   * Evaluates a custom variable DSL expression.
   * @param {Record<string, dynamic>} dslOperandValue - The DSL expression for the custom variable.
   * @param {Record<string, dynamic>} properties - The properties object containing the actual values to be matched against.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the DSL condition is met.
   */
  async evaluateCustomVariableDSL(
    dslOperandValue: Record<string, dynamic>,
    properties: Record<string, dynamic>,
  ): Promise<boolean> {
    // Extract key and value from the DSL operand
    const { key, value } = getKeyValue(dslOperandValue);
    const operandKey = key;
    const operand = value;

    // Check if the property exists
    if (!Object.prototype.hasOwnProperty.call(properties, operandKey)) {
      return false;
    }

    // Handle 'inlist' operand
    if (operand.includes('inlist')) {
      const listIdRegex = /inlist\(([^)]+)\)/;
      const match = operand.match(listIdRegex);
      if (!match || match.length < 2) {
        LogManager.Instance.error("Invalid 'inList' operand format");
        return false;
      }

      // Process the tag value and prepare query parameters
      const tagValue = properties[operandKey];
      const attributeValue = this.preProcessTagValue(tagValue);
      const listId = match[1];
      const queryParamsObj = {
        attribute: attributeValue,
        listId: listId,
      };

      // Make a web service call to check the attribute against the list
      try {
        const res = await getFromGatewayService(queryParamsObj, UrlEnum.ATTRIBUTE_CHECK);
        if (!res || res === undefined || res === 'false' || res.status === 0) {
          return false;
        }
        return res;
      } catch (error) {
        LogManager.Instance.error('Error while fetching data: ' + error);
        return false;
      }
    } else {
      // Process other types of operands
      let tagValue = properties[operandKey];
      tagValue = this.preProcessTagValue(tagValue);
      const { operandType, operandValue } = this.preProcessOperandValue(operand);
      const processedValues = this.processValues(operandValue, tagValue);
      tagValue = processedValues.tagValue;
      return this.extractResult(operandType, processedValues.operandValue, tagValue);
    }
  }

  /**
   * Evaluates a user DSL expression to check if a user ID is in a specified list.
   * @param {Record<string, any>} dslOperandValue - The DSL expression containing user IDs.
   * @param {Record<string, dynamic>} properties - The properties object containing the actual user ID to check.
   * @returns {boolean} - True if the user ID is in the list, otherwise false.
   */
  evaluateUserDSL(dslOperandValue: Record<string, any>, properties: Record<string, dynamic>): boolean {
    const users = dslOperandValue.split(',');
    for (let i = 0; i < users.length; i++) {
      if (users[i].trim() == properties._vwoUserId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Evaluates a user agent DSL expression.
   * @param {Record<string, any>} dslOperandValue - The DSL expression for the user agent.
   * @param {any} context - The context object containing the user agent string.
   * @returns {boolean} - True if the user agent matches the DSL condition, otherwise false.
   */
  evaluateUserAgentDSL(dslOperandValue: Record<string, any>, context: ContextModel): boolean {
    const operand = dslOperandValue;
    if (!context.getUserAgent() || context.getUserAgent() === undefined) {
      LogManager.Instance.info('To Evaluate UserAgent segmentation, please provide userAgent in context');
      return false;
    }
    let tagValue = decodeURIComponent(context.getUserAgent());
    const { operandType, operandValue } = this.preProcessOperandValue(operand);
    const processedValues = this.processValues(operandValue, tagValue);
    tagValue = processedValues.tagValue as string; // Fix: Type assertion to ensure tagValue is of type string
    return this.extractResult(operandType, processedValues.operandValue, tagValue);
  }

  /**
   * Pre-processes the tag value to ensure it is in the correct format for evaluation.
   * @param {any} tagValue - The value to be processed.
   * @returns {string | boolean} - The processed tag value, either as a string or a boolean.
   */
  preProcessTagValue(tagValue: any): string | boolean {
    // Default to empty string if undefined
    if (tagValue === undefined) {
      tagValue = '';
    }
    // Convert boolean values to boolean type
    if (isBoolean(tagValue)) {
      tagValue = tagValue ? true : false;
    }
    // Convert all non-null values to string
    if (tagValue !== null) {
      tagValue = tagValue.toString();
    }
    return tagValue;
  }

  /**
   * Pre-processes the operand value to determine its type and extract the value based on regex matches.
   * @param {any} operand - The operand to be processed.
   * @returns {Record<string, any>} - An object containing the operand type and value.
   */
  preProcessOperandValue(operand: any): Record<string, any> {
    let operandType: SegmentOperandValueEnum;
    let operandValue: dynamic;
    // Determine the type of operand and extract value based on regex patterns
    if (matchWithRegex(operand, SegmentOperandRegexEnum.LOWER_MATCH)) {
      operandType = SegmentOperandValueEnum.LOWER_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.LOWER_MATCH);
    } else if (matchWithRegex(operand, SegmentOperandRegexEnum.WILDCARD_MATCH)) {
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.WILDCARD_MATCH);
      const startingStar = matchWithRegex(operandValue, SegmentOperandRegexEnum.STARTING_STAR);
      const endingStar = matchWithRegex(operandValue, SegmentOperandRegexEnum.ENDING_STAR);
      // Determine specific wildcard type
      if (startingStar && endingStar) {
        operandType = SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE;
      } else if (startingStar) {
        operandType = SegmentOperandValueEnum.STARTING_STAR_VALUE;
      } else if (endingStar) {
        operandType = SegmentOperandValueEnum.ENDING_STAR_VALUE;
      }
      // Remove wildcard characters from the operand value
      operandValue = operandValue
        .replace(new RegExp(SegmentOperandRegexEnum.STARTING_STAR), '')
        .replace(new RegExp(SegmentOperandRegexEnum.ENDING_STAR), '');
    } else if (matchWithRegex(operand, SegmentOperandRegexEnum.REGEX_MATCH)) {
      operandType = SegmentOperandValueEnum.REGEX_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.REGEX_MATCH);
    } else if (matchWithRegex(operand, SegmentOperandRegexEnum.GREATER_THAN_MATCH)) {
      operandType = SegmentOperandValueEnum.GREATER_THAN_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.GREATER_THAN_MATCH);
    } else if (matchWithRegex(operand, SegmentOperandRegexEnum.GREATER_THAN_EQUAL_TO_MATCH)) {
      operandType = SegmentOperandValueEnum.GREATER_THAN_EQUAL_TO_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.GREATER_THAN_EQUAL_TO_MATCH);
    } else if (matchWithRegex(operand, SegmentOperandRegexEnum.LESS_THAN_MATCH)) {
      operandType = SegmentOperandValueEnum.LESS_THAN_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.LESS_THAN_MATCH);
    } else if (matchWithRegex(operand, SegmentOperandRegexEnum.LESS_THAN_EQUAL_TO_MATCH)) {
      operandType = SegmentOperandValueEnum.LESS_THAN_EQUAL_TO_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.LESS_THAN_EQUAL_TO_MATCH);
    } else {
      operandType = SegmentOperandValueEnum.EQUAL_VALUE;
      operandValue = operand;
    }
    return {
      operandType,
      operandValue,
    };
  }

  /**
   * Extracts the operand value from a string based on a specified regex pattern.
   * @param {any} operand - The operand string to extract from.
   * @param {string} regex - The regex pattern to use for extraction.
   * @returns {string} - The extracted value.
   */
  extractOperandValue(operand: any, regex: string): string {
    // Match operand with regex and return the first capturing group
    return matchWithRegex(operand, regex) && matchWithRegex(operand, regex)[1];
  }

  /**
   * Processes numeric values from operand and tag values, converting them to strings.
   * @param {any} operandValue - The operand value to process.
   * @param {any} tagValue - The tag value to process.
   * @returns {Record<string, dynamic>} - An object containing the processed operand and tag values as strings.
   */
  processValues(operandValue: any, tagValue: any): Record<string, dynamic> {
    // Convert operand and tag values to floats
    const processedOperandValue = parseFloat(operandValue);
    const processedTagValue = parseFloat(tagValue);
    // Return original values if conversion fails
    if (!processedOperandValue || !processedTagValue) {
      return {
        operandValue: operandValue,
        tagValue: tagValue,
      };
    }
    // now we have surity that both are numbers
    // now we can convert them independently to int type if they
    // are int rather than floats
    // if (processedOperandValue === Math.floor(processedOperandValue)) {
    //   processedOperandValue = parseInt(processedOperandValue, 10);
    // }
    // if (processedTagValue === Math.floor(processedTagValue)) {
    //   processedTagValue = parseInt(processedTagValue, 10);
    // }
    // Convert numeric values back to strings
    return {
      operandValue: processedOperandValue.toString(),
      tagValue: processedTagValue.toString(),
    };
  }

  /**
   * Extracts the result of the evaluation based on the operand type and values.
   * @param {SegmentOperandValueEnum} operandType - The type of the operand.
   * @param {any} operandValue - The value of the operand.
   * @param {any} tagValue - The value of the tag to compare against.
   * @returns {boolean} - The result of the evaluation.
   */
  extractResult(operandType: SegmentOperandValueEnum, operandValue: any, tagValue: any): boolean {
    let result: boolean;

    switch (operandType) {
      case SegmentOperandValueEnum.LOWER_VALUE:
        // Check if both values are equal, ignoring case
        if (tagValue !== null) {
          result = operandValue.toLowerCase() === tagValue.toLowerCase();
        }
        break;
      case SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE:
        // Check if the tagValue contains the operandValue
        if (tagValue !== null) {
          result = tagValue.indexOf(operandValue) > -1;
        }
        break;
      case SegmentOperandValueEnum.STARTING_STAR_VALUE:
        // Check if the tagValue ends with the operandValue
        if (tagValue !== null) {
          result = tagValue.endsWith(operandValue);
        }
        break;
      case SegmentOperandValueEnum.ENDING_STAR_VALUE:
        // Check if the tagValue starts with the operandValue
        if (tagValue !== null) {
          result = tagValue.startsWith(operandValue);
        }
        break;
      case SegmentOperandValueEnum.REGEX_VALUE:
        // Evaluate the tagValue against the regex pattern of operandValue
        try {
          const pattern = new RegExp(operandValue, 'g');
          result = !!pattern.test(tagValue);
        } catch (err) {
          result = false;
        }
        break;
      case SegmentOperandValueEnum.GREATER_THAN_VALUE:
        if (tagValue !== null) {
          try {
            result = parseFloat(operandValue) < parseFloat(tagValue);
          } catch (err) {
            result = false;
          }
        }
        break;
      case SegmentOperandValueEnum.GREATER_THAN_EQUAL_TO_VALUE:
        if (tagValue !== null) {
          try {
            result = parseFloat(operandValue) <= parseFloat(tagValue);
          } catch (err) {
            result = false;
          }
        }
        break;
      case SegmentOperandValueEnum.LESS_THAN_VALUE:
        if (tagValue !== null) {
          try {
            result = parseFloat(operandValue) > parseFloat(tagValue);
          } catch (err) {
            result = false;
          }
        }
        break;
      case SegmentOperandValueEnum.LESS_THAN_EQUAL_TO_VALUE:
        if (tagValue !== null) {
          try {
            result = parseFloat(operandValue) >= parseFloat(tagValue);
          } catch (err) {
            result = false;
          }
        }
        break;
      default:
        // Check if the tagValue is exactly equal to the operandValue
        result = tagValue === operandValue;
    }

    return result;
  }
}
