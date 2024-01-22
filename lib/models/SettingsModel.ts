import { FeatureModel } from './FeatureModel';
import { CampaignModel } from './CampaignModel';
import { dynamic } from '../types/common';

export class SettingsModel {
  private sK: string;
  private sdkKey: string;

  private f: Array<FeatureModel> = [];
  private features: Array<FeatureModel> = [];

  private c: Array<CampaignModel> = [];
  private campaigns: Array<CampaignModel> = [];

  private a: string;
  private accountId: string;

  private v: number;
  private version: number;
  collectionPrefix: string;

  constructor(settings: SettingsModel) {
    this.sdkKey = settings.sK || settings.sdkKey;
    this.accountId = settings.a || settings.accountId;
    this.version = settings.v || settings.version;
    this.collectionPrefix = settings.collectionPrefix;

    if ((settings.f && settings.f.constructor !== {}.constructor) || settings.features.constructor !== {}.constructor) {
      const featureList: Array<FeatureModel> = settings.f || settings.features;
      featureList.forEach(feature => {
        this.features.push(new FeatureModel().modelFromDictionary(feature));
      });
    }

    if ((settings.c && settings.c.constructor !== {}.constructor) || settings.campaigns.constructor !== {}.constructor) {
      const campaignList: Array<CampaignModel> = settings.c || settings.campaigns;
      campaignList.forEach(campaign => {
        this.campaigns.push(new CampaignModel().modelFromDictionary(campaign));
      });
    }

    return this;
  }
  getFeatures(): Array<FeatureModel> {
    return this.features;
  }

  getSdkkey(): string {
    return this.sdkKey;
  }

  getAccountId(): string {
    return this.accountId;
  }

  getVersion(): number {
    return this.version;
  }
}
