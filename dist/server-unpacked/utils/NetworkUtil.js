"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getSettingsPath = getSettingsPath;
exports.getTrackEventPath = getTrackEventPath;
exports.getEventsBaseProperties = getEventsBaseProperties;
exports._getEventBasePayload = _getEventBasePayload;
exports.getTrackUserPayloadData = getTrackUserPayloadData;
exports.getTrackGoalPayloadData = getTrackGoalPayloadData;
exports.getAttributePayloadData = getAttributePayloadData;
exports.sendPostApiRequest = sendPostApiRequest;
exports.getShouldWaitForTrackingCalls = getShouldWaitForTrackingCalls;
exports.setShouldWaitForTrackingCalls = setShouldWaitForTrackingCalls;
exports.getMessagingEventPayload = getMessagingEventPayload;
exports.getSDKInitEventPayload = getSDKInitEventPayload;
exports.sendEvent = sendEvent;
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
var FunctionUtil_1 = require("./FunctionUtil");
var UuidUtil_1 = require("./UuidUtil");
var constants_1 = require("../constants");
var HeadersEnum_1 = require("../enums/HeadersEnum");
var HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
var UrlEnum_1 = require("../enums/UrlEnum");
var log_messages_1 = require("../enums/log-messages");
var logger_1 = require("../packages/logger");
var network_layer_1 = require("../packages/network-layer");
var SettingsService_1 = require("../services/SettingsService");
var DataTypeUtil_1 = require("./DataTypeUtil");
var LogMessageUtil_1 = require("./LogMessageUtil");
var UrlUtil_1 = require("./UrlUtil");
var PromiseUtil_1 = require("./PromiseUtil");
var UsageStatsUtil_1 = require("./UsageStatsUtil");
var EventEnum_1 = require("../enums/EventEnum");
/**
 * Constructs the settings path with API key and account ID.
 * @param {string} sdkKey - The API key.
 * @param {any} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The settings path including API key, random number, and account ID.
 */
function getSettingsPath(sdkKey, accountId) {
    var path = {
        i: "".concat(sdkKey), // Inject API key
        r: Math.random(), // Random number for cache busting
        a: accountId, // Account ID
    };
    return path;
}
/**
 * Constructs the tracking path for an event.
 * @param {string} event - The event type.
 * @param {string} accountId - The account identifier.
 * @param {string} userId - The user identifier.
 * @returns {Record<string, dynamic>} - The tracking path for the event.
 */
function getTrackEventPath(event, accountId, userId) {
    var path = {
        event_type: event, // Type of the event
        account_id: accountId, // Account ID
        uId: userId, // User ID
        u: (0, UuidUtil_1.getUUID)(userId, accountId), // UUID generated for the user
        sdk: constants_1.Constants.SDK_NAME, // SDK name constant
        'sdk-v': constants_1.Constants.SDK_VERSION, // SDK version
        random: (0, FunctionUtil_1.getRandomNumber)(), // Random number for uniqueness
        ap: constants_1.Constants.PLATFORM, // Application platform
        sId: (0, FunctionUtil_1.getCurrentUnixTimestamp)(), // Session ID
        ed: JSON.stringify({ p: 'server' }), // Additional encoded data
    };
    return path;
}
/**
 * Builds generic properties for different tracking calls required by VWO servers.
 * @param {Object} configObj
 * @param {String} eventName
 * @returns properties
 */
function getEventsBaseProperties(eventName, visitorUserAgent, ipAddress) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    var sdkKey = SettingsService_1.SettingsService.Instance.sdkKey;
    var properties = Object.assign({
        en: eventName,
        a: SettingsService_1.SettingsService.Instance.accountId,
        env: sdkKey,
        eTime: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
        random: (0, FunctionUtil_1.getRandomNumber)(),
        p: 'FS',
        visitor_ua: visitorUserAgent,
        visitor_ip: ipAddress,
        sn: constants_1.Constants.SDK_NAME,
        sv: constants_1.Constants.SDK_VERSION,
    });
    properties.url = constants_1.Constants.HTTPS_PROTOCOL + UrlUtil_1.UrlUtil.getBaseUrl() + UrlEnum_1.UrlEnum.EVENTS;
    return properties;
}
/**
 * Builds generic payload required by all the different tracking calls.
 * @param {Object} settings   settings file
 * @param {String} userId     user id
 * @param {String} eventName  event name
 * @returns properties
 */
