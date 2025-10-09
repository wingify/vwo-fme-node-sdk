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
export declare class SettingsModel {
    private sK?;
    private sdkKey;
    private f?;
    private features;
    private c?;
    private campaigns;
    private campaignGroups?;
    private cG?;
    private groups?;
    private g?;
    private a?;
    private accountId;
    private v?;
    private version;
    private collectionPrefix?;
    private pollInterval?;
    private usageStatsAccountId?;
    constructor(settings: SettingsModel);
    getFeatures(): Array<FeatureModel>;
    getCampaigns(): Array<CampaignModel>;
    getSdkkey(): string;
    getAccountId(): string;
    getVersion(): number;
    getCollectionPrefix(): string;
    getCampaignGroups(): Record<string, number>;
    getGroups(): Record<string, any>;
    setPollInterval(value: number): void;
    getPollInterval(): number;
    getUsageStatsAccountId(): number;
}
