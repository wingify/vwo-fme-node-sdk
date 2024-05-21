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
  BASIC_ROLLOUT_SETTINGS,
  BASIC_ROLLOUT_TESTING_RULE_SETTINGS,
  MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS,
  NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS,
  ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS,
  TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS,
  MEG_CAMPAIGN_ADVANCE_ALGO_SETTINGS,
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
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const context = { id: 'user_id' };
      const featureFlag = await vwoClient.getFlag('feature1', context);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int')).toBe(10);
      expect(featureFlag.getVariable('string')).toBe('test');
      expect(featureFlag.getVariable('float')).toBe(20.01);
      expect(featureFlag.getVariable('boolean')).toBe(false);
      expect(featureFlag.getVariable('json')).toEqual({ name: 'VWO' });

      return featureFlag;
    });

    it('should return true for a flag having settings: 100% traffic allocation and no segmentation and Testing Rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
        customVariables: {
          price: 200,
        },
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int')).toBe(11);
      expect(featureFlag.getVariable('string')).toBe('test_variation');
      expect(featureFlag.getVariable('float')).toBe(20.02);
      expect(featureFlag.getVariable('boolean')).toBe(true);
      expect(featureFlag.getVariable('json')).toEqual({ name: 'VWO', variation: 1 });

      return featureFlag;
    });

    it('should return true for a flag having no segmentation and only testing rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int')).toBe(11);
      expect(featureFlag.getVariable('string')).toBe('test_variation');
      expect(featureFlag.getVariable('float')).toBe(20.02);
      expect(featureFlag.getVariable('boolean')).toBe(true);
      expect(featureFlag.getVariable('json')).toEqual({ name: 'VWO', variation: 1 });

      return featureFlag;
    });

    it('should return false for a flag that does not exists and return default values for variables', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
      };
      const featureFlag = await vwoClient.getFlag('feature2', userContext);

      expect(featureFlag.isEnabled()).toBe(false);
      expect(featureFlag.getVariable('int', 1)).toBe(1);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('abhishek');
      expect(featureFlag.getVariable('float', 1.1)).toBe(1.1);
      expect(featureFlag.getVariable('boolean', false)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({});

      return featureFlag;
    });

    it('should return false for a flag that does not pass pre segment of any rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(false);
      expect(featureFlag.getVariable('int', 1)).toBe(1);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('abhishek');
      expect(featureFlag.getVariable('float', 1.1)).toBe(1.1);
      expect(featureFlag.getVariable('boolean', false)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({});
      return featureFlag;
    });

    it('should return true for a flag that pass pre segment for rollout1 and testingRule1', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
        customVariables: {
          price: 100,
        },
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int', 1)).toBe(11);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('testing1_variation');
      expect(featureFlag.getVariable('float', 1.1)).toBe(20.02);
      expect(featureFlag.getVariable('boolean', false)).toBe(true);
      expect(featureFlag.getVariable('json', {})).toEqual({ campaign: 'testing1_variation' });
      return featureFlag;
    });

    it('should return true for a flag that pass pre segment for rollout2 and testingRule2', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
        customVariables: {
          price: 200,
        },
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int', 1)).toBe(11);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('testing2_variation');
      expect(featureFlag.getVariable('float', 1.1)).toBe(20.02);
      expect(featureFlag.getVariable('boolean', false)).toBe(true);
      expect(featureFlag.getVariable('json', {})).toEqual({ campaign: 'testing2_variation' });
      return featureFlag;
    });

    it('should return true for a flag that pass control whitelisting for testingRule1', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id',
        customVariables: {
          price: 100,
        },
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int', 1)).toBe(10);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('testing1');
      expect(featureFlag.getVariable('float', 1.1)).toBe(20.01);
      expect(featureFlag.getVariable('boolean', true)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({ campaign: 'testing1' });
      return featureFlag;
    });

    it('should return true for a flag that fails whitelisting for testingRule1 and only rollout rule pass', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_1',
        customVariables: {
          price: 100,
        },
      };
      const featureFlag = await vwoClient.getFlag('feature1', userContext);

      expect(featureFlag.isEnabled()).toBe(true);
      expect(featureFlag.getVariable('int', 1)).toBe(10);
      expect(featureFlag.getVariable('string', 'abhishek')).toBe('rollout1');
      expect(featureFlag.getVariable('float', 1.1)).toBe(20.01);
      expect(featureFlag.getVariable('boolean', true)).toBe(false);
      expect(featureFlag.getVariable('json', {})).toEqual({ campaign: 'rollout1' });
      return featureFlag;
    });
  });

  describe('getFLag with MEG', () => {
    describe('MEG with Random Algo', () => {
      it('should return true for a flag having 3 meg campaigns, where testingRule1 and personaliseRule1 are eligible', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id_1',
          customVariables: {
            price: 100, // to make testingRule1 eligible
            name: 'personalise', // to make personaliseRule1 eligible
          },
        };
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(11);
        expect(featureFlag.getVariable('string')).toBe('personalizeRule1_variation');
        expect(featureFlag.getVariable('float')).toBe(20.02);
        expect(featureFlag.getVariable('boolean')).toBe(true);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'personalizeRule1_variation' });

        return featureFlag;
      });

      it('should return true for a flag having 3 meg campaigns, where all campaigns are inEligible', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id',
          customVariables: {
            firstname: 'testingRule2', // to pass testingRule2 pre segment
          },
        };
        // testingRule1, personaliseRule1, and testingRule3 campaigns (part of MEG ) are inEligible so testingRule2 campaign (not part of MEG ) will be evaluated'
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(10);
        expect(featureFlag.getVariable('string')).toBe('testing2');
        expect(featureFlag.getVariable('float')).toBe(20.01);
        expect(featureFlag.getVariable('boolean')).toBe(false);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'testing2' });

        return featureFlag;
      });

      it('should return true for a flag having 3 meg campaigns, where personalizeRule1 and testingRule3 are eligible but testingRule2 will be returned', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id_1',
          customVariables: {
            name: 'personalise', // to make personalizeRule1 eligible
            lastname: 'vwo', // to make testingRule3 eligible
            firstname: 'testingRule2', // to pass testingRule2 pre segment
          },
        };
        // personalizeRule1, and testingRule3 campaigns -- eligible and testingRule1 -- inEligible so testingRule3 will be winner
        // but testingRule2 campaign (not part of MEG ) has high priority so it will be evaluated
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(10);
        expect(featureFlag.getVariable('string')).toBe('testing2');
        expect(featureFlag.getVariable('float')).toBe(20.01);
        expect(featureFlag.getVariable('boolean')).toBe(false);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'testing2' });

        return featureFlag;
      });

      it('should return true for a flag having 3 meg campaigns, where E2 and E4 are eligible and E4 will be returned', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id_1',
          customVariables: {
            name: 'personalise', // to make personalizeRule1 eligible
            lastname: 'vwo', // to make testingRule3 eligible
          },
        };
        // personalizeRule1, and testingRule3 campaigns -- eligible and testingRule1 -- inEligible so testingRule3 will be winner
        // testingRule2 campaign will be evaluated but it will fail pre-segment and testingRule3 will be returned
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(11);
        expect(featureFlag.getVariable('string')).toBe('testing3_variation');
        expect(featureFlag.getVariable('float')).toBe(20.02);
        expect(featureFlag.getVariable('boolean')).toBe(true);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'testing3_variation' });

        return featureFlag;
      });
    });

    describe('MEG with Advance algo', () => {
      it('should return true for a flag having 4 meg campaigns, where testingRule1 should be returned as it pass pre segment', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_ADVANCE_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id_1',
          customVariables: {
            price: 100, // to pass testingRule1 pre segment
            name: 'personalise', // to make personalizeRule1 eligible
            firstname: 'testingRule2', // to make testingRule2 eligible
          },
        };
        // testingRule1 and testingRule3 campaign are not part of MEG,
        // personalizeRule1 and testingRule2 are priority campaign and testingRule4, testingRule5 are weightage campaigns
        // if testingRule1 pass pre segment then we should return testingRule1
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(11);
        expect(featureFlag.getVariable('string')).toBe('testing1_variation');
        expect(featureFlag.getVariable('float')).toBe(20.02);
        expect(featureFlag.getVariable('boolean')).toBe(true);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'testing1_variation' });

        return featureFlag;
      });

      it('should return true for a flag having 4 meg campaigns, where testingRule2 should be returned', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_ADVANCE_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id_1',
          customVariables: {
            name: 'personalise', // to make personaliseRule1 eligible
            firstname: 'testingRule2', // to make testingRule2 eligible
          },
        };
        // if testingRule1 fails pre segment then we should return testingRule2, if it's eligible as it is priority campaign
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(10);
        expect(featureFlag.getVariable('string')).toBe('testing2');
        expect(featureFlag.getVariable('float')).toBe(20.01);
        expect(featureFlag.getVariable('boolean')).toBe(false);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'testing2' });

        return featureFlag;
      });

      it('should return true for a flag having 4 meg campaigns, where personaliseRule1 should be returned', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_ADVANCE_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id_1',
          customVariables: {
            name: 'personalise', // to make personaliseRule1 eligible
          },
        };
        // if testingRule1 fails pre segment and testingRule2 is not eligible then we should return personaliseRule1, if it's eligible
        // as the second priority campaign is personaliseRule1
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(11);
        expect(featureFlag.getVariable('string')).toBe('personalizeRule1_variation');
        expect(featureFlag.getVariable('float')).toBe(20.02);
        expect(featureFlag.getVariable('boolean')).toBe(true);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'personalizeRule1_variation' });

        return featureFlag;
      });

      it('should return true for a flag having 4 meg campaigns, where testingRule3 should be returned', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_ADVANCE_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id_1',
          customVariables: {
            lastname: 'vwo', // to pass testingRule3 pre-segment
          },
        };
        // if testingRule1 fails pre segment and personaliseRule1 and testingRule2 are not eligible
        //  then we should evaluate testingRule3 as a normal campaign
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(11);
        expect(featureFlag.getVariable('string')).toBe('testing3_variation');
        expect(featureFlag.getVariable('float')).toBe(20.02);
        expect(featureFlag.getVariable('boolean')).toBe(true);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'testing3_variation' });

        return featureFlag;
      });

      it('should return true for a flag having 4 meg campaigns, where testingRule5 should be returned', async () => {
        const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef' });
        jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MEG_CAMPAIGN_ADVANCE_ALGO_SETTINGS as any);

        const options = {
          sdkKey: 'sdk-key',
          accountId: 'account-id',
          vwoBuilder, // pass only for E2E tests
        };
        const vwoClient = await init(options);

        const userContext = {
          id: 'user_id_1',
        };
        // if testingRule1 fails pre segment and personaliseRule1 and testingRule2 are not eligible
        // then we evaluate testingRule3 as a normal campaign, if it does not pass pre segment
        // then we evalute weightage campaign and return testingRule5
        const featureFlag = await vwoClient.getFlag('feature1', userContext);

        expect(featureFlag.isEnabled()).toBe(true);
        expect(featureFlag.getVariable('int')).toBe(11);
        expect(featureFlag.getVariable('string')).toBe('testing5_variation');
        expect(featureFlag.getVariable('float')).toBe(20.02);
        expect(featureFlag.getVariable('boolean')).toBe(true);
        expect(featureFlag.getVariable('json')).toEqual({ campaign: 'testing5_variation' });

        return featureFlag;
      });
    });
  });

  describe('getFLag with storage', () => {
    it('should return true for a flag having settings: 100% traffic allocation and no segmentation', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
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
      expect(storageFeatureFlag.getVariable('json')).toEqual({ name: 'VWO' });
      return storageFeatureFlag;
    });

    it('should return true for a flag having settings: 100% traffic allocation and no segmentation and Testing Rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_1',
        customVariables: {
          price: 200,
        },
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
      expect(storedFeatureFlag.getVariable('json')).toEqual({ name: 'VWO', variation: 1 });

      return storedFeatureFlag;
    });

    it('should return true for a flag having no segmentation and only testing rule', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_4',
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
      expect(storedFeatureFlag.getVariable('json')).toEqual({ name: 'VWO', variation: 1 });

      return storedFeatureFlag;
    });

    it('should return false for a flag that does not exists and return default values for variables', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_5',
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
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_6',
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
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_7',
        customVariables: {
          price: 100,
        },
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
      expect(storedFeatureFlag.getVariable('json', {})).toEqual({ campaign: 'testing1_variation' });
      return storedFeatureFlag;
    });

    it('should return true for a flag that pass pre segment for rollout2 and testingRule2', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_8',
        customVariables: {
          price: 200,
        },
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
      expect(storedFeatureFlag.getVariable('json', {})).toEqual({ campaign: 'testing2_variation' });
      return storedFeatureFlag;
    });

    it('should return true for a flag that pass control whitelisting for testingRule1', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_9',
        customVariables: {
          price: 100,
        },
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
      expect(storedFeatureFlag.getVariable('json', {})).toEqual({ campaign: 'testing1' });
      return storedFeatureFlag;
    });
    it('should return true for a flag that fails whitelisting for testingRule1 and only rollout rule pass', async () => {
      const vwoBuilder = new VWOBuilder({ accountId: '123456', sdkKey: 'abcdef', storage: storageMap });
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      const userContext = {
        id: 'user_id_10',
        customVariables: {
          price: 100,
        },
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
      expect(storedFeatureFlag.getVariable('json', {})).toEqual({ campaign: 'rollout1' });
      return storedFeatureFlag;
    });
  });
});
