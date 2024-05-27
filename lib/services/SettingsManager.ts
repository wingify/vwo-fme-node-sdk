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
import { dynamic } from '../types/Common';

import { LogManager } from '../packages/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../packages/network-layer';

import { Deferred } from '../utils/PromiseUtil';

import { Constants } from '../constants';
import { DebugLogMessagesEnum, ErrorLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { SettingsSchema } from '../models/schemas/SettingsSchemaValidation';
import { SettingsModel } from '../models/settings/SettingsModel';
import { buildMessage } from '../utils/LogMessageUtil';
import { getSettingsPath } from '../utils/NetworkUtil';

interface ISettingsManager {
  sdkKey: string;

  getSettings(forceFetch: boolean): Promise<dynamic>;

  fetchSettings(): Promise<dynamic>;
}

export class SettingsManager implements ISettingsManager {
  sdkKey: string;
  accountId: number;
  expiry: number;
  networkTimeout: number;
  hostname: string;
  port: number;
  protocol: string;
  isGatewayServiceProvided: boolean = false;
  private static instance: SettingsManager;

  constructor(options: Record<string, any>) {
    this.sdkKey = options.sdkKey;
    this.accountId = options.accountId;
    this.expiry = options?.settings?.expiry || Constants.SETTINGS_EXPIRY;
    this.networkTimeout = options?.settings?.timeout || Constants.SETTINGS_TIMEOUT;

    if (options?.gatewayService?.url) {
      let parsedUrl;
      this.isGatewayServiceProvided = true;
      if (options.gatewayService.url.startsWith('http://') || options.gatewayService.url.startsWith('https://')) {
        parsedUrl = new URL(`${options.gatewayService.url}`);
      } else if (options.gatewayService?.protocol) {
        parsedUrl = new URL(`${options.gatewayService.protocol}://${options.gatewayService.url}`);
      } else {
        parsedUrl = new URL(`https://${options.gatewayService.url}`);
      }
      this.hostname = parsedUrl.hostname;
      this.protocol = parsedUrl.protocol.replace(':', '');
      if (parsedUrl.port) {
        this.port = parseInt(parsedUrl.port);
      } else if (options.gatewayService?.port) {
        this.port = options.gatewayService.port;
      }
    } else {
      this.hostname = Constants.HOST_NAME;
    }

    // if (this.expiry > 0) {
    //   this.setSettingsExpiry();
    // }
    LogManager.Instance.debug(
      buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
        service: 'Settings Manager',
      }),
    );
    SettingsManager.instance = this;
  }

  static get Instance(): SettingsManager {
    return SettingsManager.instance;
  }

  private setSettingsExpiry() {
    const settingsTimeout = setTimeout(() => {
      this.fetchSettingsAndCacheInStorage(true).then(() => {
        clearTimeout(settingsTimeout);
        // again set the timer
        // NOTE: setInterval could be used but it will not consider the time required to fetch settings
        // This breaks the timer rythm and also sends more call than required
        this.setSettingsExpiry();
      });
    }, this.expiry);
  }

  private fetchSettingsAndCacheInStorage(update = false) {
    const deferredObject = new Deferred();
    // const storageConnector = Storage.Instance.getConnector();

    this.fetchSettings()
      .then(async (res) => {
        // LogManager.Instance.info('Settings fetched successfully');

        // const method = update ? 'update' : 'set';

        // storageConnector[method](Constants.SETTINGS, res).then(() => {
        //   LogManager.Instance.info('Settings persisted in cache: memory');
        //   deferredObject.resolve(res);
        // });
        deferredObject.resolve(res);
      })
      .catch((err) => {
        LogManager.Instance.error(
          buildMessage(ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
            err: JSON.stringify(err),
          }),
        );

        deferredObject.resolve(null);
      });

    return deferredObject.promise;
  }

  fetchSettings(): Promise<SettingsModel> {
    const deferredObject = new Deferred();

    if (!this.sdkKey || !this.accountId) {
      deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
    }

    const networkInstance = NetworkManager.Instance;
    const options: Record<string, dynamic> = getSettingsPath(this.sdkKey, this.accountId);
    options.platform = 'server';
    options['api-version'] = 1;
    if (!networkInstance.getConfig().getDevelopmentMode()) {
      options.s = 'prod';
    }
    try {
      const request: RequestModel = new RequestModel(
        this.hostname,
        'GET',
        Constants.SETTINTS_ENDPOINT,
        options,
        null,
        null,
        this.protocol,
        this.port,
      );
      request.setTimeout(this.networkTimeout);

      networkInstance
        .get(request)
        .then((response: ResponseModel) => {
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

  getSettings(forceFetch = false): Promise<SettingsModel> {
    const deferredObject = new Deferred();

    if (forceFetch) {
      this.fetchSettingsAndCacheInStorage().then((settings) => {
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
      this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
        const isSettingsValid = new SettingsSchema().isSettingsValid(fetchedSettings);
        if (isSettingsValid) {
          LogManager.Instance.info(InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);

          deferredObject.resolve(fetchedSettings);
        } else {
          LogManager.Instance.error(ErrorLogMessagesEnum.SETTINGS_SCHEMA_INVALID);

          deferredObject.resolve({});
        }
      });
      // }
    }

    return deferredObject.promise;
  }
}
