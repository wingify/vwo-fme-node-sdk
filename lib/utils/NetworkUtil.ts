import { getUUID } from './UuidUtil';
import { getRandomNumber, getCurrentUnixTimestamp, getCurrentUnixTimestampInMillis } from './FunctionUtil';

import { dynamic } from '../types/common';
import { Constants } from '../constants';
import { SettingsModel } from '../models/SettingsModel';
import UrlService from '../services/UrlService';
import { UrlEnum } from '../enums/UrlEnum';
import { LogManager } from '../modules/logger';
import { EventEnum } from '../enums/EventEnum';
import { NetworkManager } from '../modules/networking';
import { RequestModel } from '../modules/networking';
import { HTTPS_PROTOCOL } from '../constants/url';
import { ResponseModel } from '../modules/networking';
import { isObject } from './DataTypeUtil';

export class NetworkUtil {
  getBasePropertiesForBulk(accountId: string, userId: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      sId: getCurrentUnixTimestamp(),
      u: getUUID(userId, accountId),
    };
    return path;
  }

  getSettingsPath(apikey: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      i: `${apikey}`,
      r: Math.random(),
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
  getEventsBaseProperties(setting: any, eventName, visitorUserAgent = '', userIpAddress = ''): any {
    const sdkKey = setting.sdkKey;

    let properties = Object.assign({
      en: eventName,
      a: setting.accountId,
      env: sdkKey,
      eTime: getCurrentUnixTimestampInMillis(),
      random: getRandomNumber(),
      p: 'FS',
      visitor_ua: visitorUserAgent,
      visitor_ip: userIpAddress,
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
  getEventBasePayload(settings: any, userId: any, eventName: string) {
    const uuid = getUUID(userId, settings.accountId);
    const sdkKey = settings.sdkKey;

    let props: {
      vwo_sdkName: string;
      vwo_sdkVersion: string;
      vwo_envKey: any;
      id?: any;
      variation?: any;
      isFirst?: any,
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
  getTrackUserPayloadData(settings: any, userId: any, eventName: string, campaignId: any, variationId: any) {
    const properties = this.getEventBasePayload(settings, userId, eventName);

    properties.d.event.props.id = campaignId;
    properties.d.event.props.variation = variationId;
    properties.d.event.props.isFirst = 1;

    LogManager.Instance.debug(
      `IMPRESSION_FOR_EVENT_ARCH_TRACK_USER: Impression built for vwo_variationShown event for Account ID:${settings.accountId}, User ID:${userId}, and Campaign ID:${campaignId}`,
    );

    return properties;
  }

  getTrackGoalPayloadData(settings: any, userId: any, eventName: string, eventProperties: any) {
    const properties = this.getEventBasePayload(settings, userId, eventName);
    properties.d.event.props.isCustomEvent = true;

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

  sendPostApiRequest(properties: any, payload: any) {
    NetworkManager.Instance.attachClient();
    const request: RequestModel = new RequestModel(
      UrlService.getBaseUrl(),
      'POST',
      UrlEnum.EVENTS,
      properties,
      payload,
      null,
      null,
    );
    request.setPort(80);
    NetworkManager.Instance.post(request)
    .then(data => {
      console.log('Request sent to VWO server: ', request)
    })
    .catch((err: ResponseModel) => {
      console.log('error', err);
    });
  }
}
