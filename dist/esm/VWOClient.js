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
import { LogManager } from './packages/logger/index.js';
import { Flag, FlagApi } from './api/GetFlag.js';
import { SetAttributeApi } from './api/SetAttribute.js';
import { TrackApi } from './api/TrackEvent.js';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from './enums/log-messages/index.js';
import { BatchEventsQueue } from './services/BatchEventsQueue.js';
import { SettingsSchema } from './models/schemas/SettingsSchemaValidation.js';
import { ContextModel } from './models/user/ContextModel.js';
import HooksService from './services/HooksService.js';
import { UrlUtil } from './utils/UrlUtil.js';
import { getType, isObject, isString, isBoolean, isNumber } from './utils/DataTypeUtil.js';
import { buildMessage } from './utils/LogMessageUtil.js';
import { Deferred } from './utils/PromiseUtil.js';
import { setSettingsAndAddCampaignsToRules } from './utils/SettingsUtil.js';
import { VariationModel } from './models/campaign/VariationModel.js';
import { setShouldWaitForTrackingCalls } from './utils/NetworkUtil.js';
import { SettingsService } from './services/SettingsService.js';
import { ApiEnum } from './enums/ApiEnum.js';
import { AliasingUtil } from './utils/AliasingUtil.js';
import { getUserId } from './utils/UserIdUtil.js';
import { isArray } from './utils/DataTypeUtil.js';
import { getFormattedErrorMessage } from './utils/FunctionUtil.js';
export class VWOClient {
    constructor(settings, options) {
        this.options = options;
        setSettingsAndAddCampaignsToRules(settings, this);
        UrlUtil.init({
            collectionPrefix: this.settings.getCollectionPrefix(),
        });
        setShouldWaitForTrackingCalls(this.options.shouldWaitForTrackingCalls || false);
        LogManager.Instance.info(InfoLogMessagesEnum.CLIENT_INITIALIZED);
        this.vwoClientInstance = this;
        this.isAliasingEnabled = options.isAliasingEnabled || false;
        return this;
    }
    /**
     * Retrieves the value of a feature flag for a given feature key and context.
     * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
     *
     * @param {string} featureKey - The key of the feature to retrieve.
     * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
     * @returns {Promise<Flag>} - A promise that resolves to the feature flag value.
     */
    async getFlag(featureKey, context) {
        const apiName = ApiEnum.GET_FLAG;
        const deferredObject = new Deferred();
        const errorReturnSchema = new Flag(false, new VariationModel());
        try {
            const hooksService = new HooksService(this.options);
            LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            // Validate featureKey is a string
            if (!isString(featureKey)) {
                LogManager.Instance.errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'featureKey',
                    type: getType(featureKey),
                    correctType: 'string',
                }, { an: ApiEnum.GET_FLAG }, false);
                throw new TypeError('TypeError: featureKey should be a string, got ' + getType(featureKey));
            }
            // Validate settings are loaded and valid
            if (!new SettingsSchema().isSettingsValid(this.originalSettings)) {
                LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.GET_FLAG }, false);
                throw new Error('TypeError: Invalid Settings');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
                LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum.GET_FLAG }, false);
                throw new TypeError('TypeError: Invalid context');
            }
            //getUserId from gateway service
            const userId = await getUserId(context.id, this.isAliasingEnabled);
            context.id = userId;
            const contextModel = new ContextModel().modelFromDictionary(context);
            FlagApi.get(featureKey, this.settings, contextModel, hooksService)
                .then((data) => {
                deferredObject.resolve(data);
            })
                .catch(() => {
                deferredObject.resolve(errorReturnSchema);
            });
        }
        catch (err) {
            LogManager.Instance.errorLog('EXECUTION_FAILED', {
                apiName,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.GET_FLAG });
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
    async trackEvent(eventName, context, eventProperties = {}) {
        const apiName = ApiEnum.TRACK_EVENT;
        const deferredObject = new Deferred();
        try {
            const hooksService = new HooksService(this.options);
            // Log the API call
            LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            // Validate eventName is a string
            if (!isString(eventName)) {
                LogManager.Instance.errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'eventName',
                    type: getType(eventName),
                    correctType: 'string',
                }, { an: ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: Event-name should be a string, got ' + getType(eventName));
            }
            // Validate eventProperties is an object
            if (!isObject(eventProperties)) {
                LogManager.Instance.errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'eventProperties',
                    type: getType(eventProperties),
                    correctType: 'object',
                }, { an: ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: eventProperties should be an object, got ' + getType(eventProperties));
            }
            // Validate settings are loaded and valid
            if (!new SettingsSchema().isSettingsValid(this.originalSettings)) {
                LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.TRACK_EVENT }, false);
                throw new Error('TypeError: Invalid Settings');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
                LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: Invalid context');
            }
            //getUserId from gateway service
            const userId = await getUserId(context.id, this.isAliasingEnabled);
            context.id = userId;
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
        }
        catch (err) {
            // Log any errors encountered during the operation
            LogManager.Instance.errorLog('EXECUTION_FAILED', {
                apiName,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.TRACK_EVENT });
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
    async setAttribute(attributeOrAttributes, attributeValueOrContext, context) {
        const apiName = ApiEnum.SET_ATTRIBUTE;
        try {
            if (isObject(attributeOrAttributes)) {
                // Log the API call
                LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                    apiName,
                }));
                if (Object.entries(attributeOrAttributes).length < 1) {
                    throw new TypeError('TypeError: Attributes should be an object containing at least 1 key-value pair');
                }
                // Case where multiple attributes are passed as a map
                const attributes = attributeOrAttributes; // Type assertion
                // Validate attributes is an object
                if (!isObject(attributes)) {
                    throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
                }
                // Validate that each attribute value is of a supported type
                Object.entries(attributes).forEach(([key, value]) => {
                    if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
                        throw new TypeError(`Invalid attribute type for key "${key}". Expected boolean, string or number, but got ${getType(value)}`);
                    }
                    // Reject arrays and objects explicitly
                    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                        throw new TypeError(`Invalid attribute value for key "${key}". Arrays and objects are not supported.`);
                    }
                });
                // If we have only two arguments (attributeMap and context)
                if (!context && attributeValueOrContext) {
                    context = attributeValueOrContext; // Assign context explicitly
                }
                // Validate user ID is present in context
                if (!context || !context.id) {
                    LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum.SET_ATTRIBUTE }, false);
                    throw new TypeError('TypeError: Invalid context');
                }
                //getUserId from gateway service
                const userId = await getUserId(context.id, this.isAliasingEnabled);
                context.id = userId;
                const contextModel = new ContextModel().modelFromDictionary(context);
                // Proceed with setting the attributes if validation is successful
                await new SetAttributeApi().setAttribute(this.settings, attributes, contextModel);
            }
            else {
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
                //getUserId from gateway service
                const userId = await getUserId(context.id, this.isAliasingEnabled);
                context.id = userId;
                const contextModel = new ContextModel().modelFromDictionary(context);
                // Create a map from the single attribute key-value pair
                const attributeMap = { [attributeKey]: attributeValue };
                // Proceed with setting the attribute map if validation is successful
                await new SetAttributeApi().setAttribute(this.settings, attributeMap, contextModel);
            }
        }
        catch (err) {
            LogManager.Instance.errorLog('EXECUTION_FAILED', {
                apiName,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.SET_ATTRIBUTE });
        }
    }
    /**
     * Updates the settings by fetching the latest settings from the VWO server.
     * @param settings - The settings to update.
     * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
     * @returns Promise<void>
     */
    async updateSettings(settings, isViaWebhook = true) {
        const apiName = ApiEnum.UPDATE_SETTINGS;
        try {
            LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.API_CALLED, { apiName }));
            // fetch settings from the server or use the provided settings file if it's not empty
            const settingsToUpdate = !settings || Object.keys(settings).length === 0
                ? await SettingsService.Instance.fetchSettings(isViaWebhook, apiName)
                : settings;
            // validate settings schema
            if (!new SettingsSchema().isSettingsValid(settingsToUpdate)) {
                throw new Error('TypeError: Invalid Settings schema');
            }
            // set the settings on the client instance
            setSettingsAndAddCampaignsToRules(settingsToUpdate, this.vwoClientInstance);
            LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_UPDATED, { apiName, isViaWebhook }));
        }
        catch (err) {
            LogManager.Instance.errorLog('UPDATING_CLIENT_INSTANCE_FAILED_WHEN_WEBHOOK_TRIGGERED', {
                apiName,
                isViaWebhook,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.UPDATE_SETTINGS });
        }
    }
    /**
     * Flushes the events manually from the batch events queue
     */
    flushEvents() {
        const apiName = ApiEnum.FLUSH_EVENTS;
        const deferredObject = new Deferred();
        try {
            LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.API_CALLED, { apiName }));
            if (BatchEventsQueue.Instance) {
                // return the promise from the flushAndClearTimer method
                return BatchEventsQueue.Instance.flushAndClearTimer();
            }
            else {
                LogManager.Instance.errorLog('BATCHING_NOT_ENABLED', {}, { an: ApiEnum.FLUSH_EVENTS });
                deferredObject.resolve({ status: 'error', events: [] });
            }
        }
        catch (err) {
            LogManager.Instance.errorLog('EXECUTION_FAILED', { apiName, err: getFormattedErrorMessage(err) }, { an: ApiEnum.FLUSH_EVENTS });
            deferredObject.resolve({ status: 'error', events: [] });
        }
        return deferredObject.promise;
    }
    /**
     * Sets alias for a given user ID
     * @param contextOrUserId - The context containing user ID or the user ID directly
     * @param aliasId - The alias identifier to set
     * @returns Promise<boolean> - Returns true if successful, false otherwise
     */
    async setAlias(contextOrUserId, aliasId) {
        const apiName = ApiEnum.SET_ALIAS;
        try {
            LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            if (!this.isAliasingEnabled) {
                LogManager.Instance.errorLog('ALIAS_CALLED_BUT_NOT_PASSED', {}, { an: ApiEnum.SET_ALIAS });
                return false;
            }
            if (!SettingsService.Instance.isGatewayServiceProvided) {
                LogManager.Instance.errorLog('INVALID_GATEWAY_URL', {}, { an: ApiEnum.SET_ALIAS });
                return false;
            }
            if (!aliasId) {
                throw new TypeError('TypeError: Invalid aliasId');
            }
            if (isArray(aliasId)) {
                throw new TypeError('TypeError: aliasId cannot be an array');
            }
            // trim aliasId before going forward
            aliasId = aliasId.trim();
            let userId;
            if (typeof contextOrUserId === 'string') {
                // trim contextOrUserId before going forward
                contextOrUserId = contextOrUserId.trim();
                // Direct userId provided
                if (contextOrUserId === aliasId) {
                    throw new TypeError('UserId and aliasId cannot be the same.');
                }
                if (!contextOrUserId) {
                    throw new TypeError('TypeError: Invalid userId');
                }
                if (isArray(contextOrUserId)) {
                    throw new TypeError('TypeError: userId cannot be an array');
                }
                userId = contextOrUserId;
            }
            else {
                // Context object provided
                if (!contextOrUserId || !contextOrUserId.id) {
                    throw new TypeError('TypeError: Invalid context');
                }
                if (isArray(contextOrUserId.id)) {
                    throw new TypeError('TypeError: context.id cannot be an array');
                }
                // trim contextOrUserId.id before going forward
                contextOrUserId.id = contextOrUserId.id.trim();
                if (contextOrUserId.id === aliasId) {
                    throw new TypeError('UserId and aliasId cannot be the same.');
                }
                userId = contextOrUserId.id;
            }
            await AliasingUtil.setAlias(userId, aliasId);
            return true;
        }
        catch (error) {
            LogManager.Instance.errorLog('EXECUTION_FAILED', { apiName, err: getFormattedErrorMessage(error) }, { an: ApiEnum.SET_ALIAS });
            return false;
        }
    }
}
//# sourceMappingURL=VWOClient.js.map