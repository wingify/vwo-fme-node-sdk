"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateRule = void 0;
var DataTypeUtil_1 = require("./DataTypeUtil");
var DecisionUtil_1 = require("./DecisionUtil");
var ImpressionUtil_1 = require("./ImpressionUtil");
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
var evaluateRule = function (serviceContainer, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, preSegmentationResult, whitelistedObject;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, DecisionUtil_1.checkWhitelistingAndPreSeg)(serviceContainer, feature, campaign, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision)];
            case 1:
                _a = _b.sent(), preSegmentationResult = _a[0], whitelistedObject = _a[1];
                if (!(preSegmentationResult && (0, DataTypeUtil_1.isObject)(whitelistedObject) && Object.keys(whitelistedObject).length > 0)) return [3 /*break*/, 4];
                // Update the decision object with campaign and variation details
                Object.assign(decision, {
                    experimentId: campaign.getId(),
                    experimentKey: campaign.getKey(),
                    experimentVariationId: whitelistedObject.variationId,
                });
                if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(serviceContainer, campaign.getId(), whitelistedObject.variation.id, context, feature.getKey())];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(serviceContainer, campaign.getId(), whitelistedObject.variation.id, context, feature.getKey());
                _b.label = 4;
            case 4: 
            // Return the results of the evaluation
            return [2 /*return*/, { preSegmentationResult: preSegmentationResult, whitelistedObject: whitelistedObject, updatedDecision: decision }];
        }
    });
}); };
exports.evaluateRule = evaluateRule;
//# sourceMappingURL=RuleEvaluationUtil.js.map