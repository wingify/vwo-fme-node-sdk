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

import { VWOClient } from '../../lib/VWOClient';
import { BatchEventsQueue } from '../../lib/services/BatchEventsQueue';

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
jest.mock('../../lib/services/BatchEventsQueue');
jest.mock('../../lib/utils/UrlUtil', () => ({
  UrlUtil: {
    init: jest.fn(),
  },
}));
jest.mock('../../lib/utils/FunctionUtil', () => ({
  setShouldWaitForTrackingCalls: jest.fn(),
}));

// Mock SettingsUtil to set settings properly
jest.mock('../../lib/utils/SettingsUtil', () => ({
  setSettingsAndAddCampaignsToRules: jest.fn((settings, vwoClientInstance) => {
    vwoClientInstance.settings = {
      getCollectionPrefix: () => 'test',
      getCampaigns: () => [],
      getFeatures: () => [],
    };
    vwoClientInstance.originalSettings = settings;
    vwoClientInstance.isSettingsValid = true;
  }),
}));

describe('VWOClient - destroy() Method', () => {
  let client: VWOClient;
  const mockSettings = {
    version: 1,
    accountId: 123456,
    campaigns: [],
    features: [],
    collectionPrefix: 'test',
    getCollectionPrefix: () => 'test',
  };

  const mockOptions = {
    sdkKey: 'test-sdk-key',
    accountId: 123456,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (client) {
      await client.destroy().catch(() => {});
    }
  });

  describe('Basic destroy functionality', () => {
    test('should have destroy method defined', () => {
      client = new VWOClient(mockSettings, mockOptions);

      expect(client.destroy).toBeDefined();
      expect(typeof client.destroy).toBe('function');
    });

    test('should be async and return Promise<void>', async () => {
      client = new VWOClient(mockSettings, mockOptions);

      const result = client.destroy();

      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toBeUndefined();
    });

    test('should clear settings on destroy', async () => {
      client = new VWOClient(mockSettings, mockOptions);

      expect(client.settings).toBeDefined();
      expect(client.originalSettings).toBeDefined();
      expect(client.isSettingsValid).toBeDefined();

      await client.destroy();

      expect(client.settings).toBeNull();
      expect(client.originalSettings).toEqual({});
      expect(client.isSettingsValid).toBe(false);
    });
  });

  describe('BatchEventsQueue integration', () => {
    test('should call BatchEventsQueue.Instance.destroy if available', async () => {
      const mockBatchQueueDestroy = jest.fn().mockResolvedValue(undefined);

      // Mock BatchEventsQueue.Instance
      Object.defineProperty(BatchEventsQueue, 'Instance', {
        get: jest.fn(() => ({
          destroy: mockBatchQueueDestroy,
        })),
        configurable: true,
      });

      client = new VWOClient(mockSettings, mockOptions);

      await client.destroy();

      expect(mockBatchQueueDestroy).toHaveBeenCalled();
    });

    test('should handle missing BatchEventsQueue.Instance gracefully', async () => {
      Object.defineProperty(BatchEventsQueue, 'Instance', {
        get: jest.fn(() => null),
        configurable: true,
      });

      client = new VWOClient(mockSettings, mockOptions);

      await expect(client.destroy()).resolves.not.toThrow();
    });

    test('should handle BatchEventsQueue.destroy errors gracefully', async () => {
      const mockBatchQueueDestroy = jest.fn().mockRejectedValue(new Error('Flush failed'));

      Object.defineProperty(BatchEventsQueue, 'Instance', {
        get: jest.fn(() => ({
          destroy: mockBatchQueueDestroy,
        })),
        configurable: true,
      });

      client = new VWOClient(mockSettings, mockOptions);

      // Should not throw even if BatchEventsQueue.destroy fails
      await expect(client.destroy()).resolves.not.toThrow();

      expect(mockBatchQueueDestroy).toHaveBeenCalled();
    });
  });

  describe('VWOBuilder integration', () => {
    test('should call stopPolling if vwoBuilder reference is set', async () => {
      const mockStopPolling = jest.fn();
      const mockBuilder = {
        stopPolling: mockStopPolling,
      };

      client = new VWOClient(mockSettings, mockOptions);
      client.setVWOBuilder(mockBuilder);

      await client.destroy();

      expect(mockStopPolling).toHaveBeenCalled();
    });

    test('should handle missing vwoBuilder reference gracefully', async () => {
      client = new VWOClient(mockSettings, mockOptions);

      // Don't set vwoBuilder
      await expect(client.destroy()).resolves.not.toThrow();
    });

    test('should handle vwoBuilder without stopPolling method', async () => {
      const mockBuilder = {
        // No stopPolling method
      };

      client = new VWOClient(mockSettings, mockOptions);
      client.setVWOBuilder(mockBuilder as any);

      await expect(client.destroy()).resolves.not.toThrow();
    });

    test('should handle stopPolling errors gracefully', async () => {
      const mockStopPolling = jest.fn(() => {
        throw new Error('Stop polling failed');
      });

      const mockBuilder = {
        stopPolling: mockStopPolling,
      };

      client = new VWOClient(mockSettings, mockOptions);
      client.setVWOBuilder(mockBuilder);

      // Should not throw even if stopPolling fails
      await expect(client.destroy()).resolves.not.toThrow();

      expect(mockStopPolling).toHaveBeenCalled();
    });

    test('should clear vwoBuilder reference on destroy', async () => {
      const mockBuilder = {
        stopPolling: jest.fn(),
      };

      client = new VWOClient(mockSettings, mockOptions);
      client.setVWOBuilder(mockBuilder);

      await client.destroy();

      // VWOBuilder reference should be cleared
      expect((client as any).vwoBuilder).toBeNull();
    });
  });

  describe('setVWOBuilder() method', () => {
    test('should have setVWOBuilder method', () => {
      client = new VWOClient(mockSettings, mockOptions);

      expect(client.setVWOBuilder).toBeDefined();
      expect(typeof client.setVWOBuilder).toBe('function');
    });

    test('should store builder reference', () => {
      const mockBuilder = { stopPolling: jest.fn() };

      client = new VWOClient(mockSettings, mockOptions);
      client.setVWOBuilder(mockBuilder);

      expect((client as any).vwoBuilder).toBe(mockBuilder);
    });
  });

  describe('Complete cleanup flow', () => {
    test('should perform complete cleanup in correct order', async () => {
      const callOrder: string[] = [];

      const mockStopPolling = jest.fn(() => callOrder.push('stopPolling'));
      const mockBatchQueueDestroy = jest.fn(() => {
        callOrder.push('batchQueueDestroy');
        return Promise.resolve();
      });

      const mockBuilder = {
        stopPolling: mockStopPolling,
      };

      Object.defineProperty(BatchEventsQueue, 'Instance', {
        get: jest.fn(() => ({
          destroy: mockBatchQueueDestroy,
        })),
        configurable: true,
      });

      client = new VWOClient(mockSettings, mockOptions);
      client.setVWOBuilder(mockBuilder);

      await client.destroy();

      // Verify cleanup order: stopPolling -> batchQueueDestroy -> clear settings
      expect(callOrder).toEqual(['stopPolling', 'batchQueueDestroy']);
      expect(client.settings).toBeNull();
      expect(client.originalSettings).toEqual({});
      expect((client as any).vwoBuilder).toBeNull();
    });

    test('should be idempotent - calling destroy multiple times should be safe', async () => {
      const mockBatchQueueDestroy = jest.fn().mockResolvedValue(undefined);

      Object.defineProperty(BatchEventsQueue, 'Instance', {
        get: jest.fn(() => ({
          destroy: mockBatchQueueDestroy,
        })),
        configurable: true,
      });

      client = new VWOClient(mockSettings, mockOptions);

      await client.destroy();
      const firstCallCount = mockBatchQueueDestroy.mock.calls.length;

      // Call destroy again
      await client.destroy();
      const secondCallCount = mockBatchQueueDestroy.mock.calls.length;

      // Should not call destroy again if already destroyed
      expect(secondCallCount).toBe(firstCallCount);
    });
  });

  describe('Memory leak prevention', () => {
    test('should not leave dangling references after destroy', async () => {
      const mockBuilder = { stopPolling: jest.fn() };
      const mockBatchQueueDestroy = jest.fn().mockResolvedValue(undefined);

      Object.defineProperty(BatchEventsQueue, 'Instance', {
        get: jest.fn(() => ({
          destroy: mockBatchQueueDestroy,
        })),
        configurable: true,
      });

      client = new VWOClient(mockSettings, mockOptions);
      client.setVWOBuilder(mockBuilder);

      await client.destroy();

      // Verify all references are cleared
      expect(client.settings).toBeNull();
      expect(client.originalSettings).toEqual({});
      expect(client.isSettingsValid).toBe(false);
      expect((client as any).vwoBuilder).toBeNull();
    });
  });
});
