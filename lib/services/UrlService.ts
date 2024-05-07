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
  init({ collectionPrefix, webServiceUrl }: { collectionPrefix?: string; webServiceUrl?: any } = {}) {
    if (collectionPrefix && isString(collectionPrefix)) {
      UrlService.collectionPrefix = collectionPrefix;
    }

    if (webServiceUrl && isString(webServiceUrl)) {
      // parse the url
      const parsedUrl = new URL(`https://${webServiceUrl}`);
      UrlService.webServiceUrl = parsedUrl.hostname;
      UrlService.port = parseInt(parsedUrl.port);
    } else {
      UrlService.port = 80;
    }

    return UrlService;
  },

  getBaseUrl() {
    const baseUrl: string = UrlEnum.BASE_URL;

    if (UrlService.webServiceUrl) {
      return UrlService.webServiceUrl;
    }

    if (UrlService.collectionPrefix) {
      return `${baseUrl}/${UrlService.collectionPrefix}`;
    }

    return baseUrl;
  },

  getPort() {
    return UrlService.port;
  },
};

export default UrlService;
