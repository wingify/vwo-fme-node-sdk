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

import { VWOBuilder } from '../../lib/VWOBuilder';
import { SettingsService } from '../../lib/services/SettingsService';

// Mock dependencies
jest.mock('../../lib/packages/logger', () => ({
  LogManager: {
    Instance: {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  },
}));

jest.mock('../../lib/services/SettingsService');
jest.mock('../../lib/packages/network-layer');
jest.mock('../../lib/packages/segmentation-evaluator');
jest.mock('../../lib/packages/storage');

describe('VWOBuilder - Polling Memory Leak Fixes', () => {
  let builder: VWOBuilder;
  const mockOptions = {
    sdkKey: 'test-sdk-key',
    accountId: 123456,
    pollInterval: 1000, // 1 second for testing
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock SettingsService
    (SettingsService as jest.MockedClass<typeof SettingsService>).prototype.fetchSettings = jest
      .fn()
      .mockResolvedValue({
        version: 1,
        accountId: 123456,
      });
  });

  afterEach(() => {
    if (builder) {
      builder.stopPolling?.();
    }
    jest.useRealTimers();
  });

  describe('stopPolling() Method', () => {
    test('should stop polling when stopPolling is called', async () => {
      builder = new VWOBuilder(mockOptions);

      // Start polling
      builder.checkAndPoll();

      // Verify polling started
      expect(jest.getTimerCount()).toBeGreaterThan(0);

      // Stop polling
      builder.stopPolling();

      // Verify timers cleared
      expect(jest.getTimerCount()).toBe(0);
    });

    test('should clear pending timeout when stopPolling is called', () => {
      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      builder.stopPolling();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    test('should be idempotent - calling stopPolling multiple times should not error', () => {
      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();

      // Call stopPolling multiple times
      expect(() => {
        builder.stopPolling();
        builder.stopPolling();
        builder.stopPolling();
      }).not.toThrow();
    });

    test('should not start new poll after stopPolling', async () => {
      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();
      builder.stopPolling();

      // Verify no timers are pending
      expect(jest.getTimerCount()).toBe(0);

      // Fast forward time
      jest.advanceTimersByTime(10000);

      // Should still have no timers
      expect(jest.getTimerCount()).toBe(0);
    });
  });

  describe('checkAndPoll() - Infinite Recursion Fix', () => {
    test('should not create infinite polling when checkAndPoll is called multiple times', () => {
      builder = new VWOBuilder(mockOptions);

      // Call checkAndPoll multiple times
      builder.checkAndPoll();
      const timerCount1 = jest.getTimerCount();

      builder.checkAndPoll();
      const timerCount2 = jest.getTimerCount();

      builder.checkAndPoll();
      const timerCount3 = jest.getTimerCount();

      // Should only have one active poll (timer count shouldn't increase)
      expect(timerCount1).toBe(timerCount2);
      expect(timerCount2).toBe(timerCount3);
    });

    test('should prevent polling recursion with isPollingActive flag', () => {
      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();

      // Access private property for testing
      const isActive = (builder as any).isPollingActive;
      expect(isActive).toBe(true);

      const timerCountBefore = jest.getTimerCount();

      // Try to start again - should be prevented
      builder.checkAndPoll();

      const timerCountAfter = jest.getTimerCount();

      // Should not have created additional timers
      expect(timerCountAfter).toBe(timerCountBefore);
    });

    test('should schedule next poll only if polling is still active', async () => {
      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();

      // Let first poll execute
      await jest.advanceTimersByTimeAsync(1100);

      // Stop polling before next scheduled poll
      builder.stopPolling();

      // Should have no pending timers after stopping
      expect(jest.getTimerCount()).toBe(0);

      // Fast forward past next poll interval
      jest.advanceTimersByTime(2000);

      // Should still have no timers (no new polls scheduled)
      expect(jest.getTimerCount()).toBe(0);
    });

    test('should not accumulate timeouts over time', async () => {
      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();

      // Run several poll cycles
      for (let i = 0; i < 5; i++) {
        await jest.advanceTimersByTimeAsync(1100);
      }

      // Stop polling
      builder.stopPolling();

      // Should have cleared all timeouts
      expect(jest.getTimerCount()).toBe(0);
    });
  });

  describe('Memory Leak Prevention', () => {
    test('should not leak memory with long-running polls', async () => {
      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();

      // Simulate long-running process
      for (let i = 0; i < 100; i++) {
        jest.advanceTimersByTime(1100);
      }

      // Check that we don't have 100+ timers accumulated
      const timerCount = jest.getTimerCount();
      expect(timerCount).toBeLessThanOrEqual(1); // Should only have at most 1 pending timer

      builder.stopPolling();
    });

    test('should handle errors in poll without breaking cleanup', async () => {
      const errorSettings = jest.fn().mockRejectedValue(new Error('Settings fetch failed'));
      (SettingsService as jest.MockedClass<typeof SettingsService>).prototype.fetchSettings = errorSettings;

      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();

      // Fast forward through an error
      await jest.advanceTimersByTimeAsync(1100);

      // stopPolling should still work
      expect(() => builder.stopPolling()).not.toThrow();

      // Should have no timers
      expect(jest.getTimerCount()).toBe(0);
    });

    test('should allow restarting polling after stop', () => {
      builder = new VWOBuilder(mockOptions);

      builder.checkAndPoll();
      builder.stopPolling();

      // Should have no timers after stop
      expect(jest.getTimerCount()).toBe(0);

      // Clear the flag to allow restart (simulating fresh start)
      (builder as any).isPollingActive = false;

      // Restart polling
      builder.checkAndPoll();

      // Should have created a new timer
      expect(jest.getTimerCount()).toBeGreaterThan(0);

      builder.stopPolling();
    });
  });

  describe('Integration with VWOClient destroy', () => {
    test('should properly stop polling when builder reference is available', () => {
      builder = new VWOBuilder(mockOptions);

      // Mock VWOClient with setVWOBuilder
      const mockClient = {
        setVWOBuilder: jest.fn(),
        vwoBuilder: null as any,
      };

      // Simulate setting builder reference
      mockClient.setVWOBuilder(builder);
      mockClient.vwoBuilder = builder;

      // Start polling
      builder.checkAndPoll();

      // Simulate cleanup from client
      if (mockClient.vwoBuilder && typeof mockClient.vwoBuilder.stopPolling === 'function') {
        mockClient.vwoBuilder.stopPolling();
      }

      // Verify polling stopped
      const timerCount = jest.getTimerCount();
      expect(timerCount).toBe(0);
    });
  });
});
