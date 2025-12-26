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
import { StorageEnum } from '../enums/StorageEnum.js';
import { Storage } from '../packages/storage/index.js';
import { LogManager } from '../packages/logger/index.js';
import { isEmptyObject, isNull, isUndefined } from '../utils/DataTypeUtil.js';
import { Deferred } from '../utils/PromiseUtil.js';
import { ApiEnum } from '../enums/ApiEnum.js';
import { getFormattedErrorMessage } from '../utils/FunctionUtil.js';
import { Constants } from '../constants/index.js';
import { SettingsService } from './SettingsService.js';
import { SettingsSchema } from '../models/schemas/SettingsSchemaValidation.js';
import { buildMessage } from '../utils/LogMessageUtil.js';
import { InfoLogMessagesEnum } from '../enums/log-messages/index.js';
export class StorageService {
    constructor() {
        this.storageData = {};
    }
    /**
     * Retrieves data from storage based on the feature key and user ID.
     * @param featureKey The key to identify the feature data.
     * @param user The user object containing at least an ID.
     * @returns A promise that resolves to the data retrieved or an error/storage status enum.
     */
    async getDataInStorage(featureKey, context) {
        const deferredObject = new Deferred();
        const storageInstance = Storage.Instance.getConnector();
        // Check if the storage instance is available
        if (isNull(storageInstance) || isUndefined(storageInstance)) {
            deferredObject.resolve(StorageEnum.STORAGE_UNDEFINED);
        }
        else {
            storageInstance
                .get(featureKey, context.getId())
                .then((data) => {
                deferredObject.resolve(data);
            })
                .catch((err) => {
                LogManager.Instance.errorLog('ERROR_READING_STORED_DATA_IN_STORAGE', { err }, { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
                deferredObject.resolve(StorageEnum.NO_DATA_FOUND);
            });
        }
        return deferredObject.promise;
    }
    /**
     * Stores data in the storage.
     * @param data The data to be stored as a record.
     * @returns A promise that resolves to true if data is successfully stored, otherwise false.
     */
    async setDataInStorage(data) {
        const deferredObject = new Deferred();
        const storageInstance = Storage.Instance.getConnector();
        // Check if the storage instance is available
        if (storageInstance === null || storageInstance === undefined) {
            deferredObject.resolve(false);
        }
        else {
            storageInstance
                .set(data)
                .then(() => {
                deferredObject.resolve(true);
            })
                .catch(() => {
                deferredObject.resolve(false);
            });
        }
        return deferredObject.promise;
    }
    /**
     * Gets the settings from storage.
     * @param accountId The account ID.
     * @param sdkKey The SDK key.
     * @returns {Promise<Record<string, any>>} A promise that resolves to the settings or empty object if not found.
     */
    async getSettingsFromStorage(accountId, sdkKey, shouldFetchFreshSettings = true) {
        const deferredObject = new Deferred();
        try {
            const storageInstance = Storage.Instance.getConnector();
            // check if the storage instance is available and has the getSettings method
            if (storageInstance && typeof storageInstance.getSettings === 'function') {
                // get the settingsData from storage
                const settingsData = await storageInstance.getSettings(accountId, sdkKey);
                if (!settingsData || isEmptyObject(settingsData)) {
                    // if no settings data is found, resolve the promise with empty object
                    deferredObject.resolve({});
                    return deferredObject.promise;
                }
                // if settings data is found, get the settings and last updated timestamp
                const { settings, timestamp } = settingsData;
                // Check for sdkKey and accountId match
                if (!settings || settings.sdkKey !== sdkKey || String(settings.accountId ?? settings.a) !== String(accountId)) {
                    LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_CACHE_MISS_KEY_ACCOUNT_ID_MISMATCH));
                    deferredObject.resolve({});
                    return deferredObject.promise;
                }
                const shouldUseCachedSettings = storageInstance.alwaysUseCachedSettings || Constants.ALWAYS_USE_CACHED_SETTINGS;
                if (shouldUseCachedSettings) {
                    LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_USING_CACHED_SETTINGS));
                    deferredObject.resolve(settings);
                    return deferredObject.promise;
                }
                // get the current time
                const currentTime = Date.now();
                const settingsTTL = storageInstance.ttl || Constants.SETTINGS_TTL;
                // check if the settings are expired based on the last updated timestamp
                if (currentTime - timestamp > settingsTTL) {
                    LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_EXPIRED));
                    deferredObject.resolve({});
                }
                else {
                    // if settings are not expired, then return the existing settings and update the settings in storage with new timestamp
                    LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_RETRIEVED_FROM_STORAGE));
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
                            LogManager.Instance.errorLog('ERROR_DECODING_SDK_KEY_FROM_STORAGE', {
                                err: getFormattedErrorMessage(e),
                            }, { an: Constants.STORAGE });
                        }
                    }
                    deferredObject.resolve(settings);
                }
            }
            else {
                deferredObject.resolve({});
            }
        }
        catch (error) {
            LogManager.Instance.errorLog('ERROR_READING_SETTINGS_FROM_STORAGE', { err: getFormattedErrorMessage(error) }, { an: Constants.STORAGE });
            deferredObject.resolve({});
        }
        return deferredObject.promise;
    }
    /**
     * Sets the settings in storage.
     * @param accountId The account ID.
     * @param sdkKey The SDK key.
     * @param settings The settings to be stored.
     * @returns {Promise<void>} A promise that resolves when the settings are successfully stored.
     */
    async setSettingsInStorage(accountId, sdkKey, settings) {
        const deferredObject = new Deferred();
        try {
            const storageInstance = Storage.Instance.getConnector();
            // check if the storage instance is available and has the setSettings method
            if (storageInstance && typeof storageInstance.setSettings === 'function') {
                // clone the settings to avoid mutating the original object
                const clonedSettings = { ...settings };
                // create the settings to store object with the cloned settings and the current timestamp
                const settingsToStore = { settings: clonedSettings, timestamp: Date.now() };
                // set the settings in storage
                await storageInstance.setSettings(settingsToStore);
                LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_SUCCESSFULLY_STORED));
                deferredObject.resolve();
            }
            else {
                deferredObject.resolve();
            }
        }
        catch (error) {
            LogManager.Instance.errorLog('ERROR_STORING_SETTINGS_IN_STORAGE', { err: getFormattedErrorMessage(error) }, { an: Constants.STORAGE });
            deferredObject.resolve();
        }
        return deferredObject.promise;
    }
    /**
     * Fetches fresh settings and updates the storage with a new timestamp
     */
    async setFreshSettingsInStorage(accountId, sdkKey) {
        const deferredObject = new Deferred();
        // Fetch fresh settings asynchronously and update storage
        const settingsService = SettingsService.Instance;
        const storageInstance = Storage.Instance.getConnector();
        if (settingsService && storageInstance && typeof storageInstance.setSettings === 'function') {
            settingsService
                .fetchSettings()
                .then(async (freshSettings) => {
                if (freshSettings) {
                    const isSettingsValid = new SettingsSchema().isSettingsValid(freshSettings);
                    if (isSettingsValid) {
                        await this.setSettingsInStorage(accountId, sdkKey, freshSettings);
                        LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_UPDATED_WITH_FRESH_DATA));
                    }
                }
                deferredObject.resolve();
            })
                .catch((error) => {
                LogManager.Instance.errorLog('ERROR_STORING_FRESH_SETTINGS_IN_STORAGE', {
                    err: getFormattedErrorMessage(error),
                }, { an: Constants.STORAGE });
                deferredObject.resolve();
            });
            return deferredObject.promise;
        }
    }
}
//# sourceMappingURL=StorageService.js.map