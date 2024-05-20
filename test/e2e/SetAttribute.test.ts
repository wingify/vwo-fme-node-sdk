import { init } from '../../lib';
import { VWOBuilder } from '../../lib/VWOBuilder';
import { BASIC_ROLLOUT_SETTINGS } from '../data/settings';

import { LogManager } from '../../lib/packages/logger';
import { ErrorLogMessageEnum } from '../../lib/enums/log-messages/ErrorLogMessageEnum';
import { buildMessage } from '../../lib/utils/LogMessageUtil';
import { SetAttributeApi } from '../../lib/api/SetAttribute';

describe('VWOClient setAttribute method', () => {
  let options;

  beforeEach(() => {
    const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
    jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_SETTINGS as any);

    options = {
      sdkKey: 'sdk-key',
      accountId: 'account-id',
      vwoBuilder // pass only for E2E tests
    };

  });

  afterEach(() => {
    jest.clearAllMocks();
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
      expect.any(Object)
    );
  });

  it('should handle errors and log them if attribute key is not passed or not a string', async () => {
    const vwoClient = await init(options);
    const attributeValue = 'testValue';
    const context = { id: '123' };

    console.error = jest.fn(); // Mock console.error
    vwoClient.setAttribute(undefined, attributeValue, context)
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('attributeKey passed to track API is not of valid type'))
  });

  it('should handle errors and log them if attribute value is not passed or not a string', async () => {
    const vwoClient = await init(options);
    const attributeKey = 'testKey';
    const context = { id: '123' };

    console.error = jest.fn(); // Mock console.error
    vwoClient.setAttribute(attributeKey, undefined, context);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('attributeValue passed to track API is not of valid type'))
  });

  it('should handle errors and log them if context is not provided', async () => {
    const vwoClient = await init(options);
    const attributeKey = 'testKey';
    const attributeValue = 'testValue';

    console.error = jest.fn(); // Mock console.error
    debugger
    vwoClient.setAttribute(attributeKey, attributeValue, undefined);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Context doesn\'t have a valid User ID'))
  });

  it('should handle errors and log them if context does not have a valid User ID', async () => {
    const vwoClient = await init(options);
    const attributeKey = 'testKey';
    const attributeValue = 'testValue';
    const context = { id: null }; // Invalid context without userId

    console.error = jest.fn(); // Mock console.error
    vwoClient.setAttribute(attributeKey, attributeValue, context);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Context doesn't have a valid User ID`))
  });
});
