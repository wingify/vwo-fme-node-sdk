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
export class VWOOptionsModel {
    modelFromDictionary(options) {
        this.accountId = options.accountId;
        this.sdkKey = options.sdkKey;
        this.vwoBuilder = options.vwoBuilder;
        if (options?.shouldWaitForTrackingCalls) {
            this.shouldWaitForTrackingCalls = options.shouldWaitForTrackingCalls;
        }
        if (options?.isDevelopmentMode) {
            this.isDevelopmentMode = options.isDevelopmentMode;
        }
        if (options?.storage) {
            this.storage = options.storage;
        }
        if (options?.gatewayService) {
            this.gatewayService = options.gatewayService;
        }
        if (options?.pollInterval) {
            this.pollInterval = options.pollInterval;
        }
        if (options?.logger) {
            this.logger = options.logger;
        }
        if (options?.segmentation) {
            this.segmentation = options.segmentation;
        }
        if (options?.integrations) {
            this.integrations = options.integrations;
        }
        if (options?.network) {
            this.network = options.network;
        }
        if (options?.settings) {
            this.settings = options.settings;
        }
        if (options?.isUsageStatsDisabled) {
            this.isUsageStatsDisabled = options.isUsageStatsDisabled;
        }
        if (options?._vwo_meta) {
            this._vwo_meta = options._vwo_meta;
        }
        if (options?.clientStorage) {
            this.clientStorage = options.clientStorage;
        }
        if (options?.retryConfig) {
            this.retryConfig = options.retryConfig;
        }
        if (options?.proxyUrl) {
            this.proxyUrl = options.proxyUrl;
        }
        if (options?.isAliasingEnabled) {
            this.isAliasingEnabled = options.isAliasingEnabled;
        }
        return this;
    }
    getAccountId() {
        return this.accountId;
    }
    getSdkKey() {
        return this.sdkKey;
    }
    getIsDevelopmentMode() {
        return this.isDevelopmentMode;
    }
    getStorageService() {
        return this.storage;
    }
    getGatewayService() {
        return this.gatewayService;
    }
    getPollInterval() {
        return this.pollInterval;
    }
    getLogger() {
        return this.logger;
    }
    getSegmentation() {
        return this.segmentation;
    }
    getNetwork() {
        return this.network;
    }
    getVWOBuilder() {
        return this.vwoBuilder;
    }
    getSettings() {
        return this.settings;
    }
    getIsUsageStatsDisabled() {
        return this.isUsageStatsDisabled;
    }
    getVWOMeta() {
        return this._vwo_meta;
    }
    getClientStorage() {
        return this.clientStorage;
    }
    getRetryConfig() {
        return this.retryConfig;
    }
    getProxyUrl() {
        return this.proxyUrl;
    }
    getIsAliasingEnabled() {
        return this.isAliasingEnabled;
    }
}
//# sourceMappingURL=VWOOptionsModel.js.map