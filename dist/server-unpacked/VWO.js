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
var VWOBuilder_1 = require("./VWOBuilder");
var DataTypeUtil_1 = require("./utils/DataTypeUtil");
var PromiseUtil_1 = require("./utils/PromiseUtil");
var log_messages_1 = require("./enums/log-messages");
var LogMessageUtil_1 = require("./utils/LogMessageUtil");
var PlatformEnum_1 = require("./enums/PlatformEnum");
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
            return Promise.resolve(this.vwoBuilder.build(options.settings));
        }
        return this.vwoBuilder.getSettings().then(function (settings) {
            return _this.vwoBuilder.build(settings); // Builds the VWO instance with the fetched settings.
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
 * @property {StorageService} storage - The storage configuration.
 * @returns
 */
function init(options) {
    return __awaiter(this, void 0, void 0, function () {
        var apiName, date, msg, msg, msg, instance, msg;
        return __generator(this, function (_a) {
            apiName = 'init';
            date = new Date().toISOString();
            try {
                if (!(0, DataTypeUtil_1.isObject)(options)) {
                    msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_ERROR, {
                        date: date,
                    });
                    console.error(msg); // Ensures options is an object.
                }
                if (!(options === null || options === void 0 ? void 0 : options.sdkKey) || !(0, DataTypeUtil_1.isString)(options === null || options === void 0 ? void 0 : options.sdkKey)) {
                    msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_SDK_KEY_ERROR, {
                        date: date,
                    });
                    console.error(msg); // Validates sdkKey presence and type.
                }
                if (!options.accountId) {
                    msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_ACCOUNT_ID_ERROR, {
                        date: date,
                    });
                    console.error(msg); // Validates accountId presence and type.
                }
                if (typeof process.env === 'undefined') {
                    options.platform = PlatformEnum_1.PlatformEnum.CLIENT;
                }
                else {
                    options.platform = PlatformEnum_1.PlatformEnum.SERVER;
                }
                instance = new VWO(options);
                _global = {
                    vwoInitDeferred: new PromiseUtil_1.Deferred(),
                    isSettingsFetched: false,
                    instance: null,
                };
                return [2 /*return*/, instance.then(function (_vwoInstance) {
                        _global.isSettingsFetched = true;
                        _global.instance = _vwoInstance;
                        _global.vwoInitDeferred.resolve(_vwoInstance);
                        return _vwoInstance;
                    })];
            }
            catch (err) {
                msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
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
            apiName = 'onInit';
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
                msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
                    apiName: apiName,
                    err: err,
                });
                console.info("[INFO]: VWO-SDK ".concat(new Date().toISOString(), " ").concat(msg));
            }
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=VWO.js.map