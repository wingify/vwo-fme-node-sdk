import { IVWOClient } from './VWOClient';
import { IVWOOptions } from './models/VWOOptionsModel';
import { dynamic } from './types/Common';
export declare class VWO {
  private static vwoBuilder;
  private static instance;
  /**
   * Constructor for the VWO class.
   * Initializes a new instance of VWO with the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for the VWO instance.
   * @returns The instance of VWO.
   */
  constructor(options: IVWOOptions);
  /**
   * Sets the singleton instance of VWO.
   * Configures and builds the VWO instance using the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for setting up VWO.
   * @returns A Promise resolving to the configured VWO instance.
   */
  private static setInstance;
  /**
   * Gets the singleton instance of VWO.
   * @returns The singleton instance of VWO.
   */
  static get Instance(): dynamic;
}
/**
 * Initializes a new instance of VWO with the provided options.
 * @param options Configuration options for the VWO instance.
 * @property {string} sdkKey - The SDK key for the VWO account.
 * @property {string} accountId - The account ID for the VWO account.
 * @property {GatewayServiceModel} gatewayService - The gateway service configuration.
 * @property {StorageService} storage - The storage configuration.
 * @returns
 */
export declare function init(options: IVWOOptions): Promise<IVWOClient>;
export declare function onInit(): Promise<any>;
