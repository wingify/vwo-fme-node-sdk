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

import { Flag, FlagApi } from '../../../lib/api/GetFlag';
import { GetFlagsApi } from '../../../lib/api/GetFlags';
import { WingifyClient } from '../../../lib/WingifyClient';
import { ServiceContainer } from '../../../lib/services/ServiceContainer';
import * as GetFlagsBatchContext from '../../../lib/services/GetFlagsBatchContext';
import * as NetworkUtil from '../../../lib/utils/NetworkUtil';
import { setSettingsAndAddCampaignsToRules } from '../../../lib/utils/SettingsUtil';
import { SETTINGS_WITH_DIFFERENT_SALT } from '../../data/Settings';
import { SettingsControlApplyMode } from '../../../lib/services/PanicModeForcedRefreshControlService';

/** Shared log manager stub used while building settings and ServiceContainer. */
const mockLogManager = { info: jest.fn(), debug: jest.fn(), errorLog: jest.fn() } as any;

/**
 * Builds a ServiceContainer with settings loaded from the shared test fixture.
 *
 * @returns ServiceContainer ready for GetFlagsApi.get calls.
 */
function createTestServiceContainer(): ServiceContainer {
  const client = { settings: null as any, originalSettings: null as any };
  setSettingsAndAddCampaignsToRules(SETTINGS_WITH_DIFFERENT_SALT as any, client as any, mockLogManager);

  const serviceContainer = new ServiceContainer({} as any);
  serviceContainer.setSettings(client.settings);
  serviceContainer.setLogManager(mockLogManager);

  return serviceContainer;
}

// Browser path: no ALS, so getFlags uses the promise queue and shared suppress flags.
describe('GetFlagsApi tracking suppression with browser queue', () => {
  let serviceContainer: ServiceContainer;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    serviceContainer = createTestServiceContainer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Suppress flags must be cleared in finally so later getFlag/getFlags calls are not affected.
  it('resets ServiceContainer suppression after sequential evaluation completes', async () => {
    // Force browser/sequential path.
    jest.spyOn(GetFlagsBatchContext, 'supportsParallelGetFlagsBatches').mockReturnValue(false);
    jest.spyOn(FlagApi, 'get').mockResolvedValue(new Flag(true, 1, 'uuid', {} as any));

    // shouldSendTrackingCalls = false sets suppress=true during evaluation.
    await GetFlagsApi.get(['feature1'], { id: 'user-1', customVariables: {} }, serviceContainer, {} as any, false);

    // After the call, shared container suppress flag must be back to false.
    expect(serviceContainer.getSuppressTrackingCalls()).toBe(false);
  });

  // Per-flag failures become disabled Flags and still reset suppress flags.
  it('returns a disabled Flag and resets suppression when evaluation fails', async () => {
    jest.spyOn(GetFlagsBatchContext, 'supportsParallelGetFlagsBatches').mockReturnValue(false);
    jest.spyOn(FlagApi, 'get').mockRejectedValue(new Error('evaluation failed'));

    const flags = await GetFlagsApi.get(
      ['feature1'],
      { id: 'user-1', customVariables: {}, uuid: 'uuid-1', sessionId: 123 },
      serviceContainer,
      {} as any,
      false,
    );

    // Requested key is still present, but disabled because FlagApi.get threw.
    expect(Object.keys(flags)).toEqual(['feature1']);
    expect(flags.feature1.isEnabled()).toBe(false);
    expect(serviceContainer.getSuppressTrackingCalls()).toBe(false);
  });

  // Concurrent browser getFlags must not interleave (shared suppress flags / manager).
  it('serializes browser getFlags calls to prevent flag contamination', async () => {
    jest.spyOn(GetFlagsBatchContext, 'supportsParallelGetFlagsBatches').mockReturnValue(false);

    const executionOrder: string[] = [];

    // Slow FlagApi.get so overlapping calls would race without the queue.
    jest.spyOn(FlagApi, 'get').mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return new Flag(true, 1, 'uuid', {} as any);
    });

    // Fire both calls without await (simulating fire-and-forget).
    const promise1 = GetFlagsApi.get(['f1'], { id: 'u1' }, serviceContainer, {} as any, true).then(() => {
      executionOrder.push('call1-complete');
    });

    // Second call uses opposite tracking mode; queue must keep them ordered.
    const promise2 = GetFlagsApi.get(['f2'], { id: 'u2' }, serviceContainer, {} as any, false).then(() => {
      executionOrder.push('call2-complete');
    });

    await Promise.all([promise1, promise2]);

    // Queue ensures call1 completes before call2 starts.
    expect(executionOrder).toEqual(['call1-complete', 'call2-complete']);
  });
});

