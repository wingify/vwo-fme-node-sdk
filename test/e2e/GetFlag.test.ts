import { init } from '../../lib';
import { VWOBuilder } from '../../lib/VWOBuilder';
import { BASIC_ROLLOUT_SETTINGS, BASIC_ROLLOUT_TESTING_RULE_SETTINGS } from '../data/settings';

describe('VWO', () => {
  it('should return true for a flag having settings: 100% traffic allocation and no segmentation', async () => {
    const vwoBuilder = new VWOBuilder({ accountId: '123456', key: 'abcdef' });
    jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_SETTINGS);

    const options = {
      sdkKey: 'sdk-key',
      accountId: 'account-id',
      vwoBuilder // pass only for E2E tests
    };
    const vwoClient = await init(options);

    const context = { id: 'user_id' };
    const featureFlag = await vwoClient.getFlag('feature1', context);

    expect(featureFlag.isEnabled()).toBe(true);
    expect(featureFlag.getVariable('int')).toBe(10);
    expect(featureFlag.getVariable('string')).toBe('test');
    expect(featureFlag.getVariable('float')).toBe(20.01);
    expect(featureFlag.getVariable('boolean')).toBe(false);
    expect(featureFlag.getVariable('json')).toEqual({"name": "VWO"});

    return featureFlag;
  });

  it('should return true for a flag having settings: 100% traffic allocation and no segmentation and Testing Rule', async () => {
    const vwoBuilder = new VWOBuilder({ accountId: '123456', key: 'abcdef' });
    jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_TESTING_RULE_SETTINGS);

    const options = {
      sdkKey: 'sdk-key',
      accountId: 'account-id',
      vwoBuilder // pass only for E2E tests
    };
    const vwoClient = await init(options);

    const userContext = {
      id: 'user_id',
      customVariables: {
        price: 200
      }
    };
    const featureFlag = await vwoClient.getFlag('feature1', userContext);

    expect(featureFlag.isEnabled()).toBe(true);
    expect(featureFlag.getVariable('int')).toBe(11);
    expect(featureFlag.getVariable('string')).toBe('test_variation');
    expect(featureFlag.getVariable('float')).toBe(20.02);
    expect(featureFlag.getVariable('boolean')).toBe(true);
    expect(featureFlag.getVariable('json')).toEqual({"name": "VWO", "variation": 1});

    return featureFlag;
  })
});
