"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkClient = void 0;
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
var http = require("http");
var https = require("https");
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var Url_1 = require("../../../constants/Url");
var ResponseModel_1 = require("../models/ResponseModel");
var logger_1 = require("../../../packages/logger");
var LogMessageUtil_1 = require("../../../utils/LogMessageUtil");
var log_messages_1 = require("../../../enums/log-messages");
var EventEnum_1 = require("../../../enums/EventEnum");
var LogMessageUtil_2 = require("../../../utils/LogMessageUtil");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkClient = /** @class */ (function () {
    function NetworkClient() {
    }
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    NetworkClient.prototype.GET = function (requestModel) {
        var _this = this;
        var attemptRequest = function (attempt) {
            var deferred = new PromiseUtil_1.Deferred();
            // Extract network options from the request model.
            var networkOptions = requestModel.getOptions();
            var responseModel = new ResponseModel_1.ResponseModel();
            try {
                // Choose HTTP or HTTPS client based on the scheme.
                var httpClient = networkOptions.scheme === Url_1.HTTPS ? https : http;
                // Perform the HTTP GET request.
                var req = httpClient.get(networkOptions, function (res) {
                    responseModel.setStatusCode(res.statusCode);
                    var contentType = res.headers['content-type'];
                    var error;
                    var rawData = '';
                    // Check for expected content-type.
                    if (!/^application\/json/.test(contentType)) {
                        error = "Invalid content-type.\nExpected application/json but received ".concat(contentType, ". Status Code: ").concat(res === null || res === void 0 ? void 0 : res.statusCode);
                    }
                    if (error) {
                        // Log error and consume response data to free up memory.
                        res.resume();
                        return _this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, requestModel);
                    }
                    res.setEncoding('utf8');
                    // Collect data chunks.
                    res.on('data', function (chunk) {
                        rawData += chunk;
                    });
                    // Handle the end of the response.
                    res.on('end', function () {
                        try {
                            var parsedData = JSON.parse(rawData);
                            // Check for successful response status.
                            if (responseModel.getStatusCode() < 200 || responseModel.getStatusCode() >= 300) {
                                var error_1 = "".concat(rawData, ", Status Code: ").concat(responseModel.getStatusCode());
                                // if status code is 400, reject the promise as it is a bad request
                                if (responseModel.getStatusCode() === 400) {
                                    responseModel.setError(error_1);
                                    deferred.reject(responseModel);
                                    return;
                                }
                                return _this.retryOrReject(error_1, attempt, deferred, networkOptions, attemptRequest, requestModel);
                            }
                            // send log to vwo, if request is successful and attempt is greater than 0
                            if (attempt > 0) {
                                (0, LogMessageUtil_2.sendLogToVWO)('Request successfully sent for event: ' + String(networkOptions.path).split('?')[0], logger_1.LogLevelEnum.INFO, requestModel.getExtraInfo());
                            }
                            responseModel.setData(parsedData);
                            deferred.resolve(responseModel);
                        }
                        catch (err) {
                            return _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel);
                        }
                    });
                });
                // Handle request timeout.
                req.on('timeout', function () {
                    return _this.retryOrReject(new Error('timeout'), attempt, deferred, networkOptions, attemptRequest, requestModel);
                });
                req.on('error', function (err) {
                    return _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel);
                });
            }
            catch (err) {
                _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel);
            }
            return deferred.promise;
        };
        return attemptRequest(0);
    };
    /**
     * Performs a POST request using the provided RequestModel.
     * @param {RequestModel} request - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    NetworkClient.prototype.POST = function (request) {
        var _this = this;
        var attemptRequest = function (attempt) {
            var deferred = new PromiseUtil_1.Deferred();
            var networkOptions = request.getOptions();
            var responseModel = new ResponseModel_1.ResponseModel();
            try {
                // Choose HTTP or HTTPS client based on the scheme.
                var httpClient = networkOptions.scheme === Url_1.HTTPS ? https : http;
                // Perform the HTTP POST request.
                var req = httpClient.request(networkOptions, function (res) {
                    var rawData = '';
                    res.setEncoding('utf8');
                    // Collect data chunks.
                    res.on('data', function (chunk) {
                        rawData += chunk;
                    });
                    // Handle the end of the response.
                    res.on('end', function () {
                        try {
                            if (res.statusCode === 200) {
                                // if attempt is greater than 0, log the response
                                if (attempt > 0) {
                                    (0, LogMessageUtil_2.sendLogToVWO)('Request successfully sent for event: ' + String(networkOptions.path).split('?')[0], logger_1.LogLevelEnum.INFO, request.getExtraInfo());
                                }
                                responseModel.setStatusCode(res.statusCode);
                                responseModel.setData(request.getBody());
                                deferred.resolve(responseModel);
                            }
                            else {
                                var error = "Raw Data: ".concat(rawData, ", Status Code: ").concat(res.statusCode);
                                responseModel.setStatusCode(res.statusCode);
                                // if status code is 400, reject the promise as it is a bad request
                                if (res.statusCode === 400) {
                                    responseModel.setError(error);
                                    deferred.reject(responseModel);
                                    return;
                                }
                                return _this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, request);
                            }
                        }
                        catch (err) {
                            return _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request);
                        }
                    });
                });
                // Handle request timeout.
                req.on('timeout', function () {
                    var error = "Timeout: ".concat(networkOptions.timeout);
                    return _this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, request);
                });
                req.on('error', function (err) {
                    return _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request);
                });
                // Write data to the request body and end the request.
                req.write(JSON.stringify(networkOptions.body));
                req.end();
            }
            catch (err) {
                _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request);
            }
            return deferred.promise;
        };
        return attemptRequest(0);
    };
    /**
     * Helper function to retry or reject
     * @param {any} error - The error to retry or reject
     * @param {number} attempt - The attempt number
     * @param {any} deferred - The deferred object
     * @param {string} operation - The operation to retry or reject
     * @param {Function} attemptRequest - The function to attempt the request
     */
    NetworkClient.prototype.retryOrReject = function (error, attempt, deferred, networkOptions, attemptRequest, request) {
        var retryConfig = request.getRetryConfig();
        var extraData = request.getExtraInfo();
        var endpoint = String(networkOptions.path).split('?')[0];
        var delay = retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt) * 1000;
        if (retryConfig.shouldRetry && attempt < retryConfig.maxRetries) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_ATTEMPT, {
                endPoint: endpoint,
                err: error,
                delay: delay / 1000,
                attempt: attempt + 1,
                maxRetries: retryConfig.maxRetries,
            }), extraData);
            setTimeout(function () {
                attemptRequest(attempt + 1)
                    .then(deferred.resolve)
                    .catch(deferred.reject);
            }, delay);
        }
        else {
            if (!String(networkOptions.path).includes(EventEnum_1.EventEnum.VWO_LOG_EVENT)) {
                // only log error if the endpoint is not vwo_log event
                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_FAILED, {
                    endPoint: endpoint,
                    err: error,
                }), extraData);
            }
            var responseModel = new ResponseModel_1.ResponseModel();
            responseModel.setError(error);
            deferred.reject(responseModel);
        }
    };
    return NetworkClient;
}());
exports.NetworkClient = NetworkClient;
//# sourceMappingURL=NetworkClient.js.map