import { VariableModel } from './VariableModel.js';
export class VariationModel {
    constructor() {
        this.variables = [];
        this.variations = [];
    }
    modelFromDictionary(variation) {
        this.id = variation.i || variation.id;
        this.key = variation.n || variation.key || variation.name;
        this.weight = variation.w || variation.weight;
        this.ruleKey = variation.ruleKey;
        this.salt = variation.salt;
        this.type = variation.type;
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
                const variableList = variation.variables;
                variableList.forEach((variable) => {
                    this.variables.push(VariableModel.modelFromDictionary(variable));
                });
            }
        }
        if (variation.variations) {
            if (variation.variations.constructor === {}.constructor) {
                this.variations = [];
            }
            else {
                const variationList = variation.variations;
                variationList.forEach((variation) => {
                    this.variations.push(new VariationModel().modelFromDictionary(variation));
                });
            }
        }
        return this;
    }
    setStartRange(startRange) {
        this.startRangeVariation = startRange;
    }
    setEndRange(endRange) {
        this.endRangeVariation = endRange;
    }
    setWeight(weight) {
        this.weight = weight;
    }
    getId() {
        return this.id;
    }
    getKey() {
        return this.key;
    }
    getRuleKey() {
        return this.ruleKey;
    }
    getWeight() {
        return this.weight;
    }
    getSegments() {
        return this.segments;
    }
    getStartRangeVariation() {
        return this.startRangeVariation;
    }
    getEndRangeVariation() {
        return this.endRangeVariation;
    }
    getVariables() {
        return this.variables;
    }
    getVariations() {
        return this.variations;
    }
    getType() {
        return this.type;
    }
    getSalt() {
        return this.salt;
    }
}
//# sourceMappingURL=VariationModel.js.map