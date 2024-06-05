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
import { init } from '../../lib';
import { VWOBuilder } from '../../lib/VWOBuilder';
import { BASIC_ROLLOUT_SETTINGS } from '../data/Settings';

import { SetAttributeApi } from '../../lib/api/SetAttribute';
import { getEventsBaseProperties, getAttributePayloadData, sendPostApiRequest } from '../../lib/utils/NetworkUtil';

jest.mock('../../lib/utils/NetworkUtil', () => ({
  getEventsBaseProperties: jest.fn(),
  getAttributePayloadData: jest.fn(),
  sendPostApiRequest: jest.fn(),
}));

describe('VWOClient setAttribute method', () => {
  let options;

  beforeEach(() => {
    const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
    jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_SETTINGS as any);

    options = {
      sdkKey: 'sdk-key',
      accountId: 'account-id',
      vwoBuilder, // pass only for E2E tests
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle errors and log them if attribute key is not passed or not a string', async () => {
    const vwoClient = await init(options);
    const attributeValue = 'testValue';
    const context = { id: '123' };

    console.error = jest.fn(); // Mock console.error
    vwoClient.setAttribute(undefined, attributeValue, context);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('attributeKey passed to API:setAttribute is not of valid type'),
    );
  });

  it('should handle errors and log them if attribute value is not passed or not a string', async () => {
    const vwoClient = await init(options);
    const attributeKey = 'testKey';
    const context = { id: '123' };

    console.error = jest.fn(); // Mock console.error
    vwoClient.setAttribute(attributeKey, undefined, context);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('attributeValue passed to API:setAttribute is not of valid type'),
    );
  });

  it('should handle errors and log them if context is not provided', async () => {
    const vwoClient = await init(options);
    const attributeKey = 'testKey';
    const attributeValue = 'testValue';

    console.error = jest.fn(); // Mock console.error
    vwoClient.setAttribute(attributeKey, attributeValue, undefined);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(' Context should be an object and must contain a mandatory key - id, which is User ID'),
    );
  });

  it('should handle errors and log them if context does not have a valid User ID', async () => {
    const vwoClient = await init(options);
    const attributeKey = 'testKey';
    const attributeValue = 'testValue';
    const context = { id: null }; // Invalid context without userId

    console.error = jest.fn(); // Mock console.error
    vwoClient.setAttribute(attributeKey, attributeValue, context);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(` Context should be an object and must contain a mandatory key - id, which is User ID`),
    );
  });

  it('should check if call is made to VWO Server if all ok', async () => {
    const vwoClient = await init(options);

    const attributeKey = 'testKey';
    const attributeValue = 'testValue';
    const context = { id: '123' };

    await vwoClient.setAttribute(attributeKey, attributeValue, context);

    // Check if setAttribute was called with the correct parameters
    expect(getEventsBaseProperties).toHaveBeenCalled();
    expect(getAttributePayloadData).toHaveBeenCalled();
    expect(sendPostApiRequest).toHaveBeenCalled();
  });

  it('should set an attribute for a user in the context provided', async () => {
    const vwoClient = await init(options);

    const attributeKey = 'testKey';
    const attributeValue = 'testValue';
    const context = { id: '123' };

    jest.spyOn(SetAttributeApi.prototype, 'setAttribute').mockResolvedValue(true);
    vwoClient.setAttribute(attributeKey, attributeValue, context);

    // Check if setAttribute was called with the correct parameters
    expect(SetAttributeApi.prototype.setAttribute).toHaveBeenCalledWith(
      vwoClient.settings,
      attributeKey,
      attributeValue,
      expect.any(Object),
    );
  });
});
