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
import { VWOBuilder } from './VWOBuilder';
import { IVWOClient } from './VWOClient';
import { IVWOOptions } from './models/VWOOptionsModel';
import { dynamic } from './types/Common';
import { isObject, isString } from './utils/DataTypeUtil';
import { Deferred } from './utils/PromiseUtil';

import { InfoLogMessagesEnum, ErrorLogMessagesEnum } from './enums/log-messages';
import { buildMessage } from './utils/LogMessageUtil';
import { PlatformEnum } from './enums/PlatformEnum';
import { ApiEnum } from './enums/ApiEnum';

export class VWO {
  private static vwoBuilder: VWOBuilder;
  private static instance: dynamic;

  /**
   * Constructor for the VWO class.
   * Initializes a new instance of VWO with the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for the VWO instance.
   * @returns The instance of VWO.
   */
  constructor(options: IVWOOptions) {
    return VWO.setInstance(options);
  }

  /**
   * Sets the singleton instance of VWO.
   * Configures and builds the VWO instance using the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for setting up VWO.
   * @returns A Promise resolving to the configured VWO instance.
   */
  private static setInstance(options: IVWOOptions): Promise<IVWOClient> {
    const optionsVWOBuilder: any = options?.vwoBuilder;
    this.vwoBuilder = optionsVWOBuilder || new VWOBuilder(options);

    this.instance = this.vwoBuilder
      .setLogger() // Sets up logging for debugging and monitoring.
      .setSettingsService() // Sets the settings service for configuration management.
      .setStorage() // Configures storage for data persistence.
      .setNetworkManager() // Configures network management for API communication.
      .setSegmentation() // Sets up segmentation for targeted functionality.
      // .initBatching()        // Initializes batching for bulk data processing.
      .initPolling() // Starts polling mechanism for regular updates.
      .initBatching()
      .initUsageStats(); // Initializes usage statistics for the SDK.
    // .setAnalyticsCallback() // Sets up analytics callback for data analysis.

    if (options?.settings) {
      return Promise.resolve(this.vwoBuilder.build(options.settings));
    }

    return this.vwoBuilder.getSettings().then((settings: Record<any, any>) => {
      return this.vwoBuilder.build(settings); // Builds the VWO instance with the fetched settings.
    });
  }

  /**
   * Gets the singleton instance of VWO.
   * @returns The singleton instance of VWO.
   */
  static get Instance(): dynamic {
    return this.instance;
  }
}

let _global: Record<string, any> = {};
/**
 * Initializes a new instance of VWO with the provided options.
 * @param options Configuration options for the VWO instance.
 * @property {string} sdkKey - The SDK key for the VWO account.
 * @property {string} accountId - The account ID for the VWO account.
 * @property {GatewayServiceModel} gatewayService - The gateway service configuration.
 * @property {StorageService} storage - The storage configuration.
 * @returns
 */

export async function init(options: IVWOOptions): Promise<IVWOClient> {
  const apiName = ApiEnum.INIT;
  const date = new Date().toISOString();

  try {
    if (!isObject(options)) {
      const msg = buildMessage(ErrorLogMessagesEnum.INIT_OPTIONS_ERROR, {
        date,
      });
      console.error(msg); // Ensures options is an object.
    }

    if (!options?.sdkKey || !isString(options?.sdkKey)) {
      const msg = buildMessage(ErrorLogMessagesEnum.INIT_OPTIONS_SDK_KEY_ERROR, {
        date,
      });
      console.error(msg); // Validates sdkKey presence and type.
    }

    if (!options.accountId) {
      const msg = buildMessage(ErrorLogMessagesEnum.INIT_OPTIONS_ACCOUNT_ID_ERROR, {
        date,
      });
      console.error(msg); // Validates accountId presence and type.
    }

    if (typeof process.env === 'undefined') {
      options.platform = PlatformEnum.CLIENT;
    } else {
      options.platform = PlatformEnum.SERVER;
    }

    const instance: any = new VWO(options); // Creates a new VWO instance with the validated options.

    _global = {
      vwoInitDeferred: new Deferred(),
      isSettingsFetched: false,
      instance: null,
    };

    return instance.then((_vwoInstance) => {
      _global.isSettingsFetched = true;
      _global.instance = _vwoInstance;
      _global.vwoInitDeferred.resolve(_vwoInstance);

      return _vwoInstance;
    });
  } catch (err) {
    const msg = buildMessage(ErrorLogMessagesEnum.API_THROW_ERROR, {
      apiName,
      err,
    });

    console.info(`[INFO]: VWO-SDK ${new Date().toISOString()} ${msg}`);
  }
}

export async function onInit() {
  const apiName = ApiEnum.ON_INIT;

  try {
    _global.vwoInitDeferred = new Deferred();
    const date = new Date().toISOString();

    // If settings are already fetched, resolve the promise
    if (_global.isSettingsFetched) {
      const msg = buildMessage(InfoLogMessagesEnum.ON_INIT_ALREADY_RESOLVED, {
        date,
        apiName,
      });

      console.info(msg);
      _global.vwoInitDeferred.resolve(_global.instance);
    } else {
      // wait for five seconds, else reject the promise
      setTimeout(() => {
        if (_global.isSettingsFetched) {
          return;
        }

        const msg = buildMessage(InfoLogMessagesEnum.ON_INIT_SETTINGS_FAILED, {
          date,
        });

        console.error(msg);
        _global.vwoInitDeferred.reject(new Error('VWO settings could not be fetched'));
      }, 5000);
    }

    return _global.vwoInitDeferred.promise;
  } catch (err) {
    const msg = buildMessage(ErrorLogMessagesEnum.API_THROW_ERROR, {
      apiName,
      err,
    });

    console.info(`[INFO]: VWO-SDK ${new Date().toISOString()} ${msg}`);
  }
}
