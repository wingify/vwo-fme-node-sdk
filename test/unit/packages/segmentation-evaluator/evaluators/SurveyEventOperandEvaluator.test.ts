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
import { SurveyEventOperandEvaluator } from '../../../../../lib/packages/segmentation-evaluator/evaluators/SurveyEventOperandEvaluator';
import { SurveyEventStore } from '../../../../../lib/packages/segmentation-evaluator/utils/SurveyEventStoreUtil';
import { SegmentEvaluator } from '../../../../../lib/packages/segmentation-evaluator';
import { SegmentOperandEvaluator } from '../../../../../lib/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator';
import { ServiceContainer } from '../../../../../lib/services/ServiceContainer';
import { LogManager } from '../../../../../lib/packages/logger';
import { LogLevelEnum } from '../../../../../lib/enums/LogLevelEnum';
import { SURVEY_EVENT_HISTORY_PRIMARY_KEY } from '../../../../../lib/packages/segmentation-evaluator/utils/SurveyEventStoreUtil';
import { ContextModel } from '../../../../../lib/models/user/ContextModel';

const createMockServiceContainer = (): ServiceContainer => {
  const mockLogManager = new LogManager({
    isAlwaysNewInstance: true,
    level: LogLevelEnum.ERROR,
  });
  return {
    getLogManager: () => mockLogManager,
    getSettings: () => ({}),
    getSettingsService: () => ({}),
    getHooksService: () => ({}),
    getWingifyOptions: () => ({}),
    getBatchEventsQueue: () => ({}),
    getSegmentationManager: () => ({}),
    getBaseUrl: () => '',
    getNetworkManager: () => ({}),
    getStorageConnector: () => null,
  } as ServiceContainer;
};

class MemoryStorage {
  constructor(private readonly values: Record<string, string> = {}) {}
  getItem(key: string): string | null {
    return this.values[key] ?? null;
  }
}

const historyWithEvents = (events: Record<string, unknown>[]) =>
  JSON.stringify({ vwo_surveyQuestionSubmitted: events });

describe('SurveyEventOperandEvaluator', () => {
  const serviceContainer = createMockServiceContainer();

  const createEvaluator = (events: Record<string, unknown>[]) => {
    const store = new SurveyEventStore(
      new MemoryStorage({
        [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: historyWithEvents(events),
      }),
    );
    return new SurveyEventOperandEvaluator(serviceContainer, store);
  };

  test('matches radio option id on a specific question', () => {
    const evaluator = createEvaluator([
      {
        sId: 392797,
        qId: 1891366,
        responses: { '1891366': ['1'] },
      },
    ]);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891366': '1' })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891366': 1 })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891366': '2' })).toBe(false);
  });

  test('matches text and wildcard on submitted answers', () => {
    const evaluator = createEvaluator([
      {
        sId: 392797,
        qId: 1891369,
        responses: { '1891369': ['testing'] },
      },
    ]);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891369': 'testing' })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891369': 'wildcard(*test*)' })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891369': 'wildcard(*nope*)' })).toBe(false);
  });

  test('unwraps multi_select other option id and typed value', () => {
    const evaluator = createEvaluator([
      {
        sId: 392797,
        qId: 1891393,
        responses: { '1891393': ['1', '2', { id: '0', value: 'CC' }] },
      },
    ]);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891393': '0' })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891393': 'wildcard(*CC*)' })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted_1891393': '3' })).toBe(false);
  });

  test('aggregate true matches any submitted question in the survey', () => {
    const evaluator = createEvaluator([
      {
        sId: 392797,
        qId: 1891366,
        responses: { '1891366': ['1'] },
      },
    ]);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionSubmitted': true })).toBe(true);
    expect(evaluator.evaluate({ vwo_surveyQuestionSubmitted: true })).toBe(true);
    expect(evaluator.evaluate({ '1_vwo_surveyQuestionSubmitted': true })).toBe(false);
  });

  test('events web does not drop yet fail closed', () => {
    const evaluator = createEvaluator([
      {
        sId: 392797,
        qId: 1891366,
        responses: { '1891366': ['1'] },
      },
    ]);
    expect(evaluator.evaluate({ vwo_surveyCompleted: true })).toBe(false);
    expect(evaluator.evaluate({ vwo_surveyClosed: true })).toBe(false);
    expect(evaluator.evaluate({ vwo_surveyReachedThankyou: true })).toBe(false);
    expect(evaluator.evaluate({ plan: 'pro' })).toBeNull();
  });
});