function _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    var uuid = (0, UuidUtil_1.getUUID)(userId.toString(), SettingsService_1.SettingsService.Instance.accountId.toString());
    var sdkKey = SettingsService_1.SettingsService.Instance.sdkKey;
    var props = {
        vwo_sdkName: constants_1.Constants.SDK_NAME,
        vwo_sdkVersion: constants_1.Constants.SDK_VERSION,
        vwo_envKey: sdkKey,
    };
    var properties = {
        d: {
            msgId: "".concat(uuid, "-").concat((0, FunctionUtil_1.getCurrentUnixTimestampInMillis)()),
            visId: uuid,
            sessionId: (0, FunctionUtil_1.getCurrentUnixTimestamp)(),
            visitor_ua: visitorUserAgent,
            visitor_ip: ipAddress,
            event: {
                props: props,
                name: eventName,
                time: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
            },
            visitor: {
                props: {
                    vwo_fs_environment: sdkKey,
                },
            },
        },
    };
    return properties;
}
/**
 * Builds payload to track the visitor.
 * @param {Object} configObj
 * @param {String} userId
 * @param {String} eventName
 * @param {String} campaignId
 * @param {Number} variationId
 * @returns track-user payload
 */
function getTrackUserPayloadData(settings, userId, eventName, campaignId, variationId, visitorUserAgent, ipAddress) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    properties.d.event.props.id = campaignId;
    properties.d.event.props.variation = variationId;
    properties.d.event.props.isFirst = 1;
    // add usageStats as a new meta key to properties.d.events.props.vwoMeta
    if (Object.keys(UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats()).length > 0) {
        properties.d.event.props.vwoMeta = UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats();
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
        accountId: settings.getAccountId(),
        userId: userId,
        campaignId: campaignId,
    }));
    return properties;
}
/**
 * Constructs the payload data for tracking goals with custom event properties.
 * @param {any} settings - Configuration settings.
 * @param {any} userId - User identifier.
 * @param {string} eventName - Name of the event.
 * @param {any} eventProperties - Custom properties for the event.
 * @param {string} [visitorUserAgent=''] - Visitor's user agent.
 * @param {string} [ipAddress=''] - Visitor's IP address.
 * @returns {any} - The constructed payload data.
 */
function getTrackGoalPayloadData(settings, userId, eventName, eventProperties, visitorUserAgent, ipAddress) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props.variation = 1; // Temporary value for variation
    properties.d.event.props.id = 1; // Temporary value for ID
    // Add custom event properties if provided
    if (eventProperties && (0, DataTypeUtil_1.isObject)(eventProperties) && Object.keys(eventProperties).length > 0) {
        for (var prop in eventProperties) {
            properties.d.event.props[prop] = eventProperties[prop];
        }
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_GOAL, {
        eventName: eventName,
        accountId: settings.getAccountId(),
        userId: userId,
    }));
    return properties;
}
/**
 * Constructs the payload data for syncing multiple visitor attributes.
 * @param {SettingsModel} settings - Configuration settings.
 * @param {string | number} userId - User ID.
 * @param {string} eventName - Event name.
 * @param {Record<string, any>} attributes - Key-value map of attributes.
 * @param {string} [visitorUserAgent=''] - Visitor's User-Agent (optional).
 * @param {string} [ipAddress=''] - Visitor's IP Address (optional).
 * @returns {Record<string, any>} - Payload object to be sent in the request.
 */
function getAttributePayloadData(settings, userId, eventName, attributes, visitorUserAgent, ipAddress) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = settings.getSdkkey(); // Set environment key
    // Iterate over the attributes map and append to the visitor properties
    for (var _i = 0, _a = Object.entries(attributes); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        properties.d.visitor.props[key] = value;
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_SYNC_VISITOR_PROP, {
        eventName: eventName,
        accountId: settings.getAccountId(),
        userId: userId,
    }));
    return properties;
}
/**
 * Sends a POST API request with the specified properties and payload.
 * @param {any} properties - Properties for the request.
 * @param {any} payload - Payload for the request.
 * @param {string} userId - User ID.
 */
