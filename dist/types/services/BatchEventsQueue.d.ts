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
export interface BatchConfig {
  requestTimeInterval?: number;
  eventsPerRequest?: number;
  flushCallback?: () => void;
  dispatcher?: (queue: Record<string, any>[], flushCallback: () => void) => Promise<Record<string, any>>;
}
export declare class BatchEventsQueue {
  private static instance;
  private queue;
  private timer;
  private requestTimeInterval;
  private eventsPerRequest;
  private flushCallback;
  private accountId;
  private dispatcher;
  /**
   * Constructor for the BatchEventsQueue
   * @param config - The configuration for the batch events queue
   */
  constructor(config?: BatchConfig);
  /**
   * Gets the instance of the BatchEventsQueue
   * @returns The instance of the BatchEventsQueue
   */
  static get Instance(): BatchEventsQueue;
  /**
   * Enqueues an event
   * @param payload - The event to enqueue
   */
  enqueue(payload: Record<string, any>): void;
  /**
   * Flushes the queue
   * @param manual - Whether the flush is manual or not
   */
  flush(manual?: boolean): Promise<Record<string, any>>;
  /**
   * Creates a new batch timer
   */
  private createNewBatchTimer;
  /**
   * Clears the request timer
   */
  private clearRequestTimer;
  /**
   * Flushes the queue and clears the timer
   */
  flushAndClearTimer(): Promise<Record<string, any>>;
}
export default BatchEventsQueue;
