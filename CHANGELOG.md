# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
      ip: '1.2.3.4',           // OPTIONAL - required for user targeting
      ua: '...',               // OPTIONAL - required for user targeting
      other_attributes: '...', // OPTIONAL - required for user targeting
      // For pre-segmentation in campaigns
      customVariables: {
        // ...
      }
    }
    ```

- **Storage optimizations**

  - Optimized how data is being stored and retrieved

  - Example on how to pass storage

  ```javascript
  class StorageConnector extends vwo.StorageConnector {
    constructor() {
      super();
    }

    async get(key) {
      // return promise based data for feature-key
      // return await this.map[key];
    }

    async set(key, data) {
      // Set data for feature-key
      // this.map[key] = data;
    }
  }

  vwo.init({
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
    level: vwo.LogLevelEnum.DEBUG,    // DEBUG, INFO, ERROR, TRACE< WARN
    prefix: 'CUSTOM LOG PREFIX',      // VWO-SDK default
    transport: {                      // Custom Logger
      debug: msg => console.log(msg),
      info: msg => console.log(msg),
      warn: msg => console.log(msg),
      error: msg => console.log(msg),
      trace: msg => console.log(msg)
    }
  }

  vwo.init({
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
  vwo.init({
    sdkKey: '...',
    accountId: '123456'
  });

  vwo.onInit().then(async (vwoClient) => {
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
  const vwoClient = await vwo.init({
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

  const vwoClient = await vwo.init({
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
