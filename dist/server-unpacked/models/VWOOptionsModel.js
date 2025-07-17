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
exports.VWOOptionsModel = void 0;
var VWOOptionsModel = /** @class */ (function () {
    function VWOOptionsModel() {
    }
    VWOOptionsModel.prototype.modelFromDictionary = function (options) {
        this.accountId = options.accountId;
        this.sdkKey = options.sdkKey;
        this.vwoBuilder = options.vwoBuilder;
        if (options === null || options === void 0 ? void 0 : options.shouldWaitForTrackingCalls) {
            this.shouldWaitForTrackingCalls = options.shouldWaitForTrackingCalls;
        }
        if (options === null || options === void 0 ? void 0 : options.isDevelopmentMode) {
            this.isDevelopmentMode = options.isDevelopmentMode;
        }
        if (options === null || options === void 0 ? void 0 : options.storage) {
            this.storage = options.storage;
        }
        if (options === null || options === void 0 ? void 0 : options.gatewayService) {
            this.gatewayService = options.gatewayService;
        }
        if (options === null || options === void 0 ? void 0 : options.pollInterval) {
            this.pollInterval = options.pollInterval;
        }
        if (options === null || options === void 0 ? void 0 : options.logger) {
            this.logger = options.logger;
        }
        if (options === null || options === void 0 ? void 0 : options.segmentation) {
            this.segmentation = options.segmentation;
        }
        if (options === null || options === void 0 ? void 0 : options.integrations) {
            this.integrations = options.integrations;
        }
        if (options === null || options === void 0 ? void 0 : options.network) {
            this.network = options.network;
        }
        if (options === null || options === void 0 ? void 0 : options.settings) {
            this.settings = options.settings;
        }
        if (options === null || options === void 0 ? void 0 : options.isUsageStatsDisabled) {
            this.isUsageStatsDisabled = options.isUsageStatsDisabled;
        }
        if (options === null || options === void 0 ? void 0 : options._vwo_meta) {
            this._vwo_meta = options._vwo_meta;
        }
        if (options === null || options === void 0 ? void 0 : options.clientStorage) {
            this.clientStorage = options.clientStorage;
        }
        if (options === null || options === void 0 ? void 0 : options.retryConfig) {
            this.retryConfig = options.retryConfig;
        }
        if (options === null || options === void 0 ? void 0 : options.proxyUrl) {
            this.proxyUrl = options.proxyUrl;
        }
        return this;
    };
    VWOOptionsModel.prototype.getAccountId = function () {
        return this.accountId;
    };
    VWOOptionsModel.prototype.getSdkKey = function () {
        return this.sdkKey;
    };
    VWOOptionsModel.prototype.getIsDevelopmentMode = function () {
        return this.isDevelopmentMode;
    };
    VWOOptionsModel.prototype.getStorageService = function () {
        return this.storage;
    };
    VWOOptionsModel.prototype.getGatewayService = function () {
        return this.gatewayService;
    };
    VWOOptionsModel.prototype.getPollInterval = function () {
        return this.pollInterval;
    };
    VWOOptionsModel.prototype.getLogger = function () {
        return this.logger;
    };
    VWOOptionsModel.prototype.getSegmentation = function () {
        return this.segmentation;
    };
    VWOOptionsModel.prototype.getNetwork = function () {
        return this.network;
    };
    VWOOptionsModel.prototype.getVWOBuilder = function () {
        return this.vwoBuilder;
    };
    VWOOptionsModel.prototype.getSettings = function () {
        return this.settings;
    };
    VWOOptionsModel.prototype.getIsUsageStatsDisabled = function () {
        return this.isUsageStatsDisabled;
    };
    VWOOptionsModel.prototype.getVWOMeta = function () {
        return this._vwo_meta;
    };
    VWOOptionsModel.prototype.getClientStorage = function () {
        return this.clientStorage;
    };
    VWOOptionsModel.prototype.getRetryConfig = function () {
        return this.retryConfig;
    };
    VWOOptionsModel.prototype.getProxyUrl = function () {
        return this.proxyUrl;
    };
    return VWOOptionsModel;
}());
exports.VWOOptionsModel = VWOOptionsModel;
//# sourceMappingURL=VWOOptionsModel.js.map