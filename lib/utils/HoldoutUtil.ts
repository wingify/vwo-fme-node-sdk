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

import { SettingsModel } from '../models/settings/SettingsModel';
import { HoldoutModel } from '../models/campaign/HoldoutModel';
import { ContextModel } from '../models/user/ContextModel';
import { DecisionMaker } from '../packages/decision-maker';
import { buildMessage } from './LogMessageUtil';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { createHoldoutPayload } from './NetworkUtil';
import { EventEnum } from '../enums/EventEnum';
import { sendImpressionForVariationShown, sendImpressionForVariationShownInBatch } from './ImpressionUtil';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { Constants } from '../constants/index';
import { IStorageService } from '../services/StorageService';
import { ServiceContainer } from '../services/ServiceContainer';
import { StorageDecorator } from '../decorators/StorageDecorator';

/**
 * Gets the applicable holdouts for a given feature ID.
 * @param settings - The settings object.
 * @param featureId - The feature ID.
 * @returns The applicable holdouts.
 */
export function getApplicableHoldouts(settings: SettingsModel, featureId: number): HoldoutModel[] {
  const holdouts = settings.getHoldouts() || [];
  // filter the holdouts to only include global holdouts and holdouts that have the given feature ID
  return holdouts.filter((holdout) => holdout.getIsGlobal() || holdout.getFeatureIds().includes(featureId));
}

/**
 * Gets the matched holdout(s) for a given feature ID and context.
 * Evaluates all applicable holdouts, creates batched impressions for all of them,
 * and returns all matched holdouts (i.e. holdouts the user is part of).
 * @param settings - The settings object.
 * @param feature - The feature object.
 * @param context - The context object.
 * @returns The matched holdouts or null if no holdout is matched.
 */
export async function getMatchedHoldouts(
  serviceContainer: ServiceContainer,
  feature: FeatureModel,
  context: ContextModel,
  storedData: any,
): Promise<{ matchedHoldouts: HoldoutModel[]; notMatchedHoldouts: HoldoutModel[]; holdoutPayloads: any[] } | null> {
  const settings = serviceContainer.getSettings();

  // storedData has isInHoldoutId and notInHoldoutId, we need to use these to check if the holdout is already evaluated
  const isInHoldoutIds = storedData?.isInHoldoutId ?? [];
  const notInHoldoutIds = storedData?.notInHoldoutId ?? [];
  const alreadyEvaluatedHoldoutIds = [...isInHoldoutIds, ...notInHoldoutIds];

  const featureId = feature.getId();
  // get the applicable holdouts for the given feature ID
  const applicableHoldouts = getApplicableHoldouts(settings, featureId);

  //notMatchedHoldouts will be an array of holdouts that are not matched to the user
  const notMatchedHoldouts: HoldoutModel[] = [];

  // if there are no applicable holdouts, return null
  if (!applicableHoldouts.length) return { matchedHoldouts: [], notMatchedHoldouts: [], holdoutPayloads: [] };

  const matchedHoldouts: HoldoutModel[] = [];
  const holdoutPayloads: any[] = [];

  // iterate through the applicable holdouts
  // for each holdout, validate the segmentation and determine if user is IN or NOT IN
  for (const holdout of applicableHoldouts) {
    if (alreadyEvaluatedHoldoutIds.includes(holdout.getId())) {
      serviceContainer.getLogManager().debug(
        buildMessage(DebugLogMessagesEnum.HOLDOUT_SKIP_EVALUATION, {
          holdoutId: holdout.getId(),
          reason: `user ${context.getId()} was already evaluated for feature with id: ${featureId}; SKIP decision making altogether.`,
        }),
      );
      continue;
    }

    const segments = holdout.getSegments() || {};
    let segmentPass = true;
    if (segments && Object.keys(segments).length > 0) {
      segmentPass = await serviceContainer
        .getSegmentationManager()
        .validateSegmentation(segments, context.getCustomVariables());
    } else {
      serviceContainer.getLogManager().info(
        buildMessage(InfoLogMessagesEnum.HOLDOUT_SEGMENTATION_SKIP, {
          holdoutId: holdout.getId(),
          userId: context.getId(),
        }),
      );
    }

    // Determine variationId: 1 if IN holdout, 2 if NOT IN holdout
    let variationId: number;
    let isInHoldout = false;

    // if the segmentation fails, user is NOT IN holdout (variationId = 2)
    if (!segmentPass) {
      serviceContainer.getLogManager().info(
        buildMessage(DebugLogMessagesEnum.HOLDOUT_SEGMENTATION_FAIL, {
          userId: context.getId(),
          holdoutGroupName: holdout.getName(),
        }),
      );
      variationId = Constants.VARIATION_NOT_PART_OF_HOLDOUT; // NOT IN holdout
      notMatchedHoldouts.push(holdout);
    } else {
      // Check traffic allocation
      const hashKey = `${settings.getAccountId()}_${holdout.getId()}_${context.getId()}`;
      const bucket = new DecisionMaker().getBucketValueForUser(hashKey, 100);

      // If bucket is within percentTraffic, user is IN holdout (variationId = 1)
      // Otherwise, user is NOT IN holdout (variationId = 2)
      isInHoldout = bucket !== 0 && bucket <= holdout.getPercentTraffic();
      variationId = isInHoldout ? Constants.VARIATION_IS_PART_OF_HOLDOUT : Constants.VARIATION_NOT_PART_OF_HOLDOUT;

      // Add all matched holdouts (user is IN)
      if (isInHoldout) {
        serviceContainer.getLogManager().info(
          buildMessage(InfoLogMessagesEnum.HOLDOUT_SHOULD_EXCLUDE_USER, {
            userId: context.getId(),
            bucketValue: bucket,
            holdoutGroupName: holdout.getName(),
            percentTraffic: holdout.getPercentTraffic(),
            featureId: featureId,
          }),
        );
        matchedHoldouts.push(holdout);
      } else {
        serviceContainer.getLogManager().debug(
          buildMessage(DebugLogMessagesEnum.HOLDOUT_SHOULD_NOT_EXCLUDE_USER, {
            userId: context.getId(),
            holdoutGroupName: holdout.getName(),
            featureId: featureId,
          }),
        );
        notMatchedHoldouts.push(holdout);
      }
    }

    // Create holdout payload for ALL applicable holdouts (both IN and NOT IN)
    // campaignId is the holdoutId, variationId is 1 (IN) or 2 (NOT IN)
    const payload = createHoldoutPayload(
      serviceContainer,
      EventEnum.VWO_VARIATION_SHOWN,
      holdout.getId(), // campaignId is the holdoutId
      variationId, // 1 if IN holdout, 2 if NOT IN holdout
      context,
      featureId,
    );
    holdoutPayloads.push(payload);
  }

  return {
    matchedHoldouts,
    notMatchedHoldouts,
    holdoutPayloads,
  };
}

