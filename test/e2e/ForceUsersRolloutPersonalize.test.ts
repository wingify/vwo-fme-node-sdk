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
import {
  MULTI_ROLLOUT_FORCE_SECOND_SETTINGS,
  PERSONALIZE_FORCE_USERS_SETTINGS,
  ROLLOUT_0_PERSONALIZE_FORCE_ONLY_SETTINGS,
  ROLLOUT_AND_PERSONALIZE_FORCE_SETTINGS,
  ROLLOUT_FORCE_DISABLED_SETTINGS,
  ROLLOUT_FORCE_OFF_HARD_EXCLUDE_SETTINGS,
  ROLLOUT_FORCE_USERS_SETTINGS,
} from '../data/Settings';

/**
 * Force users (whitelistedSegments) on Rollout / Personalize.
 *
 * Mirrors Java ForceUsersRolloutPersonalizeTest (Runs A–G):
 *   A — Rollout force On @ 0% traffic
 *   B — Rollout force + Personalize force (gate passes, then personalize)
 *   C — Personalize force alone under 0% Rollout (gate fails)
 *   D — Multi-rollout priority: force only on 2nd rollout
 *   E — Force disabled (isForcedVariationEnabled=false) ignores list
 *   F — Control / non-forced user unchanged
 *   G — Rollout Force Off hard exclude
 */
