import { dynamic } from './types/common';

import { SegmentationManager } from './modules/segmentor';
import { NetworkManager } from './modules/networking';
import { LogManager } from './modules/logger';

import { Storage } from './modules/storage';

import { SettingsManager } from './services/SettingsManager';
import { VWOClient } from './VWOClient';
import { processSettings } from './utils/SettingsUtil';
import { SettingsModel } from './models/SettingsModel';
// import { BatchEventsQueue } from './services/batchEventsQueue';
// import { DimensionModel } from './types/types';
import { Constants } from './constants';
// import { AnalyticsEvent } from './services/analyticsEvent';

import { Deferred } from './utils/PromiseUtil';
// import { getRandomUUID } from './utils/UuidUtil';
import { cloneObject } from './utils/FunctionUtil';
import { isObject, isBoolean, isNumber, isFunction } from './utils/DataTypeUtil' ;


interface IVWOBuilder {
  settings: SettingsModel;
  storage: Storage;
  logManager: LogManager;
  isSettingsFetchInProgress: boolean;

  build(settings: SettingsModel): VWOClient;

  fetchSettings(): Promise<Record<string, dynamic>>;
  setSettingsManager(): this;
  setSettings(settings: Record<string, dynamic>): void;
  getSettings(force: boolean): Promise<dynamic>;
  setStorage(): this;
  setNetworkManager(): this;
  initBatching(): this;
  initPolling(): this;
  setAnalyticsCallback(): this;
  setLogger(): this;
  setSegmentation(): this;
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

  constructor(options: Record<string, dynamic>) {
    this.options = options;
  }

  setNetworkManager(): this {
    const networkInstance = NetworkManager.Instance;
    networkInstance.attachClient(this.options?.network?.client);
    networkInstance.getConfig().setDevelopmentMode(this.options?.isDevelopmentMode);
    return this;
  }

  setSegmentation(): this {
    SegmentationManager.Instance.attachEvaluator(this.options?.segmentation);
    return this;
  }

  fetchSettings(force?: boolean): Promise<Record<string, dynamic>> {
    const deferredObject = new Deferred();

    // If one call is in progress, wait for it to complete and use the response
    if (!this.isSettingsFetchInProgress) {
      this.isSettingsFetchInProgress = true;
      this.settingFileManager.getSettings(force).then((settings: Record<string, dynamic>) => {
        this.originalSettings = settings;

        this.isSettingsFetchInProgress = false;
        deferredObject.resolve(settings);
      });

      return deferredObject.promise;
    } else {
      // DO not send multiple calls in parallel to fetch settings
      return this.fetchSettings(force);
    }
  }

  setSettings(settings: Record<string, any> | string): void {
    LogManager.Instance.debug('API - setSettings called');
    this.originalSettings = settings;
    this.settings = cloneObject(settings);
    this.settings = processSettings(this.settings);
  }

  getSettings(force?: boolean): Promise<Record<string, dynamic>> {
    const deferredObject = new Deferred();

    if (!force && this.settings) {
      LogManager.Instance.info('Using already fetched and cached settings');
      deferredObject.resolve(this.settings);
    } else {
      this.fetchSettings(force).then((settings: Record<string, dynamic>) => {
        deferredObject.resolve(settings);
      });
    }
    return deferredObject.promise;
  }

  setStorage(): this {
    let storageConfig: any = {
      name: 'memory',
      config: {
        maxKeys: 20
      }
    };

    if (this.options.storage) {
      storageConfig = this.options.storage;
    }

    this.storage = Storage.Instance.attachConnector(storageConfig);

    return this;
  }

  setSettingsManager(): this {
    this.settingFileManager = new SettingsManager(this.options);

    return this;
  }

  setLogger(): this {
    this.logManager = new LogManager(
      this.options.logger || {
        defaultTransport: true,
        level: 'debug'
      }
    );
    return this;
  }

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

  build(settings): VWOClient {
    return new VWOClient(settings);
  }

  checkAndPoll(pollingInterval: number): void {
    setInterval(() => {
      this.getSettings(true)
        .then((latestSettingsFile: Record<string, dynamic>) => {
          const lastSettingsFile = JSON.stringify(this.originalSettings);
          const stringifiedLatestSettingsFile = JSON.stringify(latestSettingsFile);
          if (stringifiedLatestSettingsFile !== lastSettingsFile) {
            this.originalSettings = latestSettingsFile;
            const clonedSettings = cloneObject(latestSettingsFile);
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
