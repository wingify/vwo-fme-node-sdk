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
import { UrlEnum } from '../enums/UrlEnum';
import { isString } from '../utils/DataTypeUtil';
import { SettingsManager } from './SettingsManager';

interface UrlServiceType {
  collectionPrefix?: string;
  init({ collectionPrefix }?: { collectionPrefix?: string }): UrlServiceType;
  getBaseUrl(): string;
}

const UrlService: UrlServiceType = {
  /**
   * Initializes the UrlService with optional collectionPrefix and gatewayServiceUrl.
   * If provided, these values are set after validation.
   * @param {string} [collectionPrefix] - Optional prefix for URL collections.
   * @returns {UrlServiceType} The instance of UrlService with updated properties.
   */
  init({ collectionPrefix }: { collectionPrefix?: string } = {}) {
    // Set collectionPrefix if it is a valid string
    if (collectionPrefix && isString(collectionPrefix)) {
      UrlService.collectionPrefix = collectionPrefix;
    }

    return UrlService;
  },

  /**
   * Retrieves the base URL.
   * If gatewayServiceUrl is set, it returns that; otherwise, it constructs the URL using baseUrl and collectionPrefix.
   * @returns {string} The base URL.
   */
  getBaseUrl() {
    const baseUrl: string = SettingsManager.Instance.hostname;

    if (SettingsManager.Instance.isGatewayServiceProvided) {
      return baseUrl;
    }

    // Construct URL with collectionPrefix if it exists
    if (UrlService.collectionPrefix) {
      return `${baseUrl}/${UrlService.collectionPrefix}`;
    }

    // Return the default baseUrl if no specific URL components are set
    return baseUrl;
  },
};

export default UrlService;
