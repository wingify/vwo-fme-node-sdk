export class StorageDataModel {
    modelFromDictionary(storageData) {
        this.featureKey = storageData.featureKey;
        this.context = storageData.context;
        this.rolloutId = storageData.rolloutId;
        this.rolloutKey = storageData.rolloutKey;
        this.rolloutVariationId = storageData.rolloutVariationId;
        this.experimentId = storageData.experimentId;
        this.experimentKey = storageData.experimentKey;
        this.experimentVariationId = storageData.experimentVariationId;
        return this;
    }
    getFeatureKey() {
        return this.featureKey;
    }
    getContext() {
        return this.context;
    }
    getRolloutId() {
        return this.rolloutId;
    }
    getRolloutKey() {
        return this.rolloutKey;
    }
    getRolloutVariationId() {
        return this.rolloutVariationId;
    }
    getExperimentId() {
        return this.experimentId;
    }
    getExperimentKey() {
        return this.experimentKey;
    }
    getExperimentVariationId() {
        return this.experimentVariationId;
    }
    setFeatureKey(featureKey) {
        this.featureKey = featureKey;
    }
    setContext(context) {
        this.context = context;
    }
    setRolloutId(rolloutId) {
        this.rolloutId = rolloutId;
    }
    setRolloutKey(rolloutKey) {
        this.rolloutKey = rolloutKey;
    }
    setRolloutVariationId(rolloutVariationId) {
        this.rolloutVariationId = rolloutVariationId;
    }
    setExperimentId(experimentId) {
        this.experimentId = experimentId;
    }
    setExperimentKey(experimentKey) {
        this.experimentKey = experimentKey;
    }
    setExperimentVariationId(experimentVariationId) {
        this.experimentVariationId = experimentVariationId;
    }
}
//# sourceMappingURL=StorageDataModel.js.map