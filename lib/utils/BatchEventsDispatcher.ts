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

import { RequestModel, ResponseModel } from '../packages/network-layer';
import { UrlUtil } from './UrlUtil';
import { NetworkManager } from '../packages/network-layer';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { UrlEnum } from '../enums/UrlEnum';
import { SettingsService } from '../services/SettingsService';
import { LogManager } from '../packages/logger';
import { buildMessage } from '../utils/LogMessageUtil';
import { InfoLogMessagesEnum } from '../enums/log-messages';
import { dynamic } from '../types/Common';
import { isString } from '../utils/DataTypeUtil';
import { Deferred } from './PromiseUtil';
import { getFormattedErrorMessage } from './FunctionUtil';
import { Constants } from '../constants';
import { sendDebugEventToVWO } from './DebuggerServiceUtil';
import { createNetWorkAndRetryDebugEvent } from './NetworkUtil';
import { EventEnum } from '../enums/EventEnum';

export class BatchEventsDispatcher {
  public static async dispatch(
    payload: Record<string, any>,
    flushCallback: (error: Error | null, data: Record<string, any>) => void,
    queryParams: Record<string, dynamic>,
  ): Promise<Record<string, any>> {
    return await this.sendPostApiRequest(queryParams, payload, flushCallback);
  }

  /**
   * Sends a POST request to the server.
   * @param properties - The properties of the request.
   * @param payload - The payload of the request.
   * @returns A promise that resolves to a void.
   */
  private static async sendPostApiRequest(
    properties: Record<string, dynamic>,
    payload: Record<string, any>,
    flushCallback: (error: Error | null, data: Record<string, any>) => void,
  ): Promise<Record<string, any>> {
    const deferred = new Deferred();
    const networkManager = NetworkManager.Instance;
    const retryConfig = networkManager.getRetryConfig();

    const headers: Record<string, string> = {};
    headers['Authorization'] = SettingsService.Instance.sdkKey;

    let baseUrl = UrlUtil.getBaseUrl();
    baseUrl = UrlUtil.getUpdatedBaseUrl(baseUrl);

    const request: RequestModel = new RequestModel(
      baseUrl,
      HttpMethodEnum.POST,
      UrlEnum.BATCH_EVENTS,
      properties,
      payload,
      headers,
      SettingsService.Instance.protocol,
      SettingsService.Instance.port,
      retryConfig,
    );
    const { variationShownCount, setAttributeCount, customEventCount } = this.extractEventCounts(payload);
    let extraData = `${Constants.BATCH_EVENTS} having `;
    if (variationShownCount > 0) {
      extraData += `getFlag events: ${variationShownCount}, `;
    }
    if (customEventCount > 0) {
      extraData += `conversion events: ${customEventCount}, `;
    }
    if (setAttributeCount > 0) {
      extraData += `setAttribute events: ${setAttributeCount}, `;
    }
    try {
      NetworkManager.Instance.post(request)
        .then((response) => {
          if (response.getTotalAttempts() > 0) {
            const debugEventProps: Record<string, any> = createNetWorkAndRetryDebugEvent(
              response,
              '',
              Constants.BATCH_EVENTS,
              extraData,
            );
            // send debug event
            sendDebugEventToVWO(debugEventProps);
          }
          const batchApiResult = this.handleBatchResponse(
            UrlEnum.BATCH_EVENTS,
            payload,
            properties,
            null,
            response,
            flushCallback,
          );
          deferred.resolve(batchApiResult);
        })
        .catch((err: ResponseModel) => {
          const debugEventProps: Record<string, any> = createNetWorkAndRetryDebugEvent(
            err,
            '',
            Constants.BATCH_EVENTS,
            extraData,
          );
          // send debug event
          sendDebugEventToVWO(debugEventProps);
          const batchApiResult = this.handleBatchResponse(
            UrlEnum.BATCH_EVENTS,
            payload,
            properties,
            null,
            err,
            flushCallback,
          );
          deferred.resolve(batchApiResult);
        });
      return deferred.promise;
    } catch (error) {
      LogManager.Instance.errorLog(
        'EXECUTION_FAILED',
        {
          apiName: Constants.BATCH_EVENTS,
          err: getFormattedErrorMessage(error),
        },
        { an: Constants.BATCH_EVENTS },
      );
      deferred.resolve({ status: 'error', events: payload });
      return deferred.promise;
    }
  }

  /**
   * Handles the response from batch events API call
   * @param properties - Request properties containing events
   * @param queryParams - Query parameters from the request
   * @param error - Error object if request failed
   * @param res - Response object from the API
   * @param rawData - Raw response data
   * @param callback - Callback function to handle the result
   */
  private static handleBatchResponse(
    endPoint: string,
    payload: Record<string, any>,
    queryParams: Record<string, dynamic>,
    err: any,
    res: ResponseModel,
    callback: (error: Error | null, data: Record<string, any>) => void,
  ): Record<string, any> {
    const eventsPerRequest = payload.ev.length;
    const accountId = queryParams.a;
    let error = err ? err : res?.getError();

    if (error && !(error instanceof Error)) {
      if (isString(error)) {
        error = new Error(error);
      } else if (error instanceof Object) {
        error = new Error(JSON.stringify(error));
      }
    }

    if (error) {
      LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.IMPRESSION_BATCH_FAILED));
      LogManager.Instance.errorLog(
        'NETWORK_CALL_FAILED',
        {
          method: HttpMethodEnum.POST,
          err: error.message,
        },
        {},
        false,
      );
      callback(error, payload);
      return { status: 'error', events: payload };
    }
    const statusCode = res?.getStatusCode();

    if (statusCode === 200) {
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.IMPRESSION_BATCH_SUCCESS, {
          accountId,
          endPoint,
        }),
      );
      callback(null, payload);
      return { status: 'success', events: payload };
    }

    if (statusCode === 413) {
      LogManager.Instance.errorLog(
        'CONFIG_BATCH_EVENT_LIMIT_EXCEEDED',
        {
          accountId,
          endPoint,
          eventsPerRequest,
        },
        {},
        false,
      );
      LogManager.Instance.errorLog(
        'NETWORK_CALL_FAILED',
        {
          method: HttpMethodEnum.POST,
          err: error.message,
        },
        {},
        false,
      );
      callback(error, payload);
      return { status: 'error', events: payload };
    }

    LogManager.Instance.errorLog('IMPRESSION_BATCH_FAILED', {}, {}, false);
    LogManager.Instance.errorLog(
      'NETWORK_CALL_FAILED',
      {
        method: HttpMethodEnum.POST,
        err: error.message,
      },
      {},
      false,
    );
    callback(error, payload);
    return { status: 'error', events: payload };
  }

  private static extractEventCounts(payload: Record<string, any>): {
    variationShownCount: number;
    setAttributeCount: number;
    customEventCount: number;
  } {
    const counts = { variationShownCount: 0, setAttributeCount: 0, customEventCount: 0 };
    const standardEventNames = new Set(Object.values(EventEnum));
    const events = payload?.ev ?? [];

    for (const entry of events) {
      const name = entry?.d?.event?.name;

      if (!name) {
        continue;
      }

      if (name === EventEnum.VWO_VARIATION_SHOWN) {
        counts.variationShownCount += 1;
        continue;
      }

      if (name === EventEnum.VWO_SYNC_VISITOR_PROP) {
        counts.setAttributeCount += 1;
        continue;
      }

      if (!standardEventNames.has(name)) {
        counts.customEventCount += 1;
      }
    }

    return counts;
  }
}

export default BatchEventsDispatcher;
