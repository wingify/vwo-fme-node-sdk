"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var RequestHandler_1 = require("../handlers/RequestHandler");
var GlobalRequestModel_1 = require("../models/GlobalRequestModel");
var constants_1 = require("../../../constants");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var LogManager_1 = require("../../logger/core/LogManager");
var ApiEnum_1 = require("../../../enums/ApiEnum");
var NetworkManager = /** @class */ (function () {
    function NetworkManager() {
    }
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
        if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.maxRetries) ||
            !Number.isInteger(validatedConfig.maxRetries) ||
            validatedConfig.maxRetries < 1) {
            validatedConfig.maxRetries = constants_1.Constants.DEFAULT_RETRY_CONFIG.maxRetries;
            isInvalidConfig = true;
        }
        // Validate initialDelay: should be a non-negative integer and should not be less than 1
        if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.initialDelay) ||
            !Number.isInteger(validatedConfig.initialDelay) ||
            validatedConfig.initialDelay < 1) {
            validatedConfig.initialDelay = constants_1.Constants.DEFAULT_RETRY_CONFIG.initialDelay;
            isInvalidConfig = true;
        }
        // Validate backoffMultiplier: should be a non-negative integer and should not be less than 2
        if (!(0, DataTypeUtil_1.isNumber)(validatedConfig.backoffMultiplier) ||
            !Number.isInteger(validatedConfig.backoffMultiplier) ||
            validatedConfig.backoffMultiplier < 2) {
            validatedConfig.backoffMultiplier = constants_1.Constants.DEFAULT_RETRY_CONFIG.backoffMultiplier;
            isInvalidConfig = true;
        }
        if (isInvalidConfig) {
            LogManager_1.LogManager.Instance.errorLog('INVALID_RETRY_CONFIG', {
                retryConfig: JSON.stringify(validatedConfig),
            }, { an: ApiEnum_1.ApiEnum.INIT });
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
            var mergedConfig = __assign(__assign({}, defaultRetryConfig), (retryConfig || {}));
            // Validate the merged configuration
            this.retryConfig = this.validateRetryConfig(mergedConfig);
        }
        // if env is undefined, we are in browser
        if (typeof process === 'undefined') {
            // if XMLHttpRequest is undefined, we are in serverless
            if (typeof XMLHttpRequest === 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                var NetworkServerLessClient = require('../client/NetworkServerLessClient').NetworkServerLessClient;
                this.client = client || new NetworkServerLessClient();
            }
            else {
                // if XMLHttpRequest is defined, we are in browser
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                var NetworkBrowserClient = require('../client/NetworkBrowserClient').NetworkBrowserClient;
                this.client = client || new NetworkBrowserClient(); // Use provided client or default to NetworkClient
            }
        }
        else {
            // if env is defined, we are in node
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var NetworkClient = require('../client/NetworkClient').NetworkClient;
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
        }
        else {
            this.client
                .GET(networkOptions)
                .then(function (response) {
                deferred.resolve(response); // Resolve with the response
            })
                .catch(function (errorResponse) {
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
        }
        else {
            this.client
                .POST(networkOptions)
                .then(function (response) {
                deferred.resolve(response); // Resolve with the response
            })
                .catch(function (error) {
                deferred.reject(error); // Reject with the error
            });
        }
        return deferred.promise; // Return the promise
    };
    return NetworkManager;
}());
exports.NetworkManager = NetworkManager;
//# sourceMappingURL=NetworkManager.js.map