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
import { SettingsService } from '../../../lib/services/SettingsService';
import { SettingsSchema } from '../../../lib/models/schemas/SettingsSchemaValidation';
import { LogManager } from '../../../lib/packages/logger/core/LogManager';

import {
  SETTINGS_WITH_NO_FEATURE_AND_CAMPAIGN,
  SETTINGS_WITH_WRONG_TYPE_FOR_VALUES,
  SETTINGS_WITH_EXTRA_KEYS_AT_ROOT_LEVEL,
  SETTINGS_WITH_EXTRA_KEYS_INSIDE_OBJECTS,
} from '../../data/Settings';

// Mock LogManager
jest.mock('../../../lib/packages/logger', () => ({
  LogManager: {
    Instance: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      trace: jest.fn(),
    },
  },
}));

fdescribe('SettingsSchemaValidation', () => {
  let settingsSchemaValidation: SettingsSchema;
  let settingsService: SettingsService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    settingsSchemaValidation = new SettingsSchema();

    settingsService = new SettingsService(
      {
        accountId: 123,
        sdkKey: '123',
      },
      new LogManager({}),
    );
  });

  describe('Settings with wrong type for values', () => {
    it('should fail validation', () => {
      const result = settingsSchemaValidation.isSettingsValid(SETTINGS_WITH_WRONG_TYPE_FOR_VALUES);
      expect(result).toBe(false);
    });
  });

  describe('Settings with extra key at root level', () => {
    it('should not fail validation', () => {
      const result = settingsSchemaValidation.isSettingsValid(SETTINGS_WITH_EXTRA_KEYS_AT_ROOT_LEVEL);
      expect(result).toBe(true);
    });
  });

  describe('Settings with extra key inside objects', () => {
    it('should not fail validation', () => {
      const result = settingsSchemaValidation.isSettingsValid(SETTINGS_WITH_EXTRA_KEYS_INSIDE_OBJECTS);
      expect(result).toBe(true);
    });
  });

  describe('Settings with no feature and campaign', () => {
    it('should not fail validation', async () => {
      const normalizedSettings = await settingsService.normalizeSettings(SETTINGS_WITH_NO_FEATURE_AND_CAMPAIGN);
      const result = settingsSchemaValidation.isSettingsValid(normalizedSettings);
      expect(result).toBe(true);
    });
  });
});
