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

import { findGroupsFeaturePartOf, getCampaignsByGroupId } from '../../../lib/utils/CampaignUtil';
import { getFeatureFlagBatches } from '../../../lib/utils/megGroupPartitionUtil';
import { getFeatureKeysFromGroup } from '../../../lib/utils/MegUtil';
import { isNaN } from '../../../lib/utils/DataTypeUtil';
import { SettingsModel } from '../../../lib/models/settings/SettingsModel';
import { setSettingsAndAddCampaignsToRules } from '../../../lib/utils/SettingsUtil';
import { MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS, SETTINGS_WITH_DIFFERENT_SALT } from '../../data/Settings';

const mockLogManager = { info: jest.fn() } as any;

describe('findGroupsFeaturePartOf', () => {
  it('returns an empty list for unknown feature keys', () => {
    const client = { settings: null as any, originalSettings: null as any };
    setSettingsAndAddCampaignsToRules(SETTINGS_WITH_DIFFERENT_SALT as any, client as any, mockLogManager);

    expect(findGroupsFeaturePartOf(client.settings, 'missing-feature')).toEqual([]);
  });
});

describe('getFeatureFlagBatches', () => {
  let megSettings: SettingsModel;
  let basicSettings: SettingsModel;

  beforeEach(() => {
    const megClient = { settings: null as any, originalSettings: null as any };
    setSettingsAndAddCampaignsToRules(MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS as any, megClient as any, mockLogManager);
    megSettings = megClient.settings;

    const basicClient = { settings: null as any, originalSettings: null as any };
    setSettingsAndAddCampaignsToRules(SETTINGS_WITH_DIFFERENT_SALT as any, basicClient as any, mockLogManager);
    basicSettings = basicClient.settings;
  });

  it('keeps independent flags in caller order as single-key batches', () => {
    const evaluationBatches = getFeatureFlagBatches(['feature1', 'feature2'], basicSettings);

    expect(evaluationBatches.map((evaluationBatch) => evaluationBatch.featureKeys)).toEqual([
      ['feature1'],
      ['feature2'],
    ]);
  });

  it('groups co-requested MEG flags together in one batch', () => {
    const groupIds = Object.keys(megSettings.getGroups() ?? {})
      .map(Number)
      .filter((id) => !isNaN(id));
    expect(groupIds.length).toBeGreaterThan(0);

    const groupId = groupIds[0];
    const megFeatureKeys = (getFeatureKeysFromGroup(megSettings, groupId).featureKeys ?? []).filter((key) =>
      megSettings.getFeatures().some((feature) => feature.getKey() === key),
    );

    expect(megFeatureKeys.length).toBeGreaterThan(0);
    expect(getCampaignsByGroupId(megSettings, groupId).length).toBeGreaterThan(0);

    const evaluationBatches = getFeatureFlagBatches(['feature1', ...megFeatureKeys], megSettings);
    const orderedFeatureKeys = evaluationBatches.flatMap((evaluationBatch) => evaluationBatch.featureKeys);
    const firstMegIndex = orderedFeatureKeys.indexOf(megFeatureKeys[0]);
    const groupedSlice = orderedFeatureKeys.slice(firstMegIndex, firstMegIndex + megFeatureKeys.length);

    expect(groupedSlice.sort()).toEqual([...megFeatureKeys].sort());
  });
});
