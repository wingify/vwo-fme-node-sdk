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
import { IVWOOptions } from '../../lib/models/VWOOptionsModel';
import { VWOBuilder } from '../../lib/VWOBuilder';

import { GETFLAG_TESTS, TESTS_DATA } from '../data/Settings';

import storageMap from '../data/StorageMap';
import { VariableModel } from '../../lib/models/campaign/VariableModel';

describe('VWO', () => {
  describe('getFlag without storage', () => {
    runTests(GETFLAG_TESTS.GETFLAG_WITHOUT_STORAGE);
  });

  describe('getFlag with MEG - random Algo', () => {
    runTests(GETFLAG_TESTS.GETFLAG_MEG_RANDOM);
  });

  describe('getFlag with MEG - Advance algo', () => {
    runTests(GETFLAG_TESTS.GETFLAG_MEG_ADVANCE);
  });

  describe('getFlag with storage', () => {
    runTests(GETFLAG_TESTS.GETFLAG_WITH_STORAGE, storageMap);
  });
});

async function runTests(tests, storageMap?: any) {
  for (let i = 0; i < tests.length; i++) {
    const testData: any = tests[i];

    it(testData.description, async () => {
      const vwoOptions: IVWOOptions = {
        accountId: '123456',
        sdkKey: 'abcdef',
      };

      if (storageMap) {
        vwoOptions.storage = storageMap;
      }
      const vwoBuilder = new VWOBuilder(vwoOptions);

      jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(TESTS_DATA[testData.settings] as any);

      const options = {
        sdkKey: 'sdk-key',
        accountId: 'account-id',
        vwoBuilder, // pass only for E2E tests
      };
      const vwoClient = await init(options);

      if (storageMap) {
        const storageData = await storageMap.get(testData.featureKey, testData.context.id);

        expect(storageData.rolloutKey).toEqual(undefined);
        expect(storageData.rolloutVariationId).toEqual(undefined);
        expect(storageData.experimentKey).toEqual(undefined);
        expect(storageData.experimentVariationId).toEqual(undefined);
      }

      const featureFlag = await vwoClient.getFlag(testData.featureKey, testData.context);

      expect(featureFlag.isEnabled()).toBe(testData.expectation.isEnabled);
      expect(featureFlag.getVariables()).toStrictEqual(
        testData.expectation.isEnabled
          ? [
              new VariableModel(1, 'integer', 'int', testData.expectation.intVariable),
              new VariableModel(2, 'double', 'float', testData.expectation.floatVariable),
              new VariableModel(3, 'string', 'string', testData.expectation.stringVariable),
              new VariableModel(4, 'boolean', 'boolean', testData.expectation.booleanVariable),
              new VariableModel(5, 'json', 'json', testData.expectation.jsonVariable),
            ]
          : [],
      );
      expect(featureFlag.getVariable('int', 1)).toBe(testData.expectation.intVariable);
      expect(featureFlag.getVariable('string', 'VWO')).toBe(testData.expectation.stringVariable);
      expect(featureFlag.getVariable('float', 1.1)).toBe(testData.expectation.floatVariable);
      expect(featureFlag.getVariable('boolean', false)).toBe(testData.expectation.booleanVariable);
      expect(featureFlag.getVariable('json', {})).toEqual(testData.expectation.jsonVariable);

      if (storageMap) {
        const storageData = await storageMap.get(testData.featureKey, testData.context.id);

        expect(storageData.rolloutKey).toEqual(testData.expectation.storageData.rolloutKey);
        expect(storageData.rolloutVariationId).toEqual(testData.expectation.storageData.rolloutVariationId);
        expect(storageData.experimentKey).toEqual(testData.expectation.storageData.experimentKey);
        expect(storageData.experimentVariationId).toEqual(testData.expectation.storageData.experimentVariationId);
      }
    });
  }
}
