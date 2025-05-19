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
exports.SegmentationManager = void 0;
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
var SegmentEvaluator_1 = require("../evaluators/SegmentEvaluator");
var GatewayServiceUtil_1 = require("../../../utils/GatewayServiceUtil");
var UrlEnum_1 = require("../../../enums/UrlEnum");
var logger_1 = require("../../logger");
var ContextVWOModel_1 = require("../../../models/user/ContextVWOModel");
var SettingsService_1 = require("../../../services/SettingsService");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var SegmentationManager = /** @class */ (function () {
    function SegmentationManager() {
    }
    Object.defineProperty(SegmentationManager, "Instance", {
        /**
         * Singleton pattern implementation for getting the instance of SegmentationManager.
         * @returns {SegmentationManager} The singleton instance.
         */
        get: function () {
            this.instance = this.instance || new SegmentationManager(); // Create new instance if it doesn't exist
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Attaches an evaluator to the manager, or creates a new one if none is provided.
     * @param {SegmentEvaluator} evaluator - Optional evaluator to attach.
     */
    SegmentationManager.prototype.attachEvaluator = function (evaluator) {
        this.evaluator = evaluator || new SegmentEvaluator_1.SegmentEvaluator(); // Use provided evaluator or create new one
    };
    /**
     * Sets the contextual data for the segmentation process.
     * @param {any} settings - The settings data.
     * @param {any} feature - The feature data including segmentation needs.
     * @param {any} context - The context data for the evaluation.
     */
    SegmentationManager.prototype.setContextualData = function (settings, feature, context) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParams, params, _vwo, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.attachEvaluator(); // Ensure a fresh evaluator instance
                        this.evaluator.settings = settings; // Set settings in evaluator
                        this.evaluator.context = context; // Set context in evaluator
                        this.evaluator.feature = feature; // Set feature in evaluator
                        // if both user agent and ip is null then we should not get data from gateway service
                        if ((context === null || context === void 0 ? void 0 : context.getUserAgent()) === null && (context === null || context === void 0 ? void 0 : context.getIpAddress()) === null) {
                            return [2 /*return*/];
                        }
                        if (!(feature.getIsGatewayServiceRequired() === true)) return [3 /*break*/, 4];
                        if (!(SettingsService_1.SettingsService.Instance.isGatewayServiceProvided &&
                            ((0, DataTypeUtil_1.isUndefined)(context.getVwo()) || context.getVwo() === null))) return [3 /*break*/, 4];
                        queryParams = {};
                        if (context === null || context === void 0 ? void 0 : context.getUserAgent()) {
                            queryParams['userAgent'] = context.getUserAgent();
                        }
                        if (context === null || context === void 0 ? void 0 : context.getIpAddress()) {
                            queryParams['ipAddress'] = context.getIpAddress();
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        params = (0, GatewayServiceUtil_1.getQueryParams)(queryParams);
                        return [4 /*yield*/, (0, GatewayServiceUtil_1.getFromGatewayService)(params, UrlEnum_1.UrlEnum.GET_USER_DATA)];
                    case 2:
                        _vwo = _a.sent();
                        context.setVwo(new ContextVWOModel_1.ContextVWOModel().modelFromDictionary(_vwo));
                        this.evaluator.context = context;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        logger_1.LogManager.Instance.error("Error in setting contextual data for segmentation. Got error: ".concat(err_1.error));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validates the segmentation against provided DSL and properties.
     * @param {Record<string, dynamic>} dsl - The segmentation DSL.
     * @param {Record<any, dynamic>} properties - The properties to validate against.
     * @param {SettingsModel} settings - The settings model.
     * @param {any} context - Optional context.
     * @returns {Promise<boolean>} True if segmentation is valid, otherwise false.
     */
    SegmentationManager.prototype.validateSegmentation = function (dsl, properties) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.evaluator.isSegmentationValid(dsl, properties)];
                    case 1: return [2 /*return*/, _a.sent()]; // Delegate to evaluator's method
                }
            });
        });
    };
    return SegmentationManager;
}());
exports.SegmentationManager = SegmentationManager;
//# sourceMappingURL=SegmentationManger.js.map