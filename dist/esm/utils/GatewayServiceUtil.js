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
import { ApiEnum } from '../enums/ApiEnum.js';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum.js';
import { HttpMethodEnum } from '../enums/HttpMethodEnum.js';
import { RequestModel } from '../packages/network-layer/index.js';
import { Deferred } from './PromiseUtil.js';
/**
 * Asynchronously retrieves data from a web service using the specified query parameters and endpoint.
 * @param serviceContainer - The service container instance.
 * @param queryParams - The parameters to be used in the query string of the request.
 * @param endpoint - The endpoint URL to which the request is sent.
 * @returns A promise that resolves to the response data or false if an error occurs.
 */
export async function getFromGatewayService(serviceContainer, queryParams, endpoint, context) {
    // Create a new deferred object to manage promise resolution
    const deferredObject = new Deferred();
    // Singleton instance of the network manager
    const networkInstance = serviceContainer.getNetworkManager();
    const retryConfig = networkInstance.getRetryConfig();
    // Check if the base URL is not set correctly
    if (!serviceContainer.getSettingsService().isGatewayServiceProvided) {
        // Log an informational message about the invalid URL
        serviceContainer
            .getLogManager()
            .errorLog('INVALID_GATEWAY_URL', {}, { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
        // Resolve the promise with false indicating an error or invalid state
        deferredObject.resolve(false);
        return deferredObject.promise;
    }
    // required if sdk is running in browser environment
    // using dacdn where accountid is required
    queryParams['accountId'] = serviceContainer.getSettingsService().accountId;
    let gatewayServiceUrl = null;
    let gatewayServicePort = null;
    let gatewayServiceProtocol = null;
    if (serviceContainer.getSettingsService().gatewayServiceConfig.hostname != null) {
        gatewayServiceUrl = serviceContainer.getSettingsService().gatewayServiceConfig.hostname;
        gatewayServicePort = serviceContainer.getSettingsService().gatewayServiceConfig.port;
        gatewayServiceProtocol = serviceContainer.getSettingsService().gatewayServiceConfig.protocol;
    }
    else {
        gatewayServiceUrl = serviceContainer.getSettingsService().hostname;
        gatewayServicePort = serviceContainer.getSettingsService().port;
        gatewayServiceProtocol = serviceContainer.getSettingsService().protocol;
    }
    try {
        // Create a new request model instance with the provided parameters
        const request = new RequestModel(gatewayServiceUrl, HttpMethodEnum.GET, endpoint, queryParams, null, null, gatewayServiceProtocol, gatewayServicePort, retryConfig);
        // Perform the network GET request
        networkInstance
            .get(request)
            .then((response) => {
            // Resolve the deferred object with the data from the response
            deferredObject.resolve(response.getData());
        })
            .catch((err) => {
            // Reject the deferred object with the error response
            deferredObject.reject(err);
        });
        return deferredObject.promise;
    }
    catch (err) {
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
export function getQueryParams(queryParams) {
    const encodedParams = {};
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
export function addIsGatewayServiceRequiredFlag(settings) {
    const keywordPattern = /\b(country|region|city|os|device_type|browser_string|ua|browser_version|os_version)\b/g;
    const inlistPattern = /"custom_variable"\s*:\s*{[^}]*inlist\([^)]*\)/g;
    for (const feature of settings.getFeatures()) {
        const rules = feature.getRulesLinkedCampaign();
        for (const rule of rules) {
            let segments = {};
            if (rule.getType() === CampaignTypeEnum.PERSONALIZE || rule.getType() === CampaignTypeEnum.ROLLOUT) {
                segments = rule.getVariations()[0].getSegments();
            }
            else {
                segments = rule.getSegments();
            }
            if (segments) {
                const jsonSegments = JSON.stringify(segments);
                const keywordMatches = jsonSegments.match(keywordPattern);
                const inlistMatches = jsonSegments.match(inlistPattern);
                if ((keywordMatches && keywordMatches.length > 0) || (inlistMatches && inlistMatches.length > 0)) {
                    feature.setIsGatewayServiceRequired(true);
                    break;
                }
            }
        }
    }
}
//# sourceMappingURL=GatewayServiceUtil.js.map