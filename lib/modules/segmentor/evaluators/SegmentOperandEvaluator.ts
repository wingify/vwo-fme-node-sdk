import { getKeyValue, matchWithRegex } from '../utils/SegmentUtil';
import { SegmentOperandValueEnum } from '../enums/SegmentOperandValueEnum';
import { SegmentOperandRegexEnum } from '../enums/SegmentOperandRegexEnum';
import { isBoolean } from '../../../utils/DataTypeUtil';
import { dynamic } from '../../../types/Common';
import { getFromWebService } from '../../../utils/WebServiceUtil';
import { UrlEnum } from '../../../enums/UrlEnum';
import { LogManager } from '../../logger';

export class SegmentOperandEvaluator {
  async evaluateCustomVariableDSL(dslOperandValue: Record<string, dynamic>, properties: Record<string, dynamic>): Promise <boolean> {
    const { key, value } = getKeyValue(dslOperandValue);
    const operandKey = key;
    const operand = value;
    if (!Object.prototype.hasOwnProperty.call(properties, operandKey)) {
      return false;
    }

    if (operand.includes('inlist')) {
      const listIdRegex = /inlist\((\w+:\d+)\)/;
      const match = operand.match(listIdRegex);
      if (!match || match.length < 2) {
        console.error("Invalid 'inList' operand format");
        return false;
      }

      const tagValue = properties[operandKey];
      const attributeValue = this.preProcessTagValue(tagValue);

      const listId = match[1];
      const queryParamsObj = {
        attribute: attributeValue,
        listId: listId
      };

      try {
        const res = await getFromWebService(queryParamsObj, UrlEnum.ATTRIBUTE_CHECK);
        if (!res || res === undefined || res === 'false' || res.status === 0) {
          return false;
        }
        return res;
      } catch (error) {
        console.error("Error while fetching data:", error);
        return false;
      }
    } else {
      let tagValue = properties[operandKey];
      tagValue = this.preProcessTagValue(tagValue);
      const { operandType, operandValue } = this.preProcessOperandValue(operand);
      const processedValues = this.processValues(operandValue, tagValue);
      tagValue = processedValues.tagValue;
      return this.extractResult(operandType, processedValues.operandValue, tagValue);
    }
  }

  evaluateUserDSL(dslOperandValue: Record<string, any>, properties: Record<string, dynamic>): boolean {
    const users = dslOperandValue.split(',');
    for (let i = 0; i < users.length; i++) {
      if (users[i].trim() == properties._vwoUserId) {
        return true;
      }
    }
    return false;
  }

  evaluateUserAgentDSL(dslOperandValue: Record<string, any>, context: any): boolean {
    const operand = dslOperandValue;
    if (!context.userAgent || context.userAgent === undefined) {
      LogManager.Instance.info('To Evaluate UserAgent segmentation, please provide userAgent in context');
      return false;
    }
    let tagValue = decodeURIComponent(context.userAgent);
    const { operandType, operandValue } = this.preProcessOperandValue(operand);
    const processedValues = this.processValues(operandValue, tagValue);
    tagValue = processedValues.tagValue as string; // Fix: Type assertion to ensure tagValue is of type string
    return this.extractResult(operandType, processedValues.operandValue, tagValue);
  }

  preProcessTagValue(tagValue: any): string | boolean {
    if (tagValue === undefined) {
      tagValue = '';
    }
    if (isBoolean(tagValue)) {
      if (tagValue) {
        tagValue = true;
      } else {
        tagValue = false;
      }
    }
    if (tagValue !== null) {
      tagValue = tagValue.toString();
    }
    return tagValue;
  }

  preProcessOperandValue(operand: any): Record<string, any> {
    let operandType: SegmentOperandValueEnum;
    let operandValue: dynamic;
    // Pre process operand value
    if (matchWithRegex(operand, SegmentOperandRegexEnum.LOWER_MATCH)) {
      operandType = SegmentOperandValueEnum.LOWER_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.LOWER_MATCH);
    } else if (matchWithRegex(operand, SegmentOperandRegexEnum.WILDCARD_MATCH)) {
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.WILDCARD_MATCH);
      const startingStar = matchWithRegex(operandValue, SegmentOperandRegexEnum.STARTING_STAR);
      const endingStar = matchWithRegex(operandValue, SegmentOperandRegexEnum.ENDING_STAR);
      // In case of wildcard, the operand type is further divided into contains, startswith and endswith
      if (startingStar && endingStar) {
        operandType = SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE;
      } else if (startingStar) {
        operandType = SegmentOperandValueEnum.STARTING_STAR_VALUE;
      } else if (endingStar) {
        operandType = SegmentOperandValueEnum.ENDING_STAR_VALUE;
      }
      operandValue = operandValue
        .replace(new RegExp(SegmentOperandRegexEnum.STARTING_STAR), '')
        .replace(new RegExp(SegmentOperandRegexEnum.ENDING_STAR), '');
    } else if (matchWithRegex(operand, SegmentOperandRegexEnum.REGEX_MATCH)) {
      operandType = SegmentOperandValueEnum.REGEX_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.REGEX_MATCH);
    } else {
      operandType = SegmentOperandValueEnum.EQUAL_VALUE;
      operandValue = operand;
    }
    return {
      operandType,
      operandValue
    };
  }

  extractOperandValue(operand: any, regex: string): string {
    return matchWithRegex(operand, regex) && matchWithRegex(operand, regex)[1];
  }

  processValues(operandValue: any, tagValue: any): Record<string, dynamic> {
    // this is atomic, either both will be processed or none
    const processedOperandValue = parseFloat(operandValue);
    const processedTagValue = parseFloat(tagValue);
    if (!processedOperandValue || !processedTagValue) {
      return {
        operandValue: operandValue,
        tagValue: tagValue
      };
    }
    // // now we have surity that both are numbers
    // // now we can convert them independently to int type if they
    // // are int rather than floats
    // if (processedOperandValue === Math.floor(processedOperandValue)) {
    //   processedOperandValue = parseInt(processedOperandValue, 10);
    // }
    // if (processedTagValue === Math.floor(processedTagValue)) {
    //   processedTagValue = parseInt(processedTagValue, 10);
    // }
    // convert it back to string and return
    return {
      operandValue: processedOperandValue.toString(),
      tagValue: processedTagValue.toString()
    };
  }

  extractResult(operandType: SegmentOperandValueEnum, operandValue: any, tagValue: any): boolean {
    let result: boolean;

    switch (operandType) {
      case SegmentOperandValueEnum.LOWER_VALUE:
        if (tagValue !== null) {
          result = operandValue.toLowerCase() === tagValue.toLowerCase();
        }
        break;
      case SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE:
        if (tagValue !== null) {
          result = tagValue.indexOf(operandValue) > -1;
        }
        break;
      case SegmentOperandValueEnum.STARTING_STAR_VALUE:
        if (tagValue !== null) {
          result = tagValue.endsWith(operandValue);
        }
        break;
      case SegmentOperandValueEnum.ENDING_STAR_VALUE:
        if (tagValue !== null) {
          result = tagValue.startsWith(operandValue);
        }
        break;
      case SegmentOperandValueEnum.REGEX_VALUE:
        try {
          const pattern = new RegExp(operandValue, 'g');
          result = !!pattern.test(tagValue);
        } catch (err) {
          result = false;
        }
        break;
      default:
        result = tagValue === operandValue;
    }

    return result;
  }
}
