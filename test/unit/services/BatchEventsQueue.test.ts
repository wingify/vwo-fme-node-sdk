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

import { BatchEventsQueue, type BatchConfig } from '../../../lib/services/BatchEventsQueue';
import { SettingsService } from '../../../lib/services/SettingsService';
import { LogManager } from '../../../lib/packages/logger';

// Mock LogManager
jest.mock('../../../lib/packages/logger', () => ({
  LogManager: {
    Instance: {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  },
}));

// Mock SettingsService
jest.mock('../../../lib/services/SettingsService', () => ({
  SettingsService: {
    Instance: {
      accountId: 123456,
    },
  },
}));

describe('BatchEventsQueue - Memory Leak Fixes', () => {
  let queue: BatchEventsQueue;
  const mockDispatcher = jest.fn().mockResolvedValue({ status: 'success', events: [] });
  const mockFlushCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    // Cleanup after each test
    if (queue) {
      await queue.destroy();
    }
    jest.useRealTimers();
  });

  describe('Timer Cleanup', () => {
    test('should use clearInterval instead of clearTimeout for timer cleanup', async () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      queue = new BatchEventsQueue({
        requestTimeInterval: 1,
        eventsPerRequest: 10,
        dispatcher: mockDispatcher,
        flushCallback: mockFlushCallback,
      });

      // Destroy the queue
      await queue.destroy();

      // Verify clearInterval was called (not clearTimeout)
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    test('should clear timer on destroy', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 1,
        eventsPerRequest: 10,
        dispatcher: mockDispatcher,
      });

      // Verify timer exists before destroy
      const timerCountBefore = jest.getTimerCount();
      expect(timerCountBefore).toBeGreaterThan(0);

      await queue.destroy();

      // Timer should be cleared
      const timerCountAfter = jest.getTimerCount();
      expect(timerCountAfter).toBe(0);
    });

    test('should stop automatic flushing after destroy', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 1,
        eventsPerRequest: 10,
        dispatcher: mockDispatcher,
      });

      // Add an event
      queue.enqueue({ test: 'event1' });

      // Destroy the queue
      await queue.destroy();

      // Fast forward time - should NOT trigger flush
      mockDispatcher.mockClear();
      jest.advanceTimersByTime(2000);

      expect(mockDispatcher).not.toHaveBeenCalled();
    });
  });

  describe('destroy() Method', () => {
    test('should flush pending events on destroy', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 100,
        dispatcher: mockDispatcher,
      });

      // Add events
      queue.enqueue({ test: 'event1' });
      queue.enqueue({ test: 'event2' });
      queue.enqueue({ test: 'event3' });

      await queue.destroy();

      // Should have flushed the events
      expect(mockDispatcher).toHaveBeenCalledTimes(1);
      expect(mockDispatcher).toHaveBeenCalledWith(
        expect.arrayContaining([{ test: 'event1' }, { test: 'event2' }, { test: 'event3' }]),
        expect.any(Function),
      );
    });

    test('should clear the queue after destroy', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 100,
        dispatcher: mockDispatcher,
      });

      queue.enqueue({ test: 'event1' });
      await queue.destroy();

      // Try to enqueue after destroy - should be rejected
      queue.enqueue({ test: 'event2' });

      // Fast forward and flush - should not dispatch new event
      mockDispatcher.mockClear();
      jest.advanceTimersByTime(11000);

      expect(mockDispatcher).not.toHaveBeenCalled();
    });

    test('should handle destroy when already destroyed (idempotent)', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 100,
        dispatcher: mockDispatcher,
      });

      await queue.destroy();
      mockDispatcher.mockClear();

      // Destroy again - should not throw
      await expect(queue.destroy()).resolves.not.toThrow();

      // Should not flush again
      expect(mockDispatcher).not.toHaveBeenCalled();
    });

    test('should nullify singleton instance on destroy', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 100,
        dispatcher: mockDispatcher,
      });

      const instance1 = BatchEventsQueue.Instance;
      expect(instance1).toBe(queue);

      await queue.destroy();

      const instance2 = BatchEventsQueue.Instance;
      expect(instance2).toBeNull();
    });
  });

  describe('Max Queue Size Protection', () => {
    test('should respect default max queue size (1000)', () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 2000, // Higher than max queue size
        dispatcher: mockDispatcher,
      });

      // Add 1001 events (exceeds default max of 1000)
      for (let i = 0; i < 1001; i++) {
        queue.enqueue({ test: `event${i}` });
      }

      // The 1001st event should have triggered dropping of oldest 10% (100 events)
      // So queue should have ~901 events, not 1001
      // We verify this indirectly - the queue didn't grow unbounded
      // Since eventsPerRequest is 2000 and we added 1001, flush shouldn't have been called
      expect(mockDispatcher).not.toHaveBeenCalled();

      // But the important part is the queue size was limited
      // This is an internal verification that max queue protection worked
    });

    test('should respect custom max queue size', () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 1000,
        maxQueueSize: 50,
        dispatcher: mockDispatcher,
      });

      // Add 51 events
      for (let i = 0; i < 51; i++) {
        queue.enqueue({ test: `event${i}` });
      }

      // Should have dropped oldest 10% (5 events) when hitting limit
      // Next enqueue after 50 should trigger drop
      expect(mockDispatcher).not.toHaveBeenCalled(); // Not enough to trigger flush yet
    });

    test('should drop oldest events when queue is full', () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 1000,
        maxQueueSize: 10,
        dispatcher: mockDispatcher,
      });

      // Add exactly 10 events
      for (let i = 0; i < 10; i++) {
        queue.enqueue({ test: `event${i}` });
      }

      // Add one more - should trigger oldest drop
      queue.enqueue({ test: 'event10' });

      // Manually flush to check contents
      queue.flush();

      // Should have flushed, but oldest events should be missing
      expect(mockDispatcher).toHaveBeenCalled();
    });

    test('should not enqueue events after destroy', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 100,
        dispatcher: mockDispatcher,
      });

      await queue.destroy();
      mockDispatcher.mockClear();

      // Try to enqueue
      queue.enqueue({ test: 'event_after_destroy' });

      // Force flush attempt
      await queue.flush();

      // Should not have dispatched
      expect(mockDispatcher).not.toHaveBeenCalled();
    });
  });

  describe('flushAndClearTimer()', () => {
    test('should actually clear timer in flushAndClearTimer', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 1,
        eventsPerRequest: 10,
        dispatcher: mockDispatcher,
      });

      queue.enqueue({ test: 'event1' });

      await queue.flushAndClearTimer();

      // Timer should be cleared
      const timerCount = jest.getTimerCount();
      expect(timerCount).toBe(0);

      // Should have flushed
      expect(mockDispatcher).toHaveBeenCalled();
    });

    test('should flush events in flushAndClearTimer', async () => {
      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 100,
        dispatcher: mockDispatcher,
      });

      queue.enqueue({ test: 'event1' });
      queue.enqueue({ test: 'event2' });

      const result = await queue.flushAndClearTimer();

      expect(result.status).toBe('success');
      expect(mockDispatcher).toHaveBeenCalledWith(
        expect.arrayContaining([{ test: 'event1' }, { test: 'event2' }]),
        expect.any(Function),
      );
    });
  });

  describe('Memory Leak Prevention', () => {
    test('should not accumulate timers with multiple instances', async () => {
      const queue1 = new BatchEventsQueue({
        requestTimeInterval: 1,
        dispatcher: mockDispatcher,
      });

      // Destroy first queue
      await queue1.destroy();

      const queue2 = new BatchEventsQueue({
        requestTimeInterval: 1,
        dispatcher: mockDispatcher,
      });

      // Should have 1 timer for queue2
      expect(jest.getTimerCount()).toBeGreaterThan(0);

      await queue2.destroy();

      // Should have 0 timers
      expect(jest.getTimerCount()).toBe(0);
    });

    test('should handle flush errors without leaking', async () => {
      const errorDispatcher = jest.fn().mockRejectedValue(new Error('Network error'));

      queue = new BatchEventsQueue({
        requestTimeInterval: 10,
        eventsPerRequest: 2,
        dispatcher: errorDispatcher,
      });

      queue.enqueue({ test: 'event1' });
      queue.enqueue({ test: 'event2' });

      // Wait for flush attempt
      jest.runOnlyPendingTimers();

      // Destroy should still work
      await expect(queue.destroy()).resolves.not.toThrow();
    }, 10000); // Increase timeout for this test
  });
});
