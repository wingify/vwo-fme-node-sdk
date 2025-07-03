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
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum';
import { HttpMethodEnum } from '../enums/HttpMethodEnum';
import { ErrorLogMessagesEnum } from '../enums/log-messages';
import { SettingsModel } from '../models/settings/SettingsModel';
import { LogManager } from '../packages/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../packages/network-layer';
import { SettingsService } from '../services/SettingsService';
import { Deferred } from './PromiseUtil';
import { UrlUtil } from './UrlUtil';

/**
 * Asynchronously retrieves data from a web service using the specified query parameters and endpoint.
 * @param queryParams - The parameters to be used in the query string of the request.
 * @param endpoint - The endpoint URL to which the request is sent.
 * @returns A promise that resolves to the response data or false if an error occurs.
 */
export async function getFromGatewayService(queryParams: any, endpoint: any): Promise<any> {
  // Create a new deferred object to manage promise resolution
  const deferredObject = new Deferred();
  // Singleton instance of the network manager
  const networkInstance = NetworkManager.Instance;
  const retryConfig = networkInstance.getRetryConfig();

  // Check if the base URL is not set correctly
  if (!SettingsService.Instance.isGatewayServiceProvided) {
    // Log an informational message about the invalid URL
    LogManager.Instance.error(ErrorLogMessagesEnum.GATEWAY_URL_ERROR);
    // Resolve the promise with false indicating an error or invalid state
    deferredObject.resolve(false);
    return deferredObject.promise;
  }

  // required if sdk is running in browser environment
  // using dacdn where accountid is required
  queryParams['accountId'] = SettingsService.Instance.accountId;

  try {
    // Create a new request model instance with the provided parameters
    const request: RequestModel = new RequestModel(
      UrlUtil.getBaseUrl(),
      HttpMethodEnum.GET,
      endpoint,
      queryParams,
      null,
      null,
      SettingsService.Instance.protocol,
      SettingsService.Instance.port,
      retryConfig,
    );

    // Perform the network GET request
    networkInstance
      .get(request)
      .then((response: ResponseModel) => {
        // Resolve the deferred object with the data from the response
        deferredObject.resolve(response.getData());
      })
      .catch((err: ResponseModel) => {
        // Reject the deferred object with the error response
        deferredObject.reject(err);
      });

    return deferredObject.promise;
  } catch (err) {
    // Resolve the promise with false as fallback
    deferredObject.resolve(false);
    return deferredObject.promise;
  }
}

/**
 * Encodes the query parameters to ensure they are URL-safe.
 * @param queryParams  The query parameters to be encoded.
 * @returns  An object containing the encoded query parameters.
 */
export function getQueryParams(queryParams: Record<string, string | number>): Record<string, string> {
  const encodedParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(queryParams)) {
    // Encode the parameter value to ensure it is URL-safe
    const encodedValue = encodeURIComponent(String(value));
    // Add the encoded parameter to the result object
    encodedParams[key] = encodedValue;
  }

  return encodedParams;
}

/**
 * Adds isGatewayServiceRequired flag to each feature in the settings based on pre segmentation.
 * @param {any} settings - The settings file to modify.
 */
export function addIsGatewayServiceRequiredFlag(settings: SettingsModel): void {
  // \b(?<!\"custom_variable\"[^\}]*)(country|region|city|os|device_type|browser_string|ua)\b: This part matches the usual patterns (like country, region, etc.) that are not under custom_variable
  // |(?<="custom_variable"\s*:\s*{\s*"[^)]*"\s*:\s*")inlist\([^)]*\)(?="): This part matches inlist(*) only when it appears under "custom_variable" : { ".*" : "
  const pattern =
    /\b(?<!"custom_variable"[^}]*)(country|region|city|os|device_type|browser_string|ua)\b|(?<="custom_variable"\s*:\s*{\s*"name"\s*:\s*")inlist\([^)]*\)(?=")/g;

  for (const feature of settings.getFeatures()) {
    const rules = feature.getRulesLinkedCampaign();
    for (const rule of rules) {
      let segments = {};
      if (rule.getType() === CampaignTypeEnum.PERSONALIZE || rule.getType() === CampaignTypeEnum.ROLLOUT) {
        segments = rule.getVariations()[0].getSegments();
      } else {
        segments = rule.getSegments();
      }
      if (segments) {
        const jsonSegments = JSON.stringify(segments);
        const matches = jsonSegments.match(pattern);
        if (matches && matches.length > 0) {
          feature.setIsGatewayServiceRequired(true);
          break;
        }
      }
    }
  }
}
