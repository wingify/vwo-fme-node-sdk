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
exports.BatchEventsDispatcher = void 0;
var network_layer_1 = require("../packages/network-layer");
var HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
var UrlEnum_1 = require("../enums/UrlEnum");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var log_messages_1 = require("../enums/log-messages");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var PromiseUtil_1 = require("./PromiseUtil");
var FunctionUtil_1 = require("./FunctionUtil");
var constants_1 = require("../constants");
var DebuggerServiceUtil_1 = require("./DebuggerServiceUtil");
var NetworkUtil_1 = require("./NetworkUtil");
var EventEnum_1 = require("../enums/EventEnum");
var BatchEventsDispatcher = /** @class */ (function () {
    function BatchEventsDispatcher() {
    }
    BatchEventsDispatcher.dispatch = function (serviceContainer, payload, flushCallback, queryParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostApiRequest(serviceContainer, queryParams, payload, flushCallback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Sends a POST request to the server.
     * @param properties - The properties of the request.
     * @param payload - The payload of the request.
     * @returns A promise that resolves to a void.
     */
    BatchEventsDispatcher.sendPostApiRequest = function (serviceContainer, properties, payload, flushCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var deferred, retryConfig, headers, request, _a, variationShownCount, setAttributeCount, customEventCount, extraData;
            var _this = this;
            return __generator(this, function (_b) {
                deferred = new PromiseUtil_1.Deferred();
                retryConfig = serviceContainer.getNetworkManager().getRetryConfig();
                headers = {};
                headers['Authorization'] = serviceContainer.getSettingsService().sdkKey;
                request = new network_layer_1.RequestModel(serviceContainer.getSettingsService().hostname, HttpMethodEnum_1.HttpMethodEnum.POST, serviceContainer.getUpdatedEndpointWithCollectionPrefix(UrlEnum_1.UrlEnum.BATCH_EVENTS), properties, payload, headers, serviceContainer.getSettingsService().protocol, serviceContainer.getSettingsService().port, retryConfig);
                _a = this.extractEventCounts(payload), variationShownCount = _a.variationShownCount, setAttributeCount = _a.setAttributeCount, customEventCount = _a.customEventCount;
                extraData = "".concat(constants_1.Constants.BATCH_EVENTS, " having ");
                if (variationShownCount > 0) {
                    extraData += "getFlag events: ".concat(variationShownCount, ", ");
                }
                if (customEventCount > 0) {
                    extraData += "conversion events: ".concat(customEventCount, ", ");
                }
                if (setAttributeCount > 0) {
                    extraData += "setAttribute events: ".concat(setAttributeCount, ", ");
                }
                try {
                    serviceContainer
                        .getNetworkManager()
                        .post(request)
                        .then(function (response) {
                        if (response.getTotalAttempts() > 0) {
                            var debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(response, '', constants_1.Constants.BATCH_EVENTS, extraData);
                            // send debug event
                            (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(serviceContainer, debugEventProps);
                        }
                        var batchApiResult = _this.handleBatchResponse(serviceContainer.getLogManager(), UrlEnum_1.UrlEnum.BATCH_EVENTS, payload, properties, null, response, flushCallback);
                        deferred.resolve(batchApiResult);
                    })
                        .catch(function (err) {
                        var debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(err, '', constants_1.Constants.BATCH_EVENTS, extraData);
                        // send debug event
                        (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(serviceContainer, debugEventProps);
                        var batchApiResult = _this.handleBatchResponse(serviceContainer.getLogManager(), UrlEnum_1.UrlEnum.BATCH_EVENTS, payload, properties, null, err, flushCallback);
                        deferred.resolve(batchApiResult);
                    });
                    return [2 /*return*/, deferred.promise];
                }
                catch (error) {
                    serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                        apiName: constants_1.Constants.BATCH_EVENTS,
                        err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                    }, { an: constants_1.Constants.BATCH_EVENTS });
                    deferred.resolve({ status: 'error', events: payload });
                    return [2 /*return*/, deferred.promise];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handles the response from batch events API call
     * @param properties - Request properties containing events
     * @param queryParams - Query parameters from the request
     * @param error - Error object if request failed
     * @param res - Response object from the API
     * @param rawData - Raw response data
     * @param callback - Callback function to handle the result
     */
    BatchEventsDispatcher.handleBatchResponse = function (logManager, endPoint, payload, queryParams, err, res, callback) {
        var eventsPerRequest = payload.ev.length;
        var accountId = queryParams.a;
        var error = err ? err : res === null || res === void 0 ? void 0 : res.getError();
        if (error && !(error instanceof Error)) {
            if ((0, DataTypeUtil_1.isString)(error)) {
                error = new Error(error);
            }
            else if (error instanceof Object) {
                error = new Error(JSON.stringify(error));
            }
        }
        if (error) {
            logManager.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPRESSION_BATCH_FAILED));
            logManager.errorLog('NETWORK_CALL_FAILED', {
                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                err: error.message,
            }, {}, false);
            callback(error, payload);
            return { status: 'error', events: payload };
        }
        var statusCode = res === null || res === void 0 ? void 0 : res.getStatusCode();
        if (statusCode === 200) {
            logManager.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPRESSION_BATCH_SUCCESS, {
                accountId: accountId,
                endPoint: endPoint,
            }));
            callback(null, payload);
            return { status: 'success', events: payload };
        }
        if (statusCode === 413) {
            logManager.errorLog('CONFIG_BATCH_EVENT_LIMIT_EXCEEDED', {
                accountId: accountId,
                endPoint: endPoint,
                eventsPerRequest: eventsPerRequest,
            }, {}, false);
            logManager.errorLog('NETWORK_CALL_FAILED', {
                method: HttpMethodEnum_1.HttpMethodEnum.POST,
                err: error.message,
            }, {}, false);
            callback(error, payload);
            return { status: 'error', events: payload };
        }
        logManager.errorLog('IMPRESSION_BATCH_FAILED', {}, {}, false);
        logManager.errorLog('NETWORK_CALL_FAILED', {
            method: HttpMethodEnum_1.HttpMethodEnum.POST,
            err: error.message,
        }, {}, false);
        callback(error, payload);
        return { status: 'error', events: payload };
    };
    BatchEventsDispatcher.extractEventCounts = function (payload) {
        var _a, _b, _c;
        var counts = { variationShownCount: 0, setAttributeCount: 0, customEventCount: 0 };
        var standardEventNames = new Set(Object.values(EventEnum_1.EventEnum));
        var events = (_a = payload === null || payload === void 0 ? void 0 : payload.ev) !== null && _a !== void 0 ? _a : [];
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var entry = events_1[_i];
            var name_1 = (_c = (_b = entry === null || entry === void 0 ? void 0 : entry.d) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.name;
            if (!name_1) {
                continue;
            }
            if (name_1 === EventEnum_1.EventEnum.VWO_VARIATION_SHOWN) {
                counts.variationShownCount += 1;
                continue;
            }
            if (name_1 === EventEnum_1.EventEnum.VWO_SYNC_VISITOR_PROP) {
                counts.setAttributeCount += 1;
                continue;
            }
            if (!standardEventNames.has(name_1)) {
                counts.customEventCount += 1;
            }
        }
        return counts;
    };
    return BatchEventsDispatcher;
}());
exports.BatchEventsDispatcher = BatchEventsDispatcher;
exports.default = BatchEventsDispatcher;
//# sourceMappingURL=BatchEventsDispatcher.js.map