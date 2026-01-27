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
exports.createAndSendImpressionForVariationShown = void 0;
var NetworkUtil_1 = require("./NetworkUtil");
var EventEnum_1 = require("../enums/EventEnum");
var CampaignUtil_1 = require("./CampaignUtil");
var CampaignUtil_2 = require("./CampaignUtil");
var constants_1 = require("../constants");
/**
 * Creates and sends an impression for a variation shown event.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation shown to the user.
 * @param {ContextModel} context - The user context model containing user-specific data.
 */
var createAndSendImpressionForVariationShown = function (serviceContainer, campaignId, variationId, context, featureKey) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload, campaignKeyWithFeatureName, variationName, campaignKey, campaignType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                properties = (0, NetworkUtil_1.getEventsBaseProperties)(serviceContainer.getSettingsService(), EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()), // Encode user agent to ensure URL safety
                context.getIpAddress());
                payload = (0, NetworkUtil_1.getTrackUserPayloadData)(serviceContainer, EventEnum_1.EventEnum.VWO_VARIATION_SHOWN, campaignId, variationId, context);
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
exports.createAndSendImpressionForVariationShown = createAndSendImpressionForVariationShown;
//# sourceMappingURL=ImpressionUtil.js.map