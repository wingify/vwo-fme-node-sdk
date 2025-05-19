"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var logger_1 = require("./packages/logger");
var GetFlag_1 = require("./api/GetFlag");
var SetAttribute_1 = require("./api/SetAttribute");
var TrackEvent_1 = require("./api/TrackEvent");
var log_messages_1 = require("./enums/log-messages");
var BatchEventsQueue_1 = require("./services/BatchEventsQueue");
var SettingsSchemaValidation_1 = require("./models/schemas/SettingsSchemaValidation");
var ContextModel_1 = require("./models/user/ContextModel");
var HooksService_1 = require("./services/HooksService");
var UrlUtil_1 = require("./utils/UrlUtil");
var DataTypeUtil_1 = require("./utils/DataTypeUtil");
var LogMessageUtil_1 = require("./utils/LogMessageUtil");
var PromiseUtil_1 = require("./utils/PromiseUtil");
var SettingsUtil_1 = require("./utils/SettingsUtil");
var VariationModel_1 = require("./models/campaign/VariationModel");
var NetworkUtil_1 = require("./utils/NetworkUtil");
var SettingsService_1 = require("./services/SettingsService");
var ApiEnum_1 = require("./enums/ApiEnum");
var VWOClient = /** @class */ (function () {
    function VWOClient(settings, options) {
        this.options = options;
        (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(settings, this);
        UrlUtil_1.UrlUtil.init({
            collectionPrefix: this.settings.getCollectionPrefix(),
        });
        (0, NetworkUtil_1.setShouldWaitForTrackingCalls)(this.options.shouldWaitForTrackingCalls || false);
        logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.CLIENT_INITIALIZED);
        this.vwoClientInstance = this;
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
    VWOClient.prototype.getFlag = function (featureKey, context) {
        var apiName = ApiEnum_1.ApiEnum.GET_FLAG;
        var deferredObject = new PromiseUtil_1.Deferred();
        var errorReturnSchema = new GetFlag_1.Flag(false, new VariationModel_1.VariationModel());
        try {
            var hooksService = new HooksService_1.default(this.options);
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                apiName: apiName,
            }));
            // Validate featureKey is a string
            if (!(0, DataTypeUtil_1.isString)(featureKey)) {
                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                    apiName: apiName,
                    key: 'featureKey',
                    type: (0, DataTypeUtil_1.getType)(featureKey),
                    correctType: 'string',
                }));
                throw new TypeError('TypeError: featureKey should be a string');
            }
            // Validate settings are loaded and valid
            if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(this.originalSettings)) {
                logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_SETTING_INVALID);
                throw new Error('TypeError: Invalid Settings');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
                logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_CONTEXT_INVALID);
                throw new TypeError('TypeError: Invalid context');
            }
            var contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
            GetFlag_1.FlagApi.get(featureKey, this.settings, contextModel, hooksService)
                .then(function (data) {
                deferredObject.resolve(data);
            })
                .catch(function () {
                deferredObject.resolve(errorReturnSchema);
            });
        }
        catch (err) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
                apiName: apiName,
                err: err,
            }));
            deferredObject.resolve(errorReturnSchema);
        }
        return deferredObject.promise;
    };
    /**
     * Tracks an event with specified properties and context.
     * This method validates the types of the inputs and ensures the settings and user context are valid before proceeding.
     *
     * @param {string} eventName - The name of the event to track.
     * @param {ContextModel} context - The context in which the event is being tracked, must include a valid user ID.
     * @param {Record<string, dynamic>} eventProperties - The properties associated with the event.
     * @returns {Promise<Record<string, boolean>>} - A promise that resolves to the result of the tracking operation.
     */
    VWOClient.prototype.trackEvent = function (eventName, context, eventProperties) {
        var _a;
        if (eventProperties === void 0) { eventProperties = {}; }
        var apiName = ApiEnum_1.ApiEnum.TRACK_EVENT;
        var deferredObject = new PromiseUtil_1.Deferred();
        try {
            var hooksService = new HooksService_1.default(this.options);
            // Log the API call
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                apiName: apiName,
            }));
            // Validate eventName is a string
            if (!(0, DataTypeUtil_1.isString)(eventName)) {
                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                    apiName: apiName,
                    key: 'eventName',
                    type: (0, DataTypeUtil_1.getType)(eventName),
                    correctType: 'string',
                }));
                throw new TypeError('TypeError: Event-name should be a string');
            }
            // Validate eventProperties is an object
            if (!(0, DataTypeUtil_1.isObject)(eventProperties)) {
                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                    apiName: apiName,
                    key: 'eventProperties',
                    type: (0, DataTypeUtil_1.getType)(eventProperties),
                    correctType: 'object',
                }));
                throw new TypeError('TypeError: eventProperties should be an object');
            }
            // Validate settings are loaded and valid
            if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(this.originalSettings)) {
                logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_SETTING_INVALID);
                throw new Error('TypeError: Invalid Settings');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
                logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_CONTEXT_INVALID);
                throw new TypeError('TypeError: Invalid context');
            }
            var contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
            // Proceed with tracking the event
            new TrackEvent_1.TrackApi()
                .track(this.settings, eventName, contextModel, eventProperties, hooksService)
                .then(function (data) {
                deferredObject.resolve(data);
            })
                .catch(function () {
                var _a;
                deferredObject.resolve((_a = {}, _a[eventName] = false, _a));
            });
        }
        catch (err) {
            // Log any errors encountered during the operation
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
                apiName: apiName,
                err: err,
            }));
            deferredObject.resolve((_a = {}, _a[eventName] = false, _a));
        }
        return deferredObject.promise;
    };
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
    VWOClient.prototype.setAttribute = function (attributeOrAttributes, attributeValueOrContext, context) {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, attributes, contextModel, attributeKey, attributeValue, contextModel, attributeMap, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.SET_ATTRIBUTE;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        if (!(0, DataTypeUtil_1.isObject)(attributeOrAttributes)) return [3 /*break*/, 3];
                        // Log the API call
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        if (Object.entries(attributeOrAttributes).length < 1) {
                            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)('Attributes map must contain atleast 1 key-value pair', {
                                apiName: apiName,
                                key: 'attributes',
                                type: (0, DataTypeUtil_1.getType)(attributeOrAttributes),
                                correctType: 'object',
                            }));
                            throw new TypeError('TypeError: Attributes should be an object containing atleast 1 key-value pair');
                        }
                        attributes = attributeOrAttributes;
                        // Validate attributes is an object
                        if (!(0, DataTypeUtil_1.isObject)(attributes)) {
                            throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
                        }
                        // Validate that each attribute value is of a supported type
                        Object.entries(attributes).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
                                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                                    apiName: apiName,
                                    key: key,
                                    type: (0, DataTypeUtil_1.getType)(value),
                                    correctType: ' boolean, string or number',
                                }));
                                throw new TypeError("Invalid attribute type for key \"".concat(key, "\". Expected boolean, string or number, but got ").concat((0, DataTypeUtil_1.getType)(value)));
                            }
                            // Reject arrays and objects explicitly
                            if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                                    apiName: apiName,
                                    key: key,
                                    type: (0, DataTypeUtil_1.getType)(value),
                                    correctType: ' boolean | string | number | null',
                                }));
                                throw new TypeError("Invalid attribute value for key \"".concat(key, "\". Arrays and objects are not supported."));
                            }
                        });
                        // If we have only two arguments (attributeMap and context)
                        if (!context && attributeValueOrContext) {
                            context = attributeValueOrContext; // Assign context explicitly
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_CONTEXT_INVALID);
                        }
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                        // Proceed with setting the attributes if validation is successful
                        return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributes, contextModel)];
                    case 2:
                        // Proceed with setting the attributes if validation is successful
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        attributeKey = attributeOrAttributes;
                        attributeValue = attributeValueOrContext;
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
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                        attributeMap = (_a = {}, _a[attributeKey] = attributeValue, _a);
                        // Proceed with setting the attribute map if validation is successful
                        return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributeMap, contextModel)];
                    case 4:
                        // Proceed with setting the attribute map if validation is successful
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _b.sent();
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, { apiName: apiName, err: err_1 }));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the settings by fetching the latest settings from the VWO server.
     * @param settings - The settings to update.
     * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
     * @returns Promise<void>
     */
    VWOClient.prototype.updateSettings = function (settings_1) {
        return __awaiter(this, arguments, void 0, function (settings, isViaWebhook) {
            var apiName, settingsToUpdate, _a, err_2;
            if (isViaWebhook === void 0) { isViaWebhook = true; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.UPDATE_SETTINGS;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName: apiName }));
                        if (!(!settings || Object.keys(settings).length === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, SettingsService_1.SettingsService.Instance.fetchSettings(isViaWebhook)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = settings;
                        _b.label = 4;
                    case 4:
                        settingsToUpdate = _a;
                        // validate settings schema
                        if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(settingsToUpdate)) {
                            throw new Error('TypeError: Invalid Settings schema');
                        }
                        // set the settings on the client instance
                        (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(settingsToUpdate, this.vwoClientInstance);
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_UPDATED, { apiName: apiName, isViaWebhook: isViaWebhook }));
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _b.sent();
                        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SETTINGS_FETCH_FAILED, {
                            apiName: apiName,
                            isViaWebhook: isViaWebhook,
                            err: JSON.stringify(err_2),
                        }));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Flushes the events manually from the batch events queue
     */
    VWOClient.prototype.flushEvents = function () {
        var apiName = ApiEnum_1.ApiEnum.FLUSH_EVENTS;
        var deferredObject = new PromiseUtil_1.Deferred();
        try {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName: apiName }));
            if (BatchEventsQueue_1.BatchEventsQueue.Instance) {
                // return the promise from the flushAndClearTimer method
                return BatchEventsQueue_1.BatchEventsQueue.Instance.flushAndClearTimer();
            }
            else {
                logger_1.LogManager.Instance.error('Batching is not enabled. Pass batchEventData in the SDK configuration while invoking init API.');
                deferredObject.resolve({ status: 'error', events: [] });
            }
        }
        catch (err) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, { apiName: apiName, err: err }));
            deferredObject.resolve({ status: 'error', events: [] });
        }
        return deferredObject.promise;
    };
    return VWOClient;
}());
exports.VWOClient = VWOClient;
//# sourceMappingURL=VWOClient.js.map