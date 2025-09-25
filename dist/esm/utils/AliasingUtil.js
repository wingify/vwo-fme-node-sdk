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
exports.AliasingUtil = void 0;
const network_layer_1 = require("../packages/network-layer");
const SettingsService_1 = require("../services/SettingsService");
const HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
const UrlEnum_1 = require("../enums/UrlEnum");
const PromiseUtil_1 = require("./PromiseUtil");
/**
 * Utility class for handling alias operations through network calls to gateway
 */
class AliasingUtil {
    /**
     * Retrieves alias for a given user ID
     * @param userId - The user identifier
     * @returns Promise<any | null> - The response from the gateway
     */
    static async getAlias(userId) {
        // Create a deferred object for proper promise handling
        const deferredObject = new PromiseUtil_1.Deferred();
        try {
            let gatewayServiceUrl = null;
            let gatewayServicePort = null;
            let gatewayServiceProtocol = null;
            const retryConfig = network_layer_1.NetworkManager.Instance.getRetryConfig();
            if (SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname != null) {
                gatewayServiceUrl = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname;
                gatewayServicePort = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.port;
                gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.protocol;
            }
            else {
                gatewayServiceUrl = SettingsService_1.SettingsService.Instance.hostname;
                gatewayServicePort = SettingsService_1.SettingsService.Instance.port;
                gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.protocol;
            }
            const queryParams = {};
            queryParams['accountId'] = SettingsService_1.SettingsService.Instance?.accountId;
            queryParams['sdkKey'] = SettingsService_1.SettingsService.Instance?.sdkKey;
            // Backend expects userId as JSON array
            queryParams[this.KEY_USER_ID] = JSON.stringify([userId]);
            const request = new network_layer_1.RequestModel(gatewayServiceUrl, HttpMethodEnum_1.HttpMethodEnum.GET, this.GET_ALIAS_URL, queryParams, null, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
            // Perform the network GET request
            network_layer_1.NetworkManager.Instance.get(request)
                .then((response) => {
                // Resolve the deferred object with the response
                deferredObject.resolve(response.getData());
            })
                .catch((err) => {
                // Reject the deferred object with the error response
                deferredObject.reject(err);
            });
            return deferredObject.promise;
        }
        catch (error) {
            // Resolve the promise with false as fallback
            deferredObject.resolve(false);
            return deferredObject.promise;
        }
    }
    /**
     * Sets alias for a given user ID
     * @param userId - The user identifier
     * @param aliasId - The alias identifier to set
     * @returns Promise<ResponseModel | null> - The response from the gateway
     */
    static async setAlias(userId, aliasId) {
        // Create a deferred object for proper promise handling
        const deferredObject = new PromiseUtil_1.Deferred();
        try {
            let gatewayServiceUrl = null;
            let gatewayServicePort = null;
            let gatewayServiceProtocol = null;
            const retryConfig = network_layer_1.NetworkManager.Instance.getRetryConfig();
            if (SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname != null) {
                gatewayServiceUrl = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname;
                gatewayServicePort = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.port;
                gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.protocol;
            }
            else {
                gatewayServiceUrl = SettingsService_1.SettingsService.Instance.hostname;
                gatewayServicePort = SettingsService_1.SettingsService.Instance.port;
                gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.protocol;
            }
            const queryParams = {};
            queryParams['accountId'] = SettingsService_1.SettingsService.Instance?.accountId;
            queryParams['sdkKey'] = SettingsService_1.SettingsService.Instance?.sdkKey;
            queryParams[this.KEY_USER_ID] = userId;
            queryParams[this.KEY_ALIAS_ID] = aliasId;
            const requestBody = {
                [this.KEY_USER_ID]: userId,
                [this.KEY_ALIAS_ID]: aliasId,
            };
            const request = new network_layer_1.RequestModel(gatewayServiceUrl, HttpMethodEnum_1.HttpMethodEnum.POST, this.SET_ALIAS_URL, queryParams, requestBody, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
            // Perform the network POST request
            network_layer_1.NetworkManager.Instance.post(request)
                .then((response) => {
                // Resolve the deferred object with the response
                deferredObject.resolve(response.getData());
            })
                .catch((err) => {
                // Reject the deferred object with the error response
                deferredObject.reject(err);
            });
            return deferredObject.promise;
        }
        catch (error) {
            // Resolve the promise with false as fallback
            deferredObject.resolve(false);
            return deferredObject.promise;
        }
    }
}
exports.AliasingUtil = AliasingUtil;
AliasingUtil.KEY_USER_ID = 'userId';
AliasingUtil.KEY_ALIAS_ID = 'aliasId';
// Alias API endpoints
AliasingUtil.GET_ALIAS_URL = UrlEnum_1.UrlEnum.GET_ALIAS;
AliasingUtil.SET_ALIAS_URL = UrlEnum_1.UrlEnum.SET_ALIAS;
//# sourceMappingURL=AliasingUtil.js.map