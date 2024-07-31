import { GlobalRequestModel } from '../models/GlobalRequestModel';
import { RequestModel } from '../models/RequestModel';
/**
 * A class responsible for creating and modifying request models based on a global configuration.
 */
export declare class RequestHandler {
  /**
   * Creates a new request by merging properties from a base request and a configuration model.
   * If both the request URL and the base URL from the configuration are missing, it returns null.
   * Otherwise, it merges the properties from the configuration into the request if they are not already set.
   *
   * @param {RequestModel} request - The initial request model.
   * @param {GlobalRequestModel} config - The global request configuration model.
   * @returns {RequestModel} The merged request model or null if both URLs are missing.
   */
  createRequest(request: RequestModel, config: GlobalRequestModel): RequestModel;
}
