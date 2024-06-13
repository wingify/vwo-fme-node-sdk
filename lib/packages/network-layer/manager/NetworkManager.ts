/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
import { NetworkClientInterface } from '../client/NetworkClientInterface';
import { RequestHandler } from '../handlers/RequestHandler';
import { GlobalRequestModel } from '../models/GlobalRequestModel';
import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';

export class NetworkManager {
  private config: GlobalRequestModel; // Holds the global configuration for network requests
  private client: NetworkClientInterface; // Interface for the network client handling the actual HTTP requests
  private static instance: NetworkManager; // Singleton instance of NetworkManager

  /**
   * Attaches a network client to the manager, or uses a default if none provided.
   * @param {NetworkClientInterface} client - The client to attach, optional.
   */
  attachClient(client?: NetworkClientInterface): void {
    if ((typeof process.env as any) === 'undefined') {
      const { NetworkBrowserClient } = require('../client/NetworkBrowserClient');

      this.client = client || new NetworkBrowserClient(); // Use provided client or default to NetworkClient
    } else {
      const { NetworkClient } = require('../client/NetworkClient');

      this.client = client || new NetworkClient(); // Use provided client or default to NetworkClient
    }

    this.config = new GlobalRequestModel(null, null, null, null); // Initialize with default config
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
