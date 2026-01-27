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
import { getKeyValue, matchWithRegex } from '../utils/SegmentUtil.js';
import { SegmentOperandValueEnum } from '../enums/SegmentOperandValueEnum.js';
import { SegmentOperandRegexEnum } from '../enums/SegmentOperandRegexEnum.js';
import { SegmentOperatorValueEnum } from '../enums/SegmentOperatorValueEnum.js';
import { isBoolean } from '../../../utils/DataTypeUtil.js';
import { getFromGatewayService } from '../../../utils/GatewayServiceUtil.js';
import { UrlEnum } from '../../../enums/UrlEnum.js';
import { ApiEnum } from '../../../enums/ApiEnum.js';
import { getFormattedErrorMessage } from '../../../utils/FunctionUtil.js';
/**
 * SegmentOperandEvaluator class provides methods to evaluate different types of DSL (Domain Specific Language)
 * expressions based on the segment conditions defined for custom variables, user IDs, and user agents.
 */
export class SegmentOperandEvaluator {
    constructor(serviceContainer) {
        this.serviceContainer = serviceContainer;
    }
    /**
     * Evaluates a custom variable DSL expression.
     * @param {Record<string, dynamic>} dslOperandValue - The DSL expression for the custom variable.
     * @param {Record<string, dynamic>} properties - The properties object containing the actual values to be matched against.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the DSL condition is met.
     */
    async evaluateCustomVariableDSL(dslOperandValue, properties, context) {
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
                this.serviceContainer
                    .getLogManager()
                    .errorLog('INVALID_ATTRIBUTE_LIST_FORMAT', {}, { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
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
                const res = await getFromGatewayService(this.serviceContainer, queryParamsObj, UrlEnum.ATTRIBUTE_CHECK, context);
                if (!res || res === undefined || res === 'false' || res.status === 0) {
                    return false;
                }
                return res;
            }
            catch (error) {
                this.serviceContainer.getLogManager().errorLog('ERROR_FETCHING_DATA_FROM_GATEWAY', {
                    err: getFormattedErrorMessage(error),
                }, { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
                return false;
            }
        }
        else {
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
    evaluateUserDSL(dslOperandValue, properties) {
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
    evaluateUserAgentDSL(dslOperandValue, context) {
        const operand = dslOperandValue;
        if (!context.getUserAgent() || context.getUserAgent() === undefined) {
            this.serviceContainer
                .getLogManager()
                .errorLog('INVALID_USER_AGENT_IN_CONTEXT_FOR_PRE_SEGMENTATION', {}, { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
            return false;
        }
        let tagValue = decodeURIComponent(context.getUserAgent());
        const { operandType, operandValue } = this.preProcessOperandValue(operand);
        const processedValues = this.processValues(operandValue, tagValue);
        tagValue = processedValues.tagValue; // Fix: Type assertion to ensure tagValue is of type string
        return this.extractResult(operandType, processedValues.operandValue, tagValue);
    }
    /**
     * Pre-processes the tag value to ensure it is in the correct format for evaluation.
     * @param {any} tagValue - The value to be processed.
     * @returns {string | boolean} - The processed tag value, either as a string or a boolean.
     */
    preProcessTagValue(tagValue) {
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
    preProcessOperandValue(operand) {
        let operandType;
        let operandValue;
        // Determine the type of operand and extract value based on regex patterns
        if (matchWithRegex(operand, SegmentOperandRegexEnum.LOWER_MATCH)) {
            operandType = SegmentOperandValueEnum.LOWER_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.LOWER_MATCH);
        }
        else if (matchWithRegex(operand, SegmentOperandRegexEnum.WILDCARD_MATCH)) {
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.WILDCARD_MATCH);
            const startingStar = matchWithRegex(operandValue, SegmentOperandRegexEnum.STARTING_STAR);
            const endingStar = matchWithRegex(operandValue, SegmentOperandRegexEnum.ENDING_STAR);
            // Determine specific wildcard type
            if (startingStar && endingStar) {
                operandType = SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE;
            }
            else if (startingStar) {
                operandType = SegmentOperandValueEnum.STARTING_STAR_VALUE;
            }
            else if (endingStar) {
                operandType = SegmentOperandValueEnum.ENDING_STAR_VALUE;
            }
            // Remove wildcard characters from the operand value
            operandValue = operandValue
                .replace(new RegExp(SegmentOperandRegexEnum.STARTING_STAR), '')
                .replace(new RegExp(SegmentOperandRegexEnum.ENDING_STAR), '');
        }
        else if (matchWithRegex(operand, SegmentOperandRegexEnum.REGEX_MATCH)) {
            operandType = SegmentOperandValueEnum.REGEX_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.REGEX_MATCH);
        }
        else if (matchWithRegex(operand, SegmentOperandRegexEnum.GREATER_THAN_MATCH)) {
            operandType = SegmentOperandValueEnum.GREATER_THAN_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.GREATER_THAN_MATCH);
        }
        else if (matchWithRegex(operand, SegmentOperandRegexEnum.GREATER_THAN_EQUAL_TO_MATCH)) {
            operandType = SegmentOperandValueEnum.GREATER_THAN_EQUAL_TO_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.GREATER_THAN_EQUAL_TO_MATCH);
        }
        else if (matchWithRegex(operand, SegmentOperandRegexEnum.LESS_THAN_MATCH)) {
            operandType = SegmentOperandValueEnum.LESS_THAN_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.LESS_THAN_MATCH);
        }
        else if (matchWithRegex(operand, SegmentOperandRegexEnum.LESS_THAN_EQUAL_TO_MATCH)) {
            operandType = SegmentOperandValueEnum.LESS_THAN_EQUAL_TO_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum.LESS_THAN_EQUAL_TO_MATCH);
        }
        else {
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
    extractOperandValue(operand, regex) {
        // Match operand with regex and return the first capturing group
        return matchWithRegex(operand, regex) && matchWithRegex(operand, regex)[1];
    }
    /**
     * Processes numeric values from operand and tag values, converting them to strings.
     * @param {any} operandValue - The operand value to process.
     * @param {any} tagValue - The tag value to process.
     * @returns {Record<string, dynamic>} - An object containing the processed operand and tag values as strings.
     */
    processValues(operandValue, tagValue, operandType = undefined) {
        if (operandType === SegmentOperatorValueEnum.IP ||
            operandType === SegmentOperatorValueEnum.BROWSER_VERSION ||
            operandType === SegmentOperatorValueEnum.OS_VERSION) {
            return {
                operandValue: operandValue,
                tagValue: tagValue,
            };
        }
        // Convert operand and tag values to floats
        if (SegmentOperandEvaluator.NON_NUMERIC_PATTERN.test(tagValue)) {
            return {
                operandValue: operandValue,
                tagValue: tagValue,
            };
        }
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
    extractResult(operandType, operandValue, tagValue) {
        let result = false;
        if (tagValue === null) {
            return false;
        }
        // Ensure operand_value and tag_value are strings
        const operandValueStr = String(operandValue);
        const tagValueStr = String(tagValue);
        switch (operandType) {
            case SegmentOperandValueEnum.LOWER_VALUE:
                result = operandValueStr.toLowerCase() === tagValueStr.toLowerCase();
                break;
            case SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE:
                result = tagValueStr.indexOf(operandValueStr) !== -1;
                break;
            case SegmentOperandValueEnum.STARTING_STAR_VALUE:
                result = tagValueStr.endsWith(operandValueStr);
                break;
            case SegmentOperandValueEnum.ENDING_STAR_VALUE:
                result = tagValueStr.startsWith(operandValueStr);
                break;
            case SegmentOperandValueEnum.REGEX_VALUE:
                try {
                    const pattern = new RegExp(operandValueStr);
                    const matcher = pattern.exec(tagValueStr);
                    result = matcher !== null;
                }
                catch (err) {
                    result = false;
                }
                break;
            case SegmentOperandValueEnum.GREATER_THAN_VALUE:
                result = this.compareVersions(tagValueStr, operandValueStr) > 0;
                break;
            case SegmentOperandValueEnum.GREATER_THAN_EQUAL_TO_VALUE:
                result = this.compareVersions(tagValueStr, operandValueStr) >= 0;
                break;
            case SegmentOperandValueEnum.LESS_THAN_VALUE:
                result = this.compareVersions(tagValueStr, operandValueStr) < 0;
                break;
            case SegmentOperandValueEnum.LESS_THAN_EQUAL_TO_VALUE:
                result = this.compareVersions(tagValueStr, operandValueStr) <= 0;
                break;
            default:
                // For version-like strings, use version comparison; otherwise use string comparison
                if (this.isVersionString(tagValueStr) && this.isVersionString(operandValueStr)) {
                    result = this.compareVersions(tagValueStr, operandValueStr) === 0;
                }
                else {
                    result = tagValueStr === operandValueStr;
                }
        }
        return result;
    }
    /**
     * Evaluates a given string tag value against a DSL operand value.
     * @param {any} dslOperandValue - The DSL operand string (e.g., "contains(\"value\")").
     * @param {ContextModel} context - The context object containing the value to evaluate.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand being evaluated (ip_address, browser_version, os_version).
     * @returns {boolean} - True if tag value matches DSL operand criteria, false otherwise.
     */
    evaluateStringOperandDSL(dslOperandValue, context, operandType) {
        const operand = String(dslOperandValue);
        // Determine the tag value based on operand type
        const tagValue = this.getTagValueForOperandType(context, operandType);
        if (tagValue === null) {
            this.logMissingContextError(operandType);
            return false;
        }
        const operandTypeAndValue = this.preProcessOperandValue(operand);
        const processedValues = this.processValues(operandTypeAndValue.operandValue, tagValue, operandType);
        const processedTagValue = processedValues.tagValue;
        return this.extractResult(operandTypeAndValue.operandType, String(processedValues.operandValue).trim().replace(/"/g, ''), processedTagValue);
    }
    /**
     * Gets the appropriate tag value based on the operand type.
     * @param {ContextModel} context - The context object.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand.
     * @returns {string | null} - The tag value or null if not available.
     */
    getTagValueForOperandType(context, operandType) {
        if (operandType === SegmentOperatorValueEnum.IP) {
            return context.getIpAddress() || null;
        }
        else if (operandType === SegmentOperatorValueEnum.BROWSER_VERSION) {
            return this.getBrowserVersionFromContext(context);
        }
        else {
            // Default works for OS version
            return this.getOsVersionFromContext(context);
        }
    }
    /**
     * Gets browser version from context.
     * @param {ContextModel} context - The context object.
     * @returns {string | null} - The browser version or null if not available.
     */
    getBrowserVersionFromContext(context) {
        const userAgent = context.getVwo()?.getUaInfo();
        if (!userAgent || typeof userAgent !== 'object' || Object.keys(userAgent).length === 0) {
            return null;
        }
        // Assuming UserAgent dictionary contains browser_version
        if ('browser_version' in userAgent) {
            return userAgent.browser_version !== null ? String(userAgent.browser_version) : null;
        }
        return null;
    }
    /**
     * Gets OS version from context.
     * @param {ContextModel} context - The context object.
     * @returns {string | null} - The OS version or null if not available.
     */
    getOsVersionFromContext(context) {
        const userAgent = context.getVwo()?.getUaInfo();
        if (!userAgent || typeof userAgent !== 'object' || Object.keys(userAgent).length === 0) {
            return null;
        }
        // Assuming UserAgent dictionary contains os_version
        if ('os_version' in userAgent) {
            return userAgent.os_version !== null ? String(userAgent.os_version) : null;
        }
        return null;
    }
    /**
     * Logs appropriate error message for missing context.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand.
     */
    logMissingContextError(operandType) {
        if (operandType === SegmentOperatorValueEnum.IP) {
            this.serviceContainer.getLogManager().info('To evaluate IP segmentation, please provide ipAddress in context');
        }
        else if (operandType === SegmentOperatorValueEnum.BROWSER_VERSION) {
            this.serviceContainer
                .getLogManager()
                .info('To evaluate browser version segmentation, please provide userAgent in context');
        }
        else {
            this.serviceContainer
                .getLogManager()
                .info('To evaluate OS version segmentation, please provide userAgent in context');
        }
    }
    /**
     * Checks if a string appears to be a version string (contains only digits and dots).
     * @param {string} str - The string to check.
     * @returns {boolean} - True if the string appears to be a version string.
     */
    isVersionString(str) {
        return /^(\d+\.)*\d+$/.test(str);
    }
    /**
     * Compares two version strings using semantic versioning rules.
     * Supports formats like "1.2.3", "1.0", "2.1.4.5", etc.
     * @param {string} version1 - First version string.
     * @param {string} version2 - Second version string.
     * @returns {number} - -1 if version1 < version2, 0 if equal, 1 if version1 > version2.
     */
    compareVersions(version1, version2) {
        // Split versions by dots and convert to integers
        const parts1 = version1.split('.').map((part) => (part.match(/^\d+$/) ? parseInt(part, 10) : 0));
        const parts2 = version2.split('.').map((part) => (part.match(/^\d+$/) ? parseInt(part, 10) : 0));
        // Find the maximum length to handle different version formats
        const maxLength = Math.max(parts1.length, parts2.length);
        for (let i = 0; i < maxLength; i++) {
            const part1 = i < parts1.length ? parts1[i] : 0;
            const part2 = i < parts2.length ? parts2[i] : 0;
            if (part1 < part2) {
                return -1;
            }
            else if (part1 > part2) {
                return 1;
            }
        }
        return 0; // Versions are equal
    }
}
// Regex pattern to check if a string contains non-numeric characters (except decimal point)
SegmentOperandEvaluator.NON_NUMERIC_PATTERN = /[^0-9.]/;
//# sourceMappingURL=SegmentOperandEvaluator.js.map