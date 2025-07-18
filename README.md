# VWO Feature Management and Experimentation SDK for Node.js and JavaScript(Browser)

[![npm version](https://img.shields.io/npm/v/vwo-fme-node-sdk?style=for-the-badge&color=grey&logo=npm)](https://www.npmjs.com/package/vwo-fme-node-sdk)
[![License](https://img.shields.io/github/license/wingify/vwo-fme-node-sdk?style=for-the-badge&color=blue)](http://www.apache.org/licenses/LICENSE-2.0)
[](http://img.badgesize.io/wingify/vwo-fme-node-sdk/master/dist/client/vwo-fme-javascript-sdk.min.js?compression=gzip&color=blue&style=for-the-badge)

[![CI](https://img.shields.io/github/actions/workflow/status/wingify/vwo-fme-node-sdk/main.yml?style=for-the-badge&logo=github)](https://github.com/wingify/vwo-fme-node-sdk/actions?query=workflow%3ACI)
[![codecov](https://img.shields.io/codecov/c/github/wingify/vwo-fme-node-sdk?token=813UYYMWGM&style=for-the-badge&logo=codecov)](https://codecov.io/gh/wingify/vwo-fme-node-sdk)
![](http://img.badgesize.io/wingify/vwo-fme-node-sdk/master/dist/client/vwo-fme-javascript-sdk.min.js?compression=gzip&color=blue)

## Overview

The **VWO Feature Management and Experimentation SDK** (VWO FME Node SDK) enables Node.js and JavaScript developers to integrate feature flagging and experimentation into their applications. This SDK provides full control over feature rollout, A/B testing, and event tracking, allowing teams to manage features dynamically and gain insights into user behavior.

## Requirements

- **Node.js v12 or later**

## Installation

Install the SDK via [**npm**](https://npmjs.com/package/vwo-fme-node-sdk) or [**yarn**](https://classic.yarnpkg.com/en/package/vwo-fme-node-sdk):

```bash
# via npm
npm install vwo-fme-node-sdk --save

# via yarn
yarn add vwo-fme-node-sdk
```

## Basic Usage Example

The following example demonstrates initializing the SDK with a VWO account ID and SDK key, setting a user context, checking if a feature flag is enabled, and tracking a custom event.

```javascript
const { init } = require('vwo-fme-node-sdk');

// Initialize VWO client
(async function () {
  const vwoClient = await init({
    accountId: '123456',
    sdkKey: '32-alpha-numeric-sdk-key',
  });

  // Check if feature is enabled for user
  const userContext = { id: 'unique_user_id' };
  const feature = await vwoClient.getFlag('feature_key', userContext);

  if (feature.isEnabled()) {
    console.log('Feature is enabled!');

    // Get feature variable
    const value = feature.getVariable('feature_variable', 'default_value');
    console.log('Variable value:', value);
  }

  // Track an event
  vwoClient.trackEvent('event_name', userContext);
})();
```

The SDK includes TypeScript type definitions for better type safety and IDE support. Here's how to use the SDK with TypeScript:

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

## Advanced Configuration Options

To customize the SDK further, additional parameters can be passed to the `init()` API. Here's a table describing each option:

| **Parameter**                | **Description**                                                                                                                                             | **Required** | **Type** | **Example**                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------- | --------------------------------------------- |
| `accountId`                  | VWO Account ID for authentication.                                                                                                                          | Yes          | String   | `'123456'`                                    |
| `sdkKey`                     | SDK key corresponding to the specific environment to initialize the VWO SDK Client. You can get this key from VWO Application.                              | Yes          | String   | `'32-alpha-numeric-sdk-key'`                  |
| `pollInterval`               | Time interval for fetching updates from VWO servers (in milliseconds).                                                                                      | No           | Number   | `60000`                                       |
| `gatewayService`             | An object representing configuration for integrating VWO Gateway Service.                                                                                   | No           | Object   | see [Gateway](#gateway) section               |
| `storage`                    | Custom storage connector for persisting user decisions and campaign data.                                                                                   | No           | Object   | See [Storage](#storage) section               |
| `clientStorage`              | Browser storage configuration for persisting user data in browser environments.                                                                             | No           | Object   | See [Client Storage](#client-storage) section |
| `logger`                     | Toggle log levels for more insights or for debugging purposes. You can also customize your own transport in order to have better control over log messages. | No           | Object   | See [Logger](#logger) section                 |
| `shouldWaitForTrackingCalls` | Ensures tracking calls complete before resolving promises, useful for edge computing environments like Cloudflare Workers                                   | No           | Boolean  | `true`                                        |
| `integrations`               | A callback function that receives data which can be pushed to any external tool that you need to integrate with.                                            | No           | Object   | See [Integrations](#integrations)             |
| `batchEventData`             | Configuration for batch event processing to optimize network requests                                                                                       | No           | Object   | See [Batch Events](#batch-events) section     |
| `retryConfig`                | Configuration for network request retry behavior and exponential backoff strategy                                                                           | No           | Object   | See [Retry Config](#retry-config) section     |

Refer to the [official VWO documentation](https://developers.vwo.com/v2/docs/fme-node-install) for additional parameter details.

### User Context

The `context` object uniquely identifies users and is crucial for consistent feature rollouts. A typical `context` includes an `id` for identifying the user. It can also include other attributes that can be used for targeting and segmentation, such as `customVariables`, `userAgent` and `ipAddress`.

#### Parameters Table

The following table explains all the parameters in the `context` object:

| **Parameter**     | **Description**                                                            | **Required** | **Type** | **Example**                       |
| ----------------- | -------------------------------------------------------------------------- | ------------ | -------- | --------------------------------- |
| `id`              | Unique identifier for the user.                                            | Yes          | String   | `'unique_user_id'`                |
| `customVariables` | Custom attributes for targeting.                                           | No           | Object   | `{ age: 25, location: 'US' }`     |
| `userAgent`       | User agent string for identifying the user's browser and operating system. | No           | String   | `'Mozilla/5.0 ... Safari/537.36'` |
| `ipAddress`       | IP address of the user.                                                    | No           | String   | `'1.1.1.1'`                       |

#### Example

```javascript
const userContext = {
  id: 'unique_user_id',
  customVariables: { age: 25, location: 'US' },
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  ipAddress: '1.1.1.1',
};
```

### Basic Feature Flagging

Feature Flags serve as the foundation for all testing, personalization, and rollout rules within FME.
To implement a feature flag, first use the `getFlag` API to retrieve the flag configuration.
The `getFlag` API provides a simple way to check if a feature is enabled for a specific user and access its variables. It returns a feature flag object that contains methods for checking the feature's status and retrieving any associated variables.

| Parameter    | Description                                                      | Required | Type   | Example              |
| ------------ | ---------------------------------------------------------------- | -------- | ------ | -------------------- |
| `featureKey` | Unique identifier of the feature flag                            | Yes      | String | `'new_checkout'`     |
| `context`    | Object containing user identification and contextual information | Yes      | Object | `{ id: 'user_123' }` |

Example usage:

```javascript
const featureFlag = await vwoClient.getFlag('feature_key', { id: 'unique_user_id' });
const isEnabled = featureFlag.isEnabled();

if (isEnabled) {
  console.log('Feature is enabled!');

  // Get and use feature variable with type safety
  const variableValue = featureFlag.getVariable('feature_variable', 'default_value');
  console.log('Variable value:', variableValue);
} else {
  console.log('Feature is not enabled!');
}
```

### Custom Event Tracking

Feature flags can be enhanced with connected metrics to track key performance indicators (KPIs) for your features. These metrics help measure the effectiveness of your testing rules by comparing control versus variation performance, and evaluate the impact of personalization and rollout campaigns. Use the `trackEvent` API to track custom events like conversions, user interactions, and other important metrics:

| Parameter         | Description                                                            | Required | Type   | Example                |
| ----------------- | ---------------------------------------------------------------------- | -------- | ------ | ---------------------- |
| `eventName`       | Name of the event you want to track                                    | Yes      | String | `'purchase_completed'` |
| `context`         | Object containing user identification and other contextual information | Yes      | Object | `{ id: 'user_123' }`   |
| `eventProperties` | Additional properties/metadata associated with the event               | No       | Object | `{ amount: 49.99 }`    |

Example usage:

```javascript
vwoClient.trackEvent('event_name', { id: 'unique_user_id' }, { amount: 49.99 });
```

See [Tracking Conversions](https://developers.vwo.com/v2/docs/fme-node-metrics#usage) documentation for more information.

### Pushing Attributes

User attributes provide rich contextual information about users, enabling powerful personalization. The `setAttribute` method provides a simple way to associate these attributes with users in VWO for advanced segmentation. Here's what you need to know about the method parameters:

| Parameter        | Description                                                            | Required | Type   | Example                 |
| ---------------- | ---------------------------------------------------------------------- | -------- | ------ | ----------------------- |
| `attributeKey`   | The unique identifier/name of the attribute you want to set            | Yes      | String | `'plan_type'`           |
| `attributeValue` | The value to be assigned to the attribute                              | Yes      | Any    | `'premium'`, `25`, etc. |
| `context`        | Object containing user identification and other contextual information | Yes      | Object | `{ id: 'user_123' }`    |

Example usage:

```javascript
vwoClient.setAttribute('attribute_name', 'attribute_value', { id: 'unique_user_id' });
```

See [Pushing Attributes](https://developers.vwo.com/v2/docs/fme-node-attributes#usage) documentation for additional information.

### Polling Interval Adjustment

The `pollInterval` is an optional parameter that allows the SDK to automatically fetch and update settings from the VWO server at specified intervals. The polling interval can be configured in three ways:

1. Set via SDK options: If `pollInterval` is specified in the initialization options (must be >= 1000 milliseconds), that interval will be used
2. VWO Application Settings: If configured in your VWO application settings, that interval will be used
3. Default Fallback: If neither of the above is set, a 10 minute (600,000 milliseconds) polling interval is used

Setting this parameter ensures your application always uses the latest configuration by periodically checking for and applying any updates.

```javascript
const vwoClient = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  pollInterval: 60000,
});
```

### Gateway

The VWO FME Gateway Service is an optional but powerful component that enhances VWO's Feature Management and Experimentation (FME) SDKs. It acts as a critical intermediary for pre-segmentation capabilities based on user location and user agent (UA). By deploying this service within your infrastructure, you benefit from minimal latency and strengthened security for all FME operations.

#### Why Use a Gateway?

The Gateway Service is required in the following scenarios:

- When using pre-segmentation features based on user location or user agent.
- For applications requiring advanced targeting capabilities.
- It's mandatory when using any thin-client SDK (e.g., Go).

#### How to Use the Gateway

The gateway can be customized by passing the `gatewayService` parameter in the `init` configuration.

```javascript
const vwoClient = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  gatewayService: {
    url: 'https://custom.gateway.com',
  },
});
```

Refer to the [Gateway Documentation](https://developers.vwo.com/v2/docs/gateway-service) for further details.

### Storage

The SDK operates in a stateless mode by default, meaning each `getFlag` call triggers a fresh evaluation of the flag against the current user context.

To optimize performance and maintain consistency, you can implement a custom storage mechanism by passing a `storage` parameter during initialization. This allows you to persist feature flag decisions in your preferred database system (like Redis, MongoDB, or any other data store).

Key benefits of implementing storage:

- Improved performance by caching decisions
- Consistent user experience across sessions
- Reduced load on your application

The storage mechanism ensures that once a decision is made for a user, it remains consistent even if campaign settings are modified in the VWO Application. This is particularly useful for maintaining a stable user experience during A/B tests and feature rollouts.

```javascript
class StorageConnector extends StorageConnector {
  constructor() {
    super();
  }

  /**
   * Get data from storage
   * @param {string} featureKey
   * @param {string} userId
   * @returns {Promise<Object>}
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

const vwoClient = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  storage: StorageConnector,
});
```

### Client Storage

In browser environments, the SDK automatically uses `localStorage` to persist user data. You can customize this behavior using the `clientStorage` option:

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

| **Parameter** | **Description**                                   | **Required** | **Type** | **Default**      |
| ------------- | ------------------------------------------------- | ------------ | -------- | ---------------- |
| `key`         | Key used to store data in browser storage         | No           | String   | `'vwo_fme_data'` |
| `provider`    | Storage provider (localStorage or sessionStorage) | No           | Object   | `localStorage`   |
| `isDisabled`  | Disable browser storage completely                | No           | Boolean  | `false`          |

Note: This feature is only applicable in browser environments. In Node.js environments, you should continue using the `storage` option for custom storage implementations.

### Logger

VWO by default logs all `ERROR` level messages to your server console.
To gain more control over VWO's logging behaviour, you can use the `logger` parameter in the `init` configuration.

| **Parameter** | **Description**                        | **Required** | **Type** | **Example**           |
| ------------- | -------------------------------------- | ------------ | -------- | --------------------- |
| `level`       | Log level to control verbosity of logs | Yes          | String   | `DEBUG`               |
| `prefix`      | Custom prefix for log messages         | No           | String   | `'CUSTOM LOG PREFIX'` |
| `transport`   | Custom logger implementation           | No           | Object   | See example below     |

#### Example 1: Set log level to control verbosity of logs

```javascript
const vwoClient1 = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  logger: {
    level: 'DEBUG',
  },
});
```

#### Example 2: Add custom prefix to log messages for easier identification

```javascript
const vwoClient2 = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  logger: {
    level: 'DEBUG',
    prefix: 'CUSTOM LOG PREFIX',
  },
});
```

#### Example 3: Implement custom transport to handle logs your way

The `transport` parameter allows you to implement custom logging behavior by providing your own logging functions. You can define handlers for different log levels (`debug`, `info`, `warn`, `error`, `trace`) to process log messages according to your needs.

For example, you could:

- Send logs to a third-party logging service
- Write logs to a file
- Format log messages differently
- Filter or transform log messages
- Route different log levels to different destinations

The transport object should implement handlers for the log levels you want to customize. Each handler receives the log message as a parameter.

```javascript
const vwoClient3 = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  logger: {
    transport: {
      level: 'INFO',
      log: (level, message) => {
        // your custom implementation here
      },
    },
  },
});
```

For multiple transports you can use the `transports` parameter. For example:

```javascript
const vwoClient3 = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  logger: {
    transports: [
      {
        level: 'INFO',
        log: (level, message) => {
          // your custom implementation here
        },
      },
      {
        level: 'ERROR',
        log: (level, message) => {
          // your custom implementation here
        },
      },
    ],
  },
});
```

### Integrations

VWO FME SDKs provide seamless integration with third-party tools like analytics platforms, monitoring services, customer data platforms (CDPs), and messaging systems. This is achieved through a simple yet powerful callback mechanism that receives VWO-specific properties and can forward them to any third-party tool of your choice.

```javascript
const vwoClient = await vwo.init({
  sdkKey: '32-alpha-numeric-sdk-key', //replace with the SDK key for your environment
  accountId: '123456', //replace with your VWO account ID
  integrations: {
    callback(properties) {
      // your custom implementation here
    },
  },
});
```

### Wait for Tracking Calls

The `shouldWaitForTrackingCalls` is an optional parameter that allows you to control whether the SDK should wait for tracking calls to complete before resolving promises. When enabled, tracking API calls will wait for the server response before resolving.

This is particularly useful for edge computing environments like Cloudflare Workers, where it ensures that tracking calls complete before resolving the promise.

```javascript
const vwoClient = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  shouldWaitForTrackingCalls: true,
});
```

### Batch Events

The `batchEventData` configuration allows you to optimize network requests by batching multiple events together. This is particularly useful for high-traffic applications where you want to reduce the number of API calls.

| **Parameter**         | **Description**                                                         | **Required** | **Type** | **Default** |
| --------------------- | ----------------------------------------------------------------------- | ------------ | -------- | ----------- |
| `requestTimeInterval` | Time interval (in seconds) after which events are flushed to the server | No           | Number   | `600`       |
| `eventsPerRequest`    | Maximum number of events to batch together before sending to the server | No           | Number   | `100`       |
| `flushCallback`       | Callback function to be executed after events are flushed               | No           | Function | See example |

Example usage:

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

You can also manually flush events using the `flushEvents()` method:

```javascript
vwoClient.flushEvents();
```

### Retry Config

The `retryConfig` parameter allows you to customize the retry behavior for network requests. This is particularly useful for applications that need to handle network failures gracefully with exponential backoff strategies.

| **Parameter**       | **Description**                                           | **Required** | **Type** | **Default** | **Validation**                      |
| ------------------- | --------------------------------------------------------- | ------------ | -------- | ----------- | ----------------------------------- |
| `shouldRetry`       | Whether to enable automatic retry on network failures     | No           | Boolean  | `true`      | Must be a boolean value             |
| `maxRetries`        | Maximum number of retry attempts before giving up         | No           | Number   | `3`         | Must be a non-negative integer >= 1 |
| `initialDelay`      | Initial delay (in seconds) before the first retry attempt | No           | Number   | `2`         | Must be a non-negative integer >= 1 |
| `backoffMultiplier` | Multiplier for exponential backoff between retry attempts | No           | Number   | `2`         | Must be a non-negative integer >= 2 |

#### How Retry Logic Works

The SDK implements an exponential backoff strategy for retrying failed network requests:

1. **Initial Request**: The SDK attempts the initial network request
2. **On Failure**: If the request fails and `shouldRetry` is `true`, the SDK waits for `initialDelay` seconds
3. **Exponential Backoff**: For subsequent retries, the delay is calculated as: `initialDelay × (backoffMultiplier ^ attempt)`
4. **Maximum Attempts**: The SDK will retry up to `maxRetries` times before giving up

#### Example Usage

```javascript
const vwoClient = await init({
  accountId: '123456',
  sdkKey: '32-alpha-numeric-sdk-key',
  retryConfig: {
    shouldRetry: true, // Enable retries
    maxRetries: 5, // Retry up to 5 times
    initialDelay: 3, // Wait 3 seconds before first retry
    backoffMultiplier: 2, // Double the delay for each subsequent retry
  },
});
```

With this configuration, the retry delays would be:

- 1st retry: 3 seconds (3 × 2^0)
- 2nd retry: 6 seconds (3 × 2^1)
- 3rd retry: 12 seconds (3 × 2^2)
- 4th retry: 24 seconds (3 × 2^3)
- 5th retry: 48 seconds (3 × 2^4)

### Version History

The version history tracks changes, improvements, and bug fixes in each version. For a full history, see the [CHANGELOG.md](https://github.com/wingify/vwo-fme-node-sdk/blob/master/CHANGELOG.md).

## Development and Testing

### Install Dependencies and Bootstrap Git Hooks

```bash
yarn install
```

### Compile TypeScript to JavaScript

```bash
yarn build
```

### Run Tests

```bash
# production tests
yarn run test:prod

# development tests
yarn run test:dev
```

## Contributing

We welcome contributions to improve this SDK! Please read our [contributing guidelines](https://github.com/wingify/vwo-fme-node-sdk/blob/master/CONTRIBUTING.md) before submitting a PR.

## Code of Conduct

Our [Code of Conduct](https://github.com/wingify/vwo-fme-node-sdk/blob/master/CODE_OF_CONDUCT.md) outlines expectations for all contributors and maintainers.

## License

[Apache License, Version 2.0](https://github.com/wingify/vwo-fme-node-sdk/blob/master/LICENSE)

Copyright 2024-2025 Wingify Software Pvt. Ltd.
