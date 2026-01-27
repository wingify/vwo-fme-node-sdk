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
import { Constants } from '../constants/index.js';
import { isNumber, isFunction, isBoolean } from '../utils/DataTypeUtil.js';
import { buildMessage } from '../utils/LogMessageUtil.js';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import BatchEventsDispatcher from '../utils/BatchEventsDispatcher.js';
export class BatchEventsQueue {
    /**
     * Constructor for the BatchEventsQueue
     * @param config - The configuration for the batch events queue
     */
    constructor(config = {}, logManager) {
        this.queue = [];
        this.timer = null;
        this.isEdgeEnvironment = false;
        this.logManager = logManager;
        if (isBoolean(config.isEdgeEnvironment)) {
            this.isEdgeEnvironment = config.isEdgeEnvironment;
        }
        if (isNumber(config.requestTimeInterval) && config.requestTimeInterval >= 1) {
            this.requestTimeInterval = config.requestTimeInterval;
        }
        else {
            this.requestTimeInterval = Constants.DEFAULT_REQUEST_TIME_INTERVAL;
            if (!this.isEdgeEnvironment) {
                this.logManager.info(buildMessage(InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
                    parameter: 'requestTimeInterval',
                    minLimit: 0,
                    defaultValue: this.requestTimeInterval.toString(),
                }));
            }
        }
        if (isNumber(config.eventsPerRequest) &&
            config.eventsPerRequest > 0 &&
            config.eventsPerRequest <= Constants.MAX_EVENTS_PER_REQUEST) {
            this.eventsPerRequest = config.eventsPerRequest;
        }
        else if (config.eventsPerRequest > Constants.MAX_EVENTS_PER_REQUEST) {
            this.eventsPerRequest = Constants.MAX_EVENTS_PER_REQUEST;
            this.logManager.info(buildMessage(InfoLogMessagesEnum.EVENT_BATCH_MAX_LIMIT, {
                parameter: 'eventsPerRequest',
                maxLimit: Constants.MAX_EVENTS_PER_REQUEST.toString(),
            }));
        }
        else {
            this.eventsPerRequest = Constants.DEFAULT_EVENTS_PER_REQUEST;
            this.logManager.info(buildMessage(InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
                parameter: 'eventsPerRequest',
                minLimit: 0,
                defaultValue: this.eventsPerRequest.toString(),
            }));
        }
        this.flushCallback = isFunction(config.flushCallback) ? config.flushCallback : () => { };
        this.accountId = config.accountId;
        // In edge environments, automatic batching/timer is skipped; flushing is expected to be triggered manually
        if (!this.isEdgeEnvironment) {
            this.createNewBatchTimer();
        }
        return this;
    }
    injectServiceContainer(serviceContainer) {
        this.serviceContainer = serviceContainer;
    }
    /**
     * Enqueues an event
     * @param payload - The event to enqueue
     */
    enqueue(payload) {
        // Enqueue the event in the queue
        this.queue.push(payload);
        this.logManager.info(buildMessage(InfoLogMessagesEnum.EVENT_QUEUE, {
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
            this.logManager.debug(buildMessage(DebugLogMessagesEnum.EVENT_BATCH_BEFORE_FLUSHING, {
                manually: manual ? 'manually' : '',
                length: this.queue.length,
                accountId: this.accountId,
                timer: manual ? 'Timer will be cleared and registered again' : '',
            }));
            const tempQueue = this.queue;
            this.queue = [];
            return BatchEventsDispatcher.dispatch(this.serviceContainer, {
                ev: tempQueue,
            }, this.flushCallback, Object.assign({}, {
                a: this.accountId,
                env: this.serviceContainer.getSettingsService().sdkKey,
                sn: Constants.SDK_NAME,
                sv: Constants.SDK_VERSION,
            }))
                .then((result) => {
                if (result.status === 'success') {
                    this.logManager.info(buildMessage(InfoLogMessagesEnum.EVENT_BATCH_After_FLUSHING, {
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
            this.logManager.debug(buildMessage(DebugLogMessagesEnum.BATCH_QUEUE_EMPTY));
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
export default BatchEventsQueue;
//# sourceMappingURL=BatchEventsQueue.js.map