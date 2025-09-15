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
exports.UsageStatsUtil = void 0;
const TransportManager_1 = require("../packages/logger/core/TransportManager");
const SettingsService_1 = require("../services/SettingsService");
/**
 * Manages usage statistics for the SDK.
 * Tracks various features and configurations being used by the client.
 * Implements Singleton pattern to ensure a single instance.
 */
class UsageStatsUtil {
    /** Private constructor to prevent direct instantiation */
    constructor() {
        /** Internal storage for usage statistics data */
        this.usageStatsData = {};
    }
    /**
     * Provides access to the singleton instance of UsageStatsUtil.
     *
     * @returns The single instance of UsageStatsUtil
     */
    static getInstance() {
        if (!UsageStatsUtil.instance) {
            UsageStatsUtil.instance = new UsageStatsUtil();
        }
        return UsageStatsUtil.instance;
    }
    /**
     * Sets usage statistics based on provided options.
     * Maps various SDK features and configurations to boolean flags.
     *
     * @param options - Configuration options for the SDK
     * @param options.storage - Storage service configuration
     * @param options.logger - Logger configuration
     * @param options.eventBatching - Event batching configuration
     * @param options.integrations - Integrations configuration
     * @param options.pollingInterval - Polling interval configuration
     * @param options.sdkName - SDK name configuration
     */
    setUsageStats(options) {
        const { storage, logger, batchEventData, gatewayService, integrations, pollInterval, _vwo_meta, shouldWaitForTrackingCalls, } = options;
        const data = {};
        data.a = SettingsService_1.SettingsService.Instance.accountId;
        data.env = SettingsService_1.SettingsService.Instance.sdkKey;
        // Map configuration options to usage stats flags
        if (integrations)
            data.ig = 1; // Integration enabled
        if (batchEventData)
            data.eb = 1; // Event batching enabled
        // if logger has transport or transports, then it is custom logger
        if (logger && (logger.transport || logger.transports))
            data.cl = 1;
        if (storage)
            data.ss = 1; // Storage service configured
        if (logger?.level) {
            data.ll = TransportManager_1.LogLevelNumberEnum[logger.level.toUpperCase()] ?? -1; // Default to -1 if level is not recognized
        }
        if (gatewayService)
            data.gs = 1; // Gateway service configured
        if (pollInterval)
            data.pi = pollInterval; // Polling interval configured
        if (shouldWaitForTrackingCalls)
            data.swtc = 1;
        // if _vwo_meta has ea, then addd data._ea to be 1
        if (_vwo_meta && _vwo_meta.ea)
            data._ea = 1;
        if (typeof process !== 'undefined' && process.version) {
            // For Node.js environment
            data.lv = process.version;
        }
        this.usageStatsData = data;
    }
    /**
     * Retrieves the current usage statistics.
     *
     * @returns Record containing boolean flags for various SDK features in use
     */
    getUsageStats() {
        return this.usageStatsData;
    }
    /**
     * Clears the usage statistics data.
     */
    clearUsageStats() {
        this.usageStatsData = {};
    }
}
exports.UsageStatsUtil = UsageStatsUtil;
//# sourceMappingURL=UsageStatsUtil.js.map