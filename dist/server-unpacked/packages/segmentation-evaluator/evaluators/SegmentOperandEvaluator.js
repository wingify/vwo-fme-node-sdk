"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentOperandEvaluator = void 0;
/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
var SegmentUtil_1 = require("../utils/SegmentUtil");
var SegmentOperandValueEnum_1 = require("../enums/SegmentOperandValueEnum");
var SegmentOperandRegexEnum_1 = require("../enums/SegmentOperandRegexEnum");
var SegmentOperatorValueEnum_1 = require("../enums/SegmentOperatorValueEnum");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var GatewayServiceUtil_1 = require("../../../utils/GatewayServiceUtil");
var UrlEnum_1 = require("../../../enums/UrlEnum");
var logger_1 = require("../../logger");
/**
 * SegmentOperandEvaluator class provides methods to evaluate different types of DSL (Domain Specific Language)
 * expressions based on the segment conditions defined for custom variables, user IDs, and user agents.
 */
var SegmentOperandEvaluator = /** @class */ (function () {
    function SegmentOperandEvaluator() {
    }
    /**
     * Evaluates a custom variable DSL expression.
     * @param {Record<string, dynamic>} dslOperandValue - The DSL expression for the custom variable.
     * @param {Record<string, dynamic>} properties - The properties object containing the actual values to be matched against.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the DSL condition is met.
     */
    SegmentOperandEvaluator.prototype.evaluateCustomVariableDSL = function (dslOperandValue, properties) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, key, value, operandKey, operand, listIdRegex, match, tagValue, attributeValue, listId, queryParamsObj, res, error_1, tagValue, _b, operandType, operandValue, processedValues;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = (0, SegmentUtil_1.getKeyValue)(dslOperandValue), key = _a.key, value = _a.value;
                        operandKey = key;
                        operand = value;
                        // Check if the property exists
                        if (!Object.prototype.hasOwnProperty.call(properties, operandKey)) {
                            return [2 /*return*/, false];
                        }
                        if (!operand.includes('inlist')) return [3 /*break*/, 5];
                        listIdRegex = /inlist\(([^)]+)\)/;
                        match = operand.match(listIdRegex);
                        if (!match || match.length < 2) {
                            logger_1.LogManager.Instance.error("Invalid 'inList' operand format");
                            return [2 /*return*/, false];
                        }
                        tagValue = properties[operandKey];
                        attributeValue = this.preProcessTagValue(tagValue);
                        listId = match[1];
                        queryParamsObj = {
                            attribute: attributeValue,
                            listId: listId,
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, GatewayServiceUtil_1.getFromGatewayService)(queryParamsObj, UrlEnum_1.UrlEnum.ATTRIBUTE_CHECK)];
                    case 2:
                        res = _c.sent();
                        if (!res || res === undefined || res === 'false' || res.status === 0) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, res];
                    case 3:
                        error_1 = _c.sent();
                        logger_1.LogManager.Instance.error('Error while fetching data: ' + error_1);
                        return [2 /*return*/, false];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        tagValue = properties[operandKey];
                        tagValue = this.preProcessTagValue(tagValue);
                        _b = this.preProcessOperandValue(operand), operandType = _b.operandType, operandValue = _b.operandValue;
                        processedValues = this.processValues(operandValue, tagValue);
                        tagValue = processedValues.tagValue;
                        return [2 /*return*/, this.extractResult(operandType, processedValues.operandValue, tagValue)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Evaluates a user DSL expression to check if a user ID is in a specified list.
     * @param {Record<string, any>} dslOperandValue - The DSL expression containing user IDs.
     * @param {Record<string, dynamic>} properties - The properties object containing the actual user ID to check.
     * @returns {boolean} - True if the user ID is in the list, otherwise false.
     */
    SegmentOperandEvaluator.prototype.evaluateUserDSL = function (dslOperandValue, properties) {
        var users = dslOperandValue.split(',');
        for (var i = 0; i < users.length; i++) {
            if (users[i].trim() == properties._vwoUserId) {
                return true;
            }
        }
        return false;
    };
    /**
     * Evaluates a user agent DSL expression.
     * @param {Record<string, any>} dslOperandValue - The DSL expression for the user agent.
     * @param {any} context - The context object containing the user agent string.
     * @returns {boolean} - True if the user agent matches the DSL condition, otherwise false.
     */
    SegmentOperandEvaluator.prototype.evaluateUserAgentDSL = function (dslOperandValue, context) {
        var operand = dslOperandValue;
        if (!context.getUserAgent() || context.getUserAgent() === undefined) {
            logger_1.LogManager.Instance.info('To Evaluate UserAgent segmentation, please provide userAgent in context');
            return false;
        }
        var tagValue = decodeURIComponent(context.getUserAgent());
        var _a = this.preProcessOperandValue(operand), operandType = _a.operandType, operandValue = _a.operandValue;
        var processedValues = this.processValues(operandValue, tagValue);
        tagValue = processedValues.tagValue; // Fix: Type assertion to ensure tagValue is of type string
        return this.extractResult(operandType, processedValues.operandValue, tagValue);
    };
    /**
     * Pre-processes the tag value to ensure it is in the correct format for evaluation.
     * @param {any} tagValue - The value to be processed.
     * @returns {string | boolean} - The processed tag value, either as a string or a boolean.
     */
    SegmentOperandEvaluator.prototype.preProcessTagValue = function (tagValue) {
        // Default to empty string if undefined
        if (tagValue === undefined) {
            tagValue = '';
        }
        // Convert boolean values to boolean type
        if ((0, DataTypeUtil_1.isBoolean)(tagValue)) {
            tagValue = tagValue ? true : false;
        }
        // Convert all non-null values to string
        if (tagValue !== null) {
            tagValue = tagValue.toString();
        }
        return tagValue;
    };
    /**
     * Pre-processes the operand value to determine its type and extract the value based on regex matches.
     * @param {any} operand - The operand to be processed.
     * @returns {Record<string, any>} - An object containing the operand type and value.
     */
    SegmentOperandEvaluator.prototype.preProcessOperandValue = function (operand) {
        var operandType;
        var operandValue;
        // Determine the type of operand and extract value based on regex patterns
        if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LOWER_MATCH)) {
            operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.LOWER_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LOWER_MATCH);
        }
        else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.WILDCARD_MATCH)) {
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.WILDCARD_MATCH);
            var startingStar = (0, SegmentUtil_1.matchWithRegex)(operandValue, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.STARTING_STAR);
            var endingStar = (0, SegmentUtil_1.matchWithRegex)(operandValue, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.ENDING_STAR);
            // Determine specific wildcard type
            if (startingStar && endingStar) {
                operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE;
            }
            else if (startingStar) {
                operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.STARTING_STAR_VALUE;
            }
            else if (endingStar) {
                operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.ENDING_STAR_VALUE;
            }
            // Remove wildcard characters from the operand value
            operandValue = operandValue
                .replace(new RegExp(SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.STARTING_STAR), '')
                .replace(new RegExp(SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.ENDING_STAR), '');
        }
        else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.REGEX_MATCH)) {
            operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.REGEX_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.REGEX_MATCH);
        }
        else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.GREATER_THAN_MATCH)) {
            operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.GREATER_THAN_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.GREATER_THAN_MATCH);
        }
        else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.GREATER_THAN_EQUAL_TO_MATCH)) {
            operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.GREATER_THAN_EQUAL_TO_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.GREATER_THAN_EQUAL_TO_MATCH);
        }
        else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LESS_THAN_MATCH)) {
            operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.LESS_THAN_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LESS_THAN_MATCH);
        }
        else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LESS_THAN_EQUAL_TO_MATCH)) {
            operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.LESS_THAN_EQUAL_TO_VALUE;
            operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LESS_THAN_EQUAL_TO_MATCH);
        }
        else {
            operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.EQUAL_VALUE;
            operandValue = operand;
        }
        return {
            operandType: operandType,
            operandValue: operandValue,
        };
    };
    /**
     * Extracts the operand value from a string based on a specified regex pattern.
     * @param {any} operand - The operand string to extract from.
     * @param {string} regex - The regex pattern to use for extraction.
     * @returns {string} - The extracted value.
     */
    SegmentOperandEvaluator.prototype.extractOperandValue = function (operand, regex) {
        // Match operand with regex and return the first capturing group
        return (0, SegmentUtil_1.matchWithRegex)(operand, regex) && (0, SegmentUtil_1.matchWithRegex)(operand, regex)[1];
    };
    /**
     * Processes numeric values from operand and tag values, converting them to strings.
     * @param {any} operandValue - The operand value to process.
     * @param {any} tagValue - The tag value to process.
     * @returns {Record<string, dynamic>} - An object containing the processed operand and tag values as strings.
     */
    SegmentOperandEvaluator.prototype.processValues = function (operandValue, tagValue, operandType) {
        if (operandType === void 0) { operandType = undefined; }
        if (operandType === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.IP ||
            operandType === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.BROWSER_VERSION ||
            operandType === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.OS_VERSION) {
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
        var processedOperandValue = parseFloat(operandValue);
        var processedTagValue = parseFloat(tagValue);
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
    };
    /**
     * Extracts the result of the evaluation based on the operand type and values.
     * @param {SegmentOperandValueEnum} operandType - The type of the operand.
     * @param {any} operandValue - The value of the operand.
     * @param {any} tagValue - The value of the tag to compare against.
     * @returns {boolean} - The result of the evaluation.
     */
    SegmentOperandEvaluator.prototype.extractResult = function (operandType, operandValue, tagValue) {
        var result = false;
        if (tagValue === null) {
            return false;
        }
        // Ensure operand_value and tag_value are strings
        var operandValueStr = String(operandValue);
        var tagValueStr = String(tagValue);
        switch (operandType) {
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.LOWER_VALUE:
                result = operandValueStr.toLowerCase() === tagValueStr.toLowerCase();
                break;
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE:
                result = tagValueStr.indexOf(operandValueStr) !== -1;
                break;
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.STARTING_STAR_VALUE:
                result = tagValueStr.endsWith(operandValueStr);
                break;
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.ENDING_STAR_VALUE:
                result = tagValueStr.startsWith(operandValueStr);
                break;
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.REGEX_VALUE:
                try {
                    var pattern = new RegExp(operandValueStr);
                    var matcher = pattern.exec(tagValueStr);
                    result = matcher !== null;
                }
                catch (err) {
                    result = false;
                }
                break;
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.GREATER_THAN_VALUE:
                result = this.compareVersions(tagValueStr, operandValueStr) > 0;
                break;
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.GREATER_THAN_EQUAL_TO_VALUE:
                result = this.compareVersions(tagValueStr, operandValueStr) >= 0;
                break;
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.LESS_THAN_VALUE:
                result = this.compareVersions(tagValueStr, operandValueStr) < 0;
                break;
            case SegmentOperandValueEnum_1.SegmentOperandValueEnum.LESS_THAN_EQUAL_TO_VALUE:
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
    };
    /**
     * Evaluates a given string tag value against a DSL operand value.
     * @param {any} dslOperandValue - The DSL operand string (e.g., "contains(\"value\")").
     * @param {ContextModel} context - The context object containing the value to evaluate.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand being evaluated (ip_address, browser_version, os_version).
     * @returns {boolean} - True if tag value matches DSL operand criteria, false otherwise.
     */
    SegmentOperandEvaluator.prototype.evaluateStringOperandDSL = function (dslOperandValue, context, operandType) {
        var operand = String(dslOperandValue);
        // Determine the tag value based on operand type
        var tagValue = this.getTagValueForOperandType(context, operandType);
        if (tagValue === null) {
            this.logMissingContextError(operandType);
            return false;
        }
        var operandTypeAndValue = this.preProcessOperandValue(operand);
        var processedValues = this.processValues(operandTypeAndValue.operandValue, tagValue, operandType);
        var processedTagValue = processedValues.tagValue;
        return this.extractResult(operandTypeAndValue.operandType, String(processedValues.operandValue).trim().replace(/"/g, ''), processedTagValue);
    };
    /**
     * Gets the appropriate tag value based on the operand type.
     * @param {ContextModel} context - The context object.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand.
     * @returns {string | null} - The tag value or null if not available.
     */
    SegmentOperandEvaluator.prototype.getTagValueForOperandType = function (context, operandType) {
        if (operandType === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.IP) {
            return context.getIpAddress() || null;
        }
        else if (operandType === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.BROWSER_VERSION) {
            return this.getBrowserVersionFromContext(context);
        }
        else {
            // Default works for OS version
            return this.getOsVersionFromContext(context);
        }
    };
    /**
     * Gets browser version from context.
     * @param {ContextModel} context - The context object.
     * @returns {string | null} - The browser version or null if not available.
     */
    SegmentOperandEvaluator.prototype.getBrowserVersionFromContext = function (context) {
        var _a;
        var userAgent = (_a = context.getVwo()) === null || _a === void 0 ? void 0 : _a.getUaInfo();
        if (!userAgent || typeof userAgent !== 'object' || Object.keys(userAgent).length === 0) {
            return null;
        }
        // Assuming UserAgent dictionary contains browser_version
        if ('browser_version' in userAgent) {
            return userAgent.browser_version !== null ? String(userAgent.browser_version) : null;
        }
        return null;
    };
    /**
     * Gets OS version from context.
     * @param {ContextModel} context - The context object.
     * @returns {string | null} - The OS version or null if not available.
     */
    SegmentOperandEvaluator.prototype.getOsVersionFromContext = function (context) {
        var _a;
        var userAgent = (_a = context.getVwo()) === null || _a === void 0 ? void 0 : _a.getUaInfo();
        if (!userAgent || typeof userAgent !== 'object' || Object.keys(userAgent).length === 0) {
            return null;
        }
        // Assuming UserAgent dictionary contains os_version
        if ('os_version' in userAgent) {
            return userAgent.os_version !== null ? String(userAgent.os_version) : null;
        }
        return null;
    };
    /**
     * Logs appropriate error message for missing context.
     * @param {SegmentOperatorValueEnum} operandType - The type of operand.
     */
    SegmentOperandEvaluator.prototype.logMissingContextError = function (operandType) {
        if (operandType === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.IP) {
            logger_1.LogManager.Instance.info('To evaluate IP segmentation, please provide ipAddress in context');
        }
        else if (operandType === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.BROWSER_VERSION) {
            logger_1.LogManager.Instance.info('To evaluate browser version segmentation, please provide userAgent in context');
        }
        else {
            logger_1.LogManager.Instance.info('To evaluate OS version segmentation, please provide userAgent in context');
        }
    };
    /**
     * Checks if a string appears to be a version string (contains only digits and dots).
     * @param {string} str - The string to check.
     * @returns {boolean} - True if the string appears to be a version string.
     */
    SegmentOperandEvaluator.prototype.isVersionString = function (str) {
        return /^(\d+\.)*\d+$/.test(str);
    };
    /**
     * Compares two version strings using semantic versioning rules.
     * Supports formats like "1.2.3", "1.0", "2.1.4.5", etc.
     * @param {string} version1 - First version string.
     * @param {string} version2 - Second version string.
     * @returns {number} - -1 if version1 < version2, 0 if equal, 1 if version1 > version2.
     */
    SegmentOperandEvaluator.prototype.compareVersions = function (version1, version2) {
        // Split versions by dots and convert to integers
        var parts1 = version1.split('.').map(function (part) { return (part.match(/^\d+$/) ? parseInt(part, 10) : 0); });
        var parts2 = version2.split('.').map(function (part) { return (part.match(/^\d+$/) ? parseInt(part, 10) : 0); });
        // Find the maximum length to handle different version formats
        var maxLength = Math.max(parts1.length, parts2.length);
        for (var i = 0; i < maxLength; i++) {
            var part1 = i < parts1.length ? parts1[i] : 0;
            var part2 = i < parts2.length ? parts2[i] : 0;
            if (part1 < part2) {
                return -1;
            }
            else if (part1 > part2) {
                return 1;
            }
        }
        return 0; // Versions are equal
    };
    // Regex pattern to check if a string contains non-numeric characters (except decimal point)
    SegmentOperandEvaluator.NON_NUMERIC_PATTERN = /[^0-9.]/;
    return SegmentOperandEvaluator;
}());
exports.SegmentOperandEvaluator = SegmentOperandEvaluator;
//# sourceMappingURL=SegmentOperandEvaluator.js.map