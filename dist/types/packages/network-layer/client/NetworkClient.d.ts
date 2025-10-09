import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';
import { NetworkClientInterface } from './NetworkClientInterface';
export interface IRetryConfig {
    shouldRetry?: boolean;
    initialDelay?: number;
    maxRetries?: number;
    backoffMultiplier?: number;
}
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
export declare class NetworkClient implements NetworkClientInterface {
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
    /**
     * Helper function to retry or reject
     * @param {any} error - The error to retry or reject
     * @param {number} attempt - The attempt number
     * @param {any} deferred - The deferred object
     * @param {string} operation - The operation to retry or reject
     * @param {Function} attemptRequest - The function to attempt the request
     */
    private retryOrReject;
}
