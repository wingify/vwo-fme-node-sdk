import UrlService from "../services/UrlService";
import { Constants } from "../constants";
import { NetworkManager, RequestModel, ResponseModel } from "../modules/networking";
import { dynamic } from "../types/common";
import { Deferred } from '../utils/PromiseUtil';
import { LogManager } from "../modules/logger";
import { UrlEnum } from "../enums/UrlEnum";

export async function getFromWebService(queryParams: any, endpoint: any): Promise<any>{
    // implementation
    const deferredObject = new Deferred();
    const networkInstance = NetworkManager.Instance;
    if (UrlService.getBaseUrl() === UrlEnum.BASE_URL) {
      LogManager.Instance.info('Invalid URL. Please provide a valid URL for vwo helper webService');
      deferredObject.resolve(false);
      return deferredObject.promise;
    }
    try {
      const request: RequestModel = new RequestModel(
        UrlService.getBaseUrl(),
        'GET',
        endpoint,
        queryParams,
        null,
        null,
        null,
        UrlService.getPort()
      );
  
      networkInstance
        .get(request)
        .then((response: ResponseModel) => {
          deferredObject.resolve(response.getData());
        })
        .catch((err: ResponseModel) => {
          deferredObject.reject(err);
        });
  
      return deferredObject.promise;
    } catch (err) {
      console.error('Error occurred while sending GET request:', err);
      deferredObject.resolve(false);
      return deferredObject.promise;
    }
}

export function getQueryParamForLocationPreSegment(ipAddress: string): Record<string, dynamic>{
    const path: Record<string, dynamic> = {
        ipAddress: `${ipAddress}`
    };
    return path;
}

export function getQueryParamForUaParser(userAgent: string): Record<string, dynamic>{
  userAgent = encodeURIComponent(userAgent);
  const path: Record<string, dynamic> = {
      userAgent: `${userAgent}`
  };
  return path;
}
