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

import { Constants } from '../constants';
import { isNumber, isFunction } from '../utils/DataTypeUtil';
import { LogManager } from '../packages/logger';
import { buildMessage } from '../utils/LogMessageUtil';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages';
import { SettingsService } from '../services/SettingsService';

export interface BatchConfig {
  requestTimeInterval?: number;
  eventsPerRequest?: number;
  maxQueueSize?: number;
  flushCallback?: (error: Error | null, data: Record<string, any>) => void;
  dispatcher?: (
    queue: Record<string, any>[],
    flushCallback: (error: Error | null, data: Record<string, any>) => void,
  ) => Promise<Record<string, any>>;
}

export class BatchEventsQueue {
  private static instance: BatchEventsQueue;
  private queue: Record<string, any>[] = [];
  private timer: NodeJS.Timeout | null = null;
  private requestTimeInterval: number;
  private eventsPerRequest: number;
  private maxQueueSize: number;
  private isDestroyed: boolean = false;
  private flushCallback: (error: Error | null, data: Record<string, any>) => void;
  private accountId: number;
  private dispatcher: (
    queue: Record<string, any>[],
    flushCallback: (error: Error | null, data: Record<string, any>) => void,
  ) => Promise<Record<string, any>>;

  /**
   * Constructor for the BatchEventsQueue
   * @param config - The configuration for the batch events queue
   */
  constructor(config: BatchConfig = {}) {
    if (isNumber(config.requestTimeInterval) && config.requestTimeInterval >= 1) {
      this.requestTimeInterval = config.requestTimeInterval;
    } else {
      this.requestTimeInterval = Constants.DEFAULT_REQUEST_TIME_INTERVAL;
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
          parameter: 'requestTimeInterval',
          minLimit: 0,
          defaultValue: this.requestTimeInterval.toString(),
        }),
      );
    }

    if (
      isNumber(config.eventsPerRequest) &&
      config.eventsPerRequest > 0 &&
      config.eventsPerRequest <= Constants.MAX_EVENTS_PER_REQUEST
    ) {
      this.eventsPerRequest = config.eventsPerRequest;
    } else if (config.eventsPerRequest > Constants.MAX_EVENTS_PER_REQUEST) {
      this.eventsPerRequest = Constants.MAX_EVENTS_PER_REQUEST;
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.EVENT_BATCH_MAX_LIMIT, {
          parameter: 'eventsPerRequest',
          maxLimit: Constants.MAX_EVENTS_PER_REQUEST.toString(),
        }),
      );
    } else {
      this.eventsPerRequest = Constants.DEFAULT_EVENTS_PER_REQUEST;
      LogManager.Instance.info(
        buildMessage(InfoLogMessagesEnum.EVENT_BATCH_DEFAULTS, {
          parameter: 'eventsPerRequest',
          minLimit: 0,
          defaultValue: this.eventsPerRequest.toString(),
        }),
      );
    }

    // Set max queue size with a reasonable default
    if (isNumber(config.maxQueueSize) && config.maxQueueSize > 0) {
      this.maxQueueSize = config.maxQueueSize;
    } else {
      this.maxQueueSize = 1000; // Default max queue size to prevent unbounded growth
    }

    this.flushCallback = isFunction(config.flushCallback) ? config.flushCallback : () => {};
    this.dispatcher = config.dispatcher;
    this.accountId = SettingsService.Instance.accountId;
    this.createNewBatchTimer();
    BatchEventsQueue.instance = this;
    return this;
  }

  /**
   * Gets the instance of the BatchEventsQueue
   * @returns The instance of the BatchEventsQueue
   */
  public static get Instance(): BatchEventsQueue {
    return BatchEventsQueue.instance;
  }

  /**
   * Enqueues an event
   * @param payload - The event to enqueue
   */
  public enqueue(payload: Record<string, any>): void {
    // Don't enqueue if the instance is destroyed
    if (this.isDestroyed) {
      LogManager.Instance.warn('BatchEventsQueue is destroyed, cannot enqueue events');
      return;
    }

    // Check if queue has reached max size
    if (this.queue.length >= this.maxQueueSize) {
      LogManager.Instance.warn(
        buildMessage('Event queue has reached maximum size, dropping oldest events', {
          maxQueueSize: this.maxQueueSize,
          currentSize: this.queue.length,
        }),
      );
      // Remove oldest events to make room (FIFO)
      this.queue.splice(0, Math.floor(this.maxQueueSize * 0.1)); // Remove oldest 10%
    }

    // Enqueue the event in the queue
    this.queue.push(payload);
    LogManager.Instance.info(
      buildMessage(InfoLogMessagesEnum.EVENT_QUEUE, {
        queueType: 'batch',
        event: JSON.stringify(payload),
      }),
    );

    // If the queue length is equal to or exceeds the events per request, flush the queue
    if (this.queue.length >= this.eventsPerRequest) {
      this.flush();
    }
  }

  /**
   * Flushes the queue
   * @param manual - Whether the flush is manual or not
   */
  public flush(manual: boolean = false): Promise<Record<string, any>> {
    // If the queue is not empty, flush the queue
    if (this.queue.length) {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessagesEnum.EVENT_BATCH_BEFORE_FLUSHING, {
          manually: manual ? 'manually' : '',
          length: this.queue.length,
          accountId: this.accountId,
          timer: manual ? 'Timer will be cleared and registered again' : '',
        }),
      );
      const tempQueue = this.queue;
      this.queue = [];
      return this.dispatcher(tempQueue, this.flushCallback)
        .then((result) => {
          if (result.status === 'success') {
            LogManager.Instance.info(
              buildMessage(InfoLogMessagesEnum.EVENT_BATCH_After_FLUSHING, {
                manually: manual ? 'manually' : '',
                length: tempQueue.length,
              }),
            );
            return result;
          } else {
            this.queue.push(...tempQueue);
            return result;
          }
        })
        .catch(() => {
          this.queue.push(...tempQueue);
          return { status: 'error', events: tempQueue };
        });
    } else {
      LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.BATCH_QUEUE_EMPTY));

      return new Promise((resolve) => {
        resolve({ status: 'success', events: [] });
      });
    }
  }

  /**
   * Creates a new batch timer
   */
  private createNewBatchTimer(): void {
    this.timer = setInterval(async () => {
      await this.flush();
    }, this.requestTimeInterval * 1000);
  }

  /**
   * Clears the request timer
   */
  private clearRequestTimer(): void {
    if (this.timer) {
      clearInterval(this.timer); // FIX: Use clearInterval instead of clearTimeout
      this.timer = null;
    }
  }

  /**
   * Flushes the queue and clears the timer
   */
  public async flushAndClearTimer(): Promise<Record<string, any>> {
    this.clearRequestTimer(); // Actually clear the timer
    return await this.flush(true);
  }

  /**
   * Destroys the BatchEventsQueue instance, clearing timer and flushing remaining events
   * This method should be called when the VWO client is no longer needed
   */
  public async destroy(): Promise<void> {
    if (this.isDestroyed) {
      LogManager.Instance.warn('BatchEventsQueue already destroyed');
      return;
    }

    LogManager.Instance.info('Destroying BatchEventsQueue instance');
    this.isDestroyed = true;

    // Clear the timer first to stop new flushes
    this.clearRequestTimer();

    // Flush any remaining events
    try {
      await this.flush(true);
      LogManager.Instance.info('BatchEventsQueue destroyed successfully');
    } catch (error) {
      LogManager.Instance.error('Error flushing events during destroy: ' + error);
    }

    // Clear the queue
    this.queue = [];

    // Clear singleton instance
    if (BatchEventsQueue.instance === this) {
      BatchEventsQueue.instance = null;
    }
  }
}

export default BatchEventsQueue;
