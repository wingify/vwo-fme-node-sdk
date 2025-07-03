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
import { Deferred } from '../../../utils/PromiseUtil';
import { IRetryConfig } from '../client/NetworkClient';
import { NetworkClientInterface } from '../client/NetworkClientInterface';
import { RequestHandler } from '../handlers/RequestHandler';
import { GlobalRequestModel } from '../models/GlobalRequestModel';
import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { Constants } from '../../../constants';
import { isBoolean, isNumber } from '../../../utils/DataTypeUtil';
import { LogManager } from '../../logger/core/LogManager';
import { ErrorLogMessagesEnum } from '../../../enums/log-messages';
import { buildMessage } from '../../../utils/LogMessageUtil';

export class NetworkManager {
  private config: GlobalRequestModel; // Holds the global configuration for network requests
  private client: NetworkClientInterface; // Interface for the network client handling the actual HTTP requests
  private static instance: NetworkManager; // Singleton instance of NetworkManager
  private retryConfig: IRetryConfig;

  /**
   * Validates the retry configuration parameters
   * @param {IRetryConfig} retryConfig - The retry configuration to validate
   * @returns {IRetryConfig} The validated retry configuration with corrected values
   */
  private validateRetryConfig(retryConfig: IRetryConfig): IRetryConfig {
    const validatedConfig: IRetryConfig = { ...retryConfig };
    let isInvalidConfig = false;

    // Validate shouldRetry: should be a boolean value
    if (!isBoolean(validatedConfig.shouldRetry)) {
      validatedConfig.shouldRetry = Constants.DEFAULT_RETRY_CONFIG.shouldRetry;
      isInvalidConfig = true;
    }

    // Validate maxRetries: should be a non-negative integer and should not be less than 1
    if (
      !isNumber(validatedConfig.maxRetries) ||
      !Number.isInteger(validatedConfig.maxRetries) ||
      validatedConfig.maxRetries < 1
    ) {
      validatedConfig.maxRetries = Constants.DEFAULT_RETRY_CONFIG.maxRetries;
      isInvalidConfig = true;
    }

    // Validate initialDelay: should be a non-negative integer and should not be less than 1
    if (
      !isNumber(validatedConfig.initialDelay) ||
      !Number.isInteger(validatedConfig.initialDelay) ||
      validatedConfig.initialDelay < 1
    ) {
      validatedConfig.initialDelay = Constants.DEFAULT_RETRY_CONFIG.initialDelay;
      isInvalidConfig = true;
    }

    // Validate backoffMultiplier: should be a non-negative integer and should not be less than 2
    if (
      !isNumber(validatedConfig.backoffMultiplier) ||
      !Number.isInteger(validatedConfig.backoffMultiplier) ||
      validatedConfig.backoffMultiplier < 2
    ) {
      validatedConfig.backoffMultiplier = Constants.DEFAULT_RETRY_CONFIG.backoffMultiplier;
      isInvalidConfig = true;
    }

    if (isInvalidConfig) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessagesEnum.RETRY_CONFIG_INVALID, {
          retryConfig: JSON.stringify(validatedConfig),
        }),
      );
    }
    return isInvalidConfig ? Constants.DEFAULT_RETRY_CONFIG : validatedConfig;
  }

  /**
   * Attaches a network client to the manager, or uses a default if none provided.
   * @param {NetworkClientInterface} client - The client to attach, optional.
   * @param {IRetryConfig} retryConfig - The retry configuration, optional.
   */
  attachClient(client?: NetworkClientInterface, retryConfig?: IRetryConfig): void {
    // Only set retry configuration if it's not already initialized or if a new config is provided
    if (!this.retryConfig || retryConfig) {
      // Define default retry configuration
      const defaultRetryConfig: IRetryConfig = Constants.DEFAULT_RETRY_CONFIG;

      // Merge provided retryConfig with defaults, giving priority to provided values
      const mergedConfig = {
        ...defaultRetryConfig,
        ...(retryConfig || {}),
      };

      // Validate the merged configuration
      this.retryConfig = this.validateRetryConfig(mergedConfig);
    }

    // if env is undefined, we are in browser
    if ((typeof process.env as any) === 'undefined') {
      // if XMLHttpRequest is undefined, we are in serverless
      if (typeof XMLHttpRequest === 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { NetworkServerLessClient } = require('../client/NetworkServerLessClient');
        this.client = client || new NetworkServerLessClient();
      } else {
        // if XMLHttpRequest is defined, we are in browser
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { NetworkBrowserClient } = require('../client/NetworkBrowserClient');

        this.client = client || new NetworkBrowserClient(); // Use provided client or default to NetworkClient
      }
    } else {
      // if env is defined, we are in node
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { NetworkClient } = require('../client/NetworkClient');

      this.client = client || new NetworkClient(); // Use provided client or default to NetworkClient
    }

    this.config = new GlobalRequestModel(null, null, null, null); // Initialize with default config
  }

  /**
   * Retrieves the current retry configuration.
   * @returns {IRetryConfig} A copy of the current retry configuration.
   */
  getRetryConfig(): IRetryConfig {
    return { ...this.retryConfig };
  }

  /**
   * Singleton accessor for the NetworkManager instance.
   * @returns {NetworkManager} The singleton instance.
   */
  static get Instance(): NetworkManager {
    this.instance = this.instance || new NetworkManager(); // Create instance if it doesn't exist
    return this.instance;
  }

  /**
   * Sets the global configuration for network requests.
   * @param {GlobalRequestModel} config - The configuration to set.
   */
  setConfig(config: GlobalRequestModel): void {
    this.config = config; // Set the global request configuration
  }

  /**
   * Retrieves the current global configuration.
   * @returns {GlobalRequestModel} The current configuration.
   */
  getConfig(): GlobalRequestModel {
    return this.config; // Return the global request configuration
  }

  /**
   * Creates a network request model by merging specific request data with global config.
   * @param {RequestModel} request - The specific request data.
   * @returns {RequestModel} The merged request model.
   */
  createRequest(request: RequestModel): RequestModel {
    const options: RequestModel = new RequestHandler().createRequest(request, this.config); // Merge and create request
    return options;
  }

  /**
   * Performs a GET request using the provided request model.
   * @param {RequestModel} request - The request model.
   * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
   */
  get(request: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred(); // Create a new deferred promise

    const networkOptions: RequestModel = this.createRequest(request); // Create network request options
    if (!networkOptions.getUrl()) {
      deferred.reject(new Error('no url found')); // Reject if no URL is found
    } else {
      this.client
        .GET(networkOptions)
        .then((response: ResponseModel) => {
          deferred.resolve(response); // Resolve with the response
        })
        .catch((errorResponse: ResponseModel) => {
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
  post(request: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred(); // Create a new deferred promise

    const networkOptions: RequestModel = this.createRequest(request); // Create network request options
    if (!networkOptions.getUrl()) {
      deferred.reject(new Error('no url found')); // Reject if no URL is found
    } else {
      this.client
        .POST(networkOptions)
        .then((response: ResponseModel) => {
          deferred.resolve(response); // Resolve with the response
        })
        .catch((error: ResponseModel) => {
          deferred.reject(error); // Reject with the error
        });
    }

    return deferred.promise; // Return the promise
  }
}
