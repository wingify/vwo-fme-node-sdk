import { CampaignModel } from '../models/campaign/CampaignModel';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { ContextModel } from '../models/user/ContextModel';
import { IStorageService } from '../services/StorageService';
export declare const checkWhitelistingAndPreSeg: (settings: SettingsModel, feature: FeatureModel, campaign: CampaignModel, context: ContextModel, evaluatedFeatureMap: Map<string, any>, megGroupWinnerCampaigns: Map<number, any>, storageService: IStorageService, decision: any) => Promise<[boolean, any]>;
export declare const evaluateTrafficAndGetVariation: (settings: SettingsModel, campaign: CampaignModel, userId: string | number) => VariationModel;
