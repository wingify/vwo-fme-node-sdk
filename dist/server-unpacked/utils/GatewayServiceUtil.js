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
exports.getFromGatewayService = getFromGatewayService;
exports.getQueryParams = getQueryParams;
exports.addIsGatewayServiceRequiredFlag = addIsGatewayServiceRequiredFlag;
/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
var CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
var HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
var log_messages_1 = require("../enums/log-messages");
var logger_1 = require("../packages/logger");
var network_layer_1 = require("../packages/network-layer");
var SettingsService_1 = require("../services/SettingsService");
var PromiseUtil_1 = require("./PromiseUtil");
var UrlUtil_1 = require("./UrlUtil");
/**
 * Asynchronously retrieves data from a web service using the specified query parameters and endpoint.
 * @param queryParams - The parameters to be used in the query string of the request.
 * @param endpoint - The endpoint URL to which the request is sent.
 * @returns A promise that resolves to the response data or false if an error occurs.
 */
function getFromGatewayService(queryParams, endpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var deferredObject, networkInstance, request;
        return __generator(this, function (_a) {
            deferredObject = new PromiseUtil_1.Deferred();
            networkInstance = network_layer_1.NetworkManager.Instance;
            // Check if the base URL is not set correctly
            if (!SettingsService_1.SettingsService.Instance.isGatewayServiceProvided) {
                // Log an informational message about the invalid URL
                logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.GATEWAY_URL_ERROR);
                // Resolve the promise with false indicating an error or invalid state
                deferredObject.resolve(false);
                return [2 /*return*/, deferredObject.promise];
            }
            // required if sdk is running in browser environment
            // using dacdn where accountid is required
            queryParams['accountId'] = SettingsService_1.SettingsService.Instance.accountId;
            try {
                request = new network_layer_1.RequestModel(UrlUtil_1.UrlUtil.getBaseUrl(), HttpMethodEnum_1.HttpMethodEnum.GET, endpoint, queryParams, null, null, SettingsService_1.SettingsService.Instance.protocol, SettingsService_1.SettingsService.Instance.port);
                // Perform the network GET request
                networkInstance
                    .get(request)
                    .then(function (response) {
                    // Resolve the deferred object with the data from the response
                    deferredObject.resolve(response.getData());
                })
                    .catch(function (err) {
                    // Reject the deferred object with the error response
                    deferredObject.reject(err);
                });
                return [2 /*return*/, deferredObject.promise];
            }
            catch (err) {
                // Resolve the promise with false as fallback
                deferredObject.resolve(false);
                return [2 /*return*/, deferredObject.promise];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Encodes the query parameters to ensure they are URL-safe.
 * @param queryParams  The query parameters to be encoded.
 * @returns  An object containing the encoded query parameters.
 */
function getQueryParams(queryParams) {
    var encodedParams = {};
    for (var _i = 0, _a = Object.entries(queryParams); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        // Encode the parameter value to ensure it is URL-safe
        var encodedValue = encodeURIComponent(String(value));
        // Add the encoded parameter to the result object
        encodedParams[key] = encodedValue;
    }
    return encodedParams;
}
/**
 * Adds isGatewayServiceRequired flag to each feature in the settings based on pre segmentation.
 * @param {any} settings - The settings file to modify.
 */
function addIsGatewayServiceRequiredFlag(settings) {
    // \b(?<!\"custom_variable\"[^\}]*)(country|region|city|os|device_type|browser_string|ua)\b: This part matches the usual patterns (like country, region, etc.) that are not under custom_variable
    // |(?<="custom_variable"\s*:\s*{\s*"[^)]*"\s*:\s*")inlist\([^)]*\)(?="): This part matches inlist(*) only when it appears under "custom_variable" : { ".*" : "
    var pattern = /\b(?<!"custom_variable"[^}]*)(country|region|city|os|device_type|browser_string|ua)\b|(?<="custom_variable"\s*:\s*{\s*"name"\s*:\s*")inlist\([^)]*\)(?=")/g;
    for (var _i = 0, _a = settings.getFeatures(); _i < _a.length; _i++) {
        var feature = _a[_i];
        var rules = feature.getRulesLinkedCampaign();
        for (var _b = 0, rules_1 = rules; _b < rules_1.length; _b++) {
            var rule = rules_1[_b];
            var segments = {};
            if (rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.PERSONALIZE || rule.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT) {
                segments = rule.getVariations()[0].getSegments();
            }
            else {
                segments = rule.getSegments();
            }
            if (segments) {
                var jsonSegments = JSON.stringify(segments);
                var matches = jsonSegments.match(pattern);
                if (matches && matches.length > 0) {
                    feature.setIsGatewayServiceRequired(true);
                    break;
                }
            }
        }
    }
}
//# sourceMappingURL=GatewayServiceUtil.js.map