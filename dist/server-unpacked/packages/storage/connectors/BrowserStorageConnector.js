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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStorageConnector = void 0;
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
var constants_1 = require("../../../constants");
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var FunctionUtil_1 = require("../../../utils/FunctionUtil");
var Connector_1 = require("../Connector");
/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
var BrowserStorageConnector = /** @class */ (function (_super) {
    __extends(BrowserStorageConnector, _super);
    /**
     * Creates an instance of BrowserStorageConnector
     * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
     * @param {string} defaultStorageKey - Default key for storage
     * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
     * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
     * @param {boolean} [options.alwaysUseCachedSettings] - Whether to always use cached settings
     * @param {number} [options.ttl] - Custom TTL in milliseconds (defaults to Constants.SETTINGS_TTL)
     */
    function BrowserStorageConnector(options, defaultStorageKey, logManager) {
        var _this = _super.call(this) || this;
        _this.SETTINGS_KEY = constants_1.Constants.DEFAULT_SETTINGS_STORAGE_KEY;
        _this.storageKey = (options === null || options === void 0 ? void 0 : options.key) || defaultStorageKey;
        _this.logManager = logManager;
        _this.storage = (options === null || options === void 0 ? void 0 : options.provider) || window.localStorage;
        _this.isDisabled = (options === null || options === void 0 ? void 0 : options.isDisabled) || false;
        _this.alwaysUseCachedSettings = (options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings) || false;
        //options.ttl should be greater than 1 minute
        if (!(0, DataTypeUtil_1.isNumber)(options === null || options === void 0 ? void 0 : options.ttl) || options.ttl < constants_1.Constants.MIN_TTL_MS) {
            _this.logManager.debug('TTL is not passed or invalid (less than 1 minute), using default value of 2 hours');
            _this.ttl = constants_1.Constants.SETTINGS_TTL;
        }
        else {
            _this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || constants_1.Constants.SETTINGS_TTL;
        }
        if (!(0, DataTypeUtil_1.isBoolean)(options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings)) {
            _this.logManager.debug('AlwaysUseCachedSettings is not passed or invalid, using default value of false');
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
            this.logManager.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
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
            this.logManager.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
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
                this.logManager.info("Stored data in storage for key: ".concat(key));
                deferredObject.resolve();
            }
            catch (error) {
                this.logManager.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
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
                this.logManager.info("Retrieved data from storage for key: ".concat(key));
                deferredObject.resolve(dataToReturn);
            }
            catch (error) {
                this.logManager.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
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
                        this.logManager.errorLog('ERROR_DECODING_SDK_KEY_FROM_STORAGE', {
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
//# sourceMappingURL=BrowserStorageConnector.js.map