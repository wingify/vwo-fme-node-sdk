## VWO Feature Management and Experimentation SDK for Node.js

[![npm version](https://badge.fury.io/js/vwo-fme-node-sdk.svg)](https://www.npmjs.com/package/vwo-fme-node-sdk)
[![CI](https://github.com/wingify/vwo-fme-node-sdk/workflows/CI/badge.svg?branch=master)](https://github.com/wingify/vwo-fme-node-sdk/actions?query=workflow%3ACI)

[![codecov](https://codecov.io/gh/wingify/vwo-fme-node-sdk/branch/master/graph/badge.svg?token=813UYYMWGM)](https://codecov.io/gh/wingify/vwo-fme-node-sdk)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

### Requirements

- Node 10+

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

const vwoClient = await vwo.init({
  accountId: '123456', // VWO Account ID
  sdkKey: '32-alpha-numeric-sdk-key' // SDK Key
});

// set user context
const userContext = { id: "unique_user_id" };
// returns a flag object
const getFlag = await vwoClient.getFlag('feature_key', userContext);
// check if flag is enabled
const isFlagEnabled = getFlag.isEnabled();
// get variable
const intVar = getFlag.getVariable('int_variable_key');

// track event
vwoClient.trackEvent('addToCart', userContext, eventProperties);
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
