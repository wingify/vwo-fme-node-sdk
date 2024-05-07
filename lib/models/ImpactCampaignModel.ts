import { dynamic } from '../types/Common';

export class ImpactCapmaignModel {
  private campaignId: number;
  private type: string;

  modelFromDictionary(impactCampaign: ImpactCapmaignModel): this {
    this.type = impactCampaign.type;
    this.campaignId = impactCampaign.campaignId;
    return this;
  }

  getCampaignId(): number {
    return this.campaignId;
  }

  getType(): string {
    return this.type;
  }
}
