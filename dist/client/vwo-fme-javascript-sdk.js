/*!
 * vwo-fme-javascript-sdk - v1.35.0
 * URL - https://github.com/wingify/vwo-fme-javascript-sdk
 *
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Dependencies used -
 *  1. murmurhash - ^2.0.1
 *  2. superstruct - ^0.14.x
 *  3. uuid - ^9.0.1
 *  4. vwo-fme-sdk-log-messages - ^1.2.10
 */
(function webpackUniversalModuleDefinition(root, factory) {
	// CommonJS2
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	// AMD
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	// CommonJS
	else if(typeof exports === 'object')
		exports["vwoSdk"] = factory();
	// Root
	else
		root["vwoSdk"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./VERSION.js":
/*!********************!*\
  !*** ./VERSION.js ***!
  \********************/
/***/ ((module) => {

module.exports = {
  version: "1.35.0"
};

/***/ }),

/***/ "./lib/VWO.ts":
/*!********************!*\
  !*** ./lib/VWO.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VWO = void 0;
exports.init = init;
exports.onInit = onInit;
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
var VWOBuilder_1 = __webpack_require__(/*! ./VWOBuilder */ "./lib/VWOBuilder.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ./utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ./utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var SdkInitAndUsageStatsUtil_1 = __webpack_require__(/*! ./utils/SdkInitAndUsageStatsUtil */ "./lib/utils/SdkInitAndUsageStatsUtil.ts");
var log_messages_1 = __webpack_require__(/*! ./enums/log-messages */ "./lib/enums/log-messages/index.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var PlatformEnum_1 = __webpack_require__(/*! ./enums/PlatformEnum */ "./lib/enums/PlatformEnum.ts");
var ApiEnum_1 = __webpack_require__(/*! ./enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var logger_1 = __webpack_require__(/*! ./packages/logger */ "./lib/packages/logger/index.ts");
var SettingsSchemaValidation_1 = __webpack_require__(/*! ./models/schemas/SettingsSchemaValidation */ "./lib/models/schemas/SettingsSchemaValidation.ts");
var VWO = /** @class */ (function () {
    /**
     * Constructor for the VWO class.
     * Initializes a new instance of VWO with the provided options.
     * @param {Record<string, dynamic>} options - Configuration options for the VWO instance.
     * @returns The instance of VWO.
     */
    function VWO(options) {
        return VWO.setInstance(options);
    }
    /**
     * Sets the singleton instance of VWO.
     * Configures and builds the VWO instance using the provided options.
     * @param {Record<string, dynamic>} options - Configuration options for setting up VWO.
     * @returns A Promise resolving to the configured VWO instance.
     */
    VWO.setInstance = function (options) {
        var _this = this;
        var optionsVWOBuilder = options === null || options === void 0 ? void 0 : options.vwoBuilder;
        this.vwoBuilder = optionsVWOBuilder || new VWOBuilder_1.VWOBuilder(options);
        this.instance = this.vwoBuilder
            .setLogger() // Sets up logging for debugging and monitoring.
            .setSettingsService() // Sets the settings service for configuration management.
            .setStorage() // Configures storage for data persistence.
            .setNetworkManager() // Configures network management for API communication.
            .setSegmentation() // Sets up segmentation for targeted functionality.
            // .initBatching()        // Initializes batching for bulk data processing.
            .initPolling() // Starts polling mechanism for regular updates.
            .initBatching()
            .initUsageStats(); // Initializes usage statistics for the SDK.
        // .setAnalyticsCallback() // Sets up analytics callback for data analysis.
        if (options === null || options === void 0 ? void 0 : options.settings) {
            var isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(options.settings);
            if (isSettingsValid) {
                logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
                var vwoClient = this.vwoBuilder.build(options.settings);
                vwoClient.isSettingsValid = true;
                vwoClient.settingsFetchTime = 0;
                return Promise.resolve(vwoClient);
            }
            else {
                logger_1.LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.INIT });
                var vwoClient = this.vwoBuilder.build({});
                vwoClient.isSettingsValid = false;
                vwoClient.settingsFetchTime = 0;
                return Promise.resolve(vwoClient);
            }
        }
        return this.vwoBuilder.getSettings().then(function (settings) {
            var vwoClient = _this.vwoBuilder.build(settings);
            // Attach to instance for logging
            vwoClient.isSettingsValid = _this.vwoBuilder.isSettingsValid;
            vwoClient.settingsFetchTime = _this.vwoBuilder.settingsFetchTime;
            _this.settings = settings;
            return vwoClient;
        });
    };
    Object.defineProperty(VWO, "Instance", {
        /**
         * Gets the singleton instance of VWO.
         * @returns The singleton instance of VWO.
         */
        get: function () {
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    return VWO;
}());
exports.VWO = VWO;
var _global = {};
/**
 * Initializes a new instance of VWO with the provided options.
 * @param options Configuration options for the VWO instance.
 * @property {string} sdkKey - The SDK key for the VWO account.
 * @property {string} accountId - The account ID for the VWO account.
 * @property {GatewayServiceModel} gatewayService - The gateway service configuration.
 * @property {string} proxyUrl - (Browser only) Custom proxy URL to redirect all API calls. If provided, all GET and POST calls will be made to this URL instead of the default HOST_NAME.
 * @property {StorageService} storage - The storage configuration.
 * @returns
 */
function init(options) {
    return __awaiter(this, void 0, void 0, function () {
        var apiName, date, invalidErrorPrefix, msg, msg, msg, msg, startTimeForInit_1, instance, msg;
        var _this = this;
        return __generator(this, function (_a) {
            apiName = ApiEnum_1.ApiEnum.INIT;
            date = new Date().toISOString();
            try {
                invalidErrorPrefix = "[ERROR]: VWO-SDK ".concat(date, " ");
                if (!(0, DataTypeUtil_1.isObject)(options)) {
                    msg = invalidErrorPrefix + (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INVALID_OPTIONS);
                    console.error(msg); // Ensures options is an object.
                }
                if (!(options === null || options === void 0 ? void 0 : options.sdkKey) || !(0, DataTypeUtil_1.isString)(options === null || options === void 0 ? void 0 : options.sdkKey)) {
                    msg = invalidErrorPrefix + (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INVALID_SDK_KEY_IN_OPTIONS);
                    console.error(msg); // Validates sdkKey presence and type.
                }
                if (!options.accountId) {
                    msg = invalidErrorPrefix + (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INVALID_ACCOUNT_ID_IN_OPTIONS);
                    console.error(msg); // Validates accountId presence and type.
                }
                if (options.isAliasingEnabled && !options.gatewayService) {
                    msg = invalidErrorPrefix +
                        (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INVALID_GATEWAY_URL, {
                            date: date,
                        });
                    console.error(msg); // Validates gatewayService presence and type.
                }
                if (true) {
                    options.platform = PlatformEnum_1.PlatformEnum.CLIENT;
                }
                else {}
                startTimeForInit_1 = undefined;
                startTimeForInit_1 = Date.now();
                instance = new VWO(options);
                _global = {
                    vwoInitDeferred: new PromiseUtil_1.Deferred(),
                    isSettingsFetched: false,
                    instance: null,
                };
                return [2 /*return*/, instance.then(function (_vwoInstance) { return __awaiter(_this, void 0, void 0, function () {
                        var sdkInitTime, usageStatsAccountId;
                        var _a, _b, _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    sdkInitTime = Date.now() - startTimeForInit_1;
                                    if (!(_vwoInstance.isSettingsValid && !((_b = (_a = _vwoInstance.originalSettings) === null || _a === void 0 ? void 0 : _a.sdkMetaInfo) === null || _b === void 0 ? void 0 : _b.wasInitializedEarlier))) return [3 /*break*/, 3];
                                    if (!((_c = _vwoInstance.options) === null || _c === void 0 ? void 0 : _c.shouldWaitForTrackingCalls)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, SdkInitAndUsageStatsUtil_1.sendSdkInitEvent)(_vwoInstance.settingsFetchTime, sdkInitTime)];
                                case 1:
                                    _f.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    (0, SdkInitAndUsageStatsUtil_1.sendSdkInitEvent)(_vwoInstance.settingsFetchTime, sdkInitTime);
                                    _f.label = 3;
                                case 3:
                                    usageStatsAccountId = (_d = _vwoInstance.originalSettings) === null || _d === void 0 ? void 0 : _d.usageStatsAccountId;
                                    if (!usageStatsAccountId) return [3 /*break*/, 6];
                                    if (!((_e = _vwoInstance.options) === null || _e === void 0 ? void 0 : _e.shouldWaitForTrackingCalls)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, (0, SdkInitAndUsageStatsUtil_1.sendSDKUsageStatsEvent)(usageStatsAccountId)];
                                case 4:
                                    _f.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    (0, SdkInitAndUsageStatsUtil_1.sendSDKUsageStatsEvent)(usageStatsAccountId);
                                    _f.label = 6;
                                case 6:
                                    _global.isSettingsFetched = true;
                                    _global.instance = _vwoInstance;
                                    _global.vwoInitDeferred.resolve(_vwoInstance);
                                    return [2 /*return*/, _vwoInstance];
                            }
                        });
                    }); })];
            }
            catch (err) {
                msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.EXECUTION_FAILED, {
                    apiName: apiName,
                    err: err,
                });
                console.info("[INFO]: VWO-SDK ".concat(new Date().toISOString(), " ").concat(msg));
            }
            return [2 /*return*/];
        });
    });
}
function onInit() {
    return __awaiter(this, void 0, void 0, function () {
        var apiName, date_1, msg, msg;
        return __generator(this, function (_a) {
            apiName = ApiEnum_1.ApiEnum.ON_INIT;
            try {
                _global.vwoInitDeferred = new PromiseUtil_1.Deferred();
                date_1 = new Date().toISOString();
                // If settings are already fetched, resolve the promise
                if (_global.isSettingsFetched) {
                    msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.ON_INIT_ALREADY_RESOLVED, {
                        date: date_1,
                        apiName: apiName,
                    });
                    console.info(msg);
                    _global.vwoInitDeferred.resolve(_global.instance);
                }
                else {
                    // wait for five seconds, else reject the promise
                    setTimeout(function () {
                        if (_global.isSettingsFetched) {
                            return;
                        }
                        var msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.ON_INIT_SETTINGS_FAILED, {
                            date: date_1,
                        });
                        console.error(msg);
                        _global.vwoInitDeferred.reject(new Error('VWO settings could not be fetched'));
                    }, 5000);
                }
                return [2 /*return*/, _global.vwoInitDeferred.promise];
            }
            catch (err) {
                msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.EXECUTION_FAILED, {
                    apiName: apiName,
                    err: err,
                });
                console.info("[INFO]: VWO-SDK ".concat(new Date().toISOString(), " ").concat(msg));
            }
            return [2 /*return*/];
        });
    });
}


/***/ }),

/***/ "./lib/VWOBuilder.ts":
/*!***************************!*\
  !*** ./lib/VWOBuilder.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VWOBuilder = void 0;
var logger_1 = __webpack_require__(/*! ./packages/logger */ "./lib/packages/logger/index.ts");
var network_layer_1 = __webpack_require__(/*! ./packages/network-layer */ "./lib/packages/network-layer/index.ts");
var segmentation_evaluator_1 = __webpack_require__(/*! ./packages/segmentation-evaluator */ "./lib/packages/segmentation-evaluator/index.ts");
var storage_1 = __webpack_require__(/*! ./packages/storage */ "./lib/packages/storage/index.ts");
var VWOClient_1 = __webpack_require__(/*! ./VWOClient */ "./lib/VWOClient.ts");
var SettingsService_1 = __webpack_require__(/*! ./services/SettingsService */ "./lib/services/SettingsService.ts");
var log_messages_1 = __webpack_require__(/*! ./enums/log-messages */ "./lib/enums/log-messages/index.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ./utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ./utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ./utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var SettingsUtil_1 = __webpack_require__(/*! ./utils/SettingsUtil */ "./lib/utils/SettingsUtil.ts");
var UuidUtil_1 = __webpack_require__(/*! ./utils/UuidUtil */ "./lib/utils/UuidUtil.ts");
var BatchEventsQueue_1 = __webpack_require__(/*! ./services/BatchEventsQueue */ "./lib/services/BatchEventsQueue.ts");
var BatchEventsDispatcher_1 = __webpack_require__(/*! ./utils/BatchEventsDispatcher */ "./lib/utils/BatchEventsDispatcher.ts");
var UsageStatsUtil_1 = __webpack_require__(/*! ./utils/UsageStatsUtil */ "./lib/utils/UsageStatsUtil.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./lib/constants/index.ts");
var ApiEnum_1 = __webpack_require__(/*! ./enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var EdgeConfigModel_1 = __webpack_require__(/*! ./models/edge/EdgeConfigModel */ "./lib/models/edge/EdgeConfigModel.ts");
var VWOBuilder = /** @class */ (function () {
    function VWOBuilder(options) {
        this.originalSettings = {};
        this.isValidPollIntervalPassedFromInit = false;
        this.isSettingsValid = false;
        this.settingsFetchTime = undefined;
        this.options = options;
    }
    /**
     * Sets the network manager with the provided client and development mode options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setNetworkManager = function () {
        var _a, _b, _c, _d, _e, _f;
        if (this.options.edgeConfig && !(0, DataTypeUtil_1.isEmptyObject)((_a = this.options) === null || _a === void 0 ? void 0 : _a.edgeConfig)) {
            this.options.shouldWaitForTrackingCalls = true;
        }
        var networkInstance = network_layer_1.NetworkManager.Instance;
        // Attach the network client from options
        networkInstance.attachClient((_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.network) === null || _c === void 0 ? void 0 : _c.client, (_d = this.options) === null || _d === void 0 ? void 0 : _d.retryConfig, ((_e = this.options) === null || _e === void 0 ? void 0 : _e.shouldWaitForTrackingCalls) ? true : false);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: "Network Layer",
        }));
        // Set the development mode based on options
        networkInstance.getConfig().setDevelopmentMode((_f = this.options) === null || _f === void 0 ? void 0 : _f.isDevelopmentMode);
        return this;
    };
    VWOBuilder.prototype.initBatching = function () {
        var _this = this;
        var _a;
        // If edge config is provided, set the batch event data to the default values
        if (this.options.edgeConfig && !(0, DataTypeUtil_1.isEmptyObject)((_a = this.options) === null || _a === void 0 ? void 0 : _a.edgeConfig)) {
            var edgeConfigModel = new EdgeConfigModel_1.EdgeConfigModel().modelFromDictionary(this.options.edgeConfig);
            this.options.batchEventData = {
                eventsPerRequest: edgeConfigModel.getMaxEventsToBatch(),
                isEdgeEnvironment: true,
            };
        }
        if (this.options.batchEventData) {
            if (this.settingFileManager.isGatewayServiceProvided) {
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.GATEWAY_AND_BATCH_EVENTS_CONFIG_MISMATCH));
                return this;
            }
            if ((!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.eventsPerRequest) ||
                this.options.batchEventData.eventsPerRequest <= 0) &&
                (!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.requestTimeInterval) ||
                    this.options.batchEventData.requestTimeInterval <= 0)) {
                logger_1.LogManager.Instance.errorLog('INVALID_BATCH_EVENTS_CONFIG', {}, { an: ApiEnum_1.ApiEnum.INIT });
                return this;
            }
            this.batchEventsQueue = new BatchEventsQueue_1.BatchEventsQueue(Object.assign({}, this.options.batchEventData, {
                dispatcher: function (events, callback) {
                    return BatchEventsDispatcher_1.BatchEventsDispatcher.dispatch({
                        ev: events,
                    }, callback, Object.assign({}, {
                        a: _this.options.accountId,
                        env: _this.options.sdkKey,
                        sn: constants_1.Constants.SDK_NAME,
                        sv: constants_1.Constants.SDK_VERSION,
                    }));
                },
            }));
            this.batchEventsQueue.flushAndClearTimer.bind(this.batchEventsQueue);
        }
        return this;
    };
    /**
     * Sets the segmentation evaluator with the provided segmentation options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setSegmentation = function () {
        var _a;
        segmentation_evaluator_1.SegmentationManager.Instance.attachEvaluator((_a = this.options) === null || _a === void 0 ? void 0 : _a.segmentation);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: "Segmentation Evaluator",
        }));
        return this;
    };
    /**
     * Fetches settings asynchronously, ensuring no parallel fetches.
     * @returns {Promise<SettingsModel>} A promise that resolves to the fetched settings.
     */
    VWOBuilder.prototype.fetchSettings = function () {
        var _this = this;
        var deferredObject = new PromiseUtil_1.Deferred();
        // Check if a fetch operation is already in progress
        if (!this.isSettingsFetchInProgress) {
            this.isSettingsFetchInProgress = true;
            this.settingFileManager.getSettings().then(function (settings) {
                _this.isSettingsValid = _this.settingFileManager.isSettingsValid;
                _this.settingsFetchTime = _this.settingFileManager.settingsFetchTime;
                _this.originalSettings = settings;
                _this.isSettingsFetchInProgress = false;
                deferredObject.resolve(settings);
            });
            return deferredObject.promise;
        }
        else {
            deferredObject.resolve(this.originalSettings);
            return deferredObject.promise;
        }
    };
    /**
     * Gets the settings, fetching them if not cached or if forced.
     * @returns {Promise<SettingsModel>} A promise that resolves to the settings.
     */
    VWOBuilder.prototype.getSettings = function () {
        var deferredObject = new PromiseUtil_1.Deferred();
        try {
            // Use cached settings if available and not forced to fetch
            if (this.settings) {
                logger_1.LogManager.Instance.info('Using already fetched and cached settings');
                deferredObject.resolve(this.settings);
            }
            else {
                // Fetch settings if not cached
                this.fetchSettings().then(function (settings) {
                    deferredObject.resolve(settings);
                });
            }
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: ApiEnum_1.ApiEnum.INIT }, false);
            deferredObject.resolve({});
        }
        return deferredObject.promise;
    };
    /**
     * Sets the storage connector based on the provided storage options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setStorage = function () {
        var _a, _b, _c, _d;
        if (this.options.storage) {
            // Attach the storage connector from options
            this.storage = storage_1.Storage.Instance.attachConnector(this.options.storage);
            this.settingFileManager.isStorageServiceProvided = true;
        }
        else if ( true && typeof window !== 'undefined' && window.localStorage) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var BrowserStorageConnector = (__webpack_require__(/*! ./packages/storage/connectors/BrowserStorageConnector */ "./lib/packages/storage/connectors/BrowserStorageConnector.ts").BrowserStorageConnector);
            // Pass clientStorage config to BrowserStorageConnector
            this.storage = storage_1.Storage.Instance.attachConnector(new BrowserStorageConnector(__assign(__assign({}, this.options.clientStorage), { alwaysUseCachedSettings: (_a = this.options.clientStorage) === null || _a === void 0 ? void 0 : _a.alwaysUseCachedSettings, ttl: (_b = this.options.clientStorage) === null || _b === void 0 ? void 0 : _b.ttl })));
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
                service: ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.clientStorage) === null || _d === void 0 ? void 0 : _d.provider) === sessionStorage ? "Session Storage" : "Local Storage",
            }));
            this.settingFileManager.isStorageServiceProvided = true;
        }
        else {
            // Set storage to null if no storage options provided
            this.storage = null;
        }
        return this;
    };
    /**
     * Sets the settings manager with the provided options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setSettingsService = function () {
        this.settingFileManager = new SettingsService_1.SettingsService(this.options);
        return this;
    };
    /**
     * Sets the logger with the provided logger options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setLogger = function () {
        this.logManager = new logger_1.LogManager(this.options.logger || {});
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: "Logger",
        }));
        return this;
    };
    /**
     * Sets the analytics callback with the provided analytics options.
     * @returns {this} The instance of this builder.
     */
    /* setAnalyticsCallback(): this {
      if (!isObject(this.options.analyticsEvent)) {
        // TODO: add logging here
        return this;
      }
  
      if (!isFunction(this.options.analyticsEvent.eventCallback)) {
        // TODO: add logging here
        return this;
      }
  
      if (
        this.options.analyticsEvent.isBatchingSupported &&
        !isBoolean(this.options.analyticsEvent.isBatchingSupported)
      ) {
        // TODO:- add logging here
        return this;
      }
  
      // AnalyticsEvent.Instance.attachCallback(
      //   this.options.analyticsEvent.eventCallback,
      //   this.options.analyticsEvent.isBatchingSupported
      // );
      return this;
    } */
    /**
     * Generates a random user ID based on the provided API key.
     * @returns {string} The generated random user ID.
     */
    VWOBuilder.prototype.getRandomUserId = function () {
        var apiName = 'getRandomUserId';
        try {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                apiName: apiName,
            }));
            return (0, UuidUtil_1.getRandomUUID)(this.options.sdkKey);
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                apiName: apiName,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            });
        }
    };
    /**
     * Initializes the batching with the provided batch events options.
     * @returns {this} The instance of this builder.
     */
    /* initBatching(): this {
      if (!isObject(this.options.batchEvents)) {
        // TODO:- add logging here
        return this;
      }
  
      if (
        isObject(this.options.batchEvents) &&
        (!(
          (isNumber(this.options.batchEvents.eventsPerRequest) &&
            this.options.batchEvents.eventsPerRequest > 0 &&
            this.options.batchEvents.eventsPerRequest <= Constants.MAX_EVENTS_PER_REQUEST) ||
          (isNumber(this.options.batchEvents.requestTimeInterval) && this.options.batchEvents.requestTimeInterval >= 1)
        ) ||
          !isFunction(this.options.batchEvents.flushCallback))
      ) {
        LogManager.Instance.error('Invalid batchEvents config');
        // throw new Error('Invalid batchEvents config');
        return this;
      }
  
      // BatchEventsQueue.Instance.setBatchConfig(this.options.batchEvents, this.options.sdkKey); // TODO
  
      return this;
    } */
    /**
     * Initializes the polling with the provided poll interval.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.initPolling = function () {
        var pollInterval = this.options.pollInterval;
        if (pollInterval != null && (0, DataTypeUtil_1.isNumber)(pollInterval) && pollInterval >= 1000) {
            this.isValidPollIntervalPassedFromInit = true;
            this.checkAndPoll();
        }
        else if (pollInterval != null) {
            logger_1.LogManager.Instance.errorLog('INVALID_POLLING_CONFIGURATION', {
                key: 'pollInterval',
                correctType: 'number >= 1000',
            }, { an: ApiEnum_1.ApiEnum.INIT });
        }
        return this;
    };
    /**
     * Initializes usage statistics for the SDK.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.initUsageStats = function () {
        if (this.options.isUsageStatsDisabled) {
            return this;
        }
        UsageStatsUtil_1.UsageStatsUtil.getInstance().setUsageStats(this.options);
        return this;
    };
    /**
     * Builds a new VWOClient instance with the provided settings.
     * @param {SettingsModel} settings - The settings for the VWOClient.
     * @returns {VWOClient} The new VWOClient instance.
     */
    VWOBuilder.prototype.build = function (settings) {
        this.vwoInstance = new VWOClient_1.VWOClient(settings, this.options);
        this.updatePollIntervalAndCheckAndPoll(settings, true);
        return this.vwoInstance;
    };
    /**
     * Checks and polls for settings updates at the provided interval.
     */
    VWOBuilder.prototype.checkAndPoll = function () {
        var _this = this;
        var _a;
        var poll = function () { return __awaiter(_this, void 0, void 0, function () {
            var latestSettings, clonedSettings, ex_1, interval_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, this.getSettings()];
                    case 1:
                        latestSettings = _b.sent();
                        if (latestSettings &&
                            Object.keys(latestSettings).length > 0 &&
                            JSON.stringify(latestSettings) !== JSON.stringify(this.originalSettings)) {
                            this.originalSettings = latestSettings;
                            clonedSettings = (0, FunctionUtil_1.cloneObject)(latestSettings);
                            logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_SET_SETTINGS);
                            (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(clonedSettings, this.vwoInstance);
                            // Reinitialize the poll_interval value if there is a change in settings
                            this.updatePollIntervalAndCheckAndPoll(latestSettings, false);
                        }
                        else if (latestSettings) {
                            logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_NO_CHANGE_IN_SETTINGS);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        ex_1 = _b.sent();
                        logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS_WITH_POLLING', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(ex_1),
                        }, { an: constants_1.Constants.POLLING });
                        return [3 /*break*/, 4];
                    case 3:
                        interval_1 = (_a = this.options.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
                        setTimeout(poll, interval_1);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // Start the polling after the given interval
        var interval = (_a = this.options.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
        setTimeout(poll, interval);
    };
    VWOBuilder.prototype.updatePollIntervalAndCheckAndPoll = function (settings, shouldCheckAndPoll) {
        var _a;
        if (!this.isValidPollIntervalPassedFromInit) {
            var pollInterval = (_a = settings === null || settings === void 0 ? void 0 : settings.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_POLL_INTERVAL_FROM_SETTINGS, {
                source: (settings === null || settings === void 0 ? void 0 : settings.pollInterval) ? 'settings' : 'default',
                pollInterval: pollInterval.toString(),
            }));
            this.options.pollInterval = pollInterval;
        }
        if (shouldCheckAndPoll && !this.isValidPollIntervalPassedFromInit) {
            this.checkAndPoll();
        }
    };
    return VWOBuilder;
}());
exports.VWOBuilder = VWOBuilder;


/***/ }),

/***/ "./lib/VWOClient.ts":
/*!**************************!*\
  !*** ./lib/VWOClient.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VWOClient = void 0;
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
var logger_1 = __webpack_require__(/*! ./packages/logger */ "./lib/packages/logger/index.ts");
var GetFlag_1 = __webpack_require__(/*! ./api/GetFlag */ "./lib/api/GetFlag.ts");
var SetAttribute_1 = __webpack_require__(/*! ./api/SetAttribute */ "./lib/api/SetAttribute.ts");
var TrackEvent_1 = __webpack_require__(/*! ./api/TrackEvent */ "./lib/api/TrackEvent.ts");
var log_messages_1 = __webpack_require__(/*! ./enums/log-messages */ "./lib/enums/log-messages/index.ts");
var BatchEventsQueue_1 = __webpack_require__(/*! ./services/BatchEventsQueue */ "./lib/services/BatchEventsQueue.ts");
var SettingsSchemaValidation_1 = __webpack_require__(/*! ./models/schemas/SettingsSchemaValidation */ "./lib/models/schemas/SettingsSchemaValidation.ts");
var ContextModel_1 = __webpack_require__(/*! ./models/user/ContextModel */ "./lib/models/user/ContextModel.ts");
var HooksService_1 = __importDefault(__webpack_require__(/*! ./services/HooksService */ "./lib/services/HooksService.ts"));
var UrlUtil_1 = __webpack_require__(/*! ./utils/UrlUtil */ "./lib/utils/UrlUtil.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ./utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ./utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var SettingsUtil_1 = __webpack_require__(/*! ./utils/SettingsUtil */ "./lib/utils/SettingsUtil.ts");
var VariationModel_1 = __webpack_require__(/*! ./models/campaign/VariationModel */ "./lib/models/campaign/VariationModel.ts");
var NetworkUtil_1 = __webpack_require__(/*! ./utils/NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var SettingsService_1 = __webpack_require__(/*! ./services/SettingsService */ "./lib/services/SettingsService.ts");
var StorageService_1 = __webpack_require__(/*! ./services/StorageService */ "./lib/services/StorageService.ts");
var ApiEnum_1 = __webpack_require__(/*! ./enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var AliasingUtil_1 = __webpack_require__(/*! ./utils/AliasingUtil */ "./lib/utils/AliasingUtil.ts");
var UserIdUtil_1 = __webpack_require__(/*! ./utils/UserIdUtil */ "./lib/utils/UserIdUtil.ts");
var DataTypeUtil_2 = __webpack_require__(/*! ./utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ./utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var VWOClient = /** @class */ (function () {
    function VWOClient(settings, options) {
        this.options = options;
        (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(settings, this);
        UrlUtil_1.UrlUtil.init({
            collectionPrefix: this.settings.getCollectionPrefix(),
        });
        (0, NetworkUtil_1.setShouldWaitForTrackingCalls)(this.options.shouldWaitForTrackingCalls || false);
        logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.CLIENT_INITIALIZED);
        this.vwoClientInstance = this;
        this.isAliasingEnabled = options.isAliasingEnabled || false;
        return this;
    }
    /**
     * Retrieves the value of a feature flag for a given feature key and context.
     * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
     *
     * @param {string} featureKey - The key of the feature to retrieve.
     * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
     * @returns {Promise<Flag>} - A promise that resolves to the feature flag value.
     */
    VWOClient.prototype.getFlag = function (featureKey, context) {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, deferredObject, errorReturnSchema, hooksService, userId, contextModel, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.GET_FLAG;
                        deferredObject = new PromiseUtil_1.Deferred();
                        errorReturnSchema = new GetFlag_1.Flag(false, new VariationModel_1.VariationModel());
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        hooksService = new HooksService_1.default(this.options);
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        // Validate featureKey is a string
                        if (!(0, DataTypeUtil_1.isString)(featureKey)) {
                            logger_1.LogManager.Instance.errorLog('INVALID_PARAM', {
                                apiName: apiName,
                                key: 'featureKey',
                                type: (0, DataTypeUtil_1.getType)(featureKey),
                                correctType: 'string',
                            }, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                            throw new TypeError('TypeError: featureKey should be a string, got ' + (0, DataTypeUtil_1.getType)(featureKey));
                        }
                        // Validate settings are loaded and valid
                        if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(this.originalSettings)) {
                            logger_1.LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                            throw new Error('TypeError: Invalid Settings');
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            logger_1.LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                            throw new TypeError('TypeError: Invalid context');
                        }
                        return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled)];
                    case 2:
                        userId = _a.sent();
                        context.id = userId;
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                        GetFlag_1.FlagApi.get(featureKey, this.settings, contextModel, hooksService)
                            .then(function (data) {
                            deferredObject.resolve(data);
                        })
                            .catch(function () {
                            deferredObject.resolve(errorReturnSchema);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                            apiName: apiName,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_1),
                        }, { an: ApiEnum_1.ApiEnum.GET_FLAG });
                        deferredObject.resolve(errorReturnSchema);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    /**
     * Tracks an event with specified properties and context.
     * This method validates the types of the inputs and ensures the settings and user context are valid before proceeding.
     *
     * @param {string} eventName - The name of the event to track.
     * @param {ContextModel} context - The context in which the event is being tracked, must include a valid user ID.
     * @param {Record<string, dynamic>} eventProperties - The properties associated with the event.
     * @returns {Promise<Record<string, boolean>>} - A promise that resolves to the result of the tracking operation.
     */
    VWOClient.prototype.trackEvent = function (eventName_1, context_1) {
        return __awaiter(this, arguments, void 0, function (eventName, context, eventProperties) {
            var apiName, deferredObject, hooksService, userId, contextModel, err_2;
            var _a;
            if (eventProperties === void 0) { eventProperties = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.TRACK_EVENT;
                        deferredObject = new PromiseUtil_1.Deferred();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        hooksService = new HooksService_1.default(this.options);
                        // Log the API call
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        // Validate eventName is a string
                        if (!(0, DataTypeUtil_1.isString)(eventName)) {
                            logger_1.LogManager.Instance.errorLog('INVALID_PARAM', {
                                apiName: apiName,
                                key: 'eventName',
                                type: (0, DataTypeUtil_1.getType)(eventName),
                                correctType: 'string',
                            }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                            throw new TypeError('TypeError: Event-name should be a string, got ' + (0, DataTypeUtil_1.getType)(eventName));
                        }
                        // Validate eventProperties is an object
                        if (!(0, DataTypeUtil_1.isObject)(eventProperties)) {
                            logger_1.LogManager.Instance.errorLog('INVALID_PARAM', {
                                apiName: apiName,
                                key: 'eventProperties',
                                type: (0, DataTypeUtil_1.getType)(eventProperties),
                                correctType: 'object',
                            }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                            throw new TypeError('TypeError: eventProperties should be an object, got ' + (0, DataTypeUtil_1.getType)(eventProperties));
                        }
                        // Validate settings are loaded and valid
                        if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(this.originalSettings)) {
                            logger_1.LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                            throw new Error('TypeError: Invalid Settings');
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            logger_1.LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                            throw new TypeError('TypeError: Invalid context');
                        }
                        return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled)];
                    case 2:
                        userId = _b.sent();
                        context.id = userId;
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                        // Proceed with tracking the event
                        new TrackEvent_1.TrackApi()
                            .track(this.settings, eventName, contextModel, eventProperties, hooksService)
                            .then(function (data) {
                            deferredObject.resolve(data);
                        })
                            .catch(function () {
                            var _a;
                            deferredObject.resolve((_a = {}, _a[eventName] = false, _a));
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        // Log any errors encountered during the operation
                        logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                            apiName: apiName,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_2),
                        }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT });
                        deferredObject.resolve((_a = {}, _a[eventName] = false, _a));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    /**
     * Sets an attribute or multiple attributes for a user in the provided context.
     * This method validates the types of the inputs before proceeding with the API call.
     * There are two cases handled:
     * 1. When attributes are passed as a map (key-value pairs).
     * 2. When a single attribute (key-value) is passed.
     *
     * @param {string | Record<string, boolean | string | number>} attributeOrAttributes - Either a single attribute key (string) and value (boolean | string | number),
     *                                                                                        or a map of attributes with keys and values (boolean | string | number).
     * @param {boolean | string | number | Record<string, any>} [attributeValueOrContext] - The value for the attribute in case of a single attribute, or the context when multiple attributes are passed.
     * @param {Record<string, any>} [context] - The context which must include a valid user ID. This is required if multiple attributes are passed.
     */
    VWOClient.prototype.setAttribute = function (attributeOrAttributes, attributeValueOrContext, context) {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, attributes, userId, contextModel, attributeKey, attributeValue, userId, contextModel, attributeMap, err_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.SET_ATTRIBUTE;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        if (!(0, DataTypeUtil_1.isObject)(attributeOrAttributes)) return [3 /*break*/, 4];
                        // Log the API call
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        if (Object.entries(attributeOrAttributes).length < 1) {
                            throw new TypeError('TypeError: Attributes should be an object containing at least 1 key-value pair');
                        }
                        attributes = attributeOrAttributes;
                        // Validate attributes is an object
                        if (!(0, DataTypeUtil_1.isObject)(attributes)) {
                            throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
                        }
                        // Validate that each attribute value is of a supported type
                        Object.entries(attributes).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
                                throw new TypeError("Invalid attribute type for key \"".concat(key, "\". Expected boolean, string or number, but got ").concat((0, DataTypeUtil_1.getType)(value)));
                            }
                            // Reject arrays and objects explicitly
                            if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                                throw new TypeError("Invalid attribute value for key \"".concat(key, "\". Arrays and objects are not supported."));
                            }
                        });
                        // If we have only two arguments (attributeMap and context)
                        if (!context && attributeValueOrContext) {
                            context = attributeValueOrContext; // Assign context explicitly
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            logger_1.LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.SET_ATTRIBUTE }, false);
                            throw new TypeError('TypeError: Invalid context');
                        }
                        return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled)];
                    case 2:
                        userId = _b.sent();
                        context.id = userId;
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                        // Proceed with setting the attributes if validation is successful
                        return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributes, contextModel)];
                    case 3:
                        // Proceed with setting the attributes if validation is successful
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        attributeKey = attributeOrAttributes;
                        attributeValue = attributeValueOrContext;
                        // Validate attributeKey is a string
                        if (!(0, DataTypeUtil_1.isString)(attributeKey)) {
                            throw new TypeError('attributeKey should be a string');
                        }
                        // Validate attributeValue is of valid type
                        if (!(0, DataTypeUtil_1.isBoolean)(attributeValue) && !(0, DataTypeUtil_1.isString)(attributeValue) && !(0, DataTypeUtil_1.isNumber)(attributeValue)) {
                            throw new TypeError('attributeValue should be a boolean, string, or number');
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            throw new TypeError('Invalid context');
                        }
                        return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled)];
                    case 5:
                        userId = _b.sent();
                        context.id = userId;
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                        attributeMap = (_a = {}, _a[attributeKey] = attributeValue, _a);
                        // Proceed with setting the attribute map if validation is successful
                        return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributeMap, contextModel)];
                    case 6:
                        // Proceed with setting the attribute map if validation is successful
                        _b.sent();
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_3 = _b.sent();
                        logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                            apiName: apiName,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_3),
                        }, { an: ApiEnum_1.ApiEnum.SET_ATTRIBUTE });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the settings by fetching the latest settings from the VWO server.
     * @param settings - The settings to update.
     * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
     * @returns Promise<void>
     */
    VWOClient.prototype.updateSettings = function (settings_1) {
        return __awaiter(this, arguments, void 0, function (settings, isViaWebhook) {
            var apiName, settingsToUpdate, _a, err_4;
            if (isViaWebhook === void 0) { isViaWebhook = true; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.UPDATE_SETTINGS;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName: apiName }));
                        if (!(!settings || Object.keys(settings).length === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, SettingsService_1.SettingsService.Instance.fetchSettings(isViaWebhook, apiName)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = settings;
                        _b.label = 4;
                    case 4:
                        settingsToUpdate = _a;
                        // validate settings schema
                        if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(settingsToUpdate)) {
                            throw new Error('TypeError: Invalid Settings schema');
                        }
                        // set the settings on the client instance
                        (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(settingsToUpdate, this.vwoClientInstance);
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_UPDATED, { apiName: apiName, isViaWebhook: isViaWebhook }));
                        return [3 /*break*/, 6];
                    case 5:
                        err_4 = _b.sent();
                        logger_1.LogManager.Instance.errorLog('UPDATING_CLIENT_INSTANCE_FAILED_WHEN_WEBHOOK_TRIGGERED', {
                            apiName: apiName,
                            isViaWebhook: isViaWebhook,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_4),
                        }, { an: ApiEnum_1.ApiEnum.UPDATE_SETTINGS });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Flushes the events manually from the batch events queue
     */
    VWOClient.prototype.flushEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, promises, storageService, flushResult, err_5;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.FLUSH_EVENTS;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName: apiName }));
                        if (!BatchEventsQueue_1.BatchEventsQueue.Instance) {
                            logger_1.LogManager.Instance.errorLog('BATCHING_NOT_ENABLED', {}, { an: ApiEnum_1.ApiEnum.FLUSH_EVENTS });
                            return [2 /*return*/, { status: 'error', events: [] }];
                        }
                        promises = [BatchEventsQueue_1.BatchEventsQueue.Instance.flushAndClearTimer()];
                        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.edgeConfig) &&
                            Object.keys(this.options.edgeConfig).length > 0 &&
                            ((_b = this.options) === null || _b === void 0 ? void 0 : _b.accountId) &&
                            ((_c = this.options) === null || _c === void 0 ? void 0 : _c.sdkKey)) {
                            storageService = new StorageService_1.StorageService();
                            promises.push(storageService
                                .setFreshSettingsInStorage(parseInt(this.options.accountId), this.options.sdkKey)
                                .catch(function (error) {
                                logger_1.LogManager.Instance.errorLog('ERROR_STORING_SETTINGS_IN_STORAGE', { err: (0, FunctionUtil_1.getFormattedErrorMessage)(error) }, { an: ApiEnum_1.ApiEnum.FLUSH_EVENTS });
                                // by returning undefined, we are swallowing the error intentionally to avoid the promise from rejecting
                                return undefined;
                            }));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        flushResult = (_d.sent())[0];
                        return [2 /*return*/, flushResult];
                    case 3:
                        err_5 = _d.sent();
                        logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', { apiName: apiName, err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_5) }, { an: ApiEnum_1.ApiEnum.FLUSH_EVENTS });
                        return [2 /*return*/, { status: 'error', events: [] }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets alias for a given user ID
     * @param contextOrUserId - The context containing user ID or the user ID directly
     * @param aliasId - The alias identifier to set
     * @returns Promise<boolean> - Returns true if successful, false otherwise
     */
    VWOClient.prototype.setAlias = function (contextOrUserId, aliasId) {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, userId, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.SET_ALIAS;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        if (!this.isAliasingEnabled) {
                            logger_1.LogManager.Instance.errorLog('ALIAS_CALLED_BUT_NOT_PASSED', {}, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
                            return [2 /*return*/, false];
                        }
                        if (!SettingsService_1.SettingsService.Instance.isGatewayServiceProvided) {
                            logger_1.LogManager.Instance.errorLog('INVALID_GATEWAY_URL', {}, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
                            return [2 /*return*/, false];
                        }
                        if (!aliasId) {
                            throw new TypeError('TypeError: Invalid aliasId');
                        }
                        if ((0, DataTypeUtil_2.isArray)(aliasId)) {
                            throw new TypeError('TypeError: aliasId cannot be an array');
                        }
                        // trim aliasId before going forward
                        aliasId = aliasId.trim();
                        userId = void 0;
                        if (typeof contextOrUserId === 'string') {
                            // trim contextOrUserId before going forward
                            contextOrUserId = contextOrUserId.trim();
                            // Direct userId provided
                            if (contextOrUserId === aliasId) {
                                throw new TypeError('UserId and aliasId cannot be the same.');
                            }
                            if (!contextOrUserId) {
                                throw new TypeError('TypeError: Invalid userId');
                            }
                            if ((0, DataTypeUtil_2.isArray)(contextOrUserId)) {
                                throw new TypeError('TypeError: userId cannot be an array');
                            }
                            userId = contextOrUserId;
                        }
                        else {
                            // Context object provided
                            if (!contextOrUserId || !contextOrUserId.id) {
                                throw new TypeError('TypeError: Invalid context');
                            }
                            if ((0, DataTypeUtil_2.isArray)(contextOrUserId.id)) {
                                throw new TypeError('TypeError: context.id cannot be an array');
                            }
                            // trim contextOrUserId.id before going forward
                            contextOrUserId.id = contextOrUserId.id.trim();
                            if (contextOrUserId.id === aliasId) {
                                throw new TypeError('UserId and aliasId cannot be the same.');
                            }
                            userId = contextOrUserId.id;
                        }
                        return [4 /*yield*/, AliasingUtil_1.AliasingUtil.setAlias(userId, aliasId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', { apiName: apiName, err: (0, FunctionUtil_1.getFormattedErrorMessage)(error_1) }, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return VWOClient;
}());
exports.VWOClient = VWOClient;


/***/ }),

/***/ "./lib/api/GetFlag.ts":
/*!****************************!*\
  !*** ./lib/api/GetFlag.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlagApi = exports.Flag = void 0;
var StorageDecorator_1 = __webpack_require__(/*! ../decorators/StorageDecorator */ "./lib/decorators/StorageDecorator.ts");
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./lib/enums/CampaignTypeEnum.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var CampaignModel_1 = __webpack_require__(/*! ../models/campaign/CampaignModel */ "./lib/models/campaign/CampaignModel.ts");
var VariableModel_1 = __webpack_require__(/*! ../models/campaign/VariableModel */ "./lib/models/campaign/VariableModel.ts");
var VariationModel_1 = __webpack_require__(/*! ../models/campaign/VariationModel */ "./lib/models/campaign/VariationModel.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var segmentation_evaluator_1 = __webpack_require__(/*! ../packages/segmentation-evaluator */ "./lib/packages/segmentation-evaluator/index.ts");
var StorageService_1 = __webpack_require__(/*! ../services/StorageService */ "./lib/services/StorageService.ts");
var CampaignUtil_1 = __webpack_require__(/*! ../utils/CampaignUtil */ "./lib/utils/CampaignUtil.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var DecisionUtil_1 = __webpack_require__(/*! ../utils/DecisionUtil */ "./lib/utils/DecisionUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var ImpressionUtil_1 = __webpack_require__(/*! ../utils/ImpressionUtil */ "./lib/utils/ImpressionUtil.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ../utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var RuleEvaluationUtil_1 = __webpack_require__(/*! ../utils/RuleEvaluationUtil */ "./lib/utils/RuleEvaluationUtil.ts");
var NetworkUtil_1 = __webpack_require__(/*! ../utils/NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var DebuggerServiceUtil_1 = __webpack_require__(/*! ../utils/DebuggerServiceUtil */ "./lib/utils/DebuggerServiceUtil.ts");
var DebuggerCategoryEnum_1 = __webpack_require__(/*! ../enums/DebuggerCategoryEnum */ "./lib/enums/DebuggerCategoryEnum.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var Flag = /** @class */ (function () {
    function Flag(isEnabled, variation) {
        this.enabled = isEnabled;
        this.variation = variation;
    }
    Flag.prototype.isEnabled = function () {
        return this.enabled;
    };
    Flag.prototype.getVariables = function () {
        var _a;
        return ((_a = this.variation) === null || _a === void 0 ? void 0 : _a.getVariables()) || [];
    };
    Flag.prototype.getVariable = function (key, defaultValue) {
        var _a, _b;
        var value = (_b = (_a = this.variation) === null || _a === void 0 ? void 0 : _a.getVariables().find(function (variable) { return VariableModel_1.VariableModel.modelFromDictionary(variable).getKey() === key; })) === null || _b === void 0 ? void 0 : _b.getValue();
        return value !== undefined ? value : defaultValue;
    };
    return Flag;
}());
exports.Flag = Flag;
var FlagApi = /** @class */ (function () {
    function FlagApi() {
    }
    FlagApi.get = function (featureKey, settings, context, hooksService) {
        return __awaiter(this, void 0, void 0, function () {
            var isEnabled, rolloutVariationToReturn, experimentVariationToReturn, shouldCheckForExperimentsRules, passedRulesInformation, deferredObject, evaluatedFeatureMap, feature, decision, debugEventProps, storageService, storedData, variation, variation, featureInfo, rollOutRules, rolloutRulesToEvaluate, _i, rollOutRules_1, rule, _a, preSegmentationResult, updatedDecision, passedRolloutCampaign, variation, experimentRulesToEvaluate, experimentRules, megGroupWinnerCampaigns, _b, experimentRules_1, rule, _c, preSegmentationResult, whitelistedObject, updatedDecision, campaign, variation;
            var _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        isEnabled = false;
                        rolloutVariationToReturn = null;
                        experimentVariationToReturn = null;
                        shouldCheckForExperimentsRules = false;
                        passedRulesInformation = {};
                        deferredObject = new PromiseUtil_1.Deferred();
                        evaluatedFeatureMap = new Map();
                        feature = (0, FunctionUtil_1.getFeatureFromKey)(settings, featureKey);
                        decision = {
                            featureName: feature === null || feature === void 0 ? void 0 : feature.getName(),
                            featureId: feature === null || feature === void 0 ? void 0 : feature.getId(),
                            featureKey: feature === null || feature === void 0 ? void 0 : feature.getKey(),
                            userId: context === null || context === void 0 ? void 0 : context.getId(),
                            api: ApiEnum_1.ApiEnum.GET_FLAG,
                        };
                        debugEventProps = {
                            an: ApiEnum_1.ApiEnum.GET_FLAG,
                            uuid: context.getUuid(),
                            fk: feature === null || feature === void 0 ? void 0 : feature.getKey(),
                            sId: context.getSessionId(),
                        };
                        storageService = new StorageService_1.StorageService();
                        return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService)];
                    case 1:
                        storedData = _h.sent();
                        if (storedData === null || storedData === void 0 ? void 0 : storedData.experimentVariationId) {
                            if (storedData.experimentKey) {
                                variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.experimentKey, storedData.experimentVariationId);
                                if (variation) {
                                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                                        variationKey: variation.getKey(),
                                        userId: context.getId(),
                                        experimentType: 'experiment',
                                        experimentKey: storedData.experimentKey,
                                    }));
                                    deferredObject.resolve(new Flag(true, variation));
                                    return [2 /*return*/, deferredObject.promise];
                                }
                            }
                        }
                        else if ((storedData === null || storedData === void 0 ? void 0 : storedData.rolloutKey) && (storedData === null || storedData === void 0 ? void 0 : storedData.rolloutId)) {
                            variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.rolloutKey, storedData.rolloutVariationId);
                            if (variation) {
                                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                                    variationKey: variation.getKey(),
                                    userId: context.getId(),
                                    experimentType: 'rollout',
                                    experimentKey: storedData.rolloutKey,
                                }));
                                logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED, {
                                    userId: context.getId(),
                                }));
                                isEnabled = true;
                                shouldCheckForExperimentsRules = true;
                                rolloutVariationToReturn = variation;
                                featureInfo = {
                                    rolloutId: storedData.rolloutId,
                                    rolloutKey: storedData.rolloutKey,
                                    rolloutVariationId: storedData.rolloutVariationId,
                                };
                                evaluatedFeatureMap.set(featureKey, featureInfo);
                                Object.assign(passedRulesInformation, featureInfo);
                            }
                        }
                        if (!(0, DataTypeUtil_1.isObject)(feature) || feature === undefined) {
                            logger_1.LogManager.Instance.errorLog('FEATURE_NOT_FOUND', {
                                featureKey: featureKey,
                            }, debugEventProps);
                            deferredObject.reject({});
                            return [2 /*return*/, deferredObject.promise];
                        }
                        // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
                        return [4 /*yield*/, segmentation_evaluator_1.SegmentationManager.Instance.setContextualData(settings, feature, context)];
                    case 2:
                        // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
                        _h.sent();
                        rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT);
                        if (!(rollOutRules.length > 0 && !isEnabled)) return [3 /*break*/, 10];
                        rolloutRulesToEvaluate = [];
                        _i = 0, rollOutRules_1 = rollOutRules;
                        _h.label = 3;
                    case 3:
                        if (!(_i < rollOutRules_1.length)) return [3 /*break*/, 6];
                        rule = rollOutRules_1[_i];
                        return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, null, storageService, decision)];
                    case 4:
                        _a = _h.sent(), preSegmentationResult = _a.preSegmentationResult, updatedDecision = _a.updatedDecision;
                        Object.assign(decision, updatedDecision);
                        if (preSegmentationResult) {
                            // if pre segment passed, then break the loop and check the traffic allocation
                            rolloutRulesToEvaluate.push(rule);
                            evaluatedFeatureMap.set(featureKey, {
                                rolloutId: rule.getId(),
                                rolloutKey: rule.getKey(),
                                rolloutVariationId: (_d = rule.getVariations()[0]) === null || _d === void 0 ? void 0 : _d.getId(),
                            });
                            return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 5]; // if rule does not satisfy, then check for other ROLLOUT rules
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!(rolloutRulesToEvaluate.length > 0)) return [3 /*break*/, 9];
                        passedRolloutCampaign = new CampaignModel_1.CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
                        variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, passedRolloutCampaign, context.getId());
                        if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 9];
                        isEnabled = true;
                        shouldCheckForExperimentsRules = true;
                        rolloutVariationToReturn = variation;
                        _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);
                        if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, passedRolloutCampaign.getId(), variation.getId(), context, featureKey)];
                    case 7:
                        _h.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, passedRolloutCampaign.getId(), variation.getId(), context, featureKey);
                        _h.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (rollOutRules.length === 0) {
                            logger_1.LogManager.Instance.debug(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT);
                            shouldCheckForExperimentsRules = true;
                        }
                        _h.label = 11;
                    case 11:
                        if (!shouldCheckForExperimentsRules) return [3 /*break*/, 18];
                        experimentRulesToEvaluate = [];
                        experimentRules = (0, FunctionUtil_1.getAllExperimentRules)(feature);
                        megGroupWinnerCampaigns = new Map();
                        _b = 0, experimentRules_1 = experimentRules;
                        _h.label = 12;
                    case 12:
                        if (!(_b < experimentRules_1.length)) return [3 /*break*/, 15];
                        rule = experimentRules_1[_b];
                        return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision)];
                    case 13:
                        _c = _h.sent(), preSegmentationResult = _c.preSegmentationResult, whitelistedObject = _c.whitelistedObject, updatedDecision = _c.updatedDecision;
                        Object.assign(decision, updatedDecision);
                        if (preSegmentationResult) {
                            if (whitelistedObject === null) {
                                // whitelistedObject will be null if pre segment passed but whitelisting failed
                                experimentRulesToEvaluate.push(rule);
                            }
                            else {
                                isEnabled = true;
                                experimentVariationToReturn = whitelistedObject.variation;
                                Object.assign(passedRulesInformation, {
                                    experimentId: rule.getId(),
                                    experimentKey: rule.getKey(),
                                    experimentVariationId: whitelistedObject.variationId,
                                });
                            }
                            return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 14];
                    case 14:
                        _b++;
                        return [3 /*break*/, 12];
                    case 15:
                        if (!(experimentRulesToEvaluate.length > 0)) return [3 /*break*/, 18];
                        campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
                        variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, campaign, context.getId());
                        if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 18];
                        isEnabled = true;
                        experimentVariationToReturn = variation;
                        _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
                        if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 17];
                        return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), variation.getId(), context, featureKey)];
                    case 16:
                        _h.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), variation.getId(), context, featureKey);
                        _h.label = 18;
                    case 18:
                        // If flag is enabled, store it in data
                        if (isEnabled) {
                            // set storage data
                            new StorageDecorator_1.StorageDecorator().setDataInStorage(__assign({ featureKey: featureKey, context: context }, passedRulesInformation), storageService);
                        }
                        // call integration callback, if defined
                        hooksService.set(decision);
                        hooksService.execute(hooksService.get());
                        // send debug event, if debugger is enabled
                        if (feature.getIsDebuggerEnabled()) {
                            debugEventProps.cg = DebuggerCategoryEnum_1.DebuggerCategoryEnum.DECISION;
                            debugEventProps.lt = logger_1.LogLevelEnum.INFO.toString();
                            debugEventProps.msg_t = constants_1.Constants.FLAG_DECISION_GIVEN;
                            // update debug event props with decision keys
                            _updateDebugEventProps(debugEventProps, decision);
                            // send debug event
                            (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                        }
                        if (!((_e = feature.getImpactCampaign()) === null || _e === void 0 ? void 0 : _e.getCampaignId())) return [3 /*break*/, 21];
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPACT_ANALYSIS, {
                            userId: context.getId(),
                            featureKey: featureKey,
                            status: isEnabled ? 'enabled' : 'disabled',
                        }));
                        if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 20];
                        return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, (_f = feature.getImpactCampaign()) === null || _f === void 0 ? void 0 : _f.getCampaignId(), isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
                            context, featureKey)];
                    case 19:
                        _h.sent();
                        return [3 /*break*/, 21];
                    case 20:
                        (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, (_g = feature.getImpactCampaign()) === null || _g === void 0 ? void 0 : _g.getCampaignId(), isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
                        context, featureKey);
                        _h.label = 21;
                    case 21:
                        deferredObject.resolve(new Flag(isEnabled, new VariationModel_1.VariationModel().modelFromDictionary(experimentVariationToReturn !== null && experimentVariationToReturn !== void 0 ? experimentVariationToReturn : rolloutVariationToReturn)));
                        return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    return FlagApi;
}());
exports.FlagApi = FlagApi;
// Not PRIVATE methods but helper methods. If need be, move them to some util file to be reused by other API(s)
function _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision) {
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT) {
        Object.assign(passedRulesInformation, {
            rolloutId: campaign.getId(),
            rolloutKey: campaign.getKey(),
            rolloutVariationId: variation.getId(),
        });
    }
    else {
        Object.assign(passedRulesInformation, {
            experimentId: campaign.getId(),
            experimentKey: campaign.getKey(),
            experimentVariationId: variation.getId(),
        });
    }
    Object.assign(decision, passedRulesInformation);
}
/**
 * Update debug event props with decision keys
 * @param debugEventProps - Debug event props
 * @param decision - Decision
 */
function _updateDebugEventProps(debugEventProps, decision) {
    var decisionKeys = (0, DebuggerServiceUtil_1.extractDecisionKeys)(decision);
    var message = "Flag decision given for feature:".concat(decision.featureKey, ".");
    if (decision.rolloutKey && decision.rolloutVariationId) {
        message += " Got rollout:".concat(decision.rolloutKey.substring((decision.featureKey + '_').length), " with variation:").concat(decision.rolloutVariationId);
    }
    if (decision.experimentKey && decision.experimentVariationId) {
        message += " and experiment:".concat(decision.experimentKey.substring((decision.featureKey + '_').length), " with variation:").concat(decision.experimentVariationId);
    }
    debugEventProps.msg = message;
    Object.assign(debugEventProps, decisionKeys);
}


/***/ }),

/***/ "./lib/api/SetAttribute.ts":
/*!*********************************!*\
  !*** ./lib/api/SetAttribute.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetAttributeApi = void 0;
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var NetworkUtil_1 = __webpack_require__(/*! ../utils/NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var BatchEventsQueue_1 = __webpack_require__(/*! ../services/BatchEventsQueue */ "./lib/services/BatchEventsQueue.ts");
var SetAttributeApi = /** @class */ (function () {
    function SetAttributeApi() {
    }
    /**
     * Implementation of setAttributes to create an impression for multiple user attributes.
     * @param settings Configuration settings.
     * @param attributes Key-value map of attributes.
     * @param context Context containing user information.
     */
    SetAttributeApi.prototype.setAttribute = function (settings, attributes, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 2];
                        return [4 /*yield*/, createImpressionForAttributes(settings, attributes, context)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        createImpressionForAttributes(settings, attributes, context);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SetAttributeApi;
}());
exports.SetAttributeApi = SetAttributeApi;
/**
 * Creates an impression for multiple user attributes and sends it to the server.
 * @param settings Configuration settings.
 * @param attributes Key-value map of attributes.
 * @param context Context containing user information.
 */
var createImpressionForAttributes = function (settings, attributes, context) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
                payload = (0, NetworkUtil_1.getAttributePayloadData)(settings, context.getId(), EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP, attributes, context.getUserAgent(), context.getIpAddress(), context.getSessionId());
                if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
                BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
                return [3 /*break*/, 3];
            case 1: 
            // Send the constructed payload via POST request
            return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId())];
            case 2:
                // Send the constructed payload via POST request
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };


/***/ }),

/***/ "./lib/api/TrackEvent.ts":
/*!*******************************!*\
  !*** ./lib/api/TrackEvent.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TrackApi = void 0;
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
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var BatchEventsQueue_1 = __webpack_require__(/*! ../services/BatchEventsQueue */ "./lib/services/BatchEventsQueue.ts");
var NetworkUtil_1 = __webpack_require__(/*! ../utils/NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var TrackApi = /** @class */ (function () {
    function TrackApi() {
    }
    /**
     * Implementation of the track method to handle event tracking.
     * Checks if the event exists, creates an impression, and executes hooks.
     */
    TrackApi.prototype.track = function (settings, eventName, context, eventProperties, hooksService) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(0, FunctionUtil_1.doesEventBelongToAnyFeature)(eventName, settings)) return [3 /*break*/, 4];
                        if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 2];
                        return [4 /*yield*/, createImpressionForTrack(settings, eventName, context, eventProperties)];
                    case 1:
                        _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        createImpressionForTrack(settings, eventName, context, eventProperties);
                        _c.label = 3;
                    case 3:
                        // Set and execute integration callback for the track event
                        hooksService.set({ eventName: eventName, api: ApiEnum_1.ApiEnum.TRACK_EVENT });
                        hooksService.execute(hooksService.get());
                        return [2 /*return*/, (_a = {}, _a[eventName] = true, _a)];
                    case 4:
                        // Log an error if the event does not exist
                        logger_1.LogManager.Instance.errorLog('EVENT_NOT_FOUND', {
                            eventName: eventName,
                        }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT, uuid: context.getUuid(), sId: context.getSessionId() });
                        return [2 /*return*/, (_b = {}, _b[eventName] = false, _b)];
                }
            });
        });
    };
    return TrackApi;
}());
exports.TrackApi = TrackApi;
/**
 * Creates an impression for a track event and sends it via a POST API request.
 * @param settings Configuration settings for the tracking.
 * @param eventName Name of the event to track.
 * @param user User details.
 * @param eventProperties Properties associated with the event.
 */
var createImpressionForTrack = function (settings, eventName, context, eventProperties) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                properties = (0, NetworkUtil_1.getEventsBaseProperties)(eventName, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
                payload = (0, NetworkUtil_1.getTrackGoalPayloadData)(settings, context.getId(), eventName, eventProperties, context === null || context === void 0 ? void 0 : context.getUserAgent(), context === null || context === void 0 ? void 0 : context.getIpAddress(), context.getSessionId());
                if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
                BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
                return [3 /*break*/, 3];
            case 1: 
            // Send the constructed payload via POST request
            return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId(), eventProperties)];
            case 2:
                // Send the constructed payload via POST request
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };


/***/ }),

/***/ "./lib/constants/Url.ts":
/*!******************************!*\
  !*** ./lib/constants/Url.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HTTPS_PROTOCOL = exports.HTTP_PROTOCOL = exports.SEED_URL = exports.HTTPS = exports.HTTP = void 0;
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
exports.HTTP = 'http';
exports.HTTPS = 'https';
exports.SEED_URL = 'https://vwo.com';
exports.HTTP_PROTOCOL = "".concat(exports.HTTP, "://");
exports.HTTPS_PROTOCOL = "".concat(exports.HTTPS);


/***/ }),

/***/ "./lib/constants/index.ts":
/*!********************************!*\
  !*** ./lib/constants/index.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Constants = void 0;
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
var PlatformEnum_1 = __webpack_require__(/*! ../enums/PlatformEnum */ "./lib/enums/PlatformEnum.ts");
var Url_1 = __webpack_require__(/*! ./Url */ "./lib/constants/Url.ts");
var VERSION_1 = __importDefault(__webpack_require__(/*! ../../VERSION */ "./VERSION.js"));
var SDK_VERSION = VERSION_1.default.version;
var packageFile;
var platform;
// Reading package.json will bundle the whole file that's why preventing it by reading VERSION
if (true) {
    packageFile = {
        name: 'vwo-fme-javascript-sdk',
        version: SDK_VERSION,
    };
    platform = PlatformEnum_1.PlatformEnum.CLIENT;
}
else {}
exports.Constants = {
    SDK_NAME: packageFile.name,
    SDK_VERSION: packageFile.version,
    PLATFORM: platform,
    MAX_TRAFFIC_PERCENT: 100,
    MAX_TRAFFIC_VALUE: 10000,
    STATUS_RUNNING: 'RUNNING',
    SEED_VALUE: 1,
    MAX_EVENTS_PER_REQUEST: 5000,
    DEFAULT_REQUEST_TIME_INTERVAL: 600, // 10 * 60(secs) = 600 secs i.e. 10 minutes
    DEFAULT_EVENTS_PER_REQUEST: 100,
    SEED_URL: Url_1.SEED_URL,
    HTTP_PROTOCOL: Url_1.HTTP_PROTOCOL,
    HTTPS_PROTOCOL: Url_1.HTTPS_PROTOCOL,
    SETTINGS: 'settings',
    SETTINGS_EXPIRY: 10000000,
    SETTINGS_TIMEOUT: 50000,
    EVENTS_CALL_TIMEOUT: 10000, // 10 seconds
    SETTINGS_TTL: 7200000, // 2 HOURS
    ALWAYS_USE_CACHED_SETTINGS: false,
    MIN_TTL_MS: 60000, // 1 MINUTE
    HOST_NAME: 'dev.visualwebsiteoptimizer.com',
    SETTINGS_ENDPOINT: '/server-side/v2-settings',
    WEBHOOK_SETTINGS_ENDPOINT: '/server-side/v2-pull',
    LOCATION_ENDPOINT: '/getLocation',
    VWO_FS_ENVIRONMENT: 'vwo_fs_environment',
    RANDOM_ALGO: 1,
    API_VERSION: '1',
    VWO_META_MEG_KEY: '_vwo_meta_meg_',
    DEFAULT_RETRY_CONFIG: {
        shouldRetry: true,
        initialDelay: 2,
        maxRetries: 3,
        backoffMultiplier: 2,
    },
    DEFAULT_LOCAL_STORAGE_KEY: 'vwo_fme_data',
    DEFAULT_SETTINGS_STORAGE_KEY: 'vwo_fme_settings',
    POLLING_INTERVAL: 600000,
    PRODUCT_NAME: 'fme',
    // Debugger constants
    V2_SETTINGS: 'v2-settings',
    POLLING: 'polling',
    BATCH_EVENTS: 'batch-events',
    STORAGE: 'storage',
    FLAG_DECISION_GIVEN: 'FLAG_DECISION_GIVEN',
    NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES: 'NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES',
    NETWORK_CALL_SUCCESS_WITH_RETRIES: 'NETWORK_CALL_SUCCESS_WITH_RETRIES',
    IMPACT_ANALYSIS: 'IMPACT_ANALYSIS',
};


/***/ }),

/***/ "./lib/decorators/StorageDecorator.ts":
/*!********************************************!*\
  !*** ./lib/decorators/StorageDecorator.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StorageDecorator = void 0;
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
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var StorageEnum_1 = __webpack_require__(/*! ../enums/StorageEnum */ "./lib/enums/StorageEnum.ts");
var PromiseUtil_1 = __webpack_require__(/*! ../utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var StorageDecorator = /** @class */ (function () {
    function StorageDecorator() {
    }
    /**
     * Asynchronously retrieves a feature from storage based on the feature key and user.
     * @param featureKey The key of the feature to retrieve.
     * @param user The user object.
     * @param storageService The storage service instance.
     * @returns A promise that resolves to the retrieved feature or relevant status.
     */
    StorageDecorator.prototype.getFeatureFromStorage = function (featureKey, context, storageService) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject;
            return __generator(this, function (_a) {
                deferredObject = new PromiseUtil_1.Deferred();
                storageService.getDataInStorage(featureKey, context).then(function (campaignMap) {
                    switch (campaignMap) {
                        case StorageEnum_1.StorageEnum.STORAGE_UNDEFINED:
                            deferredObject.resolve(null); // No storage defined
                            break;
                        case StorageEnum_1.StorageEnum.NO_DATA_FOUND:
                            deferredObject.resolve(null); // No data found in storage
                            break;
                        case StorageEnum_1.StorageEnum.INCORRECT_DATA:
                            deferredObject.resolve(StorageEnum_1.StorageEnum.INCORRECT_DATA); // Incorrect data found
                            break;
                        case StorageEnum_1.StorageEnum.CAMPAIGN_PAUSED:
                            deferredObject.resolve(null); // Campaign is paused
                            break;
                        case StorageEnum_1.StorageEnum.VARIATION_NOT_FOUND:
                            deferredObject.resolve(StorageEnum_1.StorageEnum.VARIATION_NOT_FOUND); // No variation found
                            break;
                        case StorageEnum_1.StorageEnum.WHITELISTED_VARIATION:
                            deferredObject.resolve(null); // Whitelisted variation, handle accordingly
                            break;
                        default:
                            deferredObject.resolve(campaignMap); // Valid data found, resolve with it
                    }
                });
                return [2 /*return*/, deferredObject.promise];
            });
        });
    };
    /**
     * Sets data in storage based on the provided data object.
     * @param data The data to be stored, including feature key and user details.
     * @param storageService The storage service instance.
     * @returns A promise that resolves when the data is successfully stored.
     */
    StorageDecorator.prototype.setDataInStorage = function (data, storageService) {
        var deferredObject = new PromiseUtil_1.Deferred();
        var featureKey = data.featureKey, context = data.context, rolloutId = data.rolloutId, rolloutKey = data.rolloutKey, rolloutVariationId = data.rolloutVariationId, experimentId = data.experimentId, experimentKey = data.experimentKey, experimentVariationId = data.experimentVariationId;
        if (!featureKey) {
            logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_STORAGE', {
                key: 'featureKey',
            }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context._vwo_uuid, sId: context._vwo_sessionId });
            deferredObject.reject(); // Reject promise if feature key is invalid
            return;
        }
        if (!context.id) {
            logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_STORAGE', {
                key: 'Context or Context.id',
            }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context._vwo_uuid, sId: context._vwo_sessionId });
            deferredObject.reject(); // Reject promise if user ID is invalid
            return;
        }
        if (rolloutKey && !experimentKey && !rolloutVariationId) {
            logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_STORAGE', {
                key: 'Variation:(rolloutKey, experimentKey or rolloutVariationId)',
            }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context._vwo_uuid, sId: context._vwo_sessionId });
            deferredObject.reject(); // Reject promise if rollout variation is invalid
            return;
        }
        if (experimentKey && !experimentVariationId) {
            logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_STORAGE', {
                key: 'Variation:(experimentKey or rolloutVariationId)',
            }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context._vwo_uuid, sId: context._vwo_sessionId });
            deferredObject.reject(); // Reject promise if experiment variation is invalid
            return;
        }
        storageService.setDataInStorage({
            featureKey: featureKey,
            userId: context.id,
            rolloutId: rolloutId,
            rolloutKey: rolloutKey,
            rolloutVariationId: rolloutVariationId,
            experimentId: experimentId,
            experimentKey: experimentKey,
            experimentVariationId: experimentVariationId,
        });
        deferredObject.resolve(); // Resolve promise when data is successfully set
        return deferredObject.promise;
    };
    return StorageDecorator;
}());
exports.StorageDecorator = StorageDecorator;


/***/ }),

/***/ "./lib/enums/ApiEnum.ts":
/*!******************************!*\
  !*** ./lib/enums/ApiEnum.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiEnum = void 0;
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
var ApiEnum;
(function (ApiEnum) {
    ApiEnum["INIT"] = "init";
    ApiEnum["ON_INIT"] = "onInit";
    ApiEnum["GET_FLAG"] = "getFlag";
    ApiEnum["TRACK_EVENT"] = "trackEvent";
    ApiEnum["SET_ATTRIBUTE"] = "setAttribute";
    ApiEnum["FLUSH_EVENTS"] = "flushEvents";
    ApiEnum["UPDATE_SETTINGS"] = "updateSettings";
    ApiEnum["SET_ALIAS"] = "setAlias";
})(ApiEnum || (exports.ApiEnum = ApiEnum = {}));


/***/ }),

/***/ "./lib/enums/CampaignTypeEnum.ts":
/*!***************************************!*\
  !*** ./lib/enums/CampaignTypeEnum.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignTypeEnum = void 0;
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
var CampaignTypeEnum;
(function (CampaignTypeEnum) {
    CampaignTypeEnum["ROLLOUT"] = "FLAG_ROLLOUT";
    CampaignTypeEnum["AB"] = "FLAG_TESTING";
    CampaignTypeEnum["PERSONALIZE"] = "FLAG_PERSONALIZE";
})(CampaignTypeEnum || (exports.CampaignTypeEnum = CampaignTypeEnum = {}));


/***/ }),

/***/ "./lib/enums/DebuggerCategoryEnum.ts":
/*!*******************************************!*\
  !*** ./lib/enums/DebuggerCategoryEnum.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebuggerCategoryEnum = void 0;
var DebuggerCategoryEnum;
(function (DebuggerCategoryEnum) {
    DebuggerCategoryEnum["NETWORK"] = "network";
    DebuggerCategoryEnum["DECISION"] = "decision";
    DebuggerCategoryEnum["INITIALIZATION"] = "initialization";
    DebuggerCategoryEnum["RETRY"] = "retry";
    DebuggerCategoryEnum["ERROR"] = "error";
})(DebuggerCategoryEnum || (exports.DebuggerCategoryEnum = DebuggerCategoryEnum = {}));


/***/ }),

/***/ "./lib/enums/EventEnum.ts":
/*!********************************!*\
  !*** ./lib/enums/EventEnum.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventEnum = void 0;
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
var EventEnum;
(function (EventEnum) {
    EventEnum["VWO_VARIATION_SHOWN"] = "vwo_variationShown";
    EventEnum["VWO_SYNC_VISITOR_PROP"] = "vwo_syncVisitorProp";
    EventEnum["VWO_LOG_EVENT"] = "vwo_log";
    EventEnum["VWO_INIT_CALLED"] = "vwo_fmeSdkInit";
    EventEnum["VWO_USAGE_STATS"] = "vwo_sdkUsageStats";
    EventEnum["VWO_DEBUGGER_EVENT"] = "vwo_sdkDebug";
})(EventEnum || (exports.EventEnum = EventEnum = {}));


/***/ }),

/***/ "./lib/enums/HeadersEnum.ts":
/*!**********************************!*\
  !*** ./lib/enums/HeadersEnum.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HeadersEnum = void 0;
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
var HeadersEnum;
(function (HeadersEnum) {
    HeadersEnum["USER_AGENT"] = "X-Device-User-Agent";
    HeadersEnum["IP"] = "VWO-X-Forwarded-For";
})(HeadersEnum || (exports.HeadersEnum = HeadersEnum = {}));


/***/ }),

/***/ "./lib/enums/HttpMethodEnum.ts":
/*!*************************************!*\
  !*** ./lib/enums/HttpMethodEnum.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpMethodEnum = void 0;
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
var HttpMethodEnum;
(function (HttpMethodEnum) {
    HttpMethodEnum["GET"] = "GET";
    HttpMethodEnum["POST"] = "POST";
})(HttpMethodEnum || (exports.HttpMethodEnum = HttpMethodEnum = {}));


/***/ }),

/***/ "./lib/enums/PlatformEnum.ts":
/*!***********************************!*\
  !*** ./lib/enums/PlatformEnum.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlatformEnum = void 0;
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
var PlatformEnum;
(function (PlatformEnum) {
    PlatformEnum["CLIENT"] = "client";
    PlatformEnum["SERVER"] = "server";
})(PlatformEnum || (exports.PlatformEnum = PlatformEnum = {}));


/***/ }),

/***/ "./lib/enums/StatusEnum.ts":
/*!*********************************!*\
  !*** ./lib/enums/StatusEnum.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatusEnum = void 0;
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
var StatusEnum;
(function (StatusEnum) {
    StatusEnum["PASSED"] = "passed";
    StatusEnum["FAILED"] = "failed";
})(StatusEnum || (exports.StatusEnum = StatusEnum = {}));


/***/ }),

/***/ "./lib/enums/StorageEnum.ts":
/*!**********************************!*\
  !*** ./lib/enums/StorageEnum.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StorageEnum = void 0;
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
var StorageEnum;
(function (StorageEnum) {
    StorageEnum[StorageEnum["STORAGE_UNDEFINED"] = 0] = "STORAGE_UNDEFINED";
    StorageEnum[StorageEnum["INCORRECT_DATA"] = 1] = "INCORRECT_DATA";
    StorageEnum[StorageEnum["NO_DATA_FOUND"] = 2] = "NO_DATA_FOUND";
    StorageEnum[StorageEnum["CAMPAIGN_PAUSED"] = 3] = "CAMPAIGN_PAUSED";
    StorageEnum[StorageEnum["VARIATION_NOT_FOUND"] = 4] = "VARIATION_NOT_FOUND";
    StorageEnum[StorageEnum["WHITELISTED_VARIATION"] = 5] = "WHITELISTED_VARIATION";
})(StorageEnum || (exports.StorageEnum = StorageEnum = {}));


/***/ }),

/***/ "./lib/enums/UrlEnum.ts":
/*!******************************!*\
  !*** ./lib/enums/UrlEnum.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UrlEnum = void 0;
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
var UrlEnum;
(function (UrlEnum) {
    UrlEnum["EVENTS"] = "/events/t";
    UrlEnum["ATTRIBUTE_CHECK"] = "/check-attribute";
    UrlEnum["GET_USER_DATA"] = "/get-user-details";
    UrlEnum["BATCH_EVENTS"] = "/server-side/batch-events-v2";
    UrlEnum["SET_ALIAS"] = "/user-alias/setUserAlias";
    UrlEnum["GET_ALIAS"] = "/user-alias/getAliasUserId";
})(UrlEnum || (exports.UrlEnum = UrlEnum = {}));


/***/ }),

/***/ "./lib/enums/log-messages/index.ts":
/*!*****************************************!*\
  !*** ./lib/enums/log-messages/index.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorLogMessagesEnum = exports.InfoLogMessagesEnum = exports.DebugLogMessagesEnum = void 0;
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
var vwo_fme_sdk_log_messages_1 = __importDefault(__webpack_require__(/*! vwo-fme-sdk-log-messages */ "./node_modules/vwo-fme-sdk-log-messages/index.js"));
var resolvedMessages = vwo_fme_sdk_log_messages_1.default.default || vwo_fme_sdk_log_messages_1.default;
var DebugLogMessagesEnum = resolvedMessages.debugMessages;
exports.DebugLogMessagesEnum = DebugLogMessagesEnum;
var InfoLogMessagesEnum = resolvedMessages.infoMessages;
exports.InfoLogMessagesEnum = InfoLogMessagesEnum;
var ErrorLogMessagesEnum = resolvedMessages.errorMessagesV2;
exports.ErrorLogMessagesEnum = ErrorLogMessagesEnum;


/***/ }),

/***/ "./lib/models/campaign/CampaignModel.ts":
/*!**********************************************!*\
  !*** ./lib/models/campaign/CampaignModel.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignModel = void 0;
var MetricModel_1 = __webpack_require__(/*! ./MetricModel */ "./lib/models/campaign/MetricModel.ts");
var VariableModel_1 = __webpack_require__(/*! ./VariableModel */ "./lib/models/campaign/VariableModel.ts");
var VariationModel_1 = __webpack_require__(/*! ./VariationModel */ "./lib/models/campaign/VariationModel.ts");
var CampaignModel = /** @class */ (function () {
    function CampaignModel() {
        this.variations = [];
        this.metrics = [];
        this.variables = [];
    }
    CampaignModel.prototype.copy = function (campaignModel) {
        this.metrics = campaignModel.metrics;
        this.variations = campaignModel.variations;
        this.variables = campaignModel.variables;
        this.processCampaignKeys(campaignModel);
    };
    CampaignModel.prototype.modelFromDictionary = function (campaign) {
        this.processCampaignProperties(campaign);
        this.processCampaignKeys(campaign);
        return this;
    };
    CampaignModel.prototype.processCampaignProperties = function (campaign) {
        var _this = this;
        if (campaign.variables) {
            // campaign.var ||
            if (
            // (campaign.var && campaign.var.constructor === {}.constructor) ||
            campaign.variables.constructor === {}.constructor) {
                this.variables = [];
            }
            else {
                var variableList = campaign.variables; // campaign.var ||
                variableList.forEach(function (variable) {
                    _this.variables.push(VariableModel_1.VariableModel.modelFromDictionary(variable));
                });
            }
        }
        if (campaign.variations) {
            // campaign.v ||
            if (
            // (campaign.v && campaign.v.constructor === {}.constructor) ||
            campaign.variations.constructor === {}.constructor) {
                this.variations = [];
            }
            else {
                var variationList = campaign.variations; // campaign.v ||
                variationList.forEach(function (variation) {
                    _this.variations.push(new VariationModel_1.VariationModel().modelFromDictionary(variation));
                });
            }
        }
        if (campaign.metrics) {
            // campaign.m ||
            if (campaign.metrics && campaign.metrics.constructor === {}.constructor) {
                this.metrics = [];
            }
            else {
                var metricsList = campaign.metrics || [];
                metricsList.forEach(function (metric) {
                    _this.metrics.push(new MetricModel_1.MetricModel().modelFromDictionary(metric));
                });
            }
        }
    };
    CampaignModel.prototype.processCampaignKeys = function (campaign) {
        this.id = campaign.id;
        this.percentTraffic = campaign.percentTraffic; // campaign.pT ||
        this.name = campaign.name; // campaign.n ||
        this.variationId = campaign.variationId; // campaign.vId ||
        this.campaignId = campaign.campaignId; // campaign.cId ||
        this.ruleKey = campaign.ruleKey; // campaign.rK ||
        this.isForcedVariationEnabled = campaign.isForcedVariationEnabled; // campaign.iFVE ||
        this.isUserListEnabled = campaign.isUserListEnabled; // campaign.iULE ||
        this.segments = campaign.segments;
        this.key = campaign.key; // campaign.k ||
        // this.priority = campaign.pr || campaign.priority;
        this.type = campaign.type; // campaign.t ||
        this.salt = campaign.salt;
    };
    CampaignModel.prototype.getId = function () {
        return this.id;
    };
    CampaignModel.prototype.getName = function () {
        return this.name;
    };
    CampaignModel.prototype.getSegments = function () {
        return this.segments;
    };
    CampaignModel.prototype.getTraffic = function () {
        return this.percentTraffic;
    };
    CampaignModel.prototype.getType = function () {
        return this.type;
    };
    CampaignModel.prototype.getIsForcedVariationEnabled = function () {
        return this.isForcedVariationEnabled;
    };
    CampaignModel.prototype.getIsUserListEnabled = function () {
        return this.isUserListEnabled;
    };
    CampaignModel.prototype.getKey = function () {
        return this.key;
    };
    CampaignModel.prototype.getMetrics = function () {
        return this.metrics;
    };
    CampaignModel.prototype.getVariations = function () {
        return this.variations;
    };
    CampaignModel.prototype.getVariables = function () {
        return this.variables;
    };
    CampaignModel.prototype.getRuleKey = function () {
        return this.ruleKey;
    };
    CampaignModel.prototype.getSalt = function () {
        return this.salt;
    };
    return CampaignModel;
}());
exports.CampaignModel = CampaignModel;


/***/ }),

/***/ "./lib/models/campaign/FeatureModel.ts":
/*!*********************************************!*\
  !*** ./lib/models/campaign/FeatureModel.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeatureModel = void 0;
var ImpactCampaignModel_1 = __webpack_require__(/*! ./ImpactCampaignModel */ "./lib/models/campaign/ImpactCampaignModel.ts");
var MetricModel_1 = __webpack_require__(/*! ./MetricModel */ "./lib/models/campaign/MetricModel.ts");
var RuleModel_1 = __webpack_require__(/*! ./RuleModel */ "./lib/models/campaign/RuleModel.ts");
var FeatureModel = /** @class */ (function () {
    function FeatureModel() {
        this.m = [];
        this.metrics = [];
        this.rules = [];
        this.impactCampaign = null;
        this.isDebuggerEnabled = false;
        this.rulesLinkedCampaign = [];
        this.isGatewayServiceRequired = false;
    }
    FeatureModel.prototype.modelFromDictionary = function (feature) {
        var _this = this;
        var _a, _b, _c;
        this.id = feature.id;
        this.key = feature.key;
        this.name = feature.name;
        this.type = feature.type;
        if (feature === null || feature === void 0 ? void 0 : feature.isDebuggerEnabled) {
            this.isDebuggerEnabled = feature.isDebuggerEnabled;
        }
        if (feature === null || feature === void 0 ? void 0 : feature.isGatewayServiceRequired) {
            this.isGatewayServiceRequired = feature.isGatewayServiceRequired;
        }
        if (feature.impactCampaign) {
            this.impactCampaign = new ImpactCampaignModel_1.ImpactCapmaignModel().modelFromDictionary(feature.impactCampaign);
        }
        if ((feature.m && feature.m.constructor === {}.constructor) || ((_a = feature.metrics) === null || _a === void 0 ? void 0 : _a.constructor) === {}.constructor) {
            this.metrics = [];
        }
        else {
            var metricList = feature.m || feature.metrics;
            metricList === null || metricList === void 0 ? void 0 : metricList.forEach(function (metric) {
                _this.metrics.push(new MetricModel_1.MetricModel().modelFromDictionary(metric));
            });
        }
        if (((_b = feature === null || feature === void 0 ? void 0 : feature.rules) === null || _b === void 0 ? void 0 : _b.constructor) === {}.constructor) {
            this.rules = [];
        }
        else {
            var ruleList = feature.rules;
            ruleList === null || ruleList === void 0 ? void 0 : ruleList.forEach(function (rule) {
                _this.rules.push(new RuleModel_1.RuleModel().modelFromDictionary(rule));
            });
        }
        if ((feature === null || feature === void 0 ? void 0 : feature.rulesLinkedCampaign) && ((_c = feature.rulesLinkedCampaign) === null || _c === void 0 ? void 0 : _c.constructor) !== {}.constructor) {
            var linkedCampaignList = feature.rulesLinkedCampaign;
            this.rulesLinkedCampaign = linkedCampaignList;
        }
        return this;
    };
    FeatureModel.prototype.getName = function () {
        return this.name;
    };
    FeatureModel.prototype.getType = function () {
        return this.type;
    };
    FeatureModel.prototype.getId = function () {
        return this.id;
    };
    FeatureModel.prototype.getKey = function () {
        return this.key;
    };
    FeatureModel.prototype.getRules = function () {
        return this.rules;
    };
    FeatureModel.prototype.getImpactCampaign = function () {
        return this.impactCampaign;
    };
    FeatureModel.prototype.getRulesLinkedCampaign = function () {
        return this.rulesLinkedCampaign;
    };
    FeatureModel.prototype.setRulesLinkedCampaign = function (rulesLinkedCampaign) {
        this.rulesLinkedCampaign = rulesLinkedCampaign;
    };
    FeatureModel.prototype.getMetrics = function () {
        return this.metrics;
    };
    FeatureModel.prototype.getIsGatewayServiceRequired = function () {
        return this.isGatewayServiceRequired;
    };
    FeatureModel.prototype.setIsGatewayServiceRequired = function (isGatewayServiceRequired) {
        this.isGatewayServiceRequired = isGatewayServiceRequired;
    };
    FeatureModel.prototype.getIsDebuggerEnabled = function () {
        return this.isDebuggerEnabled;
    };
    return FeatureModel;
}());
exports.FeatureModel = FeatureModel;


/***/ }),

/***/ "./lib/models/campaign/ImpactCampaignModel.ts":
/*!****************************************************!*\
  !*** ./lib/models/campaign/ImpactCampaignModel.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImpactCapmaignModel = void 0;
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
var ImpactCapmaignModel = /** @class */ (function () {
    function ImpactCapmaignModel() {
    }
    ImpactCapmaignModel.prototype.modelFromDictionary = function (impactCampaign) {
        this.type = impactCampaign.type;
        this.campaignId = impactCampaign.campaignId;
        return this;
    };
    ImpactCapmaignModel.prototype.getCampaignId = function () {
        return this.campaignId;
    };
    ImpactCapmaignModel.prototype.getType = function () {
        return this.type;
    };
    return ImpactCapmaignModel;
}());
exports.ImpactCapmaignModel = ImpactCapmaignModel;


/***/ }),

/***/ "./lib/models/campaign/MetricModel.ts":
/*!********************************************!*\
  !*** ./lib/models/campaign/MetricModel.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MetricModel = void 0;
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
var MetricModel = /** @class */ (function () {
    function MetricModel() {
    }
    MetricModel.prototype.modelFromDictionary = function (metric) {
        this.identifier = metric.identifier || metric.key;
        this.id = metric.i || metric.id;
        this.type = metric.t || metric.type;
        return this;
    };
    MetricModel.prototype.getId = function () {
        return this.id;
    };
    MetricModel.prototype.getIdentifier = function () {
        return this.identifier;
    };
    MetricModel.prototype.getType = function () {
        return this.type;
    };
    return MetricModel;
}());
exports.MetricModel = MetricModel;


/***/ }),

/***/ "./lib/models/campaign/RuleModel.ts":
/*!******************************************!*\
  !*** ./lib/models/campaign/RuleModel.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuleModel = void 0;
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
var RuleModel = /** @class */ (function () {
    function RuleModel() {
    }
    RuleModel.prototype.modelFromDictionary = function (rule) {
        this.type = rule.type;
        this.status = rule.status;
        this.variationId = rule.variationId;
        this.campaignId = rule.campaignId;
        this.ruleKey = rule.ruleKey;
        return this;
    };
    RuleModel.prototype.getCampaignId = function () {
        return this.campaignId;
    };
    RuleModel.prototype.getVariationId = function () {
        return this.variationId;
    };
    RuleModel.prototype.getStatus = function () {
        return this.status;
    };
    RuleModel.prototype.getType = function () {
        return this.type;
    };
    RuleModel.prototype.getRuleKey = function () {
        return this.ruleKey;
    };
    return RuleModel;
}());
exports.RuleModel = RuleModel;


/***/ }),

/***/ "./lib/models/campaign/VariableModel.ts":
/*!**********************************************!*\
  !*** ./lib/models/campaign/VariableModel.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VariableModel = void 0;
var VariableModel = /** @class */ (function () {
    function VariableModel(id, type, key, value) {
        this.value = value;
        this.type = type;
        this.key = key;
        this.id = id;
    }
    VariableModel.modelFromDictionary = function (variable) {
        var _a, _b, _c;
        return new VariableModel((_a = variable.i) !== null && _a !== void 0 ? _a : variable.id, variable.type, (_b = variable.k) !== null && _b !== void 0 ? _b : variable.key, (_c = variable.val) !== null && _c !== void 0 ? _c : variable.value);
    };
    VariableModel.prototype.setValue = function (value) {
        this.value = value;
    };
    VariableModel.prototype.setKey = function (key) {
        this.key = key;
    };
    VariableModel.prototype.setType = function (type) {
        this.type = type;
    };
    VariableModel.prototype.getId = function () {
        return this.id;
    };
    VariableModel.prototype.getValue = function () {
        return this.value;
    };
    VariableModel.prototype.getType = function () {
        return this.type;
    };
    VariableModel.prototype.getKey = function () {
        return this.key;
    };
    return VariableModel;
}());
exports.VariableModel = VariableModel;


/***/ }),

/***/ "./lib/models/campaign/VariationModel.ts":
/*!***********************************************!*\
  !*** ./lib/models/campaign/VariationModel.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VariationModel = void 0;
var VariableModel_1 = __webpack_require__(/*! ./VariableModel */ "./lib/models/campaign/VariableModel.ts");
var VariationModel = /** @class */ (function () {
    function VariationModel() {
        this.variables = [];
        this.variations = [];
    }
    VariationModel.prototype.modelFromDictionary = function (variation) {
        var _this = this;
        this.id = variation.i || variation.id;
        this.key = variation.n || variation.key || variation.name;
        this.weight = variation.w || variation.weight;
        this.ruleKey = variation.ruleKey;
        this.salt = variation.salt;
        this.type = variation.type;
        this.setStartRange(variation.startRangeVariation);
        this.setEndRange(variation.endRangeVariation);
        if (variation.seg || variation.segments) {
            this.segments = variation.seg || variation.segments;
        }
        if (variation.variables) {
            if (variation.variables.constructor === {}.constructor) {
                this.variables = [];
            }
            else {
                var variableList = variation.variables;
                variableList.forEach(function (variable) {
                    _this.variables.push(VariableModel_1.VariableModel.modelFromDictionary(variable));
                });
            }
        }
        if (variation.variations) {
            if (variation.variations.constructor === {}.constructor) {
                this.variations = [];
            }
            else {
                var variationList = variation.variations;
                variationList.forEach(function (variation) {
                    _this.variations.push(new VariationModel().modelFromDictionary(variation));
                });
            }
        }
        return this;
    };
    VariationModel.prototype.setStartRange = function (startRange) {
        this.startRangeVariation = startRange;
    };
    VariationModel.prototype.setEndRange = function (endRange) {
        this.endRangeVariation = endRange;
    };
    VariationModel.prototype.setWeight = function (weight) {
        this.weight = weight;
    };
    VariationModel.prototype.getId = function () {
        return this.id;
    };
    VariationModel.prototype.getKey = function () {
        return this.key;
    };
    VariationModel.prototype.getRuleKey = function () {
        return this.ruleKey;
    };
    VariationModel.prototype.getWeight = function () {
        return this.weight;
    };
    VariationModel.prototype.getSegments = function () {
        return this.segments;
    };
    VariationModel.prototype.getStartRangeVariation = function () {
        return this.startRangeVariation;
    };
    VariationModel.prototype.getEndRangeVariation = function () {
        return this.endRangeVariation;
    };
    VariationModel.prototype.getVariables = function () {
        return this.variables;
    };
    VariationModel.prototype.getVariations = function () {
        return this.variations;
    };
    VariationModel.prototype.getType = function () {
        return this.type;
    };
    VariationModel.prototype.getSalt = function () {
        return this.salt;
    };
    return VariationModel;
}());
exports.VariationModel = VariationModel;


/***/ }),

/***/ "./lib/models/edge/EdgeConfigModel.ts":
/*!********************************************!*\
  !*** ./lib/models/edge/EdgeConfigModel.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EdgeConfigModel = void 0;
var constants_1 = __webpack_require__(/*! ../../constants */ "./lib/constants/index.ts");
/**
 * Model for the edge config.
 */
var EdgeConfigModel = /** @class */ (function () {
    function EdgeConfigModel() {
        this.shouldWaitForTrackingCalls = true;
    }
    /**
     * Models the edge config from a dictionary.
     * @param edgeConfigModel - The edge config dictionary.
     * @returns {this} - The edge config model.
     */
    EdgeConfigModel.prototype.modelFromDictionary = function (edgeConfigModel) {
        if (edgeConfigModel.shouldWaitForTrackingCalls) {
            this.shouldWaitForTrackingCalls = edgeConfigModel.shouldWaitForTrackingCalls;
        }
        if (edgeConfigModel.maxEventsToBatch) {
            this.maxEventsToBatch = edgeConfigModel.maxEventsToBatch;
        }
        else {
            this.maxEventsToBatch = constants_1.Constants.MAX_EVENTS_PER_REQUEST;
        }
        return this;
    };
    /**
     * Checks if the SDK should wait for a network response.
     * @returns {boolean} - True if the SDK should wait for a network response, false otherwise.
     */
    EdgeConfigModel.prototype.getShouldWaitForTrackingCalls = function () {
        return this.shouldWaitForTrackingCalls;
    };
    /**
     * Gets the maximum number of events to batch.
     * @returns {number} - The maximum number of events to batch.
     */
    EdgeConfigModel.prototype.getMaxEventsToBatch = function () {
        return this.maxEventsToBatch;
    };
    return EdgeConfigModel;
}());
exports.EdgeConfigModel = EdgeConfigModel;


/***/ }),

/***/ "./lib/models/schemas/SettingsSchemaValidation.ts":
/*!********************************************************!*\
  !*** ./lib/models/schemas/SettingsSchemaValidation.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsSchema = void 0;
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
var superstruct_1 = __webpack_require__(/*! superstruct */ "./node_modules/superstruct/lib/index.cjs");
var SettingsSchema = /** @class */ (function () {
    function SettingsSchema() {
        this.initializeSchemas();
    }
    SettingsSchema.prototype.initializeSchemas = function () {
        this.campaignMetricSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            type: (0, superstruct_1.string)(),
            identifier: (0, superstruct_1.string)(),
            mca: (0, superstruct_1.optional)((0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()])),
            hasProps: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
            revenueProp: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        });
        this.variableObjectSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            type: (0, superstruct_1.string)(),
            key: (0, superstruct_1.string)(),
            value: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)(), (0, superstruct_1.boolean)(), (0, superstruct_1.object)()]),
        });
        this.campaignVariationSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            name: (0, superstruct_1.string)(),
            weight: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            segments: (0, superstruct_1.optional)((0, superstruct_1.object)()),
            variables: (0, superstruct_1.optional)((0, superstruct_1.array)(this.variableObjectSchema)),
            startRangeVariation: (0, superstruct_1.optional)((0, superstruct_1.number)()),
            endRangeVariation: (0, superstruct_1.optional)((0, superstruct_1.number)()),
            salt: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        });
        this.campaignObjectSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            type: (0, superstruct_1.string)(),
            key: (0, superstruct_1.string)(),
            percentTraffic: (0, superstruct_1.optional)((0, superstruct_1.number)()),
            status: (0, superstruct_1.string)(),
            variations: (0, superstruct_1.array)(this.campaignVariationSchema),
            segments: (0, superstruct_1.object)(),
            isForcedVariationEnabled: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
            isAlwaysCheckSegment: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
            name: (0, superstruct_1.string)(),
            salt: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        });
        this.ruleSchema = (0, superstruct_1.type)({
            type: (0, superstruct_1.string)(),
            ruleKey: (0, superstruct_1.string)(),
            campaignId: (0, superstruct_1.number)(),
            variationId: (0, superstruct_1.optional)((0, superstruct_1.number)()),
        });
        this.featureSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            key: (0, superstruct_1.string)(),
            status: (0, superstruct_1.string)(),
            name: (0, superstruct_1.string)(),
            type: (0, superstruct_1.string)(),
            metrics: (0, superstruct_1.array)(this.campaignMetricSchema),
            impactCampaign: (0, superstruct_1.optional)((0, superstruct_1.object)()),
            rules: (0, superstruct_1.optional)((0, superstruct_1.array)(this.ruleSchema)),
            variables: (0, superstruct_1.optional)((0, superstruct_1.array)(this.variableObjectSchema)),
        });
        this.settingsSchema = (0, superstruct_1.type)({
            sdkKey: (0, superstruct_1.optional)((0, superstruct_1.string)()),
            version: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            accountId: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            usageStatsAccountId: (0, superstruct_1.optional)((0, superstruct_1.number)()),
            features: (0, superstruct_1.optional)((0, superstruct_1.array)(this.featureSchema)),
            campaigns: (0, superstruct_1.array)(this.campaignObjectSchema),
            groups: (0, superstruct_1.optional)((0, superstruct_1.object)()),
            campaignGroups: (0, superstruct_1.optional)((0, superstruct_1.object)()),
            collectionPrefix: (0, superstruct_1.optional)((0, superstruct_1.string)()),
            sdkMetaInfo: (0, superstruct_1.optional)((0, superstruct_1.object)({ wasInitializedEarlier: (0, superstruct_1.optional)((0, superstruct_1.boolean)()) })),
            pollInterval: (0, superstruct_1.optional)((0, superstruct_1.number)()),
        });
    };
    SettingsSchema.prototype.isSettingsValid = function (settings) {
        if (!settings) {
            return false;
        }
        var error = (0, superstruct_1.validate)(settings, this.settingsSchema)[0];
        return !error;
    };
    return SettingsSchema;
}());
exports.SettingsSchema = SettingsSchema;


/***/ }),

/***/ "./lib/models/settings/SettingsModel.ts":
/*!**********************************************!*\
  !*** ./lib/models/settings/SettingsModel.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsModel = void 0;
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
var CampaignModel_1 = __webpack_require__(/*! ../campaign/CampaignModel */ "./lib/models/campaign/CampaignModel.ts");
var FeatureModel_1 = __webpack_require__(/*! ../campaign/FeatureModel */ "./lib/models/campaign/FeatureModel.ts");
var SettingsModel = /** @class */ (function () {
    function SettingsModel(settings) {
        var _this = this;
        this.f = [];
        this.features = [];
        this.c = [];
        this.campaigns = [];
        this.campaignGroups = {};
        this.cG = {};
        this.groups = {};
        this.g = {};
        this.sdkKey = settings.sK || settings.sdkKey;
        this.accountId = settings.a || settings.accountId;
        this.version = settings.v || settings.version;
        this.collectionPrefix = settings.collectionPrefix;
        this.usageStatsAccountId = settings.usageStatsAccountId;
        if ((settings.f && settings.f.constructor !== {}.constructor) ||
            (settings.features && settings.features.constructor !== {}.constructor)) {
            var featureList = settings.f || settings.features;
            featureList.forEach(function (feature) {
                _this.features.push(new FeatureModel_1.FeatureModel().modelFromDictionary(feature));
            });
        }
        if ((settings.c && settings.c.constructor !== {}.constructor) ||
            (settings.campaigns && settings.campaigns.constructor !== {}.constructor)) {
            var campaignList = settings.c || settings.campaigns;
            campaignList.forEach(function (campaign) {
                _this.campaigns.push(new CampaignModel_1.CampaignModel().modelFromDictionary(campaign));
            });
        }
        if (settings.cG || settings.campaignGroups) {
            this.campaignGroups = settings.cG || settings.campaignGroups;
        }
        if (settings.g || settings.groups) {
            this.groups = settings.g || settings.groups;
        }
        if (settings.pollInterval) {
            this.pollInterval = settings.pollInterval;
        }
        return this;
    }
    SettingsModel.prototype.getFeatures = function () {
        return this.features;
    };
    SettingsModel.prototype.getCampaigns = function () {
        return this.campaigns;
    };
    SettingsModel.prototype.getSdkkey = function () {
        return this.sdkKey;
    };
    SettingsModel.prototype.getAccountId = function () {
        return this.accountId;
    };
    SettingsModel.prototype.getVersion = function () {
        return this.version;
    };
    SettingsModel.prototype.getCollectionPrefix = function () {
        return this.collectionPrefix;
    };
    SettingsModel.prototype.getCampaignGroups = function () {
        return this.campaignGroups;
    };
    SettingsModel.prototype.getGroups = function () {
        return this.groups;
    };
    SettingsModel.prototype.setPollInterval = function (value) {
        this.pollInterval = value;
    };
    SettingsModel.prototype.getPollInterval = function () {
        return this.pollInterval;
    };
    SettingsModel.prototype.getUsageStatsAccountId = function () {
        return this.usageStatsAccountId;
    };
    return SettingsModel;
}());
exports.SettingsModel = SettingsModel;


/***/ }),

/***/ "./lib/models/user/ContextModel.ts":
/*!*****************************************!*\
  !*** ./lib/models/user/ContextModel.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContextModel = void 0;
var ContextVWOModel_1 = __webpack_require__(/*! ./ContextVWOModel */ "./lib/models/user/ContextVWOModel.ts");
var UuidUtil_1 = __webpack_require__(/*! ../../utils/UuidUtil */ "./lib/utils/UuidUtil.ts");
var SettingsService_1 = __webpack_require__(/*! ../../services/SettingsService */ "./lib/services/SettingsService.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var ContextModel = /** @class */ (function () {
    function ContextModel() {
    }
    ContextModel.prototype.modelFromDictionary = function (context) {
        this.id = context.id;
        this.userAgent = context.userAgent;
        this.ipAddress = context.ipAddress;
        // if sdk is running in js environment and userAgent is not given then we use navigator.userAgent
        // Check if sdk running in browser and not in edge/serverless environment
        if ( true && typeof XMLHttpRequest !== 'undefined' && !context.userAgent) {
            this.userAgent = navigator.userAgent;
        }
        if (context === null || context === void 0 ? void 0 : context.customVariables) {
            this.customVariables = context.customVariables;
        }
        if (context === null || context === void 0 ? void 0 : context.variationTargetingVariables) {
            this.variationTargetingVariables = context.variationTargetingVariables;
        }
        if (context === null || context === void 0 ? void 0 : context._vwo) {
            this._vwo = new ContextVWOModel_1.ContextVWOModel().modelFromDictionary(context._vwo);
        }
        if (context === null || context === void 0 ? void 0 : context.postSegmentationVariables) {
            this.postSegmentationVariables = context.postSegmentationVariables;
        }
        this._vwo_uuid = (0, UuidUtil_1.getUUID)(this.id.toString(), SettingsService_1.SettingsService.Instance.accountId.toString());
        this._vwo_sessionId = (0, FunctionUtil_1.getCurrentUnixTimestamp)();
        return this;
    };
    ContextModel.prototype.getId = function () {
        var _a;
        return (_a = this.id) === null || _a === void 0 ? void 0 : _a.toString();
    };
    ContextModel.prototype.getUserAgent = function () {
        return this.userAgent;
    };
    ContextModel.prototype.getIpAddress = function () {
        return this.ipAddress;
    };
    ContextModel.prototype.getCustomVariables = function () {
        return this.customVariables;
    };
    ContextModel.prototype.setCustomVariables = function (customVariables) {
        this.customVariables = customVariables;
    };
    ContextModel.prototype.getVariationTargetingVariables = function () {
        return this.variationTargetingVariables;
    };
    ContextModel.prototype.setVariationTargetingVariables = function (variationTargetingVariables) {
        this.variationTargetingVariables = variationTargetingVariables;
    };
    ContextModel.prototype.getVwo = function () {
        return this._vwo;
    };
    ContextModel.prototype.setVwo = function (_vwo) {
        this._vwo = _vwo;
    };
    ContextModel.prototype.getPostSegmentationVariables = function () {
        return this.postSegmentationVariables;
    };
    ContextModel.prototype.setPostSegmentationVariables = function (postSegmentationVariables) {
        this.postSegmentationVariables = postSegmentationVariables;
    };
    ContextModel.prototype.getUuid = function () {
        return this._vwo_uuid;
    };
    ContextModel.prototype.getSessionId = function () {
        return this._vwo_sessionId;
    };
    return ContextModel;
}());
exports.ContextModel = ContextModel;


/***/ }),

/***/ "./lib/models/user/ContextVWOModel.ts":
/*!********************************************!*\
  !*** ./lib/models/user/ContextVWOModel.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContextVWOModel = void 0;
var ContextVWOModel = /** @class */ (function () {
    function ContextVWOModel() {
    }
    ContextVWOModel.prototype.modelFromDictionary = function (context) {
        if (context === null || context === void 0 ? void 0 : context.location) {
            this.location = context.location;
        }
        if (context === null || context === void 0 ? void 0 : context.userAgent) {
            this.userAgent = context.userAgent;
        }
        return this;
    };
    ContextVWOModel.prototype.getLocation = function () {
        return this.location;
    };
    ContextVWOModel.prototype.getUaInfo = function () {
        return this.userAgent;
    };
    return ContextVWOModel;
}());
exports.ContextVWOModel = ContextVWOModel;


/***/ }),

/***/ "./lib/packages/decision-maker/index.ts":
/*!**********************************************!*\
  !*** ./lib/packages/decision-maker/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecisionMaker = void 0;
var murmurhash_1 = __importDefault(__webpack_require__(/*! murmurhash */ "./node_modules/murmurhash/murmurhash.js"));
var Hasher = murmurhash_1.default;
if (!Hasher.v3) {
    Hasher.v3 = Hasher;
}
var SEED_VALUE = 1; // Seed value for the hash function
var DecisionMaker = /** @class */ (function () {
    function DecisionMaker() {
    }
    /**
     * Generates a bucket value based on the hash value, maximum value, and an optional multiplier.
     *
     * @param {number} hashValue - The hash value used for calculation
     * @param {number} maxValue - The maximum value for bucket scaling
     * @param {number} [multiplier=1] - Optional multiplier to adjust the value
     * @returns {number} - The calculated bucket value
     */
    DecisionMaker.prototype.generateBucketValue = function (hashValue, maxValue, multiplier) {
        if (multiplier === void 0) { multiplier = 1; }
        // Calculate the ratio based on the hash value
        var ratio = hashValue / Math.pow(2, 32);
        // Calculate the multiplied value
        var multipliedValue = (maxValue * ratio + 1) * multiplier;
        // Round down to get the final value
        var value = Math.floor(multipliedValue);
        return value;
    };
    /**
     * Gets the bucket value for a user based on the hash key and maximum value.
     *
     * @param {string} hashKey - The hash key for the user
     * @param {number} [maxValue=100] - The maximum value for bucket scaling
     * @returns {number} - The calculated bucket value for the user
     */
    DecisionMaker.prototype.getBucketValueForUser = function (hashKey, maxValue) {
        if (maxValue === void 0) { maxValue = 100; }
        var hashValue = Hasher.v3(hashKey, SEED_VALUE); // Calculate the hash value
        var bucketValue = this.generateBucketValue(hashValue, maxValue); // Calculate the bucket value
        return bucketValue; // Return the calculated bucket value
    };
    /**
     * Calculates the bucket value for a given string with optional multiplier and maximum value.
     *
     * @param {string} str - The input string to calculate the bucket value for
     * @param {number} [multiplier=1] - Optional multiplier to adjust the value
     * @param {number} [maxValue=10000] - The maximum value for bucket scaling
     * @returns {number} - The calculated bucket value
     */
    DecisionMaker.prototype.calculateBucketValue = function (str, multiplier, maxValue) {
        if (multiplier === void 0) { multiplier = 1; }
        if (maxValue === void 0) { maxValue = 10000; }
        var hashValue = this.generateHashValue(str); // Generate the hash value for the input string
        return this.generateBucketValue(hashValue, maxValue, multiplier); // Generate and return the bucket value
    };
    /**
     * Generates the hash value for a given hash key using murmurHash v3.
     *
     * @param {string} hashKey - The hash key for which the hash value is generated
     * @returns {number} - The generated hash value
     */
    DecisionMaker.prototype.generateHashValue = function (hashKey) {
        return Hasher.v3(hashKey, SEED_VALUE); // Return the hash value generated using murmurHash
    };
    return DecisionMaker;
}());
exports.DecisionMaker = DecisionMaker;


/***/ }),

/***/ "./lib/packages/logger/LogMessageBuilder.ts":
/*!**************************************************!*\
  !*** ./lib/packages/logger/LogMessageBuilder.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogMessageBuilder = void 0;
var LogLevelEnum_1 = __webpack_require__(/*! ./enums/LogLevelEnum */ "./lib/packages/logger/enums/LogLevelEnum.ts");
var AnsiColorEnum = {
    BOLD: '\x1b[1m',
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    LIGHTBLUE: '\x1b[94m',
    RED: '\x1b[31m',
    RESET: '\x1b[0m',
    WHITE: '\x1b[30m',
    YELLOW: '\x1b[33m',
};
/**
 * Implements the ILogMessageBuilder interface to provide a concrete log message builder.
 */
var LogMessageBuilder = /** @class */ (function () {
    /**
     * Constructs a new LogMessageBuilder instance.
     * @param {Record<string, any>} loggerConfig - Configuration for the logger.
     * @param {Record<string, any>} transportConfig - Configuration for the transport mechanism.
     */
    function LogMessageBuilder(loggerConfig, transportConfig) {
        this.loggerConfig = loggerConfig;
        this.transportConfig = transportConfig;
        // Set the prefix, defaulting to an empty string if not provided.
        this.prefix = this.transportConfig.prefix || this.loggerConfig.prefix || '';
        // Set the date and time format, defaulting to the logger's format if the transport's format is not provided.
        this.dateTimeFormat = this.transportConfig.dateTimeFormat || this.loggerConfig.dateTimeFormat;
    }
    /**
     * Formats a log message combining level, prefix, date/time, and the actual message.
     * @param {string} level - The log level.
     * @param {string} message - The message to log.
     * @returns {string} The formatted log message.
     */
    LogMessageBuilder.prototype.formatMessage = function (level, message) {
        return "[".concat(this.getFormattedLevel(level), "]: ").concat(this.getFormattedPrefix(this.prefix), " ").concat(this.getFormattedDateTime(), " ").concat(message);
    };
    LogMessageBuilder.prototype.getFormattedPrefix = function (prefix) {
        if (this.loggerConfig.isAnsiColorEnabled) {
            return "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.GREEN).concat(prefix).concat(AnsiColorEnum.RESET);
        }
        return "".concat(prefix);
    };
    /**
     * Returns the formatted log level with appropriate coloring based on the log level.
     * @param {string} level - The log level.
     * @returns {string} The formatted log level.
     */
    LogMessageBuilder.prototype.getFormattedLevel = function (level) {
        var _a, _b;
        var upperCaseLevel = level.toUpperCase();
        var LogLevelColorInfoEnum;
        if (this.loggerConfig.isAnsiColorEnabled) {
            LogLevelColorInfoEnum = (_a = {},
                _a[LogLevelEnum_1.LogLevelEnum.TRACE] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.WHITE).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a[LogLevelEnum_1.LogLevelEnum.DEBUG] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.LIGHTBLUE).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a[LogLevelEnum_1.LogLevelEnum.INFO] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.CYAN).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a[LogLevelEnum_1.LogLevelEnum.WARN] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.YELLOW).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a[LogLevelEnum_1.LogLevelEnum.ERROR] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.RED).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a);
        }
        else {
            LogLevelColorInfoEnum = (_b = {},
                _b[LogLevelEnum_1.LogLevelEnum.TRACE] = upperCaseLevel,
                _b[LogLevelEnum_1.LogLevelEnum.DEBUG] = upperCaseLevel,
                _b[LogLevelEnum_1.LogLevelEnum.INFO] = upperCaseLevel,
                _b[LogLevelEnum_1.LogLevelEnum.WARN] = upperCaseLevel,
                _b[LogLevelEnum_1.LogLevelEnum.ERROR] = upperCaseLevel,
                _b);
        }
        return LogLevelColorInfoEnum[level];
    };
    /**
     * Retrieves the current date and time formatted according to the specified format.
     * @returns {string} The formatted date and time.
     */
    LogMessageBuilder.prototype.getFormattedDateTime = function () {
        return this.dateTimeFormat();
    };
    return LogMessageBuilder;
}());
exports.LogMessageBuilder = LogMessageBuilder;


/***/ }),

/***/ "./lib/packages/logger/Logger.ts":
/*!***************************************!*\
  !*** ./lib/packages/logger/Logger.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
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
/**
 * Abstract class representing a logger.
 * This class provides the structure for logging mechanisms and should be extended by specific logger implementations.
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    return Logger;
}());
exports.Logger = Logger;


/***/ }),

/***/ "./lib/packages/logger/core/LogManager.ts":
/*!************************************************!*\
  !*** ./lib/packages/logger/core/LogManager.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogManager = void 0;
var uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/commonjs-browser/index.js");
var Logger_1 = __webpack_require__(/*! ../Logger */ "./lib/packages/logger/Logger.ts");
var TransportManager_1 = __webpack_require__(/*! ./TransportManager */ "./lib/packages/logger/core/TransportManager.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var LogLevelEnum_1 = __webpack_require__(/*! ../enums/LogLevelEnum */ "./lib/packages/logger/enums/LogLevelEnum.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ../../../utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var DebuggerCategoryEnum_1 = __webpack_require__(/*! ../../../enums/DebuggerCategoryEnum */ "./lib/enums/DebuggerCategoryEnum.ts");
var DebuggerServiceUtil_1 = __webpack_require__(/*! ../../../utils/DebuggerServiceUtil */ "./lib/utils/DebuggerServiceUtil.ts");
var log_messages_1 = __webpack_require__(/*! ../../../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../../../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
/**
 * LogManager class provides logging functionality with support for multiple transports.
 * It is designed as a singleton to ensure a single instance throughout the application.
 */
var LogManager = /** @class */ (function (_super) {
    __extends(LogManager, _super);
    /**
     * Constructor for LogManager.
     * @param {Record<string, any>} config - Configuration object for LogManager.
     */
    function LogManager(config) {
        var _this = _super.call(this) || this;
        _this.name = 'VWO Logger'; // Default logger name
        _this.requestId = (0, uuid_1.v4)(); // Unique request ID generated for each instance
        _this.level = LogLevelEnum_1.LogLevelEnum.ERROR; // Default logging level
        _this.prefix = 'VWO-SDK'; // Default prefix for log messages
        _this.shouldLogToStandardOutput = false;
        _this.config = config;
        if (config.isAlwaysNewInstance || !LogManager.instance) {
            LogManager.instance = _this;
            // Initialize configuration with defaults or provided values
            _this.config.name = config.name || _this.name;
            _this.config.requestId = config.requestId || _this.requestId;
            _this.config.level = config.level || _this.level;
            _this.config.prefix = config.prefix || _this.prefix;
            _this.config.dateTimeFormat = config.dateTimeFormat || _this.dateTimeFormat;
            _this.config.shouldLogToStandardOutput = config.shouldLogToStandardOutput || _this.shouldLogToStandardOutput;
            _this.transportManager = new TransportManager_1.LogTransportManager(_this.config);
            _this.handleTransports();
        }
        return LogManager.instance;
    }
    LogManager.prototype.dateTimeFormat = function () {
        return new Date().toISOString(); // Default date-time format for log messages
    };
    Object.defineProperty(LogManager, "Instance", {
        /**
         * Provides access to the singleton instance of LogManager.
         * @returns {LogManager} The singleton instance.
         */
        get: function () {
            return LogManager.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Handles the initialization and setup of transports based on configuration.
     */
    LogManager.prototype.handleTransports = function () {
        var transports = this.config.transports;
        if (transports === null || transports === void 0 ? void 0 : transports.length) {
            this.addTransports(this.config.transports);
        }
        else if (this.config.transport && (0, DataTypeUtil_1.isObject)(this.config.transport)) {
            this.addTransport(this.config.transport);
        }
    };
    /**
     * Adds a single transport to the LogManager.
     * @param {Record<any, any>} transport - The transport object to add.
     */
    LogManager.prototype.addTransport = function (transport) {
        this.transportManager.addTransport(transport);
    };
    /**
     * Adds multiple transports to the LogManager.
     * @param {Array<Record<any, any>>} transports - The list of transport objects to add.
     */
    LogManager.prototype.addTransports = function (transports) {
        for (var i = 0; i < transports.length; i++) {
            this.addTransport(transports[i]);
        }
    };
    /**
     * Logs a trace message.
     * @param {string} message - The message to log at trace level.
     */
    LogManager.prototype.trace = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.TRACE, message);
    };
    /**
     * Logs a debug message.
     * @param {string} message - The message to log at debug level.
     */
    LogManager.prototype.debug = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
    };
    /**
     * Logs an informational message.
     * @param {string} message - The message to log at info level.
     */
    LogManager.prototype.info = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.INFO, message);
    };
    /**
     * Logs a warning message.
     * @param {string} message - The message to log at warn level.
     */
    LogManager.prototype.warn = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.WARN, message);
    };
    /**
     * Logs an error message.
     * @param {string} message - The message to log at error level.
     */
    LogManager.prototype.error = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.ERROR, message);
    };
    /**
     * Middleware method that stores error in DebuggerService and logs it.
     * @param {boolean} shouldSendToVWO - Whether to send the error to VWO.
     * @param {string} category - The category of the error.
     */
    LogManager.prototype.errorLog = function (template, data, debugData, shouldSendToVWO) {
        if (data === void 0) { data = {}; }
        if (debugData === void 0) { debugData = {}; }
        if (shouldSendToVWO === void 0) { shouldSendToVWO = true; }
        try {
            var message = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum[template], data);
            this.error(message);
            if (shouldSendToVWO) {
                var debugEventProps = __assign(__assign(__assign({}, debugData), data), { msg_t: template, msg: message, lt: LogLevelEnum_1.LogLevelEnum.ERROR.toString(), cg: DebuggerCategoryEnum_1.DebuggerCategoryEnum.ERROR });
                // send debug event to VWO
                (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
            }
        }
        catch (err) {
            console.error('Got error while logging error' + (0, FunctionUtil_1.getFormattedErrorMessage)(err));
        }
    };
    return LogManager;
}(Logger_1.Logger));
exports.LogManager = LogManager;


/***/ }),

/***/ "./lib/packages/logger/core/TransportManager.ts":
/*!******************************************************!*\
  !*** ./lib/packages/logger/core/TransportManager.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogTransportManager = exports.LogLevelNumberEnum = void 0;
var LogLevelEnum_1 = __webpack_require__(/*! ../enums/LogLevelEnum */ "./lib/packages/logger/enums/LogLevelEnum.ts");
var LogMessageBuilder_1 = __webpack_require__(/*! ../LogMessageBuilder */ "./lib/packages/logger/LogMessageBuilder.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var ConsoleTransport_1 = __webpack_require__(/*! ../transports/ConsoleTransport */ "./lib/packages/logger/transports/ConsoleTransport.ts");
var LogLevelNumberEnum;
(function (LogLevelNumberEnum) {
    LogLevelNumberEnum[LogLevelNumberEnum["TRACE"] = 0] = "TRACE";
    LogLevelNumberEnum[LogLevelNumberEnum["DEBUG"] = 1] = "DEBUG";
    LogLevelNumberEnum[LogLevelNumberEnum["INFO"] = 2] = "INFO";
    LogLevelNumberEnum[LogLevelNumberEnum["WARN"] = 3] = "WARN";
    LogLevelNumberEnum[LogLevelNumberEnum["ERROR"] = 4] = "ERROR";
})(LogLevelNumberEnum || (exports.LogLevelNumberEnum = LogLevelNumberEnum = {}));
/**
 * Manages logging transports and delegates logging messages to them based on configuration.
 * Implements the IlogTransport interface.
 */
var LogTransportManager = /** @class */ (function () {
    /**
     * Initializes the manager with a configuration object.
     * @param {Record<string, any>} config - Configuration settings for the log manager.
     */
    function LogTransportManager(config) {
        this.transports = [];
        this.config = config;
        this.consoleTransport = new ConsoleTransport_1.ConsoleTransport({
            level: config.level,
        });
    }
    /**
     * Adds a new transport to the manager.
     * @param {Record<string, any>} transport - The transport object to be added.
     */
    LogTransportManager.prototype.addTransport = function (transport) {
        this.transports.push(transport);
    };
    /**
     * Determines if the log should be processed based on the transport and configuration levels.
     * @param {string} transportLevel - The log level set for the transport.
     * @param {string} configLevel - The log level set in the configuration.
     * @returns {boolean} - Returns true if the log level is appropriate for logging, false otherwise.
     */
    LogTransportManager.prototype.shouldLog = function (transportLevel, configLevel) {
        // Default to the most specific level available
        // transportLevel = transportLevel || configLevel || this.config.level;
        var targetLevel = LogLevelNumberEnum[transportLevel.toUpperCase()];
        var desiredLevel = LogLevelNumberEnum[(configLevel || this.config.level).toUpperCase()];
        return targetLevel >= desiredLevel;
    };
    /**
     * Logs a message at TRACE level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.trace = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.TRACE, message);
    };
    /**
     * Logs a message at DEBUG level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.debug = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
    };
    /**
     * Logs a message at INFO level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.info = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.INFO, message);
    };
    /**
     * Logs a message at WARN level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.warn = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.WARN, message);
    };
    /**
     * Logs a message at ERROR level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.error = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.ERROR, message);
    };
    /**
     * Delegates the logging of messages to the appropriate transports.
     * @param {string} level - The level at which to log the message.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.log = function (level, message) {
        var logMessageBuilder = new LogMessageBuilder_1.LogMessageBuilder(this.config, this.consoleTransport);
        var formattedMessage = logMessageBuilder.formatMessage(level, message);
        // handling console log
        // always log to console if config.level is set
        if (this.config.level) {
            if (this.transports.length === 0 || (this.transports.length > 0 && this.config.shouldLogToStandardOutput)) {
                if (this.shouldLog(level, this.config.level)) {
                    this.consoleTransport[level](formattedMessage);
                }
            }
        }
        // handling transports
        // log to transports -- use transport level if set, otherwise use config.level (in shouldLog function)
        for (var i = 0; i < this.transports.length; i++) {
            if (this.shouldLog(level, this.transports[i].level)) {
                if (this.transports[i].log && (0, DataTypeUtil_1.isFunction)(this.transports[i].log)) {
                    // Use custom log handler if available
                    this.transports[i].log(level, message);
                }
            }
        }
    };
    return LogTransportManager;
}());
exports.LogTransportManager = LogTransportManager;


/***/ }),

/***/ "./lib/packages/logger/enums/LogLevelEnum.ts":
/*!***************************************************!*\
  !*** ./lib/packages/logger/enums/LogLevelEnum.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogLevelEnum = void 0;
var LogLevelEnum;
(function (LogLevelEnum) {
    LogLevelEnum["TRACE"] = "trace";
    LogLevelEnum["DEBUG"] = "debug";
    LogLevelEnum["INFO"] = "info";
    LogLevelEnum["WARN"] = "warn";
    LogLevelEnum["ERROR"] = "error";
})(LogLevelEnum || (exports.LogLevelEnum = LogLevelEnum = {}));


/***/ }),

/***/ "./lib/packages/logger/index.ts":
/*!**************************************!*\
  !*** ./lib/packages/logger/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogLevelEnum = exports.LogManager = void 0;
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
var LogManager_1 = __webpack_require__(/*! ./core/LogManager */ "./lib/packages/logger/core/LogManager.ts");
Object.defineProperty(exports, "LogManager", ({ enumerable: true, get: function () { return LogManager_1.LogManager; } }));
var LogLevelEnum_1 = __webpack_require__(/*! ./enums/LogLevelEnum */ "./lib/packages/logger/enums/LogLevelEnum.ts");
Object.defineProperty(exports, "LogLevelEnum", ({ enumerable: true, get: function () { return LogLevelEnum_1.LogLevelEnum; } }));


/***/ }),

/***/ "./lib/packages/logger/transports/ConsoleTransport.ts":
/*!************************************************************!*\
  !*** ./lib/packages/logger/transports/ConsoleTransport.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsoleTransport = void 0;
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
var LogLevelEnum_1 = __webpack_require__(/*! ../enums/LogLevelEnum */ "./lib/packages/logger/enums/LogLevelEnum.ts");
/**
 * ConsoleTransport class implements the Logger interface to provide logging functionality.
 * It outputs logs to the console based on the log level set in the configuration.
 */
var ConsoleTransport = /** @class */ (function () {
    /**
     * Constructor initializes the ConsoleTransport with a configuration object.
     * @param {Record<string, any>} config - Configuration settings for the logger, including 'level'.
     */
    function ConsoleTransport(config) {
        if (config === void 0) { config = {}; }
        this.config = config; // Store the configuration
        this.level = this.config.level; // Set the logging level from the configuration
    }
    /**
     * Logs a trace message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.trace = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.TRACE, message);
    };
    /**
     * Logs a debug message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.debug = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
    };
    /**
     * Logs an informational message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.info = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.INFO, message);
    };
    /**
     * Logs a warning message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.warn = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.WARN, message);
    };
    /**
     * Logs an error message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.error = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.ERROR, message);
    };
    /**
     * Generic log function that logs messages to the console based on the log level.
     * @param {string} level - The log level under which the message should be logged.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.consoleLog = function (level, message) {
        console[level](message); // Use console's logging function dynamically based on the level
    };
    return ConsoleTransport;
}());
exports.ConsoleTransport = ConsoleTransport;


/***/ }),

/***/ "./lib/packages/network-layer/client/NetworkBrowserClient.ts":
/*!*******************************************************************!*\
  !*** ./lib/packages/network-layer/client/NetworkBrowserClient.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NetworkBrowserClient = void 0;
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
var XMLUtil_1 = __webpack_require__(/*! ../../../utils/XMLUtil */ "./lib/utils/XMLUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkBrowserClient = /** @class */ (function () {
    function NetworkBrowserClient() {
    }
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    NetworkBrowserClient.prototype.GET = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        (0, XMLUtil_1.sendGetCall)({
            requestModel: requestModel,
            successCallback: function (responseModel) {
                deferred.resolve(responseModel);
            },
            errorCallback: function (responseModel) {
                deferred.reject(responseModel);
            },
        });
        /*try {
          fetch(url)
              .then(res => {
                // Some endpoints return empty strings as the response body; treat
                // as raw text and handle potential JSON parsing errors below
                return res.text().then(text => {
                  let jsonData = {};
                  try {
                    jsonData = JSON.parse(text);
                  } catch (err) {
                    console.info(
                      `VWO-SDK - [INFO]: VWO didn't send JSON response which is expected: ${err}`
                    );
                  }
    
                  if (res.status === 200) {
                    responseModel.setData(jsonData);
                    deferred.resolve(responseModel);
                  } else {
                    let error = `VWO-SDK - [ERROR]: Request failed for fetching account settings. Got Status Code: ${
                      res.status
                    }`;
    
                    responseModel.setError(error);
                    deferred.reject(responseModel);
                  }
                });
              })
              .catch(err => {
                responseModel.setError(err);
                deferred.reject(responseModel);
              });
        } catch (err) {
          responseModel.setError(err);
          deferred.reject(responseModel);
        } */
        return deferred.promise;
    };
    /**
     * Performs a POST request using the provided RequestModel.
     * @param {RequestModel} request - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    NetworkBrowserClient.prototype.POST = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        (0, XMLUtil_1.sendPostCall)({
            requestModel: requestModel,
            successCallback: function (responseModel) {
                deferred.resolve(responseModel);
            },
            errorCallback: function (responseModel) {
                deferred.reject(responseModel);
            },
        });
        /* try {
          const options: any = Object.assign(
            {},
            { method: HttpMethodEnum.POST },
            { body: networkOptions.body },
            { headers: networkOptions.headers }
          );
    
          fetch(url, options)
              .then(res => {
                // Some endpoints return empty strings as the response body; treat
                // as raw text and handle potential JSON parsing errors below
                return res.text().then(text => {
                  let jsonData = {};
                  try {
                    jsonData = JSON.parse(text);
                  } catch (err) {
                    console.info(
                      `VWO-SDK - [INFO]: VWO didn't send JSON response which is expected: ${err}`
                    );
                  }
    
                  if (res.status === 200) {
                    responseModel.setData(jsonData);
                    deferred.resolve(responseModel);
                  } else {
                    let error = `VWO-SDK - [ERROR]: Request failed for fetching account settings. Got Status Code: ${
                      res.status
                    }`;
    
                    responseModel.setError(error);
                    deferred.reject(responseModel);
                  }
                });
              })
              .catch(err => {
                responseModel.setError(err);
                deferred.reject(responseModel);
              });
        } catch (err) {
          responseModel.setError(err);
          deferred.reject(responseModel);
        } */
        return deferred.promise;
    };
    return NetworkBrowserClient;
}());
exports.NetworkBrowserClient = NetworkBrowserClient;


/***/ }),

/***/ "./lib/packages/network-layer/client/NetworkServerLessClient.ts":
/*!**********************************************************************!*\
  !*** ./lib/packages/network-layer/client/NetworkServerLessClient.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NetworkServerLessClient = void 0;
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
var FetchUtil_1 = __webpack_require__(/*! ../../../utils/FetchUtil */ "./lib/utils/FetchUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkServerLessClient = /** @class */ (function () {
    function NetworkServerLessClient() {
    }
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    NetworkServerLessClient.prototype.GET = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        (0, FetchUtil_1.sendGetCall)(requestModel)
            .then(function (data) {
            deferred.resolve(data);
        })
            .catch(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    /**
     * Performs a POST request using the provided RequestModel.
     * @param {RequestModel} request - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    NetworkServerLessClient.prototype.POST = function (request) {
        var deferred = new PromiseUtil_1.Deferred();
        (0, FetchUtil_1.sendPostCall)(request)
            .then(function (data) {
            deferred.resolve(data);
        })
            .catch(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return NetworkServerLessClient;
}());
exports.NetworkServerLessClient = NetworkServerLessClient;


/***/ }),

/***/ "./lib/packages/network-layer/handlers/RequestHandler.ts":
/*!***************************************************************!*\
  !*** ./lib/packages/network-layer/handlers/RequestHandler.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestHandler = void 0;
/**
 * A class responsible for creating and modifying request models based on a global configuration.
 */
var RequestHandler = /** @class */ (function () {
    function RequestHandler() {
    }
    /**
     * Creates a new request by merging properties from a base request and a configuration model.
     * If both the request URL and the base URL from the configuration are missing, it returns null.
     * Otherwise, it merges the properties from the configuration into the request if they are not already set.
     *
     * @param {RequestModel} request - The initial request model.
     * @param {GlobalRequestModel} config - The global request configuration model.
     * @returns {RequestModel} The merged request model or null if both URLs are missing.
     */
    RequestHandler.prototype.createRequest = function (request, config) {
        // Check if both the request URL and the configuration base URL are missing
        if ((config.getBaseUrl() === null || config.getBaseUrl() === undefined) &&
            (request.getUrl() === null || request.getUrl() === undefined)) {
            return null; // Return null if no URL is specified
        }
        // Set the request URL, defaulting to the configuration base URL if not set
        request.setUrl(request.getUrl() || config.getBaseUrl());
        // Set the request timeout, defaulting to the configuration timeout if not set
        request.setTimeout(request.getTimeout() || config.getTimeout());
        // Set the request body, defaulting to the configuration body if not set
        request.setBody(request.getBody() || config.getBody());
        // Set the request headers, defaulting to the configuration headers if not set
        request.setHeaders(request.getHeaders() || config.getHeaders());
        // Initialize request query parameters, defaulting to an empty object if not set
        var requestQueryParams = request.getQuery() || {};
        // Initialize configuration query parameters, defaulting to an empty object if not set
        var configQueryParams = config.getQuery() || {};
        // Merge configuration query parameters into the request query parameters if they don't exist
        for (var queryKey in configQueryParams) {
            if (!Object.prototype.hasOwnProperty.call(requestQueryParams, queryKey)) {
                requestQueryParams[queryKey] = configQueryParams[queryKey];
            }
        }
        // Set the merged query parameters back to the request
        request.setQuery(requestQueryParams);
        return request; // Return the modified request
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;


/***/ }),

/***/ "./lib/packages/network-layer/index.ts":
/*!*********************************************!*\
  !*** ./lib/packages/network-layer/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResponseModel = exports.RequestModel = exports.GlobalRequestModel = exports.NetworkManager = void 0;
var NetworkManager_1 = __webpack_require__(/*! ./manager/NetworkManager */ "./lib/packages/network-layer/manager/NetworkManager.ts");
Object.defineProperty(exports, "NetworkManager", ({ enumerable: true, get: function () { return NetworkManager_1.NetworkManager; } }));
var GlobalRequestModel_1 = __webpack_require__(/*! ./models/GlobalRequestModel */ "./lib/packages/network-layer/models/GlobalRequestModel.ts");
Object.defineProperty(exports, "GlobalRequestModel", ({ enumerable: true, get: function () { return GlobalRequestModel_1.GlobalRequestModel; } }));
var RequestModel_1 = __webpack_require__(/*! ./models/RequestModel */ "./lib/packages/network-layer/models/RequestModel.ts");
Object.defineProperty(exports, "RequestModel", ({ enumerable: true, get: function () { return RequestModel_1.RequestModel; } }));
var ResponseModel_1 = __webpack_require__(/*! ./models/ResponseModel */ "./lib/packages/network-layer/models/ResponseModel.ts");
Object.defineProperty(exports, "ResponseModel", ({ enumerable: true, get: function () { return ResponseModel_1.ResponseModel; } }));


/***/ }),

/***/ "./lib/packages/network-layer/manager/NetworkManager.ts":
/*!**************************************************************!*\
  !*** ./lib/packages/network-layer/manager/NetworkManager.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NetworkManager = void 0;
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
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var RequestHandler_1 = __webpack_require__(/*! ../handlers/RequestHandler */ "./lib/packages/network-layer/handlers/RequestHandler.ts");
var GlobalRequestModel_1 = __webpack_require__(/*! ../models/GlobalRequestModel */ "./lib/packages/network-layer/models/GlobalRequestModel.ts");
var constants_1 = __webpack_require__(/*! ../../../constants */ "./lib/constants/index.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var LogManager_1 = __webpack_require__(/*! ../../logger/core/LogManager */ "./lib/packages/logger/core/LogManager.ts");
var ApiEnum_1 = __webpack_require__(/*! ../../../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var NetworkServerLessClient_1 = __webpack_require__(/*! ../client/NetworkServerLessClient */ "./lib/packages/network-layer/client/NetworkServerLessClient.ts");
var NetworkBrowserClient_1 = __webpack_require__(/*! ../client/NetworkBrowserClient */ "./lib/packages/network-layer/client/NetworkBrowserClient.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ../../../utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var log_messages_1 = __webpack_require__(/*! ../../../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var Url_1 = __webpack_require__(/*! ../../../constants/Url */ "./lib/constants/Url.ts");
var NetworkManager = /** @class */ (function () {
    function NetworkManager() {
    }
    /**
     * Validates the retry configuration parameters
     * @param {IRetryConfig} retryConfig - The retry configuration to validate
     * @returns {IRetryConfig} The validated retry configuration with corrected values
     */
    NetworkManager.prototype.validateRetryConfig = function (retryConfig) {
        var validatedConfig = __assign({}, retryConfig);
        var isInvalidConfig = false;
        // Validate shouldRetry: should be a boolean value
        if (!(0, DataTypeUtil_1.isBoolean)(validatedConfig.shouldRetry)) {
            validatedConfig.shouldRetry = constants_1.Constants.DEFAULT_RETRY_CONFIG.shouldRetry;
            isInvalidConfig = true;
        }
        // Validate maxRetries: should be a non-negative integer and should not be less than 1
        if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.maxRetries) ||
            !Number.isInteger(validatedConfig.maxRetries) ||
            validatedConfig.maxRetries < 1) {
            validatedConfig.maxRetries = constants_1.Constants.DEFAULT_RETRY_CONFIG.maxRetries;
            isInvalidConfig = true;
        }
        // Validate initialDelay: should be a non-negative integer and should not be less than 1
        if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.initialDelay) ||
            !Number.isInteger(validatedConfig.initialDelay) ||
            validatedConfig.initialDelay < 1) {
            validatedConfig.initialDelay = constants_1.Constants.DEFAULT_RETRY_CONFIG.initialDelay;
            isInvalidConfig = true;
        }
        // Validate backoffMultiplier: should be a non-negative integer and should not be less than 2
        if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.backoffMultiplier) ||
            !Number.isInteger(validatedConfig.backoffMultiplier) ||
            validatedConfig.backoffMultiplier < 2) {
            validatedConfig.backoffMultiplier = constants_1.Constants.DEFAULT_RETRY_CONFIG.backoffMultiplier;
            isInvalidConfig = true;
        }
        if (isInvalidConfig) {
            LogManager_1.LogManager.Instance.errorLog('INVALID_RETRY_CONFIG', {
                retryConfig: JSON.stringify(validatedConfig),
            }, { an: ApiEnum_1.ApiEnum.INIT });
        }
        return isInvalidConfig ? constants_1.Constants.DEFAULT_RETRY_CONFIG : validatedConfig;
    };
    /**
     * Attaches a network client to the manager, or uses a default if none provided.
     * @param {NetworkClientInterface} client - The client to attach, optional.
     * @param {IRetryConfig} retryConfig - The retry configuration, optional.
     */
    NetworkManager.prototype.attachClient = function (client, retryConfig, shouldWaitForTrackingCalls) {
        if (shouldWaitForTrackingCalls === void 0) { shouldWaitForTrackingCalls = false; }
        // Only set retry configuration if it's not already initialized or if a new config is provided
        if (!this.retryConfig || retryConfig) {
            // Define default retry configuration
            var defaultRetryConfig = constants_1.Constants.DEFAULT_RETRY_CONFIG;
            // Merge provided retryConfig with defaults, giving priority to provided values
            var mergedConfig = __assign(__assign({}, defaultRetryConfig), (retryConfig || {}));
            // Validate the merged configuration
            this.retryConfig = this.validateRetryConfig(mergedConfig);
            // If shouldWaitForTrackingCalls is true, set shouldRetry to false
            // This is because we don't want to retry the request if the SDK is waiting for a network response (serverless mode)
            if (shouldWaitForTrackingCalls) {
                this.retryConfig.shouldRetry = false;
            }
        }
        // if env is undefined, we are in browser
        if (true) {
            // if XMLHttpRequest is undefined, we are in serverless
            if (typeof XMLHttpRequest === 'undefined') {
                this.client = client || new NetworkServerLessClient_1.NetworkServerLessClient();
            }
            else {
                LogManager_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                    api: 'xhr',
                    process: 'undefined',
                }));
                // if XMLHttpRequest is defined, we are in browser
                this.client = client || new NetworkBrowserClient_1.NetworkBrowserClient(); // Use provided client or default to NetworkClient
            }
        }
        else { var NetworkClient; }
        this.config = new GlobalRequestModel_1.GlobalRequestModel(null, null, null, null); // Initialize with default config
    };
    /**
     * Retrieves the current retry configuration.
     * @returns {IRetryConfig} A copy of the current retry configuration.
     */
    NetworkManager.prototype.getRetryConfig = function () {
        return __assign({}, this.retryConfig);
    };
    Object.defineProperty(NetworkManager, "Instance", {
        /**
         * Singleton accessor for the NetworkManager instance.
         * @returns {NetworkManager} The singleton instance.
         */
        get: function () {
            this.instance = this.instance || new NetworkManager(); // Create instance if it doesn't exist
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the global configuration for network requests.
     * @param {GlobalRequestModel} config - The configuration to set.
     */
    NetworkManager.prototype.setConfig = function (config) {
        this.config = config; // Set the global request configuration
    };
    /**
     * Retrieves the current global configuration.
     * @returns {GlobalRequestModel} The current configuration.
     */
    NetworkManager.prototype.getConfig = function () {
        return this.config; // Return the global request configuration
    };
    /**
     * Creates a network request model by merging specific request data with global config.
     * @param {RequestModel} request - The specific request data.
     * @returns {RequestModel} The merged request model.
     */
    NetworkManager.prototype.createRequest = function (request) {
        var options = new RequestHandler_1.RequestHandler().createRequest(request, this.config); // Merge and create request
        return options;
    };
    /**
     * Performs a GET request using the provided request model.
     * @param {RequestModel} request - The request model.
     * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
     */
    NetworkManager.prototype.get = function (request) {
        var deferred = new PromiseUtil_1.Deferred(); // Create a new deferred promise
        var networkOptions = this.createRequest(request); // Create network request options
        if (!networkOptions.getUrl()) {
            deferred.reject(new Error('no url found')); // Reject if no URL is found
        }
        else {
            this.client
                .GET(networkOptions)
                .then(function (response) {
                deferred.resolve(response); // Resolve with the response
            })
                .catch(function (errorResponse) {
                deferred.reject(errorResponse); // Reject with the error response
            });
        }
        return deferred.promise; // Return the promise
    };
    /**
     * Performs a POST request using the provided request model.
     * @param {RequestModel} request - The request model.
     * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
     */
    NetworkManager.prototype.post = function (request) {
        var deferred = new PromiseUtil_1.Deferred(); // Create a new deferred promise
        var networkOptions = this.createRequest(request); // Create network request options
        if (!networkOptions.getUrl()) {
            deferred.reject(new Error('no url found')); // Reject if no URL is found
        }
        else {
            this.client
                .POST(networkOptions)
                .then(function (response) {
                deferred.resolve(response); // Resolve with the response
            })
                .catch(function (error) {
                deferred.reject(error); // Reject with the error
            });
        }
        return deferred.promise; // Return the promise
    };
    return NetworkManager;
}());
exports.NetworkManager = NetworkManager;


/***/ }),

/***/ "./lib/packages/network-layer/models/GlobalRequestModel.ts":
/*!*****************************************************************!*\
  !*** ./lib/packages/network-layer/models/GlobalRequestModel.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalRequestModel = void 0;
var constants_1 = __webpack_require__(/*! ../../../constants */ "./lib/constants/index.ts");
/**
 * Represents a model for global HTTP requests configuration.
 * This class encapsulates all necessary details such as URL, query parameters, body, headers,
 * timeout settings, and development mode flag.
 */
var GlobalRequestModel = /** @class */ (function () {
    /**
     * Constructs an instance of the GlobalRequestModel.
     * @param url The base URL of the HTTP request.
     * @param query Query parameters as a record of key-value pairs.
     * @param body Body of the request as a record of key-value pairs.
     * @param headers HTTP headers as a record of key-value pairs.
     */
    function GlobalRequestModel(url, query, body, headers) {
        this.timeout = constants_1.Constants.EVENTS_CALL_TIMEOUT; // Default timeout for the HTTP request in milliseconds
        this.url = url;
        this.query = query;
        this.body = body;
        this.headers = headers;
    }
    /**
     * Sets the query parameters for the HTTP request.
     * @param query A record of key-value pairs representing the query parameters.
     */
    GlobalRequestModel.prototype.setQuery = function (query) {
        this.query = query;
    };
    /**
     * Retrieves the query parameters of the HTTP request.
     * @returns A record of key-value pairs representing the query parameters.
     */
    GlobalRequestModel.prototype.getQuery = function () {
        return this.query;
    };
    /**
     * Sets the body of the HTTP request.
     * @param body A record of key-value pairs representing the body content.
     */
    GlobalRequestModel.prototype.setBody = function (body) {
        this.body = body;
    };
    /**
     * Retrieves the body of the HTTP request.
     * @returns A record of key-value pairs representing the body content.
     */
    GlobalRequestModel.prototype.getBody = function () {
        return this.body;
    };
    /**
     * Sets the base URL of the HTTP request.
     * @param url The base URL as a string.
     */
    GlobalRequestModel.prototype.setBaseUrl = function (url) {
        this.url = url;
    };
    /**
     * Retrieves the base URL of the HTTP request.
     * @returns The base URL as a string.
     */
    GlobalRequestModel.prototype.getBaseUrl = function () {
        return this.url;
    };
    /**
     * Sets the timeout duration for the HTTP request.
     * @param timeout Timeout in milliseconds.
     */
    GlobalRequestModel.prototype.setTimeout = function (timeout) {
        this.timeout = timeout;
    };
    /**
     * Retrieves the timeout duration of the HTTP request.
     * @returns Timeout in milliseconds.
     */
    GlobalRequestModel.prototype.getTimeout = function () {
        return this.timeout;
    };
    /**
     * Sets the HTTP headers for the request.
     * @param headers A record of key-value pairs representing the HTTP headers.
     */
    GlobalRequestModel.prototype.setHeaders = function (headers) {
        this.headers = headers;
    };
    /**
     * Retrieves the HTTP headers of the request.
     * @returns A record of key-value pairs representing the HTTP headers.
     */
    GlobalRequestModel.prototype.getHeaders = function () {
        return this.headers;
    };
    /**
     * Sets the development mode status for the request.
     * @param isDevelopmentMode Boolean flag indicating if the request is in development mode.
     */
    GlobalRequestModel.prototype.setDevelopmentMode = function (isDevelopmentMode) {
        this.isDevelopmentMode = isDevelopmentMode;
    };
    /**
     * Retrieves the development mode status of the request.
     * @returns Boolean indicating if the request is in development mode.
     */
    GlobalRequestModel.prototype.getDevelopmentMode = function () {
        return this.isDevelopmentMode;
    };
    return GlobalRequestModel;
}());
exports.GlobalRequestModel = GlobalRequestModel;


/***/ }),

/***/ "./lib/packages/network-layer/models/RequestModel.ts":
/*!***********************************************************!*\
  !*** ./lib/packages/network-layer/models/RequestModel.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestModel = void 0;
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
var HttpMethodEnum_1 = __webpack_require__(/*! ../../../enums/HttpMethodEnum */ "./lib/enums/HttpMethodEnum.ts");
var Url_1 = __webpack_require__(/*! ../../../constants/Url */ "./lib/constants/Url.ts");
var constants_1 = __webpack_require__(/*! ../../../constants */ "./lib/constants/index.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../../../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
/**
 * Represents a model for HTTP requests.
 * This class encapsulates all necessary details such as URL, method, path, query parameters, body, headers,
 * scheme, port, and timeout settings.
 */
var RequestModel = /** @class */ (function () {
    /**
     * Constructs an instance of the RequestModel.
     * @param url The base URL of the HTTP request.
     * @param method HTTP method, default is 'GET'.
     * @param path URL path.
     * @param query Query parameters as a record of key-value pairs.
     * @param body Body of the request as a record of key-value pairs.
     * @param headers HTTP headers as a record of key-value pairs.
     * @param scheme Protocol scheme, default is 'http'.
     * @param port Port number, default is 80.
     */
    function RequestModel(url, method, path, query, body, headers, scheme, port, retryConfig) {
        if (method === void 0) { method = HttpMethodEnum_1.HttpMethodEnum.GET; }
        if (scheme === void 0) { scheme = Url_1.HTTPS; }
        this.whiteListedKeys = ['eventName', 'uuid', 'campaignId', 'eventProperties'];
        this.url = url;
        this.method = method;
        this.path = path;
        this.query = query;
        this.body = body;
        this.headers = headers;
        this.scheme = scheme;
        this.port = port;
        this.retryConfig = retryConfig || constants_1.Constants.DEFAULT_RETRY_CONFIG;
    }
    /**
     * Retrieves the HTTP method.
     * @returns The HTTP method as a string.
     */
    RequestModel.prototype.getMethod = function () {
        return this.method;
    };
    /**
     * Sets the HTTP method.
     * @param method The HTTP method to set.
     */
    RequestModel.prototype.setMethod = function (method) {
        this.method = method;
    };
    /**
     * Retrieves the body of the HTTP request.
     * @returns A record of key-value pairs representing the body content.
     */
    RequestModel.prototype.getBody = function () {
        return this.body;
    };
    /**
     * Sets the body of the HTTP request.
     * @param body A record of key-value pairs representing the body content.
     */
    RequestModel.prototype.setBody = function (body) {
        this.body = body;
    };
    /**
     * Sets the query parameters for the HTTP request.
     * @param query A record of key-value pairs representing the query parameters.
     */
    RequestModel.prototype.setQuery = function (query) {
        this.query = query;
    };
    /**
     * Retrieves the query parameters of the HTTP request.
     * @returns A record of key-value pairs representing the query parameters.
     */
    RequestModel.prototype.getQuery = function () {
        return this.query;
    };
    /**
     * Sets the HTTP headers for the request.
     * @param headers A record of key-value pairs representing the HTTP headers.
     */
    RequestModel.prototype.setHeaders = function (headers) {
        this.headers = headers;
        return this;
    };
    /**
     * Retrieves the HTTP headers of the request.
     * @returns A record of key-value pairs representing the HTTP headers.
     */
    RequestModel.prototype.getHeaders = function () {
        return this.headers;
    };
    /**
     * Sets the timeout duration for the HTTP request.
     * @param timeout Timeout in milliseconds.
     */
    RequestModel.prototype.setTimeout = function (timeout) {
        this.timeout = timeout;
        return this;
    };
    /**
     * Retrieves the timeout duration of the HTTP request.
     * @returns Timeout in milliseconds.
     */
    RequestModel.prototype.getTimeout = function () {
        return this.timeout;
    };
    /**
     * Retrieves the base URL of the HTTP request.
     * @returns The base URL as a string.
     */
    RequestModel.prototype.getUrl = function () {
        return this.url;
    };
    /**
     * Sets the base URL of the HTTP request.
     * @param url The base URL as a string.
     */
    RequestModel.prototype.setUrl = function (url) {
        this.url = url;
        return this;
    };
    /**
     * Retrieves the scheme of the HTTP request.
     * @returns The scheme as a string.
     */
    RequestModel.prototype.getScheme = function () {
        return this.scheme;
    };
    /**
     * Sets the scheme of the HTTP request.
     * @param scheme The scheme to set (http or https).
     */
    RequestModel.prototype.setScheme = function (scheme) {
        this.scheme = scheme;
        return this;
    };
    /**
     * Retrieves the port number of the HTTP request.
     * @returns The port number as an integer.
     */
    RequestModel.prototype.getPort = function () {
        return this.port;
    };
    /**
     * Sets the port number for the HTTP request.
     * @param port The port number to set.
     */
    RequestModel.prototype.setPort = function (port) {
        this.port = port;
        return this;
    };
    /**
     * Retrieves the path of the HTTP request.
     * @returns The path as a string.
     */
    RequestModel.prototype.getPath = function () {
        return this.path;
    };
    /**
     * Sets the path of the HTTP request.
     * @param path The path to set.
     */
    RequestModel.prototype.setPath = function (path) {
        this.path = path;
        return this;
    };
    /**
     * Retrieves the retry configuration.
     * @returns The retry configuration.
     */
    RequestModel.prototype.getRetryConfig = function () {
        return __assign({}, this.retryConfig);
    };
    /**
     * Sets the retry configuration.
     * @param retryConfig The retry configuration to set.
     */
    RequestModel.prototype.setRetryConfig = function (retryConfig) {
        this.retryConfig = retryConfig;
        return this;
    };
    /**
     * Sets the event name.
     * @param eventName The event name to set.
     */
    RequestModel.prototype.setEventName = function (eventName) {
        this.eventName = eventName;
        return this;
    };
    /**
     * Retrieves the event name.
     * @returns The event name as a string.
     */
    RequestModel.prototype.getEventName = function () {
        return this.eventName;
    };
    /**
     * Sets the UUID.
     * @param uuid The UUID to set.
     */
    RequestModel.prototype.setUuid = function (uuid) {
        this.uuid = uuid;
        return this;
    };
    /**
     * Retrieves the UUID.
     * @returns The UUID as a string.
     */
    RequestModel.prototype.getUuid = function () {
        return this.uuid;
    };
    /**
     * Sets the campaign ID.
     * @param campaignId The campaign ID to set.
     */
    RequestModel.prototype.setCampaignId = function (campaignId) {
        this.campaignId = campaignId;
        return this;
    };
    /**
     * Retrieves the campaign ID.
     * @returns The campaign ID as a string.
     */
    RequestModel.prototype.getCampaignId = function () {
        return this.campaignId;
    };
    /**
     * Sets the event properties.
     * @param eventProperties The event properties to set.
     */
    RequestModel.prototype.setEventProperties = function (eventProperties) {
        this.eventProperties = eventProperties;
        return this;
    };
    /**
     * Retrieves the event properties.
    /**
     * Retrieves the event properties.
     * @returns The event properties.
     */
    RequestModel.prototype.getEventProperties = function () {
        return this.eventProperties;
    };
    /**
     * Sets the last error message.
    /**
     * Retrieves the last error message.
     * @returns The last error message.
     */
    RequestModel.prototype.getLastError = function () {
        return this.lastError;
    };
    /**
     * Sets the last error message.
    /**
     * Sets the last error message.
     * @param lastError The last error message to set.
     */
    RequestModel.prototype.setLastError = function (lastError) {
        this.lastError = (0, FunctionUtil_1.getFormattedErrorMessage)(lastError);
        return this;
    };
    /**
     * Constructs the options for the HTTP request based on the current state of the model.
     * This method is used to prepare the request options for execution.
     * @returns A record containing all relevant options for the HTTP request.
     */
    RequestModel.prototype.getOptions = function () {
        var queryParams = '';
        for (var key in this.query) {
            var queryString = "".concat(key, "=").concat(this.query[key], "&");
            queryParams += queryString;
        }
        var _a = this.url.split('/'), hostname = _a[0], collectionPrefix = _a[1];
        var options = {
            hostname: hostname, // if url is example.com/as01, hostname will be example.com
            agent: false,
        };
        if (this.scheme) {
            options.scheme = this.scheme;
        }
        if (this.port) {
            options.port = this.port;
        }
        if (this.headers) {
            options.headers = this.headers;
        }
        if (this.method) {
            options.method = this.method;
        }
        if (this.body) {
            var postBody = JSON.stringify(this.body);
            options.headers = options.headers || {};
            options.headers['Content-Type'] = 'application/json';
            if (typeof Buffer === 'undefined') {
                options.headers['Content-Length'] = new TextEncoder().encode(postBody).length;
            }
            else {
                options.headers['Content-Length'] = Buffer.byteLength(postBody);
            }
            options.body = this.body;
        }
        if (this.path) {
            if (queryParams !== '') {
                options.path = this.path + '?' + queryParams || '';
            }
            else {
                options.path = this.path;
            }
        }
        if (collectionPrefix) {
            options.path = "/".concat(collectionPrefix) + options.path;
        }
        if (this.timeout) {
            options.timeout = this.timeout;
        }
        if (options.path.charAt(options.path.length - 1) === '&') {
            options.path = options.path.substring(0, options.path.length - 1);
        }
        options.retryConfig = this.retryConfig;
        return options;
    };
    /**
     * Retrieves the extra information of the HTTP request.
     * @returns A record of key-value pairs representing the extra information.
     */
    RequestModel.prototype.getExtraInfo = function () {
        var _this = this;
        // return eventName, uuid, campaignId if they are not null and not undefined
        return Object.fromEntries(Object.entries(this).filter(function (_a) {
            var key = _a[0], value = _a[1];
            return !(0, DataTypeUtil_1.isNull)(value) && !(0, DataTypeUtil_1.isUndefined)(value) && _this.whiteListedKeys.includes(key);
        }));
    };
    return RequestModel;
}());
exports.RequestModel = RequestModel;


/***/ }),

/***/ "./lib/packages/network-layer/models/ResponseModel.ts":
/*!************************************************************!*\
  !*** ./lib/packages/network-layer/models/ResponseModel.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResponseModel = void 0;
var FunctionUtil_1 = __webpack_require__(/*! ../../../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
/**
 * Represents the response model for network operations.
 * This class encapsulates details about the HTTP response including status code, headers, data, and errors.
 */
var ResponseModel = /** @class */ (function () {
    function ResponseModel() {
    }
    /**
     * Sets the status code of the response.
     * @param {number} statusCode - The HTTP status code
     */
    ResponseModel.prototype.setStatusCode = function (statusCode) {
        this.statusCode = statusCode;
    };
    /**
     * Sets the headers of the response.
     * @param {Record<string, string>} headers - The headers of the response
     */
    ResponseModel.prototype.setHeaders = function (headers) {
        this.headers = headers;
    };
    /**
     * Sets the data of the response.
     * @param {dynamic} data - The data payload of the response
     */
    ResponseModel.prototype.setData = function (data) {
        this.data = data;
    };
    /**
     * Sets the error object of the response.
     * @param {dynamic} error - The error object if the request failed
     */
    ResponseModel.prototype.setError = function (error) {
        this.error = (0, FunctionUtil_1.getFormattedErrorMessage)(error);
    };
    /**
     * Retrieves the headers of the response.
     * @returns {Record<string, string>} The headers of the response
     */
    ResponseModel.prototype.getHeaders = function () {
        return this.headers;
    };
    /**
     * Retrieves the data payload of the response.
     * @returns {dynamic} The data payload of the response
     */
    ResponseModel.prototype.getData = function () {
        return this.data;
    };
    /**
     * Retrieves the status code of the response.
     * @returns {number} The HTTP status code
     */
    ResponseModel.prototype.getStatusCode = function () {
        return this.statusCode;
    };
    /**
     * Retrieves the error object of the response.
     * @returns {dynamic} The error object if the request failed
     */
    ResponseModel.prototype.getError = function () {
        return this.error;
    };
    /**
     * Sets the total number of attempts made to send the request.
     * @param {number} totalAttempts - The total number of attempts made to send the request
     */
    ResponseModel.prototype.setTotalAttempts = function (totalAttempts) {
        this.totalAttempts = totalAttempts;
    };
    /**
     * Retrieves the total number of attempts made to send the request.
     * @returns {number} The total number of attempts made to send the request
     */
    ResponseModel.prototype.getTotalAttempts = function () {
        return this.totalAttempts;
    };
    return ResponseModel;
}());
exports.ResponseModel = ResponseModel;


/***/ }),

/***/ "./lib/packages/segmentation-evaluator/core/SegmentationManger.ts":
/*!************************************************************************!*\
  !*** ./lib/packages/segmentation-evaluator/core/SegmentationManger.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SegmentationManager = void 0;
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
var SegmentEvaluator_1 = __webpack_require__(/*! ../evaluators/SegmentEvaluator */ "./lib/packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts");
var GatewayServiceUtil_1 = __webpack_require__(/*! ../../../utils/GatewayServiceUtil */ "./lib/utils/GatewayServiceUtil.ts");
var UrlEnum_1 = __webpack_require__(/*! ../../../enums/UrlEnum */ "./lib/enums/UrlEnum.ts");
var logger_1 = __webpack_require__(/*! ../../logger */ "./lib/packages/logger/index.ts");
var ContextVWOModel_1 = __webpack_require__(/*! ../../../models/user/ContextVWOModel */ "./lib/models/user/ContextVWOModel.ts");
var SettingsService_1 = __webpack_require__(/*! ../../../services/SettingsService */ "./lib/services/SettingsService.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var ApiEnum_1 = __webpack_require__(/*! ../../../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../../../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var SegmentationManager = /** @class */ (function () {
    function SegmentationManager() {
    }
    Object.defineProperty(SegmentationManager, "Instance", {
        /**
         * Singleton pattern implementation for getting the instance of SegmentationManager.
         * @returns {SegmentationManager} The singleton instance.
         */
        get: function () {
            this.instance = this.instance || new SegmentationManager(); // Create new instance if it doesn't exist
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Attaches an evaluator to the manager, or creates a new one if none is provided.
     * @param {SegmentEvaluator} evaluator - Optional evaluator to attach.
     */
    SegmentationManager.prototype.attachEvaluator = function (evaluator) {
        this.evaluator = evaluator || new SegmentEvaluator_1.SegmentEvaluator(); // Use provided evaluator or create new one
    };
    /**
     * Sets the contextual data for the segmentation process.
     * @param {any} settings - The settings data.
     * @param {any} feature - The feature data including segmentation needs.
     * @param {any} context - The context data for the evaluation.
     */
    SegmentationManager.prototype.setContextualData = function (settings, feature, context) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParams, params, _vwo, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.attachEvaluator(); // Ensure a fresh evaluator instance
                        this.evaluator.settings = settings; // Set settings in evaluator
                        this.evaluator.context = context; // Set context in evaluator
                        this.evaluator.feature = feature; // Set feature in evaluator
                        // if both user agent and ip is null then we should not get data from gateway service
                        if ((context === null || context === void 0 ? void 0 : context.getUserAgent()) === null && (context === null || context === void 0 ? void 0 : context.getIpAddress()) === null) {
                            return [2 /*return*/];
                        }
                        if (!(feature.getIsGatewayServiceRequired() === true)) return [3 /*break*/, 4];
                        if (!(SettingsService_1.SettingsService.Instance.isGatewayServiceProvided &&
                            ((0, DataTypeUtil_1.isUndefined)(context.getVwo()) || context.getVwo() === null))) return [3 /*break*/, 4];
                        queryParams = {};
                        if (context === null || context === void 0 ? void 0 : context.getUserAgent()) {
                            queryParams['userAgent'] = context.getUserAgent();
                        }
                        if (context === null || context === void 0 ? void 0 : context.getIpAddress()) {
                            queryParams['ipAddress'] = context.getIpAddress();
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        params = (0, GatewayServiceUtil_1.getQueryParams)(queryParams);
                        return [4 /*yield*/, (0, GatewayServiceUtil_1.getFromGatewayService)(params, UrlEnum_1.UrlEnum.GET_USER_DATA, context)];
                    case 2:
                        _vwo = _a.sent();
                        context.setVwo(new ContextVWOModel_1.ContextVWOModel().modelFromDictionary(_vwo));
                        this.evaluator.context = context;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        logger_1.LogManager.Instance.errorLog('ERROR_SETTING_SEGMENTATION_CONTEXT', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_1),
                        }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validates the segmentation against provided DSL and properties.
     * @param {Record<string, dynamic>} dsl - The segmentation DSL.
     * @param {Record<any, dynamic>} properties - The properties to validate against.
     * @param {SettingsModel} settings - The settings model.
     * @param {any} context - Optional context.
     * @returns {Promise<boolean>} True if segmentation is valid, otherwise false.
     */
    SegmentationManager.prototype.validateSegmentation = function (dsl, properties) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.evaluator.isSegmentationValid(dsl, properties)];
                    case 1: return [2 /*return*/, _a.sent()]; // Delegate to evaluator's method
                }
            });
        });
    };
    return SegmentationManager;
}());
exports.SegmentationManager = SegmentationManager;


/***/ }),

/***/ "./lib/packages/segmentation-evaluator/enums/SegmentOperandRegexEnum.ts":
/*!******************************************************************************!*\
  !*** ./lib/packages/segmentation-evaluator/enums/SegmentOperandRegexEnum.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SegmentOperandRegexEnum = void 0;
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
var SegmentOperandRegexEnum;
(function (SegmentOperandRegexEnum) {
    SegmentOperandRegexEnum["LOWER"] = "^lower";
    SegmentOperandRegexEnum["LOWER_MATCH"] = "^lower\\((.*)\\)";
    SegmentOperandRegexEnum["WILDCARD"] = "^wildcard";
    SegmentOperandRegexEnum["WILDCARD_MATCH"] = "^wildcard\\((.*)\\)";
    SegmentOperandRegexEnum["REGEX"] = "^regex";
    SegmentOperandRegexEnum["REGEX_MATCH"] = "^regex\\((.*)\\)";
    SegmentOperandRegexEnum["STARTING_STAR"] = "^\\*";
    SegmentOperandRegexEnum["ENDING_STAR"] = "\\*$";
    SegmentOperandRegexEnum["GREATER_THAN_MATCH"] = "^gt\\((\\d+(?:\\.\\d+)*|\\.\\d+)\\)";
    SegmentOperandRegexEnum["GREATER_THAN_EQUAL_TO_MATCH"] = "^gte\\((\\d+(?:\\.\\d+)*|\\.\\d+)\\)";
    SegmentOperandRegexEnum["LESS_THAN_MATCH"] = "^lt\\((\\d+(?:\\.\\d+)*|\\.\\d+)\\)";
    SegmentOperandRegexEnum["LESS_THAN_EQUAL_TO_MATCH"] = "^lte\\((\\d+(?:\\.\\d+)*|\\.\\d+)\\)";
})(SegmentOperandRegexEnum || (exports.SegmentOperandRegexEnum = SegmentOperandRegexEnum = {}));


/***/ }),

/***/ "./lib/packages/segmentation-evaluator/enums/SegmentOperandValueEnum.ts":
/*!******************************************************************************!*\
  !*** ./lib/packages/segmentation-evaluator/enums/SegmentOperandValueEnum.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SegmentOperandValueEnum = void 0;
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
var SegmentOperandValueEnum;
(function (SegmentOperandValueEnum) {
    SegmentOperandValueEnum[SegmentOperandValueEnum["LOWER_VALUE"] = 1] = "LOWER_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["STARTING_ENDING_STAR_VALUE"] = 2] = "STARTING_ENDING_STAR_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["STARTING_STAR_VALUE"] = 3] = "STARTING_STAR_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["ENDING_STAR_VALUE"] = 4] = "ENDING_STAR_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["REGEX_VALUE"] = 5] = "REGEX_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["EQUAL_VALUE"] = 6] = "EQUAL_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["GREATER_THAN_VALUE"] = 7] = "GREATER_THAN_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["GREATER_THAN_EQUAL_TO_VALUE"] = 8] = "GREATER_THAN_EQUAL_TO_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["LESS_THAN_VALUE"] = 9] = "LESS_THAN_VALUE";
    SegmentOperandValueEnum[SegmentOperandValueEnum["LESS_THAN_EQUAL_TO_VALUE"] = 10] = "LESS_THAN_EQUAL_TO_VALUE";
})(SegmentOperandValueEnum || (exports.SegmentOperandValueEnum = SegmentOperandValueEnum = {}));


/***/ }),

/***/ "./lib/packages/segmentation-evaluator/enums/SegmentOperatorValueEnum.ts":
/*!*******************************************************************************!*\
  !*** ./lib/packages/segmentation-evaluator/enums/SegmentOperatorValueEnum.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SegmentOperatorValueEnum = void 0;
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
var SegmentOperatorValueEnum;
(function (SegmentOperatorValueEnum) {
    SegmentOperatorValueEnum["AND"] = "and";
    SegmentOperatorValueEnum["NOT"] = "not";
    SegmentOperatorValueEnum["OR"] = "or";
    SegmentOperatorValueEnum["CUSTOM_VARIABLE"] = "custom_variable";
    SegmentOperatorValueEnum["USER"] = "user";
    SegmentOperatorValueEnum["COUNTRY"] = "country";
    SegmentOperatorValueEnum["REGION"] = "region";
    SegmentOperatorValueEnum["CITY"] = "city";
    SegmentOperatorValueEnum["OPERATING_SYSTEM"] = "os";
    SegmentOperatorValueEnum["DEVICE_TYPE"] = "device_type";
    SegmentOperatorValueEnum["DEVICE"] = "device";
    SegmentOperatorValueEnum["BROWSER_AGENT"] = "browser_string";
    SegmentOperatorValueEnum["UA"] = "ua";
    SegmentOperatorValueEnum["FEATURE_ID"] = "featureId";
    SegmentOperatorValueEnum["IP"] = "ip_address";
    SegmentOperatorValueEnum["BROWSER_VERSION"] = "browser_version";
    SegmentOperatorValueEnum["OS_VERSION"] = "os_version";
})(SegmentOperatorValueEnum || (exports.SegmentOperatorValueEnum = SegmentOperatorValueEnum = {}));


/***/ }),

/***/ "./lib/packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts":
/*!****************************************************************************!*\
  !*** ./lib/packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
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
var StorageDecorator_1 = __webpack_require__(/*! ../../../decorators/StorageDecorator */ "./lib/decorators/StorageDecorator.ts");
var logger_1 = __webpack_require__(/*! ../../logger */ "./lib/packages/logger/index.ts");
var StorageService_1 = __webpack_require__(/*! ../../../services/StorageService */ "./lib/services/StorageService.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var SegmentOperatorValueEnum_1 = __webpack_require__(/*! ../enums/SegmentOperatorValueEnum */ "./lib/packages/segmentation-evaluator/enums/SegmentOperatorValueEnum.ts");
var SegmentUtil_1 = __webpack_require__(/*! ../utils/SegmentUtil */ "./lib/packages/segmentation-evaluator/utils/SegmentUtil.ts");
var SegmentOperandEvaluator_1 = __webpack_require__(/*! ./SegmentOperandEvaluator */ "./lib/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator.ts");
var ApiEnum_1 = __webpack_require__(/*! ../../../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../../../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
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
                    case 7: return [4 /*yield*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateCustomVariableDSL(subDsl, properties, this.context)];
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
                                        logger_1.LogManager.Instance.errorLog('FEATURE_NOT_FOUND_WITH_ID', {
                                            featureId: featureIdKey_1,
                                        }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: this_1.context.getUuid(), sId: this_1.context.getSessionId() });
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
                        logger_1.LogManager.Instance.errorLog('USER_AGENT_VALIDATION_ERROR', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_1),
                        }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: this.context.getUuid(), sId: this.context.getSessionId() });
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
                if (((_a = this.context) === null || _a === void 0 ? void 0 : _a.getIpAddress()) === undefined && "undefined" !== 'undefined') {}
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
                    logger_1.LogManager.Instance.errorLog('INVALID_USER_AGENT_IN_CONTEXT_FOR_PRE_SEGMENTATION', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: this.context.getUuid(), sId: this.context.getSessionId() });
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


/***/ }),

/***/ "./lib/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator.ts":
/*!***********************************************************************************!*\
  !*** ./lib/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator.ts ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
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
var SegmentUtil_1 = __webpack_require__(/*! ../utils/SegmentUtil */ "./lib/packages/segmentation-evaluator/utils/SegmentUtil.ts");
var SegmentOperandValueEnum_1 = __webpack_require__(/*! ../enums/SegmentOperandValueEnum */ "./lib/packages/segmentation-evaluator/enums/SegmentOperandValueEnum.ts");
var SegmentOperandRegexEnum_1 = __webpack_require__(/*! ../enums/SegmentOperandRegexEnum */ "./lib/packages/segmentation-evaluator/enums/SegmentOperandRegexEnum.ts");
var SegmentOperatorValueEnum_1 = __webpack_require__(/*! ../enums/SegmentOperatorValueEnum */ "./lib/packages/segmentation-evaluator/enums/SegmentOperatorValueEnum.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var GatewayServiceUtil_1 = __webpack_require__(/*! ../../../utils/GatewayServiceUtil */ "./lib/utils/GatewayServiceUtil.ts");
var UrlEnum_1 = __webpack_require__(/*! ../../../enums/UrlEnum */ "./lib/enums/UrlEnum.ts");
var logger_1 = __webpack_require__(/*! ../../logger */ "./lib/packages/logger/index.ts");
var ApiEnum_1 = __webpack_require__(/*! ../../../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../../../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
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
    SegmentOperandEvaluator.prototype.evaluateCustomVariableDSL = function (dslOperandValue, properties, context) {
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
                            logger_1.LogManager.Instance.errorLog('INVALID_ATTRIBUTE_LIST_FORMAT', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
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
                        return [4 /*yield*/, (0, GatewayServiceUtil_1.getFromGatewayService)(queryParamsObj, UrlEnum_1.UrlEnum.ATTRIBUTE_CHECK, context)];
                    case 2:
                        res = _c.sent();
                        if (!res || res === undefined || res === 'false' || res.status === 0) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, res];
                    case 3:
                        error_1 = _c.sent();
                        logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_DATA_FROM_GATEWAY', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(error_1),
                        }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
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
            logger_1.LogManager.Instance.errorLog('INVALID_USER_AGENT_IN_CONTEXT_FOR_PRE_SEGMENTATION', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
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


/***/ }),

/***/ "./lib/packages/segmentation-evaluator/index.ts":
/*!******************************************************!*\
  !*** ./lib/packages/segmentation-evaluator/index.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SegmentEvaluator = exports.SegmentationManager = void 0;
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
var SegmentationManger_1 = __webpack_require__(/*! ./core/SegmentationManger */ "./lib/packages/segmentation-evaluator/core/SegmentationManger.ts");
Object.defineProperty(exports, "SegmentationManager", ({ enumerable: true, get: function () { return SegmentationManger_1.SegmentationManager; } }));
var SegmentEvaluator_1 = __webpack_require__(/*! ./evaluators/SegmentEvaluator */ "./lib/packages/segmentation-evaluator/evaluators/SegmentEvaluator.ts");
Object.defineProperty(exports, "SegmentEvaluator", ({ enumerable: true, get: function () { return SegmentEvaluator_1.SegmentEvaluator; } }));


/***/ }),

/***/ "./lib/packages/segmentation-evaluator/utils/SegmentUtil.ts":
/*!******************************************************************!*\
  !*** ./lib/packages/segmentation-evaluator/utils/SegmentUtil.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getKeyValue = getKeyValue;
exports.matchWithRegex = matchWithRegex;
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
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
/**
 * Extracts the first key-value pair from the provided object.
 * @param {Record<string, any>} obj - The object from which to extract the key-value pair.
 * @returns {Record<string, any> | undefined} An object containing the first key and value, or undefined if input is not an object.
 */
function getKeyValue(obj) {
    // Check if the input is a valid object using isObject utility function
    if (!(0, DataTypeUtil_1.isObject)(obj)) {
        return;
    }
    // Extract the first key from the object
    var key = Object.keys(obj)[0];
    // Retrieve the value associated with the first key
    var value = obj[key];
    // Return an object containing the key and value
    return {
        key: key,
        value: value,
    };
}
/**
 * Matches a string against a regular expression and returns the match result.
 * @param {string} string - The string to match against the regex.
 * @param {string} regex - The regex pattern as a string.
 * @returns {RegExpMatchArray | null} The results of the regex match, or null if an error occurs.
 */
function matchWithRegex(string, regex) {
    try {
        // Attempt to match the string with the regex
        return string.match(new RegExp(regex));
    }
    catch (err) {
        // Return null if an error occurs during regex matching
        return null;
    }
}


/***/ }),

/***/ "./lib/packages/storage/Connector.ts":
/*!*******************************************!*\
  !*** ./lib/packages/storage/Connector.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Connector = void 0;
var Connector = /** @class */ (function () {
    function Connector() {
    }
    return Connector;
}());
exports.Connector = Connector;


/***/ }),

/***/ "./lib/packages/storage/Storage.ts":
/*!*****************************************!*\
  !*** ./lib/packages/storage/Storage.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Storage = void 0;
// TODO: move to file
// enum ConnectorEnum {
//   MEMORY = 'memory',
//   REDIS = 'redis'
// }
var Storage = /** @class */ (function () {
    function Storage() {
    }
    // public storageType: dynamic;
    Storage.prototype.attachConnector = function (connector) {
        var _a, _b, _c, _d;
        if (((_d = (_c = (_b = (_a = connector === null || connector === void 0 ? void 0 : connector.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.substring(0, 5)) === 'class') {
            this.connector = new connector();
        }
        else {
            this.connector = connector;
        }
        return this.connector;
    };
    Object.defineProperty(Storage, "Instance", {
        get: function () {
            this.instance = this.instance || new Storage();
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    Storage.prototype.getConnector = function () {
        return this.connector;
    };
    return Storage;
}());
exports.Storage = Storage;


/***/ }),

/***/ "./lib/packages/storage/connectors/BrowserStorageConnector.ts":
/*!********************************************************************!*\
  !*** ./lib/packages/storage/connectors/BrowserStorageConnector.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BrowserStorageConnector = void 0;
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
var constants_1 = __webpack_require__(/*! ../../../constants */ "./lib/constants/index.ts");
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var logger_1 = __webpack_require__(/*! ../../logger */ "./lib/packages/logger/index.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../../../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var Connector_1 = __webpack_require__(/*! ../Connector */ "./lib/packages/storage/Connector.ts");
/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
var BrowserStorageConnector = /** @class */ (function (_super) {
    __extends(BrowserStorageConnector, _super);
    /**
     * Creates an instance of BrowserStorageConnector
     * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
     * @param {string} [options.key] - Custom key for storage (defaults to Constants.DEFAULT_LOCAL_STORAGE_KEY)
     * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
     * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
     * @param {boolean} [options.alwaysUseCachedSettings] - Whether to always use cached settings
     * @param {number} [options.ttl] - Custom TTL in milliseconds (defaults to Constants.SETTINGS_TTL)
     */
    function BrowserStorageConnector(options) {
        var _this = _super.call(this) || this;
        _this.SETTINGS_KEY = constants_1.Constants.DEFAULT_SETTINGS_STORAGE_KEY;
        _this.storageKey = (options === null || options === void 0 ? void 0 : options.key) || constants_1.Constants.DEFAULT_LOCAL_STORAGE_KEY;
        _this.storage = (options === null || options === void 0 ? void 0 : options.provider) || window.localStorage;
        _this.isDisabled = (options === null || options === void 0 ? void 0 : options.isDisabled) || false;
        _this.alwaysUseCachedSettings = (options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings) || false;
        //options.ttl should be greater than 1 minute
        if (!(0, DataTypeUtil_1.isNumber)(options === null || options === void 0 ? void 0 : options.ttl) || options.ttl < constants_1.Constants.MIN_TTL_MS) {
            logger_1.LogManager.Instance.debug('TTL is not passed or invalid (less than 1 minute), using default value of 2 hours');
            _this.ttl = constants_1.Constants.SETTINGS_TTL;
        }
        else {
            _this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || constants_1.Constants.SETTINGS_TTL;
        }
        if (!(0, DataTypeUtil_1.isBoolean)(options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings)) {
            logger_1.LogManager.Instance.debug('AlwaysUseCachedSettings is not passed or invalid, using default value of false');
            _this.alwaysUseCachedSettings = false;
        }
        else {
            _this.alwaysUseCachedSettings = (options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings) || false;
        }
        return _this;
    }
    /**
     * Retrieves all stored data from the storage
     * @private
     * @returns {Record<string, StorageData>} Object containing all stored data
     */
    BrowserStorageConnector.prototype.getStoredData = function () {
        if (this.isDisabled)
            return {};
        try {
            var data = this.storage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        }
        catch (error) {
            logger_1.LogManager.Instance.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
            }, { an: constants_1.Constants.STORAGE });
            return {};
        }
    };
    /**
     * Saves data to the storage
     * @private
     * @param {Record<string, StorageData>} data - The data object to be stored
     */
    BrowserStorageConnector.prototype.storeData = function (data) {
        if (this.isDisabled)
            return;
        try {
            var serializedData = JSON.stringify(data);
            this.storage.setItem(this.storageKey, serializedData);
        }
        catch (error) {
            logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
            }, { an: constants_1.Constants.STORAGE });
        }
    };
    /**
     * Stores feature flag or experiment data for a specific user
     * @public
     * @param {StorageData} data - The data to be stored, containing feature flag or experiment information
     * @returns {Promise<void>} A promise that resolves when the data is successfully stored
     */
    BrowserStorageConnector.prototype.set = function (data) {
        var deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve();
        }
        else {
            try {
                var storedData = this.getStoredData();
                var key = "".concat(data.featureKey, "_").concat(data.userId);
                storedData[key] = data;
                this.storeData(storedData);
                logger_1.LogManager.Instance.info("Stored data in storage for key: ".concat(key));
                deferredObject.resolve();
            }
            catch (error) {
                logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                }, { an: constants_1.Constants.STORAGE });
                deferredObject.reject(error);
            }
        }
        return deferredObject.promise;
    };
    /**
     * Retrieves stored feature flag or experiment data for a specific user
     * @public
     * @param {string} featureKey - The key of the feature flag or experiment
     * @param {string} userId - The ID of the user
     * @returns {Promise<StorageData | Record<string, any>>} A promise that resolves to the stored data or {} if not found
     */
    BrowserStorageConnector.prototype.get = function (featureKey, userId) {
        var _a;
        var deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve({});
        }
        else {
            try {
                var storedData = this.getStoredData();
                var key = "".concat(featureKey, "_").concat(userId);
                var dataToReturn = (_a = storedData[key]) !== null && _a !== void 0 ? _a : {};
                logger_1.LogManager.Instance.info("Retrieved data from storage for key: ".concat(key));
                deferredObject.resolve(dataToReturn);
            }
            catch (error) {
                logger_1.LogManager.Instance.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                }, { an: constants_1.Constants.STORAGE });
                deferredObject.resolve({});
            }
        }
        return deferredObject.promise;
    };
    /**
     * Gets the settings from storage with TTL check and validates sdkKey and accountId
     * @public
     * @param {string} sdkKey - The sdkKey to match
     * @param {number|string} accountId - The accountId to match
     * @returns {Promise<ISettingsData>} A promise that resolves to the ISettingsData or empty object if not found
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    BrowserStorageConnector.prototype.getSettings = function (accountId, sdkKey) {
        var deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve({});
        }
        else {
            try {
                var storedData = this.getStoredData();
                var settingsData = storedData[this.SETTINGS_KEY];
                // Decode sdkKey if present
                if (settingsData && settingsData.settings && settingsData.settings.sdkKey) {
                    try {
                        settingsData.settings.sdkKey = atob(settingsData.settings.sdkKey);
                    }
                    catch (e) {
                        logger_1.LogManager.Instance.errorLog('ERROR_DECODING_SDK_KEY_FROM_STORAGE', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(e),
                        }, { an: constants_1.Constants.STORAGE });
                    }
                }
                deferredObject.resolve(settingsData);
            }
            catch (error) {
                deferredObject.resolve({});
            }
        }
        return deferredObject.promise;
    };
    /**
     * Sets the settings in storage with current timestamp
     * @public
     * @param {ISettingsData} data - The settings data to be stored
     * @returns {Promise<void>} A promise that resolves when the settings are successfully stored
     */
    BrowserStorageConnector.prototype.setSettings = function (data) {
        var deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve();
        }
        else {
            try {
                var storedData = this.getStoredData();
                if (data.settings && data.settings.sdkKey) {
                    data.settings.sdkKey = btoa(data.settings.sdkKey);
                }
                storedData[this.SETTINGS_KEY] = data;
                this.storeData(storedData);
                deferredObject.resolve();
            }
            catch (error) {
                deferredObject.reject(error);
            }
        }
        return deferredObject.promise;
    };
    return BrowserStorageConnector;
}(Connector_1.Connector));
exports.BrowserStorageConnector = BrowserStorageConnector;


/***/ }),

/***/ "./lib/packages/storage/index.ts":
/*!***************************************!*\
  !*** ./lib/packages/storage/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Storage = void 0;
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
var Storage_1 = __webpack_require__(/*! ./Storage */ "./lib/packages/storage/Storage.ts");
Object.defineProperty(exports, "Storage", ({ enumerable: true, get: function () { return Storage_1.Storage; } }));


/***/ }),

/***/ "./lib/services/BatchEventsQueue.ts":
/*!******************************************!*\
  !*** ./lib/services/BatchEventsQueue.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BatchEventsQueue = void 0;
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./lib/services/SettingsService.ts");
var BatchEventsQueue = /** @class */ (function () {
    /**
     * Constructor for the BatchEventsQueue
     * @param config - The configuration for the batch events queue
     */
    function BatchEventsQueue(config) {
        if (config === void 0) { config = {}; }
        this.queue = [];
        this.timer = null;
        this.isEdgeEnvironment = false;
        if ((0, DataTypeUtil_1.isBoolean)(config.isEdgeEnvironment)) {
            this.isEdgeEnvironment = config.isEdgeEnvironment;
        }
        if ((0, DataTypeUtil_1.isNumber)(config.requestTimeInterval) && config.requestTimeInterval >= 1) {
            this.requestTimeInterval = config.requestTimeInterval;
        }
        else {
            this.requestTimeInterval = constants_1.Constants.DEFAULT_REQUEST_TIME_INTERVAL;
            if (!this.isEdgeEnvironment) {
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
                    parameter: 'requestTimeInterval',
                    minLimit: 0,
                    defaultValue: this.requestTimeInterval.toString(),
                }));
            }
        }
        if ((0, DataTypeUtil_1.isNumber)(config.eventsPerRequest) &&
            config.eventsPerRequest > 0 &&
            config.eventsPerRequest <= constants_1.Constants.MAX_EVENTS_PER_REQUEST) {
            this.eventsPerRequest = config.eventsPerRequest;
        }
        else if (config.eventsPerRequest > constants_1.Constants.MAX_EVENTS_PER_REQUEST) {
            this.eventsPerRequest = constants_1.Constants.MAX_EVENTS_PER_REQUEST;
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_MAX_LIMIT, {
                parameter: 'eventsPerRequest',
                maxLimit: constants_1.Constants.MAX_EVENTS_PER_REQUEST.toString(),
            }));
        }
        else {
            this.eventsPerRequest = constants_1.Constants.DEFAULT_EVENTS_PER_REQUEST;
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
                parameter: 'eventsPerRequest',
                minLimit: 0,
                defaultValue: this.eventsPerRequest.toString(),
            }));
        }
        this.flushCallback = (0, DataTypeUtil_1.isFunction)(config.flushCallback) ? config.flushCallback : function () { };
        this.dispatcher = config.dispatcher;
        this.accountId = SettingsService_1.SettingsService.Instance.accountId;
        // In edge environments, automatic batching/timer is skipped; flushing is expected to be triggered manually
        if (!this.isEdgeEnvironment) {
            this.createNewBatchTimer();
        }
        BatchEventsQueue.instance = this;
        return this;
    }
    Object.defineProperty(BatchEventsQueue, "Instance", {
        /**
         * Gets the instance of the BatchEventsQueue
         * @returns The instance of the BatchEventsQueue
         */
        get: function () {
            return BatchEventsQueue.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Enqueues an event
     * @param payload - The event to enqueue
     */
    BatchEventsQueue.prototype.enqueue = function (payload) {
        // Enqueue the event in the queue
        this.queue.push(payload);
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_QUEUE, {
            queueType: 'batch',
            event: JSON.stringify(payload),
        }));
        // If the queue length is equal to or exceeds the events per request, flush the queue
        if (this.queue.length >= this.eventsPerRequest) {
            this.flush();
        }
    };
    /**
     * Flushes the queue
     * @param manual - Whether the flush is manual or not
     */
    BatchEventsQueue.prototype.flush = function (manual) {
        var _this = this;
        if (manual === void 0) { manual = false; }
        // If the queue is not empty, flush the queue
        if (this.queue.length) {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EVENT_BATCH_BEFORE_FLUSHING, {
                manually: manual ? 'manually' : '',
                length: this.queue.length,
                accountId: this.accountId,
                timer: manual ? 'Timer will be cleared and registered again' : '',
            }));
            var tempQueue_1 = this.queue;
            this.queue = [];
            return this.dispatcher(tempQueue_1, this.flushCallback)
                .then(function (result) {
                var _a;
                if (result.status === 'success') {
                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_After_FLUSHING, {
                        manually: manual ? 'manually' : '',
                        length: tempQueue_1.length,
                    }));
                    return result;
                }
                else {
                    (_a = _this.queue).push.apply(_a, tempQueue_1);
                    return result;
                }
            })
                .catch(function () {
                var _a;
                (_a = _this.queue).push.apply(_a, tempQueue_1);
                return { status: 'error', events: tempQueue_1 };
            });
        }
        else {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.BATCH_QUEUE_EMPTY));
            return new Promise(function (resolve) {
                resolve({ status: 'success', events: [] });
            });
        }
    };
    /**
     * Creates a new batch timer
     */
    BatchEventsQueue.prototype.createNewBatchTimer = function () {
        var _this = this;
        this.timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.flush()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, this.requestTimeInterval * 1000);
    };
    /**
     * Clears the request timer
     */
    BatchEventsQueue.prototype.clearRequestTimer = function () {
        clearTimeout(this.timer);
        this.timer = null;
    };
    /**
     * Flushes the queue and clears the timer
     */
    BatchEventsQueue.prototype.flushAndClearTimer = function () {
        var flushResult = this.flush(true);
        return flushResult;
    };
    return BatchEventsQueue;
}());
exports.BatchEventsQueue = BatchEventsQueue;
exports["default"] = BatchEventsQueue;


/***/ }),

/***/ "./lib/services/CampaignDecisionService.ts":
/*!*************************************************!*\
  !*** ./lib/services/CampaignDecisionService.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignDecisionService = void 0;
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
var decision_maker_1 = __webpack_require__(/*! ../packages/decision-maker */ "./lib/packages/decision-maker/index.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var segmentation_evaluator_1 = __webpack_require__(/*! ../packages/segmentation-evaluator */ "./lib/packages/segmentation-evaluator/index.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./lib/enums/CampaignTypeEnum.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var CampaignDecisionService = /** @class */ (function () {
    function CampaignDecisionService() {
    }
    /**
     * Calculate if this user should become part of the campaign or not
     *
     * @param {String} userId the unique ID assigned to a user
     * @param {Object} campaign fot getting the value of traffic allotted to the campaign
     *
     * @return {Boolean} if User is a part of Campaign or not
     */
    CampaignDecisionService.prototype.isUserPartOfCampaign = function (userId, campaign) {
        // if (!ValidateUtil.isValidValue(userId) || !campaign) {
        //   return false;
        // }
        if (!campaign || !userId) {
            return false;
        }
        // check if campaign is rollout or personalize
        var isRolloutOrPersonalize = campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
        // get salt
        var salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
        // get traffic allocation
        var trafficAllocation = isRolloutOrPersonalize ? campaign.getVariations()[0].getWeight() : campaign.getTraffic();
        // get bucket key
        var bucketKey = salt ? "".concat(salt, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(userId);
        // get bucket value for user
        var valueAssignedToUser = new decision_maker_1.DecisionMaker().getBucketValueForUser(bucketKey);
        // check if user is part of campaign
        var isUserPart = valueAssignedToUser !== 0 && valueAssignedToUser <= trafficAllocation;
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_PART_OF_CAMPAIGN, {
            userId: userId,
            notPart: isUserPart ? '' : 'not',
            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
        }));
        return isUserPart;
    };
    /**
     * Returns the Variation by checking the Start and End Bucket Allocations of each Variation
     *
     * @param {Object} campaign which contains the variations
     * @param {Number} bucketValue the bucket Value of the user
     *
     * @return {Object|null} variation data allotted to the user or null if not
     */
    CampaignDecisionService.prototype.getVariation = function (variations, bucketValue) {
        for (var i = 0; i < variations.length; i++) {
            var variation = variations[i];
            if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
                return variation;
            }
        }
        return null;
    };
    CampaignDecisionService.prototype.checkInRange = function (variation, bucketValue) {
        if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
            return variation;
        }
    };
    /**
     * Validates the User ID and generates Variation into which the User is bucketed in.
     *
     * @param {String} userId the unique ID assigned to User
     * @param {Object} campaign the Campaign of which User is a part of
     *
     * @return {Object|null} variation data into which user is bucketed in or null if not
     */
    CampaignDecisionService.prototype.bucketUserToVariation = function (userId, accountId, campaign) {
        var multiplier;
        if (!campaign || !userId) {
            return null;
        }
        if (campaign.getTraffic()) {
            multiplier = 1;
        }
        var percentTraffic = campaign.getTraffic();
        // get salt
        var salt = campaign.getSalt();
        // get bucket key
        var bucketKey = salt ? "".concat(salt, "_").concat(accountId, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(accountId, "_").concat(userId);
        // get hash value
        var hashValue = new decision_maker_1.DecisionMaker().generateHashValue(bucketKey);
        var bucketValue = new decision_maker_1.DecisionMaker().generateBucketValue(hashValue, constants_1.Constants.MAX_TRAFFIC_VALUE, multiplier);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USER_BUCKET_TO_VARIATION, {
            userId: userId,
            campaignKey: campaign.getKey(),
            percentTraffic: percentTraffic,
            bucketValue: bucketValue,
            hashValue: hashValue,
        }));
        return this.getVariation(campaign.getVariations(), bucketValue);
    };
    CampaignDecisionService.prototype.getPreSegmentationDecision = function (campaign, context) {
        return __awaiter(this, void 0, void 0, function () {
            var campaignType, segments, preSegmentationResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        campaignType = campaign.getType();
                        segments = {};
                        if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                            segments = campaign.getVariations()[0].getSegments();
                        }
                        else if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                            segments = campaign.getSegments();
                        }
                        if (!((0, DataTypeUtil_1.isObject)(segments) && !Object.keys(segments).length)) return [3 /*break*/, 1];
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_SKIP, {
                            userId: context.getId(),
                            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                ? campaign.getKey()
                                : campaign.getName() + '_' + campaign.getRuleKey(),
                        }));
                        return [2 /*return*/, true];
                    case 1: return [4 /*yield*/, segmentation_evaluator_1.SegmentationManager.Instance.validateSegmentation(segments, context.getCustomVariables())];
                    case 2:
                        preSegmentationResult = _a.sent();
                        if (!preSegmentationResult) {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                                userId: context.getId(),
                                campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                    ? campaign.getKey()
                                    : campaign.getName() + '_' + campaign.getRuleKey(),
                                status: 'failed',
                            }));
                            return [2 /*return*/, false];
                        }
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                            userId: context.getId(),
                            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                ? campaign.getKey()
                                : campaign.getName() + '_' + campaign.getRuleKey(),
                            status: 'passed',
                        }));
                        return [2 /*return*/, true];
                }
            });
        });
    };
    CampaignDecisionService.prototype.getVariationAlloted = function (userId, accountId, campaign) {
        var isUserPart = this.isUserPartOfCampaign(userId, campaign);
        if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
            if (isUserPart) {
                return campaign.getVariations()[0];
            }
            else {
                return null;
            }
        }
        else {
            if (isUserPart) {
                return this.bucketUserToVariation(userId, accountId, campaign);
            }
            else {
                return null;
            }
        }
    };
    return CampaignDecisionService;
}());
exports.CampaignDecisionService = CampaignDecisionService;


/***/ }),

/***/ "./lib/services/HooksService.ts":
/*!**************************************!*\
  !*** ./lib/services/HooksService.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var HooksService = /** @class */ (function () {
    function HooksService(options) {
        var _a;
        this.callback = (_a = options.integrations) === null || _a === void 0 ? void 0 : _a.callback;
        this.isCallBackFunction = (0, DataTypeUtil_1.isFunction)(this.callback);
        this.decision = {};
    }
    /**
     * Executes the callback
     * @param {Record<string, any>} properties Properties from the callback
     */
    HooksService.prototype.execute = function (properties) {
        if (this.isCallBackFunction) {
            this.callback(properties);
        }
    };
    /**
     * Sets properties to the decision object
     * @param {Record<string, any>} properties Properties to set
     */
    HooksService.prototype.set = function (properties) {
        if (this.isCallBackFunction) {
            this.decision = properties;
        }
    };
    /**
     * Retrieves the decision object
     * @returns {Record<string, any>} The decision object
     */
    HooksService.prototype.get = function () {
        return this.decision;
    };
    return HooksService;
}());
exports["default"] = HooksService;


/***/ }),

/***/ "./lib/services/SettingsService.ts":
/*!*****************************************!*\
  !*** ./lib/services/SettingsService.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsService = void 0;
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./lib/packages/network-layer/index.ts");
var PromiseUtil_1 = __webpack_require__(/*! ../utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var Url_1 = __webpack_require__(/*! ../constants/Url */ "./lib/constants/Url.ts");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./lib/enums/HttpMethodEnum.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var SettingsSchemaValidation_1 = __webpack_require__(/*! ../models/schemas/SettingsSchemaValidation */ "./lib/models/schemas/SettingsSchemaValidation.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var NetworkUtil_1 = __webpack_require__(/*! ../utils/NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var DebuggerServiceUtil_1 = __webpack_require__(/*! ../utils/DebuggerServiceUtil */ "./lib/utils/DebuggerServiceUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var StorageService_1 = __webpack_require__(/*! ./StorageService */ "./lib/services/StorageService.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var SettingsService = /** @class */ (function () {
    function SettingsService(options) {
        var _a, _b, _c, _d, _e, _f;
        this.isGatewayServiceProvided = false;
        this.settingsFetchTime = undefined; //time taken to fetch the settings
        this.isSettingsValid = false;
        this.proxyProvided = false;
        this.isStorageServiceProvided = false;
        this.isEdgeEnvironment = false;
        this.gatewayServiceConfig = {
            hostname: null,
            protocol: null,
            port: null,
        };
        this.sdkKey = options.sdkKey;
        this.accountId = options.accountId;
        this.expiry = ((_a = options === null || options === void 0 ? void 0 : options.settings) === null || _a === void 0 ? void 0 : _a.expiry) || constants_1.Constants.SETTINGS_EXPIRY;
        this.networkTimeout = ((_b = options === null || options === void 0 ? void 0 : options.settings) === null || _b === void 0 ? void 0 : _b.timeout) || constants_1.Constants.SETTINGS_TIMEOUT;
        this.isStorageServiceProvided = (options === null || options === void 0 ? void 0 : options.isStorageServiceProvided) || false;
        if ((options === null || options === void 0 ? void 0 : options.edgeConfig) && Object.keys(options === null || options === void 0 ? void 0 : options.edgeConfig).length > 0) {
            this.isEdgeEnvironment = true;
        }
        // if sdk is running in browser environment then set isGatewayServiceProvided to true
        // when gatewayService is not provided then we dont update the url and let it point to dacdn by default
        // Check if sdk running in browser and not in edge/serverless environment
        if ( true && typeof XMLHttpRequest !== 'undefined') {
            this.isGatewayServiceProvided = true;
            // Handle proxyUrl for browser environment
            if (options === null || options === void 0 ? void 0 : options.proxyUrl) {
                this.proxyProvided = true;
                var parsedUrl = void 0;
                if (options.proxyUrl.startsWith(Url_1.HTTP_PROTOCOL) || options.proxyUrl.startsWith(Url_1.HTTPS_PROTOCOL)) {
                    parsedUrl = new URL("".concat(options.proxyUrl));
                }
                else {
                    parsedUrl = new URL("".concat(Url_1.HTTPS_PROTOCOL).concat(options.proxyUrl));
                }
                this.hostname = parsedUrl.hostname;
                this.protocol = parsedUrl.protocol.replace(':', '');
                if (parsedUrl.port) {
                    this.port = parseInt(parsedUrl.port);
                }
            }
        }
        //if gateway is provided and proxy is not provided then only we will replace the hostname, protocol and port
        if ((_c = options === null || options === void 0 ? void 0 : options.gatewayService) === null || _c === void 0 ? void 0 : _c.url) {
            var parsedUrl = void 0;
            this.isGatewayServiceProvided = true;
            if (options.gatewayService.url.startsWith(Url_1.HTTP_PROTOCOL) ||
                options.gatewayService.url.startsWith(Url_1.HTTPS_PROTOCOL)) {
                parsedUrl = new URL("".concat(options.gatewayService.url));
            }
            else if ((_d = options.gatewayService) === null || _d === void 0 ? void 0 : _d.protocol) {
                parsedUrl = new URL("".concat(options.gatewayService.protocol, "://").concat(options.gatewayService.url));
            }
            else {
                parsedUrl = new URL("".concat(Url_1.HTTPS_PROTOCOL).concat(options.gatewayService.url));
            }
            // dont replace the hostname, protocol and port if proxy is provided
            if (!this.proxyProvided) {
                this.hostname = parsedUrl.hostname;
                this.protocol = parsedUrl.protocol.replace(':', '');
                if (parsedUrl.port) {
                    this.port = parseInt(parsedUrl.port);
                }
                else if ((_e = options.gatewayService) === null || _e === void 0 ? void 0 : _e.port) {
                    this.port = options.gatewayService.port;
                }
            }
            else {
                this.gatewayServiceConfig.hostname = parsedUrl.hostname;
                this.gatewayServiceConfig.protocol = parsedUrl.protocol.replace(':', '');
                if (parsedUrl.port) {
                    this.gatewayServiceConfig.port = parseInt(parsedUrl.port);
                }
                else if ((_f = options.gatewayService) === null || _f === void 0 ? void 0 : _f.port) {
                    this.gatewayServiceConfig.port = options.gatewayService.port;
                }
            }
        }
        else {
            if (!this.proxyProvided) {
                this.hostname = constants_1.Constants.HOST_NAME;
            }
        }
        // if (this.expiry > 0) {
        //   this.setSettingsExpiry();
        // }
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: 'Settings Manager',
        }));
        SettingsService.instance = this;
    }
    Object.defineProperty(SettingsService, "Instance", {
        get: function () {
            return SettingsService.instance;
        },
        enumerable: false,
        configurable: true
    });
    SettingsService.prototype.normalizeSettings = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedSettings;
            return __generator(this, function (_a) {
                normalizedSettings = __assign({}, settings);
                if (!normalizedSettings.features || Object.keys(normalizedSettings.features).length === 0) {
                    normalizedSettings.features = [];
                }
                if (!normalizedSettings.campaigns || Object.keys(normalizedSettings.campaigns).length === 0) {
                    normalizedSettings.campaigns = [];
                }
                return [2 /*return*/, normalizedSettings];
            });
        });
    };
    SettingsService.prototype.fetchSettings = function (isViaWebhook, apiName) {
        var _this = this;
        if (isViaWebhook === void 0) { isViaWebhook = false; }
        if (apiName === void 0) { apiName = ApiEnum_1.ApiEnum.INIT; }
        var deferredObject = new PromiseUtil_1.Deferred();
        if (!this.sdkKey || !this.accountId) {
            deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
        }
        var networkInstance = network_layer_1.NetworkManager.Instance;
        var options = (0, NetworkUtil_1.getSettingsPath)(this.sdkKey, this.accountId);
        var retryConfig = networkInstance.getRetryConfig();
        options.platform = constants_1.Constants.PLATFORM;
        options.sn = constants_1.Constants.SDK_NAME;
        options.sv = constants_1.Constants.SDK_VERSION;
        options['api-version'] = constants_1.Constants.API_VERSION;
        if (!networkInstance.getConfig().getDevelopmentMode()) {
            options.s = 'prod';
        }
        var path = constants_1.Constants.SETTINGS_ENDPOINT;
        if (isViaWebhook) {
            path = constants_1.Constants.WEBHOOK_SETTINGS_ENDPOINT;
        }
        try {
            //record the current timestamp
            var startTime_1 = Date.now();
            var request = new network_layer_1.RequestModel(this.hostname, HttpMethodEnum_1.HttpMethodEnum.GET, path, options, null, null, this.protocol, this.port, retryConfig);
            request.setTimeout(this.networkTimeout);
            networkInstance
                .get(request)
                .then(function (response) {
                //record the timestamp when the response is received
                _this.settingsFetchTime = Date.now() - startTime_1;
                // if attempt is more than 0
                if (response.getTotalAttempts() > 0) {
                    var debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(response, '', isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName, path);
                    // send debug event
                    (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                }
                deferredObject.resolve(response.getData());
            })
                .catch(function (err) {
                var debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(err, '', isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName, path);
                // send debug event
                (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                deferredObject.reject(err);
            });
            return deferredObject.promise;
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName }, false);
            deferredObject.reject(err);
            return deferredObject.promise;
        }
    };
    /**
     * Gets the settings, fetching them if not cached from storage or server.
     s* @returns {Promise<Record<any, any>>} A promise that resolves to the settings.
     */
    SettingsService.prototype.getSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, storageService, cachedSettings, freshSettings, normalizedSettings, freshSettings, normalizedSettings, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deferredObject = new PromiseUtil_1.Deferred();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 14]);
                        if (!this.isStorageServiceProvided) return [3 /*break*/, 9];
                        storageService = new StorageService_1.StorageService();
                        return [4 /*yield*/, storageService.getSettingsFromStorage(this.accountId, this.sdkKey, !this.isEdgeEnvironment)];
                    case 2:
                        cachedSettings = _a.sent();
                        if (!(cachedSettings && !(0, DataTypeUtil_1.isEmptyObject)(cachedSettings))) return [3 /*break*/, 3];
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_FROM_CACHE));
                        deferredObject.resolve(cachedSettings);
                        return [3 /*break*/, 8];
                    case 3:
                        // if no cached settings are found, fetch fresh settings from server
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_CACHE_MISS));
                        return [4 /*yield*/, this.fetchSettings()];
                    case 4:
                        freshSettings = _a.sent();
                        return [4 /*yield*/, this.normalizeSettings(freshSettings)];
                    case 5:
                        normalizedSettings = _a.sent();
                        // check if the settings are valid
                        this.isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings);
                        if (!this.isSettingsValid) return [3 /*break*/, 7];
                        // if settings are valid, set the settings in storage
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
                        return [4 /*yield*/, storageService.setSettingsInStorage(this.accountId, this.sdkKey, normalizedSettings)];
                    case 6:
                        _a.sent();
                        deferredObject.resolve(normalizedSettings);
                        return [3 /*break*/, 8];
                    case 7:
                        logger_1.LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.INIT }, false);
                        deferredObject.resolve({});
                        _a.label = 8;
                    case 8: return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, this.fetchSettings()];
                    case 10:
                        freshSettings = _a.sent();
                        return [4 /*yield*/, this.normalizeSettings(freshSettings)];
                    case 11:
                        normalizedSettings = _a.sent();
                        this.isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings);
                        if (this.isSettingsValid) {
                            logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
                            deferredObject.resolve(normalizedSettings);
                        }
                        else {
                            logger_1.LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.INIT }, false);
                            deferredObject.resolve({});
                        }
                        _a.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_1 = _a.sent();
                        logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(error_1),
                        }, { an: ApiEnum_1.ApiEnum.INIT }, false);
                        deferredObject.resolve({});
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    return SettingsService;
}());
exports.SettingsService = SettingsService;


/***/ }),

/***/ "./lib/services/StorageService.ts":
/*!****************************************!*\
  !*** ./lib/services/StorageService.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StorageService = void 0;
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
var StorageEnum_1 = __webpack_require__(/*! ../enums/StorageEnum */ "./lib/enums/StorageEnum.ts");
var storage_1 = __webpack_require__(/*! ../packages/storage */ "./lib/packages/storage/index.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ../utils/PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var FunctionUtil_1 = __webpack_require__(/*! ../utils/FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var SettingsService_1 = __webpack_require__(/*! ./SettingsService */ "./lib/services/SettingsService.ts");
var SettingsSchemaValidation_1 = __webpack_require__(/*! ../models/schemas/SettingsSchemaValidation */ "./lib/models/schemas/SettingsSchemaValidation.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var StorageService = /** @class */ (function () {
    function StorageService() {
        this.storageData = {};
    }
    /**
     * Retrieves data from storage based on the feature key and user ID.
     * @param featureKey The key to identify the feature data.
     * @param user The user object containing at least an ID.
     * @returns A promise that resolves to the data retrieved or an error/storage status enum.
     */
    StorageService.prototype.getDataInStorage = function (featureKey, context) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, storageInstance;
            return __generator(this, function (_a) {
                deferredObject = new PromiseUtil_1.Deferred();
                storageInstance = storage_1.Storage.Instance.getConnector();
                // Check if the storage instance is available
                if ((0, DataTypeUtil_1.isNull)(storageInstance) || (0, DataTypeUtil_1.isUndefined)(storageInstance)) {
                    deferredObject.resolve(StorageEnum_1.StorageEnum.STORAGE_UNDEFINED);
                }
                else {
                    storageInstance
                        .get(featureKey, context.getId())
                        .then(function (data) {
                        deferredObject.resolve(data);
                    })
                        .catch(function (err) {
                        logger_1.LogManager.Instance.errorLog('ERROR_READING_STORED_DATA_IN_STORAGE', { err: err }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
                        deferredObject.resolve(StorageEnum_1.StorageEnum.NO_DATA_FOUND);
                    });
                }
                return [2 /*return*/, deferredObject.promise];
            });
        });
    };
    /**
     * Stores data in the storage.
     * @param data The data to be stored as a record.
     * @returns A promise that resolves to true if data is successfully stored, otherwise false.
     */
    StorageService.prototype.setDataInStorage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, storageInstance;
            return __generator(this, function (_a) {
                deferredObject = new PromiseUtil_1.Deferred();
                storageInstance = storage_1.Storage.Instance.getConnector();
                // Check if the storage instance is available
                if (storageInstance === null || storageInstance === undefined) {
                    deferredObject.resolve(false);
                }
                else {
                    storageInstance
                        .set(data)
                        .then(function () {
                        deferredObject.resolve(true);
                    })
                        .catch(function () {
                        deferredObject.resolve(false);
                    });
                }
                return [2 /*return*/, deferredObject.promise];
            });
        });
    };
    /**
     * Gets the settings from storage.
     * @param accountId The account ID.
     * @param sdkKey The SDK key.
     * @returns {Promise<Record<string, any>>} A promise that resolves to the settings or empty object if not found.
     */
    StorageService.prototype.getSettingsFromStorage = function (accountId_1, sdkKey_1) {
        return __awaiter(this, arguments, void 0, function (accountId, sdkKey, shouldFetchFreshSettings) {
            var deferredObject, storageInstance, settingsData, settings, timestamp, shouldUseCachedSettings, currentTime, settingsTTL, error_1;
            var _a;
            if (shouldFetchFreshSettings === void 0) { shouldFetchFreshSettings = true; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        deferredObject = new PromiseUtil_1.Deferred();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        storageInstance = storage_1.Storage.Instance.getConnector();
                        if (!(storageInstance && typeof storageInstance.getSettings === 'function')) return [3 /*break*/, 3];
                        return [4 /*yield*/, storageInstance.getSettings(accountId, sdkKey)];
                    case 2:
                        settingsData = _b.sent();
                        if (!settingsData || (0, DataTypeUtil_1.isEmptyObject)(settingsData)) {
                            // if no settings data is found, resolve the promise with empty object
                            deferredObject.resolve({});
                            return [2 /*return*/, deferredObject.promise];
                        }
                        settings = settingsData.settings, timestamp = settingsData.timestamp;
                        // Check for sdkKey and accountId match
                        if (!settings || settings.sdkKey !== sdkKey || String((_a = settings.accountId) !== null && _a !== void 0 ? _a : settings.a) !== String(accountId)) {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_CACHE_MISS_KEY_ACCOUNT_ID_MISMATCH));
                            deferredObject.resolve({});
                            return [2 /*return*/, deferredObject.promise];
                        }
                        shouldUseCachedSettings = storageInstance.alwaysUseCachedSettings || constants_1.Constants.ALWAYS_USE_CACHED_SETTINGS;
                        if (shouldUseCachedSettings) {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_USING_CACHED_SETTINGS));
                            deferredObject.resolve(settings);
                            return [2 /*return*/, deferredObject.promise];
                        }
                        currentTime = Date.now();
                        settingsTTL = storageInstance.ttl || constants_1.Constants.SETTINGS_TTL;
                        // check if the settings are expired based on the last updated timestamp
                        if (currentTime - timestamp > settingsTTL) {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_EXPIRED));
                            deferredObject.resolve({});
                        }
                        else {
                            // if settings are not expired, then return the existing settings and update the settings in storage with new timestamp
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_RETRIEVED_FROM_STORAGE));
                            if (shouldFetchFreshSettings) {
                                // if shouldFetchFreshSettings is true, then fetch fresh settings asynchronously and update the storage with new timestamp
                                this.setFreshSettingsInStorage(accountId, sdkKey);
                            }
                            // decode sdkKey if present in the settings
                            if (settings && settings.sdkKey) {
                                try {
                                    settings.sdkKey = atob(settings.sdkKey);
                                }
                                catch (e) {
                                    logger_1.LogManager.Instance.errorLog('ERROR_DECODING_SDK_KEY_FROM_STORAGE', {
                                        err: (0, FunctionUtil_1.getFormattedErrorMessage)(e),
                                    }, { an: constants_1.Constants.STORAGE });
                                }
                            }
                            deferredObject.resolve(settings);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        deferredObject.resolve({});
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        logger_1.LogManager.Instance.errorLog('ERROR_READING_SETTINGS_FROM_STORAGE', { err: (0, FunctionUtil_1.getFormattedErrorMessage)(error_1) }, { an: constants_1.Constants.STORAGE });
                        deferredObject.resolve({});
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    /**
     * Sets the settings in storage.
     * @param accountId The account ID.
     * @param sdkKey The SDK key.
     * @param settings The settings to be stored.
     * @returns {Promise<void>} A promise that resolves when the settings are successfully stored.
     */
    StorageService.prototype.setSettingsInStorage = function (accountId, sdkKey, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, storageInstance, clonedSettings, settingsToStore, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deferredObject = new PromiseUtil_1.Deferred();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        storageInstance = storage_1.Storage.Instance.getConnector();
                        if (!(storageInstance && typeof storageInstance.setSettings === 'function')) return [3 /*break*/, 3];
                        clonedSettings = __assign({}, settings);
                        settingsToStore = { settings: clonedSettings, timestamp: Date.now() };
                        // set the settings in storage
                        return [4 /*yield*/, storageInstance.setSettings(settingsToStore)];
                    case 2:
                        // set the settings in storage
                        _a.sent();
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_SUCCESSFULLY_STORED));
                        deferredObject.resolve();
                        return [3 /*break*/, 4];
                    case 3:
                        deferredObject.resolve();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        logger_1.LogManager.Instance.errorLog('ERROR_STORING_SETTINGS_IN_STORAGE', { err: (0, FunctionUtil_1.getFormattedErrorMessage)(error_2) }, { an: constants_1.Constants.STORAGE });
                        deferredObject.resolve();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    /**
     * Fetches fresh settings and updates the storage with a new timestamp
     */
    StorageService.prototype.setFreshSettingsInStorage = function (accountId, sdkKey) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, settingsService, storageInstance;
            var _this = this;
            return __generator(this, function (_a) {
                deferredObject = new PromiseUtil_1.Deferred();
                settingsService = SettingsService_1.SettingsService.Instance;
                storageInstance = storage_1.Storage.Instance.getConnector();
                if (settingsService && storageInstance && typeof storageInstance.setSettings === 'function') {
                    settingsService
                        .fetchSettings()
                        .then(function (freshSettings) { return __awaiter(_this, void 0, void 0, function () {
                        var isSettingsValid;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!freshSettings) return [3 /*break*/, 2];
                                    isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(freshSettings);
                                    if (!isSettingsValid) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.setSettingsInStorage(accountId, sdkKey, freshSettings)];
                                case 1:
                                    _a.sent();
                                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_UPDATED_WITH_FRESH_DATA));
                                    _a.label = 2;
                                case 2:
                                    deferredObject.resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        logger_1.LogManager.Instance.errorLog('ERROR_STORING_FRESH_SETTINGS_IN_STORAGE', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                        }, { an: constants_1.Constants.STORAGE });
                        deferredObject.resolve();
                    });
                    return [2 /*return*/, deferredObject.promise];
                }
                return [2 /*return*/];
            });
        });
    };
    return StorageService;
}());
exports.StorageService = StorageService;


/***/ }),

/***/ "./lib/utils sync recursive":
/*!*************************!*\
  !*** ./lib/utils/ sync ***!
  \*************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./lib/utils sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./lib/utils/AliasingUtil.ts":
/*!***********************************!*\
  !*** ./lib/utils/AliasingUtil.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AliasingUtil = void 0;
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./lib/packages/network-layer/index.ts");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./lib/services/SettingsService.ts");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./lib/enums/HttpMethodEnum.ts");
var UrlEnum_1 = __webpack_require__(/*! ../enums/UrlEnum */ "./lib/enums/UrlEnum.ts");
var PromiseUtil_1 = __webpack_require__(/*! ./PromiseUtil */ "./lib/utils/PromiseUtil.ts");
/**
 * Utility class for handling alias operations through network calls to gateway
 */
var AliasingUtil = /** @class */ (function () {
    function AliasingUtil() {
    }
    /**
     * Retrieves alias for a given user ID
     * @param userId - The user identifier
     * @returns Promise<any | null> - The response from the gateway
     */
    AliasingUtil.getAlias = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, gatewayServiceUrl, gatewayServicePort, gatewayServiceProtocol, retryConfig, queryParams, request;
            var _a, _b;
            return __generator(this, function (_c) {
                deferredObject = new PromiseUtil_1.Deferred();
                try {
                    gatewayServiceUrl = null;
                    gatewayServicePort = null;
                    gatewayServiceProtocol = null;
                    retryConfig = network_layer_1.NetworkManager.Instance.getRetryConfig();
                    if (SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname != null) {
                        gatewayServiceUrl = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname;
                        gatewayServicePort = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.port;
                        gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.protocol;
                    }
                    else {
                        gatewayServiceUrl = SettingsService_1.SettingsService.Instance.hostname;
                        gatewayServicePort = SettingsService_1.SettingsService.Instance.port;
                        gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.protocol;
                    }
                    queryParams = {};
                    queryParams['accountId'] = (_a = SettingsService_1.SettingsService.Instance) === null || _a === void 0 ? void 0 : _a.accountId;
                    queryParams['sdkKey'] = (_b = SettingsService_1.SettingsService.Instance) === null || _b === void 0 ? void 0 : _b.sdkKey;
                    // Backend expects userId as JSON array
                    queryParams[this.KEY_USER_ID] = JSON.stringify([userId]);
                    request = new network_layer_1.RequestModel(gatewayServiceUrl, HttpMethodEnum_1.HttpMethodEnum.GET, this.GET_ALIAS_URL, queryParams, null, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
                    // Perform the network GET request
                    network_layer_1.NetworkManager.Instance.get(request)
                        .then(function (response) {
                        // Resolve the deferred object with the response
                        deferredObject.resolve(response.getData());
                    })
                        .catch(function (err) {
                        // Reject the deferred object with the error response
                        deferredObject.reject(err);
                    });
                    return [2 /*return*/, deferredObject.promise];
                }
                catch (error) {
                    // Resolve the promise with false as fallback
                    deferredObject.resolve(false);
                    return [2 /*return*/, deferredObject.promise];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Sets alias for a given user ID
     * @param userId - The user identifier
     * @param aliasId - The alias identifier to set
     * @returns Promise<ResponseModel | null> - The response from the gateway
     */
    AliasingUtil.setAlias = function (userId, aliasId) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, gatewayServiceUrl, gatewayServicePort, gatewayServiceProtocol, retryConfig, queryParams, requestBody, request;
            var _a;
            var _b, _c;
            return __generator(this, function (_d) {
                deferredObject = new PromiseUtil_1.Deferred();
                try {
                    gatewayServiceUrl = null;
                    gatewayServicePort = null;
                    gatewayServiceProtocol = null;
                    retryConfig = network_layer_1.NetworkManager.Instance.getRetryConfig();
                    if (SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname != null) {
                        gatewayServiceUrl = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname;
                        gatewayServicePort = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.port;
                        gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.protocol;
                    }
                    else {
                        gatewayServiceUrl = SettingsService_1.SettingsService.Instance.hostname;
                        gatewayServicePort = SettingsService_1.SettingsService.Instance.port;
                        gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.protocol;
                    }
                    queryParams = {};
                    queryParams['accountId'] = (_b = SettingsService_1.SettingsService.Instance) === null || _b === void 0 ? void 0 : _b.accountId;
                    queryParams['sdkKey'] = (_c = SettingsService_1.SettingsService.Instance) === null || _c === void 0 ? void 0 : _c.sdkKey;
                    queryParams[this.KEY_USER_ID] = userId;
                    queryParams[this.KEY_ALIAS_ID] = aliasId;
                    requestBody = (_a = {},
                        _a[this.KEY_USER_ID] = userId,
                        _a[this.KEY_ALIAS_ID] = aliasId,
                        _a);
                    request = new network_layer_1.RequestModel(gatewayServiceUrl, HttpMethodEnum_1.HttpMethodEnum.POST, this.SET_ALIAS_URL, queryParams, requestBody, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
                    // Perform the network POST request
                    network_layer_1.NetworkManager.Instance.post(request)
                        .then(function (response) {
                        // Resolve the deferred object with the response
                        deferredObject.resolve(response.getData());
                    })
                        .catch(function (err) {
                        // Reject the deferred object with the error response
                        deferredObject.reject(err);
                    });
                    return [2 /*return*/, deferredObject.promise];
                }
                catch (error) {
                    // Resolve the promise with false as fallback
                    deferredObject.resolve(false);
                    return [2 /*return*/, deferredObject.promise];
                }
                return [2 /*return*/];
            });
        });
    };
    AliasingUtil.KEY_USER_ID = 'userId';
    AliasingUtil.KEY_ALIAS_ID = 'aliasId';
    // Alias API endpoints
    AliasingUtil.GET_ALIAS_URL = UrlEnum_1.UrlEnum.GET_ALIAS;
    AliasingUtil.SET_ALIAS_URL = UrlEnum_1.UrlEnum.SET_ALIAS;
    return AliasingUtil;
}());
exports.AliasingUtil = AliasingUtil;


/***/ }),

/***/ "./lib/utils/BatchEventsDispatcher.ts":
/*!********************************************!*\
  !*** ./lib/utils/BatchEventsDispatcher.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BatchEventsDispatcher = void 0;
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./lib/packages/network-layer/index.ts");
var UrlUtil_1 = __webpack_require__(/*! ./UrlUtil */ "./lib/utils/UrlUtil.ts");
var network_layer_2 = __webpack_require__(/*! ../packages/network-layer */ "./lib/packages/network-layer/index.ts");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./lib/enums/HttpMethodEnum.ts");
var UrlEnum_1 = __webpack_require__(/*! ../enums/UrlEnum */ "./lib/enums/UrlEnum.ts");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./lib/services/SettingsService.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ./PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var DebuggerServiceUtil_1 = __webpack_require__(/*! ./DebuggerServiceUtil */ "./lib/utils/DebuggerServiceUtil.ts");
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var BatchEventsDispatcher = /** @class */ (function () {
    function BatchEventsDispatcher() {
    }
    BatchEventsDispatcher.dispatch = function (payload, flushCallback, queryParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostApiRequest(queryParams, payload, flushCallback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Sends a POST request to the server.
     * @param properties - The properties of the request.
     * @param payload - The payload of the request.
     * @returns A promise that resolves to a void.
     */
    BatchEventsDispatcher.sendPostApiRequest = function (properties, payload, flushCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var deferred, networkManager, retryConfig, headers, baseUrl, request, _a, variationShownCount, setAttributeCount, customEventCount, extraData;
            var _this = this;
            return __generator(this, function (_b) {
                deferred = new PromiseUtil_1.Deferred();
                networkManager = network_layer_2.NetworkManager.Instance;
                retryConfig = networkManager.getRetryConfig();
                headers = {};
                headers['Authorization'] = SettingsService_1.SettingsService.Instance.sdkKey;
                baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
                baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
                request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.BATCH_EVENTS, properties, payload, headers, SettingsService_1.SettingsService.Instance.protocol, SettingsService_1.SettingsService.Instance.port, retryConfig);
                _a = this.extractEventCounts(payload), variationShownCount = _a.variationShownCount, setAttributeCount = _a.setAttributeCount, customEventCount = _a.customEventCount;
                extraData = "".concat(constants_1.Constants.BATCH_EVENTS, " having ");
                if (variationShownCount > 0) {
                    extraData += "getFlag events: ".concat(variationShownCount, ", ");
                }
                if (customEventCount > 0) {
                    extraData += "conversion events: ".concat(customEventCount, ", ");
                }
                if (setAttributeCount > 0) {
                    extraData += "setAttribute events: ".concat(setAttributeCount, ", ");
                }
                try {
                    network_layer_2.NetworkManager.Instance.post(request)
                        .then(function (response) {
                        if (response.getTotalAttempts() > 0) {
                            var debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(response, '', constants_1.Constants.BATCH_EVENTS, extraData);
                            // send debug event
                            (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                        }
                        var batchApiResult = _this.handleBatchResponse(UrlEnum_1.UrlEnum.BATCH_EVENTS, payload, properties, null, response, flushCallback);
                        deferred.resolve(batchApiResult);
                    })
                        .catch(function (err) {
                        var debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(err, '', constants_1.Constants.BATCH_EVENTS, extraData);
                        // send debug event
                        (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                        var batchApiResult = _this.handleBatchResponse(UrlEnum_1.UrlEnum.BATCH_EVENTS, payload, properties, null, err, flushCallback);
                        deferred.resolve(batchApiResult);
                    });
                    return [2 /*return*/, deferred.promise];
                }
                catch (error) {
                    logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                        apiName: constants_1.Constants.BATCH_EVENTS,
                        err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                    }, { an: constants_1.Constants.BATCH_EVENTS });
                    deferred.resolve({ status: 'error', events: payload });
                    return [2 /*return*/, deferred.promise];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handles the response from batch events API call
     * @param properties - Request properties containing events
     * @param queryParams - Query parameters from the request
     * @param error - Error object if request failed
     * @param res - Response object from the API
     * @param rawData - Raw response data
     * @param callback - Callback function to handle the result
     */
    BatchEventsDispatcher.handleBatchResponse = function (endPoint, payload, queryParams, err, res, callback) {
        var eventsPerRequest = payload.ev.length;
        var accountId = queryParams.a;
        var error = err ? err : res === null || res === void 0 ? void 0 : res.getError();
        if (error && !(error instanceof Error)) {
            if ((0, DataTypeUtil_1.isString)(error)) {
                error = new Error(error);
            }
            else if (error instanceof Object) {
                error = new Error(JSON.stringify(error));
            }
        }
        if (error) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPRESSION_BATCH_FAILED));
            logger_1.LogManager.Instance.errorLog('NETWORK_CALL_FAILED', {
                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                err: error.message,
            }, {}, false);
            callback(error, payload);
            return { status: 'error', events: payload };
        }
        var statusCode = res === null || res === void 0 ? void 0 : res.getStatusCode();
        if (statusCode === 200) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPRESSION_BATCH_SUCCESS, {
                accountId: accountId,
                endPoint: endPoint,
            }));
            callback(null, payload);
            return { status: 'success', events: payload };
        }
        if (statusCode === 413) {
            logger_1.LogManager.Instance.errorLog('CONFIG_BATCH_EVENT_LIMIT_EXCEEDED', {
                accountId: accountId,
                endPoint: endPoint,
                eventsPerRequest: eventsPerRequest,
            }, {}, false);
            logger_1.LogManager.Instance.errorLog('NETWORK_CALL_FAILED', {
                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                err: error.message,
            }, {}, false);
            callback(error, payload);
            return { status: 'error', events: payload };
        }
        logger_1.LogManager.Instance.errorLog('IMPRESSION_BATCH_FAILED', {}, {}, false);
        logger_1.LogManager.Instance.errorLog('NETWORK_CALL_FAILED', {
            method: HttpMethodEnum_1.HttpMethodEnum.POST,
            err: error.message,
        }, {}, false);
        callback(error, payload);
        return { status: 'error', events: payload };
    };
    BatchEventsDispatcher.extractEventCounts = function (payload) {
        var _a, _b, _c;
        var counts = { variationShownCount: 0, setAttributeCount: 0, customEventCount: 0 };
        var standardEventNames = new Set(Object.values(EventEnum_1.EventEnum));
        var events = (_a = payload === null || payload === void 0 ? void 0 : payload.ev) !== null && _a !== void 0 ? _a : [];
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var entry = events_1[_i];
            var name_1 = (_c = (_b = entry === null || entry === void 0 ? void 0 : entry.d) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.name;
            if (!name_1) {
                continue;
            }
            if (name_1 === EventEnum_1.EventEnum.VWO_VARIATION_SHOWN) {
                counts.variationShownCount += 1;
                continue;
            }
            if (name_1 === EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP) {
                counts.setAttributeCount += 1;
                continue;
            }
            if (!standardEventNames.has(name_1)) {
                counts.customEventCount += 1;
            }
        }
        return counts;
    };
    return BatchEventsDispatcher;
}());
exports.BatchEventsDispatcher = BatchEventsDispatcher;
exports["default"] = BatchEventsDispatcher;


/***/ }),

/***/ "./lib/utils/CampaignUtil.ts":
/*!***********************************!*\
  !*** ./lib/utils/CampaignUtil.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setVariationAllocation = setVariationAllocation;
exports.assignRangeValues = assignRangeValues;
exports.scaleVariationWeights = scaleVariationWeights;
exports.getBucketingSeed = getBucketingSeed;
exports.getVariationFromCampaignKey = getVariationFromCampaignKey;
exports.getCampaignKeyFromCampaignId = getCampaignKeyFromCampaignId;
exports.getVariationNameFromCampaignIdAndVariationId = getVariationNameFromCampaignIdAndVariationId;
exports.getCampaignTypeFromCampaignId = getCampaignTypeFromCampaignId;
exports.setCampaignAllocation = setCampaignAllocation;
exports.getGroupDetailsIfCampaignPartOfIt = getGroupDetailsIfCampaignPartOfIt;
exports.getCampaignsByGroupId = getCampaignsByGroupId;
exports.getFeatureKeysFromCampaignIds = getFeatureKeysFromCampaignIds;
exports.getCampaignIdsFromFeatureKey = getCampaignIdsFromFeatureKey;
exports.assignRangeValuesMEG = assignRangeValuesMEG;
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
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./lib/enums/CampaignTypeEnum.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var VariationModel_1 = __webpack_require__(/*! ../models/campaign/VariationModel */ "./lib/models/campaign/VariationModel.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
/**
 * Sets the variation allocation for a given campaign based on its type.
 * If the campaign type is ROLLOUT or PERSONALIZE, it handles the campaign using `_handleRolloutCampaign`.
 * Otherwise, it assigns range values to each variation in the campaign.
 * @param {CampaignModel} campaign - The campaign for which to set the variation allocation.
 */
function setVariationAllocation(campaign) {
    // Check if the campaign type is ROLLOUT or PERSONALIZE
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
        _handleRolloutCampaign(campaign);
    }
    else {
        var currentAllocation_1 = 0;
        // Iterate over each variation in the campaign
        campaign.getVariations().forEach(function (variation) {
            // Assign range values to the variation and update the current allocation
            var stepFactor = assignRangeValues(variation, currentAllocation_1);
            currentAllocation_1 += stepFactor;
            // Log the range allocation for debugging
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.VARIATION_RANGE_ALLOCATION, {
                variationKey: variation.getKey(),
                campaignKey: campaign.getKey(),
                variationWeight: variation.getWeight(),
                startRange: variation.getStartRangeVariation(),
                endRange: variation.getEndRangeVariation(),
            }));
        });
    }
}
/**
 * Assigns start and end range values to a variation based on its weight.
 * @param {VariationModel} data - The variation model to assign range values.
 * @param {number} currentAllocation - The current allocation value before this variation.
 * @returns {number} The step factor calculated from the variation's weight.
 */
function assignRangeValues(data, currentAllocation) {
    // Calculate the bucket range based on the variation's weight
    var stepFactor = _getVariationBucketRange(data.getWeight());
    // Set the start and end range of the variation
    if (stepFactor) {
        data.setStartRange(currentAllocation + 1);
        data.setEndRange(currentAllocation + stepFactor);
    }
    else {
        data.setStartRange(-1);
        data.setEndRange(-1);
    }
    return stepFactor;
}
/**
 * Scales the weights of variations to sum up to 100%.
 * @param {any[]} variations - The list of variations to scale.
 */
function scaleVariationWeights(variations) {
    // Calculate the total weight of all variations
    var totalWeight = variations.reduce(function (acc, variation) {
        return acc + variation.weight;
    }, 0);
    // If total weight is zero, assign equal weight to each variation
    if (!totalWeight) {
        var equalWeight_1 = 100 / variations.length;
        variations.forEach(function (variation) { return (variation.weight = equalWeight_1); });
    }
    else {
        // Scale each variation's weight to make the total 100%
        variations.forEach(function (variation) { return (variation.weight = (variation.weight / totalWeight) * 100); });
    }
}
/**
 * Generates a bucketing seed based on user ID, campaign, and optional group ID.
 * @param {string} userId - The user ID.
 * @param {any} campaign - The campaign object.
 * @param {string} [groupId] - The optional group ID.
 * @returns {string} The bucketing seed.
 */
function getBucketingSeed(userId, campaign, groupId) {
    // Return a seed combining group ID and user ID if group ID is provided
    if (groupId) {
        return "".concat(groupId, "_").concat(userId);
    }
    var isRolloutOrPersonalize = campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
    // get salt
    var salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
    // get bucket key
    var bucketKey = salt ? "".concat(salt, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(userId);
    // Return a seed combining campaign ID and user ID otherwise
    return bucketKey;
}
/**
 * Retrieves a variation by its ID within a specific campaign identified by its key.
 * @param {SettingsModel} settings - The settings model containing all campaigns.
 * @param {string} campaignKey - The key of the campaign.
 * @param {string} variationId - The ID of the variation to retrieve.
 * @returns {VariationModel | null} The found variation model or null if not found.
 */
function getVariationFromCampaignKey(settings, campaignKey, variationId) {
    // Find the campaign by its key
    var campaign = settings.getCampaigns().find(function (campaign) {
        return campaign.getKey() === campaignKey;
    });
    if (campaign) {
        // Find the variation by its ID within the found campaign
        var variation = campaign.getVariations().find(function (variation) {
            return variation.getId() === variationId;
        });
        if (variation) {
            // Return a new instance of VariationModel based on the found variation
            return new VariationModel_1.VariationModel().modelFromDictionary(variation);
        }
    }
    return null;
}
/**
 * Retrieves the key of a campaign by its ID.
 * @param {SettingsModel} settings - The settings model containing all campaigns.
 * @param {number} campaignId - The ID of the campaign to retrieve.
 * @returns {string | null} The key of the campaign or null if not found.
 */
function getCampaignKeyFromCampaignId(settings, campaignId) {
    var campaign = settings.getCampaigns().find(function (campaign) {
        return campaign.getId() === campaignId;
    });
    if (campaign) {
        return campaign.getKey();
    }
    return null;
}
/**
 * Retrieves the name of a variation by its ID within a specific campaign identified by its ID.
 * @param {SettingsModel} settings - The settings model containing all campaigns.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation to retrieve.
 * @returns {string | null} The name of the variation or null if not found.
 */
function getVariationNameFromCampaignIdAndVariationId(settings, campaignId, variationId) {
    var campaign = settings.getCampaigns().find(function (campaign) {
        return campaign.getId() === campaignId;
    });
    if (campaign) {
        var variation = campaign.getVariations().find(function (variation) {
            return variation.getId() === variationId;
        });
        if (variation) {
            return variation.getKey();
        }
    }
    return null;
}
/**
 * Retrieves the type of a campaign by its ID.
 * @param {SettingsModel} settings - The settings model containing all campaigns.
 * @param {number} campaignId - The ID of the campaign to retrieve.
 * @returns {string | null} The type of the campaign or null if not found.
 */
function getCampaignTypeFromCampaignId(settings, campaignId) {
    var campaign = settings.getCampaigns().find(function (campaign) {
        return campaign.getId() === campaignId;
    });
    if (campaign) {
        return campaign.getType();
    }
    return null;
}
/**
 * Sets the allocation ranges for a list of campaigns.
 * @param {CampaignModel[]} campaigns - The list of campaigns to set allocations for.
 */
function setCampaignAllocation(campaigns) {
    var stepFactor = 0;
    for (var i = 0, currentAllocation = 0; i < campaigns.length; i++) {
        var campaign = campaigns[i];
        // Assign range values to each campaign and update the current allocation
        stepFactor = assignRangeValuesMEG(campaign, currentAllocation);
        currentAllocation += stepFactor;
    }
}
/**
 * Determines if a campaign is part of a group.
 * @param {SettingsModel} settings - The settings model containing group associations.
 * @param {string} campaignId - The ID of the campaign to check.
 * @param {any} [variationId=null] - The optional variation ID.
 * @returns {Object} An object containing the group ID and name if the campaign is part of a group, otherwise an empty object.
 */
function getGroupDetailsIfCampaignPartOfIt(settings, campaignId, variationId) {
    if (variationId === void 0) { variationId = null; }
    /**
     * If variationId is null, that means that campaign is testing campaign
     * If variationId is not null, that means that campaign is personalization campaign and we need to append variationId to campaignId using _
     * then check if the current campaign is part of any group
     */
    var campaignToCheck = campaignId.toString();
    // check if variationId is not null
    if (variationId !== null) {
        // if variationId is not null, then append it to the campaignId like campaignId_variationId
        campaignToCheck = "".concat(campaignId, "_").concat(variationId).toString();
    }
    if (settings.getCampaignGroups() &&
        Object.prototype.hasOwnProperty.call(settings.getCampaignGroups(), campaignToCheck)) {
        return {
            groupId: settings.getCampaignGroups()[campaignToCheck],
            groupName: settings.getGroups()[settings.getCampaignGroups()[campaignToCheck]].name,
        };
    }
    return {};
}
/**
 * Retrieves campaigns by a specific group ID.
 * @param {SettingsModel} settings - The settings model containing all groups.
 * @param {any} groupId - The ID of the group.
 * @returns {Array} An array of campaigns associated with the specified group ID.
 */
function getCampaignsByGroupId(settings, groupId) {
    var group = settings.getGroups()[groupId];
    if (group) {
        return group.campaigns; // Return the campaigns associated with the group
    }
    else {
        return []; // Return an empty array if the group ID is not found
    }
}
/**
 * Retrieves feature keys from a list of campaign IDs.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {any} campaignIdWithVariation - An array of campaign IDs and variation IDs in format campaignId_variationId.
 * @returns {Array} An array of feature keys associated with the provided campaign IDs.
 */
function getFeatureKeysFromCampaignIds(settings, campaignIdWithVariation) {
    var featureKeys = [];
    var _loop_1 = function (campaign) {
        // split key with _ to separate campaignId and variationId
        var _a = campaign.split('_').map(Number), campaignId = _a[0], variationId = _a[1];
        settings.getFeatures().forEach(function (feature) {
            // check if feature already exists in the featureKeys array
            if (featureKeys.indexOf(feature.getKey()) !== -1) {
                return;
            }
            feature.getRules().forEach(function (rule) {
                if (rule.getCampaignId() === campaignId) {
                    // Check if variationId is provided and matches the rule's variationId
                    if (variationId !== undefined && variationId !== null) {
                        // Add feature key if variationId matches
                        if (rule.getVariationId() === variationId) {
                            featureKeys.push(feature.getKey());
                        }
                    }
                    else {
                        // Add feature key if no variationId is provided
                        featureKeys.push(feature.getKey());
                    }
                }
            });
        });
    };
    for (var _i = 0, campaignIdWithVariation_1 = campaignIdWithVariation; _i < campaignIdWithVariation_1.length; _i++) {
        var campaign = campaignIdWithVariation_1[_i];
        _loop_1(campaign);
    }
    return featureKeys;
}
/**
 * Retrieves campaign IDs from a specific feature key.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of campaign IDs associated with the specified feature key.
 */
function getCampaignIdsFromFeatureKey(settings, featureKey) {
    var campaignIds = [];
    settings.getFeatures().forEach(function (feature) {
        if (feature.getKey() === featureKey) {
            feature.getRules().forEach(function (rule) {
                campaignIds.push(rule.getCampaignId()); // Add campaign ID if feature key matches
            });
        }
    });
    return campaignIds;
}
/**
 * Assigns range values to a campaign based on its weight.
 * @param {any} data - The campaign data containing weight.
 * @param {number} currentAllocation - The current allocation value before this campaign.
 * @returns {number} The step factor calculated from the campaign's weight.
 */
function assignRangeValuesMEG(data, currentAllocation) {
    var stepFactor = _getVariationBucketRange(data.weight);
    if (stepFactor) {
        data.startRangeVariation = currentAllocation + 1; // Set the start range
        data.endRangeVariation = currentAllocation + stepFactor; // Set the end range
    }
    else {
        data.startRangeVariation = -1; // Set invalid range if step factor is zero
        data.endRangeVariation = -1;
    }
    return stepFactor;
}
/**
 * Calculates the bucket range for a variation based on its weight.
 * @param {number} variationWeight - The weight of the variation.
 * @returns {number} The calculated bucket range.
 */
function _getVariationBucketRange(variationWeight) {
    if (!variationWeight || variationWeight === 0) {
        return 0; // Return zero if weight is invalid or zero
    }
    var startRange = Math.ceil(variationWeight * 100);
    return Math.min(startRange, constants_1.Constants.MAX_TRAFFIC_VALUE); // Ensure the range does not exceed the max traffic value
}
/**
 * Handles the rollout campaign by setting start and end ranges for all variations.
 * @param {CampaignModel} campaign - The campaign to handle.
 */
function _handleRolloutCampaign(campaign) {
    // Set start and end ranges for all variations in the campaign
    for (var i = 0; i < campaign.getVariations().length; i++) {
        var variation = campaign.getVariations()[i];
        var endRange = campaign.getVariations()[i].getWeight() * 100;
        variation.setStartRange(1);
        variation.setEndRange(endRange);
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.VARIATION_RANGE_ALLOCATION, {
            variationKey: variation.getKey(),
            campaignKey: campaign.getKey(),
            variationWeight: variation.getWeight(),
            startRange: 1,
            endRange: endRange,
        }));
    }
}


/***/ }),

/***/ "./lib/utils/DataTypeUtil.ts":
/*!***********************************!*\
  !*** ./lib/utils/DataTypeUtil.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isObject = isObject;
exports.isEmptyObject = isEmptyObject;
exports.isArray = isArray;
exports.isNull = isNull;
exports.isUndefined = isUndefined;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isPromise = isPromise;
exports.getType = getType;
/**
 * Checks if a value is an object excluding arrays, functions, regexes, promises, and dates.
 * @param val The value to check.
 * @returns True if the value is an object, false otherwise.
 */
function isObject(val) {
    // Using Object.prototype.toString to get a precise string representation of the value type
    return Object.prototype.toString.call(val) === '[object Object]';
}
/**
 * Checks if a value is an empty object.
 * @param val The value to check.
 * @returns True if the value is an empty object, false otherwise.
 */
function isEmptyObject(val) {
    return isObject(val) && Object.keys(val).length === 0;
}
/**
 * Checks if a value is an array.
 * @param val The value to check.
 * @returns True if the value is an array, false otherwise.
 */
function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
}
/**
 * Checks if a value is null.
 * @param val The value to check.
 * @returns True if the value is null, false otherwise.
 */
function isNull(val) {
    return Object.prototype.toString.call(val) === '[object Null]';
}
/**
 * Checks if a value is undefined.
 * @param val The value to check.
 * @returns True if the value is undefined, false otherwise.
 */
function isUndefined(val) {
    return Object.prototype.toString.call(val) === '[object Undefined]';
}
/**
 * Checks if a value is a number, including NaN.
 * @param val The value to check.
 * @returns True if the value is a number, false otherwise.
 */
function isNumber(val) {
    // Note: NaN is also a number
    return Object.prototype.toString.call(val) === '[object Number]';
}
/**
 * Checks if a value is a string.
 * @param val The value to check.
 * @returns True if the value is a string, false otherwise.
 */
function isString(val) {
    return Object.prototype.toString.call(val) === '[object String]';
}
/**
 * Checks if a value is a boolean.
 * @param val The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
function isBoolean(val) {
    return Object.prototype.toString.call(val) === '[object Boolean]';
}
/**
 * Checks if a value is a function.
 * @param val The value to check.
 * @returns True if the value is a function, false otherwise.
 */
function isFunction(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
}
/**
 * Checks if a value is a Promise.
 * @param val The value to check.
 * @returns True if the value is a Promise, false otherwise.
 */
function isPromise(val) {
    return Object.prototype.toString.call(val) === '[object Promise]';
}
/**
 * Determines the type of the given value using various type-checking utility functions.
 * @param val The value to determine the type of.
 * @returns A string representing the type of the value.
 */
function getType(val) {
    // Check if the value is an Object (excluding arrays, functions, etc.)
    return isObject(val)
        ? 'Object'
        : // Check if the value is an Array
            isArray(val)
                ? 'Array'
                : // Check if the value is null
                    isNull(val)
                        ? 'Null'
                        : // Check if the value is undefined
                            isUndefined(val)
                                ? 'Undefined'
                                : // Check if the value is NaN (Not a Number)
                                    isNumber(val)
                                        ? 'Number'
                                        : // Check if the value is a String
                                            isString(val)
                                                ? 'String'
                                                : // Check if the value is a Boolean
                                                    isBoolean(val)
                                                        ? 'Boolean'
                                                        : // Check if the value is a Function
                                                            isFunction(val)
                                                                ? 'Function'
                                                                : // Check if the value is a Promise
                                                                    isPromise(val)
                                                                        ? 'Promise'
                                                                        : // If none of the above, return 'Unknown Type'
                                                                            'Unknown Type';
}


/***/ }),

/***/ "./lib/utils/DebuggerServiceUtil.ts":
/*!******************************************!*\
  !*** ./lib/utils/DebuggerServiceUtil.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractDecisionKeys = extractDecisionKeys;
exports.sendDebugEventToVWO = sendDebugEventToVWO;
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var BatchEventsQueue_1 = __webpack_require__(/*! ../services/BatchEventsQueue */ "./lib/services/BatchEventsQueue.ts");
/**
 * Utility functions for handling debugger service operations including
 * filtering sensitive properties and extracting decision keys.
 */
/**
 * Extracts only the required fields from a decision object.
 * @param decisionObj - The decision object to extract fields from
 * @returns An object containing only rolloutKey and experimentKey if they exist
 */
function extractDecisionKeys(decisionObj) {
    if (decisionObj === void 0) { decisionObj = {}; }
    var extractedKeys = {};
    // Extract rolloutKey if present
    if (decisionObj.rolloutId) {
        extractedKeys['rId'] = decisionObj.rolloutId;
    }
    // Extract rolloutVariationId if present
    if (decisionObj.rolloutVariationId) {
        extractedKeys['rvId'] = decisionObj.rolloutVariationId;
    }
    // Extract experimentKey if present
    if (decisionObj.experimentId) {
        extractedKeys['eId'] = decisionObj.experimentId;
    }
    // Extract experimentVariationId if present
    if (decisionObj.experimentVariationId) {
        extractedKeys['evId'] = decisionObj.experimentVariationId;
    }
    return extractedKeys;
}
/**
 * Sends a debug event to VWO.
 * @param eventProps - The properties for the event.
 * @returns A promise that resolves when the event is sent.
 */
function sendDebugEventToVWO() {
    return __awaiter(this, arguments, void 0, function (eventProps) {
        var properties, payload;
        if (eventProps === void 0) { eventProps = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT, null, null);
                    payload = (0, NetworkUtil_1.getDebuggerEventPayload)(eventProps);
                    if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
                    BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, NetworkUtil_1.sendEvent)(properties, payload, EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT).catch(function () { })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}


/***/ }),

/***/ "./lib/utils/DecisionUtil.ts":
/*!***********************************!*\
  !*** ./lib/utils/DecisionUtil.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateTrafficAndGetVariation = exports.checkWhitelistingAndPreSeg = void 0;
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
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./lib/enums/CampaignTypeEnum.ts");
var StatusEnum_1 = __webpack_require__(/*! ../enums/StatusEnum */ "./lib/enums/StatusEnum.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var decision_maker_1 = __webpack_require__(/*! ../packages/decision-maker */ "./lib/packages/decision-maker/index.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var segmentation_evaluator_1 = __webpack_require__(/*! ../packages/segmentation-evaluator */ "./lib/packages/segmentation-evaluator/index.ts");
var CampaignDecisionService_1 = __webpack_require__(/*! ../services/CampaignDecisionService */ "./lib/services/CampaignDecisionService.ts");
var DataTypeUtil_2 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var CampaignUtil_1 = __webpack_require__(/*! ./CampaignUtil */ "./lib/utils/CampaignUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var MegUtil_1 = __webpack_require__(/*! ./MegUtil */ "./lib/utils/MegUtil.ts");
var UuidUtil_1 = __webpack_require__(/*! ./UuidUtil */ "./lib/utils/UuidUtil.ts");
var StorageDecorator_1 = __webpack_require__(/*! ../decorators/StorageDecorator */ "./lib/decorators/StorageDecorator.ts");
var checkWhitelistingAndPreSeg = function (settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) { return __awaiter(void 0, void 0, void 0, function () {
    var vwoUserId, campaignId, whitelistedVariation, groupId, groupWinnerCampaignId, storedData, isPreSegmentationPassed, winnerCampaign;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vwoUserId = (0, UuidUtil_1.getUUID)(context.getId(), settings.getAccountId());
                campaignId = campaign.getId();
                if (!(campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB)) return [3 /*break*/, 3];
                // set _vwoUserId for variation targeting variables
                context.setVariationTargetingVariables(Object.assign({}, context.getVariationTargetingVariables(), {
                    _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
                }));
                Object.assign(decision, { variationTargetingVariables: context.getVariationTargetingVariables() }); // for integration
                if (!campaign.getIsForcedVariationEnabled()) return [3 /*break*/, 2];
                return [4 /*yield*/, _checkCampaignWhitelisting(campaign, context)];
            case 1:
                whitelistedVariation = _a.sent();
                if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
                    return [2 /*return*/, [true, whitelistedVariation]];
                }
                return [3 /*break*/, 3];
            case 2:
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                    campaignKey: campaign.getRuleKey(),
                    userId: context.getId(),
                }));
                _a.label = 3;
            case 3:
                // userlist segment is also available for campaign pre segmentation
                context.setCustomVariables(Object.assign({}, context.getCustomVariables(), {
                    _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId(),
                }));
                Object.assign(decision, { customVariables: context.getCustomVariables() }); // for integeration
                groupId = (0, CampaignUtil_1.getGroupDetailsIfCampaignPartOfIt)(settings, campaign.getId(), campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? campaign.getVariations()[0].getId() : null).groupId;
                groupWinnerCampaignId = megGroupWinnerCampaigns === null || megGroupWinnerCampaigns === void 0 ? void 0 : megGroupWinnerCampaigns.get(groupId);
                if (!groupWinnerCampaignId) return [3 /*break*/, 4];
                if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                    // check if the campaign is the winner of the group
                    if (groupWinnerCampaignId === campaignId) {
                        return [2 /*return*/, [true, null]];
                    }
                }
                else if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                    // check if the campaign is the winner of the group
                    if (groupWinnerCampaignId === campaignId + '_' + campaign.getVariations()[0].getId()) {
                        return [2 /*return*/, [true, null]];
                    }
                }
                // as group is already evaluated, no need to check again, return false directly
                return [2 /*return*/, [false, null]];
            case 4:
                if (!groupId) return [3 /*break*/, 6];
                return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage("".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId), context, storageService)];
            case 5:
                storedData = _a.sent();
                if (storedData && storedData.experimentKey && storedData.experimentId) {
                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
                        campaignKey: storedData.experimentKey,
                        userId: context.getId(),
                    }));
                    if (storedData.experimentId === campaignId) {
                        // return the campaign if the called campaignId matches
                        if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                            if (storedData.experimentVariationId === campaign.getVariations()[0].getId()) {
                                // if personalise then check if the reqeusted variation is the winner
                                return [2 /*return*/, [true, null]];
                            }
                            else {
                                // if requested variation is not the winner then set the winner campaign in the map and return
                                megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
                                return [2 /*return*/, [false, null]];
                            }
                        }
                        else {
                            return [2 /*return*/, [true, null]];
                        }
                    }
                    if (storedData.experimentVariationId != -1) {
                        megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
                    }
                    else {
                        megGroupWinnerCampaigns.set(groupId, storedData.experimentId);
                    }
                    return [2 /*return*/, [false, null]];
                }
                _a.label = 6;
            case 6: return [4 /*yield*/, new CampaignDecisionService_1.CampaignDecisionService().getPreSegmentationDecision(campaign, context)];
            case 7:
                isPreSegmentationPassed = _a.sent();
                if (!(isPreSegmentationPassed && groupId)) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, MegUtil_1.evaluateGroups)(settings, feature, groupId, evaluatedFeatureMap, context, storageService)];
            case 8:
                winnerCampaign = _a.sent();
                if (winnerCampaign && winnerCampaign.id === campaignId) {
                    if (winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                        return [2 /*return*/, [true, null]];
                    }
                    else {
                        // if personalise then check if the reqeusted variation is the winner
                        if (winnerCampaign.variations[0].id === campaign.getVariations()[0].getId()) {
                            return [2 /*return*/, [true, null]];
                        }
                        else {
                            megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
                            return [2 /*return*/, [false, null]];
                        }
                    }
                }
                else if (winnerCampaign) {
                    if (winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
                        megGroupWinnerCampaigns.set(groupId, winnerCampaign.id);
                    }
                    else {
                        megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
                    }
                    return [2 /*return*/, [false, null]];
                }
                megGroupWinnerCampaigns.set(groupId, -1);
                return [2 /*return*/, [false, null]];
            case 9: return [2 /*return*/, [isPreSegmentationPassed, null]];
        }
    });
}); };
exports.checkWhitelistingAndPreSeg = checkWhitelistingAndPreSeg;
var evaluateTrafficAndGetVariation = function (settings, campaign, userId) {
    var variation = new CampaignDecisionService_1.CampaignDecisionService().getVariationAlloted(userId, settings.getAccountId(), campaign);
    if (!variation) {
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? campaign.getKey()
                : campaign.getName() + '_' + campaign.getRuleKey(),
            userId: userId,
            status: 'did not get any variation',
        }));
        return null;
    }
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
        campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
            ? campaign.getKey()
            : campaign.getName() + '_' + campaign.getRuleKey(),
        userId: userId,
        status: "got variation:".concat(variation.getKey()),
    }));
    return variation;
};
exports.evaluateTrafficAndGetVariation = evaluateTrafficAndGetVariation;
/******************
 * PRIVATE METHODS
 ******************/
/**
 * Check for whitelisting
 * @param campaign      Campaign object
 * @param userId        User ID
 * @param variationTargetingVariables   Variation targeting variables
 * @returns
 */
var _checkCampaignWhitelisting = function (campaign, context) { return __awaiter(void 0, void 0, void 0, function () {
    var whitelistingResult, status, variationString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _evaluateWhitelisting(campaign, context)];
            case 1:
                whitelistingResult = _a.sent();
                status = whitelistingResult ? StatusEnum_1.StatusEnum.PASSED : StatusEnum_1.StatusEnum.FAILED;
                variationString = whitelistingResult ? whitelistingResult.variation.key : '';
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_STATUS, {
                    userId: context.getId(),
                    campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                        ? campaign.getKey()
                        : campaign.getName() + '_' + campaign.getRuleKey(),
                    status: status,
                    variationString: variationString,
                }));
                return [2 /*return*/, whitelistingResult];
        }
    });
}); };
var _evaluateWhitelisting = function (campaign, context) { return __awaiter(void 0, void 0, void 0, function () {
    var targetedVariations, promises, whitelistedVariation, i, currentAllocation, stepFactor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                targetedVariations = [];
                promises = [];
                campaign.getVariations().forEach(function (variation) {
                    if ((0, DataTypeUtil_2.isObject)(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                ? campaign.getKey()
                                : campaign.getName() + '_' + campaign.getRuleKey(),
                            userId: context.getId(),
                            variation: variation.getKey() ? "for variation: ".concat(variation.getKey()) : '',
                        }));
                        return;
                    }
                    // check for segmentation and evaluate
                    if ((0, DataTypeUtil_2.isObject)(variation.getSegments())) {
                        var SegmentEvaluatorResult = segmentation_evaluator_1.SegmentationManager.Instance.validateSegmentation(variation.getSegments(), context.getVariationTargetingVariables());
                        SegmentEvaluatorResult = (0, DataTypeUtil_1.isPromise)(SegmentEvaluatorResult)
                            ? SegmentEvaluatorResult
                            : Promise.resolve(SegmentEvaluatorResult);
                        SegmentEvaluatorResult.then(function (evaluationResult) {
                            if (evaluationResult) {
                                targetedVariations.push((0, FunctionUtil_1.cloneObject)(variation));
                            }
                        });
                        promises.push(SegmentEvaluatorResult);
                    }
                });
                // Wait for all promises to resolve
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                // Wait for all promises to resolve
                _a.sent();
                if (targetedVariations.length > 1) {
                    (0, CampaignUtil_1.scaleVariationWeights)(targetedVariations);
                    for (i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
                        stepFactor = (0, CampaignUtil_1.assignRangeValues)(targetedVariations[i], currentAllocation);
                        currentAllocation += stepFactor;
                    }
                    whitelistedVariation = new CampaignDecisionService_1.CampaignDecisionService().getVariation(targetedVariations, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), campaign, null)));
                }
                else {
                    whitelistedVariation = targetedVariations[0];
                }
                if (whitelistedVariation) {
                    return [2 /*return*/, {
                            variation: whitelistedVariation,
                            variationName: whitelistedVariation.name,
                            variationId: whitelistedVariation.id,
                        }];
                }
                return [2 /*return*/];
        }
    });
}); };


/***/ }),

/***/ "./lib/utils/FetchUtil.ts":
/*!********************************!*\
  !*** ./lib/utils/FetchUtil.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendGetCall = sendGetCall;
exports.sendPostCall = sendPostCall;
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./lib/enums/HttpMethodEnum.ts");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var ResponseModel_1 = __webpack_require__(/*! ../packages/network-layer/models/ResponseModel */ "./lib/packages/network-layer/models/ResponseModel.ts");
// Cache the fetch function to avoid re-importing on every request
var cachedFetch = null;
var fetchPromise = null;
/**
 * Gets the fetch function to use, checking for global fetch first, then falling back to node-fetch.
 * @returns The fetch function to use
 */
function getFetch() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            // Return cached fetch if available
            if (cachedFetch) {
                return [2 /*return*/, cachedFetch];
            }
            // If a fetch initialization is already in progress, wait for it
            if (fetchPromise) {
                return [2 /*return*/, fetchPromise];
            }
            // Initialize fetch
            fetchPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                var nodeFetchModule, nodeFetch, fetchFn, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Check if fetch is available globally (Node.js 18+, browsers, etc.)
                            if (typeof fetch !== 'undefined') {
                                logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                                    api: 'Global fetch',
                                    process:  true ? 'undefined' : 0,
                                }));
                                cachedFetch = fetch;
                                return [2 /*return*/, fetch];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                                api: 'Node-fetch',
                                process:  true ? 'undefined' : 0,
                            }));
                            nodeFetchModule = 'node-' + 'fetch';
                            return [4 /*yield*/, Promise.resolve("".concat(nodeFetchModule)).then(function (s) { return __importStar(__webpack_require__("./lib/utils sync recursive")(s)); })];
                        case 2:
                            nodeFetch = _a.sent();
                            fetchFn = (nodeFetch.default || nodeFetch);
                            cachedFetch = fetchFn;
                            return [2 /*return*/, fetchFn];
                        case 3:
                            error_1 = _a.sent();
                            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.ERROR_INITIALIZING_FETCH, {
                                error: (0, FunctionUtil_1.getFormattedErrorMessage)(error_1),
                            }));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); })();
            return [2 /*return*/, fetchPromise];
        });
    });
}
function sendGetCall(request) {
    return sendRequest(HttpMethodEnum_1.HttpMethodEnum.GET, request);
}
function sendPostCall(request) {
    return sendRequest(HttpMethodEnum_1.HttpMethodEnum.POST, request);
}
/**
 * Sends a request to the server using the Fetch API.
 * @param method - The HTTP method to use for the request.
 * @param request - The request model.
 * @returns A Promise that resolves to the response data.
 */
function sendRequest(method, request) {
    return __awaiter(this, void 0, void 0, function () {
        var responseModel, networkOptions, url, retryCount, fetchFn_1, retryConfig_1, shouldRetry_1, maxRetries_1, executeRequest_1, handleError_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    responseModel = new ResponseModel_1.ResponseModel();
                    networkOptions = request.getOptions();
                    url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
                    if (networkOptions.port) {
                        url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
                    }
                    retryCount = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getFetch()];
                case 2:
                    fetchFn_1 = _a.sent();
                    retryConfig_1 = request.getRetryConfig();
                    shouldRetry_1 = retryConfig_1.shouldRetry;
                    maxRetries_1 = retryConfig_1.maxRetries;
                    if (method === HttpMethodEnum_1.HttpMethodEnum.POST) {
                        networkOptions.body = JSON.stringify(networkOptions.body);
                    }
                    executeRequest_1 = function () {
                        return new Promise(function (resolve, reject) {
                            fetchFn_1(url, networkOptions)
                                .then(function (res) {
                                // Some endpoints return empty strings as the response body; treat
                                // as raw text and handle potential JSON parsing errors below
                                return res.text().then(function (text) {
                                    responseModel.setStatusCode(res.status);
                                    if (retryCount > 0) {
                                        responseModel.setTotalAttempts(retryCount);
                                        responseModel.setError(request.getLastError());
                                    }
                                    try {
                                        if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
                                            responseModel.setData(JSON.parse(text));
                                        }
                                        else {
                                            responseModel.setData(text);
                                        }
                                    }
                                    catch (err) {
                                        responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(err));
                                        reject(responseModel);
                                    }
                                    if (res.status === 200) {
                                        resolve(responseModel);
                                    }
                                    else if (res.status === 400) {
                                        responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(res.statusText));
                                        responseModel.setTotalAttempts(retryCount);
                                        reject(responseModel);
                                    }
                                    else {
                                        handleError_1("".concat(res.statusText, ", status: ").concat(res.status), resolve, reject);
                                    }
                                });
                            })
                                .catch(function (err) {
                                var errorMessage = (0, FunctionUtil_1.getFormattedErrorMessage)(err);
                                // incase of no internet connection, error will have cause property which is the error message
                                if (err && err.cause) {
                                    errorMessage = "".concat(errorMessage, " ").concat(err.cause);
                                }
                                handleError_1(errorMessage, resolve, reject);
                            });
                        });
                    };
                    handleError_1 = function (error, resolve, reject) {
                        var endpoint = String(networkOptions.path || url).split('?')[0];
                        if (shouldRetry_1 && retryCount < maxRetries_1) {
                            var delay = retryConfig_1.initialDelay * Math.pow(retryConfig_1.backoffMultiplier, retryCount) * 1000; // Exponential backoff
                            retryCount++;
                            logger_1.LogManager.Instance.errorLog('ATTEMPTING_RETRY_FOR_FAILED_NETWORK_CALL', {
                                endPoint: endpoint,
                                err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                                delay: delay / 1000,
                                attempt: retryCount,
                                maxRetries: maxRetries_1,
                            }, {}, false);
                            request.setLastError((0, FunctionUtil_1.getFormattedErrorMessage)(error));
                            setTimeout(function () {
                                executeRequest_1().then(resolve).catch(reject);
                            }, delay);
                        }
                        else {
                            if (!String(networkOptions.path).includes(EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT)) {
                                logger_1.LogManager.Instance.errorLog('NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES', {
                                    extraData: endpoint,
                                    attempts: retryCount,
                                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                                }, {}, false);
                            }
                            responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(error));
                            responseModel.setTotalAttempts(retryCount);
                            reject(responseModel);
                        }
                    };
                    return [2 /*return*/, executeRequest_1()];
                case 3:
                    err_1 = _a.sent();
                    responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(err_1));
                    responseModel.setTotalAttempts(retryCount);
                    throw responseModel;
                case 4: return [2 /*return*/];
            }
        });
    });
}


/***/ }),

/***/ "./lib/utils/FunctionUtil.ts":
/*!***********************************!*\
  !*** ./lib/utils/FunctionUtil.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloneObject = cloneObject;
exports.getCurrentTime = getCurrentTime;
exports.getCurrentUnixTimestamp = getCurrentUnixTimestamp;
exports.getCurrentUnixTimestampInMillis = getCurrentUnixTimestampInMillis;
exports.getRandomNumber = getRandomNumber;
exports.getSpecificRulesBasedOnType = getSpecificRulesBasedOnType;
exports.getAllExperimentRules = getAllExperimentRules;
exports.getFeatureFromKey = getFeatureFromKey;
exports.doesEventBelongToAnyFeature = doesEventBelongToAnyFeature;
exports.addLinkedCampaignsToSettings = addLinkedCampaignsToSettings;
exports.getFormattedErrorMessage = getFormattedErrorMessage;
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
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./lib/enums/CampaignTypeEnum.ts");
var CampaignModel_1 = __webpack_require__(/*! ../models/campaign/CampaignModel */ "./lib/models/campaign/CampaignModel.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
/**
 * Clones an object deeply.
 * @param {dynamic} obj - The object to clone.
 * @returns {any} The cloned object.
 */
function cloneObject(obj) {
    if (!obj) {
        // Return the original object if it is null or undefined
        return obj;
    }
    // Use JSON stringify and parse method to perform a deep clone
    var clonedObj = JSON.parse(JSON.stringify(obj));
    return clonedObj;
}
/**
 * Gets the current time in ISO string format.
 * @returns {string} The current time in ISO string format.
 */
function getCurrentTime() {
    return new Date().toISOString();
}
/**
 * Gets the current Unix timestamp in seconds.
 * @returns {number} The current Unix timestamp.
 */
function getCurrentUnixTimestamp() {
    // Convert the current date to Unix timestamp in seconds
    return Math.ceil(+new Date() / 1000);
}
/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns {number} The current Unix timestamp in milliseconds.
 */
function getCurrentUnixTimestampInMillis() {
    // Convert the current date to Unix timestamp in milliseconds
    return +new Date();
}
/**
 * Generates a random number between 0 and 1.
 * @returns {number} A random number.
 */
function getRandomNumber() {
    // Use Math.random to generate a random number
    return Math.random();
}
/**
 * Retrieves specific rules based on the type from a feature.
 * @param {FeatureModel} feature - The key of the feature.
 * @param {CampaignTypeEnum | null} type - The type of the rules to retrieve.
 * @returns {Array} An array of rules that match the type.
 */
function getSpecificRulesBasedOnType(feature, type) {
    if (type === void 0) { type = null; }
    // Return an empty array if no linked campaigns are found
    if (feature && !(feature === null || feature === void 0 ? void 0 : feature.getRulesLinkedCampaign())) {
        return [];
    }
    // Filter the rules by type if a type is specified and is a string
    if (feature && feature.getRulesLinkedCampaign() && type && (0, DataTypeUtil_1.isString)(type)) {
        return feature.getRulesLinkedCampaign().filter(function (rule) {
            var ruleModel = new CampaignModel_1.CampaignModel().modelFromDictionary(rule);
            return ruleModel.getType() === type;
        });
    }
    // Return all linked campaigns if no type is specified
    return feature.getRulesLinkedCampaign();
}
/**
 * Retrieves all AB and Personalize rules from a feature.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of AB and Personalize rules.
 */
function getAllExperimentRules(feature) {
    // Retrieve the feature by its key
    // Filter the rules to include only AB and Personalize types
    return ((feature === null || feature === void 0 ? void 0 : feature.getRulesLinkedCampaign().filter(function (rule) { return rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB || rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE; })) || []);
}
/**
 * Retrieves a feature by its key from the settings.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {any} The feature if found, otherwise undefined.
 */
function getFeatureFromKey(settings, featureKey) {
    var _a;
    // Find the feature by its key
    return (_a = settings === null || settings === void 0 ? void 0 : settings.getFeatures()) === null || _a === void 0 ? void 0 : _a.find(function (feature) { return feature.getKey() === featureKey; });
}
/**
 * Checks if an event exists within any feature's metrics.
 * @param {string} eventName - The name of the event to check.
 * @param {any} settings - The settings containing features.
 * @returns {boolean} True if the event exists, otherwise false.
 */
function doesEventBelongToAnyFeature(eventName, settings) {
    // Use the `some` method to check if any feature contains the event in its metrics
    return settings
        .getFeatures()
        .some(function (feature) { return feature.getMetrics().some(function (metric) { return metric.getIdentifier() === eventName; }); });
}
/**
 * Adds linked campaigns to each feature in the settings based on rules.
 * @param {any} settings - The settings file to modify.
 */
function addLinkedCampaignsToSettings(settings) {
    // Create maps for quick access to campaigns and variations
    var campaignMap = new Map(settings.getCampaigns().map(function (campaign) { return [campaign.getId(), campaign]; }));
    // Loop over all features
    for (var _i = 0, _a = settings.getFeatures(); _i < _a.length; _i++) {
        var feature = _a[_i];
        var rulesLinkedCampaign = feature
            .getRules()
            .map(function (rule) {
            var campaign = campaignMap.get(rule.getCampaignId());
            if (!campaign)
                return null;
            // Create a linked campaign object with the rule and campaign
            var linkedCampaign = __assign(__assign({ key: campaign.getKey() }, campaign), { ruleKey: rule.getRuleKey() });
            // If a variationId is specified, find and add the variation
            if (rule.getVariationId()) {
                var variation = campaign.getVariations().find(function (v) { return v.getId() === rule.getVariationId(); });
                if (variation) {
                    linkedCampaign.variations = [variation];
                }
            }
            return linkedCampaign;
        })
            .filter(function (campaign) { return campaign !== null; }); // Filter out any null entries
        var rulesLinkedCampaignModel = rulesLinkedCampaign.map(function (campaign) {
            var campaignModel = new CampaignModel_1.CampaignModel();
            campaignModel.modelFromDictionary(campaign);
            return campaignModel;
        });
        // Assign the linked campaigns to the feature
        feature.setRulesLinkedCampaign(rulesLinkedCampaignModel);
    }
}
/**
 * Formats an error message.
 * @param {any} error - The error to format.
 * @returns {string} The formatted error message.
 */
function getFormattedErrorMessage(error) {
    var errorMessage = '';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    else if (typeof error === 'string') {
        errorMessage = error;
    }
    else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
    }
    return errorMessage;
}


/***/ }),

/***/ "./lib/utils/GatewayServiceUtil.ts":
/*!*****************************************!*\
  !*** ./lib/utils/GatewayServiceUtil.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFromGatewayService = getFromGatewayService;
exports.getQueryParams = getQueryParams;
exports.addIsGatewayServiceRequiredFlag = addIsGatewayServiceRequiredFlag;
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
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./lib/enums/CampaignTypeEnum.ts");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./lib/enums/HttpMethodEnum.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./lib/packages/network-layer/index.ts");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./lib/services/SettingsService.ts");
var PromiseUtil_1 = __webpack_require__(/*! ./PromiseUtil */ "./lib/utils/PromiseUtil.ts");
/**
 * Asynchronously retrieves data from a web service using the specified query parameters and endpoint.
 * @param queryParams - The parameters to be used in the query string of the request.
 * @param endpoint - The endpoint URL to which the request is sent.
 * @returns A promise that resolves to the response data or false if an error occurs.
 */
function getFromGatewayService(queryParams, endpoint, context) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredObject, networkInstance, retryConfig, gatewayServiceUrl, gatewayServicePort, gatewayServiceProtocol, request;
        return __generator(this, function (_a) {
            deferredObject = new PromiseUtil_1.Deferred();
            networkInstance = network_layer_1.NetworkManager.Instance;
            retryConfig = networkInstance.getRetryConfig();
            // Check if the base URL is not set correctly
            if (!SettingsService_1.SettingsService.Instance.isGatewayServiceProvided) {
                // Log an informational message about the invalid URL
                logger_1.LogManager.Instance.errorLog('INVALID_GATEWAY_URL', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
                // Resolve the promise with false indicating an error or invalid state
                deferredObject.resolve(false);
                return [2 /*return*/, deferredObject.promise];
            }
            // required if sdk is running in browser environment
            // using dacdn where accountid is required
            queryParams['accountId'] = SettingsService_1.SettingsService.Instance.accountId;
            gatewayServiceUrl = null;
            gatewayServicePort = null;
            gatewayServiceProtocol = null;
            if (SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname != null) {
                gatewayServiceUrl = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname;
                gatewayServicePort = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.port;
                gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.protocol;
            }
            else {
                gatewayServiceUrl = SettingsService_1.SettingsService.Instance.hostname;
                gatewayServicePort = SettingsService_1.SettingsService.Instance.port;
                gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.protocol;
            }
            try {
                request = new network_layer_1.RequestModel(gatewayServiceUrl, HttpMethodEnum_1.HttpMethodEnum.GET, endpoint, queryParams, null, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
                // Perform the network GET request
                networkInstance
                    .get(request)
                    .then(function (response) {
                    // Resolve the deferred object with the data from the response
                    deferredObject.resolve(response.getData());
                })
                    .catch(function (err) {
                    // Reject the deferred object with the error response
                    deferredObject.reject(err);
                });
                return [2 /*return*/, deferredObject.promise];
            }
            catch (err) {
                // Resolve the promise with false as fallback
                deferredObject.resolve(false);
                return [2 /*return*/, deferredObject.promise];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Encodes the query parameters to ensure they are URL-safe.
 * @param queryParams  The query parameters to be encoded.
 * @returns  An object containing the encoded query parameters.
 */
function getQueryParams(queryParams) {
    var encodedParams = {};
    for (var _i = 0, _a = Object.entries(queryParams); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        // Encode the parameter value to ensure it is URL-safe
        var encodedValue = encodeURIComponent(String(value));
        // Add the encoded parameter to the result object
        encodedParams[key] = encodedValue;
    }
    return encodedParams;
}
/**
 * Adds isGatewayServiceRequired flag to each feature in the settings based on pre segmentation.
 * @param {any} settings - The settings file to modify.
 */
function addIsGatewayServiceRequiredFlag(settings) {
    var keywordPattern = /\b(country|region|city|os|device_type|browser_string|ua|browser_version|os_version)\b/g;
    var inlistPattern = /"custom_variable"\s*:\s*{[^}]*inlist\([^)]*\)/g;
    for (var _i = 0, _a = settings.getFeatures(); _i < _a.length; _i++) {
        var feature = _a[_i];
        var rules = feature.getRulesLinkedCampaign();
        for (var _b = 0, rules_1 = rules; _b < rules_1.length; _b++) {
            var rule = rules_1[_b];
            var segments = {};
            if (rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE || rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT) {
                segments = rule.getVariations()[0].getSegments();
            }
            else {
                segments = rule.getSegments();
            }
            if (segments) {
                var jsonSegments = JSON.stringify(segments);
                var keywordMatches = jsonSegments.match(keywordPattern);
                var inlistMatches = jsonSegments.match(inlistPattern);
                if ((keywordMatches && keywordMatches.length > 0) || (inlistMatches && inlistMatches.length > 0)) {
                    feature.setIsGatewayServiceRequired(true);
                    break;
                }
            }
        }
    }
}


/***/ }),

/***/ "./lib/utils/ImpressionUtil.ts":
/*!*************************************!*\
  !*** ./lib/utils/ImpressionUtil.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createAndSendImpressionForVariationShown = void 0;
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var BatchEventsQueue_1 = __webpack_require__(/*! ../services/BatchEventsQueue */ "./lib/services/BatchEventsQueue.ts");
var CampaignUtil_1 = __webpack_require__(/*! ./CampaignUtil */ "./lib/utils/CampaignUtil.ts");
var CampaignUtil_2 = __webpack_require__(/*! ./CampaignUtil */ "./lib/utils/CampaignUtil.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
/**
 * Creates and sends an impression for a variation shown event.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {SettingsModel} settings - The settings model containing configuration.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation shown to the user.
 * @param {ContextModel} context - The user context model containing user-specific data.
 */
var createAndSendImpressionForVariationShown = function (settings, campaignId, variationId, context, featureKey) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload, campaignKeyWithFeatureName, variationName, campaignKey, campaignType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()), // Encode user agent to ensure URL safety
                context.getIpAddress());
                payload = (0, NetworkUtil_1.getTrackUserPayloadData)(settings, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, campaignId, variationId, context);
                campaignKeyWithFeatureName = (0, CampaignUtil_1.getCampaignKeyFromCampaignId)(settings, campaignId);
                variationName = (0, CampaignUtil_2.getVariationNameFromCampaignIdAndVariationId)(settings, campaignId, variationId);
                campaignKey = '';
                if (featureKey === campaignKeyWithFeatureName) {
                    campaignKey = constants_1.Constants.IMPACT_ANALYSIS;
                }
                else {
                    campaignKey = campaignKeyWithFeatureName === null || campaignKeyWithFeatureName === void 0 ? void 0 : campaignKeyWithFeatureName.split("".concat(featureKey, "_"))[1];
                }
                campaignType = (0, CampaignUtil_1.getCampaignTypeFromCampaignId)(settings, campaignId);
                if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
                BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
                return [3 /*break*/, 3];
            case 1: 
            // Send the constructed properties and payload as a POST request
            return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId(), {}, { campaignKey: campaignKey, variationName: variationName, featureKey: featureKey, campaignType: campaignType })];
            case 2:
                // Send the constructed properties and payload as a POST request
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createAndSendImpressionForVariationShown = createAndSendImpressionForVariationShown;


/***/ }),

/***/ "./lib/utils/LogMessageUtil.ts":
/*!*************************************!*\
  !*** ./lib/utils/LogMessageUtil.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildMessage = buildMessage;
exports.sendLogToVWO = sendLogToVWO;
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
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var nargs = /\{([0-9a-zA-Z_]+)\}/g;
var storedMessages = new Set();
/**
 * Constructs a message by replacing placeholders in a template with corresponding values from a data object.
 *
 * @param {string} template - The message template containing placeholders in the format `{key}`.
 * @param {Record<string, any>} data - An object containing keys and values used to replace the placeholders in the template.
 * @returns {string} The constructed message with all placeholders replaced by their corresponding values from the data object.
 */
function buildMessage(template, data) {
    if (template === void 0) { template = ''; }
    if (data === void 0) { data = {}; }
    try {
        return template.replace(nargs, function (match, key, index) {
            // Check for escaped placeholders
            if (template[index - 1] === '{' && template[index + match.length] === '}') {
                return key;
            }
            // Retrieve the value from the data object
            var value = data[key];
            // If the key does not exist or the value is null/undefined, return an empty string
            if (value === undefined || value === null) {
                return '';
            }
            // If the value is a function, evaluate it
            return (0, DataTypeUtil_1.isFunction)(value) ? value() : value;
        });
    }
    catch (err) {
        return template; // Return the original template in case of an error
    }
}
/**
 * Sends a log message to VWO.
 * @param {string} message - The message to log.
 * @param {string} messageType - The type of message to log.
 * @param {string} eventName - The name of the event to log.
 */
function sendLogToVWO(message, messageType, extraData) {
    if (extraData === void 0) { extraData = {}; }
    if (false) {}
    var messageToSend = message;
    messageToSend = messageToSend + '-' + constants_1.Constants.SDK_NAME + '-' + constants_1.Constants.SDK_VERSION;
    if (Object.keys(extraData).length > 0) {
        messageToSend = messageToSend + ' ' + JSON.stringify(extraData);
    }
    if (!storedMessages.has(messageToSend)) {
        // add the message to the set
        storedMessages.add(messageToSend);
        // create the query parameters
        var properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_LOG_EVENT);
        // create the payload
        var payload = (0, NetworkUtil_1.getMessagingEventPayload)(messageType, message, EventEnum_1.EventEnum.VWO_LOG_EVENT, extraData);
        // Send the constructed payload via POST request
        // send eventName in parameters so that we can disable retry for this event
        (0, NetworkUtil_1.sendEvent)(properties, payload, EventEnum_1.EventEnum.VWO_LOG_EVENT).catch(function () { });
    }
}


/***/ }),

/***/ "./lib/utils/MegUtil.ts":
/*!******************************!*\
  !*** ./lib/utils/MegUtil.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateGroups = void 0;
exports.getFeatureKeysFromGroup = getFeatureKeysFromGroup;
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
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var StorageDecorator_1 = __webpack_require__(/*! ../decorators/StorageDecorator */ "./lib/decorators/StorageDecorator.ts");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./lib/enums/CampaignTypeEnum.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var CampaignModel_1 = __webpack_require__(/*! ../models/campaign/CampaignModel */ "./lib/models/campaign/CampaignModel.ts");
var VariationModel_1 = __webpack_require__(/*! ../models/campaign/VariationModel */ "./lib/models/campaign/VariationModel.ts");
var decision_maker_1 = __webpack_require__(/*! ../packages/decision-maker */ "./lib/packages/decision-maker/index.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var CampaignDecisionService_1 = __webpack_require__(/*! ../services/CampaignDecisionService */ "./lib/services/CampaignDecisionService.ts");
var RuleEvaluationUtil_1 = __webpack_require__(/*! ../utils/RuleEvaluationUtil */ "./lib/utils/RuleEvaluationUtil.ts");
var CampaignUtil_1 = __webpack_require__(/*! ./CampaignUtil */ "./lib/utils/CampaignUtil.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var DecisionUtil_1 = __webpack_require__(/*! ./DecisionUtil */ "./lib/utils/DecisionUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
/**
 * Evaluates groups for a given feature and group ID.
 *
 * @param settings - The settings model.
 * @param feature - The feature model to evaluate.
 * @param groupId - The ID of the group.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to the evaluation result.
 */
var evaluateGroups = function (settings, feature, groupId, evaluatedFeatureMap, context, storageService) { return __awaiter(void 0, void 0, void 0, function () {
    var featureToSkip, campaignMap, _a, featureKeys, groupCampaignIds, _loop_1, _i, featureKeys_1, featureKey, _b, eligibleCampaigns, eligibleCampaignsWithStorage;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                featureToSkip = [];
                campaignMap = new Map();
                _a = getFeatureKeysFromGroup(settings, groupId), featureKeys = _a.featureKeys, groupCampaignIds = _a.groupCampaignIds;
                _loop_1 = function (featureKey) {
                    var feature_1, isRolloutRulePassed;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                feature_1 = (0, FunctionUtil_1.getFeatureFromKey)(settings, featureKey);
                                // check if the feature is already evaluated
                                if (featureToSkip.includes(featureKey)) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, _isRolloutRuleForFeaturePassed(settings, feature_1, evaluatedFeatureMap, featureToSkip, storageService, context)];
                            case 1:
                                isRolloutRulePassed = _d.sent();
                                if (isRolloutRulePassed) {
                                    settings.getFeatures().forEach(function (feature) {
                                        if (feature.getKey() === featureKey) {
                                            feature.getRulesLinkedCampaign().forEach(function (rule) {
                                                if (groupCampaignIds.includes(rule.getId().toString()) ||
                                                    groupCampaignIds.includes("".concat(rule.getId(), "_").concat(rule.getVariations()[0].getId()).toString())) {
                                                    if (!campaignMap.has(featureKey)) {
                                                        campaignMap.set(featureKey, []);
                                                    }
                                                    // check if the campaign is already present in the campaignMap for the feature
                                                    if (campaignMap.get(featureKey).findIndex(function (item) { return item.ruleKey === rule.getRuleKey(); }) === -1) {
                                                        campaignMap.get(featureKey).push(rule);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, featureKeys_1 = featureKeys;
                _c.label = 1;
            case 1:
                if (!(_i < featureKeys_1.length)) return [3 /*break*/, 4];
                featureKey = featureKeys_1[_i];
                return [5 /*yield**/, _loop_1(featureKey)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [4 /*yield*/, _getEligbleCampaigns(settings, campaignMap, context, storageService)];
            case 5:
                _b = _c.sent(), eligibleCampaigns = _b.eligibleCampaigns, eligibleCampaignsWithStorage = _b.eligibleCampaignsWithStorage;
                return [4 /*yield*/, _findWinnerCampaignAmongEligibleCampaigns(settings, feature.getKey(), eligibleCampaigns, eligibleCampaignsWithStorage, groupId, context, storageService)];
            case 6: return [2 /*return*/, _c.sent()];
        }
    });
}); };
exports.evaluateGroups = evaluateGroups;
/**
 * Retrieves feature keys associated with a group based on the group ID.
 *
 * @param settings - The settings model.
 * @param groupId - The ID of the group.
 * @returns An object containing feature keys and group campaign IDs.
 */
function getFeatureKeysFromGroup(settings, groupId) {
    var groupCampaignIds = (0, CampaignUtil_1.getCampaignsByGroupId)(settings, groupId);
    var featureKeys = (0, CampaignUtil_1.getFeatureKeysFromCampaignIds)(settings, groupCampaignIds);
    return { featureKeys: featureKeys, groupCampaignIds: groupCampaignIds };
}
/*******************************
 * PRIVATE methods - MegUtil
 ******************************/
/**
 * Evaluates the feature rollout rules for a given feature.
 *
 * @param settings - The settings model.
 * @param feature - The feature model to evaluate.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param featureToSkip - An array of features to skip during evaluation.
 * @param storageService - The storage service.
 * @param context - The context model.
 * @returns A promise that resolves to true if the feature passes the rollout rules, false otherwise.
 */
var _isRolloutRuleForFeaturePassed = function (settings, feature, evaluatedFeatureMap, featureToSkip, storageService, context) { return __awaiter(void 0, void 0, void 0, function () {
    var rollOutRules, ruleToTestForTraffic, _i, rollOutRules_1, rule, preSegmentationResult, campaign, variation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (evaluatedFeatureMap.has(feature.getKey()) && 'rolloutId' in evaluatedFeatureMap.get(feature.getKey())) {
                    return [2 /*return*/, true];
                }
                rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT);
                if (!(rollOutRules.length > 0)) return [3 /*break*/, 5];
                ruleToTestForTraffic = null;
                _i = 0, rollOutRules_1 = rollOutRules;
                _a.label = 1;
            case 1:
                if (!(_i < rollOutRules_1.length)) return [3 /*break*/, 4];
                rule = rollOutRules_1[_i];
                return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, null, storageService, {})];
            case 2:
                preSegmentationResult = (_a.sent()).preSegmentationResult;
                if (preSegmentationResult) {
                    ruleToTestForTraffic = rule;
                    return [3 /*break*/, 4];
                }
                return [3 /*break*/, 3];
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                if (ruleToTestForTraffic !== null) {
                    campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(ruleToTestForTraffic);
                    variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, campaign, context.getId());
                    if ((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0) {
                        evaluatedFeatureMap.set(feature.getKey(), {
                            rolloutId: ruleToTestForTraffic.id,
                            rolloutKey: ruleToTestForTraffic.key,
                            rolloutVariationId: ruleToTestForTraffic.variations[0].id,
                        });
                        return [2 /*return*/, true];
                    }
                }
                // no rollout rule passed
                featureToSkip.push(feature.getKey());
                return [2 /*return*/, false];
            case 5:
                // no rollout rule, evaluate experiments
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_SKIP_ROLLOUT_EVALUATE_EXPERIMENTS, {
                    featureKey: feature.getKey(),
                }));
                return [2 /*return*/, true];
        }
    });
}); };
/**
 * Retrieves eligible campaigns based on the provided campaign map and context.
 *
 * @param settings - The settings model.
 * @param campaignMap - A map containing feature keys and corresponding campaigns.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to an object containing eligible campaigns, campaigns with storage, and ineligible campaigns.
 */
var _getEligbleCampaigns = function (settings, campaignMap, context, storageService) { return __awaiter(void 0, void 0, void 0, function () {
    var eligibleCampaigns, eligibleCampaignsWithStorage, inEligibleCampaigns, campaignMapArray, _i, campaignMapArray_1, _a, featureKey, campaigns, _loop_2, _b, campaigns_1, campaign;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                eligibleCampaigns = [];
                eligibleCampaignsWithStorage = [];
                inEligibleCampaigns = [];
                campaignMapArray = Array.from(campaignMap);
                _i = 0, campaignMapArray_1 = campaignMapArray;
                _c.label = 1;
            case 1:
                if (!(_i < campaignMapArray_1.length)) return [3 /*break*/, 6];
                _a = campaignMapArray_1[_i], featureKey = _a[0], campaigns = _a[1];
                _loop_2 = function (campaign) {
                    var storedData, variation;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService)];
                            case 1:
                                storedData = _d.sent();
                                // Check if campaign is stored in storage
                                if (storedData === null || storedData === void 0 ? void 0 : storedData.experimentVariationId) {
                                    if (storedData.experimentKey && storedData.experimentKey === campaign.getKey()) {
                                        variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.experimentKey, storedData.experimentVariationId);
                                        if (variation) {
                                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
                                                campaignKey: storedData.experimentKey,
                                                userId: context.getId(),
                                            }));
                                            if (eligibleCampaignsWithStorage.findIndex(function (item) { return item.key === campaign.getKey(); }) === -1) {
                                                eligibleCampaignsWithStorage.push(campaign);
                                            }
                                            return [2 /*return*/, "continue"];
                                        }
                                    }
                                }
                                return [4 /*yield*/, new CampaignDecisionService_1.CampaignDecisionService().getPreSegmentationDecision(new CampaignModel_1.CampaignModel().modelFromDictionary(campaign), context)];
                            case 2:
                                // Check if user is eligible for the campaign
                                if ((_d.sent()) &&
                                    new CampaignDecisionService_1.CampaignDecisionService().isUserPartOfCampaign(context.getId(), campaign)) {
                                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_ELIGIBLE, {
                                        campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                                            ? campaign.getKey()
                                            : campaign.getName() + '_' + campaign.getRuleKey(),
                                        userId: context.getId(),
                                    }));
                                    eligibleCampaigns.push(campaign);
                                    return [2 /*return*/, "continue"];
                                }
                                inEligibleCampaigns.push(campaign);
                                return [2 /*return*/];
                        }
                    });
                };
                _b = 0, campaigns_1 = campaigns;
                _c.label = 2;
            case 2:
                if (!(_b < campaigns_1.length)) return [3 /*break*/, 5];
                campaign = campaigns_1[_b];
                return [5 /*yield**/, _loop_2(campaign)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _b++;
                return [3 /*break*/, 2];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, Promise.resolve({
                    eligibleCampaigns: eligibleCampaigns,
                    eligibleCampaignsWithStorage: eligibleCampaignsWithStorage,
                    inEligibleCampaigns: inEligibleCampaigns,
                })];
        }
    });
}); };
/**
 * Evaluates the eligible campaigns and determines the winner campaign based on the provided settings, feature key, eligible campaigns, eligible campaigns with storage, group ID, and context.
 *
 * @param settings - The settings model.
 * @param featureKey - The key of the feature.
 * @param eligibleCampaigns - An array of eligible campaigns.
 * @param eligibleCampaignsWithStorage - An array of eligible campaigns with storage.
 * @param groupId - The ID of the group.
 * @param context - The context model.
 * @returns A promise that resolves to the winner campaign.
 */
var _findWinnerCampaignAmongEligibleCampaigns = function (settings, featureKey, eligibleCampaigns, eligibleCampaignsWithStorage, groupId, context, storageService) { return __awaiter(void 0, void 0, void 0, function () {
    var winnerCampaign, campaignIds, megAlgoNumber;
    var _a;
    return __generator(this, function (_b) {
        winnerCampaign = null;
        campaignIds = (0, CampaignUtil_1.getCampaignIdsFromFeatureKey)(settings, featureKey);
        megAlgoNumber = !(0, DataTypeUtil_1.isUndefined)((_a = settings === null || settings === void 0 ? void 0 : settings.getGroups()[groupId]) === null || _a === void 0 ? void 0 : _a.et)
            ? settings.getGroups()[groupId].et
            : constants_1.Constants.RANDOM_ALGO;
        // if eligibleCampaignsWithStorage has only one campaign, then that campaign is the winner
        if (eligibleCampaignsWithStorage.length === 1) {
            winnerCampaign = eligibleCampaignsWithStorage[0];
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
                campaignKey: eligibleCampaignsWithStorage[0].getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                    ? eligibleCampaignsWithStorage[0].getKey()
                    : eligibleCampaignsWithStorage[0].getName() + '_' + eligibleCampaignsWithStorage[0].getRuleKey(),
                groupId: groupId,
                userId: context.getId(),
                algo: '',
            }));
        }
        else if (eligibleCampaignsWithStorage.length > 1 && megAlgoNumber === constants_1.Constants.RANDOM_ALGO) {
            // if eligibleCampaignsWithStorage has more than one campaign and algo is random, then find the winner using random algo
            winnerCampaign = _normalizeWeightsAndFindWinningCampaign(eligibleCampaignsWithStorage, context, campaignIds, groupId, storageService);
        }
        else if (eligibleCampaignsWithStorage.length > 1) {
            // if eligibleCampaignsWithStorage has more than one campaign and algo is not random, then find the winner using advanced algo
            winnerCampaign = _getCampaignUsingAdvancedAlgo(settings, eligibleCampaignsWithStorage, context, campaignIds, groupId, storageService);
        }
        if (eligibleCampaignsWithStorage.length === 0) {
            if (eligibleCampaigns.length === 1) {
                winnerCampaign = eligibleCampaigns[0];
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
                    campaignKey: eligibleCampaigns[0].getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
                        ? eligibleCampaigns[0].getKey()
                        : eligibleCampaigns[0].getName() + '_' + eligibleCampaigns[0].getRuleKey(),
                    groupId: groupId,
                    userId: context.getId(),
                    algo: '',
                }));
            }
            else if (eligibleCampaigns.length > 1 && megAlgoNumber === constants_1.Constants.RANDOM_ALGO) {
                winnerCampaign = _normalizeWeightsAndFindWinningCampaign(eligibleCampaigns, context, campaignIds, groupId, storageService);
            }
            else if (eligibleCampaigns.length > 1) {
                winnerCampaign = _getCampaignUsingAdvancedAlgo(settings, eligibleCampaigns, context, campaignIds, groupId, storageService);
            }
        }
        return [2 /*return*/, winnerCampaign];
    });
}); };
/**
 * Normalizes the weights of shortlisted campaigns and determines the winning campaign using random allocation.
 *
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @returns The winning campaign or null if none is found.
 */
var _normalizeWeightsAndFindWinningCampaign = function (shortlistedCampaigns, context, calledCampaignIds, groupId, storageService) {
    // Normalize the weights of all the shortlisted campaigns
    shortlistedCampaigns.forEach(function (campaign) {
        campaign.weight = Math.round((100 / shortlistedCampaigns.length) * 10000) / 10000;
    });
    // make shortlistedCampaigns as array of VariationModel
    shortlistedCampaigns = shortlistedCampaigns.map(function (campaign) { return new VariationModel_1.VariationModel().modelFromDictionary(campaign); });
    // re-distribute the traffic for each camapign
    (0, CampaignUtil_1.setCampaignAllocation)(shortlistedCampaigns);
    var winnerCampaign = new CampaignDecisionService_1.CampaignDecisionService().getVariation(shortlistedCampaigns, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), undefined, groupId)));
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
        campaignKey: winnerCampaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB
            ? winnerCampaign.getKey()
            : winnerCampaign.getKey() + '_' + winnerCampaign.getRuleKey(),
        groupId: groupId,
        userId: context.getId(),
        algo: 'using random algorithm',
    }));
    if (winnerCampaign) {
        new StorageDecorator_1.StorageDecorator().setDataInStorage({
            featureKey: "".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId),
            context: context,
            experimentId: winnerCampaign.getId(),
            experimentKey: winnerCampaign.getKey(),
            experimentVariationId: winnerCampaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? winnerCampaign.getVariations()[0].getId() : -1,
        }, storageService);
        if (calledCampaignIds.includes(winnerCampaign.getId())) {
            return winnerCampaign;
        }
    }
    return null;
};
/**
 * Advanced algorithm to find the winning campaign based on priority order and weighted random distribution.
 *
 * @param settings - The settings model.
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @returns The winning campaign or null if none is found.
 */
var _getCampaignUsingAdvancedAlgo = function (settings, shortlistedCampaigns, context, calledCampaignIds, groupId, storageService) {
    var winnerCampaign = null;
    var found = false; // flag to check whether winnerCampaign has been found or not and helps to break from the outer loop
    var priorityOrder = !(0, DataTypeUtil_1.isUndefined)(settings.getGroups()[groupId].p) ? settings.getGroups()[groupId].p : {};
    var wt = !(0, DataTypeUtil_1.isUndefined)(settings.getGroups()[groupId].wt) ? settings.getGroups()[groupId].wt : {};
    for (var i = 0; i < priorityOrder.length; i++) {
        for (var j = 0; j < shortlistedCampaigns.length; j++) {
            if (shortlistedCampaigns[j].id == priorityOrder[i]) {
                winnerCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[j]);
                found = true;
                break;
            }
            else if (shortlistedCampaigns[j].id + '_' + shortlistedCampaigns[j].variations[0].id === priorityOrder[i]) {
                winnerCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[j]);
                found = true;
                break;
            }
        }
        if (found === true)
            break;
    }
    // If winnerCampaign not found through Priority, then go for weighted Random distribution and for that,
    // Store the list of campaigns (participatingCampaigns) out of shortlistedCampaigns and their corresponding weights present in weightage distribution array (wt)
    if (winnerCampaign === null) {
        var participatingCampaignList = [];
        // iterate over shortlisted campaigns and add weights from the weight array
        for (var i = 0; i < shortlistedCampaigns.length; i++) {
            var campaignId = shortlistedCampaigns[i].id;
            if (!(0, DataTypeUtil_1.isUndefined)(wt[campaignId])) {
                var clonedCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[i]);
                clonedCampaign.weight = wt[campaignId];
                participatingCampaignList.push(clonedCampaign);
            }
            else if (!(0, DataTypeUtil_1.isUndefined)(wt[campaignId + '_' + shortlistedCampaigns[i].variations[0].id])) {
                var clonedCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[i]);
                clonedCampaign.weight = wt[campaignId + '_' + shortlistedCampaigns[i].variations[0].id];
                participatingCampaignList.push(clonedCampaign);
            }
        }
        /* Finding winner campaign using weighted Distibution :
          1. Re-distribute the traffic by assigning range values for each camapign in particaptingCampaignList
          2. Calculate bucket value for the given userId and groupId
          3. Get the winnerCampaign by checking the Start and End Bucket Allocations of each campaign
        */
        // make participatingCampaignList as array of VariationModel
        participatingCampaignList = participatingCampaignList.map(function (campaign) {
            return new VariationModel_1.VariationModel().modelFromDictionary(campaign);
        });
        (0, CampaignUtil_1.setCampaignAllocation)(participatingCampaignList);
        winnerCampaign = new CampaignDecisionService_1.CampaignDecisionService().getVariation(participatingCampaignList, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), undefined, groupId)));
    }
    // WinnerCampaign should not be null, in case when winnerCampaign hasn't been found through PriorityOrder and
    // also shortlistedCampaigns and wt array does not have a single campaign id in common
    if (winnerCampaign) {
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
            campaignKey: winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB
                ? winnerCampaign.key
                : winnerCampaign.key + '_' + winnerCampaign.ruleKey,
            groupId: groupId,
            userId: context.getId(),
            algo: 'using advanced algorithm',
        }));
    }
    else {
        // TODO -- Log the error message
        // LogManager.Instance.info(
        //   buildMessage(InfoLogMessagesEnum.MEG_NO_WINNER_CAMPAIGN, {
        //     groupId,
        //     userId: context.getId(),
        //   }),
        // );
        logger_1.LogManager.Instance.info("No winner campaign found for MEG group: ".concat(groupId));
    }
    if (winnerCampaign) {
        new StorageDecorator_1.StorageDecorator().setDataInStorage({
            featureKey: "".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId),
            context: context,
            experimentId: winnerCampaign.id,
            experimentKey: winnerCampaign.key,
            experimentVariationId: winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? winnerCampaign.variations[0].id : -1,
        }, storageService);
        if (calledCampaignIds.includes(winnerCampaign.id)) {
            return winnerCampaign;
        }
    }
    return null;
};


/***/ }),

/***/ "./lib/utils/NetworkUtil.ts":
/*!**********************************!*\
  !*** ./lib/utils/NetworkUtil.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSettingsPath = getSettingsPath;
exports.getTrackEventPath = getTrackEventPath;
exports.getEventsBaseProperties = getEventsBaseProperties;
exports._getEventBasePayload = _getEventBasePayload;
exports.getTrackUserPayloadData = getTrackUserPayloadData;
exports.getTrackGoalPayloadData = getTrackGoalPayloadData;
exports.getAttributePayloadData = getAttributePayloadData;
exports.sendPostApiRequest = sendPostApiRequest;
exports.getShouldWaitForTrackingCalls = getShouldWaitForTrackingCalls;
exports.setShouldWaitForTrackingCalls = setShouldWaitForTrackingCalls;
exports.getMessagingEventPayload = getMessagingEventPayload;
exports.getSDKInitEventPayload = getSDKInitEventPayload;
exports.getSDKUsageStatsEventPayload = getSDKUsageStatsEventPayload;
exports.getDebuggerEventPayload = getDebuggerEventPayload;
exports.sendEvent = sendEvent;
exports.createNetWorkAndRetryDebugEvent = createNetWorkAndRetryDebugEvent;
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
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var UuidUtil_1 = __webpack_require__(/*! ./UuidUtil */ "./lib/utils/UuidUtil.ts");
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var HeadersEnum_1 = __webpack_require__(/*! ../enums/HeadersEnum */ "./lib/enums/HeadersEnum.ts");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./lib/enums/HttpMethodEnum.ts");
var UrlEnum_1 = __webpack_require__(/*! ../enums/UrlEnum */ "./lib/enums/UrlEnum.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./lib/packages/network-layer/index.ts");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./lib/services/SettingsService.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
var UrlUtil_1 = __webpack_require__(/*! ./UrlUtil */ "./lib/utils/UrlUtil.ts");
var PromiseUtil_1 = __webpack_require__(/*! ./PromiseUtil */ "./lib/utils/PromiseUtil.ts");
var UsageStatsUtil_1 = __webpack_require__(/*! ./UsageStatsUtil */ "./lib/utils/UsageStatsUtil.ts");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var DebuggerCategoryEnum_1 = __webpack_require__(/*! ../enums/DebuggerCategoryEnum */ "./lib/enums/DebuggerCategoryEnum.ts");
var DebuggerServiceUtil_1 = __webpack_require__(/*! ./DebuggerServiceUtil */ "./lib/utils/DebuggerServiceUtil.ts");
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./lib/enums/ApiEnum.ts");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./lib/enums/CampaignTypeEnum.ts");
/**
 * Constructs the settings path with API key and account ID.
 * @param {string} sdkKey - The API key.
 * @param {any} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The settings path including API key, random number, and account ID.
 */
function getSettingsPath(sdkKey, accountId) {
    var path = {
        i: "".concat(sdkKey), // Inject API key
        r: Math.random(), // Random number for cache busting
        a: accountId, // Account ID
    };
    return path;
}
/**
 * Constructs the tracking path for an event.
 * @param {string} event - The event type.
 * @param {string} accountId - The account identifier.
 * @param {string} userId - The user identifier.
 * @returns {Record<string, dynamic>} - The tracking path for the event.
 */
function getTrackEventPath(event, accountId, userId) {
    var path = {
        event_type: event, // Type of the event
        account_id: accountId, // Account ID
        uId: userId, // User ID
        u: (0, UuidUtil_1.getUUID)(userId, accountId), // UUID generated for the user
        sdk: constants_1.Constants.SDK_NAME, // SDK name constant
        'sdk-v': constants_1.Constants.SDK_VERSION, // SDK version
        random: (0, FunctionUtil_1.getRandomNumber)(), // Random number for uniqueness
        ap: constants_1.Constants.PLATFORM, // Application platform
        sId: (0, FunctionUtil_1.getCurrentUnixTimestamp)(), // Session ID
        ed: JSON.stringify({ p: 'server' }), // Additional encoded data
    };
    return path;
}
/**
 * Builds generic properties for different tracking calls required by VWO servers.
 * @param {Object} configObj
 * @param {String} eventName
 * @returns properties
 */
function getEventsBaseProperties(eventName, visitorUserAgent, ipAddress, isUsageStatsEvent, usageStatsAccountId) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    if (isUsageStatsEvent === void 0) { isUsageStatsEvent = false; }
    if (usageStatsAccountId === void 0) { usageStatsAccountId = null; }
    var properties = Object.assign({
        en: eventName,
        a: SettingsService_1.SettingsService.Instance.accountId,
        eTime: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
        random: (0, FunctionUtil_1.getRandomNumber)(),
        p: 'FS',
        visitor_ua: visitorUserAgent,
        visitor_ip: ipAddress,
        sn: constants_1.Constants.SDK_NAME,
        sv: constants_1.Constants.SDK_VERSION,
    });
    if (!isUsageStatsEvent) {
        // set env key for standard sdk events
        properties.env = SettingsService_1.SettingsService.Instance.sdkKey;
    }
    else {
        // set account id for internal usage stats event
        properties.a = usageStatsAccountId;
    }
    properties.url = constants_1.Constants.HTTPS_PROTOCOL + UrlUtil_1.UrlUtil.getBaseUrl() + UrlEnum_1.UrlEnum.EVENTS;
    return properties;
}
/**
 * Builds generic payload required by all the different tracking calls.
 * @param {Object} settings   settings file
 * @param {String} userId     user id
 * @param {String} eventName  event name
 * @returns properties
 */
function _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress, isUsageStatsEvent, usageStatsAccountId, shouldGenerateUUID) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    if (isUsageStatsEvent === void 0) { isUsageStatsEvent = false; }
    if (usageStatsAccountId === void 0) { usageStatsAccountId = null; }
    if (shouldGenerateUUID === void 0) { shouldGenerateUUID = true; }
    var accountId = SettingsService_1.SettingsService.Instance.accountId;
    if (isUsageStatsEvent) {
        // set account id for internal usage stats event
        accountId = usageStatsAccountId;
    }
    var uuid;
    if (shouldGenerateUUID) {
        uuid = (0, UuidUtil_1.getUUID)(userId.toString(), accountId.toString());
    }
    else {
        uuid = userId.toString();
    }
    var props = {
        vwo_sdkName: constants_1.Constants.SDK_NAME,
        vwo_sdkVersion: constants_1.Constants.SDK_VERSION,
    };
    if (!isUsageStatsEvent) {
        // set env key for standard sdk events
        props.vwo_envKey = SettingsService_1.SettingsService.Instance.sdkKey;
    }
    var properties = {
        d: {
            msgId: "".concat(uuid, "-").concat((0, FunctionUtil_1.getCurrentUnixTimestampInMillis)()),
            visId: uuid,
            sessionId: (0, FunctionUtil_1.getCurrentUnixTimestamp)(),
            visitor_ua: visitorUserAgent,
            visitor_ip: ipAddress,
            event: {
                props: props,
                name: eventName,
                time: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
            },
        },
    };
    if (!isUsageStatsEvent) {
        // set visitor props for standard sdk events
        properties.d.visitor = {
            props: {
                vwo_fs_environment: SettingsService_1.SettingsService.Instance.sdkKey,
            },
        };
    }
    return properties;
}
/**
 * Builds payload to track the visitor.
 * @param {Object} configObj
 * @param {String} userId
 * @param {String} eventName
 * @param {String} campaignId
 * @param {Number} variationId
 * @returns track-user payload
 */
function getTrackUserPayloadData(settings, eventName, campaignId, variationId, context) {
    var userId = context.getId();
    var visitorUserAgent = context.getUserAgent();
    var ipAddress = context.getIpAddress();
    var customVariables = context.getCustomVariables();
    var postSegmentationVariables = context.getPostSegmentationVariables();
    var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    if (context.getSessionId() !== 0) {
        properties.d.sessionId = context.getSessionId();
    }
    properties.d.event.props.id = campaignId;
    properties.d.event.props.variation = variationId;
    properties.d.event.props.isFirst = 1;
    // Add post-segmentation variables if they exist in custom variables
    if (postSegmentationVariables &&
        postSegmentationVariables.length > 0 &&
        customVariables &&
        Object.keys(customVariables).length > 0) {
        for (var _i = 0, postSegmentationVariables_1 = postSegmentationVariables; _i < postSegmentationVariables_1.length; _i++) {
            var key = postSegmentationVariables_1[_i];
            if (customVariables[key]) {
                properties.d.visitor.props[key] = customVariables[key];
            }
        }
    }
    // Add IP address as a standard attribute if available
    if (ipAddress) {
        properties.d.visitor.props.ip = ipAddress;
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
        accountId: settings.getAccountId(),
        userId: userId,
        campaignId: campaignId,
    }));
    return properties;
}
/**
 * Constructs the payload data for tracking goals with custom event properties.
 * @param {any} settings - Configuration settings.
 * @param {any} userId - User identifier.
 * @param {string} eventName - Name of the event.
 * @param {any} eventProperties - Custom properties for the event.
 * @param {string} [visitorUserAgent=''] - Visitor's user agent.
 * @param {string} [ipAddress=''] - Visitor's IP address.
 * @returns {any} - The constructed payload data.
 */
function getTrackGoalPayloadData(settings, userId, eventName, eventProperties, visitorUserAgent, ipAddress, sessionId) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    if (sessionId === void 0) { sessionId = 0; }
    var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    if (sessionId !== 0) {
        properties.d.sessionId = sessionId;
    }
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props.variation = 1; // Temporary value for variation
    properties.d.event.props.id = 1; // Temporary value for ID
    // Add custom event properties if provided
    if (eventProperties && (0, DataTypeUtil_1.isObject)(eventProperties) && Object.keys(eventProperties).length > 0) {
        for (var prop in eventProperties) {
            properties.d.event.props[prop] = eventProperties[prop];
        }
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_GOAL, {
        eventName: eventName,
        accountId: settings.getAccountId(),
        userId: userId,
    }));
    return properties;
}
/**
 * Constructs the payload data for syncing multiple visitor attributes.
 * @param {SettingsModel} settings - Configuration settings.
 * @param {string | number} userId - User ID.
 * @param {string} eventName - Event name.
 * @param {Record<string, any>} attributes - Key-value map of attributes.
 * @param {string} [visitorUserAgent=''] - Visitor's User-Agent (optional).
 * @param {string} [ipAddress=''] - Visitor's IP Address (optional).
 * @returns {Record<string, any>} - Payload object to be sent in the request.
 */
function getAttributePayloadData(settings, userId, eventName, attributes, visitorUserAgent, ipAddress, sessionId) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    if (sessionId === void 0) { sessionId = 0; }
    var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    if (sessionId !== 0) {
        properties.d.sessionId = sessionId;
    }
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = settings.getSdkkey(); // Set environment key
    // Iterate over the attributes map and append to the visitor properties
    for (var _i = 0, _a = Object.entries(attributes); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        properties.d.visitor.props[key] = value;
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_SYNC_VISITOR_PROP, {
        eventName: eventName,
        accountId: settings.getAccountId(),
        userId: userId,
    }));
    return properties;
}
/**
 * Sends a POST API request with the specified properties and payload.
 * @param {any} properties - Properties for the request.
 * @param {any} payload - Payload for the request.
 * @param {string} userId - User ID.
 */
function sendPostApiRequest(properties_1, payload_1, userId_1) {
    return __awaiter(this, arguments, void 0, function (properties, payload, userId, eventProperties, campaignInfo) {
        var networkManager, retryConfig, headers, userAgent, ipAddress, baseUrl, request, apiName, extraDataForMessage;
        if (eventProperties === void 0) { eventProperties = {}; }
        if (campaignInfo === void 0) { campaignInfo = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    networkManager = network_layer_1.NetworkManager.Instance;
                    retryConfig = networkManager.getRetryConfig();
                    headers = {};
                    userAgent = payload.d.visitor_ua;
                    ipAddress = payload.d.visitor_ip;
                    // Set headers if available
                    if (userAgent)
                        headers[HeadersEnum_1.HeadersEnum.USER_AGENT] = userAgent;
                    if (ipAddress)
                        headers[HeadersEnum_1.HeadersEnum.IP] = ipAddress;
                    baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
                    baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
                    request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.EVENTS, properties, payload, headers, SettingsService_1.SettingsService.Instance.protocol, SettingsService_1.SettingsService.Instance.port, retryConfig);
                    request.setEventName(properties.en);
                    request.setUuid(payload.d.visId);
                    if (properties.en === EventEnum_1.EventEnum.VWO_VARIATION_SHOWN) {
                        apiName = ApiEnum_1.ApiEnum.GET_FLAG;
                        if (campaignInfo.campaignType === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT ||
                            campaignInfo.campaignType === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                            extraDataForMessage = "feature: ".concat(campaignInfo.featureKey, ", rule: ").concat(campaignInfo.variationName);
                        }
                        else {
                            extraDataForMessage = "feature: ".concat(campaignInfo.featureKey, ", rule: ").concat(campaignInfo.campaignKey, " and variation: ").concat(campaignInfo.variationName);
                        }
                        request.setCampaignId(payload.d.event.props.id);
                    }
                    else if (properties.en != EventEnum_1.EventEnum.VWO_VARIATION_SHOWN) {
                        if (properties.en === EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP) {
                            apiName = ApiEnum_1.ApiEnum.SET_ATTRIBUTE;
                            extraDataForMessage = apiName;
                        }
                        else if (properties.en !== EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT &&
                            properties.en !== EventEnum_1.EventEnum.VWO_LOG_EVENT &&
                            properties.en !== EventEnum_1.EventEnum.VWO_INIT_CALLED) {
                            apiName = ApiEnum_1.ApiEnum.TRACK_EVENT;
                            extraDataForMessage = "event: ".concat(properties.en);
                        }
                        if (Object.keys(eventProperties).length > 0) {
                            request.setEventProperties(eventProperties);
                        }
                    }
                    return [4 /*yield*/, network_layer_1.NetworkManager.Instance.post(request)
                            .then(function (response) {
                            // if attempt is more than 0
                            if (response.getTotalAttempts() > 0) {
                                var debugEventProps = createNetWorkAndRetryDebugEvent(response, payload, apiName, extraDataForMessage);
                                debugEventProps.uuid = request.getUuid();
                                // send debug event
                                (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                            }
                            // clear usage stats only if network call is successful
                            if (Object.keys(UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats()).length > 0) {
                                UsageStatsUtil_1.UsageStatsUtil.getInstance().clearUsageStats();
                            }
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.NETWORK_CALL_SUCCESS, {
                                event: properties.en,
                                endPoint: UrlEnum_1.UrlEnum.EVENTS,
                                accountId: SettingsService_1.SettingsService.Instance.accountId,
                                userId: userId,
                                uuid: payload.d.visId,
                            }));
                        })
                            .catch(function (err) {
                            var debugEventProps = createNetWorkAndRetryDebugEvent(err, payload, apiName, extraDataForMessage);
                            debugEventProps.uuid = request.getUuid();
                            (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                            logger_1.LogManager.Instance.errorLog('NETWORK_CALL_FAILED', {
                                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
                            }, {}, false);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Flag to determine if the SDK should wait for a network response.
var shouldWaitForTrackingCalls = false;
/**
 * Checks if the SDK should wait for a network response.
 * @returns {boolean} - True if the SDK should wait for a network response, false otherwise.
 */
function getShouldWaitForTrackingCalls() {
    return shouldWaitForTrackingCalls;
}
/**
 * Sets the value to determine if the SDK should wait for a network response.
 * @param value - The value to set.
 */
function setShouldWaitForTrackingCalls(value) {
    shouldWaitForTrackingCalls = value;
}
/**
 * Constructs the payload for a messaging event.
 * @param messageType - The type of the message.
 * @param message - The message to send.
 * @param eventName - The name of the event.
 * @returns The constructed payload.
 */
function getMessagingEventPayload(messageType, message, eventName, extraData) {
    if (extraData === void 0) { extraData = {}; }
    var userId = SettingsService_1.SettingsService.Instance.accountId + '_' + SettingsService_1.SettingsService.Instance.sdkKey;
    var properties = _getEventBasePayload(null, userId, eventName);
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = SettingsService_1.SettingsService.Instance.sdkKey; // Set environment key
    properties.d.event.props.product = constants_1.Constants.PRODUCT_NAME;
    var data = {
        type: messageType,
        content: {
            title: message,
            dateTime: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
        },
        metaInfo: __assign({}, extraData),
    };
    properties.d.event.props.data = data;
    return properties;
}
/**
 * Constructs the payload for init called event.
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
function getSDKInitEventPayload(eventName, settingsFetchTime, sdkInitTime) {
    var userId = SettingsService_1.SettingsService.Instance.accountId + '_' + SettingsService_1.SettingsService.Instance.sdkKey;
    var properties = _getEventBasePayload(null, userId, eventName);
    // Set the required fields as specified
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = SettingsService_1.SettingsService.Instance.sdkKey;
    properties.d.event.props.product = constants_1.Constants.PRODUCT_NAME;
    var data = {
        isSDKInitialized: true,
        settingsFetchTime: settingsFetchTime,
        sdkInitTime: sdkInitTime,
    };
    properties.d.event.props.data = data;
    return properties;
}
/**
 * Constructs the payload for sdk usage stats event.
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
function getSDKUsageStatsEventPayload(eventName, usageStatsAccountId) {
    var userId = SettingsService_1.SettingsService.Instance.accountId + '_' + SettingsService_1.SettingsService.Instance.sdkKey;
    var properties = _getEventBasePayload(null, userId, eventName, '', '', true, usageStatsAccountId);
    // Set the required fields as specified
    properties.d.event.props.product = constants_1.Constants.PRODUCT_NAME;
    properties.d.event.props.vwoMeta = UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats();
    return properties;
}
/**
 * Constructs the payload for debugger event.
 * @param eventProps - The properties for the event.
 * @returns The constructed payload.
 */
function getDebuggerEventPayload(eventProps) {
    if (eventProps === void 0) { eventProps = {}; }
    var uuid;
    var accountId = SettingsService_1.SettingsService.Instance.accountId.toString();
    var sdkKey = SettingsService_1.SettingsService.Instance.sdkKey;
    // generate uuid if not present
    if (!eventProps.uuid) {
        uuid = (0, UuidUtil_1.getUUID)(accountId + '_' + sdkKey, accountId);
        eventProps.uuid = uuid;
    }
    else {
        uuid = eventProps.uuid;
    }
    // create standard event payload
    var properties = _getEventBasePayload(null, uuid, EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT, '', '', false, null, false);
    properties.d.event.props = {};
    // add session id to the event props if not present
    if (eventProps.sId) {
        properties.d.sessionId = eventProps.sId;
    }
    else {
        eventProps.sId = properties.d.sessionId;
    }
    // add a safety check for apiName
    if (!eventProps.an) {
        eventProps.an = EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT;
    }
    // add all debugger props inside vwoMeta
    properties.d.event.props.vwoMeta = __assign(__assign({}, eventProps), { a: SettingsService_1.SettingsService.Instance.accountId, product: constants_1.Constants.PRODUCT_NAME, sn: constants_1.Constants.SDK_NAME, sv: constants_1.Constants.SDK_VERSION, eventId: (0, UuidUtil_1.getRandomUUID)(SettingsService_1.SettingsService.Instance.sdkKey) });
    return properties;
}
/**
 * Sends an event to VWO (generic event sender).
 * @param properties - Query parameters for the request.
 * @param payload - The payload for the request.
 * @param eventName - The name of the event to send.
 * @returns A promise that resolves to the response from the server.
 */
function sendEvent(properties, payload, eventName) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredObject, networkInstance, retryConfig, baseUrl, protocol, port, request;
        return __generator(this, function (_a) {
            deferredObject = new PromiseUtil_1.Deferred();
            networkInstance = network_layer_1.NetworkManager.Instance;
            retryConfig = networkInstance.getRetryConfig();
            // disable retry for event (no retry for generic events)
            if (eventName === EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT)
                retryConfig.shouldRetry = false;
            baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
            protocol = SettingsService_1.SettingsService.Instance.protocol;
            port = SettingsService_1.SettingsService.Instance.port;
            if (eventName === EventEnum_1.EventEnum.VWO_LOG_EVENT ||
                eventName === EventEnum_1.EventEnum.VWO_USAGE_STATS ||
                eventName === EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT) {
                baseUrl = constants_1.Constants.HOST_NAME;
                protocol = constants_1.Constants.HTTPS_PROTOCOL;
                port = 443;
            }
            baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
            try {
                request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.EVENTS, properties, payload, null, protocol, port, retryConfig);
                request.setEventName(properties.en);
                // Perform the network POST request
                networkInstance
                    .post(request)
                    .then(function (response) {
                    // Resolve the deferred object with the data from the response
                    deferredObject.resolve(response.getData());
                })
                    .catch(function (err) {
                    // Reject the deferred object with the error response
                    deferredObject.reject(err);
                });
                return [2 /*return*/, deferredObject.promise];
            }
            catch (err) {
                // Resolve the promise with false as fallback
                deferredObject.resolve(false);
                return [2 /*return*/, deferredObject.promise];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Creates a network and retry debug event.
 * @param response The response model.
 * @param payload The payload for the request.
 * @param apiName The name of the API.
 * @param extraData Extra data for the message.
 * @param isBatchingDebugEvent Whether the debug event was triggered due to batching.
 * @returns The debug event properties.
 */
function createNetWorkAndRetryDebugEvent(response, payload, apiName, extraData) {
    var _a;
    try {
        // set category, if call got success then category is retry, otherwise network
        var category = DebuggerCategoryEnum_1.DebuggerCategoryEnum.RETRY;
        var msg_t = constants_1.Constants.NETWORK_CALL_SUCCESS_WITH_RETRIES;
        var msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.NETWORK_CALL_SUCCESS_WITH_RETRIES, {
            extraData: extraData,
            attempts: response.getTotalAttempts(),
            err: (0, FunctionUtil_1.getFormattedErrorMessage)(response.getError()),
        });
        var lt = logger_1.LogLevelEnum.INFO.toString();
        if (response.getStatusCode() !== 200) {
            category = DebuggerCategoryEnum_1.DebuggerCategoryEnum.NETWORK;
            msg_t = constants_1.Constants.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES;
            msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES, {
                extraData: extraData,
                attempts: response.getTotalAttempts(),
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(response.getError()),
            });
            lt = logger_1.LogLevelEnum.ERROR.toString();
        }
        var debugEventProps = {
            cg: category,
            msg_t: msg_t,
            msg: msg,
            lt: lt,
        };
        if (apiName) {
            debugEventProps.an = apiName;
        }
        if ((_a = payload === null || payload === void 0 ? void 0 : payload.d) === null || _a === void 0 ? void 0 : _a.sessionId) {
            debugEventProps.sId = payload.d.sessionId;
        }
        else {
            debugEventProps.sId = (0, FunctionUtil_1.getCurrentUnixTimestamp)();
        }
        return debugEventProps;
    }
    catch (err) {
        return {
            cg: DebuggerCategoryEnum_1.DebuggerCategoryEnum.NETWORK,
            an: apiName,
            msg_t: 'NETWORK_CALL_FAILED',
            msg: (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
                method: extraData,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }),
            lt: logger_1.LogLevelEnum.ERROR.toString(),
            sId: (0, FunctionUtil_1.getCurrentUnixTimestamp)(),
        };
    }
}


/***/ }),

/***/ "./lib/utils/PromiseUtil.ts":
/*!**********************************!*\
  !*** ./lib/utils/PromiseUtil.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Deferred = Deferred;
/**
 * Creates a Deferred object with properties for promise, resolve, and reject.
 * This allows manual control over the resolution and rejection of a promise.
 * @returns {Deferred} The Deferred object with promise, resolve, and reject methods.
 */
function Deferred() {
    var _this = this;
    // Create a new Promise and attach resolve and reject methods to the Deferred object
    this.promise = new Promise(function (resolve, reject) {
        _this.resolve = resolve; // Method to resolve the promise
        _this.reject = reject; // Method to reject the promise
    });
    return this; // Return the Deferred object with attached methods
}


/***/ }),

/***/ "./lib/utils/RuleEvaluationUtil.ts":
/*!*****************************************!*\
  !*** ./lib/utils/RuleEvaluationUtil.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateRule = void 0;
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
var DecisionUtil_1 = __webpack_require__(/*! ./DecisionUtil */ "./lib/utils/DecisionUtil.ts");
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var ImpressionUtil_1 = __webpack_require__(/*! ./ImpressionUtil */ "./lib/utils/ImpressionUtil.ts");
/**
 * Evaluates the rules for a given campaign and feature based on the provided context.
 * This function checks for whitelisting and pre-segmentation conditions, and if applicable,
 * sends an impression for the variation shown.
 *
 * @param {SettingsModel} settings - The settings configuration for the evaluation.
 * @param {FeatureModel} feature - The feature being evaluated.
 * @param {CampaignModel} campaign - The campaign associated with the feature.
 * @param {ContextModel} context - The user context for evaluation.
 * @param {Map<string, any>} evaluatedFeatureMap - A map of evaluated features.
 * @param {Map<number, number>} megGroupWinnerCampaigns - A map of MEG group winner campaigns.
 * @param {StorageService} storageService - The storage service for persistence.
 * @param {any} decision - The decision object that will be updated based on the evaluation.
 * @returns {Promise<[boolean, any]>} A promise that resolves to a tuple containing the result of the pre-segmentation
 * and the whitelisted object, if any.
 */
var evaluateRule = function (settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, preSegmentationResult, whitelistedObject;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, DecisionUtil_1.checkWhitelistingAndPreSeg)(settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision)];
            case 1:
                _a = _b.sent(), preSegmentationResult = _a[0], whitelistedObject = _a[1];
                if (!(preSegmentationResult && (0, DataTypeUtil_1.isObject)(whitelistedObject) && Object.keys(whitelistedObject).length > 0)) return [3 /*break*/, 4];
                // Update the decision object with campaign and variation details
                Object.assign(decision, {
                    experimentId: campaign.getId(),
                    experimentKey: campaign.getKey(),
                    experimentVariationId: whitelistedObject.variationId,
                });
                if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), whitelistedObject.variation.id, context, feature.getKey())];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), whitelistedObject.variation.id, context, feature.getKey());
                _b.label = 4;
            case 4: 
            // Return the results of the evaluation
            return [2 /*return*/, { preSegmentationResult: preSegmentationResult, whitelistedObject: whitelistedObject, updatedDecision: decision }];
        }
    });
}); };
exports.evaluateRule = evaluateRule;


/***/ }),

/***/ "./lib/utils/SdkInitAndUsageStatsUtil.ts":
/*!***********************************************!*\
  !*** ./lib/utils/SdkInitAndUsageStatsUtil.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendSdkInitEvent = sendSdkInitEvent;
exports.sendSDKUsageStatsEvent = sendSDKUsageStatsEvent;
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
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./lib/utils/NetworkUtil.ts");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var BatchEventsQueue_1 = __webpack_require__(/*! ../services/BatchEventsQueue */ "./lib/services/BatchEventsQueue.ts");
/**
 * Sends an init called event to VWO.
 * This event is triggered when the init function is called.
 * @param {number} settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param {number} sdkInitTime - Time taken to initialize the SDK in milliseconds.
 */
function sendSdkInitEvent(settingsFetchTime, sdkInitTime) {
    return __awaiter(this, void 0, void 0, function () {
        var properties, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_INIT_CALLED);
                    payload = (0, NetworkUtil_1.getSDKInitEventPayload)(EventEnum_1.EventEnum.VWO_INIT_CALLED, settingsFetchTime, sdkInitTime);
                    if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
                    BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
                    return [3 /*break*/, 3];
                case 1: 
                // Send the constructed properties and payload as a POST request
                //send eventName in parameters so that we can enable retry for this event
                return [4 /*yield*/, (0, NetworkUtil_1.sendEvent)(properties, payload, EventEnum_1.EventEnum.VWO_INIT_CALLED).catch(function () { })];
                case 2:
                    // Send the constructed properties and payload as a POST request
                    //send eventName in parameters so that we can enable retry for this event
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Sends a usage stats event to VWO.
 * This event is triggered when the SDK is initialized.
 * @returns A promise that resolves to the response from the server.
 */
function sendSDKUsageStatsEvent(usageStatsAccountId) {
    return __awaiter(this, void 0, void 0, function () {
        var properties, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_USAGE_STATS, null, null, true, usageStatsAccountId);
                    payload = (0, NetworkUtil_1.getSDKUsageStatsEventPayload)(EventEnum_1.EventEnum.VWO_USAGE_STATS, usageStatsAccountId);
                    if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
                    BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
                    return [3 /*break*/, 3];
                case 1: 
                // Send the constructed properties and payload as a POST request
                //send eventName in parameters so that we can enable retry for this event
                return [4 /*yield*/, (0, NetworkUtil_1.sendEvent)(properties, payload, EventEnum_1.EventEnum.VWO_USAGE_STATS).catch(function () { })];
                case 2:
                    // Send the constructed properties and payload as a POST request
                    //send eventName in parameters so that we can enable retry for this event
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}


/***/ }),

/***/ "./lib/utils/SettingsUtil.ts":
/*!***********************************!*\
  !*** ./lib/utils/SettingsUtil.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setSettingsAndAddCampaignsToRules = setSettingsAndAddCampaignsToRules;
var SettingsModel_1 = __webpack_require__(/*! ../models/settings/SettingsModel */ "./lib/models/settings/SettingsModel.ts");
var CampaignUtil_1 = __webpack_require__(/*! ./CampaignUtil */ "./lib/utils/CampaignUtil.ts");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var GatewayServiceUtil_1 = __webpack_require__(/*! ./GatewayServiceUtil */ "./lib/utils/GatewayServiceUtil.ts");
/**
 * Sets settings and adds campaigns to rules
 * @param settings settings
 * @param vwoClientInstance VWOClient instance
 */
function setSettingsAndAddCampaignsToRules(settings, vwoClientInstance) {
    // create settings model and set it to vwoClientInstance
    vwoClientInstance.settings = new SettingsModel_1.SettingsModel(settings);
    vwoClientInstance.originalSettings = settings;
    // Optimize loop by avoiding multiple calls to `getCampaigns()`
    var campaigns = vwoClientInstance.settings.getCampaigns();
    campaigns.forEach(function (campaign, index) {
        (0, CampaignUtil_1.setVariationAllocation)(campaign);
        campaigns[index] = campaign;
    });
    (0, FunctionUtil_1.addLinkedCampaignsToSettings)(vwoClientInstance.settings);
    (0, GatewayServiceUtil_1.addIsGatewayServiceRequiredFlag)(vwoClientInstance.settings);
}


/***/ }),

/***/ "./lib/utils/UrlUtil.ts":
/*!******************************!*\
  !*** ./lib/utils/UrlUtil.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UrlUtil = void 0;
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
var constants_1 = __webpack_require__(/*! ../constants */ "./lib/constants/index.ts");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./lib/services/SettingsService.ts");
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./lib/utils/DataTypeUtil.ts");
exports.UrlUtil = {
    /**
     * Initializes the UrlUtil with optional collectionPrefix and gatewayServiceUrl.
     * If provided, these values are set after validation.
     * @param {string} [collectionPrefix] - Optional prefix for URL collections.
     * @returns {IUrlUtil} The instance of UrlUtil with updated properties.
     */
    init: function (_a) {
        var _b = _a === void 0 ? {} : _a, collectionPrefix = _b.collectionPrefix;
        // Set collectionPrefix if it is a valid string
        if (collectionPrefix && (0, DataTypeUtil_1.isString)(collectionPrefix)) {
            exports.UrlUtil.collectionPrefix = collectionPrefix;
        }
        return exports.UrlUtil;
    },
    /**
     * Retrieves the base URL.
     * If gatewayServiceUrl is set, it returns that; otherwise, it constructs the URL using baseUrl and collectionPrefix.
     * @returns {string} The base URL.
     */
    getBaseUrl: function () {
        var baseUrl = SettingsService_1.SettingsService.Instance.hostname;
        // Return the default baseUrl if no specific URL components are set
        return baseUrl;
    },
    /**
     * Updates the base URL by adding collection prefix if conditions are met.
     * @param {string} baseUrl - The original base URL to transform.
     * @returns {string} The transformed base URL.
     */
    getUpdatedBaseUrl: function (baseUrl) {
        // If collection prefix is set and the base URL is the default host name, return the base URL with the collection prefix.
        if (exports.UrlUtil.collectionPrefix && baseUrl === constants_1.Constants.HOST_NAME) {
            return "".concat(baseUrl, "/").concat(exports.UrlUtil.collectionPrefix);
        }
        return baseUrl;
    },
};


/***/ }),

/***/ "./lib/utils/UsageStatsUtil.ts":
/*!*************************************!*\
  !*** ./lib/utils/UsageStatsUtil.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsageStatsUtil = void 0;
var TransportManager_1 = __webpack_require__(/*! ../packages/logger/core/TransportManager */ "./lib/packages/logger/core/TransportManager.ts");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./lib/services/SettingsService.ts");
/**
 * Manages usage statistics for the SDK.
 * Tracks various features and configurations being used by the client.
 * Implements Singleton pattern to ensure a single instance.
 */
var UsageStatsUtil = /** @class */ (function () {
    /** Private constructor to prevent direct instantiation */
    function UsageStatsUtil() {
        /** Internal storage for usage statistics data */
        this.usageStatsData = {};
    }
    /**
     * Provides access to the singleton instance of UsageStatsUtil.
     *
     * @returns The single instance of UsageStatsUtil
     */
    UsageStatsUtil.getInstance = function () {
        if (!UsageStatsUtil.instance) {
            UsageStatsUtil.instance = new UsageStatsUtil();
        }
        return UsageStatsUtil.instance;
    };
    /**
     * Sets usage statistics based on provided options.
     * Maps various SDK features and configurations to boolean flags.
     *
     * @param options - Configuration options for the SDK
     * @param options.storage - Storage service configuration
     * @param options.logger - Logger configuration
     * @param options.eventBatching - Event batching configuration
     * @param options.integrations - Integrations configuration
     * @param options.pollingInterval - Polling interval configuration
     * @param options.sdkName - SDK name configuration
     */
    UsageStatsUtil.prototype.setUsageStats = function (options) {
        var _a;
        var storage = options.storage, logger = options.logger, batchEventData = options.batchEventData, gatewayService = options.gatewayService, integrations = options.integrations, pollInterval = options.pollInterval, _vwo_meta = options._vwo_meta, shouldWaitForTrackingCalls = options.shouldWaitForTrackingCalls;
        var data = {};
        data.a = SettingsService_1.SettingsService.Instance.accountId;
        data.env = SettingsService_1.SettingsService.Instance.sdkKey;
        // Map configuration options to usage stats flags
        if (integrations)
            data.ig = 1; // Integration enabled
        if (batchEventData)
            data.eb = 1; // Event batching enabled
        // if logger has transport or transports, then it is custom logger
        if (logger && (logger.transport || logger.transports))
            data.cl = 1;
        if (storage)
            data.ss = 1; // Storage service configured
        if (logger === null || logger === void 0 ? void 0 : logger.level) {
            data.ll = (_a = TransportManager_1.LogLevelNumberEnum[logger.level.toUpperCase()]) !== null && _a !== void 0 ? _a : -1; // Default to -1 if level is not recognized
        }
        if (gatewayService)
            data.gs = 1; // Gateway service configured
        if (pollInterval)
            data.pi = pollInterval; // Polling interval configured
        if (shouldWaitForTrackingCalls)
            data.swtc = 1;
        // if _vwo_meta has ea, then addd data._ea to be 1
        if (_vwo_meta && _vwo_meta.ea)
            data._ea = 1;
        if (false) {}
        this.usageStatsData = data;
    };
    /**
     * Retrieves the current usage statistics.
     *
     * @returns Record containing boolean flags for various SDK features in use
     */
    UsageStatsUtil.prototype.getUsageStats = function () {
        return this.usageStatsData;
    };
    /**
     * Clears the usage statistics data.
     */
    UsageStatsUtil.prototype.clearUsageStats = function () {
        this.usageStatsData = {};
    };
    return UsageStatsUtil;
}());
exports.UsageStatsUtil = UsageStatsUtil;


/***/ }),

/***/ "./lib/utils/UserIdUtil.ts":
/*!*********************************!*\
  !*** ./lib/utils/UserIdUtil.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserId = getUserId;
var AliasingUtil_1 = __webpack_require__(/*! ./AliasingUtil */ "./lib/utils/AliasingUtil.ts");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./lib/services/SettingsService.ts");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./lib/enums/log-messages/index.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./lib/utils/LogMessageUtil.ts");
function getUserId(userId, isAliasingEnabled) {
    return __awaiter(this, void 0, void 0, function () {
        var alias, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isAliasingEnabled) return [3 /*break*/, 4];
                    if (!SettingsService_1.SettingsService.Instance.isGatewayServiceProvided) return [3 /*break*/, 2];
                    return [4 /*yield*/, AliasingUtil_1.AliasingUtil.getAlias(userId)];
                case 1:
                    alias = _a.sent();
                    result = alias.find(function (item) { return item.aliasId === userId; });
                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.ALIAS_ENABLED, { userId: result === null || result === void 0 ? void 0 : result.userId }));
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.userId) || userId];
                case 2:
                    logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INVALID_GATEWAY_URL));
                    return [2 /*return*/, userId];
                case 3: return [3 /*break*/, 5];
                case 4: return [2 /*return*/, userId];
                case 5: return [2 /*return*/];
            }
        });
    });
}


/***/ }),

/***/ "./lib/utils/UuidUtil.ts":
/*!*******************************!*\
  !*** ./lib/utils/UuidUtil.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRandomUUID = getRandomUUID;
exports.getUUID = getUUID;
exports.generateUUID = generateUUID;
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
var Url_1 = __webpack_require__(/*! ../constants/Url */ "./lib/constants/Url.ts");
var uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/commonjs-browser/index.js");
var uuid_2 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/commonjs-browser/index.js");
/**
 * Generates a random UUID based on an API key.
 * @param sdkKey The API key used to generate a namespace for the UUID.
 * @returns A random UUID string.
 */
function getRandomUUID(sdkKey) {
    // Generate a namespace based on the API key using DNS namespace
    var namespace = (0, uuid_2.v5)(sdkKey, uuid_2.v5.DNS);
    // Generate a random UUID using the namespace derived from the API key
    var randomUUID = (0, uuid_2.v5)((0, uuid_1.v4)(), namespace);
    return randomUUID;
}
/**
 * Generates a UUID for a user based on their userId and accountId.
 * @param userId The user's ID.
 * @param accountId The account ID associated with the user.
 * @returns A UUID string formatted without dashes and in uppercase.
 */
function getUUID(userId, accountId) {
    var VWO_NAMESPACE = (0, uuid_2.v5)(Url_1.SEED_URL, uuid_2.v5.URL);
    // Convert userId and accountId to string to ensure proper type
    userId = String(userId);
    accountId = String(accountId);
    // Generate a namespace UUID based on the accountId
    var userIdNamespace = generateUUID(accountId, VWO_NAMESPACE);
    // Generate a UUID based on the userId and the previously generated namespace
    var uuidForUserIdAccountId = generateUUID(userId, userIdNamespace);
    // Remove all dashes from the UUID and convert it to uppercase
    var desiredUuid = uuidForUserIdAccountId === null || uuidForUserIdAccountId === void 0 ? void 0 : uuidForUserIdAccountId.replace(/-/gi, '').toUpperCase();
    return desiredUuid;
}
/**
 * Helper function to generate a UUID v5 based on a name and a namespace.
 * @param name The name from which to generate the UUID.
 * @param namespace The namespace used to generate the UUID.
 * @returns A UUID string or undefined if inputs are invalid.
 */
function generateUUID(name, namespace) {
    // Check for valid input to prevent errors
    if (!name || !namespace) {
        return;
    }
    // Generate and return the UUID v5
    return (0, uuid_2.v5)(name, namespace);
}


/***/ }),

/***/ "./lib/utils/XMLUtil.ts":
/*!******************************!*\
  !*** ./lib/utils/XMLUtil.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendGetCall = sendGetCall;
exports.sendPostCall = sendPostCall;
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
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./lib/enums/HttpMethodEnum.ts");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./lib/packages/logger/index.ts");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./lib/enums/EventEnum.ts");
var ResponseModel_1 = __webpack_require__(/*! ../packages/network-layer/models/ResponseModel */ "./lib/packages/network-layer/models/ResponseModel.ts");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./lib/utils/FunctionUtil.ts");
var noop = function () { };
function sendGetCall(options) {
    sendRequest(HttpMethodEnum_1.HttpMethodEnum.GET, options);
}
function sendPostCall(options) {
    sendRequest(HttpMethodEnum_1.HttpMethodEnum.POST, options);
}
function sendRequest(method, options) {
    var requestModel = options.requestModel, _a = options.successCallback, successCallback = _a === void 0 ? noop : _a, _b = options.errorCallback, errorCallback = _b === void 0 ? noop : _b;
    var networkOptions = requestModel.getOptions();
    var retryCount = 0;
    var shouldRetry = networkOptions.retryConfig.shouldRetry;
    var maxRetries = networkOptions.retryConfig.maxRetries;
    function executeRequest() {
        // Extract network options from the request model.
        var responseModel = new ResponseModel_1.ResponseModel();
        var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
        if (networkOptions.port) {
            url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
        }
        var body = networkOptions.body;
        var customHeaders = networkOptions.headers || {};
        var timeout = networkOptions.timeout;
        var xhr = new XMLHttpRequest();
        if (timeout) {
            xhr.timeout = timeout;
        }
        xhr.onload = function () {
            responseModel.setStatusCode(xhr.status);
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = xhr.responseText;
                // send log to vwo, if request is successful and attempt is greater than 0
                if (retryCount > 0) {
                    responseModel.setTotalAttempts(retryCount);
                    responseModel.setError(requestModel.getLastError());
                }
                if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
                    var parsedResponse = JSON.parse(response);
                    responseModel.setData(parsedResponse);
                    successCallback(responseModel);
                }
                else {
                    responseModel.setData(response);
                    successCallback(responseModel);
                }
            }
            else if (xhr.status === 400) {
                responseModel.setTotalAttempts(retryCount);
                responseModel.setError(xhr.responseText);
                errorCallback(responseModel);
            }
            else {
                handleError(xhr.statusText);
            }
        };
        xhr.onerror = function () {
            handleError("".concat(xhr.statusText, ", status: ").concat(xhr.status));
        };
        if (timeout) {
            xhr.ontimeout = function () {
                handleError('Request timed out');
            };
        }
        function handleError(error) {
            if (shouldRetry && retryCount < maxRetries) {
                var delay = networkOptions.retryConfig.initialDelay *
                    Math.pow(networkOptions.retryConfig.backoffMultiplier, retryCount) *
                    1000; // Exponential backoff
                retryCount++;
                logger_1.LogManager.Instance.errorLog('ATTEMPTING_RETRY_FOR_FAILED_NETWORK_CALL', {
                    endPoint: url.split('?')[0],
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                    delay: delay / 1000,
                    attempt: retryCount,
                    maxRetries: maxRetries,
                }, {}, false);
                requestModel.setLastError(error);
                setTimeout(executeRequest, delay);
            }
            else {
                if (!String(networkOptions.path).includes(EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT)) {
                    logger_1.LogManager.Instance.errorLog('NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES', {
                        extraData: url.split('?')[0],
                        attempts: retryCount,
                        err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                    }, {}, false);
                }
                responseModel.setTotalAttempts(retryCount);
                responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(error));
                errorCallback(responseModel);
            }
        }
        xhr.open(method, url, true);
        for (var headerName in customHeaders) {
            if (headerName in customHeaders) {
                // Skip the Content-Type header
                // Request header field content-type is not allowed by Access-Control-Allow-Headers
                if (headerName !== 'Content-Type' && headerName !== 'Content-Length') {
                    xhr.setRequestHeader(headerName, customHeaders[headerName]);
                }
            }
        }
        if (method === HttpMethodEnum_1.HttpMethodEnum.POST && typeof body !== 'string') {
            xhr.send(JSON.stringify(body));
        }
        else if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
            xhr.send();
        }
    }
    executeRequest();
}


/***/ }),

/***/ "./node_modules/murmurhash/murmurhash.js":
/*!***********************************************!*\
  !*** ./node_modules/murmurhash/murmurhash.js ***!
  \***********************************************/
/***/ ((module) => {

(function(){
  const _global = this;

  const createBuffer = (val) => new TextEncoder().encode(val)

  /**
   * JS Implementation of MurmurHash2
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {Uint8Array | string} str ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */
  function MurmurHashV2(str, seed) {
    if (typeof str === 'string') str = createBuffer(str);
    let
      l = str.length,
      h = seed ^ l,
      i = 0,
      k;

    while (l >= 4) {
      k =
        ((str[i] & 0xff)) |
        ((str[++i] & 0xff) << 8) |
        ((str[++i] & 0xff) << 16) |
        ((str[++i] & 0xff) << 24);

      k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
      k ^= k >>> 24;
      k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

      l -= 4;
      ++i;
    }

    switch (l) {
    case 3: h ^= (str[i + 2] & 0xff) << 16;
    case 2: h ^= (str[i + 1] & 0xff) << 8;
    case 1: h ^= (str[i] & 0xff);
            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    }

    h ^= h >>> 13;
    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    h ^= h >>> 15;

    return h >>> 0;
  };

  /*
   * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {Uint8Array | string} key ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */
  function MurmurHashV3(key, seed) {
    if (typeof key === 'string') key = createBuffer(key);

    let remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
          ((key[i] & 0xff)) |
          ((key[++i] & 0xff) << 8) |
          ((key[++i] & 0xff) << 16) |
          ((key[++i] & 0xff) << 24);
      ++i;

      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
          h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
      case 3: k1 ^= (key[i + 2] & 0xff) << 16;
      case 2: k1 ^= (key[i + 1] & 0xff) << 8;
      case 1: k1 ^= (key[i] & 0xff);

      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
  }

  const murmur = MurmurHashV3;
  murmur.v2 = MurmurHashV2;
  murmur.v3 = MurmurHashV3;

  if (true) {
    module.exports = murmur;
  } else {}
}());


/***/ }),

/***/ "./node_modules/superstruct/lib/index.cjs":
/*!************************************************!*\
  !*** ./node_modules/superstruct/lib/index.cjs ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/**
 * A `StructFailure` represents a single specific failure in validation.
 */

/**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */
class StructError extends TypeError {
  constructor(failure, failures) {
    let cached;
    const {
      message,
      ...rest
    } = failure;
    const {
      path
    } = failure;
    const msg = path.length === 0 ? message : "At path: " + path.join('.') + " -- " + message;
    super(msg);
    Object.assign(this, rest);
    this.name = this.constructor.name;

    this.failures = () => {
      var _cached;

      return (_cached = cached) != null ? _cached : cached = [failure, ...failures()];
    };
  }

}

/**
 * Check if a value is an iterator.
 */
function isIterable(x) {
  return isObject(x) && typeof x[Symbol.iterator] === 'function';
}
/**
 * Check if a value is a plain object.
 */


function isObject(x) {
  return typeof x === 'object' && x != null;
}
/**
 * Check if a value is a plain object.
 */

function isPlainObject(x) {
  if (Object.prototype.toString.call(x) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(x);
  return prototype === null || prototype === Object.prototype;
}
/**
 * Return a value as a printable string.
 */

function print(value) {
  return typeof value === 'string' ? JSON.stringify(value) : "" + value;
}
/**
 * Shifts (removes and returns) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 */

function shiftIterator(input) {
  const {
    done,
    value
  } = input.next();
  return done ? undefined : value;
}
/**
 * Convert a single validation result to a failure.
 */

function toFailure(result, context, struct, value) {
  if (result === true) {
    return;
  } else if (result === false) {
    result = {};
  } else if (typeof result === 'string') {
    result = {
      message: result
    };
  }

  const {
    path,
    branch
  } = context;
  const {
    type
  } = struct;
  const {
    refinement,
    message = "Expected a value of type `" + type + "`" + (refinement ? " with refinement `" + refinement + "`" : '') + ", but received: `" + print(value) + "`"
  } = result;
  return {
    value,
    type,
    refinement,
    key: path[path.length - 1],
    path,
    branch,
    ...result,
    message
  };
}
/**
 * Convert a validation result to an iterable of failures.
 */

function* toFailures(result, context, struct, value) {
  if (!isIterable(result)) {
    result = [result];
  }

  for (const r of result) {
    const failure = toFailure(r, context, struct, value);

    if (failure) {
      yield failure;
    }
  }
}
/**
 * Check a value against a struct, traversing deeply into nested values, and
 * returning an iterator of failures or success.
 */

function* run(value, struct, options = {}) {
  const {
    path = [],
    branch = [value],
    coerce = false,
    mask = false
  } = options;
  const ctx = {
    path,
    branch
  };

  if (coerce) {
    value = struct.coercer(value, ctx);

    if (mask && struct.type !== 'type' && isObject(struct.schema) && isObject(value) && !Array.isArray(value)) {
      for (const key in value) {
        if (struct.schema[key] === undefined) {
          delete value[key];
        }
      }
    }
  }

  let valid = true;

  for (const failure of struct.validator(value, ctx)) {
    valid = false;
    yield [failure, undefined];
  }

  for (let [k, v, s] of struct.entries(value, ctx)) {
    const ts = run(v, s, {
      path: k === undefined ? path : [...path, k],
      branch: k === undefined ? branch : [...branch, v],
      coerce,
      mask
    });

    for (const t of ts) {
      if (t[0]) {
        valid = false;
        yield [t[0], undefined];
      } else if (coerce) {
        v = t[1];

        if (k === undefined) {
          value = v;
        } else if (value instanceof Map) {
          value.set(k, v);
        } else if (value instanceof Set) {
          value.add(v);
        } else if (isObject(value)) {
          value[k] = v;
        }
      }
    }
  }

  if (valid) {
    for (const failure of struct.refiner(value, ctx)) {
      valid = false;
      yield [failure, undefined];
    }
  }

  if (valid) {
    yield [undefined, value];
  }
}

/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */

class Struct {
  constructor(props) {
    const {
      type,
      schema,
      validator,
      refiner,
      coercer = value => value,
      entries = function* () {}
    } = props;
    this.type = type;
    this.schema = schema;
    this.entries = entries;
    this.coercer = coercer;

    if (validator) {
      this.validator = (value, context) => {
        const result = validator(value, context);
        return toFailures(result, context, this, value);
      };
    } else {
      this.validator = () => [];
    }

    if (refiner) {
      this.refiner = (value, context) => {
        const result = refiner(value, context);
        return toFailures(result, context, this, value);
      };
    } else {
      this.refiner = () => [];
    }
  }
  /**
   * Assert that a value passes the struct's validation, throwing if it doesn't.
   */


  assert(value) {
    return assert(value, this);
  }
  /**
   * Create a value with the struct's coercion logic, then validate it.
   */


  create(value) {
    return create(value, this);
  }
  /**
   * Check if a value passes the struct's validation.
   */


  is(value) {
    return is(value, this);
  }
  /**
   * Mask a value, coercing and validating it, but returning only the subset of
   * properties defined by the struct's schema.
   */


  mask(value) {
    return mask(value, this);
  }
  /**
   * Validate a value with the struct's validation logic, returning a tuple
   * representing the result.
   *
   * You may optionally pass `true` for the `withCoercion` argument to coerce
   * the value before attempting to validate it. If you do, the result will
   * contain the coerced result when successful.
   */


  validate(value, options = {}) {
    return validate(value, this, options);
  }

}
/**
 * Assert that a value passes a struct, throwing if it doesn't.
 */

function assert(value, struct) {
  const result = validate(value, struct);

  if (result[0]) {
    throw result[0];
  }
}
/**
 * Create a value with the coercion logic of struct and validate it.
 */

function create(value, struct) {
  const result = validate(value, struct, {
    coerce: true
  });

  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
}
/**
 * Mask a value, returning only the subset of properties defined by a struct.
 */

function mask(value, struct) {
  const result = validate(value, struct, {
    coerce: true,
    mask: true
  });

  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
}
/**
 * Check if a value passes a struct.
 */

function is(value, struct) {
  const result = validate(value, struct);
  return !result[0];
}
/**
 * Validate a value against a struct, returning an error if invalid, or the
 * value (with potential coercion) if valid.
 */

function validate(value, struct, options = {}) {
  const tuples = run(value, struct, options);
  const tuple = shiftIterator(tuples);

  if (tuple[0]) {
    const error = new StructError(tuple[0], function* () {
      for (const t of tuples) {
        if (t[0]) {
          yield t[0];
        }
      }
    });
    return [error, undefined];
  } else {
    const v = tuple[1];
    return [undefined, v];
  }
}

function assign(...Structs) {
  const schemas = Structs.map(s => s.schema);
  const schema = Object.assign({}, ...schemas);
  return object(schema);
}
/**
 * Define a new struct type with a custom validation function.
 */

function define(name, validator) {
  return new Struct({
    type: name,
    schema: null,
    validator
  });
}
/**
 * Create a new struct based on an existing struct, but the value is allowed to
 * be `undefined`. `log` will be called if the value is not `undefined`.
 */

function deprecated(struct, log) {
  return new Struct({ ...struct,
    refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx),

    validator(value, ctx) {
      if (value === undefined) {
        return true;
      } else {
        log(value, ctx);
        return struct.validator(value, ctx);
      }
    }

  });
}
/**
 * Create a struct with dynamic validation logic.
 *
 * The callback will receive the value currently being validated, and must
 * return a struct object to validate it with. This can be useful to model
 * validation logic that changes based on its input.
 */

function dynamic(fn) {
  return new Struct({
    type: 'dynamic',
    schema: null,

    *entries(value, ctx) {
      const struct = fn(value, ctx);
      yield* struct.entries(value, ctx);
    },

    validator(value, ctx) {
      const struct = fn(value, ctx);
      return struct.validator(value, ctx);
    },

    coercer(value, ctx) {
      const struct = fn(value, ctx);
      return struct.coercer(value, ctx);
    }

  });
}
/**
 * Create a struct with lazily evaluated validation logic.
 *
 * The first time validation is run with the struct, the callback will be called
 * and must return a struct object to use. This is useful for cases where you
 * want to have self-referential structs for nested data structures to avoid a
 * circular definition problem.
 */

function lazy(fn) {
  let struct;
  return new Struct({
    type: 'lazy',
    schema: null,

    *entries(value, ctx) {
      var _struct;

      (_struct = struct) != null ? _struct : struct = fn();
      yield* struct.entries(value, ctx);
    },

    validator(value, ctx) {
      var _struct2;

      (_struct2 = struct) != null ? _struct2 : struct = fn();
      return struct.validator(value, ctx);
    },

    coercer(value, ctx) {
      var _struct3;

      (_struct3 = struct) != null ? _struct3 : struct = fn();
      return struct.coercer(value, ctx);
    }

  });
}
/**
 * Create a new struct based on an existing object struct, but excluding
 * specific properties.
 *
 * Like TypeScript's `Omit` utility.
 */

function omit(struct, keys) {
  const {
    schema
  } = struct;
  const subschema = { ...schema
  };

  for (const key of keys) {
    delete subschema[key];
  }

  return object(subschema);
}
/**
 * Create a new struct based on an existing object struct, but with all of its
 * properties allowed to be `undefined`.
 *
 * Like TypeScript's `Partial` utility.
 */

function partial(struct) {
  const schema = struct instanceof Struct ? { ...struct.schema
  } : { ...struct
  };

  for (const key in schema) {
    schema[key] = optional(schema[key]);
  }

  return object(schema);
}
/**
 * Create a new struct based on an existing object struct, but only including
 * specific properties.
 *
 * Like TypeScript's `Pick` utility.
 */

function pick(struct, keys) {
  const {
    schema
  } = struct;
  const subschema = {};

  for (const key of keys) {
    subschema[key] = schema[key];
  }

  return object(subschema);
}
/**
 * Define a new struct type with a custom validation function.
 *
 * @deprecated This function has been renamed to `define`.
 */

function struct(name, validator) {
  console.warn('superstruct@0.11 - The `struct` helper has been renamed to `define`.');
  return define(name, validator);
}

/**
 * Ensure that any value passes validation.
 */

function any() {
  return define('any', () => true);
}
function array(Element) {
  return new Struct({
    type: 'array',
    schema: Element,

    *entries(value) {
      if (Element && Array.isArray(value)) {
        for (const [i, v] of value.entries()) {
          yield [i, v, Element];
        }
      }
    },

    coercer(value) {
      return Array.isArray(value) ? value.slice() : value;
    },

    validator(value) {
      return Array.isArray(value) || "Expected an array value, but received: " + print(value);
    }

  });
}
/**
 * Ensure that a value is a boolean.
 */

function boolean() {
  return define('boolean', value => {
    return typeof value === 'boolean';
  });
}
/**
 * Ensure that a value is a valid `Date`.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 */

function date() {
  return define('date', value => {
    return value instanceof Date && !isNaN(value.getTime()) || "Expected a valid `Date` object, but received: " + print(value);
  });
}
function enums(values) {
  const schema = {};
  const description = values.map(v => print(v)).join();

  for (const key of values) {
    schema[key] = key;
  }

  return new Struct({
    type: 'enums',
    schema,

    validator(value) {
      return values.includes(value) || "Expected one of `" + description + "`, but received: " + print(value);
    }

  });
}
/**
 * Ensure that a value is a function.
 */

function func() {
  return define('func', value => {
    return typeof value === 'function' || "Expected a function, but received: " + print(value);
  });
}
/**
 * Ensure that a value is an instance of a specific class.
 */

function instance(Class) {
  return define('instance', value => {
    return value instanceof Class || "Expected a `" + Class.name + "` instance, but received: " + print(value);
  });
}
/**
 * Ensure that a value is an integer.
 */

function integer() {
  return define('integer', value => {
    return typeof value === 'number' && !isNaN(value) && Number.isInteger(value) || "Expected an integer, but received: " + print(value);
  });
}
function intersection(Structs) {
  return new Struct({
    type: 'intersection',
    schema: null,

    *entries(value, ctx) {
      for (const S of Structs) {
        yield* S.entries(value, ctx);
      }
    },

    *validator(value, ctx) {
      for (const S of Structs) {
        yield* S.validator(value, ctx);
      }
    },

    *refiner(value, ctx) {
      for (const S of Structs) {
        yield* S.refiner(value, ctx);
      }
    }

  });
}
function literal(constant) {
  const description = print(constant);
  const t = typeof constant;
  return new Struct({
    type: 'literal',
    schema: t === 'string' || t === 'number' || t === 'boolean' ? constant : null,

    validator(value) {
      return value === constant || "Expected the literal `" + description + "`, but received: " + print(value);
    }

  });
}
function map(Key, Value) {
  return new Struct({
    type: 'map',
    schema: null,

    *entries(value) {
      if (Key && Value && value instanceof Map) {
        for (const [k, v] of value.entries()) {
          yield [k, k, Key];
          yield [k, v, Value];
        }
      }
    },

    coercer(value) {
      return value instanceof Map ? new Map(value) : value;
    },

    validator(value) {
      return value instanceof Map || "Expected a `Map` object, but received: " + print(value);
    }

  });
}
/**
 * Ensure that no value ever passes validation.
 */

function never() {
  return define('never', () => false);
}
/**
 * Augment an existing struct to allow `null` values.
 */

function nullable(struct) {
  return new Struct({ ...struct,
    validator: (value, ctx) => value === null || struct.validator(value, ctx),
    refiner: (value, ctx) => value === null || struct.refiner(value, ctx)
  });
}
/**
 * Ensure that a value is a number.
 */

function number() {
  return define('number', value => {
    return typeof value === 'number' && !isNaN(value) || "Expected a number, but received: " + print(value);
  });
}
function object(schema) {
  const knowns = schema ? Object.keys(schema) : [];
  const Never = never();
  return new Struct({
    type: 'object',
    schema: schema ? schema : null,

    *entries(value) {
      if (schema && isObject(value)) {
        const unknowns = new Set(Object.keys(value));

        for (const key of knowns) {
          unknowns.delete(key);
          yield [key, value[key], schema[key]];
        }

        for (const key of unknowns) {
          yield [key, value[key], Never];
        }
      }
    },

    validator(value) {
      return isObject(value) || "Expected an object, but received: " + print(value);
    },

    coercer(value) {
      return isObject(value) ? { ...value
      } : value;
    }

  });
}
/**
 * Augment a struct to allow `undefined` values.
 */

function optional(struct) {
  return new Struct({ ...struct,
    validator: (value, ctx) => value === undefined || struct.validator(value, ctx),
    refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx)
  });
}
/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * Like TypeScript's `Record` utility.
 */

function record(Key, Value) {
  return new Struct({
    type: 'record',
    schema: null,

    *entries(value) {
      if (isObject(value)) {
        for (const k in value) {
          const v = value[k];
          yield [k, k, Key];
          yield [k, v, Value];
        }
      }
    },

    validator(value) {
      return isObject(value) || "Expected an object, but received: " + print(value);
    }

  });
}
/**
 * Ensure that a value is a `RegExp`.
 *
 * Note: this does not test the value against the regular expression! For that
 * you need to use the `pattern()` refinement.
 */

function regexp() {
  return define('regexp', value => {
    return value instanceof RegExp;
  });
}
function set(Element) {
  return new Struct({
    type: 'set',
    schema: null,

    *entries(value) {
      if (Element && value instanceof Set) {
        for (const v of value) {
          yield [v, v, Element];
        }
      }
    },

    coercer(value) {
      return value instanceof Set ? new Set(value) : value;
    },

    validator(value) {
      return value instanceof Set || "Expected a `Set` object, but received: " + print(value);
    }

  });
}
/**
 * Ensure that a value is a string.
 */

function string() {
  return define('string', value => {
    return typeof value === 'string' || "Expected a string, but received: " + print(value);
  });
}
function tuple(Elements) {
  const Never = never();
  return new Struct({
    type: 'tuple',
    schema: null,

    *entries(value) {
      if (Array.isArray(value)) {
        const length = Math.max(Elements.length, value.length);

        for (let i = 0; i < length; i++) {
          yield [i, value[i], Elements[i] || Never];
        }
      }
    },

    validator(value) {
      return Array.isArray(value) || "Expected an array, but received: " + print(value);
    }

  });
}
/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 */

function type(schema) {
  const keys = Object.keys(schema);
  return new Struct({
    type: 'type',
    schema,

    *entries(value) {
      if (isObject(value)) {
        for (const k of keys) {
          yield [k, value[k], schema[k]];
        }
      }
    },

    validator(value) {
      return isObject(value) || "Expected an object, but received: " + print(value);
    }

  });
}
function union(Structs) {
  const description = Structs.map(s => s.type).join(' | ');
  return new Struct({
    type: 'union',
    schema: null,

    validator(value, ctx) {
      const failures = [];

      for (const S of Structs) {
        const [...tuples] = run(value, S, ctx);
        const [first] = tuples;

        if (!first[0]) {
          return [];
        } else {
          for (const [failure] of tuples) {
            if (failure) {
              failures.push(failure);
            }
          }
        }
      }

      return ["Expected the value to satisfy a union of `" + description + "`, but received: " + print(value), ...failures];
    }

  });
}
/**
 * Ensure that any value passes validation, without widening its type to `any`.
 */

function unknown() {
  return define('unknown', () => true);
}

/**
 * Augment a `Struct` to add an additional coercion step to its input.
 *
 * This allows you to transform input data before validating it, to increase the
 * likelihood that it passes validation—for example for default values, parsing
 * different formats, etc.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

function coerce(struct, condition, coercer) {
  return new Struct({ ...struct,
    coercer: (value, ctx) => {
      return is(value, condition) ? struct.coercer(coercer(value, ctx), ctx) : struct.coercer(value, ctx);
    }
  });
}
/**
 * Augment a struct to replace `undefined` values with a default.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

function defaulted(struct, fallback, options = {}) {
  return coerce(struct, unknown(), x => {
    const f = typeof fallback === 'function' ? fallback() : fallback;

    if (x === undefined) {
      return f;
    }

    if (!options.strict && isPlainObject(x) && isPlainObject(f)) {
      const ret = { ...x
      };
      let changed = false;

      for (const key in f) {
        if (ret[key] === undefined) {
          ret[key] = f[key];
          changed = true;
        }
      }

      if (changed) {
        return ret;
      }
    }

    return x;
  });
}
/**
 * Augment a struct to trim string inputs.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */

function trimmed(struct) {
  return coerce(struct, string(), x => x.trim());
}

/**
 * Ensure that a string, array, map, or set is empty.
 */

function empty(struct) {
  const expected = "Expected an empty " + struct.type;
  return refine(struct, 'empty', value => {
    if (value instanceof Map || value instanceof Set) {
      const {
        size
      } = value;
      return size === 0 || expected + " but received one with a size of `" + size + "`";
    } else {
      const {
        length
      } = value;
      return length === 0 || expected + " but received one with a length of `" + length + "`";
    }
  });
}
/**
 * Ensure that a number or date is below a threshold.
 */

function max(struct, threshold, options = {}) {
  const {
    exclusive
  } = options;
  return refine(struct, 'max', value => {
    return exclusive ? value < threshold : value <= threshold || "Expected a " + struct.type + " greater than " + (exclusive ? '' : 'or equal to ') + threshold + " but received `" + value + "`";
  });
}
/**
 * Ensure that a number or date is above a threshold.
 */

function min(struct, threshold, options = {}) {
  const {
    exclusive
  } = options;
  return refine(struct, 'min', value => {
    return exclusive ? value > threshold : value >= threshold || "Expected a " + struct.type + " greater than " + (exclusive ? '' : 'or equal to ') + threshold + " but received `" + value + "`";
  });
}
/**
 * Ensure that a string matches a regular expression.
 */

function pattern(struct, regexp) {
  return refine(struct, 'pattern', value => {
    return regexp.test(value) || "Expected a " + struct.type + " matching `/" + regexp.source + "/` but received \"" + value + "\"";
  });
}
/**
 * Ensure that a string, array, number, date, map, or set has a size (or length, or time) between `min` and `max`.
 */

function size(struct, min, max = min) {
  const expected = "Expected a " + struct.type;
  const of = min === max ? "of `" + min + "`" : "between `" + min + "` and `" + max + "`";
  return refine(struct, 'size', value => {
    if (typeof value === 'number' || value instanceof Date) {
      return min <= value && value <= max || expected + " " + of + " but received `" + value + "`";
    } else if (value instanceof Map || value instanceof Set) {
      const {
        size
      } = value;
      return min <= size && size <= max || expected + " with a size " + of + " but received one with a size of `" + size + "`";
    } else {
      const {
        length
      } = value;
      return min <= length && length <= max || expected + " with a length " + of + " but received one with a length of `" + length + "`";
    }
  });
}
/**
 * Augment a `Struct` to add an additional refinement to the validation.
 *
 * The refiner function is guaranteed to receive a value of the struct's type,
 * because the struct's existing validation will already have passed. This
 * allows you to layer additional validation on top of existing structs.
 */

function refine(struct, name, refiner) {
  return new Struct({ ...struct,

    *refiner(value, ctx) {
      yield* struct.refiner(value, ctx);
      const result = refiner(value, ctx);
      const failures = toFailures(result, ctx, struct, value);

      for (const failure of failures) {
        yield { ...failure,
          refinement: name
        };
      }
    }

  });
}

exports.Struct = Struct;
exports.StructError = StructError;
exports.any = any;
exports.array = array;
exports.assert = assert;
exports.assign = assign;
exports.boolean = boolean;
exports.coerce = coerce;
exports.create = create;
exports.date = date;
exports.defaulted = defaulted;
exports.define = define;
exports.deprecated = deprecated;
exports.dynamic = dynamic;
exports.empty = empty;
exports.enums = enums;
exports.func = func;
exports.instance = instance;
exports.integer = integer;
exports.intersection = intersection;
exports.is = is;
exports.lazy = lazy;
exports.literal = literal;
exports.map = map;
exports.mask = mask;
exports.max = max;
exports.min = min;
exports.never = never;
exports.nullable = nullable;
exports.number = number;
exports.object = object;
exports.omit = omit;
exports.optional = optional;
exports.partial = partial;
exports.pattern = pattern;
exports.pick = pick;
exports.record = record;
exports.refine = refine;
exports.regexp = regexp;
exports.set = set;
exports.size = size;
exports.string = string;
exports.struct = struct;
exports.trimmed = trimmed;
exports.tuple = tuple;
exports.type = type;
exports.union = union;
exports.unknown = unknown;
exports.validate = validate;
//# sourceMappingURL=index.cjs.map


/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function get() {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function get() {
    return _parse.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function get() {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function get() {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function get() {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function get() {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function get() {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function get() {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function get() {
    return _version.default;
  }
}));

var _v = _interopRequireDefault(__webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/commonjs-browser/v1.js"));

var _v2 = _interopRequireDefault(__webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist/commonjs-browser/v3.js"));

var _v3 = _interopRequireDefault(__webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist/commonjs-browser/v4.js"));

var _v4 = _interopRequireDefault(__webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist/commonjs-browser/v5.js"));

var _nil = _interopRequireDefault(__webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist/commonjs-browser/nil.js"));

var _version = _interopRequireDefault(__webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist/commonjs-browser/version.js"));

var _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/commonjs-browser/validate.js"));

var _stringify = _interopRequireDefault(__webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/commonjs-browser/stringify.js"));

var _parse = _interopRequireDefault(__webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/commonjs-browser/parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/md5.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/md5.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (let i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = '0123456789abcdef';

  for (let i = 0; i < length32; i += 8) {
    const x = input[i >> 5] >>> i % 32 & 0xff;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));

  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/native.js":
/*!***********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/native.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var _default = {
  randomUUID
};
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/nil.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/nil.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/parse.js":
/*!**********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/parse.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/commonjs-browser/validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/regex.js":
/*!**********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/regex.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/rng.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/rng.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);

function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/sha1.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/sha1.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (let i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  const l = bytes.length / 4 + 2;
  const N = Math.ceil(l / 16);
  const M = new Array(N);

  for (let i = 0; i < N; ++i) {
    const arr = new Uint32Array(16);

    for (let j = 0; j < 16; ++j) {
      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }

    M[i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (let i = 0; i < N; ++i) {
    const W = new Uint32Array(80);

    for (let t = 0; t < 16; ++t) {
      W[t] = M[i][t];
    }

    for (let t = 16; t < 80; ++t) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];

    for (let t = 0; t < 80; ++t) {
      const s = Math.floor(t / 20);
      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/stringify.js":
/*!**************************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/stringify.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
exports.unsafeStringify = unsafeStringify;

var _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/commonjs-browser/validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v1.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v1.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/commonjs-browser/rng.js"));

var _stringify = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/commonjs-browser/stringify.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.unsafeStringify)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v3.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v3.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/commonjs-browser/v35.js"));

var _md = _interopRequireDefault(__webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist/commonjs-browser/md5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v35.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v35.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.URL = exports.DNS = void 0;
exports["default"] = v35;

var _stringify = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/commonjs-browser/stringify.js");

var _parse = _interopRequireDefault(__webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/commonjs-browser/parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;

    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.unsafeStringify)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v4.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v4.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _native = _interopRequireDefault(__webpack_require__(/*! ./native.js */ "./node_modules/uuid/dist/commonjs-browser/native.js"));

var _rng = _interopRequireDefault(__webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/commonjs-browser/rng.js"));

var _stringify = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/commonjs-browser/stringify.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  if (_native.default.randomUUID && !buf && !options) {
    return _native.default.randomUUID();
  }

  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.unsafeStringify)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/v5.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/v5.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/commonjs-browser/v35.js"));

var _sha = _interopRequireDefault(__webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist/commonjs-browser/sha1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/validate.js":
/*!*************************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/validate.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/commonjs-browser/regex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/uuid/dist/commonjs-browser/version.js":
/*!************************************************************!*\
  !*** ./node_modules/uuid/dist/commonjs-browser/version.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/commonjs-browser/validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.slice(14, 15), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/vwo-fme-sdk-log-messages/index.js":
/*!********************************************************!*\
  !*** ./node_modules/vwo-fme-sdk-log-messages/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  debugMessages: __webpack_require__(/*! ./src/debug-messages.json */ "./node_modules/vwo-fme-sdk-log-messages/src/debug-messages.json"),
  infoMessages: __webpack_require__(/*! ./src/info-messages.json */ "./node_modules/vwo-fme-sdk-log-messages/src/info-messages.json"),
  warnMessages: __webpack_require__(/*! ./src/warn-messages.json */ "./node_modules/vwo-fme-sdk-log-messages/src/warn-messages.json"),
  errorMessages: __webpack_require__(/*! ./src/error-messages.json */ "./node_modules/vwo-fme-sdk-log-messages/src/error-messages.json"),
  errorMessagesV2: __webpack_require__(/*! ./src/error-messages-v2.json */ "./node_modules/vwo-fme-sdk-log-messages/src/error-messages-v2.json"),
  traceMessages: __webpack_require__(/*! ./src/trace-messages.json */ "./node_modules/vwo-fme-sdk-log-messages/src/trace-messages.json")
}


/***/ }),

/***/ "./node_modules/vwo-fme-sdk-log-messages/src/debug-messages.json":
/*!***********************************************************************!*\
  !*** ./node_modules/vwo-fme-sdk-log-messages/src/debug-messages.json ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"API_CALLED":"API - {apiName} called","SERVICE_INITIALIZED":"VWO {service} initialized while creating an instance of SDK","EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED":"Rollout rule got passed for user {userId}. Hence, evaluating experiments","EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT":"No Rollout rules present for the feature. Hence, checking experiment rules","USER_BUCKET_TO_VARIATION":"User ID:{userId} for experiment:{campaignKey} having percent traffic:{percentTraffic} got bucket-value:{bucketValue} and hash-value:{hashValue}","IMPRESSION_FOR_TRACK_USER":"Impression built for vwo_variationShown(VWO standard event for tracking user) event haivng Account ID:{accountId}, User ID:{userId}, and experiment ID:{campaignId}","IMPRESSION_FOR_TRACK_GOAL":"Impression built for event:{eventName} event having Account ID:{accountId}, and user ID:{userId}","IMPRESSION_FOR_SYNC_VISITOR_PROP":"Impression built for {eventName}(VWO internal event) event for Account ID:{accountId}, and user ID:{userId}","CONFIG_BATCH_EVENT_LIMIT_EXCEEDED":"Impression event - {endPoint} failed due to exceeding payload size. Parameter eventsPerRequest in batchEvents config in launch API has value:{eventsPerRequest} for account ID:{accountId}. Please read the official documentation for knowing the size limits","EVENT_BATCH_BEFORE_FLUSHING":"Flushing event queue {manually} having {length} events for Account ID:{accountId}. {timer}","EVENT_BATCH_FLUSH":"Manually flushing batch events for Account ID:{accountId} having {queueLength} events","BATCH_QUEUE_EMPTY":"Batch queue is empty. Nothing to flush.","USING_POLL_INTERVAL_FROM_SETTINGS":"key: pollInterval not found or invalid. Using pollInterval from {source} {pollInterval}.","USING_API_WITH_PROCESS":"API: {api} is being used with process: {process}"}');

/***/ }),

/***/ "./node_modules/vwo-fme-sdk-log-messages/src/error-messages-v2.json":
/*!**************************************************************************!*\
  !*** ./node_modules/vwo-fme-sdk-log-messages/src/error-messages-v2.json ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"INVALID_OPTIONS":"Options should be of type:object","INVALID_SDK_KEY_IN_OPTIONS":"SDK Key is required in the options and should be of type:string","INVALID_ACCOUNT_ID_IN_OPTIONS":"Account ID is required in the options and should be of type:string|number","INVALID_POLLING_CONFIGURATION":"Invalid key:{key} passed in options. Should be of type:{correctType} and greater than equal to 1000","ERROR_FETCHING_SETTINGS":"Settings could not be fetched. Error:{err}","ERROR_FETCHING_SETTINGS_WITH_POLLING":"Settings could not be fetched with polling. Error:{err}","UPDATING_CLIENT_INSTANCE_FAILED_WHEN_WEBHOOK_TRIGGERED":"Failed to fetch settings. VWO client instance couldn\'t be updated. API:{apiName} called having isViaWebhook:{isViaWebhook}. Error: {err}","INVALID_SETTINGS_SCHEMA":"Settings are not valid. Failed schema validation","EXECUTION_FAILED":"API - {apiName} failed to execute. Error:{err}","INVALID_PARAM":"Key:{key} passed to API:{apiName} is not of valid type. Got type:{type}, should be:{correctType}","INVALID_CONTEXT_PASSED":"Context should be of type:object and must contain a mandatory key: id, which is User ID","FEATURE_NOT_FOUND":"Feature not found for the key:{featureKey}","FEATURE_NOT_FOUND_WITH_ID":"Feature not found for the id:{featureId}","EVENT_NOT_FOUND":"Event:{eventName} not found in any of the features\' metrics","ERROR_READING_STORED_DATA_IN_STORAGE":"Error reading data from storage. Error:{err}","ERROR_STORING_DATA_IN_STORAGE":"Key:{featureKey} is not valid. Unable to store data into storage","ERROR_READING_DATA_FROM_BROWSER_STORAGE":"Error while reading from browser storage. Error: {err}","ERROR_STORING_DATA_IN_BROWSER_STORAGE":"Error while writing to browserstorage. Error: {err}","ERROR_DECODING_SDK_KEY_FROM_STORAGE":"Failed to decode sdkKey from browser storage. Error: {err}","ERROR_STORING_SETTINGS_IN_STORAGE":"Error while storing settings in storage. Error: {err}","ERROR_READING_SETTINGS_FROM_STORAGE":"Error while reading settings from storage. Error: {err}","ERROR_STORING_FRESH_SETTINGS_IN_STORAGE":"Error while storing fresh settings in storage. Error: {err}","INVALID_GATEWAY_URL":"Invalid URL for VWO Gateway Service while initializing the SDK","NETWORK_CALL_FAILED":"Error occurred while sending {method} request. Error:{err}","ATTEMPTING_RETRY_FOR_FAILED_NETWORK_CALL":"Request failed for {endPoint}. Error: {err}. Retrying in {delay} seconds, attempt {attempt} of {maxRetries}","NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES":"Network call for {extraData} failed after {attempts} retry attempt(s). Got Error: {err}","INVALID_RETRY_CONFIG":"Retry config is invalid. Should be of type:object","SDK_INIT_EVENT_FAILED":"Error occurred while sending SDK init event. Error:{err}","INVALID_NETWORK_RESPONSE_DATA":"Received invalid or empty response data from the network request","ALIAS_CALLED_BUT_NOT_PASSED":"Aliasing is not enabled. Set isAliasingEnabled:true in init to enable","ERROR_SETTING_SEGMENTATION_CONTEXT":"Error in setting contextual data for segmentation. Error: {err}","USER_AGENT_VALIDATION_ERROR":"Failed to validate user agent. Error: {err}","INVALID_IP_ADDRESS_IN_CONTEXT_FOR_PRE_SEGMENTATION":"ipAddress is required in context to evaluate location pre-segmentation","INVALID_USER_AGENT_IN_CONTEXT_FOR_PRE_SEGMENTATION":"userAgent is required in context to evaluate user-agent pre-segmentation","INVALID_ATTRIBUTE_LIST_FORMAT":"Invalid inList operand format","ERROR_FETCHING_DATA_FROM_GATEWAY":"Error while fetching data from gateway. Error: {err}","INVALID_BATCH_EVENTS_CONFIG":"Invalid batch events config. Should be an object - eventsPerRequest and requestTimeInterval should be of type:number and > 0","BATCHING_NOT_ENABLED":"Batching is not enabled. Pass batchEventData in the SDK configuration while invoking init API.","ERROR_INITIALIZING_FETCH":"Unable to initialize the fetch API. Details: {error}"}');

/***/ }),

/***/ "./node_modules/vwo-fme-sdk-log-messages/src/error-messages.json":
/*!***********************************************************************!*\
  !*** ./node_modules/vwo-fme-sdk-log-messages/src/error-messages.json ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"INIT_OPTIONS_ERROR":"[ERROR]: VWO-SDK {date} Options should be of type object","INIT_OPTIONS_SDK_KEY_ERROR":"[ERROR]: VWO-SDK {date} Please provide the sdkKey in the options and should be a of type string","INIT_OPTIONS_ACCOUNT_ID_ERROR":"[ERROR]: VWO-SDK {date} Please provide VWO account ID in the options and should be a of type string|number","INIT_OPTIONS_INVALID":"Invalid key:{key} passed in options. Should be of type:{correctType} and greater than equal to 1000","SETTINGS_FETCH_ERROR":"Settings could not be fetched. Error:{err}","SETTINGS_SCHEMA_INVALID":"Settings are not valid. Failed schema validation","POLLING_FETCH_SETTINGS_FAILED":"Error while fetching VWO settings with polling","API_THROW_ERROR":"API - {apiName} failed to execute. Trace:{err}","API_INVALID_PARAM":"Key:{key} passed to API:{apiName} is not of valid type. Got type:{type}, should be:{correctType}","API_SETTING_INVALID":"Settings are not valid. Contact VWO Support","API_CONTEXT_INVALID":"Context should be an object and must contain a mandatory key - id, which is User ID","FEATURE_NOT_FOUND":"Feature not found for the key:{featureKey}","EVENT_NOT_FOUND":"Event:{eventName} not found in any of the features\' metrics","STORED_DATA_ERROR":"Error in getting data from storage. Error:{err}","STORING_DATA_ERROR":"Key:{featureKey} is not valid. Not able to store data into storage","GATEWAY_URL_ERROR":"Please provide a valid URL for VWO Gateway Service while initializing the SDK","NETWORK_CALL_FAILED":"Error occurred while sending {method} request. Error:{err}","SETTINGS_FETCH_FAILED":"Failed to fetch settings and hence VWO client instance couldn\'t be updated when API: {apiName} got called having isViaWebhook param as {isViaWebhook}. Error: {err}","NETWORK_CALL_RETRY_ATTEMPT":"Request failed for {endPoint}, Error: {err}. Retrying in {delay} seconds, attempt {attempt} of {maxRetries}","NETWORK_CALL_RETRY_FAILED":"Max retries reached. Request failed for {endPoint}, Error: {err}","CONFIG_PARAMETER_INVALID":"{parameter} paased in {api} API is not correct. It should be of type:{type}}","BATCH_QUEUE_EMPTY":"No batch queue present for account:{accountId} when calling flushEvents API. Check batchEvents config in launch API","RETRY_CONFIG_INVALID":"Retry config is invalid. Please check the VWO developer documentation. Current retry config: {retryConfig}","SDK_INIT_EVENT_FAILED":"Error occurred while sending SDK init event. Error:{err}","INVALID_NETWORK_RESPONSE_DATA":"Received invalid or empty response data from the network request","ALIAS_NOT_ENABLED":"Aliasing is not enabled. Set isAliasingEnabled in init to enable aliasing"}');

/***/ }),

/***/ "./node_modules/vwo-fme-sdk-log-messages/src/info-messages.json":
/*!**********************************************************************!*\
  !*** ./node_modules/vwo-fme-sdk-log-messages/src/info-messages.json ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"ON_INIT_ALREADY_RESOLVED":"[INFO]: VWO-SDK {date} {apiName} already resolved","ON_INIT_SETTINGS_FAILED":"[INFO]: VWO-SDK {date} VWO settings could not be fetched","POLLING_SET_SETTINGS":"There\'s a change in settings from the last settings fetched. Hence, instantiating a new VWO client internally","POLLING_NO_CHANGE_IN_SETTINGS":"No change in settings with the last settings fetched. Hence, not instantiating new VWO client","SETTINGS_FETCH_SUCCESS":"Settings fetched successfully","SETTINGS_FETCH_FROM_CACHE":"Settings retrieved from cache","SETTINGS_BACKGROUND_UPDATE":"Settings asynchronously fetched and cache updated","SETTINGS_CACHE_MISS":"Settings not in cache; fetching from server","SETTINGS_PASSED_IN_INIT_VALID":"Settings passed in init are valid","SETTINGS_CACHE_MISS_KEY_ACCOUNT_ID_MISMATCH":"Cached settings do not match the provided sdkKey or accountId. Fetching fresh settings from the server.","SETTINGS_EXPIRED":"Cached settings have expired. Initiating fetch for updated settings from server.","SETTINGS_RETRIEVED_FROM_STORAGE":"Valid settings successfully retrieved from storage.","SETTINGS_SUCCESSFULLY_STORED":"Settings have been successfully stored in storage.","SETTINGS_UPDATED_WITH_FRESH_DATA":"Settings have been updated with the latest data fetched from the server.","SETTINGS_USING_CACHED_SETTINGS":"Serving settings from cache because alwaysUseCachedSettings is enabled.","CLIENT_INITIALIZED":"VWO Client initialized","STORED_VARIATION_FOUND":"Variation {variationKey} found in storage for the user {userId} for the {experimentType} experiment:{experimentKey}","USER_PART_OF_CAMPAIGN":"User ID:{userId} is {notPart} part of experiment:{campaignKey}","SEGMENTATION_SKIP":"For userId:{userId} of experiment:{campaignKey}, segments was missing. Hence, skipping segmentation","SEGMENTATION_STATUS":"Segmentation {status} for userId:{userId} of experiment:{campaignKey}","USER_CAMPAIGN_BUCKET_INFO":"User ID:{userId} for experiment:{campaignKey} {status}","WHITELISTING_SKIP":"Whitelisting is not used for experiment:{campaignKey}, hence skipping evaluating whitelisting {variation} for User ID:{userId}","WHITELISTING_STATUS":"User ID:{userId} for experiment:{campaignKey} {status} whitelisting {variationString}","VARIATION_RANGE_ALLOCATION":"Variation:{variationKey} of experiment:{campaignKey} having weight:{variationWeight} got bucketing range: ({startRange} - {endRange})","IMPACT_ANALYSIS":"Tracking feature:{featureKey} being {status} for Impact Analysis Campaign for the user {userId}","MEG_SKIP_ROLLOUT_EVALUATE_EXPERIMENTS":"No rollout rule found for feature:{featureKey}. Hence, evaluating experiments","MEG_CAMPAIGN_FOUND_IN_STORAGE":"Campaign {campaignKey} found in storage for user ID:{userId}","MEG_CAMPAIGN_ELIGIBLE":"Campaign {campaignKey} is eligible for user ID:{userId}","MEG_WINNER_CAMPAIGN":"MEG: Campaign {campaignKey} is the winner for group {groupId} for user ID:{userId} {algo}","SETTINGS_UPDATED":"Settings fetched and updated successfully on the current VWO client instance when API: {apiName} got called having isViaWebhook param as {isViaWebhook}","NETWORK_CALL_SUCCESS":"Impression for {event} - {endPoint} was successfully received by VWO having Account ID:{accountId}, User ID:{userId} and UUID: {uuid}","EVENT_BATCH_DEFAULTS":"{parameter} in SDK configuration is missing or invalid (should be greater than {minLimit}). Using default value: {defaultValue}","EVENT_QUEUE":"Event with payload:{event} pushed to the {queueType} queue","EVENT_BATCH_After_FLUSHING":"Event queue having {length} events has been flushed {manually}","IMPRESSION_BATCH_SUCCESS":"Impression event - {endPoint} was successfully received by VWO having Account ID:{accountId}","IMPRESSION_BATCH_FAILED":"Batch events couldn\\"t be received by VWO. Calling Flush Callback with error and data","EVENT_BATCH_MAX_LIMIT":"{parameter} passed in SDK configuration is greater than the maximum limit of {maxLimit}. Setting it to the maximum limit","GATEWAY_AND_BATCH_EVENTS_CONFIG_MISMATCH":"Batch Events config passed in SDK configuration will not work as the gatewayService is already configured. Please check the documentation for more details","PROXY_URL_SET":"Proxy URL is set and will be used for all network requests","ALIAS_ENABLED":"Aliasing enabled, using {userId} as userId","NETWORK_CALL_SUCCESS_WITH_RETRIES":"Network call for {extraData} succeeded after {attempts} retry attempt(s). Previous attempts failed with error: {err}"}');

/***/ }),

/***/ "./node_modules/vwo-fme-sdk-log-messages/src/trace-messages.json":
/*!***********************************************************************!*\
  !*** ./node_modules/vwo-fme-sdk-log-messages/src/trace-messages.json ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = {};

/***/ }),

/***/ "./node_modules/vwo-fme-sdk-log-messages/src/warn-messages.json":
/*!**********************************************************************!*\
  !*** ./node_modules/vwo-fme-sdk-log-messages/src/warn-messages.json ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = {};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./lib/index.ts ***!
  \**********************/

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUUID = exports.Flag = exports.StorageConnector = exports.LogLevelEnum = exports.onInit = exports.init = void 0;
var LogLevelEnum_1 = __webpack_require__(/*! ./packages/logger/enums/LogLevelEnum */ "./lib/packages/logger/enums/LogLevelEnum.ts");
Object.defineProperty(exports, "LogLevelEnum", ({ enumerable: true, get: function () { return LogLevelEnum_1.LogLevelEnum; } }));
var Connector_1 = __webpack_require__(/*! ./packages/storage/Connector */ "./lib/packages/storage/Connector.ts");
Object.defineProperty(exports, "StorageConnector", ({ enumerable: true, get: function () { return Connector_1.Connector; } }));
var GetFlag_1 = __webpack_require__(/*! ./api/GetFlag */ "./lib/api/GetFlag.ts");
Object.defineProperty(exports, "Flag", ({ enumerable: true, get: function () { return GetFlag_1.Flag; } }));
var UuidUtil_1 = __webpack_require__(/*! ./utils/UuidUtil */ "./lib/utils/UuidUtil.ts");
Object.defineProperty(exports, "getUUID", ({ enumerable: true, get: function () { return UuidUtil_1.getUUID; } }));
var VWO_1 = __webpack_require__(/*! ./VWO */ "./lib/VWO.ts");
Object.defineProperty(exports, "init", ({ enumerable: true, get: function () { return VWO_1.init; } }));
Object.defineProperty(exports, "onInit", ({ enumerable: true, get: function () { return VWO_1.onInit; } }));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=vwo-fme-javascript-sdk.js.map