"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateRule = void 0;
const DataTypeUtil_1 = require("./DataTypeUtil");
const DecisionUtil_1 = require("./DecisionUtil");
const NetworkUtil_1 = require("./NetworkUtil");
const ImpressionUtil_1 = require("./ImpressionUtil");
/**
 * Evaluates the rules for a given campaign and feature based on the provided context.
 * This function checks for whitelisting and pre-segmentation conditions, and if applicable,
 * sends an impression for the variation shown.
 *
 * @param {SettingsModel} settings - The settings configuration for the evaluation.
 * @param {FeatureModel} feature - The feature being evaluated.
 * @param {CampaignModel} campaign - The campaign associated with the feature.
 * @param {ContextModel} context - The user context for evaluation.
 * @param {Map<string, any>} evaluatedFeatureMap - A map of evaluated features.
 * @param {Map<number, number>} megGroupWinnerCampaigns - A map of MEG group winner campaigns.
 * @param {StorageService} storageService - The storage service for persistence.
 * @param {any} decision - The decision object that will be updated based on the evaluation.
 * @returns {Promise<[boolean, any]>} A promise that resolves to a tuple containing the result of the pre-segmentation
 * and the whitelisted object, if any.
 */
const evaluateRule = async (settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) => {
    // Perform whitelisting and pre-segmentation checks
    const [preSegmentationResult, whitelistedObject] = await (0, DecisionUtil_1.checkWhitelistingAndPreSeg)(settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision);
    // If pre-segmentation is successful and a whitelisted object exists, proceed to send an impression
    if (preSegmentationResult && (0, DataTypeUtil_1.isObject)(whitelistedObject) && Object.keys(whitelistedObject).length > 0) {
        // Update the decision object with campaign and variation details
        Object.assign(decision, {
            experimentId: campaign.getId(),
            experimentKey: campaign.getKey(),
            experimentVariationId: whitelistedObject.variationId,
        });
        // Send an impression for the variation shown
        if ((0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) {
            await (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), whitelistedObject.variation.id, context, feature.getKey());
        }
        else {
            (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), whitelistedObject.variation.id, context, feature.getKey());
        }
    }
    // Return the results of the evaluation
    return { preSegmentationResult, whitelistedObject, updatedDecision: decision };
};
exports.evaluateRule = evaluateRule;
//# sourceMappingURL=RuleEvaluationUtil.js.map