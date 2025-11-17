"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureModel = void 0;
const ImpactCampaignModel_1 = require("./ImpactCampaignModel");
const MetricModel_1 = require("./MetricModel");
const RuleModel_1 = require("./RuleModel");
class FeatureModel {
    constructor() {
        this.m = [];
        this.metrics = [];
        this.rules = [];
        this.impactCampaign = null;
        this.isDebuggerEnabled = false;
        this.rulesLinkedCampaign = [];
        this.isGatewayServiceRequired = false;
    }
    modelFromDictionary(feature) {
        this.id = feature.id;
        this.key = feature.key;
        this.name = feature.name;
        this.type = feature.type;
        if (feature?.isDebuggerEnabled) {
            this.isDebuggerEnabled = feature.isDebuggerEnabled;
        }
        if (feature?.isGatewayServiceRequired) {
            this.isGatewayServiceRequired = feature.isGatewayServiceRequired;
        }
        if (feature.impactCampaign) {
            this.impactCampaign = new ImpactCampaignModel_1.ImpactCapmaignModel().modelFromDictionary(feature.impactCampaign);
        }
        if ((feature.m && feature.m.constructor === {}.constructor) || feature.metrics?.constructor === {}.constructor) {
            this.metrics = [];
        }
        else {
            const metricList = feature.m || feature.metrics;
            metricList?.forEach((metric) => {
                this.metrics.push(new MetricModel_1.MetricModel().modelFromDictionary(metric));
            });
        }
        if (feature?.rules?.constructor === {}.constructor) {
            this.rules = [];
        }
        else {
            const ruleList = feature.rules;
            ruleList?.forEach((rule) => {
                this.rules.push(new RuleModel_1.RuleModel().modelFromDictionary(rule));
            });
        }
        if (feature?.rulesLinkedCampaign && feature.rulesLinkedCampaign?.constructor !== {}.constructor) {
            const linkedCampaignList = feature.rulesLinkedCampaign;
            this.rulesLinkedCampaign = linkedCampaignList;
        }
        return this;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    getId() {
        return this.id;
    }
    getKey() {
        return this.key;
    }
    getRules() {
        return this.rules;
    }
    getImpactCampaign() {
        return this.impactCampaign;
    }
    getRulesLinkedCampaign() {
        return this.rulesLinkedCampaign;
    }
    setRulesLinkedCampaign(rulesLinkedCampaign) {
        this.rulesLinkedCampaign = rulesLinkedCampaign;
    }
    getMetrics() {
        return this.metrics;
    }
    getIsGatewayServiceRequired() {
        return this.isGatewayServiceRequired;
    }
    setIsGatewayServiceRequired(isGatewayServiceRequired) {
        this.isGatewayServiceRequired = isGatewayServiceRequired;
    }
    getIsDebuggerEnabled() {
        return this.isDebuggerEnabled;
    }
}
exports.FeatureModel = FeatureModel;
//# sourceMappingURL=FeatureModel.js.map