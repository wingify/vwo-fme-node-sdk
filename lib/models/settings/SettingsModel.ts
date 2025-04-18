/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { CampaignModel } from '../campaign/CampaignModel';
import { FeatureModel } from '../campaign/FeatureModel';

export class SettingsModel {
  private sK?: string;
  private sdkKey: string;

  private f?: Array<FeatureModel> = [];
  private features: Array<FeatureModel> = [];

  private c?: Array<CampaignModel> = [];
  private campaigns: Array<CampaignModel> = [];

  private campaignGroups?: Record<string, number> = {};
  private cG?: Record<string, number> = {};

  private groups?: Record<string, any> = {};
  private g?: Record<string, any> = {};

  private a?: string;
  private accountId: string;

  private v?: number;
  private version: number;
  private collectionPrefix?: string;

  constructor(settings: SettingsModel) {
    this.sdkKey = settings.sK || settings.sdkKey;
    this.accountId = settings.a || settings.accountId;
    this.version = settings.v || settings.version;
    this.collectionPrefix = settings.collectionPrefix;

    if (
      (settings.f && settings.f.constructor !== {}.constructor) ||
      (settings.features && settings.features.constructor !== {}.constructor)
    ) {
      const featureList: Array<FeatureModel> = settings.f || settings.features;
      featureList.forEach((feature) => {
        this.features.push(new FeatureModel().modelFromDictionary(feature));
      });
    }

    if (
      (settings.c && settings.c.constructor !== {}.constructor) ||
      (settings.campaigns && settings.campaigns.constructor !== {}.constructor)
    ) {
      const campaignList: Array<CampaignModel> = settings.c || settings.campaigns;
      campaignList.forEach((campaign) => {
        this.campaigns.push(new CampaignModel().modelFromDictionary(campaign));
      });
    }

    if (settings.cG || settings.campaignGroups) {
      this.campaignGroups = settings.cG || settings.campaignGroups;
    }

    if (settings.g || settings.groups) {
      this.groups = settings.g || settings.groups;
    }

    return this;
  }
  getFeatures(): Array<FeatureModel> {
    return this.features;
  }

  getCampaigns(): Array<CampaignModel> {
    return this.campaigns;
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

  getCollectionPrefix(): string {
    return this.collectionPrefix;
  }

  getCampaignGroups(): Record<string, number> {
    return this.campaignGroups;
  }

  getGroups(): Record<string, any> {
    return this.groups;
  }
}
