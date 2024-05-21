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

interface UrlServiceType {
  collectionPrefix?: string;
  gatewayServiceUrl?: string;
  gatewayServicePort?: number;
  init({
    collectionPrefix,
    gatewayServiceUrl,
    gatewayServicePort,
  }?: {
    collectionPrefix?: string;
    gatewayServiceUrl?: string;
    gatewayServicePort: number;
  }): UrlServiceType;
  getBaseUrl(): string;
  getPort(): number;
}

const UrlService: UrlServiceType = {
  /**
   * Initializes the UrlService with optional collectionPrefix and gatewayServiceUrl.
   * If provided, these values are set after validation.
   * @param {string} [collectionPrefix] - Optional prefix for URL collections.
   * @param {string} [gatewayServiceUrl] - Optional web service URL.
   * @returns {UrlServiceType} The instance of UrlService with updated properties.
   */
  init({
    collectionPrefix,
    gatewayServiceUrl,
    gatewayServicePort,
  }: { collectionPrefix?: string; gatewayServiceUrl?: string; gatewayServicePort?: number } = {}) {
    // Set collectionPrefix if it is a valid string
    if (collectionPrefix && isString(collectionPrefix)) {
      UrlService.collectionPrefix = collectionPrefix;
    }

    // Parse and set gatewayServiceUrl and port if gatewayServiceUrl is a valid string
    if (gatewayServiceUrl && isString(gatewayServiceUrl)) {
      const parsedUrl = new URL(`https://${gatewayServiceUrl}`);
      UrlService.gatewayServiceUrl = parsedUrl.hostname;
      if (parsedUrl.port) {
        UrlService.gatewayServicePort = parseInt(parsedUrl.port);
      } else if (gatewayServicePort !== undefined) {
        UrlService.gatewayServicePort = gatewayServicePort;
      }
    }

    return UrlService;
  },

  /**
   * Retrieves the base URL.
   * If gatewayServiceUrl is set, it returns that; otherwise, it constructs the URL using baseUrl and collectionPrefix.
   * @returns {string} The base URL.
   */
  getBaseUrl() {
    const baseUrl: string = UrlEnum.BASE_URL;

    // Return the gatewayServiceUrl if it exists
    if (UrlService.gatewayServiceUrl) {
      return UrlService.gatewayServiceUrl;
    }

    // Construct URL with collectionPrefix if it exists
    if (UrlService.collectionPrefix) {
      return `${baseUrl}/${UrlService.collectionPrefix}`;
    }

    // Return the default baseUrl if no specific URL components are set
    return baseUrl;
  },

  /**
   * Retrieves the configured port for the URL service.
   * @returns {number} The port number.
   */
  getPort() {
    return UrlService.gatewayServicePort;
  },
};

export default UrlService;
