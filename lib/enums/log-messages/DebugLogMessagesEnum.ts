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
export enum DebugLogMessagesEnum {
  API_CALLED = 'API - {apiName} called',
  SERVICE_INITIALIZED = `VWO {service} initialized while creating an instance of SDK`,

  EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED = `Rollout rule got passed for user {userId}. Hence, evaluating experiments`,
  EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT = `No Rollout rules present for the feature. Hence, checking experiment rules`,

  USER_BUCKET_TO_VARIATION = `User ID: {userId} for experiment: {campaignKey} having percent traffic: {percentTraffic} got bucket-value as {bucketValue} and hash-value as {hashValue}`,

  IMPRESSION_FOR_TRACK_USER = `Impression built for vwo_variationShown event for Account ID:{accountId}, User ID:{userId}, and experiment ID:{campaignId}`,
  IMPRESSION_FOR_TRACK_GOAL = `Impression built for {eventName} event for Account ID:{accountId}, and user ID:{userId}`,
  IMPRESSION_FOR_SYNC_VISITOR_PROP = `Impression built for {eventName} event for Account ID:{accountId}, and user ID:{userId}`,
}
