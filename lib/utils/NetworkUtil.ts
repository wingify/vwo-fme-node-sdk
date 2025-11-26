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
import {
  getCurrentUnixTimestamp,
  getCurrentUnixTimestampInMillis,
  getFormattedErrorMessage,
  getRandomNumber,
} from './FunctionUtil';
import { getRandomUUID, getUUID } from './UuidUtil';

import { Constants } from '../constants';
import { HeadersEnum } from '../enums/HeadersEnum';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { UrlEnum } from '../enums/UrlEnum';
import { DebugLogMessagesEnum, ErrorLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { SettingsModel } from '../models/settings/SettingsModel';
import { LogLevelEnum, LogManager } from '../packages/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../packages/network-layer';
import { SettingsService } from '../services/SettingsService';
import { dynamic } from '../types/Common';
import { isObject } from './DataTypeUtil';
import { buildMessage } from './LogMessageUtil';
import { UrlUtil } from './UrlUtil';
import { Deferred } from './PromiseUtil';
import { UsageStatsUtil } from './UsageStatsUtil';
import { IRetryConfig } from '../packages/network-layer/client/NetworkClient';
import { EventEnum } from '../enums/EventEnum';
import { ContextModel } from '../models/user/ContextModel';
import { DebuggerCategoryEnum } from '../enums/DebuggerCategoryEnum';
import { sendDebugEventToVWO } from './DebuggerServiceUtil';
import { ApiEnum } from '../enums/ApiEnum';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';

/**
 * Constructs the settings path with API key and account ID.
 * @param {string} sdkKey - The API key.
 * @param {any} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The settings path including API key, random number, and account ID.
 */
export function getSettingsPath(sdkKey: string, accountId: string | number): Record<string, dynamic> {
  const path: Record<string, dynamic> = {
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
export function getTrackEventPath(event: string, accountId: string, userId: string): Record<string, dynamic> {
  const path: Record<string, dynamic> = {
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
 * @param {Object} configObj
 * @param {String} eventName
 * @returns properties
 */
export function getEventsBaseProperties(
  eventName: string,
  visitorUserAgent: string = '',
  ipAddress: string = '',
  isUsageStatsEvent: boolean = false,
  usageStatsAccountId: number = null,
): Record<string, any> {
  const properties = Object.assign({
    en: eventName,
    a: SettingsService.Instance.accountId,
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
    properties.env = SettingsService.Instance.sdkKey;
  } else {
    // set account id for internal usage stats event
    properties.a = usageStatsAccountId;
  }

  properties.url = Constants.HTTPS_PROTOCOL + UrlUtil.getBaseUrl() + UrlEnum.EVENTS;
  return properties;
}

/**
 * Builds generic payload required by all the different tracking calls.
 * @param {Object} settings   settings file
 * @param {String} userId     user id
 * @param {String} eventName  event name
 * @returns properties
 */
export function _getEventBasePayload(
  settings: SettingsModel,
  userId: string | number,
  eventName: string,
  visitorUserAgent = '',
  ipAddress = '',
  isUsageStatsEvent = false,
  usageStatsAccountId: number = null,
  shouldGenerateUUID = true,
): Record<string, any> {
  let accountId = SettingsService.Instance.accountId;
  if (isUsageStatsEvent) {
    // set account id for internal usage stats event
    accountId = usageStatsAccountId;
  }

  let uuid: string;
  if (shouldGenerateUUID) {
    uuid = getUUID(userId.toString(), accountId.toString());
  } else {
    uuid = userId.toString();
  }

  const props: {
    vwo_sdkName: string;
    vwo_sdkVersion: string;
    vwo_envKey?: string;
    id?: string | number;
    variation?: string | number;
    isFirst?: number;
    isCustomEvent?: boolean;
    data?: Record<string, any>;
    product?: string;
  } = {
    vwo_sdkName: Constants.SDK_NAME,
    vwo_sdkVersion: Constants.SDK_VERSION,
  };

  if (!isUsageStatsEvent) {
    // set env key for standard sdk events
    props.vwo_envKey = SettingsService.Instance.sdkKey;
  }

  const properties: Record<string, any> = {
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
        vwo_fs_environment: SettingsService.Instance.sdkKey,
      },
    };
  }

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
export function getTrackUserPayloadData(
  settings: SettingsModel,
  eventName: string,
  campaignId: number,
  variationId: number,
  context: ContextModel,
): Record<string, any> {
  const userId = context.getId();
  const visitorUserAgent = context.getUserAgent();
  const ipAddress = context.getIpAddress();
  const customVariables = context.getCustomVariables();
  const postSegmentationVariables = context.getPostSegmentationVariables();
  const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);

  if (context.getSessionId() !== 0) {
    properties.d.sessionId = context.getSessionId();
  }
  properties.d.event.props.id = campaignId;
  properties.d.event.props.variation = variationId;
  properties.d.event.props.isFirst = 1;

  // Add post-segmentation variables if they exist in custom variables
  if (
    postSegmentationVariables &&
    postSegmentationVariables.length > 0 &&
    customVariables &&
    Object.keys(customVariables).length > 0
  ) {
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

  LogManager.Instance.debug(
    buildMessage(DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
      accountId: settings.getAccountId(),
      userId,
      campaignId,
    }),
  );

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
export function getTrackGoalPayloadData(
  settings: SettingsModel,
  userId: string | number,
  eventName: string,
  eventProperties: Record<string, any>,
  visitorUserAgent: string = '',
  ipAddress: string = '',
  sessionId: number = 0,
): Record<string, any> {
  const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
  if (sessionId !== 0) {
    properties.d.sessionId = sessionId;
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

  LogManager.Instance.debug(
    buildMessage(DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_GOAL, {
      eventName,
      accountId: settings.getAccountId(),
      userId,
    }),
  );

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
export function getAttributePayloadData(
  settings: SettingsModel,
  userId: string | number,
  eventName: string,
  attributes: Record<string, any>,
  visitorUserAgent: string = '',
  ipAddress: string = '',
  sessionId: number = 0,
): Record<string, any> {
  const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);

  if (sessionId !== 0) {
    properties.d.sessionId = sessionId;
  }

  properties.d.event.props.isCustomEvent = true; // Mark as a custom event
  properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = settings.getSdkkey(); // Set environment key

  // Iterate over the attributes map and append to the visitor properties
  for (const [key, value] of Object.entries(attributes)) {
    properties.d.visitor.props[key] = value;
  }

  LogManager.Instance.debug(
    buildMessage(DebugLogMessagesEnum.IMPRESSION_FOR_SYNC_VISITOR_PROP, {
      eventName,
      accountId: settings.getAccountId(),
      userId,
    }),
  );

  return properties;
}

/**
 * Sends a POST API request with the specified properties and payload.
 * @param {any} properties - Properties for the request.
 * @param {any} payload - Payload for the request.
 * @param {string} userId - User ID.
 */
export async function sendPostApiRequest(
  properties: any,
  payload: any,
  userId: string,
  eventProperties: any = {},
  campaignInfo: any = {},
): Promise<void> {
  const networkManager = NetworkManager.Instance;
  networkManager.attachClient();
  const retryConfig: IRetryConfig = networkManager.getRetryConfig();

  const headers: Record<string, string> = {};

  const userAgent = payload.d.visitor_ua; // Extract user agent from payload
  const ipAddress = payload.d.visitor_ip; // Extract IP address from payload

  // Set headers if available
  if (userAgent) headers[HeadersEnum.USER_AGENT] = userAgent;
  if (ipAddress) headers[HeadersEnum.IP] = ipAddress;

  let baseUrl = UrlUtil.getBaseUrl();
  baseUrl = UrlUtil.getUpdatedBaseUrl(baseUrl);

  const request: RequestModel = new RequestModel(
    baseUrl,
    HttpMethodEnum.POST,
    UrlEnum.EVENTS,
    properties,
    payload,
    headers,
    SettingsService.Instance.protocol,
    SettingsService.Instance.port,
    retryConfig,
  );

  request.setEventName(properties.en);
  request.setUuid(payload.d.visId);
  let apiName: string;
  let extraDataForMessage: string;
  if (properties.en === EventEnum.VWO_VARIATION_SHOWN) {
    apiName = ApiEnum.GET_FLAG;
    if (
      campaignInfo.campaignType === CampaignTypeEnum.ROLLOUT ||
      campaignInfo.campaignType === CampaignTypeEnum.PERSONALIZE
    ) {
      extraDataForMessage = `feature: ${campaignInfo.featureKey}, rule: ${campaignInfo.variationName}`;
    } else {
      extraDataForMessage = `feature: ${campaignInfo.featureKey}, rule: ${campaignInfo.campaignKey} and variation: ${campaignInfo.variationName}`;
    }
    request.setCampaignId(payload.d.event.props.id);
  } else if (properties.en != EventEnum.VWO_VARIATION_SHOWN) {
    if (properties.en === EventEnum.VWO_SYNC_VISITOR_PROP) {
      apiName = ApiEnum.SET_ATTRIBUTE;
      extraDataForMessage = apiName;
    } else if (
      properties.en !== EventEnum.VWO_DEBUGGER_EVENT &&
      properties.en !== EventEnum.VWO_LOG_EVENT &&
      properties.en !== EventEnum.VWO_INIT_CALLED
    ) {
      apiName = ApiEnum.TRACK_EVENT;
      extraDataForMessage = `event: ${properties.en}`;
    }
    if (Object.keys(eventProperties).length > 0) {
      request.setEventProperties(eventProperties);
    }
  }

  await NetworkManager.Instance.post(request)
    .then((response: ResponseModel) => {
      // if attempt is more than 0
      if (response.getTotalAttempts() > 0) {
        const debugEventProps = createNetWorkAndRetryDebugEvent(response, payload, apiName, extraDataForMessage);
        debugEventProps.uuid = request.getUuid();
        // send debug event
        sendDebugEventToVWO(debugEventProps);
      }

      // clear usage stats only if network call is successful
      if (Object.keys(UsageStatsUtil.getInstance().getUsageStats()).length > 0) {
        UsageStatsUtil.getInstance().clearUsageStats();
      }
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.NETWORK_CALL_SUCCESS, {
          event: properties.en,
          endPoint: UrlEnum.EVENTS,
          accountId: SettingsService.Instance.accountId,
          userId: userId,
          uuid: payload.d.visId,
        }),
      );
    })
    .catch((err: ResponseModel) => {
      const debugEventProps = createNetWorkAndRetryDebugEvent(err, payload, apiName, extraDataForMessage);
      debugEventProps.uuid = request.getUuid();
      sendDebugEventToVWO(debugEventProps);
      LogManager.Instance.errorLog(
        'NETWORK_CALL_FAILED',
        {
          method: HttpMethodEnum.POST,
          err: getFormattedErrorMessage(err),
        },
        {},
        false,
      );
    });
}

// Flag to determine if the SDK should wait for a network response.
let shouldWaitForTrackingCalls = false;

/**
 * Checks if the SDK should wait for a network response.
 * @returns {boolean} - True if the SDK should wait for a network response, false otherwise.
 */
export function getShouldWaitForTrackingCalls(): boolean {
  return shouldWaitForTrackingCalls;
}

/**
 * Sets the value to determine if the SDK should wait for a network response.
 * @param value - The value to set.
 */
export function setShouldWaitForTrackingCalls(value: boolean): void {
  shouldWaitForTrackingCalls = value;
}

/**
 * Constructs the payload for a messaging event.
 * @param messageType - The type of the message.
 * @param message - The message to send.
 * @param eventName - The name of the event.
 * @returns The constructed payload.
 */
export function getMessagingEventPayload(
  messageType: string,
  message: string,
  eventName: string,
  extraData: any = {},
): Record<string, any> {
  const userId = SettingsService.Instance.accountId + '_' + SettingsService.Instance.sdkKey;
  const properties = _getEventBasePayload(null, userId, eventName, null, null);

  properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = SettingsService.Instance.sdkKey; // Set environment key
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
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
export function getSDKInitEventPayload(
  eventName: string,
  settingsFetchTime?: number,
  sdkInitTime?: number,
): Record<string, any> {
  const userId = SettingsService.Instance.accountId + '_' + SettingsService.Instance.sdkKey;
  const properties = _getEventBasePayload(null, userId, eventName, null, null);

  // Set the required fields as specified
  properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = SettingsService.Instance.sdkKey;
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
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
export function getSDKUsageStatsEventPayload(eventName: string, usageStatsAccountId: number): Record<string, any> {
  const userId = SettingsService.Instance.accountId + '_' + SettingsService.Instance.sdkKey;
  const properties = _getEventBasePayload(null, userId, eventName, null, null, true, usageStatsAccountId);

  // Set the required fields as specified
  properties.d.event.props.product = Constants.PRODUCT_NAME;
  properties.d.event.props.vwoMeta = UsageStatsUtil.getInstance().getUsageStats();

  return properties;
}

/**
 * Constructs the payload for debugger event.
 * @param eventProps - The properties for the event.
 * @returns The constructed payload.
 */
export function getDebuggerEventPayload(eventProps: Record<string, any> = {}): Record<string, any> {
  let uuid: string;
  const accountId = SettingsService.Instance.accountId.toString();
  const sdkKey = SettingsService.Instance.sdkKey;

  // generate uuid if not present
  if (!eventProps.uuid) {
    uuid = getUUID(accountId + '_' + sdkKey, accountId);
    eventProps.uuid = uuid;
  } else {
    uuid = eventProps.uuid;
  }
  // create standard event payload
  const properties = _getEventBasePayload(null, uuid, EventEnum.VWO_DEBUGGER_EVENT, null, null, false, null, false);

  properties.d.event.props = {};
  // add session id to the event props if not present
  if (eventProps.sId) {
    properties.d.sessionId = eventProps.sId;
  } else {
    eventProps.sId = properties.d.sessionId;
  }

  // add a safety check for apiName
  if (!eventProps.an) {
    eventProps.an = EventEnum.VWO_DEBUGGER_EVENT;
  }

  // add all debugger props inside vwoMeta
  properties.d.event.props.vwoMeta = {
    ...eventProps,
    a: SettingsService.Instance.accountId,
    product: Constants.PRODUCT_NAME,
    sn: Constants.SDK_NAME,
    sv: Constants.SDK_VERSION,
    eventId: getRandomUUID(SettingsService.Instance.sdkKey),
  };

  return properties;
}

/**
 * Sends an event to VWO (generic event sender).
 * @param properties - Query parameters for the request.
 * @param payload - The payload for the request.
 * @param eventName - The name of the event to send.
 * @returns A promise that resolves to the response from the server.
 */
export async function sendEvent(
  properties: Record<string, any>,
  payload: Record<string, any>,
  eventName: string,
): Promise<any> {
  // Create a new deferred object to manage promise resolution
  const deferredObject = new Deferred();
  // Singleton instance of the network manager
  const networkInstance = NetworkManager.Instance;
  const retryConfig: IRetryConfig = networkInstance.getRetryConfig();
  // disable retry for event (no retry for generic events)
  if (eventName === EventEnum.VWO_DEBUGGER_EVENT) retryConfig.shouldRetry = false;

  let baseUrl = UrlUtil.getBaseUrl();

  let protocol = SettingsService.Instance.protocol;
  let port = SettingsService.Instance.port;

  if (
    eventName === EventEnum.VWO_LOG_EVENT ||
    eventName === EventEnum.VWO_USAGE_STATS ||
    eventName === EventEnum.VWO_DEBUGGER_EVENT
  ) {
    baseUrl = Constants.HOST_NAME;
    protocol = Constants.HTTPS_PROTOCOL;
    port = 443;
  }
  baseUrl = UrlUtil.getUpdatedBaseUrl(baseUrl);

  try {
    // Create a new request model instance with the provided parameters
    const request: RequestModel = new RequestModel(
      baseUrl,
      HttpMethodEnum.POST,
      UrlEnum.EVENTS,
      properties,
      payload,
      null,
      protocol,
      port,
      retryConfig,
    );
    request.setEventName(properties.en);

    // Perform the network POST request
    networkInstance
      .post(request)
      .then((response: ResponseModel) => {
        // Resolve the deferred object with the data from the response
        deferredObject.resolve(response.getData());
      })
      .catch((err: ResponseModel) => {
        // Reject the deferred object with the error response
        deferredObject.reject(err);
      });

    return deferredObject.promise;
  } catch (err) {
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
export function createNetWorkAndRetryDebugEvent(
  response: ResponseModel,
  payload: any,
  apiName: string,
  extraData: string,
) {
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
    const debugEventProps: Record<string, any> = {
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
    } else {
      debugEventProps.sId = getCurrentUnixTimestamp();
    }

    return debugEventProps;
  } catch (err) {
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
