import { IRetryConfig } from '../client/NetworkClient';
import { NetworkClientInterface } from '../client/NetworkClientInterface';
import { GlobalRequestModel } from '../models/GlobalRequestModel';
import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
export declare class NetworkManager {
    private config;
    private client;
    private static instance;
    private retryConfig;
    /**
     * Validates the retry configuration parameters
     * @param {IRetryConfig} retryConfig - The retry configuration to validate
     * @returns {IRetryConfig} The validated retry configuration with corrected values
     */
    private validateRetryConfig;
    /**
     * Attaches a network client to the manager, or uses a default if none provided.
     * @param {NetworkClientInterface} client - The client to attach, optional.
     * @param {IRetryConfig} retryConfig - The retry configuration, optional.
     */
    attachClient(client?: NetworkClientInterface, retryConfig?: IRetryConfig): void;
    /**
     * Retrieves the current retry configuration.
     * @returns {IRetryConfig} A copy of the current retry configuration.
     */
    getRetryConfig(): IRetryConfig;
    /**
     * Singleton accessor for the NetworkManager instance.
     * @returns {NetworkManager} The singleton instance.
     */
    static get Instance(): NetworkManager;
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
