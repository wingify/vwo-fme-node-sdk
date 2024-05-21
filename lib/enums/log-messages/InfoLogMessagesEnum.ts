/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
export enum InfoLogMessagesEnum {
  ON_READY_ALREADY_RESOLVED = `[INFO]: VWO-SDK {date} {apiName} already resolved`,
  ON_READY_SETTINGS_FAILED = `[INFO]: VWO-SDK {date} VWO settings could not be fetched`,

  POLLING_SET_SETTINGS = `There's a change in settings from the last settings fetched. Hence, instantiating a new VWO client internally`,
  POLLING_NO_CHANGE_IN_SETTINGS = 'No change in settings with the last settings fetched. Hence, not instantiating new VWO client',

  SETTINGS_FETCH_SUCCESS = `Settings fetched successfully`,

  CLIENT_INITIALIZED = `VWO Client initialized`,

  STORED_VARIATION_FOUND = `Variation {variationKey} found in storage for the user {userId} for the {experimentType} experiment:{experimentKey}`,

  USER_PART_OF_CAMPAIGN = `User ID:{userId} is {notPart} part of experiment: {campaignKey}`,
  SEGMENTATION_SKIP = `For userId:{userId} of experiment:{campaignKey}, segments was missing. Hence, skipping segmentation`,
  SEGMENTATION_STATUS = `Segmentation {status} for userId:{userId} of experiment:{campaignKey}`,

  USER_CAMPAIGN_BUCKET_INFO = `User ID:{userId} for experiment:{campaignKey} {status}`,

  WHITELISTING_SKIP = `Whitelisting is not used for experiment:{campaignKey}, hence skipping evaluating whitelisting {variation} for User ID:{userId}`,
  WHITELISTING_STATUS = `User ID:{userId} for experiment:{campaignKey} {status} whitelisting {variationString}`,

  VARIATION_RANGE_ALLOCATION = `Variation:{variationKey} of experiment:{campaignKey} having weight:{variationWeight} got bucketing range: ({startRange} - {endRange})`,

  IMPACT_ANALYSIS = `Sending data for Impact Campaign for the user {userId}`,

  MEG_SKIP_ROLLOUT_EVALUATE_EXPERIMENTS = `No rollout rule found for feature:{featureKey}. Hence, evaluating experiments`,
  MEG_CAMPAIGN_FOUND_IN_STORAGE = `Campaign {campaignKey} found in storage for user ID:{userId}`,
  MEG_CAMPAIGN_ELIGIBLE = `Campaign {campaignKey} is eligible for user ID:{userId}`,
  MEG_WINNER_CAMPAIGN = `MEG: Campaign {campaignKey} is the winner for group {groupId} for user ID:{userId} {algo}`,

}
