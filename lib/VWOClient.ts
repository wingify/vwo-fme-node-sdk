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
// import { processSettings } from './utils/settingsUtil';
import { LogManager } from './modules/logger';
import { Storage } from './modules/storage';

import { FlagApi } from './api/GetFlag';
import { SetAttributeApi } from './api/SetAttribute';
import { TrackApi } from './api/TrackEvent';

// import { VWOBuilder } from './VWOBuilder';
import { DebugLogMessageEnum } from './enums/log-messages/DebugLogMessageEnum';
import { SettingsModel } from './models/SettingsModel';

import { ErrorLogMessageEnum } from './enums/log-messages/ErrorLogMessageEnum';
import { dynamic } from './types/Common';
// import { BatchEventsQueue } from './services/batchEventsQueue';

import HooksManager from './services/HooksManager';
import UrlService from './services/UrlService';
import { setVariationAllocation } from './utils/CampaignUtil';
import { getType, isObject, isString } from './utils/DataTypeUtil';
import { addLInkedCampaignsToSettings } from './utils/FunctionUtil';
import { buildMessage } from './utils/LogMessageUtil';
import { Deferred } from './utils/PromiseUtil';

interface IVWOClient {
  // readonly apiKey: string;
  readonly options?: any;
  settings: SettingsModel;
  // vwoProvider: VWOBuilder;

  // onceReady(): Promise<Record<string, dynamic>>;

  // getSettings(force: boolean): SettingsModel | Promise<SettingsModel>;

  getFlag(featureKey: string, context: any): Record<any, any>;
  // getVariable(featureKey: string, variableSpecifier: dynamic, key?: string): Promise<VariableModel>;
  // getVariables(featureKey: string): Promise<Array<VariableModel>>;
  trackEvent(eventName: string, eventProperties: Record<string, dynamic>, context: any): Promise<Record<string, boolean>>;
  setAttribute(attributeKey: string, attributeValue: string, context: any): void
}

export class VWOClient implements IVWOClient {
  // readonly apiKey: string;

  settings: SettingsModel;
  storage: Storage;

  constructor(
    settings: SettingsModel,
    options: any
    // userId: string,
    // properties: Record<string, dynamic>,
    // dimensions: DimensionModel
  ) {
    // this.vwoProvider = vwoProvider;

    // LogManager.Instance.debug(`VWO Client initialized with userId:${userId}`);
    this.options = options;
    this.settings = new SettingsModel(settings);
    UrlService.init({
      collectionPrefix: this.settings.getCollectionPrefix(),
      webServiceUrl: options?.webService?.url,
    });
    for (let i = 0; i < this.settings.getCampaigns().length; i++) {
      let campaign = this.settings.getCampaigns()[i];
      setVariationAllocation(campaign);
      this.settings.getCampaigns()[i] = campaign;
    }
    addLInkedCampaignsToSettings(this.settings);
    LogManager.Instance.info('VWO Client initialized');
    return this;
  }
  options?: Record<string, any>;

  /* onceReady(): Promise<SettingsModel> {
    try {
      const deferredObject = new Deferred();

      this.vwoProvider.getSettings(false).then(settings => {
        this.settings = cloneObject(settings);
        this.settings = processSettings(this.settings);

        LogManager.Instance.info('VWO Client ready for use');

        deferredObject.resolve(settings);
      });

      return deferredObject.promise;
    } catch (err) {
      LogManager.Instance.error('VWO Client failed to be ready');
    }
  } */

  /* setSettings(settings: Record<string, dynamic>): void {
    const apiName = 'setSettings';

    try {
      if (!isObject(settings)) {
        LogManager.Instance.debug(`settings passed to setSettings API is not of valid type. Got ${getType(settings)}`);
        throw new TypeError('TypeError: settings should be an object');
      }

      this.vwoProvider.setSettings(settings);
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err
        })
      );
    }
  } */

  /* getSettings(force = false): Promise<SettingsModel> {
    const apiName = 'getSettings';
    const deferredObject = new Deferred();

    try {
      if (!isBoolean(force)) {
        LogManager.Instance.debug(`force passed to getSettings API is not of valid type. Got ${getType(force)}`);
        throw new TypeError('TypeError: force should be a boolean');
      }

      this.vwoProvider.getSettings(force).then(() => {
        deferredObject.resolve(this.vwoProvider.originalSettings);
      });
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err
        })
      );

      deferredObject.resolve(null);
    }
    return deferredObject.promise;
  } */