describe('Force users for Rollout and Personalize', () => {
  const FORCED_USER = 'qa_forced';
  const FORCED_USER_2 = 'qa_forced_2';
  const CONTROL_USER = 'other_user';

  // -------------------------------------------------------------------------
  // Run A — Rollout force On @ 0%
  // -------------------------------------------------------------------------

  it('a1_rolloutForcedUserGetsOnAtZeroPercentTraffic', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_FORCE_USERS_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('int', 0)).toBe(42);
    expect(flag.getVariable('string', '')).toBe('forced_rollout');
  });

  it('a2_rolloutCommaStringSecondUserIsAlsoForced', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_FORCE_USERS_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER_2 });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('string', '')).toBe('forced_rollout');
  });

  // -------------------------------------------------------------------------
  // Run B — Rollout + Personalize both forced
  // -------------------------------------------------------------------------

  it('b1_rolloutAndPersonalizeBothForcedReturnsPersonalizeVariables', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_AND_PERSONALIZE_FORCE_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('string', '')).toBe('personalize_forced');
  });

  it('b2_personalizeOnlyFeatureForcedWithoutAudienceMatch', async () => {
    const vwoClient = await initVWOWithSettings(PERSONALIZE_FORCE_USERS_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('int', 0)).toBe(77);
    expect(flag.getVariable('string', '')).toBe('forced_personalize');
  });

  // -------------------------------------------------------------------------
  // Run C — Personalize force does not bypass failed rollout gate
  // -------------------------------------------------------------------------

  it('c1_personalizeForceAloneUnderZeroPercentRolloutLeavesFlagDisabled', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_0_PERSONALIZE_FORCE_ONLY_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Run D — Multi-rollout priority
  // -------------------------------------------------------------------------

  it('d1_firstRolloutMissesThenSecondForcedRolloutWins', async () => {
    const vwoClient = await initVWOWithSettings(MULTI_ROLLOUT_FORCE_SECOND_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('string', '')).toBe('second_rollout_forced');
  });

  // -------------------------------------------------------------------------
  // Run E — Force master switch off
  // -------------------------------------------------------------------------

  it('e1_isForcedVariationEnabledFalseIgnoresWhitelistedSegments', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_FORCE_DISABLED_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Run F — Control user
  // -------------------------------------------------------------------------

  it('f1_controlUserNotForcedOnRolloutAtZeroPercent', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_FORCE_USERS_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: CONTROL_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(false);
  });

  it('f2_controlUserNotForcedOnPersonalizeWithoutAudience', async () => {
    const vwoClient = await initVWOWithSettings(PERSONALIZE_FORCE_USERS_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: CONTROL_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(false);
  });

  it('f3_controlUserNotForcedWhenRolloutAndPersonalizeListsExist', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_AND_PERSONALIZE_FORCE_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: CONTROL_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Run G — Rollout Force Off hard exclude
  // -------------------------------------------------------------------------

  it('g1_rolloutForceOffUserExcludedEvenAtHundredPercentTraffic', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_FORCE_OFF_HARD_EXCLUDE_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(false);
  });

  it('g2_rolloutForceOnUserStillGetsRolloutWhenSiblingIsForceOff', async () => {
    const vwoClient = await initVWOWithSettings(ROLLOUT_FORCE_OFF_HARD_EXCLUDE_SETTINGS);
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER_2 });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('string', '')).toBe('forced_rollout');
  });

  it('g3_forceOffOnlyDoesNotPassOtherUsersWhoFailSegmentation', async () => {
    const vwoClient = await initVWOWithSettings(rolloutForceOffOnlySettings());
    const flag = await vwoClient.getFlag('feature1', {
      id: CONTROL_USER,
      customVariables: { country: 'IN' },
    });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(false);
  });

  it('g4_forceOffOnlyStillAppliesSegmentationForOtherUsers', async () => {
    const vwoClient = await initVWOWithSettings(rolloutForceOffOnlySettings());
    const flag = await vwoClient.getFlag('feature1', {
      id: CONTROL_USER,
      customVariables: { country: 'US' },
    });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('string', '')).toBe('forced_rollout');
  });

  it('g5_forceOffUserStaysExcludedWhenOnlyForceOffListExists', async () => {
    const vwoClient = await initVWOWithSettings(rolloutForceOffOnlySettings());
    const flag = await vwoClient.getFlag('feature1', {
      id: FORCED_USER,
      customVariables: { country: 'US' },
    });

    expect(flag).toBeDefined();
    expect(flag.isEnabled()).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Run H — Forced OUT as a bare root "not", both lists, and multiple Forced OUT lists
  // -------------------------------------------------------------------------

  it('h1_rootNotForceOffOnlyExcludesListedUser', async () => {
    const vwoClient = await initVWOWithSettings(rolloutWithForceList({ not: orUsers(QA_FORCED_HASH) }));
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER, customVariables: { country: 'US' } });

    expect(flag.isEnabled()).toBe(false);
  });

  it('h2_rootNotForceOffOnlySendsOtherUsersToSegmentation', async () => {
    const vwoClient = await initVWOWithSettings(rolloutWithForceList({ not: orUsers(QA_FORCED_HASH) }));
    const failing = await vwoClient.getFlag('feature1', { id: CONTROL_USER, customVariables: { country: 'IN' } });
    const passing = await vwoClient.getFlag('feature1', { id: CONTROL_USER, customVariables: { country: 'US' } });

    expect(failing.isEnabled()).toBe(false);
    expect(passing.isEnabled()).toBe(true);
  });

  it('h3_userOnBothListsIsExcluded', async () => {
    const vwoClient = await initVWOWithSettings(
      rolloutWithForceList({ and: [{ not: orUsers(QA_FORCED_HASH) }, orUsers(QA_FORCED_HASH)] }),
    );
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER, customVariables: { country: 'US' } });

    expect(flag.isEnabled()).toBe(false);
  });

  it('h4_forceOnUserSkipsFailingSegmentationWhenBothListsExist', async () => {
    const vwoClient = await initVWOWithSettings(
      rolloutWithForceList({ and: [{ not: orUsers(QA_FORCED_HASH) }, orUsers(QA_FORCED_2_HASH)] }),
    );
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER_2, customVariables: { country: 'IN' } });

    expect(flag.isEnabled()).toBe(true);
    expect(flag.getVariable('string', '')).toBe('forced_rollout');
  });

  it('h5_otherUserFailingSegmentationIsNotForcedWhenBothListsExist', async () => {
    const vwoClient = await initVWOWithSettings(
      rolloutWithForceList({ and: [{ not: orUsers(QA_FORCED_HASH) }, orUsers(QA_FORCED_2_HASH)] }),
    );
    const flag = await vwoClient.getFlag('feature1', { id: CONTROL_USER, customVariables: { country: 'IN' } });

    expect(flag.isEnabled()).toBe(false);
  });

  it('h6_userOnSecondForceOffListIsExcluded', async () => {
    const vwoClient = await initVWOWithSettings(
      rolloutWithForceList({
        and: [{ not: orUsers(QA_FORCED_HASH) }, orUsers(QA_FORCED_2_HASH), { not: orUsers(QA_FORCED_OFF_HASH) }],
      }),
    );
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_OFF_USER, customVariables: { country: 'US' } });

    expect(flag.isEnabled()).toBe(false);
  });

  it('h7_forceOnUserStillForcedBesideTwoForceOffLists', async () => {
    const vwoClient = await initVWOWithSettings(
      rolloutWithForceList({
        and: [{ not: orUsers(QA_FORCED_HASH) }, orUsers(QA_FORCED_2_HASH), { not: orUsers(QA_FORCED_OFF_HASH) }],
      }),
    );
    const flag = await vwoClient.getFlag('feature1', { id: FORCED_USER_2, customVariables: { country: 'IN' } });

    expect(flag.isEnabled()).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Run I — Personalize ignores a "not" list instead of inverting it
  // -------------------------------------------------------------------------

  it('i1_personalizeNotOnlyDoesNotForceOtherUsers', async () => {
    const vwoClient = await initVWOWithSettings(personalizeWithForceList({ not: orUsers(QA_FORCED_HASH) }));
    const flag = await vwoClient.getFlag('feature1', { id: CONTROL_USER });

    expect(flag.isEnabled()).toBe(false);
  });

  it('i2_personalizeNotOnlyStillAppliesSegmentation', async () => {
    const vwoClient = await initVWOWithSettings(personalizeWithForceList({ not: orUsers(QA_FORCED_HASH) }));
    const flag = await vwoClient.getFlag('feature1', { id: CONTROL_USER, customVariables: { price: '999' } });

    expect(flag.isEnabled()).toBe(true);
  });

  it('i3_personalizeForceOnStillWorksBesideNot', async () => {
    const vwoClient = await initVWOWithSettings(
      personalizeWithForceList({ and: [{ not: orUsers(QA_FORCED_HASH) }, orUsers(QA_FORCED_2_HASH)] }),
    );
    const forced = await vwoClient.getFlag('feature1', { id: FORCED_USER_2 });
    const other = await vwoClient.getFlag('feature1', { id: CONTROL_USER });

    expect(forced.isEnabled()).toBe(true);
    expect(forced.getVariable('string', '')).toBe('forced_personalize');
    expect(other.isEnabled()).toBe(false);
  });
});

