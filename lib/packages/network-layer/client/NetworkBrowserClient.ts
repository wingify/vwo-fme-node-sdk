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
import { sendGetCall, sendPostCall } from '../../../utils/XMLUtil';
import { Deferred } from '../../../utils/PromiseUtil';

import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { NetworkClientInterface } from './NetworkClientInterface';
import { LogManager } from '../../logger';
import { getFormattedErrorMessage } from '../../../utils/FunctionUtil';
import { buildMessage } from '../../../utils/LogMessageUtil';
import { DebugLogMessagesEnum } from '../../../enums/log-messages';
import { isString } from '../../../utils/DataTypeUtil';
import { NetworkTransportModeEnum } from '../../../enums/NetworkTransportModeEnum';

/**
 * Implements the NetworkClientInterface to handle network requests.
 */
export class NetworkBrowserClient implements NetworkClientInterface {
  private logManager: LogManager;
  private networkTransportMode: NetworkTransportModeEnum;

  constructor(
    logManager: LogManager,
    networkTransportMode: NetworkTransportModeEnum = NetworkTransportModeEnum.SEND_BEACON,
  ) {
    this.logManager = logManager;
    this.networkTransportMode = networkTransportMode;
  }
  /**
   * Performs a GET request using the provided RequestModel.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
   */
  GET(requestModel: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred();

    sendGetCall(
      {
        requestModel,
        successCallback: (responseModel: ResponseModel) => {
          deferred.resolve(responseModel);
        },
        errorCallback: (responseModel: ResponseModel) => {
          deferred.reject(responseModel);
        },
      },
      this.logManager,
    );
    return deferred.promise;
  }

  /**
   * Performs a POST request using navigator.sendBeacon. If the request is not queued, it will be performed using XHR.
   * @param {RequestModel} request - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  POST(requestModel: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred();

    // if networkTransportMode is SEND_BEACON, and navigator.sendBeacon is defined, use beacon
    // sendBeacon can be undefined for internet explorer 11 - so we will fallback to XHR
    if (
      this.networkTransportMode.toLowerCase() !== NetworkTransportModeEnum.XHR.toLowerCase() &&
      typeof navigator !== 'undefined' && // not using DataTypeUtil.isUndefined because we want to check for the existence of navigator object in non-browser environments
      typeof navigator.sendBeacon === 'function'
    ) {
      const responseModel = new ResponseModel();
      try {
        this.logManager.debug(
          buildMessage(DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
            api: NetworkTransportModeEnum.SEND_BEACON,
            process: 'undefined',
          }),
        );
        const networkOptions = requestModel.getOptions();
        let url = `${networkOptions.scheme}://${networkOptions.hostname}${networkOptions.path}`;
        if (networkOptions.port) {
          url = `${networkOptions.scheme}://${networkOptions.hostname}:${networkOptions.port}${networkOptions.path}`;
        }
        const body = networkOptions.body;
        const postBody = isString(body) ? body : JSON.stringify(body || {});

        // sendBeacon returns a boolean indicating if the request was queued
        const queued = navigator.sendBeacon(url, postBody);
        if (!queued) {
          // if the request was not queued, fallback to XHR
          return this.POST_XHR(requestModel);
        } else {
          // if the request was queued, resolve the promise with a success response
          responseModel.setStatusCode(200);
          responseModel.setData(undefined);
          deferred.resolve(responseModel);
          return deferred.promise;
        }
      } catch (error) {
        const err = getFormattedErrorMessage(error);
        this.logManager.errorLog(
          'SEND_BEACON_ERROR',
          {
            err,
          },
          {},
          false,
        );
        responseModel.setStatusCode(0);
        responseModel.setError(err);
        deferred.reject(responseModel);
        return deferred.promise;
      }
    } else {
      this.logManager.debug(
        buildMessage(DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
          api: NetworkTransportModeEnum.XHR,
          process: 'undefined',
        }),
      );
      // if networkTransportMode is not SEND_BEACON, fallback to XHR
      return this.POST_XHR(requestModel);
    }
  }

  /**
   * Performs a POST request using XHR.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  POST_XHR(requestModel: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred();

    sendPostCall(
      {
        requestModel,
        successCallback: (responseModel: ResponseModel) => {
          deferred.resolve(responseModel);
        },
        errorCallback: (responseModel: ResponseModel) => {
          deferred.reject(responseModel);
        },
      },
      this.logManager,
    );
    return deferred.promise;
  }
}