/**
 * Sends network calls for not in holdouts that are applicable but not stored in storage.
 * @param serviceContainer - The service container.
 * @param feature - The feature model.
 * @param context - The context model.
 * @param storedData - The stored data.
 * @param storageService - The storage service.
 */
export async function sendNetworkCallsForNotInHoldouts(
  serviceContainer: ServiceContainer,
  feature: FeatureModel,
  context: ContextModel,
  decision: any,
  storedData: any,
  storageService: IStorageService,
): Promise<Array<string | number>> {
  // applicable holdouts are the holdouts that are applicable to the user and present in the settings
  const applicableHoldouts = getApplicableHoldouts(serviceContainer.getSettings(), feature.getId());
  const updatedNotInHoldoutIds: Array<string | number> = [...(storedData?.notInHoldoutId ?? [])];
  const isInHoldoutIds: Array<string | number> = [...(storedData?.isInHoldoutId ?? [])];
  const batchPayload: any[] = [];
  const initialNotInHoldoutCount = updatedNotInHoldoutIds.length;

  if (applicableHoldouts.length > 0) {
    decision.isHoldoutPresent = true;
  }

  //create payload for applicable holdouts that are not stored in storage
  for (const holdout of applicableHoldouts) {
    // if storedData has notInHoldoutIds and isInHoldoutIds does not contain the current holdoutId, then create payload and push to batchPayload
    if (!updatedNotInHoldoutIds?.includes(holdout.getId()) && !isInHoldoutIds?.includes(holdout.getId())) {
      //update the holdout ids in storage
      updatedNotInHoldoutIds.push(holdout.getId());
      const payload = createHoldoutPayload(
        serviceContainer,
        EventEnum.VWO_VARIATION_SHOWN,
        holdout.getId(),
        Constants.VARIATION_NOT_PART_OF_HOLDOUT,
        context,
        feature.getId(),
      );

      if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
        const response = sendImpressionForVariationShown(
          serviceContainer,
          holdout.getId(),
          Constants.VARIATION_NOT_PART_OF_HOLDOUT,
          context,
          feature.getKey(),
          payload,
        );
        if (serviceContainer.getShouldWaitForTrackingCalls()) {
          await response;
        }
      } else {
        if (payload != null) {
          batchPayload.push(payload);
        }
      }
    }
  }

  if (updatedNotInHoldoutIds.length > initialNotInHoldoutCount) {
    new StorageDecorator().setDataInStorage(
      { featureKey: feature.getKey(), context, notInHoldoutId: updatedNotInHoldoutIds },
      storageService,
      serviceContainer,
    );
  }

  if (batchPayload.length > 0) {
    if (serviceContainer.getShouldWaitForTrackingCalls()) {
      await sendImpressionForVariationShownInBatch(serviceContainer, batchPayload);
    } else {
      sendImpressionForVariationShownInBatch(serviceContainer, batchPayload);
    }
  }

  return updatedNotInHoldoutIds;
}
