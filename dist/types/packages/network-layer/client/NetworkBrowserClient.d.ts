import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { NetworkClientInterface } from './NetworkClientInterface';
import { LogManager } from '../../logger';
import { NetworkTransportModeEnum } from '../../../enums/NetworkTransportModeEnum';
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
export declare class NetworkBrowserClient implements NetworkClientInterface {
  private logManager;
  private networkTransportMode;
  constructor(logManager: LogManager, networkTransportMode?: NetworkTransportModeEnum);
  /**
   * Performs a GET request using the provided RequestModel.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
   */
  GET(requestModel: RequestModel): Promise<ResponseModel>;
  /**
   * Performs a POST request using navigator.sendBeacon. If the request is not queued, it will be performed using XHR.
   * @param {RequestModel} request - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  POST(requestModel: RequestModel): Promise<ResponseModel>;
  /**
   * Performs a POST request using XHR.
   * @param {RequestModel} requestModel - The model containing request options.
   * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
   */
  POST_XHR(requestModel: RequestModel): Promise<ResponseModel>;
}
