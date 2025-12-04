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
import { HttpMethodEnum } from '../enums/HttpMethodEnum.js';
import { LogManager } from '../packages/logger/index.js';
import { EventEnum } from '../enums/EventEnum.js';
import { ResponseModel } from '../packages/network-layer/models/ResponseModel.js';
import { getFormattedErrorMessage } from './FunctionUtil.js';
const noop = () => { };
export function sendGetCall(options) {
    sendRequest(HttpMethodEnum.GET, options);
}
export function sendPostCall(options) {
    sendRequest(HttpMethodEnum.POST, options);
}
function sendRequest(method, options) {
    const { requestModel, successCallback = noop, errorCallback = noop } = options;
    const networkOptions = requestModel.getOptions();
    let retryCount = 0;
    const shouldRetry = networkOptions.retryConfig.shouldRetry;
    const maxRetries = networkOptions.retryConfig.maxRetries;
    function executeRequest() {
        // Extract network options from the request model.
        const responseModel = new ResponseModel();
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
            responseModel.setStatusCode(xhr.status);
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = xhr.responseText;
                // send log to vwo, if request is successful and attempt is greater than 0
                if (retryCount > 0) {
                    responseModel.setTotalAttempts(retryCount);
                    responseModel.setError(requestModel.getLastError());
                }
                if (method === HttpMethodEnum.GET) {
                    const parsedResponse = JSON.parse(response);
                    responseModel.setData(parsedResponse);
                    successCallback(responseModel);
                }
                else {
                    responseModel.setData(response);
                    successCallback(responseModel);
                }
            }
            else if (xhr.status === 400) {
                responseModel.setTotalAttempts(retryCount);
                responseModel.setError(xhr.responseText);
                errorCallback(responseModel);
            }
            else {
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
            if (shouldRetry && retryCount < maxRetries) {
                const delay = networkOptions.retryConfig.initialDelay *
                    Math.pow(networkOptions.retryConfig.backoffMultiplier, retryCount) *
                    1000; // Exponential backoff
                retryCount++;
                LogManager.Instance.errorLog('ATTEMPTING_RETRY_FOR_FAILED_NETWORK_CALL', {
                    endPoint: url.split('?')[0],
                    err: getFormattedErrorMessage(error),
                    delay: delay / 1000,
                    attempt: retryCount,
                    maxRetries: maxRetries,
                }, {}, false);
                requestModel.setLastError(error);
                setTimeout(executeRequest, delay);
            }
            else {
                if (!String(networkOptions.path).includes(EventEnum.VWO_DEBUGGER_EVENT)) {
                    LogManager.Instance.errorLog('NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES', {
                        extraData: url.split('?')[0],
                        attempts: retryCount,
                        err: getFormattedErrorMessage(error),
                    }, {}, false);
                }
                responseModel.setTotalAttempts(retryCount);
                responseModel.setError(getFormattedErrorMessage(error));
                errorCallback(responseModel);
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
        }
        else if (method === HttpMethodEnum.GET) {
            xhr.send();
        }
    }
    executeRequest();
}
//# sourceMappingURL=XMLUtil.js.map