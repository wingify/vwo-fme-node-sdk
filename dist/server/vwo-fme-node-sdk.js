/*!
 * vwo-fme-node-sdk - v1.23.2
 * URL - https://github.com/wingify/vwo-node-sdk
 *
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Dependencies used -
 *  1. murmurhash - ^2.0.1
 *  2. superstruct - ^0.14.x
 *  3. uuid - ^9.0.1
 *  4. vwo-fme-sdk-log-messages - ^1.*.*
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/package.json":
/*!***************************!*\
  !*** ./dist/package.json ***!
  \***************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"vwo-fme-node-sdk","version":"1.23.2","description":"VWO Node/JavaScript SDK for Feature Management and Experimentation","main":"dist/server/vwo-fme-node-sdk.min.js","browser":"dist/client/vwo-fme-javascript-sdk.min.js","exports":{".":{"node":{"types":"./dist/types/index.d.ts","import":"./dist/server/vwo-fme-node-sdk.min.js","require":"./dist/server/vwo-fme-node-sdk.min.js","default":"./dist/server/vwo-fme-node-sdk.min.js"},"default":{"types":"./dist/types/index.d.ts","import":"./dist/client/vwo-fme-javascript-sdk.js","require":"./dist/client/vwo-fme-javascript-sdk.min.js","default":"./dist/client/vwo-fme-javascript-sdk.min.js"}},"./node":{"types":"./dist/types/index.d.ts","import":"./dist/server/vwo-fme-node-sdk.min.js","require":"./dist/server/vwo-fme-node-sdk.min.js","default":"./dist/server/vwo-fme-node-sdk.min.js"},"./browser":{"types":"./dist/types/index.d.ts","import":"./dist/client/vwo-fme-javascript-sdk.js","require":"./dist/client/vwo-fme-javascript-sdk.min.js","default":"./dist/client/vwo-fme-javascript-sdk.min.js"}},"types":"dist/types/index.d.ts","scripts":{"build":"rm -rf dist/ yarn tsc:prod && yarn build:node && yarn build:browser && prettier -w dist/types/","build:browser":"yarn build:dev-browser && yarn build:prod-browser","build:node":"yarn build:dev-node && yarn build:prod-node","build:dev-browser":"webpack --config ./webpack.browser.config.js --mode=development","build:dev-node":"yarn tsc:prod && webpack --config ./webpack.node.config.js --mode=development","build:dev-browser-watch":"webpack --config ./webpack.browser.config.js --mode=development --watch","build:dev-node-watch":"yarn tsc:prod && webpack --config ./webpack.node.config.js --mode=development --watch","build:dev-browser-analyze":"webpack --config ./webpack.browser.config.js --mode=development --env analyze=1","build:dev-node-analyze":"yarn tsc:prod && webpack --config ./webpack.node.config.js --mode=production --env analyze=1","build:prod-browser":"webpack --config ./webpack.browser.config.js --mode=production","build:prod-node":"yarn tsc:prod && webpack --config ./webpack.node.config.js --mode=production","check:license":"yarn check:versions && node -e \'require(\\"./scripts/check-license\\")\'","check:versions":"node -e \'require(\\"./scripts/check-versions\\")\'","demo":"nodemon --inspect=0.0.0.0:9229 --legacy-watch --ignore node_modules demo/index.js","demo:server":"nodemon --inspect=0.0.0.0:9229 --legacy-watch --ignore node_modules demo/server.js","lint":"node -e \'require(\\"./scripts/check-versions\\")([\\"nodeLint\\"])\' && eslint lib/ --fix","lint:errors-only":"node -e \'require(\\"./scripts/check-versions\\")([\\"nodeLint\\"])\' && eslint **/*.ts\' --fix --quiet","prepare":"husky","prettier":"prettier -w lib/**/*.ts *.md","test:dev":"node --inspect-brk node_modules/jest/bin/jest.js --watch --runInBand --debug --colors --errorOnDeprecated","test:prod":"jest --runInBand --colors --errorOnDeprecated","test:coverage":"jest --coverage --coverageDirectory=coverage && cat ./coverage/lcov.info","tsc":"yarn check:versions && rm -rf dist/server-unpacked && cp package.json dist/ && tsc -w","tsc:prod":"yarn check:versions && rm -rf dist/server-unpacked && tsc && cp package.json dist/","typedoc":"typedoc --plugin typedoc-plugin-markdown --out ./docs lib/*.ts lib/**/*.ts lib/**/**/*.ts ","typedoc:html":"typedoc --out docs-html lib/*.ts lib/**/*.ts lib/**/**/*.ts"},"repository":{"type":"git","url":"https://github.com/wingify/vwo-fme-node-sdk"},"author":"VWO developers","license":"Apache-2.0","files":["dist/","package.json","yarn.lock","lib/**/*","LICENSE","README.md","CONTRIBUTING.md","CHANGELOG.md","NOTICE"],"dependencies":{"murmurhash":"^2.0.1","superstruct":"^0.14.x","uuid":"^9.0.1","vwo-fme-sdk-log-messages":"^1.*.*"},"devDependencies":{"@babel/core":"^7.24.5","@babel/preset-env":"^7.24.5","@babel/preset-typescript":"^7.24.1","@commitlint/cli":"^19.3.0","@commitlint/config-conventional":"^19.2.2","@eslint/js":"^9.2.0","@types/jest":"^29.5.12","@types/node":"^20.12.7","babel-jest":"^29.7.0","babel-loader":"^9.1.3","eslint":"^9.2.0","globals":"^15.1.0","husky":"^9.0.11","jest":"^29.7.0","lint-staged":"^15.2.2","nodemon":"^2.0.6","prettier":"^3.2.5","semver":"^7.6.0","shelljs":"^0.8.5","ts-loader":"^9.5.1","typedoc":"^0.25.13","typescript":"^5.4.5","typescript-eslint":"^7.8.0","vwo-fme-sdk-e2e-test-settings-n-cases":"^1.4.0","webpack":"^5.91.0","webpack-bundle-analyzer":"^4.10.2","webpack-cli":"^5.1.4","webpack-node-externals":"^3.0.0"},"lint-staged":{"**/*.{ts,json,md}":["prettier --write"]},"engineStrict":true,"engines":{"node":">= 8.9.0","yarn":">= 1.22.17"},"customEngines":{"nodeLint":">= 18.18.0"}}');

/***/ }),

/***/ "./dist/server-unpacked/VWO.js":
/*!*************************************!*\
  !*** ./dist/server-unpacked/VWO.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VWO = void 0;
exports.init = init;
exports.onInit = onInit;
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
var VWOBuilder_1 = __webpack_require__(/*! ./VWOBuilder */ "./dist/server-unpacked/VWOBuilder.js");
var DataTypeUtil_1 = __webpack_require__(/*! ./utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ./utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var log_messages_1 = __webpack_require__(/*! ./enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ./utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var PlatformEnum_1 = __webpack_require__(/*! ./enums/PlatformEnum */ "./dist/server-unpacked/enums/PlatformEnum.js");
var ApiEnum_1 = __webpack_require__(/*! ./enums/ApiEnum */ "./dist/server-unpacked/enums/ApiEnum.js");
var VWO = /** @class */function () {
  /**
   * Constructor for the VWO class.
   * Initializes a new instance of VWO with the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for the VWO instance.
   * @returns The instance of VWO.
   */
  function VWO(options) {
    return VWO.setInstance(options);
  }
  /**
   * Sets the singleton instance of VWO.
   * Configures and builds the VWO instance using the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for setting up VWO.
   * @returns A Promise resolving to the configured VWO instance.
   */
  VWO.setInstance = function (options) {
    var _this = this;
    var optionsVWOBuilder = options === null || options === void 0 ? void 0 : options.vwoBuilder;
    this.vwoBuilder = optionsVWOBuilder || new VWOBuilder_1.VWOBuilder(options);
    this.instance = this.vwoBuilder.setLogger() // Sets up logging for debugging and monitoring.
    .setSettingsService() // Sets the settings service for configuration management.
    .setStorage() // Configures storage for data persistence.
    .setNetworkManager() // Configures network management for API communication.
    .setSegmentation() // Sets up segmentation for targeted functionality.
    // .initBatching()        // Initializes batching for bulk data processing.
    .initPolling() // Starts polling mechanism for regular updates.
    .initBatching().initUsageStats(); // Initializes usage statistics for the SDK.
    // .setAnalyticsCallback() // Sets up analytics callback for data analysis.
    if (options === null || options === void 0 ? void 0 : options.settings) {
      return Promise.resolve(this.vwoBuilder.build(options.settings));
    }
    return this.vwoBuilder.getSettings().then(function (settings) {
      return _this.vwoBuilder.build(settings); // Builds the VWO instance with the fetched settings.
    });
  };
  Object.defineProperty(VWO, "Instance", {
    /**
     * Gets the singleton instance of VWO.
     * @returns The singleton instance of VWO.
     */
    get: function () {
      return this.instance;
    },
    enumerable: false,
    configurable: true
  });
  return VWO;
}();
exports.VWO = VWO;
var _global = {};
/**
 * Initializes a new instance of VWO with the provided options.
 * @param options Configuration options for the VWO instance.
 * @property {string} sdkKey - The SDK key for the VWO account.
 * @property {string} accountId - The account ID for the VWO account.
 * @property {GatewayServiceModel} gatewayService - The gateway service configuration.
 * @property {string} proxyUrl - (Browser only) Custom proxy URL to redirect all API calls. If provided, all GET and POST calls will be made to this URL instead of the default HOST_NAME.
 * @property {StorageService} storage - The storage configuration.
 * @returns
 */
function init(options) {
  return __awaiter(this, void 0, void 0, function () {
    var apiName, date, msg, msg, msg, instance, msg;
    return __generator(this, function (_a) {
      apiName = ApiEnum_1.ApiEnum.INIT;
      date = new Date().toISOString();
      try {
        if (!(0, DataTypeUtil_1.isObject)(options)) {
          msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_ERROR, {
            date: date
          });
          console.error(msg); // Ensures options is an object.
        }
        if (!(options === null || options === void 0 ? void 0 : options.sdkKey) || !(0, DataTypeUtil_1.isString)(options === null || options === void 0 ? void 0 : options.sdkKey)) {
          msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_SDK_KEY_ERROR, {
            date: date
          });
          console.error(msg); // Validates sdkKey presence and type.
        }
        if (!options.accountId) {
          msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_ACCOUNT_ID_ERROR, {
            date: date
          });
          console.error(msg); // Validates accountId presence and type.
        }
        if (typeof process.env === 'undefined') {
          options.platform = PlatformEnum_1.PlatformEnum.CLIENT;
        } else {
          options.platform = PlatformEnum_1.PlatformEnum.SERVER;
        }
        instance = new VWO(options);
        _global = {
          vwoInitDeferred: new PromiseUtil_1.Deferred(),
          isSettingsFetched: false,
          instance: null
        };
        return [2 /*return*/, instance.then(function (_vwoInstance) {
          _global.isSettingsFetched = true;
          _global.instance = _vwoInstance;
          _global.vwoInitDeferred.resolve(_vwoInstance);
          return _vwoInstance;
        })];
      } catch (err) {
        msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
          apiName: apiName,
          err: err
        });
        console.info("[INFO]: VWO-SDK ".concat(new Date().toISOString(), " ").concat(msg));
      }
      return [2 /*return*/];
    });
  });
}
function onInit() {
  return __awaiter(this, void 0, void 0, function () {
    var apiName, date_1, msg, msg;
    return __generator(this, function (_a) {
      apiName = ApiEnum_1.ApiEnum.ON_INIT;
      try {
        _global.vwoInitDeferred = new PromiseUtil_1.Deferred();
        date_1 = new Date().toISOString();
        // If settings are already fetched, resolve the promise
        if (_global.isSettingsFetched) {
          msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.ON_INIT_ALREADY_RESOLVED, {
            date: date_1,
            apiName: apiName
          });
          console.info(msg);
          _global.vwoInitDeferred.resolve(_global.instance);
        } else {
          // wait for five seconds, else reject the promise
          setTimeout(function () {
            if (_global.isSettingsFetched) {
              return;
            }
            var msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.ON_INIT_SETTINGS_FAILED, {
              date: date_1
            });
            console.error(msg);
            _global.vwoInitDeferred.reject(new Error('VWO settings could not be fetched'));
          }, 5000);
        }
        return [2 /*return*/, _global.vwoInitDeferred.promise];
      } catch (err) {
        msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
          apiName: apiName,
          err: err
        });
        console.info("[INFO]: VWO-SDK ".concat(new Date().toISOString(), " ").concat(msg));
      }
      return [2 /*return*/];
    });
  });
}

/***/ }),

/***/ "./dist/server-unpacked/VWOBuilder.js":
/*!********************************************!*\
  !*** ./dist/server-unpacked/VWOBuilder.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VWOBuilder = void 0;
var logger_1 = __webpack_require__(/*! ./packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var network_layer_1 = __webpack_require__(/*! ./packages/network-layer */ "./dist/server-unpacked/packages/network-layer/index.js");
var segmentation_evaluator_1 = __webpack_require__(/*! ./packages/segmentation-evaluator */ "./dist/server-unpacked/packages/segmentation-evaluator/index.js");
var storage_1 = __webpack_require__(/*! ./packages/storage */ "./dist/server-unpacked/packages/storage/index.js");
var VWOClient_1 = __webpack_require__(/*! ./VWOClient */ "./dist/server-unpacked/VWOClient.js");
var SettingsService_1 = __webpack_require__(/*! ./services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var log_messages_1 = __webpack_require__(/*! ./enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var DataTypeUtil_1 = __webpack_require__(/*! ./utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var FunctionUtil_1 = __webpack_require__(/*! ./utils/FunctionUtil */ "./dist/server-unpacked/utils/FunctionUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ./utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ./utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var SettingsUtil_1 = __webpack_require__(/*! ./utils/SettingsUtil */ "./dist/server-unpacked/utils/SettingsUtil.js");
var UuidUtil_1 = __webpack_require__(/*! ./utils/UuidUtil */ "./dist/server-unpacked/utils/UuidUtil.js");
var BatchEventsQueue_1 = __webpack_require__(/*! ./services/BatchEventsQueue */ "./dist/server-unpacked/services/BatchEventsQueue.js");
var BatchEventsDispatcher_1 = __webpack_require__(/*! ./utils/BatchEventsDispatcher */ "./dist/server-unpacked/utils/BatchEventsDispatcher.js");
var UsageStatsUtil_1 = __webpack_require__(/*! ./utils/UsageStatsUtil */ "./dist/server-unpacked/utils/UsageStatsUtil.js");
var constants_1 = __webpack_require__(/*! ./constants */ "./dist/server-unpacked/constants/index.js");
var VWOBuilder = /** @class */function () {
  function VWOBuilder(options) {
    this.isValidPollIntervalPassedFromInit = false;
    this.options = options;
  }
  /**
   * Sets the network manager with the provided client and development mode options.
   * @returns {this} The instance of this builder.
   */
  VWOBuilder.prototype.setNetworkManager = function () {
    var _a, _b, _c, _d, _e;
    var networkInstance = network_layer_1.NetworkManager.Instance;
    // Attach the network client from options
    networkInstance.attachClient((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.network) === null || _b === void 0 ? void 0 : _b.client, (_c = this.options) === null || _c === void 0 ? void 0 : _c.retryConfig);
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
      service: "Network Layer"
    }));
    // Set the development mode based on options
    networkInstance.getConfig().setDevelopmentMode((_d = this.options) === null || _d === void 0 ? void 0 : _d.isDevelopmentMode);
    // Set proxy URL for browser environments only
    if (typeof process.env === 'undefined' && ((_e = this.options) === null || _e === void 0 ? void 0 : _e.proxyUrl)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      var setProxyUrl = (__webpack_require__(/*! ./packages/network-layer/client/NetworkBrowserClient */ "./dist/server-unpacked/packages/network-layer/client/NetworkBrowserClient.js").setProxyUrl);
      setProxyUrl(this.options.proxyUrl);
    }
    return this;
  };
  VWOBuilder.prototype.initBatching = function () {
    var _this = this;
    if (this.options.batchEventData) {
      if (this.settingFileManager.isGatewayServiceProvided) {
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.GATEWAY_AND_BATCH_EVENTS_CONFIG_MISMATCH));
        return this;
      }
      if ((!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.eventsPerRequest) || this.options.batchEventData.eventsPerRequest <= 0) && (!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.requestTimeInterval) || this.options.batchEventData.requestTimeInterval <= 0)) {
        logger_1.LogManager.Instance.error('Invalid batch events config, should be an object, eventsPerRequest should be a number greater than 0 and requestTimeInterval should be a number greater than 0');
        return this;
      }
      this.batchEventsQueue = new BatchEventsQueue_1.BatchEventsQueue(Object.assign({}, this.options.batchEventData, {
        dispatcher: function (events, callback) {
          return BatchEventsDispatcher_1.BatchEventsDispatcher.dispatch({
            ev: events
          }, callback, Object.assign({}, {
            a: _this.options.accountId,
            env: _this.options.sdkKey
          }));
        }
      }));
      this.batchEventsQueue.flushAndClearTimer.bind(this.batchEventsQueue);
    }
    return this;
  };
  /**
   * Sets the segmentation evaluator with the provided segmentation options.
   * @returns {this} The instance of this builder.
   */
  VWOBuilder.prototype.setSegmentation = function () {
    var _a;
    segmentation_evaluator_1.SegmentationManager.Instance.attachEvaluator((_a = this.options) === null || _a === void 0 ? void 0 : _a.segmentation);
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
      service: "Segmentation Evaluator"
    }));
    return this;
  };
  /**
   * Fetches settings asynchronously, ensuring no parallel fetches.
   * @param {boolean} [force=false] - Force fetch ignoring cache.
   * @returns {Promise<SettingsModel>} A promise that resolves to the fetched settings.
   */
  VWOBuilder.prototype.fetchSettings = function (force) {
    var _this = this;
    var deferredObject = new PromiseUtil_1.Deferred();
    // Check if a fetch operation is already in progress
    if (!this.isSettingsFetchInProgress) {
      this.isSettingsFetchInProgress = true;
      this.settingFileManager.getSettings(force).then(function (settings) {
        // if force is false, update original settings, if true the request is from polling and no need to update original settings
        if (!force) {
          _this.originalSettings = settings;
        }
        _this.isSettingsFetchInProgress = false;
        deferredObject.resolve(settings);
      });
      return deferredObject.promise;
    } else {
      // Avoid parallel fetches by recursively calling fetchSettings
      return this.fetchSettings(force);
    }
  };
  /**
   * Gets the settings, fetching them if not cached or if forced.
   * @param {boolean} [force=false] - Force fetch ignoring cache.
   * @returns {Promise<SettingsModel>} A promise that resolves to the settings.
   */
  VWOBuilder.prototype.getSettings = function (force) {
    var deferredObject = new PromiseUtil_1.Deferred();
    try {
      // Use cached settings if available and not forced to fetch
      if (!force && this.settings) {
        logger_1.LogManager.Instance.info('Using already fetched and cached settings');
        deferredObject.resolve(this.settings);
      } else {
        // Fetch settings if not cached or forced
        this.fetchSettings(force).then(function (settings) {
          deferredObject.resolve(settings);
        });
      }
    } catch (err) {
      logger_1.LogManager.Instance.error('Failed to fetch settings. Error: ' + err);
      deferredObject.resolve({});
    }
    return deferredObject.promise;
  };
  /**
   * Sets the storage connector based on the provided storage options.
   * @returns {this} The instance of this builder.
   */
  VWOBuilder.prototype.setStorage = function () {
    var _a, _b, _c, _d;
    if (this.options.storage) {
      // Attach the storage connector from options
      this.storage = storage_1.Storage.Instance.attachConnector(this.options.storage);
    } else if (typeof process.env === 'undefined' && typeof window !== 'undefined' && window.localStorage) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      var BrowserStorageConnector = (__webpack_require__(/*! ./packages/storage/connectors/BrowserStorageConnector */ "./dist/server-unpacked/packages/storage/connectors/BrowserStorageConnector.js").BrowserStorageConnector);
      // Pass clientStorage config to BrowserStorageConnector
      this.storage = storage_1.Storage.Instance.attachConnector(new BrowserStorageConnector(__assign(__assign({}, this.options.clientStorage), {
        alwaysUseCachedSettings: (_a = this.options.clientStorage) === null || _a === void 0 ? void 0 : _a.alwaysUseCachedSettings,
        ttl: (_b = this.options.clientStorage) === null || _b === void 0 ? void 0 : _b.ttl
      })));
      logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
        service: ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.clientStorage) === null || _d === void 0 ? void 0 : _d.provider) === sessionStorage ? "Session Storage" : "Local Storage"
      }));
    } else {
      // Set storage to null if no storage options provided
      this.storage = null;
    }
    return this;
  };
  /**
   * Sets the settings manager with the provided options.
   * @returns {this} The instance of this builder.
   */
  VWOBuilder.prototype.setSettingsService = function () {
    this.settingFileManager = new SettingsService_1.SettingsService(this.options);
    return this;
  };
  /**
   * Sets the logger with the provided logger options.
   * @returns {this} The instance of this builder.
   */
  VWOBuilder.prototype.setLogger = function () {
    this.logManager = new logger_1.LogManager(this.options.logger || {});
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
      service: "Logger"
    }));
    return this;
  };
  /**
   * Sets the analytics callback with the provided analytics options.
   * @returns {this} The instance of this builder.
   */
  /* setAnalyticsCallback(): this {
    if (!isObject(this.options.analyticsEvent)) {
      // TODO: add logging here
      return this;
    }
       if (!isFunction(this.options.analyticsEvent.eventCallback)) {
      // TODO: add logging here
      return this;
    }
       if (
      this.options.analyticsEvent.isBatchingSupported &&
      !isBoolean(this.options.analyticsEvent.isBatchingSupported)
    ) {
      // TODO:- add logging here
      return this;
    }
       // AnalyticsEvent.Instance.attachCallback(
    //   this.options.analyticsEvent.eventCallback,
    //   this.options.analyticsEvent.isBatchingSupported
    // );
    return this;
  } */
  /**
   * Generates a random user ID based on the provided API key.
   * @returns {string} The generated random user ID.
   */
  VWOBuilder.prototype.getRandomUserId = function () {
    var apiName = 'getRandomUserId';
    try {
      logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
        apiName: apiName
      }));
      return (0, UuidUtil_1.getRandomUUID)(this.options.sdkKey);
    } catch (err) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
        apiName: apiName,
        err: err
      }));
    }
  };
  /**
   * Initializes the batching with the provided batch events options.
   * @returns {this} The instance of this builder.
   */
  /* initBatching(): this {
    if (!isObject(this.options.batchEvents)) {
      // TODO:- add logging here
      return this;
    }
       if (
      isObject(this.options.batchEvents) &&
      (!(
        (isNumber(this.options.batchEvents.eventsPerRequest) &&
          this.options.batchEvents.eventsPerRequest > 0 &&
          this.options.batchEvents.eventsPerRequest <= Constants.MAX_EVENTS_PER_REQUEST) ||
        (isNumber(this.options.batchEvents.requestTimeInterval) && this.options.batchEvents.requestTimeInterval >= 1)
      ) ||
        !isFunction(this.options.batchEvents.flushCallback))
    ) {
      LogManager.Instance.error('Invalid batchEvents config');
      // throw new Error('Invalid batchEvents config');
      return this;
    }
       // BatchEventsQueue.Instance.setBatchConfig(this.options.batchEvents, this.options.sdkKey); // TODO
       return this;
  } */
  /**
   * Initializes the polling with the provided poll interval.
   * @returns {this} The instance of this builder.
   */
  VWOBuilder.prototype.initPolling = function () {
    var pollInterval = this.options.pollInterval;
    if (pollInterval != null && (0, DataTypeUtil_1.isNumber)(pollInterval) && pollInterval >= 1000) {
      this.isValidPollIntervalPassedFromInit = true;
      this.checkAndPoll();
    } else if (pollInterval != null) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_INVALID, {
        key: 'pollInterval',
        correctType: 'number >= 1000'
      }));
    }
    return this;
  };
  /**
   * Initializes usage statistics for the SDK.
   * @returns {this} The instance of this builder.
   */
  VWOBuilder.prototype.initUsageStats = function () {
    if (this.options.isUsageStatsDisabled) {
      return this;
    }
    UsageStatsUtil_1.UsageStatsUtil.getInstance().setUsageStats(this.options);
    return this;
  };
  /**
   * Builds a new VWOClient instance with the provided settings.
   * @param {SettingsModel} settings - The settings for the VWOClient.
   * @returns {VWOClient} The new VWOClient instance.
   */
  VWOBuilder.prototype.build = function (settings) {
    this.vwoInstance = new VWOClient_1.VWOClient(settings, this.options);
    this.updatePollIntervalAndCheckAndPoll(settings, true);
    return this.vwoInstance;
  };
  /**
   * Checks and polls for settings updates at the provided interval.
   */
  VWOBuilder.prototype.checkAndPoll = function () {
    var _this = this;
    var _a;
    var poll = function () {
      return __awaiter(_this, void 0, void 0, function () {
        var latestSettings, clonedSettings, ex_1, interval_1;
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              _b.trys.push([0, 2, 3, 4]);
              return [4 /*yield*/, this.getSettings(true)];
            case 1:
              latestSettings = _b.sent();
              if (latestSettings && JSON.stringify(latestSettings) !== JSON.stringify(this.originalSettings)) {
                this.originalSettings = latestSettings;
                clonedSettings = (0, FunctionUtil_1.cloneObject)(latestSettings);
                logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_SET_SETTINGS);
                (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(clonedSettings, this.vwoInstance);
                // Reinitialize the poll_interval value if there is a change in settings
                this.updatePollIntervalAndCheckAndPoll(latestSettings, false);
              } else if (latestSettings) {
                logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_NO_CHANGE_IN_SETTINGS);
              }
              return [3 /*break*/, 4];
            case 2:
              ex_1 = _b.sent();
              logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.POLLING_FETCH_SETTINGS_FAILED + ': ' + ex_1);
              return [3 /*break*/, 4];
            case 3:
              interval_1 = (_a = this.options.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
              setTimeout(poll, interval_1);
              return [7 /*endfinally*/];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    };
    // Start the polling after the given interval
    var interval = (_a = this.options.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
    setTimeout(poll, interval);
  };
  VWOBuilder.prototype.updatePollIntervalAndCheckAndPoll = function (settings, shouldCheckAndPoll) {
    var _a;
    if (!this.isValidPollIntervalPassedFromInit) {
      var pollInterval = (_a = settings === null || settings === void 0 ? void 0 : settings.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
      logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_POLL_INTERVAL_FROM_SETTINGS, {
        source: (settings === null || settings === void 0 ? void 0 : settings.pollInterval) ? 'settings' : 'default',
        pollInterval: pollInterval.toString()
      }));
      this.options.pollInterval = pollInterval;
    }
    if (shouldCheckAndPoll && !this.isValidPollIntervalPassedFromInit) {
      this.checkAndPoll();
    }
  };
  return VWOBuilder;
}();
exports.VWOBuilder = VWOBuilder;

/***/ }),

/***/ "./dist/server-unpacked/VWOClient.js":
/*!*******************************************!*\
  !*** ./dist/server-unpacked/VWOClient.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VWOClient = void 0;
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
var logger_1 = __webpack_require__(/*! ./packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var GetFlag_1 = __webpack_require__(/*! ./api/GetFlag */ "./dist/server-unpacked/api/GetFlag.js");
var SetAttribute_1 = __webpack_require__(/*! ./api/SetAttribute */ "./dist/server-unpacked/api/SetAttribute.js");
var TrackEvent_1 = __webpack_require__(/*! ./api/TrackEvent */ "./dist/server-unpacked/api/TrackEvent.js");
var log_messages_1 = __webpack_require__(/*! ./enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var BatchEventsQueue_1 = __webpack_require__(/*! ./services/BatchEventsQueue */ "./dist/server-unpacked/services/BatchEventsQueue.js");
var SettingsSchemaValidation_1 = __webpack_require__(/*! ./models/schemas/SettingsSchemaValidation */ "./dist/server-unpacked/models/schemas/SettingsSchemaValidation.js");
var ContextModel_1 = __webpack_require__(/*! ./models/user/ContextModel */ "./dist/server-unpacked/models/user/ContextModel.js");
var HooksService_1 = __webpack_require__(/*! ./services/HooksService */ "./dist/server-unpacked/services/HooksService.js");
var UrlUtil_1 = __webpack_require__(/*! ./utils/UrlUtil */ "./dist/server-unpacked/utils/UrlUtil.js");
var DataTypeUtil_1 = __webpack_require__(/*! ./utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ./utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ./utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var SettingsUtil_1 = __webpack_require__(/*! ./utils/SettingsUtil */ "./dist/server-unpacked/utils/SettingsUtil.js");
var VariationModel_1 = __webpack_require__(/*! ./models/campaign/VariationModel */ "./dist/server-unpacked/models/campaign/VariationModel.js");
var NetworkUtil_1 = __webpack_require__(/*! ./utils/NetworkUtil */ "./dist/server-unpacked/utils/NetworkUtil.js");
var SettingsService_1 = __webpack_require__(/*! ./services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var ApiEnum_1 = __webpack_require__(/*! ./enums/ApiEnum */ "./dist/server-unpacked/enums/ApiEnum.js");
var VWOClient = /** @class */function () {
  function VWOClient(settings, options) {
    this.options = options;
    (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(settings, this);
    UrlUtil_1.UrlUtil.init({
      collectionPrefix: this.settings.getCollectionPrefix()
    });
    (0, NetworkUtil_1.setShouldWaitForTrackingCalls)(this.options.shouldWaitForTrackingCalls || false);
    logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.CLIENT_INITIALIZED);
    this.vwoClientInstance = this;
    return this;
  }
  /**
   * Retrieves the value of a feature flag for a given feature key and context.
   * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
   *
   * @param {string} featureKey - The key of the feature to retrieve.
   * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
   * @returns {Promise<Flag>} - A promise that resolves to the feature flag value.
   */
  VWOClient.prototype.getFlag = function (featureKey, context) {
    var apiName = ApiEnum_1.ApiEnum.GET_FLAG;
    var deferredObject = new PromiseUtil_1.Deferred();
    var errorReturnSchema = new GetFlag_1.Flag(false, new VariationModel_1.VariationModel());
    try {
      var hooksService = new HooksService_1.default(this.options);
      logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
        apiName: apiName
      }));
      // Validate featureKey is a string
      if (!(0, DataTypeUtil_1.isString)(featureKey)) {
        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
          apiName: apiName,
          key: 'featureKey',
          type: (0, DataTypeUtil_1.getType)(featureKey),
          correctType: 'string'
        }));
        throw new TypeError('TypeError: featureKey should be a string');
      }
      // Validate settings are loaded and valid
      if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(this.originalSettings)) {
        logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_SETTING_INVALID);
        throw new Error('TypeError: Invalid Settings');
      }
      // Validate user ID is present in context
      if (!context || !context.id) {
        logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_CONTEXT_INVALID);
        throw new TypeError('TypeError: Invalid context');
      }
      var contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
      GetFlag_1.FlagApi.get(featureKey, this.settings, contextModel, hooksService).then(function (data) {
        deferredObject.resolve(data);
      }).catch(function () {
        deferredObject.resolve(errorReturnSchema);
      });
    } catch (err) {
      logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
        apiName: apiName,
        err: err
      }));
      deferredObject.resolve(errorReturnSchema);
    }
    return deferredObject.promise;
  };
  /**
   * Tracks an event with specified properties and context.
   * This method validates the types of the inputs and ensures the settings and user context are valid before proceeding.
   *
   * @param {string} eventName - The name of the event to track.
   * @param {ContextModel} context - The context in which the event is being tracked, must include a valid user ID.
   * @param {Record<string, dynamic>} eventProperties - The properties associated with the event.
   * @returns {Promise<Record<string, boolean>>} - A promise that resolves to the result of the tracking operation.
   */
  VWOClient.prototype.trackEvent = function (eventName, context, eventProperties) {
    var _a;
    if (eventProperties === void 0) {
      eventProperties = {};
    }
    var apiName = ApiEnum_1.ApiEnum.TRACK_EVENT;
    var deferredObject = new PromiseUtil_1.Deferred();
    try {
      var hooksService = new HooksService_1.default(this.options);
      // Log the API call
      logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
        apiName: apiName
      }));
      // Validate eventName is a string
      if (!(0, DataTypeUtil_1.isString)(eventName)) {
        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
          apiName: apiName,
          key: 'eventName',
          type: (0, DataTypeUtil_1.getType)(eventName),
          correctType: 'string'
        }));
        throw new TypeError('TypeError: Event-name should be a string');
      }
      // Validate eventProperties is an object
      if (!(0, DataTypeUtil_1.isObject)(eventProperties)) {
        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
          apiName: apiName,
          key: 'eventProperties',
          type: (0, DataTypeUtil_1.getType)(eventProperties),
          correctType: 'object'
        }));
        throw new TypeError('TypeError: eventProperties should be an object');
      }
      // Validate settings are loaded and valid
      if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(this.originalSettings)) {
        logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_SETTING_INVALID);
        throw new Error('TypeError: Invalid Settings');
      }
      // Validate user ID is present in context
      if (!context || !context.id) {
        logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_CONTEXT_INVALID);
        throw new TypeError('TypeError: Invalid context');
      }
      var contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
      // Proceed with tracking the event
      new TrackEvent_1.TrackApi().track(this.settings, eventName, contextModel, eventProperties, hooksService).then(function (data) {
        deferredObject.resolve(data);
      }).catch(function () {
        var _a;
        deferredObject.resolve((_a = {}, _a[eventName] = false, _a));
      });
    } catch (err) {
      // Log any errors encountered during the operation
      logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
        apiName: apiName,
        err: err
      }));
      deferredObject.resolve((_a = {}, _a[eventName] = false, _a));
    }
    return deferredObject.promise;
  };
  /**
   * Sets an attribute or multiple attributes for a user in the provided context.
   * This method validates the types of the inputs before proceeding with the API call.
   * There are two cases handled:
   * 1. When attributes are passed as a map (key-value pairs).
   * 2. When a single attribute (key-value) is passed.
   *
   * @param {string | Record<string, boolean | string | number>} attributeOrAttributes - Either a single attribute key (string) and value (boolean | string | number),
   *                                                                                        or a map of attributes with keys and values (boolean | string | number).
   * @param {boolean | string | number | Record<string, any>} [attributeValueOrContext] - The value for the attribute in case of a single attribute, or the context when multiple attributes are passed.
   * @param {Record<string, any>} [context] - The context which must include a valid user ID. This is required if multiple attributes are passed.
   */
  VWOClient.prototype.setAttribute = function (attributeOrAttributes, attributeValueOrContext, context) {
    return __awaiter(this, void 0, void 0, function () {
      var apiName, attributes, contextModel, attributeKey, attributeValue, contextModel, attributeMap, err_1;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            apiName = ApiEnum_1.ApiEnum.SET_ATTRIBUTE;
            _b.label = 1;
          case 1:
            _b.trys.push([1, 6,, 7]);
            if (!(0, DataTypeUtil_1.isObject)(attributeOrAttributes)) return [3 /*break*/, 3];
            // Log the API call
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
              apiName: apiName
            }));
            if (Object.entries(attributeOrAttributes).length < 1) {
              logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)('Attributes map must contain atleast 1 key-value pair', {
                apiName: apiName,
                key: 'attributes',
                type: (0, DataTypeUtil_1.getType)(attributeOrAttributes),
                correctType: 'object'
              }));
              throw new TypeError('TypeError: Attributes should be an object containing atleast 1 key-value pair');
            }
            attributes = attributeOrAttributes;
            // Validate attributes is an object
            if (!(0, DataTypeUtil_1.isObject)(attributes)) {
              throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
            }
            // Validate that each attribute value is of a supported type
            Object.entries(attributes).forEach(function (_a) {
              var key = _a[0],
                value = _a[1];
              if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                  apiName: apiName,
                  key: key,
                  type: (0, DataTypeUtil_1.getType)(value),
                  correctType: ' boolean, string or number'
                }));
                throw new TypeError("Invalid attribute type for key \"".concat(key, "\". Expected boolean, string or number, but got ").concat((0, DataTypeUtil_1.getType)(value)));
              }
              // Reject arrays and objects explicitly
              if (Array.isArray(value) || typeof value === 'object' && value !== null) {
                logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_INVALID_PARAM, {
                  apiName: apiName,
                  key: key,
                  type: (0, DataTypeUtil_1.getType)(value),
                  correctType: ' boolean | string | number | null'
                }));
                throw new TypeError("Invalid attribute value for key \"".concat(key, "\". Arrays and objects are not supported."));
              }
            });
            // If we have only two arguments (attributeMap and context)
            if (!context && attributeValueOrContext) {
              context = attributeValueOrContext; // Assign context explicitly
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
              logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.API_CONTEXT_INVALID);
            }
            contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
            // Proceed with setting the attributes if validation is successful
            return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributes, contextModel)];
          case 2:
            // Proceed with setting the attributes if validation is successful
            _b.sent();
            return [3 /*break*/, 5];
          case 3:
            attributeKey = attributeOrAttributes;
            attributeValue = attributeValueOrContext;
            // Validate attributeKey is a string
            if (!(0, DataTypeUtil_1.isString)(attributeKey)) {
              throw new TypeError('attributeKey should be a string');
            }
            // Validate attributeValue is of valid type
            if (!(0, DataTypeUtil_1.isBoolean)(attributeValue) && !(0, DataTypeUtil_1.isString)(attributeValue) && !(0, DataTypeUtil_1.isNumber)(attributeValue)) {
              throw new TypeError('attributeValue should be a boolean, string, or number');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
              throw new TypeError('Invalid context');
            }
            contextModel = new ContextModel_1.ContextModel().modelFromDictionary(context);
            attributeMap = (_a = {}, _a[attributeKey] = attributeValue, _a);
            // Proceed with setting the attribute map if validation is successful
            return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.settings, attributeMap, contextModel)];
          case 4:
            // Proceed with setting the attribute map if validation is successful
            _b.sent();
            _b.label = 5;
          case 5:
            return [3 /*break*/, 7];
          case 6:
            err_1 = _b.sent();
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
              apiName: apiName,
              err: err_1
            }));
            return [3 /*break*/, 7];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Updates the settings by fetching the latest settings from the VWO server.
   * @param settings - The settings to update.
   * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
   * @returns Promise<void>
   */
  VWOClient.prototype.updateSettings = function (settings_1) {
    return __awaiter(this, arguments, void 0, function (settings, isViaWebhook) {
      var apiName, settingsToUpdate, _a, err_2;
      if (isViaWebhook === void 0) {
        isViaWebhook = true;
      }
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            apiName = ApiEnum_1.ApiEnum.UPDATE_SETTINGS;
            _b.label = 1;
          case 1:
            _b.trys.push([1, 5,, 6]);
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
              apiName: apiName
            }));
            if (!(!settings || Object.keys(settings).length === 0)) return [3 /*break*/, 3];
            return [4 /*yield*/, SettingsService_1.SettingsService.Instance.fetchSettings(isViaWebhook)];
          case 2:
            _a = _b.sent();
            return [3 /*break*/, 4];
          case 3:
            _a = settings;
            _b.label = 4;
          case 4:
            settingsToUpdate = _a;
            // validate settings schema
            if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(settingsToUpdate)) {
              throw new Error('TypeError: Invalid Settings schema');
            }
            // set the settings on the client instance
            (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(settingsToUpdate, this.vwoClientInstance);
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_UPDATED, {
              apiName: apiName,
              isViaWebhook: isViaWebhook
            }));
            return [3 /*break*/, 6];
          case 5:
            err_2 = _b.sent();
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SETTINGS_FETCH_FAILED, {
              apiName: apiName,
              isViaWebhook: isViaWebhook,
              err: JSON.stringify(err_2)
            }));
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Flushes the events manually from the batch events queue
   */
  VWOClient.prototype.flushEvents = function () {
    var apiName = ApiEnum_1.ApiEnum.FLUSH_EVENTS;
    var deferredObject = new PromiseUtil_1.Deferred();
    try {
      logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
        apiName: apiName
      }));
      if (BatchEventsQueue_1.BatchEventsQueue.Instance) {
        // return the promise from the flushAndClearTimer method
        return BatchEventsQueue_1.BatchEventsQueue.Instance.flushAndClearTimer();
      } else {
        logger_1.LogManager.Instance.error('Batching is not enabled. Pass batchEventData in the SDK configuration while invoking init API.');
        deferredObject.resolve({
          status: 'error',
          events: []
        });
      }
    } catch (err) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
        apiName: apiName,
        err: err
      }));
      deferredObject.resolve({
        status: 'error',
        events: []
      });
    }
    return deferredObject.promise;
  };
  return VWOClient;
}();
exports.VWOClient = VWOClient;

/***/ }),

/***/ "./dist/server-unpacked/api/GetFlag.js":
/*!*********************************************!*\
  !*** ./dist/server-unpacked/api/GetFlag.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



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
var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FlagApi = exports.Flag = void 0;
var StorageDecorator_1 = __webpack_require__(/*! ../decorators/StorageDecorator */ "./dist/server-unpacked/decorators/StorageDecorator.js");
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./dist/server-unpacked/enums/ApiEnum.js");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./dist/server-unpacked/enums/CampaignTypeEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var CampaignModel_1 = __webpack_require__(/*! ../models/campaign/CampaignModel */ "./dist/server-unpacked/models/campaign/CampaignModel.js");
var VariableModel_1 = __webpack_require__(/*! ../models/campaign/VariableModel */ "./dist/server-unpacked/models/campaign/VariableModel.js");
var VariationModel_1 = __webpack_require__(/*! ../models/campaign/VariationModel */ "./dist/server-unpacked/models/campaign/VariationModel.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var segmentation_evaluator_1 = __webpack_require__(/*! ../packages/segmentation-evaluator */ "./dist/server-unpacked/packages/segmentation-evaluator/index.js");
var StorageService_1 = __webpack_require__(/*! ../services/StorageService */ "./dist/server-unpacked/services/StorageService.js");
var CampaignUtil_1 = __webpack_require__(/*! ../utils/CampaignUtil */ "./dist/server-unpacked/utils/CampaignUtil.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var DecisionUtil_1 = __webpack_require__(/*! ../utils/DecisionUtil */ "./dist/server-unpacked/utils/DecisionUtil.js");
var FunctionUtil_1 = __webpack_require__(/*! ../utils/FunctionUtil */ "./dist/server-unpacked/utils/FunctionUtil.js");
var ImpressionUtil_1 = __webpack_require__(/*! ../utils/ImpressionUtil */ "./dist/server-unpacked/utils/ImpressionUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var RuleEvaluationUtil_1 = __webpack_require__(/*! ../utils/RuleEvaluationUtil */ "./dist/server-unpacked/utils/RuleEvaluationUtil.js");
var NetworkUtil_1 = __webpack_require__(/*! ../utils/NetworkUtil */ "./dist/server-unpacked/utils/NetworkUtil.js");
var Flag = /** @class */function () {
  function Flag(isEnabled, variation) {
    this.enabled = isEnabled;
    this.variation = variation;
  }
  Flag.prototype.isEnabled = function () {
    return this.enabled;
  };
  Flag.prototype.getVariables = function () {
    var _a;
    return ((_a = this.variation) === null || _a === void 0 ? void 0 : _a.getVariables()) || [];
  };
  Flag.prototype.getVariable = function (key, defaultValue) {
    var _a, _b;
    var value = (_b = (_a = this.variation) === null || _a === void 0 ? void 0 : _a.getVariables().find(function (variable) {
      return VariableModel_1.VariableModel.modelFromDictionary(variable).getKey() === key;
    })) === null || _b === void 0 ? void 0 : _b.getValue();
    return value !== undefined ? value : defaultValue;
  };
  return Flag;
}();
exports.Flag = Flag;
var FlagApi = /** @class */function () {
  function FlagApi() {}
  FlagApi.get = function (featureKey, settings, context, hooksService) {
    return __awaiter(this, void 0, void 0, function () {
      var isEnabled, rolloutVariationToReturn, experimentVariationToReturn, shouldCheckForExperimentsRules, passedRulesInformation, deferredObject, evaluatedFeatureMap, feature, decision, storageService, storedData, variation, variation, featureInfo, rollOutRules, rolloutRulesToEvaluate, _i, rollOutRules_1, rule, _a, preSegmentationResult, updatedDecision, passedRolloutCampaign, variation, experimentRulesToEvaluate, experimentRules, megGroupWinnerCampaigns, _b, experimentRules_1, rule, _c, preSegmentationResult, whitelistedObject, updatedDecision, campaign, variation;
      var _d, _e, _f, _g;
      return __generator(this, function (_h) {
        switch (_h.label) {
          case 0:
            isEnabled = false;
            rolloutVariationToReturn = null;
            experimentVariationToReturn = null;
            shouldCheckForExperimentsRules = false;
            passedRulesInformation = {};
            deferredObject = new PromiseUtil_1.Deferred();
            evaluatedFeatureMap = new Map();
            feature = (0, FunctionUtil_1.getFeatureFromKey)(settings, featureKey);
            decision = {
              featureName: feature === null || feature === void 0 ? void 0 : feature.getName(),
              featureId: feature === null || feature === void 0 ? void 0 : feature.getId(),
              featureKey: feature === null || feature === void 0 ? void 0 : feature.getKey(),
              userId: context === null || context === void 0 ? void 0 : context.getId(),
              api: ApiEnum_1.ApiEnum.GET_FLAG
            };
            storageService = new StorageService_1.StorageService();
            return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService)];
          case 1:
            storedData = _h.sent();
            if (storedData === null || storedData === void 0 ? void 0 : storedData.experimentVariationId) {
              if (storedData.experimentKey) {
                variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.experimentKey, storedData.experimentVariationId);
                if (variation) {
                  logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                    variationKey: variation.getKey(),
                    userId: context.getId(),
                    experimentType: 'experiment',
                    experimentKey: storedData.experimentKey
                  }));
                  deferredObject.resolve(new Flag(true, variation));
                  return [2 /*return*/, deferredObject.promise];
                }
              }
            } else if ((storedData === null || storedData === void 0 ? void 0 : storedData.rolloutKey) && (storedData === null || storedData === void 0 ? void 0 : storedData.rolloutId)) {
              variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.rolloutKey, storedData.rolloutVariationId);
              if (variation) {
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                  variationKey: variation.getKey(),
                  userId: context.getId(),
                  experimentType: 'rollout',
                  experimentKey: storedData.rolloutKey
                }));
                logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED, {
                  userId: context.getId()
                }));
                isEnabled = true;
                shouldCheckForExperimentsRules = true;
                rolloutVariationToReturn = variation;
                featureInfo = {
                  rolloutId: storedData.rolloutId,
                  rolloutKey: storedData.rolloutKey,
                  rolloutVariationId: storedData.rolloutVariationId
                };
                evaluatedFeatureMap.set(featureKey, featureInfo);
                Object.assign(passedRulesInformation, featureInfo);
              }
            }
            if (!(0, DataTypeUtil_1.isObject)(feature) || feature === undefined) {
              logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.FEATURE_NOT_FOUND, {
                featureKey: featureKey
              }));
              deferredObject.reject({});
              return [2 /*return*/, deferredObject.promise];
            }
            // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
            return [4 /*yield*/, segmentation_evaluator_1.SegmentationManager.Instance.setContextualData(settings, feature, context)];
          case 2:
            // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
            _h.sent();
            rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT);
            if (!(rollOutRules.length > 0 && !isEnabled)) return [3 /*break*/, 10];
            rolloutRulesToEvaluate = [];
            _i = 0, rollOutRules_1 = rollOutRules;
            _h.label = 3;
          case 3:
            if (!(_i < rollOutRules_1.length)) return [3 /*break*/, 6];
            rule = rollOutRules_1[_i];
            return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, null, storageService, decision)];
          case 4:
            _a = _h.sent(), preSegmentationResult = _a.preSegmentationResult, updatedDecision = _a.updatedDecision;
            Object.assign(decision, updatedDecision);
            if (preSegmentationResult) {
              // if pre segment passed, then break the loop and check the traffic allocation
              rolloutRulesToEvaluate.push(rule);
              evaluatedFeatureMap.set(featureKey, {
                rolloutId: rule.getId(),
                rolloutKey: rule.getKey(),
                rolloutVariationId: (_d = rule.getVariations()[0]) === null || _d === void 0 ? void 0 : _d.getId()
              });
              return [3 /*break*/, 6];
            }
            return [3 /*break*/, 5];
          // if rule does not satisfy, then check for other ROLLOUT rules
          case 5:
            _i++;
            return [3 /*break*/, 3];
          case 6:
            if (!(rolloutRulesToEvaluate.length > 0)) return [3 /*break*/, 9];
            passedRolloutCampaign = new CampaignModel_1.CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
            variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, passedRolloutCampaign, context.getId());
            if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 9];
            isEnabled = true;
            shouldCheckForExperimentsRules = true;
            rolloutVariationToReturn = variation;
            _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);
            if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 8];
            return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, passedRolloutCampaign.getId(), variation.getId(), context)];
          case 7:
            _h.sent();
            return [3 /*break*/, 9];
          case 8:
            (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, passedRolloutCampaign.getId(), variation.getId(), context);
            _h.label = 9;
          case 9:
            return [3 /*break*/, 11];
          case 10:
            if (rollOutRules.length === 0) {
              logger_1.LogManager.Instance.debug(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT);
              shouldCheckForExperimentsRules = true;
            }
            _h.label = 11;
          case 11:
            if (!shouldCheckForExperimentsRules) return [3 /*break*/, 18];
            experimentRulesToEvaluate = [];
            experimentRules = (0, FunctionUtil_1.getAllExperimentRules)(feature);
            megGroupWinnerCampaigns = new Map();
            _b = 0, experimentRules_1 = experimentRules;
            _h.label = 12;
          case 12:
            if (!(_b < experimentRules_1.length)) return [3 /*break*/, 15];
            rule = experimentRules_1[_b];
            return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision)];
          case 13:
            _c = _h.sent(), preSegmentationResult = _c.preSegmentationResult, whitelistedObject = _c.whitelistedObject, updatedDecision = _c.updatedDecision;
            Object.assign(decision, updatedDecision);
            if (preSegmentationResult) {
              if (whitelistedObject === null) {
                // whitelistedObject will be null if pre segment passed but whitelisting failed
                experimentRulesToEvaluate.push(rule);
              } else {
                isEnabled = true;
                experimentVariationToReturn = whitelistedObject.variation;
                Object.assign(passedRulesInformation, {
                  experimentId: rule.getId(),
                  experimentKey: rule.getKey(),
                  experimentVariationId: whitelistedObject.variationId
                });
              }
              return [3 /*break*/, 15];
            }
            return [3 /*break*/, 14];
          case 14:
            _b++;
            return [3 /*break*/, 12];
          case 15:
            if (!(experimentRulesToEvaluate.length > 0)) return [3 /*break*/, 18];
            campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
            variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, campaign, context.getId());
            if (!((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0)) return [3 /*break*/, 18];
            isEnabled = true;
            experimentVariationToReturn = variation;
            _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
            if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 17];
            return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), variation.getId(), context)];
          case 16:
            _h.sent();
            return [3 /*break*/, 18];
          case 17:
            (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), variation.getId(), context);
            _h.label = 18;
          case 18:
            // If flag is enabled, store it in data
            if (isEnabled) {
              // set storage data
              new StorageDecorator_1.StorageDecorator().setDataInStorage(__assign({
                featureKey: featureKey,
                context: context
              }, passedRulesInformation), storageService);
            }
            // call integration callback, if defined
            hooksService.set(decision);
            hooksService.execute(hooksService.get());
            if (!((_e = feature.getImpactCampaign()) === null || _e === void 0 ? void 0 : _e.getCampaignId())) return [3 /*break*/, 21];
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPACT_ANALYSIS, {
              userId: context.getId(),
              featureKey: featureKey,
              status: isEnabled ? 'enabled' : 'disabled'
            }));
            if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 20];
            return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, (_f = feature.getImpactCampaign()) === null || _f === void 0 ? void 0 : _f.getCampaignId(), isEnabled ? 2 : 1,
            // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
            context)];
          case 19:
            _h.sent();
            return [3 /*break*/, 21];
          case 20:
            (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, (_g = feature.getImpactCampaign()) === null || _g === void 0 ? void 0 : _g.getCampaignId(), isEnabled ? 2 : 1,
            // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
            context);
            _h.label = 21;
          case 21:
            deferredObject.resolve(new Flag(isEnabled, new VariationModel_1.VariationModel().modelFromDictionary(experimentVariationToReturn !== null && experimentVariationToReturn !== void 0 ? experimentVariationToReturn : rolloutVariationToReturn)));
            return [2 /*return*/, deferredObject.promise];
        }
      });
    });
  };
  return FlagApi;
}();
exports.FlagApi = FlagApi;
// Not PRIVATE methods but helper methods. If need be, move them to some util file to be reused by other API(s)
function _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision) {
  if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT) {
    Object.assign(passedRulesInformation, {
      rolloutId: campaign.getId(),
      rolloutKey: campaign.getKey(),
      rolloutVariationId: variation.getId()
    });
  } else {
    Object.assign(passedRulesInformation, {
      experimentId: campaign.getId(),
      experimentKey: campaign.getKey(),
      experimentVariationId: variation.getId()
    });
  }
  Object.assign(decision, passedRulesInformation);
}

/***/ }),

/***/ "./dist/server-unpacked/api/SetAttribute.js":
/*!**************************************************!*\
  !*** ./dist/server-unpacked/api/SetAttribute.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



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
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SetAttributeApi = void 0;
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./dist/server-unpacked/enums/EventEnum.js");
var NetworkUtil_1 = __webpack_require__(/*! ../utils/NetworkUtil */ "./dist/server-unpacked/utils/NetworkUtil.js");
var BatchEventsQueue_1 = __webpack_require__(/*! ../services/BatchEventsQueue */ "./dist/server-unpacked/services/BatchEventsQueue.js");
var SetAttributeApi = /** @class */function () {
  function SetAttributeApi() {}
  /**
   * Implementation of setAttributes to create an impression for multiple user attributes.
   * @param settings Configuration settings.
   * @param attributes Key-value map of attributes.
   * @param context Context containing user information.
   */
  SetAttributeApi.prototype.setAttribute = function (settings, attributes, context) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 2];
            return [4 /*yield*/, createImpressionForAttributes(settings, attributes, context)];
          case 1:
            _a.sent();
            return [3 /*break*/, 3];
          case 2:
            createImpressionForAttributes(settings, attributes, context);
            _a.label = 3;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  return SetAttributeApi;
}();
exports.SetAttributeApi = SetAttributeApi;
/**
 * Creates an impression for multiple user attributes and sends it to the server.
 * @param settings Configuration settings.
 * @param attributes Key-value map of attributes.
 * @param context Context containing user information.
 */
var createImpressionForAttributes = function (settings, attributes, context) {
  return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
          payload = (0, NetworkUtil_1.getAttributePayloadData)(settings, context.getId(), EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP, attributes, context.getUserAgent(), context.getIpAddress());
          if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
          BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
          return [3 /*break*/, 3];
        case 1:
          // Send the constructed payload via POST request
          return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId())];
        case 2:
          // Send the constructed payload via POST request
          _a.sent();
          _a.label = 3;
        case 3:
          return [2 /*return*/];
      }
    });
  });
};

/***/ }),

/***/ "./dist/server-unpacked/api/TrackEvent.js":
/*!************************************************!*\
  !*** ./dist/server-unpacked/api/TrackEvent.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TrackApi = void 0;
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
var ApiEnum_1 = __webpack_require__(/*! ../enums/ApiEnum */ "./dist/server-unpacked/enums/ApiEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var FunctionUtil_1 = __webpack_require__(/*! ../utils/FunctionUtil */ "./dist/server-unpacked/utils/FunctionUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var BatchEventsQueue_1 = __webpack_require__(/*! ../services/BatchEventsQueue */ "./dist/server-unpacked/services/BatchEventsQueue.js");
var NetworkUtil_1 = __webpack_require__(/*! ../utils/NetworkUtil */ "./dist/server-unpacked/utils/NetworkUtil.js");
var TrackApi = /** @class */function () {
  function TrackApi() {}
  /**
   * Implementation of the track method to handle event tracking.
   * Checks if the event exists, creates an impression, and executes hooks.
   */
  TrackApi.prototype.track = function (settings, eventName, context, eventProperties, hooksService) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (!(0, FunctionUtil_1.doesEventBelongToAnyFeature)(eventName, settings)) return [3 /*break*/, 4];
            if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 2];
            return [4 /*yield*/, createImpressionForTrack(settings, eventName, context, eventProperties)];
          case 1:
            _c.sent();
            return [3 /*break*/, 3];
          case 2:
            createImpressionForTrack(settings, eventName, context, eventProperties);
            _c.label = 3;
          case 3:
            // Set and execute integration callback for the track event
            hooksService.set({
              eventName: eventName,
              api: ApiEnum_1.ApiEnum.TRACK_EVENT
            });
            hooksService.execute(hooksService.get());
            return [2 /*return*/, (_a = {}, _a[eventName] = true, _a)];
          case 4:
            // Log an error if the event does not exist
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.EVENT_NOT_FOUND, {
              eventName: eventName
            }));
            return [2 /*return*/, (_b = {}, _b[eventName] = false, _b)];
        }
      });
    });
  };
  return TrackApi;
}();
exports.TrackApi = TrackApi;
/**
 * Creates an impression for a track event and sends it via a POST API request.
 * @param settings Configuration settings for the tracking.
 * @param eventName Name of the event to track.
 * @param user User details.
 * @param eventProperties Properties associated with the event.
 */
var createImpressionForTrack = function (settings, eventName, context, eventProperties) {
  return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          properties = (0, NetworkUtil_1.getEventsBaseProperties)(eventName, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
          payload = (0, NetworkUtil_1.getTrackGoalPayloadData)(settings, context.getId(), eventName, eventProperties, context === null || context === void 0 ? void 0 : context.getUserAgent(), context === null || context === void 0 ? void 0 : context.getIpAddress());
          if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
          BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
          return [3 /*break*/, 3];
        case 1:
          // Send the constructed payload via POST request
          return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId())];
        case 2:
          // Send the constructed payload via POST request
          _a.sent();
          _a.label = 3;
        case 3:
          return [2 /*return*/];
      }
    });
  });
};

/***/ }),

/***/ "./dist/server-unpacked/constants/Url.js":
/*!***********************************************!*\
  !*** ./dist/server-unpacked/constants/Url.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HTTPS_PROTOCOL = exports.HTTP_PROTOCOL = exports.SEED_URL = exports.HTTPS = exports.HTTP = void 0;
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
exports.HTTP = 'http';
exports.HTTPS = 'https';
exports.SEED_URL = 'https://vwo.com';
exports.HTTP_PROTOCOL = "".concat(exports.HTTP, "://");
exports.HTTPS_PROTOCOL = "".concat(exports.HTTPS, "://");

/***/ }),

/***/ "./dist/server-unpacked/constants/index.js":
/*!*************************************************!*\
  !*** ./dist/server-unpacked/constants/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Constants = void 0;
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
/* global SDK_VERSION */
var PlatformEnum_1 = __webpack_require__(/*! ../enums/PlatformEnum */ "./dist/server-unpacked/enums/PlatformEnum.js");
var Url_1 = __webpack_require__(/*! ./Url */ "./dist/server-unpacked/constants/Url.js");
var packageFile;
var platform;
// For client-side SDK, to keep the build size low
// avoid adding the whole package file in the bundle
if (typeof process.env === 'undefined') {
  packageFile = {
    name: 'vwo-fme-javascript-sdk',
    // will be replaced by webpack for browser build
    // @ts-expect-error This will be relaved by webpack at the time of build for browser
    version: SDK_VERSION // will be replaced by webpack for browser build
  };
  platform = PlatformEnum_1.PlatformEnum.CLIENT;
} else {
  packageFile = __webpack_require__(/*! ../../package.json */ "./dist/package.json");
  platform = PlatformEnum_1.PlatformEnum.SERVER;
}
exports.Constants = {
  SDK_NAME: packageFile.name,
  SDK_VERSION: packageFile.version,
  PLATFORM: platform,
  MAX_TRAFFIC_PERCENT: 100,
  MAX_TRAFFIC_VALUE: 10000,
  STATUS_RUNNING: 'RUNNING',
  SEED_VALUE: 1,
  MAX_EVENTS_PER_REQUEST: 5000,
  DEFAULT_REQUEST_TIME_INTERVAL: 600,
  // 10 * 60(secs) = 600 secs i.e. 10 minutes
  DEFAULT_EVENTS_PER_REQUEST: 100,
  SEED_URL: Url_1.SEED_URL,
  HTTP_PROTOCOL: Url_1.HTTP_PROTOCOL,
  HTTPS_PROTOCOL: Url_1.HTTPS_PROTOCOL,
  SETTINGS: 'settings',
  SETTINGS_EXPIRY: 10000000,
  SETTINGS_TIMEOUT: 50000,
  SETTINGS_TTL: 7200000,
  // 2 HOURS
  MIN_TTL_MS: 60000,
  // 1 MINUTE
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
    backoffMultiplier: 2
  },
  DEFAULT_LOCAL_STORAGE_KEY: 'vwo_fme_data',
  DEFAULT_SETTINGS_STORAGE_KEY: 'vwo_fme_settings',
  POLLING_INTERVAL: 600000
};

/***/ }),

/***/ "./dist/server-unpacked/decorators/StorageDecorator.js":
/*!*************************************************************!*\
  !*** ./dist/server-unpacked/decorators/StorageDecorator.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StorageDecorator = void 0;
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
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var StorageEnum_1 = __webpack_require__(/*! ../enums/StorageEnum */ "./dist/server-unpacked/enums/StorageEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var StorageDecorator = /** @class */function () {
  function StorageDecorator() {}
  /**
   * Asynchronously retrieves a feature from storage based on the feature key and user.
   * @param featureKey The key of the feature to retrieve.
   * @param user The user object.
   * @param storageService The storage service instance.
   * @returns A promise that resolves to the retrieved feature or relevant status.
   */
  StorageDecorator.prototype.getFeatureFromStorage = function (featureKey, context, storageService) {
    return __awaiter(this, void 0, void 0, function () {
      var deferredObject;
      return __generator(this, function (_a) {
        deferredObject = new PromiseUtil_1.Deferred();
        storageService.getDataInStorage(featureKey, context).then(function (campaignMap) {
          switch (campaignMap) {
            case StorageEnum_1.StorageEnum.STORAGE_UNDEFINED:
              deferredObject.resolve(null); // No storage defined
              break;
            case StorageEnum_1.StorageEnum.NO_DATA_FOUND:
              deferredObject.resolve(null); // No data found in storage
              break;
            case StorageEnum_1.StorageEnum.INCORRECT_DATA:
              deferredObject.resolve(StorageEnum_1.StorageEnum.INCORRECT_DATA); // Incorrect data found
              break;
            case StorageEnum_1.StorageEnum.CAMPAIGN_PAUSED:
              deferredObject.resolve(null); // Campaign is paused
              break;
            case StorageEnum_1.StorageEnum.VARIATION_NOT_FOUND:
              deferredObject.resolve(StorageEnum_1.StorageEnum.VARIATION_NOT_FOUND); // No variation found
              break;
            case StorageEnum_1.StorageEnum.WHITELISTED_VARIATION:
              deferredObject.resolve(null); // Whitelisted variation, handle accordingly
              break;
            default:
              deferredObject.resolve(campaignMap);
            // Valid data found, resolve with it
          }
        });
        return [2 /*return*/, deferredObject.promise];
      });
    });
  };
  /**
   * Sets data in storage based on the provided data object.
   * @param data The data to be stored, including feature key and user details.
   * @param storageService The storage service instance.
   * @returns A promise that resolves when the data is successfully stored.
   */
  StorageDecorator.prototype.setDataInStorage = function (data, storageService) {
    var deferredObject = new PromiseUtil_1.Deferred();
    var featureKey = data.featureKey,
      context = data.context,
      rolloutId = data.rolloutId,
      rolloutKey = data.rolloutKey,
      rolloutVariationId = data.rolloutVariationId,
      experimentId = data.experimentId,
      experimentKey = data.experimentKey,
      experimentVariationId = data.experimentVariationId;
    if (!featureKey) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORING_DATA_ERROR, {
        key: 'featureKey'
      }));
      deferredObject.reject(); // Reject promise if feature key is invalid
      return;
    }
    if (!context.id) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORING_DATA_ERROR, {
        key: 'Context or Context.id'
      }));
      deferredObject.reject(); // Reject promise if user ID is invalid
      return;
    }
    if (rolloutKey && !experimentKey && !rolloutVariationId) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORING_DATA_ERROR, {
        key: 'Variation:(rolloutKey, experimentKey or rolloutVariationId)'
      }));
      deferredObject.reject(); // Reject promise if rollout variation is invalid
      return;
    }
    if (experimentKey && !experimentVariationId) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORING_DATA_ERROR, {
        key: 'Variation:(experimentKey or rolloutVariationId)'
      }));
      deferredObject.reject(); // Reject promise if experiment variation is invalid
      return;
    }
    storageService.setDataInStorage({
      featureKey: featureKey,
      userId: context.id,
      rolloutId: rolloutId,
      rolloutKey: rolloutKey,
      rolloutVariationId: rolloutVariationId,
      experimentId: experimentId,
      experimentKey: experimentKey,
      experimentVariationId: experimentVariationId
    });
    deferredObject.resolve(); // Resolve promise when data is successfully set
    return deferredObject.promise;
  };
  return StorageDecorator;
}();
exports.StorageDecorator = StorageDecorator;

/***/ }),

/***/ "./dist/server-unpacked/enums/ApiEnum.js":
/*!***********************************************!*\
  !*** ./dist/server-unpacked/enums/ApiEnum.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ApiEnum = void 0;
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
var ApiEnum;
(function (ApiEnum) {
  ApiEnum["INIT"] = "init";
  ApiEnum["ON_INIT"] = "onInit";
  ApiEnum["GET_FLAG"] = "getFlag";
  ApiEnum["TRACK_EVENT"] = "trackEvent";
  ApiEnum["SET_ATTRIBUTE"] = "setAttribute";
  ApiEnum["FLUSH_EVENTS"] = "flushEvents";
  ApiEnum["UPDATE_SETTINGS"] = "updateSettings";
})(ApiEnum || (exports.ApiEnum = ApiEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/CampaignTypeEnum.js":
/*!********************************************************!*\
  !*** ./dist/server-unpacked/enums/CampaignTypeEnum.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CampaignTypeEnum = void 0;
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
var CampaignTypeEnum;
(function (CampaignTypeEnum) {
  CampaignTypeEnum["ROLLOUT"] = "FLAG_ROLLOUT";
  CampaignTypeEnum["AB"] = "FLAG_TESTING";
  CampaignTypeEnum["PERSONALIZE"] = "FLAG_PERSONALIZE";
})(CampaignTypeEnum || (exports.CampaignTypeEnum = CampaignTypeEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/EventEnum.js":
/*!*************************************************!*\
  !*** ./dist/server-unpacked/enums/EventEnum.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.EventEnum = void 0;
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
var EventEnum;
(function (EventEnum) {
  EventEnum["VWO_VARIATION_SHOWN"] = "vwo_variationShown";
  EventEnum["VWO_SYNC_VISITOR_PROP"] = "vwo_syncVisitorProp";
  EventEnum["VWO_LOG_EVENT"] = "vwo_log";
})(EventEnum || (exports.EventEnum = EventEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/HeadersEnum.js":
/*!***************************************************!*\
  !*** ./dist/server-unpacked/enums/HeadersEnum.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HeadersEnum = void 0;
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
var HeadersEnum;
(function (HeadersEnum) {
  HeadersEnum["USER_AGENT"] = "X-Device-User-Agent";
  HeadersEnum["IP"] = "VWO-X-Forwarded-For";
})(HeadersEnum || (exports.HeadersEnum = HeadersEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/HttpMethodEnum.js":
/*!******************************************************!*\
  !*** ./dist/server-unpacked/enums/HttpMethodEnum.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HttpMethodEnum = void 0;
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
var HttpMethodEnum;
(function (HttpMethodEnum) {
  HttpMethodEnum["GET"] = "GET";
  HttpMethodEnum["POST"] = "POST";
})(HttpMethodEnum || (exports.HttpMethodEnum = HttpMethodEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/PlatformEnum.js":
/*!****************************************************!*\
  !*** ./dist/server-unpacked/enums/PlatformEnum.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PlatformEnum = void 0;
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
var PlatformEnum;
(function (PlatformEnum) {
  PlatformEnum["CLIENT"] = "client";
  PlatformEnum["SERVER"] = "server";
})(PlatformEnum || (exports.PlatformEnum = PlatformEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/StatusEnum.js":
/*!**************************************************!*\
  !*** ./dist/server-unpacked/enums/StatusEnum.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StatusEnum = void 0;
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
var StatusEnum;
(function (StatusEnum) {
  StatusEnum["PASSED"] = "passed";
  StatusEnum["FAILED"] = "failed";
})(StatusEnum || (exports.StatusEnum = StatusEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/StorageEnum.js":
/*!***************************************************!*\
  !*** ./dist/server-unpacked/enums/StorageEnum.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StorageEnum = void 0;
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
var StorageEnum;
(function (StorageEnum) {
  StorageEnum[StorageEnum["STORAGE_UNDEFINED"] = 0] = "STORAGE_UNDEFINED";
  StorageEnum[StorageEnum["INCORRECT_DATA"] = 1] = "INCORRECT_DATA";
  StorageEnum[StorageEnum["NO_DATA_FOUND"] = 2] = "NO_DATA_FOUND";
  StorageEnum[StorageEnum["CAMPAIGN_PAUSED"] = 3] = "CAMPAIGN_PAUSED";
  StorageEnum[StorageEnum["VARIATION_NOT_FOUND"] = 4] = "VARIATION_NOT_FOUND";
  StorageEnum[StorageEnum["WHITELISTED_VARIATION"] = 5] = "WHITELISTED_VARIATION";
})(StorageEnum || (exports.StorageEnum = StorageEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/UrlEnum.js":
/*!***********************************************!*\
  !*** ./dist/server-unpacked/enums/UrlEnum.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UrlEnum = void 0;
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
var UrlEnum;
(function (UrlEnum) {
  UrlEnum["EVENTS"] = "/events/t";
  UrlEnum["ATTRIBUTE_CHECK"] = "/check-attribute";
  UrlEnum["GET_USER_DATA"] = "/get-user-details";
  UrlEnum["BATCH_EVENTS"] = "/server-side/batch-events-v2";
})(UrlEnum || (exports.UrlEnum = UrlEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/enums/log-messages/index.js":
/*!**********************************************************!*\
  !*** ./dist/server-unpacked/enums/log-messages/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ErrorLogMessagesEnum = exports.InfoLogMessagesEnum = exports.DebugLogMessagesEnum = void 0;
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
var messages = __webpack_require__(/*! vwo-fme-sdk-log-messages */ "vwo-fme-sdk-log-messages");
var DebugLogMessagesEnum = messages.debugMessages;
exports.DebugLogMessagesEnum = DebugLogMessagesEnum;
var InfoLogMessagesEnum = messages.infoMessages;
exports.InfoLogMessagesEnum = InfoLogMessagesEnum;
var ErrorLogMessagesEnum = messages.errorMessages;
exports.ErrorLogMessagesEnum = ErrorLogMessagesEnum;

/***/ }),

/***/ "./dist/server-unpacked/models/campaign/CampaignModel.js":
/*!***************************************************************!*\
  !*** ./dist/server-unpacked/models/campaign/CampaignModel.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CampaignModel = void 0;
var MetricModel_1 = __webpack_require__(/*! ./MetricModel */ "./dist/server-unpacked/models/campaign/MetricModel.js");
var VariableModel_1 = __webpack_require__(/*! ./VariableModel */ "./dist/server-unpacked/models/campaign/VariableModel.js");
var VariationModel_1 = __webpack_require__(/*! ./VariationModel */ "./dist/server-unpacked/models/campaign/VariationModel.js");
var CampaignModel = /** @class */function () {
  function CampaignModel() {
    this.variations = [];
    this.metrics = [];
    this.variables = [];
  }
  CampaignModel.prototype.copy = function (campaignModel) {
    this.metrics = campaignModel.metrics;
    this.variations = campaignModel.variations;
    this.variables = campaignModel.variables;
    this.processCampaignKeys(campaignModel);
  };
  CampaignModel.prototype.modelFromDictionary = function (campaign) {
    this.processCampaignProperties(campaign);
    this.processCampaignKeys(campaign);
    return this;
  };
  CampaignModel.prototype.processCampaignProperties = function (campaign) {
    var _this = this;
    if (campaign.variables) {
      // campaign.var ||
      if (
      // (campaign.var && campaign.var.constructor === {}.constructor) ||
      campaign.variables.constructor === {}.constructor) {
        this.variables = [];
      } else {
        var variableList = campaign.variables; // campaign.var ||
        variableList.forEach(function (variable) {
          _this.variables.push(VariableModel_1.VariableModel.modelFromDictionary(variable));
        });
      }
    }
    if (campaign.variations) {
      // campaign.v ||
      if (
      // (campaign.v && campaign.v.constructor === {}.constructor) ||
      campaign.variations.constructor === {}.constructor) {
        this.variations = [];
      } else {
        var variationList = campaign.variations; // campaign.v ||
        variationList.forEach(function (variation) {
          _this.variations.push(new VariationModel_1.VariationModel().modelFromDictionary(variation));
        });
      }
    }
    if (campaign.metrics) {
      // campaign.m ||
      if (campaign.metrics && campaign.metrics.constructor === {}.constructor) {
        this.metrics = [];
      } else {
        var metricsList = campaign.metrics || [];
        metricsList.forEach(function (metric) {
          _this.metrics.push(new MetricModel_1.MetricModel().modelFromDictionary(metric));
        });
      }
    }
  };
  CampaignModel.prototype.processCampaignKeys = function (campaign) {
    this.id = campaign.id;
    this.percentTraffic = campaign.percentTraffic; // campaign.pT ||
    this.name = campaign.name; // campaign.n ||
    this.variationId = campaign.variationId; // campaign.vId ||
    this.campaignId = campaign.campaignId; // campaign.cId ||
    this.ruleKey = campaign.ruleKey; // campaign.rK ||
    this.isForcedVariationEnabled = campaign.isForcedVariationEnabled; // campaign.iFVE ||
    this.isUserListEnabled = campaign.isUserListEnabled; // campaign.iULE ||
    this.segments = campaign.segments;
    this.key = campaign.key; // campaign.k ||
    // this.priority = campaign.pr || campaign.priority;
    this.type = campaign.type; // campaign.t ||
    this.salt = campaign.salt;
  };
  CampaignModel.prototype.getId = function () {
    return this.id;
  };
  CampaignModel.prototype.getName = function () {
    return this.name;
  };
  CampaignModel.prototype.getSegments = function () {
    return this.segments;
  };
  CampaignModel.prototype.getTraffic = function () {
    return this.percentTraffic;
  };
  CampaignModel.prototype.getType = function () {
    return this.type;
  };
  CampaignModel.prototype.getIsForcedVariationEnabled = function () {
    return this.isForcedVariationEnabled;
  };
  CampaignModel.prototype.getIsUserListEnabled = function () {
    return this.isUserListEnabled;
  };
  CampaignModel.prototype.getKey = function () {
    return this.key;
  };
  CampaignModel.prototype.getMetrics = function () {
    return this.metrics;
  };
  CampaignModel.prototype.getVariations = function () {
    return this.variations;
  };
  CampaignModel.prototype.getVariables = function () {
    return this.variables;
  };
  CampaignModel.prototype.getRuleKey = function () {
    return this.ruleKey;
  };
  CampaignModel.prototype.getSalt = function () {
    return this.salt;
  };
  return CampaignModel;
}();
exports.CampaignModel = CampaignModel;

/***/ }),

/***/ "./dist/server-unpacked/models/campaign/FeatureModel.js":
/*!**************************************************************!*\
  !*** ./dist/server-unpacked/models/campaign/FeatureModel.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FeatureModel = void 0;
var ImpactCampaignModel_1 = __webpack_require__(/*! ./ImpactCampaignModel */ "./dist/server-unpacked/models/campaign/ImpactCampaignModel.js");
var MetricModel_1 = __webpack_require__(/*! ./MetricModel */ "./dist/server-unpacked/models/campaign/MetricModel.js");
var RuleModel_1 = __webpack_require__(/*! ./RuleModel */ "./dist/server-unpacked/models/campaign/RuleModel.js");
var FeatureModel = /** @class */function () {
  function FeatureModel() {
    this.m = [];
    this.metrics = [];
    this.rules = [];
    this.impactCampaign = null;
    this.rulesLinkedCampaign = [];
    this.isGatewayServiceRequired = false;
  }
  FeatureModel.prototype.modelFromDictionary = function (feature) {
    var _this = this;
    var _a, _b, _c;
    this.id = feature.id;
    this.key = feature.key;
    this.name = feature.name;
    this.type = feature.type;
    if (feature === null || feature === void 0 ? void 0 : feature.isGatewayServiceRequired) {
      this.isGatewayServiceRequired = feature.isGatewayServiceRequired;
    }
    if (feature.impactCampaign) {
      this.impactCampaign = new ImpactCampaignModel_1.ImpactCapmaignModel().modelFromDictionary(feature.impactCampaign);
    }
    if (feature.m && feature.m.constructor === {}.constructor || ((_a = feature.metrics) === null || _a === void 0 ? void 0 : _a.constructor) === {}.constructor) {
      this.metrics = [];
    } else {
      var metricList = feature.m || feature.metrics;
      metricList === null || metricList === void 0 ? void 0 : metricList.forEach(function (metric) {
        _this.metrics.push(new MetricModel_1.MetricModel().modelFromDictionary(metric));
      });
    }
    if (((_b = feature === null || feature === void 0 ? void 0 : feature.rules) === null || _b === void 0 ? void 0 : _b.constructor) === {}.constructor) {
      this.rules = [];
    } else {
      var ruleList = feature.rules;
      ruleList === null || ruleList === void 0 ? void 0 : ruleList.forEach(function (rule) {
        _this.rules.push(new RuleModel_1.RuleModel().modelFromDictionary(rule));
      });
    }
    if ((feature === null || feature === void 0 ? void 0 : feature.rulesLinkedCampaign) && ((_c = feature.rulesLinkedCampaign) === null || _c === void 0 ? void 0 : _c.constructor) !== {}.constructor) {
      var linkedCampaignList = feature.rulesLinkedCampaign;
      this.rulesLinkedCampaign = linkedCampaignList;
    }
    return this;
  };
  FeatureModel.prototype.getName = function () {
    return this.name;
  };
  FeatureModel.prototype.getType = function () {
    return this.type;
  };
  FeatureModel.prototype.getId = function () {
    return this.id;
  };
  FeatureModel.prototype.getKey = function () {
    return this.key;
  };
  FeatureModel.prototype.getRules = function () {
    return this.rules;
  };
  FeatureModel.prototype.getImpactCampaign = function () {
    return this.impactCampaign;
  };
  FeatureModel.prototype.getRulesLinkedCampaign = function () {
    return this.rulesLinkedCampaign;
  };
  FeatureModel.prototype.setRulesLinkedCampaign = function (rulesLinkedCampaign) {
    this.rulesLinkedCampaign = rulesLinkedCampaign;
  };
  FeatureModel.prototype.getMetrics = function () {
    return this.metrics;
  };
  FeatureModel.prototype.getIsGatewayServiceRequired = function () {
    return this.isGatewayServiceRequired;
  };
  FeatureModel.prototype.setIsGatewayServiceRequired = function (isGatewayServiceRequired) {
    this.isGatewayServiceRequired = isGatewayServiceRequired;
  };
  return FeatureModel;
}();
exports.FeatureModel = FeatureModel;

/***/ }),

/***/ "./dist/server-unpacked/models/campaign/ImpactCampaignModel.js":
/*!*********************************************************************!*\
  !*** ./dist/server-unpacked/models/campaign/ImpactCampaignModel.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ImpactCapmaignModel = void 0;
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
var ImpactCapmaignModel = /** @class */function () {
  function ImpactCapmaignModel() {}
  ImpactCapmaignModel.prototype.modelFromDictionary = function (impactCampaign) {
    this.type = impactCampaign.type;
    this.campaignId = impactCampaign.campaignId;
    return this;
  };
  ImpactCapmaignModel.prototype.getCampaignId = function () {
    return this.campaignId;
  };
  ImpactCapmaignModel.prototype.getType = function () {
    return this.type;
  };
  return ImpactCapmaignModel;
}();
exports.ImpactCapmaignModel = ImpactCapmaignModel;

/***/ }),

/***/ "./dist/server-unpacked/models/campaign/MetricModel.js":
/*!*************************************************************!*\
  !*** ./dist/server-unpacked/models/campaign/MetricModel.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MetricModel = void 0;
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
var MetricModel = /** @class */function () {
  function MetricModel() {}
  MetricModel.prototype.modelFromDictionary = function (metric) {
    this.identifier = metric.identifier || metric.key;
    this.id = metric.i || metric.id;
    this.type = metric.t || metric.type;
    return this;
  };
  MetricModel.prototype.getId = function () {
    return this.id;
  };
  MetricModel.prototype.getIdentifier = function () {
    return this.identifier;
  };
  MetricModel.prototype.getType = function () {
    return this.type;
  };
  return MetricModel;
}();
exports.MetricModel = MetricModel;

/***/ }),

/***/ "./dist/server-unpacked/models/campaign/RuleModel.js":
/*!***********************************************************!*\
  !*** ./dist/server-unpacked/models/campaign/RuleModel.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RuleModel = void 0;
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
var RuleModel = /** @class */function () {
  function RuleModel() {}
  RuleModel.prototype.modelFromDictionary = function (rule) {
    this.type = rule.type;
    this.status = rule.status;
    this.variationId = rule.variationId;
    this.campaignId = rule.campaignId;
    this.ruleKey = rule.ruleKey;
    return this;
  };
  RuleModel.prototype.getCampaignId = function () {
    return this.campaignId;
  };
  RuleModel.prototype.getVariationId = function () {
    return this.variationId;
  };
  RuleModel.prototype.getStatus = function () {
    return this.status;
  };
  RuleModel.prototype.getType = function () {
    return this.type;
  };
  RuleModel.prototype.getRuleKey = function () {
    return this.ruleKey;
  };
  return RuleModel;
}();
exports.RuleModel = RuleModel;

/***/ }),

/***/ "./dist/server-unpacked/models/campaign/VariableModel.js":
/*!***************************************************************!*\
  !*** ./dist/server-unpacked/models/campaign/VariableModel.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VariableModel = void 0;
var VariableModel = /** @class */function () {
  function VariableModel(id, type, key, value) {
    this.value = value;
    this.type = type;
    this.key = key;
    this.id = id;
  }
  VariableModel.modelFromDictionary = function (variable) {
    var _a, _b, _c;
    return new VariableModel((_a = variable.i) !== null && _a !== void 0 ? _a : variable.id, variable.type, (_b = variable.k) !== null && _b !== void 0 ? _b : variable.key, (_c = variable.val) !== null && _c !== void 0 ? _c : variable.value);
  };
  VariableModel.prototype.setValue = function (value) {
    this.value = value;
  };
  VariableModel.prototype.setKey = function (key) {
    this.key = key;
  };
  VariableModel.prototype.setType = function (type) {
    this.type = type;
  };
  VariableModel.prototype.getId = function () {
    return this.id;
  };
  VariableModel.prototype.getValue = function () {
    return this.value;
  };
  VariableModel.prototype.getType = function () {
    return this.type;
  };
  VariableModel.prototype.getKey = function () {
    return this.key;
  };
  return VariableModel;
}();
exports.VariableModel = VariableModel;

/***/ }),

/***/ "./dist/server-unpacked/models/campaign/VariationModel.js":
/*!****************************************************************!*\
  !*** ./dist/server-unpacked/models/campaign/VariationModel.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VariationModel = void 0;
var VariableModel_1 = __webpack_require__(/*! ./VariableModel */ "./dist/server-unpacked/models/campaign/VariableModel.js");
var VariationModel = /** @class */function () {
  function VariationModel() {
    this.variables = [];
    this.variations = [];
  }
  VariationModel.prototype.modelFromDictionary = function (variation) {
    var _this = this;
    this.id = variation.i || variation.id;
    this.key = variation.n || variation.key || variation.name;
    this.weight = variation.w || variation.weight;
    this.ruleKey = variation.ruleKey;
    this.salt = variation.salt;
    this.type = variation.type;
    this.setStartRange(variation.startRangeVariation);
    this.setEndRange(variation.endRangeVariation);
    if (variation.seg || variation.segments) {
      this.segments = variation.seg || variation.segments;
    }
    if (variation.variables) {
      if (variation.variables.constructor === {}.constructor) {
        this.variables = [];
      } else {
        var variableList = variation.variables;
        variableList.forEach(function (variable) {
          _this.variables.push(VariableModel_1.VariableModel.modelFromDictionary(variable));
        });
      }
    }
    if (variation.variations) {
      if (variation.variations.constructor === {}.constructor) {
        this.variations = [];
      } else {
        var variationList = variation.variations;
        variationList.forEach(function (variation) {
          _this.variations.push(new VariationModel().modelFromDictionary(variation));
        });
      }
    }
    return this;
  };
  VariationModel.prototype.setStartRange = function (startRange) {
    this.startRangeVariation = startRange;
  };
  VariationModel.prototype.setEndRange = function (endRange) {
    this.endRangeVariation = endRange;
  };
  VariationModel.prototype.setWeight = function (weight) {
    this.weight = weight;
  };
  VariationModel.prototype.getId = function () {
    return this.id;
  };
  VariationModel.prototype.getKey = function () {
    return this.key;
  };
  VariationModel.prototype.getRuleKey = function () {
    return this.ruleKey;
  };
  VariationModel.prototype.getWeight = function () {
    return this.weight;
  };
  VariationModel.prototype.getSegments = function () {
    return this.segments;
  };
  VariationModel.prototype.getStartRangeVariation = function () {
    return this.startRangeVariation;
  };
  VariationModel.prototype.getEndRangeVariation = function () {
    return this.endRangeVariation;
  };
  VariationModel.prototype.getVariables = function () {
    return this.variables;
  };
  VariationModel.prototype.getVariations = function () {
    return this.variations;
  };
  VariationModel.prototype.getType = function () {
    return this.type;
  };
  VariationModel.prototype.getSalt = function () {
    return this.salt;
  };
  return VariationModel;
}();
exports.VariationModel = VariationModel;

/***/ }),

/***/ "./dist/server-unpacked/models/schemas/SettingsSchemaValidation.js":
/*!*************************************************************************!*\
  !*** ./dist/server-unpacked/models/schemas/SettingsSchemaValidation.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SettingsSchema = void 0;
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
var superstruct_1 = __webpack_require__(/*! superstruct */ "superstruct");
var SettingsSchema = /** @class */function () {
  function SettingsSchema() {
    this.initializeSchemas();
  }
  SettingsSchema.prototype.initializeSchemas = function () {
    this.campaignMetricSchema = (0, superstruct_1.object)({
      id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
      type: (0, superstruct_1.string)(),
      identifier: (0, superstruct_1.string)(),
      mca: (0, superstruct_1.optional)((0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()])),
      hasProps: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
      revenueProp: (0, superstruct_1.optional)((0, superstruct_1.string)())
    });
    this.variableObjectSchema = (0, superstruct_1.object)({
      id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
      type: (0, superstruct_1.string)(),
      key: (0, superstruct_1.string)(),
      value: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)(), (0, superstruct_1.boolean)(), (0, superstruct_1.object)()])
    });
    this.campaignVariationSchema = (0, superstruct_1.object)({
      id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
      name: (0, superstruct_1.string)(),
      weight: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
      segments: (0, superstruct_1.optional)((0, superstruct_1.object)()),
      variables: (0, superstruct_1.optional)((0, superstruct_1.array)(this.variableObjectSchema)),
      startRangeVariation: (0, superstruct_1.optional)((0, superstruct_1.number)()),
      endRangeVariation: (0, superstruct_1.optional)((0, superstruct_1.number)()),
      salt: (0, superstruct_1.optional)((0, superstruct_1.string)())
    });
    this.campaignObjectSchema = (0, superstruct_1.object)({
      id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
      type: (0, superstruct_1.string)(),
      key: (0, superstruct_1.string)(),
      percentTraffic: (0, superstruct_1.optional)((0, superstruct_1.number)()),
      status: (0, superstruct_1.string)(),
      variations: (0, superstruct_1.array)(this.campaignVariationSchema),
      segments: (0, superstruct_1.object)(),
      isForcedVariationEnabled: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
      isAlwaysCheckSegment: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
      name: (0, superstruct_1.string)(),
      salt: (0, superstruct_1.optional)((0, superstruct_1.string)())
    });
    this.ruleSchema = (0, superstruct_1.object)({
      type: (0, superstruct_1.string)(),
      ruleKey: (0, superstruct_1.string)(),
      campaignId: (0, superstruct_1.number)(),
      variationId: (0, superstruct_1.optional)((0, superstruct_1.number)())
    });
    this.featureSchema = (0, superstruct_1.object)({
      id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
      key: (0, superstruct_1.string)(),
      status: (0, superstruct_1.string)(),
      name: (0, superstruct_1.string)(),
      type: (0, superstruct_1.string)(),
      metrics: (0, superstruct_1.array)(this.campaignMetricSchema),
      impactCampaign: (0, superstruct_1.optional)((0, superstruct_1.object)()),
      rules: (0, superstruct_1.optional)((0, superstruct_1.array)(this.ruleSchema)),
      variables: (0, superstruct_1.optional)((0, superstruct_1.array)(this.variableObjectSchema))
    });
    this.settingsSchema = (0, superstruct_1.object)({
      sdkKey: (0, superstruct_1.optional)((0, superstruct_1.string)()),
      version: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
      accountId: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
      features: (0, superstruct_1.optional)((0, superstruct_1.array)(this.featureSchema)),
      campaigns: (0, superstruct_1.array)(this.campaignObjectSchema),
      groups: (0, superstruct_1.optional)((0, superstruct_1.object)()),
      campaignGroups: (0, superstruct_1.optional)((0, superstruct_1.object)()),
      collectionPrefix: (0, superstruct_1.optional)((0, superstruct_1.string)()),
      pollInterval: (0, superstruct_1.optional)((0, superstruct_1.number)())
    });
  };
  SettingsSchema.prototype.isSettingsValid = function (settings) {
    if (!settings) {
      return false;
    }
    var error = (0, superstruct_1.validate)(settings, this.settingsSchema)[0];
    return !error;
  };
  return SettingsSchema;
}();
exports.SettingsSchema = SettingsSchema;

/***/ }),

/***/ "./dist/server-unpacked/models/settings/SettingsModel.js":
/*!***************************************************************!*\
  !*** ./dist/server-unpacked/models/settings/SettingsModel.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SettingsModel = void 0;
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
var CampaignModel_1 = __webpack_require__(/*! ../campaign/CampaignModel */ "./dist/server-unpacked/models/campaign/CampaignModel.js");
var FeatureModel_1 = __webpack_require__(/*! ../campaign/FeatureModel */ "./dist/server-unpacked/models/campaign/FeatureModel.js");
var SettingsModel = /** @class */function () {
  function SettingsModel(settings) {
    var _this = this;
    this.f = [];
    this.features = [];
    this.c = [];
    this.campaigns = [];
    this.campaignGroups = {};
    this.cG = {};
    this.groups = {};
    this.g = {};
    this.sdkKey = settings.sK || settings.sdkKey;
    this.accountId = settings.a || settings.accountId;
    this.version = settings.v || settings.version;
    this.collectionPrefix = settings.collectionPrefix;
    if (settings.f && settings.f.constructor !== {}.constructor || settings.features && settings.features.constructor !== {}.constructor) {
      var featureList = settings.f || settings.features;
      featureList.forEach(function (feature) {
        _this.features.push(new FeatureModel_1.FeatureModel().modelFromDictionary(feature));
      });
    }
    if (settings.c && settings.c.constructor !== {}.constructor || settings.campaigns && settings.campaigns.constructor !== {}.constructor) {
      var campaignList = settings.c || settings.campaigns;
      campaignList.forEach(function (campaign) {
        _this.campaigns.push(new CampaignModel_1.CampaignModel().modelFromDictionary(campaign));
      });
    }
    if (settings.cG || settings.campaignGroups) {
      this.campaignGroups = settings.cG || settings.campaignGroups;
    }
    if (settings.g || settings.groups) {
      this.groups = settings.g || settings.groups;
    }
    if (settings.pollInterval) {
      this.pollInterval = settings.pollInterval;
    }
    return this;
  }
  SettingsModel.prototype.getFeatures = function () {
    return this.features;
  };
  SettingsModel.prototype.getCampaigns = function () {
    return this.campaigns;
  };
  SettingsModel.prototype.getSdkkey = function () {
    return this.sdkKey;
  };
  SettingsModel.prototype.getAccountId = function () {
    return this.accountId;
  };
  SettingsModel.prototype.getVersion = function () {
    return this.version;
  };
  SettingsModel.prototype.getCollectionPrefix = function () {
    return this.collectionPrefix;
  };
  SettingsModel.prototype.getCampaignGroups = function () {
    return this.campaignGroups;
  };
  SettingsModel.prototype.getGroups = function () {
    return this.groups;
  };
  SettingsModel.prototype.setPollInterval = function (value) {
    this.pollInterval = value;
  };
  SettingsModel.prototype.getPollInterval = function () {
    return this.pollInterval;
  };
  return SettingsModel;
}();
exports.SettingsModel = SettingsModel;

/***/ }),

/***/ "./dist/server-unpacked/models/user/ContextModel.js":
/*!**********************************************************!*\
  !*** ./dist/server-unpacked/models/user/ContextModel.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ContextModel = void 0;
var ContextVWOModel_1 = __webpack_require__(/*! ./ContextVWOModel */ "./dist/server-unpacked/models/user/ContextVWOModel.js");
var ContextModel = /** @class */function () {
  function ContextModel() {}
  ContextModel.prototype.modelFromDictionary = function (context) {
    this.id = context.id;
    this.userAgent = context.userAgent;
    this.ipAddress = context.ipAddress;
    // if sdk is running in js environment and userAgent is not given then we use navigator.userAgent
    // Check if sdk running in browser and not in edge/serverless environment
    if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined' && !context.userAgent) {
      this.userAgent = navigator.userAgent;
    }
    if (context === null || context === void 0 ? void 0 : context.customVariables) {
      this.customVariables = context.customVariables;
    }
    if (context === null || context === void 0 ? void 0 : context.variationTargetingVariables) {
      this.variationTargetingVariables = context.variationTargetingVariables;
    }
    if (context === null || context === void 0 ? void 0 : context._vwo) {
      this._vwo = new ContextVWOModel_1.ContextVWOModel().modelFromDictionary(context._vwo);
    }
    return this;
  };
  ContextModel.prototype.getId = function () {
    var _a;
    return (_a = this.id) === null || _a === void 0 ? void 0 : _a.toString();
  };
  ContextModel.prototype.getUserAgent = function () {
    return this.userAgent;
  };
  ContextModel.prototype.getIpAddress = function () {
    return this.ipAddress;
  };
  ContextModel.prototype.getCustomVariables = function () {
    return this.customVariables;
  };
  ContextModel.prototype.setCustomVariables = function (customVariables) {
    this.customVariables = customVariables;
  };
  ContextModel.prototype.getVariationTargetingVariables = function () {
    return this.variationTargetingVariables;
  };
  ContextModel.prototype.setVariationTargetingVariables = function (variationTargetingVariables) {
    this.variationTargetingVariables = variationTargetingVariables;
  };
  ContextModel.prototype.getVwo = function () {
    return this._vwo;
  };
  ContextModel.prototype.setVwo = function (_vwo) {
    this._vwo = _vwo;
  };
  return ContextModel;
}();
exports.ContextModel = ContextModel;

/***/ }),

/***/ "./dist/server-unpacked/models/user/ContextVWOModel.js":
/*!*************************************************************!*\
  !*** ./dist/server-unpacked/models/user/ContextVWOModel.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {



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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ContextVWOModel = void 0;
var ContextVWOModel = /** @class */function () {
  function ContextVWOModel() {}
  ContextVWOModel.prototype.modelFromDictionary = function (context) {
    if (context === null || context === void 0 ? void 0 : context.location) {
      this.location = context.location;
    }
    if (context === null || context === void 0 ? void 0 : context.userAgent) {
      this.userAgent = context.userAgent;
    }
    return this;
  };
  ContextVWOModel.prototype.getLocation = function () {
    return this.location;
  };
  ContextVWOModel.prototype.getUaInfo = function () {
    return this.userAgent;
  };
  return ContextVWOModel;
}();
exports.ContextVWOModel = ContextVWOModel;

/***/ }),

/***/ "./dist/server-unpacked/packages/decision-maker/index.js":
/*!***************************************************************!*\
  !*** ./dist/server-unpacked/packages/decision-maker/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.DecisionMaker = void 0;
var Hasher = __webpack_require__(/*! murmurhash */ "murmurhash");
var SEED_VALUE = 1; // Seed value for the hash function
var DecisionMaker = /** @class */function () {
  function DecisionMaker() {}
  /**
   * Generates a bucket value based on the hash value, maximum value, and an optional multiplier.
   *
   * @param {number} hashValue - The hash value used for calculation
   * @param {number} maxValue - The maximum value for bucket scaling
   * @param {number} [multiplier=1] - Optional multiplier to adjust the value
   * @returns {number} - The calculated bucket value
   */
  DecisionMaker.prototype.generateBucketValue = function (hashValue, maxValue, multiplier) {
    if (multiplier === void 0) {
      multiplier = 1;
    }
    // Calculate the ratio based on the hash value
    var ratio = hashValue / Math.pow(2, 32);
    // Calculate the multiplied value
    var multipliedValue = (maxValue * ratio + 1) * multiplier;
    // Round down to get the final value
    var value = Math.floor(multipliedValue);
    return value;
  };
  /**
   * Gets the bucket value for a user based on the hash key and maximum value.
   *
   * @param {string} hashKey - The hash key for the user
   * @param {number} [maxValue=100] - The maximum value for bucket scaling
   * @returns {number} - The calculated bucket value for the user
   */
  DecisionMaker.prototype.getBucketValueForUser = function (hashKey, maxValue) {
    if (maxValue === void 0) {
      maxValue = 100;
    }
    var hashValue = Hasher.v3(hashKey, SEED_VALUE); // Calculate the hash value
    var bucketValue = this.generateBucketValue(hashValue, maxValue); // Calculate the bucket value
    return bucketValue; // Return the calculated bucket value
  };
  /**
   * Calculates the bucket value for a given string with optional multiplier and maximum value.
   *
   * @param {string} str - The input string to calculate the bucket value for
   * @param {number} [multiplier=1] - Optional multiplier to adjust the value
   * @param {number} [maxValue=10000] - The maximum value for bucket scaling
   * @returns {number} - The calculated bucket value
   */
  DecisionMaker.prototype.calculateBucketValue = function (str, multiplier, maxValue) {
    if (multiplier === void 0) {
      multiplier = 1;
    }
    if (maxValue === void 0) {
      maxValue = 10000;
    }
    var hashValue = this.generateHashValue(str); // Generate the hash value for the input string
    return this.generateBucketValue(hashValue, maxValue, multiplier); // Generate and return the bucket value
  };
  /**
   * Generates the hash value for a given hash key using murmurHash v3.
   *
   * @param {string} hashKey - The hash key for which the hash value is generated
   * @returns {number} - The generated hash value
   */
  DecisionMaker.prototype.generateHashValue = function (hashKey) {
    return Hasher.v3(hashKey, SEED_VALUE); // Return the hash value generated using murmurHash
  };
  return DecisionMaker;
}();
exports.DecisionMaker = DecisionMaker;

/***/ }),

/***/ "./dist/server-unpacked/packages/logger/LogMessageBuilder.js":
/*!*******************************************************************!*\
  !*** ./dist/server-unpacked/packages/logger/LogMessageBuilder.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LogMessageBuilder = void 0;
var LogLevelEnum_1 = __webpack_require__(/*! ./enums/LogLevelEnum */ "./dist/server-unpacked/packages/logger/enums/LogLevelEnum.js");
var AnsiColorEnum = {
  BOLD: '\x1b[1m',
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  LIGHTBLUE: '\x1b[94m',
  RED: '\x1b[31m',
  RESET: '\x1b[0m',
  WHITE: '\x1b[30m',
  YELLOW: '\x1b[33m'
};
/**
 * Implements the ILogMessageBuilder interface to provide a concrete log message builder.
 */
var LogMessageBuilder = /** @class */function () {
  /**
   * Constructs a new LogMessageBuilder instance.
   * @param {Record<string, any>} loggerConfig - Configuration for the logger.
   * @param {Record<string, any>} transportConfig - Configuration for the transport mechanism.
   */
  function LogMessageBuilder(loggerConfig, transportConfig) {
    this.loggerConfig = loggerConfig;
    this.transportConfig = transportConfig;
    // Set the prefix, defaulting to an empty string if not provided.
    this.prefix = this.transportConfig.prefix || this.loggerConfig.prefix || '';
    // Set the date and time format, defaulting to the logger's format if the transport's format is not provided.
    this.dateTimeFormat = this.transportConfig.dateTimeFormat || this.loggerConfig.dateTimeFormat;
  }
  /**
   * Formats a log message combining level, prefix, date/time, and the actual message.
   * @param {string} level - The log level.
   * @param {string} message - The message to log.
   * @returns {string} The formatted log message.
   */
  LogMessageBuilder.prototype.formatMessage = function (level, message) {
    return "[".concat(this.getFormattedLevel(level), "]: ").concat(this.getFormattedPrefix(this.prefix), " ").concat(this.getFormattedDateTime(), " ").concat(message);
  };
  LogMessageBuilder.prototype.getFormattedPrefix = function (prefix) {
    if (this.loggerConfig.isAnsiColorEnabled) {
      return "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.GREEN).concat(prefix).concat(AnsiColorEnum.RESET);
    }
    return "".concat(prefix);
  };
  /**
   * Returns the formatted log level with appropriate coloring based on the log level.
   * @param {string} level - The log level.
   * @returns {string} The formatted log level.
   */
  LogMessageBuilder.prototype.getFormattedLevel = function (level) {
    var _a, _b;
    var upperCaseLevel = level.toUpperCase();
    var LogLevelColorInfoEnum;
    if (this.loggerConfig.isAnsiColorEnabled) {
      LogLevelColorInfoEnum = (_a = {}, _a[LogLevelEnum_1.LogLevelEnum.TRACE] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.WHITE).concat(upperCaseLevel).concat(AnsiColorEnum.RESET), _a[LogLevelEnum_1.LogLevelEnum.DEBUG] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.LIGHTBLUE).concat(upperCaseLevel).concat(AnsiColorEnum.RESET), _a[LogLevelEnum_1.LogLevelEnum.INFO] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.CYAN).concat(upperCaseLevel).concat(AnsiColorEnum.RESET), _a[LogLevelEnum_1.LogLevelEnum.WARN] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.YELLOW).concat(upperCaseLevel).concat(AnsiColorEnum.RESET), _a[LogLevelEnum_1.LogLevelEnum.ERROR] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.RED).concat(upperCaseLevel).concat(AnsiColorEnum.RESET), _a);
    } else {
      LogLevelColorInfoEnum = (_b = {}, _b[LogLevelEnum_1.LogLevelEnum.TRACE] = upperCaseLevel, _b[LogLevelEnum_1.LogLevelEnum.DEBUG] = upperCaseLevel, _b[LogLevelEnum_1.LogLevelEnum.INFO] = upperCaseLevel, _b[LogLevelEnum_1.LogLevelEnum.WARN] = upperCaseLevel, _b[LogLevelEnum_1.LogLevelEnum.ERROR] = upperCaseLevel, _b);
    }
    return LogLevelColorInfoEnum[level];
  };
  /**
   * Retrieves the current date and time formatted according to the specified format.
   * @returns {string} The formatted date and time.
   */
  LogMessageBuilder.prototype.getFormattedDateTime = function () {
    return this.dateTimeFormat();
  };
  return LogMessageBuilder;
}();
exports.LogMessageBuilder = LogMessageBuilder;

/***/ }),

/***/ "./dist/server-unpacked/packages/logger/Logger.js":
/*!********************************************************!*\
  !*** ./dist/server-unpacked/packages/logger/Logger.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Logger = void 0;
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
/**
 * Abstract class representing a logger.
 * This class provides the structure for logging mechanisms and should be extended by specific logger implementations.
 */
var Logger = /** @class */function () {
  function Logger() {}
  return Logger;
}();
exports.Logger = Logger;

/***/ }),

/***/ "./dist/server-unpacked/packages/logger/core/LogManager.js":
/*!*****************************************************************!*\
  !*** ./dist/server-unpacked/packages/logger/core/LogManager.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



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
var __extends = this && this.__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LogManager = void 0;
var uuid_1 = __webpack_require__(/*! uuid */ "uuid");
var Logger_1 = __webpack_require__(/*! ../Logger */ "./dist/server-unpacked/packages/logger/Logger.js");
var ConsoleTransport_1 = __webpack_require__(/*! ../transports/ConsoleTransport */ "./dist/server-unpacked/packages/logger/transports/ConsoleTransport.js");
var TransportManager_1 = __webpack_require__(/*! ./TransportManager */ "./dist/server-unpacked/packages/logger/core/TransportManager.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var LogLevelEnum_1 = __webpack_require__(/*! ../enums/LogLevelEnum */ "./dist/server-unpacked/packages/logger/enums/LogLevelEnum.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../../../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
/**
 * LogManager class provides logging functionality with support for multiple transports.
 * It is designed as a singleton to ensure a single instance throughout the application.
 */
var LogManager = /** @class */function (_super) {
  __extends(LogManager, _super);
  /**
   * Constructor for LogManager.
   * @param {Record<string, any>} config - Configuration object for LogManager.
   */
  function LogManager(config) {
    var _this = _super.call(this) || this;
    _this.name = 'VWO Logger'; // Default logger name
    _this.requestId = (0, uuid_1.v4)(); // Unique request ID generated for each instance
    _this.level = LogLevelEnum_1.LogLevelEnum.ERROR; // Default logging level
    _this.prefix = 'VWO-SDK'; // Default prefix for log messages
    _this.config = config;
    if (config.isAlwaysNewInstance || !LogManager.instance) {
      LogManager.instance = _this;
      // Initialize configuration with defaults or provided values
      _this.config.name = config.name || _this.name;
      _this.config.requestId = config.requestId || _this.requestId;
      _this.config.level = config.level || _this.level;
      _this.config.prefix = config.prefix || _this.prefix;
      _this.config.dateTimeFormat = config.dateTimeFormat || _this.dateTimeFormat;
      _this.transportManager = new TransportManager_1.LogTransportManager(_this.config);
      _this.handleTransports();
    }
    return LogManager.instance;
  }
  LogManager.prototype.dateTimeFormat = function () {
    return new Date().toISOString(); // Default date-time format for log messages
  };
  Object.defineProperty(LogManager, "Instance", {
    /**
     * Provides access to the singleton instance of LogManager.
     * @returns {LogManager} The singleton instance.
     */
    get: function () {
      return LogManager.instance;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Handles the initialization and setup of transports based on configuration.
   */
  LogManager.prototype.handleTransports = function () {
    var transports = this.config.transports;
    if (transports === null || transports === void 0 ? void 0 : transports.length) {
      this.addTransports(this.config.transports);
    } else if (this.config.transport && (0, DataTypeUtil_1.isObject)(this.config.transport)) {
      this.addTransport(this.config.transport);
    } else {
      // if (this.config.defaultTransport)
      // Add default ConsoleTransport if no other transport is specified
      this.addTransport(new ConsoleTransport_1.ConsoleTransport({
        level: this.config.level
      }));
    }
  };
  /**
   * Adds a single transport to the LogManager.
   * @param {Record<any, any>} transport - The transport object to add.
   */
  LogManager.prototype.addTransport = function (transport) {
    this.transportManager.addTransport(transport);
  };
  /**
   * Adds multiple transports to the LogManager.
   * @param {Array<Record<any, any>>} transports - The list of transport objects to add.
   */
  LogManager.prototype.addTransports = function (transports) {
    for (var i = 0; i < transports.length; i++) {
      this.addTransport(transports[i]);
    }
  };
  /**
   * Logs a trace message.
   * @param {string} message - The message to log at trace level.
   */
  LogManager.prototype.trace = function (message) {
    this.transportManager.log(LogLevelEnum_1.LogLevelEnum.TRACE, message);
  };
  /**
   * Logs a debug message.
   * @param {string} message - The message to log at debug level.
   */
  LogManager.prototype.debug = function (message) {
    this.transportManager.log(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
  };
  /**
   * Logs an informational message.
   * @param {string} message - The message to log at info level.
   */
  LogManager.prototype.info = function (message) {
    this.transportManager.log(LogLevelEnum_1.LogLevelEnum.INFO, message);
  };
  /**
   * Logs a warning message.
   * @param {string} message - The message to log at warn level.
   */
  LogManager.prototype.warn = function (message) {
    this.transportManager.log(LogLevelEnum_1.LogLevelEnum.WARN, message);
  };
  /**
   * Logs an error message.
   * @param {string} message - The message to log at error level.
   */
  LogManager.prototype.error = function (message, shouldSendToVWO) {
    if (shouldSendToVWO === void 0) {
      shouldSendToVWO = true;
    }
    this.transportManager.log(LogLevelEnum_1.LogLevelEnum.ERROR, message);
    if (shouldSendToVWO) {
      (0, LogMessageUtil_1.sendLogToVWO)(message, LogLevelEnum_1.LogLevelEnum.ERROR);
    }
  };
  return LogManager;
}(Logger_1.Logger);
exports.LogManager = LogManager;

/***/ }),

/***/ "./dist/server-unpacked/packages/logger/core/TransportManager.js":
/*!***********************************************************************!*\
  !*** ./dist/server-unpacked/packages/logger/core/TransportManager.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LogTransportManager = exports.LogLevelNumberEnum = void 0;
var LogLevelEnum_1 = __webpack_require__(/*! ../enums/LogLevelEnum */ "./dist/server-unpacked/packages/logger/enums/LogLevelEnum.js");
var LogMessageBuilder_1 = __webpack_require__(/*! ../LogMessageBuilder */ "./dist/server-unpacked/packages/logger/LogMessageBuilder.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var LogLevelNumberEnum;
(function (LogLevelNumberEnum) {
  LogLevelNumberEnum[LogLevelNumberEnum["TRACE"] = 0] = "TRACE";
  LogLevelNumberEnum[LogLevelNumberEnum["DEBUG"] = 1] = "DEBUG";
  LogLevelNumberEnum[LogLevelNumberEnum["INFO"] = 2] = "INFO";
  LogLevelNumberEnum[LogLevelNumberEnum["WARN"] = 3] = "WARN";
  LogLevelNumberEnum[LogLevelNumberEnum["ERROR"] = 4] = "ERROR";
})(LogLevelNumberEnum || (exports.LogLevelNumberEnum = LogLevelNumberEnum = {}));
/**
 * Manages logging transports and delegates logging messages to them based on configuration.
 * Implements the IlogTransport interface.
 */
var LogTransportManager = /** @class */function () {
  /**
   * Initializes the manager with a configuration object.
   * @param {Record<string, any>} config - Configuration settings for the log manager.
   */
  function LogTransportManager(config) {
    this.transports = [];
    this.config = config;
  }
  /**
   * Adds a new transport to the manager.
   * @param {Record<string, any>} transport - The transport object to be added.
   */
  LogTransportManager.prototype.addTransport = function (transport) {
    this.transports.push(transport);
  };
  /**
   * Determines if the log should be processed based on the transport and configuration levels.
   * @param {string} transportLevel - The log level set for the transport.
   * @param {string} configLevel - The log level set in the configuration.
   * @returns {boolean} - Returns true if the log level is appropriate for logging, false otherwise.
   */
  LogTransportManager.prototype.shouldLog = function (transportLevel, configLevel) {
    // Default to the most specific level available
    // transportLevel = transportLevel || configLevel || this.config.level;
    var targetLevel = LogLevelNumberEnum[transportLevel.toUpperCase()];
    var desiredLevel = LogLevelNumberEnum[(configLevel || this.config.level).toUpperCase()];
    return targetLevel >= desiredLevel;
  };
  /**
   * Logs a message at TRACE level.
   * @param {string} message - The message to log.
   */
  LogTransportManager.prototype.trace = function (message) {
    this.log(LogLevelEnum_1.LogLevelEnum.TRACE, message);
  };
  /**
   * Logs a message at DEBUG level.
   * @param {string} message - The message to log.
   */
  LogTransportManager.prototype.debug = function (message) {
    this.log(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
  };
  /**
   * Logs a message at INFO level.
   * @param {string} message - The message to log.
   */
  LogTransportManager.prototype.info = function (message) {
    this.log(LogLevelEnum_1.LogLevelEnum.INFO, message);
  };
  /**
   * Logs a message at WARN level.
   * @param {string} message - The message to log.
   */
  LogTransportManager.prototype.warn = function (message) {
    this.log(LogLevelEnum_1.LogLevelEnum.WARN, message);
  };
  /**
   * Logs a message at ERROR level.
   * @param {string} message - The message to log.
   */
  LogTransportManager.prototype.error = function (message) {
    this.log(LogLevelEnum_1.LogLevelEnum.ERROR, message);
  };
  /**
   * Delegates the logging of messages to the appropriate transports.
   * @param {string} level - The level at which to log the message.
   * @param {string} message - The message to log.
   */
  LogTransportManager.prototype.log = function (level, message) {
    for (var i = 0; i < this.transports.length; i++) {
      var logMessageBuilder = new LogMessageBuilder_1.LogMessageBuilder(this.config, this.transports[i]);
      var formattedMessage = logMessageBuilder.formatMessage(level, message);
      if (this.shouldLog(level, this.transports[i].level)) {
        if (this.transports[i].log && (0, DataTypeUtil_1.isFunction)(this.transports[i].log)) {
          // Use custom log handler if available
          this.transports[i].log(level, message);
        } else {
          // Otherwise, use the default log method
          this.transports[i][level](formattedMessage);
        }
      }
    }
  };
  return LogTransportManager;
}();
exports.LogTransportManager = LogTransportManager;

/***/ }),

/***/ "./dist/server-unpacked/packages/logger/enums/LogLevelEnum.js":
/*!********************************************************************!*\
  !*** ./dist/server-unpacked/packages/logger/enums/LogLevelEnum.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {



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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LogLevelEnum = void 0;
var LogLevelEnum;
(function (LogLevelEnum) {
  LogLevelEnum["TRACE"] = "trace";
  LogLevelEnum["DEBUG"] = "debug";
  LogLevelEnum["INFO"] = "info";
  LogLevelEnum["WARN"] = "warn";
  LogLevelEnum["ERROR"] = "error";
})(LogLevelEnum || (exports.LogLevelEnum = LogLevelEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/packages/logger/index.js":
/*!*******************************************************!*\
  !*** ./dist/server-unpacked/packages/logger/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LogLevelEnum = exports.LogManager = void 0;
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
var LogManager_1 = __webpack_require__(/*! ./core/LogManager */ "./dist/server-unpacked/packages/logger/core/LogManager.js");
Object.defineProperty(exports, "LogManager", ({
  enumerable: true,
  get: function () {
    return LogManager_1.LogManager;
  }
}));
var LogLevelEnum_1 = __webpack_require__(/*! ./enums/LogLevelEnum */ "./dist/server-unpacked/packages/logger/enums/LogLevelEnum.js");
Object.defineProperty(exports, "LogLevelEnum", ({
  enumerable: true,
  get: function () {
    return LogLevelEnum_1.LogLevelEnum;
  }
}));

/***/ }),

/***/ "./dist/server-unpacked/packages/logger/transports/ConsoleTransport.js":
/*!*****************************************************************************!*\
  !*** ./dist/server-unpacked/packages/logger/transports/ConsoleTransport.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ConsoleTransport = void 0;
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
var LogLevelEnum_1 = __webpack_require__(/*! ../enums/LogLevelEnum */ "./dist/server-unpacked/packages/logger/enums/LogLevelEnum.js");
/**
 * ConsoleTransport class implements the Logger interface to provide logging functionality.
 * It outputs logs to the console based on the log level set in the configuration.
 */
var ConsoleTransport = /** @class */function () {
  /**
   * Constructor initializes the ConsoleTransport with a configuration object.
   * @param {Record<string, any>} config - Configuration settings for the logger, including 'level'.
   */
  function ConsoleTransport(config) {
    if (config === void 0) {
      config = {};
    }
    this.config = config; // Store the configuration
    this.level = this.config.level; // Set the logging level from the configuration
  }
  /**
   * Logs a trace message.
   * @param {string} message - The message to log.
   */
  ConsoleTransport.prototype.trace = function (message) {
    this.consoleLog(LogLevelEnum_1.LogLevelEnum.TRACE, message);
  };
  /**
   * Logs a debug message.
   * @param {string} message - The message to log.
   */
  ConsoleTransport.prototype.debug = function (message) {
    this.consoleLog(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
  };
  /**
   * Logs an informational message.
   * @param {string} message - The message to log.
   */
  ConsoleTransport.prototype.info = function (message) {
    this.consoleLog(LogLevelEnum_1.LogLevelEnum.INFO, message);
  };
  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   */
  ConsoleTransport.prototype.warn = function (message) {
    this.consoleLog(LogLevelEnum_1.LogLevelEnum.WARN, message);
  };
  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   */
  ConsoleTransport.prototype.error = function (message) {
    this.consoleLog(LogLevelEnum_1.LogLevelEnum.ERROR, message);
  };
  /**
   * Generic log function that logs messages to the console based on the log level.
   * @param {string} level - The log level under which the message should be logged.
   * @param {string} message - The message to log.
   */
  ConsoleTransport.prototype.consoleLog = function (level, message) {
    console[level](message); // Use console's logging function dynamically based on the level
  };
  return ConsoleTransport;
}();
exports.ConsoleTransport = ConsoleTransport;

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/client/NetworkBrowserClient.js":
/*!************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/client/NetworkBrowserClient.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NetworkBrowserClient = void 0;
exports.setProxyUrl = setProxyUrl;
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
var XMLUtil_1 = __webpack_require__(/*! ../../../utils/XMLUtil */ "./dist/server-unpacked/utils/XMLUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var ResponseModel_1 = __webpack_require__(/*! ../models/ResponseModel */ "./dist/server-unpacked/packages/network-layer/models/ResponseModel.js");
var logger_1 = __webpack_require__(/*! ../../logger */ "./dist/server-unpacked/packages/logger/index.js");
var log_messages_1 = __webpack_require__(/*! ../../../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../../../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
/**
 * Proxy URL for browser network calls.
 * This allows all network requests to be redirected through a proxy server.
 */
var proxyUrl = undefined;
/**
 * Sets the proxy URL for all browser network calls.
 * This function is called from VWOBuilder when proxyUrl is provided in options.
 *
 * @param {string} proxyUrl - The proxy URL to use for all network requests
 */
function setProxyUrl(proxyUrlPassedInInit) {
  if (proxyUrlPassedInInit) {
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.PROXY_URL_SET));
  }
  proxyUrl = proxyUrlPassedInInit;
}
/**
 * Rewrites the original URL to use the proxy server while preserving the path and query parameters.
 *
 * Example:
 * - Original URL: https://api.vwo.com/settings/123?param=value
 * - Proxy URL: https://my-proxy.com
 * - Result: https://my-proxy.com/settings/123?param=value
 *
 * @param {string} originalUrl - The original URL to be rewritten
 * @returns {string} The rewritten URL using the proxy, or the original URL if no proxy is set
 */
function rewriteUrlWithProxy(originalUrl) {
  if (!proxyUrl) return originalUrl;
  try {
    var original = new URL(originalUrl);
    var proxy = new URL(proxyUrl);
    proxy.pathname = original.pathname;
    proxy.search = original.search;
    return proxy.toString();
  } catch (_a) {
    return originalUrl;
  }
}
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkBrowserClient = /** @class */function () {
  function NetworkBrowserClient() {}
  /**
   * Performs a GET request using the provided RequestModel.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
   */
  NetworkBrowserClient.prototype.GET = function (requestModel) {
    var deferred = new PromiseUtil_1.Deferred();
    // Extract network options from the request model.
    var networkOptions = requestModel.getOptions();
    var responseModel = new ResponseModel_1.ResponseModel();
    // PROXY URL REWRITING: If proxy is set, rewrite the URL to route through the proxy
    // This affects ALL network calls in browser environment (settings, tracking, etc.)
    if (networkOptions.scheme && networkOptions.hostname && networkOptions.path) {
      var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
      if (networkOptions.port) {
        url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
      }
      networkOptions.url = rewriteUrlWithProxy(url);
    }
    (0, XMLUtil_1.sendGetCall)({
      networkOptions: networkOptions,
      successCallback: function (data) {
        responseModel.setData(data);
        deferred.resolve(responseModel);
      },
      errorCallback: function (error) {
        responseModel.setError(error);
        deferred.reject(responseModel);
      }
    });
    /*try {
      fetch(url)
          .then(res => {
            // Some endpoints return empty strings as the response body; treat
            // as raw text and handle potential JSON parsing errors below
            return res.text().then(text => {
              let jsonData = {};
              try {
                jsonData = JSON.parse(text);
              } catch (err) {
                console.info(
                  `VWO-SDK - [INFO]: VWO didn't send JSON response which is expected: ${err}`
                );
              }
                   if (res.status === 200) {
                responseModel.setData(jsonData);
                deferred.resolve(responseModel);
              } else {
                let error = `VWO-SDK - [ERROR]: Request failed for fetching account settings. Got Status Code: ${
                  res.status
                }`;
                     responseModel.setError(error);
                deferred.reject(responseModel);
              }
            });
          })
          .catch(err => {
            responseModel.setError(err);
            deferred.reject(responseModel);
          });
    } catch (err) {
      responseModel.setError(err);
      deferred.reject(responseModel);
    } */
    return deferred.promise;
  };
  /**
   * Performs a POST request using the provided RequestModel.
   * @param {RequestModel} request - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  NetworkBrowserClient.prototype.POST = function (request) {
    var deferred = new PromiseUtil_1.Deferred();
    var networkOptions = request.getOptions();
    var responseModel = new ResponseModel_1.ResponseModel();
    // PROXY URL REWRITING: If proxy is set, rewrite the URL to route through the proxy
    // This affects ALL network calls in browser environment (settings, tracking, etc.)
    if (networkOptions.scheme && networkOptions.hostname && networkOptions.path) {
      var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
      if (networkOptions.port) {
        url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
      }
      networkOptions.url = rewriteUrlWithProxy(url);
    }
    (0, XMLUtil_1.sendPostCall)({
      networkOptions: networkOptions,
      successCallback: function (data) {
        responseModel.setStatusCode(200);
        responseModel.setData(data);
        deferred.resolve(responseModel);
      },
      errorCallback: function (error) {
        responseModel.setStatusCode(400);
        responseModel.setError(error);
        deferred.reject(responseModel);
      }
    });
    /* try {
      const options: any = Object.assign(
        {},
        { method: HttpMethodEnum.POST },
        { body: networkOptions.body },
        { headers: networkOptions.headers }
      );
           fetch(url, options)
          .then(res => {
            // Some endpoints return empty strings as the response body; treat
            // as raw text and handle potential JSON parsing errors below
            return res.text().then(text => {
              let jsonData = {};
              try {
                jsonData = JSON.parse(text);
              } catch (err) {
                console.info(
                  `VWO-SDK - [INFO]: VWO didn't send JSON response which is expected: ${err}`
                );
              }
                   if (res.status === 200) {
                responseModel.setData(jsonData);
                deferred.resolve(responseModel);
              } else {
                let error = `VWO-SDK - [ERROR]: Request failed for fetching account settings. Got Status Code: ${
                  res.status
                }`;
                     responseModel.setError(error);
                deferred.reject(responseModel);
              }
            });
          })
          .catch(err => {
            responseModel.setError(err);
            deferred.reject(responseModel);
          });
    } catch (err) {
      responseModel.setError(err);
      deferred.reject(responseModel);
    } */
    return deferred.promise;
  };
  return NetworkBrowserClient;
}();
exports.NetworkBrowserClient = NetworkBrowserClient;

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/client/NetworkClient.js":
/*!*****************************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/client/NetworkClient.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NetworkClient = void 0;
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
var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var Url_1 = __webpack_require__(/*! ../../../constants/Url */ "./dist/server-unpacked/constants/Url.js");
var ResponseModel_1 = __webpack_require__(/*! ../models/ResponseModel */ "./dist/server-unpacked/packages/network-layer/models/ResponseModel.js");
var logger_1 = __webpack_require__(/*! ../../../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../../../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var log_messages_1 = __webpack_require__(/*! ../../../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var EventEnum_1 = __webpack_require__(/*! ../../../enums/EventEnum */ "./dist/server-unpacked/enums/EventEnum.js");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkClient = /** @class */function () {
  function NetworkClient() {}
  /**
   * Performs a GET request using the provided RequestModel.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
   */
  NetworkClient.prototype.GET = function (requestModel) {
    var _this = this;
    var attemptRequest = function (attempt) {
      var deferred = new PromiseUtil_1.Deferred();
      // Extract network options from the request model.
      var networkOptions = requestModel.getOptions();
      var responseModel = new ResponseModel_1.ResponseModel();
      try {
        // Choose HTTP or HTTPS client based on the scheme.
        var httpClient = networkOptions.scheme === Url_1.HTTPS ? https : http;
        // Perform the HTTP GET request.
        var req = httpClient.get(networkOptions, function (res) {
          responseModel.setStatusCode(res.statusCode);
          var contentType = res.headers['content-type'];
          var error;
          var rawData = '';
          // Check for expected content-type.
          if (!/^application\/json/.test(contentType)) {
            error = "Invalid content-type.\nExpected application/json but received ".concat(contentType, ". Status Code: ").concat(res === null || res === void 0 ? void 0 : res.statusCode);
          }
          if (error) {
            // Log error and consume response data to free up memory.
            res.resume();
            return _this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, requestModel.getRetryConfig());
          }
          res.setEncoding('utf8');
          // Collect data chunks.
          res.on('data', function (chunk) {
            rawData += chunk;
          });
          // Handle the end of the response.
          res.on('end', function () {
            try {
              var parsedData = JSON.parse(rawData);
              // Check for successful response status.
              if (responseModel.getStatusCode() < 200 || responseModel.getStatusCode() >= 300) {
                var error_1 = "".concat(rawData, ", Status Code: ").concat(responseModel.getStatusCode());
                // if status code is 400, reject the promise as it is a bad request
                if (responseModel.getStatusCode() === 400) {
                  responseModel.setError(error_1);
                  deferred.reject(responseModel);
                  return;
                }
                return _this.retryOrReject(error_1, attempt, deferred, networkOptions, attemptRequest, requestModel.getRetryConfig());
              }
              responseModel.setData(parsedData);
              deferred.resolve(responseModel);
            } catch (err) {
              return _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel.getRetryConfig());
            }
          });
        });
        // Handle request timeout.
        req.on('timeout', function () {
          return _this.retryOrReject(new Error('timeout'), attempt, deferred, networkOptions, attemptRequest, requestModel.getRetryConfig());
        });
        req.on('error', function (err) {
          return _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel.getRetryConfig());
        });
      } catch (err) {
        _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, requestModel.getRetryConfig());
      }
      return deferred.promise;
    };
    return attemptRequest(0);
  };
  /**
   * Performs a POST request using the provided RequestModel.
   * @param {RequestModel} request - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  NetworkClient.prototype.POST = function (request) {
    var _this = this;
    var attemptRequest = function (attempt) {
      var deferred = new PromiseUtil_1.Deferred();
      var networkOptions = request.getOptions();
      var responseModel = new ResponseModel_1.ResponseModel();
      try {
        // Choose HTTP or HTTPS client based on the scheme.
        var httpClient = networkOptions.scheme === Url_1.HTTPS ? https : http;
        // Perform the HTTP POST request.
        var req = httpClient.request(networkOptions, function (res) {
          var rawData = '';
          res.setEncoding('utf8');
          // Collect data chunks.
          res.on('data', function (chunk) {
            rawData += chunk;
          });
          // Handle the end of the response.
          res.on('end', function () {
            try {
              if (res.statusCode === 200) {
                responseModel.setStatusCode(res.statusCode);
                responseModel.setData(request.getBody());
                deferred.resolve(responseModel);
              } else {
                var error = "Raw Data: ".concat(rawData, ", Status Code: ").concat(res.statusCode);
                responseModel.setStatusCode(res.statusCode);
                // if status code is 400, reject the promise as it is a bad request
                if (res.statusCode === 400) {
                  responseModel.setError(error);
                  deferred.reject(responseModel);
                  return;
                }
                return _this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, request.getRetryConfig());
              }
            } catch (err) {
              return _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request.getRetryConfig());
            }
          });
        });
        // Handle request timeout.
        req.on('timeout', function () {
          var error = "Timeout: ".concat(networkOptions.timeout);
          return _this.retryOrReject(error, attempt, deferred, networkOptions, attemptRequest, request.getRetryConfig());
        });
        req.on('error', function (err) {
          return _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request.getRetryConfig());
        });
        // Write data to the request body and end the request.
        req.write(JSON.stringify(networkOptions.body));
        req.end();
      } catch (err) {
        _this.retryOrReject(err, attempt, deferred, networkOptions, attemptRequest, request.getRetryConfig());
      }
      return deferred.promise;
    };
    return attemptRequest(0);
  };
  /**
   * Helper function to retry or reject
   * @param {any} error - The error to retry or reject
   * @param {number} attempt - The attempt number
   * @param {any} deferred - The deferred object
   * @param {string} operation - The operation to retry or reject
   * @param {Function} attemptRequest - The function to attempt the request
   */
  NetworkClient.prototype.retryOrReject = function (error, attempt, deferred, networkOptions, attemptRequest, retryConfig) {
    var endpoint = String(networkOptions.path).split('?')[0];
    var delay = retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt) * 1000;
    if (retryConfig.shouldRetry && attempt < retryConfig.maxRetries) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_ATTEMPT, {
        endPoint: endpoint,
        err: error,
        delay: delay,
        attempt: attempt + 1,
        maxRetries: retryConfig.maxRetries
      }));
      setTimeout(function () {
        attemptRequest(attempt + 1).then(deferred.resolve).catch(deferred.reject);
      }, delay);
    } else {
      if (!String(networkOptions.path).includes(EventEnum_1.EventEnum.VWO_LOG_EVENT)) {
        // only log error if the endpoint is not vwo_log event
        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_FAILED, {
          endPoint: endpoint,
          err: error
        }));
      }
      var responseModel = new ResponseModel_1.ResponseModel();
      responseModel.setError(error);
      deferred.reject(responseModel);
    }
  };
  return NetworkClient;
}();
exports.NetworkClient = NetworkClient;

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/client/NetworkServerLessClient.js":
/*!***************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/client/NetworkServerLessClient.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NetworkServerLessClient = void 0;
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
var FetchUtil_1 = __webpack_require__(/*! ../../../utils/FetchUtil */ "./dist/server-unpacked/utils/FetchUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var ResponseModel_1 = __webpack_require__(/*! ../models/ResponseModel */ "./dist/server-unpacked/packages/network-layer/models/ResponseModel.js");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkServerLessClient = /** @class */function () {
  function NetworkServerLessClient() {}
  /**
   * Performs a GET request using the provided RequestModel.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
   */
  NetworkServerLessClient.prototype.GET = function (requestModel) {
    var deferred = new PromiseUtil_1.Deferred();
    // Extract network options from the request model.
    var networkOptions = requestModel.getOptions();
    var responseModel = new ResponseModel_1.ResponseModel();
    (0, FetchUtil_1.sendGetCall)(networkOptions).then(function (data) {
      responseModel.setData(data);
      deferred.resolve(responseModel);
    }).catch(function (error) {
      responseModel.setError(error);
      deferred.reject(responseModel);
    });
    return deferred.promise;
  };
  /**
   * Performs a POST request using the provided RequestModel.
   * @param {RequestModel} request - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  NetworkServerLessClient.prototype.POST = function (request) {
    var deferred = new PromiseUtil_1.Deferred();
    var networkOptions = request.getOptions();
    var responseModel = new ResponseModel_1.ResponseModel();
    (0, FetchUtil_1.sendPostCall)(networkOptions).then(function (data) {
      responseModel.setData(data);
      deferred.resolve(responseModel);
    }).catch(function (error) {
      responseModel.setError(error);
      deferred.reject(responseModel);
    });
    return deferred.promise;
  };
  return NetworkServerLessClient;
}();
exports.NetworkServerLessClient = NetworkServerLessClient;

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/handlers/RequestHandler.js":
/*!********************************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/handlers/RequestHandler.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RequestHandler = void 0;
/**
 * A class responsible for creating and modifying request models based on a global configuration.
 */
var RequestHandler = /** @class */function () {
  function RequestHandler() {}
  /**
   * Creates a new request by merging properties from a base request and a configuration model.
   * If both the request URL and the base URL from the configuration are missing, it returns null.
   * Otherwise, it merges the properties from the configuration into the request if they are not already set.
   *
   * @param {RequestModel} request - The initial request model.
   * @param {GlobalRequestModel} config - The global request configuration model.
   * @returns {RequestModel} The merged request model or null if both URLs are missing.
   */
  RequestHandler.prototype.createRequest = function (request, config) {
    // Check if both the request URL and the configuration base URL are missing
    if ((config.getBaseUrl() === null || config.getBaseUrl() === undefined) && (request.getUrl() === null || request.getUrl() === undefined)) {
      return null; // Return null if no URL is specified
    }
    // Set the request URL, defaulting to the configuration base URL if not set
    request.setUrl(request.getUrl() || config.getBaseUrl());
    // Set the request timeout, defaulting to the configuration timeout if not set
    request.setTimeout(request.getTimeout() || config.getTimeout());
    // Set the request body, defaulting to the configuration body if not set
    request.setBody(request.getBody() || config.getBody());
    // Set the request headers, defaulting to the configuration headers if not set
    request.setHeaders(request.getHeaders() || config.getHeaders());
    // Initialize request query parameters, defaulting to an empty object if not set
    var requestQueryParams = request.getQuery() || {};
    // Initialize configuration query parameters, defaulting to an empty object if not set
    var configQueryParams = config.getQuery() || {};
    // Merge configuration query parameters into the request query parameters if they don't exist
    for (var queryKey in configQueryParams) {
      if (!Object.prototype.hasOwnProperty.call(requestQueryParams, queryKey)) {
        requestQueryParams[queryKey] = configQueryParams[queryKey];
      }
    }
    // Set the merged query parameters back to the request
    request.setQuery(requestQueryParams);
    return request; // Return the modified request
  };
  return RequestHandler;
}();
exports.RequestHandler = RequestHandler;

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/index.js":
/*!**************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ResponseModel = exports.RequestModel = exports.GlobalRequestModel = exports.NetworkManager = exports.NetworkClient = void 0;
var NetworkClient;
if (typeof process.env === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  exports.NetworkClient = NetworkClient = (__webpack_require__(/*! ./client/NetworkBrowserClient */ "./dist/server-unpacked/packages/network-layer/client/NetworkBrowserClient.js").NetworkBrowserClient);
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  exports.NetworkClient = NetworkClient = (__webpack_require__(/*! ./client/NetworkClient */ "./dist/server-unpacked/packages/network-layer/client/NetworkClient.js").NetworkClient);
}
var NetworkManager_1 = __webpack_require__(/*! ./manager/NetworkManager */ "./dist/server-unpacked/packages/network-layer/manager/NetworkManager.js");
Object.defineProperty(exports, "NetworkManager", ({
  enumerable: true,
  get: function () {
    return NetworkManager_1.NetworkManager;
  }
}));
var GlobalRequestModel_1 = __webpack_require__(/*! ./models/GlobalRequestModel */ "./dist/server-unpacked/packages/network-layer/models/GlobalRequestModel.js");
Object.defineProperty(exports, "GlobalRequestModel", ({
  enumerable: true,
  get: function () {
    return GlobalRequestModel_1.GlobalRequestModel;
  }
}));
var RequestModel_1 = __webpack_require__(/*! ./models/RequestModel */ "./dist/server-unpacked/packages/network-layer/models/RequestModel.js");
Object.defineProperty(exports, "RequestModel", ({
  enumerable: true,
  get: function () {
    return RequestModel_1.RequestModel;
  }
}));
var ResponseModel_1 = __webpack_require__(/*! ./models/ResponseModel */ "./dist/server-unpacked/packages/network-layer/models/ResponseModel.js");
Object.defineProperty(exports, "ResponseModel", ({
  enumerable: true,
  get: function () {
    return ResponseModel_1.ResponseModel;
  }
}));

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/manager/NetworkManager.js":
/*!*******************************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/manager/NetworkManager.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NetworkManager = void 0;
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
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var RequestHandler_1 = __webpack_require__(/*! ../handlers/RequestHandler */ "./dist/server-unpacked/packages/network-layer/handlers/RequestHandler.js");
var GlobalRequestModel_1 = __webpack_require__(/*! ../models/GlobalRequestModel */ "./dist/server-unpacked/packages/network-layer/models/GlobalRequestModel.js");
var constants_1 = __webpack_require__(/*! ../../../constants */ "./dist/server-unpacked/constants/index.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var LogManager_1 = __webpack_require__(/*! ../../logger/core/LogManager */ "./dist/server-unpacked/packages/logger/core/LogManager.js");
var log_messages_1 = __webpack_require__(/*! ../../../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../../../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var NetworkManager = /** @class */function () {
  function NetworkManager() {}
  /**
   * Validates the retry configuration parameters
   * @param {IRetryConfig} retryConfig - The retry configuration to validate
   * @returns {IRetryConfig} The validated retry configuration with corrected values
   */
  NetworkManager.prototype.validateRetryConfig = function (retryConfig) {
    var validatedConfig = __assign({}, retryConfig);
    var isInvalidConfig = false;
    // Validate shouldRetry: should be a boolean value
    if (!(0, DataTypeUtil_1.isBoolean)(validatedConfig.shouldRetry)) {
      validatedConfig.shouldRetry = constants_1.Constants.DEFAULT_RETRY_CONFIG.shouldRetry;
      isInvalidConfig = true;
    }
    // Validate maxRetries: should be a non-negative integer and should not be less than 1
    if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.maxRetries) || !Number.isInteger(validatedConfig.maxRetries) || validatedConfig.maxRetries < 1) {
      validatedConfig.maxRetries = constants_1.Constants.DEFAULT_RETRY_CONFIG.maxRetries;
      isInvalidConfig = true;
    }
    // Validate initialDelay: should be a non-negative integer and should not be less than 1
    if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.initialDelay) || !Number.isInteger(validatedConfig.initialDelay) || validatedConfig.initialDelay < 1) {
      validatedConfig.initialDelay = constants_1.Constants.DEFAULT_RETRY_CONFIG.initialDelay;
      isInvalidConfig = true;
    }
    // Validate backoffMultiplier: should be a non-negative integer and should not be less than 2
    if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.backoffMultiplier) || !Number.isInteger(validatedConfig.backoffMultiplier) || validatedConfig.backoffMultiplier < 2) {
      validatedConfig.backoffMultiplier = constants_1.Constants.DEFAULT_RETRY_CONFIG.backoffMultiplier;
      isInvalidConfig = true;
    }
    if (isInvalidConfig) {
      LogManager_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.RETRY_CONFIG_INVALID, {
        retryConfig: JSON.stringify(validatedConfig)
      }));
    }
    return isInvalidConfig ? constants_1.Constants.DEFAULT_RETRY_CONFIG : validatedConfig;
  };
  /**
   * Attaches a network client to the manager, or uses a default if none provided.
   * @param {NetworkClientInterface} client - The client to attach, optional.
   * @param {IRetryConfig} retryConfig - The retry configuration, optional.
   */
  NetworkManager.prototype.attachClient = function (client, retryConfig) {
    // Only set retry configuration if it's not already initialized or if a new config is provided
    if (!this.retryConfig || retryConfig) {
      // Define default retry configuration
      var defaultRetryConfig = constants_1.Constants.DEFAULT_RETRY_CONFIG;
      // Merge provided retryConfig with defaults, giving priority to provided values
      var mergedConfig = __assign(__assign({}, defaultRetryConfig), retryConfig || {});
      // Validate the merged configuration
      this.retryConfig = this.validateRetryConfig(mergedConfig);
    }
    // if env is undefined, we are in browser
    if (typeof process.env === 'undefined') {
      // if XMLHttpRequest is undefined, we are in serverless
      if (typeof XMLHttpRequest === 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        var NetworkServerLessClient = (__webpack_require__(/*! ../client/NetworkServerLessClient */ "./dist/server-unpacked/packages/network-layer/client/NetworkServerLessClient.js").NetworkServerLessClient);
        this.client = client || new NetworkServerLessClient();
      } else {
        // if XMLHttpRequest is defined, we are in browser
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        var NetworkBrowserClient = (__webpack_require__(/*! ../client/NetworkBrowserClient */ "./dist/server-unpacked/packages/network-layer/client/NetworkBrowserClient.js").NetworkBrowserClient);
        this.client = client || new NetworkBrowserClient(); // Use provided client or default to NetworkClient
      }
    } else {
      // if env is defined, we are in node
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      var NetworkClient = (__webpack_require__(/*! ../client/NetworkClient */ "./dist/server-unpacked/packages/network-layer/client/NetworkClient.js").NetworkClient);
      this.client = client || new NetworkClient(); // Use provided client or default to NetworkClient
    }
    this.config = new GlobalRequestModel_1.GlobalRequestModel(null, null, null, null); // Initialize with default config
  };
  /**
   * Retrieves the current retry configuration.
   * @returns {IRetryConfig} A copy of the current retry configuration.
   */
  NetworkManager.prototype.getRetryConfig = function () {
    return __assign({}, this.retryConfig);
  };
  Object.defineProperty(NetworkManager, "Instance", {
    /**
     * Singleton accessor for the NetworkManager instance.
     * @returns {NetworkManager} The singleton instance.
     */
    get: function () {
      this.instance = this.instance || new NetworkManager(); // Create instance if it doesn't exist
      return this.instance;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Sets the global configuration for network requests.
   * @param {GlobalRequestModel} config - The configuration to set.
   */
  NetworkManager.prototype.setConfig = function (config) {
    this.config = config; // Set the global request configuration
  };
  /**
   * Retrieves the current global configuration.
   * @returns {GlobalRequestModel} The current configuration.
   */
  NetworkManager.prototype.getConfig = function () {
    return this.config; // Return the global request configuration
  };
  /**
   * Creates a network request model by merging specific request data with global config.
   * @param {RequestModel} request - The specific request data.
   * @returns {RequestModel} The merged request model.
   */
  NetworkManager.prototype.createRequest = function (request) {
    var options = new RequestHandler_1.RequestHandler().createRequest(request, this.config); // Merge and create request
    return options;
  };
  /**
   * Performs a GET request using the provided request model.
   * @param {RequestModel} request - The request model.
   * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
   */
  NetworkManager.prototype.get = function (request) {
    var deferred = new PromiseUtil_1.Deferred(); // Create a new deferred promise
    var networkOptions = this.createRequest(request); // Create network request options
    if (!networkOptions.getUrl()) {
      deferred.reject(new Error('no url found')); // Reject if no URL is found
    } else {
      this.client.GET(networkOptions).then(function (response) {
        deferred.resolve(response); // Resolve with the response
      }).catch(function (errorResponse) {
        deferred.reject(errorResponse); // Reject with the error response
      });
    }
    return deferred.promise; // Return the promise
  };
  /**
   * Performs a POST request using the provided request model.
   * @param {RequestModel} request - The request model.
   * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
   */
  NetworkManager.prototype.post = function (request) {
    var deferred = new PromiseUtil_1.Deferred(); // Create a new deferred promise
    var networkOptions = this.createRequest(request); // Create network request options
    if (!networkOptions.getUrl()) {
      deferred.reject(new Error('no url found')); // Reject if no URL is found
    } else {
      this.client.POST(networkOptions).then(function (response) {
        deferred.resolve(response); // Resolve with the response
      }).catch(function (error) {
        deferred.reject(error); // Reject with the error
      });
    }
    return deferred.promise; // Return the promise
  };
  return NetworkManager;
}();
exports.NetworkManager = NetworkManager;

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/models/GlobalRequestModel.js":
/*!**********************************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/models/GlobalRequestModel.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GlobalRequestModel = void 0;
/**
 * Represents a model for global HTTP requests configuration.
 * This class encapsulates all necessary details such as URL, query parameters, body, headers,
 * timeout settings, and development mode flag.
 */
var GlobalRequestModel = /** @class */function () {
  /**
   * Constructs an instance of the GlobalRequestModel.
   * @param url The base URL of the HTTP request.
   * @param query Query parameters as a record of key-value pairs.
   * @param body Body of the request as a record of key-value pairs.
   * @param headers HTTP headers as a record of key-value pairs.
   */
  function GlobalRequestModel(url, query, body, headers) {
    this.timeout = 3000; // Default timeout for the HTTP request in milliseconds
    this.url = url;
    this.query = query;
    this.body = body;
    this.headers = headers;
  }
  /**
   * Sets the query parameters for the HTTP request.
   * @param query A record of key-value pairs representing the query parameters.
   */
  GlobalRequestModel.prototype.setQuery = function (query) {
    this.query = query;
  };
  /**
   * Retrieves the query parameters of the HTTP request.
   * @returns A record of key-value pairs representing the query parameters.
   */
  GlobalRequestModel.prototype.getQuery = function () {
    return this.query;
  };
  /**
   * Sets the body of the HTTP request.
   * @param body A record of key-value pairs representing the body content.
   */
  GlobalRequestModel.prototype.setBody = function (body) {
    this.body = body;
  };
  /**
   * Retrieves the body of the HTTP request.
   * @returns A record of key-value pairs representing the body content.
   */
  GlobalRequestModel.prototype.getBody = function () {
    return this.body;
  };
  /**
   * Sets the base URL of the HTTP request.
   * @param url The base URL as a string.
   */
  GlobalRequestModel.prototype.setBaseUrl = function (url) {
    this.url = url;
  };
  /**
   * Retrieves the base URL of the HTTP request.
   * @returns The base URL as a string.
   */
  GlobalRequestModel.prototype.getBaseUrl = function () {
    return this.url;
  };
  /**
   * Sets the timeout duration for the HTTP request.
   * @param timeout Timeout in milliseconds.
   */
  GlobalRequestModel.prototype.setTimeout = function (timeout) {
    this.timeout = timeout;
  };
  /**
   * Retrieves the timeout duration of the HTTP request.
   * @returns Timeout in milliseconds.
   */
  GlobalRequestModel.prototype.getTimeout = function () {
    return this.timeout;
  };
  /**
   * Sets the HTTP headers for the request.
   * @param headers A record of key-value pairs representing the HTTP headers.
   */
  GlobalRequestModel.prototype.setHeaders = function (headers) {
    this.headers = headers;
  };
  /**
   * Retrieves the HTTP headers of the request.
   * @returns A record of key-value pairs representing the HTTP headers.
   */
  GlobalRequestModel.prototype.getHeaders = function () {
    return this.headers;
  };
  /**
   * Sets the development mode status for the request.
   * @param isDevelopmentMode Boolean flag indicating if the request is in development mode.
   */
  GlobalRequestModel.prototype.setDevelopmentMode = function (isDevelopmentMode) {
    this.isDevelopmentMode = isDevelopmentMode;
  };
  /**
   * Retrieves the development mode status of the request.
   * @returns Boolean indicating if the request is in development mode.
   */
  GlobalRequestModel.prototype.getDevelopmentMode = function () {
    return this.isDevelopmentMode;
  };
  return GlobalRequestModel;
}();
exports.GlobalRequestModel = GlobalRequestModel;

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/models/RequestModel.js":
/*!****************************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/models/RequestModel.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RequestModel = void 0;
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
var HttpMethodEnum_1 = __webpack_require__(/*! ../../../enums/HttpMethodEnum */ "./dist/server-unpacked/enums/HttpMethodEnum.js");
var Url_1 = __webpack_require__(/*! ../../../constants/Url */ "./dist/server-unpacked/constants/Url.js");
var constants_1 = __webpack_require__(/*! ../../../constants */ "./dist/server-unpacked/constants/index.js");
/**
 * Represents a model for HTTP requests.
 * This class encapsulates all necessary details such as URL, method, path, query parameters, body, headers,
 * scheme, port, and timeout settings.
 */
var RequestModel = /** @class */function () {
  /**
   * Constructs an instance of the RequestModel.
   * @param url The base URL of the HTTP request.
   * @param method HTTP method, default is 'GET'.
   * @param path URL path.
   * @param query Query parameters as a record of key-value pairs.
   * @param body Body of the request as a record of key-value pairs.
   * @param headers HTTP headers as a record of key-value pairs.
   * @param scheme Protocol scheme, default is 'http'.
   * @param port Port number, default is 80.
   */
  function RequestModel(url, method, path, query, body, headers, scheme, port, retryConfig) {
    if (method === void 0) {
      method = HttpMethodEnum_1.HttpMethodEnum.GET;
    }
    if (scheme === void 0) {
      scheme = Url_1.HTTPS;
    }
    this.url = url;
    this.method = method;
    this.path = path;
    this.query = query;
    this.body = body;
    this.headers = headers;
    this.scheme = scheme;
    this.port = port;
    this.retryConfig = retryConfig || constants_1.Constants.DEFAULT_RETRY_CONFIG;
  }
  /**
   * Retrieves the HTTP method.
   * @returns The HTTP method as a string.
   */
  RequestModel.prototype.getMethod = function () {
    return this.method;
  };
  /**
   * Sets the HTTP method.
   * @param method The HTTP method to set.
   */
  RequestModel.prototype.setMethod = function (method) {
    this.method = method;
  };
  /**
   * Retrieves the body of the HTTP request.
   * @returns A record of key-value pairs representing the body content.
   */
  RequestModel.prototype.getBody = function () {
    return this.body;
  };
  /**
   * Sets the body of the HTTP request.
   * @param body A record of key-value pairs representing the body content.
   */
  RequestModel.prototype.setBody = function (body) {
    this.body = body;
  };
  /**
   * Sets the query parameters for the HTTP request.
   * @param query A record of key-value pairs representing the query parameters.
   */
  RequestModel.prototype.setQuery = function (query) {
    this.query = query;
  };
  /**
   * Retrieves the query parameters of the HTTP request.
   * @returns A record of key-value pairs representing the query parameters.
   */
  RequestModel.prototype.getQuery = function () {
    return this.query;
  };
  /**
   * Sets the HTTP headers for the request.
   * @param headers A record of key-value pairs representing the HTTP headers.
   */
  RequestModel.prototype.setHeaders = function (headers) {
    this.headers = headers;
    return this;
  };
  /**
   * Retrieves the HTTP headers of the request.
   * @returns A record of key-value pairs representing the HTTP headers.
   */
  RequestModel.prototype.getHeaders = function () {
    return this.headers;
  };
  /**
   * Sets the timeout duration for the HTTP request.
   * @param timeout Timeout in milliseconds.
   */
  RequestModel.prototype.setTimeout = function (timeout) {
    this.timeout = timeout;
    return this;
  };
  /**
   * Retrieves the timeout duration of the HTTP request.
   * @returns Timeout in milliseconds.
   */
  RequestModel.prototype.getTimeout = function () {
    return this.timeout;
  };
  /**
   * Retrieves the base URL of the HTTP request.
   * @returns The base URL as a string.
   */
  RequestModel.prototype.getUrl = function () {
    return this.url;
  };
  /**
   * Sets the base URL of the HTTP request.
   * @param url The base URL as a string.
   */
  RequestModel.prototype.setUrl = function (url) {
    this.url = url;
    return this;
  };
  /**
   * Retrieves the scheme of the HTTP request.
   * @returns The scheme as a string.
   */
  RequestModel.prototype.getScheme = function () {
    return this.scheme;
  };
  /**
   * Sets the scheme of the HTTP request.
   * @param scheme The scheme to set (http or https).
   */
  RequestModel.prototype.setScheme = function (scheme) {
    this.scheme = scheme;
    return this;
  };
  /**
   * Retrieves the port number of the HTTP request.
   * @returns The port number as an integer.
   */
  RequestModel.prototype.getPort = function () {
    return this.port;
  };
  /**
   * Sets the port number for the HTTP request.
   * @param port The port number to set.
   */
  RequestModel.prototype.setPort = function (port) {
    this.port = port;
    return this;
  };
  /**
   * Retrieves the path of the HTTP request.
   * @returns The path as a string.
   */
  RequestModel.prototype.getPath = function () {
    return this.path;
  };
  /**
   * Sets the path of the HTTP request.
   * @param path The path to set.
   */
  RequestModel.prototype.setPath = function (path) {
    this.path = path;
    return this;
  };
  /**
   * Retrieves the retry configuration.
   * @returns The retry configuration.
   */
  RequestModel.prototype.getRetryConfig = function () {
    return __assign({}, this.retryConfig);
  };
  /**
   * Sets the retry configuration.
   * @param retryConfig The retry configuration to set.
   */
  RequestModel.prototype.setRetryConfig = function (retryConfig) {
    this.retryConfig = retryConfig;
    return this;
  };
  /**
   * Constructs the options for the HTTP request based on the current state of the model.
   * This method is used to prepare the request options for execution.
   * @returns A record containing all relevant options for the HTTP request.
   */
  RequestModel.prototype.getOptions = function () {
    var queryParams = '';
    for (var key in this.query) {
      var queryString = "".concat(key, "=").concat(this.query[key], "&");
      queryParams += queryString;
    }
    var _a = this.url.split('/'),
      hostname = _a[0],
      collectionPrefix = _a[1];
    var options = {
      hostname: hostname,
      // if url is example.com/as01, hostname will be example.com
      agent: false
    };
    if (this.scheme) {
      options.scheme = this.scheme;
    }
    if (this.port) {
      options.port = this.port;
    }
    if (this.headers) {
      options.headers = this.headers;
    }
    if (this.method) {
      options.method = this.method;
    }
    if (this.body) {
      var postBody = JSON.stringify(this.body);
      options.headers = options.headers || {};
      options.headers['Content-Type'] = 'application/json';
      if (typeof Buffer === 'undefined') {
        options.headers['Content-Length'] = new TextEncoder().encode(postBody).length;
      } else {
        options.headers['Content-Length'] = Buffer.byteLength(postBody);
      }
      options.body = this.body;
    }
    if (this.path) {
      if (queryParams !== '') {
        options.path = this.path + '?' + queryParams || '';
      } else {
        options.path = this.path;
      }
    }
    if (collectionPrefix) {
      options.path = "/".concat(collectionPrefix) + options.path;
    }
    if (this.timeout) {
      options.timeout = this.timeout;
    }
    if (options.path.charAt(options.path.length - 1) === '&') {
      options.path = options.path.substring(0, options.path.length - 1);
    }
    options.retryConfig = this.retryConfig;
    return options;
  };
  return RequestModel;
}();
exports.RequestModel = RequestModel;

/***/ }),

/***/ "./dist/server-unpacked/packages/network-layer/models/ResponseModel.js":
/*!*****************************************************************************!*\
  !*** ./dist/server-unpacked/packages/network-layer/models/ResponseModel.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ResponseModel = void 0;
/**
 * Represents the response model for network operations.
 * This class encapsulates details about the HTTP response including status code, headers, data, and errors.
 */
var ResponseModel = /** @class */function () {
  function ResponseModel() {}
  /**
   * Sets the status code of the response.
   * @param {number} statusCode - The HTTP status code
   */
  ResponseModel.prototype.setStatusCode = function (statusCode) {
    this.statusCode = statusCode;
  };
  /**
   * Sets the headers of the response.
   * @param {Record<string, string>} headers - The headers of the response
   */
  ResponseModel.prototype.setHeaders = function (headers) {
    this.headers = headers;
  };
  /**
   * Sets the data of the response.
   * @param {dynamic} data - The data payload of the response
   */
  ResponseModel.prototype.setData = function (data) {
    this.data = data;
  };
  /**
   * Sets the error object of the response.
   * @param {dynamic} error - The error object if the request failed
   */
  ResponseModel.prototype.setError = function (error) {
    this.error = error;
  };
  /**
   * Retrieves the headers of the response.
   * @returns {Record<string, string>} The headers of the response
   */
  ResponseModel.prototype.getHeaders = function () {
    return this.headers;
  };
  /**
   * Retrieves the data payload of the response.
   * @returns {dynamic} The data payload of the response
   */
  ResponseModel.prototype.getData = function () {
    return this.data;
  };
  /**
   * Retrieves the status code of the response.
   * @returns {number} The HTTP status code
   */
  ResponseModel.prototype.getStatusCode = function () {
    return this.statusCode;
  };
  /**
   * Retrieves the error object of the response.
   * @returns {dynamic} The error object if the request failed
   */
  ResponseModel.prototype.getError = function () {
    return this.error;
  };
  return ResponseModel;
}();
exports.ResponseModel = ResponseModel;

/***/ }),

/***/ "./dist/server-unpacked/packages/segmentation-evaluator/core/SegmentationManger.js":
/*!*****************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/segmentation-evaluator/core/SegmentationManger.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SegmentationManager = void 0;
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
var SegmentEvaluator_1 = __webpack_require__(/*! ../evaluators/SegmentEvaluator */ "./dist/server-unpacked/packages/segmentation-evaluator/evaluators/SegmentEvaluator.js");
var GatewayServiceUtil_1 = __webpack_require__(/*! ../../../utils/GatewayServiceUtil */ "./dist/server-unpacked/utils/GatewayServiceUtil.js");
var UrlEnum_1 = __webpack_require__(/*! ../../../enums/UrlEnum */ "./dist/server-unpacked/enums/UrlEnum.js");
var logger_1 = __webpack_require__(/*! ../../logger */ "./dist/server-unpacked/packages/logger/index.js");
var ContextVWOModel_1 = __webpack_require__(/*! ../../../models/user/ContextVWOModel */ "./dist/server-unpacked/models/user/ContextVWOModel.js");
var SettingsService_1 = __webpack_require__(/*! ../../../services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var SegmentationManager = /** @class */function () {
  function SegmentationManager() {}
  Object.defineProperty(SegmentationManager, "Instance", {
    /**
     * Singleton pattern implementation for getting the instance of SegmentationManager.
     * @returns {SegmentationManager} The singleton instance.
     */
    get: function () {
      this.instance = this.instance || new SegmentationManager(); // Create new instance if it doesn't exist
      return this.instance;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Attaches an evaluator to the manager, or creates a new one if none is provided.
   * @param {SegmentEvaluator} evaluator - Optional evaluator to attach.
   */
  SegmentationManager.prototype.attachEvaluator = function (evaluator) {
    this.evaluator = evaluator || new SegmentEvaluator_1.SegmentEvaluator(); // Use provided evaluator or create new one
  };
  /**
   * Sets the contextual data for the segmentation process.
   * @param {any} settings - The settings data.
   * @param {any} feature - The feature data including segmentation needs.
   * @param {any} context - The context data for the evaluation.
   */
  SegmentationManager.prototype.setContextualData = function (settings, feature, context) {
    return __awaiter(this, void 0, void 0, function () {
      var queryParams, params, _vwo, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.attachEvaluator(); // Ensure a fresh evaluator instance
            this.evaluator.settings = settings; // Set settings in evaluator
            this.evaluator.context = context; // Set context in evaluator
            this.evaluator.feature = feature; // Set feature in evaluator
            // if both user agent and ip is null then we should not get data from gateway service
            if ((context === null || context === void 0 ? void 0 : context.getUserAgent()) === null && (context === null || context === void 0 ? void 0 : context.getIpAddress()) === null) {
              return [2 /*return*/];
            }
            if (!(feature.getIsGatewayServiceRequired() === true)) return [3 /*break*/, 4];
            if (!(SettingsService_1.SettingsService.Instance.isGatewayServiceProvided && ((0, DataTypeUtil_1.isUndefined)(context.getVwo()) || context.getVwo() === null))) return [3 /*break*/, 4];
            queryParams = {};
            if (context === null || context === void 0 ? void 0 : context.getUserAgent()) {
              queryParams['userAgent'] = context.getUserAgent();
            }
            if (context === null || context === void 0 ? void 0 : context.getIpAddress()) {
              queryParams['ipAddress'] = context.getIpAddress();
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3,, 4]);
            params = (0, GatewayServiceUtil_1.getQueryParams)(queryParams);
            return [4 /*yield*/, (0, GatewayServiceUtil_1.getFromGatewayService)(params, UrlEnum_1.UrlEnum.GET_USER_DATA)];
          case 2:
            _vwo = _a.sent();
            context.setVwo(new ContextVWOModel_1.ContextVWOModel().modelFromDictionary(_vwo));
            this.evaluator.context = context;
            return [3 /*break*/, 4];
          case 3:
            err_1 = _a.sent();
            logger_1.LogManager.Instance.error("Error in setting contextual data for segmentation. Got error: ".concat(err_1.error));
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Validates the segmentation against provided DSL and properties.
   * @param {Record<string, dynamic>} dsl - The segmentation DSL.
   * @param {Record<any, dynamic>} properties - The properties to validate against.
   * @param {SettingsModel} settings - The settings model.
   * @param {any} context - Optional context.
   * @returns {Promise<boolean>} True if segmentation is valid, otherwise false.
   */
  SegmentationManager.prototype.validateSegmentation = function (dsl, properties) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.evaluator.isSegmentationValid(dsl, properties)];
          case 1:
            return [2 /*return*/, _a.sent()];
          // Delegate to evaluator's method
        }
      });
    });
  };
  return SegmentationManager;
}();
exports.SegmentationManager = SegmentationManager;

/***/ }),

/***/ "./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperandRegexEnum.js":
/*!***********************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperandRegexEnum.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SegmentOperandRegexEnum = void 0;
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
var SegmentOperandRegexEnum;
(function (SegmentOperandRegexEnum) {
  SegmentOperandRegexEnum["LOWER"] = "^lower";
  SegmentOperandRegexEnum["LOWER_MATCH"] = "^lower\\((.*)\\)";
  SegmentOperandRegexEnum["WILDCARD"] = "^wildcard";
  SegmentOperandRegexEnum["WILDCARD_MATCH"] = "^wildcard\\((.*)\\)";
  SegmentOperandRegexEnum["REGEX"] = "^regex";
  SegmentOperandRegexEnum["REGEX_MATCH"] = "^regex\\((.*)\\)";
  SegmentOperandRegexEnum["STARTING_STAR"] = "^\\*";
  SegmentOperandRegexEnum["ENDING_STAR"] = "\\*$";
  SegmentOperandRegexEnum["GREATER_THAN_MATCH"] = "^gt\\((\\d+\\.?\\d*|\\.\\d+)\\)";
  SegmentOperandRegexEnum["GREATER_THAN_EQUAL_TO_MATCH"] = "^gte\\((\\d+\\.?\\d*|\\.\\d+)\\)";
  SegmentOperandRegexEnum["LESS_THAN_MATCH"] = "^lt\\((\\d+\\.?\\d*|\\.\\d+)\\)";
  SegmentOperandRegexEnum["LESS_THAN_EQUAL_TO_MATCH"] = "^lte\\((\\d+\\.?\\d*|\\.\\d+)\\)";
})(SegmentOperandRegexEnum || (exports.SegmentOperandRegexEnum = SegmentOperandRegexEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperandValueEnum.js":
/*!***********************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperandValueEnum.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SegmentOperandValueEnum = void 0;
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
var SegmentOperandValueEnum;
(function (SegmentOperandValueEnum) {
  SegmentOperandValueEnum[SegmentOperandValueEnum["LOWER_VALUE"] = 1] = "LOWER_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["STARTING_ENDING_STAR_VALUE"] = 2] = "STARTING_ENDING_STAR_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["STARTING_STAR_VALUE"] = 3] = "STARTING_STAR_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["ENDING_STAR_VALUE"] = 4] = "ENDING_STAR_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["REGEX_VALUE"] = 5] = "REGEX_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["EQUAL_VALUE"] = 6] = "EQUAL_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["GREATER_THAN_VALUE"] = 7] = "GREATER_THAN_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["GREATER_THAN_EQUAL_TO_VALUE"] = 8] = "GREATER_THAN_EQUAL_TO_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["LESS_THAN_VALUE"] = 9] = "LESS_THAN_VALUE";
  SegmentOperandValueEnum[SegmentOperandValueEnum["LESS_THAN_EQUAL_TO_VALUE"] = 10] = "LESS_THAN_EQUAL_TO_VALUE";
})(SegmentOperandValueEnum || (exports.SegmentOperandValueEnum = SegmentOperandValueEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperatorValueEnum.js":
/*!************************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperatorValueEnum.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SegmentOperatorValueEnum = void 0;
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
var SegmentOperatorValueEnum;
(function (SegmentOperatorValueEnum) {
  SegmentOperatorValueEnum["AND"] = "and";
  SegmentOperatorValueEnum["NOT"] = "not";
  SegmentOperatorValueEnum["OR"] = "or";
  SegmentOperatorValueEnum["CUSTOM_VARIABLE"] = "custom_variable";
  SegmentOperatorValueEnum["USER"] = "user";
  SegmentOperatorValueEnum["COUNTRY"] = "country";
  SegmentOperatorValueEnum["REGION"] = "region";
  SegmentOperatorValueEnum["CITY"] = "city";
  SegmentOperatorValueEnum["OPERATING_SYSTEM"] = "os";
  SegmentOperatorValueEnum["DEVICE_TYPE"] = "device_type";
  SegmentOperatorValueEnum["DEVICE"] = "device";
  SegmentOperatorValueEnum["BROWSER_AGENT"] = "browser_string";
  SegmentOperatorValueEnum["UA"] = "ua";
  SegmentOperatorValueEnum["FEATURE_ID"] = "featureId";
})(SegmentOperatorValueEnum || (exports.SegmentOperatorValueEnum = SegmentOperatorValueEnum = {}));

/***/ }),

/***/ "./dist/server-unpacked/packages/segmentation-evaluator/evaluators/SegmentEvaluator.js":
/*!*********************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/segmentation-evaluator/evaluators/SegmentEvaluator.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SegmentEvaluator = void 0;
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
var StorageDecorator_1 = __webpack_require__(/*! ../../../decorators/StorageDecorator */ "./dist/server-unpacked/decorators/StorageDecorator.js");
var logger_1 = __webpack_require__(/*! ../../logger */ "./dist/server-unpacked/packages/logger/index.js");
var StorageService_1 = __webpack_require__(/*! ../../../services/StorageService */ "./dist/server-unpacked/services/StorageService.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var SegmentOperatorValueEnum_1 = __webpack_require__(/*! ../enums/SegmentOperatorValueEnum */ "./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperatorValueEnum.js");
var SegmentUtil_1 = __webpack_require__(/*! ../utils/SegmentUtil */ "./dist/server-unpacked/packages/segmentation-evaluator/utils/SegmentUtil.js");
var SegmentOperandEvaluator_1 = __webpack_require__(/*! ./SegmentOperandEvaluator */ "./dist/server-unpacked/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator.js");
var SegmentEvaluator = /** @class */function () {
  function SegmentEvaluator() {}
  /**
   * Validates if the segmentation defined in the DSL is applicable based on the provided properties.
   * @param dsl The domain-specific language defining the segmentation rules.
   * @param properties The properties against which the DSL rules are evaluated.
   * @returns A Promise resolving to a boolean indicating if the segmentation is valid.
   */
  SegmentEvaluator.prototype.isSegmentationValid = function (dsl, properties) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, key, value, operator, subDsl, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _a = (0, SegmentUtil_1.getKeyValue)(dsl), key = _a.key, value = _a.value;
            operator = key;
            subDsl = value;
            _b = operator;
            switch (_b) {
              case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.NOT:
                return [3 /*break*/, 1];
              case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.AND:
                return [3 /*break*/, 3];
              case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.OR:
                return [3 /*break*/, 5];
              case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CUSTOM_VARIABLE:
                return [3 /*break*/, 7];
              case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.USER:
                return [3 /*break*/, 9];
              case SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.UA:
                return [3 /*break*/, 10];
            }
            return [3 /*break*/, 11];
          case 1:
            return [4 /*yield*/, this.isSegmentationValid(subDsl, properties)];
          case 2:
            return [2 /*return*/, !_c.sent()];
          case 3:
            return [4 /*yield*/, this.every(subDsl, properties)];
          case 4:
            return [2 /*return*/, _c.sent()];
          case 5:
            return [4 /*yield*/, this.some(subDsl, properties)];
          case 6:
            return [2 /*return*/, _c.sent()];
          case 7:
            return [4 /*yield*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateCustomVariableDSL(subDsl, properties)];
          case 8:
            return [2 /*return*/, _c.sent()];
          case 9:
            return [2 /*return*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateUserDSL(subDsl, properties)];
          case 10:
            return [2 /*return*/, new SegmentOperandEvaluator_1.SegmentOperandEvaluator().evaluateUserAgentDSL(subDsl, this.context)];
          case 11:
            return [2 /*return*/, false];
        }
      });
    });
  };
  /**
   * Evaluates if any of the DSL nodes are valid using the OR logic.
   * @param dslNodes Array of DSL nodes to evaluate.
   * @param customVariables Custom variables provided for evaluation.
   * @returns A Promise resolving to a boolean indicating if any of the nodes are valid.
   */
  SegmentEvaluator.prototype.some = function (dslNodes, customVariables) {
    return __awaiter(this, void 0, void 0, function () {
      var uaParserMap, keyCount, isUaParser, _i, dslNodes_1, dsl, _loop_1, this_1, _a, _b, _c, _d, key, state_1, uaParserResult, err_1;
      return __generator(this, function (_e) {
        switch (_e.label) {
          case 0:
            uaParserMap = {};
            keyCount = 0;
            isUaParser = false;
            _i = 0, dslNodes_1 = dslNodes;
            _e.label = 1;
          case 1:
            if (!(_i < dslNodes_1.length)) return [3 /*break*/, 12];
            dsl = dslNodes_1[_i];
            _loop_1 = function (key) {
              var value, valuesArray, featureIdObject, featureIdKey_1, featureIdValue, features, feature, featureKey, result;
              return __generator(this, function (_f) {
                switch (_f.label) {
                  case 0:
                    // Check for user agent related keys
                    if (key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.OPERATING_SYSTEM || key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.BROWSER_AGENT || key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.DEVICE_TYPE || key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.DEVICE) {
                      isUaParser = true;
                      value = dsl[key];
                      if (!uaParserMap[key]) {
                        uaParserMap[key] = [];
                      }
                      valuesArray = Array.isArray(value) ? value : [value];
                      valuesArray.forEach(function (val) {
                        if (typeof val === 'string') {
                          uaParserMap[key].push(val);
                        }
                      });
                      keyCount++; // Increment count of keys encountered
                    }
                    if (!(key === SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.FEATURE_ID)) return [3 /*break*/, 3];
                    featureIdObject = dsl[key];
                    featureIdKey_1 = Object.keys(featureIdObject)[0];
                    featureIdValue = featureIdObject[featureIdKey_1];
                    if (!(featureIdValue === 'on' || featureIdValue === 'off')) return [3 /*break*/, 3];
                    features = this_1.settings.getFeatures();
                    feature = features.find(function (feature) {
                      return feature.getId() === parseInt(featureIdKey_1);
                    });
                    if (!feature) return [3 /*break*/, 2];
                    featureKey = feature.getKey();
                    return [4 /*yield*/, this_1.checkInUserStorage(this_1.settings, featureKey, this_1.context)];
                  case 1:
                    result = _f.sent();
                    // if the result is false, then we need to return true as feature is not present in the user storage
                    if (featureIdValue === 'off') {
                      return [2 /*return*/, {
                        value: !result
                      }];
                    }
                    return [2 /*return*/, {
                      value: result
                    }];
                  case 2:
                    logger_1.LogManager.Instance.error('Feature not found with featureIdKey: ' + featureIdKey_1);
                    return [2 /*return*/, {
                      value: null
                    }];
                  case 3:
                    return [2 /*return*/];
                }
              });
            };
            this_1 = this;
            _a = dsl;
            _b = [];
            for (_c in _a) _b.push(_c);
            _d = 0;
            _e.label = 2;
          case 2:
            if (!(_d < _b.length)) return [3 /*break*/, 5];
            _c = _b[_d];
            if (!(_c in _a)) return [3 /*break*/, 4];
            key = _c;
            return [5 /*yield**/, _loop_1(key)];
          case 3:
            state_1 = _e.sent();
            if (typeof state_1 === "object") return [2 /*return*/, state_1.value];
            _e.label = 4;
          case 4:
            _d++;
            return [3 /*break*/, 2];
          case 5:
            if (!(isUaParser && keyCount === dslNodes.length)) return [3 /*break*/, 9];
            _e.label = 6;
          case 6:
            _e.trys.push([6, 8,, 9]);
            return [4 /*yield*/, this.checkUserAgentParser(uaParserMap)];
          case 7:
            uaParserResult = _e.sent();
            return [2 /*return*/, uaParserResult];
          case 8:
            err_1 = _e.sent();
            logger_1.LogManager.Instance.error('Failed to validate User Agent. Erro: ' + err_1);
            return [3 /*break*/, 9];
          case 9:
            return [4 /*yield*/, this.isSegmentationValid(dsl, customVariables)];
          case 10:
            // Recursively check each DSL node
            if (_e.sent()) {
              return [2 /*return*/, true];
            }
            _e.label = 11;
          case 11:
            _i++;
            return [3 /*break*/, 1];
          case 12:
            return [2 /*return*/, false];
        }
      });
    });
  };
  /**
   * Evaluates all DSL nodes using the AND logic.
   * @param dslNodes Array of DSL nodes to evaluate.
   * @param customVariables Custom variables provided for evaluation.
   * @returns A Promise resolving to a boolean indicating if all nodes are valid.
   */
  SegmentEvaluator.prototype.every = function (dslNodes, customVariables) {
    return __awaiter(this, void 0, void 0, function () {
      var locationMap, _i, dslNodes_2, dsl, segmentResult, res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            locationMap = {};
            _i = 0, dslNodes_2 = dslNodes;
            _a.label = 1;
          case 1:
            if (!(_i < dslNodes_2.length)) return [3 /*break*/, 7];
            dsl = dslNodes_2[_i];
            if (!(SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.COUNTRY in dsl || SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.REGION in dsl || SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CITY in dsl)) return [3 /*break*/, 4];
            this.addLocationValuesToMap(dsl, locationMap);
            if (!(Object.keys(locationMap).length === dslNodes.length)) return [3 /*break*/, 3];
            return [4 /*yield*/, this.checkLocationPreSegmentation(locationMap)];
          case 2:
            segmentResult = _a.sent();
            return [2 /*return*/, segmentResult];
          case 3:
            return [3 /*break*/, 6];
          case 4:
            return [4 /*yield*/, this.isSegmentationValid(dsl, customVariables)];
          case 5:
            res = _a.sent();
            if (!res) {
              return [2 /*return*/, false];
            }
            _a.label = 6;
          case 6:
            _i++;
            return [3 /*break*/, 1];
          case 7:
            return [2 /*return*/, true];
        }
      });
    });
  };
  /**
   * Adds location values from a DSL node to a map.
   * @param dsl DSL node containing location data.
   * @param locationMap Map to store location data.
   */
  SegmentEvaluator.prototype.addLocationValuesToMap = function (dsl, locationMap) {
    // Add country, region, and city information to the location map if present
    if (SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.COUNTRY in dsl) {
      locationMap[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.COUNTRY] = dsl[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.COUNTRY];
    }
    if (SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.REGION in dsl) {
      locationMap[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.REGION] = dsl[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.REGION];
    }
    if (SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CITY in dsl) {
      locationMap[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CITY] = dsl[SegmentOperatorValueEnum_1.SegmentOperatorValueEnum.CITY];
    }
  };
  /**
   * Checks if the user's location matches the expected location criteria.
   * @param locationMap Map of expected location values.
   * @returns A Promise resolving to a boolean indicating if the location matches.
   */
  SegmentEvaluator.prototype.checkLocationPreSegmentation = function (locationMap) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j;
      return __generator(this, function (_k) {
        // Ensure user's IP address is available
        if (((_a = this.context) === null || _a === void 0 ? void 0 : _a.getIpAddress()) === undefined && typeof process.env !== 'undefined') {
          logger_1.LogManager.Instance.error('To evaluate location pre Segment, please pass ipAddress in context object');
          return [2 /*return*/, false];
        }
        // Check if location data is available and matches the expected values
        if (!((_c = (_b = this.context) === null || _b === void 0 ? void 0 : _b.getVwo()) === null || _c === void 0 ? void 0 : _c.getLocation()) || ((_e = (_d = this.context) === null || _d === void 0 ? void 0 : _d.getVwo()) === null || _e === void 0 ? void 0 : _e.getLocation()) === undefined || ((_g = (_f = this.context) === null || _f === void 0 ? void 0 : _f.getVwo()) === null || _g === void 0 ? void 0 : _g.getLocation()) === null) {
          return [2 /*return*/, false];
        }
        return [2 /*return*/, this.valuesMatch(locationMap, (_j = (_h = this.context) === null || _h === void 0 ? void 0 : _h.getVwo()) === null || _j === void 0 ? void 0 : _j.getLocation())];
      });
    });
  };
  /**
   * Checks if the user's device information matches the expected criteria.
   * @param uaParserMap Map of expected user agent values.
   * @returns A Promise resolving to a boolean indicating if the user agent matches.
   */
  SegmentEvaluator.prototype.checkUserAgentParser = function (uaParserMap) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return __generator(this, function (_j) {
        // Ensure user's user agent is available
        if (!((_a = this.context) === null || _a === void 0 ? void 0 : _a.getUserAgent()) || ((_b = this.context) === null || _b === void 0 ? void 0 : _b.getUserAgent()) === undefined) {
          logger_1.LogManager.Instance.error('To evaluate user agent related segments, please pass userAgent in context object');
          return [2 /*return*/, false];
        }
        // Check if user agent data is available and matches the expected values
        if (!((_d = (_c = this.context) === null || _c === void 0 ? void 0 : _c.getVwo()) === null || _d === void 0 ? void 0 : _d.getUaInfo()) || ((_f = (_e = this.context) === null || _e === void 0 ? void 0 : _e.getVwo()) === null || _f === void 0 ? void 0 : _f.getUaInfo()) === undefined) {
          return [2 /*return*/, false];
        }
        return [2 /*return*/, this.checkValuePresent(uaParserMap, (_h = (_g = this.context) === null || _g === void 0 ? void 0 : _g.getVwo()) === null || _h === void 0 ? void 0 : _h.getUaInfo())];
      });
    });
  };
  /**
   * Checks if the feature is enabled for the user by querying the storage.
   * @param settings The settings model containing configuration.
   * @param featureKey The key of the feature to check.
   * @param user The user object to check against.
   * @returns A Promise resolving to a boolean indicating if the feature is enabled for the user.
   */
  SegmentEvaluator.prototype.checkInUserStorage = function (settings, featureKey, context) {
    return __awaiter(this, void 0, void 0, function () {
      var storageService, storedData;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            storageService = new StorageService_1.StorageService();
            return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService)];
          case 1:
            storedData = _a.sent();
            // Check if the stored data is an object and not empty
            if ((0, DataTypeUtil_1.isObject)(storedData) && Object.keys(storedData).length > 0) {
              return [2 /*return*/, true];
            } else {
              return [2 /*return*/, false];
            }
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Checks if the actual values match the expected values specified in the map.
   * @param expectedMap A map of expected values for different keys.
   * @param actualMap A map of actual values to compare against.
   * @returns A Promise resolving to a boolean indicating if all actual values match the expected values.
   */
  SegmentEvaluator.prototype.checkValuePresent = function (expectedMap, actualMap) {
    return __awaiter(this, void 0, void 0, function () {
      var _loop_2, key, state_2;
      return __generator(this, function (_a) {
        _loop_2 = function (key) {
          if (Object.prototype.hasOwnProperty.call(expectedMap, key)) {
            var expectedValues_2 = expectedMap[key];
            // convert expected values to lowercase
            expectedValues_2.forEach(function (value, index) {
              expectedValues_2[index] = value.toLowerCase();
            });
            var actualValue = actualMap[key];
            // Handle wildcard patterns for all keys
            for (var _i = 0, expectedValues_1 = expectedValues_2; _i < expectedValues_1.length; _i++) {
              var val = expectedValues_1[_i];
              // Check if the value is a wildcard pattern and matches the actual value using regex
              if (val.startsWith('wildcard(') && val.endsWith(')')) {
                // Extract pattern from wildcard string
                var wildcardPattern = val.slice(9, -1);
                // Convert wildcard pattern to regex and check if it matches the actual value
                var regex = new RegExp(wildcardPattern.replace(/\*/g, '.*'), 'i'); // Convert wildcard pattern to regex, 'i' for case-insensitive
                // Check if the actual value matches the regex pattern for the key
                if (regex.test(actualValue)) {
                  return {
                    value: true
                  };
                }
              }
            }
            // this will be checked for all cases where wildcard is not present
            if (expectedValues_2.includes(actualValue === null || actualValue === void 0 ? void 0 : actualValue.toLowerCase())) {
              return {
                value: true
              };
            }
          }
        };
        for (key in actualMap) {
          state_2 = _loop_2(key);
          if (typeof state_2 === "object") return [2 /*return*/, state_2.value];
        }
        return [2 /*return*/, false]; // No matches found
      });
    });
  };
  /**
   * Compares expected location values with user's location to determine a match.
   * @param expectedLocationMap A map of expected location values.
   * @param userLocation The user's actual location.
   * @returns A boolean indicating if the user's location matches the expected values.
   */
  SegmentEvaluator.prototype.valuesMatch = function (expectedLocationMap, userLocation) {
    return __awaiter(this, void 0, void 0, function () {
      var _i, _a, _b, key, value, normalizedValue1, normalizedValue2;
      return __generator(this, function (_c) {
        for (_i = 0, _a = Object.entries(expectedLocationMap); _i < _a.length; _i++) {
          _b = _a[_i], key = _b[0], value = _b[1];
          if (key in userLocation) {
            normalizedValue1 = this.normalizeValue(value);
            normalizedValue2 = this.normalizeValue(userLocation[key]);
            if (normalizedValue1 !== normalizedValue2) {
              return [2 /*return*/, false];
            }
          } else {
            return [2 /*return*/, false];
          }
        }
        return [2 /*return*/, true]; // If all values match, return true
      });
    });
  };
  /**
   * Normalizes a value to a consistent format for comparison.
   * @param value The value to normalize.
   * @returns The normalized value.
   */
  SegmentEvaluator.prototype.normalizeValue = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    // Remove quotes and trim whitespace
    return value.toString().replace(/^"|"$/g, '').trim();
  };
  return SegmentEvaluator;
}();
exports.SegmentEvaluator = SegmentEvaluator;

/***/ }),

/***/ "./dist/server-unpacked/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator.js":
/*!****************************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SegmentOperandEvaluator = void 0;
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
var SegmentUtil_1 = __webpack_require__(/*! ../utils/SegmentUtil */ "./dist/server-unpacked/packages/segmentation-evaluator/utils/SegmentUtil.js");
var SegmentOperandValueEnum_1 = __webpack_require__(/*! ../enums/SegmentOperandValueEnum */ "./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperandValueEnum.js");
var SegmentOperandRegexEnum_1 = __webpack_require__(/*! ../enums/SegmentOperandRegexEnum */ "./dist/server-unpacked/packages/segmentation-evaluator/enums/SegmentOperandRegexEnum.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var GatewayServiceUtil_1 = __webpack_require__(/*! ../../../utils/GatewayServiceUtil */ "./dist/server-unpacked/utils/GatewayServiceUtil.js");
var UrlEnum_1 = __webpack_require__(/*! ../../../enums/UrlEnum */ "./dist/server-unpacked/enums/UrlEnum.js");
var logger_1 = __webpack_require__(/*! ../../logger */ "./dist/server-unpacked/packages/logger/index.js");
/**
 * SegmentOperandEvaluator class provides methods to evaluate different types of DSL (Domain Specific Language)
 * expressions based on the segment conditions defined for custom variables, user IDs, and user agents.
 */
var SegmentOperandEvaluator = /** @class */function () {
  function SegmentOperandEvaluator() {}
  /**
   * Evaluates a custom variable DSL expression.
   * @param {Record<string, dynamic>} dslOperandValue - The DSL expression for the custom variable.
   * @param {Record<string, dynamic>} properties - The properties object containing the actual values to be matched against.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the DSL condition is met.
   */
  SegmentOperandEvaluator.prototype.evaluateCustomVariableDSL = function (dslOperandValue, properties) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, key, value, operandKey, operand, listIdRegex, match, tagValue, attributeValue, listId, queryParamsObj, res, error_1, tagValue, _b, operandType, operandValue, processedValues;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _a = (0, SegmentUtil_1.getKeyValue)(dslOperandValue), key = _a.key, value = _a.value;
            operandKey = key;
            operand = value;
            // Check if the property exists
            if (!Object.prototype.hasOwnProperty.call(properties, operandKey)) {
              return [2 /*return*/, false];
            }
            if (!operand.includes('inlist')) return [3 /*break*/, 5];
            listIdRegex = /inlist\(([^)]+)\)/;
            match = operand.match(listIdRegex);
            if (!match || match.length < 2) {
              logger_1.LogManager.Instance.error("Invalid 'inList' operand format");
              return [2 /*return*/, false];
            }
            tagValue = properties[operandKey];
            attributeValue = this.preProcessTagValue(tagValue);
            listId = match[1];
            queryParamsObj = {
              attribute: attributeValue,
              listId: listId
            };
            _c.label = 1;
          case 1:
            _c.trys.push([1, 3,, 4]);
            return [4 /*yield*/, (0, GatewayServiceUtil_1.getFromGatewayService)(queryParamsObj, UrlEnum_1.UrlEnum.ATTRIBUTE_CHECK)];
          case 2:
            res = _c.sent();
            if (!res || res === undefined || res === 'false' || res.status === 0) {
              return [2 /*return*/, false];
            }
            return [2 /*return*/, res];
          case 3:
            error_1 = _c.sent();
            logger_1.LogManager.Instance.error('Error while fetching data: ' + error_1);
            return [2 /*return*/, false];
          case 4:
            return [3 /*break*/, 6];
          case 5:
            tagValue = properties[operandKey];
            tagValue = this.preProcessTagValue(tagValue);
            _b = this.preProcessOperandValue(operand), operandType = _b.operandType, operandValue = _b.operandValue;
            processedValues = this.processValues(operandValue, tagValue);
            tagValue = processedValues.tagValue;
            return [2 /*return*/, this.extractResult(operandType, processedValues.operandValue, tagValue)];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Evaluates a user DSL expression to check if a user ID is in a specified list.
   * @param {Record<string, any>} dslOperandValue - The DSL expression containing user IDs.
   * @param {Record<string, dynamic>} properties - The properties object containing the actual user ID to check.
   * @returns {boolean} - True if the user ID is in the list, otherwise false.
   */
  SegmentOperandEvaluator.prototype.evaluateUserDSL = function (dslOperandValue, properties) {
    var users = dslOperandValue.split(',');
    for (var i = 0; i < users.length; i++) {
      if (users[i].trim() == properties._vwoUserId) {
        return true;
      }
    }
    return false;
  };
  /**
   * Evaluates a user agent DSL expression.
   * @param {Record<string, any>} dslOperandValue - The DSL expression for the user agent.
   * @param {any} context - The context object containing the user agent string.
   * @returns {boolean} - True if the user agent matches the DSL condition, otherwise false.
   */
  SegmentOperandEvaluator.prototype.evaluateUserAgentDSL = function (dslOperandValue, context) {
    var operand = dslOperandValue;
    if (!context.getUserAgent() || context.getUserAgent() === undefined) {
      logger_1.LogManager.Instance.info('To Evaluate UserAgent segmentation, please provide userAgent in context');
      return false;
    }
    var tagValue = decodeURIComponent(context.getUserAgent());
    var _a = this.preProcessOperandValue(operand),
      operandType = _a.operandType,
      operandValue = _a.operandValue;
    var processedValues = this.processValues(operandValue, tagValue);
    tagValue = processedValues.tagValue; // Fix: Type assertion to ensure tagValue is of type string
    return this.extractResult(operandType, processedValues.operandValue, tagValue);
  };
  /**
   * Pre-processes the tag value to ensure it is in the correct format for evaluation.
   * @param {any} tagValue - The value to be processed.
   * @returns {string | boolean} - The processed tag value, either as a string or a boolean.
   */
  SegmentOperandEvaluator.prototype.preProcessTagValue = function (tagValue) {
    // Default to empty string if undefined
    if (tagValue === undefined) {
      tagValue = '';
    }
    // Convert boolean values to boolean type
    if ((0, DataTypeUtil_1.isBoolean)(tagValue)) {
      tagValue = tagValue ? true : false;
    }
    // Convert all non-null values to string
    if (tagValue !== null) {
      tagValue = tagValue.toString();
    }
    return tagValue;
  };
  /**
   * Pre-processes the operand value to determine its type and extract the value based on regex matches.
   * @param {any} operand - The operand to be processed.
   * @returns {Record<string, any>} - An object containing the operand type and value.
   */
  SegmentOperandEvaluator.prototype.preProcessOperandValue = function (operand) {
    var operandType;
    var operandValue;
    // Determine the type of operand and extract value based on regex patterns
    if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LOWER_MATCH)) {
      operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.LOWER_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LOWER_MATCH);
    } else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.WILDCARD_MATCH)) {
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.WILDCARD_MATCH);
      var startingStar = (0, SegmentUtil_1.matchWithRegex)(operandValue, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.STARTING_STAR);
      var endingStar = (0, SegmentUtil_1.matchWithRegex)(operandValue, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.ENDING_STAR);
      // Determine specific wildcard type
      if (startingStar && endingStar) {
        operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE;
      } else if (startingStar) {
        operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.STARTING_STAR_VALUE;
      } else if (endingStar) {
        operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.ENDING_STAR_VALUE;
      }
      // Remove wildcard characters from the operand value
      operandValue = operandValue.replace(new RegExp(SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.STARTING_STAR), '').replace(new RegExp(SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.ENDING_STAR), '');
    } else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.REGEX_MATCH)) {
      operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.REGEX_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.REGEX_MATCH);
    } else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.GREATER_THAN_MATCH)) {
      operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.GREATER_THAN_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.GREATER_THAN_MATCH);
    } else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.GREATER_THAN_EQUAL_TO_MATCH)) {
      operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.GREATER_THAN_EQUAL_TO_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.GREATER_THAN_EQUAL_TO_MATCH);
    } else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LESS_THAN_MATCH)) {
      operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.LESS_THAN_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LESS_THAN_MATCH);
    } else if ((0, SegmentUtil_1.matchWithRegex)(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LESS_THAN_EQUAL_TO_MATCH)) {
      operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.LESS_THAN_EQUAL_TO_VALUE;
      operandValue = this.extractOperandValue(operand, SegmentOperandRegexEnum_1.SegmentOperandRegexEnum.LESS_THAN_EQUAL_TO_MATCH);
    } else {
      operandType = SegmentOperandValueEnum_1.SegmentOperandValueEnum.EQUAL_VALUE;
      operandValue = operand;
    }
    return {
      operandType: operandType,
      operandValue: operandValue
    };
  };
  /**
   * Extracts the operand value from a string based on a specified regex pattern.
   * @param {any} operand - The operand string to extract from.
   * @param {string} regex - The regex pattern to use for extraction.
   * @returns {string} - The extracted value.
   */
  SegmentOperandEvaluator.prototype.extractOperandValue = function (operand, regex) {
    // Match operand with regex and return the first capturing group
    return (0, SegmentUtil_1.matchWithRegex)(operand, regex) && (0, SegmentUtil_1.matchWithRegex)(operand, regex)[1];
  };
  /**
   * Processes numeric values from operand and tag values, converting them to strings.
   * @param {any} operandValue - The operand value to process.
   * @param {any} tagValue - The tag value to process.
   * @returns {Record<string, dynamic>} - An object containing the processed operand and tag values as strings.
   */
  SegmentOperandEvaluator.prototype.processValues = function (operandValue, tagValue) {
    // Convert operand and tag values to floats
    var processedOperandValue = parseFloat(operandValue);
    var processedTagValue = parseFloat(tagValue);
    // Return original values if conversion fails
    if (!processedOperandValue || !processedTagValue) {
      return {
        operandValue: operandValue,
        tagValue: tagValue
      };
    }
    // now we have surity that both are numbers
    // now we can convert them independently to int type if they
    // are int rather than floats
    // if (processedOperandValue === Math.floor(processedOperandValue)) {
    //   processedOperandValue = parseInt(processedOperandValue, 10);
    // }
    // if (processedTagValue === Math.floor(processedTagValue)) {
    //   processedTagValue = parseInt(processedTagValue, 10);
    // }
    // Convert numeric values back to strings
    return {
      operandValue: processedOperandValue.toString(),
      tagValue: processedTagValue.toString()
    };
  };
  /**
   * Extracts the result of the evaluation based on the operand type and values.
   * @param {SegmentOperandValueEnum} operandType - The type of the operand.
   * @param {any} operandValue - The value of the operand.
   * @param {any} tagValue - The value of the tag to compare against.
   * @returns {boolean} - The result of the evaluation.
   */
  SegmentOperandEvaluator.prototype.extractResult = function (operandType, operandValue, tagValue) {
    var result;
    switch (operandType) {
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.LOWER_VALUE:
        // Check if both values are equal, ignoring case
        if (tagValue !== null) {
          result = operandValue.toLowerCase() === tagValue.toLowerCase();
        }
        break;
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.STARTING_ENDING_STAR_VALUE:
        // Check if the tagValue contains the operandValue
        if (tagValue !== null) {
          result = tagValue.indexOf(operandValue) > -1;
        }
        break;
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.STARTING_STAR_VALUE:
        // Check if the tagValue ends with the operandValue
        if (tagValue !== null) {
          result = tagValue.endsWith(operandValue);
        }
        break;
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.ENDING_STAR_VALUE:
        // Check if the tagValue starts with the operandValue
        if (tagValue !== null) {
          result = tagValue.startsWith(operandValue);
        }
        break;
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.REGEX_VALUE:
        // Evaluate the tagValue against the regex pattern of operandValue
        try {
          var pattern = new RegExp(operandValue, 'g');
          result = !!pattern.test(tagValue);
        } catch (err) {
          result = false;
        }
        break;
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.GREATER_THAN_VALUE:
        if (tagValue !== null) {
          try {
            result = parseFloat(operandValue) < parseFloat(tagValue);
          } catch (err) {
            result = false;
          }
        }
        break;
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.GREATER_THAN_EQUAL_TO_VALUE:
        if (tagValue !== null) {
          try {
            result = parseFloat(operandValue) <= parseFloat(tagValue);
          } catch (err) {
            result = false;
          }
        }
        break;
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.LESS_THAN_VALUE:
        if (tagValue !== null) {
          try {
            result = parseFloat(operandValue) > parseFloat(tagValue);
          } catch (err) {
            result = false;
          }
        }
        break;
      case SegmentOperandValueEnum_1.SegmentOperandValueEnum.LESS_THAN_EQUAL_TO_VALUE:
        if (tagValue !== null) {
          try {
            result = parseFloat(operandValue) >= parseFloat(tagValue);
          } catch (err) {
            result = false;
          }
        }
        break;
      default:
        // Check if the tagValue is exactly equal to the operandValue
        result = tagValue === operandValue;
    }
    return result;
  };
  return SegmentOperandEvaluator;
}();
exports.SegmentOperandEvaluator = SegmentOperandEvaluator;

/***/ }),

/***/ "./dist/server-unpacked/packages/segmentation-evaluator/index.js":
/*!***********************************************************************!*\
  !*** ./dist/server-unpacked/packages/segmentation-evaluator/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SegmentEvaluator = exports.SegmentationManager = void 0;
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
var SegmentationManger_1 = __webpack_require__(/*! ./core/SegmentationManger */ "./dist/server-unpacked/packages/segmentation-evaluator/core/SegmentationManger.js");
Object.defineProperty(exports, "SegmentationManager", ({
  enumerable: true,
  get: function () {
    return SegmentationManger_1.SegmentationManager;
  }
}));
var SegmentEvaluator_1 = __webpack_require__(/*! ./evaluators/SegmentEvaluator */ "./dist/server-unpacked/packages/segmentation-evaluator/evaluators/SegmentEvaluator.js");
Object.defineProperty(exports, "SegmentEvaluator", ({
  enumerable: true,
  get: function () {
    return SegmentEvaluator_1.SegmentEvaluator;
  }
}));

/***/ }),

/***/ "./dist/server-unpacked/packages/segmentation-evaluator/utils/SegmentUtil.js":
/*!***********************************************************************************!*\
  !*** ./dist/server-unpacked/packages/segmentation-evaluator/utils/SegmentUtil.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getKeyValue = getKeyValue;
exports.matchWithRegex = matchWithRegex;
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
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
/**
 * Extracts the first key-value pair from the provided object.
 * @param {Record<string, any>} obj - The object from which to extract the key-value pair.
 * @returns {Record<string, any> | undefined} An object containing the first key and value, or undefined if input is not an object.
 */
function getKeyValue(obj) {
  // Check if the input is a valid object using isObject utility function
  if (!(0, DataTypeUtil_1.isObject)(obj)) {
    return;
  }
  // Extract the first key from the object
  var key = Object.keys(obj)[0];
  // Retrieve the value associated with the first key
  var value = obj[key];
  // Return an object containing the key and value
  return {
    key: key,
    value: value
  };
}
/**
 * Matches a string against a regular expression and returns the match result.
 * @param {string} string - The string to match against the regex.
 * @param {string} regex - The regex pattern as a string.
 * @returns {RegExpMatchArray | null} The results of the regex match, or null if an error occurs.
 */
function matchWithRegex(string, regex) {
  try {
    // Attempt to match the string with the regex
    return string.match(new RegExp(regex));
  } catch (err) {
    // Return null if an error occurs during regex matching
    return null;
  }
}

/***/ }),

/***/ "./dist/server-unpacked/packages/storage/Connector.js":
/*!************************************************************!*\
  !*** ./dist/server-unpacked/packages/storage/Connector.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Connector = void 0;
var Connector = /** @class */function () {
  function Connector() {}
  return Connector;
}();
exports.Connector = Connector;

/***/ }),

/***/ "./dist/server-unpacked/packages/storage/Storage.js":
/*!**********************************************************!*\
  !*** ./dist/server-unpacked/packages/storage/Storage.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Storage = void 0;
// TODO: move to file
// enum ConnectorEnum {
//   MEMORY = 'memory',
//   REDIS = 'redis'
// }
var Storage = /** @class */function () {
  function Storage() {}
  // public storageType: dynamic;
  Storage.prototype.attachConnector = function (connector) {
    var _a, _b, _c, _d;
    if (((_d = (_c = (_b = (_a = connector === null || connector === void 0 ? void 0 : connector.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.substring(0, 5)) === 'class') {
      this.connector = new connector();
    } else {
      this.connector = connector;
    }
    return this.connector;
  };
  Object.defineProperty(Storage, "Instance", {
    get: function () {
      this.instance = this.instance || new Storage();
      return this.instance;
    },
    enumerable: false,
    configurable: true
  });
  Storage.prototype.getConnector = function () {
    return this.connector;
  };
  return Storage;
}();
exports.Storage = Storage;

/***/ }),

/***/ "./dist/server-unpacked/packages/storage/connectors/BrowserStorageConnector.js":
/*!*************************************************************************************!*\
  !*** ./dist/server-unpacked/packages/storage/connectors/BrowserStorageConnector.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BrowserStorageConnector = void 0;
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
var constants_1 = __webpack_require__(/*! ../../../constants */ "./dist/server-unpacked/constants/index.js");
var PromiseUtil_1 = __webpack_require__(/*! ../../../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var logger_1 = __webpack_require__(/*! ../../logger */ "./dist/server-unpacked/packages/logger/index.js");
var SettingsService_1 = __webpack_require__(/*! ../../../services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var SettingsSchemaValidation_1 = __webpack_require__(/*! ../../../models/schemas/SettingsSchemaValidation */ "./dist/server-unpacked/models/schemas/SettingsSchemaValidation.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../../../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
var BrowserStorageConnector = /** @class */function () {
  /**
   * Creates an instance of BrowserStorageConnector
   * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
   * @param {string} [options.key] - Custom key for storage (defaults to Constants.DEFAULT_LOCAL_STORAGE_KEY)
   * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
   * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
   * @param {boolean} [options.alwaysUseCachedSettings] - Whether to always use cached settings
   * @param {number} [options.ttl] - Custom TTL in milliseconds (defaults to Constants.SETTINGS_TTL)
   */
  function BrowserStorageConnector(options) {
    this.SETTINGS_KEY = constants_1.Constants.DEFAULT_SETTINGS_STORAGE_KEY;
    this.storageKey = (options === null || options === void 0 ? void 0 : options.key) || constants_1.Constants.DEFAULT_LOCAL_STORAGE_KEY;
    this.storage = (options === null || options === void 0 ? void 0 : options.provider) || window.localStorage;
    this.isDisabled = (options === null || options === void 0 ? void 0 : options.isDisabled) || false;
    this.alwaysUseCachedSettings = (options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings) || false;
    //options.ttl should be greater than 1 minute
    if (!(0, DataTypeUtil_1.isNumber)(options === null || options === void 0 ? void 0 : options.ttl) || options.ttl < constants_1.Constants.MIN_TTL_MS) {
      logger_1.LogManager.Instance.debug('TTL is not passed or invalid (less than 1 minute), using default value of 2 hours');
      this.ttl = constants_1.Constants.SETTINGS_TTL;
    } else {
      this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || constants_1.Constants.SETTINGS_TTL;
    }
    if (!(0, DataTypeUtil_1.isBoolean)(options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings)) {
      logger_1.LogManager.Instance.debug('AlwaysUseCachedSettings is not passed or invalid, using default value of false');
      this.alwaysUseCachedSettings = false;
    } else {
      this.alwaysUseCachedSettings = (options === null || options === void 0 ? void 0 : options.alwaysUseCachedSettings) || false;
    }
  }
  /**
   * Retrieves all stored data from the storage
   * @private
   * @returns {Record<string, StorageData>} Object containing all stored data
   */
  BrowserStorageConnector.prototype.getStoredData = function () {
    if (this.isDisabled) return {};
    try {
      var data = this.storage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      logger_1.LogManager.Instance.error("Error reading from storage: ".concat(error));
      return {};
    }
  };
  /**
   * Saves data to the storage
   * @private
   * @param {Record<string, StorageData>} data - The data object to be stored
   */
  BrowserStorageConnector.prototype.storeData = function (data) {
    if (this.isDisabled) return;
    try {
      var serializedData = JSON.stringify(data);
      this.storage.setItem(this.storageKey, serializedData);
    } catch (error) {
      logger_1.LogManager.Instance.error("Error writing to storage: ".concat(error));
    }
  };
  /**
   * Stores feature flag or experiment data for a specific user
   * @public
   * @param {StorageData} data - The data to be stored, containing feature flag or experiment information
   * @returns {Promise<void>} A promise that resolves when the data is successfully stored
   */
  BrowserStorageConnector.prototype.set = function (data) {
    var deferredObject = new PromiseUtil_1.Deferred();
    if (this.isDisabled) {
      deferredObject.resolve();
    } else {
      try {
        var storedData = this.getStoredData();
        var key = "".concat(data.featureKey, "_").concat(data.userId);
        storedData[key] = data;
        this.storeData(storedData);
        logger_1.LogManager.Instance.info("Stored data in storage for key: ".concat(key));
        deferredObject.resolve();
      } catch (error) {
        logger_1.LogManager.Instance.error("Error storing data: ".concat(error));
        deferredObject.reject(error);
      }
    }
    return deferredObject.promise;
  };
  /**
   * Retrieves stored feature flag or experiment data for a specific user
   * @public
   * @param {string} featureKey - The key of the feature flag or experiment
   * @param {string} userId - The ID of the user
   * @returns {Promise<StorageData | Record<string, any>>} A promise that resolves to the stored data or {} if not found
   */
  BrowserStorageConnector.prototype.get = function (featureKey, userId) {
    var _a;
    var deferredObject = new PromiseUtil_1.Deferred();
    if (this.isDisabled) {
      deferredObject.resolve({});
    } else {
      try {
        var storedData = this.getStoredData();
        var key = "".concat(featureKey, "_").concat(userId);
        var dataToReturn = (_a = storedData[key]) !== null && _a !== void 0 ? _a : {};
        logger_1.LogManager.Instance.info("Retrieved data from storage for key: ".concat(key));
        deferredObject.resolve(dataToReturn);
      } catch (error) {
        logger_1.LogManager.Instance.error("Error retrieving data: ".concat(error));
        deferredObject.resolve({});
      }
    }
    return deferredObject.promise;
  };
  /**
   * Gets the settings from storage with TTL check and validates sdkKey and accountId
   * @public
   * @param {string} sdkKey - The sdkKey to match
   * @param {number|string} accountId - The accountId to match
   * @returns {Promise<Record<string, any> | null>} A promise that resolves to the settings or null if expired/not found/mismatch
   */
  BrowserStorageConnector.prototype.getSettingsFromStorage = function (sdkKey, accountId) {
    var _a;
    var deferredObject = new PromiseUtil_1.Deferred();
    if (this.isDisabled) {
      deferredObject.resolve(null);
    } else {
      try {
        var storedData = this.getStoredData();
        var settingsData = storedData[this.SETTINGS_KEY];
        if (!settingsData) {
          deferredObject.resolve(null);
          return deferredObject.promise;
        }
        var data = settingsData.data,
          timestamp = settingsData.timestamp;
        var currentTime = Date.now();
        // Decode sdkKey if present
        if (data && data.sdkKey) {
          try {
            data.sdkKey = atob(data.sdkKey);
          } catch (e) {
            logger_1.LogManager.Instance.error('Failed to decode sdkKey from storage');
          }
        }
        // Check for sdkKey and accountId match
        if (!data || data.sdkKey !== sdkKey || String((_a = data.accountId) !== null && _a !== void 0 ? _a : data.a) !== String(accountId)) {
          logger_1.LogManager.Instance.info('Cached settings do not match sdkKey/accountId, treating as cache miss');
          deferredObject.resolve(null);
          return deferredObject.promise;
        }
        if (this.alwaysUseCachedSettings) {
          logger_1.LogManager.Instance.info('Using cached settings as alwaysUseCachedSettings is enabled');
          deferredObject.resolve(data);
          return deferredObject.promise;
        }
        if (currentTime - timestamp > this.ttl) {
          logger_1.LogManager.Instance.info('Settings have expired, need to fetch new settings');
          deferredObject.resolve(null);
        } else {
          // if settings are valid then return the existing settings and update the settings in storage with new timestamp
          logger_1.LogManager.Instance.info('Retrieved valid settings from storage');
          this.setFreshSettingsInStorage();
          // Decode sdkKey if present
          if (data && data.sdkKey) {
            try {
              data.sdkKey = atob(data.sdkKey);
            } catch (e) {
              logger_1.LogManager.Instance.error('Failed to decode sdkKey from storage');
            }
          }
          deferredObject.resolve(data);
        }
      } catch (error) {
        logger_1.LogManager.Instance.error("Error retrieving settings: ".concat(error));
        deferredObject.resolve(null);
      }
    }
    return deferredObject.promise;
  };
  /**
   * Fetches fresh settings and updates the storage with a new timestamp
   */
  BrowserStorageConnector.prototype.setFreshSettingsInStorage = function () {
    var _this = this;
    // Fetch fresh settings asynchronously and update storage
    var settingsService = SettingsService_1.SettingsService.Instance;
    if (settingsService) {
      settingsService.fetchSettings().then(function (freshSettings) {
        return __awaiter(_this, void 0, void 0, function () {
          var isSettingsValid;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                if (!freshSettings) return [3 /*break*/, 2];
                isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(freshSettings);
                if (!isSettingsValid) return [3 /*break*/, 2];
                return [4 /*yield*/, this.setSettingsInStorage(freshSettings)];
              case 1:
                _a.sent();
                logger_1.LogManager.Instance.info('Settings updated with fresh data from server');
                _a.label = 2;
              case 2:
                return [2 /*return*/];
            }
          });
        });
      }).catch(function (error) {
        logger_1.LogManager.Instance.error("Error fetching fresh settings: ".concat(error));
      });
    }
  };
  /**
   * Sets the settings in storage with current timestamp
   * @public
   * @param {Record<string, any>} settings - The settings data to be stored
   * @returns {Promise<void>} A promise that resolves when the settings are successfully stored
   */
  BrowserStorageConnector.prototype.setSettingsInStorage = function (settings) {
    var deferredObject = new PromiseUtil_1.Deferred();
    if (this.isDisabled) {
      deferredObject.resolve();
    } else {
      try {
        var storedData = this.getStoredData();
        // Clone settings to avoid mutating the original object
        var settingsToStore = __assign({}, settings);
        if (settingsToStore.sdkKey) {
          settingsToStore.sdkKey = btoa(settingsToStore.sdkKey);
        }
        storedData[this.SETTINGS_KEY] = {
          data: settingsToStore,
          timestamp: Date.now()
        };
        this.storeData(storedData);
        logger_1.LogManager.Instance.info('Settings stored successfully in storage');
        deferredObject.resolve();
      } catch (error) {
        logger_1.LogManager.Instance.error("Error storing settings: ".concat(error));
        deferredObject.reject(error);
      }
    }
    return deferredObject.promise;
  };
  return BrowserStorageConnector;
}();
exports.BrowserStorageConnector = BrowserStorageConnector;

/***/ }),

/***/ "./dist/server-unpacked/packages/storage/index.js":
/*!********************************************************!*\
  !*** ./dist/server-unpacked/packages/storage/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Storage = void 0;
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
var Storage_1 = __webpack_require__(/*! ./Storage */ "./dist/server-unpacked/packages/storage/Storage.js");
Object.defineProperty(exports, "Storage", ({
  enumerable: true,
  get: function () {
    return Storage_1.Storage;
  }
}));

/***/ }),

/***/ "./dist/server-unpacked/services/BatchEventsQueue.js":
/*!***********************************************************!*\
  !*** ./dist/server-unpacked/services/BatchEventsQueue.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



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
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BatchEventsQueue = void 0;
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var BatchEventsQueue = /** @class */function () {
  /**
   * Constructor for the BatchEventsQueue
   * @param config - The configuration for the batch events queue
   */
  function BatchEventsQueue(config) {
    if (config === void 0) {
      config = {};
    }
    this.queue = [];
    this.timer = null;
    if ((0, DataTypeUtil_1.isNumber)(config.requestTimeInterval) && config.requestTimeInterval >= 1) {
      this.requestTimeInterval = config.requestTimeInterval;
    } else {
      this.requestTimeInterval = constants_1.Constants.DEFAULT_REQUEST_TIME_INTERVAL;
      logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
        parameter: 'requestTimeInterval',
        minLimit: 0,
        defaultValue: this.requestTimeInterval.toString()
      }));
    }
    if ((0, DataTypeUtil_1.isNumber)(config.eventsPerRequest) && config.eventsPerRequest > 0 && config.eventsPerRequest <= constants_1.Constants.MAX_EVENTS_PER_REQUEST) {
      this.eventsPerRequest = config.eventsPerRequest;
    } else if (config.eventsPerRequest > constants_1.Constants.MAX_EVENTS_PER_REQUEST) {
      this.eventsPerRequest = constants_1.Constants.MAX_EVENTS_PER_REQUEST;
      logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_MAX_LIMIT, {
        parameter: 'eventsPerRequest',
        maxLimit: constants_1.Constants.MAX_EVENTS_PER_REQUEST.toString()
      }));
    } else {
      this.eventsPerRequest = constants_1.Constants.DEFAULT_EVENTS_PER_REQUEST;
      logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
        parameter: 'eventsPerRequest',
        minLimit: 0,
        defaultValue: this.eventsPerRequest.toString()
      }));
    }
    this.flushCallback = (0, DataTypeUtil_1.isFunction)(config.flushCallback) ? config.flushCallback : function () {};
    this.dispatcher = config.dispatcher;
    this.accountId = SettingsService_1.SettingsService.Instance.accountId;
    this.createNewBatchTimer();
    BatchEventsQueue.instance = this;
    return this;
  }
  Object.defineProperty(BatchEventsQueue, "Instance", {
    /**
     * Gets the instance of the BatchEventsQueue
     * @returns The instance of the BatchEventsQueue
     */
    get: function () {
      return BatchEventsQueue.instance;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Enqueues an event
   * @param payload - The event to enqueue
   */
  BatchEventsQueue.prototype.enqueue = function (payload) {
    // Enqueue the event in the queue
    this.queue.push(payload);
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_QUEUE, {
      queueType: 'batch',
      event: JSON.stringify(payload)
    }));
    // If the queue length is equal to or exceeds the events per request, flush the queue
    if (this.queue.length >= this.eventsPerRequest) {
      this.flush();
    }
  };
  /**
   * Flushes the queue
   * @param manual - Whether the flush is manual or not
   */
  BatchEventsQueue.prototype.flush = function (manual) {
    var _this = this;
    if (manual === void 0) {
      manual = false;
    }
    // If the queue is not empty, flush the queue
    if (this.queue.length) {
      logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EVENT_BATCH_BEFORE_FLUSHING, {
        manually: manual ? 'manually' : '',
        length: this.queue.length,
        accountId: this.accountId,
        timer: manual ? 'Timer will be cleared and registered again' : ''
      }));
      var tempQueue_1 = this.queue;
      this.queue = [];
      return this.dispatcher(tempQueue_1, this.flushCallback).then(function (result) {
        var _a;
        if (result.status === 'success') {
          logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_After_FLUSHING, {
            manually: manual ? 'manually' : '',
            length: tempQueue_1.length
          }));
          return result;
        } else {
          (_a = _this.queue).push.apply(_a, tempQueue_1);
          return result;
        }
      }).catch(function () {
        var _a;
        (_a = _this.queue).push.apply(_a, tempQueue_1);
        return {
          status: 'error',
          events: tempQueue_1
        };
      });
    } else {
      logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.BATCH_QUEUE_EMPTY));
      return new Promise(function (resolve) {
        resolve({
          status: 'success',
          events: []
        });
      });
    }
  };
  /**
   * Creates a new batch timer
   */
  BatchEventsQueue.prototype.createNewBatchTimer = function () {
    var _this = this;
    this.timer = setInterval(function () {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, this.flush()];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    }, this.requestTimeInterval * 1000);
  };
  /**
   * Clears the request timer
   */
  BatchEventsQueue.prototype.clearRequestTimer = function () {
    clearTimeout(this.timer);
    this.timer = null;
  };
  /**
   * Flushes the queue and clears the timer
   */
  BatchEventsQueue.prototype.flushAndClearTimer = function () {
    var flushResult = this.flush(true);
    return flushResult;
  };
  return BatchEventsQueue;
}();
exports.BatchEventsQueue = BatchEventsQueue;
exports["default"] = BatchEventsQueue;

/***/ }),

/***/ "./dist/server-unpacked/services/CampaignDecisionService.js":
/*!******************************************************************!*\
  !*** ./dist/server-unpacked/services/CampaignDecisionService.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CampaignDecisionService = void 0;
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
var decision_maker_1 = __webpack_require__(/*! ../packages/decision-maker */ "./dist/server-unpacked/packages/decision-maker/index.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var segmentation_evaluator_1 = __webpack_require__(/*! ../packages/segmentation-evaluator */ "./dist/server-unpacked/packages/segmentation-evaluator/index.js");
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./dist/server-unpacked/enums/CampaignTypeEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var CampaignDecisionService = /** @class */function () {
  function CampaignDecisionService() {}
  /**
   * Calculate if this user should become part of the campaign or not
   *
   * @param {String} userId the unique ID assigned to a user
   * @param {Object} campaign fot getting the value of traffic allotted to the campaign
   *
   * @return {Boolean} if User is a part of Campaign or not
   */
  CampaignDecisionService.prototype.isUserPartOfCampaign = function (userId, campaign) {
    // if (!ValidateUtil.isValidValue(userId) || !campaign) {
    //   return false;
    // }
    if (!campaign || !userId) {
      return false;
    }
    // check if campaign is rollout or personalize
    var isRolloutOrPersonalize = campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
    // get salt
    var salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
    // get traffic allocation
    var trafficAllocation = isRolloutOrPersonalize ? campaign.getVariations()[0].getWeight() : campaign.getTraffic();
    // get bucket key
    var bucketKey = salt ? "".concat(salt, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(userId);
    // get bucket value for user
    var valueAssignedToUser = new decision_maker_1.DecisionMaker().getBucketValueForUser(bucketKey);
    // check if user is part of campaign
    var isUserPart = valueAssignedToUser !== 0 && valueAssignedToUser <= trafficAllocation;
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_PART_OF_CAMPAIGN, {
      userId: userId,
      notPart: isUserPart ? '' : 'not',
      campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey()
    }));
    return isUserPart;
  };
  /**
   * Returns the Variation by checking the Start and End Bucket Allocations of each Variation
   *
   * @param {Object} campaign which contains the variations
   * @param {Number} bucketValue the bucket Value of the user
   *
   * @return {Object|null} variation data allotted to the user or null if not
   */
  CampaignDecisionService.prototype.getVariation = function (variations, bucketValue) {
    for (var i = 0; i < variations.length; i++) {
      var variation = variations[i];
      if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
        return variation;
      }
    }
    return null;
  };
  CampaignDecisionService.prototype.checkInRange = function (variation, bucketValue) {
    if (bucketValue >= variation.getStartRangeVariation() && bucketValue <= variation.getEndRangeVariation()) {
      return variation;
    }
  };
  /**
   * Validates the User ID and generates Variation into which the User is bucketed in.
   *
   * @param {String} userId the unique ID assigned to User
   * @param {Object} campaign the Campaign of which User is a part of
   *
   * @return {Object|null} variation data into which user is bucketed in or null if not
   */
  CampaignDecisionService.prototype.bucketUserToVariation = function (userId, accountId, campaign) {
    var multiplier;
    if (!campaign || !userId) {
      return null;
    }
    if (campaign.getTraffic()) {
      multiplier = 1;
    }
    var percentTraffic = campaign.getTraffic();
    // get salt
    var salt = campaign.getSalt();
    // get bucket key
    var bucketKey = salt ? "".concat(salt, "_").concat(accountId, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(accountId, "_").concat(userId);
    // get hash value
    var hashValue = new decision_maker_1.DecisionMaker().generateHashValue(bucketKey);
    var bucketValue = new decision_maker_1.DecisionMaker().generateBucketValue(hashValue, constants_1.Constants.MAX_TRAFFIC_VALUE, multiplier);
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USER_BUCKET_TO_VARIATION, {
      userId: userId,
      campaignKey: campaign.getKey(),
      percentTraffic: percentTraffic,
      bucketValue: bucketValue,
      hashValue: hashValue
    }));
    return this.getVariation(campaign.getVariations(), bucketValue);
  };
  CampaignDecisionService.prototype.getPreSegmentationDecision = function (campaign, context) {
    return __awaiter(this, void 0, void 0, function () {
      var campaignType, segments, preSegmentationResult;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            campaignType = campaign.getType();
            segments = {};
            if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
              segments = campaign.getVariations()[0].getSegments();
            } else if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
              segments = campaign.getSegments();
            }
            if (!((0, DataTypeUtil_1.isObject)(segments) && !Object.keys(segments).length)) return [3 /*break*/, 1];
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_SKIP, {
              userId: context.getId(),
              campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey()
            }));
            return [2 /*return*/, true];
          case 1:
            return [4 /*yield*/, segmentation_evaluator_1.SegmentationManager.Instance.validateSegmentation(segments, context.getCustomVariables())];
          case 2:
            preSegmentationResult = _a.sent();
            if (!preSegmentationResult) {
              logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_STATUS, {
                userId: context.getId(),
                campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey(),
                status: 'failed'
              }));
              return [2 /*return*/, false];
            }
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SEGMENTATION_STATUS, {
              userId: context.getId(),
              campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey(),
              status: 'passed'
            }));
            return [2 /*return*/, true];
        }
      });
    });
  };
  CampaignDecisionService.prototype.getVariationAlloted = function (userId, accountId, campaign) {
    var isUserPart = this.isUserPartOfCampaign(userId, campaign);
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
      if (isUserPart) {
        return campaign.getVariations()[0];
      } else {
        return null;
      }
    } else {
      if (isUserPart) {
        return this.bucketUserToVariation(userId, accountId, campaign);
      } else {
        return null;
      }
    }
  };
  return CampaignDecisionService;
}();
exports.CampaignDecisionService = CampaignDecisionService;

/***/ }),

/***/ "./dist/server-unpacked/services/HooksService.js":
/*!*******************************************************!*\
  !*** ./dist/server-unpacked/services/HooksService.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var HooksService = /** @class */function () {
  function HooksService(options) {
    var _a;
    this.callback = (_a = options.integrations) === null || _a === void 0 ? void 0 : _a.callback;
    this.isCallBackFunction = (0, DataTypeUtil_1.isFunction)(this.callback);
    this.decision = {};
  }
  /**
   * Executes the callback
   * @param {Record<string, any>} properties Properties from the callback
   */
  HooksService.prototype.execute = function (properties) {
    if (this.isCallBackFunction) {
      this.callback(properties);
    }
  };
  /**
   * Sets properties to the decision object
   * @param {Record<string, any>} properties Properties to set
   */
  HooksService.prototype.set = function (properties) {
    if (this.isCallBackFunction) {
      this.decision = properties;
    }
  };
  /**
   * Retrieves the decision object
   * @returns {Record<string, any>} The decision object
   */
  HooksService.prototype.get = function () {
    return this.decision;
  };
  return HooksService;
}();
exports["default"] = HooksService;

/***/ }),

/***/ "./dist/server-unpacked/services/SettingsService.js":
/*!**********************************************************!*\
  !*** ./dist/server-unpacked/services/SettingsService.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SettingsService = void 0;
var storage_1 = __webpack_require__(/*! ../packages/storage */ "./dist/server-unpacked/packages/storage/index.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./dist/server-unpacked/packages/network-layer/index.js");
var PromiseUtil_1 = __webpack_require__(/*! ../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var Url_1 = __webpack_require__(/*! ../constants/Url */ "./dist/server-unpacked/constants/Url.js");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./dist/server-unpacked/enums/HttpMethodEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var SettingsSchemaValidation_1 = __webpack_require__(/*! ../models/schemas/SettingsSchemaValidation */ "./dist/server-unpacked/models/schemas/SettingsSchemaValidation.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var NetworkUtil_1 = __webpack_require__(/*! ../utils/NetworkUtil */ "./dist/server-unpacked/utils/NetworkUtil.js");
var SettingsService = /** @class */function () {
  function SettingsService(options) {
    var _a, _b, _c, _d, _e, _f;
    this.isGatewayServiceProvided = false;
    this.proxyProvided = false;
    this.gatewayServiceConfig = {
      hostname: null,
      protocol: null,
      port: null
    };
    this.sdkKey = options.sdkKey;
    this.accountId = options.accountId;
    this.expiry = ((_a = options === null || options === void 0 ? void 0 : options.settings) === null || _a === void 0 ? void 0 : _a.expiry) || constants_1.Constants.SETTINGS_EXPIRY;
    this.networkTimeout = ((_b = options === null || options === void 0 ? void 0 : options.settings) === null || _b === void 0 ? void 0 : _b.timeout) || constants_1.Constants.SETTINGS_TIMEOUT;
    // if sdk is running in browser environment then set isGatewayServiceProvided to true
    // when gatewayService is not provided then we dont update the url and let it point to dacdn by default
    // Check if sdk running in browser and not in edge/serverless environment
    if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
      this.isGatewayServiceProvided = true;
      // Handle proxyUrl for browser environment
      if (options === null || options === void 0 ? void 0 : options.proxyUrl) {
        this.proxyProvided = true;
        var parsedUrl = void 0;
        if (options.proxyUrl.startsWith(Url_1.HTTP_PROTOCOL) || options.proxyUrl.startsWith(Url_1.HTTPS_PROTOCOL)) {
          parsedUrl = new URL("".concat(options.proxyUrl));
        } else {
          parsedUrl = new URL("".concat(Url_1.HTTPS_PROTOCOL).concat(options.proxyUrl));
        }
        this.hostname = parsedUrl.hostname;
        this.protocol = parsedUrl.protocol.replace(':', '');
        if (parsedUrl.port) {
          this.port = parseInt(parsedUrl.port);
        }
      }
    }
    //if gateway is provided and proxy is not provided then only we will replace the hostname, protocol and port
    if ((_c = options === null || options === void 0 ? void 0 : options.gatewayService) === null || _c === void 0 ? void 0 : _c.url) {
      var parsedUrl = void 0;
      this.isGatewayServiceProvided = true;
      if (options.gatewayService.url.startsWith(Url_1.HTTP_PROTOCOL) || options.gatewayService.url.startsWith(Url_1.HTTPS_PROTOCOL)) {
        parsedUrl = new URL("".concat(options.gatewayService.url));
      } else if ((_d = options.gatewayService) === null || _d === void 0 ? void 0 : _d.protocol) {
        parsedUrl = new URL("".concat(options.gatewayService.protocol, "://").concat(options.gatewayService.url));
      } else {
        parsedUrl = new URL("".concat(Url_1.HTTPS_PROTOCOL).concat(options.gatewayService.url));
      }
      // dont replace the hostname, protocol and port if proxy is provided
      if (!this.proxyProvided) {
        this.hostname = parsedUrl.hostname;
        this.protocol = parsedUrl.protocol.replace(':', '');
        if (parsedUrl.port) {
          this.port = parseInt(parsedUrl.port);
        } else if ((_e = options.gatewayService) === null || _e === void 0 ? void 0 : _e.port) {
          this.port = options.gatewayService.port;
        }
      } else {
        this.gatewayServiceConfig.hostname = parsedUrl.hostname;
        this.gatewayServiceConfig.protocol = parsedUrl.protocol.replace(':', '');
        if (parsedUrl.port) {
          this.gatewayServiceConfig.port = parseInt(parsedUrl.port);
        } else if ((_f = options.gatewayService) === null || _f === void 0 ? void 0 : _f.port) {
          this.gatewayServiceConfig.port = options.gatewayService.port;
        }
      }
    } else {
      if (!this.proxyProvided) {
        this.hostname = constants_1.Constants.HOST_NAME;
      }
    }
    // if (this.expiry > 0) {
    //   this.setSettingsExpiry();
    // }
    logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
      service: 'Settings Manager'
    }));
    SettingsService.instance = this;
  }
  Object.defineProperty(SettingsService, "Instance", {
    get: function () {
      return SettingsService.instance;
    },
    enumerable: false,
    configurable: true
  });
  SettingsService.prototype.setSettingsExpiry = function () {
    var _this = this;
    var settingsTimeout = setTimeout(function () {
      _this.fetchSettingsAndCacheInStorage().then(function () {
        clearTimeout(settingsTimeout);
        // again set the timer
        // NOTE: setInterval could be used but it will not consider the time required to fetch settings
        // This breaks the timer rythm and also sends more call than required
        _this.setSettingsExpiry();
      });
    }, this.expiry);
  };
  SettingsService.prototype.normalizeSettings = function (settings) {
    return __awaiter(this, void 0, void 0, function () {
      var normalizedSettings;
      return __generator(this, function (_a) {
        normalizedSettings = __assign({}, settings);
        if (!normalizedSettings.features || Object.keys(normalizedSettings.features).length === 0) {
          normalizedSettings.features = [];
        }
        if (!normalizedSettings.campaigns || Object.keys(normalizedSettings.campaigns).length === 0) {
          normalizedSettings.campaigns = [];
        }
        return [2 /*return*/, normalizedSettings];
      });
    });
  };
  SettingsService.prototype.handleBrowserEnvironment = function (storageConnector, deferredObject) {
    return __awaiter(this, void 0, void 0, function () {
      var cachedSettings, freshSettings, normalizedSettings, isSettingsValid, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 6,, 7]);
            return [4 /*yield*/, storageConnector.getSettingsFromStorage(this.sdkKey, this.accountId)];
          case 1:
            cachedSettings = _a.sent();
            if (cachedSettings) {
              logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_FROM_CACHE));
              deferredObject.resolve(cachedSettings);
            } else {
              logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_CACHE_MISS));
            }
            return [4 /*yield*/, this.fetchSettings()];
          case 2:
            freshSettings = _a.sent();
            return [4 /*yield*/, this.normalizeSettings(freshSettings)];
          case 3:
            normalizedSettings = _a.sent();
            isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings);
            if (!isSettingsValid) return [3 /*break*/, 5];
            return [4 /*yield*/, storageConnector.setSettingsInStorage(normalizedSettings)];
          case 4:
            _a.sent();
            _a.label = 5;
          case 5:
            if (cachedSettings) {
              logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_BACKGROUND_UPDATE));
            } else {
              logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
              deferredObject.resolve(normalizedSettings);
            }
            return [3 /*break*/, 7];
          case 6:
            error_1 = _a.sent();
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
              err: JSON.stringify(error_1)
            }));
            deferredObject.resolve(null);
            return [3 /*break*/, 7];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  SettingsService.prototype.handleServerEnvironment = function (deferredObject) {
    return __awaiter(this, void 0, void 0, function () {
      var settings, normalizedSettings, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 3,, 4]);
            return [4 /*yield*/, this.fetchSettings()];
          case 1:
            settings = _a.sent();
            return [4 /*yield*/, this.normalizeSettings(settings)];
          case 2:
            normalizedSettings = _a.sent();
            deferredObject.resolve(normalizedSettings);
            return [3 /*break*/, 4];
          case 3:
            error_2 = _a.sent();
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
              err: JSON.stringify(error_2)
            }));
            deferredObject.resolve(null);
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  SettingsService.prototype.fetchSettingsAndCacheInStorage = function () {
    var deferredObject = new PromiseUtil_1.Deferred();
    var storageConnector = storage_1.Storage.Instance.getConnector();
    if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
      this.handleBrowserEnvironment(storageConnector, deferredObject);
    } else {
      this.handleServerEnvironment(deferredObject);
    }
    return deferredObject.promise;
  };
  SettingsService.prototype.fetchSettings = function (isViaWebhook) {
    if (isViaWebhook === void 0) {
      isViaWebhook = false;
    }
    var deferredObject = new PromiseUtil_1.Deferred();
    if (!this.sdkKey || !this.accountId) {
      deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
    }
    var networkInstance = network_layer_1.NetworkManager.Instance;
    var options = (0, NetworkUtil_1.getSettingsPath)(this.sdkKey, this.accountId);
    var retryConfig = networkInstance.getRetryConfig();
    options.platform = constants_1.Constants.PLATFORM;
    options.sn = constants_1.Constants.SDK_NAME;
    options.sv = constants_1.Constants.SDK_VERSION;
    options['api-version'] = constants_1.Constants.API_VERSION;
    if (!networkInstance.getConfig().getDevelopmentMode()) {
      options.s = 'prod';
    }
    var path = constants_1.Constants.SETTINGS_ENDPOINT;
    if (isViaWebhook) {
      path = constants_1.Constants.WEBHOOK_SETTINGS_ENDPOINT;
    }
    try {
      var request = new network_layer_1.RequestModel(this.hostname, HttpMethodEnum_1.HttpMethodEnum.GET, path, options, null, null, this.protocol, this.port, retryConfig);
      request.setTimeout(this.networkTimeout);
      networkInstance.get(request).then(function (response) {
        deferredObject.resolve(response.getData());
      }).catch(function (err) {
        deferredObject.reject(err);
      });
      return deferredObject.promise;
    } catch (err) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
        err: JSON.stringify(err)
      }));
      deferredObject.reject(err);
      return deferredObject.promise;
    }
  };
  SettingsService.prototype.getSettings = function (forceFetch) {
    if (forceFetch === void 0) {
      forceFetch = false;
    }
    var deferredObject = new PromiseUtil_1.Deferred();
    if (forceFetch) {
      this.fetchSettingsAndCacheInStorage().then(function (settings) {
        deferredObject.resolve(settings);
      });
    } else {
      // const storageConnector = Storage.Instance.getConnector();
      // if (storageConnector) {
      //   storageConnector
      //     .get(Constants.SETTINGS)
      //     .then((storedSettings: dynamic) => {
      //       if (!isObject(storedSettings)) {
      //         this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
      //           const isSettingsValid = new SettingsSchema().isSettingsValid(fetchedSettings);
      //           if (isSettingsValid) {
      //             deferredObject.resolve(fetchedSettings);
      //           } else {
      //             deferredObject.reject(new Error('Settings are not valid. Failed schema validation.'));
      //           }
      //         });
      //       } else {
      //         deferredObject.resolve(storedSettings);
      //       }
      //     })
      //     .catch(() => {
      //       this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
      //         deferredObject.resolve(fetchedSettings);
      //       });
      //     });
      // } else {
      this.fetchSettingsAndCacheInStorage().then(function (fetchedSettings) {
        var isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(fetchedSettings);
        if (isSettingsValid) {
          logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
          deferredObject.resolve(fetchedSettings);
        } else {
          logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.SETTINGS_SCHEMA_INVALID);
          deferredObject.resolve({});
        }
      });
      // }
    }
    return deferredObject.promise;
  };
  return SettingsService;
}();
exports.SettingsService = SettingsService;

/***/ }),

/***/ "./dist/server-unpacked/services/StorageService.js":
/*!*********************************************************!*\
  !*** ./dist/server-unpacked/services/StorageService.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StorageService = void 0;
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
var StorageEnum_1 = __webpack_require__(/*! ../enums/StorageEnum */ "./dist/server-unpacked/enums/StorageEnum.js");
var storage_1 = __webpack_require__(/*! ../packages/storage */ "./dist/server-unpacked/packages/storage/index.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ../utils/PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var StorageService = /** @class */function () {
  function StorageService() {
    this.storageData = {};
  }
  /**
   * Retrieves data from storage based on the feature key and user ID.
   * @param featureKey The key to identify the feature data.
   * @param user The user object containing at least an ID.
   * @returns A promise that resolves to the data retrieved or an error/storage status enum.
   */
  StorageService.prototype.getDataInStorage = function (featureKey, context) {
    return __awaiter(this, void 0, void 0, function () {
      var deferredObject, storageInstance;
      return __generator(this, function (_a) {
        deferredObject = new PromiseUtil_1.Deferred();
        storageInstance = storage_1.Storage.Instance.getConnector();
        // Check if the storage instance is available
        if ((0, DataTypeUtil_1.isNull)(storageInstance) || (0, DataTypeUtil_1.isUndefined)(storageInstance)) {
          deferredObject.resolve(StorageEnum_1.StorageEnum.STORAGE_UNDEFINED);
        } else {
          storageInstance.get(featureKey, context.getId()).then(function (data) {
            deferredObject.resolve(data);
          }).catch(function (err) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORED_DATA_ERROR, {
              err: err
            }));
            deferredObject.resolve(StorageEnum_1.StorageEnum.NO_DATA_FOUND);
          });
        }
        return [2 /*return*/, deferredObject.promise];
      });
    });
  };
  /**
   * Stores data in the storage.
   * @param data The data to be stored as a record.
   * @returns A promise that resolves to true if data is successfully stored, otherwise false.
   */
  StorageService.prototype.setDataInStorage = function (data) {
    return __awaiter(this, void 0, void 0, function () {
      var deferredObject, storageInstance;
      return __generator(this, function (_a) {
        deferredObject = new PromiseUtil_1.Deferred();
        storageInstance = storage_1.Storage.Instance.getConnector();
        // Check if the storage instance is available
        if (storageInstance === null || storageInstance === undefined) {
          deferredObject.resolve(false);
        } else {
          storageInstance.set(data).then(function () {
            deferredObject.resolve(true);
          }).catch(function () {
            deferredObject.resolve(false);
          });
        }
        return [2 /*return*/, deferredObject.promise];
      });
    });
  };
  return StorageService;
}();
exports.StorageService = StorageService;

/***/ }),

/***/ "./dist/server-unpacked/utils/BatchEventsDispatcher.js":
/*!*************************************************************!*\
  !*** ./dist/server-unpacked/utils/BatchEventsDispatcher.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



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
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BatchEventsDispatcher = void 0;
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./dist/server-unpacked/packages/network-layer/index.js");
var UrlUtil_1 = __webpack_require__(/*! ./UrlUtil */ "./dist/server-unpacked/utils/UrlUtil.js");
var network_layer_2 = __webpack_require__(/*! ../packages/network-layer */ "./dist/server-unpacked/packages/network-layer/index.js");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./dist/server-unpacked/enums/HttpMethodEnum.js");
var UrlEnum_1 = __webpack_require__(/*! ../enums/UrlEnum */ "./dist/server-unpacked/enums/UrlEnum.js");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ../utils/LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ./PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var BatchEventsDispatcher = /** @class */function () {
  function BatchEventsDispatcher() {}
  BatchEventsDispatcher.dispatch = function (payload, flushCallback, queryParams) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.sendPostApiRequest(queryParams, payload, flushCallback)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  /**
   * Sends a POST request to the server.
   * @param properties - The properties of the request.
   * @param payload - The payload of the request.
   * @returns A promise that resolves to a void.
   */
  BatchEventsDispatcher.sendPostApiRequest = function (properties, payload, flushCallback) {
    return __awaiter(this, void 0, void 0, function () {
      var deferred, networkManager, retryConfig, headers, baseUrl, request, response, batchApiResult, error_1, batchApiResult;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            deferred = new PromiseUtil_1.Deferred();
            networkManager = network_layer_2.NetworkManager.Instance;
            networkManager.attachClient();
            retryConfig = networkManager.getRetryConfig();
            headers = {};
            headers['Authorization'] = SettingsService_1.SettingsService.Instance.sdkKey;
            baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
            baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
            request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.BATCH_EVENTS, properties, payload, headers, SettingsService_1.SettingsService.Instance.protocol, SettingsService_1.SettingsService.Instance.port, retryConfig);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3,, 4]);
            return [4 /*yield*/, network_layer_2.NetworkManager.Instance.post(request)];
          case 2:
            response = _a.sent();
            batchApiResult = this.handleBatchResponse(UrlEnum_1.UrlEnum.BATCH_EVENTS, payload, properties, null, response, flushCallback);
            deferred.resolve(batchApiResult);
            return [2 /*return*/, deferred.promise];
          case 3:
            error_1 = _a.sent();
            batchApiResult = this.handleBatchResponse(UrlEnum_1.UrlEnum.BATCH_EVENTS, payload, properties, error_1, null, flushCallback);
            deferred.resolve(batchApiResult);
            return [2 /*return*/, deferred.promise];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Handles the response from batch events API call
   * @param properties - Request properties containing events
   * @param queryParams - Query parameters from the request
   * @param error - Error object if request failed
   * @param res - Response object from the API
   * @param rawData - Raw response data
   * @param callback - Callback function to handle the result
   */
  BatchEventsDispatcher.handleBatchResponse = function (endPoint, payload, queryParams, err, res, callback) {
    var eventsPerRequest = payload.ev.length;
    var accountId = queryParams.a;
    var error = err ? err : res === null || res === void 0 ? void 0 : res.getError();
    if (error && !(error instanceof Error)) {
      if ((0, DataTypeUtil_1.isString)(error)) {
        error = new Error(error);
      } else if (error instanceof Object) {
        error = new Error(JSON.stringify(error));
      }
    }
    if (error) {
      logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPRESSION_BATCH_FAILED));
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
        method: HttpMethodEnum_1.HttpMethodEnum.POST,
        err: error.message
      }));
      callback(error, payload);
      return {
        status: 'error',
        events: payload
      };
    }
    var statusCode = res === null || res === void 0 ? void 0 : res.getStatusCode();
    if (statusCode === 200) {
      logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPRESSION_BATCH_SUCCESS, {
        accountId: accountId,
        endPoint: endPoint
      }));
      callback(null, payload);
      return {
        status: 'success',
        events: payload
      };
    }
    if (statusCode === 413) {
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.CONFIG_BATCH_EVENT_LIMIT_EXCEEDED, {
        accountId: accountId,
        endPoint: endPoint,
        eventsPerRequest: eventsPerRequest
      }));
      logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
        method: HttpMethodEnum_1.HttpMethodEnum.POST,
        err: error.message
      }));
      callback(error, payload);
      return {
        status: 'error',
        events: payload
      };
    }
    logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.IMPRESSION_BATCH_FAILED));
    logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
      method: HttpMethodEnum_1.HttpMethodEnum.POST,
      err: error.message
    }));
    callback(error, payload);
    return {
      status: 'error',
      events: payload
    };
  };
  return BatchEventsDispatcher;
}();
exports.BatchEventsDispatcher = BatchEventsDispatcher;
exports["default"] = BatchEventsDispatcher;

/***/ }),

/***/ "./dist/server-unpacked/utils/CampaignUtil.js":
/*!****************************************************!*\
  !*** ./dist/server-unpacked/utils/CampaignUtil.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setVariationAllocation = setVariationAllocation;
exports.assignRangeValues = assignRangeValues;
exports.scaleVariationWeights = scaleVariationWeights;
exports.getBucketingSeed = getBucketingSeed;
exports.getVariationFromCampaignKey = getVariationFromCampaignKey;
exports.setCampaignAllocation = setCampaignAllocation;
exports.getGroupDetailsIfCampaignPartOfIt = getGroupDetailsIfCampaignPartOfIt;
exports.getCampaignsByGroupId = getCampaignsByGroupId;
exports.getFeatureKeysFromCampaignIds = getFeatureKeysFromCampaignIds;
exports.getCampaignIdsFromFeatureKey = getCampaignIdsFromFeatureKey;
exports.assignRangeValuesMEG = assignRangeValuesMEG;
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
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./dist/server-unpacked/enums/CampaignTypeEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var VariationModel_1 = __webpack_require__(/*! ../models/campaign/VariationModel */ "./dist/server-unpacked/models/campaign/VariationModel.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
/**
 * Sets the variation allocation for a given campaign based on its type.
 * If the campaign type is ROLLOUT or PERSONALIZE, it handles the campaign using `_handleRolloutCampaign`.
 * Otherwise, it assigns range values to each variation in the campaign.
 * @param {CampaignModel} campaign - The campaign for which to set the variation allocation.
 */
function setVariationAllocation(campaign) {
  // Check if the campaign type is ROLLOUT or PERSONALIZE
  if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
    _handleRolloutCampaign(campaign);
  } else {
    var currentAllocation_1 = 0;
    // Iterate over each variation in the campaign
    campaign.getVariations().forEach(function (variation) {
      // Assign range values to the variation and update the current allocation
      var stepFactor = assignRangeValues(variation, currentAllocation_1);
      currentAllocation_1 += stepFactor;
      // Log the range allocation for debugging
      logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.VARIATION_RANGE_ALLOCATION, {
        variationKey: variation.getKey(),
        campaignKey: campaign.getKey(),
        variationWeight: variation.getWeight(),
        startRange: variation.getStartRangeVariation(),
        endRange: variation.getEndRangeVariation()
      }));
    });
  }
}
/**
 * Assigns start and end range values to a variation based on its weight.
 * @param {VariationModel} data - The variation model to assign range values.
 * @param {number} currentAllocation - The current allocation value before this variation.
 * @returns {number} The step factor calculated from the variation's weight.
 */
function assignRangeValues(data, currentAllocation) {
  // Calculate the bucket range based on the variation's weight
  var stepFactor = _getVariationBucketRange(data.getWeight());
  // Set the start and end range of the variation
  if (stepFactor) {
    data.setStartRange(currentAllocation + 1);
    data.setEndRange(currentAllocation + stepFactor);
  } else {
    data.setStartRange(-1);
    data.setEndRange(-1);
  }
  return stepFactor;
}
/**
 * Scales the weights of variations to sum up to 100%.
 * @param {any[]} variations - The list of variations to scale.
 */
function scaleVariationWeights(variations) {
  // Calculate the total weight of all variations
  var totalWeight = variations.reduce(function (acc, variation) {
    return acc + variation.weight;
  }, 0);
  // If total weight is zero, assign equal weight to each variation
  if (!totalWeight) {
    var equalWeight_1 = 100 / variations.length;
    variations.forEach(function (variation) {
      return variation.weight = equalWeight_1;
    });
  } else {
    // Scale each variation's weight to make the total 100%
    variations.forEach(function (variation) {
      return variation.weight = variation.weight / totalWeight * 100;
    });
  }
}
/**
 * Generates a bucketing seed based on user ID, campaign, and optional group ID.
 * @param {string} userId - The user ID.
 * @param {any} campaign - The campaign object.
 * @param {string} [groupId] - The optional group ID.
 * @returns {string} The bucketing seed.
 */
function getBucketingSeed(userId, campaign, groupId) {
  // Return a seed combining group ID and user ID if group ID is provided
  if (groupId) {
    return "".concat(groupId, "_").concat(userId);
  }
  var isRolloutOrPersonalize = campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
  // get salt
  var salt = isRolloutOrPersonalize ? campaign.getVariations()[0].getSalt() : campaign.getSalt();
  // get bucket key
  var bucketKey = salt ? "".concat(salt, "_").concat(userId) : "".concat(campaign.getId(), "_").concat(userId);
  // Return a seed combining campaign ID and user ID otherwise
  return bucketKey;
}
/**
 * Retrieves a variation by its ID within a specific campaign identified by its key.
 * @param {SettingsModel} settings - The settings model containing all campaigns.
 * @param {string} campaignKey - The key of the campaign.
 * @param {string} variationId - The ID of the variation to retrieve.
 * @returns {VariationModel | null} The found variation model or null if not found.
 */
function getVariationFromCampaignKey(settings, campaignKey, variationId) {
  // Find the campaign by its key
  var campaign = settings.getCampaigns().find(function (campaign) {
    return campaign.getKey() === campaignKey;
  });
  if (campaign) {
    // Find the variation by its ID within the found campaign
    var variation = campaign.getVariations().find(function (variation) {
      return variation.getId() === variationId;
    });
    if (variation) {
      // Return a new instance of VariationModel based on the found variation
      return new VariationModel_1.VariationModel().modelFromDictionary(variation);
    }
  }
  return null;
}
/**
 * Sets the allocation ranges for a list of campaigns.
 * @param {CampaignModel[]} campaigns - The list of campaigns to set allocations for.
 */
function setCampaignAllocation(campaigns) {
  var stepFactor = 0;
  for (var i = 0, currentAllocation = 0; i < campaigns.length; i++) {
    var campaign = campaigns[i];
    // Assign range values to each campaign and update the current allocation
    stepFactor = assignRangeValuesMEG(campaign, currentAllocation);
    currentAllocation += stepFactor;
  }
}
/**
 * Determines if a campaign is part of a group.
 * @param {SettingsModel} settings - The settings model containing group associations.
 * @param {string} campaignId - The ID of the campaign to check.
 * @param {any} [variationId=null] - The optional variation ID.
 * @returns {Object} An object containing the group ID and name if the campaign is part of a group, otherwise an empty object.
 */
function getGroupDetailsIfCampaignPartOfIt(settings, campaignId, variationId) {
  if (variationId === void 0) {
    variationId = null;
  }
  /**
   * If variationId is null, that means that campaign is testing campaign
   * If variationId is not null, that means that campaign is personalization campaign and we need to append variationId to campaignId using _
   * then check if the current campaign is part of any group
   */
  var campaignToCheck = campaignId.toString();
  // check if variationId is not null
  if (variationId !== null) {
    // if variationId is not null, then append it to the campaignId like campaignId_variationId
    campaignToCheck = "".concat(campaignId, "_").concat(variationId).toString();
  }
  if (settings.getCampaignGroups() && Object.prototype.hasOwnProperty.call(settings.getCampaignGroups(), campaignToCheck)) {
    return {
      groupId: settings.getCampaignGroups()[campaignToCheck],
      groupName: settings.getGroups()[settings.getCampaignGroups()[campaignToCheck]].name
    };
  }
  return {};
}
/**
 * Retrieves campaigns by a specific group ID.
 * @param {SettingsModel} settings - The settings model containing all groups.
 * @param {any} groupId - The ID of the group.
 * @returns {Array} An array of campaigns associated with the specified group ID.
 */
function getCampaignsByGroupId(settings, groupId) {
  var group = settings.getGroups()[groupId];
  if (group) {
    return group.campaigns; // Return the campaigns associated with the group
  } else {
    return []; // Return an empty array if the group ID is not found
  }
}
/**
 * Retrieves feature keys from a list of campaign IDs.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {any} campaignIdWithVariation - An array of campaign IDs and variation IDs in format campaignId_variationId.
 * @returns {Array} An array of feature keys associated with the provided campaign IDs.
 */
function getFeatureKeysFromCampaignIds(settings, campaignIdWithVariation) {
  var featureKeys = [];
  var _loop_1 = function (campaign) {
    // split key with _ to separate campaignId and variationId
    var _a = campaign.split('_').map(Number),
      campaignId = _a[0],
      variationId = _a[1];
    settings.getFeatures().forEach(function (feature) {
      // check if feature already exists in the featureKeys array
      if (featureKeys.indexOf(feature.getKey()) !== -1) {
        return;
      }
      feature.getRules().forEach(function (rule) {
        if (rule.getCampaignId() === campaignId) {
          // Check if variationId is provided and matches the rule's variationId
          if (variationId !== undefined && variationId !== null) {
            // Add feature key if variationId matches
            if (rule.getVariationId() === variationId) {
              featureKeys.push(feature.getKey());
            }
          } else {
            // Add feature key if no variationId is provided
            featureKeys.push(feature.getKey());
          }
        }
      });
    });
  };
  for (var _i = 0, campaignIdWithVariation_1 = campaignIdWithVariation; _i < campaignIdWithVariation_1.length; _i++) {
    var campaign = campaignIdWithVariation_1[_i];
    _loop_1(campaign);
  }
  return featureKeys;
}
/**
 * Retrieves campaign IDs from a specific feature key.
 * @param {SettingsModel} settings - The settings model containing all features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of campaign IDs associated with the specified feature key.
 */
function getCampaignIdsFromFeatureKey(settings, featureKey) {
  var campaignIds = [];
  settings.getFeatures().forEach(function (feature) {
    if (feature.getKey() === featureKey) {
      feature.getRules().forEach(function (rule) {
        campaignIds.push(rule.getCampaignId()); // Add campaign ID if feature key matches
      });
    }
  });
  return campaignIds;
}
/**
 * Assigns range values to a campaign based on its weight.
 * @param {any} data - The campaign data containing weight.
 * @param {number} currentAllocation - The current allocation value before this campaign.
 * @returns {number} The step factor calculated from the campaign's weight.
 */
function assignRangeValuesMEG(data, currentAllocation) {
  var stepFactor = _getVariationBucketRange(data.weight);
  if (stepFactor) {
    data.startRangeVariation = currentAllocation + 1; // Set the start range
    data.endRangeVariation = currentAllocation + stepFactor; // Set the end range
  } else {
    data.startRangeVariation = -1; // Set invalid range if step factor is zero
    data.endRangeVariation = -1;
  }
  return stepFactor;
}
/**
 * Calculates the bucket range for a variation based on its weight.
 * @param {number} variationWeight - The weight of the variation.
 * @returns {number} The calculated bucket range.
 */
function _getVariationBucketRange(variationWeight) {
  if (!variationWeight || variationWeight === 0) {
    return 0; // Return zero if weight is invalid or zero
  }
  var startRange = Math.ceil(variationWeight * 100);
  return Math.min(startRange, constants_1.Constants.MAX_TRAFFIC_VALUE); // Ensure the range does not exceed the max traffic value
}
/**
 * Handles the rollout campaign by setting start and end ranges for all variations.
 * @param {CampaignModel} campaign - The campaign to handle.
 */
function _handleRolloutCampaign(campaign) {
  // Set start and end ranges for all variations in the campaign
  for (var i = 0; i < campaign.getVariations().length; i++) {
    var variation = campaign.getVariations()[i];
    var endRange = campaign.getVariations()[i].getWeight() * 100;
    variation.setStartRange(1);
    variation.setEndRange(endRange);
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.VARIATION_RANGE_ALLOCATION, {
      variationKey: variation.getKey(),
      campaignKey: campaign.getKey(),
      variationWeight: variation.getWeight(),
      startRange: 1,
      endRange: endRange
    }));
  }
}

/***/ }),

/***/ "./dist/server-unpacked/utils/DataTypeUtil.js":
/*!****************************************************!*\
  !*** ./dist/server-unpacked/utils/DataTypeUtil.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isObject = isObject;
exports.isArray = isArray;
exports.isNull = isNull;
exports.isUndefined = isUndefined;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isPromise = isPromise;
exports.getType = getType;
/**
 * Checks if a value is an object excluding arrays, functions, regexes, promises, and dates.
 * @param val The value to check.
 * @returns True if the value is an object, false otherwise.
 */
function isObject(val) {
  // Using Object.prototype.toString to get a precise string representation of the value type
  return Object.prototype.toString.call(val) === '[object Object]';
}
/**
 * Checks if a value is an array.
 * @param val The value to check.
 * @returns True if the value is an array, false otherwise.
 */
function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}
/**
 * Checks if a value is null.
 * @param val The value to check.
 * @returns True if the value is null, false otherwise.
 */
function isNull(val) {
  return Object.prototype.toString.call(val) === '[object Null]';
}
/**
 * Checks if a value is undefined.
 * @param val The value to check.
 * @returns True if the value is undefined, false otherwise.
 */
function isUndefined(val) {
  return Object.prototype.toString.call(val) === '[object Undefined]';
}
/**
 * Checks if a value is a number, including NaN.
 * @param val The value to check.
 * @returns True if the value is a number, false otherwise.
 */
function isNumber(val) {
  // Note: NaN is also a number
  return Object.prototype.toString.call(val) === '[object Number]';
}
/**
 * Checks if a value is a string.
 * @param val The value to check.
 * @returns True if the value is a string, false otherwise.
 */
function isString(val) {
  return Object.prototype.toString.call(val) === '[object String]';
}
/**
 * Checks if a value is a boolean.
 * @param val The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
function isBoolean(val) {
  return Object.prototype.toString.call(val) === '[object Boolean]';
}
/**
 * Checks if a value is a function.
 * @param val The value to check.
 * @returns True if the value is a function, false otherwise.
 */
function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}
/**
 * Checks if a value is a Promise.
 * @param val The value to check.
 * @returns True if the value is a Promise, false otherwise.
 */
function isPromise(val) {
  return Object.prototype.toString.call(val) === '[object Promise]';
}
/**
 * Determines the type of the given value using various type-checking utility functions.
 * @param val The value to determine the type of.
 * @returns A string representing the type of the value.
 */
function getType(val) {
  // Check if the value is an Object (excluding arrays, functions, etc.)
  return isObject(val) ? 'Object' :
  // Check if the value is an Array
  isArray(val) ? 'Array' :
  // Check if the value is null
  isNull(val) ? 'Null' :
  // Check if the value is undefined
  isUndefined(val) ? 'Undefined' :
  // Check if the value is NaN (Not a Number)
  isNumber(val) ? 'Number' :
  // Check if the value is a String
  isString(val) ? 'String' :
  // Check if the value is a Boolean
  isBoolean(val) ? 'Boolean' :
  // Check if the value is a Function
  isFunction(val) ? 'Function' :
  // Check if the value is a Promise
  isPromise(val) ? 'Promise' :
  // If none of the above, return 'Unknown Type'
  'Unknown Type';
}

/***/ }),

/***/ "./dist/server-unpacked/utils/DecisionUtil.js":
/*!****************************************************!*\
  !*** ./dist/server-unpacked/utils/DecisionUtil.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.evaluateTrafficAndGetVariation = exports.checkWhitelistingAndPreSeg = void 0;
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
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./dist/server-unpacked/enums/CampaignTypeEnum.js");
var StatusEnum_1 = __webpack_require__(/*! ../enums/StatusEnum */ "./dist/server-unpacked/enums/StatusEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var decision_maker_1 = __webpack_require__(/*! ../packages/decision-maker */ "./dist/server-unpacked/packages/decision-maker/index.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var segmentation_evaluator_1 = __webpack_require__(/*! ../packages/segmentation-evaluator */ "./dist/server-unpacked/packages/segmentation-evaluator/index.js");
var CampaignDecisionService_1 = __webpack_require__(/*! ../services/CampaignDecisionService */ "./dist/server-unpacked/services/CampaignDecisionService.js");
var DataTypeUtil_2 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var CampaignUtil_1 = __webpack_require__(/*! ./CampaignUtil */ "./dist/server-unpacked/utils/CampaignUtil.js");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./dist/server-unpacked/utils/FunctionUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var MegUtil_1 = __webpack_require__(/*! ./MegUtil */ "./dist/server-unpacked/utils/MegUtil.js");
var UuidUtil_1 = __webpack_require__(/*! ./UuidUtil */ "./dist/server-unpacked/utils/UuidUtil.js");
var StorageDecorator_1 = __webpack_require__(/*! ../decorators/StorageDecorator */ "./dist/server-unpacked/decorators/StorageDecorator.js");
var checkWhitelistingAndPreSeg = function (settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) {
  return __awaiter(void 0, void 0, void 0, function () {
    var vwoUserId, campaignId, whitelistedVariation, groupId, groupWinnerCampaignId, storedData, isPreSegmentationPassed, winnerCampaign;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          vwoUserId = (0, UuidUtil_1.getUUID)(context.getId(), settings.getAccountId());
          campaignId = campaign.getId();
          if (!(campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB)) return [3 /*break*/, 3];
          // set _vwoUserId for variation targeting variables
          context.setVariationTargetingVariables(Object.assign({}, context.getVariationTargetingVariables(), {
            _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId()
          }));
          Object.assign(decision, {
            variationTargetingVariables: context.getVariationTargetingVariables()
          }); // for integration
          if (!campaign.getIsForcedVariationEnabled()) return [3 /*break*/, 2];
          return [4 /*yield*/, _checkCampaignWhitelisting(campaign, context)];
        case 1:
          whitelistedVariation = _a.sent();
          if (whitelistedVariation && Object.keys(whitelistedVariation).length > 0) {
            return [2 /*return*/, [true, whitelistedVariation]];
          }
          return [3 /*break*/, 3];
        case 2:
          logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
            campaignKey: campaign.getRuleKey(),
            userId: context.getId()
          }));
          _a.label = 3;
        case 3:
          // userlist segment is also available for campaign pre segmentation
          context.setCustomVariables(Object.assign({}, context.getCustomVariables(), {
            _vwoUserId: campaign.getIsUserListEnabled() ? vwoUserId : context.getId()
          }));
          Object.assign(decision, {
            customVariables: context.getCustomVariables()
          }); // for integeration
          groupId = (0, CampaignUtil_1.getGroupDetailsIfCampaignPartOfIt)(settings, campaign.getId(), campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? campaign.getVariations()[0].getId() : null).groupId;
          groupWinnerCampaignId = megGroupWinnerCampaigns === null || megGroupWinnerCampaigns === void 0 ? void 0 : megGroupWinnerCampaigns.get(groupId);
          if (!groupWinnerCampaignId) return [3 /*break*/, 4];
          if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
            // check if the campaign is the winner of the group
            if (groupWinnerCampaignId === campaignId) {
              return [2 /*return*/, [true, null]];
            }
          } else if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
            // check if the campaign is the winner of the group
            if (groupWinnerCampaignId === campaignId + '_' + campaign.getVariations()[0].getId()) {
              return [2 /*return*/, [true, null]];
            }
          }
          // as group is already evaluated, no need to check again, return false directly
          return [2 /*return*/, [false, null]];
        case 4:
          if (!groupId) return [3 /*break*/, 6];
          return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage("".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId), context, storageService)];
        case 5:
          storedData = _a.sent();
          if (storedData && storedData.experimentKey && storedData.experimentId) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
              campaignKey: storedData.experimentKey,
              userId: context.getId()
            }));
            if (storedData.experimentId === campaignId) {
              // return the campaign if the called campaignId matches
              if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
                if (storedData.experimentVariationId === campaign.getVariations()[0].getId()) {
                  // if personalise then check if the reqeusted variation is the winner
                  return [2 /*return*/, [true, null]];
                } else {
                  // if requested variation is not the winner then set the winner campaign in the map and return
                  megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
                  return [2 /*return*/, [false, null]];
                }
              } else {
                return [2 /*return*/, [true, null]];
              }
            }
            if (storedData.experimentVariationId != -1) {
              megGroupWinnerCampaigns.set(groupId, storedData.experimentId + '_' + storedData.experimentVariationId);
            } else {
              megGroupWinnerCampaigns.set(groupId, storedData.experimentId);
            }
            return [2 /*return*/, [false, null]];
          }
          _a.label = 6;
        case 6:
          return [4 /*yield*/, new CampaignDecisionService_1.CampaignDecisionService().getPreSegmentationDecision(campaign, context)];
        case 7:
          isPreSegmentationPassed = _a.sent();
          if (!(isPreSegmentationPassed && groupId)) return [3 /*break*/, 9];
          return [4 /*yield*/, (0, MegUtil_1.evaluateGroups)(settings, feature, groupId, evaluatedFeatureMap, context, storageService)];
        case 8:
          winnerCampaign = _a.sent();
          if (winnerCampaign && winnerCampaign.id === campaignId) {
            if (winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
              return [2 /*return*/, [true, null]];
            } else {
              // if personalise then check if the reqeusted variation is the winner
              if (winnerCampaign.variations[0].id === campaign.getVariations()[0].getId()) {
                return [2 /*return*/, [true, null]];
              } else {
                megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
                return [2 /*return*/, [false, null]];
              }
            }
          } else if (winnerCampaign) {
            if (winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB) {
              megGroupWinnerCampaigns.set(groupId, winnerCampaign.id);
            } else {
              megGroupWinnerCampaigns.set(groupId, winnerCampaign.id + '_' + winnerCampaign.variations[0].id);
            }
            return [2 /*return*/, [false, null]];
          }
          megGroupWinnerCampaigns.set(groupId, -1);
          return [2 /*return*/, [false, null]];
        case 9:
          return [2 /*return*/, [isPreSegmentationPassed, null]];
      }
    });
  });
};
exports.checkWhitelistingAndPreSeg = checkWhitelistingAndPreSeg;
var evaluateTrafficAndGetVariation = function (settings, campaign, userId) {
  var variation = new CampaignDecisionService_1.CampaignDecisionService().getVariationAlloted(userId, settings.getAccountId(), campaign);
  if (!variation) {
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
      campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey(),
      userId: userId,
      status: 'did not get any variation'
    }));
    return null;
  }
  logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CAMPAIGN_BUCKET_INFO, {
    campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey(),
    userId: userId,
    status: "got variation:".concat(variation.getKey())
  }));
  return variation;
};
exports.evaluateTrafficAndGetVariation = evaluateTrafficAndGetVariation;
/******************
 * PRIVATE METHODS
 ******************/
/**
 * Check for whitelisting
 * @param campaign      Campaign object
 * @param userId        User ID
 * @param variationTargetingVariables   Variation targeting variables
 * @returns
 */
var _checkCampaignWhitelisting = function (campaign, context) {
  return __awaiter(void 0, void 0, void 0, function () {
    var whitelistingResult, status, variationString;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, _evaluateWhitelisting(campaign, context)];
        case 1:
          whitelistingResult = _a.sent();
          status = whitelistingResult ? StatusEnum_1.StatusEnum.PASSED : StatusEnum_1.StatusEnum.FAILED;
          variationString = whitelistingResult ? whitelistingResult.variation.key : '';
          logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_STATUS, {
            userId: context.getId(),
            campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey(),
            status: status,
            variationString: variationString
          }));
          return [2 /*return*/, whitelistingResult];
      }
    });
  });
};
var _evaluateWhitelisting = function (campaign, context) {
  return __awaiter(void 0, void 0, void 0, function () {
    var targetedVariations, promises, whitelistedVariation, i, currentAllocation, stepFactor;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          targetedVariations = [];
          promises = [];
          campaign.getVariations().forEach(function (variation) {
            if ((0, DataTypeUtil_2.isObject)(variation.getSegments()) && !Object.keys(variation.getSegments()).length) {
              logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.WHITELISTING_SKIP, {
                campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey(),
                userId: context.getId(),
                variation: variation.getKey() ? "for variation: ".concat(variation.getKey()) : ''
              }));
              return;
            }
            // check for segmentation and evaluate
            if ((0, DataTypeUtil_2.isObject)(variation.getSegments())) {
              var SegmentEvaluatorResult = segmentation_evaluator_1.SegmentationManager.Instance.validateSegmentation(variation.getSegments(), context.getVariationTargetingVariables());
              SegmentEvaluatorResult = (0, DataTypeUtil_1.isPromise)(SegmentEvaluatorResult) ? SegmentEvaluatorResult : Promise.resolve(SegmentEvaluatorResult);
              SegmentEvaluatorResult.then(function (evaluationResult) {
                if (evaluationResult) {
                  targetedVariations.push((0, FunctionUtil_1.cloneObject)(variation));
                }
              });
              promises.push(SegmentEvaluatorResult);
            }
          });
          // Wait for all promises to resolve
          return [4 /*yield*/, Promise.all(promises)];
        case 1:
          // Wait for all promises to resolve
          _a.sent();
          if (targetedVariations.length > 1) {
            (0, CampaignUtil_1.scaleVariationWeights)(targetedVariations);
            for (i = 0, currentAllocation = 0, stepFactor = 0; i < targetedVariations.length; i++) {
              stepFactor = (0, CampaignUtil_1.assignRangeValues)(targetedVariations[i], currentAllocation);
              currentAllocation += stepFactor;
            }
            whitelistedVariation = new CampaignDecisionService_1.CampaignDecisionService().getVariation(targetedVariations, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), campaign, null)));
          } else {
            whitelistedVariation = targetedVariations[0];
          }
          if (whitelistedVariation) {
            return [2 /*return*/, {
              variation: whitelistedVariation,
              variationName: whitelistedVariation.name,
              variationId: whitelistedVariation.id
            }];
          }
          return [2 /*return*/];
      }
    });
  });
};

/***/ }),

/***/ "./dist/server-unpacked/utils/FetchUtil.js":
/*!*************************************************!*\
  !*** ./dist/server-unpacked/utils/FetchUtil.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sendGetCall = sendGetCall;
exports.sendPostCall = sendPostCall;
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./dist/server-unpacked/enums/HttpMethodEnum.js");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./dist/server-unpacked/utils/FunctionUtil.js");
function sendGetCall(networkOptions) {
  return sendRequest(HttpMethodEnum_1.HttpMethodEnum.GET, networkOptions);
}
function sendPostCall(networkOptions) {
  return sendRequest(HttpMethodEnum_1.HttpMethodEnum.POST, networkOptions);
}
/**
 * Sends a request to the server using the Fetch API.
 * @param method - The HTTP method to use for the request.
 * @param networkOptions - The options for the request.
 * @returns A Promise that resolves to the response data.
 */
function sendRequest(method, networkOptions) {
  var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
  return new Promise(function (resolve, reject) {
    if (method === HttpMethodEnum_1.HttpMethodEnum.POST) {
      networkOptions.body = JSON.stringify(networkOptions.body);
    }
    fetch(url, networkOptions).then(function (res) {
      // Some endpoints return empty strings as the response body; treat
      // as raw text and handle potential JSON parsing errors below
      return res.text().then(function (text) {
        var jsonData = {};
        try {
          if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
            jsonData = JSON.parse(text);
          } else {
            jsonData = text;
          }
        } catch (err) {
          console.info("VWO-SDK - [INFO]: ".concat((0, FunctionUtil_1.getCurrentTime)(), " VWO didn't send JSON response which is expected: ").concat(err));
        }
        if (res.status === 200) {
          resolve(jsonData);
        } else {
          var errorMessage = '';
          if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
            errorMessage = "VWO-SDK - [ERROR]: ".concat((0, FunctionUtil_1.getCurrentTime)(), " Request failed for fetching account settings. Got Status Code: ").concat(res.status);
          } else if (method === HttpMethodEnum_1.HttpMethodEnum.POST) {
            errorMessage = "VWO-SDK - [ERROR]: ".concat((0, FunctionUtil_1.getCurrentTime)(), " Request failed while making a POST request. Got Status Code: ").concat(res.status);
          }
          console.error(errorMessage);
          reject(errorMessage);
        }
      });
    }).catch(function (err) {
      var errorMessage = '';
      if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
        errorMessage = "VWO-SDK - [ERROR]: ".concat((0, FunctionUtil_1.getCurrentTime)(), " GET request failed for fetching account settings. Error: ").concat(err);
      } else if (method === HttpMethodEnum_1.HttpMethodEnum.POST) {
        errorMessage = "VWO-SDK - [ERROR]: ".concat((0, FunctionUtil_1.getCurrentTime)(), " POST request failed while sending data. Error: ").concat(err);
      }
      console.error(errorMessage);
      reject(errorMessage);
    });
  });
}

/***/ }),

/***/ "./dist/server-unpacked/utils/FunctionUtil.js":
/*!****************************************************!*\
  !*** ./dist/server-unpacked/utils/FunctionUtil.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.cloneObject = cloneObject;
exports.getCurrentTime = getCurrentTime;
exports.getCurrentUnixTimestamp = getCurrentUnixTimestamp;
exports.getCurrentUnixTimestampInMillis = getCurrentUnixTimestampInMillis;
exports.getRandomNumber = getRandomNumber;
exports.getSpecificRulesBasedOnType = getSpecificRulesBasedOnType;
exports.getAllExperimentRules = getAllExperimentRules;
exports.getFeatureFromKey = getFeatureFromKey;
exports.doesEventBelongToAnyFeature = doesEventBelongToAnyFeature;
exports.addLinkedCampaignsToSettings = addLinkedCampaignsToSettings;
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
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./dist/server-unpacked/enums/CampaignTypeEnum.js");
var CampaignModel_1 = __webpack_require__(/*! ../models/campaign/CampaignModel */ "./dist/server-unpacked/models/campaign/CampaignModel.js");
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
/**
 * Clones an object deeply.
 * @param {dynamic} obj - The object to clone.
 * @returns {any} The cloned object.
 */
function cloneObject(obj) {
  if (!obj) {
    // Return the original object if it is null or undefined
    return obj;
  }
  // Use JSON stringify and parse method to perform a deep clone
  var clonedObj = JSON.parse(JSON.stringify(obj));
  return clonedObj;
}
/**
 * Gets the current time in ISO string format.
 * @returns {string} The current time in ISO string format.
 */
function getCurrentTime() {
  return new Date().toISOString();
}
/**
 * Gets the current Unix timestamp in seconds.
 * @returns {number} The current Unix timestamp.
 */
function getCurrentUnixTimestamp() {
  // Convert the current date to Unix timestamp in seconds
  return Math.ceil(+new Date() / 1000);
}
/**
 * Gets the current Unix timestamp in milliseconds.
 * @returns {number} The current Unix timestamp in milliseconds.
 */
function getCurrentUnixTimestampInMillis() {
  // Convert the current date to Unix timestamp in milliseconds
  return +new Date();
}
/**
 * Generates a random number between 0 and 1.
 * @returns {number} A random number.
 */
function getRandomNumber() {
  // Use Math.random to generate a random number
  return Math.random();
}
/**
 * Retrieves specific rules based on the type from a feature.
 * @param {FeatureModel} feature - The key of the feature.
 * @param {CampaignTypeEnum | null} type - The type of the rules to retrieve.
 * @returns {Array} An array of rules that match the type.
 */
function getSpecificRulesBasedOnType(feature, type) {
  if (type === void 0) {
    type = null;
  }
  // Return an empty array if no linked campaigns are found
  if (feature && !(feature === null || feature === void 0 ? void 0 : feature.getRulesLinkedCampaign())) {
    return [];
  }
  // Filter the rules by type if a type is specified and is a string
  if (feature && feature.getRulesLinkedCampaign() && type && (0, DataTypeUtil_1.isString)(type)) {
    return feature.getRulesLinkedCampaign().filter(function (rule) {
      var ruleModel = new CampaignModel_1.CampaignModel().modelFromDictionary(rule);
      return ruleModel.getType() === type;
    });
  }
  // Return all linked campaigns if no type is specified
  return feature.getRulesLinkedCampaign();
}
/**
 * Retrieves all AB and Personalize rules from a feature.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature.
 * @returns {Array} An array of AB and Personalize rules.
 */
function getAllExperimentRules(feature) {
  // Retrieve the feature by its key
  // Filter the rules to include only AB and Personalize types
  return (feature === null || feature === void 0 ? void 0 : feature.getRulesLinkedCampaign().filter(function (rule) {
    return rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB || rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE;
  })) || [];
}
/**
 * Retrieves a feature by its key from the settings.
 * @param {any} settings - The settings containing features.
 * @param {string} featureKey - The key of the feature to find.
 * @returns {any} The feature if found, otherwise undefined.
 */
function getFeatureFromKey(settings, featureKey) {
  var _a;
  // Find the feature by its key
  return (_a = settings === null || settings === void 0 ? void 0 : settings.getFeatures()) === null || _a === void 0 ? void 0 : _a.find(function (feature) {
    return feature.getKey() === featureKey;
  });
}
/**
 * Checks if an event exists within any feature's metrics.
 * @param {string} eventName - The name of the event to check.
 * @param {any} settings - The settings containing features.
 * @returns {boolean} True if the event exists, otherwise false.
 */
function doesEventBelongToAnyFeature(eventName, settings) {
  // Use the `some` method to check if any feature contains the event in its metrics
  return settings.getFeatures().some(function (feature) {
    return feature.getMetrics().some(function (metric) {
      return metric.getIdentifier() === eventName;
    });
  });
}
/**
 * Adds linked campaigns to each feature in the settings based on rules.
 * @param {any} settings - The settings file to modify.
 */
function addLinkedCampaignsToSettings(settings) {
  // Create maps for quick access to campaigns and variations
  var campaignMap = new Map(settings.getCampaigns().map(function (campaign) {
    return [campaign.getId(), campaign];
  }));
  // Loop over all features
  for (var _i = 0, _a = settings.getFeatures(); _i < _a.length; _i++) {
    var feature = _a[_i];
    var rulesLinkedCampaign = feature.getRules().map(function (rule) {
      var campaign = campaignMap.get(rule.getCampaignId());
      if (!campaign) return null;
      // Create a linked campaign object with the rule and campaign
      var linkedCampaign = __assign(__assign({
        key: campaign.getKey()
      }, campaign), {
        ruleKey: rule.getRuleKey()
      });
      // If a variationId is specified, find and add the variation
      if (rule.getVariationId()) {
        var variation = campaign.getVariations().find(function (v) {
          return v.getId() === rule.getVariationId();
        });
        if (variation) {
          linkedCampaign.variations = [variation];
        }
      }
      return linkedCampaign;
    }).filter(function (campaign) {
      return campaign !== null;
    }); // Filter out any null entries
    var rulesLinkedCampaignModel = rulesLinkedCampaign.map(function (campaign) {
      var campaignModel = new CampaignModel_1.CampaignModel();
      campaignModel.modelFromDictionary(campaign);
      return campaignModel;
    });
    // Assign the linked campaigns to the feature
    feature.setRulesLinkedCampaign(rulesLinkedCampaignModel);
  }
}

/***/ }),

/***/ "./dist/server-unpacked/utils/GatewayServiceUtil.js":
/*!**********************************************************!*\
  !*** ./dist/server-unpacked/utils/GatewayServiceUtil.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getFromGatewayService = getFromGatewayService;
exports.getQueryParams = getQueryParams;
exports.addIsGatewayServiceRequiredFlag = addIsGatewayServiceRequiredFlag;
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
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./dist/server-unpacked/enums/CampaignTypeEnum.js");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./dist/server-unpacked/enums/HttpMethodEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./dist/server-unpacked/packages/network-layer/index.js");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var PromiseUtil_1 = __webpack_require__(/*! ./PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
/**
 * Asynchronously retrieves data from a web service using the specified query parameters and endpoint.
 * @param queryParams - The parameters to be used in the query string of the request.
 * @param endpoint - The endpoint URL to which the request is sent.
 * @returns A promise that resolves to the response data or false if an error occurs.
 */
function getFromGatewayService(queryParams, endpoint) {
  return __awaiter(this, void 0, void 0, function () {
    var deferredObject, networkInstance, retryConfig, gatewayServiceUrl, gatewayServicePort, gatewayServiceProtocol, request;
    return __generator(this, function (_a) {
      deferredObject = new PromiseUtil_1.Deferred();
      networkInstance = network_layer_1.NetworkManager.Instance;
      retryConfig = networkInstance.getRetryConfig();
      // Check if the base URL is not set correctly
      if (!SettingsService_1.SettingsService.Instance.isGatewayServiceProvided) {
        // Log an informational message about the invalid URL
        logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.GATEWAY_URL_ERROR);
        // Resolve the promise with false indicating an error or invalid state
        deferredObject.resolve(false);
        return [2 /*return*/, deferredObject.promise];
      }
      // required if sdk is running in browser environment
      // using dacdn where accountid is required
      queryParams['accountId'] = SettingsService_1.SettingsService.Instance.accountId;
      gatewayServiceUrl = null;
      gatewayServicePort = null;
      gatewayServiceProtocol = null;
      if (SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname != null) {
        gatewayServiceUrl = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.hostname;
        gatewayServicePort = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.port;
        gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.gatewayServiceConfig.protocol;
      } else {
        gatewayServiceUrl = SettingsService_1.SettingsService.Instance.hostname;
        gatewayServicePort = SettingsService_1.SettingsService.Instance.port;
        gatewayServiceProtocol = SettingsService_1.SettingsService.Instance.protocol;
      }
      try {
        request = new network_layer_1.RequestModel(gatewayServiceUrl, HttpMethodEnum_1.HttpMethodEnum.GET, endpoint, queryParams, null, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
        // Perform the network GET request
        networkInstance.get(request).then(function (response) {
          // Resolve the deferred object with the data from the response
          deferredObject.resolve(response.getData());
        }).catch(function (err) {
          // Reject the deferred object with the error response
          deferredObject.reject(err);
        });
        return [2 /*return*/, deferredObject.promise];
      } catch (err) {
        // Resolve the promise with false as fallback
        deferredObject.resolve(false);
        return [2 /*return*/, deferredObject.promise];
      }
      return [2 /*return*/];
    });
  });
}
/**
 * Encodes the query parameters to ensure they are URL-safe.
 * @param queryParams  The query parameters to be encoded.
 * @returns  An object containing the encoded query parameters.
 */
function getQueryParams(queryParams) {
  var encodedParams = {};
  for (var _i = 0, _a = Object.entries(queryParams); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    // Encode the parameter value to ensure it is URL-safe
    var encodedValue = encodeURIComponent(String(value));
    // Add the encoded parameter to the result object
    encodedParams[key] = encodedValue;
  }
  return encodedParams;
}
/**
 * Adds isGatewayServiceRequired flag to each feature in the settings based on pre segmentation.
 * @param {any} settings - The settings file to modify.
 */
function addIsGatewayServiceRequiredFlag(settings) {
  var keywordPattern = /\b(country|region|city|os|device_type|browser_string|ua)\b/g;
  var inlistPattern = /"custom_variable"\s*:\s*{[^}]*inlist\([^)]*\)/g;
  for (var _i = 0, _a = settings.getFeatures(); _i < _a.length; _i++) {
    var feature = _a[_i];
    var rules = feature.getRulesLinkedCampaign();
    for (var _b = 0, rules_1 = rules; _b < rules_1.length; _b++) {
      var rule = rules_1[_b];
      var segments = {};
      if (rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE || rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT) {
        segments = rule.getVariations()[0].getSegments();
      } else {
        segments = rule.getSegments();
      }
      if (segments) {
        var jsonSegments = JSON.stringify(segments);
        var keywordMatches = jsonSegments.match(keywordPattern);
        var inlistMatches = jsonSegments.match(inlistPattern);
        if (keywordMatches && keywordMatches.length > 0 || inlistMatches && inlistMatches.length > 0) {
          feature.setIsGatewayServiceRequired(true);
          break;
        }
      }
    }
  }
}

/***/ }),

/***/ "./dist/server-unpacked/utils/ImpressionUtil.js":
/*!******************************************************!*\
  !*** ./dist/server-unpacked/utils/ImpressionUtil.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



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
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.createAndSendImpressionForVariationShown = void 0;
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./dist/server-unpacked/utils/NetworkUtil.js");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./dist/server-unpacked/enums/EventEnum.js");
var BatchEventsQueue_1 = __webpack_require__(/*! ../services/BatchEventsQueue */ "./dist/server-unpacked/services/BatchEventsQueue.js");
/**
 * Creates and sends an impression for a variation shown event.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {SettingsModel} settings - The settings model containing configuration.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation shown to the user.
 * @param {ContextModel} context - The user context model containing user-specific data.
 */
var createAndSendImpressionForVariationShown = function (settings, campaignId, variationId, context) {
  return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()),
          // Encode user agent to ensure URL safety
          context.getIpAddress());
          payload = (0, NetworkUtil_1.getTrackUserPayloadData)(settings, context.getId(), EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, campaignId, variationId, context.getUserAgent(), context.getIpAddress());
          if (!BatchEventsQueue_1.BatchEventsQueue.Instance) return [3 /*break*/, 1];
          BatchEventsQueue_1.BatchEventsQueue.Instance.enqueue(payload);
          return [3 /*break*/, 3];
        case 1:
          // Send the constructed properties and payload as a POST request
          return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(properties, payload, context.getId())];
        case 2:
          // Send the constructed properties and payload as a POST request
          _a.sent();
          _a.label = 3;
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
exports.createAndSendImpressionForVariationShown = createAndSendImpressionForVariationShown;

/***/ }),

/***/ "./dist/server-unpacked/utils/LogMessageUtil.js":
/*!******************************************************!*\
  !*** ./dist/server-unpacked/utils/LogMessageUtil.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.buildMessage = buildMessage;
exports.sendLogToVWO = sendLogToVWO;
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
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./dist/server-unpacked/enums/EventEnum.js");
var DataTypeUtil_1 = __webpack_require__(/*! ../utils/DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./dist/server-unpacked/utils/NetworkUtil.js");
var nargs = /\{([0-9a-zA-Z_]+)\}/g;
var storedMessages = new Set();
/**
 * Constructs a message by replacing placeholders in a template with corresponding values from a data object.
 *
 * @param {string} template - The message template containing placeholders in the format `{key}`.
 * @param {Record<string, any>} data - An object containing keys and values used to replace the placeholders in the template.
 * @returns {string} The constructed message with all placeholders replaced by their corresponding values from the data object.
 */
function buildMessage(template, data) {
  if (data === void 0) {
    data = {};
  }
  try {
    return template.replace(nargs, function (match, key, index) {
      // Check for escaped placeholders
      if (template[index - 1] === '{' && template[index + match.length] === '}') {
        return key;
      }
      // Retrieve the value from the data object
      var value = data[key];
      // If the key does not exist or the value is null/undefined, return an empty string
      if (value === undefined || value === null) {
        return '';
      }
      // If the value is a function, evaluate it
      return (0, DataTypeUtil_1.isFunction)(value) ? value() : value;
    });
  } catch (err) {
    return template; // Return the original template in case of an error
  }
}
/**
 * Sends a log message to VWO.
 * @param {string} message - The message to log.
 * @param {string} messageType - The type of message to log.
 */
function sendLogToVWO(message, messageType) {
  if (typeof process.env != 'undefined' && process.env.TEST_ENV === 'true') {
    return;
  }
  var messageToSend = message;
  // if the message contains 'Retrying in', then remove the 'Retrying in' part, to avoid duplicate messages
  if (message.includes('Retrying in')) {
    messageToSend = message.split('Retrying')[0].trim();
  }
  messageToSend = messageToSend + '-' + constants_1.Constants.SDK_NAME + '-' + constants_1.Constants.SDK_VERSION;
  if (!storedMessages.has(messageToSend)) {
    // add the message to the set
    storedMessages.add(messageToSend);
    // create the query parameters
    var properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_LOG_EVENT);
    // create the payload
    var payload = (0, NetworkUtil_1.getMessagingEventPayload)(messageType, message, EventEnum_1.EventEnum.VWO_LOG_EVENT);
    // Send the constructed payload via POST request
    (0, NetworkUtil_1.sendMessagingEvent)(properties, payload).catch(function () {});
  }
}

/***/ }),

/***/ "./dist/server-unpacked/utils/MegUtil.js":
/*!***********************************************!*\
  !*** ./dist/server-unpacked/utils/MegUtil.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.evaluateGroups = void 0;
exports.getFeatureKeysFromGroup = getFeatureKeysFromGroup;
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
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var StorageDecorator_1 = __webpack_require__(/*! ../decorators/StorageDecorator */ "./dist/server-unpacked/decorators/StorageDecorator.js");
var CampaignTypeEnum_1 = __webpack_require__(/*! ../enums/CampaignTypeEnum */ "./dist/server-unpacked/enums/CampaignTypeEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var CampaignModel_1 = __webpack_require__(/*! ../models/campaign/CampaignModel */ "./dist/server-unpacked/models/campaign/CampaignModel.js");
var VariationModel_1 = __webpack_require__(/*! ../models/campaign/VariationModel */ "./dist/server-unpacked/models/campaign/VariationModel.js");
var decision_maker_1 = __webpack_require__(/*! ../packages/decision-maker */ "./dist/server-unpacked/packages/decision-maker/index.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var CampaignDecisionService_1 = __webpack_require__(/*! ../services/CampaignDecisionService */ "./dist/server-unpacked/services/CampaignDecisionService.js");
var RuleEvaluationUtil_1 = __webpack_require__(/*! ../utils/RuleEvaluationUtil */ "./dist/server-unpacked/utils/RuleEvaluationUtil.js");
var CampaignUtil_1 = __webpack_require__(/*! ./CampaignUtil */ "./dist/server-unpacked/utils/CampaignUtil.js");
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var DecisionUtil_1 = __webpack_require__(/*! ./DecisionUtil */ "./dist/server-unpacked/utils/DecisionUtil.js");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./dist/server-unpacked/utils/FunctionUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
/**
 * Evaluates groups for a given feature and group ID.
 *
 * @param settings - The settings model.
 * @param feature - The feature model to evaluate.
 * @param groupId - The ID of the group.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to the evaluation result.
 */
var evaluateGroups = function (settings, feature, groupId, evaluatedFeatureMap, context, storageService) {
  return __awaiter(void 0, void 0, void 0, function () {
    var featureToSkip, campaignMap, _a, featureKeys, groupCampaignIds, _loop_1, _i, featureKeys_1, featureKey, _b, eligibleCampaigns, eligibleCampaignsWithStorage;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          featureToSkip = [];
          campaignMap = new Map();
          _a = getFeatureKeysFromGroup(settings, groupId), featureKeys = _a.featureKeys, groupCampaignIds = _a.groupCampaignIds;
          _loop_1 = function (featureKey) {
            var feature_1, isRolloutRulePassed;
            return __generator(this, function (_d) {
              switch (_d.label) {
                case 0:
                  feature_1 = (0, FunctionUtil_1.getFeatureFromKey)(settings, featureKey);
                  // check if the feature is already evaluated
                  if (featureToSkip.includes(featureKey)) {
                    return [2 /*return*/, "continue"];
                  }
                  return [4 /*yield*/, _isRolloutRuleForFeaturePassed(settings, feature_1, evaluatedFeatureMap, featureToSkip, storageService, context)];
                case 1:
                  isRolloutRulePassed = _d.sent();
                  if (isRolloutRulePassed) {
                    settings.getFeatures().forEach(function (feature) {
                      if (feature.getKey() === featureKey) {
                        feature.getRulesLinkedCampaign().forEach(function (rule) {
                          if (groupCampaignIds.includes(rule.getId().toString()) || groupCampaignIds.includes("".concat(rule.getId(), "_").concat(rule.getVariations()[0].getId()).toString())) {
                            if (!campaignMap.has(featureKey)) {
                              campaignMap.set(featureKey, []);
                            }
                            // check if the campaign is already present in the campaignMap for the feature
                            if (campaignMap.get(featureKey).findIndex(function (item) {
                              return item.ruleKey === rule.getRuleKey();
                            }) === -1) {
                              campaignMap.get(featureKey).push(rule);
                            }
                          }
                        });
                      }
                    });
                  }
                  return [2 /*return*/];
              }
            });
          };
          _i = 0, featureKeys_1 = featureKeys;
          _c.label = 1;
        case 1:
          if (!(_i < featureKeys_1.length)) return [3 /*break*/, 4];
          featureKey = featureKeys_1[_i];
          return [5 /*yield**/, _loop_1(featureKey)];
        case 2:
          _c.sent();
          _c.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [4 /*yield*/, _getEligbleCampaigns(settings, campaignMap, context, storageService)];
        case 5:
          _b = _c.sent(), eligibleCampaigns = _b.eligibleCampaigns, eligibleCampaignsWithStorage = _b.eligibleCampaignsWithStorage;
          return [4 /*yield*/, _findWinnerCampaignAmongEligibleCampaigns(settings, feature.getKey(), eligibleCampaigns, eligibleCampaignsWithStorage, groupId, context, storageService)];
        case 6:
          return [2 /*return*/, _c.sent()];
      }
    });
  });
};
exports.evaluateGroups = evaluateGroups;
/**
 * Retrieves feature keys associated with a group based on the group ID.
 *
 * @param settings - The settings model.
 * @param groupId - The ID of the group.
 * @returns An object containing feature keys and group campaign IDs.
 */
function getFeatureKeysFromGroup(settings, groupId) {
  var groupCampaignIds = (0, CampaignUtil_1.getCampaignsByGroupId)(settings, groupId);
  var featureKeys = (0, CampaignUtil_1.getFeatureKeysFromCampaignIds)(settings, groupCampaignIds);
  return {
    featureKeys: featureKeys,
    groupCampaignIds: groupCampaignIds
  };
}
/*******************************
 * PRIVATE methods - MegUtil
 ******************************/
/**
 * Evaluates the feature rollout rules for a given feature.
 *
 * @param settings - The settings model.
 * @param feature - The feature model to evaluate.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param featureToSkip - An array of features to skip during evaluation.
 * @param storageService - The storage service.
 * @param context - The context model.
 * @returns A promise that resolves to true if the feature passes the rollout rules, false otherwise.
 */
var _isRolloutRuleForFeaturePassed = function (settings, feature, evaluatedFeatureMap, featureToSkip, storageService, context) {
  return __awaiter(void 0, void 0, void 0, function () {
    var rollOutRules, ruleToTestForTraffic, _i, rollOutRules_1, rule, preSegmentationResult, campaign, variation;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (evaluatedFeatureMap.has(feature.getKey()) && 'rolloutId' in evaluatedFeatureMap.get(feature.getKey())) {
            return [2 /*return*/, true];
          }
          rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT);
          if (!(rollOutRules.length > 0)) return [3 /*break*/, 5];
          ruleToTestForTraffic = null;
          _i = 0, rollOutRules_1 = rollOutRules;
          _a.label = 1;
        case 1:
          if (!(_i < rollOutRules_1.length)) return [3 /*break*/, 4];
          rule = rollOutRules_1[_i];
          return [4 /*yield*/, (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, null, storageService, {})];
        case 2:
          preSegmentationResult = _a.sent().preSegmentationResult;
          if (preSegmentationResult) {
            ruleToTestForTraffic = rule;
            return [3 /*break*/, 4];
          }
          return [3 /*break*/, 3];
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          if (ruleToTestForTraffic !== null) {
            campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(ruleToTestForTraffic);
            variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, campaign, context.getId());
            if ((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0) {
              evaluatedFeatureMap.set(feature.getKey(), {
                rolloutId: ruleToTestForTraffic.id,
                rolloutKey: ruleToTestForTraffic.key,
                rolloutVariationId: ruleToTestForTraffic.variations[0].id
              });
              return [2 /*return*/, true];
            }
          }
          // no rollout rule passed
          featureToSkip.push(feature.getKey());
          return [2 /*return*/, false];
        case 5:
          // no rollout rule, evaluate experiments
          logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_SKIP_ROLLOUT_EVALUATE_EXPERIMENTS, {
            featureKey: feature.getKey()
          }));
          return [2 /*return*/, true];
      }
    });
  });
};
/**
 * Retrieves eligible campaigns based on the provided campaign map and context.
 *
 * @param settings - The settings model.
 * @param campaignMap - A map containing feature keys and corresponding campaigns.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to an object containing eligible campaigns, campaigns with storage, and ineligible campaigns.
 */
var _getEligbleCampaigns = function (settings, campaignMap, context, storageService) {
  return __awaiter(void 0, void 0, void 0, function () {
    var eligibleCampaigns, eligibleCampaignsWithStorage, inEligibleCampaigns, campaignMapArray, _i, campaignMapArray_1, _a, featureKey, campaigns, _loop_2, _b, campaigns_1, campaign;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          eligibleCampaigns = [];
          eligibleCampaignsWithStorage = [];
          inEligibleCampaigns = [];
          campaignMapArray = Array.from(campaignMap);
          _i = 0, campaignMapArray_1 = campaignMapArray;
          _c.label = 1;
        case 1:
          if (!(_i < campaignMapArray_1.length)) return [3 /*break*/, 6];
          _a = campaignMapArray_1[_i], featureKey = _a[0], campaigns = _a[1];
          _loop_2 = function (campaign) {
            var storedData, variation;
            return __generator(this, function (_d) {
              switch (_d.label) {
                case 0:
                  return [4 /*yield*/, new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService)];
                case 1:
                  storedData = _d.sent();
                  // Check if campaign is stored in storage
                  if (storedData === null || storedData === void 0 ? void 0 : storedData.experimentVariationId) {
                    if (storedData.experimentKey && storedData.experimentKey === campaign.getKey()) {
                      variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.experimentKey, storedData.experimentVariationId);
                      if (variation) {
                        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_FOUND_IN_STORAGE, {
                          campaignKey: storedData.experimentKey,
                          userId: context.getId()
                        }));
                        if (eligibleCampaignsWithStorage.findIndex(function (item) {
                          return item.key === campaign.getKey();
                        }) === -1) {
                          eligibleCampaignsWithStorage.push(campaign);
                        }
                        return [2 /*return*/, "continue"];
                      }
                    }
                  }
                  return [4 /*yield*/, new CampaignDecisionService_1.CampaignDecisionService().getPreSegmentationDecision(new CampaignModel_1.CampaignModel().modelFromDictionary(campaign), context)];
                case 2:
                  // Check if user is eligible for the campaign
                  if (_d.sent() && new CampaignDecisionService_1.CampaignDecisionService().isUserPartOfCampaign(context.getId(), campaign)) {
                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_CAMPAIGN_ELIGIBLE, {
                      campaignKey: campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? campaign.getKey() : campaign.getName() + '_' + campaign.getRuleKey(),
                      userId: context.getId()
                    }));
                    eligibleCampaigns.push(campaign);
                    return [2 /*return*/, "continue"];
                  }
                  inEligibleCampaigns.push(campaign);
                  return [2 /*return*/];
              }
            });
          };
          _b = 0, campaigns_1 = campaigns;
          _c.label = 2;
        case 2:
          if (!(_b < campaigns_1.length)) return [3 /*break*/, 5];
          campaign = campaigns_1[_b];
          return [5 /*yield**/, _loop_2(campaign)];
        case 3:
          _c.sent();
          _c.label = 4;
        case 4:
          _b++;
          return [3 /*break*/, 2];
        case 5:
          _i++;
          return [3 /*break*/, 1];
        case 6:
          return [2 /*return*/, Promise.resolve({
            eligibleCampaigns: eligibleCampaigns,
            eligibleCampaignsWithStorage: eligibleCampaignsWithStorage,
            inEligibleCampaigns: inEligibleCampaigns
          })];
      }
    });
  });
};
/**
 * Evaluates the eligible campaigns and determines the winner campaign based on the provided settings, feature key, eligible campaigns, eligible campaigns with storage, group ID, and context.
 *
 * @param settings - The settings model.
 * @param featureKey - The key of the feature.
 * @param eligibleCampaigns - An array of eligible campaigns.
 * @param eligibleCampaignsWithStorage - An array of eligible campaigns with storage.
 * @param groupId - The ID of the group.
 * @param context - The context model.
 * @returns A promise that resolves to the winner campaign.
 */
var _findWinnerCampaignAmongEligibleCampaigns = function (settings, featureKey, eligibleCampaigns, eligibleCampaignsWithStorage, groupId, context, storageService) {
  return __awaiter(void 0, void 0, void 0, function () {
    var winnerCampaign, campaignIds, megAlgoNumber;
    var _a;
    return __generator(this, function (_b) {
      winnerCampaign = null;
      campaignIds = (0, CampaignUtil_1.getCampaignIdsFromFeatureKey)(settings, featureKey);
      megAlgoNumber = !(0, DataTypeUtil_1.isUndefined)((_a = settings === null || settings === void 0 ? void 0 : settings.getGroups()[groupId]) === null || _a === void 0 ? void 0 : _a.et) ? settings.getGroups()[groupId].et : constants_1.Constants.RANDOM_ALGO;
      // if eligibleCampaignsWithStorage has only one campaign, then that campaign is the winner
      if (eligibleCampaignsWithStorage.length === 1) {
        winnerCampaign = eligibleCampaignsWithStorage[0];
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
          campaignKey: eligibleCampaignsWithStorage[0].getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? eligibleCampaignsWithStorage[0].getKey() : eligibleCampaignsWithStorage[0].getName() + '_' + eligibleCampaignsWithStorage[0].getRuleKey(),
          groupId: groupId,
          userId: context.getId(),
          algo: ''
        }));
      } else if (eligibleCampaignsWithStorage.length > 1 && megAlgoNumber === constants_1.Constants.RANDOM_ALGO) {
        // if eligibleCampaignsWithStorage has more than one campaign and algo is random, then find the winner using random algo
        winnerCampaign = _normalizeWeightsAndFindWinningCampaign(eligibleCampaignsWithStorage, context, campaignIds, groupId, storageService);
      } else if (eligibleCampaignsWithStorage.length > 1) {
        // if eligibleCampaignsWithStorage has more than one campaign and algo is not random, then find the winner using advanced algo
        winnerCampaign = _getCampaignUsingAdvancedAlgo(settings, eligibleCampaignsWithStorage, context, campaignIds, groupId, storageService);
      }
      if (eligibleCampaignsWithStorage.length === 0) {
        if (eligibleCampaigns.length === 1) {
          winnerCampaign = eligibleCampaigns[0];
          logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
            campaignKey: eligibleCampaigns[0].getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? eligibleCampaigns[0].getKey() : eligibleCampaigns[0].getName() + '_' + eligibleCampaigns[0].getRuleKey(),
            groupId: groupId,
            userId: context.getId(),
            algo: ''
          }));
        } else if (eligibleCampaigns.length > 1 && megAlgoNumber === constants_1.Constants.RANDOM_ALGO) {
          winnerCampaign = _normalizeWeightsAndFindWinningCampaign(eligibleCampaigns, context, campaignIds, groupId, storageService);
        } else if (eligibleCampaigns.length > 1) {
          winnerCampaign = _getCampaignUsingAdvancedAlgo(settings, eligibleCampaigns, context, campaignIds, groupId, storageService);
        }
      }
      return [2 /*return*/, winnerCampaign];
    });
  });
};
/**
 * Normalizes the weights of shortlisted campaigns and determines the winning campaign using random allocation.
 *
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @returns The winning campaign or null if none is found.
 */
var _normalizeWeightsAndFindWinningCampaign = function (shortlistedCampaigns, context, calledCampaignIds, groupId, storageService) {
  // Normalize the weights of all the shortlisted campaigns
  shortlistedCampaigns.forEach(function (campaign) {
    campaign.weight = Math.round(100 / shortlistedCampaigns.length * 10000) / 10000;
  });
  // make shortlistedCampaigns as array of VariationModel
  shortlistedCampaigns = shortlistedCampaigns.map(function (campaign) {
    return new VariationModel_1.VariationModel().modelFromDictionary(campaign);
  });
  // re-distribute the traffic for each camapign
  (0, CampaignUtil_1.setCampaignAllocation)(shortlistedCampaigns);
  var winnerCampaign = new CampaignDecisionService_1.CampaignDecisionService().getVariation(shortlistedCampaigns, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), undefined, groupId)));
  logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
    campaignKey: winnerCampaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.AB ? winnerCampaign.getKey() : winnerCampaign.getKey() + '_' + winnerCampaign.getRuleKey(),
    groupId: groupId,
    userId: context.getId(),
    algo: 'using random algorithm'
  }));
  if (winnerCampaign) {
    new StorageDecorator_1.StorageDecorator().setDataInStorage({
      featureKey: "".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId),
      context: context,
      experimentId: winnerCampaign.getId(),
      experimentKey: winnerCampaign.getKey(),
      experimentVariationId: winnerCampaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? winnerCampaign.getVariations()[0].getId() : -1
    }, storageService);
    if (calledCampaignIds.includes(winnerCampaign.getId())) {
      return winnerCampaign;
    }
  }
  return null;
};
/**
 * Advanced algorithm to find the winning campaign based on priority order and weighted random distribution.
 *
 * @param settings - The settings model.
 * @param shortlistedCampaigns - An array of shortlisted campaigns.
 * @param context - The context model.
 * @param calledCampaignIds - An array of campaign IDs that have been called.
 * @param groupId - The ID of the group.
 * @returns The winning campaign or null if none is found.
 */
var _getCampaignUsingAdvancedAlgo = function (settings, shortlistedCampaigns, context, calledCampaignIds, groupId, storageService) {
  var winnerCampaign = null;
  var found = false; // flag to check whether winnerCampaign has been found or not and helps to break from the outer loop
  var priorityOrder = !(0, DataTypeUtil_1.isUndefined)(settings.getGroups()[groupId].p) ? settings.getGroups()[groupId].p : {};
  var wt = !(0, DataTypeUtil_1.isUndefined)(settings.getGroups()[groupId].wt) ? settings.getGroups()[groupId].wt : {};
  for (var i = 0; i < priorityOrder.length; i++) {
    for (var j = 0; j < shortlistedCampaigns.length; j++) {
      if (shortlistedCampaigns[j].id == priorityOrder[i]) {
        winnerCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[j]);
        found = true;
        break;
      } else if (shortlistedCampaigns[j].id + '_' + shortlistedCampaigns[j].variations[0].id === priorityOrder[i]) {
        winnerCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[j]);
        found = true;
        break;
      }
    }
    if (found === true) break;
  }
  // If winnerCampaign not found through Priority, then go for weighted Random distribution and for that,
  // Store the list of campaigns (participatingCampaigns) out of shortlistedCampaigns and their corresponding weights present in weightage distribution array (wt)
  if (winnerCampaign === null) {
    var participatingCampaignList = [];
    // iterate over shortlisted campaigns and add weights from the weight array
    for (var i = 0; i < shortlistedCampaigns.length; i++) {
      var campaignId = shortlistedCampaigns[i].id;
      if (!(0, DataTypeUtil_1.isUndefined)(wt[campaignId])) {
        var clonedCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[i]);
        clonedCampaign.weight = wt[campaignId];
        participatingCampaignList.push(clonedCampaign);
      } else if (!(0, DataTypeUtil_1.isUndefined)(wt[campaignId + '_' + shortlistedCampaigns[i].variations[0].id])) {
        var clonedCampaign = (0, FunctionUtil_1.cloneObject)(shortlistedCampaigns[i]);
        clonedCampaign.weight = wt[campaignId + '_' + shortlistedCampaigns[i].variations[0].id];
        participatingCampaignList.push(clonedCampaign);
      }
    }
    /* Finding winner campaign using weighted Distibution :
      1. Re-distribute the traffic by assigning range values for each camapign in particaptingCampaignList
      2. Calculate bucket value for the given userId and groupId
      3. Get the winnerCampaign by checking the Start and End Bucket Allocations of each campaign
    */
    // make participatingCampaignList as array of VariationModel
    participatingCampaignList = participatingCampaignList.map(function (campaign) {
      return new VariationModel_1.VariationModel().modelFromDictionary(campaign);
    });
    (0, CampaignUtil_1.setCampaignAllocation)(participatingCampaignList);
    winnerCampaign = new CampaignDecisionService_1.CampaignDecisionService().getVariation(participatingCampaignList, new decision_maker_1.DecisionMaker().calculateBucketValue((0, CampaignUtil_1.getBucketingSeed)(context.getId(), undefined, groupId)));
  }
  // WinnerCampaign should not be null, in case when winnerCampaign hasn't been found through PriorityOrder and
  // also shortlistedCampaigns and wt array does not have a single campaign id in common
  if (winnerCampaign) {
    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.MEG_WINNER_CAMPAIGN, {
      campaignKey: winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.AB ? winnerCampaign.key : winnerCampaign.key + '_' + winnerCampaign.ruleKey,
      groupId: groupId,
      userId: context.getId(),
      algo: 'using advanced algorithm'
    }));
  } else {
    // TODO -- Log the error message
    // LogManager.Instance.info(
    //   buildMessage(InfoLogMessagesEnum.MEG_NO_WINNER_CAMPAIGN, {
    //     groupId,
    //     userId: context.getId(),
    //   }),
    // );
    logger_1.LogManager.Instance.info("No winner campaign found for MEG group: ".concat(groupId));
  }
  if (winnerCampaign) {
    new StorageDecorator_1.StorageDecorator().setDataInStorage({
      featureKey: "".concat(constants_1.Constants.VWO_META_MEG_KEY).concat(groupId),
      context: context,
      experimentId: winnerCampaign.id,
      experimentKey: winnerCampaign.key,
      experimentVariationId: winnerCampaign.type === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE ? winnerCampaign.variations[0].id : -1
    }, storageService);
    if (calledCampaignIds.includes(winnerCampaign.id)) {
      return winnerCampaign;
    }
  }
  return null;
};

/***/ }),

/***/ "./dist/server-unpacked/utils/NetworkUtil.js":
/*!***************************************************!*\
  !*** ./dist/server-unpacked/utils/NetworkUtil.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getSettingsPath = getSettingsPath;
exports.getTrackEventPath = getTrackEventPath;
exports.getEventsBaseProperties = getEventsBaseProperties;
exports._getEventBasePayload = _getEventBasePayload;
exports.getTrackUserPayloadData = getTrackUserPayloadData;
exports.getTrackGoalPayloadData = getTrackGoalPayloadData;
exports.getAttributePayloadData = getAttributePayloadData;
exports.sendPostApiRequest = sendPostApiRequest;
exports.getShouldWaitForTrackingCalls = getShouldWaitForTrackingCalls;
exports.setShouldWaitForTrackingCalls = setShouldWaitForTrackingCalls;
exports.getMessagingEventPayload = getMessagingEventPayload;
exports.sendMessagingEvent = sendMessagingEvent;
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
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./dist/server-unpacked/utils/FunctionUtil.js");
var UuidUtil_1 = __webpack_require__(/*! ./UuidUtil */ "./dist/server-unpacked/utils/UuidUtil.js");
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var HeadersEnum_1 = __webpack_require__(/*! ../enums/HeadersEnum */ "./dist/server-unpacked/enums/HeadersEnum.js");
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./dist/server-unpacked/enums/HttpMethodEnum.js");
var UrlEnum_1 = __webpack_require__(/*! ../enums/UrlEnum */ "./dist/server-unpacked/enums/UrlEnum.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var network_layer_1 = __webpack_require__(/*! ../packages/network-layer */ "./dist/server-unpacked/packages/network-layer/index.js");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var UrlUtil_1 = __webpack_require__(/*! ./UrlUtil */ "./dist/server-unpacked/utils/UrlUtil.js");
var PromiseUtil_1 = __webpack_require__(/*! ./PromiseUtil */ "./dist/server-unpacked/utils/PromiseUtil.js");
var Url_1 = __webpack_require__(/*! ../constants/Url */ "./dist/server-unpacked/constants/Url.js");
var UsageStatsUtil_1 = __webpack_require__(/*! ./UsageStatsUtil */ "./dist/server-unpacked/utils/UsageStatsUtil.js");
/**
 * Constructs the settings path with API key and account ID.
 * @param {string} sdkKey - The API key.
 * @param {any} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The settings path including API key, random number, and account ID.
 */
function getSettingsPath(sdkKey, accountId) {
  var path = {
    i: "".concat(sdkKey),
    // Inject API key
    r: Math.random(),
    // Random number for cache busting
    a: accountId // Account ID
  };
  return path;
}
/**
 * Constructs the tracking path for an event.
 * @param {string} event - The event type.
 * @param {string} accountId - The account identifier.
 * @param {string} userId - The user identifier.
 * @returns {Record<string, dynamic>} - The tracking path for the event.
 */
function getTrackEventPath(event, accountId, userId) {
  var path = {
    event_type: event,
    // Type of the event
    account_id: accountId,
    // Account ID
    uId: userId,
    // User ID
    u: (0, UuidUtil_1.getUUID)(userId, accountId),
    // UUID generated for the user
    sdk: constants_1.Constants.SDK_NAME,
    // SDK name constant
    'sdk-v': constants_1.Constants.SDK_VERSION,
    // SDK version
    random: (0, FunctionUtil_1.getRandomNumber)(),
    // Random number for uniqueness
    ap: constants_1.Constants.PLATFORM,
    // Application platform
    sId: (0, FunctionUtil_1.getCurrentUnixTimestamp)(),
    // Session ID
    ed: JSON.stringify({
      p: 'server'
    }) // Additional encoded data
  };
  return path;
}
/**
 * Builds generic properties for different tracking calls required by VWO servers.
 * @param {Object} configObj
 * @param {String} eventName
 * @returns properties
 */
function getEventsBaseProperties(eventName, visitorUserAgent, ipAddress) {
  if (visitorUserAgent === void 0) {
    visitorUserAgent = '';
  }
  if (ipAddress === void 0) {
    ipAddress = '';
  }
  var sdkKey = SettingsService_1.SettingsService.Instance.sdkKey;
  var properties = Object.assign({
    en: eventName,
    a: SettingsService_1.SettingsService.Instance.accountId,
    env: sdkKey,
    eTime: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)(),
    random: (0, FunctionUtil_1.getRandomNumber)(),
    p: 'FS',
    visitor_ua: visitorUserAgent,
    visitor_ip: ipAddress
  });
  properties.url = constants_1.Constants.HTTPS_PROTOCOL + UrlUtil_1.UrlUtil.getBaseUrl() + UrlEnum_1.UrlEnum.EVENTS;
  return properties;
}
/**
 * Builds generic payload required by all the different tracking calls.
 * @param {Object} settings   settings file
 * @param {String} userId     user id
 * @param {String} eventName  event name
 * @returns properties
 */
function _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress) {
  if (visitorUserAgent === void 0) {
    visitorUserAgent = '';
  }
  if (ipAddress === void 0) {
    ipAddress = '';
  }
  var uuid = (0, UuidUtil_1.getUUID)(userId.toString(), SettingsService_1.SettingsService.Instance.accountId.toString());
  var sdkKey = SettingsService_1.SettingsService.Instance.sdkKey;
  var props = {
    vwo_sdkName: constants_1.Constants.SDK_NAME,
    vwo_sdkVersion: constants_1.Constants.SDK_VERSION,
    vwo_envKey: sdkKey
  };
  var properties = {
    d: {
      msgId: "".concat(uuid, "-").concat((0, FunctionUtil_1.getCurrentUnixTimestampInMillis)()),
      visId: uuid,
      sessionId: (0, FunctionUtil_1.getCurrentUnixTimestamp)(),
      visitor_ua: visitorUserAgent,
      visitor_ip: ipAddress,
      event: {
        props: props,
        name: eventName,
        time: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)()
      },
      visitor: {
        props: {
          vwo_fs_environment: sdkKey
        }
      }
    }
  };
  return properties;
}
/**
 * Builds payload to track the visitor.
 * @param {Object} configObj
 * @param {String} userId
 * @param {String} eventName
 * @param {String} campaignId
 * @param {Number} variationId
 * @returns track-user payload
 */
function getTrackUserPayloadData(settings, userId, eventName, campaignId, variationId, visitorUserAgent, ipAddress) {
  if (visitorUserAgent === void 0) {
    visitorUserAgent = '';
  }
  if (ipAddress === void 0) {
    ipAddress = '';
  }
  var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
  properties.d.event.props.id = campaignId;
  properties.d.event.props.variation = variationId;
  properties.d.event.props.isFirst = 1;
  // add usageStats as a new meta key to properties.d.events.props.vwoMeta
  if (Object.keys(UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats()).length > 0) {
    properties.d.event.props.vwoMeta = UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats();
  }
  logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_USER, {
    accountId: settings.getAccountId(),
    userId: userId,
    campaignId: campaignId
  }));
  return properties;
}
/**
 * Constructs the payload data for tracking goals with custom event properties.
 * @param {any} settings - Configuration settings.
 * @param {any} userId - User identifier.
 * @param {string} eventName - Name of the event.
 * @param {any} eventProperties - Custom properties for the event.
 * @param {string} [visitorUserAgent=''] - Visitor's user agent.
 * @param {string} [ipAddress=''] - Visitor's IP address.
 * @returns {any} - The constructed payload data.
 */
function getTrackGoalPayloadData(settings, userId, eventName, eventProperties, visitorUserAgent, ipAddress) {
  if (visitorUserAgent === void 0) {
    visitorUserAgent = '';
  }
  if (ipAddress === void 0) {
    ipAddress = '';
  }
  var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
  properties.d.event.props.isCustomEvent = true; // Mark as a custom event
  properties.d.event.props.variation = 1; // Temporary value for variation
  properties.d.event.props.id = 1; // Temporary value for ID
  // Add custom event properties if provided
  if (eventProperties && (0, DataTypeUtil_1.isObject)(eventProperties) && Object.keys(eventProperties).length > 0) {
    for (var prop in eventProperties) {
      properties.d.event.props[prop] = eventProperties[prop];
    }
  }
  logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_TRACK_GOAL, {
    eventName: eventName,
    accountId: settings.getAccountId(),
    userId: userId
  }));
  return properties;
}
/**
 * Constructs the payload data for syncing multiple visitor attributes.
 * @param {SettingsModel} settings - Configuration settings.
 * @param {string | number} userId - User ID.
 * @param {string} eventName - Event name.
 * @param {Record<string, any>} attributes - Key-value map of attributes.
 * @param {string} [visitorUserAgent=''] - Visitor's User-Agent (optional).
 * @param {string} [ipAddress=''] - Visitor's IP Address (optional).
 * @returns {Record<string, any>} - Payload object to be sent in the request.
 */
function getAttributePayloadData(settings, userId, eventName, attributes, visitorUserAgent, ipAddress) {
  if (visitorUserAgent === void 0) {
    visitorUserAgent = '';
  }
  if (ipAddress === void 0) {
    ipAddress = '';
  }
  var properties = _getEventBasePayload(settings, userId, eventName, visitorUserAgent, ipAddress);
  properties.d.event.props.isCustomEvent = true; // Mark as a custom event
  properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = settings.getSdkkey(); // Set environment key
  // Iterate over the attributes map and append to the visitor properties
  for (var _i = 0, _a = Object.entries(attributes); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    properties.d.visitor.props[key] = value;
  }
  logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.IMPRESSION_FOR_SYNC_VISITOR_PROP, {
    eventName: eventName,
    accountId: settings.getAccountId(),
    userId: userId
  }));
  return properties;
}
/**
 * Sends a POST API request with the specified properties and payload.
 * @param {any} properties - Properties for the request.
 * @param {any} payload - Payload for the request.
 * @param {string} userId - User ID.
 */
function sendPostApiRequest(properties, payload, userId) {
  return __awaiter(this, void 0, void 0, function () {
    var networkManager, retryConfig, headers, userAgent, ipAddress, baseUrl, request;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          networkManager = network_layer_1.NetworkManager.Instance;
          networkManager.attachClient();
          retryConfig = networkManager.getRetryConfig();
          headers = {};
          userAgent = payload.d.visitor_ua;
          ipAddress = payload.d.visitor_ip;
          // Set headers if available
          if (userAgent) headers[HeadersEnum_1.HeadersEnum.USER_AGENT] = userAgent;
          if (ipAddress) headers[HeadersEnum_1.HeadersEnum.IP] = ipAddress;
          baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
          baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
          request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.EVENTS, properties, payload, headers, SettingsService_1.SettingsService.Instance.protocol, SettingsService_1.SettingsService.Instance.port, retryConfig);
          return [4 /*yield*/, network_layer_1.NetworkManager.Instance.post(request).then(function () {
            // clear usage stats only if network call is successful
            if (Object.keys(UsageStatsUtil_1.UsageStatsUtil.getInstance().getUsageStats()).length > 0) {
              UsageStatsUtil_1.UsageStatsUtil.getInstance().clearUsageStats();
            }
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.NETWORK_CALL_SUCCESS, {
              event: properties.en,
              endPoint: UrlEnum_1.UrlEnum.EVENTS,
              accountId: SettingsService_1.SettingsService.Instance.accountId,
              userId: userId,
              uuid: payload.d.visId
            }));
          }).catch(function (err) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILED, {
              method: HttpMethodEnum_1.HttpMethodEnum.POST,
              err: (0, DataTypeUtil_1.isObject)(err) ? JSON.stringify(err) : err
            }));
          })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
// Flag to determine if the SDK should wait for a network response.
var shouldWaitForTrackingCalls = false;
/**
 * Checks if the SDK should wait for a network response.
 * @returns {boolean} - True if the SDK should wait for a network response, false otherwise.
 */
function getShouldWaitForTrackingCalls() {
  return shouldWaitForTrackingCalls;
}
/**
 * Sets the value to determine if the SDK should wait for a network response.
 * @param value - The value to set.
 */
function setShouldWaitForTrackingCalls(value) {
  shouldWaitForTrackingCalls = value;
}
/**
 * Constructs the payload for a messaging event.
 * @param messageType - The type of the message.
 * @param message - The message to send.
 * @param eventName - The name of the event.
 * @returns The constructed payload.
 */
function getMessagingEventPayload(messageType, message, eventName) {
  var userId = SettingsService_1.SettingsService.Instance.accountId + '_' + SettingsService_1.SettingsService.Instance.sdkKey;
  var properties = _getEventBasePayload(null, userId, eventName, null, null);
  properties.d.event.props[constants_1.Constants.VWO_FS_ENVIRONMENT] = SettingsService_1.SettingsService.Instance.sdkKey; // Set environment key
  properties.d.event.props.product = 'fme';
  var data = {
    type: messageType,
    content: {
      title: message,
      dateTime: (0, FunctionUtil_1.getCurrentUnixTimestampInMillis)()
    }
  };
  properties.d.event.props.data = data;
  return properties;
}
/**
 * Sends a messaging event to DACDN
 * @param properties - Query parameters for the request.
 * @param payload - The payload for the request.
 * @returns A promise that resolves to the response from DACDN.
 */
function sendMessagingEvent(properties, payload) {
  return __awaiter(this, void 0, void 0, function () {
    var deferredObject, networkInstance, retryConfig, baseUrl, request;
    return __generator(this, function (_a) {
      deferredObject = new PromiseUtil_1.Deferred();
      networkInstance = network_layer_1.NetworkManager.Instance;
      retryConfig = networkInstance.getRetryConfig();
      // disable retry for messaging event
      retryConfig.shouldRetry = false;
      baseUrl = UrlUtil_1.UrlUtil.getBaseUrl();
      baseUrl = UrlUtil_1.UrlUtil.getUpdatedBaseUrl(baseUrl);
      try {
        request = new network_layer_1.RequestModel(baseUrl, HttpMethodEnum_1.HttpMethodEnum.POST, UrlEnum_1.UrlEnum.EVENTS, properties, payload, null, Url_1.HTTPS, null, retryConfig);
        // Perform the network GET request
        networkInstance.post(request).then(function (response) {
          // Resolve the deferred object with the data from the response
          deferredObject.resolve(response.getData());
        }).catch(function (err) {
          // Reject the deferred object with the error response
          deferredObject.reject(err);
        });
        return [2 /*return*/, deferredObject.promise];
      } catch (err) {
        // Resolve the promise with false as fallback
        deferredObject.resolve(false);
        return [2 /*return*/, deferredObject.promise];
      }
      return [2 /*return*/];
    });
  });
}

/***/ }),

/***/ "./dist/server-unpacked/utils/PromiseUtil.js":
/*!***************************************************!*\
  !*** ./dist/server-unpacked/utils/PromiseUtil.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Deferred = Deferred;
/**
 * Creates a Deferred object with properties for promise, resolve, and reject.
 * This allows manual control over the resolution and rejection of a promise.
 * @returns {Deferred} The Deferred object with promise, resolve, and reject methods.
 */
function Deferred() {
  var _this = this;
  // Create a new Promise and attach resolve and reject methods to the Deferred object
  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve; // Method to resolve the promise
    _this.reject = reject; // Method to reject the promise
  });
  return this; // Return the Deferred object with attached methods
}

/***/ }),

/***/ "./dist/server-unpacked/utils/RuleEvaluationUtil.js":
/*!**********************************************************!*\
  !*** ./dist/server-unpacked/utils/RuleEvaluationUtil.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.evaluateRule = void 0;
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
var DecisionUtil_1 = __webpack_require__(/*! ./DecisionUtil */ "./dist/server-unpacked/utils/DecisionUtil.js");
var NetworkUtil_1 = __webpack_require__(/*! ./NetworkUtil */ "./dist/server-unpacked/utils/NetworkUtil.js");
var ImpressionUtil_1 = __webpack_require__(/*! ./ImpressionUtil */ "./dist/server-unpacked/utils/ImpressionUtil.js");
/**
 * Evaluates the rules for a given campaign and feature based on the provided context.
 * This function checks for whitelisting and pre-segmentation conditions, and if applicable,
 * sends an impression for the variation shown.
 *
 * @param {SettingsModel} settings - The settings configuration for the evaluation.
 * @param {FeatureModel} feature - The feature being evaluated.
 * @param {CampaignModel} campaign - The campaign associated with the feature.
 * @param {ContextModel} context - The user context for evaluation.
 * @param {Map<string, any>} evaluatedFeatureMap - A map of evaluated features.
 * @param {Map<number, number>} megGroupWinnerCampaigns - A map of MEG group winner campaigns.
 * @param {StorageService} storageService - The storage service for persistence.
 * @param {any} decision - The decision object that will be updated based on the evaluation.
 * @returns {Promise<[boolean, any]>} A promise that resolves to a tuple containing the result of the pre-segmentation
 * and the whitelisted object, if any.
 */
var evaluateRule = function (settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, preSegmentationResult, whitelistedObject;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, DecisionUtil_1.checkWhitelistingAndPreSeg)(settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision)];
        case 1:
          _a = _b.sent(), preSegmentationResult = _a[0], whitelistedObject = _a[1];
          if (!(preSegmentationResult && (0, DataTypeUtil_1.isObject)(whitelistedObject) && Object.keys(whitelistedObject).length > 0)) return [3 /*break*/, 4];
          // Update the decision object with campaign and variation details
          Object.assign(decision, {
            experimentId: campaign.getId(),
            experimentKey: campaign.getKey(),
            experimentVariationId: whitelistedObject.variationId
          });
          if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 3];
          return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), whitelistedObject.variation.id, context)];
        case 2:
          _b.sent();
          return [3 /*break*/, 4];
        case 3:
          (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), whitelistedObject.variation.id, context);
          _b.label = 4;
        case 4:
          // Return the results of the evaluation
          return [2 /*return*/, {
            preSegmentationResult: preSegmentationResult,
            whitelistedObject: whitelistedObject,
            updatedDecision: decision
          }];
      }
    });
  });
};
exports.evaluateRule = evaluateRule;

/***/ }),

/***/ "./dist/server-unpacked/utils/SettingsUtil.js":
/*!****************************************************!*\
  !*** ./dist/server-unpacked/utils/SettingsUtil.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setSettingsAndAddCampaignsToRules = setSettingsAndAddCampaignsToRules;
var SettingsModel_1 = __webpack_require__(/*! ../models/settings/SettingsModel */ "./dist/server-unpacked/models/settings/SettingsModel.js");
var CampaignUtil_1 = __webpack_require__(/*! ./CampaignUtil */ "./dist/server-unpacked/utils/CampaignUtil.js");
var FunctionUtil_1 = __webpack_require__(/*! ./FunctionUtil */ "./dist/server-unpacked/utils/FunctionUtil.js");
var GatewayServiceUtil_1 = __webpack_require__(/*! ./GatewayServiceUtil */ "./dist/server-unpacked/utils/GatewayServiceUtil.js");
/**
 * Sets settings and adds campaigns to rules
 * @param settings settings
 * @param vwoClientInstance VWOClient instance
 */
function setSettingsAndAddCampaignsToRules(settings, vwoClientInstance) {
  // create settings model and set it to vwoClientInstance
  vwoClientInstance.settings = new SettingsModel_1.SettingsModel(settings);
  vwoClientInstance.originalSettings = settings;
  // Optimize loop by avoiding multiple calls to `getCampaigns()`
  var campaigns = vwoClientInstance.settings.getCampaigns();
  campaigns.forEach(function (campaign, index) {
    (0, CampaignUtil_1.setVariationAllocation)(campaign);
    campaigns[index] = campaign;
  });
  (0, FunctionUtil_1.addLinkedCampaignsToSettings)(vwoClientInstance.settings);
  (0, GatewayServiceUtil_1.addIsGatewayServiceRequiredFlag)(vwoClientInstance.settings);
}

/***/ }),

/***/ "./dist/server-unpacked/utils/UrlUtil.js":
/*!***********************************************!*\
  !*** ./dist/server-unpacked/utils/UrlUtil.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UrlUtil = void 0;
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
var constants_1 = __webpack_require__(/*! ../constants */ "./dist/server-unpacked/constants/index.js");
var SettingsService_1 = __webpack_require__(/*! ../services/SettingsService */ "./dist/server-unpacked/services/SettingsService.js");
var DataTypeUtil_1 = __webpack_require__(/*! ./DataTypeUtil */ "./dist/server-unpacked/utils/DataTypeUtil.js");
exports.UrlUtil = {
  /**
   * Initializes the UrlUtil with optional collectionPrefix and gatewayServiceUrl.
   * If provided, these values are set after validation.
   * @param {string} [collectionPrefix] - Optional prefix for URL collections.
   * @returns {IUrlUtil} The instance of UrlUtil with updated properties.
   */
  init: function (_a) {
    var _b = _a === void 0 ? {} : _a,
      collectionPrefix = _b.collectionPrefix;
    // Set collectionPrefix if it is a valid string
    if (collectionPrefix && (0, DataTypeUtil_1.isString)(collectionPrefix)) {
      exports.UrlUtil.collectionPrefix = collectionPrefix;
    }
    return exports.UrlUtil;
  },
  /**
   * Retrieves the base URL.
   * If gatewayServiceUrl is set, it returns that; otherwise, it constructs the URL using baseUrl and collectionPrefix.
   * @returns {string} The base URL.
   */
  getBaseUrl: function () {
    var baseUrl = SettingsService_1.SettingsService.Instance.hostname;
    // Return the default baseUrl if no specific URL components are set
    return baseUrl;
  },
  /**
   * Updates the base URL by adding collection prefix if conditions are met.
   * @param {string} baseUrl - The original base URL to transform.
   * @returns {string} The transformed base URL.
   */
  getUpdatedBaseUrl: function (baseUrl) {
    // If collection prefix is set and the base URL is the default host name, return the base URL with the collection prefix.
    if (exports.UrlUtil.collectionPrefix && baseUrl === constants_1.Constants.HOST_NAME) {
      return "".concat(baseUrl, "/").concat(exports.UrlUtil.collectionPrefix);
    }
    return baseUrl;
  }
};

/***/ }),

/***/ "./dist/server-unpacked/utils/UsageStatsUtil.js":
/*!******************************************************!*\
  !*** ./dist/server-unpacked/utils/UsageStatsUtil.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UsageStatsUtil = void 0;
var TransportManager_1 = __webpack_require__(/*! ../packages/logger/core/TransportManager */ "./dist/server-unpacked/packages/logger/core/TransportManager.js");
/**
 * Manages usage statistics for the SDK.
 * Tracks various features and configurations being used by the client.
 * Implements Singleton pattern to ensure a single instance.
 */
var UsageStatsUtil = /** @class */function () {
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
    var storage = options.storage,
      logger = options.logger,
      batchEvents = options.batchEvents,
      gatewayService = options.gatewayService,
      integrations = options.integrations,
      pollingInterval = options.pollingInterval,
      _vwo_meta = options._vwo_meta,
      shouldWaitForTrackingCalls = options.shouldWaitForTrackingCalls;
    var data = {};
    // Map configuration options to usage stats flags
    if (integrations) data.ig = 1; // Integration enabled
    if (batchEvents) data.eb = 1; // Event batching enabled
    // if logger has transport or transports, then it is custom logger
    if (logger && (logger.transport || logger.transports)) data.cl = 1;
    if (storage) data.ss = 1; // Storage service configured
    if (logger === null || logger === void 0 ? void 0 : logger.level) {
      data.ll = (_a = TransportManager_1.LogLevelNumberEnum[logger.level.toUpperCase()]) !== null && _a !== void 0 ? _a : -1; // Default to -1 if level is not recognized
    }
    if (gatewayService) data.gs = 1; // Gateway service configured
    if (pollingInterval) data.pi = 1; // Polling interval configured
    if (shouldWaitForTrackingCalls) data.swtc = 1;
    // if _vwo_meta has ea, then addd data._ea to be 1
    if (_vwo_meta && _vwo_meta.ea) data._ea = 1;
    // Check if sdk running in browser and not in edge/serverless environment
    if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
      return;
    } else {
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
}();
exports.UsageStatsUtil = UsageStatsUtil;

/***/ }),

/***/ "./dist/server-unpacked/utils/UuidUtil.js":
/*!************************************************!*\
  !*** ./dist/server-unpacked/utils/UuidUtil.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getRandomUUID = getRandomUUID;
exports.getUUID = getUUID;
exports.generateUUID = generateUUID;
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
var Url_1 = __webpack_require__(/*! ../constants/Url */ "./dist/server-unpacked/constants/Url.js");
var uuid_1 = __webpack_require__(/*! uuid */ "uuid");
var uuid_2 = __webpack_require__(/*! uuid */ "uuid");
/**
 * Generates a random UUID based on an API key.
 * @param sdkKey The API key used to generate a namespace for the UUID.
 * @returns A random UUID string.
 */
function getRandomUUID(sdkKey) {
  // Generate a namespace based on the API key using DNS namespace
  var namespace = (0, uuid_2.v5)(sdkKey, uuid_2.v5.DNS);
  // Generate a random UUID using the namespace derived from the API key
  var randomUUID = (0, uuid_2.v5)((0, uuid_1.v4)(), namespace);
  return randomUUID;
}
/**
 * Generates a UUID for a user based on their userId and accountId.
 * @param userId The user's ID.
 * @param accountId The account ID associated with the user.
 * @returns A UUID string formatted without dashes and in uppercase.
 */
function getUUID(userId, accountId) {
  var VWO_NAMESPACE = (0, uuid_2.v5)(Url_1.SEED_URL, uuid_2.v5.URL);
  // Convert userId and accountId to string to ensure proper type
  userId = String(userId);
  accountId = String(accountId);
  // Generate a namespace UUID based on the accountId
  var userIdNamespace = generateUUID(accountId, VWO_NAMESPACE);
  // Generate a UUID based on the userId and the previously generated namespace
  var uuidForUserIdAccountId = generateUUID(userId, userIdNamespace);
  // Remove all dashes from the UUID and convert it to uppercase
  var desiredUuid = uuidForUserIdAccountId === null || uuidForUserIdAccountId === void 0 ? void 0 : uuidForUserIdAccountId.replace(/-/gi, '').toUpperCase();
  return desiredUuid;
}
/**
 * Helper function to generate a UUID v5 based on a name and a namespace.
 * @param name The name from which to generate the UUID.
 * @param namespace The namespace used to generate the UUID.
 * @returns A UUID string or undefined if inputs are invalid.
 */
function generateUUID(name, namespace) {
  // Check for valid input to prevent errors
  if (!name || !namespace) {
    return;
  }
  // Generate and return the UUID v5
  return (0, uuid_2.v5)(name, namespace);
}

/***/ }),

/***/ "./dist/server-unpacked/utils/XMLUtil.js":
/*!***********************************************!*\
  !*** ./dist/server-unpacked/utils/XMLUtil.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sendGetCall = sendGetCall;
exports.sendPostCall = sendPostCall;
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
var HttpMethodEnum_1 = __webpack_require__(/*! ../enums/HttpMethodEnum */ "./dist/server-unpacked/enums/HttpMethodEnum.js");
var logger_1 = __webpack_require__(/*! ../packages/logger */ "./dist/server-unpacked/packages/logger/index.js");
var LogMessageUtil_1 = __webpack_require__(/*! ./LogMessageUtil */ "./dist/server-unpacked/utils/LogMessageUtil.js");
var log_messages_1 = __webpack_require__(/*! ../enums/log-messages */ "./dist/server-unpacked/enums/log-messages/index.js");
var EventEnum_1 = __webpack_require__(/*! ../enums/EventEnum */ "./dist/server-unpacked/enums/EventEnum.js");
var noop = function () {};
function sendGetCall(options) {
  sendRequest(HttpMethodEnum_1.HttpMethodEnum.GET, options);
}
function sendPostCall(options) {
  sendRequest(HttpMethodEnum_1.HttpMethodEnum.POST, options);
}
function sendRequest(method, options) {
  var networkOptions = options.networkOptions,
    _a = options.successCallback,
    successCallback = _a === void 0 ? noop : _a,
    _b = options.errorCallback,
    errorCallback = _b === void 0 ? noop : _b;
  var retryCount = 0;
  var shouldRetry = networkOptions.retryConfig.shouldRetry;
  var maxRetries = networkOptions.retryConfig.maxRetries;
  function executeRequest() {
    var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
    if (networkOptions.port) {
      url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
    }
    var body = networkOptions.body;
    var customHeaders = networkOptions.headers || {};
    var timeout = networkOptions.timeout;
    var xhr = new XMLHttpRequest();
    if (timeout) {
      xhr.timeout = timeout;
    }
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        var response = xhr.responseText;
        if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
          var parsedResponse = JSON.parse(response);
          successCallback(parsedResponse);
        } else {
          successCallback(response);
        }
      } else if (xhr.status === 400) {
        errorCallback(xhr.statusText);
      } else {
        handleError(xhr.statusText);
      }
    };
    xhr.onerror = function () {
      handleError("".concat(xhr.statusText, ", status: ").concat(xhr.status));
    };
    if (timeout) {
      xhr.ontimeout = function () {
        handleError('Request timed out');
      };
    }
    function handleError(error) {
      if (shouldRetry && retryCount < maxRetries) {
        retryCount++;
        var delay = networkOptions.retryConfig.initialDelay * Math.pow(networkOptions.retryConfig.backoffMultiplier, retryCount) * 1000; // Exponential backoff
        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_ATTEMPT, {
          endPoint: url.split('?')[0],
          err: error,
          delay: delay,
          attempt: retryCount,
          maxRetries: maxRetries
        }));
        setTimeout(executeRequest, delay);
      } else {
        if (!String(networkOptions.path).includes(EventEnum_1.EventEnum.VWO_LOG_EVENT)) {
          logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_RETRY_FAILED, {
            endPoint: url.split('?')[0],
            err: error
          }));
        }
        errorCallback(error);
      }
    }
    xhr.open(method, url, true);
    for (var headerName in customHeaders) {
      if (headerName in customHeaders) {
        // Skip the Content-Type header
        // Request header field content-type is not allowed by Access-Control-Allow-Headers
        if (headerName !== 'Content-Type' && headerName !== 'Content-Length') {
          xhr.setRequestHeader(headerName, customHeaders[headerName]);
        }
      }
    }
    if (method === HttpMethodEnum_1.HttpMethodEnum.POST && typeof body !== 'string') {
      xhr.send(JSON.stringify(body));
    } else if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
      xhr.send();
    }
  }
  executeRequest();
}

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "murmurhash":
/*!*****************************!*\
  !*** external "murmurhash" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("murmurhash");

/***/ }),

/***/ "superstruct":
/*!******************************!*\
  !*** external "superstruct" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("superstruct");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "vwo-fme-sdk-log-messages":
/*!*******************************************!*\
  !*** external "vwo-fme-sdk-log-messages" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("vwo-fme-sdk-log-messages");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***************************************!*\
  !*** ./dist/server-unpacked/index.js ***!
  \***************************************/


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
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Flag = exports.StorageConnector = exports.LogLevelEnum = exports.onInit = exports.init = void 0;
var LogLevelEnum_1 = __webpack_require__(/*! ./packages/logger/enums/LogLevelEnum */ "./dist/server-unpacked/packages/logger/enums/LogLevelEnum.js");
Object.defineProperty(exports, "LogLevelEnum", ({
  enumerable: true,
  get: function () {
    return LogLevelEnum_1.LogLevelEnum;
  }
}));
var Connector_1 = __webpack_require__(/*! ./packages/storage/Connector */ "./dist/server-unpacked/packages/storage/Connector.js");
Object.defineProperty(exports, "StorageConnector", ({
  enumerable: true,
  get: function () {
    return Connector_1.Connector;
  }
}));
var GetFlag_1 = __webpack_require__(/*! ./api/GetFlag */ "./dist/server-unpacked/api/GetFlag.js");
Object.defineProperty(exports, "Flag", ({
  enumerable: true,
  get: function () {
    return GetFlag_1.Flag;
  }
}));
var VWO_1 = __webpack_require__(/*! ./VWO */ "./dist/server-unpacked/VWO.js");
Object.defineProperty(exports, "init", ({
  enumerable: true,
  get: function () {
    return VWO_1.init;
  }
}));
Object.defineProperty(exports, "onInit", ({
  enumerable: true,
  get: function () {
    return VWO_1.onInit;
  }
}));
})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=vwo-fme-node-sdk.js.map