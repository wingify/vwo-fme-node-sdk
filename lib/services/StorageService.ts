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
import { StorageEnum } from '../enums/StorageEnum';
import { ContextModel } from '../models/user/ContextModel';
import { dynamic } from '../types/Common';

import { isEmptyObject, isNull, isUndefined } from '../utils/DataTypeUtil';
import { Deferred } from '../utils/PromiseUtil';
import { ApiEnum } from '../enums/ApiEnum';
import { getFormattedErrorMessage } from '../utils/FunctionUtil';
import { Constants } from '../constants';
import { SettingsSchema } from '../models/schemas/SettingsSchemaValidation';
import { buildMessage } from '../utils/LogMessageUtil';
import { InfoLogMessagesEnum } from '../enums/log-messages';
import { ServiceContainer } from './ServiceContainer';

export interface IStorageService {
  getDataInStorage(
    featureKey: any,
    context: ContextModel,
    serviceContainer: ServiceContainer,
  ): Promise<Record<any, any>>;
  setDataInStorage(data: Record<any, any>, serviceContainer: ServiceContainer): Promise<void>;
}
export class StorageService implements IStorageService {
  private storageData: Record<string, dynamic> = {};
  private serviceContainer: ServiceContainer;

  constructor(serviceContainer: ServiceContainer) {
    this.serviceContainer = serviceContainer;
  }

  /**
   * Retrieves data from storage based on the feature key and user ID.
   * @param featureKey The key to identify the feature data.
   * @param user The user object containing at least an ID.
   * @returns A promise that resolves to the data retrieved or an error/storage status enum.
   */
  async getDataInStorage(featureKey: any, context: ContextModel): Promise<Record<any, any>> {
    const deferredObject = new Deferred();

    // Check if the storage instance is available
    if (
      isNull(this.serviceContainer.getStorageConnector()) ||
      isUndefined(this.serviceContainer.getStorageConnector())
    ) {
      deferredObject.resolve(StorageEnum.STORAGE_UNDEFINED);
    } else {
      this.serviceContainer
        .getStorageConnector()
        .get(featureKey, context.getId())
        .then((data: Record<string, any>) => {
          deferredObject.resolve(data);
        })
        .catch((err) => {
          this.serviceContainer
            .getLogManager()
            .errorLog(
              'ERROR_READING_STORED_DATA_IN_STORAGE',
              { err },
              { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() },
            );

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
  async setDataInStorage(data: Record<any, any>): Promise<void> {
    const deferredObject = new Deferred();

    // Check if the storage instance is available
    if (
      this.serviceContainer.getStorageConnector() === null ||
      this.serviceContainer.getStorageConnector() === undefined
    ) {
      deferredObject.resolve(false);
    } else {
      this.serviceContainer
        .getStorageConnector()
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
  async getSettingsFromStorage(
    accountId: number,
    sdkKey: string,
    shouldFetchFreshSettings: boolean = true,
  ): Promise<Record<string, any>> {
    const deferredObject = new Deferred();
    try {
      // check if the storage instance is available and has the getSettings method
      if (
        this.serviceContainer.getStorageConnector() &&
        typeof this.serviceContainer.getStorageConnector().getSettings === 'function'
      ) {
        // get the settingsData from storage
        const settingsData = await this.serviceContainer.getStorageConnector().getSettings(accountId, sdkKey);
        if (!settingsData || isEmptyObject(settingsData)) {
          // if no settings data is found, resolve the promise with empty object
          deferredObject.resolve({});
          return deferredObject.promise;
        }
        // if settings data is found, get the settings and last updated timestamp
        const { settings, timestamp } = settingsData;

        // Check for sdkKey and accountId match
        if (!settings || settings.sdkKey !== sdkKey || String(settings.accountId ?? settings.a) !== String(accountId)) {
          this.serviceContainer
            .getLogManager()
            .info(buildMessage(InfoLogMessagesEnum.SETTINGS_CACHE_MISS_KEY_ACCOUNT_ID_MISMATCH));
          deferredObject.resolve({});
          return deferredObject.promise;
        }

        const shouldUseCachedSettings =
          this.serviceContainer.getStorageConnector().alwaysUseCachedSettings || Constants.ALWAYS_USE_CACHED_SETTINGS;
        if (shouldUseCachedSettings) {
          this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SETTINGS_USING_CACHED_SETTINGS));
          deferredObject.resolve(settings);
          return deferredObject.promise;
        }

        // get the current time
        const currentTime = Date.now();
        const settingsTTL = this.serviceContainer.getStorageConnector().ttl || Constants.SETTINGS_TTL;
        // check if the settings are expired based on the last updated timestamp
        if (currentTime - timestamp > settingsTTL) {
          this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SETTINGS_EXPIRED));
          deferredObject.resolve({});
        } else {
          // if settings are not expired, then return the existing settings and update the settings in storage with new timestamp
          this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SETTINGS_RETRIEVED_FROM_STORAGE));
          if (shouldFetchFreshSettings) {
            // if shouldFetchFreshSettings is true, then fetch fresh settings asynchronously and update the storage with new timestamp
            this.setFreshSettingsInStorage(accountId, sdkKey);
          }
          // decode sdkKey if present in the settings
          if (settings && settings.sdkKey) {
            try {
              settings.sdkKey = atob(settings.sdkKey);
            } catch (e) {
              this.serviceContainer.getLogManager().errorLog(
                'ERROR_DECODING_SDK_KEY_FROM_STORAGE',
                {
                  err: getFormattedErrorMessage(e),
                },
                { an: Constants.STORAGE },
              );
            }
          }
          deferredObject.resolve(settings);
        }
      } else {
        deferredObject.resolve({});
      }
    } catch (error) {
      this.serviceContainer
        .getLogManager()
        .errorLog(
          'ERROR_READING_SETTINGS_FROM_STORAGE',
          { err: getFormattedErrorMessage(error) },
          { an: Constants.STORAGE },
        );
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
  async setSettingsInStorage(accountId: number, sdkKey: string, settings: Record<string, any>): Promise<void> {
    const deferredObject = new Deferred();
    try {
      // check if the storage instance is available and has the setSettings method
      if (
        this.serviceContainer.getStorageConnector() &&
        typeof this.serviceContainer.getStorageConnector().setSettings === 'function'
      ) {
        // clone the settings to avoid mutating the original object
        const clonedSettings = { ...settings };
        // create the settings to store object with the cloned settings and the current timestamp
        const settingsToStore = { settings: clonedSettings, timestamp: Date.now() };
        // set the settings in storage
        await this.serviceContainer.getStorageConnector().setSettings(settingsToStore);
        this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SETTINGS_SUCCESSFULLY_STORED));
        deferredObject.resolve();
      } else {
        deferredObject.resolve();
      }
    } catch (error) {
      this.serviceContainer
        .getLogManager()
        .errorLog(
          'ERROR_STORING_SETTINGS_IN_STORAGE',
          { err: getFormattedErrorMessage(error) },
          { an: Constants.STORAGE },
        );
      deferredObject.resolve();
    }

    return deferredObject.promise;
  }

