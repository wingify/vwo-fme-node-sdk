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
import { UrlEnum } from '../enums/UrlEnum';
import { LogManager } from '../modules/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../modules/networking';
import UrlService from '../services/UrlService';
import { dynamic } from '../types/Common';
import { isObject } from './DataTypeUtil';

export class NetworkUtil {
  getBasePropertiesForBulk(accountId: string, userId: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      sId: getCurrentUnixTimestamp(),
      u: getUUID(userId, accountId),
    };
    return path;
  }

  getSettingsPath(apikey: string, accountId: any): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      i: `${apikey}`,
      r: Math.random(),
      a: accountId,
    };
    return path;
  }

  getTrackEventPath(event: string, accountId: string, userId: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      event_type: event,
      account_id: accountId,
      uId: userId,
      u: getUUID(userId, accountId),
      sdk: Constants.SDK_NAME,
      'sdk-v': Constants.SDK_VERSION,
      random: getRandomNumber(),
      ap: Constants.AP,
      sId: getCurrentUnixTimestamp(),
      ed: JSON.stringify({ p: 'server' }),
    };

    return path;
  }

  getEventBatchingQueryParams(accountId: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      a: accountId,
      sd: Constants.SDK_NAME,
      sv: Constants.SDK_VERSION,
    };

    return path;
  }

  /**
   * Builds generic properties for different tracking calls required by VWO servers.
   * @param {Object} configObj
   * @param {String} eventName
   * @returns properties
   */
  getEventsBaseProperties(setting: any, eventName, visitorUserAgent = '', ipAddress = ''): any {
    const sdkKey = setting.sdkKey;

    let properties = Object.assign({
      en: eventName,
      a: setting.accountId,
      env: sdkKey,
      eTime: getCurrentUnixTimestampInMillis(),
      random: getRandomNumber(),
      p: 'FS',
      visitor_ua: visitorUserAgent,
      visitor_ip: ipAddress,
    });

    properties.url = Constants.HTTPS_PROTOCOL + UrlService.getBaseUrl() + UrlEnum.EVENTS;
    return properties;
  }

  /**
   * Builds generic payload required by all the different tracking calls.
   * @param {Object} settings   settings file
   * @param {String} userId     user id
   * @param {String} eventName  event name
   * @returns properties
   */
  getEventBasePayload(settings: any, userId: any, eventName: string, visitorUserAgent = '', ipAddress = '') {
    const uuid = getUUID(userId, settings.accountId);
    const sdkKey = settings.sdkKey;

    let props: {
      vwo_sdkName: string;
      vwo_sdkVersion: string;
      vwo_envKey: any;
      id?: any;
      variation?: any;
      isFirst?: any;
      isCustomEvent?: boolean;
    } = {
      vwo_sdkName: Constants.SDK_NAME,
      vwo_sdkVersion: Constants.SDK_VERSION,
      vwo_envKey: sdkKey,
    };

    let properties = {
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
  getTrackUserPayloadData(
    settings: any,
    userId: any,
    eventName: string,
    campaignId: any,
    variationId: any,
    visitorUserAgent = '',
    ipAddress = '',
  ) {
    const properties = this.getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);

    properties.d.event.props.id = campaignId;
    properties.d.event.props.variation = variationId;
    properties.d.event.props.isFirst = 1;

    LogManager.Instance.debug(
      `IMPRESSION_FOR_EVENT_ARCH_TRACK_USER: Impression built for vwo_variationShown event for Account ID:${settings.accountId}, User ID:${userId}, and Campaign ID:${campaignId}`,
    );

    return properties;
  }

  getTrackGoalPayloadData(
    settings: any,
    userId: any,
    eventName: string,
    eventProperties: any,
    visitorUserAgent = '',
    ipAddress = '',
  ) {
    const properties = this.getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
    properties.d.event.props.isCustomEvent = true;
    properties.d.event.props.variation = 1; // temporary value
    properties.d.event.props.id = 1; // temporary value

    if (eventProperties && isObject(eventProperties) && Object.keys(eventProperties).length > 0) {
      for (const prop in eventProperties) {
        properties.d.event.props[prop] = eventProperties[prop];
      }
    }

    LogManager.Instance.debug(
      `IMPRESSION_FOR_EVENT_ARCH_TRACK_GOAL: Impression built for ${eventName} event for Account ID:${settings.accountId}, User ID:${userId}`,
    );

    return properties;
  }

  getAttributePayloadData(
    settings: any,
    userId: any,
    eventName: string,
    attributeKey: any,
    attributeValue: any,
    visitorUserAgent = '',
    ipAddress = '',
  ) {
    const properties = this.getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);

    properties.d.event.props.isCustomEvent = true;
    properties.d.event.props[Constants.VWO_FS_ENVIRONMENT] = settings.sdkKey;
    properties.d.visitor.props[attributeKey] = attributeValue;

    LogManager.Instance.debug(
      `IMPRESSION_FOR_EVENT_ARCH_SYNC_VISITOR_PROP: Impression built for ${eventName} event for Account ID:${settings.accountId}, User ID:${userId}`,
    );

    return properties;
  }

  sendPostApiRequest(properties: any, payload: any) {
    NetworkManager.Instance.attachClient();

    const headers: Record<string, string> = {};

    const userAgent = payload.d.visitor_ua;
    const ipAddress = payload.d.visitor_ip;

    // Set headers
    if (userAgent) headers[HeadersEnum.USER_AGENT] = userAgent;
    if (ipAddress) headers[HeadersEnum.IP] = ipAddress;

    const request: RequestModel = new RequestModel(
      UrlService.getBaseUrl(),
      'POST',
      UrlEnum.EVENTS,
      properties,
      payload,
      headers,
      null,
      UrlService.getPort(),
    );

    NetworkManager.Instance.post(request).catch((err: ResponseModel) => {
      console.log('error', err);
    });
  }

  async sendGetApiRequest(properties: any, endpoint: any): Promise<any> {
    NetworkManager.Instance.attachClient();
    const request: RequestModel = new RequestModel(
      UrlService.getBaseUrl(),
      'Get',
      endpoint,
      properties,
      null,
      null,
      null,
      UrlService.getPort(),
    );
    try {
      const response: ResponseModel = await NetworkManager.Instance.get(request);
      return response; // Return the response model
    } catch (err) {
      console.error('Error occurred while sending GET request:', err);
      return null;
    }
  }
}
