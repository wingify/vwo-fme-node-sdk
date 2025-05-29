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
import { ErrorLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { dynamic } from '../types/Common';
import { isString } from '../utils/DataTypeUtil';
import { Deferred } from './PromiseUtil';

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
    NetworkManager.Instance.attachClient();

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
    );

    try {
      const response = await NetworkManager.Instance.post(request);
      const batchApiResult = this.handleBatchResponse(
        UrlEnum.BATCH_EVENTS,
        payload,
        properties,
        null,
        response,
        flushCallback,
      );
      deferred.resolve(batchApiResult);
      return deferred.promise;
    } catch (error) {
      const batchApiResult = this.handleBatchResponse(
        UrlEnum.BATCH_EVENTS,
        payload,
        properties,
        error,
        null,
        flushCallback,
      );
      deferred.resolve(batchApiResult);
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
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
          method: HttpMethodEnum.POST,
          err: error.message,
        }),
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
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.CONFIG_BATCH_EVENT_LIMIT_EXCEEDED, {
          accountId,
          endPoint,
          eventsPerRequest,
        }),
      );
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
          method: HttpMethodEnum.POST,
          err: error.message,
        }),
      );
      callback(error, payload);
      return { status: 'error', events: payload };
    }

    LogManager.Instance.error(buildMessage(ErrorLogMessagesEnum.IMPRESSION_BATCH_FAILED));
    LogManager.Instance.error(
      buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
        method: HttpMethodEnum.POST,
        err: error.message,
      }),
    );
    callback(error, payload);
    return { status: 'error', events: payload };
  }
}

export default BatchEventsDispatcher;
