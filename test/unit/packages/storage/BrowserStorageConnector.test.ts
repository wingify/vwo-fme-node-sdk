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
import { BrowserStorageConnector } from '../../../../lib/packages/storage/connectors/BrowserStorageConnector';
import { Constants } from '../../../../lib/constants';
import { LogManager } from '../../../../lib/packages/logger';

// Unit tests for browser storage consent wipe (removeStoredDecisionData).
describe('BrowserStorageConnector.removeStoredDecisionData', () => {
  let memoryStorage: Record<string, string>;
  let browserStorageConnector: BrowserStorageConnector;
  const storageKey = 'test_storage_key';

  beforeEach(() => {
    memoryStorage = {};
    const storageProvider = {
      getItem: (key: string) => memoryStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        memoryStorage[key] = value;
      },
    } as Storage;

    const logManager = {
      debug: jest.fn(),
      info: jest.fn(),
      errorLog: jest.fn(),
    } as unknown as LogManager;

    browserStorageConnector = new BrowserStorageConnector(
      { provider: storageProvider, key: storageKey },
      storageKey,
      logManager,
    );
  });

  /**
   * Writes a JSON blob into the mock Storage provider under the connector storage key.
   *
   * @param entries - Parsed object that represents the single localStorage document.
   */
  function seedStoredData(entries: Record<string, any>) {
    memoryStorage[storageKey] = JSON.stringify(entries);
  }

  // Verifies featureKey-scoped delete removes only that feature row for the user.
  it('removes one feature for a user', async () => {
    seedStoredData({
      feature1_user1: { featureKey: 'feature1', userId: 'user1' },
      feature2_user1: { featureKey: 'feature2', userId: 'user1' },
    });
    await browserStorageConnector.removeStoredDecisionData('feature1', 'user1');
    const remaining = JSON.parse(memoryStorage[storageKey]);
    expect(remaining.feature1_user1).toBeUndefined();
    expect(remaining.feature2_user1).toBeDefined();
  });

  // Verifies null featureKey wipes all decision rows for the user but keeps settings and other users.
  it('removes all features for a user when featureKey is null', async () => {
    seedStoredData({
      feature1_user1: { featureKey: 'feature1', userId: 'user1' },
      feature2_user2: { featureKey: 'feature2', userId: 'user2' },
      [Constants.DEFAULT_SETTINGS_STORAGE_KEY]: { settings: {}, timestamp: 1 },
    });
    await browserStorageConnector.removeStoredDecisionData(null, 'user1');
    const remaining = JSON.parse(memoryStorage[storageKey]);
    expect(remaining.feature1_user1).toBeUndefined();
    expect(remaining.feature2_user2).toBeDefined();
    expect(remaining[Constants.DEFAULT_SETTINGS_STORAGE_KEY]).toBeDefined();
  });

  // Verifies wipe matches stored userId field exactly so id "1" does not delete "user_1".
  it('does not remove user_1 when removing user id 1', async () => {
    seedStoredData({
      feature1_1: { featureKey: 'feature1', userId: '1' },
      feature1_user_1: { featureKey: 'feature1', userId: 'user_1' },
    });
    await browserStorageConnector.removeStoredDecisionData(null, '1');
    const remaining = JSON.parse(memoryStorage[storageKey]);
    expect(remaining.feature1_1).toBeUndefined();
    expect(remaining.feature1_user_1).toBeDefined();
  });
});
