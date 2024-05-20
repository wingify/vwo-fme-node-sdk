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
import { LogManager } from './packages/logger';
import { Storage } from './packages/storage';

import { FlagApi } from './api/GetFlag';
import { SetAttributeApi } from './api/SetAttribute';
import { TrackApi } from './api/TrackEvent';

import { DebugLogMessageEnum } from './enums/log-messages/DebugLogMessageEnum';
import { SettingsModel } from './models/settings/SettingsModel';

import { ErrorLogMessageEnum } from './enums/log-messages/ErrorLogMessageEnum';
import { dynamic } from './types/Common';
// import { BatchEventsQueue } from './services/batchEventsQueue';

import { SettingsSchema } from './models/schemas/SettingsSchemaValidation';
import { ContextModel } from './models/user/ContextModel';
import HooksManager from './services/HooksManager';
import UrlService from './services/UrlService';
import { setVariationAllocation } from './utils/CampaignUtil';
import { getType, isObject, isString } from './utils/DataTypeUtil';
import { addLinkedCampaignsToSettings } from './utils/FunctionUtil';
import { buildMessage } from './utils/LogMessageUtil';
import { Deferred } from './utils/PromiseUtil';

export interface IVWOClient {
  readonly options?: any;
  settings: SettingsModel;
  // onceReady(): Promise<Record<string, dynamic>>;

  // getSettings(force: boolean): SettingsModel | Promise<SettingsModel>;
  getFlag(featureKey: string, context: Record<string, any>): Record<any, any>;
  trackEvent(eventName: string, eventProperties: Record<string, dynamic>, context:  Record<string, any>): Promise<Record<string, boolean>>;
  setAttribute(attributeKey: string, attributeValue: string, context:  Record<string, any>): void
}

export class VWOClient implements IVWOClient {
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  storage: Storage;

  constructor(
    settings: SettingsModel,
    options: any
  ) {
    this.options = options;
    this.settings = new SettingsModel(settings);
    this.originalSettings = settings;

    UrlService.init({
      collectionPrefix: this.settings.getCollectionPrefix(),
      gatewayServiceUrl: options?.gatewayService?.url,
      gatewayServicePort: parseInt(options?.gatewayService?.port),
    });

    // Optimize loop by avoiding multiple calls to `getCampaigns()`
    const campaigns = this.settings.getCampaigns();
    campaigns.forEach((campaign, index) => {
      setVariationAllocation(campaign);
      campaigns[index] = campaign;
    });
    addLinkedCampaignsToSettings(this.settings);
    LogManager.Instance.info('VWO Client initialized');
    return this;
  }
  options?: Record<string, any>;
  /**
   * Retrieves the value of a feature flag for a given feature key and context.
   * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
   *
   * @param {string} featureKey - The key of the feature to retrieve.
   * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
   * @returns {Promise<Record<any, any>>} - A promise that resolves to the feature flag value.
   */
  getFlag(featureKey: string, context: Record<string, any>): Record<any, any> {
    const apiName = 'getFlag';
    const deferredObject = new Deferred();
    const errorReturnSchema = {
      isEnabled: (): boolean => false,
      getVariables: (): Array<Record<string, dynamic>> => [],
      getVariable: (_key: string, defaultValue: any): dynamic => defaultValue
    };

    try {
      const hookManager = new HooksManager(this.options);
      const contextModel = new ContextModel().modelFromDictionary(context);

      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      // Validate featureKey is a string
      if (!isString(featureKey)) {
        LogManager.Instance.error(
          `featureKey passed to ${apiName} API is not of valid type. Got ${getType(featureKey)}`,
        );
        throw new TypeError('TypeError: featureKey should be a string');
      }

      // Validate settings are loaded and valid
      if (!new SettingsSchema().isSettingsValid(this.originalSettings)) {
        LogManager.Instance.error(`Settings are not valid. Contact VWO Support.`);
        throw new Error('TypeError: Invalid Settings');
      }

      // Validate user ID is present in context
      if (!contextModel?.getId()) {
        LogManager.Instance.error(`Context doesn't have a valid User ID.`);
        throw new Error('TypeError: Invalid context');
      }

      new FlagApi()
        .get(featureKey, this.settings, contextModel, hookManager)
        .then((data: any) => {
          deferredObject.resolve(data);
        })
        .catch((_err: any) => {
          deferredObject.resolve(errorReturnSchema);
        })
    } catch (err) {
      LogManager.Instance.info(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );

      deferredObject.resolve(errorReturnSchema);
    }

    return deferredObject.promise;
  }

