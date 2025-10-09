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
}
