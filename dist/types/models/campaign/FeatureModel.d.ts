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
import { CampaignModel } from './CampaignModel';
import { ImpactCapmaignModel } from './ImpactCampaignModel';
import { MetricModel } from './MetricModel';
import { RuleModel } from './RuleModel';
export declare class FeatureModel {
  private m;
  private metrics;
  private id;
  private key;
  private name;
  private type;
  private rules;
  private impactCampaign;
  private rulesLinkedCampaign;
  private isGatewayServiceRequired;
  modelFromDictionary(feature: FeatureModel): this;
  getName(): string;
  getType(): string;
  getId(): number;
  getKey(): string;
  getRules(): Array<RuleModel>;
  getImpactCampaign(): ImpactCapmaignModel;
  getRulesLinkedCampaign(): Array<CampaignModel>;
  setRulesLinkedCampaign(rulesLinkedCampaign: Array<CampaignModel>): void;
  getMetrics(): Array<MetricModel>;
  getIsGatewayServiceRequired(): boolean;
  setIsGatewayServiceRequired(isGatewayServiceRequired: boolean): void;
}
