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
}

/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
export class BrowserStorageConnector {
  private storage: Storage;
  private readonly storageKey: string;
  private readonly isDisabled: boolean;

  /**
   * Creates an instance of BrowserStorageConnector
   * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
   * @param {string} [options.key] - Custom key for storage (defaults to Constants.DEFAULT_LOCAL_STORAGE_KEY)
   * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
   * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
   */
  constructor(options?: ClientStorageOptions) {
    this.storageKey = options?.key || Constants.DEFAULT_LOCAL_STORAGE_KEY;
    this.storage = options?.provider || window.localStorage;
    this.isDisabled = options?.isDisabled || false;
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
}
