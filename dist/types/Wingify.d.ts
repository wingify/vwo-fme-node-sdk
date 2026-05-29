import { IWingifyClient } from './WingifyClient';
import { IWingifyOptions } from './models/WingifyOptionsModel';
import { dynamic } from './types/Common';
export declare class Wingify {
  private static wingifyBuilder;
  private static instance;
  /**
   * Constructor for the Wingify class.
   * Initializes a new instance of Wingify with the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for the Wingify instance.
   * @returns The instance of Wingify.
   */
  constructor(options: IWingifyOptions);
  /**
   * Sets the singleton instance of Wingify.
   * Configures and builds the Wingify instance using the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for setting up Wingify.
   * @returns A Promise resolving to the configured Wingify instance.
   */
  private static setInstance;
  /**
   * Gets the singleton instance of Wingify.
   * @returns The singleton instance of Wingify.
   */
  static get Instance(): dynamic;
}
/**
 * Initializes a new instance of Wingify with the provided options.
 * @param options Configuration options for the Wingify instance.
 * @property {string} sdkKey - The SDK key for the Wingify account.
 * @property {string} accountId - The account ID for the Wingify account.
 * @property {GatewayServiceModel} gatewayService - The gateway service configuration.
 * @property {string} proxyUrl - (Browser only) Custom proxy URL to redirect all API calls. If provided, all GET and POST calls will be made to this URL instead of the default HOST_NAME.
 * @property {StorageService} storage - The storage configuration.
 * @returns
 */
export declare function init(options: IWingifyOptions): Promise<IWingifyClient>;
export declare function onInit(): Promise<any>;
