import { FeatureModel } from '../models/campaign/FeatureModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { ContextModel } from '../models/user/ContextModel';
import { IStorageService } from '../services/StorageService';
/**
 * Evaluates groups for a given feature and group ID.
 *
 * @param settings - The settings model.
 * @param feature - The feature model to evaluate.
 * @param groupId - The ID of the group.
 * @param evaluatedFeatureMap - A map containing evaluated features.
 * @param context - The context model.
 * @param storageService - The storage service.
 * @returns A promise that resolves to the evaluation result.
 */
export declare const evaluateGroups: (settings: SettingsModel, feature: FeatureModel, groupId: number, evaluatedFeatureMap: Map<string, any>, context: ContextModel, storageService: IStorageService) => Promise<any>;
/**
 * Retrieves feature keys associated with a group based on the group ID.
 *
 * @param settings - The settings model.
 * @param groupId - The ID of the group.
 * @returns An object containing feature keys and group campaign IDs.
 */
export declare function getFeatureKeysFromGroup(settings: SettingsModel, groupId: number): {
    featureKeys: any[];
    groupCampaignIds: any;
};
