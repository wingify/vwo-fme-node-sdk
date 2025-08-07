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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchEventsQueue = void 0;
const constants_1 = require("../constants");
const DataTypeUtil_1 = require("../utils/DataTypeUtil");
const logger_1 = require("../packages/logger");
const LogMessageUtil_1 = require("../utils/LogMessageUtil");
const log_messages_1 = require("../enums/log-messages");
const SettingsService_1 = require("../services/SettingsService");
class BatchEventsQueue {
    /**
     * Constructor for the BatchEventsQueue
     * @param config - The configuration for the batch events queue
     */
    constructor(config = {}) {
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
        this.flushCallback = (0, DataTypeUtil_1.isFunction)(config.flushCallback) ? config.flushCallback : () => { };
        this.dispatcher = config.dispatcher;
        this.accountId = SettingsService_1.SettingsService.Instance.accountId;
        this.createNewBatchTimer();
        BatchEventsQueue.instance = this;
        return this;
    }
    /**
     * Gets the instance of the BatchEventsQueue
     * @returns The instance of the BatchEventsQueue
     */
    static get Instance() {
        return BatchEventsQueue.instance;
    }
    /**
     * Enqueues an event
     * @param payload - The event to enqueue
     */
    enqueue(payload) {
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
    }
    /**
     * Flushes the queue
     * @param manual - Whether the flush is manual or not
     */
    flush(manual = false) {
        // If the queue is not empty, flush the queue
        if (this.queue.length) {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EVENT_BATCH_BEFORE_FLUSHING, {
                manually: manual ? 'manually' : '',
                length: this.queue.length,
                accountId: this.accountId,
                timer: manual ? 'Timer will be cleared and registered again' : '',
            }));
            const tempQueue = this.queue;
            this.queue = [];
            return this.dispatcher(tempQueue, this.flushCallback)
                .then((result) => {
                if (result.status === 'success') {
                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.EVENT_BATCH_After_FLUSHING, {
                        manually: manual ? 'manually' : '',
                        length: tempQueue.length,
                    }));
                    return result;
                }
                else {
                    this.queue.push(...tempQueue);
                    return result;
                }
            })
                .catch(() => {
                this.queue.push(...tempQueue);
                return { status: 'error', events: tempQueue };
            });
        }
        else {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.BATCH_QUEUE_EMPTY));
            return new Promise((resolve) => {
                resolve({ status: 'success', events: [] });
            });
        }
    }
    /**
     * Creates a new batch timer
     */
    createNewBatchTimer() {
        this.timer = setInterval(async () => {
            await this.flush();
        }, this.requestTimeInterval * 1000);
    }
    /**
     * Clears the request timer
     */
    clearRequestTimer() {
        clearTimeout(this.timer);
        this.timer = null;
    }
    /**
     * Flushes the queue and clears the timer
     */
    flushAndClearTimer() {
        const flushResult = this.flush(true);
        return flushResult;
    }
}
exports.BatchEventsQueue = BatchEventsQueue;
exports.default = BatchEventsQueue;
//# sourceMappingURL=BatchEventsQueue.js.map