  getFlag(featureKey: string, context: any): Record<any, any> {
    const apiName = 'getFlag';
    const deferredObject = new Deferred();
    const hookManager = new HooksManager(this.options);
    try {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      if (!isString(featureKey)) {
        LogManager.Instance.debug(
          `featureKey passed to ${apiName} API is not of valid type. Got ${getType(featureKey)}`,
        );
        throw new TypeError('TypeError: variableSpecifier should be a string');
      }

      if (!this.settings) {
        //|| !new SettingsSchema().isSettingsValid(this.settings)) {
        LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
        throw new Error('Invalid Settings');
      }

      if (!context?.user?.id) {
        LogManager.Instance.error('User ID is not valid. Not able to get flag');
        throw new Error('Invalid context');
      }

      new FlagApi().get(featureKey, this.settings, context, hookManager).then((data: any) => {
        deferredObject.resolve(data);
      });

      return deferredObject.promise;
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );

      return deferredObject.resolve({});
    }
  }

  // getVariable(variableSpecifier: dynamic, key?: string, featureKey = ''): Promise<VariableModel> {
  //   const apiName = 'getVariable';
  //   const deferredObject = new Deferred();

  //   try {
  //     LogManager.Instance.debug(
  //       buildMessage(DebugLogMessageEnum.API_CALLED, {
  //         apiName,
  //       }),
  //     );

  //     if (!(isString(variableSpecifier) || isNumber(variableSpecifier))) {
  //       LogManager.Instance.debug(
  //         `variableSpecifier passed to getVariable API is not of valid type. Got ${getType(variableSpecifier)}`,
  //       );
  //       throw new TypeError('TypeError: variableSpecifier should be a string|number');
  //     }

  //     if (!this.settings || !new SettingsSchema().isSettingsValid(this.settings)) {
  //       LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
  //       throw new Error('Invalid Settings');
  //     }

  //     // new VariableApi()
  //     //   .get(featureKey, variableSpecifier, key || null, this.settings, this.user.getUser())
  //     //   .then((variable: VariableModel) => {
  //     //     deferredObject.resolve(variable);
  //     //   });

  //     return deferredObject.promise;
  //   } catch (err) {
  //     LogManager.Instance.error(
  //       buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
  //         apiName,
  //         err,
  //       }),
  //     );

  //     return deferredObject.resolve(null);
  //   }
  // }

  // getVariables(featureKey = ''): Promise<Array<VariableModel>> {
  //   const apiName = 'getVariables';
  //   const deferredObject = new Deferred();

  //   try {
  //     LogManager.Instance.debug(
  //       buildMessage(DebugLogMessageEnum.API_CALLED, {
  //         apiName,
  //       }),
  //     );

  //     if (!this.settings || !new SettingsSchema().isSettingsValid(this.settings)) {
  //       LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
  //       throw new Error('Invalid Settings');
  //     }

  //     // new VariableApi().getAll(featureKey, this.settings, this.user.getUser()).then(variableList => {
  //     //   deferredObject.resolve(variableList);
  //     // });

  //     return deferredObject.promise;
  //   } catch (err) {
  //     LogManager.Instance.error(
  //       buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
  //         apiName,
  //         err,
  //       }),
  //     );

  //     return deferredObject.resolve([]);
  //   }
  // }

  trackEvent(
    eventName: string,
    eventProperties: Record<string, dynamic> = {},
    context: any,
  ): Promise<Record<string, boolean>> {
    const apiName = 'trackEvent';
    const hookManager = new HooksManager(this.options);
    try {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      if (!isString(eventName)) {
        LogManager.Instance.debug(`eventName passed to track API is not of valid type. Got ${getType(eventName)}`);
        throw new TypeError('TypeError: eventName should be a string');
      }

      if (!isObject(eventProperties)) {
        LogManager.Instance.debug(
          `eventProperties passed to track API is not of valid type. Got ${getType(eventProperties)}`,
        );
        // throw new TypeError('TypeError: eventProperties should be an object');
      }

      if (!this.settings) {
        // || !new SettingsSchema().isSettingsValid(this.settings)) {
        LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
        throw new Error('Invalid Settings');
      }
      if (!context?.user?.id) {
        LogManager.Instance.error('User ID is not valid. Not able to track event');
        throw new Error('Invalid context');
      }

      return new TrackApi().track(this.settings, eventName, eventProperties, context, hookManager);
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );
    }
  }

  setAttribute(attributeKey: string, attributeValue: string, context: any): void {
    if (!isString(attributeKey) || !isString(attributeValue) || !isString(context?.user?.id)) {
      LogManager.Instance.error(
        `Parameters passed to setAttribute API are not valid. Please check`,
      );

      return;
    }
    new SetAttributeApi().setAttribute(this.settings, attributeKey, attributeValue, context);
  }
}
