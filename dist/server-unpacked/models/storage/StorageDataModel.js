"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageDataModel = void 0;
var StorageDataModel = /** @class */ (function () {
    function StorageDataModel() {
    }
    StorageDataModel.prototype.modelFromDictionary = function (storageData) {
        this.featureKey = storageData.featureKey;
        this.context = storageData.context;
        this.rolloutId = storageData.rolloutId;
        this.rolloutKey = storageData.rolloutKey;
        this.rolloutVariationId = storageData.rolloutVariationId;
        this.experimentId = storageData.experimentId;
        this.experimentKey = storageData.experimentKey;
        this.experimentVariationId = storageData.experimentVariationId;
        return this;
    };
    StorageDataModel.prototype.getFeatureKey = function () {
        return this.featureKey;
    };
    StorageDataModel.prototype.getContext = function () {
        return this.context;
    };
    StorageDataModel.prototype.getRolloutId = function () {
        return this.rolloutId;
    };
    StorageDataModel.prototype.getRolloutKey = function () {
        return this.rolloutKey;
    };
    StorageDataModel.prototype.getRolloutVariationId = function () {
        return this.rolloutVariationId;
    };
    StorageDataModel.prototype.getExperimentId = function () {
        return this.experimentId;
    };
    StorageDataModel.prototype.getExperimentKey = function () {
        return this.experimentKey;
    };
    StorageDataModel.prototype.getExperimentVariationId = function () {
        return this.experimentVariationId;
    };
    StorageDataModel.prototype.setFeatureKey = function (featureKey) {
        this.featureKey = featureKey;
    };
    StorageDataModel.prototype.setContext = function (context) {
        this.context = context;
    };
    StorageDataModel.prototype.setRolloutId = function (rolloutId) {
        this.rolloutId = rolloutId;
    };
    StorageDataModel.prototype.setRolloutKey = function (rolloutKey) {
        this.rolloutKey = rolloutKey;
    };
    StorageDataModel.prototype.setRolloutVariationId = function (rolloutVariationId) {
        this.rolloutVariationId = rolloutVariationId;
    };
    StorageDataModel.prototype.setExperimentId = function (experimentId) {
        this.experimentId = experimentId;
    };
    StorageDataModel.prototype.setExperimentKey = function (experimentKey) {
        this.experimentKey = experimentKey;
    };
    StorageDataModel.prototype.setExperimentVariationId = function (experimentVariationId) {
        this.experimentVariationId = experimentVariationId;
    };
    return StorageDataModel;
}());
exports.StorageDataModel = StorageDataModel;
//# sourceMappingURL=StorageDataModel.js.map