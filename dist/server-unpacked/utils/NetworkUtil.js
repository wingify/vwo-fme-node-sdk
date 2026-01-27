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
exports.getMessagingEventPayload = getMessagingEventPayload;
exports.getSDKInitEventPayload = getSDKInitEventPayload;
exports.getSDKUsageStatsEventPayload = getSDKUsageStatsEventPayload;
exports.getDebuggerEventPayload = getDebuggerEventPayload;
exports.sendEvent = sendEvent;
exports.createNetWorkAndRetryDebugEvent = createNetWorkAndRetryDebugEvent;
/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
var DataTypeUtil_1 = require("./DataTypeUtil");
var LogMessageUtil_1 = require("./LogMessageUtil");
var PromiseUtil_1 = require("./PromiseUtil");
var EventEnum_1 = require("../enums/EventEnum");
var DebuggerCategoryEnum_1 = require("../enums/DebuggerCategoryEnum");
var DebuggerServiceUtil_1 = require("./DebuggerServiceUtil");
var ApiEnum_1 = require("../enums/ApiEnum");
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
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
 * @param {SettingsService} settingsService - The settings service instance.
 * @param {String} eventName
 * @param {String} visitorUserAgent - The visitor user agent.
 * @param {String} ipAddress - The visitor IP address.
 * @param {Boolean} isUsageStatsEvent - Whether the event is a usage stats event.
 * @param {Number} usageStatsAccountId - The usage stats account ID.
 * @returns {Record<string, any>} - The properties for the event.
 */
function getEventsBaseProperties(settingsService, eventName, visitorUserAgent, ipAddress, isUsageStatsEvent, usageStatsAccountId) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    if (isUsageStatsEvent === void 0) { isUsageStatsEvent = false; }
    if (usageStatsAccountId === void 0) { usageStatsAccountId = null; }
    var properties = Object.assign({
        en: eventName,
        a: settingsService.accountId.toString(),
        eTime: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
        random: (0, FunctionUtil_1.getRandomNumber)(),
        p: 'FS',
        visitor_ua: visitorUserAgent,
        visitor_ip: ipAddress,
        sn: constants_1.Constants.SDK_NAME,
        sv: constants_1.Constants.SDK_VERSION,
    });
    if (!isUsageStatsEvent) {
        // set env key for standard sdk events
        properties.env = settingsService.sdkKey;
    }
    else {
        // set account id for internal usage stats event
        properties.a = usageStatsAccountId;
    }
    return properties;
}
/**
 * Builds generic payload required by all the different tracking calls.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param {String} userId     user id
 * @param {String} eventName  event name
 * @param {String} visitorUserAgent - The visitor user agent.
 * @param {String} ipAddress - The visitor IP address.
 * @param {Boolean} isUsageStatsEvent - Whether the event is a usage stats event.
 * @param {Number} usageStatsAccountId - The usage stats account ID.
 * @param {Boolean} shouldGenerateUUID - Whether to generate a UUID.
 * @returns {Record<string, any>} - The payload for the event.
 */
function _getEventBasePayload(settingsService, userId, eventName, visitorUserAgent, ipAddress, isUsageStatsEvent, usageStatsAccountId, shouldGenerateUUID) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    if (isUsageStatsEvent === void 0) { isUsageStatsEvent = false; }
    if (usageStatsAccountId === void 0) { usageStatsAccountId = null; }
    if (shouldGenerateUUID === void 0) { shouldGenerateUUID = true; }
    var accountId = settingsService.accountId;
    if (isUsageStatsEvent) {
        // set account id for internal usage stats event
        accountId = usageStatsAccountId;
    }
    var uuid;
    if (shouldGenerateUUID) {
        uuid = (0, UuidUtil_1.getUUID)(userId.toString(), accountId.toString());
    }
    else {
        uuid = userId.toString();
    }
    var props = {
        vwo_sdkName: constants_1.Constants.SDK_NAME,
        vwo_sdkVersion: constants_1.Constants.SDK_VERSION,
    };
    if (!isUsageStatsEvent) {
        // set env key for standard sdk events
        props.vwo_envKey = settingsService.sdkKey;
    }
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
        },
    };
    if (!isUsageStatsEvent) {
        // set visitor props for standard sdk events
        properties.d.visitor = {
            props: {
                vwo_fs_environment: settingsService.sdkKey,
            },
        };
    }
    return properties;
}
/**
 * Builds payload to track the visitor.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {String} eventName - The name of the event.
 * @param {Number} campaignId - The campaign ID.
 * @param {Number} variationId - The variation ID.
 * @param {ContextModel} context - The context model instance.
 * @returns {Record<string, any>} - The payload for the event.
 */
