"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkBrowserClient = void 0;
/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
var XMLUtil_1 = require("../../../utils/XMLUtil");
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var ResponseModel_1 = require("../models/ResponseModel");
var FunctionUtil_1 = require("../../../utils/FunctionUtil");
var LogMessageUtil_1 = require("../../../utils/LogMessageUtil");
var log_messages_1 = require("../../../enums/log-messages");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var NetworkTransportModeEnum_1 = require("../../../enums/NetworkTransportModeEnum");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkBrowserClient = /** @class */ (function () {
    function NetworkBrowserClient(logManager, networkTransportMode) {
        if (networkTransportMode === void 0) { networkTransportMode = NetworkTransportModeEnum_1.NetworkTransportModeEnum.SEND_BEACON; }
        this.logManager = logManager;
        this.networkTransportMode = networkTransportMode;
    }
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    NetworkBrowserClient.prototype.GET = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        (0, XMLUtil_1.sendGetCall)({
            requestModel: requestModel,
            successCallback: function (responseModel) {
                deferred.resolve(responseModel);
            },
            errorCallback: function (responseModel) {
                deferred.reject(responseModel);
            },
        }, this.logManager);
        return deferred.promise;
    };
    /**
     * Performs a POST request using navigator.sendBeacon. If the request is not queued, it will be performed using XHR.
     * @param {RequestModel} request - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    NetworkBrowserClient.prototype.POST = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        // if networkTransportMode is SEND_BEACON, and navigator.sendBeacon is defined, use beacon
        // sendBeacon can be undefined for internet explorer 11 - so we will fallback to XHR
        if (this.networkTransportMode.toLowerCase() !== NetworkTransportModeEnum_1.NetworkTransportModeEnum.XHR.toLowerCase() &&
            typeof navigator !== 'undefined' && // not using DataTypeUtil.isUndefined because we want to check for the existence of navigator object in non-browser environments
            typeof navigator.sendBeacon === 'function') {
            var responseModel = new ResponseModel_1.ResponseModel();
            try {
                this.logManager.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                    api: NetworkTransportModeEnum_1.NetworkTransportModeEnum.SEND_BEACON,
                    process: 'undefined',
                }));
                var networkOptions = requestModel.getOptions();
                var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
                if (networkOptions.port) {
                    url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
                }
                var body = networkOptions.body;
                var postBody = (0, DataTypeUtil_1.isString)(body) ? body : JSON.stringify(body || {});
                // sendBeacon returns a boolean indicating if the request was queued
                var queued = navigator.sendBeacon(url, postBody);
                if (!queued) {
                    // if the request was not queued, fallback to XHR
                    return this.POST_XHR(requestModel);
                }
                else {
                    // if the request was queued, resolve the promise with a success response
                    responseModel.setStatusCode(200);
                    responseModel.setData(undefined);
                    deferred.resolve(responseModel);
                    return deferred.promise;
                }
            }
            catch (error) {
                var err = (0, FunctionUtil_1.getFormattedErrorMessage)(error);
                this.logManager.errorLog('SEND_BEACON_ERROR', {
                    err: err,
                }, {}, false);
                responseModel.setStatusCode(0);
                responseModel.setError(err);
                deferred.reject(responseModel);
                return deferred.promise;
            }
        }
        else {
            this.logManager.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                api: NetworkTransportModeEnum_1.NetworkTransportModeEnum.XHR,
                process: 'undefined',
            }));
            // if networkTransportMode is not SEND_BEACON, fallback to XHR
            return this.POST_XHR(requestModel);
        }
    };
    /**
     * Performs a POST request using XHR.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    NetworkBrowserClient.prototype.POST_XHR = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        (0, XMLUtil_1.sendPostCall)({
            requestModel: requestModel,
            successCallback: function (responseModel) {
                deferred.resolve(responseModel);
            },
            errorCallback: function (responseModel) {
                deferred.reject(responseModel);
            },
        }, this.logManager);
        return deferred.promise;
    };
    return NetworkBrowserClient;
}());
exports.NetworkBrowserClient = NetworkBrowserClient;
//# sourceMappingURL=NetworkBrowserClient.js.map