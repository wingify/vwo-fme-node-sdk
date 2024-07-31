"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureModel = void 0;
var ImpactCampaignModel_1 = require("./ImpactCampaignModel");
var MetricModel_1 = require("./MetricModel");
var RuleModel_1 = require("./RuleModel");
var FeatureModel = /** @class */ (function () {
    function FeatureModel() {
        this.m = [];
        this.metrics = [];
        this.rules = [];
        this.impactCampaign = null;
        this.rulesLinkedCampaign = [];
        this.isGatewayServiceRequired = false;
    }
    FeatureModel.prototype.modelFromDictionary = function (feature) {
        var _this = this;
        var _a, _b, _c;
        this.id = feature.id;
        this.key = feature.key;
        this.name = feature.name;
        this.type = feature.type;
        if (feature === null || feature === void 0 ? void 0 : feature.isGatewayServiceRequired) {
            this.isGatewayServiceRequired = feature.isGatewayServiceRequired;
        }
        if (feature.impactCampaign) {
            this.impactCampaign = new ImpactCampaignModel_1.ImpactCapmaignModel().modelFromDictionary(feature.impactCampaign);
        }
        if ((feature.m && feature.m.constructor === {}.constructor) || ((_a = feature.metrics) === null || _a === void 0 ? void 0 : _a.constructor) === {}.constructor) {
            this.metrics = [];
        }
        else {
            var metricList = feature.m || feature.metrics;
            metricList === null || metricList === void 0 ? void 0 : metricList.forEach(function (metric) {
                _this.metrics.push(new MetricModel_1.MetricModel().modelFromDictionary(metric));
            });
        }
        if (((_b = feature === null || feature === void 0 ? void 0 : feature.rules) === null || _b === void 0 ? void 0 : _b.constructor) === {}.constructor) {
            this.rules = [];
        }
        else {
            var ruleList = feature.rules;
            ruleList === null || ruleList === void 0 ? void 0 : ruleList.forEach(function (rule) {
                _this.rules.push(new RuleModel_1.RuleModel().modelFromDictionary(rule));
            });
        }
        if ((feature === null || feature === void 0 ? void 0 : feature.rulesLinkedCampaign) && ((_c = feature.rulesLinkedCampaign) === null || _c === void 0 ? void 0 : _c.constructor) !== {}.constructor) {
            var linkedCampaignList = feature.rulesLinkedCampaign;
            this.rulesLinkedCampaign = linkedCampaignList;
        }
        return this;
    };
    FeatureModel.prototype.getName = function () {
        return this.name;
    };
    FeatureModel.prototype.getType = function () {
        return this.type;
    };
    FeatureModel.prototype.getId = function () {
        return this.id;
    };
    FeatureModel.prototype.getKey = function () {
        return this.key;
    };
    FeatureModel.prototype.getRules = function () {
        return this.rules;
    };
    FeatureModel.prototype.getImpactCampaign = function () {
        return this.impactCampaign;
    };
    FeatureModel.prototype.getRulesLinkedCampaign = function () {
        return this.rulesLinkedCampaign;
    };
    FeatureModel.prototype.setRulesLinkedCampaign = function (rulesLinkedCampaign) {
        this.rulesLinkedCampaign = rulesLinkedCampaign;
    };
    FeatureModel.prototype.getMetrics = function () {
        return this.metrics;
    };
    FeatureModel.prototype.getIsGatewayServiceRequired = function () {
        return this.isGatewayServiceRequired;
    };
    FeatureModel.prototype.setIsGatewayServiceRequired = function (isGatewayServiceRequired) {
        this.isGatewayServiceRequired = isGatewayServiceRequired;
    };
    return FeatureModel;
}());
exports.FeatureModel = FeatureModel;
//# sourceMappingURL=FeatureModel.js.map