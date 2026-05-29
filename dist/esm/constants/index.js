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
import { PlatformEnum } from '../enums/PlatformEnum.js';
import { SEED_URL, HTTP_PROTOCOL, HTTPS_PROTOCOL } from './Url.js';
import sdkMeta from '../../VERSION.js';
const SDK_VERSION = sdkMeta.version;
// __SDK_BRAND__ is injected by webpack DefinePlugin at build time ('vwo' or 'wingify').
// Falls back to 'vwo' in non-webpack environments (e.g., tests, ts-node).
const _brand = typeof __SDK_BRAND__ !== 'undefined' ? __SDK_BRAND__ : 'vwo';
const _isWingify = _brand === 'wingify';
let packageFile;
let platform;
// Reading package.json will bundle the whole file that's why preventing it by reading VERSION
if (typeof process === 'undefined') {
    packageFile = {
        name: _isWingify ? 'wingify-fme-javascript-sdk' : 'vwo-fme-javascript-sdk',
        version: SDK_VERSION,
    };
    platform = PlatformEnum.CLIENT;
}
else {
    packageFile = {
        name: _isWingify ? 'wingify-fme-node-sdk' : 'vwo-fme-node-sdk',
        version: SDK_VERSION,
    };
    platform = PlatformEnum.SERVER;
}
export const Constants = {
    SDK_NAME: packageFile.name,
    SDK_VERSION: packageFile.version,
    PLATFORM: platform,
    MAX_TRAFFIC_PERCENT: 100,
    MAX_TRAFFIC_VALUE: 10000,
    STATUS_RUNNING: 'RUNNING',
    SEED_VALUE: 1,
    MAX_EVENTS_PER_REQUEST: 5000,
    DEFAULT_REQUEST_TIME_INTERVAL: 3,
    DEFAULT_EVENTS_PER_REQUEST: 100,
    SEED_URL,
    HTTP_PROTOCOL,
    HTTPS_PROTOCOL,
    SETTINGS: 'settings',
    SETTINGS_EXPIRY: 10000000,
    SETTINGS_TIMEOUT: 50000,
    EVENTS_CALL_TIMEOUT: 10000, // 10 seconds
    SETTINGS_TTL: 7200000, // 2 HOURS
    ALWAYS_USE_CACHED_SETTINGS: false,
    MIN_TTL_MS: 60000, // 1 MINUTE
    HOST_NAME: _isWingify ? 'edge.wingify.net' : 'dev.visualwebsiteoptimizer.com',
    COLLECTION_HOST_NAME: _isWingify ? 'collect.wingify.net' : 'dev.visualwebsiteoptimizer.com',
    SETTINGS_ENDPOINT: '/server-side/v2-settings',
    WEBHOOK_SETTINGS_ENDPOINT: '/server-side/v2-pull',
    LOCATION_ENDPOINT: '/getLocation',
    FS_ENVIRONMENT_KEY: 'vwo_fs_environment',
    RANDOM_ALGO: 1,
    API_VERSION: '1',
    META_MEG_KEY: '_vwo_meta_meg_',
    DEFAULT_RETRY_CONFIG: {
        shouldRetry: true,
        initialDelay: 2,
        maxRetries: 3,
        backoffMultiplier: 2,
    },
    // Same localStorage key for VWO and Wingify packages (backward compatible with existing apps).
    DEFAULT_SETTINGS_STORAGE_KEY: 'vwo_fme_settings',
    POLLING_INTERVAL: 600000,
    PRODUCT_NAME: 'fme',
    BRAND_DISPLAY_NAME: _isWingify ? 'Wingify' : 'VWO',
    LOG_PREFIX: _isWingify ? 'Wingify-SDK' : 'VWO-SDK',
    LOGGER_NAME: _isWingify ? 'Wingify Logger' : 'VWO Logger',
    SETTINGS_MANAGER_NAME: _isWingify ? 'Wingify Settings Manager' : 'VWO Settings Manager',
    NETWORK_LAYER_NAME: _isWingify ? 'Wingify Network Layer' : 'VWO Network Layer',
    LOCAL_STORAGE_NAME: _isWingify ? 'Wingify Local Storage' : 'VWO Local Storage',
    SESSION_STORAGE_NAME: _isWingify ? 'Wingify Session Storage' : 'VWO Session Storage',
    SETTINGS_FETCH_ERROR: _isWingify ? 'Wingify settings could not be fetched' : 'VWO settings could not be fetched',
    // Debugger constants
    V2_SETTINGS: 'v2-settings',
    POLLING: 'polling',
    BATCH_EVENTS: 'batch-events',
    STORAGE: 'storage',
    FLAG_DECISION_GIVEN: 'FLAG_DECISION_GIVEN',
    NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES: 'NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES',
    NETWORK_CALL_SUCCESS_WITH_RETRIES: 'NETWORK_CALL_SUCCESS_WITH_RETRIES',
    IMPACT_ANALYSIS: 'IMPACT_ANALYSIS',
    // Holdout constants
    VARIATION_IS_PART_OF_HOLDOUT: 1,
    VARIATION_NOT_PART_OF_HOLDOUT: 2,
    // default https agent configuration constants
    DEFAULT_HTTPS_AGENT: {
        keepAlive: true,
        maxSockets: 100,
        maxFreeSockets: 20,
        timeout: 60000,
    },
    // minimun agent configuration constants
    MIN_SOCKETS: 50,
    MIN_FREE_SOCKETS: 10,
    MIN_TIMEOUT: 30000,
};
//# sourceMappingURL=index.js.map