"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchEventsDispatcher = void 0;
const network_layer_1 = require("../packages/network-layer");
const UrlUtil_1 = require("./UrlUtil");
const network_layer_2 = require("../packages/network-layer");
const HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
const UrlEnum_1 = require("../enums/UrlEnum");
const SettingsService_1 = require("../services/SettingsService");
const logger_1 = require("../packages/logger");
const LogMessageUtil_1 = require("../utils/LogMessageUtil");
const log_messages_1 = require("../enums/log-messages");
const DataTypeUtil_1 = require("../utils/DataTypeUtil");
const PromiseUtil_1 = require("./PromiseUtil");
class BatchEventsDispatcher {
    static async dispatch(payload, flushCallback, queryParams) {
        return await this.sendPostApiRequest(queryParams, payload, flushCallback);
    }
    /**
     * Sends a POST request to the server.
     * @param properties - The properties of the request.
     * @param payload - The payload of the request.
     * @returns A promise that resolves to a void.
     */
    static async sendPostApiRequest(properties, payload, flushCallback) {
        const deferred = new PromiseUtil_1.Deferred();
        const networkManager = network_layer_2.NetworkManager.Instance;
        networkManager.attachClient();
        const retryConfig = networkManager.getRetryConfig();
        const headers = {};
        headers['Authorization'] = SettingsService_1.SettingsService.Instance.sdkKey;
        let baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
        baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
        const request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.BATCH_EVENTS, properties, payload, headers, SettingsService_1.SettingsService.Instance.protocol, SettingsService_1.SettingsService.Instance.port, retryConfig);
        try {
            const response = await network_layer_2.NetworkManager.Instance.post(request);
            const batchApiResult = this.handleBatchResponse(UrlEnum_1.UrlEnum.BATCH_EVENTS, payload, properties, null, response, flushCallback);
            deferred.resolve(batchApiResult);
            return deferred.promise;
        }
        catch (error) {
            const batchApiResult = this.handleBatchResponse(UrlEnum_1.UrlEnum.BATCH_EVENTS, payload, properties, error, null, flushCallback);
            deferred.resolve(batchApiResult);
            return deferred.promise;
        }
    }
    /**
     * Handles the response from batch events API call
     * @param properties - Request properties containing events
     * @param queryParams - Query parameters from the request
     * @param error - Error object if request failed
     * @param res - Response object from the API
     * @param rawData - Raw response data
     * @param callback - Callback function to handle the result
     */
    static handleBatchResponse(endPoint, payload, queryParams, err, res, callback) {
        const eventsPerRequest = payload.ev.length;
        const accountId = queryParams.a;
        let error = err ? err : res?.getError();
        if (error && !(error instanceof Error)) {
            if ((0, DataTypeUtil_1.isString)(error)) {
                error = new Error(error);
            }
            else if (error instanceof Object) {
                error = new Error(JSON.stringify(error));
            }
        }
        if (error) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPRESSION_BATCH_FAILED));
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                err: error.message,
            }));
            callback(error, payload);
            return { status: 'error', events: payload };
        }
        const statusCode = res?.getStatusCode();
        if (statusCode === 200) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPRESSION_BATCH_SUCCESS, {
                accountId,
                endPoint,
            }));
            callback(null, payload);
            return { status: 'success', events: payload };
        }
        if (statusCode === 413) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.CONFIG_BATCH_EVENT_LIMIT_EXCEEDED, {
                accountId,
                endPoint,
                eventsPerRequest,
            }));
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                err: error.message,
            }));
            callback(error, payload);
            return { status: 'error', events: payload };
        }
        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.IMPRESSION_BATCH_FAILED));
        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
            method: HttpMethodEnum_1.HttpMethodEnum.POST,
            err: error.message,
        }));
        callback(error, payload);
        return { status: 'error', events: payload };
    }
}
exports.BatchEventsDispatcher = BatchEventsDispatcher;
exports.default = BatchEventsDispatcher;
//# sourceMappingURL=BatchEventsDispatcher.js.map