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
import { getCurrentUnixTimestamp, getCurrentUnixTimestampInMillis, getFormattedErrorMessage, getRandomNumber, } from './FunctionUtil.js';
import { getRandomUUID, getUUID } from './UuidUtil.js';
import { Constants } from '../constants/index.js';
import { HeadersEnum } from '../enums/HeadersEnum.js';
import { HttpMethodEnum } from '../enums/HttpMethodEnum.js';
import { UrlEnum } from '../enums/UrlEnum.js';
import { DebugLogMessagesEnum, ErrorLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { LogLevelEnum } from '../packages/logger/index.js';
import { RequestModel } from '../packages/network-layer/index.js';
import { isObject } from './DataTypeUtil.js';
import { buildMessage } from './LogMessageUtil.js';
import { Deferred } from './PromiseUtil.js';
import { EventEnum } from '../enums/EventEnum.js';
import { DebuggerCategoryEnum } from '../enums/DebuggerCategoryEnum.js';
import { sendDebugEventToVWO } from './DebuggerServiceUtil.js';
import { ApiEnum } from '../enums/ApiEnum.js';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum.js';
/**
 * Constructs the settings path with API key and account ID.
 * @param {string} sdkKey - The API key.
 * @param {any} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The settings path including API key, random number, and account ID.
 */
export function getSettingsPath(sdkKey, accountId) {
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
export function getTrackEventPath(event, accountId, userId) {
    const path = {
        event_type: event, // Type of the event
        account_id: accountId, // Account ID
        uId: userId, // User ID
        u: getUUID(userId, accountId), // UUID generated for the user
        sdk: Constants.SDK_NAME, // SDK name constant
        'sdk-v': Constants.SDK_VERSION, // SDK version
        random: getRandomNumber(), // Random number for uniqueness
        ap: Constants.PLATFORM, // Application platform
        sId: getCurrentUnixTimestamp(), // Session ID
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
export function getEventsBaseProperties(settingsService, eventName, visitorUserAgent = '', ipAddress = '', isUsageStatsEvent = false, usageStatsAccountId = null) {
    const properties = Object.assign({
        en: eventName,
        a: settingsService.accountId.toString(),
        eTime: getCurrentUnixTimestampInMillis(),
        random: getRandomNumber(),
        p: 'FS',
        visitor_ua: visitorUserAgent,
        visitor_ip: ipAddress,
        sn: Constants.SDK_NAME,
        sv: Constants.SDK_VERSION,
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
export function _getEventBasePayload(settingsService, userId, eventName, visitorUserAgent = '', ipAddress = '', isUsageStatsEvent = false, usageStatsAccountId = null, shouldGenerateUUID = true) {
    let accountId = settingsService.accountId;
    if (isUsageStatsEvent) {
        // set account id for internal usage stats event
        accountId = usageStatsAccountId;
    }
    let uuid;
    if (shouldGenerateUUID) {
        uuid = getUUID(userId.toString(), accountId.toString());
    }
    else {
        uuid = userId.toString();
    }
    const props = {
        vwo_sdkName: Constants.SDK_NAME,
        vwo_sdkVersion: Constants.SDK_VERSION,
    };
    if (!isUsageStatsEvent) {
        // set env key for standard sdk events
        props.vwo_envKey = settingsService.sdkKey;
    }
    const properties = {
        d: {
            msgId: `${uuid}-${getCurrentUnixTimestampInMillis()}`,
            visId: uuid,
            sessionId: getCurrentUnixTimestamp(),
            visitor_ua: visitorUserAgent,
            visitor_ip: ipAddress,
            event: {
                props: props,
                name: eventName,
                time: getCurrentUnixTimestampInMillis(),
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
export function getTrackUserPayloadData(serviceContainer, eventName, campaignId, variationId, context) {
    const userId = context.getId();
    const visitorUserAgent = context.getUserAgent();
    const ipAddress = context.getIpAddress();
    const customVariables = context.getCustomVariables();
    const postSegmentationVariables = context.getPostSegmentationVariables();
    const properties = _getEventBasePayload(serviceContainer.getSettingsService(), userId, eventName, visitorUserAgent, ipAddress);
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
        for (const key of postSegmentationVariables) {
            if (customVariables[key]) {
                properties.d.visitor.props[key] = customVariables[key];
            }
        }
    }
    // Add IP address as a standard attribute if available
    if (ipAddress) {
        properties.d.visitor.props.ip = ipAddress;
    }
    serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
        accountId: serviceContainer.getSettingsService().accountId.toString(),
        userId,
        campaignId,
    }));
    return properties;
}
/**
 * Constructs the payload data for tracking goals with custom event properties.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {string} eventName - Name of the event.
 * @param {any} eventProperties - Custom properties for the event.
 * @param {ContextModel} context - The context model instance.
 * @returns {any} - The constructed payload data.
 */
export function getTrackGoalPayloadData(serviceContainer, eventName, eventProperties, context) {
    const properties = _getEventBasePayload(serviceContainer.getSettingsService(), context.getId(), eventName, context.getUserAgent(), context.getIpAddress());
    if (context.getSessionId() !== 0) {
        properties.d.sessionId = context.getSessionId();
    }
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props.variation = 1; // Temporary value for variation
    properties.d.event.props.id = 1; // Temporary value for ID
    // Add custom event properties if provided
    if (eventProperties && isObject(eventProperties) && Object.keys(eventProperties).length > 0) {
        for (const prop in eventProperties) {
            properties.d.event.props[prop] = eventProperties[prop];
        }
    }
    serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_GOAL, {
        eventName,
        accountId: serviceContainer.getSettingsService().accountId.toString(),
        userId: context.getId(),
    }));
    return properties;
}
/**
 * Constructs the payload data for syncing multiple visitor attributes.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {string} eventName - Event name.
 * @param {Record<string, any>} attributes - Key-value map of attributes.
 * @param {ContextModel} context - The context model instance.
 * @returns {Record<string, any>} - Payload object to be sent in the request.
 */
export function getAttributePayloadData(serviceContainer, eventName, attributes, context) {
    const properties = _getEventBasePayload(serviceContainer.getSettingsService(), context.getId(), eventName, context.getUserAgent(), context.getIpAddress());
    if (context.getSessionId() !== 0) {
        properties.d.sessionId = context.getSessionId();
    }
    properties.d.event.props.isCustomEvent = true; // Mark as a custom event
    properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = serviceContainer.getSettingsService().sdkKey; // Set environment key
    // Iterate over the attributes map and append to the visitor properties
    for (const [key, value] of Object.entries(attributes)) {
        properties.d.visitor.props[key] = value;
    }
    serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.IMPRESSION_FOR_SYNC_VISITOR_PROP, {
        eventName,
        accountId: serviceContainer.getSettingsService().accountId.toString(),
        userId: context.getId(),
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
export async function sendPostApiRequest(serviceContainer, properties, payload, userId, eventProperties = {}, campaignInfo = {}) {
    const retryConfig = serviceContainer.getNetworkManager().getRetryConfig();
    const headers = {};
    const userAgent = payload.d.visitor_ua; // Extract user agent from payload
    const ipAddress = payload.d.visitor_ip; // Extract IP address from payload
    // Set headers if available
    if (userAgent)
        headers[HeadersEnum.USER_AGENT] = userAgent;
    if (ipAddress)
        headers[HeadersEnum.IP] = ipAddress;
    const request = new RequestModel(serviceContainer.getSettingsService().hostname, HttpMethodEnum.POST, serviceContainer.getUpdatedEndpointWithCollectionPrefix(UrlEnum.EVENTS), properties, payload, headers, serviceContainer.getSettingsService().protocol, serviceContainer.getSettingsService().port, retryConfig);
    request.setEventName(properties.en);
    request.setUuid(payload.d.visId);
    let apiName;
    let extraDataForMessage;
    if (properties.en === EventEnum.VWO_VARIATION_SHOWN) {
        apiName = ApiEnum.GET_FLAG;
        if (campaignInfo.campaignType === CampaignTypeEnum.ROLLOUT ||
            campaignInfo.campaignType === CampaignTypeEnum.PERSONALIZE) {
            extraDataForMessage = `feature: ${campaignInfo.featureKey}, rule: ${campaignInfo.variationName}`;
        }
        else {
            extraDataForMessage = `feature: ${campaignInfo.featureKey}, rule: ${campaignInfo.campaignKey} and variation: ${campaignInfo.variationName}`;
        }
        request.setCampaignId(payload.d.event.props.id);
    }
    else if (properties.en != EventEnum.VWO_VARIATION_SHOWN) {
        if (properties.en === EventEnum.VWO_SYNC_VISITOR_PROP) {
            apiName = ApiEnum.SET_ATTRIBUTE;
            extraDataForMessage = apiName;
        }
        else if (properties.en !== EventEnum.VWO_DEBUGGER_EVENT &&
            properties.en !== EventEnum.VWO_LOG_EVENT &&
            properties.en !== EventEnum.VWO_INIT_CALLED) {
            apiName = ApiEnum.TRACK_EVENT;
            extraDataForMessage = `event: ${properties.en}`;
        }
        if (Object.keys(eventProperties).length > 0) {
            request.setEventProperties(eventProperties);
        }
    }
    await serviceContainer
        .getNetworkManager()
        .post(request)
        .then((response) => {
        // if attempt is more than 0
        if (response.getTotalAttempts() > 0) {
            const debugEventProps = createNetWorkAndRetryDebugEvent(response, payload, apiName, extraDataForMessage);
            debugEventProps.uuid = request.getUuid();
            // send debug event
            sendDebugEventToVWO(serviceContainer, debugEventProps);
        }
        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.NETWORK_CALL_SUCCESS, {
            event: properties.en,
            endPoint: UrlEnum.EVENTS,
            accountId: serviceContainer.getSettingsService().accountId.toString(),
            userId: userId,
            uuid: payload.d.visId,
        }));
    })
        .catch((err) => {
        const debugEventProps = createNetWorkAndRetryDebugEvent(err, payload, apiName, extraDataForMessage);
        debugEventProps.uuid = request.getUuid();
        sendDebugEventToVWO(serviceContainer, debugEventProps);
        serviceContainer.getLogManager().errorLog('NETWORK_CALL_FAILED', {
            method: HttpMethodEnum.POST,
            err: getFormattedErrorMessage(err),
        }, {}, false);
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
export function getMessagingEventPayload(settingsService, messageType, message, eventName, extraData = {}) {
    const userId = settingsService.accountId + '_' + settingsService.sdkKey;
    const properties = _getEventBasePayload(settingsService, userId, eventName);
    properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = settingsService.sdkKey; // Set environment key
    properties.d.event.props.product = Constants.PRODUCT_NAME;
    const data = {
        type: messageType,
        content: {
            title: message,
            dateTime: getCurrentUnixTimestampInMillis(),
        },
        metaInfo: { ...extraData },
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
export function getSDKInitEventPayload(settingsService, eventName, settingsFetchTime, sdkInitTime) {
    const userId = settingsService.accountId + '_' + settingsService.sdkKey;
    const properties = _getEventBasePayload(settingsService, userId, eventName);
    // Set the required fields as specified
    properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = settingsService.sdkKey;
    properties.d.event.props.product = Constants.PRODUCT_NAME;
    const data = {
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
export function getSDKUsageStatsEventPayload(settingsService, eventName, usageStatsAccountId, usageStatsUtil) {
    const userId = settingsService.accountId + '_' + settingsService.sdkKey;
    const properties = _getEventBasePayload(settingsService, userId, eventName, '', '', true, usageStatsAccountId);
    // Set the required fields as specified
    properties.d.event.props.product = Constants.PRODUCT_NAME;
    properties.d.event.props.vwoMeta = usageStatsUtil.getUsageStats();
    return properties;
}
/**
 * Constructs the payload for debugger event.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param eventProps - The properties for the event.
 * @returns The constructed payload.
 */
export function getDebuggerEventPayload(settingsService, eventProps = {}) {
    let uuid;
    const accountId = settingsService.accountId.toString();
    const sdkKey = settingsService.sdkKey;
    // generate uuid if not present
    if (!eventProps.uuid) {
        uuid = getUUID(accountId + '_' + sdkKey, accountId);
        eventProps.uuid = uuid;
    }
    else {
        uuid = eventProps.uuid;
    }
    // create standard event payload
    const properties = _getEventBasePayload(settingsService, uuid, EventEnum.VWO_DEBUGGER_EVENT, '', '', false, null, false);
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
        eventProps.an = EventEnum.VWO_DEBUGGER_EVENT;
    }
    // add all debugger props inside vwoMeta
    properties.d.event.props.vwoMeta = {
        ...eventProps,
        a: settingsService.accountId.toString(),
        product: Constants.PRODUCT_NAME,
        sn: Constants.SDK_NAME,
        sv: Constants.SDK_VERSION,
        eventId: getRandomUUID(settingsService.sdkKey),
    };
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
export async function sendEvent(serviceContainer, properties, payload, eventName) {
    // Create a new deferred object to manage promise resolution
    const deferredObject = new Deferred();
    const retryConfig = serviceContainer.getNetworkManager().getRetryConfig();
    // disable retry for event (no retry for generic events)
    if (eventName === EventEnum.VWO_DEBUGGER_EVENT)
        retryConfig.shouldRetry = false;
    try {
        // Create a new request model instance with the provided parameters
        const request = new RequestModel(serviceContainer.getSettingsService().hostname, HttpMethodEnum.POST, serviceContainer.getUpdatedEndpointWithCollectionPrefix(UrlEnum.EVENTS), properties, payload, null, serviceContainer.getSettingsService().protocol, serviceContainer.getSettingsService().port, retryConfig);
        request.setEventName(properties.en);
        // Perform the network POST request
        serviceContainer
            .getNetworkManager()
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
/**
 * Creates a network and retry debug event.
 * @param response The response model.
 * @param payload The payload for the request.
 * @param apiName The name of the API.
 * @param extraData Extra data for the message.
 * @param isBatchingDebugEvent Whether the debug event was triggered due to batching.
 * @returns The debug event properties.
 */
export function createNetWorkAndRetryDebugEvent(response, payload, apiName, extraData) {
    try {
        // set category, if call got success then category is retry, otherwise network
        let category = DebuggerCategoryEnum.RETRY;
        let msg_t = Constants.NETWORK_CALL_SUCCESS_WITH_RETRIES;
        let msg = buildMessage(InfoLogMessagesEnum.NETWORK_CALL_SUCCESS_WITH_RETRIES, {
            extraData: extraData,
            attempts: response.getTotalAttempts(),
            err: getFormattedErrorMessage(response.getError()),
        });
        let lt = LogLevelEnum.INFO.toString();
        if (response.getStatusCode() !== 200) {
            category = DebuggerCategoryEnum.NETWORK;
            msg_t = Constants.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES;
            msg = buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES, {
                extraData: extraData,
                attempts: response.getTotalAttempts(),
                err: getFormattedErrorMessage(response.getError()),
            });
            lt = LogLevelEnum.ERROR.toString();
        }
        const debugEventProps = {
            cg: category,
            msg_t: msg_t,
            msg: msg,
            lt: lt,
        };
        if (apiName) {
            debugEventProps.an = apiName;
        }
        if (payload?.d?.sessionId) {
            debugEventProps.sId = payload.d.sessionId;
        }
        else {
            debugEventProps.sId = getCurrentUnixTimestamp();
        }
        return debugEventProps;
    }
    catch (err) {
        return {
            cg: DebuggerCategoryEnum.NETWORK,
            an: apiName,
            msg_t: 'NETWORK_CALL_FAILED',
            msg: buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
                method: extraData,
                err: getFormattedErrorMessage(err),
            }),
            lt: LogLevelEnum.ERROR.toString(),
            sId: getCurrentUnixTimestamp(),
        };
    }
}
//# sourceMappingURL=NetworkUtil.js.map