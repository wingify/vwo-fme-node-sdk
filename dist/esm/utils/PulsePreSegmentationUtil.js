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
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum.js';
import { ErrorLogMessagesEnum } from '../enums/log-messages/index.js';
import { isArray, isObject } from './DataTypeUtil.js';
import { getApplicableHoldouts } from './HoldoutUtil.js';
import { buildMessage } from './LogMessageUtil.js';
import { SurveyDslKey } from '../packages/segmentation-evaluator/evaluators/SurveyDslKey.js';
/** SmartCode visitor cookie written once per browser. */
export const VWO_UUID_COOKIE_NAME = '_vwo_uuid';
/**
 * Recursively returns true when any DSL node is a Pulse survey event key.
 * @param dsl - Campaign/variation/holdout segments object.
 * @returns {boolean} True when a Pulse survey event key is found, false otherwise.
 */
export function dslContainsPulseSurveyKey(dsl) {
    if (!isObject(dsl)) {
        return false;
    }
    for (const operator of Object.keys(dsl)) {
        if (SurveyDslKey.parse(operator)) {
            return true;
        }
        const operand = dsl[operator];
        if (isArray(operand)) {
            for (const subDsl of operand) {
                if (dslContainsPulseSurveyKey(subDsl)) {
                    return true;
                }
            }
        }
        else if (isObject(operand) && dslContainsPulseSurveyKey(operand)) {
            return true;
        }
    }
    return false;
}
/**
 * Segments live on the campaign for AB, and on variation[0] for rollout/personalize.
 * @param campaign - Linked campaign or rule campaign.
 * @returns {Record<string, dynamic>} Pre-segmentation DSL for the campaign, or an empty object when none is set.
 */
export function getCampaignPreSegmentationDsl(campaign) {
    const campaignType = campaign.getType();
    if (campaignType === CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum.PERSONALIZE) {
        return campaign.getVariations()?.[0]?.getSegments() || {};
    }
    return campaign.getSegments() || {};
}
/**
 * True when any linked campaign or applicable holdout uses Pulse survey pre-segmentation.
 * @param feature - Feature being evaluated.
 * @param settings - Full settings (needed for holdouts).
 * @returns {boolean} True when a linked campaign or applicable holdout contains a Pulse survey key, false otherwise.
 */
export function featureHasPulseSurveyPreSegmentation(feature, settings) {
    if (!feature) {
        return false;
    }
    // check if the feature has linked campaigns with pulse survey pre-segmentation
    const linkedCampaigns = feature.getRulesLinkedCampaign() || [];
    for (const campaign of linkedCampaigns) {
        if (dslContainsPulseSurveyKey(getCampaignPreSegmentationDsl(campaign))) {
            return true;
        }
    }
    if (!settings) {
        return false;
    }
    // check if the feature has applicable holdouts with pulse survey pre-segmentation
    const applicableHoldouts = getApplicableHoldouts(settings, feature.getId());
    for (const holdout of applicableHoldouts) {
        if (dslContainsPulseSurveyKey(holdout.getSegments())) {
            return true;
        }
    }
    return false;
}
/**
 * Reads `_vwo_uuid` from `document.cookie`. Returns null on the server or when missing.
 * @param cookieString - Optional cookie string for tests; defaults to `document.cookie`.
 * @returns {string | null} The cookie value, or null when it is missing or this is not a browser.
 */
export function getVwoUuidFromCookie(cookieString) {
    const source = cookieString ?? (typeof document !== 'undefined' ? document.cookie : '');
    if (!source) {
        return null;
    }
    const cookies = source.split(';');
    for (const cookie of cookies) {
        const separatorIndex = cookie.indexOf('=');
        if (separatorIndex === -1) {
            continue;
        }
        const cookieName = cookie.slice(0, separatorIndex).trim();
        if (cookieName !== VWO_UUID_COOKIE_NAME) {
            continue;
        }
        const cookieValue = decodeURIComponent(cookie.slice(separatorIndex + 1).trim());
        return cookieValue || null;
    }
    return null;
}
/**
 * Case-insensitive equality for visitor ids (FME uuid is uppercase; cookie casing may differ).
 * @param convertedUserUuid - UUID derived from context.id (web uuid as-is, or v5 hash).
 * @param pulseVisitorUuid - Value of `_vwo_uuid`.
 * @returns {boolean} True when both ids are present and equal ignoring case.
 */
export function doesConvertedUuidMatchPulseVisitor(convertedUserUuid, pulseVisitorUuid) {
    if (!convertedUserUuid || !pulseVisitorUuid) {
        return false;
    }
    return convertedUserUuid.toLowerCase() === pulseVisitorUuid.toLowerCase();
}
/**
 * True when the evaluated user is the SmartCode visitor, so survey leaves may read their events.
 * @param contextUuid - UUID of the user being evaluated (`ContextModel.getUuid()`).
 * @param cookieString - Optional cookie string for tests; defaults to `document.cookie`.
 * @returns {boolean} True when the context UUID matches `_vwo_uuid`.
 */
export function isPulseVisitorVerified(contextUuid, cookieString) {
    return doesConvertedUuidMatchPulseVisitor(contextUuid ?? null, getVwoUuidFromCookie(cookieString));
}
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
export function resolvePulsePreSegmentationIdentity(context, pulseVisitorUuid, convertedUserUuid, logError) {
    const safeContext = isObject(context) ? { ...context } : {};
    if (!pulseVisitorUuid) {
        logError(buildMessage(ErrorLogMessagesEnum.PULSE_PRE_SEGMENTATION_UUID_COOKIE_MISSING));
        return safeContext;
    }
    if (!safeContext.id) {
        // Flow 2: treat the SmartCode visitor as the FME user for this evaluation.
        safeContext.id = pulseVisitorUuid;
        return safeContext;
    }
    if (!doesConvertedUuidMatchPulseVisitor(convertedUserUuid, pulseVisitorUuid)) {
        logError(buildMessage(ErrorLogMessagesEnum.PULSE_PRE_SEGMENTATION_FE_USER_MISMATCH));
    }
    return safeContext;
}
//# sourceMappingURL=PulsePreSegmentationUtil.js.map