"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const PromiseUtil_1 = require("../../../utils/PromiseUtil");
const Url_1 = require("../../../constants/Url");
const ResponseModel_1 = require("../models/ResponseModel");
const logger_1 = require("../../../packages/logger");
const LogMessageUtil_1 = require("../../../utils/LogMessageUtil");
const log_messages_1 = require("../../../enums/log-messages");
const EventEnum_1 = require("../../../enums/EventEnum");
const LogMessageUtil_2 = require("../../../utils/LogMessageUtil");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
class NetworkClient {
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    GET(requestModel) {
        const attemptRequest = (attempt) => {
            const deferred = new PromiseUtil_1.Deferred();
            // Extract network options from the request model.
            const networkOptions = requestModel.getOptions();
            const responseModel = new ResponseModel_1.ResponseModel();
            try {
                // Choose HTTP or HTTPS client based on the scheme.
                const httpClient = networkOptions.scheme === Url_1.HTTPS ? https : http;
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
                        return this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, requestModel);
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
                                return this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, requestModel);
                            }
                            // send log to vwo, if request is successful and attempt is greater than 0
                            if (attempt > 0) {
                                (0, LogMessageUtil_2.sendLogToVWO)('Request successfully sent for event: ' + String(networkOptions.path).split('?')[0], logger_1.LogLevelEnum.INFO, requestModel.getExtraInfo());
                            }
                            responseModel.setData(parsedData);
                            deferred.resolve(responseModel);
                        }
                        catch (err) {
                            return this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel);
                        }
                    });
                });
                // Handle request timeout.
                req.on('timeout', () => {
                    return this.retryOrReject(new Error('timeout'), attempt, deferred, networkOptions, attemptRequest, requestModel);
                });
                req.on('error', (err) => {
                    return this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel);
                });
            }
            catch (err) {
                this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel);
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
    POST(request) {
        const attemptRequest = (attempt) => {
            const deferred = new PromiseUtil_1.Deferred();
            const networkOptions = request.getOptions();
            const responseModel = new ResponseModel_1.ResponseModel();
            try {
                // Choose HTTP or HTTPS client based on the scheme.
                const httpClient = networkOptions.scheme === Url_1.HTTPS ? https : http;
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
                                // if attempt is greater than 0, log the response
                                if (attempt > 0) {
                                    (0, LogMessageUtil_2.sendLogToVWO)('Request successfully sent for event: ' + String(networkOptions.path).split('?')[0], logger_1.LogLevelEnum.INFO, request.getExtraInfo());
                                }
                                responseModel.setStatusCode(res.statusCode);
                                responseModel.setData(request.getBody());
                                deferred.resolve(responseModel);
                            }
                            else {
                                const error = `Raw Data: ${rawData}, Status Code: ${res.statusCode}`;
                                responseModel.setStatusCode(res.statusCode);
                                // if status code is 400, reject the promise as it is a bad request
                                if (res.statusCode === 400) {
                                    responseModel.setError(error);
                                    deferred.reject(responseModel);
                                    return;
                                }
                                return this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, request);
                            }
                        }
                        catch (err) {
                            return this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request);
                        }
                    });
                });
                // Handle request timeout.
                req.on('timeout', () => {
                    const error = `Timeout: ${networkOptions.timeout}`;
                    return this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, request);
                });
                req.on('error', (err) => {
                    return this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request);
                });
                // Write data to the request body and end the request.
                req.write(JSON.stringify(networkOptions.body));
                req.end();
            }
            catch (err) {
                this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request);
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
    retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, request) {
        const retryConfig = request.getRetryConfig();
        const extraData = request.getExtraInfo();
        const endpoint = String(networkOptions.path).split('?')[0];
        const delay = retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt) * 1000;
        if (retryConfig.shouldRetry && attempt < retryConfig.maxRetries) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_ATTEMPT, {
                endPoint: endpoint,
                err: error,
                delay: delay / 1000,
                attempt: attempt + 1,
                maxRetries: retryConfig.maxRetries,
            }), extraData);
            setTimeout(() => {
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
            const responseModel = new ResponseModel_1.ResponseModel();
            responseModel.setError(error);
            deferred.reject(responseModel);
        }
    }
}
exports.NetworkClient = NetworkClient;
//# sourceMappingURL=NetworkClient.js.map