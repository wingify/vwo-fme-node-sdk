import { FeatureModel } from '../models/campaign/FeatureModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { IStorageService } from '../services/StorageService';
import { ContextModel } from '../models/user/ContextModel';
interface IStorageDecorator {
    /**
     * Sets data in storage.
     * @param data The data to be stored.
     * @param storageService The storage service instance.
     * @returns A promise that resolves to a VariationModel.
     */
    setDataInStorage(data: Record<any, any>, storageService: IStorageService): Promise<VariationModel>;
    /**
     * Retrieves a feature from storage.
     * @param featureKey The key of the feature to retrieve.
     * @param user The user object.
     * @param storageService The storage service instance.
     * @returns A promise that resolves to the retrieved feature or relevant status.
     */
    getFeatureFromStorage(featureKey: FeatureModel, context: ContextModel, storageService: IStorageService): Promise<any>;
}
export declare class StorageDecorator implements IStorageDecorator {
    /**
     * Asynchronously retrieves a feature from storage based on the feature key and user.
     * @param featureKey The key of the feature to retrieve.
     * @param user The user object.
     * @param storageService The storage service instance.
     * @returns A promise that resolves to the retrieved feature or relevant status.
     */
    getFeatureFromStorage(featureKey: any, context: ContextModel, storageService: IStorageService): Promise<any>;
    /**
     * Sets data in storage based on the provided data object.
     * @param data The data to be stored, including feature key and user details.
     * @param storageService The storage service instance.
     * @returns A promise that resolves when the data is successfully stored.
     */
    setDataInStorage(data: Record<any, any>, storageService: IStorageService): Promise<VariationModel>;
}
export {};
