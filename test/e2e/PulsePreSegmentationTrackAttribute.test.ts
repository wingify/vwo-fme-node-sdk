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
import { TrackApi } from '../../lib/api/TrackEvent';
import { SetAttributeApi } from '../../lib/api/SetAttribute';
import { BASIC_ROLLOUT_SETTINGS } from '../data/Settings';

/** Valid SmartCode web uuid: D/J + exactly 32 hex chars. */
const PULSE_COOKIE_UUID = 'D0123456789ABCDEF0123456789ABCDEF';

function installBrowserGlobals(cookie: string | null): void {
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
    value: { localStorage: { getItem: () => null } },
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
    isBatchingDisabled: true,
    isDevelopmentMode: true,
  };
  const vwoBuilder = new WingifyBuilder(vwoOptions);
  jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_SETTINGS as any);

  return init({
    sdkKey: 'sdk-key',
    accountId: 'account-id',
    isPulsePreSegmentEnabled,
    isBatchingDisabled: true,
    isDevelopmentMode: true,
    vwoBuilder,
  });
}

describe('Pulse cookie identity for trackEvent and setAttribute e2e', () => {
  let client: Awaited<ReturnType<typeof init>> | null = null;
  let trackSpy: jest.SpyInstance;
  let setAttributeSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.TEST_ENV = 'true';
    trackSpy = jest.spyOn(TrackApi.prototype, 'track').mockResolvedValue({ custom1: true });
    setAttributeSpy = jest.spyOn(SetAttributeApi.prototype, 'setAttribute').mockResolvedValue();
  });

  afterEach(async () => {
    if (client) {
      await client.shutdown();
      client = null;
    }
    cleanupBrowserGlobals();
    jest.restoreAllMocks();
    process.env.TEST_ENV = undefined;
  });

  test('trackEvent with Pulse on and cookie adopts cookie as id', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`);
    client = await createClient(true);

    const result = await client.trackEvent('custom1', {}, { key: 'value' });

    expect(result).toEqual({ custom1: true });
    expect(trackSpy).toHaveBeenCalled();
    const contextModel = trackSpy.mock.calls[0][2];
    expect(contextModel.getId()).toBe(PULSE_COOKIE_UUID);
    expect(contextModel.getUuid()).toBe(PULSE_COOKIE_UUID);
  });

  test('setAttribute map with Pulse on and cookie adopts cookie as id', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`);
    client = await createClient(true);

    await client.setAttribute({ plan: 'pro' }, {});

    expect(setAttributeSpy).toHaveBeenCalled();
    const contextModel = setAttributeSpy.mock.calls[0][2];
    expect(contextModel.getId()).toBe(PULSE_COOKIE_UUID);
    expect(contextModel.getUuid()).toBe(PULSE_COOKIE_UUID);
  });

  test('setAttribute single key with Pulse on and cookie adopts cookie as id and uuid', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`);
    client = await createClient(true);

    await client.setAttribute('plan', 'pro', {});

    expect(setAttributeSpy).toHaveBeenCalled();
    const contextModel = setAttributeSpy.mock.calls[0][2];
    expect(contextModel.getId()).toBe(PULSE_COOKIE_UUID);
    expect(contextModel.getUuid()).toBe(PULSE_COOKIE_UUID);
  });

  test('setAttribute map with Pulse on and no cookie still requires id', async () => {
    installBrowserGlobals(null);
    client = await createClient(true);

    await client.setAttribute({ plan: 'pro' }, {});

    expect(setAttributeSpy).not.toHaveBeenCalled();
  });

  test('setAttribute single key with Pulse on and no cookie still requires id', async () => {
    installBrowserGlobals(null);
    client = await createClient(true);

    await client.setAttribute('plan', 'pro', {});

    expect(setAttributeSpy).not.toHaveBeenCalled();
  });

  test('setAttribute map with Pulse off and no id still requires id even when cookie is present', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`);
    client = await createClient(false);

    await client.setAttribute({ plan: 'pro' }, {});

    expect(setAttributeSpy).not.toHaveBeenCalled();
  });

  test('trackEvent with Pulse on and no cookie still requires id', async () => {
    installBrowserGlobals(null);
    client = await createClient(true);

    const result = await client.trackEvent('custom1', {}, { key: 'value' });

    expect(result).toEqual({ custom1: false });
    expect(trackSpy).not.toHaveBeenCalled();
  });

  test('trackEvent with Pulse off and no id still requires id even when cookie is present', async () => {
    installBrowserGlobals(`_vwo_uuid=${PULSE_COOKIE_UUID}`);
    client = await createClient(false);

    const result = await client.trackEvent('custom1', {}, { key: 'value' });

    expect(result).toEqual({ custom1: false });
    expect(trackSpy).not.toHaveBeenCalled();
  });
});
