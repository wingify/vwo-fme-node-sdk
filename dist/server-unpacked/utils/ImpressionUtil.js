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
exports.sendImpressionForVariationShownInBatch = exports.sendImpressionForVariationShown = void 0;
var NetworkUtil_1 = require("./NetworkUtil");
var EventEnum_1 = require("../enums/EventEnum");
var CampaignUtil_1 = require("./CampaignUtil");
var CampaignUtil_2 = require("./CampaignUtil");
var constants_1 = require("../constants");
var BatchEventsDispatcher_1 = require("./BatchEventsDispatcher");
var SDKMetaUtil_1 = require("./SDKMetaUtil");
var EventDispatchPolicyUtil_1 = require("./EventDispatchPolicyUtil");
var DeferredImpressionCollector_1 = require("./DeferredImpressionCollector");
var GetFlagsBatchContext_1 = require("../services/GetFlagsBatchContext");
/**
 * Returns whether getFlags has asked to drop tracking calls.
 * Legacy suppress flags take precedence over the event dispatch policy so existing getFlags callers stay unchanged.
 *
 * @param serviceContainer - The service container instance.
 * @returns {boolean} True when impressions must be dropped and not deferred.
 */
function isTrackingSuppressed(serviceContainer) {
    var _a;
    // Either the shared container flag or the current batch worker can request the drop.
    return !!(serviceContainer.getSuppressTrackingCalls() || ((_a = (0, GetFlagsBatchContext_1.getCurrentGetFlagsBatchContext)()) === null || _a === void 0 ? void 0 : _a.suppressTrackingCalls));
}
/**
 * Creates and sends an impression for a variation shown event.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation shown to the user.
 * @param {ContextModel} context - The user context model containing user-specific data.
 * @param {string} featureKey - The feature key the impression belongs to.
 * @param {any} payload - The variationShown payload; held for exposeResult() when impressions are deferred.
 * @returns {Promise<void>} Resolves when the impression is sent, stashed, or dropped.
 */
var sendImpressionForVariationShown = function (serviceContainer, campaignId, variationId, context, featureKey, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, campaignKeyWithFeatureName, variationName, campaignKey, campaignType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // getFlags(shouldSendTrackingCalls: false) drops the impression. Do not stash it for exposeResult.
                if (isTrackingSuppressed(serviceContainer)) {
                    return [2 /*return*/];
                }
                if (!(0, EventDispatchPolicyUtil_1.getActiveEventDispatchPolicy)(serviceContainer).shouldDispatchImpressions) {
                    // fetchFlags / deferred mode: stash payload for Flag.exposeResult() instead of dropping it.
                    if ((0, DeferredImpressionCollector_1.hasDeferredImpressionScope)()) {
                        (0, DeferredImpressionCollector_1.collectDeferredImpression)(payload);
                    }
                    return [2 /*return*/];
                }
                properties = (0, NetworkUtil_1.getEventsBaseProperties)(serviceContainer.getSettingsService(), EventEnum_1.EventEnum.VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()), // Encode user agent to ensure URL safety
                context.getIpAddress());
                campaignKeyWithFeatureName = (0, CampaignUtil_1.getCampaignKeyFromCampaignId)(serviceContainer.getSettings(), campaignId);
                variationName = (0, CampaignUtil_2.getVariationNameFromCampaignIdAndVariationId)(serviceContainer.getSettings(), campaignId, variationId);
                campaignKey = '';
                if (featureKey === campaignKeyWithFeatureName) {
                    campaignKey = constants_1.Constants.IMPACT_ANALYSIS;
                }
                else {
                    campaignKey = campaignKeyWithFeatureName === null || campaignKeyWithFeatureName === void 0 ? void 0 : campaignKeyWithFeatureName.split("".concat(featureKey, "_"))[1];
                }
                campaignType = (0, CampaignUtil_1.getCampaignTypeFromCampaignId)(serviceContainer.getSettings(), campaignId);
                if (!serviceContainer.getBatchEventsQueue()) return [3 /*break*/, 1];
                serviceContainer.getBatchEventsQueue().enqueue(payload);
                return [3 /*break*/, 3];
            case 1: 
            // Send the constructed properties and payload as a POST request
            return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(serviceContainer, properties, payload, context.getId(), {}, { campaignKey: campaignKey, variationName: variationName, featureKey: featureKey, campaignType: campaignType })];
            case 2:
                // Send the constructed properties and payload as a POST request
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendImpressionForVariationShown = sendImpressionForVariationShown;
/**
 * Sends batched event payloads through the SDK batch pipeline.
 * Legacy getFlags suppression drops the whole batch. Otherwise payloads are filtered by the active event dispatch policy.
 *
 * @param serviceContainer - The service container instance.
 * @param payloads - Event payloads to send.
 * @returns {Promise<void>} Resolves when allowed payloads are enqueued, dispatched, or dropped.
 */
