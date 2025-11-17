"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VWOClient = void 0;
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
const logger_1 = require("./packages/logger");
const GetFlag_1 = require("./api/GetFlag");
const SetAttribute_1 = require("./api/SetAttribute");
const TrackEvent_1 = require("./api/TrackEvent");
const log_messages_1 = require("./enums/log-messages");
const BatchEventsQueue_1 = require("./services/BatchEventsQueue");
const SettingsSchemaValidation_1 = require("./models/schemas/SettingsSchemaValidation");
const ContextModel_1 = require("./models/user/ContextModel");
const HooksService_1 = __importDefault(require("./services/HooksService"));
const UrlUtil_1 = require("./utils/UrlUtil");
const DataTypeUtil_1 = require("./utils/DataTypeUtil");
const LogMessageUtil_1 = require("./utils/LogMessageUtil");
const PromiseUtil_1 = require("./utils/PromiseUtil");
const SettingsUtil_1 = require("./utils/SettingsUtil");
const VariationModel_1 = require("./models/campaign/VariationModel");
const NetworkUtil_1 = require("./utils/NetworkUtil");
const SettingsService_1 = require("./services/SettingsService");
const ApiEnum_1 = require("./enums/ApiEnum");
const AliasingUtil_1 = require("./utils/AliasingUtil");
const UserIdUtil_1 = require("./utils/UserIdUtil");
const DataTypeUtil_2 = require("./utils/DataTypeUtil");
const FunctionUtil_1 = require("./utils/FunctionUtil");
class VWOClient {
    constructor(settings, options) {
        this.options = options;
        (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(settings, this);
        UrlUtil_1.UrlUtil.init({
            collectionPrefix: this.settings.getCollectionPrefix(),
        });
        (0, NetworkUtil_1.setShouldWaitForTrackingCalls)(this.options.shouldWaitForTrackingCalls || false);
        logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.CLIENT_INITIALIZED);
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
        const apiName = ApiEnum_1.ApiEnum.GET_FLAG;
        const deferredObject = new PromiseUtil_1.Deferred();
        const errorReturnSchema = new GetFlag_1.Flag(false, new VariationModel_1.VariationModel());
        try {
            const hooksService = new HooksService_1.default(this.options);
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            // Validate featureKey is a string
            if (!(0, DataTypeUtil_1.isString)(featureKey)) {
                logger_1.LogManager.Instance.errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'featureKey',
                    type: (0, DataTypeUtil_1.getType)(featureKey),
                    correctType: 'string',
                }, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                throw new TypeError('TypeError: featureKey should be a string, got ' + (0, DataTypeUtil_1.getType)(featureKey));
            }
            // Validate settings are loaded and valid
            if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(this.originalSettings)) {
                logger_1.LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                throw new Error('TypeError: Invalid Settings');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
                logger_1.LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                throw new TypeError('TypeError: Invalid context');
            }
            //getUserId from gateway service
            const userId = await (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled);
            context.id = userId;
            const contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
            GetFlag_1.FlagApi.get(featureKey, this.settings, contextModel, hooksService)
                .then((data) => {
                deferredObject.resolve(data);
            })
                .catch(() => {
                deferredObject.resolve(errorReturnSchema);
            });
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                apiName,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: ApiEnum_1.ApiEnum.GET_FLAG });
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
        const apiName = ApiEnum_1.ApiEnum.TRACK_EVENT;
        const deferredObject = new PromiseUtil_1.Deferred();
        try {
            const hooksService = new HooksService_1.default(this.options);
            // Log the API call
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            // Validate eventName is a string
            if (!(0, DataTypeUtil_1.isString)(eventName)) {
                logger_1.LogManager.Instance.errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'eventName',
                    type: (0, DataTypeUtil_1.getType)(eventName),
                    correctType: 'string',
                }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: Event-name should be a string, got ' + (0, DataTypeUtil_1.getType)(eventName));
            }
            // Validate eventProperties is an object
            if (!(0, DataTypeUtil_1.isObject)(eventProperties)) {
                logger_1.LogManager.Instance.errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'eventProperties',
                    type: (0, DataTypeUtil_1.getType)(eventProperties),
                    correctType: 'object',
                }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: eventProperties should be an object, got ' + (0, DataTypeUtil_1.getType)(eventProperties));
            }
            // Validate settings are loaded and valid
            if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(this.originalSettings)) {
                logger_1.LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                throw new Error('TypeError: Invalid Settings');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
                logger_1.LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: Invalid context');
            }
            //getUserId from gateway service
            const userId = await (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled);
            context.id = userId;
            const contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
            // Proceed with tracking the event
            new TrackEvent_1.TrackApi()
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
            logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                apiName,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT });
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
        const apiName = ApiEnum_1.ApiEnum.SET_ATTRIBUTE;
        try {
            if ((0, DataTypeUtil_1.isObject)(attributeOrAttributes)) {
                // Log the API call
                logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                    apiName,
                }));
                if (Object.entries(attributeOrAttributes).length < 1) {
                    throw new TypeError('TypeError: Attributes should be an object containing at least 1 key-value pair');
                }
                // Case where multiple attributes are passed as a map
                const attributes = attributeOrAttributes; // Type assertion
                // Validate attributes is an object
                if (!(0, DataTypeUtil_1.isObject)(attributes)) {
                    throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
                }
                // Validate that each attribute value is of a supported type
                Object.entries(attributes).forEach(([key, value]) => {
                    if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
                        throw new TypeError(`Invalid attribute type for key "${key}". Expected boolean, string or number, but got ${(0, DataTypeUtil_1.getType)(value)}`);
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
                    logger_1.LogManager.Instance.errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.SET_ATTRIBUTE }, false);
                    throw new TypeError('TypeError: Invalid context');
                }
                //getUserId from gateway service
                const userId = await (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled);
                context.id = userId;
                const contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                // Proceed with setting the attributes if validation is successful
                await new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributes, contextModel);
            }
            else {
                // Case where a single attribute (key-value) is passed
                const attributeKey = attributeOrAttributes;
                const attributeValue = attributeValueOrContext;
                // Validate attributeKey is a string
                if (!(0, DataTypeUtil_1.isString)(attributeKey)) {
                    throw new TypeError('attributeKey should be a string');
                }
                // Validate attributeValue is of valid type
                if (!(0, DataTypeUtil_1.isBoolean)(attributeValue) && !(0, DataTypeUtil_1.isString)(attributeValue) && !(0, DataTypeUtil_1.isNumber)(attributeValue)) {
                    throw new TypeError('attributeValue should be a boolean, string, or number');
                }
                // Validate user ID is present in context
                if (!context || !context.id) {
                    throw new TypeError('Invalid context');
                }
                //getUserId from gateway service
                const userId = await (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled);
                context.id = userId;
                const contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                // Create a map from the single attribute key-value pair
                const attributeMap = { [attributeKey]: attributeValue };
                // Proceed with setting the attribute map if validation is successful
                await new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributeMap, contextModel);
            }
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                apiName,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: ApiEnum_1.ApiEnum.SET_ATTRIBUTE });
        }
    }
    /**
     * Updates the settings by fetching the latest settings from the VWO server.
     * @param settings - The settings to update.
     * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
     * @returns Promise<void>
     */
    async updateSettings(settings, isViaWebhook = true) {
        const apiName = ApiEnum_1.ApiEnum.UPDATE_SETTINGS;
        try {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName }));
            // fetch settings from the server or use the provided settings file if it's not empty
            const settingsToUpdate = !settings || Object.keys(settings).length === 0
                ? await SettingsService_1.SettingsService.Instance.fetchSettings(isViaWebhook, apiName)
                : settings;
            // validate settings schema
            if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(settingsToUpdate)) {
                throw new Error('TypeError: Invalid Settings schema');
            }
            // set the settings on the client instance
            (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(settingsToUpdate, this.vwoClientInstance);
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_UPDATED, { apiName, isViaWebhook }));
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('UPDATING_CLIENT_INSTANCE_FAILED_WHEN_WEBHOOK_TRIGGERED', {
                apiName,
                isViaWebhook,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: ApiEnum_1.ApiEnum.UPDATE_SETTINGS });
        }
    }
    /**
     * Flushes the events manually from the batch events queue
     */
    flushEvents() {
        const apiName = ApiEnum_1.ApiEnum.FLUSH_EVENTS;
        const deferredObject = new PromiseUtil_1.Deferred();
        try {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName }));
            if (BatchEventsQueue_1.BatchEventsQueue.Instance) {
                // return the promise from the flushAndClearTimer method
                return BatchEventsQueue_1.BatchEventsQueue.Instance.flushAndClearTimer();
            }
            else {
                logger_1.LogManager.Instance.errorLog('BATCHING_NOT_ENABLED', {}, { an: ApiEnum_1.ApiEnum.FLUSH_EVENTS });
                deferredObject.resolve({ status: 'error', events: [] });
            }
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', { apiName, err: (0, FunctionUtil_1.getFormattedErrorMessage)(err) }, { an: ApiEnum_1.ApiEnum.FLUSH_EVENTS });
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
        const apiName = ApiEnum_1.ApiEnum.SET_ALIAS;
        try {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            if (!this.isAliasingEnabled) {
                logger_1.LogManager.Instance.errorLog('ALIAS_CALLED_BUT_NOT_PASSED', {}, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
                return false;
            }
            if (!SettingsService_1.SettingsService.Instance.isGatewayServiceProvided) {
                logger_1.LogManager.Instance.errorLog('INVALID_GATEWAY_URL', {}, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
                return false;
            }
            if (!aliasId) {
                throw new TypeError('TypeError: Invalid aliasId');
            }
            if ((0, DataTypeUtil_2.isArray)(aliasId)) {
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
                if ((0, DataTypeUtil_2.isArray)(contextOrUserId)) {
                    throw new TypeError('TypeError: userId cannot be an array');
                }
                userId = contextOrUserId;
            }
            else {
                // Context object provided
                if (!contextOrUserId || !contextOrUserId.id) {
                    throw new TypeError('TypeError: Invalid context');
                }
                if ((0, DataTypeUtil_2.isArray)(contextOrUserId.id)) {
                    throw new TypeError('TypeError: context.id cannot be an array');
                }
                // trim contextOrUserId.id before going forward
                contextOrUserId.id = contextOrUserId.id.trim();
                if (contextOrUserId.id === aliasId) {
                    throw new TypeError('UserId and aliasId cannot be the same.');
                }
                userId = contextOrUserId.id;
            }
            await AliasingUtil_1.AliasingUtil.setAlias(userId, aliasId);
            return true;
        }
        catch (error) {
            logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', { apiName, err: (0, FunctionUtil_1.getFormattedErrorMessage)(error) }, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
            return false;
        }
    }
}
exports.VWOClient = VWOClient;
//# sourceMappingURL=VWOClient.js.map