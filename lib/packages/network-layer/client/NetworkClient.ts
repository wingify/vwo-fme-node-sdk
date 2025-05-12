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
import * as http from 'http';
import * as https from 'https';
import { dynamic } from '../../../types/Common';
import { Deferred } from '../../../utils/PromiseUtil';

import { HTTPS } from '../../../constants/Url';
import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { NetworkClientInterface } from './NetworkClientInterface';
import { Constants } from '../../../constants';
import { LogManager } from '../../../packages/logger';
import { buildMessage } from '../../../utils/LogMessageUtil';
import { ErrorLogMessagesEnum } from '../../../enums/log-messages';

/**
 * Implements the NetworkClientInterface to handle network requests.
 */
export class NetworkClient implements NetworkClientInterface {
  /**
   * Performs a GET request using the provided RequestModel.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
   */
  GET(requestModel: RequestModel): Promise<ResponseModel> {
    const attemptRequest = (attempt: number): Promise<ResponseModel> => {
      const deferred = new Deferred();

      // Extract network options from the request model.
      const networkOptions: Record<string, dynamic> = requestModel.getOptions();
      const responseModel = new ResponseModel();

      try {
        // Choose HTTP or HTTPS client based on the scheme.
        const httpClient = networkOptions.scheme === HTTPS ? https : http;

        // Perform the HTTP GET request.
        const req = httpClient.get(networkOptions, (res) => {
          responseModel.setStatusCode(res.statusCode);
          const contentType = res.headers['content-type'];

          let error;
          let rawData = '';

          // Check for expected content-type.
          if (!/^application\/json/.test(contentType)) {
            error = `Invalid content-type.\nExpected application/json but received ${contentType}. Status Code: ${res?.statusCode}`;
          }

          if (error) {
            // Log error and consume response data to free up memory.
            res.resume();
            return this.retryOrReject(
              error,
              attempt,
              deferred,
              String(networkOptions.path).split('?')[0],
              attemptRequest,
            );
          }
          res.setEncoding('utf8');

          // Collect data chunks.
          res.on('data', (chunk) => {
            rawData += chunk;
          });

          // Handle the end of the response.
          res.on('end', () => {
            try {
              const parsedData = JSON.parse(rawData);

              // Check for successful response status.
              if (responseModel.getStatusCode() < 200 || responseModel.getStatusCode() >= 300) {
                const error = `${rawData}, Status Code: ${responseModel.getStatusCode()}`;
                // if status code is 400, reject the promise as it is a bad request
                if (responseModel.getStatusCode() === 400) {
                  responseModel.setError(error);
                  deferred.reject(responseModel);
                  return;
                }
                return this.retryOrReject(
                  error,
                  attempt,
                  deferred,
                  String(networkOptions.path).split('?')[0],
                  attemptRequest,
                );
              }
              responseModel.setData(parsedData);
              deferred.resolve(responseModel);
            } catch (err) {
              return this.retryOrReject(
                err,
                attempt,
                deferred,
                String(networkOptions.path).split('?')[0],
                attemptRequest,
              );
            }
          });
        });

        // Handle request timeout.
        req.on('timeout', () => {
          return this.retryOrReject(
            new Error('timeout'),
            attempt,
            deferred,
            String(networkOptions.path).split('?')[0],
            attemptRequest,
          );
        });

        req.on('error', (err) => {
          return this.retryOrReject(err, attempt, deferred, String(networkOptions.path).split('?')[0], attemptRequest);
        });
      } catch (err) {
        this.retryOrReject(err, attempt, deferred, String(networkOptions.path).split('?')[0], attemptRequest);
      }

      return deferred.promise;
    };

    return attemptRequest(0);
  }

  /**
   * Performs a POST request using the provided RequestModel.
   * @param {RequestModel} request - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  POST(request: RequestModel): Promise<ResponseModel> {
    const attemptRequest = (attempt: number): Promise<ResponseModel> => {
      const deferred = new Deferred();
      const networkOptions: Record<string, dynamic> = request.getOptions();
      const responseModel: ResponseModel = new ResponseModel();

      try {
        // Choose HTTP or HTTPS client based on the scheme.
        const httpClient = networkOptions.scheme === HTTPS ? https : http;

        // Perform the HTTP POST request.
        const req = httpClient.request(networkOptions, (res) => {
          let rawData = '';
          res.setEncoding('utf8');

          // Collect data chunks.
          res.on('data', function (chunk) {
            rawData += chunk;
          });

          // Handle the end of the response.
          res.on('end', () => {
            try {
              if (res.statusCode === 200) {
                responseModel.setStatusCode(res.statusCode);
                responseModel.setData(request.getBody());
                deferred.resolve(responseModel);
              } else {
                const error = `Raw Data: ${rawData}, Status Code: ${res.statusCode}`;
                responseModel.setStatusCode(res.statusCode);
                // if status code is 400, reject the promise as it is a bad request
                if (res.statusCode === 400) {
                  responseModel.setError(error);
                  deferred.reject(responseModel);
                  return;
                }
                return this.retryOrReject(
                  error,
                  attempt,
                  deferred,
                  String(networkOptions.path).split('?')[0],
                  attemptRequest,
                );
              }
            } catch (err) {
              return this.retryOrReject(
                err,
                attempt,
                deferred,
                String(networkOptions.path).split('?')[0],
                attemptRequest,
              );
            }
          });
        });

        // Handle request timeout.
        req.on('timeout', () => {
          const error = `Timeout: ${networkOptions.timeout}`;
          return this.retryOrReject(
            error,
            attempt,
            deferred,
            String(networkOptions.path).split('?')[0],
            attemptRequest,
          );
        });

        req.on('error', (err) => {
          return this.retryOrReject(err, attempt, deferred, String(networkOptions.path).split('?')[0], attemptRequest);
        });

        // Write data to the request body and end the request.
        req.write(JSON.stringify(networkOptions.body));
        req.end();
      } catch (err) {
        this.retryOrReject(err, attempt, deferred, String(networkOptions.path).split('?')[0], attemptRequest);
      }

      return deferred.promise;
    };

    return attemptRequest(0);
  }

  /**
   * Helper function to retry or reject
   * @param {any} error - The error to retry or reject
   * @param {number} attempt - The attempt number
   * @param {any} deferred - The deferred object
   * @param {string} operation - The operation to retry or reject
   * @param {Function} attemptRequest - The function to attempt the request
   */
  private retryOrReject(
    error: any,
    attempt: number,
    deferred: any,
    endpoint: string,
    attemptRequest: (attempt: number) => Promise<ResponseModel>,
  ) {
    const delay = Constants.RETRY_DELAY * Math.pow(2, attempt + 1);
    if (attempt < Constants.MAX_RETRIES) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_RETRY_ATTEMPT, {
          endPoint: endpoint,
          err: error,
          delay: delay / 1000,
          attempt: attempt + 1,
          maxRetries: Constants.MAX_RETRIES,
        }),
      );
      setTimeout(() => {
        attemptRequest(attempt + 1)
          .then(deferred.resolve)
          .catch(deferred.reject);
      }, delay);
    } else {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_RETRY_FAILED, {
          endPoint: endpoint,
          err: error,
        }),
      );
      const responseModel = new ResponseModel();
      responseModel.setError(error);
      deferred.reject(responseModel);
    }
  }
}