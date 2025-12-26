import { ContextModel } from '../models/user/ContextModel';
export interface IStorageService {
  getDataInStorage(featureKey: any, context: ContextModel): Promise<Record<any, any>>;
  setDataInStorage(data: Record<any, any>): Promise<void>;
}
export declare class StorageService implements IStorageService {
  private storageData;
  /**
   * Retrieves data from storage based on the feature key and user ID.
   * @param featureKey The key to identify the feature data.
   * @param user The user object containing at least an ID.
   * @returns A promise that resolves to the data retrieved or an error/storage status enum.
   */
  getDataInStorage(featureKey: any, context: ContextModel): Promise<Record<any, any>>;
  /**
   * Stores data in the storage.
   * @param data The data to be stored as a record.
   * @returns A promise that resolves to true if data is successfully stored, otherwise false.
   */
  setDataInStorage(data: Record<any, any>): Promise<void>;
  /**
   * Gets the settings from storage.
   * @param accountId The account ID.
   * @param sdkKey The SDK key.
   * @returns {Promise<Record<string, any>>} A promise that resolves to the settings or empty object if not found.
   */
  getSettingsFromStorage(
    accountId: number,
    sdkKey: string,
    shouldFetchFreshSettings?: boolean,
  ): Promise<Record<string, any>>;
  /**
   * Sets the settings in storage.
   * @param accountId The account ID.
   * @param sdkKey The SDK key.
   * @param settings The settings to be stored.
   * @returns {Promise<void>} A promise that resolves when the settings are successfully stored.
   */
  setSettingsInStorage(accountId: number, sdkKey: string, settings: Record<string, any>): Promise<void>;
  /**
   * Fetches fresh settings and updates the storage with a new timestamp
   */
  setFreshSettingsInStorage(accountId: number, sdkKey: string): Promise<void>;
}
