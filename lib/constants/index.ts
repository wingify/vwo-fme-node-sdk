/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
/* global SDK_VERSION */
import { PlatformEnum } from '../enums/PlatformEnum';
import { SEED_URL, HTTP_PROTOCOL, HTTPS_PROTOCOL } from './Url';

let packageFile;
let platform;

// For client-side SDK, to keep the build size low
// avoid adding the whole package file in the bundle
if (typeof process.env === 'undefined') {
  packageFile = {
    name: 'vwo-fme-javascript-sdk', // will be replaced by webpack for browser build
    // @ts-expect-error This will be relaved by webpack at the time of build for browser
    version: SDK_VERSION, // will be replaced by webpack for browser build
  };

  platform = PlatformEnum.CLIENT;
} else {
  packageFile = require('../../package.json');
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

  HOST_NAME: 'dev.visualwebsiteoptimizer.com',
  SETTINTS_ENDPOINT: '/server-side/v2-settings',
  LOCATION_ENDPOINT: '/getLocation',

  VWO_FS_ENVIRONMENT: 'vwo_fs_environment',

  RANDOM_ALGO: 1,

  API_VERSION: '1',

  VWO_META_MEG_KEY: '_vwo_meta_meg_',
};
