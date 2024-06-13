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
import { sendGetCall, sendPostCall } from '../../../utils/XMLUtil';
import { dynamic } from '../../../types/Common';
import { Deferred } from '../../../utils/PromiseUtil';

import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { NetworkClientInterface } from './NetworkClientInterface';

const HTTPS = 'HTTPS';

/**
 * Implements the NetworkClientInterface to handle network requests.
 */
export class NetworkBrowserClient implements NetworkClientInterface {
  /**
   * Performs a GET request using the provided RequestModel.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
   */
  GET(requestModel: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred();

    // Extract network options from the request model.
    const networkOptions: Record<string, dynamic> = requestModel.getOptions();
    const responseModel = new ResponseModel();

    sendGetCall({
      networkOptions,
      successCallback: (data: dynamic) => {
        responseModel.setData(data);
        deferred.resolve(responseModel);
      },
      errorCallback: (error: dynamic) => {
        responseModel.setError(error);
        deferred.reject(responseModel);
      },
    });

    /*try {
      fetch(url)
          .then(res => {
            // Some endpoints return empty strings as the response body; treat
            // as raw text and handle potential JSON parsing errors below
            return res.text().then(text => {
              let jsonData = {};
              try {
                jsonData = JSON.parse(text);
              } catch (err) {
                console.info(
                  `VWO-SDK - [INFO]: VWO didn't send JSON response which is expected: ${err}`
                );
              }

              if (res.status === 200) {
                responseModel.setData(jsonData);
                deferred.resolve(responseModel);
              } else {
                let error = `VWO-SDK - [ERROR]: Request failed for fetching account settings. Got Status Code: ${
                  res.status
                }`;

                responseModel.setError(error);
                deferred.reject(responseModel);
              }
            });
          })
          .catch(err => {
            responseModel.setError(err);
            deferred.reject(responseModel);
          });
    } catch (err) {
      responseModel.setError(err);
      deferred.reject(responseModel);
    } */
    return deferred.promise;
  }

  /**
   * Performs a POST request using the provided RequestModel.
   * @param {RequestModel} request - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  POST(request: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred();
    const networkOptions: Record<string, dynamic> = request.getOptions();
    const responseModel = new ResponseModel();

    sendPostCall({
      networkOptions,
      successCallback: (data: dynamic) => {
        responseModel.setData(data);
        deferred.resolve(responseModel);
      },
      errorCallback: (error: dynamic) => {
        responseModel.setError(error);
        deferred.reject(responseModel);
      },
    });

    /* try {
      const options: any = Object.assign(
        {},
        { method: 'POST' },
        { body: networkOptions.body },
        { headers: networkOptions.headers }
      );

      fetch(url, options)
          .then(res => {
            // Some endpoints return empty strings as the response body; treat
            // as raw text and handle potential JSON parsing errors below
            return res.text().then(text => {
              let jsonData = {};
              try {
                jsonData = JSON.parse(text);
              } catch (err) {
                console.info(
                  `VWO-SDK - [INFO]: VWO didn't send JSON response which is expected: ${err}`
                );
              }

              if (res.status === 200) {
                responseModel.setData(jsonData);
                deferred.resolve(responseModel);
              } else {
                let error = `VWO-SDK - [ERROR]: Request failed for fetching account settings. Got Status Code: ${
                  res.status
                }`;

                responseModel.setError(error);
                deferred.reject(responseModel);
              }
            });
          })
          .catch(err => {
            responseModel.setError(err);
            deferred.reject(responseModel);
          });
    } catch (err) {
      responseModel.setError(err);
      deferred.reject(responseModel);
    } */

    return deferred.promise;
  }
}
