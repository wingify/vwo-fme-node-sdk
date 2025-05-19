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
import { HTTPS } from '../constants/Url';
import { UsageStatsUtil } from './UsageStatsUtil';

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
): Record<string, any> {
  const sdkKey = SettingsService.Instance.sdkKey;

  const properties = Object.assign({
    en: eventName,
    a: SettingsService.Instance.accountId,
    env: sdkKey,
    eTime: getCurrentUnixTimestampInMillis(),
    random: getRandomNumber(),
    p: 'FS',
    visitor_ua: visitorUserAgent,
    visitor_ip: ipAddress,
  });

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
): Record<string, any> {
  const uuid = getUUID(userId.toString(), SettingsService.Instance.accountId.toString());
  const sdkKey = SettingsService.Instance.sdkKey;

  const props: {
    vwo_sdkName: string;
    vwo_sdkVersion: string;
    vwo_envKey: string;
    id?: string | number;
    variation?: string | number;
    isFirst?: number;
    isCustomEvent?: boolean;
    data?: Record<string, any>;
    product?: string;
  } = {
    vwo_sdkName: Constants.SDK_NAME,
    vwo_sdkVersion: Constants.SDK_VERSION,
    vwo_envKey: sdkKey,
  };

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

  // add usageStats as a new meta key to properties.d.events.props.vwoMeta
  if (Object.keys(UsageStatsUtil.getInstance().getUsageStats()).length > 0) {
    properties.d.event.props.vwoMeta = UsageStatsUtil.getInstance().getUsageStats();
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
export async function sendPostApiRequest(properties: any, payload: any, userId: string): Promise<void> {
  NetworkManager.Instance.attachClient();

  const headers: Record<string, string> = {};

  const userAgent = payload.d.visitor_ua; // Extract user agent from payload
  const ipAddress = payload.d.visitor_ip; // Extract IP address from payload

  // Set headers if available
  if (userAgent) headers[HeadersEnum.USER_AGENT] = userAgent;
  if (ipAddress) headers[HeadersEnum.IP] = ipAddress;

  const request: RequestModel = new RequestModel(
    UrlUtil.getBaseUrl(),
    HttpMethodEnum.POST,
    UrlEnum.EVENTS,
    properties,
    payload,
    headers,
    SettingsService.Instance.protocol,
    SettingsService.Instance.port,
  );

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
export function getMessagingEventPayload(messageType: string, message: string, eventName: string): Record<string, any> {
  const userId = SettingsService.Instance.accountId + '_' + SettingsService.Instance.sdkKey;
  const properties = _getEventBasePayload(null, userId, eventName, null, null);

  properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = SettingsService.Instance.sdkKey; // Set environment key
  properties.d.event.props.product = 'fme';
  const data = {
    type: messageType,
    content: {
      title: message,
      dateTime: getCurrentUnixTimestampInMillis(),
    },
  };
  properties.d.event.props.data = data;
  return properties;
}

/**
 * Sends a messaging event to DACDN
 * @param properties - Query parameters for the request.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response from DACDN.
 */
export async function sendMessagingEvent(properties: Record<string, any>, payload: Record<string, any>): Promise<any> {
  // Create a new deferred object to manage promise resolution
  const deferredObject = new Deferred();
  // Singleton instance of the network manager
  const networkInstance = NetworkManager.Instance;

  try {
    // Create a new request model instance with the provided parameters
    const request: RequestModel = new RequestModel(
      Constants.HOST_NAME,
      HttpMethodEnum.POST,
      UrlEnum.EVENTS,
      properties,
      payload,
      null,
      HTTPS,
      null,
    );

    // Perform the network GET request
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
