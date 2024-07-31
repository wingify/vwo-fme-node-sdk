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
import { getCurrentUnixTimestamp, getCurrentUnixTimestampInMillis, getRandomNumber } from './FunctionUtil';
import { getUUID } from './UuidUtil';

import { Constants } from '../constants';
import { HeadersEnum } from '../enums/HeadersEnum';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { UrlEnum } from '../enums/UrlEnum';
import { DebugLogMessagesEnum, ErrorLogMessagesEnum } from '../enums/log-messages';
import { SettingsModel } from '../models/settings/SettingsModel';
import { LogManager } from '../packages/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../packages/network-layer';
import { SettingsService } from '../services/SettingsService';
import { dynamic } from '../types/Common';
import { isObject } from './DataTypeUtil';
import { buildMessage } from './LogMessageUtil';
import { UrlUtil } from './UrlUtil';

/**
 * Constructs base properties for bulk operations.
 * @param {string} accountId - The account identifier.
 * @param {string} userId - The user identifier.
 * @returns {Record<string, dynamic>} - The base properties including session ID and UUID.
 */
export function getBasePropertiesForBulk(accountId: string, userId: string): Record<string, dynamic> {
  const path: Record<string, dynamic> = {
    sId: getCurrentUnixTimestamp(), // Session ID based on current Unix timestamp
    u: getUUID(userId, accountId), // UUID generated based on user and account ID
  };
  return path;
}

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
 * Constructs query parameters for event batching.
 * @param {string} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The query parameters for event batching.
 */
export function getEventBatchingQueryParams(accountId: string): Record<string, dynamic> {
  const path: Record<string, dynamic> = {
    a: accountId, // Account ID
    sd: Constants.SDK_NAME, // SDK name
    sv: Constants.SDK_VERSION, // SDK version
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
  setting: SettingsModel,
  eventName: string,
  visitorUserAgent: string = '',
  ipAddress: string = '',
): Record<string, any> {
  const sdkKey = setting.getSdkkey();

  const properties = Object.assign({
    en: eventName,
    a: setting.getAccountId(),
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
  const uuid = getUUID(userId.toString(), settings.getAccountId());
  const sdkKey = settings.getSdkkey();

  const props: {
    vwo_sdkName: string;
    vwo_sdkVersion: string;
    vwo_envKey: string;
    id?: string | number;
    variation?: string | number;
    isFirst?: number;
    isCustomEvent?: boolean;
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
    buildMessage(DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
      eventName,
      accountId: settings.getAccountId(),
      userId,
    }),
  );

  return properties;
}

/**
 * Constructs the payload data for syncing visitor attributes.
 * @param {any} settings - Configuration settings.
 * @param {any} userId - User identifier.
 * @param {string} eventName - Name of the event.
 * @param {any} attributeKey - Key of the attribute to sync.
 * @param {any} attributeValue - Value of the attribute.
 * @param {string} [visitorUserAgent=''] - Visitor's user agent.
 * @param {string} [ipAddress=''] - Visitor's IP address.
 * @returns {any} - The constructed payload data.
 */
export function getAttributePayloadData(
  settings: SettingsModel,
  userId: string | number,
  eventName: string,
  attributeKey: string,
  attributeValue: dynamic,
  visitorUserAgent: string = '',
  ipAddress: string = '',
): Record<string, any> {
  const properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);

  properties.d.event.props.isCustomEvent = true; // Mark as a custom event
  properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = settings.getSdkkey(); // Set environment key
  properties.d.visitor.props[attributeKey] = attributeValue; // Set attribute value

  LogManager.Instance.debug(
    buildMessage(DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
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
 */
export function sendPostApiRequest(properties: any, payload: any) {
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

  NetworkManager.Instance.post(request).catch((err: ResponseModel) => {
    LogManager.Instance.error(
      buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
        method: HttpMethodEnum.POST,
        err,
      }),
    );
  });
}

/**
 * Sends a GET API request to the specified endpoint with the given properties.
 * @param {any} properties - Properties for the request.
 * @param {any} endpoint - Endpoint for the GET request.
 * @returns {Promise<any>} - The response from the GET request.
 */
export async function sendGetApiRequest(properties: any, endpoint: any): Promise<any> {
  NetworkManager.Instance.attachClient();
  const request: RequestModel = new RequestModel(
    UrlUtil.getBaseUrl(),
    HttpMethodEnum.GET,
    endpoint,
    properties,
    null,
    null,
    SettingsService.Instance.protocol,
    SettingsService.Instance.port,
  );
  try {
    const response: ResponseModel = await NetworkManager.Instance.get(request);
    return response; // Return the response model
  } catch (err) {
    LogManager.Instance.error(
      buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
        method: HttpMethodEnum.GET,
        err,
      }),
    );
    return null;
  }
}
