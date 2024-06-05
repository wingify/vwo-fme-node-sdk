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
import * as TESTS_DATA from 'vwo-fme-sdk-e2e-test-settings-n-cases';

import { SegmentEvaluator } from '../../../../lib/packages/segmentation-evaluator';

describe('Segmentation', () => {
  test('and operator test', async () => {
    const andOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['and_operator']);
    const andOperatorDsl = TESTS_DATA.SEGMENTATION_TESTS['and_operator'];
    andOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = andOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('case insensitive equality operand test', async () => {
    const andOperatorkey: Array<string> = Object.keys(
      TESTS_DATA.SEGMENTATION_TESTS['case_insensitive_equality_operand'],
    );
    const andOperatorDsl = TESTS_DATA.SEGMENTATION_TESTS['case_insensitive_equality_operand'];
    andOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = andOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('complex and ors test', async () => {
    const complexOperatorkey: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_and_ors']);
    const complexOperatorDsl = TESTS_DATA.SEGMENTATION_TESTS['complex_and_ors'];
    complexOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('complex dsl test', async () => {
    let complexDSLOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_1']);
    let complexDSLOperatorDsl = TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_1'];
    complexDSLOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_2']);
    let complexDSLOperatorDsl1 = TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_2'];
    complexDSLOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl1[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_3']);
    let complexDSLOperatorDsl2 = TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_3'];
    complexDSLOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl2[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_4']);
    let complexDSLOperatorDsl3 = TESTS_DATA.SEGMENTATION_TESTS['complex_dsl_4'];
    complexDSLOperatorkey.forEach(async (key) => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl3[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('contains operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['contains_operand']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['contains_operand'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('ends operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['ends_with_operand']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['ends_with_operand'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('equality operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['equality_operand']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['equality_operand'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('new cases for decimal mismatch test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['new_cases_for_decimal_mismatch']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['new_cases_for_decimal_mismatch'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('not operator test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['not_operator']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['not_operator'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('or operator test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['or_operator']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['or_operator'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('regex test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['regex']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['regex'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('simple and ors test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['simple_and_ors']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['simple_and_ors'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('starts with operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['starts_with_operand']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['starts_with_operand'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('special characters test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['special_characters']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['special_characters'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('user operand evaluator test', async () => {
    const operatorkeys: Array<string> = Object.keys(TESTS_DATA.SEGMENTATION_TESTS['user_operand_evaluator']);
    const operatorDsl = TESTS_DATA.SEGMENTATION_TESTS['user_operand_evaluator'];
    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('user operand evaluator with customVariables test', async () => {
    const operatorkeys: Array<string> = Object.keys(
      TESTS_DATA.SEGMENTATION_TESTS['user_operand_evaluator_with_customVariables'],
    );

    const dslKey = 'user_operand_evaluator_with_customVariables';
    const evaluatingDsl = TESTS_DATA.SEGMENTATION_TESTS[dslKey];

    operatorkeys.forEach(async (key) => {
      const { dsl, expectation, customVariables } = evaluatingDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });
});
