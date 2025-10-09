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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasingUtil = void 0;
var network_layer_1 = require("../packages/network-layer");
var SettingsService_1 = require("../services/SettingsService");
var HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
var UrlEnum_1 = require("../enums/UrlEnum");
var PromiseUtil_1 = require("./PromiseUtil");
/**
 * Utility class for handling alias operations through network calls to gateway
 */
var AliasingUtil = /** @class */ (function () {
    function AliasingUtil() {
    }
    /**
     * Retrieves alias for a given user ID
     * @param userId - The user identifier
     * @returns Promise<any | null> - The response from the gateway
     */
    AliasingUtil.getAlias = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, gatewayServiceUrl, gatewayServicePort, gatewayServiceProtocol, retryConfig, queryParams, request;
            var _a, _b;
            return __generator(this, function (_c) {
                deferredObject = new PromiseUtil_1.Deferred();
                try {
                    gatewayServiceUrl = null;
                    gatewayServicePort = null;
                    gatewayServiceProtocol = null;
                    retryConfig = network_layer_1.NetworkManager.Instance.getRetryConfig();
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
                    queryParams = {};
                    queryParams['accountId'] = (_a = SettingsService_1.SettingsService.Instance) === null || _a === void 0 ? void 0 : _a.accountId;
                    queryParams['sdkKey'] = (_b = SettingsService_1.SettingsService.Instance) === null || _b === void 0 ? void 0 : _b.sdkKey;
                    // Backend expects userId as JSON array
                    queryParams[this.KEY_USER_ID] = JSON.stringify([userId]);
                    request = new network_layer_1.RequestModel(gatewayServiceUrl, HttpMethodEnum_1.HttpMethodEnum.GET, this.GET_ALIAS_URL, queryParams, null, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
                    // Perform the network GET request
                    network_layer_1.NetworkManager.Instance.get(request)
                        .then(function (response) {
                        // Resolve the deferred object with the response
                        deferredObject.resolve(response.getData());
                    })
                        .catch(function (err) {
                        // Reject the deferred object with the error response
                        deferredObject.reject(err);
                    });
                    return [2 /*return*/, deferredObject.promise];
                }
                catch (error) {
                    // Resolve the promise with false as fallback
                    deferredObject.resolve(false);
                    return [2 /*return*/, deferredObject.promise];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Sets alias for a given user ID
     * @param userId - The user identifier
     * @param aliasId - The alias identifier to set
     * @returns Promise<ResponseModel | null> - The response from the gateway
     */
    AliasingUtil.setAlias = function (userId, aliasId) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, gatewayServiceUrl, gatewayServicePort, gatewayServiceProtocol, retryConfig, queryParams, requestBody, request;
            var _a;
            var _b, _c;
            return __generator(this, function (_d) {
                deferredObject = new PromiseUtil_1.Deferred();
                try {
                    gatewayServiceUrl = null;
                    gatewayServicePort = null;
                    gatewayServiceProtocol = null;
                    retryConfig = network_layer_1.NetworkManager.Instance.getRetryConfig();
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
                    queryParams = {};
                    queryParams['accountId'] = (_b = SettingsService_1.SettingsService.Instance) === null || _b === void 0 ? void 0 : _b.accountId;
                    queryParams['sdkKey'] = (_c = SettingsService_1.SettingsService.Instance) === null || _c === void 0 ? void 0 : _c.sdkKey;
                    queryParams[this.KEY_USER_ID] = userId;
                    queryParams[this.KEY_ALIAS_ID] = aliasId;
                    requestBody = (_a = {},
                        _a[this.KEY_USER_ID] = userId,
                        _a[this.KEY_ALIAS_ID] = aliasId,
                        _a);
                    request = new network_layer_1.RequestModel(gatewayServiceUrl, HttpMethodEnum_1.HttpMethodEnum.POST, this.SET_ALIAS_URL, queryParams, requestBody, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
                    // Perform the network POST request
                    network_layer_1.NetworkManager.Instance.post(request)
                        .then(function (response) {
                        // Resolve the deferred object with the response
                        deferredObject.resolve(response.getData());
                    })
                        .catch(function (err) {
                        // Reject the deferred object with the error response
                        deferredObject.reject(err);
                    });
                    return [2 /*return*/, deferredObject.promise];
                }
                catch (error) {
                    // Resolve the promise with false as fallback
                    deferredObject.resolve(false);
                    return [2 /*return*/, deferredObject.promise];
                }
                return [2 /*return*/];
            });
        });
    };
    AliasingUtil.KEY_USER_ID = 'userId';
    AliasingUtil.KEY_ALIAS_ID = 'aliasId';
    // Alias API endpoints
    AliasingUtil.GET_ALIAS_URL = UrlEnum_1.UrlEnum.GET_ALIAS;
    AliasingUtil.SET_ALIAS_URL = UrlEnum_1.UrlEnum.SET_ALIAS;
    return AliasingUtil;
}());
exports.AliasingUtil = AliasingUtil;
//# sourceMappingURL=AliasingUtil.js.map