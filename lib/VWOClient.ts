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
import { LogManager } from './packages/logger';
import { Storage } from './packages/storage';

import { Flag, FlagApi } from './api/GetFlag';
import { SetAttributeApi } from './api/SetAttribute';
import { TrackApi } from './api/TrackEvent';

import { DebugLogMessagesEnum, ErrorLogMessagesEnum, InfoLogMessagesEnum } from './enums/log-messages';
import { SettingsModel } from './models/settings/SettingsModel';

import { dynamic } from './types/Common';
import { BatchEventsQueue } from './services/BatchEventsQueue';
import { SettingsSchema } from './models/schemas/SettingsSchemaValidation';
import { ContextModel } from './models/user/ContextModel';
import HooksService from './services/HooksService';
import { UrlUtil } from './utils/UrlUtil';

import { getType, isObject, isString, isBoolean, isNumber } from './utils/DataTypeUtil';

import { buildMessage } from './utils/LogMessageUtil';
import { Deferred } from './utils/PromiseUtil';

import { IVWOOptions } from './models/VWOOptionsModel';
import { setSettingsAndAddCampaignsToRules } from './utils/SettingsUtil';
import { VariationModel } from './models/campaign/VariationModel';
import { setShouldWaitForTrackingCalls } from './utils/NetworkUtil';
import { SettingsService } from './services/SettingsService';
import { ApiEnum } from './enums/ApiEnum';

export interface IVWOClient {
  readonly options?: IVWOOptions;
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  isSettingsValid: boolean;
  settingsFetchTime: number | undefined;

  getFlag(featureKey: string, context: Record<string, any>): Promise<Flag>;
  trackEvent(
    eventName: string,
    context: Record<string, any>,
    eventProperties?: Record<string, dynamic>,
  ): Promise<Record<string, boolean>>;
  setAttribute(
    attributeKey: string,
    attributeValue: boolean | string | number,
    context: Record<string, any>,
  ): Promise<void>;
  setAttribute(attributes: Record<string, boolean | string | number>, context: Record<string, any>): Promise<void>;
  updateSettings(settings?: Record<string, any>, isViaWebhook?: boolean): Promise<void>;
  flushEvents(): Promise<Record<string, any>>;
}

export class VWOClient implements IVWOClient {
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  storage: Storage;
  vwoClientInstance: VWOClient;
  isSettingsValid: boolean;
  settingsFetchTime: number | undefined;

