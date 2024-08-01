## VWO Feature Management and Experimentation SDK for Node.js and JavaScript(browser)

[![npm version](https://img.shields.io/npm/v/vwo-fme-node-sdk?style=for-the-badge&color=grey&logo=npm)](https://www.npmjs.com/package/vwo-fme-node-sdk)
[![License](https://img.shields.io/github/license/wingify/vwo-fme-node-sdk?style=for-the-badge&color=blue)](http://www.apache.org/licenses/LICENSE-2.0)

[![CI](https://img.shields.io/github/actions/workflow/status/wingify/vwo-fme-node-sdk/main.yml?style=for-the-badge&logo=github)](https://github.com/wingify/vwo-fme-node-sdk/actions?query=workflow%3ACI)
[![codecov](https://img.shields.io/codecov/c/github/wingify/vwo-fme-node-sdk?token=813UYYMWGM&style=for-the-badge&logo=codecov)](https://codecov.io/gh/wingify/vwo-fme-node-sdk)

![](http://img.badgesize.io/wingify/vwo-fme-node-sdk/master/dist/client/vwo-fme-javascript-sdk.min.js?compression=gzip&color=blue)

### Requirements

- Node 12+

### Installation

```bash
# via npm
npm install vwo-fme-node-sdk --save

# via yarn
yarn add vwo-fme-node-sdk
```

### Example

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
vwoClient.trackEvent('add_to_cart', userContext, eventProperties);
```

### Development Scripts

1. Install dependencies and bootstrap git-hooks

```bash
yarn install
```

2. Compile TypeScript code to JavaScript(ES6)

```bash
yarn tsc
```

3. To run tests:

```bash
# for production
yarn run test:prod
# for development
yarn run test:dev
```

### Contributing

Please go through our [contributing guidelines](https://github.com/wingify/vwo-fme-node-sdk/blob/master/CONTRIBUTING.md)

### Code of Conduct

[Code of Conduct](https://github.com/wingify/vwo-fme-node-sdk/blob/master/CODE_OF_CONDUCT.md)

### License

[Apache License, Version 2.0](https://github.com/wingify/vwo-fme-node-sdk/blob/master/LICENSE)

Copyright 2024 Wingify Software Pvt. Ltd.