// Soft-failure behavior: every requested key must appear; missing/failed ones are disabled Flags.
describe('GetFlagsApi disabled Flag for unknown/failed keys', () => {
  let serviceContainer: ServiceContainer;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    serviceContainer = createTestServiceContainer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Node parallel path: one FlagApi.get reject must not drop other keys from the result.
  it('keeps every requested key when one FlagApi.get rejects (Node parallel)', async () => {
    jest.spyOn(GetFlagsBatchContext, 'supportsParallelGetFlagsBatches').mockReturnValue(true);
    jest.spyOn(FlagApi, 'get').mockImplementation(async (featureKey: string) => {
      if (featureKey === 'missing-feature') {
        throw {};
      }
      return new Flag(true, 1, 'uuid', {} as any);
    });

    const flags = await GetFlagsApi.get(
      ['feature1', 'missing-feature'],
      { id: 'user-1', customVariables: {}, uuid: 'uuid-1', sessionId: 123 },
      serviceContainer,
      {} as any,
      true,
    );

    expect(Object.keys(flags).sort()).toEqual(['feature1', 'missing-feature']);
    expect(flags.feature1.isEnabled()).toBe(true);
    expect(flags['missing-feature'].isEnabled()).toBe(false);
  });

  // Node parallel path: rejected batch is skipped; ensureAllRequestedFlags fills those keys as disabled.
  it('fills missing keys with disabled Flags when a whole batch rejects (Node parallel)', async () => {
    jest.spyOn(GetFlagsBatchContext, 'supportsParallelGetFlagsBatches').mockReturnValue(true);
    jest.spyOn(FlagApi, 'get').mockResolvedValue(new Flag(true, 1, 'uuid', {} as any));

    // First batch worker throws; second batch still runs via Promise.allSettled.
    let batchCallCount = 0;
    jest.spyOn(GetFlagsBatchContext, 'runWithGetFlagsBatchContext').mockImplementation(async (fn: any) => {
      batchCallCount += 1;
      if (batchCallCount === 1) {
        throw new Error('batch worker failed');
      }
      return fn();
    });

    const flags = await GetFlagsApi.get(
      ['feature1', 'feature2'],
      { id: 'user-1', customVariables: {}, uuid: 'uuid-1', sessionId: 123 },
      serviceContainer,
      {} as any,
      true,
    );

    // One batch succeeded, one failed → one enabled + one disabled fill-in.
    expect(Object.keys(flags).sort()).toEqual(['feature1', 'feature2']);
    const enabledCount = Object.values(flags).filter((flag) => flag.isEnabled()).length;
    const disabledCount = Object.values(flags).filter((flag) => !flag.isEnabled()).length;
    expect(enabledCount).toBe(1);
    expect(disabledCount).toBe(1);
  });

  // Browser sequential path: same soft-failure contract as Node for a single FlagApi.get reject.
  it('keeps every requested key when one FlagApi.get rejects (browser sequential)', async () => {
    jest.spyOn(GetFlagsBatchContext, 'supportsParallelGetFlagsBatches').mockReturnValue(false);
    jest.spyOn(FlagApi, 'get').mockImplementation(async (featureKey: string) => {
      if (featureKey === 'missing-feature') {
        throw {};
      }
      return new Flag(true, 1, 'uuid', {} as any);
    });

    const flags = await GetFlagsApi.get(
      ['feature1', 'missing-feature'],
      { id: 'user-1', customVariables: {}, uuid: 'uuid-1', sessionId: 123 },
      serviceContainer,
      {} as any,
      true,
    );

    expect(Object.keys(flags).sort()).toEqual(['feature1', 'missing-feature']);
    expect(flags.feature1.isEnabled()).toBe(true);
    expect(flags['missing-feature'].isEnabled()).toBe(false);
  });

  // Browser sequential path: later batches still run after an earlier batch reject; suppress flags reset.
  it('keeps prior batch successes when a whole batch rejects (browser sequential)', async () => {
    jest.spyOn(GetFlagsBatchContext, 'supportsParallelGetFlagsBatches').mockReturnValue(false);
    jest.spyOn(FlagApi, 'get').mockResolvedValue(new Flag(true, 1, 'uuid', {} as any));

    // First batch throws; remaining batches continue in the sequential loop.
    let batchCallCount = 0;
    jest.spyOn(GetFlagsBatchContext, 'runWithGetFlagsBatchContext').mockImplementation(async (fn: any) => {
      batchCallCount += 1;
      if (batchCallCount === 1) {
        throw new Error('batch worker failed');
      }
      return fn();
    });

    const flags = await GetFlagsApi.get(
      ['feature1', 'feature2'],
      { id: 'user-1', customVariables: {}, uuid: 'uuid-1', sessionId: 123 },
      serviceContainer,
      {} as any,
      true,
    );

    expect(Object.keys(flags).sort()).toEqual(['feature1', 'feature2']);
    const enabledCount = Object.values(flags).filter((flag) => flag.isEnabled()).length;
    const disabledCount = Object.values(flags).filter((flag) => !flag.isEnabled()).length;
    expect(enabledCount).toBe(1);
    expect(disabledCount).toBe(1);
    // Browser finally block must clear shared suppress flags even when a batch failed.
    expect(serviceContainer.getSuppressTrackingCalls()).toBe(false);
  });
});

