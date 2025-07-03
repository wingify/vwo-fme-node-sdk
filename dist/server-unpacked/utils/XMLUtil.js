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
var LogMessageUtil_1 = require("./LogMessageUtil");
var log_messages_1 = require("../enums/log-messages");
var EventEnum_1 = require("../enums/EventEnum");
var noop = function () { };
function sendGetCall(options) {
    sendRequest(HttpMethodEnum_1.HttpMethodEnum.GET, options);
}
function sendPostCall(options) {
    sendRequest(HttpMethodEnum_1.HttpMethodEnum.POST, options);
}
function sendRequest(method, options) {
    var networkOptions = options.networkOptions, _a = options.successCallback, successCallback = _a === void 0 ? noop : _a, _b = options.errorCallback, errorCallback = _b === void 0 ? noop : _b;
    var retryCount = 0;
    var shouldRetry = networkOptions.retryConfig.shouldRetry;
    var maxRetries = networkOptions.retryConfig.maxRetries;
    function executeRequest() {
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
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = xhr.responseText;
                if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
                    var parsedResponse = JSON.parse(response);
                    successCallback(parsedResponse);
                }
                else {
                    successCallback(response);
                }
            }
            else if (xhr.status === 400) {
                errorCallback(xhr.statusText);
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
                retryCount++;
                var delay = networkOptions.retryConfig.initialDelay *
                    Math.pow(networkOptions.retryConfig.backoffMultiplier, retryCount) *
                    1000; // Exponential backoff
                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_ATTEMPT, {
                    endPoint: url.split('?')[0],
                    err: error,
                    delay: delay,
                    attempt: retryCount,
                    maxRetries: maxRetries,
                }));
                setTimeout(executeRequest, delay);
            }
            else {
                if (!String(networkOptions.path).includes(EventEnum_1.EventEnum.VWO_LOG_EVENT)) {
                    logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_FAILED, {
                        endPoint: url.split('?')[0],
                        err: error,
                    }));
                }
                errorCallback(error);
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