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
import { LogManager } from './modules/logger';
import { Storage } from './modules/storage';

import { FlagApi } from './api/GetFlag';
import { SetAttributeApi } from './api/SetAttribute';
import { TrackApi } from './api/TrackEvent';

import { DebugLogMessageEnum } from './enums/log-messages/DebugLogMessageEnum';
import { SettingsModel } from './models/settings/SettingsModel';

import { ErrorLogMessageEnum } from './enums/log-messages/ErrorLogMessageEnum';
import { dynamic } from './types/Common';
// import { BatchEventsQueue } from './services/batchEventsQueue';

import HooksManager from './services/HooksManager';
import UrlService from './services/UrlService';
import { setVariationAllocation } from './utils/CampaignUtil';
import { getType, isObject, isString } from './utils/DataTypeUtil';
import { addLinkedCampaignsToSettings } from './utils/FunctionUtil';
import { buildMessage } from './utils/LogMessageUtil';
import { Deferred } from './utils/PromiseUtil';
import { ContextModel } from './models/user/ContextModel';

interface IVWOClient {
  readonly options?: any;
  settings: SettingsModel;

  getFlag(featureKey: string, context: ContextModel): Record<any, any>;
  trackEvent(eventName: string, eventProperties: Record<string, dynamic>, context: ContextModel): Promise<Record<string, boolean>>;
  setAttribute(attributeKey: string, attributeValue: string, context: ContextModel): void
}

export class VWOClient implements IVWOClient {
  settings: SettingsModel;
  storage: Storage;

  constructor(
    settings: SettingsModel,
    options: any
  ) {
    this.options = options;
    this.settings = new SettingsModel(settings);
    UrlService.init({
      collectionPrefix: this.settings.getCollectionPrefix(),
      gatewayServiceUrl: options?.gatewayService?.url,
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
  getFlag(featureKey: string, context: ContextModel): Record<any, any> {
    const apiName = 'getFlag';
    const deferredObject = new Deferred();
    const hookManager = new HooksManager(this.options);
    const contextModel = new ContextModel().modelFromDictionary(context);
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

      if (!contextModel?.getId()) {
        LogManager.Instance.error('User ID is not valid. Not able to get flag');
        throw new Error('Invalid context');
      }

      new FlagApi().get(featureKey, this.settings, contextModel, hookManager).then((data: any) => {
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
    context: ContextModel,
  ): Promise<Record<string, boolean>> {
    const apiName = 'trackEvent';
    const hookManager = new HooksManager(this.options);
    const contextModel = new ContextModel().modelFromDictionary(context);
    try {
      // Log the API call
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      // Validate eventName is a string
      if (!isString(eventName)) {
        LogManager.Instance.debug(`eventName passed to track API is not of valid type. Got ${getType(eventName)}`);
        throw new TypeError('TypeError: eventName should be a string');
      }

      // Validate eventProperties is an object
      if (!isObject(eventProperties)) {
        LogManager.Instance.debug(
          `eventProperties passed to track API is not of valid type. Got ${getType(eventProperties)}`,
        );
        // throw new TypeError('TypeError: eventProperties should be an object');
      }

      // Validate settings are loaded and valid
      if (!this.settings) {
        // || !new SettingsSchema().isSettingsValid(this.settings)) {
        LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
        throw new Error('Invalid Settings');
      }

      // Validate user ID is present in context
      if (!contextModel?.getId()) {
        LogManager.Instance.error('User ID is not valid. Not able to track event');
        throw new Error('Invalid context');
      }

      // Proceed with tracking the event
      return new TrackApi().track(this.settings, eventName, eventProperties, contextModel, hookManager);
    } catch (err) {
      // Log any errors encountered during the operation
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );
    }
  }

  /**
   * Sets an attribute for a user in the context provided.
   * This method validates the types of the inputs before proceeding with the API call.
   *
   * @param {string} attributeKey - The key of the attribute to set.
   * @param {string} attributeValue - The value of the attribute to set.
   * @param {ContextModel} context - The context in which the attribute should be set, must include a valid user ID.
   */
  setAttribute(attributeKey: string, attributeValue: string, context: ContextModel): void {
    const contextModel = new ContextModel().modelFromDictionary(context);
    // Validate that attributeKey, attributeValue, and user ID in context are all strings
    if (!isString(attributeKey) || !isString(attributeValue) || !isString(contextModel?.getId())) {
      LogManager.Instance.error(
        `Parameters passed to setAttribute API are not valid. Please check`,
      );

      return; // Exit if validation fails
    }
    // Proceed with setting the attribute if validation is successful
    new SetAttributeApi().setAttribute(this.settings, attributeKey, attributeValue, contextModel);
  }
}
