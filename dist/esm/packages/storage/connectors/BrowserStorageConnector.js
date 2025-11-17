"use strict";
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
const constants_1 = require("../../../constants");
const PromiseUtil_1 = require("../../../utils/PromiseUtil");
const logger_1 = require("../../logger");
const SettingsService_1 = require("../../../services/SettingsService");
const SettingsSchemaValidation_1 = require("../../../models/schemas/SettingsSchemaValidation");
const DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
const FunctionUtil_1 = require("../../../utils/FunctionUtil");
/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
class BrowserStorageConnector {
    /**
     * Creates an instance of BrowserStorageConnector
     * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
     * @param {string} [options.key] - Custom key for storage (defaults to Constants.DEFAULT_LOCAL_STORAGE_KEY)
     * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
     * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
     * @param {boolean} [options.alwaysUseCachedSettings] - Whether to always use cached settings
     * @param {number} [options.ttl] - Custom TTL in milliseconds (defaults to Constants.SETTINGS_TTL)
     */
    constructor(options) {
        this.SETTINGS_KEY = constants_1.Constants.DEFAULT_SETTINGS_STORAGE_KEY;
        this.storageKey = options?.key || constants_1.Constants.DEFAULT_LOCAL_STORAGE_KEY;
        this.storage = options?.provider || window.localStorage;
        this.isDisabled = options?.isDisabled || false;
        this.alwaysUseCachedSettings = options?.alwaysUseCachedSettings || false;
        //options.ttl should be greater than 1 minute
        if (!(0, DataTypeUtil_1.isNumber)(options?.ttl) || options.ttl < constants_1.Constants.MIN_TTL_MS) {
            logger_1.LogManager.Instance.debug('TTL is not passed or invalid (less than 1 minute), using default value of 2 hours');
            this.ttl = constants_1.Constants.SETTINGS_TTL;
        }
        else {
            this.ttl = options?.ttl || constants_1.Constants.SETTINGS_TTL;
        }
        if (!(0, DataTypeUtil_1.isBoolean)(options?.alwaysUseCachedSettings)) {
            logger_1.LogManager.Instance.debug('AlwaysUseCachedSettings is not passed or invalid, using default value of false');
            this.alwaysUseCachedSettings = false;
        }
        else {
            this.alwaysUseCachedSettings = options?.alwaysUseCachedSettings || false;
        }
    }
    /**
     * Retrieves all stored data from the storage
     * @private
     * @returns {Record<string, StorageData>} Object containing all stored data
     */
    getStoredData() {
        if (this.isDisabled)
            return {};
        try {
            const data = this.storage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        }
        catch (error) {
            logger_1.LogManager.Instance.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
            }, { an: constants_1.Constants.BROWSER_STORAGE });
            return {};
        }
    }
    /**
     * Saves data to the storage
     * @private
     * @param {Record<string, StorageData>} data - The data object to be stored
     */
    storeData(data) {
        if (this.isDisabled)
            return;
        try {
            const serializedData = JSON.stringify(data);
            this.storage.setItem(this.storageKey, serializedData);
        }
        catch (error) {
            logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
            }, { an: constants_1.Constants.BROWSER_STORAGE });
        }
    }
    /**
     * Stores feature flag or experiment data for a specific user
     * @public
     * @param {StorageData} data - The data to be stored, containing feature flag or experiment information
     * @returns {Promise<void>} A promise that resolves when the data is successfully stored
     */
    set(data) {
        const deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve();
        }
        else {
            try {
                const storedData = this.getStoredData();
                const key = `${data.featureKey}_${data.userId}`;
                storedData[key] = data;
                this.storeData(storedData);
                logger_1.LogManager.Instance.info(`Stored data in storage for key: ${key}`);
                deferredObject.resolve();
            }
            catch (error) {
                logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                }, { an: constants_1.Constants.BROWSER_STORAGE });
                deferredObject.reject(error);
            }
        }
        return deferredObject.promise;
    }
    /**
     * Retrieves stored feature flag or experiment data for a specific user
     * @public
     * @param {string} featureKey - The key of the feature flag or experiment
     * @param {string} userId - The ID of the user
     * @returns {Promise<StorageData | Record<string, any>>} A promise that resolves to the stored data or {} if not found
     */
    get(featureKey, userId) {
        const deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve({});
        }
        else {
            try {
                const storedData = this.getStoredData();
                const key = `${featureKey}_${userId}`;
                const dataToReturn = storedData[key] ?? {};
                logger_1.LogManager.Instance.info(`Retrieved data from storage for key: ${key}`);
                deferredObject.resolve(dataToReturn);
            }
            catch (error) {
                logger_1.LogManager.Instance.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                }, { an: constants_1.Constants.BROWSER_STORAGE });
                deferredObject.resolve({});
            }
        }
        return deferredObject.promise;
    }
    /**
     * Gets the settings from storage with TTL check and validates sdkKey and accountId
     * @public
     * @param {string} sdkKey - The sdkKey to match
     * @param {number|string} accountId - The accountId to match
     * @returns {Promise<Record<string, any> | null>} A promise that resolves to the settings or null if expired/not found/mismatch
     */
    getSettingsFromStorage(sdkKey, accountId) {
        const deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve(null);
        }
        else {
            try {
                const storedData = this.getStoredData();
                const settingsData = storedData[this.SETTINGS_KEY];
                if (!settingsData) {
                    deferredObject.resolve(null);
                    return deferredObject.promise;
                }
                const { data, timestamp } = settingsData;
                const currentTime = Date.now();
                // Decode sdkKey if present
                if (data && data.sdkKey) {
                    try {
                        data.sdkKey = atob(data.sdkKey);
                    }
                    catch (e) {
                        logger_1.LogManager.Instance.errorLog('ERROR_DECODING_SDK_KEY_FROM_STORAGE', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(e),
                        }, { an: constants_1.Constants.BROWSER_STORAGE });
                    }
                }
                // Check for sdkKey and accountId match
                if (!data || data.sdkKey !== sdkKey || String(data.accountId ?? data.a) !== String(accountId)) {
                    logger_1.LogManager.Instance.info('Cached settings do not match sdkKey/accountId, treating as cache miss');
                    deferredObject.resolve(null);
                    return deferredObject.promise;
                }
                if (this.alwaysUseCachedSettings) {
                    logger_1.LogManager.Instance.info('Using cached settings as alwaysUseCachedSettings is enabled');
                    deferredObject.resolve(data);
                    return deferredObject.promise;
                }
                if (currentTime - timestamp > this.ttl) {
                    logger_1.LogManager.Instance.info('Settings have expired, need to fetch new settings');
                    deferredObject.resolve(null);
                }
                else {
                    // if settings are valid then return the existing settings and update the settings in storage with new timestamp
                    logger_1.LogManager.Instance.info('Retrieved valid settings from storage');
                    this.setFreshSettingsInStorage();
                    // Decode sdkKey if present
                    if (data && data.sdkKey) {
                        try {
                            data.sdkKey = atob(data.sdkKey);
                        }
                        catch (e) {
                            logger_1.LogManager.Instance.errorLog('ERROR_DECODING_SDK_KEY_FROM_STORAGE', {
                                err: (0, FunctionUtil_1.getFormattedErrorMessage)(e),
                            }, { an: constants_1.Constants.BROWSER_STORAGE });
                        }
                    }
                    deferredObject.resolve(data);
                }
            }
            catch (error) {
                logger_1.LogManager.Instance.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                }, { an: constants_1.Constants.BROWSER_STORAGE });
                deferredObject.resolve(null);
            }
        }
        return deferredObject.promise;
    }
    /**
     * Fetches fresh settings and updates the storage with a new timestamp
     */
    setFreshSettingsInStorage() {
        // Fetch fresh settings asynchronously and update storage
        const settingsService = SettingsService_1.SettingsService.Instance;
        if (settingsService) {
            settingsService
                .fetchSettings()
                .then(async (freshSettings) => {
                if (freshSettings) {
                    const isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(freshSettings);
                    if (isSettingsValid) {
                        await this.setSettingsInStorage(freshSettings);
                        logger_1.LogManager.Instance.info('Settings updated with fresh data from server');
                    }
                }
            })
                .catch((error) => {
                logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                }, { an: constants_1.Constants.BROWSER_STORAGE }, false);
            });
        }
    }
    /**
     * Sets the settings in storage with current timestamp
     * @public
     * @param {Record<string, any>} settings - The settings data to be stored
     * @returns {Promise<void>} A promise that resolves when the settings are successfully stored
     */
    setSettingsInStorage(settings) {
        const deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve();
        }
        else {
            try {
                const storedData = this.getStoredData();
                // Clone settings to avoid mutating the original object
                const settingsToStore = { ...settings };
                if (settingsToStore.sdkKey) {
                    settingsToStore.sdkKey = btoa(settingsToStore.sdkKey);
                }
                storedData[this.SETTINGS_KEY] = {
                    data: settingsToStore,
                    timestamp: Date.now(),
                };
                this.storeData(storedData);
                logger_1.LogManager.Instance.info('Settings stored successfully in storage');
                deferredObject.resolve();
            }
            catch (error) {
                logger_1.LogManager.Instance.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
                    err: 'Storing settings: ' + (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                }, { an: constants_1.Constants.BROWSER_STORAGE });
                deferredObject.reject(error);
            }
        }
        return deferredObject.promise;
    }
}
exports.BrowserStorageConnector = BrowserStorageConnector;
//# sourceMappingURL=BrowserStorageConnector.js.map