  constructor(settings: Record<any, any>, options: IVWOOptions) {
    this.options = options;

    setSettingsAndAddCampaignsToRules(settings, this);

    UrlUtil.init({
      collectionPrefix: this.settings.getCollectionPrefix(),
    });

    setShouldWaitForTrackingCalls(this.options.shouldWaitForTrackingCalls || false);

    LogManager.Instance.info(InfoLogMessagesEnum.CLIENT_INITIALIZED);
    this.vwoClientInstance = this;
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
    const apiName = ApiEnum.GET_FLAG;
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
        .then((data) => {
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
    const apiName = ApiEnum.TRACK_EVENT;
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
   * Sets an attribute or multiple attributes for a user in the provided context.
   * This method validates the types of the inputs before proceeding with the API call.
   * There are two cases handled:
   * 1. When attributes are passed as a map (key-value pairs).
   * 2. When a single attribute (key-value) is passed.
   *
   * @param {string | Record<string, boolean | string | number>} attributeOrAttributes - Either a single attribute key (string) and value (boolean | string | number),
   *                                                                                        or a map of attributes with keys and values (boolean | string | number).
   * @param {boolean | string | number | Record<string, any>} [attributeValueOrContext] - The value for the attribute in case of a single attribute, or the context when multiple attributes are passed.
   * @param {Record<string, any>} [context] - The context which must include a valid user ID. This is required if multiple attributes are passed.
   */
  async setAttribute(
    attributeOrAttributes: string | Record<string, boolean | string | number>,
    attributeValueOrContext?: boolean | string | number | Record<string, any>,
    context?: Record<string, any>,
  ): Promise<void> {
    const apiName = ApiEnum.SET_ATTRIBUTE;

    try {
      if (isObject(attributeOrAttributes)) {
        // Log the API call
        LogManager.Instance.debug(
          buildMessage(DebugLogMessagesEnum.API_CALLED, {
            apiName,
          }),
        );

        if (Object.entries(attributeOrAttributes).length < 1) {
          LogManager.Instance.error(
            buildMessage('Attributes map must contain atleast 1 key-value pair', {
              apiName,
              key: 'attributes',
              type: getType(attributeOrAttributes),
              correctType: 'object',
            }),
          );
          throw new TypeError('TypeError: Attributes should be an object containing atleast 1 key-value pair');
        }

        // Case where multiple attributes are passed as a map
        const attributes = attributeOrAttributes as Record<string, boolean | string | number>; // Type assertion

        // Validate attributes is an object
        if (!isObject(attributes)) {
          throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
        }

        // Validate that each attribute value is of a supported type
        Object.entries(attributes).forEach(([key, value]) => {
          if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
            LogManager.Instance.error(
              buildMessage(ErrorLogMessagesEnum.API_INVALID_PARAM, {
                apiName,
                key,
                type: getType(value),
                correctType: ' boolean, string or number',
              }),
            );
            throw new TypeError(
              `Invalid attribute type for key "${key}". Expected boolean, string or number, but got ${getType(value)}`,
            );
          }

          // Reject arrays and objects explicitly
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            LogManager.Instance.error(
              buildMessage(ErrorLogMessagesEnum.API_INVALID_PARAM, {
                apiName,
                key,
                type: getType(value),
                correctType: ' boolean | string | number | null',
              }),
            );
            throw new TypeError(`Invalid attribute value for key "${key}". Arrays and objects are not supported.`);
          }
        });

        // If we have only two arguments (attributeMap and context)
        if (!context && attributeValueOrContext) {
          context = attributeValueOrContext as Record<string, any>; // Assign context explicitly
        }

        // Validate user ID is present in context
        if (!context || !context.id) {
          LogManager.Instance.error(ErrorLogMessagesEnum.API_CONTEXT_INVALID);
        }

        const contextModel = new ContextModel().modelFromDictionary(context);
        // Proceed with setting the attributes if validation is successful
        await new SetAttributeApi().setAttribute(this.settings, attributes, contextModel);
      } else {
        // Case where a single attribute (key-value) is passed
        const attributeKey = attributeOrAttributes;
        const attributeValue = attributeValueOrContext;

        // Validate attributeKey is a string
        if (!isString(attributeKey)) {
          throw new TypeError('attributeKey should be a string');
        }

        // Validate attributeValue is of valid type
        if (!isBoolean(attributeValue) && !isString(attributeValue) && !isNumber(attributeValue)) {
          throw new TypeError('attributeValue should be a boolean, string, or number');
        }

        // Validate user ID is present in context
        if (!context || !context.id) {
          throw new TypeError('Invalid context');
        }

        const contextModel = new ContextModel().modelFromDictionary(context);

        // Create a map from the single attribute key-value pair
        const attributeMap = { [attributeKey]: attributeValue };

        // Proceed with setting the attribute map if validation is successful
        await new SetAttributeApi().setAttribute(this.settings, attributeMap, contextModel);
      }
    } catch (err) {
      LogManager.Instance.info(buildMessage(ErrorLogMessagesEnum.API_THROW_ERROR, { apiName, err }));
    }
  }

  /**
   * Updates the settings by fetching the latest settings from the VWO server.
   * @param settings - The settings to update.
   * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
   * @returns Promise<void>
   */
  async updateSettings(settings?: Record<string, any>, isViaWebhook = true): Promise<void> {
    const apiName = ApiEnum.UPDATE_SETTINGS;
    try {
      LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.API_CALLED, { apiName }));
      // fetch settings from the server or use the provided settings file if it's not empty
      const settingsToUpdate =
        !settings || Object.keys(settings).length === 0
          ? await SettingsService.Instance.fetchSettings(isViaWebhook)
          : settings;

      // validate settings schema
      if (!new SettingsSchema().isSettingsValid(settingsToUpdate)) {
        throw new Error('TypeError: Invalid Settings schema');
      }

      // set the settings on the client instance
      setSettingsAndAddCampaignsToRules(settingsToUpdate, this.vwoClientInstance);
      LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_UPDATED, { apiName, isViaWebhook }));
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.SETTINGS_FETCH_FAILED, {
          apiName,
          isViaWebhook,
          err: JSON.stringify(err),
        }),
      );
    }
  }

  /**
   * Flushes the events manually from the batch events queue
   */
  flushEvents(): Promise<Record<string, any>> {
    const apiName = ApiEnum.FLUSH_EVENTS;
    const deferredObject = new Deferred();
    try {
      LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.API_CALLED, { apiName }));
      if (BatchEventsQueue.Instance) {
        // return the promise from the flushAndClearTimer method
        return BatchEventsQueue.Instance.flushAndClearTimer();
      } else {
        LogManager.Instance.error(
          'Batching is not enabled. Pass batchEventData in the SDK configuration while invoking init API.',
        );
        deferredObject.resolve({ status: 'error', events: [] });
      }
    } catch (err) {
      LogManager.Instance.error(buildMessage(ErrorLogMessagesEnum.API_THROW_ERROR, { apiName, err }));
      deferredObject.resolve({ status: 'error', events: [] });
    }
    return deferredObject.promise;
  }
}
