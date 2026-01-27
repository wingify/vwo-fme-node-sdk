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
import * as TESTS_DATA from 'vwo-fme-sdk-e2e-test-settings-n-cases';

import { SegmentEvaluator } from '../../../../lib/packages/segmentation-evaluator';
import { SegmentOperandEvaluator } from '../../../../lib/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator';
import { ServiceContainer } from '../../../../lib/services/ServiceContainer';
import { LogManager } from '../../../../lib/packages/logger';
import { LogLevelEnum } from '../../../../lib/enums/LogLevelEnum';

// Create mock ServiceContainer for testing
const createMockServiceContainer = (): ServiceContainer => {
  const mockLogManager = new LogManager({
    isAlwaysNewInstance: true,
    level: LogLevelEnum.ERROR, // Set to ERROR to minimize console output during tests
  });

  // Create a partial mock ServiceContainer with minimal required methods
  const mockServiceContainer = {
    getLogManager: () => mockLogManager,
    getSettings: () => ({}),
    getSettingsService: () => ({}),
    getHooksService: () => ({}),
    getVWOOptions: () => ({}),
    getBatchEventsQueue: () => ({}),
    getSegmentationManager: () => ({}),
    getBaseUrl: () => '',
    getNetworkManager: () => ({}),
    getStorageConnector: () => null,
  } as ServiceContainer;

  return mockServiceContainer;
};

// Helper function to create properly initialized SegmentEvaluator
const createSegmentEvaluator = (): SegmentEvaluator => {
  const segmentEvaluator = new SegmentEvaluator();
  const mockServiceContainer = createMockServiceContainer();

  // Initialize SegmentEvaluator with ServiceContainer and SegmentOperandEvaluator
  segmentEvaluator.serviceContainer = mockServiceContainer;
  segmentEvaluator.segmentOperandEvaluator = new SegmentOperandEvaluator(mockServiceContainer);

  return segmentEvaluator;
};

describe('Segmentation', () => {
  test('and operator test', async () => {
    const andOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['and_operator']);
    const andOperatorDsl = TESTS_DATA.SEGMENTATION_TESTS['and_operator'];
    const segmentEvaluator = createSegmentEvaluator();

    andOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = andOperatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('case insensitive equality operand test', async () => {
    const andOperatorkey: Array<string> = Object.keys(
      TESTS_DATA.SEGMENTATION_TESTS['case_insensitive_equality_operand'],
    );
    const andOperatorDsl = TESTS_DATA.SEGMENTATION_TESTS['case_insensitive_equality_operand'];
    const segmentEvaluator = createSegmentEvaluator();

    andOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = andOperatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('complex and ors test', async () => {
    const complexOperatorkey: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_and_ors']);
    const complexOperatorDsl = TESTS_DATA.SEGMENTATION_TESTS['complex_and_ors'];
    const segmentEvaluator = createSegmentEvaluator();

    complexOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexOperatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('complex dsl test', async () => {
    let complexDSLOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_1']);
    const complexDSLOperatorDsl = TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_1'];
    const segmentEvaluator1 = createSegmentEvaluator();

    complexDSLOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl[key];

      const preSegmentationResult = await segmentEvaluator1.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_2']);
    const complexDSLOperatorDsl1 = TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_2'];
    const segmentEvaluator2 = createSegmentEvaluator();

    complexDSLOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl1[key];

      const preSegmentationResult = await segmentEvaluator2.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_3']);
    const complexDSLOperatorDsl2 = TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_3'];
    const segmentEvaluator3 = createSegmentEvaluator();

    complexDSLOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl2[key];

      const preSegmentationResult = await segmentEvaluator3.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_4']);
    const complexDSLOperatorDsl3 = TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_4'];
    const segmentEvaluator4 = createSegmentEvaluator();

    complexDSLOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl3[key];

      const preSegmentationResult = await segmentEvaluator4.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('contains operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['contains_operand']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['contains_operand'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('ends operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['ends_with_operand']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['ends_with_operand'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('equality operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['equality_operand']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['equality_operand'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('new cases for decimal mismatch test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['new_cases_for_decimal_mismatch']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['new_cases_for_decimal_mismatch'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('not operator test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['not_operator']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['not_operator'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('or operator test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['or_operator']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['or_operator'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('regex test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['regex']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['regex'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('simple and ors test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['simple_and_ors']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['simple_and_ors'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('starts with operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['starts_with_operand']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['starts_with_operand'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('special characters test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['special_characters']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['special_characters'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('user operand evaluator test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['user_operand_evaluator']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['user_operand_evaluator'];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('user operand evaluator with customVariables test', async () => {
    const operatorkeys: Array<string> = Object.keys(
      TESTS_DATA.SEGMENTATION_TESTS['user_operand_evaluator_with_customVariables'],
    );

    const dslKey = 'user_operand_evaluator_with_customVariables';
    const evaluatingDsl = TESTS_DATA.SEGMENTATION_TESTS[dslKey];
    const segmentEvaluator = createSegmentEvaluator();

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = evaluatingDsl[key];

      const preSegmentationResult = await segmentEvaluator.isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });
});
