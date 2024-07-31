"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignModel = void 0;
var MetricModel_1 = require("./MetricModel");
var VariableModel_1 = require("./VariableModel");
var VariationModel_1 = require("./VariationModel");
var CampaignModel = /** @class */ (function () {
    function CampaignModel() {
        this.variations = [];
        this.metrics = [];
        this.variables = [];
    }
    CampaignModel.prototype.copy = function (campaignModel) {
        this.metrics = campaignModel.metrics;
        this.variations = campaignModel.variations;
        this.variables = campaignModel.variables;
        this.processCampaignKeys(campaignModel);
    };
    CampaignModel.prototype.modelFromDictionary = function (campaign) {
        this.processCampaignProperties(campaign);
        this.processCampaignKeys(campaign);
        return this;
    };
    CampaignModel.prototype.processCampaignProperties = function (campaign) {
        var _this = this;
        if (campaign.variables) {
            // campaign.var ||
            if (
            // (campaign.var && campaign.var.constructor === {}.constructor) ||
            campaign.variables.constructor === {}.constructor) {
                this.variables = [];
            }
            else {
                var variableList = campaign.variables; // campaign.var ||
                variableList.forEach(function (variable) {
                    _this.variables.push(new VariableModel_1.VariableModel().modelFromDictionary(variable));
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
                var variationList = campaign.variations; // campaign.v ||
                variationList.forEach(function (variation) {
                    _this.variations.push(new VariationModel_1.VariationModel().modelFromDictionary(variation));
                });
            }
        }
        if (campaign.metrics) {
            // campaign.m ||
            if (campaign.metrics && campaign.metrics.constructor === {}.constructor) {
                this.metrics = [];
            }
            else {
                var metricsList = campaign.metrics || [];
                metricsList.forEach(function (metric) {
                    _this.metrics.push(new MetricModel_1.MetricModel().modelFromDictionary(metric));
                });
            }
        }
    };
    CampaignModel.prototype.processCampaignKeys = function (campaign) {
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
    };
    CampaignModel.prototype.getId = function () {
        return this.id;
    };
    CampaignModel.prototype.getName = function () {
        return this.name;
    };
    CampaignModel.prototype.getSegments = function () {
        return this.segments;
    };
    CampaignModel.prototype.getTraffic = function () {
        return this.percentTraffic;
    };
    CampaignModel.prototype.getType = function () {
        return this.type;
    };
    CampaignModel.prototype.getIsForcedVariationEnabled = function () {
        return this.isForcedVariationEnabled;
    };
    CampaignModel.prototype.getIsUserListEnabled = function () {
        return this.isUserListEnabled;
    };
    CampaignModel.prototype.getKey = function () {
        return this.key;
    };
    CampaignModel.prototype.getMetrics = function () {
        return this.metrics;
    };
    CampaignModel.prototype.getVariations = function () {
        return this.variations;
    };
    CampaignModel.prototype.getVariables = function () {
        return this.variables;
    };
    CampaignModel.prototype.getRuleKey = function () {
        return this.ruleKey;
    };
    return CampaignModel;
}());
exports.CampaignModel = CampaignModel;
//# sourceMappingURL=CampaignModel.js.map