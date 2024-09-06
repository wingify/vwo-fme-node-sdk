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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.TrackApi = void 0;
/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
var ApiEnum_1 = require("../enums/ApiEnum");
var log_messages_1 = require("../enums/log-messages");
var logger_1 = require("../packages/logger");
var FunctionUtil_1 = require("../utils/FunctionUtil");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var NetworkUtil_1 = require("../utils/NetworkUtil");
var TrackApi = /** @class */ (function () {
    function TrackApi() {
    }
    /**
     * Implementation of the track method to handle event tracking.
     * Checks if the event exists, creates an impression, and executes hooks.
     */
    TrackApi.prototype.track = function (settings, eventName, context, eventProperties, hooksService) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(0, FunctionUtil_1.doesEventBelongToAnyFeature)(eventName, settings)) return [3 /*break*/, 4];
                        if (!(0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) return [3 /*break*/, 2];
                        return [4 /*yield*/, createImpressionForTrack(settings, eventName, context, eventProperties)];
                    case 1:
                        _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        createImpressionForTrack(settings, eventName, context, eventProperties);
                        _c.label = 3;
                    case 3:
                        // Set and execute integration callback for the track event
                        hooksService.set({ eventName: eventName, api: ApiEnum_1.ApiEnum.TRACK });
                        hooksService.execute(hooksService.get());
                        return [2 /*return*/, (_a = {}, _a[eventName] = true, _a)];
                    case 4:
                        // Log an error if the event does not exist
                        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.EVENT_NOT_FOUND, {
                            eventName: eventName,
                        }));
                        return [2 /*return*/, (_b = {}, _b[eventName] = false, _b)];
                }
            });
        });
    };
    return TrackApi;
}());
exports.TrackApi = TrackApi;
/**
 * Creates an impression for a track event and sends it via a POST API request.
 * @param settings Configuration settings for the tracking.
 * @param eventName Name of the event to track.
 * @param user User details.
 * @param eventProperties Properties associated with the event.
 */
var createImpressionForTrack = function (settings, eventName, context, eventProperties) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                properties = (0, NetworkUtil_1.getEventsBaseProperties)(settings, eventName, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
                payload = (0, NetworkUtil_1.getTrackGoalPayloadData)(settings, context.getId(), eventName, eventProperties, context === null || context === void 0 ? void 0 : context.getUserAgent(), context === null || context === void 0 ? void 0 : context.getIpAddress());
                // Send the prepared payload via POST API request
                return [4 /*yield*/, (0, NetworkUtil_1.sendPostApiRequest)(properties, payload)];
            case 1:
                // Send the prepared payload via POST API request
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=TrackEvent.js.map