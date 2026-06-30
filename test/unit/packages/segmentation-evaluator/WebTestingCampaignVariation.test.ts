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
import { SegmentEvaluator } from '../../../../lib/packages/segmentation-evaluator';
import { SegmentOperandEvaluator } from '../../../../lib/packages/segmentation-evaluator/evaluators/SegmentOperandEvaluator';
import { SegmentationManager } from '../../../../lib/packages/segmentation-evaluator/core/SegmentationManger';
import { ServiceContainer } from '../../../../lib/services/ServiceContainer';
import { LogManager } from '../../../../lib/packages/logger';
import { LogLevelEnum } from '../../../../lib/enums/LogLevelEnum';
import { ContextModel } from '../../../../lib/models/user/ContextModel';
import { IWingifyOptions } from '../../../../lib/models/WingifyOptionsModel';
import {
  evaluateWebTestingCampaignVariation,
  normalizeWebTestingCampaignsMap,
  parseWebTestingCampaignsFromContext,
} from '../../../../lib/packages/segmentation-evaluator/utils/WebTestingSegmentUtil';

const testOptions = { accountId: 1, sdkKey: 'sdk-key' } as IWingifyOptions;

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
    getVWOOptions: () => ({}),
    getBatchEventsQueue: () => ({}),
    getSegmentationManager: () => ({}),
    getBaseUrl: () => '',
    getNetworkManager: () => ({}),
    getStorageConnector: () => null,
  } as unknown as ServiceContainer;
};

const createSegmentEvaluatorWithContext = (contextFields: Record<string, any>): SegmentEvaluator => {
  const segmentEvaluator = new SegmentEvaluator();
  const mockServiceContainer = createMockServiceContainer();
  segmentEvaluator.serviceContainer = mockServiceContainer;
  segmentEvaluator.segmentOperandEvaluator = new SegmentOperandEvaluator(mockServiceContainer);
  segmentEvaluator.context = new ContextModel().modelFromDictionary({ id: 'user-1', ...contextFields }, testOptions);
  return segmentEvaluator;
};