  /**
   * Tracks an event with specified properties and context.
   * This method validates the types of the inputs and ensures the settings and user context are valid before proceeding.
   *
   * @param {string} eventName - The name of the event to track.
   * @param {Record<string, dynamic>} eventProperties - The properties associated with the event.
   * @param {ContextModel} context - The context in which the event is being tracked, must include a valid user ID.
   * @returns {Promise<Record<string, boolean>>} - A promise that resolves to the result of the tracking operation.
   */
  trackEvent(
    eventName: string,
    eventProperties: Record<string, dynamic> = {},
    context:  Record<string, any>,
  ): Promise<Record<string, boolean>> {
    const apiName = 'trackEvent';
    const deferredObject = new Deferred();

    try {
      const contextModel = new ContextModel().modelFromDictionary(context);
      const hookManager = new HooksManager(this.options);

      // Log the API call
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      // Validate eventName is a string
      if (!isString(eventName)) {
        LogManager.Instance.error(`eventName passed to track API is not of valid type. Got ${getType(eventName)}`);
        throw new TypeError('TypeError: Event-name should be a string');
      }

      // Validate eventProperties is an object
      if (!isObject(eventProperties)) {
        LogManager.Instance.error(
          `eventProperties passed to track API is not of valid type. Got ${getType(eventProperties)}`,
        );
        throw new TypeError('TypeError: eventProperties should be an object');
      }

      // Validate settings are loaded and valid
      if (!new SettingsSchema().isSettingsValid(this.originalSettings)) {
        LogManager.Instance.error(`Settings are not valid. Contact VWO Support.`);
        throw new Error('TypeError: Invalid Settings');
      }

      // Validate user ID is present in context
      if (!contextModel?.getId()) {
        LogManager.Instance.error(`Context doesn't have a valid User ID.`);
        throw new Error('TypeError: Invalid context');
      }

      // Proceed with tracking the event
      new TrackApi().track(this.settings, eventName, eventProperties, contextModel, hookManager).then(data => {
        deferredObject.resolve(data);
      }).catch((_err: any) => {
        deferredObject.resolve({[eventName]: false});
      });
    } catch (err) {
      // Log any errors encountered during the operation
      LogManager.Instance.info(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );

      deferredObject.resolve({[eventName]: false});
    }

    return deferredObject.promise;
  }

  /**
   * Sets an attribute for a user in the context provided.
   * This method validates the types of the inputs before proceeding with the API call.
   *
   * @param {string} attributeKey - The key of the attribute to set.
   * @param {string} attributeValue - The value of the attribute to set.
   * @param {ContextModel} context - The context in which the attribute should be set, must include a valid user ID.
   */
  setAttribute(attributeKey: string, attributeValue: string, context:  Record<string, any>): void {
    const apiName = 'setAttribute';

    try {
      // Log the API call
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      const contextModel = new ContextModel().modelFromDictionary(context);

      // Validate attributeKey is a string
      if (!isString(attributeKey)) {
        LogManager.Instance.error(`attributeKey passed to track API is not of valid type. Got ${getType(attributeKey)}`);
        throw new TypeError('TypeError: attributeKey should be a string');
      }
      // Validate attributeValue is a string
      if (!isString(attributeValue)) {
        LogManager.Instance.error(`attributeValue passed to track API is not of valid type. Got ${getType(attributeValue)}`);
        throw new TypeError('TypeError: attributeValue should be a string');
      }

      // Validate user ID is present in context
      if (!contextModel?.getId()) {
        LogManager.Instance.error(`Context doesn't have a valid User ID.`);
        throw new Error('TypeError: Invalid context');
      }

      // Proceed with setting the attribute if validation is successful
      new SetAttributeApi().setAttribute(this.settings, attributeKey, attributeValue, contextModel);
    } catch (err) {
      // Log any errors encountered during the operation
      LogManager.Instance.info(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );
    }
  }
}
