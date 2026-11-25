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

import { init, IVWOOptions } from '../../lib';
import { WingifyBuilder } from '../../lib/WingifyBuilder';
import { SURVEY_EVENT_HISTORY_PRIMARY_KEY } from '../../lib/packages/segmentation-evaluator/utils/SurveyEventStoreUtil';
/** Valid SmartCode web uuid: D/J + exactly 32 hex chars. */
const PULSE_COOKIE_UUID = 'D0123456789ABCDEF0123456789ABCDEF';

const PULSE_FEATURE_KEY = 'pulseFeature';
const PLAIN_FEATURE_KEY = 'plainFeature';

/**
 * Rollout whose variation[0] segments require survey 252 to have been displayed.
 * A second feature has empty segments so the identity gate must not fire for it.
 */
const PULSE_SETTINGS = {
  version: 1,
  sdkKey: 'abcdef',
  accountId: 123456,
  campaigns: [
    {
      status: 'RUNNING',
      name: 'pulseFeature : Rollout',
      segments: {},
      type: 'FLAG_ROLLOUT',
      key: 'pulseFeature_rolloutRule1',
      id: 1,
      isAlwaysCheckSegment: false,
      isForcedVariationEnabled: false,
      variations: [
        {
          id: 1,
          name: 'Rollout-rule-1',
          weight: 100,
          variables: [
            {
              id: 1,
              type: 'string',
              key: 'message',
              value: 'pulse-ok',
            },
          ],
          segments: {
            or: [{ '252_vwo_surveyDisplayed': true }],
          },
        },
      ],
    },
    {
      status: 'RUNNING',
      name: 'plainFeature : Rollout',
      segments: {},
      type: 'FLAG_ROLLOUT',
      key: 'plainFeature_rolloutRule1',
      id: 2,
      isAlwaysCheckSegment: false,
      isForcedVariationEnabled: false,
      variations: [
        {
          id: 1,
          name: 'Rollout-rule-1',
          weight: 100,
          variables: [
            {
              id: 1,
              type: 'string',
              key: 'message',
              value: 'plain-ok',
            },
          ],
          segments: {},
        },
      ],
    },
  ],
  features: [
    {
      impactCampaign: {},
      status: 'ON',
      key: PULSE_FEATURE_KEY,
      name: 'pulseFeature',
      type: 'FEATURE_FLAG',
      id: 1,
      metrics: [{ type: 'CUSTOM_GOAL', identifier: 'e1', id: 1 }],
      rules: [
        {
          campaignId: 1,
          type: 'FLAG_ROLLOUT',
          ruleKey: 'rolloutRule1',
          variationId: 1,
        },
      ],
    },
    {
      impactCampaign: {},
      status: 'ON',
      key: PLAIN_FEATURE_KEY,
      name: 'plainFeature',
      type: 'FEATURE_FLAG',
      id: 2,
      metrics: [{ type: 'CUSTOM_GOAL', identifier: 'e2', id: 2 }],
      rules: [
        {
          campaignId: 2,
          type: 'FLAG_ROLLOUT',
          ruleKey: 'rolloutRule1',
          variationId: 1,
        },
      ],
    },
  ],
};

class MemoryLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

function installBrowserGlobals(cookie: string | null, eventHistory?: Record<string, unknown[]>): void {
  const localStorage = new MemoryLocalStorage();
  if (eventHistory) {
    localStorage.setItem(SURVEY_EVENT_HISTORY_PRIMARY_KEY, JSON.stringify(eventHistory));
  }

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    writable: true,
    value: {
      get cookie() {
        return cookie ?? '';
      },
    },
  });

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: { localStorage },
  });
}

function cleanupBrowserGlobals(): void {
  delete (globalThis as any).document;
  delete (globalThis as any).window;
}

async function createClient(isPulsePreSegmentEnabled: boolean) {
  const vwoOptions: IVWOOptions = {
    accountId: '123456',
    sdkKey: 'abcdef',
    isPulsePreSegmentEnabled,
    // Avoid hanging the suite on batch-event network retries in CI/sandbox.
    isBatchingDisabled: true,
    isDevelopmentMode: true,
  };
  const vwoBuilder = new WingifyBuilder(vwoOptions);
  jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(PULSE_SETTINGS as any);

  return init({
    sdkKey: 'sdk-key',
    accountId: 'account-id',
    isPulsePreSegmentEnabled,
    isBatchingDisabled: true,
    isDevelopmentMode: true,
    vwoBuilder,
  });
}

