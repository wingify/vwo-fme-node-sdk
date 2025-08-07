"use strict";
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
const FunctionUtil_1 = require("./FunctionUtil");
const UuidUtil_1 = require("./UuidUtil");
const constants_1 = require("../constants");
const HeadersEnum_1 = require("../enums/HeadersEnum");
const HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
const UrlEnum_1 = require("../enums/UrlEnum");
const log_messages_1 = require("../enums/log-messages");
const logger_1 = require("../packages/logger");
const network_layer_1 = require("../packages/network-layer");
const SettingsService_1 = require("../services/SettingsService");
const DataTypeUtil_1 = require("./DataTypeUtil");
const LogMessageUtil_1 = require("./LogMessageUtil");
const UrlUtil_1 = require("./UrlUtil");
const PromiseUtil_1 = require("./PromiseUtil");
const UsageStatsUtil_1 = require("./UsageStatsUtil");
const EventEnum_1 = require("../enums/EventEnum");
/**
 * Constructs the settings path with API key and account ID.
 * @param {string} sdkKey - The API key.
 * @param {any} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The settings path including API key, random number, and account ID.
 */
function getSettingsPath(sdkKey, accountId) {
    const path = {
        i: `${sdkKey}`, // Inject API key
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
    const path = {
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
function getEventsBaseProperties(eventName, visitorUserAgent = '', ipAddress = '') {
    const sdkKey = SettingsService_1.SettingsService.Instance.sdkKey;
    const properties = Object.assign({
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
function _getEventBasePayload(settings, userId, eventName, visitorUserAgent = '', ipAddress = '') {
    const uuid = (0, UuidUtil_1.getUUID)(userId.toString(), SettingsService_1.SettingsService.Instance.accountId.toString());
    const sdkKey = SettingsService_1.SettingsService.Instance.sdkKey;
    const props = {
        vwo_sdkName: constants_1.Constants.SDK_NAME,
        vwo_sdkVersion: constants_1.Constants.SDK_VERSION,
        vwo_envKey: sdkKey,
    };
    const properties = {
        d: {
            msgId: `${uuid}-${(0, FunctionUtil_1.getCurrentUnixTimestampInMillis)()}`,
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
function getTrackUserPayloadData(settings, userId, eventName, campaignId, variationId, visitorUserAgent = '', ipAddress = '') {
    const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    properties.d.event.props.id = campaignId;
    properties.d.event.props.variation = variationId;
    properties.d.event.props.isFirst = 1;
    // add usageStats as a new meta key to properties.d.events.props.vwoMeta
    if (Object.keys(UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats()).length > 0) {
        properties.d.event.props.vwoMeta = UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats();
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
        accountId: settings.getAccountId(),
        userId,
        campaignId,
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
function getTrackGoalPayloadData(settings, userId, eventName, eventProperties, visitorUserAgent = '', ipAddress = '') {
    const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props.variation = 1; // Temporary value for variation
    properties.d.event.props.id = 1; // Temporary value for ID
    // Add custom event properties if provided
    if (eventProperties && (0, DataTypeUtil_1.isObject)(eventProperties) && Object.keys(eventProperties).length > 0) {
        for (const prop in eventProperties) {
            properties.d.event.props[prop] = eventProperties[prop];
        }
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_GOAL, {
        eventName,
        accountId: settings.getAccountId(),
        userId,
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
function getAttributePayloadData(settings, userId, eventName, attributes, visitorUserAgent = '', ipAddress = '') {
    const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = settings.getSdkkey(); // Set environment key
    // Iterate over the attributes map and append to the visitor properties
    for (const [key, value] of Object.entries(attributes)) {
        properties.d.visitor.props[key] = value;
    }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_SYNC_VISITOR_PROP, {
        eventName,
        accountId: settings.getAccountId(),
        userId,
    }));
    return properties;
}
/**
 * Sends a POST API request with the specified properties and payload.
 * @param {any} properties - Properties for the request.
 * @param {any} payload - Payload for the request.
 * @param {string} userId - User ID.
 */
async function sendPostApiRequest(properties, payload, userId) {
    const networkManager = network_layer_1.NetworkManager.Instance;
    networkManager.attachClient();
    const retryConfig = networkManager.getRetryConfig();
    const headers = {};
    const userAgent = payload.d.visitor_ua; // Extract user agent from payload
    const ipAddress = payload.d.visitor_ip; // Extract IP address from payload
    // Set headers if available
    if (userAgent)
        headers[HeadersEnum_1.HeadersEnum.USER_AGENT] = userAgent;
    if (ipAddress)
        headers[HeadersEnum_1.HeadersEnum.IP] = ipAddress;
    let baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
    baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
    const request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.EVENTS, properties, payload, headers, SettingsService_1.SettingsService.Instance.protocol, SettingsService_1.SettingsService.Instance.port, retryConfig);
    await network_layer_1.NetworkManager.Instance.post(request)
        .then(() => {
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
        .catch((err) => {
        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
            method: HttpMethodEnum_1.HttpMethodEnum.POST,
            err: (0, DataTypeUtil_1.isObject)(err) ? JSON.stringify(err) : err,
        }));
    });
}
// Flag to determine if the SDK should wait for a network response.
let shouldWaitForTrackingCalls = false;
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
function getMessagingEventPayload(messageType, message, eventName) {
    const userId = SettingsService_1.SettingsService.Instance.accountId + '_' + SettingsService_1.SettingsService.Instance.sdkKey;
    const properties = _getEventBasePayload(null, userId, eventName, null, null);
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = SettingsService_1.SettingsService.Instance.sdkKey; // Set environment key
    properties.d.event.props.product = 'fme';
    const data = {
        type: messageType,
        content: {
            title: message,
            dateTime: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
        },
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
    const userId = SettingsService_1.SettingsService.Instance.accountId + '_' + SettingsService_1.SettingsService.Instance.sdkKey;
    const properties = _getEventBasePayload(null, userId, eventName, null, null);
    // Set the required fields as specified
    properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = SettingsService_1.SettingsService.Instance.sdkKey;
    properties.d.event.props.product = 'fme';
    const data = {
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
async function sendEvent(properties, payload, eventName) {
    // Create a new deferred object to manage promise resolution
    const deferredObject = new PromiseUtil_1.Deferred();
    // Singleton instance of the network manager
    const networkInstance = network_layer_1.NetworkManager.Instance;
    const retryConfig = networkInstance.getRetryConfig();
    // disable retry for event (no retry for generic events)
    if (eventName === EventEnum_1.EventEnum.VWO_LOG_EVENT)
        retryConfig.shouldRetry = false;
    let baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
    baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
    let protocol = SettingsService_1.SettingsService.Instance.protocol;
    let port = SettingsService_1.SettingsService.Instance.port;
    if (eventName === EventEnum_1.EventEnum.VWO_LOG_EVENT) {
        baseUrl = constants_1.Constants.HOST_NAME;
        protocol = constants_1.Constants.HTTPS_PROTOCOL;
        port = 443;
    }
    try {
        // Create a new request model instance with the provided parameters
        const request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.EVENTS, properties, payload, null, protocol, port, retryConfig);
        // Perform the network POST request
        networkInstance
            .post(request)
            .then((response) => {
            // Resolve the deferred object with the data from the response
            deferredObject.resolve(response.getData());
        })
            .catch((err) => {
            // Reject the deferred object with the error response
            deferredObject.reject(err);
        });
        return deferredObject.promise;
    }
    catch (err) {
        // Resolve the promise with false as fallback
        deferredObject.resolve(false);
        return deferredObject.promise;
    }
}
//# sourceMappingURL=NetworkUtil.js.map