function getTrackUserPayloadData(serviceContainer, eventName, campaignId, variationId, context) {
    var userId = context.getId();
    var visitorUserAgent = context.getUserAgent();
    var ipAddress = context.getIpAddress();
    var customVariables = context.getCustomVariables();
    var postSegmentationVariables = context.getPostSegmentationVariables();
    var properties = _getEventBasePayload(serviceContainer.getSettingsService(), userId, eventName, visitorUserAgent, ipAddress);
    if (context.getSessionId() !== 0) {
        properties.d.sessionId = context.getSessionId();
    }
    properties.d.event.props.id = campaignId;
    properties.d.event.props.variation = variationId;
    properties.d.event.props.isFirst = 1;
    // Add post-segmentation variables if they exist in custom variables
    if (postSegmentationVariables &&
        postSegmentationVariables.length > 0 &&
        customVariables &&
        Object.keys(customVariables).length > 0) {
        for (var _i = 0, postSegmentationVariables_1 = postSegmentationVariables; _i < postSegmentationVariables_1.length; _i++) {
            var key = postSegmentationVariables_1[_i];
            if (customVariables[key]) {
                properties.d.visitor.props[key] = customVariables[key];
            }
        }
    }
    // Add IP address as a standard attribute if available
    if (ipAddress) {
        properties.d.visitor.props.ip = ipAddress;
    }
    serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
        accountId: serviceContainer.getSettingsService().accountId.toString(),
        userId: userId,
        campaignId: campaignId,
    }));
    return properties;
}
/**
 * Constructs the payload data for tracking goals with custom event properties.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {any} userId - User identifier.
 * @param {string} eventName - Name of the event.
 * @param {any} eventProperties - Custom properties for the event.
 * @param {string} [visitorUserAgent=''] - Visitor's user agent.
 * @param {string} [ipAddress=''] - Visitor's IP address.
 * @returns {any} - The constructed payload data.
 */
function getTrackGoalPayloadData(serviceContainer, userId, eventName, eventProperties, visitorUserAgent, ipAddress, sessionId) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    if (sessionId === void 0) { sessionId = 0; }
    var properties = _getEventBasePayload(serviceContainer.getSettingsService(), userId, eventName, visitorUserAgent, ipAddress);
    if (sessionId !== 0) {
        properties.d.sessionId = sessionId;
    }
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props.variation = 1; // Temporary value for variation
    properties.d.event.props.id = 1; // Temporary value for ID
    // Add custom event properties if provided
    if (eventProperties && (0, DataTypeUtil_1.isObject)(eventProperties) && Object.keys(eventProperties).length > 0) {
        for (var prop in eventProperties) {
            properties.d.event.props[prop] = eventProperties[prop];
        }
    }
    serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_GOAL, {
        eventName: eventName,
        accountId: serviceContainer.getSettingsService().accountId.toString(),
        userId: userId,
    }));
    return properties;
}
/**
 * Constructs the payload data for syncing multiple visitor attributes.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {string | number} userId - User ID.
 * @param {string} eventName - Event name.
 * @param {Record<string, any>} attributes - Key-value map of attributes.
 * @param {string} [visitorUserAgent=''] - Visitor's User-Agent (optional).
 * @param {string} [ipAddress=''] - Visitor's IP Address (optional).
 * @returns {Record<string, any>} - Payload object to be sent in the request.
 */
