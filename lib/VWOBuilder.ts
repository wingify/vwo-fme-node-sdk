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
import { dynamic } from './types/Common';

import { LogManager } from './packages/logger';
import { NetworkManager } from './packages/network-layer';

import { Storage } from './packages/storage';

import { IVWOClient, VWOClient } from './VWOClient';
import { SettingsService } from './services/SettingsService';

import { DebugLogMessagesEnum, InfoLogMessagesEnum } from './enums/log-messages';
import { IVWOOptions } from './models/VWOOptionsModel';
import { isEmptyObject, isNumber } from './utils/DataTypeUtil';
import { cloneObject, getFormattedErrorMessage } from './utils/FunctionUtil';
import { buildMessage } from './utils/LogMessageUtil';
import { Deferred } from './utils/PromiseUtil';
import { getRandomUUID } from './utils/UuidUtil';
import { BatchEventsQueue } from './services/BatchEventsQueue';
import { Constants } from './constants';
import { ApiEnum } from './enums/ApiEnum';
import { EdgeConfigModel } from './models/edge/EdgeConfigModel';
import { ServiceContainer } from './services/ServiceContainer';

export interface IVWOBuilder {
  settings: Record<any, any>; // Holds the configuration settings for the VWO client
  storage: Storage; // Interface for storage management
  logManager: LogManager; // Manages logging across the VWO SDK
  isSettingsFetchInProgress: boolean; // Flag to check if settings fetch is in progress
  vwoInstance: IVWOClient;

  build(settings: Record<any, any>): IVWOClient; // Builds and returns a new VWOClient instance

  fetchSettings(): Promise<Record<any, any>>; // Asynchronously fetches settings from the server
  setSettingsService(): this; // Sets up the settings manager with provided options
  getSettings(force: boolean): Promise<Record<any, any>>; // Fetches settings, optionally forcing a refresh
  setStorage(): this; // Sets up the storage connector based on provided options
  setNetworkManager(): this; // Configures the network manager with client and mode
  // initBatching(): this; // Initializes event batching with provided configuration
  // setAnalyticsCallback(): this; // Configures the analytics callback based on provided options
  initPolling(): this; // Sets up polling for settings at a specified interval
  setLogger(): this; // Sets up the logger with specified options
}

export class VWOBuilder implements IVWOBuilder {
  readonly sdkKey: string;
  readonly options: IVWOOptions;

  private settingFileManager: SettingsService;

  settings: Record<any, any>;
  storage: Storage;
  logManager: LogManager;
  originalSettings: dynamic = {};
  isSettingsFetchInProgress: boolean;
  vwoInstance: IVWOClient;
  batchEventsQueue: BatchEventsQueue;
  private isValidPollIntervalPassedFromInit: boolean = false;
  isSettingsValid: boolean = false;
  settingsFetchTime: number | undefined = undefined;
  networkManager: NetworkManager;
  defaultServiceContainer: ServiceContainer;

  constructor(options: IVWOOptions) {
    this.options = options;
    this.defaultServiceContainer = new ServiceContainer(this.options);
  }

