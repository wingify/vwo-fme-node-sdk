"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariationModel = void 0;
var VariableModel_1 = require("./VariableModel");
var VariationModel = /** @class */ (function () {
    function VariationModel() {
        this.variables = [];
        this.variations = [];
    }
    VariationModel.prototype.modelFromDictionary = function (variation) {
        var _this = this;
        this.id = variation.i || variation.id;
        this.key = variation.n || variation.key || variation.name;
        this.weight = variation.w || variation.weight;
        this.setStartRange(variation.startRangeVariation);
        this.setEndRange(variation.endRangeVariation);
        if (variation.seg || variation.segments) {
            this.segments = variation.seg || variation.segments;
        }
        if (variation.variables) {
            if (variation.variables.constructor === {}.constructor) {
                this.variables = [];
            }
            else {
                var variableList = variation.variables;
                variableList.forEach(function (variable) {
                    _this.variables.push(new VariableModel_1.VariableModel().modelFromDictionary(variable));
                });
            }
        }
        if (variation.variations) {
            if (variation.variations.constructor === {}.constructor) {
                this.variations = [];
            }
            else {
                var variationList = variation.variations;
                variationList.forEach(function (variation) {
                    _this.variations.push(new VariationModel().modelFromDictionary(variation));
                });
            }
        }
        return this;
    };
    VariationModel.prototype.setStartRange = function (startRange) {
        this.startRangeVariation = startRange;
    };
    VariationModel.prototype.setEndRange = function (endRange) {
        this.endRangeVariation = endRange;
    };
    VariationModel.prototype.setWeight = function (weight) {
        this.weight = weight;
    };
    VariationModel.prototype.getId = function () {
        return this.id;
    };
    VariationModel.prototype.getKey = function () {
        return this.key;
    };
    VariationModel.prototype.getWeight = function () {
        return this.weight;
    };
    VariationModel.prototype.getSegments = function () {
        return this.segments;
    };
    VariationModel.prototype.getStartRangeVariation = function () {
        return this.startRangeVariation;
    };
    VariationModel.prototype.getEndRangeVariation = function () {
        return this.endRangeVariation;
    };
    VariationModel.prototype.getVariables = function () {
        return this.variables;
    };
    VariationModel.prototype.getVariations = function () {
        return this.variations;
    };
    return VariationModel;
}());
exports.VariationModel = VariationModel;
//# sourceMappingURL=VariationModel.js.map