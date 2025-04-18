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
import { SettingsService } from '../services/SettingsService';
import { isString } from './DataTypeUtil';

interface IUrlUtil {
  collectionPrefix?: string;
  init({ collectionPrefix }?: { collectionPrefix?: string }): IUrlUtil;
  getBaseUrl(): string;
}

export const UrlUtil: IUrlUtil = {
  /**
   * Initializes the UrlUtil with optional collectionPrefix and gatewayServiceUrl.
   * If provided, these values are set after validation.
   * @param {string} [collectionPrefix] - Optional prefix for URL collections.
   * @returns {IUrlUtil} The instance of UrlUtil with updated properties.
   */
  init: ({ collectionPrefix }: { collectionPrefix?: string } = {}) => {
    // Set collectionPrefix if it is a valid string
    if (collectionPrefix && isString(collectionPrefix)) {
      UrlUtil.collectionPrefix = collectionPrefix;
    }

    return UrlUtil;
  },

  /**
   * Retrieves the base URL.
   * If gatewayServiceUrl is set, it returns that; otherwise, it constructs the URL using baseUrl and collectionPrefix.
   * @returns {string} The base URL.
   */
  getBaseUrl: () => {
    const baseUrl: string = SettingsService.Instance.hostname;

    if (SettingsService.Instance.isGatewayServiceProvided) {
      return baseUrl;
    }

    // Construct URL with collectionPrefix if it exists
    if (UrlUtil.collectionPrefix) {
      return `${baseUrl}/${UrlUtil.collectionPrefix}`;
    }

    // Return the default baseUrl if no specific URL components are set
    return baseUrl;
  },
};
