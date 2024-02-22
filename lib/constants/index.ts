import { SEED_URL, HTTP_PROTOCOL, HTTPS_PROTOCOL } from './url';

export const Constants = {
  //   SDK_NAME: packageFile.name,
  //   SDK_VERSION: packageFile.version,
  PLATFORM: 'server',

  MAX_TRAFFIC_PERCENT: 100,
  MAX_TRAFFIC_VALUE: 10000,
  STATUS_RUNNING: 'RUNNING',

  SEED_VALUE: 1,
  MAX_EVENTS_PER_REQUEST: 5000,
  DEFAULT_REQUEST_TIME_INTERVAL: 600, // 10 * 60(secs) = 600 secs i.e. 10 minutes
  DEFAULT_EVENTS_PER_REQUEST: 100,
  SDK_NAME: '@wingify/vwo-sdk',
  SDK_VERSION: '1.0.0',
  AP: 'server',

  SEED_URL,
  HTTP_PROTOCOL,
  HTTPS_PROTOCOL,

  SETTINGS: 'settings',
  SETTINGS_EXPIRY: 10000000,
  SETTINGS_TIMEOUT: 50000,

  HOST_NAME: 'dev.visualwebsiteoptimizer.com', // TODO: change
  SETTINTS_ENDPOINT: '/server-side/v2-settings',
  LOCATION_ENDPOINT: '/getLocation',

  VWO_FS_ENVIRONMENT: 'vwo_fs_environment',

  RANDOM_ALGO: 1,
};
