import { isString } from '../utils/DataTypeUtil';
import { UrlEnum } from '../enums/UrlEnum';

interface UrlServiceType {
  collectionPrefix?: string;
  webServiceUrl?: string;
  port?: number;
  init({ collectionPrefix, webServiceUrl }?: { collectionPrefix?: string, webServiceUrl?: string }): UrlServiceType;
  getBaseUrl(): string;
  getPort(): number;
}

const UrlService: UrlServiceType = {
  init({ collectionPrefix, webServiceUrl }: { collectionPrefix?: string, webServiceUrl?: any } = {}) {
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
  }
};

export default UrlService;