function sendPostApiRequest(properties_1, payload_1, userId_1) {
    return __awaiter(this, arguments, void 0, function (properties, payload, userId, eventProperties) {
        var networkManager, retryConfig, headers, userAgent, ipAddress, baseUrl, request;
        if (eventProperties === void 0) { eventProperties = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    networkManager = network_layer_1.NetworkManager.Instance;
                    networkManager.attachClient();
                    retryConfig = networkManager.getRetryConfig();
                    headers = {};
                    userAgent = payload.d.visitor_ua;
                    ipAddress = payload.d.visitor_ip;
                    // Set headers if available
                    if (userAgent)
                        headers[HeadersEnum_1.HeadersEnum.USER_AGENT] = userAgent;
                    if (ipAddress)
                        headers[HeadersEnum_1.HeadersEnum.IP] = ipAddress;
                    baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
                    baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
                    request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.EVENTS, properties, payload, headers, SettingsService_1.SettingsService.Instance.protocol, SettingsService_1.SettingsService.Instance.port, retryConfig);
                    request.setEventName(properties.en);
                    request.setUuid(payload.d.visId);
                    if (properties.en === EventEnum_1.EventEnum.VWO_VARIATION_SHOWN) {
                        request.setCampaignId(payload.d.event.props.id);
                    }
                    else if (properties.en != EventEnum_1.EventEnum.VWO_VARIATION_SHOWN && Object.keys(eventProperties).length > 0) {
                        request.setEventProperties(eventProperties);
                    }
                    return [4 /*yield*/, network_layer_1.NetworkManager.Instance.post(request)
                            .then(function () {
                            // clear usage stats only if network call is successful
                            if (Object.keys(UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats()).length > 0) {
                                UsageStatsUtil_1.UsageStatsUtil.getInstance().clearUsageStats();
                            }
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.NETWORK_CALL_SUCCESS, {
                                event: properties.en,
                                endPoint: UrlEnum_1.UrlEnum.EVENTS,
                                accountId: SettingsService_1.SettingsService.Instance.accountId,
                                userId: userId,
                                uuid: payload.d.visId,
                            }));
                        })
                            .catch(function (err) {
                            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
                                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                                err: (0, DataTypeUtil_1.isObject)(err) ? JSON.stringify(err) : err,
                            }));
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Flag to determine if the SDK should wait for a network response.
var shouldWaitForTrackingCalls = false;
/**
 * Checks if the SDK should wait for a network response.
 * @returns {boolean} - True if the SDK should wait for a network response, false otherwise.
 */
function getShouldWaitForTrackingCalls() {
    return shouldWaitForTrackingCalls;
}
/**
 * Sets the value to determine if the SDK should wait for a network response.
 * @param value - The value to set.
 */
function setShouldWaitForTrackingCalls(value) {
    shouldWaitForTrackingCalls = value;
}
/**
 * Constructs the payload for a messaging event.
 * @param messageType - The type of the message.
 * @param message - The message to send.
 * @param eventName - The name of the event.
 * @returns The constructed payload.
 */
function getMessagingEventPayload(messageType, message, eventName, extraData) {
    if (extraData === void 0) { extraData = {}; }
    var userId = SettingsService_1.SettingsService.Instance.accountId + '_' + SettingsService_1.SettingsService.Instance.sdkKey;
    var properties = _getEventBasePayload(null, userId, eventName, null, null);
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = SettingsService_1.SettingsService.Instance.sdkKey; // Set environment key
    properties.d.event.props.product = 'fme';
    var data = {
        type: messageType,
        content: {
            title: message,
            dateTime: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
        },
        metaInfo: __assign({}, extraData),
    };
    properties.d.event.props.data = data;
    return properties;
}
/**
 * Constructs the payload for init called event.
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
function getSDKInitEventPayload(eventName, settingsFetchTime, sdkInitTime) {
    var userId = SettingsService_1.SettingsService.Instance.accountId + '_' + SettingsService_1.SettingsService.Instance.sdkKey;
    var properties = _getEventBasePayload(null, userId, eventName, null, null);
    // Set the required fields as specified
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = SettingsService_1.SettingsService.Instance.sdkKey;
    properties.d.event.props.product = 'fme';
    var data = {
        isSDKInitialized: true,
        settingsFetchTime: settingsFetchTime,
        sdkInitTime: sdkInitTime,
    };
    properties.d.event.props.data = data;
    return properties;
}
/**
 * Sends an event to VWO (generic event sender).
 * @param properties - Query parameters for the request.
 * @param payload - The payload for the request.
 * @param eventName - The name of the event to send.
 * @returns A promise that resolves to the response from the server.
 */
function sendEvent(properties, payload, eventName) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredObject, networkInstance, retryConfig, baseUrl, protocol, port, request;
        return __generator(this, function (_a) {
            deferredObject = new PromiseUtil_1.Deferred();
            networkInstance = network_layer_1.NetworkManager.Instance;
            retryConfig = networkInstance.getRetryConfig();
            // disable retry for event (no retry for generic events)
            if (eventName === EventEnum_1.EventEnum.VWO_LOG_EVENT)
                retryConfig.shouldRetry = false;
            baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
            baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
            protocol = SettingsService_1.SettingsService.Instance.protocol;
            port = SettingsService_1.SettingsService.Instance.port;
            if (eventName === EventEnum_1.EventEnum.VWO_LOG_EVENT) {
                baseUrl = constants_1.Constants.HOST_NAME;
                protocol = constants_1.Constants.HTTPS_PROTOCOL;
                port = 443;
            }
            try {
                request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.EVENTS, properties, payload, null, protocol, port, retryConfig);
                request.setEventName(properties.en);
                // Perform the network POST request
                networkInstance
                    .post(request)
                    .then(function (response) {
                    // Resolve the deferred object with the data from the response
                    deferredObject.resolve(response.getData());
                })
                    .catch(function (err) {
                    // Reject the deferred object with the error response
                    deferredObject.reject(err);
                });
                return [2 /*return*/, deferredObject.promise];
            }
            catch (err) {
                // Resolve the promise with false as fallback
                deferredObject.resolve(false);
                return [2 /*return*/, deferredObject.promise];
            }
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=NetworkUtil.js.map