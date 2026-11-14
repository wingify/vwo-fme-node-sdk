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
import { SettingsModel } from '../../../lib/models/settings/SettingsModel';
import { ServiceContainer } from '../../../lib/services/ServiceContainer';
import * as GetFlagsBatchContext from '../../../lib/services/GetFlagsBatchContext';
import { BatchEventsDispatcher } from '../../../lib/utils/BatchEventsDispatcher';
import { sendImpressionForVariationShownInBatch } from '../../../lib/utils/ImpressionUtil';
import { EventEnum } from '../../../lib/enums/EventEnum';
import { createEventDispatchPolicy, DEFAULT_EVENT_DISPATCH_POLICY } from '../../../lib/utils/EventDispatchPolicyUtil';
import { setSettingsAndAddCampaignsToRules } from '../../../lib/utils/SettingsUtil';
import * as UserIdUtil from '../../../lib/utils/UserIdUtil';
import { SETTINGS_WITH_DIFFERENT_SALT } from '../../data/Settings';

const mockLogManager = { info: jest.fn(), debug: jest.fn(), errorLog: jest.fn(), error: jest.fn() } as any;

describe('fetchFlags', () => {
  let serviceContainer: ServiceContainer;
  let wingifyClient: WingifyClient;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(UserIdUtil, 'getUserId').mockResolvedValue('user-1');

    serviceContainer = new ServiceContainer({ accountId: '123456', sdkKey: 'abcdef' } as any);
    serviceContainer.setLogManager(mockLogManager);
    serviceContainer.setSettingsService({
      accountId: '123456',
      sdkKey: 'abcdef',
      isSettingsProvidedInInit: true,
      startTimeForInit: Date.now(),
      normalizeSettings: (settings: Record<string, any>) => settings,
    } as any);

    wingifyClient = new WingifyClient(SETTINGS_WITH_DIFFERENT_SALT as any, {} as any, serviceContainer);
    wingifyClient.serviceContainer = serviceContainer;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls GetFlagsApi with impressions suppressed and MAU enabled', async () => {
    const expectedFlags = { feature1: new Flag(true, 1, 'uuid', {} as any) };
    const getFlagsSpy = jest.spyOn(GetFlagsApi, 'get').mockResolvedValue(expectedFlags);

    const flags = await wingifyClient.fetchFlags(['feature1'], { id: 'user-1', customVariables: {} });

    expect(getFlagsSpy).toHaveBeenCalledWith(
      ['feature1'],
      expect.objectContaining({ id: 'user-1' }),
      serviceContainer,
      wingifyClient.options,
      false,
      true,
      false,
    );
    expect(flags).toBe(expectedFlags);
  });

  it('resets event dispatch policy on the browser path after evaluation', async () => {
    jest.spyOn(GetFlagsBatchContext, 'supportsParallelGetFlagsBatches').mockReturnValue(false);
    jest.spyOn(FlagApi, 'get').mockResolvedValue(new Flag(true, 1, 'uuid', {} as any));

    await GetFlagsApi.get(
      ['feature1'],
      { id: 'user-1', customVariables: {} },
      serviceContainer,
      {} as any,
      false,
      true,
    );

    expect(serviceContainer.getEventDispatchPolicy()).toEqual(DEFAULT_EVENT_DISPATCH_POLICY);
  });
});

describe('sendImpressionForVariationShownInBatch event dispatch policy', () => {
  let serviceContainer: ServiceContainer;

  beforeEach(() => {
    jest.clearAllMocks();
    serviceContainer = new ServiceContainer({} as any);
    serviceContainer.setEventDispatchPolicy(createEventDispatchPolicy(false, true));
    serviceContainer.setSettingsService({ accountId: '1', sdkKey: 'key' } as any);
    serviceContainer.setSettings({} as any);
  });

  it('blocks impression batches when dispatchImpressions is false', async () => {
    const dispatchSpy = jest.spyOn(BatchEventsDispatcher, 'dispatch').mockImplementation(async () => {});

    await sendImpressionForVariationShownInBatch(serviceContainer, [
      { d: { event: { name: EventEnum.VARIATION_SHOWN } } },
    ]);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('still dispatches MAU payloads when dispatchImpressions is false and dispatchUsageEvents is true', async () => {
    const dispatchSpy = jest.spyOn(BatchEventsDispatcher, 'dispatch').mockImplementation(async () => {});

    await sendImpressionForVariationShownInBatch(serviceContainer, [
      { d: { event: { name: EventEnum.USER_EVALUATED } } },
    ]);

    expect(dispatchSpy).toHaveBeenCalled();
  });
});