// Ensures getFlags matches getFlag under panic: block evaluation, send collect heartbeat, return disabled Flags.
describe('WingifyClient.getFlags panic guard', () => {
  let serviceContainer: ServiceContainer;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    serviceContainer = createTestServiceContainer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Panic on → heartbeat only, no GetFlagsApi.get, disabled Flag per requested key.
  it('returns disabled flags, sends heartbeat, and skips GetFlagsApi when panic is active', async () => {
    serviceContainer.getPanicModeForcedRefreshControlService().applySettingsControl(
      {
        lastUpdatedOn: '1',
        sdkMetaInfo: { panic: 1700000000 },
      },
      SettingsControlApplyMode.APPLY,
    );

    const heartbeatSpy = jest.spyOn(NetworkUtil, 'sendPanicCollectHeartbeatRequest').mockResolvedValue(undefined);
    const getFlagsApiSpy = jest.spyOn(GetFlagsApi, 'get').mockResolvedValue({ shouldNotRun: true } as any);

    // Avoid full constructor (settings service / init events); only exercise getFlags.
    const client = Object.create(WingifyClient.prototype) as WingifyClient;
    client.serviceContainer = serviceContainer;
    client.isSettingsValid = true;
    client.isAliasingEnabled = false;
    client.options = {} as any;
    jest.spyOn(client as any, 'getUUIDFromContext').mockReturnValue('uuid-panic');

    const flags = await client.getFlags(['feature1', 'feature2'], { id: 'user-1', sessionId: 42 });

    expect(heartbeatSpy).toHaveBeenCalledTimes(1);
    expect(heartbeatSpy).toHaveBeenCalledWith(
      serviceContainer,
      expect.objectContaining({ id: 'user-1', uuid: 'uuid-panic', sessionId: 42 }),
    );
    expect(getFlagsApiSpy).not.toHaveBeenCalled();
    expect(Object.keys(flags).sort()).toEqual(['feature1', 'feature2']);
    expect(flags.feature1.isEnabled()).toBe(false);
    expect(flags.feature2.isEnabled()).toBe(false);
  });
});
