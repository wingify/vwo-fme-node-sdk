/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
import { dynamic } from './types/Common';

import { LogManager } from './modules/logger';
import { NetworkManager } from './modules/networking';
import { SegmentationManager } from './modules/segmentor';

import { Storage } from './modules/storage';

import { VWOClient } from './VWOClient';
import { SettingsModel } from './models/settings/SettingsModel';
import { SettingsManager } from './services/SettingsManager';
import { processSettings } from './utils/SettingsUtil';
// import { BatchEventsQueue } from './services/batchEventsQueue';
// import { DimensionModel } from './types/types';
import { Constants } from './constants';
// import { AnalyticsEvent } from './services/analyticsEvent';

import { Deferred } from './utils/PromiseUtil';
// import { getRandomUUID } from './utils/UuidUtil';
import { LogLevelEnum } from './enums/LogLevelEnum';
import { isBoolean, isFunction, isNumber, isObject } from './utils/DataTypeUtil';
import { cloneObject } from './utils/FunctionUtil';
import { getRandomUUID } from './utils/UuidUtil';
import { IVWOOptions, VWOOptionsModel } from './models/VWOOptionsModel';

interface IVWOBuilder {
  settings: SettingsModel; // Holds the configuration settings for the VWO client
  storage: Storage; // Interface for storage management
  logManager: LogManager; // Manages logging across the VWO SDK
  isSettingsFetchInProgress: boolean; // Flag to check if settings fetch is in progress

  build(settings: SettingsModel): VWOClient; // Builds and returns a new VWOClient instance

  fetchSettings(): Promise<SettingsModel>; // Asynchronously fetches settings from the server
  setSettingsManager(): this; // Sets up the settings manager with provided options
  setSettings(settings: SettingsModel): void; // Sets and processes the settings object
  getSettings(force: boolean): Promise<dynamic>; // Fetches settings, optionally forcing a refresh
  setStorage(): this; // Sets up the storage connector based on provided options
  setNetworkManager(): this; // Configures the network manager with client and mode
  initBatching(): this; // Initializes event batching with provided configuration
  initPolling(): this; // Sets up polling for settings at a specified interval
  setAnalyticsCallback(): this; // Configures the analytics callback based on provided options
  setLogger(): this; // Sets up the logger with specified options
  setSegmentation(): this; // Configures the segmentation evaluator with provided options
}

export class VWOBuilder implements IVWOBuilder {
  readonly apiKey: string;
  readonly options: Record<string, any>;

  private settingFileManager: SettingsManager;

  settings: SettingsModel;
  storage: Storage;
  logManager: LogManager;
  originalSettings: dynamic;
  isSettingsFetchInProgress: boolean;

  constructor(options: IVWOOptions) {
    this.options = options;
  }

  /**
   * Sets the network manager with the provided client and development mode options.
   * @returns {this} The instance of this builder.
   */
  setNetworkManager(): this {
    const networkInstance = NetworkManager.Instance;
    // Attach the network client from options
    networkInstance.attachClient(this.options?.network?.client);
    // Set the development mode based on options
    networkInstance.getConfig().setDevelopmentMode(this.options?.isDevelopmentMode);
    return this;
  }

  /**
   * Sets the segmentation evaluator with the provided segmentation options.
   * @returns {this} The instance of this builder.
   */
  setSegmentation(): this {
    SegmentationManager.Instance.attachEvaluator(this.options?.segmentation);
    return this;
  }

  /**
   * Fetches settings asynchronously, ensuring no parallel fetches.
   * @param {boolean} [force=false] - Force fetch ignoring cache.
   * @returns {Promise<SettingsModel>} A promise that resolves to the fetched settings.
   */
  fetchSettings(force?: boolean): Promise<SettingsModel> {
    const deferredObject = new Deferred();

    // Check if a fetch operation is already in progress
    if (!this.isSettingsFetchInProgress) {
      this.isSettingsFetchInProgress = true;
      this.settingFileManager.getSettings(force).then((settings: SettingsModel) => {
        this.originalSettings = settings;

        this.isSettingsFetchInProgress = false;
        deferredObject.resolve(settings);
      });

      return deferredObject.promise;
    } else {
      // Avoid parallel fetches by recursively calling fetchSettings
      return this.fetchSettings(force);
    }
  }

