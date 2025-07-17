import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { NetworkClientInterface } from './NetworkClientInterface';
/**
 * Sets the proxy URL for all browser network calls.
 * This function is called from VWOBuilder when proxyUrl is provided in options.
 *
 * @param {string} proxyUrl - The proxy URL to use for all network requests
 */
export declare function setProxyUrl(proxyUrlPassedInInit: string): void;
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
export declare class NetworkBrowserClient implements NetworkClientInterface {
  /**
   * Performs a GET request using the provided RequestModel.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
   */
  GET(requestModel: RequestModel): Promise<ResponseModel>;
  /**
   * Performs a POST request using the provided RequestModel.
   * @param {RequestModel} request - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  POST(request: RequestModel): Promise<ResponseModel>;
}
