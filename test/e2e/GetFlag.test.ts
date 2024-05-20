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
import {
  BASIC_ROLLOUT_SETTINGS, BASIC_ROLLOUT_TESTING_RULE_SETTINGS,
  NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS, ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS, TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS
} from '../data/settings';
import storageMap from '../data/StorageMap';

describe('VWO', () => {
  describe('getFLag without storage', () => {
    it('should return true for a flag having settings: 100% traffic allocation and no segmentation', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_SETTINGS as any);

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
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_TESTING_RULE_SETTINGS as any);

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

    it('should return true for a flag having no segmentation and only testing rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id'
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

    it('should return false for a flag that does not exists and return default values for variables', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id'
      };
      const featureFlag = await vwoClient.getFlag('feature2', userContext);

      expect(featureFlag.isEnabled()).toBe(false);
      expect(featureFlag.getVariable('int', 1)).toBe(1);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('abhishek');
      expect(featureFlag.getVariable('float', 1.1)).toBe(1.1);
      expect(featureFlag.getVariable('boolean', false)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({});

      return featureFlag;
    })

    it('should return false for a flag that does not pass pre segment of any rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id'
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(false);
      expect(featureFlag.getVariable('int', 1)).toBe(1);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('abhishek');
      expect(featureFlag.getVariable('float', 1.1)).toBe(1.1);
      expect(featureFlag.getVariable('boolean', false)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({});
      return featureFlag;
    })

    it('should return true for a flag that pass pre segment for rollout1 and testingRule1', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
        customVariables: {
          price : 100
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int', 1)).toBe(11);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('testing1_variation');
      expect(featureFlag.getVariable('float', 1.1)).toBe(20.02);
      expect(featureFlag.getVariable('boolean', false)).toBe(true);
      expect(featureFlag.getVariable('json', {})).toEqual({"campaign": "testing1_variation"});
      return featureFlag;
    })

    it('should return true for a flag that pass pre segment for rollout2 and testingRule2', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
        customVariables: {
          price : 200
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int', 1)).toBe(11);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('testing2_variation');
      expect(featureFlag.getVariable('float', 1.1)).toBe(20.02);
      expect(featureFlag.getVariable('boolean', false)).toBe(true);
      expect(featureFlag.getVariable('json', {})).toEqual({"campaign": "testing2_variation"});
      return featureFlag;
    })

    it('should return true for a flag that pass control whitelisting for testingRule1', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
        customVariables: {
          price : 100
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int', 1)).toBe(10);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('testing1');
      expect(featureFlag.getVariable('float', 1.1)).toBe(20.01);
      expect(featureFlag.getVariable('boolean', true)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({"campaign": "testing1"});
      return featureFlag;
    })

    it('should return true for a flag that fails whitelisting for testingRule1 and only rollout rule pass', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_1',
        customVariables: {
          price : 100
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int', 1)).toBe(10);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('rollout1');
      expect(featureFlag.getVariable('float', 1.1)).toBe(20.01);
      expect(featureFlag.getVariable('boolean', true)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({"campaign": "rollout1"});
      return featureFlag;
    })
  });

  describe('getFLag with storage', () => {
    it('should return true for a flag having settings: 100% traffic allocation and no segmentation', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap});
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const context = { id: 'user_id' };
      const featureFlag = await vwoClient.getFlag('feature1', context);
      // get stored data
      const storageData = await storageMap.get('feature1', 'user_id');
      // check stored data
      expect(storageData.rolloutKey).toEqual('feature1_rolloutRule1');
      expect(storageData.rolloutVariationId).toEqual(1);
      const storageFeatureFlag = await vwoClient.getFlag('feature1', context);

      expect(storageFeatureFlag.isEnabled()).toBe(true);
      expect(storageFeatureFlag.getVariable('int')).toBe(10);
      expect(storageFeatureFlag.getVariable('string')).toBe('test');
      expect(storageFeatureFlag.getVariable('float')).toBe(20.01);
      expect(storageFeatureFlag.getVariable('boolean')).toBe(false);
      expect(storageFeatureFlag.getVariable('json')).toEqual({"name": "VWO"});
      return storageFeatureFlag;
    });

    it('should return true for a flag having settings: 100% traffic allocation and no segmentation and Testing Rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_1',
        customVariables: {
          price: 200
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);
      const storedData = await storageMap.get('feature1', 'user_id_1');

      expect(storedData.rolloutKey).toEqual('feature1_rolloutRule1');
      expect(storedData.rolloutVariationId).toEqual(1);
      expect(storedData.experimentKey).toEqual('feature1_testingRule1');
      expect(storedData.experimentVariationId).toEqual(2);

      const storedFeatureFlag = await vwoClient.getFlag('feature1', userContext);
      expect(storedFeatureFlag.isEnabled()).toBe(true);
      expect(storedFeatureFlag.getVariable('int')).toBe(11);
      expect(storedFeatureFlag.getVariable('string')).toBe('test_variation');
      expect(storedFeatureFlag.getVariable('float')).toBe(20.02);
      expect(storedFeatureFlag.getVariable('boolean')).toBe(true);
      expect(storedFeatureFlag.getVariable('json')).toEqual({"name": "VWO", "variation": 1});

      return storedFeatureFlag;
    });

    it('should return true for a flag having no segmentation and only testing rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef',storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_4'
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);
      const storedData = await storageMap.get('feature1', 'user_id_4');
      
      expect(storedData.experimentKey).toEqual('feature1_testingRule1');
      expect(storedData.experimentVariationId).toEqual(2);

      const storedFeatureFlag = await vwoClient.getFlag('feature1', userContext);
      expect(storedFeatureFlag.isEnabled()).toBe(true);
      expect(storedFeatureFlag.getVariable('int')).toBe(11);
      expect(storedFeatureFlag.getVariable('string')).toBe('test_variation');
      expect(storedFeatureFlag.getVariable('float')).toBe(20.02);
      expect(storedFeatureFlag.getVariable('boolean')).toBe(true);
      expect(storedFeatureFlag.getVariable('json')).toEqual({"name": "VWO", "variation": 1});

      return storedFeatureFlag;
    });

    it('should return false for a flag that does not exists and return default values for variables', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_5'
      };
      const featureFlag = await vwoClient.getFlag('feature2', userContext);
      const storedData = await storageMap.get('feature2', 'user_id_5');
      
      expect(storedData).toBeNull();
      expect(featureFlag.isEnabled()).toBe(false);
      expect(featureFlag.getVariable('int', 1)).toBe(1);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('abhishek');
      expect(featureFlag.getVariable('float', 1.1)).toBe(1.1);
      expect(featureFlag.getVariable('boolean', false)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({});

      return featureFlag;
    });

    it('should return false for a flag that does not pass pre segment of any rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_6'
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);
      const storedData = await storageMap.get('feature1', 'user_id_6');

      expect(storedData).toBeNull();
      expect(featureFlag.isEnabled()).toBe(false);
      expect(featureFlag.getVariable('int', 1)).toBe(1);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('abhishek');
      expect(featureFlag.getVariable('float', 1.1)).toBe(1.1);
      expect(featureFlag.getVariable('boolean', false)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({});
      return featureFlag;
    });

    it('should return true for a flag that pass pre segment for rollout1 and testingRule1', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_7',
        customVariables: {
          price : 100
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);
      const storedData = await storageMap.get('feature1', 'user_id_7');
      
      expect(storedData.rolloutKey).toEqual('feature1_rolloutRule1');
      expect(storedData.rolloutVariationId).toEqual(1);
      expect(storedData.experimentKey).toEqual('feature1_testingRule1');
      expect(storedData.experimentVariationId).toEqual(2);

      const storedFeatureFlag = await vwoClient.getFlag('feature1', userContext);
      expect(storedFeatureFlag.isEnabled()).toBe(true);
      expect(storedFeatureFlag.getVariable('int', 1)).toBe(11);
      expect(storedFeatureFlag.getVariable('string', 'abhishek')).toBe('testing1_variation');
      expect(storedFeatureFlag.getVariable('float', 1.1)).toBe(20.02);
      expect(storedFeatureFlag.getVariable('boolean', false)).toBe(true);
      expect(storedFeatureFlag.getVariable('json', {})).toEqual({"campaign": "testing1_variation"});
      return storedFeatureFlag;
    });

    it('should return true for a flag that pass pre segment for rollout2 and testingRule2', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_8',
        customVariables: {
          price : 200
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);
      const storedData = await storageMap.get('feature1', 'user_id_8');
      
      expect(storedData.rolloutKey).toEqual('feature1_rolloutRule1');
      expect(storedData.rolloutVariationId).toEqual(2);
      expect(storedData.experimentKey).toEqual('feature1_testingRule2');
      expect(storedData.experimentVariationId).toEqual(2);

      const storedFeatureFlag = await vwoClient.getFlag('feature1', userContext);
      expect(storedFeatureFlag.isEnabled()).toBe(true);
      expect(storedFeatureFlag.getVariable('int', 1)).toBe(11);
      expect(storedFeatureFlag.getVariable('string', 'abhishek')).toBe('testing2_variation');
      expect(storedFeatureFlag.getVariable('float', 1.1)).toBe(20.02);
      expect(storedFeatureFlag.getVariable('boolean', false)).toBe(true);
      expect(storedFeatureFlag.getVariable('json', {})).toEqual({"campaign": "testing2_variation"});
      return storedFeatureFlag;
    });

    it('should return true for a flag that pass control whitelisting for testingRule1', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_9',
        customVariables: {
          price : 100
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);
      const storedData = await storageMap.get('feature1', 'user_id_9');
      
      expect(storedData.rolloutKey).toEqual('feature1_rolloutRule1');
      expect(storedData.experimentVariationId).toEqual(1);
      expect(storedData.experimentVariationId).toEqual(1);
      // TODO -- add experiementKey validation

      const storedFeatureFlag = await vwoClient.getFlag('feature1', userContext);
      expect(storedFeatureFlag.isEnabled()).toBe(true);
      expect(storedFeatureFlag.getVariable('int', 1)).toBe(10);
      expect(storedFeatureFlag.getVariable('string', 'abhishek')).toBe('testing1');
      expect(storedFeatureFlag.getVariable('float', 1.1)).toBe(20.01);
      expect(storedFeatureFlag.getVariable('boolean', true)).toBe(false);
      expect(storedFeatureFlag.getVariable('json', {})).toEqual({"campaign": "testing1"});
      return storedFeatureFlag;
    });
    it('should return true for a flag that fails whitelisting for testingRule1 and only rollout rule pass', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_10',
        customVariables: {
          price : 100
        }
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);
      const storedData = await storageMap.get('feature1', 'user_id_10');

      expect(storedData.rolloutKey).toEqual('feature1_rolloutRule1');
      expect(storedData.rolloutVariationId).toEqual(1);

      const storedFeatureFlag = await vwoClient.getFlag('feature1', userContext);
      expect(storedFeatureFlag.isEnabled()).toBe(true);
      expect(storedFeatureFlag.getVariable('int', 1)).toBe(10);
      expect(storedFeatureFlag.getVariable('string', 'abhishek')).toBe('rollout1');
      expect(storedFeatureFlag.getVariable('float', 1.1)).toBe(20.01);
      expect(storedFeatureFlag.getVariable('boolean', true)).toBe(false);
      expect(storedFeatureFlag.getVariable('json', {})).toEqual({"campaign": "rollout1"});
      return storedFeatureFlag;
    })
  });

});
