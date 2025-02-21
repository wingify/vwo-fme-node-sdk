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

import { dynamic } from '../types/Common';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { getCurrentTime } from './FunctionUtil';

export function sendGetCall(networkOptions: Record<string, dynamic>): Promise<dynamic> {
  return sendRequest(HttpMethodEnum.GET, networkOptions);
}

export function sendPostCall(networkOptions: Record<string, dynamic>): Promise<dynamic> {
  return sendRequest(HttpMethodEnum.POST, networkOptions);
}

/**
 * Sends a request to the server using the Fetch API.
 * @param method - The HTTP method to use for the request.
 * @param networkOptions - The options for the request.
 * @returns A Promise that resolves to the response data.
 */
function sendRequest(method: HttpMethodEnum, networkOptions: Record<string, dynamic>): Promise<dynamic> {
  const url = `${networkOptions.scheme}://${networkOptions.hostname}${networkOptions.path}`;
  return new Promise((resolve, reject) => {
    if (method === HttpMethodEnum.POST) {
      networkOptions.body = JSON.stringify(networkOptions.body);
    }
    fetch(url, networkOptions)
      .then((res) => {
        // Some endpoints return empty strings as the response body; treat
        // as raw text and handle potential JSON parsing errors below
        return res.text().then((text) => {
          let jsonData = {};
          try {
            if (method === HttpMethodEnum.GET) {
              jsonData = JSON.parse(text);
            } else {
              jsonData = text;
            }
          } catch (err) {
            console.info(
              `VWO-SDK - [INFO]: ${getCurrentTime()} VWO didn't send JSON response which is expected: ${err}`,
            );
          }

          if (res.status === 200) {
            resolve(jsonData);
          } else {
            let errorMessage = '';

            if (method === HttpMethodEnum.GET) {
              errorMessage = `VWO-SDK - [ERROR]: ${getCurrentTime()} Request failed for fetching account settings. Got Status Code: ${res.status}`;
            } else if (method === HttpMethodEnum.POST) {
              errorMessage = `VWO-SDK - [ERROR]: ${getCurrentTime()} Request failed while making a POST request. Got Status Code: ${res.status}`;
            }
            console.error(errorMessage);
            reject(errorMessage);
          }
        });
      })
      .catch((err) => {
        let errorMessage = '';

        if (method === HttpMethodEnum.GET) {
          errorMessage = `VWO-SDK - [ERROR]: ${getCurrentTime()} GET request failed for fetching account settings. Error: ${err}`;
        } else if (method === HttpMethodEnum.POST) {
          errorMessage = `VWO-SDK - [ERROR]: ${getCurrentTime()} POST request failed while sending data. Error: ${err}`;
        }

        console.error(errorMessage);
        reject(errorMessage);
      });
  });
}