  /**
   * Sets the settings object, processing it for use.
   * @param {Record<string, any> | string} settings - The settings to be set.
   */
  setSettings(settings: Record<string, any> | string): void {
    LogManager.Instance.debug('API - setSettings called');
    this.originalSettings = settings;
    // Clone and process the settings
    this.settings = cloneObject(settings);
    this.settings = processSettings(this.settings);
  }

  /**
   * Gets the settings, fetching them if not cached or if forced.
   * @param {boolean} [force=false] - Force fetch ignoring cache.
   * @returns {Promise<SettingsModel>} A promise that resolves to the settings.
   */
  getSettings(force?: boolean): Promise<SettingsModel> {
    const deferredObject = new Deferred();

    // Use cached settings if available and not forced to fetch
    if (!force && this.settings) {
      LogManager.Instance.info('Using already fetched and cached settings');
      deferredObject.resolve(this.settings);
    } else {
      // Fetch settings if not cached or forced
      this.fetchSettings(force).then((settings: SettingsModel) => {
        deferredObject.resolve(settings);
      });
    }
    return deferredObject.promise;
  }

  /**
   * Sets the storage connector based on the provided storage options.
   * @returns {this} The instance of this builder.
   */
  setStorage(): this {
    if (this.options.storage) {
      // Attach the storage connector from options
      this.storage = Storage.Instance.attachConnector(this.options.storage);
    } else {
      // Set storage to null if no storage options provided
      this.storage = null;
    }

    return this;
  }

  /**
   * Sets the settings manager with the provided options.
   * @returns {this} The instance of this builder.
   */
  setSettingsManager(): this {
    this.settingFileManager = new SettingsManager(this.options);

    return this;
  }

  /**
   * Sets the logger with the provided logger options.
   * @returns {this} The instance of this builder.
   */
  setLogger(): this {
    this.logManager = new LogManager(
      this.options.logger || {
        defaultTransport: true,
        level: LogLevelEnum.DEBUG
      }
    );
    return this;
  }

  /**
   * Sets the analytics callback with the provided analytics options.
   * @returns {this} The instance of this builder.
   */
  setAnalyticsCallback(): this {
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
  }

  /**
   * Generates a random user ID based on the provided API key.
   * @returns {string} The generated random user ID.
   */
  getRandomUserId(): string {
    try {
      LogManager.Instance.debug('API - getRandomUserId was called');
      return getRandomUUID(this.options.apiKey);
    } catch (err) {
      LogManager.Instance.error(`Random User ID could be generated. ${err}`);
    }
  }

  /**
   * Initializes the batching with the provided batch events options.
   * @returns {this} The instance of this builder.
   */
  initBatching(): this {
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

    // BatchEventsQueue.Instance.setBatchConfig(this.options.batchEvents, this.options.apiKey); // TODO

    return this;
  }

  /**
   * Initializes the polling with the provided poll interval.
   * @returns {this} The instance of this builder.
   */
  initPolling(): this {
    if (!this.options.pollInterval) {
      // TODO: Add logging here
      return this;
    }

    if (this.options.pollInterval && !isNumber(this.options.pollInterval)) {
      // TODO: Add logging here
      return this;
    }

    if (this.options.pollInterval && this.options.pollInterval < 0) {
      // TODO: Add logging here
      LogManager.Instance.error('Poll interval should be greater than 1');
      return this;
    }

    this.checkAndPoll(this.options.pollInterval);

    return this;
  }

  /**
   * Builds a new VWOClient instance with the provided settings.
   * @param {SettingsModel} settings - The settings for the VWOClient.
   * @returns {VWOClient} The new VWOClient instance.
   */
  build(settings: SettingsModel): VWOClient {
    return new VWOClient(settings, this.options);
  }

  /**
   * Checks and polls for settings updates at the provided interval.
   * @param {number} pollingInterval - The interval in seconds for polling.
   */
  checkAndPoll(pollingInterval: number): void {
    setInterval(() => {
      this.getSettings(true)
        .then((latestSettings: SettingsModel) => {
          const lastSettings = JSON.stringify(this.originalSettings);
          const stringifiedLatestSettings = JSON.stringify(latestSettings);
          if (stringifiedLatestSettings !== lastSettings) {
            this.originalSettings = latestSettings;
            const clonedSettings = cloneObject(latestSettings);
            this.settings = processSettings(clonedSettings);
            // TODO: Add Logging:- Settings file updated
          }
        })
        .catch(() => {
          // TODO:- Add logging:- Polling failed
          LogManager.Instance.error('Error while fetching VWO settings with polling');
        });
    }, pollingInterval * 1000); // converting seconds to milliseconds
  }
}
