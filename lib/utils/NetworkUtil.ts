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
import { getCurrentUnixTimestamp, getCurrentUnixTimestampInMillis, getRandomNumber } from './FunctionUtil';
import { getUUID } from './UuidUtil';

import { Constants } from '../constants';
import { HeadersEnum } from '../enums/HeadersEnum';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { UrlEnum } from '../enums/UrlEnum';
import { DebugLogMessagesEnum, ErrorLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { SettingsModel } from '../models/settings/SettingsModel';
import { LogManager } from '../packages/logger';
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
): Record<string, any> {
  let accountId = SettingsService.Instance.accountId;
  if (isUsageStatsEvent) {
    // set account id for internal usage stats event
    accountId = usageStatsAccountId;
  }

  const uuid = getUUID(userId.toString(), accountId.toString());

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
  userId: string | number,
  eventName: string,
  campaignId: number,
  variationId: number,
  visitorUserAgent: string = '',
  ipAddress: string = '',
): Record<string, any> {
  const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);

  properties.d.event.props.id = campaignId;
  properties.d.event.props.variation = variationId;
  properties.d.event.props.isFirst = 1;

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
): Record<string, any> {
  const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
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
): Record<string, any> {
  const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);

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
  if (properties.en === EventEnum.VWO_VARIATION_SHOWN) {
    request.setCampaignId(payload.d.event.props.id);
  } else if (properties.en != EventEnum.VWO_VARIATION_SHOWN && Object.keys(eventProperties).length > 0) {
    request.setEventProperties(eventProperties);
  }

  await NetworkManager.Instance.post(request)
    .then(() => {
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
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
          method: HttpMethodEnum.POST,
          err: isObject(err) ? JSON.stringify(err) : err,
        }),
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
  if (eventName === EventEnum.VWO_LOG_EVENT) retryConfig.shouldRetry = false;

  let baseUrl = UrlUtil.getBaseUrl();

  let protocol = SettingsService.Instance.protocol;
  let port = SettingsService.Instance.port;

  if (eventName === EventEnum.VWO_LOG_EVENT || eventName === EventEnum.VWO_USAGE_STATS) {
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
