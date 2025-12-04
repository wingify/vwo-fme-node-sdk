"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.sendGetCall = sendGetCall;
exports.sendPostCall = sendPostCall;
var HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
var FunctionUtil_1 = require("./FunctionUtil");
var logger_1 = require("../packages/logger");
var LogMessageUtil_1 = require("./LogMessageUtil");
var log_messages_1 = require("../enums/log-messages");
var EventEnum_1 = require("../enums/EventEnum");
var ResponseModel_1 = require("../packages/network-layer/models/ResponseModel");
// Cache the fetch function to avoid re-importing on every request
var cachedFetch = null;
var fetchPromise = null;
/**
 * Gets the fetch function to use, checking for global fetch first, then falling back to node-fetch.
 * @returns The fetch function to use
 */
function getFetch() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            // Return cached fetch if available
            if (cachedFetch) {
                return [2 /*return*/, cachedFetch];
            }
            // If a fetch initialization is already in progress, wait for it
            if (fetchPromise) {
                return [2 /*return*/, fetchPromise];
            }
            // Initialize fetch
            fetchPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                var nodeFetchModule, nodeFetch, fetchFn, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Check if fetch is available globally (Node.js 18+, browsers, etc.)
                            if (typeof fetch !== 'undefined') {
                                logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                                    api: 'Global fetch',
                                    process: typeof process === 'undefined' ? 'undefined' : 'defined',
                                }));
                                cachedFetch = fetch;
                                return [2 /*return*/, fetch];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                                api: 'Node-fetch',
                                process: typeof process === 'undefined' ? 'undefined' : 'defined',
                            }));
                            nodeFetchModule = 'node-' + 'fetch';
                            return [4 /*yield*/, Promise.resolve("".concat(nodeFetchModule)).then(function (s) { return __importStar(require(s)); })];
                        case 2:
                            nodeFetch = _a.sent();
                            fetchFn = (nodeFetch.default || nodeFetch);
                            cachedFetch = fetchFn;
                            return [2 /*return*/, fetchFn];
                        case 3:
                            error_1 = _a.sent();
                            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.ERROR_INITIALIZING_FETCH, {
                                error: (0, FunctionUtil_1.getFormattedErrorMessage)(error_1),
                            }));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); })();
            return [2 /*return*/, fetchPromise];
        });
    });
}
function sendGetCall(request) {
    return sendRequest(HttpMethodEnum_1.HttpMethodEnum.GET, request);
}
function sendPostCall(request) {
    return sendRequest(HttpMethodEnum_1.HttpMethodEnum.POST, request);
}
/**
 * Sends a request to the server using the Fetch API.
 * @param method - The HTTP method to use for the request.
 * @param request - The request model.
 * @returns A Promise that resolves to the response data.
 */
function sendRequest(method, request) {
    return __awaiter(this, void 0, void 0, function () {
        var responseModel, networkOptions, url, retryCount, fetchFn_1, retryConfig_1, shouldRetry_1, maxRetries_1, executeRequest_1, handleError_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    responseModel = new ResponseModel_1.ResponseModel();
                    networkOptions = request.getOptions();
                    url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
                    if (networkOptions.port) {
                        url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
                    }
                    retryCount = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getFetch()];
                case 2:
                    fetchFn_1 = _a.sent();
                    retryConfig_1 = request.getRetryConfig();
                    shouldRetry_1 = retryConfig_1.shouldRetry;
                    maxRetries_1 = retryConfig_1.maxRetries;
                    if (method === HttpMethodEnum_1.HttpMethodEnum.POST) {
                        networkOptions.body = JSON.stringify(networkOptions.body);
                    }
                    executeRequest_1 = function () {
                        return new Promise(function (resolve, reject) {
                            fetchFn_1(url, networkOptions)
                                .then(function (res) {
                                // Some endpoints return empty strings as the response body; treat
                                // as raw text and handle potential JSON parsing errors below
                                return res.text().then(function (text) {
                                    responseModel.setStatusCode(res.status);
                                    if (retryCount > 0) {
                                        responseModel.setTotalAttempts(retryCount);
                                        responseModel.setError(request.getLastError());
                                    }
                                    try {
                                        if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
                                            responseModel.setData(JSON.parse(text));
                                        }
                                        else {
                                            responseModel.setData(text);
                                        }
                                    }
                                    catch (err) {
                                        responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(err));
                                        reject(responseModel);
                                    }
                                    if (res.status === 200) {
                                        resolve(responseModel);
                                    }
                                    else if (res.status === 400) {
                                        responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(res.statusText));
                                        responseModel.setTotalAttempts(retryCount);
                                        reject(responseModel);
                                    }
                                    else {
                                        handleError_1("".concat(res.statusText, ", status: ").concat(res.status), resolve, reject);
                                    }
                                });
                            })
                                .catch(function (err) {
                                var errorMessage = (0, FunctionUtil_1.getFormattedErrorMessage)(err);
                                // incase of no internet connection, error will have cause property which is the error message
                                if (err && err.cause) {
                                    errorMessage = "".concat(errorMessage, " ").concat(err.cause);
                                }
                                handleError_1(errorMessage, resolve, reject);
                            });
                        });
                    };
                    handleError_1 = function (error, resolve, reject) {
                        var endpoint = String(networkOptions.path || url).split('?')[0];
                        if (shouldRetry_1 && retryCount < maxRetries_1) {
                            var delay = retryConfig_1.initialDelay * Math.pow(retryConfig_1.backoffMultiplier, retryCount) * 1000; // Exponential backoff
                            retryCount++;
                            logger_1.LogManager.Instance.errorLog('ATTEMPTING_RETRY_FOR_FAILED_NETWORK_CALL', {
                                endPoint: endpoint,
                                err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                                delay: delay / 1000,
                                attempt: retryCount,
                                maxRetries: maxRetries_1,
                            }, {}, false);
                            request.setLastError((0, FunctionUtil_1.getFormattedErrorMessage)(error));
                            setTimeout(function () {
                                executeRequest_1().then(resolve).catch(reject);
                            }, delay);
                        }
                        else {
                            if (!String(networkOptions.path).includes(EventEnum_1.EventEnum.VWO_DEBUGGER_EVENT)) {
                                logger_1.LogManager.Instance.errorLog('NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES', {
                                    extraData: endpoint,
                                    attempts: retryCount,
                                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
                                }, {}, false);
                            }
                            responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(error));
                            responseModel.setTotalAttempts(retryCount);
                            reject(responseModel);
                        }
                    };
                    return [2 /*return*/, executeRequest_1()];
                case 3:
                    err_1 = _a.sent();
                    responseModel.setError((0, FunctionUtil_1.getFormattedErrorMessage)(err_1));
                    responseModel.setTotalAttempts(retryCount);
                    throw responseModel;
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=FetchUtil.js.map