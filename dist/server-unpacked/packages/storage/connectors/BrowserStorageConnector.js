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
var constants_1 = require("../../../constants");
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var logger_1 = require("../../logger");
var SettingsService_1 = require("../../../services/SettingsService");
/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
var BrowserStorageConnector = /** @class */ (function () {
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
        this.SETTINGS_KEY = constants_1.Constants.DEFAULT_SETTINGS_STORAGE_KEY;
        this.storageKey = (options === null || options === void 0 ? void 0 : options.key) || constants_1.Constants.DEFAULT_LOCAL_STORAGE_KEY;
        this.storage = (options === null || options === void 0 ? void 0 : options.provider) || window.localStorage;
        this.isDisabled = (options === null || options === void 0 ? void 0 : options.isDisabled) || false;
        this.alwaysUseCachedSettings = (options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings) || false;
        // if ttl in options is set is negative or 0 log that passed ttl is incorrect and using default value
        // validate ttl is a number
        //options.ttl should be greater than 1 minute
        if ((options === null || options === void 0 ? void 0 : options.ttl) && typeof options.ttl !== 'number' && options.ttl < 60000) {
            logger_1.LogManager.Instance.debug('Passed ttl is invalid and using default value of 2 hours');
            this.ttl = constants_1.Constants.SETTINGS_TTL;
        }
        else {
            this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || constants_1.Constants.SETTINGS_TTL;
        }
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
            logger_1.LogManager.Instance.error("Error reading from storage: ".concat(error));
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
            logger_1.LogManager.Instance.error("Error writing to storage: ".concat(error));
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
                logger_1.LogManager.Instance.error("Error storing data: ".concat(error));
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
                logger_1.LogManager.Instance.error("Error retrieving data: ".concat(error));
                deferredObject.resolve({});
            }
        }
        return deferredObject.promise;
    };
    /**
     * Gets the settings from storage with TTL check
     * @public
     * @returns {Promise<Record<string, any> | null>} A promise that resolves to the settings or null if expired/not found
     */
    BrowserStorageConnector.prototype.getSettingsFromStorage = function () {
        var deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve(null);
        }
        else {
            try {
                var storedData = this.getStoredData();
                var settingsData = storedData[this.SETTINGS_KEY];
                if (!settingsData) {
                    deferredObject.resolve(null);
                    return deferredObject.promise;
                }
                var data = settingsData.data, timestamp = settingsData.timestamp;
                var currentTime = Date.now();
                if (this.alwaysUseCachedSettings) {
                    logger_1.LogManager.Instance.info('Using cached settings as alwaysUseCachedSettings is enabled');
                    deferredObject.resolve(data);
                }
                if (currentTime - timestamp > this.ttl) {
                    logger_1.LogManager.Instance.info('Settings have expired, need to fetch new settings');
                    deferredObject.resolve(null);
                }
                else {
                    // if settings are valid then return the existing settings and update the settings in storage with new timestamp
                    logger_1.LogManager.Instance.info('Retrieved valid settings from storage');
                    this.setFreshSettingsInStorage();
                    deferredObject.resolve(data);
                }
            }
            catch (error) {
                logger_1.LogManager.Instance.error("Error retrieving settings: ".concat(error));
                deferredObject.resolve(null);
            }
        }
        return deferredObject.promise;
    };
    /**
     * Fetches fresh settings and updates the storage with a new timestamp
     */
    BrowserStorageConnector.prototype.setFreshSettingsInStorage = function () {
        var _this = this;
        // Fetch fresh settings asynchronously and update storage
        var settingsService = SettingsService_1.SettingsService.Instance;
        if (settingsService) {
            settingsService
                .fetchSettings()
                .then(function (freshSettings) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!freshSettings) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.setSettingsInStorage(freshSettings)];
                        case 1:
                            _a.sent();
                            logger_1.LogManager.Instance.info('Settings updated with fresh data from server');
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (error) {
                logger_1.LogManager.Instance.error("Error fetching fresh settings: ".concat(error));
            });
        }
    };
    /**
     * Sets the settings in storage with current timestamp
     * @public
     * @param {Record<string, any>} settings - The settings data to be stored
     * @returns {Promise<void>} A promise that resolves when the settings are successfully stored
     */
    BrowserStorageConnector.prototype.setSettingsInStorage = function (settings) {
        var deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve();
        }
        else {
            try {
                var storedData = this.getStoredData();
                storedData[this.SETTINGS_KEY] = {
                    data: settings,
                    timestamp: Date.now(),
                };
                this.storeData(storedData);
                logger_1.LogManager.Instance.info('Settings stored successfully');
                deferredObject.resolve();
            }
            catch (error) {
                logger_1.LogManager.Instance.error("Error storing settings: ".concat(error));
                deferredObject.reject(error);
            }
        }
        return deferredObject.promise;
    };
    return BrowserStorageConnector;
}());
exports.BrowserStorageConnector = BrowserStorageConnector;
//# sourceMappingURL=BrowserStorageConnector.js.map