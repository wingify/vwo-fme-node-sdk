import { MetricModel } from './MetricModel.js';
import { VariableModel } from './VariableModel.js';
import { VariationModel } from './VariationModel.js';
export class CampaignModel {
    constructor() {
        this.variations = [];
        this.metrics = [];
        this.variables = [];
    }
    copy(campaignModel) {
        this.metrics = campaignModel.metrics;
        this.variations = campaignModel.variations;
        this.variables = campaignModel.variables;
        this.processCampaignKeys(campaignModel);
    }
    modelFromDictionary(campaign) {
        this.processCampaignProperties(campaign);
        this.processCampaignKeys(campaign);
        return this;
    }
    processCampaignProperties(campaign) {
        if (campaign.variables) {
            // campaign.var ||
            if (
            // (campaign.var && campaign.var.constructor === {}.constructor) ||
            campaign.variables.constructor === {}.constructor) {
                this.variables = [];
            }
            else {
                const variableList = campaign.variables; // campaign.var ||
                variableList.forEach((variable) => {
                    this.variables.push(VariableModel.modelFromDictionary(variable));
                });
            }
        }
        if (campaign.variations) {
            // campaign.v ||
            if (
            // (campaign.v && campaign.v.constructor === {}.constructor) ||
            campaign.variations.constructor === {}.constructor) {
                this.variations = [];
            }
            else {
                const variationList = campaign.variations; // campaign.v ||
                variationList.forEach((variation) => {
                    this.variations.push(new VariationModel().modelFromDictionary(variation));
                });
            }
        }
        if (campaign.metrics) {
            // campaign.m ||
            if (campaign.metrics && campaign.metrics.constructor === {}.constructor) {
                this.metrics = [];
            }
            else {
                const metricsList = campaign.metrics || [];
                metricsList.forEach((metric) => {
                    this.metrics.push(new MetricModel().modelFromDictionary(metric));
                });
            }
        }
    }
    processCampaignKeys(campaign) {
        this.id = campaign.id;
        this.percentTraffic = campaign.percentTraffic; // campaign.pT ||
        this.name = campaign.name; // campaign.n ||
        this.variationId = campaign.variationId; // campaign.vId ||
        this.campaignId = campaign.campaignId; // campaign.cId ||
        this.ruleKey = campaign.ruleKey; // campaign.rK ||
        this.isForcedVariationEnabled = campaign.isForcedVariationEnabled; // campaign.iFVE ||
        this.isUserListEnabled = campaign.isUserListEnabled; // campaign.iULE ||
        this.segments = campaign.segments;
        this.key = campaign.key; // campaign.k ||
        // this.priority = campaign.pr || campaign.priority;
        this.type = campaign.type; // campaign.t ||
        this.salt = campaign.salt;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getSegments() {
        return this.segments;
    }
    getTraffic() {
        return this.percentTraffic;
    }
    getType() {
        return this.type;
    }
    getIsForcedVariationEnabled() {
        return this.isForcedVariationEnabled;
    }
    getIsUserListEnabled() {
        return this.isUserListEnabled;
    }
    getKey() {
        return this.key;
    }
    getMetrics() {
        return this.metrics;
    }
    getVariations() {
        return this.variations;
    }
    getVariables() {
        return this.variables;
    }
    getRuleKey() {
        return this.ruleKey;
    }
    getSalt() {
        return this.salt;
    }
}
//# sourceMappingURL=CampaignModel.js.map