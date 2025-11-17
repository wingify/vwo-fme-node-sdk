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
import { dynamic } from './types/Common';

import { ILogManager, LogManager } from './packages/logger';
import { NetworkManager } from './packages/network-layer';
import { SegmentationManager } from './packages/segmentation-evaluator';

import { Storage } from './packages/storage';

import { IVWOClient, VWOClient } from './VWOClient';
import { SettingsService } from './services/SettingsService';

import { DebugLogMessagesEnum, InfoLogMessagesEnum } from './enums/log-messages';
import { IVWOOptions } from './models/VWOOptionsModel';
import { isNumber } from './utils/DataTypeUtil';
import { cloneObject, getFormattedErrorMessage } from './utils/FunctionUtil';
import { buildMessage } from './utils/LogMessageUtil';
import { Deferred } from './utils/PromiseUtil';
import { setSettingsAndAddCampaignsToRules } from './utils/SettingsUtil';
import { getRandomUUID } from './utils/UuidUtil';
import { BatchEventsQueue } from './services/BatchEventsQueue';
import { BatchEventsDispatcher } from './utils/BatchEventsDispatcher';
import { UsageStatsUtil } from './utils/UsageStatsUtil';
import { Constants } from './constants';
import { ApiEnum } from './enums/ApiEnum';

export interface IVWOBuilder {
  settings: Record<any, any>; // Holds the configuration settings for the VWO client
  storage: Storage; // Interface for storage management
  logManager: ILogManager; // Manages logging across the VWO SDK
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
  setSegmentation(): this; // Configures the segmentation evaluator with provided options
  initUsageStats(): this; // Initializes usage statistics for the SDK
}

export class VWOBuilder implements IVWOBuilder {
  readonly sdkKey: string;
  readonly options: IVWOOptions;

  private settingFileManager: SettingsService;

  settings: Record<any, any>;
  storage: Storage;
  logManager: ILogManager;
  originalSettings: dynamic = {};
  isSettingsFetchInProgress: boolean;
  vwoInstance: IVWOClient;
  batchEventsQueue: BatchEventsQueue;
  private isValidPollIntervalPassedFromInit: boolean = false;
  isSettingsValid: boolean = false;
  settingsFetchTime: number | undefined = undefined;

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
    networkInstance.attachClient(this.options?.network?.client, this.options?.retryConfig);

