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
import { UrlEnum } from '../enums/UrlEnum';
import { LogManager } from '../packages/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../packages/network-layer';
import UrlService from '../services/UrlService';
import { Deferred } from './PromiseUtil';

/**
 * Asynchronously retrieves data from a web service using the specified query parameters and endpoint.
 * @param queryParams - The parameters to be used in the query string of the request.
 * @param endpoint - The endpoint URL to which the request is sent.
 * @returns A promise that resolves to the response data or false if an error occurs.
 */
export async function getFromGatewayService(queryParams: any, endpoint: any): Promise<any> {
  // Create a new deferred object to manage promise resolution
  const deferredObject = new Deferred();
  // Singleton instance of the network manager
  const networkInstance = NetworkManager.Instance;

  // Check if the base URL is not set correctly
  if (UrlService.getBaseUrl() === UrlEnum.BASE_URL) {
    // Log an informational message about the invalid URL
    LogManager.Instance.error('Invalid URL. Please provide a valid URL for VWO Gateway Service');
    // Resolve the promise with false indicating an error or invalid state
    deferredObject.resolve(false);
    return deferredObject.promise;
  }

  try {
    // Create a new request model instance with the provided parameters
    const request: RequestModel = new RequestModel(
      UrlService.getBaseUrl(),
      'GET',
      endpoint,
      queryParams,
      null,
      null,
      null,
      UrlService.getPort(),
    );

    // Perform the network GET request
    networkInstance
      .get(request)
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
    // Log an error if an exception occurs during the request
    console.error('Error occurred while sending GET request:', err);
    // Resolve the promise with false as fallback
    deferredObject.resolve(false);
    return deferredObject.promise;
  }
}

/**
 * Encodes the query parameters to ensure they are URL-safe.
 * @param queryParams  The query parameters to be encoded.
 * @returns  An object containing the encoded query parameters.
 */
export function getQueryParams(queryParams: Record<string, string | number>): Record<string, string> {
  const encodedParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(queryParams)) {
    // Encode the parameter value to ensure it is URL-safe
    const encodedValue = encodeURIComponent(String(value));
    // Add the encoded parameter to the result object
    encodedParams[key] = encodedValue;
  }

  return encodedParams;
}