  /**
   * Sets the network manager with the provided client and development mode options.
   * @returns {this} The instance of this builder.
   */
  setNetworkManager(): this {
    if (this.options.edgeConfig && !isEmptyObject(this.options?.edgeConfig)) {
      this.options.shouldWaitForTrackingCalls = true;
    }
    this.networkManager = new NetworkManager(this.logManager, this.options?.network?.client, this.options?.retryConfig);

    this.logManager.debug(
      buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
        service: `Network Layer`,
      }),
    );
    this.defaultServiceContainer.setNetworkManager(this.networkManager);
    return this;
  }

  initBatching(): this {
    // If edge config is provided, set the batch event data to the default values
    if (this.options.edgeConfig && !isEmptyObject(this.options?.edgeConfig)) {
      const edgeConfigModel = new EdgeConfigModel().modelFromDictionary(this.options.edgeConfig);
      this.options.batchEventData = {
        eventsPerRequest: edgeConfigModel.getMaxEventsToBatch(),
        isEdgeEnvironment: true,
      };
    }
    if (this.options.batchEventData) {
      if (this.settingFileManager.isGatewayServiceProvided) {
        this.logManager.info(buildMessage(InfoLogMessagesEnum.GATEWAY_AND_BATCH_EVENTS_CONFIG_MISMATCH));
      } else {
        if (
          (!isNumber(this.options.batchEventData.eventsPerRequest) ||
            this.options.batchEventData.eventsPerRequest <= 0) &&
          (!isNumber(this.options.batchEventData.requestTimeInterval) ||
            this.options.batchEventData.requestTimeInterval <= 0)
        ) {
          this.logManager.errorLog('INVALID_BATCH_EVENTS_CONFIG', {}, { an: ApiEnum.INIT });
        } else {
          this.options.batchEventData.accountId = parseInt(this.options.accountId);
          this.batchEventsQueue = new BatchEventsQueue(Object.assign({}, this.options.batchEventData), this.logManager);
          this.batchEventsQueue.flushAndClearTimer.bind(this.batchEventsQueue);
        }
      }
    }
    this.defaultServiceContainer.setBatchEventsQueue(this.batchEventsQueue);
    this.defaultServiceContainer.injectServiceContainer(this.defaultServiceContainer);
    return this;
  }

  /**
   * Fetches settings asynchronously, ensuring no parallel fetches.
   * @returns {Promise<SettingsModel>} A promise that resolves to the fetched settings.
   */
  fetchSettings(): Promise<Record<any, any>> {
    const deferredObject = new Deferred();

    // Check if a fetch operation is already in progress
    if (!this.isSettingsFetchInProgress) {
      this.isSettingsFetchInProgress = true;
      this.settingFileManager.getSettings().then((settings: Record<any, any>) => {
        this.isSettingsValid = this.settingFileManager.isSettingsValid;
        this.settingsFetchTime = this.settingFileManager.settingsFetchTime;
        this.isSettingsFetchInProgress = false;
        deferredObject.resolve(settings);
      });

      return deferredObject.promise;
    } else {
      deferredObject.resolve(this.originalSettings);
      return deferredObject.promise;
    }
  }

  /**
   * Gets the settings, fetching them if not cached or if forced.
   * @returns {Promise<SettingsModel>} A promise that resolves to the settings.
   */
  getSettings(): Promise<Record<any, any>> {
    const deferredObject = new Deferred();

    try {
      // Use cached settings if available and not forced to fetch
      if (this.settings) {
        this.logManager.info('Using already fetched and cached settings');
        deferredObject.resolve(this.settings);
      } else {
        // Fetch settings if not cached
        this.fetchSettings().then((settings: Record<any, any>) => {
          deferredObject.resolve(settings);
        });
      }
    } catch (err) {
      this.logManager.errorLog(
        'ERROR_FETCHING_SETTINGS',
        {
          err: getFormattedErrorMessage(err),
        },
        { an: ApiEnum.INIT },
        false,
      );
      deferredObject.resolve({});
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
      this.storage = new Storage(this.options.storage);
      this.settingFileManager.isStorageServiceProvided = true;
    } else if (typeof process === 'undefined' && typeof window !== 'undefined' && window.localStorage) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BrowserStorageConnector } = require('./packages/storage/connectors/BrowserStorageConnector');
      // create accountId and sdkKey hash and use it as key for storage
      const encodedSdkKey = btoa(this.options.sdkKey);
      const defaultStorageKey = `${Constants.PRODUCT_NAME}_${this.options.accountId}_${encodedSdkKey}`;
      // Pass clientStorage config to BrowserStorageConnector
      this.storage = new Storage(
        new BrowserStorageConnector(
          {
            ...this.options.clientStorage,
            alwaysUseCachedSettings: this.options.clientStorage?.alwaysUseCachedSettings,
            ttl: this.options.clientStorage?.ttl,
          },
          defaultStorageKey,
          this.logManager,
        ),
      );
      this.logManager.debug(
        buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
          service: this.options?.clientStorage?.provider === sessionStorage ? `Session Storage` : `Local Storage`,
        }),
      );
      this.settingFileManager.isStorageServiceProvided = true;
    } else {
      // Set storage to null if no storage options provided
      this.storage = null;
    }
    this.defaultServiceContainer.setStorage(this.storage);
    return this;
  }

  /**
   * Sets the settings manager with the provided options.
   * @returns {this} The instance of this builder.
   */
  setSettingsService(): this {
    this.settingFileManager = new SettingsService(this.options, this.logManager);
    this.defaultServiceContainer.setSettingsService(this.settingFileManager);
    return this;
  }

  /**
   * Returns the logger.
   * @returns {LogManager} The logger.
   */
  getLogger(): LogManager {
    return this.logManager;
  }

  /**
   * Returns the settings manager.
   * @returns {SettingsService} The settings manager.
   */
  getSettingsService(): SettingsService {
    return this.settingFileManager;
  }

  /**
   * Returns the storage.
   * @returns {Storage} The storage.
   */
  getStorage(): Storage {
    return this.storage;
  }

  /**
   * Sets the logger with the provided logger options.
   * @returns {this} The instance of this builder.
   */
  setLogger(): this {
    this.logManager = new LogManager(this.options.logger || {});

    this.logManager.debug(
      buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
        service: `Logger`,
      }),
    );
    this.defaultServiceContainer.setLogManager(this.logManager);
    return this;
  }

  /**
   * Sets the analytics callback with the provided analytics options.
   * @returns {this} The instance of this builder.
   */
  /* setAnalyticsCallback(): this {
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
  } */

  /**
   * Generates a random user ID based on the provided API key.
   * @returns {string} The generated random user ID.
   */
  getRandomUserId(): string {
    const apiName = 'getRandomUserId';
    try {
      this.logManager.debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );

      return getRandomUUID(this.options.sdkKey);
    } catch (err) {
      this.logManager.errorLog('EXECUTION_FAILED', {
        apiName,
        err: getFormattedErrorMessage(err),
      });
    }
  }

  /**
   * Initializes the batching with the provided batch events options.
   * @returns {this} The instance of this builder.
   */
  /* initBatching(): this {
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

    // BatchEventsQueue.Instance.setBatchConfig(this.options.batchEvents, this.options.sdkKey); // TODO

    return this;
  } */

  /**
   * Initializes the polling with the provided poll interval.
   * @returns {this} The instance of this builder.
   */
  initPolling(): this {
    const pollInterval = this.options.pollInterval;

    if (pollInterval != null && isNumber(pollInterval) && pollInterval >= 1000) {
      this.isValidPollIntervalPassedFromInit = true;
      this.checkAndPoll();
    } else if (pollInterval != null) {
      this.logManager.errorLog(
        'INVALID_POLLING_CONFIGURATION',
        {
          key: 'pollInterval',
          correctType: 'number >= 1000',
        },
        { an: ApiEnum.INIT },
      );
    }
    return this;
  }

  /**
   * Builds a new VWOClient instance with the provided settings.
   * @param {SettingsModel} settings - The settings for the VWOClient.
   * @returns {VWOClient} The new VWOClient instance.
   */
  build(settings: Record<any, any>): IVWOClient {
    this.originalSettings = settings;
    this.vwoInstance = new VWOClient(settings, this.options, this.defaultServiceContainer);
    this.updatePollIntervalAndCheckAndPoll(settings, true);
    return this.vwoInstance;
  }

  /**
   * Checks and polls for settings updates at the provided interval.
   */
  checkAndPoll(): void {
    const poll = async () => {
      try {
        const latestSettings = await this.getSettings();
        if (
          latestSettings &&
          Object.keys(latestSettings).length > 0 &&
          JSON.stringify(latestSettings) !== JSON.stringify(this.originalSettings)
        ) {
          this.originalSettings = latestSettings;
          const clonedSettings = cloneObject(latestSettings);

          this.logManager.info(InfoLogMessagesEnum.POLLING_SET_SETTINGS);
          this.vwoInstance.updateSettings(clonedSettings, false);

          // Reinitialize the poll_interval value if there is a change in settings
          this.updatePollIntervalAndCheckAndPoll(latestSettings, false);
        } else if (latestSettings) {
          this.logManager.info(InfoLogMessagesEnum.POLLING_NO_CHANGE_IN_SETTINGS);
        }
      } catch (ex) {
        this.logManager.errorLog(
          'ERROR_FETCHING_SETTINGS_WITH_POLLING',
          {
            err: getFormattedErrorMessage(ex),
          },
          { an: Constants.POLLING },
        );
      } finally {
        // Schedule next poll
        const interval = this.options.pollInterval ?? Constants.POLLING_INTERVAL;
        setTimeout(poll, interval);
      }
    };

    // Start the polling after the given interval
    const interval = this.options.pollInterval ?? Constants.POLLING_INTERVAL;
    setTimeout(poll, interval);
  }

  private updatePollIntervalAndCheckAndPoll(settings: Record<any, any>, shouldCheckAndPoll: boolean) {
    if (!this.isValidPollIntervalPassedFromInit) {
      const pollInterval = settings?.pollInterval ?? Constants.POLLING_INTERVAL;
      this.logManager.debug(
        buildMessage(DebugLogMessagesEnum.USING_POLL_INTERVAL_FROM_SETTINGS, {
          source: settings?.pollInterval ? 'settings' : 'default',
          pollInterval: pollInterval.toString(),
        }),
      );
      this.options.pollInterval = pollInterval;
    }
    if (shouldCheckAndPoll && !this.isValidPollIntervalPassedFromInit) {
      this.checkAndPoll();
    }
  }
}
