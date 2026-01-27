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
import { Constants } from '../../../constants/index.js';
import { Deferred } from '../../../utils/PromiseUtil.js';
import { isNumber, isBoolean } from '../../../utils/DataTypeUtil.js';
import { getFormattedErrorMessage } from '../../../utils/FunctionUtil.js';
import { Connector } from '../Connector.js';
/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
export class BrowserStorageConnector extends Connector {
    /**
     * Creates an instance of BrowserStorageConnector
     * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
     * @param {string} defaultStorageKey - Default key for storage
     * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
     * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
     * @param {boolean} [options.alwaysUseCachedSettings] - Whether to always use cached settings
     * @param {number} [options.ttl] - Custom TTL in milliseconds (defaults to Constants.SETTINGS_TTL)
     */
    constructor(options, defaultStorageKey, logManager) {
        super();
        this.SETTINGS_KEY = Constants.DEFAULT_SETTINGS_STORAGE_KEY;
        this.storageKey = options?.key || defaultStorageKey;
        this.logManager = logManager;
        this.storage = options?.provider || window.localStorage;
        this.isDisabled = options?.isDisabled || false;
        this.alwaysUseCachedSettings = options?.alwaysUseCachedSettings || false;
        //options.ttl should be greater than 1 minute
        if (!isNumber(options?.ttl) || options.ttl < Constants.MIN_TTL_MS) {
            this.logManager.debug('TTL is not passed or invalid (less than 1 minute), using default value of 2 hours');
            this.ttl = Constants.SETTINGS_TTL;
        }
        else {
            this.ttl = options?.ttl || Constants.SETTINGS_TTL;
        }
        if (!isBoolean(options?.alwaysUseCachedSettings)) {
            this.logManager.debug('AlwaysUseCachedSettings is not passed or invalid, using default value of false');
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
            this.logManager.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
                err: getFormattedErrorMessage(error),
            }, { an: Constants.STORAGE });
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
            this.logManager.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
                err: getFormattedErrorMessage(error),
            }, { an: Constants.STORAGE });
        }
    }
    /**
     * Stores feature flag or experiment data for a specific user
     * @public
     * @param {StorageData} data - The data to be stored, containing feature flag or experiment information
     * @returns {Promise<void>} A promise that resolves when the data is successfully stored
     */
    set(data) {
        const deferredObject = new Deferred();
        if (this.isDisabled) {
            deferredObject.resolve();
        }
        else {
            try {
                const storedData = this.getStoredData();
                const key = `${data.featureKey}_${data.userId}`;
                storedData[key] = data;
                this.storeData(storedData);
                this.logManager.info(`Stored data in storage for key: ${key}`);
                deferredObject.resolve();
            }
            catch (error) {
                this.logManager.errorLog('ERROR_STORING_DATA_IN_BROWSER_STORAGE', {
                    err: getFormattedErrorMessage(error),
                }, { an: Constants.STORAGE });
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
        const deferredObject = new Deferred();
        if (this.isDisabled) {
            deferredObject.resolve({});
        }
        else {
            try {
                const storedData = this.getStoredData();
                const key = `${featureKey}_${userId}`;
                const dataToReturn = storedData[key] ?? {};
                this.logManager.info(`Retrieved data from storage for key: ${key}`);
                deferredObject.resolve(dataToReturn);
            }
            catch (error) {
                this.logManager.errorLog('ERROR_READING_DATA_FROM_BROWSER_STORAGE', {
                    err: getFormattedErrorMessage(error),
                }, { an: Constants.STORAGE });
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
     * @returns {Promise<ISettingsData>} A promise that resolves to the ISettingsData or empty object if not found
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSettings(accountId, sdkKey) {
        const deferredObject = new Deferred();
        if (this.isDisabled) {
            deferredObject.resolve({});
        }
        else {
            try {
                const storedData = this.getStoredData();
                const settingsData = storedData[this.SETTINGS_KEY];
                // Decode sdkKey if present
                if (settingsData && settingsData.settings && settingsData.settings.sdkKey) {
                    try {
                        settingsData.settings.sdkKey = atob(settingsData.settings.sdkKey);
                    }
                    catch (e) {
                        this.logManager.errorLog('ERROR_DECODING_SDK_KEY_FROM_STORAGE', {
                            err: getFormattedErrorMessage(e),
                        }, { an: Constants.STORAGE });
                    }
                }
                deferredObject.resolve(settingsData);
            }
            catch (error) {
                deferredObject.resolve({});
            }
        }
        return deferredObject.promise;
    }
    /**
     * Sets the settings in storage with current timestamp
     * @public
     * @param {ISettingsData} data - The settings data to be stored
     * @returns {Promise<void>} A promise that resolves when the settings are successfully stored
     */
    setSettings(data) {
        const deferredObject = new Deferred();
        if (this.isDisabled) {
            deferredObject.resolve();
        }
        else {
            try {
                const storedData = this.getStoredData();
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
    }
}
//# sourceMappingURL=BrowserStorageConnector.js.map