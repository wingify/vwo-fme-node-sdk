import { SegmentEvaluator } from '../../../../lib/modules/segmentor';
import { SegmentEvaluatorData } from '../../../data/SegmentEvaluatorData';

describe('Segmentation', () => {
  test('and operator test', async () => {
    const andOperatorkey = Object.keys(new SegmentEvaluatorData().data['and_operator']);
    const andOperatorDsl = new SegmentEvaluatorData().data['and_operator'];
    andOperatorkey.forEach(async key => {
      const { dsl, expectation, customVariables } = andOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('case insensitive equality operand test', async () => {
    const andOperatorkey: Array<string> = Object.keys(
      new SegmentEvaluatorData().data['case_insensitive_equality_operand']
    );
    const andOperatorDsl = new SegmentEvaluatorData().data['case_insensitive_equality_operand'];
    andOperatorkey.forEach(async key => {
      const { dsl, expectation, customVariables } = andOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('complex and ors test', async () => {
    const complexOperatorkey: Array<string> = Object.keys(new SegmentEvaluatorData().data['complex_and_ors']);
    const complexOperatorDsl = new SegmentEvaluatorData().data['complex_and_ors'];
    complexOperatorkey.forEach(async key => {
      const { dsl, expectation, customVariables } = complexOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('complex dsl test', async () => {
    let complexDSLOperatorkey = Object.keys(new SegmentEvaluatorData().data['complex_dsl_1']);
    let complexDSLOperatorDsl = new SegmentEvaluatorData().data['complex_dsl_1'];
    complexDSLOperatorkey.forEach(async key => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(new SegmentEvaluatorData().data['complex_dsl_2']);
    complexDSLOperatorDsl = new SegmentEvaluatorData().data['complex_dsl_2'];
    complexDSLOperatorkey.forEach(async key => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(new SegmentEvaluatorData().data['complex_dsl_3']);
    complexDSLOperatorDsl = new SegmentEvaluatorData().data['complex_dsl_3'];
    complexDSLOperatorkey.forEach(async key => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });

    complexDSLOperatorkey = Object.keys(new SegmentEvaluatorData().data['complex_dsl_4']);
    complexDSLOperatorDsl = new SegmentEvaluatorData().data['complex_dsl_4'];
    complexDSLOperatorkey.forEach(async key => {
      const { dsl, expectation, customVariables } = complexDSLOperatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('contains operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['contains_operand']);
    const operatorDsl = new SegmentEvaluatorData().data['contains_operand'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('ends operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['ends_with_operand']);
    const operatorDsl = new SegmentEvaluatorData().data['ends_with_operand'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('equality operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['equality_operand']);
    const operatorDsl = new SegmentEvaluatorData().data['equality_operand'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('new cases for decimal mismatch test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['new_cases_for_decimal_mismatch']);
    const operatorDsl = new SegmentEvaluatorData().data['new_cases_for_decimal_mismatch'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('not operator test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['not_operator']);
    const operatorDsl = new SegmentEvaluatorData().data['not_operator'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('or operator test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['or_operator']);
    const operatorDsl = new SegmentEvaluatorData().data['or_operator'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('regex test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['regex']);
    const operatorDsl = new SegmentEvaluatorData().data['regex'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('simple and ors test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['simple_and_ors']);
    const operatorDsl = new SegmentEvaluatorData().data['simple_and_ors'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('starts with operand test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['starts_with_operand']);
    const operatorDsl = new SegmentEvaluatorData().data['starts_with_operand'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('special characters test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['special_characters']);
    const operatorDsl = new SegmentEvaluatorData().data['special_characters'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('user operand evaluator test', async () => {
    const operatorkeys: Array<string> = Object.keys(new SegmentEvaluatorData().data['user_operand_evaluator']);
    const operatorDsl = new SegmentEvaluatorData().data['user_operand_evaluator'];
    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = operatorDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });

  test('user operand evaluator with customVariables test', async () => {
    const operatorkeys: Array<string> = Object.keys(
      new SegmentEvaluatorData().data['user_operand_evaluator_with_customVariables']
    );

    const dslKey = 'user_operand_evaluator_with_customVariables';
    const evaluatingDsl = new SegmentEvaluatorData().data[dslKey];

    operatorkeys.forEach(async key => {
      const { dsl, expectation, customVariables } = evaluatingDsl[key];

      const preSegmentationResult = await new SegmentEvaluator().isSegmentationValid(dsl, customVariables);

      expect(preSegmentationResult).toBe(expectation);
    });
  });
});