describe('Pulse pre-segmentation getFlag e2e', () => {
  let client: Awaited<ReturnType<typeof init>> | null = null;

  afterEach(async () => {
    if (client) {
      await client.shutdown();
      client = null;
    }
    cleanupBrowserGlobals();
    jest.restoreAllMocks();
  });

  test('cookie as id (no context.id) + matching survey event enables the flag', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(true);
    const flag = await client.getFlag(PULSE_FEATURE_KEY, {});

    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('message', '')).toBe('pulse-ok');
    expect(flag.getUUID()).toBe(PULSE_COOKIE_UUID);
  });

  test('matching web uuid in context.id evaluates Pulse and enables the flag', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(true);
    const flag = await client.getFlag(PULSE_FEATURE_KEY, { id: PULSE_COOKIE_UUID });

    expect(flag.isEnabled()).toBe(true);
  });

  test('mismatched userId skips Pulse leaves so the survey rule fails', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(true);
    const flag = await client.getFlag(PULSE_FEATURE_KEY, { id: 'user_123' });

    expect(flag.isEnabled()).toBe(false);
  });

  test('parallel getFlag calls cannot let a mismatched user through', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(true);
    const [pulseFlag, plainFlag] = await Promise.all([
      client.getFlag(PULSE_FEATURE_KEY, { id: 'user_123' }),
      client.getFlag(PLAIN_FEATURE_KEY, { id: 'user_123' }),
    ]);

    expect(pulseFlag.isEnabled()).toBe(false);
    expect(plainFlag.isEnabled()).toBe(true);
  });

  test('parallel getFlag calls for the cookie visitor both evaluate Pulse', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(true);
    const [pulseFlag, plainFlag] = await Promise.all([
      client.getFlag(PULSE_FEATURE_KEY, {}),
      client.getFlag(PLAIN_FEATURE_KEY, { id: PULSE_COOKIE_UUID }),
    ]);

    expect(pulseFlag.isEnabled()).toBe(true);
    expect(plainFlag.isEnabled()).toBe(true);
  });

  test('missing cookie with no context.id returns the disabled error schema', async () => {
    installBrowserGlobals(null, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(true);
    const flag = await client.getFlag(PULSE_FEATURE_KEY, {});

    // Gate cannot fill id; existing Invalid context path resolves to disabled Flag.
    expect(flag.isEnabled()).toBe(false);
  });

  test('missing cookie with userId skips Pulse and fails the survey rule', async () => {
    installBrowserGlobals(null, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(true);
    const flag = await client.getFlag(PULSE_FEATURE_KEY, { id: 'user_123' });

    expect(flag.isEnabled()).toBe(false);
  });

  test('matching identity but no survey event fails pre-seg', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`, {});

    client = await createClient(true);
    const flag = await client.getFlag(PULSE_FEATURE_KEY, {});

    expect(flag.isEnabled()).toBe(false);
  });

  test('isPulsePreSegmentEnabled false never adopts the cookie as id', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(false);
    const flag = await client.getFlag(PULSE_FEATURE_KEY, {});

    // Without the init flag, missing context.id still fails validation.
    expect(flag.isEnabled()).toBe(false);
  });

  test('isPulsePreSegmentEnabled false fails survey leaves even with a user id', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`, {
      vwo_surveyDisplayed: [{ sId: 252 }],
    });

    client = await createClient(false);
    const flag = await client.getFlag(PULSE_FEATURE_KEY, { id: PULSE_COOKIE_UUID });

    expect(flag.isEnabled()).toBe(false);
  });

  test('non-Pulse feature is unaffected by cookie / identity gate', async () => {
    installBrowserGlobals(null);

    client = await createClient(true);
    const flag = await client.getFlag(PLAIN_FEATURE_KEY, { id: 'user_123' });

    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('message', '')).toBe('plain-ok');
  });
});
