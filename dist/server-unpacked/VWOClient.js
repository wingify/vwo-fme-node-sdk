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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var logger_1 = require("./packages/logger");
var GetFlag_1 = require("./api/GetFlag");
var SetAttribute_1 = require("./api/SetAttribute");
var TrackEvent_1 = require("./api/TrackEvent");
var log_messages_1 = require("./enums/log-messages");
// import { BatchEventsQueue } from './services/batchEventsQueue';
var SettingsSchemaValidation_1 = require("./models/schemas/SettingsSchemaValidation");
var ContextModel_1 = require("./models/user/ContextModel");
var HooksService_1 = require("./services/HooksService");
var UrlUtil_1 = require("./utils/UrlUtil");
var DataTypeUtil_1 = require("./utils/DataTypeUtil");
var LogMessageUtil_1 = require("./utils/LogMessageUtil");
var PromiseUtil_1 = require("./utils/PromiseUtil");
var SettingsUtil_1 = require("./utils/SettingsUtil");
var NetworkUtil_1 = require("./utils/NetworkUtil");
var SettingsService_1 = require("./services/SettingsService");
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
     * @returns {Promise<Record<any, any>>} - A promise that resolves to the feature flag value.
     */
    VWOClient.prototype.getFlag = function (featureKey, context) {
        var apiName = 'getFlag';
        var deferredObject = new PromiseUtil_1.Deferred();
        var errorReturnSchema = {
            isEnabled: function () { return false; },
            getVariables: function () { return []; },
            getVariable: function (_key, defaultValue) { return defaultValue; },
        };
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
            new GetFlag_1.FlagApi()
                .get(featureKey, this.settings, contextModel, hooksService)
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
        var apiName = 'trackEvent';
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
     * Sets an attribute for a user in the context provided.
     * This method validates the types of the inputs before proceeding with the API call.
     *
     * @param {string} attributeKey - The key of the attribute to set.
     * @param {string} attributeValue - The value of the attribute to set.
     * @param {ContextModel} context - The context in which the attribute should be set, must include a valid user ID.
     */
    VWOClient.prototype.setAttribute = function (attributeKey, attributeValue, context) {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, contextModel, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiName = 'setAttribute';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // Log the API call
                        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        // Validate attributeKey is a string
                        if (!(0, DataTypeUtil_1.isString)(attributeKey)) {
                            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                                apiName: apiName,
                                key: 'attributeKey',
                                type: (0, DataTypeUtil_1.getType)(attributeKey),
                                correctType: 'string',
                            }));
                            throw new TypeError('TypeError: attributeKey should be a string');
                        }
                        // Validate attributeValue is a string
                        if (!(0, DataTypeUtil_1.isString)(attributeValue) && !(0, DataTypeUtil_1.isNumber)(attributeValue) && !(0, DataTypeUtil_1.isBoolean)(attributeValue)) {
                            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                                apiName: apiName,
                                key: 'attributeValue',
                                type: (0, DataTypeUtil_1.getType)(attributeValue),
                                correctType: 'boolean | string | number',
                            }));
                            throw new TypeError('TypeError: attributeValue should be a string');
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_CONTEXT_INVALID);
                            throw new TypeError('TypeError: Invalid context');
                        }
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
                        // Proceed with setting the attribute if validation is successful
                        return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributeKey, attributeValue, contextModel)];
                    case 2:
                        // Proceed with setting the attribute if validation is successful
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        // Log any errors encountered during the operation
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
                            apiName: apiName,
                            err: err_1,
                        }));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
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
                        apiName = 'updateSettings';
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
    return VWOClient;
}());
exports.VWOClient = VWOClient;
//# sourceMappingURL=VWOClient.js.map