import { isString } from '../utils/DataTypeUtil';
import { UrlEnum } from '../enums/UrlEnum';

interface UrlServiceType {
  collectionPrefix?: string;
  init({ collectionPrefix }?: { collectionPrefix?: string }): UrlServiceType;
  getBaseUrl(): string;
}

const UrlService: UrlServiceType = {
  init({ collectionPrefix }: { collectionPrefix?: string } = {}) {
    if (collectionPrefix && isString(collectionPrefix)) {
      UrlService.collectionPrefix = collectionPrefix;
    }

    return UrlService;
  },

  getBaseUrl() {
    const baseUrl: string = UrlEnum.BASE_URL;

    if (UrlService.collectionPrefix) {
      return `${baseUrl}/${UrlService.collectionPrefix}`;
    }

    return baseUrl;
  }
};

export default UrlService;
