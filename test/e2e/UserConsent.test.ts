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
import { init } from '../../lib';
import { WingifyBuilder } from '../../lib/WingifyBuilder';
import { BASIC_ROLLOUT_SETTINGS } from '../data/Settings';
import { ServiceContainerRegistry } from '../../lib/services/ServiceContainerRegistry';

/**
 * Waits for fire-and-forget consent storage wipe promises to settle in tests.
 */
async function flushAsyncConsentWork(): Promise<void> {
  await new Promise((resolve) => setImmediate(resolve));
}

/**
 * Builds an in-memory storage connector with get, set, and removeStoredDecisionData spies.
 * Used to assert consent withdrawal wipes without hitting real storage.
 *
 * @returns Mock connector compatible with init({ storage }).
 */
function createMockStorageConnector() {
  const storedEntries: Record<string, any> = {};
  return {
    storage: storedEntries,
    get: jest.fn(async (featureKey: string, userId: string) => {
      return storedEntries[`${featureKey}_${userId}`] ?? {};
    }),
    set: jest.fn(async (data: Record<string, any>) => {
      storedEntries[`${data.featureKey}_${data.userId}`] = data;
    }),
    removeStoredDecisionData: jest.fn(async (featureKey: string | null, userId: string) => {
      if (featureKey != null) {
        delete storedEntries[`${featureKey}_${userId}`];
        return;
      }
      Object.keys(storedEntries).forEach((key) => {
        if (storedEntries[key]?.userId === userId) {
          delete storedEntries[key];
        }
      });
    }),
  };
}

/**
 * Initializes an SDK client for consent tests with settings mocked from BASIC_ROLLOUT_SETTINGS.
 *
 * @param storageConnector - Optional custom storage; when omitted, no persistence connector is used.
 * @returns Initialized client instance from init().
 */
async function createClient(storageConnector?: ReturnType<typeof createMockStorageConnector>) {
  const vwoBuilder = new WingifyBuilder({
    accountId: '123456',
    sdkKey: 'abcdef',
    storage: storageConnector,
  });
  jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(BASIC_ROLLOUT_SETTINGS as any);
  return init({
    sdkKey: 'sdk-key',
    accountId: 'account-id',
    storage: storageConnector,
    vwoBuilder,
  });
}

