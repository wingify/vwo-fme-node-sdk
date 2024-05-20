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
import { VWOBuilder } from './VWOBuilder';
import { IVWOClient } from './VWOClient';
import { IVWOOptions } from './models/VWOOptionsModel';
import { SettingsModel } from './models/settings/SettingsModel';
import { dynamic } from './types/Common';
import { isObject, isString } from './utils/DataTypeUtil';
import { Deferred } from './utils/PromiseUtil';

import { ErrorLogMessageEnum } from './enums/log-messages/ErrorLogMessageEnum';
import { LogLevelEnum } from './packages/logger/enums/LogLevelEnum';
import { Connector } from './packages/storage/Connector';
import { buildMessage } from './utils/LogMessageUtil';

export { LogLevelEnum, Connector as StorageConnector };

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
      .setLogger()           // Sets up logging for debugging and monitoring.
      .setSettingsManager()  // Sets the settings manager for configuration management.
      .setStorage()          // Configures storage for data persistence.
      .setNetworkManager()   // Configures network management for API communication.
      .setSegmentation()     // Sets up segmentation for targeted functionality.
      // .initBatching()        // Initializes batching for bulk data processing.
      .initPolling()         // Starts polling mechanism for regular updates.
      // .setAnalyticsCallback() // Sets up analytics callback for data analysis.

    return this.vwoBuilder.getSettings().then((settings: SettingsModel) => {
      return this.vwoBuilder.build(settings); // Builds the VWO instance with the fetched settings.
    })
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

export async function init(options: IVWOOptions): Promise<IVWOClient>{
  const apiName = 'init';

  try {
    if (!isObject(options)) {
      console.error(`[ERROR]: VWO-SDK ${(new Date().toISOString())} Options should be of type object`); // Ensures options is an object.
    }

    if (!options?.sdkKey || !isString(options?.sdkKey)) {
      console.error(`[ERROR]: VWO-SDK ${(new Date().toISOString())} Please provide the sdkKey in the options and should be a of type string`); // Validates sdkKey presence and type.
    }

    if (!options.accountId) {
      console.error(`[ERROR]: VWO-SDK ${(new Date().toISOString())} Please provide VWO account ID in the options and should be a of type string|number`); // Validates accountId presence and type.
    }

    const instance: any = new VWO(options); // Creates a new VWO instance with the validated options.

    _global = {
      vwoInitDeferred: new Deferred(),
      isSettingsFetched: false,
      instance: null
    };

    return instance.then((_vwoInstance) => {
      _global.isSettingsFetched = true;
      _global.instance = _vwoInstance;
      _global.vwoInitDeferred.resolve(_vwoInstance);
      console.log('onReady resolved from init')
      return _vwoInstance;
    });
  } catch (err) {
    const msg = buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
      apiName,
      err
    });

    console.info(`[INFO]: VWO-SDK ${(new Date().toISOString())} ${msg}`);
  }
}

export async function onReady() {
  const apiName = 'onReady';

  try {
    _global.vwoInitDeferred = new Deferred();

    // If settings are already fetched, resolve the promise
    if (_global.isSettingsFetched) {
      console.info(`[INFO]: VWO-SDK ${(new Date().toISOString())} onReady already resolved`);
      _global.vwoInitDeferred.resolve(_global.instance);
    } else {
      // wait for five seconds, else reject the promise
      setTimeout(() => {
        console.error(`[INFO]: VWO-SDK ${(new Date().toISOString())} VWO settings could not be fetched`);
        _global.vwoInitDeferred.reject(new Error('VWO settings could not be fetched'));
      }, 5000);
    }

    return _global.vwoInitDeferred.promise;
  } catch (err) {
    const msg = buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
      apiName,
      err
    });

    console.info(`[INFO]: VWO-SDK ${(new Date().toISOString())} ${msg}`);
  }
}
