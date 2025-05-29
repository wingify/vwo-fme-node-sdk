/**
 * Interface representing the structure of data to be stored
 * @interface StorageData
 */
export interface StorageData {
  rolloutId?: string;
  rolloutKey?: string;
  rolloutVariationId?: string;
  experimentKey?: string;
  experimentId?: string;
  experimentVariationId?: string;
  [key: string]: any;
}
/**
 * Interface for configuring the storage connector
 * @interface ClientStorageOptions
 */
export interface ClientStorageOptions {
  key?: string;
  provider?: Storage;
  isDisabled?: boolean;
}
/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
export declare class BrowserStorageConnector {
  private storage;
  private readonly storageKey;
  private readonly isDisabled;
  /**
   * Creates an instance of BrowserStorageConnector
   * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
   * @param {string} [options.key] - Custom key for storage (defaults to Constants.DEFAULT_LOCAL_STORAGE_KEY)
   * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
   * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
   */
  constructor(options?: ClientStorageOptions);
  /**
   * Retrieves all stored data from the storage
   * @private
   * @returns {Record<string, StorageData>} Object containing all stored data
   */
  private getStoredData;
  /**
   * Saves data to the storage
   * @private
   * @param {Record<string, StorageData>} data - The data object to be stored
   */
  private storeData;
  /**
   * Stores feature flag or experiment data for a specific user
   * @public
   * @param {StorageData} data - The data to be stored, containing feature flag or experiment information
   * @returns {Promise<void>} A promise that resolves when the data is successfully stored
   */
  set(data: StorageData): Promise<void>;
  /**
   * Retrieves stored feature flag or experiment data for a specific user
   * @public
   * @param {string} featureKey - The key of the feature flag or experiment
   * @param {string} userId - The ID of the user
   * @returns {Promise<StorageData | Record<string, any>>} A promise that resolves to the stored data or {} if not found
   */
  get(featureKey: string, userId: string): Promise<StorageData | Record<string, any>>;
}
