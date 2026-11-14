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
exports.sendDeferredVariationShownPayloads = sendDeferredVariationShownPayloads;
exports.exposeFlagResult = exposeFlagResult;
var BatchEventsDispatcher_1 = require("./BatchEventsDispatcher");
var NetworkUtil_1 = require("./NetworkUtil");
var EventEnum_1 = require("../enums/EventEnum");
var SDKMetaUtil_1 = require("./SDKMetaUtil");
var CampaignUtil_1 = require("./CampaignUtil");
var constants_1 = require("../constants");
var log_messages_1 = require("../enums/log-messages");
var LogMessageUtil_1 = require("./LogMessageUtil");
/**
 * Sends deferred variationShown payloads, bypassing the fetchFlags dispatch policy.
 * Uses the same transport paths as normal impression sending.
 *
 * @param serviceContainer - Shared SDK service container.
 * @param context - User context from the original evaluation.
 * @param featureKey - Feature key the payloads belong to.
 * @param payloads - Deferred variationShown payloads to send.
 * @returns {boolean} True when payloads were enqueued or sent, false when there was nothing to send.
 */
function sendDeferredVariationShownPayloads(serviceContainer, context, featureKey, payloads) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, payloads_1, payload, _a, payloads_2, payload, campaignId, variationId, properties, campaignKeyWithFeatureName, variationName, campaignKey, campaignType;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    // Nothing was held back, so exposeResult should report that it did not send.
                    if (!(payloads === null || payloads === void 0 ? void 0 : payloads.length)) {
                        return [2 /*return*/, false];
                    }
                    // A user-configured queue delivers on its own schedule. Enqueueing counts as a successful expose.
                    if (serviceContainer.getBatchEventsQueue()) {
                        for (_i = 0, payloads_1 = payloads; _i < payloads_1.length; _i++) {
                            payload = payloads_1[_i];
                            serviceContainer.getBatchEventsQueue().enqueue(payload);
                        }
                        serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.DEFERRED_EXPOSE_ENQUEUED, {
                            count: payloads.length.toString(),
                            featureKey: featureKey,
                        }));
                        return [2 /*return*/, true];
                    }
                    if (!serviceContainer.getSettingsService().isGatewayServiceProvided) return [3 /*break*/, 6];
                    _a = 0, payloads_2 = payloads;
                    _h.label = 1;
                case 1:
                    if (!(_a < payloads_2.length)) return [3 /*break*/, 5];
                    payload = payloads_2[_a];
                    campaignId = (_d = (_c = (_b = payload === null || payload === void 0 ? void 0 : payload.d) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.props) === null || _d === void 0 ? void 0 : _d.id;
                    variationId = (_g = (_f = (_e = payload === null || payload === void 0 ? void 0 : payload.d) === null || _e === void 0 ? void 0 : _e.event) === null || _f === void 0 ? void 0 : _f.props) === null || _g === void 0 ? void 0 : _g.variation;
                    properties = (0, NetworkUtil_1.getEventsBaseProperties)(serviceContainer.getSettingsService(), EventEnum_1.EventEnum.VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
                    campaignKeyWithFeatureName = (0, CampaignUtil_1.getCampaignKeyFromCampaignId)(serviceContainer.getSettings(), campaignId);
                    variationName = (0, CampaignUtil_1.getVariationNameFromCampaignIdAndVariationId)(serviceContainer.getSettings(), campaignId, variationId);
                    campaignKey = '';
                    if (featureKey === campaignKeyWithFeatureName) {
                        campaignKey = constants_1.Constants.IMPACT_ANALYSIS;
                    }
                    else {
                        campaignKey = campaignKeyWithFeatureName === null || campaignKeyWithFeatureName === void 0 ? void 0 : campaignKeyWithFeatureName.split("".concat(featureKey, "_"))[1];
                    }
                    campaignType = (0, CampaignUtil_1.getCampaignTypeFromCampaignId)(serviceContainer.getSettings(), campaignId);
                    if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(serviceContainer, properties, payload, context.getId(), {}, { campaignKey: campaignKey, variationName: variationName, featureKey: featureKey, campaignType: campaignType })];
                case 2:
                    _h.sent();
                    return [3 /*break*/, 4];
                case 3:
                    (0, NetworkUtil_1.sendPostApiRequest)(serviceContainer, properties, payload, context.getId(), {}, { campaignKey: campaignKey, variationName: variationName, featureKey: featureKey, campaignType: campaignType });
                    _h.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, true];
                case 6:
                    if (!serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 8];
                    return [4 /*yield*/, BatchEventsDispatcher_1.BatchEventsDispatcher.dispatch(serviceContainer, { ev: payloads }, function () { }, {
                            a: serviceContainer.getSettingsService().accountId,
                            env: serviceContainer.getSettingsService().sdkKey,
                            sn: SDKMetaUtil_1.SDKMetaUtil.getInstance().getSdkName(),
                            sv: SDKMetaUtil_1.SDKMetaUtil.getInstance().getVersion(),
                        })];
                case 7:
                    _h.sent();
                    return [3 /*break*/, 9];
                case 8:
                    // Fire-and-forget when the client does not wait on tracking calls.
                    BatchEventsDispatcher_1.BatchEventsDispatcher.dispatch(serviceContainer, { ev: payloads }, function () { }, {
                        a: serviceContainer.getSettingsService().accountId,
                        env: serviceContainer.getSettingsService().sdkKey,
                        sn: SDKMetaUtil_1.SDKMetaUtil.getInstance().getSdkName(),
                        sv: SDKMetaUtil_1.SDKMetaUtil.getInstance().getVersion(),
                    });
                    _h.label = 9;
                case 9: return [2 /*return*/, true];
            }
        });
    });
}
/**
 * Enqueues deferred variationShown impressions for a Flag result (Android-style exposeResult).
 * Idempotent: second call is a no-op after stash is cleared / marked sent.
 *
 * @param flag - Flag holding deferred impressions and expose deps.
 * @returns {boolean} True when impressions were enqueued or sent, false otherwise.
 */
function exposeFlagResult(flag) {
    return __awaiter(this, void 0, void 0, function () {
        var exposeDependencies, payloads, isSent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // A later exposeResult call must not send the same impressions again.
                    if (flag.isImpressionAlreadySent()) {
                        return [2 /*return*/, false];
                    }
                    exposeDependencies = flag.getExposeDependencies();
                    payloads = flag.consumeDeferredImpressions();
                    // Error flags and evaluations that produced no impression have nothing to send.
                    if (!exposeDependencies || !payloads.length) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, sendDeferredVariationShownPayloads(exposeDependencies.serviceContainer, exposeDependencies.context, exposeDependencies.featureKey, payloads)];
                case 1:
                    isSent = _a.sent();
                    // Mark sent only after transport accepted the payloads.
                    if (isSent) {
                        flag.markImpressionSent();
                    }
                    return [2 /*return*/, isSent];
            }
        });
    });
}
//# sourceMappingURL=ImpressionExposureUtil.js.map