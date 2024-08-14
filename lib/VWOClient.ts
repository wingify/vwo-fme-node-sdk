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

import { Flag, FlagApi } from './api/GetFlag';
import { SetAttributeApi } from './api/SetAttribute';
import { TrackApi } from './api/TrackEvent';

import { DebugLogMessagesEnum, ErrorLogMessagesEnum, InfoLogMessagesEnum } from './enums/log-messages';
import { SettingsModel } from './models/settings/SettingsModel';

import { dynamic } from './types/Common';
import { SettingsSchema } from './models/schemas/SettingsSchemaValidation';
import { ContextModel } from './models/user/ContextModel';
import HooksService from './services/HooksService';
import { UrlUtil } from './utils/UrlUtil';

import { getType, isBoolean, isNumber, isObject, isString } from './utils/DataTypeUtil';

import { buildMessage } from './utils/LogMessageUtil';
import { Deferred } from './utils/PromiseUtil';

import { IVWOOptions } from './models/VWOOptionsModel';
import { setSettingsAndAddCampaignsToRules } from './utils/SettingsUtil';
import { VariationModel } from './models/campaign/VariationModel';

export interface IVWOClient {
  readonly options?: IVWOOptions;
  settings: SettingsModel;

  getFlag(featureKey: string, context: Record<string, any>): Promise<Flag>;
  trackEvent(
    eventName: string,
    context: Record<string, any>,
    eventProperties: Record<string, dynamic>,
  ): Promise<Record<string, boolean>>;

  setAttribute(attributeKey: string, attributeValue: boolean | string | number, context: Record<string, any>): void;
}

export class VWOClient implements IVWOClient {
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  storage: Storage;

  constructor(settings: SettingsModel, options: IVWOOptions) {
    this.options = options;

    setSettingsAndAddCampaignsToRules(settings, this);

    UrlUtil.init({
      collectionPrefix: this.settings.getCollectionPrefix(),
    });

    LogManager.Instance.info(InfoLogMessagesEnum.CLIENT_INITIALIZED);
    return this;
  }

  options?: IVWOOptions;

