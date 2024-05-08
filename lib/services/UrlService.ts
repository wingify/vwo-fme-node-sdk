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
  webServiceUrl?: string;
  port?: number;
  init({ collectionPrefix, webServiceUrl }?: { collectionPrefix?: string; webServiceUrl?: string }): UrlServiceType;
  getBaseUrl(): string;
  getPort(): number;
}

const UrlService: UrlServiceType = {
  /**
   * Initializes the UrlService with optional collectionPrefix and webServiceUrl.
   * If provided, these values are set after validation.
   * @param {string} [collectionPrefix] - Optional prefix for URL collections.
   * @param {string} [webServiceUrl] - Optional web service URL.
   * @returns {UrlServiceType} The instance of UrlService with updated properties.
   */
  init({ collectionPrefix, webServiceUrl }: { collectionPrefix?: string; webServiceUrl?: any } = {}) {
    // Set collectionPrefix if it is a valid string
    if (collectionPrefix && isString(collectionPrefix)) {
      UrlService.collectionPrefix = collectionPrefix;
    }

    // Parse and set webServiceUrl and port if webServiceUrl is a valid string
    if (webServiceUrl && isString(webServiceUrl)) {
      const parsedUrl = new URL(`https://${webServiceUrl}`);
      UrlService.webServiceUrl = parsedUrl.hostname;
      UrlService.port = parseInt(parsedUrl.port) || 80; // Default to port 80 if no port specified
    } else {
      UrlService.port = 80; // Default port if no webServiceUrl provided
    }

    return UrlService;
  },

  /**
   * Retrieves the base URL.
   * If webServiceUrl is set, it returns that; otherwise, it constructs the URL using baseUrl and collectionPrefix.
   * @returns {string} The base URL.
   */
  getBaseUrl() {
    const baseUrl: string = UrlEnum.BASE_URL;

    // Return the webServiceUrl if it exists
    if (UrlService.webServiceUrl) {
      return UrlService.webServiceUrl;
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
    return UrlService.port;
  },
};

export default UrlService;
