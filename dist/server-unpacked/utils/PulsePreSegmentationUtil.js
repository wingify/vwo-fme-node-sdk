"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VWO_UUID_COOKIE_NAME = void 0;
exports.dslContainsPulseSurveyKey = dslContainsPulseSurveyKey;
exports.getCampaignPreSegmentationDsl = getCampaignPreSegmentationDsl;
exports.featureHasPulseSurveyPreSegmentation = featureHasPulseSurveyPreSegmentation;
exports.getVwoUuidFromCookie = getVwoUuidFromCookie;
exports.doesConvertedUuidMatchPulseVisitor = doesConvertedUuidMatchPulseVisitor;
exports.isPulseVisitorVerified = isPulseVisitorVerified;
exports.resolvePulsePreSegmentationIdentity = resolvePulsePreSegmentationIdentity;
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var log_messages_1 = require("../enums/log-messages");
var DataTypeUtil_1 = require("./DataTypeUtil");
var HoldoutUtil_1 = require("./HoldoutUtil");
var LogMessageUtil_1 = require("./LogMessageUtil");
var SurveyDslKey_1 = require("../packages/segmentation-evaluator/evaluators/SurveyDslKey");
/** SmartCode visitor cookie written once per browser. */
exports.VWO_UUID_COOKIE_NAME = '_vwo_uuid';
/**
 * Recursively returns true when any DSL node is a Pulse survey event key.
 * @param dsl - Campaign/variation/holdout segments object.
 * @returns {boolean} True when a Pulse survey event key is found, false otherwise.
 */
function dslContainsPulseSurveyKey(dsl) {
    if (!(0, DataTypeUtil_1.isObject)(dsl)) {
        return false;
    }
    for (var _i = 0, _a = Object.keys(dsl); _i < _a.length; _i++) {
        var operator = _a[_i];
        if (SurveyDslKey_1.SurveyDslKey.parse(operator)) {
            return true;
        }
        var operand = dsl[operator];
        if ((0, DataTypeUtil_1.isArray)(operand)) {
            for (var _b = 0, operand_1 = operand; _b < operand_1.length; _b++) {
                var subDsl = operand_1[_b];
                if (dslContainsPulseSurveyKey(subDsl)) {
                    return true;
                }
            }
        }
        else if ((0, DataTypeUtil_1.isObject)(operand) && dslContainsPulseSurveyKey(operand)) {
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
function getCampaignPreSegmentationDsl(campaign) {
    var _a, _b;
    var campaignType = campaign.getType();
    if (campaignType === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT || campaignType === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE) {
        return ((_b = (_a = campaign.getVariations()) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.getSegments()) || {};
    }
    return campaign.getSegments() || {};
}
/**
 * True when any linked campaign or applicable holdout uses Pulse survey pre-segmentation.
 * @param feature - Feature being evaluated.
 * @param settings - Full settings (needed for holdouts).
 * @returns {boolean} True when a linked campaign or applicable holdout contains a Pulse survey key, false otherwise.
 */
function featureHasPulseSurveyPreSegmentation(feature, settings) {
    if (!feature) {
        return false;
    }
    // check if the feature has linked campaigns with pulse survey pre-segmentation
    var linkedCampaigns = feature.getRulesLinkedCampaign() || [];
    for (var _i = 0, linkedCampaigns_1 = linkedCampaigns; _i < linkedCampaigns_1.length; _i++) {
        var campaign = linkedCampaigns_1[_i];
        if (dslContainsPulseSurveyKey(getCampaignPreSegmentationDsl(campaign))) {
            return true;
        }
    }
    if (!settings) {
        return false;
    }
    // check if the feature has applicable holdouts with pulse survey pre-segmentation
    var applicableHoldouts = (0, HoldoutUtil_1.getApplicableHoldouts)(settings, feature.getId());
    for (var _a = 0, applicableHoldouts_1 = applicableHoldouts; _a < applicableHoldouts_1.length; _a++) {
        var holdout = applicableHoldouts_1[_a];
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
function getVwoUuidFromCookie(cookieString) {
    var source = cookieString !== null && cookieString !== void 0 ? cookieString : (typeof document !== 'undefined' ? document.cookie : '');
    if (!source) {
        return null;
    }
    var cookies = source.split(';');
    for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
        var cookie = cookies_1[_i];
        var separatorIndex = cookie.indexOf('=');
        if (separatorIndex === -1) {
            continue;
        }
        var cookieName = cookie.slice(0, separatorIndex).trim();
        if (cookieName !== exports.VWO_UUID_COOKIE_NAME) {
            continue;
        }
        var cookieValue = decodeURIComponent(cookie.slice(separatorIndex + 1).trim());
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
function doesConvertedUuidMatchPulseVisitor(convertedUserUuid, pulseVisitorUuid) {
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
function isPulseVisitorVerified(contextUuid, cookieString) {
    return doesConvertedUuidMatchPulseVisitor(contextUuid !== null && contextUuid !== void 0 ? contextUuid : null, getVwoUuidFromCookie(cookieString));
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
function resolvePulsePreSegmentationIdentity(context, pulseVisitorUuid, convertedUserUuid, logError) {
    var safeContext = (0, DataTypeUtil_1.isObject)(context) ? __assign({}, context) : {};
    if (!pulseVisitorUuid) {
        logError((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.PULSE_PRE_SEGMENTATION_UUID_COOKIE_MISSING));
        return safeContext;
    }
    if (!safeContext.id) {
        // Flow 2: treat the SmartCode visitor as the FME user for this evaluation.
        safeContext.id = pulseVisitorUuid;
        return safeContext;
    }
    if (!doesConvertedUuidMatchPulseVisitor(convertedUserUuid, pulseVisitorUuid)) {
        logError((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.PULSE_PRE_SEGMENTATION_FE_USER_MISMATCH));
    }
    return safeContext;
}
//# sourceMappingURL=PulsePreSegmentationUtil.js.map