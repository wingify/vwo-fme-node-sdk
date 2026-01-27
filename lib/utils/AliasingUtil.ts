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

import { RequestModel, ResponseModel } from '../packages/network-layer';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { UrlEnum } from '../enums/UrlEnum';
import { Deferred } from './PromiseUtil';
import { ServiceContainer } from '../services/ServiceContainer';

/**
 * Utility class for handling alias operations through network calls to gateway
 */
export class AliasingUtil {
  private static readonly KEY_USER_ID = 'userId';
  private static readonly KEY_ALIAS_ID = 'aliasId';

  // Alias API endpoints
  private static readonly GET_ALIAS_URL = UrlEnum.GET_ALIAS;
  private static readonly SET_ALIAS_URL = UrlEnum.SET_ALIAS;

  /**
   * Retrieves alias for a given user ID
   * @param userId - The user identifier
   * @returns Promise<any | null> - The response from the gateway
   */
  public static async getAlias(userId: string, serviceContainer: ServiceContainer): Promise<any | null> {
    // Create a deferred object for proper promise handling
    const deferredObject = new Deferred();
    try {
      let gatewayServiceUrl = null;
      let gatewayServicePort = null;
      let gatewayServiceProtocol = null;
      const retryConfig = serviceContainer.getNetworkManager().getRetryConfig();

      if (serviceContainer.getSettingsService().gatewayServiceConfig.hostname != null) {
        gatewayServiceUrl = serviceContainer.getSettingsService().gatewayServiceConfig.hostname;
        gatewayServicePort = serviceContainer.getSettingsService().gatewayServiceConfig.port;
        gatewayServiceProtocol = serviceContainer.getSettingsService().gatewayServiceConfig.protocol;
      } else {
        gatewayServiceUrl = serviceContainer.getSettingsService().hostname;
        gatewayServicePort = serviceContainer.getSettingsService().port;
        gatewayServiceProtocol = serviceContainer.getSettingsService().protocol;
      }

      const queryParams = {};
      queryParams['accountId'] = serviceContainer.getSettingsService().accountId;
      queryParams['sdkKey'] = serviceContainer.getSettingsService().sdkKey;
      // Backend expects userId as JSON array
      queryParams[this.KEY_USER_ID] = JSON.stringify([userId]);

      const request = new RequestModel(
        gatewayServiceUrl,
        HttpMethodEnum.GET,
        this.GET_ALIAS_URL,
        queryParams,
        null,
        null,
        gatewayServiceProtocol,
        gatewayServicePort,
        retryConfig,
      );

      // Perform the network GET request
      serviceContainer
        .getNetworkManager()
        .get(request)
        .then((response: ResponseModel) => {
          // Resolve the deferred object with the response
          deferredObject.resolve(response.getData());
        })
        .catch((err: ResponseModel) => {
          // Reject the deferred object with the error response
          deferredObject.reject(err);
        });

      return deferredObject.promise;
    } catch (error) {
      // Resolve the promise with false as fallback
      deferredObject.resolve(false);
      return deferredObject.promise;
    }
  }

  /**
   * Sets alias for a given user ID
   * @param userId - The user identifier
   * @param aliasId - The alias identifier to set
   * @returns Promise<ResponseModel | null> - The response from the gateway
   */
  public static async setAlias(
    userId: string,
    aliasId: string,
    serviceContainer: ServiceContainer,
  ): Promise<any | null> {
    // Create a deferred object for proper promise handling
    const deferredObject = new Deferred();

    try {
      let gatewayServiceUrl = null;
      let gatewayServicePort = null;
      let gatewayServiceProtocol = null;
      const retryConfig = serviceContainer.getNetworkManager().getRetryConfig();

      if (serviceContainer.getSettingsService().gatewayServiceConfig.hostname != null) {
        gatewayServiceUrl = serviceContainer.getSettingsService().gatewayServiceConfig.hostname;
        gatewayServicePort = serviceContainer.getSettingsService().gatewayServiceConfig.port;
        gatewayServiceProtocol = serviceContainer.getSettingsService().gatewayServiceConfig.protocol;
      } else {
        gatewayServiceUrl = serviceContainer.getSettingsService().hostname;
        gatewayServicePort = serviceContainer.getSettingsService().port;
        gatewayServiceProtocol = serviceContainer.getSettingsService().protocol;
      }

      const queryParams = {};
      queryParams['accountId'] = serviceContainer.getSettingsService().accountId;
      queryParams['sdkKey'] = serviceContainer.getSettingsService().sdkKey;
      queryParams[this.KEY_USER_ID] = userId;
      queryParams[this.KEY_ALIAS_ID] = aliasId;

      const requestBody = {
        [this.KEY_USER_ID]: userId,
        [this.KEY_ALIAS_ID]: aliasId,
      };

      const request = new RequestModel(
        gatewayServiceUrl,
        HttpMethodEnum.POST,
        this.SET_ALIAS_URL,
        queryParams,
        requestBody,
        null,
        gatewayServiceProtocol,
        gatewayServicePort,
        retryConfig,
      );

      // Perform the network POST request
      serviceContainer
        .getNetworkManager()
        .post(request)
        .then((response: ResponseModel) => {
          // Resolve the deferred object with the response
          deferredObject.resolve(response.getData());
        })
        .catch((err: ResponseModel) => {
          // Reject the deferred object with the error response
          deferredObject.reject(err);
        });

      return deferredObject.promise;
    } catch (error) {
      // Resolve the promise with false as fallback
      deferredObject.resolve(false);
      return deferredObject.promise;
    }
  }
}
