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
import { FeatureModel } from '../models/campaign/FeatureModel';
import { CampaignModel } from '../models/campaign/CampaignModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { dynamic } from '../types/Common';
/** SmartCode visitor cookie written once per browser. */
export declare const VWO_UUID_COOKIE_NAME = '_vwo_uuid';
/**
 * Recursively returns true when any DSL node is a Pulse survey event key.
 * @param dsl - Campaign/variation/holdout segments object.
 * @returns {boolean} True when a Pulse survey event key is found, false otherwise.
 */
export declare function dslContainsPulseSurveyKey(dsl: Record<string, dynamic> | undefined | null): boolean;
/**
 * Segments live on the campaign for AB, and on variation[0] for rollout/personalize.
 * @param campaign - Linked campaign or rule campaign.
 * @returns {Record<string, dynamic>} Pre-segmentation DSL for the campaign, or an empty object when none is set.
 */
export declare function getCampaignPreSegmentationDsl(campaign: CampaignModel): Record<string, dynamic>;
/**
 * True when any linked campaign or applicable holdout uses Pulse survey pre-segmentation.
 * @param feature - Feature being evaluated.
 * @param settings - Full settings (needed for holdouts).
 * @returns {boolean} True when a linked campaign or applicable holdout contains a Pulse survey key, false otherwise.
 */
export declare function featureHasPulseSurveyPreSegmentation(
  feature: FeatureModel | undefined,
  settings: SettingsModel | undefined,
): boolean;
/**
 * Reads `_vwo_uuid` from `document.cookie`. Returns null on the server or when missing.
 * @param cookieString - Optional cookie string for tests; defaults to `document.cookie`.
 * @returns {string | null} The cookie value, or null when it is missing or this is not a browser.
 */
export declare function getVwoUuidFromCookie(cookieString?: string): string | null;
/**
 * Case-insensitive equality for visitor ids (FME uuid is uppercase; cookie casing may differ).
 * @param convertedUserUuid - UUID derived from context.id (web uuid as-is, or v5 hash).
 * @param pulseVisitorUuid - Value of `_vwo_uuid`.
 * @returns {boolean} True when both ids are present and equal ignoring case.
 */
export declare function doesConvertedUuidMatchPulseVisitor(
  convertedUserUuid: string | null,
  pulseVisitorUuid: string | null,
): boolean;
/**
 * True when the evaluated user is the SmartCode visitor, so survey leaves may read their events.
 * @param contextUuid - UUID of the user being evaluated (`ContextModel.getUuid()`).
 * @param cookieString - Optional cookie string for tests; defaults to `document.cookie`.
 * @returns {boolean} True when the context UUID matches `_vwo_uuid`.
 */
export declare function isPulseVisitorVerified(contextUuid: string | null | undefined, cookieString?: string): boolean;
/**
 * Applies the Pulse identity rules for getFlag and logs why survey leaves will fail.
 *
 * 1. Cookie missing → log; survey leaves fail.
 * 2. Cookie present, no context.id → use cookie as id.
 * 3. Cookie + userId → compare converted uuid to cookie; mismatch logs and survey leaves fail.
 * 4. Caller should not invoke this when the feature has no Pulse survey segments.
 *
 * Survey leaves enforce the result themselves via {@link isPulseVisitorVerified}.
 * `trackEvent` and `setAttribute` call the same resolver when Pulse is enabled at init (no per-feature gate).
 *
 * @param context - Original getFlag context.
 * @param pulseVisitorUuid - `_vwo_uuid` cookie value.
 * @param convertedUserUuid - Result of getUUIDFromContext when context.id is present.
 * @param logError - Logger for failure cases.
 * @returns {Record<string, any>} Context to evaluate with (id filled from the cookie in case 2).
 */
export declare function resolvePulsePreSegmentationIdentity(
  context: Record<string, any> | undefined,
  pulseVisitorUuid: string | null,
  convertedUserUuid: string | null,
  logError: (message: string) => void,
): Record<string, any>;
