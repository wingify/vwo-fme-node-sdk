import { SettingsModel } from '../models/settings/SettingsModel';
import { ContextModel } from '../models/user/ContextModel';
import { ServiceContainer } from '../services/ServiceContainer';
/**
 * Asynchronously retrieves data from a web service using the specified query parameters and endpoint.
 * @param serviceContainer - The service container instance.
 * @param queryParams - The parameters to be used in the query string of the request.
 * @param endpoint - The endpoint URL to which the request is sent.
 * @returns A promise that resolves to the response data or false if an error occurs.
 */
export declare function getFromGatewayService(
  serviceContainer: ServiceContainer,
  queryParams: any,
  endpoint: any,
  context: ContextModel,
): Promise<any>;
/**
 * Encodes the query parameters to ensure they are URL-safe.
 * @param queryParams  The query parameters to be encoded.
 * @returns  An object containing the encoded query parameters.
 */
export declare function getQueryParams(queryParams: Record<string, string | number>): Record<string, string>;
/**
 * Adds isGatewayServiceRequired flag to each feature in the settings based on pre segmentation.
 * @param {any} settings - The settings file to modify.
 */
export declare function addIsGatewayServiceRequiredFlag(settings: SettingsModel): void;
