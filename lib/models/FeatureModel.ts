import { VariableModel } from './VariableModel';
import { VariationModel } from './VariationModel';
import { MetricModel } from './MetricModel';
import { CampaignModel } from './CampaignModel';

export class FeatureModel {
  private var: Array<VariableModel> = [];
  private variables: Array<VariableModel> = [];

  private variations: Array<VariationModel> = [];

  private m: Array<MetricModel> = [];
  private metrics: Array<MetricModel> = [];

  private id: number;
  private key: string;

  modelFromDictionary(feature: FeatureModel): this {
    this.id = feature.id;
    this.key = feature.key;

    if (
      (feature.var && feature.var.constructor === {}.constructor) ||
      feature.variables.constructor === {}.constructor
    ) {
      this.variables = [];
    } else {
      const variableList: Array<VariableModel> = feature.var || feature.variables;
      variableList.forEach(variable => {
        this.variables.push(new VariableModel().modelFromDictionary(variable));
      });
    }

    if (
      // (feature.var && feature.var.constructor === {}.constructor) ||
      feature.variations.constructor === {}.constructor
    ) {
      this.variations = [];
    } else {
      const variationList: Array<VariationModel> = feature.variations; // feature.v ||
      variationList.forEach((variation: any) => {
        this.variations.push(new VariationModel().modelFromDictionary(variation));
      });
    }

    if (
      (feature.m && feature.m.constructor === {}.constructor) ||
    feature.metrics.constructor === {}.constructor) {
      this.metrics = [];
    } else {
      const metricList: Array<MetricModel> = feature.m || feature.metrics;
      metricList.forEach(metric => {
        this.metrics.push(new MetricModel().modelFromDictionary(metric));
      });
    }

    return this;
  }

  getVariables(): Array<VariableModel> {
    return this.variables;
  }

  getVariations(): Array<VariationModel> {
    return this.variations;
  }

  getId(): number {
    return this.id;
  }

  getKey(): string {
    return this.key;
  }
}
