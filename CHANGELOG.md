# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.30.2] - 2025-11-13

### Fixed

- Fixed an issue where type definitions were not properly exported in `package.json`.

## [1.30.1] - 2025-11-12

### Fixed

- Resolved issues causing `Range Error` and `undefined (setting)` during settings polling.

## [1.30.0] - 2025-11-06

### Added

- Exposed `getUUID` method that deterministically generates a UUID for a given `userId` and VWO `accountId` combination. The generated UUID is used in VWO and remains consistent for the same user-account pair.

```javascript
const { getUUID } = require('vwo-fme-node-sdk');

// Generate UUID for a user
const userId = 'user-123';
const accountId = '123456';
const uuid = getUUID(userId, accountId);

console.log('Generated UUID:', uuid);
// Output: Generated UUID: CC25A368ADA0542699EAD62489811105
```

## [1.29.0] - 2025-09-25

### Added

- Add support for user aliasing (will work with [Gateway Service](https://developers.vwo.com/v2/docs/gateway-service) only)

```javascript
vwoClient = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',

  gatewayService: {
    url: 'http://your-custom-gateway-url',
  },
  // Required to use Aliasing
  isAliasingEnabled: true,
});

vwoClient.setAlias(userContext, 'aliasId');
```

## [1.28.1] - 2025-09-15

### Changed

- Update schema validation to enforce required fields while allowing additional dynamic properties without validation failures
- Fix Usage Stats bug and retry minor bug

## [1.28.0] - 2025-09-09

### Added

- Post-segmentation variables are now automatically included as unregistered attributes, enabling post-segmentation without requiring manual setup.
- Added support for built-in targeting conditions, including `browser version`, `OS version`, and `IP address`, with advanced operator support (greaterThan, lessThan, regex).`

## [1.27.0] - 2025-09-05

### Added

- Fixed conversion of alphanumeric string to numeric values

## [1.26.0] - 2025-08-26

### Added

- Sends usage statistics to VWO servers automatically during SDK initialization

## [1.25.2] - 2025-08-12

### Added

- Enhanced logging capabilities at VWO by adding additional debug information to VWO Error log messages including relevant metadata for better troubleshooting

## [1.25.1] - 2025-08-14

### Fixed

- Hardcode SDK name and extract version to a separate file to reduce bundle size by avoiding imports of the entire `package.json` file.
- Update log message showing incorrect retry time interval

## [1.25.0] - 2025-08-07

### Changed

- Added ES Module (ESM) build support for projects using `"type": "module"` in their `package.json` file.

## [1.24.0] - 2025-08-05

### Added

- Added support for sending a one-time initialization event to the server to verify correct SDK setup.

## [1.23.4] - 2025-07-29

### Fixed

- Remove extra logs from the distributable bundle

## [1.23.3] - 2025-07-25

### Added

- Send the SDK name and version in the events and batching call to VWO as query parameters.

## [1.23.2] - 2025-07-24

### Added

- Send the SDK name and version in the settings call to VWO as query parameters.

## [1.23.1] - 2025-07-24

### Fixed

- Updated regex in `addIsGatewayServiceRequiredFlag` method to remove unsupported lookbehind and named capture groups, ensuring compatibility with older browsers like Safari 16.3 (`SyntaxError: Invalid regular expression: invalid group specifier name`).

## [1.23.0] - 2025-07-18

### Added

- Added support for polling intervals to periodically fetch and update settings:

  - If `pollInterval` is set in options (must be >= 1000 milliseconds), that interval will be used
  - If `pollInterval` is configured in VWO application settings, that will be used
  - If neither is set, defaults to 10 minute polling interval

  Example usage:

  ```javascript
  vwoClient = await init({
    accountId: '123456',
    sdkKey: '32-alpha-numeric-sdk-key',
    pollInterval: 60000, // Set the poll interval to 60 seconds,
  });
  ```

## [1.22.0] - 2025-07-17

### Added

- Added support for redirecting all network calls through a custom proxy URL for browser environments. This feature allows users to route all SDK network requests (settings, tracking, etc.) through their own proxy server. This is particularly useful for bypassing ad-blockers that may interfere with VWO's default network requests.

```javascript
const vwoClient = await init({
  sdkKey: 'VWO_SDK_KEY',
  accountId: 'VWO_ACCOUNT_ID',

  // All network calls will be routed through this URL
  proxyUrl: 'https://your-proxy-server.com',
});
```

## [1.21.0] - 2025-07-03

### Added

- Added configurable retry mechanism for network requests with partial override support. You can now customize retry behavior by passing a `retryConfig` in the `network` options:

  ```javascript
  const vwoClient = await init({
    accountId: '123456',
    sdkKey: '32-alpha-numeric-sdk-key',

    retryConfig: {
      shouldRetry: true, // Turn retries on/off (default: true)
      maxRetries: 3, // How many times to retry (default: 3)
      initialDelay: 2, // First retry after 2 seconds (default: 2)
      backoffMultiplier: 2, // Double the delay each time (delays: 2s, 4s, 8s)
    },
  });
  ```

## [1.20.2] - 2025-06-26

### Fixed

- Fixed settings fetch failure on Serverless environment by improving network request handling and compatibility

## [1.20.1] - 2025-06-19

### Fixed

- Enhanced security for browser storage by implementing Base64 encoding for SDK key stored in localStorage.

## [1.20.0] - 2025-06-18

### Added

- Enhanced storage configuration options for browser environments with new features:

  - Added custom `ttl` (Time To Live) option to control how long settings remain valid in storage
  - Added `alwaysUseCachedSettings` option to always use cached settings regardless of TTL
  - Default TTL remains 2 hours if not specified

  ```javascript
  const vwoClient = await init({
    accountId: '123456',
    sdkKey: '32-alpha-numeric-sdk-key',
    clientStorage: {
      key: 'vwo_data', // defaults to vwo_fme_settings
      provider: sessionStorage, // defaults to localStorage
      isDisabled: false, // defaults to false
      alwaysUseCachedSettings: true, // defaults to false
      ttl: 3600000, // 1 hour in milliseconds, defaults to 2 hours
    },
  });
  ```

  These new options provide more control over how settings are cached and refreshed:

  - When `alwaysUseCachedSettings` is true, the SDK will always use cached settings if available, regardless of TTL
  - Custom `ttl` allows you to control how frequently settings are refreshed from the server
  - Settings are still updated in the background to keep the cache fresh

  Read more [here](https://developers.vwo.com/v2/docs/fme-javascript-cache-settings)

## [1.19.0] - 2025-05-29

### Added

- Enhanced browser environment support by enabling direct communication with VWO's DACDN when no `VWO Gateway Service` is configured to reduce network latency and improves performance by eliminating the need for seting up an intermediate service for browser-based environments.

- Added built-in persistent storage functionality for browser environments. The JavaScript SDK automatically stores feature flag decisions in `localStorage` to ensure consistent user experiences across sessions and optimize performance by avoiding re-evaluating users. You can customize or disable this behavior using the `clientStorage` option while initializing the JavaScript SDK:

  ```javascript
  const vwoClient = await init({
    accountId: '123456',
    sdkKey: '32-alpha-numeric-sdk-key',
    clientStorage: {
      key: 'vwo_data', // defaults to vwo_fme_data
      provider: sessionStorage, // defaults to localStorage
      isDisabled: false, // defaults to false, set to true to disable storage
    },
  });
  ```

## [1.18.0] - 2025-05-19

### Changed

- Merged [#3](https://github.com/wingify/vwo-fme-node-sdk/pull/3) by [@thomasdbock](https://github.com/thomasdbock)
- Exported interfaces `IVWOClient`, `IVWOOptions`, `IVWOContextModel`, and `Flag` to provide better TypeScript support and enable type checking for SDK configuration and usage

  ```typescript
  import { init, IVWOClient, IVWOOptions, Flag } from 'vwo-fme-node-sdk';

  // Example of using IVWOOptions for type-safe configuration
  const options: IVWOOptions = {
    accountId: '123456',
    sdkKey: '32-alpha-numeric-sdk-key',
  };

  // Example of using IVWOClient for type-safe client usage
  const vwoClient: IVWOClient = await init(options);

  // Example of using Flag interface for type-safe flag handling
  const flag: Flag = await vwoClient.getFlag('feature-key', { id: 'user-123' });
  const isEnabled: boolean = flag.isEnabled();

  const stringVariable: string = flag.getVariable('variable_key', 'default_value');
  const booleanVariable: boolean = flag.getVariable('variable_key', true);
  const numberVariable: number = flag.getVariable('variable_key', 10);
  ```

## [1.17.1] - 2025-05-13

### Added

- Added a feature to track and collect usage statistics related to various SDK features and configurations which can be useful for analytics, and gathering insights into how different features are being utilized by end users.

## [1.17.0] - 2025-05-06

### Added

- Added support for `batchEventData` configuration to optimize network requests by batching multiple events together. This allows you to:

  - Configure `requestTimeInterval` to flush events after a specified time interval
  - Set `eventsPerRequest` to control maximum events per batch
  - Implement `flushCallback` to handle batch processing results
  - Manually trigger event flushing via `flushEvents()` method

  ```javascript
  const vwoClient = await init({
    accountId: '123456',
    sdkKey: '32-alpha-numeric-sdk-key',
    batchEventData: {
      requestTimeInterval: 60, // Flush events every 60 seconds
      eventsPerRequest: 100, // Send up to 100 events per request
      flushCallback: (error, events) => {
        console.log('Events flushed successfully');
        // custom implementation here
      },
    },
  });
  ```

  - You can also manually flush events using the `flushEvents()` method:

  ```javascript
  vwoClient.flushEvents();
  ```

## [1.16.0] - 2025-05-01

### Fixed

- Fixed schema validation error that occurred when no feature flags were configured in the VWO application by properly handling empty `features` and `campaigns` from settings response

## [1.15.0] - 2025-04-18

### Added

- Added exponential backoff retry mechanism for failed network requests. This improves reliability by automatically retrying failed requests with increasing delays between attempts.

## [1.14.1] - 2025-03-13

### Fixed

- Fixed the issue where the SDK was not sending error logs to VWO server for better debugging.

## [1.14.0] - 2025-03-12

### Added

- Added support for sending error logs to VWO server for better debugging.

## [1.13.0] - 2025-02-21

### Fixed

- Fixed network request handling in serverless environments by replacing `XMLHttpRequest` with `fetch` API for improved compatibility and reliability.

## [1.12.0] - 2024-02-13

### Added

- Support for `Object` in `setAttribute` method to send multiple attributes at once.

  ```javascript
  const attributes = { attr1: value1, attr2: value2 };
  client.setAttribute(attributes, context);
  ```

## [1.11.0] - 2024-12-20

### Added

- added support for custom salt values in campaign rules to ensure consistent user bucketing across different campaigns. This allows multiple campaigns to share the same salt value, resulting in users being assigned to the same variations across those campaigns. Salt for a campaign can be configured inside VWO application only when the campaign is in the draft state.

## [1.10.0] - 2024-11-22

### Added

- added new method `updateSettings` to update settings on the client instance.

## [1.9.0] - 2024-11-14

### Added

- Added support to pass settings in `init` method.

## [1.8.0] - 2024-09-25

### Added

- added support for Personalise rules within `Mutually Exclusive Groups`.

## [1.7.0] - 2024-09-03

### Added

- added support to wait for network response incase of edge like environment.

  ```javascript
  const { init } = require('vwo-fme-node-sdk');

  const vwoClient = await init({
    accountId: '123456', // VWO Account ID
    sdkKey: '32-alpha-numeric-sdk-key', // SDK Key
    shouldWaitForTrackingCalls: true, // if running on edge env
  });
  ```

## [1.6.0] - 2024-08-27

### Fixed

- Update key name from `user` to `userId` for storing User ID in storage connector.

  ```javascript
  class StorageConnector extends StorageConnector {
    constructor() {
      super();
    }

    /**
     * Get data from storage
     * @param {string} featureKey
     * @param {string} userId
     * @returns {Promise<any>}
     */
    async get(featureKey, userId) {
      // return await data (based on featureKey and userId)
    }

    /**
     * Set data in storage
     * @param {object} data
     */
    async set(data) {
      // Set data corresponding to a featureKey and user ID
      // Use data.featureKey and data.userId to store the above data for a specific feature and a user
    }
  }
  ```

## [1.5.2] - 2024-08-20

### Fixed

- Updated regular expressions for `GREATER_THAN_MATCH`, `GREATER_THAN_EQUAL_TO_MATCH`, `LESS_THAN_MATCH`, and `LESS_THAN_EQUAL_TO_MATCH` segmentation operators

## [1.5.1] - 2024-08-13

### Fixed

- Encode user-agent in `setAttribute` and `trackEvent` APIs before making a call to VWO server`

## [1.5.0] - 2024-08-01

### Changed

- Modified code to support browser and Node.js environment
- The same SDK can be used in the browser and Node.js environment without any changes in the code from the customer side
- Refactored code to use interfaces and types wherever missing or required

### Added

Client-side Javascript SDK

- Used webpack for bundling code
- Separate builds for Node.js and browser using `webpack`
- SDK is compatible to be run on browser(as a Script, client-side rendering with React ,Ionic framework, etc.)
- Node.js environment can now use one single bundled file too, if required

## [1.3.1] - 2024-07-225

### Fixed

- fix: add support for DSL where featureIdValue could be `off`
- refactor: make eventProperties as third parameter

## [1.3.0] - 2024-06-20

### Fixed

- Update dist folder

## [1.2.4] - 2024-06-14

### Fixed

- Fix: add revenueProp in metricSchema for settings validation
- Optimizaton: if userAgent and ipAddress both are null, then no need to send call to gatewayService

## [1.2.2] - 2024-06-05

### Fixed

- Fix: use experiment-key from rule instead of whitelisted object
- Use [vwo-fme-sdk-e2e-test-settings-n-cases](https://github.com/wingify/vwo-fme-sdk-e2e-test-settings-n-cases) for importing segmentation tests instead of using hardcoded

## [1.2.1] - 2024-05-30

### Fixed

- Handle how device was being used by User-Agent parser.
- Refactor VWO Gateway service code to handle non-US accounts
- Fix passing required headers in the network-calls for tracking user details to VWO servers
- Fix some log messages where variables were not getting interpolated correctly

### Changed

- Instead of hardcoding the test-cases and expectations for `getFlag` API, we create a separate repo where tests and expectations were written in a JSON format. This is done to make sure we have common and same tests passing across our FME SDKs. Node SDK is using it as dependency - [vwo-fme-sdk-e2e-test-settings-n-cases](https://github.com/wingify/vwo-fme-sdk-e2e-test-settings-n-cases)
- SDK is now fully supported from Node 12+ versions. We ensured this by running exhaustive unit/E2E tests via GitHub actions for all the Node 12+ versions
- Add a new github-action to generate and publish code documentation generated via `typedoc`

## [1.2.0] - 2024-05-22

### Changed

- **Segmentation module**

  - Modify how context and settings are being used inside modular segmentor code
  - Cache location / User-Agent data per `getFlag` API
  - Single endpoint for location and User-Agent at gateway-service so that at max one call will be required to fetch data from gateway service

- **Context refactoring**

  - Context is now flattened out

    ```javascript
    {
      id: 'user-id',           // MANDATORY
      ipAddress: '1.2.3.4',    // OPTIONAL - required for user targeting
      userAgent: '...',        // OPTIONAL - required for user targeting
      // For pre-segmentation in campaigns
      customVariables: {
        price: 300
        // ...
      }
    }
    ```

- **Storage optimizations**

  - Optimized how data is being stored and retrieved

  - Example on how to pass storage

  ```javascript
  class StorageConnector extends StorageConnector {
    constructor() {
      super();
    }

    /**
     * Get data from storage
     * @param {string} featureKey
     * @param {string} userId
     * @returns {Promise<any>}
     */
    async get(featureKey, userId) {
      // return await data (based on featureKey and userId)
    }

    /**
     * Set data in storage
     * @param {object} data
     */
    async set(data) {
      // Set data corresponding to a featureKey and user ID
      // Use data.featureKey and data.userId to store the above data for a specific feature and a user
    }
  }

  init({
    sdkKey: '...',
    accountId: '123456',
    storage: StorageConnector,
  });
  ```

- **Using interfaces, types, and model-driven code**

  - Since we are using TypeScript which helps in the definition types and catching errors while developing.

- **Overall Code refactoring**

  - Simplified the flow of `getFlag` API

- **Log messages**

  - Separate Repo to have all the logs in one place.
  - Log messages were updated

  ```javascript
  logger:  {
    level: LogLevelEnum.DEBUG,    // DEBUG, INFO, ERROR, TRACE< WARN
    prefix: 'CUSTOM LOG PREFIX',      // VWO-SDK default
    transport: {                      // Custom Logger
      debug: msg => console.log(msg),
      info: msg => console.log(msg),
      warn: msg => console.log(msg),
      error: msg => console.log(msg),
      trace: msg => console.log(msg)
    }
  }

  init({
    sdkKey: '...',
    accountId: '123456',
    logger: logger
  });
  ```

### Added

- **Code inline documentation**

  - Entire Code was documented as per JavaScript Documentation convention.

- **Unit and E2E Testing**

  - Set up Test framework using `Jest`
  - Wrote unit and E2E tests to ensure nothing breaks while pushing new code
  - Ensure criticla components are working properly on every build
  - Integrate with Codecov to show coverage percentage in README
  - Post status of tests running on different node versions to Wingify slack channel

- **onInit hook**

  ```javaScript
  init({
    sdkKey: '...',
    accountId: '123456'
  });

  onInit().then(async (vwoClient) => {
    const feature = await vwoClient.getFlag('feature-key', context);
    console.log('getFlag is: ', feature.isEnabled());
  }).catch(err => {
    console.log('Error: ', err);
  });
  ```

- **Error handling**

  - Gracefully handle any kind of error - TypeError, NetworkError, etc.

- **Polling support**

  - Provide a way to fetch settings periodically and update the instance to use the latest settings

  ```javaScript
  const vwoClient = await init({
    sdkKey: '...',
    accountId: '123456',
    pollInterval: 5000 // in milliseconds
  });
  ```

## [1.0.0] - 2024-02-22

### Added

- First release of VWO Feature Management and Experimentation capabilities

  ```javascript
  const { init } = require('vwo-fme-node-sdk');

  const vwoClient = await init({
    accountId: '123456', // VWO Account ID
    sdkKey: '32-alpha-numeric-sdk-key', // SDK Key
  });

  // set user context
  const userContext = { id: 'unique_user_id' };
  // returns a flag object
  const getFlag = await vwoClient.getFlag('feature_key', userContext);
  // check if flag is enabled
  const isFlagEnabled = getFlag.isEnabled();
  // get variable
  const intVar = getFlag.getVariable('int_variable_key');

  // track event
  vwoClient.trackEvent('addToCart', eventProperties, userContext);
  ```
