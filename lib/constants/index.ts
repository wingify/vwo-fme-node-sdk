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
import { PlatformEnum } from '../enums/PlatformEnum';
import { SEED_URL, HTTP_PROTOCOL, HTTPS_PROTOCOL } from './Url';

let packageFile;
let platform;

// Reading package.json will bundle the whole file that's why preventing it by reading VERSION
if (typeof process === 'undefined') {
  packageFile = {
    name: 'vwo-fme-javascript-sdk',
    version: require('../../VERSION.json').version, // eslint-disable-line @typescript-eslint/no-var-requires
  };

  platform = PlatformEnum.CLIENT;
} else {
  packageFile = {
    name: 'vwo-fme-node-sdk',
    version: require('../../VERSION.json').version, // eslint-disable-line @typescript-eslint/no-var-requires
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
  DEFAULT_REQUEST_TIME_INTERVAL: 600, // 10 * 60(secs) = 600 secs i.e. 10 minutes
  DEFAULT_EVENTS_PER_REQUEST: 100,

  SEED_URL,
  HTTP_PROTOCOL,
  HTTPS_PROTOCOL,

  SETTINGS: 'settings',
  SETTINGS_EXPIRY: 10000000,
  SETTINGS_TIMEOUT: 50000,
  EVENTS_CALL_TIMEOUT: 10000, // 10 seconds
  SETTINGS_TTL: 7200000, // 2 HOURS

  MIN_TTL_MS: 60000, // 1 MINUTE

  HOST_NAME: 'dev.visualwebsiteoptimizer.com',
  SETTINGS_ENDPOINT: '/server-side/v2-settings',
  WEBHOOK_SETTINGS_ENDPOINT: '/server-side/v2-pull',
  LOCATION_ENDPOINT: '/getLocation',

  VWO_FS_ENVIRONMENT: 'vwo_fs_environment',

  RANDOM_ALGO: 1,

  API_VERSION: '1',

  VWO_META_MEG_KEY: '_vwo_meta_meg_',

  DEFAULT_RETRY_CONFIG: {
    shouldRetry: true,
    initialDelay: 2,
    maxRetries: 3,
    backoffMultiplier: 2,
  },

  DEFAULT_LOCAL_STORAGE_KEY: 'vwo_fme_data',
  DEFAULT_SETTINGS_STORAGE_KEY: 'vwo_fme_settings',
  POLLING_INTERVAL: 600000,
  PRODUCT_NAME: 'fme',

  // Debugger constants
  V2_SETTINGS: 'v2-settings',
  POLLING: 'polling',
  BATCH_EVENTS: 'batch-events',
  BROWSER_STORAGE: 'browserStorage',
  FLAG_DECISION_GIVEN: 'FLAG_DECISION_GIVEN',
  NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES: 'NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES',
  NETWORK_CALL_SUCCESS_WITH_RETRIES: 'NETWORK_CALL_SUCCESS_WITH_RETRIES',
  IMPACT_ANALYSIS: 'IMPACT_ANALYSIS',
};
