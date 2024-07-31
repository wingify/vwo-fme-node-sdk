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
import * as http from 'http';
import * as https from 'https';
import { dynamic } from '../../../types/Common';
import { Deferred } from '../../../utils/PromiseUtil';

import { HTTPS } from '../../../constants/Url';
import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { NetworkClientInterface } from './NetworkClientInterface';

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
          error = `Invalid content-type.\nExpected application/json but received ${contentType}`;
        }

        if (error) {
          // Log error and consume response data to free up memory.
          res.resume();
          responseModel.setError(error);
          deferred.reject(responseModel);
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
            if (responseModel.getStatusCode() !== 200) {
              const error = `Request failed. Got Status Code: ${responseModel.getStatusCode()} and message: ${rawData}`;
              responseModel.setError(error);
              deferred.reject(responseModel);
              return;
            }
            responseModel.setData(parsedData);
            deferred.resolve(responseModel);
          } catch (err) {
            responseModel.setError(err);
            deferred.reject(responseModel);
          }
        });
      });

      // Handle request timeout.
      req.on('timeout', () => {
        responseModel.setError(new Error('timeout'));
        deferred.reject(responseModel);
      });

      req.on('error', (err) => {
        responseModel.setError(err);
        deferred.reject(responseModel);
      });
    } catch (err) {
      responseModel.setError(err);
      deferred.reject(responseModel);
    }

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
          if (res.statusCode === 200) {
            responseModel.setData(request.getBody());
            deferred.resolve(responseModel);
          } else if (res.statusCode === 413) {
            const parsedData = JSON.parse(rawData);
            responseModel.setError(parsedData.error);
            responseModel.setData(request.getBody());
            deferred.reject(responseModel);
          } else {
            const parsedData = JSON.parse(rawData);
            responseModel.setError(parsedData.message);
            responseModel.setData(request.getBody());
            deferred.reject(responseModel);
          }
        });
      });

      // Handle request timeout.
      req.on('timeout', () => {
        responseModel.setError(new Error('timeout'));
        responseModel.setData(request.getBody());
        deferred.reject(responseModel);
      });

      // Write data to the request body and end the request.
      req.write(JSON.stringify(networkOptions.body));
      req.end();
    } catch (err) {
      responseModel.setError(err);
      responseModel.setData(request.getBody());
      deferred.reject(responseModel);
    }

    return deferred.promise;
  }
}
