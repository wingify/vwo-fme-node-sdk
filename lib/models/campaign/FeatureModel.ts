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
import { CampaignModel } from './CampaignModel';
import { ImpactCapmaignModel } from './ImpactCampaignModel';
import { MetricModel } from './MetricModel';
import { RuleModel } from './RuleModel';

export class FeatureModel {
  private m: Array<MetricModel> = [];
  private metrics: Array<MetricModel> = [];
  private id: number;
  private key: string;
  private name: string;
  private type: string;
  private rules: Array<RuleModel> = [];
  private impactCampaign: ImpactCapmaignModel = null;

  private rulesLinkedCampaign: Array<CampaignModel> = [];
  private isGatewayServiceRequired: boolean = false;

  modelFromDictionary(feature: FeatureModel): this {
    this.id = feature.id;
    this.key = feature.key;
    this.name = feature.name;
    this.type = feature.type;
    if (feature?.isGatewayServiceRequired) {
      this.isGatewayServiceRequired = feature.isGatewayServiceRequired;
    }
    if (feature.impactCampaign) {
      this.impactCampaign = new ImpactCapmaignModel().modelFromDictionary(feature.impactCampaign);
    }

    if ((feature.m && feature.m.constructor === {}.constructor) || feature.metrics?.constructor === {}.constructor) {
      this.metrics = [];
    } else {
      const metricList: Array<MetricModel> = feature.m || feature.metrics;
      metricList?.forEach((metric) => {
        this.metrics.push(new MetricModel().modelFromDictionary(metric));
      });
    }

    if (feature?.rules?.constructor === {}.constructor) {
      this.rules = [];
    } else {
      const ruleList: Array<RuleModel> = feature.rules;
      ruleList?.forEach((rule) => {
        this.rules.push(new RuleModel().modelFromDictionary(rule));
      });
    }

    if (feature?.rulesLinkedCampaign && feature.rulesLinkedCampaign?.constructor !== {}.constructor) {
      const linkedCampaignList: Array<CampaignModel> = feature.rulesLinkedCampaign;
      this.rulesLinkedCampaign = linkedCampaignList;
    }

    return this;
  }

  getName(): string {
    return this.name;
  }

  getType(): string {
    return this.type;
  }

  getId(): number {
    return this.id;
  }

  getKey(): string {
    return this.key;
  }

  getRules(): Array<RuleModel> {
    return this.rules;
  }

  getImpactCampaign(): ImpactCapmaignModel {
    return this.impactCampaign;
  }

  getRulesLinkedCampaign(): Array<CampaignModel> {
    return this.rulesLinkedCampaign;
  }

  setRulesLinkedCampaign(rulesLinkedCampaign: Array<CampaignModel>): void {
    this.rulesLinkedCampaign = rulesLinkedCampaign;
  }

  getMetrics(): Array<MetricModel> {
    return this.metrics;
  }

  getIsGatewayServiceRequired(): boolean {
    return this.isGatewayServiceRequired;
  }

  setIsGatewayServiceRequired(isGatewayServiceRequired: boolean): void {
    this.isGatewayServiceRequired = isGatewayServiceRequired;
  }
}
