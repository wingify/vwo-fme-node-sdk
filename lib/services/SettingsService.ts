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
import { dynamic } from '../types/Common';
import { Storage } from '../packages/storage';
import { LogManager } from '../packages/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../packages/network-layer';

import { Deferred } from '../utils/PromiseUtil';

import { Constants } from '../constants';
import { HTTPS_PROTOCOL, HTTP_PROTOCOL } from '../constants/Url';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { DebugLogMessagesEnum, ErrorLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { SettingsSchema } from '../models/schemas/SettingsSchemaValidation';
import { buildMessage } from '../utils/LogMessageUtil';
import { getSettingsPath } from '../utils/NetworkUtil';

interface ISettingsService {
  sdkKey: string;

  getSettings(forceFetch: boolean): Promise<Record<any, any>>;

  fetchSettings(): Promise<Record<any, any>>;
}

export class SettingsService implements ISettingsService {
  sdkKey: string;
  accountId: number;
  expiry: number;
  networkTimeout: number;
  hostname: string;
  port: number;
  protocol: string;
  isGatewayServiceProvided: boolean = false;
  settingsFetchTime: number | undefined = undefined; //time taken to fetch the settings
  private static instance: SettingsService;
  isSettingsValid: boolean = false;
  proxyProvided: boolean = false;
  gatewayServiceConfig: {
    hostname: string | null;
    protocol: string | null;
    port: number | null;
  } = {
    hostname: null,
    protocol: null,
    port: null,
  };

  constructor(options: Record<string, any>) {
    this.sdkKey = options.sdkKey;
    this.accountId = options.accountId;
    this.expiry = options?.settings?.expiry || Constants.SETTINGS_EXPIRY;
    this.networkTimeout = options?.settings?.timeout || Constants.SETTINGS_TIMEOUT;

    // if sdk is running in browser environment then set isGatewayServiceProvided to true
    // when gatewayService is not provided then we dont update the url and let it point to dacdn by default
    // Check if sdk running in browser and not in edge/serverless environment
    if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
      this.isGatewayServiceProvided = true;
      // Handle proxyUrl for browser environment
      if (options?.proxyUrl) {
        this.proxyProvided = true;
        let parsedUrl;
        if (options.proxyUrl.startsWith(HTTP_PROTOCOL) || options.proxyUrl.startsWith(HTTPS_PROTOCOL)) {
          parsedUrl = new URL(`${options.proxyUrl}`);
        } else {
          parsedUrl = new URL(`${HTTPS_PROTOCOL}${options.proxyUrl}`);
        }
        this.hostname = parsedUrl.hostname;
        this.protocol = parsedUrl.protocol.replace(':', '');
        if (parsedUrl.port) {
          this.port = parseInt(parsedUrl.port);
        }
      }
    }
    //if gateway is provided and proxy is not provided then only we will replace the hostname, protocol and port
    if (options?.gatewayService?.url) {
      let parsedUrl;
      this.isGatewayServiceProvided = true;
      if (
        options.gatewayService.url.startsWith(HTTP_PROTOCOL) ||
        options.gatewayService.url.startsWith(HTTPS_PROTOCOL)
      ) {
        parsedUrl = new URL(`${options.gatewayService.url}`);
      } else if (options.gatewayService?.protocol) {
        parsedUrl = new URL(`${options.gatewayService.protocol}://${options.gatewayService.url}`);
      } else {
        parsedUrl = new URL(`${HTTPS_PROTOCOL}${options.gatewayService.url}`);
      }

      // dont replace the hostname, protocol and port if proxy is provided
      if (!this.proxyProvided) {
        this.hostname = parsedUrl.hostname;
        this.protocol = parsedUrl.protocol.replace(':', '');
        if (parsedUrl.port) {
          this.port = parseInt(parsedUrl.port);
        } else if (options.gatewayService?.port) {
          this.port = options.gatewayService.port;
        }
      } else {
        this.gatewayServiceConfig.hostname = parsedUrl.hostname;
        this.gatewayServiceConfig.protocol = parsedUrl.protocol.replace(':', '');
        if (parsedUrl.port) {
          this.gatewayServiceConfig.port = parseInt(parsedUrl.port);
        } else if (options.gatewayService?.port) {
          this.gatewayServiceConfig.port = options.gatewayService.port;
        }
      }
    } else {
      if (!this.proxyProvided) {
        this.hostname = Constants.HOST_NAME;
      }
    }

    // if (this.expiry > 0) {
    //   this.setSettingsExpiry();
    // }
    LogManager.Instance.debug(
      buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
        service: 'Settings Manager',
      }),
    );
    SettingsService.instance = this;
  }

  static get Instance(): SettingsService {
    return SettingsService.instance;
  }

  private setSettingsExpiry() {
    const settingsTimeout = setTimeout(() => {
      this.fetchSettingsAndCacheInStorage().then(() => {
        clearTimeout(settingsTimeout);
        // again set the timer
        // NOTE: setInterval could be used but it will not consider the time required to fetch settings
        // This breaks the timer rythm and also sends more call than required
        this.setSettingsExpiry();
      });
    }, this.expiry);
  }

  private async normalizeSettings(settings: Record<any, any>): Promise<Record<any, any>> {
    const normalizedSettings = { ...settings };
    if (!normalizedSettings.features || Object.keys(normalizedSettings.features).length === 0) {
      normalizedSettings.features = [];
    }
    if (!normalizedSettings.campaigns || Object.keys(normalizedSettings.campaigns).length === 0) {
      normalizedSettings.campaigns = [];
    }
    return normalizedSettings;
  }

  private async handleBrowserEnvironment(
    storageConnector: any,
    deferredObject: { resolve: (value: any) => void; reject: (reason?: any) => void },
  ): Promise<void> {
    try {
      const cachedSettings = await storageConnector.getSettingsFromStorage(this.sdkKey, this.accountId);

      if (cachedSettings) {
        LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_FETCH_FROM_CACHE));
        deferredObject.resolve(cachedSettings);
      } else {
        LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_CACHE_MISS));
      }

      const freshSettings = await this.fetchSettings();
      const normalizedSettings = await this.normalizeSettings(freshSettings);
      // set the settings in storage only if settings are valid
      this.isSettingsValid = new SettingsSchema().isSettingsValid(normalizedSettings);
      if (this.isSettingsValid) {
        await storageConnector.setSettingsInStorage(normalizedSettings);
      }

      if (cachedSettings) {
        LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_BACKGROUND_UPDATE));
      } else {
        LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
        deferredObject.resolve(normalizedSettings);
      }
    } catch (error) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
          err: JSON.stringify(error),
        }),
      );
      deferredObject.resolve(null);
    }
  }

  private async handleServerEnvironment(deferredObject: {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }): Promise<void> {
    try {
      const settings = await this.fetchSettings();
      const normalizedSettings = await this.normalizeSettings(settings);
      deferredObject.resolve(normalizedSettings);
    } catch (error) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
          err: JSON.stringify(error),
        }),
      );
      deferredObject.resolve(null);
    }
  }

  private fetchSettingsAndCacheInStorage(): Promise<Record<any, any>> {
    const deferredObject = new Deferred();
    const storageConnector = Storage.Instance.getConnector();

    if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
      this.handleBrowserEnvironment(storageConnector, deferredObject);
    } else {
      this.handleServerEnvironment(deferredObject);
    }

    return deferredObject.promise;
  }

  fetchSettings(isViaWebhook = false): Promise<Record<any, any>> {
    const deferredObject = new Deferred();

    if (!this.sdkKey || !this.accountId) {
      deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
    }

    const networkInstance = NetworkManager.Instance;
    const options: Record<string, dynamic> = getSettingsPath(this.sdkKey, this.accountId);
    const retryConfig = networkInstance.getRetryConfig();

    options.platform = Constants.PLATFORM;
    options.sn = Constants.SDK_NAME;
    options.sv = Constants.SDK_VERSION;
    options['api-version'] = Constants.API_VERSION;

    if (!networkInstance.getConfig().getDevelopmentMode()) {
      options.s = 'prod';
    }

    let path = Constants.SETTINGS_ENDPOINT;
    if (isViaWebhook) {
      path = Constants.WEBHOOK_SETTINGS_ENDPOINT;
    }

    try {
      //record the current timestamp
      const startTime = Date.now();
      const request: RequestModel = new RequestModel(
        this.hostname,
        HttpMethodEnum.GET,
        path,
        options,
        null,
        null,
        this.protocol,
        this.port,
        retryConfig,
      );
      request.setTimeout(this.networkTimeout);

      networkInstance
        .get(request)
        .then((response: ResponseModel) => {
          //record the timestamp when the response is received
          this.settingsFetchTime = Date.now() - startTime;
          deferredObject.resolve(response.getData());
        })
        .catch((err: ResponseModel) => {
          deferredObject.reject(err);
        });

      return deferredObject.promise;
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
          err: JSON.stringify(err),
        }),
      );

      deferredObject.reject(err);
      return deferredObject.promise;
    }
  }

  getSettings(forceFetch = false): Promise<Record<any, any>> {
    const deferredObject = new Deferred();

    if (forceFetch) {
      this.fetchSettingsAndCacheInStorage().then((settings: Record<any, any>) => {
        deferredObject.resolve(settings);
      });
    } else {
      // const storageConnector = Storage.Instance.getConnector();

      // if (storageConnector) {
      //   storageConnector
      //     .get(Constants.SETTINGS)
      //     .then((storedSettings: dynamic) => {
      //       if (!isObject(storedSettings)) {
      //         this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
      //           const isSettingsValid = new SettingsSchema().isSettingsValid(fetchedSettings);
      //           if (isSettingsValid) {
      //             deferredObject.resolve(fetchedSettings);
      //           } else {
      //             deferredObject.reject(new Error('Settings are not valid. Failed schema validation.'));
      //           }
      //         });
      //       } else {
      //         deferredObject.resolve(storedSettings);
      //       }
      //     })
      //     .catch(() => {
      //       this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
      //         deferredObject.resolve(fetchedSettings);
      //       });
      //     });
      // } else {
      this.fetchSettingsAndCacheInStorage().then((fetchedSettings: Record<any, any>) => {
        const isSettingsValid = new SettingsSchema().isSettingsValid(fetchedSettings);
        this.isSettingsValid = isSettingsValid;
        if (this.isSettingsValid) {
          LogManager.Instance.info(InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
          deferredObject.resolve(fetchedSettings);
        } else {
          LogManager.Instance.error(ErrorLogMessagesEnum.SETTINGS_SCHEMA_INVALID);

          deferredObject.resolve({});
        }
      });
    }

    return deferredObject.promise;
  }
}
