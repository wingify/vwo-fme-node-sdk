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
import { IVWOOptions } from '../../lib/models/VWOOptionsModel';
import { VWOBuilder } from '../../lib/VWOBuilder';
import { SETTINGS_WITH_SAME_SALT } from '../data/Settings';
import * as UserIdUtil from '../../lib/utils/UserIdUtil';

const MOCK_SETTINGS_FILE = {
  version: 1,
  sdkKey: 'abcdef',
  accountId: 123456,
  campaigns: [
    {
      segments: {},
      status: 'RUNNING',
      variations: [
        {
          weight: 100,
          segments: {},
          id: 1,
          variables: [
            {
              id: 1,
              type: 'string',
              value: 'def',
              key: 'kaus',
            },
          ],
          name: 'Rollout-rule-1',
        },
      ],
      type: 'FLAG_ROLLOUT',
      isAlwaysCheckSegment: false,
      isForcedVariationEnabled: false,
      name: 'featureOne : Rollout',
      key: 'featureOne_rolloutRule1',
      id: 1,
    },
    {
      segments: {},
      status: 'RUNNING',
      key: 'featureOne_testingRule1',
      type: 'FLAG_TESTING',
      isAlwaysCheckSegment: false,
      name: 'featureOne : Testing rule 1',
      isForcedVariationEnabled: true,
      variations: [
        {
          weight: 50,
          segments: {},
          id: 1,
          variables: [
            {
              id: 1,
              type: 'string',
              value: 'def',
              key: 'kaus',
            },
          ],
          name: 'Default',
        },
        {
          weight: 50,
          segments: {},
          id: 2,
          variables: [
            {
              id: 1,
              type: 'string',
              value: 'var1',
              key: 'kaus',
            },
          ],
          name: 'Variation-1',
        },
        {
          weight: 0,
          segments: {
            or: [
              {
                user: 'forcedWingify',
              },
            ],
          },
          id: 3,
          variables: [
            {
              id: 1,
              type: 'string',
              value: 'var2',
              key: 'kaus',
            },
          ],
          name: 'Variation-2',
        },
        {
          weight: 0,
          segments: {},
          id: 4,
          variables: [
            {
              id: 1,
              type: 'string',
              value: 'var3',
              key: 'kaus',
            },
          ],
          name: 'Variation-3',
        },
      ],
      id: 2,
      percentTraffic: 100,
    },
  ],
  features: [
    {
      impactCampaign: {},
      rules: [
        {
          campaignId: 1,
          type: 'FLAG_ROLLOUT',
          ruleKey: 'rolloutRule1',
          variationId: 1,
        },
        {
          type: 'FLAG_TESTING',
          ruleKey: 'testingRule1',
          campaignId: 2,
        },
      ],
      status: 'ON',
      key: 'featureOne',
      metrics: [
        {
          type: 'CUSTOM_GOAL',
          identifier: 'e1',
          id: 1,
        },
      ],
      type: 'FEATURE_FLAG',
      name: 'featureOne',
      id: 1,
    },
  ],
};

