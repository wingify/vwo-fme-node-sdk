import { dynamic } from '../types/common';

export class RuleModel {
  private status: boolean;

  private variationId: number;

  private campaignId: number;

  private type: string;

  modelFromDictionary(rule: RuleModel): this {
    this.type = rule.type;
    this.status = rule.status;
    this.variationId = rule.variationId;
    this.campaignId = rule.campaignId;
    return this;
  }

  getCampaignId(): number {
    return this.campaignId;
  }

  getVariationId(): number {
    return this.variationId;
  }

  getStatus(): boolean {
    return this.status;
  }

  getType(): string {
    return this.type;
  }
}
