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
var TransportManager_1 = require("../packages/logger/core/TransportManager");
/**
 * Manages usage statistics for the SDK.
 * Tracks various features and configurations being used by the client.
 * Implements Singleton pattern to ensure a single instance.
 */
var UsageStatsUtil = /** @class */ (function () {
    /** Private constructor to prevent direct instantiation */
    function UsageStatsUtil() {
        /** Internal storage for usage statistics data */
        this.usageStatsData = {};
    }
    /**
     * Provides access to the singleton instance of UsageStatsUtil.
     *
     * @returns The single instance of UsageStatsUtil
     */
    UsageStatsUtil.getInstance = function () {
        if (!UsageStatsUtil.instance) {
            UsageStatsUtil.instance = new UsageStatsUtil();
        }
        return UsageStatsUtil.instance;
    };
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
    UsageStatsUtil.prototype.setUsageStats = function (options) {
        var _a;
        var storage = options.storage, logger = options.logger, batchEvents = options.batchEvents, gatewayService = options.gatewayService, integrations = options.integrations, pollingInterval = options.pollingInterval, _vwo_meta = options._vwo_meta, shouldWaitForTrackingCalls = options.shouldWaitForTrackingCalls;
        var data = {};
        // Map configuration options to usage stats flags
        if (integrations)
            data.ig = 1; // Integration enabled
        if (batchEvents)
            data.eb = 1; // Event batching enabled
        // if logger has transport or transports, then it is custom logger
        if (logger && (logger.transport || logger.transports))
            data.cl = 1;
        if (storage)
            data.ss = 1; // Storage service configured
        if (logger === null || logger === void 0 ? void 0 : logger.level) {
            data.ll = (_a = TransportManager_1.LogLevelNumberEnum[logger.level.toUpperCase()]) !== null && _a !== void 0 ? _a : -1; // Default to -1 if level is not recognized
        }
        if (gatewayService)
            data.gs = 1; // Gateway service configured
        if (pollingInterval)
            data.pi = 1; // Polling interval configured
        if (shouldWaitForTrackingCalls)
            data.swtc = 1;
        // if _vwo_meta has ea, then addd data._ea to be 1
        if (_vwo_meta && _vwo_meta.ea)
            data._ea = 1;
        if (typeof process.env === 'undefined') {
            return;
        }
        else {
            if (typeof process !== 'undefined' && process.version) {
                // For Node.js environment
                data.lv = process.version;
            }
        }
        this.usageStatsData = data;
    };
    /**
     * Retrieves the current usage statistics.
     *
     * @returns Record containing boolean flags for various SDK features in use
     */
    UsageStatsUtil.prototype.getUsageStats = function () {
        return this.usageStatsData;
    };
    /**
     * Clears the usage statistics data.
     */
    UsageStatsUtil.prototype.clearUsageStats = function () {
        this.usageStatsData = {};
    };
    return UsageStatsUtil;
}());
exports.UsageStatsUtil = UsageStatsUtil;
//# sourceMappingURL=UsageStatsUtil.js.map