import { dynamic } from '../../../types/Common';
import { GlobalRequestModel } from '../models/GlobalRequestModel';
import { RequestModel } from '../models/RequestModel';

export class RequestHandler {
  createRequest(request: RequestModel, config: GlobalRequestModel): RequestModel {
    if (
      (config.getBaseUrl() === null || config.getBaseUrl() === undefined) &&
      (request.getUrl() === null || request.getUrl() === undefined)
    ) {
      return null;
    }
    request.setUrl(request.getUrl() || config.getBaseUrl());
    request.setTimeout(request.getTimeout() || config.getTimeout());
    request.setBody(request.getBody() || config.getBody());
    request.setHeaders(request.getHeaders() || config.getHeaders());
    const requestQueryParams: Record<string, dynamic> = request.getQuery() || {};
    const configQueryParams: Record<string, dynamic> = config.getQuery() || {};

    for (const queryKey in configQueryParams) {
      if (!Object.prototype.hasOwnProperty.call(requestQueryParams, queryKey)) {
        requestQueryParams[queryKey] = configQueryParams[queryKey];
      }
    }
    request.setQuery(requestQueryParams);
    return request;
  }
}
