import { VariableModel } from './VariableModel';
import { VariationModel } from './VariationModel';
import { MetricModel } from './MetricModel';
import { CampaignModel } from './CampaignModel';
import { RuleModel } from './RuleModel';
import { ImpactCapmaignModel } from './ImpactCampaignModel';

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

  modelFromDictionary(feature: FeatureModel): this {
    this.id = feature.id;
    this.key = feature.key;
    this.name = feature.name;
    this.type = feature.type;
    if (feature.impactCampaign) {
      this.impactCampaign = new ImpactCapmaignModel().modelFromDictionary(feature.impactCampaign);
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

    if (feature.rules.constructor === {}.constructor) {
      this.rules = [];
    } else {
      const ruleList: Array<RuleModel> = feature.rules;
      ruleList.forEach(rule => {
        this.rules.push(new RuleModel().modelFromDictionary(rule));
      });
    }

    if (
      feature.rulesLinkedCampaign && feature.rulesLinkedCampaign.constructor !== {}.constructor
    ) {
      const linkedCampaignList: Array<CampaignModel> = feature.rulesLinkedCampaign;
      linkedCampaignList.forEach(linkedCampaign => {
        this.rulesLinkedCampaign.push(new CampaignModel().modelFromDictionary(linkedCampaign));
      });
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
}
