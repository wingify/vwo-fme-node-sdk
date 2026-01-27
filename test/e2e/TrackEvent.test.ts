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
import { init } from '../../lib';
import { VWOBuilder } from '../../lib/VWOBuilder';
import { BASIC_ROLLOUT_SETTINGS } from '../data/Settings';

describe('VWOClient trackEvent method', () => {
  let options;

  beforeEach(() => {
    process.env.TEST_ENV = 'true';
    const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
    jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_SETTINGS as any);

    options = {
      sdkKey: 'sdk-key',
      accountId: 'account-id',
      vwoBuilder, // pass only for E2E tests
    };
  });

  afterEach(() => {
    process.env.TEST_ENV = undefined;
    jest.clearAllMocks();
  });

  it('should track an event succeefully', async () => {
    const vwoClient = await init(options);

    // Mock input data
    const eventName = 'custom1';
    const eventProperties = { key: 'value' };
    const context = { id: '123' };

    // Call the trackEvent method
    const result = await vwoClient.trackEvent(eventName, context, eventProperties);

    // Assert that the method resolves with the correct data
    expect(result).toEqual({ [eventName]: true });
  });

  it('should not track an event which has no metric corresponding to eventName', async () => {
    const vwoClient = await init(options);

    // Mock input data
    const eventName = 'testEvent';
    const eventProperties = { key: 'value' };
    const context = { id: '123' };

    // Call the trackEvent method
    const result = await vwoClient.trackEvent(eventName, context, eventProperties);

    // Assert that the method resolves with the correct data
    expect(result).toEqual({ [eventName]: false });
  });

  it('should handle error when eventName is not a string', async () => {
    const vwoClient = await init(options);

    // Mock input data with invalid eventName
    const eventName = 123; // Invalid eventName
    const eventProperties = { key: 'value' };
    const context = { id: '123' };

    // Call the trackEvent method
    const result = await vwoClient.trackEvent(eventName, context, eventProperties);

    // Assert that the method resolves with the correct data
    expect(result).toEqual({ [eventName]: false });
  });

  it('should handle error when eventProperties is not an object', async () => {
    const vwoClient = await init(options);

    // Mock input data with invalid eventProperties
    const eventName = 'testEvent';
    const eventProperties = 'invalid'; // Invalid eventProperties
    const context = { id: '123' };

    // Call the trackEvent method
    const result = await vwoClient.trackEvent(eventName, context, eventProperties);

    // Assert that the method resolves with the correct data
    expect(result).toEqual({ [eventName]: false });
  });

  it('should handle error when context does not have a valid User ID', async () => {
    const vwoClient = await init(options);

    // Mock input data with invalid context
    const eventName = 'testEvent';
    const eventProperties = { key: 'value' };
    const context = {}; // Invalid context without userId

    // Call the trackEvent method
    const result = await vwoClient.trackEvent(eventName, context, eventProperties);

    // Assert that the method resolves with the correct data
    expect(result).toEqual({ [eventName]: false });
  });
});
