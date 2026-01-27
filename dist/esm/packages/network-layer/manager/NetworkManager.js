/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { Deferred } from '../../../utils/PromiseUtil.js';
import { RequestHandler } from '../handlers/RequestHandler.js';
import { GlobalRequestModel } from '../models/GlobalRequestModel.js';
import { Constants } from '../../../constants/index.js';
import { isBoolean, isNumber } from '../../../utils/DataTypeUtil.js';
import { NetworkServerLessClient } from '../client/NetworkServerLessClient.js';
import { NetworkBrowserClient } from '../client/NetworkBrowserClient.js';
import { buildMessage } from '../../../utils/LogMessageUtil.js';
import { DebugLogMessagesEnum } from '../../../enums/log-messages/index.js';
import { HTTPS_PROTOCOL } from '../../../constants/Url.js';
export class NetworkManager {
    constructor(logManager, client, retryConfig, shouldWaitForTrackingCalls = false) {
        this.logManager = logManager;
        // Only set retry configuration if it's not already initialized or if a new config is provided
        if (!this.retryConfig || retryConfig) {
            // Define default retry configuration
            const defaultRetryConfig = Constants.DEFAULT_RETRY_CONFIG;
            // Merge provided retryConfig with defaults, giving priority to provided values
            const mergedConfig = {
                ...defaultRetryConfig,
                ...(retryConfig || {}),
            };
            // Validate the merged configuration
            this.retryConfig = this.validateRetryConfig(mergedConfig);
            // If shouldWaitForTrackingCalls is true, set shouldRetry to false
            // This is because we don't want to retry the request if the SDK is waiting for a network response (serverless mode)
            if (shouldWaitForTrackingCalls) {
                this.retryConfig.shouldRetry = false;
            }
        }
        // if env is undefined, we are in browser
        if (typeof process === 'undefined') {
            // if XMLHttpRequest is undefined, we are in serverless
            if (typeof XMLHttpRequest === 'undefined') {
                this.client = client || new NetworkServerLessClient(this.logManager);
            }
            else {
                this.logManager.debug(buildMessage(DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                    api: 'xhr',
                    process: 'undefined',
                }));
                // if XMLHttpRequest is defined, we are in browser
                this.client = client || new NetworkBrowserClient(this.logManager); // Use provided client or default to NetworkClient
            }
        }
        else {
            // if env is defined, we expect to be in Node
            // In CommonJS builds `require` exists; in pure ESM it does not.
            if (typeof require === 'function') {
                this.logManager.debug(buildMessage(DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                    api: HTTPS_PROTOCOL,
                    process: 'defined',
                }));
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { NetworkClient } = require('../client/NetworkClient');
                this.client = client || new NetworkClient(this.logManager); // Use provided client or default to NetworkClient
            }
            else {
                // Node ESM runtime: fall back to the fetch-based client which is compatible everywhere
                this.client = client || new NetworkServerLessClient(this.logManager);
            }
        }
        this.config = new GlobalRequestModel(null, null, null, null); // Initialize with default config
    }
    /**
     * Validates the retry configuration parameters
     * @param {IRetryConfig} retryConfig - The retry configuration to validate
     * @returns {IRetryConfig} The validated retry configuration with corrected values
     */
    validateRetryConfig(retryConfig) {
        const validatedConfig = { ...retryConfig };
        // Validate shouldRetry: should be a boolean value
        if (!isBoolean(validatedConfig.shouldRetry)) {
            validatedConfig.shouldRetry = Constants.DEFAULT_RETRY_CONFIG.shouldRetry;
            this.isInvalidRetryConfig = true;
        }
        // Validate maxRetries: should be a non-negative integer and should not be less than 1
        if (!isNumber(validatedConfig.maxRetries) ||
            !Number.isInteger(validatedConfig.maxRetries) ||
            validatedConfig.maxRetries < 1) {
            validatedConfig.maxRetries = Constants.DEFAULT_RETRY_CONFIG.maxRetries;
            this.isInvalidRetryConfig = true;
        }
        // Validate initialDelay: should be a non-negative integer and should not be less than 1
        if (!isNumber(validatedConfig.initialDelay) ||
            !Number.isInteger(validatedConfig.initialDelay) ||
            validatedConfig.initialDelay < 1) {
            validatedConfig.initialDelay = Constants.DEFAULT_RETRY_CONFIG.initialDelay;
            this.isInvalidRetryConfig = true;
        }
        // Validate backoffMultiplier: should be a non-negative integer and should not be less than 2
        if (!isNumber(validatedConfig.backoffMultiplier) ||
            !Number.isInteger(validatedConfig.backoffMultiplier) ||
            validatedConfig.backoffMultiplier < 2) {
            validatedConfig.backoffMultiplier = Constants.DEFAULT_RETRY_CONFIG.backoffMultiplier;
            this.isInvalidRetryConfig = true;
        }
        return this.isInvalidRetryConfig ? Constants.DEFAULT_RETRY_CONFIG : validatedConfig;
    }
    /**
     * Retrieves the current retry configuration.
     * @returns {boolean} Whether the retry configuration is invalid.
     */
    getIsInvalidRetryConfig() {
        return this.isInvalidRetryConfig;
    }
    /**
     * Retrieves the current retry configuration.
     * @returns {IRetryConfig} A copy of the current retry configuration.
     */
    getRetryConfig() {
        return { ...this.retryConfig };
    }
    /**
     * Injects the service container into the network manager.
     * @param {ServiceContainer} serviceContainer - The service container to inject.
     */
    injectServiceContainer(serviceContainer) {
        this.serviceContainer = serviceContainer;
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
        const options = new RequestHandler().createRequest(request, this.config); // Merge and create request
        return options;
    }
    /**
     * Performs a GET request using the provided request model.
     * @param {RequestModel} request - The request model.
     * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
     */
    get(request) {
        const deferred = new Deferred(); // Create a new deferred promise
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
        const deferred = new Deferred(); // Create a new deferred promise
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
//# sourceMappingURL=NetworkManager.js.map