describe('SurveyEventOperandEvaluator presence events', () => {
  const serviceContainer = createMockServiceContainer();

  const createEvaluator = (history: Record<string, unknown[]>) =>
    new SurveyEventOperandEvaluator(
      serviceContainer,
      new SurveyEventStore(new MemoryStorage({ [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: JSON.stringify(history) })),
    );

  test('survey level displayed matches presence and absence', () => {
    const evaluator = createEvaluator({
      vwo_surveyDisplayed: [{ sId: 392797 }],
    });
    expect(evaluator.evaluate({ '392797_vwo_surveyDisplayed': true })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyDisplayed': false })).toBe(false);
    expect(evaluator.evaluate({ vwo_surveyDisplayed: true })).toBe(true);

    // A survey the user never saw: `true` fails and `false` passes.
    expect(evaluator.evaluate({ '111_vwo_surveyDisplayed': true })).toBe(false);
    expect(evaluator.evaluate({ '111_vwo_surveyDisplayed': false })).toBe(true);
  });

  test('attempted is independent of displayed', () => {
    const evaluator = createEvaluator({
      vwo_surveyDisplayed: [{ sId: 392797 }],
    });
    expect(evaluator.evaluate({ '392797_vwo_surveyAttempted': true })).toBe(false);
    expect(evaluator.evaluate({ '392797_vwo_surveyAttempted': false })).toBe(true);
  });

  test('question level presence honours question ids and any-question wildcards', () => {
    const evaluator = createEvaluator({
      vwo_surveyQuestionDisplayed: [
        { sId: 392797, qId: 1891366 },
        { sId: 392797, qId: 1891369 },
      ],
      vwo_surveyQuestionAttempted: [{ sId: 392797, qId: 1891366 }],
    });
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionDisplayed_1891369': true })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionDisplayed_1891372': true })).toBe(false);
    // Any question in the survey.
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionDisplayed': true })).toBe(true);

    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionAttempted_1891366': true })).toBe(true);
    expect(evaluator.evaluate({ '392797_vwo_surveyQuestionAttempted_1891369': true })).toBe(false);
  });

  test('presence operands that are not boolean fail closed', () => {
    const evaluator = createEvaluator({
      vwo_surveyDisplayed: [{ sId: 392797 }],
    });
    expect(evaluator.evaluate({ '392797_vwo_surveyDisplayed': 'true' })).toBe(false);
    expect(evaluator.evaluate({ '392797_vwo_surveyDisplayed': 1 })).toBe(false);
  });

  test('events missing sId are ignored', () => {
    const evaluator = createEvaluator({
      vwo_surveyDisplayed: [{ ts: 123 }],
    });
    expect(evaluator.evaluate({ vwo_surveyDisplayed: true })).toBe(false);
  });
});

describe('SegmentEvaluator survey leaves', () => {
  const VISITOR_UUID = 'D0123456789ABCDEF0123456789ABCDEF';
  const SUBMITTED_DSL = { or: [{ '392797_vwo_surveyQuestionSubmitted_1891366': '1' }] };

  const setCookie = (cookie: string) => {
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      writable: true,
      value: { cookie },
    });
  };

  afterEach(() => {
    delete (globalThis as any).document;
  });

  const createSegmentEvaluator = (isPulsePreSegmentEnabled: boolean, contextUuid: string) => {
    const serviceContainer = {
      ...createMockServiceContainer(),
      getWingifyOptions: () => ({ isPulsePreSegmentEnabled }),
    } as ServiceContainer;
    const store = new SurveyEventStore(
      new MemoryStorage({
        [SURVEY_EVENT_HISTORY_PRIMARY_KEY]: historyWithEvents([
          {
            sId: 392797,
            qId: 1891366,
            responses: { '1891366': ['1'] },
          },
        ]),
      }),
    );
    const segmentEvaluator = new SegmentEvaluator();
    segmentEvaluator.serviceContainer = serviceContainer;
    segmentEvaluator.context = { getUuid: () => contextUuid } as ContextModel;
    segmentEvaluator.segmentOperandEvaluator = new SegmentOperandEvaluator(serviceContainer);
    segmentEvaluator.surveyEventStore = store;
    segmentEvaluator.surveyEventOperandEvaluator = new SurveyEventOperandEvaluator(serviceContainer, store);
    return segmentEvaluator;
  };

  test('evaluates a wrapped or-tree of submitted keys for the verified visitor', async () => {
    setCookie(`_vwo_uuid=${VISITOR_UUID}`);
    const segmentEvaluator = createSegmentEvaluator(true, VISITOR_UUID);

    expect(await segmentEvaluator.isSegmentationValid(SUBMITTED_DSL, {})).toBe(true);
  });

  test('fails survey leaves when the evaluated uuid is not the cookie visitor', async () => {
    setCookie(`_vwo_uuid=${VISITOR_UUID}`);
    const segmentEvaluator = createSegmentEvaluator(true, 'SOME-OTHER-UUID');

    expect(await segmentEvaluator.isSegmentationValid(SUBMITTED_DSL, {})).toBe(false);
  });

  test('fails survey leaves when isPulsePreSegmentEnabled is off', async () => {
    setCookie(`_vwo_uuid=${VISITOR_UUID}`);
    const segmentEvaluator = createSegmentEvaluator(false, VISITOR_UUID);

    expect(await segmentEvaluator.isSegmentationValid(SUBMITTED_DSL, {})).toBe(false);
  });
});