const QA_FORCED_HASH = '2379B0C13B8F50D6ADCCD1CE321D4D67';
const QA_FORCED_2_HASH = '301D9C959DBA5E099192FA96A6B8D7F1';
const QA_FORCED_OFF_HASH = 'E89A55A422685BFCA432891E91352D7E';
const FORCED_OFF_USER = 'qa_forced_off';

function orUsers(...hashes: string[]) {
  return { or: [{ user: hashes.join(',') }] };
}

/**
 * Rollout at 100% traffic with a country=US audience and the given whitelistedSegments.
 */
function rolloutWithForceList(whitelistedSegments: Record<string, unknown>) {
  const settings = JSON.parse(JSON.stringify(ROLLOUT_FORCE_OFF_HARD_EXCLUDE_SETTINGS));
  const campaign = settings.campaigns[0];
  campaign.percentTraffic = 100;
  const variation = campaign.variations[0];
  variation.segments = {
    or: [{ custom_variable: { country: 'US' } }],
  };
  variation.whitelistedSegments = whitelistedSegments;
  return settings;
}

/**
 * Personalize-only feature (audience price=999) with the given whitelistedSegments.
 */
function personalizeWithForceList(whitelistedSegments: Record<string, unknown>) {
  const settings = JSON.parse(JSON.stringify(PERSONALIZE_FORCE_USERS_SETTINGS));
  settings.campaigns[0].variations[0].whitelistedSegments = whitelistedSegments;
  return settings;
}

/**
 * Rollout whose whitelist contains only Forced OUT, plus a real audience segment.
 */
function rolloutForceOffOnlySettings() {
  return rolloutWithForceList({ and: [{ not: orUsers(QA_FORCED_HASH) }] });
}

async function initVWOWithSettings(settings: Record<string, unknown>) {
  const vwoOptions: IVWOOptions = {
    accountId: '123456',
    sdkKey: 'abcdef',
  };

  const vwoBuilder = new WingifyBuilder(vwoOptions);
  jest.spyOn(vwoBuilder, 'getSettings').mockResolvedValue(settings as any);

  return init({
    sdkKey: 'sdk-key',
    accountId: '123456',
    vwoBuilder,
  });
}