describe('Custom Bucketing Seed', () => {
  describe('getFlag without bucketing seed', () => {
    // Case 1: Standard bucketing (no custom seed)
    // Scenario: Two different users ('KaustubhVWO', 'RandomUserVWO') with NO bucketing seed.
    // Expected: They should be bucketed into different variations based on their User IDs.
    // We know from our settings that KaustubhVWO -> Variation-1 and RandomUserVWO -> Variation-default.
    it('should assign different variations to users with different user IDs', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MOCK_SETTINGS_FILE as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      };
      const vwoClient = await init(options);

      const user1Flag = await vwoClient.getFlag('featureOne', { id: 'KaustubhVWO' });
      const user2Flag = await vwoClient.getFlag('featureOne', { id: 'RandomUserVWO' });

      // Users with different IDs should get different variations for this split
      expect(user1Flag.getVariables()).not.toEqual(user2Flag.getVariables());
    });
  });

  describe('getFlag with bucketing seed', () => {
    // Case 2: Bucketing Seed Provided
    // Scenario: Two different users ('KaustubhVWO', 'RandomUserVWO') are provided with the SAME bucketingSeed.
    // Expected: Since the seed is identical, they MUST get the same variation.
    it('should assign same variation to different users with same bucketing seed', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MOCK_SETTINGS_FILE as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      };
      const vwoClient = await init(options);

      const sameBucketingSeed = 'common-seed-123';

      const user1Flag = await vwoClient.getFlag('featureOne', {
        id: 'KaustubhVWO',
        bucketingSeed: sameBucketingSeed,
      });

      const user2Flag = await vwoClient.getFlag('featureOne', {
        id: 'RandomUserVWO',
        bucketingSeed: sameBucketingSeed,
      });

      expect(user1Flag.getVariables()).toEqual(user2Flag.getVariables());
    });

    // Case 3: Different Seeds
    // Scenario: The SAME User ID is used, but with DIFFERENT bucketing seeds.
    // Expected: The SDK should bucket based on the seed. Since we use seeds known to produce different results ('KaustubhVWO' vs 'RandomUserVWO'), the outcomes should differ.
    it('should assign different variations to users with different bucketing seeds', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MOCK_SETTINGS_FILE as any);
      const vwoClient = await init({
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      });

      // Same user ID, different seeds
      // Using the names as seeds to simulate the difference
      const user1Flag = await vwoClient.getFlag('featureOne', { id: 'sameId', bucketingSeed: 'KaustubhVWO' });
      const user2Flag = await vwoClient.getFlag('featureOne', { id: 'sameId', bucketingSeed: 'RandomUserVWO' });

      expect(user1Flag.getVariables()).not.toEqual(user2Flag.getVariables());
    });

    // Case 4: Empty String Seed
    // Scenario: bucketingSeed is provided but it's an empty string.
    // Expected: Empty string is falsy in JS, so it should fall back to userId. Different users should get different variations.
    it('should fallback to userId when bucketingSeed is empty string', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MOCK_SETTINGS_FILE as any);
      const vwoClient = await init({
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      });

      // Empty string should be treated as no seed
      const user1Flag = await vwoClient.getFlag('featureOne', { id: 'KaustubhVWO', bucketingSeed: '' });
      const user2Flag = await vwoClient.getFlag('featureOne', { id: 'RandomUserVWO', bucketingSeed: '' });

      // Should use userIds since empty strings are falsy
      expect(user1Flag.getVariables()).not.toEqual(user2Flag.getVariables());
    });
  });

  describe('getFlag with custom salt and bucketing seed combinations', () => {
    it('No bucketing seed, custom salt present - 10 users, randomly distributed, but each user getting same variation in both flags', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(SETTINGS_WITH_SAME_SALT as any);
      const vwoClient = await init({
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      });
      // loop for 10 users and check if both flags yield the exact same variation for the same user due to identical salt
      for (let i = 1; i <= 10; i++) {
        const userId = `user${i}`;
        const flag1 = await vwoClient.getFlag('feature1', { id: userId });
        const flag2 = await vwoClient.getFlag('feature2', { id: userId });

        // Both flags should yield the exact same variation for the same user due to identical salt
        expect(flag1.getVariables()).toEqual(flag2.getVariables());
      }
    });

    //when bucketing seed is present and custom salt is present
    it('Bucketing seed present, salt present - 10 users, all users getting same variation in both flags', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(SETTINGS_WITH_SAME_SALT as any);

      const vwoClient = await init({
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      });

      const commonBucketingSeed = 'common_seed_456';
      const variationsAssigned = new Set();
      //loop for 10 users and check if both flags yield the exact same variation for the same user due to identical salt
      for (let i = 1; i <= 10; i++) {
        const userId = `user${i}`;
        const flag1 = await vwoClient.getFlag('feature1', { id: userId, bucketingSeed: commonBucketingSeed });
        const flag2 = await vwoClient.getFlag('feature2', { id: userId, bucketingSeed: commonBucketingSeed });

        // Both flags should yield the exact same variation
        expect(flag1.getVariables()).toEqual(flag2.getVariables());

        variationsAssigned.add(JSON.stringify(flag1.getVariables()));
      }

      // Since the bucketing seed is the exact same for all 10 users, they MUST all get the same variation
      expect(variationsAssigned.size).toBe(1);
    });
  });

  describe('getFlag with forced variation (whitelisting) and bucketing seed', () => {
    // In MOCK_SETTINGS_FILE, 'forcedWingify' is whitelisted to Variation-2 (value: 'var2').
    it('should return forced variation for whitelisted user without bucketing seed', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MOCK_SETTINGS_FILE as any);

      const vwoClient = await init({
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      });

      // Without bucketing seed, forcedWingify must get the forced variation (Variation-2, value: 'var2')
      const forcedUserFlag = await vwoClient.getFlag('featureOne', { id: 'forcedWingify' });
      // forced user should get the forced variation
      expect(forcedUserFlag.getVariables()).toEqual(
        expect.arrayContaining([expect.objectContaining({ value: 'var2' })]),
      );
    });

    it('should still return forced variation for whitelisted user when bucketing seed is present', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MOCK_SETTINGS_FILE as any);

      const vwoClient = await init({
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      });

      // Even with a bucketing seed, forcedWingify must still get the forced variation (Variation-2, value: 'var2')
      const forcedUserFlag = await vwoClient.getFlag('featureOne', {
        id: 'forcedWingify',
        bucketingSeed: 'some-seed-xyz',
      });
      // forced user should get the forced variation
      expect(forcedUserFlag.getVariables()).toEqual(
        expect.arrayContaining([expect.objectContaining({ value: 'var2' })]),
      );
    });
  });

  describe('getFlag with aliasing enabled and bucketing seed', () => {
    // RandomUserVWO and WingifyVWO are known to get DIFFERENT variations when no bucketing seed is used.
    // We use them to prove that aliasing + bucketing seed behaves correctly.

    it('with bucketing seed - two aliased users resolving to different userIds should get the SAME variation when same seed is used', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
        isAliasingEnabled: true,
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MOCK_SETTINGS_FILE as any);

      const vwoClient = await init({
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      });

      const bucketingSeed = 'shared-seed-abc';

      // Alias 'aliasUserA' resolves to 'RandomUserVWO' via gateway
      const getUserIdSpy = jest.spyOn(UserIdUtil, 'getUserId').mockResolvedValue('RandomUserVWO');
      const flag1 = await vwoClient.getFlag('featureOne', {
        id: 'aliasUserA',
        bucketingSeed: bucketingSeed,
      });

      // Alias 'aliasUserB' resolves to 'WingifyVWO' via gateway (a different resolved user)
      getUserIdSpy.mockResolvedValue('WingifyVWO');
      const flag2 = await vwoClient.getFlag('featureOne', {
        id: 'aliasUserB',
        bucketingSeed: bucketingSeed,
      });

      // getUserId should have been called (aliasing is active)
      expect(getUserIdSpy).toHaveBeenCalled();

      // Even though aliasing resolved to two DIFFERENT userIds (RandomUserVWO vs WingifyVWO),
      // the SAME bucketing seed was used, so both must get the SAME variation
      expect(flag1.getVariables()).toEqual(flag2.getVariables());

      getUserIdSpy.mockRestore();
    });

    it('without bucketing seed - two aliased users resolving to different userIds should get DIFFERENT variations', async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
        isAliasingEnabled: true,
      };

      const vwoBuilder = new VWOBuilder(vwoOptions);
      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(MOCK_SETTINGS_FILE as any);

      const vwoClient = await init({
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder,
      });

      // Alias 'aliasUserA' resolves to 'RandomUserVWO'
      const getUserIdSpy = jest.spyOn(UserIdUtil, 'getUserId').mockResolvedValue('RandomUserVWO');
      const flag1 = await vwoClient.getFlag('featureOne', { id: 'aliasUserA' });

      // Alias 'aliasUserB' resolves to 'WingifyVWO'
      getUserIdSpy.mockResolvedValue('WingifyVWO');
      const flag2 = await vwoClient.getFlag('featureOne', { id: 'aliasUserB' });

      // getUserId should have been called
      expect(getUserIdSpy).toHaveBeenCalled();

      // Without bucketing seed, bucketing uses the resolved userId.
      // RandomUserVWO and WingifyVWO are known to get different variations.
      expect(flag1.getVariables()).not.toEqual(flag2.getVariables());

      getUserIdSpy.mockRestore();
    });
  });
});