    LogManager.Instance.debug(
      buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
        service: `Network Layer`,
      }),
    );
    // Set the development mode based on options
    networkInstance.getConfig().setDevelopmentMode(this.options?.isDevelopmentMode);

    return this;
  }

  initBatching(): this {
    if (this.options.batchEventData) {
      if (this.settingFileManager.isGatewayServiceProvided) {
        LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.GATEWAY_AND_BATCH_EVENTS_CONFIG_MISMATCH));
        return this;
      }
      if (
        (!isNumber(this.options.batchEventData.eventsPerRequest) ||
          this.options.batchEventData.eventsPerRequest <= 0) &&
        (!isNumber(this.options.batchEventData.requestTimeInterval) ||
          this.options.batchEventData.requestTimeInterval <= 0)
      ) {
        LogManager.Instance.errorLog('INVALID_BATCH_EVENTS_CONFIG', {}, { an: ApiEnum.INIT });
        return this;
      }
      this.batchEventsQueue = new BatchEventsQueue(
        Object.assign({}, this.options.batchEventData, {
          dispatcher: (
            events: Record<string, any>[],
            callback: (error: Error | null, data: Record<string, any>) => void,
          ) =>
            BatchEventsDispatcher.dispatch(
              {
                ev: events,
              },
              callback,
              Object.assign(
                {},
                {
                  a: this.options.accountId,
                  env: this.options.sdkKey,
                  sn: Constants.SDK_NAME,
                  sv: Constants.SDK_VERSION,
                },
              ),
            ),
        }),
      );
      this.batchEventsQueue.flushAndClearTimer.bind(this.batchEventsQueue);
    }
    return this;
  }

  /**
   * Sets the segmentation evaluator with the provided segmentation options.
   * @returns {this} The instance of this builder.
   */
  setSegmentation(): this {
    SegmentationManager.Instance.attachEvaluator(this.options?.segmentation);
    LogManager.Instance.debug(
      buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
        service: `Segmentation Evaluator`,
      }),
    );
    return this;
  }

  /**
   * Fetches settings asynchronously, ensuring no parallel fetches.
   * @param {boolean} [force=false] - Force fetch ignoring cache.
   * @returns {Promise<SettingsModel>} A promise that resolves to the fetched settings.
   */
  fetchSettings(force?: boolean): Promise<Record<any, any>> {
    const deferredObject = new Deferred();

    // Check if a fetch operation is already in progress
    if (!this.isSettingsFetchInProgress) {
      this.isSettingsFetchInProgress = true;
      this.settingFileManager.getSettings(force).then((settings: Record<any, any>) => {
        this.isSettingsValid = this.settingFileManager.isSettingsValid;
        this.settingsFetchTime = this.settingFileManager.settingsFetchTime;
        // if force is false, update original settings, if true the request is from polling and no need to update original settings
        if (!force) {
          this.originalSettings = settings;
        }

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
   * @param {boolean} [force=false] - Force fetch ignoring cache.
   * @returns {Promise<SettingsModel>} A promise that resolves to the settings.
   */
  getSettings(force?: boolean): Promise<Record<any, any>> {
    const deferredObject = new Deferred();

    try {
      // Use cached settings if available and not forced to fetch
      if (!force && this.settings) {
        LogManager.Instance.info('Using already fetched and cached settings');
        deferredObject.resolve(this.settings);
      } else {
        // Fetch settings if not cached or forced
        this.fetchSettings(force).then((settings: Record<any, any>) => {
          deferredObject.resolve(settings);
        });
      }
    } catch (err) {
      LogManager.Instance.errorLog(
        'ERROR_FETCHING_SETTINGS',
        {
          err: getFormattedErrorMessage(err),
        },
        { an: force ? Constants.POLLING : ApiEnum.INIT },
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
      this.storage = Storage.Instance.attachConnector(this.options.storage);
    } else if (typeof process === 'undefined' && typeof window !== 'undefined' && window.localStorage) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BrowserStorageConnector } = require('./packages/storage/connectors/BrowserStorageConnector');
      // Pass clientStorage config to BrowserStorageConnector
      this.storage = Storage.Instance.attachConnector(
        new BrowserStorageConnector({
          ...this.options.clientStorage,
          alwaysUseCachedSettings: this.options.clientStorage?.alwaysUseCachedSettings,
          ttl: this.options.clientStorage?.ttl,
        }),
      );
      LogManager.Instance.debug(
        buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
          service: this.options?.clientStorage?.provider === sessionStorage ? `Session Storage` : `Local Storage`,
        }),
      );
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
  setSettingsService(): this {
    this.settingFileManager = new SettingsService(this.options);

    return this;
  }

  /**
   * Sets the logger with the provided logger options.
   * @returns {this} The instance of this builder.
   */
  setLogger(): this {
    this.logManager = new LogManager(this.options.logger || {});

    LogManager.Instance.debug(
      buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
        service: `Logger`,
      }),
    );
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
      LogManager.Instance.debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );

      return getRandomUUID(this.options.sdkKey);
    } catch (err) {
      LogManager.Instance.errorLog('EXECUTION_FAILED', {
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
      LogManager.Instance.errorLog(
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
   * Initializes usage statistics for the SDK.
   * @returns {this} The instance of this builder.
   */
  initUsageStats(): this {
    if (this.options.isUsageStatsDisabled) {
      return this;
    }
    UsageStatsUtil.getInstance().setUsageStats(this.options);
    return this;
  }

  /**
   * Builds a new VWOClient instance with the provided settings.
   * @param {SettingsModel} settings - The settings for the VWOClient.
   * @returns {VWOClient} The new VWOClient instance.
   */
  build(settings: Record<any, any>): IVWOClient {
    this.vwoInstance = new VWOClient(settings, this.options);
    this.updatePollIntervalAndCheckAndPoll(settings, true);
    return this.vwoInstance;
  }

  /**
   * Checks and polls for settings updates at the provided interval.
   */
  checkAndPoll(): void {
    const poll = async () => {
      try {
        const latestSettings = await this.getSettings(true);
        if (
          latestSettings &&
          Object.keys(latestSettings).length > 0 &&
          JSON.stringify(latestSettings) !== JSON.stringify(this.originalSettings)
        ) {
          this.originalSettings = latestSettings;
          const clonedSettings = cloneObject(latestSettings);

          LogManager.Instance.info(InfoLogMessagesEnum.POLLING_SET_SETTINGS);
          setSettingsAndAddCampaignsToRules(clonedSettings, this.vwoInstance);

          // Reinitialize the poll_interval value if there is a change in settings
          this.updatePollIntervalAndCheckAndPoll(latestSettings, false);
        } else if (latestSettings) {
          LogManager.Instance.info(InfoLogMessagesEnum.POLLING_NO_CHANGE_IN_SETTINGS);
        }
      } catch (ex) {
        LogManager.Instance.errorLog(
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
      LogManager.Instance.debug(
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
