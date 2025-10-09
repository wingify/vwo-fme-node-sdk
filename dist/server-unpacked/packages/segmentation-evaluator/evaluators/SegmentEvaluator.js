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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.SegmentEvaluator = void 0;
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
var StorageDecorator_1 = require("../../../decorators/StorageDecorator");
var logger_1 = require("../../logger");
var StorageService_1 = require("../../../services/StorageService");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var SegmentOperatorValueEnum_1 = require("../enums/SegmentOperatorValueEnum");
var SegmentUtil_1 = require("../utils/SegmentUtil");
var SegmentOperandEvaluator_1 = require("./SegmentOperandEvaluator");
var SegmentEvaluator = /** @class */ (function () {
    function SegmentEvaluator() {
    }
    /**
     * Validates if the segmentation defined in the DSL is applicable based on the provided properties.
     * @param dsl The domain-specific language defining the segmentation rules.
     * @param properties The properties against which the DSL rules are evaluated.
     * @returns A Promise resolving to a boolean indicating if the segmentation is valid.
     */
    SegmentEvaluator.prototype.isSegmentationValid = function (dsl, properties) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, key, value, operator, subDsl, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = (0, SegmentUtil_1.getKeyValue)(dsl), key = _a.key, value = _a.value;
                        operator = key;
                        subDsl = value;
                        _b = operator;
                        switch (_b) {
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.NOT: return [3 /*break*/, 1];
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.AND: return [3 /*break*/, 3];
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.OR: return [3 /*break*/, 5];
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CUSTOM_VARIABLE: return [3 /*break*/, 7];
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.USER: return [3 /*break*/, 9];
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.UA: return [3 /*break*/, 10];
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.IP: return [3 /*break*/, 11];
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.BROWSER_VERSION: return [3 /*break*/, 12];
                            case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.OS_VERSION: return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 14];
                    case 1: return [4 /*yield*/, this.isSegmentationValid(subDsl, properties)];
                    case 2: return [2 /*return*/, !(_c.sent())];
                    case 3: return [4 /*yield*/, this.every(subDsl, properties)];
                    case 4: return [2 /*return*/, _c.sent()];
                    case 5: return [4 /*yield*/, this.some(subDsl, properties)];
                    case 6: return [2 /*return*/, _c.sent()];
                    case 7: return [4 /*yield*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateCustomVariableDSL(subDsl, properties)];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: return [2 /*return*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateUserDSL(subDsl, properties)];
                    case 10: return [2 /*return*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateUserAgentDSL(subDsl, this.context)];
                    case 11: return [2 /*return*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateStringOperandDSL(subDsl, this.context, SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.IP)];
                    case 12: return [2 /*return*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateStringOperandDSL(subDsl, this.context, SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.BROWSER_VERSION)];
                    case 13: return [2 /*return*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateStringOperandDSL(subDsl, this.context, SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.OS_VERSION)];
                    case 14: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Evaluates if any of the DSL nodes are valid using the OR logic.
     * @param dslNodes Array of DSL nodes to evaluate.
     * @param customVariables Custom variables provided for evaluation.
     * @returns A Promise resolving to a boolean indicating if any of the nodes are valid.
     */
    SegmentEvaluator.prototype.some = function (dslNodes, customVariables) {
        return __awaiter(this, void 0, void 0, function () {
            var uaParserMap, keyCount, isUaParser, _i, dslNodes_1, dsl, _loop_1, this_1, _a, _b, _c, _d, key, state_1, uaParserResult, err_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        uaParserMap = {};
                        keyCount = 0;
                        isUaParser = false;
                        _i = 0, dslNodes_1 = dslNodes;
                        _e.label = 1;
                    case 1:
                        if (!(_i < dslNodes_1.length)) return [3 /*break*/, 12];
                        dsl = dslNodes_1[_i];
                        _loop_1 = function (key) {
                            var value, valuesArray, featureIdObject, featureIdKey_1, featureIdValue, features, feature, featureKey, result;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        // Check for user agent related keys
                                        if (key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.OPERATING_SYSTEM ||
                                            key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.BROWSER_AGENT ||
                                            key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.DEVICE_TYPE ||
                                            key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.DEVICE) {
                                            isUaParser = true;
                                            value = dsl[key];
                                            if (!uaParserMap[key]) {
                                                uaParserMap[key] = [];
                                            }
                                            valuesArray = Array.isArray(value) ? value : [value];
                                            valuesArray.forEach(function (val) {
                                                if (typeof val === 'string') {
                                                    uaParserMap[key].push(val);
                                                }
                                            });
                                            keyCount++; // Increment count of keys encountered
                                        }
                                        if (!(key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.FEATURE_ID)) return [3 /*break*/, 3];
                                        featureIdObject = dsl[key];
                                        featureIdKey_1 = Object.keys(featureIdObject)[0];
                                        featureIdValue = featureIdObject[featureIdKey_1];
                                        if (!(featureIdValue === 'on' || featureIdValue === 'off')) return [3 /*break*/, 3];
                                        features = this_1.settings.getFeatures();
                                        feature = features.find(function (feature) { return feature.getId() === parseInt(featureIdKey_1); });
                                        if (!feature) return [3 /*break*/, 2];
                                        featureKey = feature.getKey();
                                        return [4 /*yield*/, this_1.checkInUserStorage(this_1.settings, featureKey, this_1.context)];
                                    case 1:
                                        result = _f.sent();
                                        // if the result is false, then we need to return true as feature is not present in the user storage
                                        if (featureIdValue === 'off') {
                                            return [2 /*return*/, { value: !result }];
                                        }
                                        return [2 /*return*/, { value: result }];
                                    case 2:
                                        logger_1.LogManager.Instance.error('Feature not found with featureIdKey: ' + featureIdKey_1);
                                        return [2 /*return*/, { value: null }];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = dsl;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _d = 0;
                        _e.label = 2;
                    case 2:
                        if (!(_d < _b.length)) return [3 /*break*/, 5];
                        _c = _b[_d];
                        if (!(_c in _a)) return [3 /*break*/, 4];
                        key = _c;
                        return [5 /*yield**/, _loop_1(key)];
                    case 3:
                        state_1 = _e.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _e.label = 4;
                    case 4:
                        _d++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (!(isUaParser && keyCount === dslNodes.length)) return [3 /*break*/, 9];
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.checkUserAgentParser(uaParserMap)];
                    case 7:
                        uaParserResult = _e.sent();
                        return [2 /*return*/, uaParserResult];
                    case 8:
                        err_1 = _e.sent();
                        logger_1.LogManager.Instance.error('Failed to validate User Agent. Erro: ' + err_1);
                        return [3 /*break*/, 9];
                    case 9: return [4 /*yield*/, this.isSegmentationValid(dsl, customVariables)];
                    case 10:
                        // Recursively check each DSL node
                        if (_e.sent()) {
                            return [2 /*return*/, true];
                        }
                        _e.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Evaluates all DSL nodes using the AND logic.
     * @param dslNodes Array of DSL nodes to evaluate.
     * @param customVariables Custom variables provided for evaluation.
     * @returns A Promise resolving to a boolean indicating if all nodes are valid.
     */
    SegmentEvaluator.prototype.every = function (dslNodes, customVariables) {
        return __awaiter(this, void 0, void 0, function () {
            var locationMap, _i, dslNodes_2, dsl, segmentResult, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        locationMap = {};
                        _i = 0, dslNodes_2 = dslNodes;
                        _a.label = 1;
                    case 1:
                        if (!(_i < dslNodes_2.length)) return [3 /*break*/, 7];
                        dsl = dslNodes_2[_i];
                        if (!(SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.COUNTRY in dsl ||
                            SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.REGION in dsl ||
                            SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CITY in dsl)) return [3 /*break*/, 4];
                        this.addLocationValuesToMap(dsl, locationMap);
                        if (!(Object.keys(locationMap).length === dslNodes.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.checkLocationPreSegmentation(locationMap)];
                    case 2:
                        segmentResult = _a.sent();
                        return [2 /*return*/, segmentResult];
                    case 3: return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.isSegmentationValid(dsl, customVariables)];
                    case 5:
                        res = _a.sent();
                        if (!res) {
                            return [2 /*return*/, false];
                        }
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Adds location values from a DSL node to a map.
     * @param dsl DSL node containing location data.
     * @param locationMap Map to store location data.
     */
    SegmentEvaluator.prototype.addLocationValuesToMap = function (dsl, locationMap) {
        // Add country, region, and city information to the location map if present
        if (SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.COUNTRY in dsl) {
            locationMap[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.COUNTRY] = dsl[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.COUNTRY];
        }
        if (SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.REGION in dsl) {
            locationMap[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.REGION] = dsl[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.REGION];
        }
        if (SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CITY in dsl) {
            locationMap[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CITY] = dsl[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CITY];
        }
    };
    /**
     * Checks if the user's location matches the expected location criteria.
     * @param locationMap Map of expected location values.
     * @returns A Promise resolving to a boolean indicating if the location matches.
     */
    SegmentEvaluator.prototype.checkLocationPreSegmentation = function (locationMap) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                // Ensure user's IP address is available
                if (((_a = this.context) === null || _a === void 0 ? void 0 : _a.getIpAddress()) === undefined && typeof process !== 'undefined') {
                    logger_1.LogManager.Instance.error('To evaluate location pre Segment, please pass ipAddress in context object');
                    return [2 /*return*/, false];
                }
                // Check if location data is available and matches the expected values
                if (!((_c = (_b = this.context) === null || _b === void 0 ? void 0 : _b.getVwo()) === null || _c === void 0 ? void 0 : _c.getLocation()) ||
                    ((_e = (_d = this.context) === null || _d === void 0 ? void 0 : _d.getVwo()) === null || _e === void 0 ? void 0 : _e.getLocation()) === undefined ||
                    ((_g = (_f = this.context) === null || _f === void 0 ? void 0 : _f.getVwo()) === null || _g === void 0 ? void 0 : _g.getLocation()) === null) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, this.valuesMatch(locationMap, (_j = (_h = this.context) === null || _h === void 0 ? void 0 : _h.getVwo()) === null || _j === void 0 ? void 0 : _j.getLocation())];
            });
        });
    };
    /**
     * Checks if the user's device information matches the expected criteria.
     * @param uaParserMap Map of expected user agent values.
     * @returns A Promise resolving to a boolean indicating if the user agent matches.
     */
    SegmentEvaluator.prototype.checkUserAgentParser = function (uaParserMap) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                // Ensure user's user agent is available
                if (!((_a = this.context) === null || _a === void 0 ? void 0 : _a.getUserAgent()) || ((_b = this.context) === null || _b === void 0 ? void 0 : _b.getUserAgent()) === undefined) {
                    logger_1.LogManager.Instance.error('To evaluate user agent related segments, please pass userAgent in context object');
                    return [2 /*return*/, false];
                }
                // Check if user agent data is available and matches the expected values
                if (!((_d = (_c = this.context) === null || _c === void 0 ? void 0 : _c.getVwo()) === null || _d === void 0 ? void 0 : _d.getUaInfo()) || ((_f = (_e = this.context) === null || _e === void 0 ? void 0 : _e.getVwo()) === null || _f === void 0 ? void 0 : _f.getUaInfo()) === undefined) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, this.checkValuePresent(uaParserMap, (_h = (_g = this.context) === null || _g === void 0 ? void 0 : _g.getVwo()) === null || _h === void 0 ? void 0 : _h.getUaInfo())];
            });
        });
    };
    /**
     * Checks if the feature is enabled for the user by querying the storage.
     * @param settings The settings model containing configuration.
     * @param featureKey The key of the feature to check.
     * @param user The user object to check against.
     * @returns A Promise resolving to a boolean indicating if the feature is enabled for the user.
     */
    SegmentEvaluator.prototype.checkInUserStorage = function (settings, featureKey, context) {
        return __awaiter(this, void 0, void 0, function () {
            var storageService, storedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storageService = new StorageService_1.StorageService();
                        return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService)];
                    case 1:
                        storedData = _a.sent();
                        // Check if the stored data is an object and not empty
                        if ((0, DataTypeUtil_1.isObject)(storedData) && Object.keys(storedData).length > 0) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if the actual values match the expected values specified in the map.
     * @param expectedMap A map of expected values for different keys.
     * @param actualMap A map of actual values to compare against.
     * @returns A Promise resolving to a boolean indicating if all actual values match the expected values.
     */
    SegmentEvaluator.prototype.checkValuePresent = function (expectedMap, actualMap) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_2, key, state_2;
            return __generator(this, function (_a) {
                _loop_2 = function (key) {
                    if (Object.prototype.hasOwnProperty.call(expectedMap, key)) {
                        var expectedValues_2 = expectedMap[key];
                        // convert expected values to lowercase
                        expectedValues_2.forEach(function (value, index) {
                            expectedValues_2[index] = value.toLowerCase();
                        });
                        var actualValue = actualMap[key];
                        // Handle wildcard patterns for all keys
                        for (var _i = 0, expectedValues_1 = expectedValues_2; _i < expectedValues_1.length; _i++) {
                            var val = expectedValues_1[_i];
                            // Check if the value is a wildcard pattern and matches the actual value using regex
                            if (val.startsWith('wildcard(') && val.endsWith(')')) {
                                // Extract pattern from wildcard string
                                var wildcardPattern = val.slice(9, -1);
                                // Convert wildcard pattern to regex and check if it matches the actual value
                                var regex = new RegExp(wildcardPattern.replace(/\*/g, '.*'), 'i'); // Convert wildcard pattern to regex, 'i' for case-insensitive
                                // Check if the actual value matches the regex pattern for the key
                                if (regex.test(actualValue)) {
                                    return { value: true };
                                }
                            }
                        }
                        // this will be checked for all cases where wildcard is not present
                        if (expectedValues_2.includes(actualValue === null || actualValue === void 0 ? void 0 : actualValue.toLowerCase())) {
                            return { value: true };
                        }
                    }
                };
                for (key in actualMap) {
                    state_2 = _loop_2(key);
                    if (typeof state_2 === "object")
                        return [2 /*return*/, state_2.value];
                }
                return [2 /*return*/, false]; // No matches found
            });
        });
    };
    /**
     * Compares expected location values with user's location to determine a match.
     * @param expectedLocationMap A map of expected location values.
     * @param userLocation The user's actual location.
     * @returns A boolean indicating if the user's location matches the expected values.
     */
    SegmentEvaluator.prototype.valuesMatch = function (expectedLocationMap, userLocation) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, key, value, normalizedValue1, normalizedValue2;
            return __generator(this, function (_c) {
                for (_i = 0, _a = Object.entries(expectedLocationMap); _i < _a.length; _i++) {
                    _b = _a[_i], key = _b[0], value = _b[1];
                    if (key in userLocation) {
                        normalizedValue1 = this.normalizeValue(value);
                        normalizedValue2 = this.normalizeValue(userLocation[key]);
                        if (normalizedValue1 !== normalizedValue2) {
                            return [2 /*return*/, false];
                        }
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                }
                return [2 /*return*/, true]; // If all values match, return true
            });
        });
    };
    /**
     * Normalizes a value to a consistent format for comparison.
     * @param value The value to normalize.
     * @returns The normalized value.
     */
    SegmentEvaluator.prototype.normalizeValue = function (value) {
        if (value === null || value === undefined) {
            return null;
        }
        // Remove quotes and trim whitespace
        return value.toString().replace(/^"|"$/g, '').trim();
    };
    return SegmentEvaluator;
}());
exports.SegmentEvaluator = SegmentEvaluator;
//# sourceMappingURL=SegmentEvaluator.js.map