import { isObject } from './DataTypeUtil.js';
import { checkWhitelistingAndPreSeg } from './DecisionUtil.js';
import { getShouldWaitForTrackingCalls } from './NetworkUtil.js';
import { createAndSendImpressionForVariationShown } from './ImpressionUtil.js';
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
export const evaluateRule = async (settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) => {
    // Perform whitelisting and pre-segmentation checks
    const [preSegmentationResult, whitelistedObject] = await checkWhitelistingAndPreSeg(settings, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision);
    // If pre-segmentation is successful and a whitelisted object exists, proceed to send an impression
    if (preSegmentationResult && isObject(whitelistedObject) && Object.keys(whitelistedObject).length > 0) {
        // Update the decision object with campaign and variation details
        Object.assign(decision, {
            experimentId: campaign.getId(),
            experimentKey: campaign.getKey(),
            experimentVariationId: whitelistedObject.variationId,
        });
        // Send an impression for the variation shown
        if (getShouldWaitForTrackingCalls()) {
            await createAndSendImpressionForVariationShown(settings, campaign.getId(), whitelistedObject.variation.id, context, feature.getKey());
        }
        else {
            createAndSendImpressionForVariationShown(settings, campaign.getId(), whitelistedObject.variation.id, context, feature.getKey());
        }
    }
    // Return the results of the evaluation
    return { preSegmentationResult, whitelistedObject, updatedDecision: decision };
};
//# sourceMappingURL=RuleEvaluationUtil.js.map