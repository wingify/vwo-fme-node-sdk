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
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { LogManager } from '../packages/logger';
import { buildMessage } from './LogMessageUtil';
import { ErrorLogMessagesEnum } from '../enums/log-messages';
import { Constants } from '../constants';

const noop = () => {};

export function sendGetCall(options) {
  sendRequest(HttpMethodEnum.GET, options);
}

export function sendPostCall(options) {
  sendRequest(HttpMethodEnum.POST, options);
}

function sendRequest(method, options) {
  const { networkOptions, successCallback = noop, errorCallback = noop } = options;

  let retryCount = 0;

  function executeRequest() {
    let url = `${networkOptions.scheme}://${networkOptions.hostname}${networkOptions.path}`;
    if (networkOptions.port) {
      url = `${networkOptions.scheme}://${networkOptions.hostname}:${networkOptions.port}${networkOptions.path}`;
    }
    const body = networkOptions.body;
    const customHeaders = networkOptions.headers || {};
    const timeout = networkOptions.timeout;

    const xhr = new XMLHttpRequest();

    if (timeout) {
      xhr.timeout = timeout;
    }

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = xhr.responseText;

        if (method === HttpMethodEnum.GET) {
          const parsedResponse = JSON.parse(response);
          successCallback(parsedResponse);
        } else {
          successCallback(response);
        }
      } else if (xhr.status === 400) {
        errorCallback(xhr.statusText);
      } else {
        handleError(xhr.statusText);
      }
    };

    xhr.onerror = function () {
      handleError(`${xhr.statusText}, status: ${xhr.status}`);
    };

    if (timeout) {
      xhr.ontimeout = function () {
        handleError('Request timed out');
      };
    }

    function handleError(error) {
      if (retryCount < Constants.MAX_RETRIES) {
        retryCount++;
        const delay = Constants.RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        LogManager.Instance.error(
          buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_RETRY_ATTEMPT, {
            endPoint: url.split('?')[0],
            err: error,
            delay: delay / 1000,
            attempt: retryCount,
            maxRetries: Constants.MAX_RETRIES,
          }),
        );

        setTimeout(executeRequest, delay);
      } else {
        LogManager.Instance.error(
          buildMessage(ErrorLogMessagesEnum.NETWORK_CALL_RETRY_FAILED, {
            endPoint: url.split('?')[0],
            err: error,
          }),
        );
        errorCallback(error);
      }
    }

    xhr.open(method, url, true);

    for (const headerName in customHeaders) {
      if (headerName in customHeaders) {
        // Skip the Content-Type header
        // Request header field content-type is not allowed by Access-Control-Allow-Headers
        if (headerName !== 'Content-Type' && headerName !== 'Content-Length') {
          xhr.setRequestHeader(headerName, customHeaders[headerName]);
        }
      }
    }

    if (method === HttpMethodEnum.POST && typeof body !== 'string') {
      xhr.send(JSON.stringify(body));
    } else if (method === HttpMethodEnum.GET) {
      xhr.send();
    }
  }

  executeRequest();
}