var sendImpressionForVariationShownInBatch = function (serviceContainer, payloads) { return __awaiter(void 0, void 0, void 0, function () {
    var eventDispatchPolicy, _i, payloads_1, payload, payloadsToDispatch, _a, payloadsToDispatch_1, payload;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                // getFlags(shouldSendTrackingCalls: false) drops the batch. Those impressions must not be deferred.
                if (isTrackingSuppressed(serviceContainer)) {
                    return [2 /*return*/];
                }
                eventDispatchPolicy = (0, EventDispatchPolicyUtil_1.getActiveEventDispatchPolicy)(serviceContainer);
                // fetchFlags blocks live impressions but still wants variationShown later via exposeResult.
                if (!eventDispatchPolicy.shouldDispatchImpressions && (0, DeferredImpressionCollector_1.hasDeferredImpressionScope)()) {
                    for (_i = 0, payloads_1 = payloads; _i < payloads_1.length; _i++) {
                        payload = payloads_1[_i];
                        // Unnamed payloads in this batch are variationShown. Usage and debugger stay for the filter below.
                        if (((_c = (_b = payload === null || payload === void 0 ? void 0 : payload.d) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.name) === EventEnum_1.EventEnum.VARIATION_SHOWN || !((_e = (_d = payload === null || payload === void 0 ? void 0 : payload.d) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.name)) {
                            (0, DeferredImpressionCollector_1.collectDeferredImpression)(payload);
                        }
                    }
                }
                payloadsToDispatch = payloads.filter(function (payload) { var _a, _b; return (0, EventDispatchPolicyUtil_1.canDispatchEvent)(eventDispatchPolicy, (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.d) === null || _a === void 0 ? void 0 : _a.event) === null || _b === void 0 ? void 0 : _b.name); });
                if (!payloadsToDispatch.length) {
                    return [2 /*return*/];
                }
                // A user-configured queue sends on its own schedule, so enqueue and return.
                if (serviceContainer.getBatchEventsQueue()) {
                    for (_a = 0, payloadsToDispatch_1 = payloadsToDispatch; _a < payloadsToDispatch_1.length; _a++) {
                        payload = payloadsToDispatch_1[_a];
                        serviceContainer.getBatchEventsQueue().enqueue(payload);
                    }
                    return [2 /*return*/];
                }
                return [4 /*yield*/, BatchEventsDispatcher_1.BatchEventsDispatcher.dispatch(serviceContainer, { ev: payloadsToDispatch }, function () { }, {
                        a: serviceContainer.getSettingsService().accountId,
                        env: serviceContainer.getSettingsService().sdkKey,
                        sn: SDKMetaUtil_1.SDKMetaUtil.getInstance().getSdkName(),
                        sv: SDKMetaUtil_1.SDKMetaUtil.getInstance().getVersion(),
                    })];
            case 1:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.sendImpressionForVariationShownInBatch = sendImpressionForVariationShownInBatch;
//# sourceMappingURL=ImpressionUtil.js.map