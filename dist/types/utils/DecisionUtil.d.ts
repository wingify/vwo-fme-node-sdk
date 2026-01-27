import { CampaignModel } from '../models/campaign/CampaignModel';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { ContextModel } from '../models/user/ContextModel';
import { IStorageService } from '../services/StorageService';
import { ServiceContainer } from '../services/ServiceContainer';
export declare const checkWhitelistingAndPreSeg: (
  serviceContainer: ServiceContainer,
  feature: FeatureModel,
  campaign: CampaignModel,
  context: ContextModel,
  evaluatedFeatureMap: Map<string, any>,
  megGroupWinnerCampaigns: Map<number, any>,
  storageService: IStorageService,
  decision: any,
) => Promise<[boolean, any]>;
export declare const evaluateTrafficAndGetVariation: (
  serviceContainer: ServiceContainer,
  campaign: CampaignModel,
  userId: string | number,
) => VariationModel;
