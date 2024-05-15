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

export class CampaignModel {
  private id: number;
  private segments: Record<string, dynamic>;
  private percentTraffic: number;
  private isUserListEnabled: boolean;
  // private autoActivate: boolean;
  // private autoTrack: boolean;
  private key: string;
  // private priority: number;
  private type: string;
  private name: string;
  private isForcedVariationEnabled: boolean;
  private variations: Array<VariationModel> = [];
  private metrics: Array<MetricModel> = [];
  private variables: Array<VariableModel> = [];
  private variationId: number;
  private campaignId: number;
  private ruleKey: string;
  // private featureId: number;
  // private featureKey: string;

  copy(campaignModel: CampaignModel): void {
    this.metrics = campaignModel.metrics;
    this.variations = campaignModel.variations;
    this.variables = campaignModel.variables;
    this.processCampaignKeys(campaignModel);
  }

  modelFromDictionary(campaign: CampaignModel): this {
    this.processCampaignProperties(campaign);
    this.processCampaignKeys(campaign);
    return this;
  }

  processCampaignProperties(campaign: CampaignModel): void {
    if (campaign.variables) {
      // campaign.var ||
      if (
        // (campaign.var && campaign.var.constructor === {}.constructor) ||
        campaign.variables.constructor === {}.constructor
      ) {
        this.variables = [];
      } else {
        const variableList: Array<VariableModel> = campaign.variables; // campaign.var ||
        variableList.forEach((variable: any) => {
          this.variables.push(new VariableModel().modelFromDictionary(variable));
        });
      }
    }

    if (campaign.variations) {
      // campaign.v ||
      if (
        // (campaign.v && campaign.v.constructor === {}.constructor) ||
        campaign.variations.constructor === {}.constructor
      ) {
        this.variations = [];
      } else {
        const variationList: Array<VariationModel> = campaign.variations; // campaign.v ||
        variationList.forEach((variation: any) => {
          this.variations.push(new VariationModel().modelFromDictionary(variation));
        });
      }
    }

    if (campaign.metrics) {
      // campaign.m ||
      if (campaign.metrics && campaign.metrics.constructor === {}.constructor) {
        this.metrics = [];
      } else {
        const metricsList: Array<MetricModel> = campaign.metrics || [];
        metricsList.forEach((metric: any) => {
          this.metrics.push(new MetricModel().modelFromDictionary(metric));
        });
      }
    }
  }

  processCampaignKeys(campaign: CampaignModel): void {
    this.id = campaign.id;
    this.percentTraffic = campaign.percentTraffic; // campaign.pT ||
    this.name = campaign.name; // campaign.n ||
    this.variationId = campaign.variationId; // campaign.vId ||
    this.campaignId = campaign.campaignId; // campaign.cId ||
    this.ruleKey = campaign.ruleKey; // campaign.rK ||
    // this.autoActivate =
    //   campaign.autoActivate !== undefined
    //     ? campaign.autoActivate
    //     : campaign.iMAE
    //     ? !campaign.iMAE
    //     : !campaign.isManualActivationEnabled;
    // this.autoTrack =
    //   campaign.autoTrack !== undefined
    //     ? campaign.autoTrack
    //     : campaign.iMTRE
    //     ? !campaign.iMTRE
    //     : !campaign.isManualTrackingEnabled;
    this.isForcedVariationEnabled = campaign.isForcedVariationEnabled; // campaign.iFVE ||
    this.isUserListEnabled = campaign.isUserListEnabled; // campaign.iULE ||
    this.segments = campaign.segments;
    this.key = campaign.key; // campaign.k ||
    // this.priority = campaign.pr || campaign.priority;
    this.type = campaign.type; // campaign.t ||
    // this.featureId = campaign.featureId;
    // this.featureKey = campaign.featureKey;
  }

  // setFeatureDetails(featuerId: number, featureKey: string): void {
  //   this.featureId = featuerId;
  //   this.featureKey = featureKey;
  // }

  // getFeatureId(): number {
  //   return this.featureId;
  // }

  // getFeatureKey(): string {
  //   return this.featureKey;
  // }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getSegments(): Record<string, dynamic> {
    return this.segments;
  }

  getTraffic(): number {
    return this.percentTraffic;
  }

  getType(): string {
    return this.type;
  }

  getIsForcedVariationEnabled(): boolean {
    return this.isForcedVariationEnabled;
  }

  getIsUserListEnabled(): boolean {
    return this.isUserListEnabled;
  }

  // getAutoTrack(): boolean {
  //   return this.autoTrack;
  // }

  // getAutoActivate(): boolean {
  //   return this.autoActivate;
  // }

  getKey(): string {
    return this.key;
  }

  getMetrics(): Array<MetricModel> {
    return this.metrics;
  }

  getVariations(): Array<VariationModel> {
    return this.variations;
  }

  getVariables(): Array<VariableModel> {
    return this.variables;
  }

  // getPriority(): number {
  //   return this.priority;
  // }
}
