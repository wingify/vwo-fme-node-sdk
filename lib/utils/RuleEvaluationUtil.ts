/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { CampaignModel } from '../models/campaign/CampaignModel';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { ContextModel } from '../models/user/ContextModel';
import { IStorageService } from '../services/StorageService';
import { isObject } from './DataTypeUtil';
import { checkWhitelistingAndPreSeg } from './DecisionUtil';
import { createAndSendImpressionForVariationShown } from './ImpressionUtil';
import { ServiceContainer } from '../services/ServiceContainer';

/**
 * Evaluates the rules for a given campaign and feature based on the provided context.
 * This function checks for whitelisting and pre-segmentation conditions, and if applicable,
 * sends an impression for the variation shown.
 *
 * @param {ServiceContainer} serviceContainer - The service container instance.
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
export const evaluateRule = async (
  serviceContainer: ServiceContainer,
  feature: FeatureModel,
  campaign: CampaignModel,
  context: ContextModel,
  evaluatedFeatureMap: Map<string, unknown>,
  megGroupWinnerCampaigns: Map<number, any>,
  storageService: IStorageService,
  decision: any,
): Promise<Record<string, any>> => {
  // Perform whitelisting and pre-segmentation checks
  const [preSegmentationResult, whitelistedObject] = await checkWhitelistingAndPreSeg(
    serviceContainer,
    feature,
    campaign,
    context,
    evaluatedFeatureMap,
    megGroupWinnerCampaigns,
    storageService,
    decision,
  );

  // If pre-segmentation is successful and a whitelisted object exists, proceed to send an impression
  if (preSegmentationResult && isObject(whitelistedObject) && Object.keys(whitelistedObject).length > 0) {
    // Update the decision object with campaign and variation details
    Object.assign(decision, {
      experimentId: campaign.getId(),
      experimentKey: campaign.getKey(),
      experimentVariationId: whitelistedObject.variationId,
    });

    // Send an impression for the variation shown
    if (serviceContainer.getShouldWaitForTrackingCalls()) {
      await createAndSendImpressionForVariationShown(
        serviceContainer,
        campaign.getId(),
        whitelistedObject.variation.id,
        context,
        feature.getKey(),
      );
    } else {
      createAndSendImpressionForVariationShown(
        serviceContainer,
        campaign.getId(),
        whitelistedObject.variation.id,
        context,
        feature.getKey(),
      );
    }
  }

  // Return the results of the evaluation
  return { preSegmentationResult, whitelistedObject, updatedDecision: decision };
};
