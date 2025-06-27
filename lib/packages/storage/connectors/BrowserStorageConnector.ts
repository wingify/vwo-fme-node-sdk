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
import { Constants } from '../../../constants';
import { Deferred } from '../../../utils/PromiseUtil';
import { LogManager } from '../../logger';
import { SettingsService } from '../../../services/SettingsService';
import { SettingsSchema } from '../../../models/schemas/SettingsSchemaValidation';
import { isNumber, isBoolean } from '../../../utils/DataTypeUtil';

/**
 * Interface representing the structure of data to be stored
 * @interface StorageData
 */
export interface StorageData {
  rolloutId?: string;
  rolloutKey?: string;
  rolloutVariationId?: string;
  experimentKey?: string;
  experimentId?: string;
  experimentVariationId?: string;
  [key: string]: any;
}

/**
 * Interface for configuring the storage connector
 * @interface ClientStorageOptions
 */
export interface ClientStorageOptions {
  key?: string;
  provider?: Storage;
  isDisabled?: boolean;
  alwaysUseCachedSettings?: boolean;
  ttl?: number; // Custom TTL in milliseconds
}

/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
export class BrowserStorageConnector {
  private storage: Storage;
  private readonly storageKey: string;
  private readonly isDisabled: boolean;
  private readonly alwaysUseCachedSettings: boolean;
  private readonly ttl: number;
  private readonly SETTINGS_KEY: string = Constants.DEFAULT_SETTINGS_STORAGE_KEY;

  /**
   * Creates an instance of BrowserStorageConnector
   * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
   * @param {string} [options.key] - Custom key for storage (defaults to Constants.DEFAULT_LOCAL_STORAGE_KEY)
   * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
   * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
   * @param {boolean} [options.alwaysUseCachedSettings] - Whether to always use cached settings
   * @param {number} [options.ttl] - Custom TTL in milliseconds (defaults to Constants.SETTINGS_TTL)
   */
  constructor(options?: ClientStorageOptions) {
    this.storageKey = options?.key || Constants.DEFAULT_LOCAL_STORAGE_KEY;
    this.storage = options?.provider || window.localStorage;
    this.isDisabled = options?.isDisabled || false;
    this.alwaysUseCachedSettings = options?.alwaysUseCachedSettings || false;

    //options.ttl should be greater than 1 minute
    if (!isNumber(options?.ttl) || options.ttl < Constants.MIN_TTL_MS) {
      LogManager.Instance.debug('TTL is not passed or invalid (less than 1 minute), using default value of 2 hours');
      this.ttl = Constants.SETTINGS_TTL;
    } else {
      this.ttl = options?.ttl || Constants.SETTINGS_TTL;
    }

    if (!isBoolean(options?.alwaysUseCachedSettings)) {
      LogManager.Instance.debug('AlwaysUseCachedSettings is not passed or invalid, using default value of false');
      this.alwaysUseCachedSettings = false;
    } else {
      this.alwaysUseCachedSettings = options?.alwaysUseCachedSettings || false;
    }
  }

  /**
   * Retrieves all stored data from the storage
   * @private
   * @returns {Record<string, StorageData>} Object containing all stored data
   */
  private getStoredData(): Record<string, StorageData> {
    if (this.isDisabled) return {};
    try {
      const data = this.storage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      LogManager.Instance.error(`Error reading from storage: ${error}`);
      return {};
    }
  }

  /**
   * Saves data to the storage
   * @private
   * @param {Record<string, StorageData>} data - The data object to be stored
   */
  private storeData(data: Record<string, StorageData>): void {
    if (this.isDisabled) return;
    try {
      const serializedData = JSON.stringify(data);
      this.storage.setItem(this.storageKey, serializedData);
    } catch (error) {
      LogManager.Instance.error(`Error writing to storage: ${error}`);
    }
  }