// End-to-end coverage for hasConsented gating and storage wipe on denied user API calls.
describe('User consent', () => {
  beforeEach(() => {
    process.env.TEST_ENV = 'true';
    ServiceContainerRegistry.clearForTests();
  });

  afterEach(() => {
    process.env.TEST_ENV = undefined;
    ServiceContainerRegistry.clearForTests();
    jest.clearAllMocks();
  });

  // Verifies normal flag evaluation when hasConsented is omitted (backward compatible default).
  it('evaluates getFlag when consent is not denied', async () => {
    const vwoClient = await createClient();
    const featureFlag = await vwoClient.getFlag('feature1', { id: 'user-1' });
    expect(featureFlag.isEnabled()).toBe(true);
  });

  // Verifies getFlag no-ops for denied users and wipes storage when context.id is set.
  it('getFlag returns disabled flag when hasConsented is false', async () => {
    const storageConnector = createMockStorageConnector();
    const vwoClient = await createClient(storageConnector);
    const featureFlag = await vwoClient.getFlag('feature1', { id: 'user-1', hasConsented: false });
    await flushAsyncConsentWork();
    expect(featureFlag.isEnabled()).toBe(false);
    expect(featureFlag.getVariable('string', 'fallback')).toBe('fallback');
    expect(storageConnector.removeStoredDecisionData).toHaveBeenCalledWith(null, 'user-1');
  });

  // Verifies consent gate does not require context.id (matches Android getFlag when denied).
  it('getFlag works without user id when consent is denied', async () => {
    const storageConnector = createMockStorageConnector();
    const vwoClient = await createClient(storageConnector);
    const featureFlag = await vwoClient.getFlag('feature1', { hasConsented: false });
    await flushAsyncConsentWork();
    expect(featureFlag.isEnabled()).toBe(false);
    expect(storageConnector.removeStoredDecisionData).not.toHaveBeenCalled();
  });

  // Verifies each denied API call with id triggers storage wipe again (idempotent remove).
  it('denied getFlag calls removeStoredDecisionData on every request when id is set', async () => {
    const storageConnector = createMockStorageConnector();
    const vwoClient = await createClient(storageConnector);
    const deniedContext = { id: 'user-1', hasConsented: false as const };
    await vwoClient.getFlag('feature1', deniedContext);
    await flushAsyncConsentWork();
    await vwoClient.getFlag('feature1', deniedContext);
    await flushAsyncConsentWork();
    expect(storageConnector.removeStoredDecisionData).toHaveBeenCalledTimes(2);
  });

  // Verifies getFlags returns disabled flags for requested keys and wipes storage when consent is denied.
  it('getFlags returns disabled flags when hasConsented is false', async () => {
    const storageConnector = createMockStorageConnector();
    const vwoClient = await createClient(storageConnector);
    const flags = await vwoClient.getFlags(['feature1'], { id: 'user-1', hasConsented: false });
    await flushAsyncConsentWork();
    expect(Object.keys(flags)).toEqual(['feature1']);
    expect(flags.feature1.isEnabled()).toBe(false);
    expect(flags.feature1.getVariable('string', 'fallback')).toBe('fallback');
    expect(storageConnector.removeStoredDecisionData).toHaveBeenCalledWith(null, 'user-1');
  });

  // Verifies fetchFlags with no keys returns a disabled flag for every settings feature when consent is denied.
  it('fetchFlags returns disabled flags for all features when hasConsented is false', async () => {
    const storageConnector = createMockStorageConnector();
    const vwoClient = await createClient(storageConnector);
    const allFeatureKeys = Object.keys(await vwoClient.fetchFlags(null, { id: 'user-1' }));
    const flags = await vwoClient.fetchFlags(null, { id: 'user-1', hasConsented: false });
    await flushAsyncConsentWork();
    expect(allFeatureKeys.length).toBeGreaterThan(0);
    expect(Object.keys(flags).sort()).toEqual(allFeatureKeys.sort());
    for (const featureKey of Object.keys(flags)) {
      expect(flags[featureKey].isEnabled()).toBe(false);
      await expect(flags[featureKey].exposeResult()).resolves.toBe(false);
    }
    expect(storageConnector.removeStoredDecisionData).toHaveBeenCalledWith(null, 'user-1');
  });

  // Verifies trackEvent returns failure for the event name and sends nothing when consent is denied.
  it('trackEvent returns false when consent is denied', async () => {
    const vwoClient = await createClient();
    const result = await vwoClient.trackEvent('custom1', { id: '123', hasConsented: false }, { key: 'value' });
    expect(result).toEqual({ custom1: false });
  });

  // Verifies setAttribute resolves without throwing and skips work when consent is denied.
  it('setAttribute no-ops when consent is denied', async () => {
    const vwoClient = await createClient();
    await expect(
      vwoClient.setAttribute({ plan: 'premium' }, { id: '123', hasConsented: false }),
    ).resolves.toBeUndefined();
  });

  // Verifies setAlias with context returns false when consent is denied.
  it('setAlias returns false when context consent is denied', async () => {
    const vwoClient = await createClient();
    const result = await vwoClient.setAlias({ id: 'user-1', hasConsented: false }, 'alias-1');
    expect(result).toBe(false);
  });

  // Verifies denied getFlag clears storage on every live client via ServiceContainerRegistry.
  it('denied getFlag removes stored data on every initialized client', async () => {
    const firstStorageConnector = createMockStorageConnector();
    const secondStorageConnector = createMockStorageConnector();
    const vwoClient = await createClient(firstStorageConnector);
    await createClient(secondStorageConnector);
    await vwoClient.getFlag('feature1', { id: 'user-wipe', hasConsented: false });
    await flushAsyncConsentWork();
    expect(firstStorageConnector.removeStoredDecisionData).toHaveBeenCalledWith(null, 'user-wipe');
    expect(secondStorageConnector.removeStoredDecisionData).toHaveBeenCalledWith(null, 'user-wipe');
  });

  // Verifies clients unregistered on shutdown are excluded from cross-client consent wipe.
  it('shut down client is not included in consent storage wipe', async () => {
    const activeStorageConnector = createMockStorageConnector();
    const shutDownStorageConnector = createMockStorageConnector();
    const activeClient = await createClient(activeStorageConnector);
    const shutDownClient = await createClient(shutDownStorageConnector);
    jest.spyOn(shutDownClient, 'flushEvents').mockResolvedValue({ status: 'success', events: [] });
    await shutDownClient.shutdown();
    await activeClient.getFlag('feature1', { id: 'user-1', hasConsented: false });
    await flushAsyncConsentWork();
    expect(activeStorageConnector.removeStoredDecisionData).toHaveBeenCalledWith(null, 'user-1');
    expect(shutDownStorageConnector.removeStoredDecisionData).not.toHaveBeenCalled();
  });
});
