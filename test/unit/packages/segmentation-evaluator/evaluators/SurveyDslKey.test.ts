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
import { SurveyDslKey } from '../../../../../lib/packages/segmentation-evaluator/evaluators/SurveyDslKey';
import { SurveySegmentDslAdapter } from '../../../../../lib/packages/segmentation-evaluator/evaluators/SurveySegmentDslAdapter';

describe('SurveyDslKey', () => {
  test('parses any-survey, survey-scoped, and specific-question submitted keys', () => {
    const anySurvey = SurveyDslKey.parse('vwo_surveyQuestionSubmitted');
    expect(anySurvey?.surveyId).toBeNull();
    expect(anySurvey?.questionId).toBeNull();
    expect(anySurvey?.eventName).toBe('QuestionSubmitted');
    expect(anySurvey?.isAggregate).toBe(true);

    const anyQuestion = SurveyDslKey.parse('392797_vwo_surveyQuestionSubmitted');
    expect(anyQuestion?.surveyId).toBe('392797');
    expect(anyQuestion?.questionId).toBeNull();
    expect(anyQuestion?.isAggregate).toBe(true);

    const specific = SurveyDslKey.parse('392797_vwo_surveyQuestionSubmitted_1891366');
    expect(specific?.surveyId).toBe('392797');
    expect(specific?.questionId).toBe('1891366');
    expect(specific?.isAggregate).toBe(false);
  });

  test('rejects unknown event names', () => {
    expect(SurveyDslKey.parse('vwo_surveyUnknown')).toBeNull();
    expect(SurveyDslKey.parse('custom_variable')).toBeNull();
  });

  test('covers treats omitted ids as wildcards', () => {
    const stored = SurveyDslKey.parse('392797_vwo_surveyQuestionSubmitted_1891366');
    expect(SurveyDslKey.parse('vwo_surveyQuestionSubmitted')?.covers(stored)).toBe(true);
    expect(SurveyDslKey.parse('392797_vwo_surveyQuestionSubmitted')?.covers(stored)).toBe(true);
    expect(SurveyDslKey.parse('392797_vwo_surveyQuestionSubmitted_1891366')?.covers(stored)).toBe(true);
    expect(SurveyDslKey.parse('392797_vwo_surveyQuestionSubmitted_1')?.covers(stored)).toBe(false);
    expect(SurveyDslKey.parse('1_vwo_surveyQuestionSubmitted_1891366')?.covers(stored)).toBe(false);
  });

  test('covers rejects a stored event of a different type', () => {
    const storedDisplayed = SurveyDslKey.parse('392797_vwo_surveyQuestionDisplayed_1891366');
    expect(SurveyDslKey.parse('392797_vwo_surveyQuestionSubmitted_1891366')?.covers(storedDisplayed)).toBe(false);
  });

  test('flags the presence events and their storage keys', () => {
    const presenceKeys = [
      'vwo_surveyDisplayed',
      'vwo_surveyAttempted',
      'vwo_surveyQuestionDisplayed',
      'vwo_surveyQuestionAttempted',
    ];
    for (const key of presenceKeys) {
      const parsed = SurveyDslKey.parse(key);
      expect(parsed?.isDisplayedOrAttempted).toBe(true);
      expect(parsed?.storageEventType).toBe(key);
    }

    for (const key of ['vwo_surveyQuestionSubmitted', 'vwo_surveyCompleted', 'vwo_surveyReachedThankyou']) {
      expect(SurveyDslKey.parse(key)?.isDisplayedOrAttempted).toBe(false);
    }

    // Storage key drops the ids that the DSL carries.
    expect(SurveyDslKey.parse('392797_vwo_surveyQuestionDisplayed_1891366')?.storageEventType).toBe(
      'vwo_surveyQuestionDisplayed',
    );
  });

  test('survey level events are never question events', () => {
    expect(SurveyDslKey.parse('392797_vwo_surveyDisplayed')?.isQuestionEvent).toBe(false);
    // No question dimension, so a survey-level key with an id is not aggregate.
    expect(SurveyDslKey.parse('392797_vwo_surveyDisplayed')?.isAggregate).toBe(false);
    expect(SurveyDslKey.parse('vwo_surveyDisplayed')?.isAggregate).toBe(true);
    expect(SurveyDslKey.parse('392797_vwo_surveyQuestionDisplayed')?.isQuestionEvent).toBe(true);
  });
});

describe('SurveySegmentDslAdapter', () => {
  test('normalizes a single-field bare survey leaf', () => {
    const dsl = { vwo_surveyQuestionSubmitted: true };
    expect(SurveySegmentDslAdapter.normalizeToSurveyOperand(dsl)).toBe(dsl);
  });

  test('returns null for operators and multi-key objects', () => {
    expect(SurveySegmentDslAdapter.normalizeToSurveyOperand({ or: [] })).toBeNull();
    expect(
      SurveySegmentDslAdapter.normalizeToSurveyOperand({
        vwo_surveyQuestionSubmitted: true,
        vwo_surveyDisplayed: true,
      }),
    ).toBeNull();
  });
});
