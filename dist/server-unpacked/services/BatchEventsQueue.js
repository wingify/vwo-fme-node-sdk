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
exports.BatchEventsQueue = void 0;
var constants_1 = require("../constants");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var logger_1 = require("../packages/logger");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var log_messages_1 = require("../enums/log-messages");
var SettingsService_1 = require("../services/SettingsService");
var BatchEventsQueue = /** @class */ (function () {
    /**
     * Constructor for the BatchEventsQueue
     * @param config - The configuration for the batch events queue
     */
    function BatchEventsQueue(config) {
        if (config === void 0) { config = {}; }
        this.queue = [];
        this.timer = null;
        if ((0, DataTypeUtil_1.isNumber)(config.requestTimeInterval) && config.requestTimeInterval >= 1) {
            this.requestTimeInterval = config.requestTimeInterval;
        }
        else {
            this.requestTimeInterval = constants_1.Constants.DEFAULT_REQUEST_TIME_INTERVAL;
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
                parameter: 'requestTimeInterval',
                minLimit: 0,
                defaultValue: this.requestTimeInterval.toString(),
            }));
        }
        if ((0, DataTypeUtil_1.isNumber)(config.eventsPerRequest) &&
            config.eventsPerRequest > 0 &&
            config.eventsPerRequest <= constants_1.Constants.MAX_EVENTS_PER_REQUEST) {
            this.eventsPerRequest = config.eventsPerRequest;
        }
        else if (config.eventsPerRequest > constants_1.Constants.MAX_EVENTS_PER_REQUEST) {
            this.eventsPerRequest = constants_1.Constants.MAX_EVENTS_PER_REQUEST;
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_MAX_LIMIT, {
                parameter: 'eventsPerRequest',
                maxLimit: constants_1.Constants.MAX_EVENTS_PER_REQUEST.toString(),
            }));
        }
        else {
            this.eventsPerRequest = constants_1.Constants.DEFAULT_EVENTS_PER_REQUEST;
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
                parameter: 'eventsPerRequest',
                minLimit: 0,
                defaultValue: this.eventsPerRequest.toString(),
            }));
        }
        this.flushCallback = (0, DataTypeUtil_1.isFunction)(config.flushCallback) ? config.flushCallback : function () { };
        this.dispatcher = config.dispatcher;
        this.accountId = SettingsService_1.SettingsService.Instance.accountId;
        this.createNewBatchTimer();
        BatchEventsQueue.instance = this;
        return this;
    }
    Object.defineProperty(BatchEventsQueue, "Instance", {
        /**
         * Gets the instance of the BatchEventsQueue
         * @returns The instance of the BatchEventsQueue
         */
        get: function () {
            return BatchEventsQueue.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Enqueues an event
     * @param payload - The event to enqueue
     */
    BatchEventsQueue.prototype.enqueue = function (payload) {
        // Enqueue the event in the queue
        this.queue.push(payload);
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_QUEUE, {
            queueType: 'batch',
            event: JSON.stringify(payload),
        }));
        // If the queue length is equal to or exceeds the events per request, flush the queue
        if (this.queue.length >= this.eventsPerRequest) {
            this.flush();
        }
    };
    /**
     * Flushes the queue
     * @param manual - Whether the flush is manual or not
     */
    BatchEventsQueue.prototype.flush = function (manual) {
        var _this = this;
        if (manual === void 0) { manual = false; }
        // If the queue is not empty, flush the queue
        if (this.queue.length) {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EVENT_BATCH_BEFORE_FLUSHING, {
                manually: manual ? 'manually' : '',
                length: this.queue.length,
                accountId: this.accountId,
                timer: manual ? 'Timer will be cleared and registered again' : '',
            }));
            var tempQueue_1 = this.queue;
            this.queue = [];
            return this.dispatcher(tempQueue_1, this.flushCallback)
                .then(function (result) {
                var _a;
                if (result.status === 'success') {
                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_After_FLUSHING, {
                        manually: manual ? 'manually' : '',
                        length: tempQueue_1.length,
                    }));
                    return result;
                }
                else {
                    (_a = _this.queue).push.apply(_a, tempQueue_1);
                    return result;
                }
            })
                .catch(function () {
                var _a;
                (_a = _this.queue).push.apply(_a, tempQueue_1);
                return { status: 'error', events: tempQueue_1 };
            });
        }
        else {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.BATCH_QUEUE_EMPTY));
            return new Promise(function (resolve) {
                resolve({ status: 'success', events: [] });
            });
        }
    };
    /**
     * Creates a new batch timer
     */
    BatchEventsQueue.prototype.createNewBatchTimer = function () {
        var _this = this;
        this.timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.flush()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, this.requestTimeInterval * 1000);
    };
    /**
     * Clears the request timer
     */
    BatchEventsQueue.prototype.clearRequestTimer = function () {
        clearTimeout(this.timer);
        this.timer = null;
    };
    /**
     * Flushes the queue and clears the timer
     */
    BatchEventsQueue.prototype.flushAndClearTimer = function () {
        var flushResult = this.flush(true);
        return flushResult;
    };
    return BatchEventsQueue;
}());
exports.BatchEventsQueue = BatchEventsQueue;
exports.default = BatchEventsQueue;
//# sourceMappingURL=BatchEventsQueue.js.map