  /**
   * Fetches fresh settings and updates the storage with a new timestamp
   */
  public async setFreshSettingsInStorage(accountId: number, sdkKey: string): Promise<void> {
    const deferredObject = new Deferred();
    // Fetch fresh settings asynchronously and update storage
    if (
      this.serviceContainer.getSettingsService() &&
      this.serviceContainer.getStorageConnector() &&
      typeof this.serviceContainer.getStorageConnector().setSettings === 'function'
    ) {
      this.serviceContainer
        .getSettingsService()
        .fetchSettings()
        .then(async (freshSettings) => {
          if (freshSettings) {
            const isSettingsValid = new SettingsSchema().isSettingsValid(freshSettings);
            if (isSettingsValid) {
              await this.setSettingsInStorage(accountId, sdkKey, freshSettings);
              this.serviceContainer
                .getLogManager()
                .info(buildMessage(InfoLogMessagesEnum.SETTINGS_UPDATED_WITH_FRESH_DATA));
            }
          }
          deferredObject.resolve();
        })
        .catch((error) => {
          this.serviceContainer.getLogManager().errorLog(
            'ERROR_STORING_FRESH_SETTINGS_IN_STORAGE',
            {
              err: getFormattedErrorMessage(error),
            },
            { an: Constants.STORAGE },
          );
          deferredObject.resolve();
        });

      return deferredObject.promise;
    }
  }
}
