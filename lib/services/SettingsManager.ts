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

import { LogManager } from '../modules/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../modules/networking';

import { Deferred } from '../utils/PromiseUtil';

import { Constants } from '../constants';
import { SettingsModel } from '../models/SettingsModel';
import { NetworkUtil } from '../utils/NetworkUtil';

interface ISettingsManager {
  sdkKey: string;

  getSettings(forceFetch: boolean): Promise<dynamic>;

  fetchSettings(): Promise<dynamic>;
}

export class SettingsManager implements ISettingsManager {
  sdkKey: string;
  accountId: any;
  expiry: number;
  networkTimeout: number;
  settingsUrl: string;
  settingsPort: number;

  constructor(options: Record<string, any>) {
    this.sdkKey = options.sdkKey;
    this.accountId = options.accountId;
    this.expiry = options?.settings?.expiry || Constants.SETTINGS_EXPIRY;
    this.networkTimeout = options?.settings?.timeout || Constants.SETTINGS_TIMEOUT;

    if (options?.webService?.url) {
      const parsedUrl = new URL(`https://${options.webService.url}`);
      this.settingsUrl = parsedUrl.hostname;
      this.settingsPort = parseInt(parsedUrl.port);
    } else {
      this.settingsUrl = Constants.HOST_NAME;
    }

    // if (this.expiry > 0) {
    //   this.setSettingsExpiry();
    // }
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
        LogManager.Instance.info('Settings fetched successfully');

        // const method = update ? 'update' : 'set';

        // storageConnector[method](Constants.SETTINGS, res).then(() => {
        //   LogManager.Instance.info('Settings persisted in cache: memory');
        //   deferredObject.resolve(res);
        // });
        deferredObject.resolve(res);
      })
      .catch((err) => {
        LogManager.Instance.error(`Settings could not be fetched: ${err}`);
        deferredObject.resolve(null);
      });

    return deferredObject.promise;
  }

  fetchSettings(): Promise<SettingsModel> {
    const deferredObject = new Deferred();

    if (!this.sdkKey || !this.accountId) {
      // console.error('AccountId and sdkKey are required for fetching account settings. Aborting!');
      LogManager.Instance.error('sdkKey is required for fetching account settings. Aborting!');
      deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
    }

    const networkInstance = NetworkManager.Instance;
    const options: Record<string, dynamic> = new NetworkUtil().getSettingsPath(this.sdkKey, this.accountId);
    options.platform = 'server';
    options['api-version'] = 1;
    if (!networkInstance.getConfig().getDevelopmentMode()) {
      options.s = 'prod';
    }
    try {
      const request: RequestModel = new RequestModel(
        this.settingsUrl,
        'GET',
        Constants.SETTINTS_ENDPOINT,
        options,
        null,
        null,
        null,
        this.settingsPort,
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
      console.error('Error occurred while fetching settings:', err);
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
      this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
        deferredObject.resolve(fetchedSettings);
      });
      // const storageConnector = Storage.Instance.getConnector();

      // storageConnector
      //   .get(Constants.SETTINGS)
      //   .then((storedSettings: dynamic) => {
      //     if (!isObject(storedSettings)) {
      //       this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
      //         deferredObject.resolve(fetchedSettings);
      //       });
      //     } else {
      //       deferredObject.resolve(storedSettings);
      //     }
      //   })
      //   .catch(() => {
      //     this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
      //       deferredObject.resolve(fetchedSettings);
      //     });
      //   });
    }

    return deferredObject.promise;
  }
}
