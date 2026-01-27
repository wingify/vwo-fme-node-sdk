import { IRetryConfig } from '../client/NetworkClient';
import { NetworkClientInterface } from '../client/NetworkClientInterface';
import { GlobalRequestModel } from '../models/GlobalRequestModel';
import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { LogManager } from '../../logger/core/LogManager';
import { ServiceContainer } from '../../../services/ServiceContainer';
export declare class NetworkManager {
  private config;
  private client;
  private retryConfig;
  private isInvalidRetryConfig;
  private logManager;
  private serviceContainer;
  constructor(
    logManager: LogManager,
    client?: NetworkClientInterface,
    retryConfig?: IRetryConfig,
    shouldWaitForTrackingCalls?: boolean,
  );
  /**
   * Validates the retry configuration parameters
   * @param {IRetryConfig} retryConfig - The retry configuration to validate
   * @returns {IRetryConfig} The validated retry configuration with corrected values
   */
  private validateRetryConfig;
  /**
   * Retrieves the current retry configuration.
   * @returns {boolean} Whether the retry configuration is invalid.
   */
  getIsInvalidRetryConfig(): boolean;
  /**
   * Retrieves the current retry configuration.
   * @returns {IRetryConfig} A copy of the current retry configuration.
   */
  getRetryConfig(): IRetryConfig;
  /**
   * Injects the service container into the network manager.
   * @param {ServiceContainer} serviceContainer - The service container to inject.
   */
  injectServiceContainer(serviceContainer: ServiceContainer): void;
  /**
   * Sets the global configuration for network requests.
   * @param {GlobalRequestModel} config - The configuration to set.
   */
  setConfig(config: GlobalRequestModel): void;
  /**
   * Retrieves the current global configuration.
   * @returns {GlobalRequestModel} The current configuration.
   */
  getConfig(): GlobalRequestModel;
  /**
   * Creates a network request model by merging specific request data with global config.
   * @param {RequestModel} request - The specific request data.
   * @returns {RequestModel} The merged request model.
   */
  createRequest(request: RequestModel): RequestModel;
  /**
   * Performs a GET request using the provided request model.
   * @param {RequestModel} request - The request model.
   * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
   */
  get(request: RequestModel): Promise<ResponseModel>;
  /**
   * Performs a POST request using the provided request model.
   * @param {RequestModel} request - The request model.
   * @returns {Promise<ResponseModel>} A promise that resolves to the response model.
   */
  post(request: RequestModel): Promise<ResponseModel>;
}
