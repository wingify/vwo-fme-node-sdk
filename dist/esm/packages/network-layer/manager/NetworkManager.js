"use strict";
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
const PromiseUtil_1 = require("../../../utils/PromiseUtil");
const RequestHandler_1 = require("../handlers/RequestHandler");
const GlobalRequestModel_1 = require("../models/GlobalRequestModel");
const constants_1 = require("../../../constants");
const DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
const LogManager_1 = require("../../logger/core/LogManager");
const log_messages_1 = require("../../../enums/log-messages");
const LogMessageUtil_1 = require("../../../utils/LogMessageUtil");
class NetworkManager {
    /**
     * Validates the retry configuration parameters
     * @param {IRetryConfig} retryConfig - The retry configuration to validate
     * @returns {IRetryConfig} The validated retry configuration with corrected values
     */
    validateRetryConfig(retryConfig) {
        const validatedConfig = { ...retryConfig };
        let isInvalidConfig = false;
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
            LogManager_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.RETRY_CONFIG_INVALID, {
                retryConfig: JSON.stringify(validatedConfig),
            }));
        }
        return isInvalidConfig ? constants_1.Constants.DEFAULT_RETRY_CONFIG : validatedConfig;
    }
    /**
     * Attaches a network client to the manager, or uses a default if none provided.
     * @param {NetworkClientInterface} client - The client to attach, optional.
     * @param {IRetryConfig} retryConfig - The retry configuration, optional.
     */
    attachClient(client, retryConfig) {
        // Only set retry configuration if it's not already initialized or if a new config is provided
        if (!this.retryConfig || retryConfig) {
            // Define default retry configuration
            const defaultRetryConfig = constants_1.Constants.DEFAULT_RETRY_CONFIG;
            // Merge provided retryConfig with defaults, giving priority to provided values
            const mergedConfig = {
                ...defaultRetryConfig,
                ...(retryConfig || {}),
            };
            // Validate the merged configuration
            this.retryConfig = this.validateRetryConfig(mergedConfig);
        }
        // if env is undefined, we are in browser
        if (typeof process === 'undefined') {
            // if XMLHttpRequest is undefined, we are in serverless
            if (typeof XMLHttpRequest === 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { NetworkServerLessClient } = require('../client/NetworkServerLessClient');
                this.client = client || new NetworkServerLessClient();
            }
            else {
                // if XMLHttpRequest is defined, we are in browser
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { NetworkBrowserClient } = require('../client/NetworkBrowserClient');
                this.client = client || new NetworkBrowserClient(); // Use provided client or default to NetworkClient
            }
        }
        else {
            // if env is defined, we are in node
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { NetworkClient } = require('../client/NetworkClient');
            this.client = client || new NetworkClient(); // Use provided client or default to NetworkClient
        }
        this.config = new GlobalRequestModel_1.GlobalRequestModel(null, null, null, null); // Initialize with default config
    }
    /**
     * Retrieves the current retry configuration.
     * @returns {IRetryConfig} A copy of the current retry configuration.
     */
    getRetryConfig() {
        return { ...this.retryConfig };
    }
    /**
     * Singleton accessor for the NetworkManager instance.
     * @returns {NetworkManager} The singleton instance.
     */
    static get Instance() {
        this.instance = this.instance || new NetworkManager(); // Create instance if it doesn't exist
        return this.instance;
    }
    /**
     * Sets the global configuration for network requests.
     * @param {GlobalRequestModel} config - The configuration to set.
     */
    setConfig(config) {
        this.config = config; // Set the global request configuration
    }
    /**
     * Retrieves the current global configuration.
     * @returns {GlobalRequestModel} The current configuration.
     */
    getConfig() {
        return this.config; // Return the global request configuration
    }
    /**
     * Creates a network request model by merging specific request data with global config.
     * @param {RequestModel} request - The specific request data.
     * @returns {RequestModel} The merged request model.
     */
    createRequest(request) {
        const options = new RequestHandler_1.RequestHandler().createRequest(request, this.config); // Merge and create request
        return options;
    }
    /**
     * Performs a GET request using the provided request model.
     * @param {RequestModel} request - The request model.
     * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
     */
    get(request) {
        const deferred = new PromiseUtil_1.Deferred(); // Create a new deferred promise
        const networkOptions = this.createRequest(request); // Create network request options
        if (!networkOptions.getUrl()) {
            deferred.reject(new Error('no url found')); // Reject if no URL is found
        }
        else {
            this.client
                .GET(networkOptions)
                .then((response) => {
                deferred.resolve(response); // Resolve with the response
            })
                .catch((errorResponse) => {
                deferred.reject(errorResponse); // Reject with the error response
            });
        }
        return deferred.promise; // Return the promise
    }
    /**
     * Performs a POST request using the provided request model.
     * @param {RequestModel} request - The request model.
     * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
     */
    post(request) {
        const deferred = new PromiseUtil_1.Deferred(); // Create a new deferred promise
        const networkOptions = this.createRequest(request); // Create network request options
        if (!networkOptions.getUrl()) {
            deferred.reject(new Error('no url found')); // Reject if no URL is found
        }
        else {
            this.client
                .POST(networkOptions)
                .then((response) => {
                deferred.resolve(response); // Resolve with the response
            })
                .catch((error) => {
                deferred.reject(error); // Reject with the error
            });
        }
        return deferred.promise; // Return the promise
    }
}
exports.NetworkManager = NetworkManager;
//# sourceMappingURL=NetworkManager.js.map