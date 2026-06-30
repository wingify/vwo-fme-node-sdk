"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeWebTestingCampaignsMap = normalizeWebTestingCampaignsMap;
exports.parseWebTestingCampaignsFromContext = parseWebTestingCampaignsFromContext;
exports.evaluateWebTestingCampaignVariation = evaluateWebTestingCampaignVariation;
var ApiEnum_1 = require("../../../enums/ApiEnum");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
/**
 * Normalizes Web Testing campaign map keys and variation values to strings.
 * @param {Record<string, unknown>} rawAssignments - The raw assignments map from the context.
 * @returns {Record<string, string>} - The normalized assignments map with campaignId as key and variationId as value.
 */
function normalizeWebTestingCampaignsMap(rawAssignments) {
    // Turn the raw assignments map into a simple string map for regex matching.
    var campaignIdToVariationId = {};
    for (var _i = 0, _a = Object.keys(rawAssignments); _i < _a.length; _i++) {
        var campaignId = _a[_i];
        var assignedVariationId = rawAssignments[campaignId];
        if (!(0, DataTypeUtil_1.isUndefined)(assignedVariationId) &&
            !(0, DataTypeUtil_1.isNull)(assignedVariationId) &&
            String(campaignId).length > 0
        // Ignore empty keys; null/undefined variations mean nothing assigned for that id.
        ) {
            campaignIdToVariationId[String(campaignId)] = String(assignedVariationId);
        }
    }
    return campaignIdToVariationId;
}
/**
 * Parses `context.platformVariables.webTestingCampaigns` (JSON string or plain object).
 * @param {ContextModel} context - The context model containing platform variables for the evaluation.
 * @param {ServiceContainer} serviceContainer - The service container for accessing services like the log manager.
 * @returns {Record<string, string> | null} A record mapping campaign IDs to variation IDs, or null if invalid/missing.
 */
function parseWebTestingCampaignsFromContext(context, serviceContainer) {
    var _a;
    var webTestingCampaignsInput = (_a = context.getPlatformVariables()) === null || _a === void 0 ? void 0 : _a.webTestingCampaigns;
    // No payload from the integration means empty assignments map.
    if ((0, DataTypeUtil_1.isNull)(webTestingCampaignsInput) || (0, DataTypeUtil_1.isUndefined)(webTestingCampaignsInput)) {
        return null;
    }
    // SDK already forwarded a plain campaignId -> variationId object.
    if ((0, DataTypeUtil_1.isObject)(webTestingCampaignsInput)) {
        return normalizeWebTestingCampaignsMap(webTestingCampaignsInput);
    }
    // Some stacks pass JSON text (cookie, SSR prop, tag); parse it only if it's an object.
    if ((0, DataTypeUtil_1.isString)(webTestingCampaignsInput)) {
        var trimmedWebTestingCampaignsJson = webTestingCampaignsInput.trim();
        if (trimmedWebTestingCampaignsJson === '') {
            // Empty JSON string is invalid.
            return null;
        }
        try {
            // extract all "key": tokens and check for duplicates before parsing swallows them
            var allCampaignIdTokens = trimmedWebTestingCampaignsJson.match(/"([^"\\]*)"\s*:/g);
            if (allCampaignIdTokens) {
                var campaignIds = allCampaignIdTokens.map(function (token) { return token.replace(/"\s*:$/, '').slice(1); });
                var hasDuplicateCampaignId = campaignIds.length !== new Set(campaignIds).size;
                if (hasDuplicateCampaignId) {
                    serviceContainer
                        .getLogManager()
                        .errorLog('INVALID_WEB_TESTING_CAMPAIGNS_DUPLICATE_KEY', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
                }
            }
            // Parse the JSON string into an object.
            var parsedAssignments = JSON.parse(trimmedWebTestingCampaignsJson);
            if ((0, DataTypeUtil_1.isObject)(parsedAssignments)) {
                return normalizeWebTestingCampaignsMap(parsedAssignments);
            }
            // Parsed fine but it's an array/string/etc. Invalid shape.
            serviceContainer
                .getLogManager()
                .errorLog('INVALID_WEB_TESTING_CAMPAIGNS_JSON', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
        }
        catch (_b) {
            // Malformed JSON; treat like missing assignments.
            serviceContainer
                .getLogManager()
                .errorLog('INVALID_WEB_TESTING_CAMPAIGNS_JSON', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
        }
        return null;
    }
    // Booleans/numbers/other odd types are invalid.
    if (!(0, DataTypeUtil_1.isUndefined)(webTestingCampaignsInput) && !(0, DataTypeUtil_1.isNull)(webTestingCampaignsInput)) {
        var kind = (0, DataTypeUtil_1.isArray)(webTestingCampaignsInput) ? 'array' : (0, DataTypeUtil_1.getType)(webTestingCampaignsInput).toLowerCase();
        serviceContainer
            .getLogManager()
            .errorLog('INVALID_WEB_TESTING_CAMPAIGNS_TYPE', { kind: kind }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
    }
    return null;
}
/**
 * Evaluates campaignVariation operand encoding:
 * - "!C" — user is not in campaign C (no entry in map)
 * - "C_!V" — user is in campaign C and assigned variation is not V
 * - "C_V" — user is in campaign C with variation V
 * - "C" (digits only) — user is in campaign C (any variation)
 */
function evaluateWebTestingCampaignVariation(campaignVariationOperand, assignedVariationsByCampaignId) {
    // Null means empty assignments map.
    var assignments = assignedVariationsByCampaignId !== null && assignedVariationsByCampaignId !== void 0 ? assignedVariationsByCampaignId : {};
    // !123 — user should not be in campaign 123.
    var match = /^!(\d+)$/.exec(campaignVariationOperand);
    if (match) {
        var campaignId = match[1];
        return { result: !Object.prototype.hasOwnProperty.call(assignments, campaignId), invalidFormat: false };
    }
    // 123_!4 — in campaign 123 but not the variation 4.
    match = /^(\d+)_!(\d+)$/.exec(campaignVariationOperand);
    if (match) {
        var campaignId = match[1];
        var variationId = match[2];
        if (!Object.prototype.hasOwnProperty.call(assignments, campaignId)) {
            return { result: false, invalidFormat: false };
        }
        return { result: assignments[campaignId] !== variationId, invalidFormat: false };
    }
    // 123_4 — must be exactly that campaign and variation.
    match = /^(\d+)_(\d+)$/.exec(campaignVariationOperand);
    if (match) {
        var campaignId = match[1];
        var variationId = match[2];
        if (!Object.prototype.hasOwnProperty.call(assignments, campaignId)) {
            return { result: false, invalidFormat: false };
        }
        return { result: assignments[campaignId] === variationId, invalidFormat: false };
    }
    // 123 — in the campaign, any variation counts.
    match = /^(\d+)$/.exec(campaignVariationOperand);
    if (match) {
        var campaignId = match[1];
        return { result: Object.prototype.hasOwnProperty.call(assignments, campaignId), invalidFormat: false };
    }
    // Invalid format.
    return { result: false, invalidFormat: true };
}
//# sourceMappingURL=WebTestingSegmentUtil.js.map