function getAttributePayloadData(serviceContainer, userId, eventName, attributes, visitorUserAgent, ipAddress, sessionId) {
    if (visitorUserAgent === void 0) { visitorUserAgent = ''; }
    if (ipAddress === void 0) { ipAddress = ''; }
    if (sessionId === void 0) { sessionId = 0; }
    var properties = _getEventBasePayload(serviceContainer.getSettingsService(), userId, eventName, visitorUserAgent, ipAddress);
    if (sessionId !== 0) {
        properties.d.sessionId = sessionId;
    }
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = serviceContainer.getSettingsService().sdkKey; // Set environment key
    // Iterate over the attributes map and append to the visitor properties
    for (var _i = 0, _a = Object.entries(attributes); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        properties.d.visitor.props[key] = value;
    }
    serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_SYNC_VISITOR_PROP, {
        eventName: eventName,
        accountId: serviceContainer.getSettingsService().accountId.toString(),
        userId: userId,
    }));
    return properties;
}
/**
 * Sends a POST API request with the specified properties and payload.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {any} properties - Properties for the request.
 * @param {any} payload - Payload for the request.
 * @param {string} userId - User ID.
 */
function sendPostApiRequest(serviceContainer_1, properties_1, payload_1, userId_1) {
    return __awaiter(this, arguments, void 0, function (serviceContainer, properties, payload, userId, eventProperties, campaignInfo) {
        var retryConfig, headers, userAgent, ipAddress, request, apiName, extraDataForMessage;
        if (eventProperties === void 0) { eventProperties = {}; }
        if (campaignInfo === void 0) { campaignInfo = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retryConfig = serviceContainer.getNetworkManager().getRetryConfig();
                    headers = {};
                    userAgent = payload.d.visitor_ua;
                    ipAddress = payload.d.visitor_ip;
                    // Set headers if available
                    if (userAgent)
                        headers[HeadersEnum_1.HeadersEnum.USER_AGENT] = userAgent;
                    if (ipAddress)
                        headers[HeadersEnum_1.HeadersEnum.IP] = ipAddress;
                    request = new network_layer_1.RequestModel(serviceContainer.getSettingsService().hostname, HttpMethodEnum_1.HttpMethodEnum.POST, serviceContainer.getUpdatedEndpointWithCollectionPrefix(UrlEnum_1.UrlEnum.EVENTS), properties, payload, headers, serviceContainer.getSettingsService().protocol, serviceContainer.getSettingsService().port, retryConfig);
                    request.setEventName(properties.en);
                    request.setUuid(payload.d.visId);
                    if (properties.en === EventEnum_1.EventEnum.VWO_VARIATION_SHOWN) {
                        apiName = ApiEnum_1.ApiEnum.GET_FLAG;
                        if (campaignInfo.campaignType === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT ||
                            campaignInfo.campaignType === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                            extraDataForMessage = "feature: ".concat(campaignInfo.featureKey, ", rule: ").concat(campaignInfo.variationName);
                        }
                        else {
                            extraDataForMessage = "feature: ".concat(campaignInfo.featureKey, ", rule: ").concat(campaignInfo.campaignKey, " and variation: ").concat(campaignInfo.variationName);
                        }
                        request.setCampaignId(payload.d.event.props.id);
                    }
                    else if (properties.en != EventEnum_1.EventEnum.VWO_VARIATION_SHOWN) {
                        if (properties.en === EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP) {
                            apiName = ApiEnum_1.ApiEnum.SET_ATTRIBUTE;
                            extraDataForMessage = apiName;
                        }
                        else if (properties.en !== EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT &&
                            properties.en !== EventEnum_1.EventEnum.VWO_LOG_EVENT &&
                            properties.en !== EventEnum_1.EventEnum.VWO_INIT_CALLED) {
                            apiName = ApiEnum_1.ApiEnum.TRACK_EVENT;
                            extraDataForMessage = "event: ".concat(properties.en);
                        }
                        if (Object.keys(eventProperties).length > 0) {
                            request.setEventProperties(eventProperties);
                        }
                    }
                    return [4 /*yield*/, serviceContainer
                            .getNetworkManager()
                            .post(request)
                            .then(function (response) {
                            // if attempt is more than 0
                            if (response.getTotalAttempts() > 0) {
                                var debugEventProps = createNetWorkAndRetryDebugEvent(response, payload, apiName, extraDataForMessage);
                                debugEventProps.uuid = request.getUuid();
                                // send debug event
                                (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(serviceContainer, debugEventProps);
                            }
                            serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.NETWORK_CALL_SUCCESS, {
                                event: properties.en,
                                endPoint: UrlEnum_1.UrlEnum.EVENTS,
                                accountId: serviceContainer.getSettingsService().accountId.toString(),
                                userId: userId,
                                uuid: payload.d.visId,
                            }));
                        })
                            .catch(function (err) {
                            var debugEventProps = createNetWorkAndRetryDebugEvent(err, payload, apiName, extraDataForMessage);
                            debugEventProps.uuid = request.getUuid();
                            (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(serviceContainer, debugEventProps);
                            serviceContainer.getLogManager().errorLog('NETWORK_CALL_FAILED', {
                                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
                            }, {}, false);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Constructs the payload for a messaging event.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param messageType - The type of the message.
 * @param message - The message to send.
 * @param eventName - The name of the event.
 * @returns The constructed payload.
 */
function getMessagingEventPayload(settingsService, messageType, message, eventName, extraData) {
    if (extraData === void 0) { extraData = {}; }
    var userId = settingsService.accountId + '_' + settingsService.sdkKey;
    var properties = _getEventBasePayload(settingsService, userId, eventName);
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = settingsService.sdkKey; // Set environment key
    properties.d.event.props.product = constants_1.Constants.PRODUCT_NAME;
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
 * @param {SettingsService} settingsService - The settings service instance.
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
function getSDKInitEventPayload(settingsService, eventName, settingsFetchTime, sdkInitTime) {
    var userId = settingsService.accountId + '_' + settingsService.sdkKey;
    var properties = _getEventBasePayload(settingsService, userId, eventName);
    // Set the required fields as specified
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = settingsService.sdkKey;
    properties.d.event.props.product = constants_1.Constants.PRODUCT_NAME;
    var data = {
        isSDKInitialized: true,
        settingsFetchTime: settingsFetchTime,
        sdkInitTime: sdkInitTime,
    };
    properties.d.event.props.data = data;
    return properties;
}
/**
 * Constructs the payload for sdk usage stats event.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
function getSDKUsageStatsEventPayload(settingsService, eventName, usageStatsAccountId, usageStatsUtil) {
    var userId = settingsService.accountId + '_' + settingsService.sdkKey;
    var properties = _getEventBasePayload(settingsService, userId, eventName, '', '', true, usageStatsAccountId);
    // Set the required fields as specified
    properties.d.event.props.product = constants_1.Constants.PRODUCT_NAME;
    properties.d.event.props.vwoMeta = usageStatsUtil.getUsageStats();
    return properties;
}
/**
 * Constructs the payload for debugger event.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param eventProps - The properties for the event.
 * @returns The constructed payload.
 */
function getDebuggerEventPayload(settingsService, eventProps) {
    if (eventProps === void 0) { eventProps = {}; }
    var uuid;
    var accountId = settingsService.accountId.toString();
    var sdkKey = settingsService.sdkKey;
    // generate uuid if not present
    if (!eventProps.uuid) {
        uuid = (0, UuidUtil_1.getUUID)(accountId + '_' + sdkKey, accountId);
        eventProps.uuid = uuid;
    }
    else {
        uuid = eventProps.uuid;
    }
    // create standard event payload
    var properties = _getEventBasePayload(settingsService, uuid, EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT, '', '', false, null, false);
    properties.d.event.props = {};
    // add session id to the event props if not present
    if (eventProps.sId) {
        properties.d.sessionId = eventProps.sId;
    }
    else {
        eventProps.sId = properties.d.sessionId;
    }
    // add a safety check for apiName
    if (!eventProps.an) {
        eventProps.an = EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT;
    }
    // add all debugger props inside vwoMeta
    properties.d.event.props.vwoMeta = __assign(__assign({}, eventProps), { a: settingsService.accountId.toString(), product: constants_1.Constants.PRODUCT_NAME, sn: constants_1.Constants.SDK_NAME, sv: constants_1.Constants.SDK_VERSION, eventId: (0, UuidUtil_1.getRandomUUID)(settingsService.sdkKey) });
    return properties;
}
/**
 * Sends an event to VWO (generic event sender).
 * @param {NetworkManager} networkManager - The network manager instance.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param properties - Query parameters for the request.
 * @param payload - The payload for the request.
 * @param eventName - The name of the event to send.
 * @returns A promise that resolves to the response from the server.
 */
function sendEvent(serviceContainer, properties, payload, eventName) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredObject, retryConfig, request;
        return __generator(this, function (_a) {
            deferredObject = new PromiseUtil_1.Deferred();
            retryConfig = serviceContainer.getNetworkManager().getRetryConfig();
            // disable retry for event (no retry for generic events)
            if (eventName === EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT)
                retryConfig.shouldRetry = false;
            try {
                request = new network_layer_1.RequestModel(serviceContainer.getSettingsService().hostname, HttpMethodEnum_1.HttpMethodEnum.POST, serviceContainer.getUpdatedEndpointWithCollectionPrefix(UrlEnum_1.UrlEnum.EVENTS), properties, payload, null, serviceContainer.getSettingsService().protocol, serviceContainer.getSettingsService().port, retryConfig);
                request.setEventName(properties.en);
                // Perform the network POST request
                serviceContainer
                    .getNetworkManager()
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
/**
 * Creates a network and retry debug event.
 * @param response The response model.
 * @param payload The payload for the request.
 * @param apiName The name of the API.
 * @param extraData Extra data for the message.
 * @param isBatchingDebugEvent Whether the debug event was triggered due to batching.
 * @returns The debug event properties.
 */
function createNetWorkAndRetryDebugEvent(response, payload, apiName, extraData) {
    var _a;
    try {
        // set category, if call got success then category is retry, otherwise network
        var category = DebuggerCategoryEnum_1.DebuggerCategoryEnum.RETRY;
        var msg_t = constants_1.Constants.NETWORK_CALL_SUCCESS_WITH_RETRIES;
        var msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.NETWORK_CALL_SUCCESS_WITH_RETRIES, {
            extraData: extraData,
            attempts: response.getTotalAttempts(),
            err: (0, FunctionUtil_1.getFormattedErrorMessage)(response.getError()),
        });
        var lt = logger_1.LogLevelEnum.INFO.toString();
        if (response.getStatusCode() !== 200) {
            category = DebuggerCategoryEnum_1.DebuggerCategoryEnum.NETWORK;
            msg_t = constants_1.Constants.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES;
            msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES, {
                extraData: extraData,
                attempts: response.getTotalAttempts(),
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(response.getError()),
            });
            lt = logger_1.LogLevelEnum.ERROR.toString();
        }
        var debugEventProps = {
            cg: category,
            msg_t: msg_t,
            msg: msg,
            lt: lt,
        };
        if (apiName) {
            debugEventProps.an = apiName;
        }
        if ((_a = payload === null || payload === void 0 ? void 0 : payload.d) === null || _a === void 0 ? void 0 : _a.sessionId) {
            debugEventProps.sId = payload.d.sessionId;
        }
        else {
            debugEventProps.sId = (0, FunctionUtil_1.getCurrentUnixTimestamp)();
        }
        return debugEventProps;
    }
    catch (err) {
        return {
            cg: DebuggerCategoryEnum_1.DebuggerCategoryEnum.NETWORK,
            an: apiName,
            msg_t: 'NETWORK_CALL_FAILED',
            msg: (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
                method: extraData,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }),
            lt: logger_1.LogLevelEnum.ERROR.toString(),
            sId: (0, FunctionUtil_1.getCurrentUnixTimestamp)(),
        };
    }
}
//# sourceMappingURL=NetworkUtil.js.map