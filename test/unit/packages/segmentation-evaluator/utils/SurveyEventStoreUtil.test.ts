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
import {
  SURVEY_EVENT_HISTORY_LAST_SESSION_KEY,
  SURVEY_EVENT_HISTORY_PRIMARY_KEY,
  SURVEY_EVENT_HISTORY_SESSION_KEY,
  SurveyEventStore,
} from '../../../../../lib/packages/segmentation-evaluator/utils/SurveyEventStoreUtil';

class MemoryStorage {
  constructor(private readonly values: Record<string, string> = {}) {}

  getItem(key: string): string | null {
    return this.values[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.values[key] = value;
  }
}

const SUBMITTED = 'vwo_surveyQuestionSubmitted';

const radioSubmittedEvent = {
  sId: 392797,
  qId: 1891366,
  qT: 'radio',
  type: SUBMITTED,
  responses: { '1891366': ['1'] },
};

describe('SurveyEventStore', () => {
  test('reads primary key and parses submitted events', () => {
    const storage = new MemoryStorage({
      [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: JSON.stringify({
        vwo_pageView: [{}],
        vwo_surveyQuestionSubmitted: [radioSubmittedEvent],
      }),
    });
    const store = new SurveyEventStore(storage);

    expect(store.getEventsByType(SUBMITTED)).toEqual([radioSubmittedEvent]);
  });

  test('uses session then last-session only when primary is missing', () => {
    const sessionOnly = new SurveyEventStore(
      new MemoryStorage({
        [SURVEY_EVENT_HISTORY_SESSION_KEY]: JSON.stringify({
          vwo_surveyQuestionSubmitted: [{ sId: 1, qId: 2, responses: { '2': ['a'] } }],
        }),
        [SURVEY_EVENT_HISTORY_LAST_SESSION_KEY]: JSON.stringify({
          vwo_surveyQuestionSubmitted: [{ sId: 9, qId: 9, responses: { '9': ['ignored'] } }],
        }),
      }),
    );
    expect(sessionOnly.getEventsByType(SUBMITTED)[0].sId).toBe(1);

    const lastSessionOnly = new SurveyEventStore(
      new MemoryStorage({
        [SURVEY_EVENT_HISTORY_LAST_SESSION_KEY]: JSON.stringify({
          vwo_surveyQuestionSubmitted: [{ sId: 3, qId: 4, responses: { '4': ['b'] } }],
        }),
      }),
    );
    expect(lastSessionOnly.getEventsByType(SUBMITTED)[0].sId).toBe(3);
  });

  test('does not merge fallbacks when primary exists', () => {
    const store = new SurveyEventStore(
      new MemoryStorage({
        [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: JSON.stringify({
          vwo_surveyQuestionSubmitted: [{ sId: 1, qId: 1, responses: { '1': ['primary'] } }],
        }),
        [SURVEY_EVENT_HISTORY_SESSION_KEY]: JSON.stringify({
          vwo_surveyQuestionSubmitted: [{ sId: 2, qId: 2, responses: { '2': ['session'] } }],
        }),
      }),
    );
    const events = store.getEventsByType(SUBMITTED);
    expect(events).toHaveLength(1);
    expect(events[0].sId).toBe(1);
  });

  test('memoizes until resetCache', () => {
    const storage = new MemoryStorage({
      [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: JSON.stringify({
        vwo_surveyQuestionSubmitted: [radioSubmittedEvent],
      }),
    });
    const store = new SurveyEventStore(storage);
    store.getEventsByType(SUBMITTED);
    storage.setItem(
      SURVEY_EVENT_HISTORY_PRIMARY_KEY,
      JSON.stringify({ vwo_surveyQuestionSubmitted: [{ sId: 99, qId: 99, responses: { '99': ['x'] } }] }),
    );
    expect(store.getEventsByType(SUBMITTED)[0].sId).toBe(392797);
    store.resetCache();
    expect(store.getEventsByType(SUBMITTED)[0].sId).toBe(99);
  });

  test('returns empty array for invalid JSON or missing storage', () => {
    expect(
      new SurveyEventStore(new MemoryStorage({ [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: '{' })).getEventsByType(SUBMITTED),
    ).toEqual([]);
    expect(new SurveyEventStore(null).getEventsByType(SUBMITTED)).toEqual([]);
  });

  test('reads any event type and parses the history only once', () => {
    const displayedEvent = { sId: 392797, type: 'vwo_surveyDisplayed' };
    const storage = new MemoryStorage({
      [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: JSON.stringify({
        vwo_surveyDisplayed: [displayedEvent],
        vwo_surveyQuestionSubmitted: [radioSubmittedEvent],
      }),
    });
    const store = new SurveyEventStore(storage);

    expect(store.getEventsByType('vwo_surveyDisplayed')).toEqual([displayedEvent]);
    expect(store.getEventsByType(SUBMITTED)).toEqual([radioSubmittedEvent]);
    expect(store.getEventsByType('vwo_surveyAttempted')).toEqual([]);

    // Both types came from a single parse, so a mid-call write is invisible until resetCache.
    storage.setItem(SURVEY_EVENT_HISTORY_PRIMARY_KEY, JSON.stringify({ vwo_surveyDisplayed: [{ sId: 1 }] }));
    expect(store.getEventsByType('vwo_surveyDisplayed')).toEqual([displayedEvent]);
    store.resetCache();
    expect(store.getEventsByType('vwo_surveyDisplayed')).toEqual([{ sId: 1 }]);
    expect(store.getEventsByType(SUBMITTED)).toEqual([]);
  });

  test('ignores a history payload that is not an object', () => {
    const store = new SurveyEventStore(
      new MemoryStorage({ [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: JSON.stringify(['not', 'an', 'object']) }),
    );
    expect(store.getEventsByType(SUBMITTED)).toEqual([]);
  });
});