describe('WebTestingCampaignVariation', () => {
  describe('evaluateWebTestingCampaignVariation', () => {
    const map = { '1': '1', '2': '2' };

    test('C_V matches when user is in campaign with variation', () => {
      expect(evaluateWebTestingCampaignVariation('1_1', map).result).toBe(true);
      expect(evaluateWebTestingCampaignVariation('1_1', map).invalidFormat).toBe(false);
    });

    test('C_V false when variation differs', () => {
      expect(evaluateWebTestingCampaignVariation('1_2', map).result).toBe(false);
    });

    test('C_V false when not in campaign', () => {
      expect(evaluateWebTestingCampaignVariation('99_1', map).result).toBe(false);
    });

    test('C_!V when in campaign and variation not V', () => {
      expect(evaluateWebTestingCampaignVariation('1_!2', map).result).toBe(true);
    });

    test('C_!V false when variation equals V', () => {
      expect(evaluateWebTestingCampaignVariation('1_!1', map).result).toBe(false);
    });

    test('C_!V false when not in campaign', () => {
      expect(evaluateWebTestingCampaignVariation('99_!1', map).result).toBe(false);
    });

    test('!C true when not in campaign', () => {
      expect(evaluateWebTestingCampaignVariation('!99', map).result).toBe(true);
    });

    test('!C false when in campaign', () => {
      expect(evaluateWebTestingCampaignVariation('!1', map).result).toBe(false);
    });

    test('null map behaves like empty', () => {
      expect(evaluateWebTestingCampaignVariation('!1', null).result).toBe(true);
      expect(evaluateWebTestingCampaignVariation('1_1', null).result).toBe(false);
    });

    test('invalid operand encoding', () => {
      const r = evaluateWebTestingCampaignVariation('bogus', map);
      expect(r.result).toBe(false);
      expect(r.invalidFormat).toBe(true);
    });

    test('multi-digit campaign and variation ids', () => {
      const m = { '122': '4' };
      expect(evaluateWebTestingCampaignVariation('122_4', m).result).toBe(true);
      expect(evaluateWebTestingCampaignVariation('122_!1', m).result).toBe(true);
      expect(evaluateWebTestingCampaignVariation('!122', m).result).toBe(false);
    });

    test('C alone: in campaign C with any variation', () => {
      expect(evaluateWebTestingCampaignVariation('100', { '100': '1' }).result).toBe(true);
      expect(evaluateWebTestingCampaignVariation('100', { '100': '9' }).result).toBe(true);
      expect(evaluateWebTestingCampaignVariation('100', {}).result).toBe(false);
      expect(evaluateWebTestingCampaignVariation('100', { '99': '1' }).result).toBe(false);
      expect(evaluateWebTestingCampaignVariation('100', map).result).toBe(false);
    });
  });

  describe('normalizeWebTestingCampaignsMap', () => {
    test('coerces keys and values to strings', () => {
      expect(normalizeWebTestingCampaignsMap({ 129: 1, '14': 2 } as any)).toEqual({ '129': '1', '14': '2' });
    });
  });

  describe('SegmentEvaluator campaignVariation DSL', () => {
    test('or branch with campaignVariation and JSON string webTestingCampaigns', async () => {
      const dsl = { or: [{ campaignVariation: '1_1' }] };
      const ev = createSegmentEvaluatorWithContext({
        platformVariables: { webTestingCampaigns: JSON.stringify({ '1': '1' }) },
      });
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(true);
    });

    test('object webTestingCampaigns without stringify', async () => {
      const dsl = { or: [{ campaignVariation: '1_1' }] };
      const ev = createSegmentEvaluatorWithContext({
        platformVariables: { webTestingCampaigns: { '1': 1 } },
      });
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(true);
    });

    test('numeric campaignVariation (JSON number) without platformVariables — not in campaign', async () => {
      const dsl = { not: { or: [{ campaignVariation: 104 }] } };
      const ev = createSegmentEvaluatorWithContext({});
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(true);
    });

    test('numeric campaignVariation matches webTestingCampaigns when in campaign', async () => {
      const dsl = { or: [{ campaignVariation: 104 }] };
      const ev = createSegmentEvaluatorWithContext({
        platformVariables: { webTestingCampaigns: '{"104":"1"}' },
      });
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(true);
    });

    test('not in campaign', async () => {
      const dsl = { or: [{ campaignVariation: '!1' }] };
      const ev = createSegmentEvaluatorWithContext({
        platformVariables: { webTestingCampaigns: '{}' },
      });
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(true);
    });

    test('nested not + campaignVariation', async () => {
      const dsl = { not: { campaignVariation: '1_1' } };
      const ev = createSegmentEvaluatorWithContext({
        platformVariables: { webTestingCampaigns: '{"1":"1"}' },
      });
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(false);
    });

    test('campaign id only: any variation in campaign', async () => {
      const dsl = { or: [{ campaignVariation: '100' }] };
      const ev = createSegmentEvaluatorWithContext({
        platformVariables: { webTestingCampaigns: '{"100":"2"}' },
      });
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(true);
    });

    test('operand string is trimmed (leading/trailing spaces)', async () => {
      const dsl = { or: [{ campaignVariation: '  1_1  ' }] };
      const ev = createSegmentEvaluatorWithContext({
        platformVariables: { webTestingCampaigns: '{"1":"1"}' },
      });
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(true);
    });

    test('webTestingCampaigns JSON array is rejected (empty map)', async () => {
      const dsl = { or: [{ campaignVariation: '1_1' }] };
      const ev = createSegmentEvaluatorWithContext({
        platformVariables: { webTestingCampaigns: '[]' },
      });
      await expect(ev.isSegmentationValid(dsl, {})).resolves.toBe(false);
    });
  });

  describe('parseWebTestingCampaignsFromContext duplicate key detection', () => {
    const makeContext = (webTestingCampaigns: unknown) =>
      new ContextModel().modelFromDictionary({ id: 'u1', platformVariables: { webTestingCampaigns } }, testOptions);

    test('duplicate key in JSON string triggers error log and still parses (last value wins)', () => {
      const sc = createMockServiceContainer();
      const logManager = sc.getLogManager() as LogManager;
      const errorSpy = jest.spyOn(logManager, 'errorLog');

      const ctx = makeContext('{"1":0,"1":1}');
      const result = parseWebTestingCampaignsFromContext(ctx, sc);

      expect(errorSpy).toHaveBeenCalledWith(
        'INVALID_WEB_TESTING_CAMPAIGNS_DUPLICATE_KEY',
        {},
        expect.objectContaining({ an: expect.anything() }),
      );
      // last-wins: "1" → "1"
      expect(result).toEqual({ '1': '1' });
    });

    test('no duplicate keys — no error log', () => {
      const sc = createMockServiceContainer();
      const logManager = sc.getLogManager() as LogManager;
      const errorSpy = jest.spyOn(logManager, 'errorLog');

      const ctx = makeContext('{"1":0,"2":1}');
      parseWebTestingCampaignsFromContext(ctx, sc);

      expect(errorSpy).not.toHaveBeenCalledWith(
        'INVALID_WEB_TESTING_CAMPAIGNS_DUPLICATE_KEY',
        expect.anything(),
        expect.anything(),
      );
    });
  });

  describe('SegmentationManager validateSegmentation — no platformVariables', () => {
    const createManager = (contextFields: Record<string, any>) => {
      const sc = createMockServiceContainer();
      const manager = new SegmentationManager();
      manager.evaluator.serviceContainer = sc;
      manager.evaluator.segmentOperandEvaluator = new SegmentOperandEvaluator(sc);
      manager.evaluator.context = new ContextModel().modelFromDictionary({ id: 'u1', ...contextFields }, testOptions);
      return manager;
    };

    test('positive campaignVariation with no platformVariables — fails silently', async () => {
      const dsl = { or: [{ campaignVariation: '122_2' }] };
      await expect(createManager({}).validateSegmentation(dsl, {})).resolves.toBe(false);
    });

    test('not + campaignVariation with no platformVariables — fails silently', async () => {
      const dsl = { not: { or: [{ campaignVariation: '122' }] } };
      await expect(createManager({}).validateSegmentation(dsl, {})).resolves.toBe(false);
    });

    test('campaignVariation with webTestingCampaigns present — evaluates normally', async () => {
      // user not in campaign 122 → not-in-122 passes
      const dsl = { not: { or: [{ campaignVariation: '122' }] } };
      const manager = createManager({ platformVariables: { webTestingCampaigns: '{}' } });
      await expect(manager.validateSegmentation(dsl, {})).resolves.toBe(true);
    });

    test('non-web DSL with no platformVariables — not affected', async () => {
      const dsl = { or: [{ custom_variable: { plan: 'premium' } }] };
      const manager = createManager({});
      // no campaignVariation in DSL → goes through normal evaluation → fails (no matching custom_variable)
      await expect(manager.validateSegmentation(dsl, {})).resolves.toBe(false);
    });
  });
});
