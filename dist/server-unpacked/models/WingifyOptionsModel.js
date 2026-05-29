"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WingifyOptionsModel = void 0;
var WingifyOptionsModel = /** @class */ (function () {
    function WingifyOptionsModel() {
    }
    WingifyOptionsModel.prototype.modelFromDictionary = function (options) {
        var _a;
        this.accountId = options.accountId;
        this.sdkKey = options.sdkKey;
        this.wingifyBuilder = options.wingifyBuilder || options.vwoBuilder;
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
        if ((options === null || options === void 0 ? void 0 : options._wingify_meta) || (options === null || options === void 0 ? void 0 : options._vwo_meta)) {
            this._wingify_meta = options._wingify_meta || options._vwo_meta;
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
        if (options === null || options === void 0 ? void 0 : options.isAliasingEnabled) {
            this.isAliasingEnabled = options.isAliasingEnabled;
        }
        if (options === null || options === void 0 ? void 0 : options.edgeConfig) {
            this.edgeConfig = options.edgeConfig;
        }
        if (options === null || options === void 0 ? void 0 : options.browserConfig) {
            this.browserConfig = options.browserConfig;
        }
        if (options === null || options === void 0 ? void 0 : options.sdkMeta) {
            this.sdkMeta = options.sdkMeta;
        }
        if (options === null || options === void 0 ? void 0 : options.httpsAgentConfig) {
            this.httpsAgentConfig = options.httpsAgentConfig;
        }
        // default to false if not provided
        this.isBatchingDisabled = (_a = options === null || options === void 0 ? void 0 : options.isBatchingDisabled) !== null && _a !== void 0 ? _a : false;
        return this;
    };
    /**
     * Gets the flag indicating whether batching is disabled.
     * @returns The flag indicating whether batching is disabled.
     */
    WingifyOptionsModel.prototype.getIsBatchingDisabled = function () {
        return this.isBatchingDisabled;
    };
    /**
     * Gets the HTTPS agent configuration.
     * @returns The HTTPS agent configuration.
     */
    WingifyOptionsModel.prototype.getHttpsAgentConfig = function () {
        return this.httpsAgentConfig;
    };
    WingifyOptionsModel.prototype.getAccountId = function () {
        return this.accountId;
    };
    WingifyOptionsModel.prototype.getSdkKey = function () {
        return this.sdkKey;
    };
    WingifyOptionsModel.prototype.getIsDevelopmentMode = function () {
        return this.isDevelopmentMode;
    };
    WingifyOptionsModel.prototype.getStorageService = function () {
        return this.storage;
    };
    WingifyOptionsModel.prototype.getGatewayService = function () {
        return this.gatewayService;
    };
    WingifyOptionsModel.prototype.getPollInterval = function () {
        return this.pollInterval;
    };
    WingifyOptionsModel.prototype.getLogger = function () {
        return this.logger;
    };
    WingifyOptionsModel.prototype.getSegmentation = function () {
        return this.segmentation;
    };
    WingifyOptionsModel.prototype.getNetwork = function () {
        return this.network;
    };
    WingifyOptionsModel.prototype.getWingifyBuilder = function () {
        return this.wingifyBuilder;
    };
    WingifyOptionsModel.prototype.getSettings = function () {
        return this.settings;
    };
    WingifyOptionsModel.prototype.getIsUsageStatsDisabled = function () {
        return this.isUsageStatsDisabled;
    };
    WingifyOptionsModel.prototype.getWingifyMeta = function () {
        return this._wingify_meta;
    };
    WingifyOptionsModel.prototype.getClientStorage = function () {
        return this.clientStorage;
    };
    WingifyOptionsModel.prototype.getRetryConfig = function () {
        return this.retryConfig;
    };
    WingifyOptionsModel.prototype.getProxyUrl = function () {
        return this.proxyUrl;
    };
    WingifyOptionsModel.prototype.getIsAliasingEnabled = function () {
        return this.isAliasingEnabled;
    };
    WingifyOptionsModel.prototype.getEdgeConfig = function () {
        return this.edgeConfig;
    };
    WingifyOptionsModel.prototype.getBrowserConfig = function () {
        return this.browserConfig;
    };
    /**
     * Gets the SDK meta.
     * @returns The SDK meta.
     */
    WingifyOptionsModel.prototype.getSdkMeta = function () {
        return this.sdkMeta;
    };
    /**
     * Gets the SDK name.
     * @returns The SDK name.
     */
    WingifyOptionsModel.prototype.getSdkName = function () {
        var _a, _b;
        return ((_a = this.sdkMeta) === null || _a === void 0 ? void 0 : _a._wingify_sdkName) || ((_b = this.sdkMeta) === null || _b === void 0 ? void 0 : _b._vwo_sdkName);
    };
    /**
     * Gets the SDK version.
     * @returns The SDK version.
     */
    WingifyOptionsModel.prototype.getVersion = function () {
        var _a, _b;
        return ((_a = this.sdkMeta) === null || _a === void 0 ? void 0 : _a._wingify_sdkVersion) || ((_b = this.sdkMeta) === null || _b === void 0 ? void 0 : _b._vwo_sdkVersion);
    };
    return WingifyOptionsModel;
}());
exports.WingifyOptionsModel = WingifyOptionsModel;
//# sourceMappingURL=WingifyOptionsModel.js.map