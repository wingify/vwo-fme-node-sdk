"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGetCall = sendGetCall;
exports.sendPostCall = sendPostCall;
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
var HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
var logger_1 = require("../packages/logger");
var EventEnum_1 = require("../enums/EventEnum");
var ResponseModel_1 = require("../packages/network-layer/models/ResponseModel");
var FunctionUtil_1 = require("./FunctionUtil");
var noop = function () { };
function sendGetCall(options) {
    sendRequest(HttpMethodEnum_1.HttpMethodEnum.GET, options);
}
function sendPostCall(options) {
    sendRequest(HttpMethodEnum_1.HttpMethodEnum.POST, options);
}
function sendRequest(method, options) {
    var requestModel = options.requestModel, _a = options.successCallback, successCallback = _a === void 0 ? noop : _a, _b = options.errorCallback, errorCallback = _b === void 0 ? noop : _b;
    var networkOptions = requestModel.getOptions();
    var retryCount = 0;
    var shouldRetry = networkOptions.retryConfig.shouldRetry;
    var maxRetries = networkOptions.retryConfig.maxRetries;
    function executeRequest() {
        // Extract network options from the request model.
        var responseModel = new ResponseModel_1.ResponseModel();
        var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
        if (networkOptions.port) {
            url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
        }
        var body = networkOptions.body;
        var customHeaders = networkOptions.headers || {};
        var timeout = networkOptions.timeout;
        var xhr = new XMLHttpRequest();
        if (timeout) {
            xhr.timeout = timeout;
        }
        xhr.onload = function () {
            responseModel.setStatusCode(xhr.status);
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = xhr.responseText;
                // send log to vwo, if request is successful and attempt is greater than 0
                if (retryCount > 0) {
                    responseModel.setTotalAttempts(retryCount);
                    responseModel.setError(requestModel.getLastError());
                }
                if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
                    var parsedResponse = JSON.parse(response);
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
            handleError("".concat(xhr.statusText, ", status: ").concat(xhr.status));
        };
        if (timeout) {
            xhr.ontimeout = function () {
                handleError('Request timed out');
            };
        }
        function handleError(error) {
            if (shouldRetry && retryCount < maxRetries) {
                var delay = networkOptions.retryConfig.initialDelay *
                    Math.pow(networkOptions.retryConfig.backoffMultiplier, retryCount) *
                    1000; // Exponential backoff
                retryCount++;
                logger_1.LogManager.Instance.errorLog('ATTEMPTING_RETRY_FOR_FAILED_NETWORK_CALL', {
                    endPoint: url.split('?')[0],
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                    delay: delay / 1000,
                    attempt: retryCount,
                    maxRetries: maxRetries,
                }, {}, false);
                requestModel.setLastError(error);
                setTimeout(executeRequest, delay);
            }
            else {
                if (!String(networkOptions.path).includes(EventEnum_1.EventEnum.VWO_LOG_EVENT)) {
                    logger_1.LogManager.Instance.errorLog('NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES', {
                        extraData: url.split('?')[0],
                        attempts: retryCount,
                        err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                    }, {}, false);
                }
                responseModel.setTotalAttempts(retryCount);
                responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(error));
                errorCallback(responseModel);
            }
        }
        xhr.open(method, url, true);
        for (var headerName in customHeaders) {
            if (headerName in customHeaders) {
                // Skip the Content-Type header
                // Request header field content-type is not allowed by Access-Control-Allow-Headers
                if (headerName !== 'Content-Type' && headerName !== 'Content-Length') {
                    xhr.setRequestHeader(headerName, customHeaders[headerName]);
                }
            }
        }
        if (method === HttpMethodEnum_1.HttpMethodEnum.POST && typeof body !== 'string') {
            xhr.send(JSON.stringify(body));
        }
        else if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
            xhr.send();
        }
    }
    executeRequest();
}
//# sourceMappingURL=XMLUtil.js.map