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
import { LogManager } from '../modules/logger';
import { NetworkManager, RequestModel, ResponseModel } from '../modules/networking';
import UrlService from '../services/UrlService';
import { dynamic } from '../types/Common';
import { Deferred } from '../utils/PromiseUtil';

export async function getFromWebService(queryParams: any, endpoint: any): Promise<any> {
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
      UrlService.getPort(),
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

export function getQueryParamForLocationPreSegment(ipAddress: string): Record<string, dynamic> {
  const path: Record<string, dynamic> = {
    ipAddress: `${ipAddress}`,
  };
  return path;
}

export function getQueryParamForUaParser(userAgent: string): Record<string, dynamic> {
  userAgent = encodeURIComponent(userAgent);
  const path: Record<string, dynamic> = {
    userAgent: `${userAgent}`,
  };
  return path;
}