  /**
   * Retrieves the value of a feature flag for a given feature key and context.
   * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
   *
   * @param {string} featureKey - The key of the feature to retrieve.
   * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
   * @returns {Promise<Flag>} - A promise that resolves to the feature flag value.
   */
  getFlag(featureKey: string, context: Record<string, any>): Promise<Flag> {
    const apiName = 'getFlag';
    const deferredObject = new Deferred();
    const errorReturnSchema = new Flag(false, new VariationModel());

    try {
      const hooksService = new HooksService(this.options);

      LogManager.Instance.debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );

      // Validate featureKey is a string
      if (!isString(featureKey)) {
        LogManager.Instance.error(
          buildMessage(ErrorLogMessagesEnum.API_INVALID_PARAM, {
            apiName,
            key: 'featureKey',
            type: getType(featureKey),
            correctType: 'string',
          }),
        );

        throw new TypeError('TypeError: featureKey should be a string');
      }

      // Validate settings are loaded and valid
      if (!new SettingsSchema().isSettingsValid(this.originalSettings)) {
        LogManager.Instance.error(ErrorLogMessagesEnum.API_SETTING_INVALID);
        throw new Error('TypeError: Invalid Settings');
      }

      // Validate user ID is present in context
      if (!context || !context.id) {
        LogManager.Instance.error(ErrorLogMessagesEnum.API_CONTEXT_INVALID);
        throw new TypeError('TypeError: Invalid context');
      }

      const contextModel = new ContextModel().modelFromDictionary(context);

      FlagApi.get(featureKey, this.settings, contextModel, hooksService)
        .then((data: any) => {
          deferredObject.resolve(data);
        })
        .catch(() => {
          deferredObject.resolve(errorReturnSchema);
        });
    } catch (err) {
      LogManager.Instance.info(
        buildMessage(ErrorLogMessagesEnum.API_THROW_ERROR, {
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
   * @param {ContextModel} context - The context in which the event is being tracked, must include a valid user ID.
   * @param {Record<string, dynamic>} eventProperties - The properties associated with the event.
   * @returns {Promise<Record<string, boolean>>} - A promise that resolves to the result of the tracking operation.
   */
  trackEvent(
    eventName: string,
    context: Record<string, any>,
    eventProperties: Record<string, dynamic> = {},
  ): Promise<Record<string, boolean>> {
    const apiName = 'trackEvent';
    const deferredObject = new Deferred();

    try {
      const hooksService = new HooksService(this.options);

      // Log the API call
      LogManager.Instance.debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );

      // Validate eventName is a string
      if (!isString(eventName)) {
        LogManager.Instance.error(
          buildMessage(ErrorLogMessagesEnum.API_INVALID_PARAM, {
            apiName,
            key: 'eventName',
            type: getType(eventName),
            correctType: 'string',
          }),
        );

        throw new TypeError('TypeError: Event-name should be a string');
      }

      // Validate eventProperties is an object
      if (!isObject(eventProperties)) {
        LogManager.Instance.error(
          buildMessage(ErrorLogMessagesEnum.API_INVALID_PARAM, {
            apiName,
            key: 'eventProperties',
            type: getType(eventProperties),
            correctType: 'object',
          }),
        );

        throw new TypeError('TypeError: eventProperties should be an object');
      }

      // Validate settings are loaded and valid
      if (!new SettingsSchema().isSettingsValid(this.originalSettings)) {
        LogManager.Instance.error(ErrorLogMessagesEnum.API_SETTING_INVALID);
        throw new Error('TypeError: Invalid Settings');
      }

      // Validate user ID is present in context
      if (!context || !context.id) {
        LogManager.Instance.error(ErrorLogMessagesEnum.API_CONTEXT_INVALID);
        throw new TypeError('TypeError: Invalid context');
      }

      const contextModel = new ContextModel().modelFromDictionary(context);

      // Proceed with tracking the event
      new TrackApi()
        .track(this.settings, eventName, contextModel, eventProperties, hooksService)
        .then((data) => {
          deferredObject.resolve(data);
        })
        .catch(() => {
          deferredObject.resolve({ [eventName]: false });
        });
    } catch (err) {
      // Log any errors encountered during the operation
      LogManager.Instance.info(
        buildMessage(ErrorLogMessagesEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );

      deferredObject.resolve({ [eventName]: false });
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
  setAttribute(attributeKey: string, attributeValue: boolean | string | number, context: Record<string, any>): void {
    const apiName = 'setAttribute';

    try {
      // Log the API call
      LogManager.Instance.debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );

      // Validate attributeKey is a string
      if (!isString(attributeKey)) {
        LogManager.Instance.error(
          buildMessage(ErrorLogMessagesEnum.API_INVALID_PARAM, {
            apiName,
            key: 'attributeKey',
            type: getType(attributeKey),
            correctType: 'string',
          }),
        );

        throw new TypeError('TypeError: attributeKey should be a string');
      }
      // Validate attributeValue is a string
      if (!isString(attributeValue) && !isNumber(attributeValue) && !isBoolean(attributeValue)) {
        LogManager.Instance.error(
          buildMessage(ErrorLogMessagesEnum.API_INVALID_PARAM, {
            apiName,
            key: 'attributeValue',
            type: getType(attributeValue),
            correctType: 'boolean | string | number',
          }),
        );

        throw new TypeError('TypeError: attributeValue should be a string');
      }

      // Validate user ID is present in context
      if (!context || !context.id) {
        LogManager.Instance.error(ErrorLogMessagesEnum.API_CONTEXT_INVALID);
        throw new TypeError('TypeError: Invalid context');
      }

      const contextModel = new ContextModel().modelFromDictionary(context);

      // Proceed with setting the attribute if validation is successful
      new SetAttributeApi().setAttribute(this.settings, attributeKey, attributeValue, contextModel);
    } catch (err) {
      // Log any errors encountered during the operation
      LogManager.Instance.info(
        buildMessage(ErrorLogMessagesEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );
    }
  }
}