  /**
   * Stores feature flag or experiment data for a specific user
   * @public
   * @param {StorageData} data - The data to be stored, containing feature flag or experiment information
   * @returns {Promise<void>} A promise that resolves when the data is successfully stored
   */
  public set(data: StorageData): Promise<void> {
    const deferredObject = new Deferred();
    if (this.isDisabled) {
      deferredObject.resolve();
    } else {
      try {
        const storedData = this.getStoredData();
        const key = `${data.featureKey}_${data.userId}`;
        storedData[key] = data;
        this.storeData(storedData);
        LogManager.Instance.info(`Stored data in storage for key: ${key}`);
        deferredObject.resolve();
      } catch (error) {
        LogManager.Instance.error(`Error storing data: ${error}`);
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
  public get(featureKey: string, userId: string): Promise<StorageData | Record<string, any>> {
    const deferredObject = new Deferred();
    if (this.isDisabled) {
      deferredObject.resolve({});
    } else {
      try {
        const storedData = this.getStoredData();
        const key = `${featureKey}_${userId}`;
        const dataToReturn = storedData[key] ?? {};
        LogManager.Instance.info(`Retrieved data from storage for key: ${key}`);
        deferredObject.resolve(dataToReturn);
      } catch (error) {
        LogManager.Instance.error(`Error retrieving data: ${error}`);
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
  public getSettingsFromStorage(sdkKey: string, accountId: string | number): Promise<Record<string, any> | null> {
    const deferredObject = new Deferred();
    if (this.isDisabled) {
      deferredObject.resolve(null);
    } else {
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
          } catch (e) {
            LogManager.Instance.error('Failed to decode sdkKey from storage');
          }
        }

        // Check for sdkKey and accountId match
        if (!data || data.sdkKey !== sdkKey || String(data.accountId ?? data.a) !== String(accountId)) {
          LogManager.Instance.info('Cached settings do not match sdkKey/accountId, treating as cache miss');
          deferredObject.resolve(null);
          return deferredObject.promise;
        }

        if (this.alwaysUseCachedSettings) {
          LogManager.Instance.info('Using cached settings as alwaysUseCachedSettings is enabled');
          deferredObject.resolve(data);
          return deferredObject.promise;
        }

        if (currentTime - timestamp > this.ttl) {
          LogManager.Instance.info('Settings have expired, need to fetch new settings');
          deferredObject.resolve(null);
        } else {
          // if settings are valid then return the existing settings and update the settings in storage with new timestamp
          LogManager.Instance.info('Retrieved valid settings from storage');
          this.setFreshSettingsInStorage();
          // Decode sdkKey if present
          if (data && data.sdkKey) {
            try {
              data.sdkKey = atob(data.sdkKey);
            } catch (e) {
              LogManager.Instance.error('Failed to decode sdkKey from storage');
            }
          }
          deferredObject.resolve(data);
        }
      } catch (error) {
        LogManager.Instance.error(`Error retrieving settings: ${error}`);
        deferredObject.resolve(null);
      }
    }

    return deferredObject.promise;
  }

  /**
   * Fetches fresh settings and updates the storage with a new timestamp
   */
  public setFreshSettingsInStorage(): void {
    // Fetch fresh settings asynchronously and update storage
    const settingsService = SettingsService.Instance;
    if (settingsService) {
      settingsService
        .fetchSettings()
        .then(async (freshSettings) => {
          if (freshSettings) {
            const isSettingsValid = new SettingsSchema().isSettingsValid(freshSettings);
            if (isSettingsValid) {
              await this.setSettingsInStorage(freshSettings);
              LogManager.Instance.info('Settings updated with fresh data from server');
            }
          }
        })
        .catch((error) => {
          LogManager.Instance.error(`Error fetching fresh settings: ${error}`);
        });
    }
  }
  /**
   * Sets the settings in storage with current timestamp
   * @public
   * @param {Record<string, any>} settings - The settings data to be stored
   * @returns {Promise<void>} A promise that resolves when the settings are successfully stored
   */
  public setSettingsInStorage(settings: Record<string, any>): Promise<void> {
    const deferredObject = new Deferred();
    if (this.isDisabled) {
      deferredObject.resolve();
    } else {
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
        LogManager.Instance.info('Settings stored successfully in storage');
        deferredObject.resolve();
      } catch (error) {
        LogManager.Instance.error(`Error storing settings: ${error}`);
        deferredObject.reject(error);
      }
    }

    return deferredObject.promise;
  }
}
