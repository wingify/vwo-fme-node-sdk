/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
import { dynamic } from '../../types/Common';
import { MetricModel } from './MetricModel';
import { VariableModel } from './VariableModel';
import { VariationModel } from './VariationModel';
export declare class CampaignModel {
  private id;
  private segments;
  private salt;
  private percentTraffic;
  private isUserListEnabled;
  private key;
  private type;
  private name;
  private isForcedVariationEnabled;
  private variations;
  private metrics;
  private variables;
  private variationId;
  private campaignId;
  private ruleKey;
  copy(campaignModel: CampaignModel): void;
  modelFromDictionary(campaign: CampaignModel): this;
  processCampaignProperties(campaign: CampaignModel): void;
  processCampaignKeys(campaign: CampaignModel): void;
  getId(): number;
  getName(): string;
  getSegments(): Record<string, dynamic>;
  getTraffic(): number;
  getType(): string;
  getIsForcedVariationEnabled(): boolean;
  getIsUserListEnabled(): boolean;
  getKey(): string;
  getMetrics(): Array<MetricModel>;
  getVariations(): Array<VariationModel>;
  getVariables(): Array<VariableModel>;
  getRuleKey(): string;
  getSalt(): string;
}
