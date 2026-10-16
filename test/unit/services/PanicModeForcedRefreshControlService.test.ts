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
  PanicModeForcedRefreshControlService,
  SettingsControlApplyMode,
} from '../../../lib/services/PanicModeForcedRefreshControlService';
import { SdkControlWireKeys } from '../../../lib/constants/SdkControlWireKeys';

describe('PanicModeForcedRefreshControlService', () => {
  let service: PanicModeForcedRefreshControlService;

  beforeEach(() => {
    service = new PanicModeForcedRefreshControlService();
  });

  const freshSettingsSnapshot = (lastUpdatedOn: string | number, overrides: Record<string, unknown> = {}) =>
    ({
      lastUpdatedOn,
      ...overrides,
    }) as Record<string, any>;

  describe('applySettingsControl APPLY', () => {
    it('should ignore duplicate snapshot ids (lastUpdatedOn)', () => {
      const payload = freshSettingsSnapshot('1777026135', {
        sdkMetaInfo: { panic: 10 },
      });
      const first = service.applySettingsControl(payload);
      expect(first.isNewSettingsSnapshot).toBe(true);
      expect(service.isPanicModeActivated()).toBe(true);

      const second = service.applySettingsControl(payload);
      expect(second.isNewSettingsSnapshot).toBe(false);
      expect(second.shouldTriggerForceRefresh).toBe(false);
      expect(service.isPanicModeActivated()).toBe(true);
    });

    it('should defer panic clear when sdkMetaInfo.panic is missing on a newer snapshot while panic is on', () => {
      service.applySettingsControl(
        freshSettingsSnapshot('1', {
          sdkMetaInfo: { panic: 1776169618 },
        }),
      );
      expect(service.isPanicModeActivated()).toBe(true);

      const next = service.applySettingsControl(freshSettingsSnapshot('2', { sdkMetaInfo: {} }));
      expect(next.needsCollectPingConfirmation).toBe(true);
      expect(service.isPanicModeActivated()).toBe(true);
    });

    it('should clear panic immediately when sdkMetaInfo.panic is missing and panic was already off', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: {} }));
      expect(service.isPanicModeActivated()).toBe(false);

      service.applySettingsControl(freshSettingsSnapshot('2', { sdkMetaInfo: {} }));
      expect(service.isPanicModeActivated()).toBe(false);
    });

    it('should ignore panicMode / forceRefresh on settings root (only sdkMetaInfo controls settings path)', () => {
      service.applySettingsControl(
        freshSettingsSnapshot('1', {
          sdkMetaInfo: { panic: 1 },
        }),
      );
      expect(service.isPanicModeActivated()).toBe(true);

      const next = service.applySettingsControl(
        freshSettingsSnapshot('2', {
          [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 999,
          [SdkControlWireKeys.FORCE_REFRESH_TIMESTAMP]: 888,
        }),
      );
      expect(next.needsCollectPingConfirmation).toBe(true);
      expect(service.isPanicModeActivated()).toBe(true);
    });

    it('should force refresh when init APPLY settings include a refresh timestamp (TTS-3149)', () => {
      const result = service.applySettingsControl(
        freshSettingsSnapshot('1', {
          sdkMetaInfo: { refresh: 1776162641 },
        }),
      );
      expect(result.shouldTriggerForceRefresh).toBe(true);
    });

    it('should not force refresh on init when sdkMetaInfo.refresh is omitted', () => {
      const result = service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: {} }));
      expect(result.shouldTriggerForceRefresh).toBe(false);
    });

    it('should trigger force refresh when refresh token is newer across snapshots', () => {
      service.applySettingsControl(
        freshSettingsSnapshot('1', {
          sdkMetaInfo: { refresh: 1776162641 },
        }),
      );

      const next = service.applySettingsControl(
        freshSettingsSnapshot('2', {
          sdkMetaInfo: { refresh: 1776169999 },
        }),
      );

      expect(next.shouldTriggerForceRefresh).toBe(true);
    });

    it('should ignore stale sdkMetaInfo.panic on APPLY', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: { panic: 2000 } }));
      service.applyCollectControlPayload({});
      expect(service.isPanicModeActivated()).toBe(false);

      const next = service.applySettingsControl(freshSettingsSnapshot('2', { sdkMetaInfo: { panic: 1000 } }));
      expect(service.isPanicModeActivated()).toBe(false);
      expect(next.needsCollectPingConfirmation).toBeUndefined();
    });

    it('should not trigger force refresh when settings refresh token is older (TTS-3134)', () => {
      const first = service.applySettingsControl(
        freshSettingsSnapshot('1', {
          sdkMetaInfo: { refresh: 1776169999 },
        }),
      );
      expect(first.shouldTriggerForceRefresh).toBe(true);

      const next = service.applySettingsControl(
        freshSettingsSnapshot('2', {
          sdkMetaInfo: { refresh: 1776162641 },
        }),
      );

      expect(next.shouldTriggerForceRefresh).toBe(false);
    });
  });

  describe('applySettingsControl POLLING', () => {
    it('should not latch panic on; should request collector ping', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: {} }));
      expect(service.isPanicModeActivated()).toBe(false);

      const polled = service.applySettingsControl(
        freshSettingsSnapshot('2', { sdkMetaInfo: { panic: 1776169618 } }),
        SettingsControlApplyMode.POLLING,
      );

      expect(service.isPanicModeActivated()).toBe(false);
      expect(polled.needsCollectPingConfirmation).toBe(true);
      expect(polled.shouldTriggerForceRefresh).toBe(false);
    });

    it('should not extra-fetch or ping for sdkMetaInfo.refresh on polling', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: { refresh: 1000 } }));

      const polled = service.applySettingsControl(
        freshSettingsSnapshot('2', { sdkMetaInfo: { refresh: 2000 } }),
        SettingsControlApplyMode.POLLING,
      );

      expect(polled.shouldTriggerForceRefresh).toBe(false);
      expect(polled.needsCollectPingConfirmation).toBeUndefined();
    });

    it('should request collector ping when polling reports panic off while panic is on', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: { panic: 1, refresh: 1 } }));
      expect(service.isPanicModeActivated()).toBe(true);

      const polled = service.applySettingsControl(
        freshSettingsSnapshot('2', { sdkMetaInfo: {} }),
        SettingsControlApplyMode.POLLING,
      );

      expect(service.isPanicModeActivated()).toBe(true);
      expect(polled.needsCollectPingConfirmation).toBe(true);
      expect(polled.shouldTriggerForceRefresh).toBe(false);
    });

    it('should reject stale panic timestamp from polling without ping or latch change', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: { panic: 2000, refresh: 2000 } }));
      expect(service.isPanicModeActivated()).toBe(true);

      const polled = service.applySettingsControl(
        freshSettingsSnapshot('2', { sdkMetaInfo: { panic: 1000, refresh: 2000 } }),
        SettingsControlApplyMode.POLLING,
      );

      expect(service.isPanicModeActivated()).toBe(true);
      expect(polled.needsCollectPingConfirmation).toBeUndefined();
      expect(polled.shouldTriggerForceRefresh).toBe(false);
    });

    it('should reject stale refresh timestamp from polling without ping or extra-fetch', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: { refresh: 2000 } }));

      const polled = service.applySettingsControl(
        freshSettingsSnapshot('2', { sdkMetaInfo: { refresh: 1000 } }),
        SettingsControlApplyMode.POLLING,
      );

      expect(polled.shouldTriggerForceRefresh).toBe(false);
      expect(polled.needsCollectPingConfirmation).toBeUndefined();
    });

    it('should not ping when polling omits refresh timestamp', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: { refresh: 2000 } }));

      const polled = service.applySettingsControl(
        freshSettingsSnapshot('2', { sdkMetaInfo: {} }),
        SettingsControlApplyMode.POLLING,
      );

      expect(polled.shouldTriggerForceRefresh).toBe(false);
      expect(polled.needsCollectPingConfirmation).toBeUndefined();
    });

    it('should not ping again on duplicate lastUpdatedOn', () => {
      const snapshot = freshSettingsSnapshot('2', { sdkMetaInfo: { panic: 9 } });
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: {} }));
      service.applySettingsControl(snapshot, SettingsControlApplyMode.POLLING);

      const duplicate = service.applySettingsControl(snapshot, SettingsControlApplyMode.POLLING);
      expect(duplicate.needsCollectPingConfirmation).toBeUndefined();
      expect(duplicate.isNewSettingsSnapshot).toBe(false);
    });
  });

  describe('applySettingsControl POST_PING_FETCH', () => {
    it('should not re-latch panic from settings after ping cleared (no dual enable/disable logs)', () => {
      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: { panic: 1705924217 } }));
      expect(service.isPanicModeActivated()).toBe(true);

      service.applyCollectControlPayload({});
      expect(service.isPanicModeActivated()).toBe(false);

      const fetched = service.applySettingsControl(
        freshSettingsSnapshot('2', { sdkMetaInfo: { panic: 1705929999 } }),
        SettingsControlApplyMode.POST_PING_FETCH,
      );

      expect(service.isPanicModeActivated()).toBe(false);
      expect(fetched.shouldTriggerForceRefresh).toBe(false);
      expect(fetched.needsCollectPingConfirmation).toBeUndefined();
    });
  });

  describe('applyCollectControlPayload', () => {
    it('should apply DaCDN-shaped panicMode and forceRefresh timestamps', () => {
      const dacdnBody = {
        timestamp: '1777026135',
        [SdkControlWireKeys.FORCE_REFRESH_TIMESTAMP]: 1776668404,
        [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 1776669404,
      };

      const result = service.applyCollectControlPayload(dacdnBody);
      expect(result.isPanicModeActivated).toBe(true);
      expect(result.shouldTriggerForceRefresh).toBe(true);
      expect(service.isPanicModeActivated()).toBe(true);
    });

    it('should clear panic when DaCDN batch echo `{ ev: ... }` omits control keys', () => {
      service.applyCollectControlPayload({
        [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 1,
      });
      expect(service.isPanicModeActivated()).toBe(true);

      service.applyCollectControlPayload({ ev: [] });
      expect(service.isPanicModeActivated()).toBe(false);
    });

    it('should clear panic when DaCDN collect echo `{ d: ... }` omits control keys', () => {
      service.applyCollectControlPayload({
        [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 111,
      });
      expect(service.isPanicModeActivated()).toBe(true);

      service.applyCollectControlPayload({ d: { msgId: 'x' } });
      expect(service.isPanicModeActivated()).toBe(false);
    });

    it('should clear panic when panicMode is present but not a valid timestamp', () => {
      service.applyCollectControlPayload({
        [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 1,
      });
      expect(service.isPanicModeActivated()).toBe(true);

      service.applyCollectControlPayload({
        [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: '',
      });
      expect(service.isPanicModeActivated()).toBe(false);
    });

    it('should not re-trigger force refresh for the same timestamp token', () => {
      const dacdnBody = {
        [SdkControlWireKeys.FORCE_REFRESH_TIMESTAMP]: 1776668404,
        [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 1776669404,
      };

      expect(service.applyCollectControlPayload(dacdnBody).shouldTriggerForceRefresh).toBe(true);
      expect(service.applyCollectControlPayload(dacdnBody).shouldTriggerForceRefresh).toBe(false);
    });

    it('should not trigger force refresh when DaCDN forceRefresh token is older (TTS-3134)', () => {
      expect(
        service.applyCollectControlPayload({
          [SdkControlWireKeys.FORCE_REFRESH_TIMESTAMP]: 1776668404,
        }).shouldTriggerForceRefresh,
      ).toBe(true);

      expect(
        service.applyCollectControlPayload({
          [SdkControlWireKeys.FORCE_REFRESH_TIMESTAMP]: 1776660001,
        }).shouldTriggerForceRefresh,
      ).toBe(false);
    });
  });

  describe('setOnPanicActivated (TTS-3132)', () => {
    it('should fire once when panic latches from off to on via DaCDN', () => {
      const onPanicActivated = jest.fn();
      service.setOnPanicActivated(onPanicActivated);

      service.applyCollectControlPayload({ [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 1000 });
      expect(onPanicActivated).toHaveBeenCalledTimes(1);

      service.applyCollectControlPayload({ [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 2000 });
      expect(onPanicActivated).toHaveBeenCalledTimes(1);
      expect(service.isPanicModeActivated()).toBe(true);
    });

    it('should fire again after panic is cleared and then re-enabled', () => {
      const onPanicActivated = jest.fn();
      service.setOnPanicActivated(onPanicActivated);

      service.applyCollectControlPayload({ [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 1000 });
      service.applyCollectControlPayload({});
      service.applyCollectControlPayload({ [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 2000 });

      expect(onPanicActivated).toHaveBeenCalledTimes(2);
    });

    it('should fire when APPLY latches panic from sdkMetaInfo', () => {
      const onPanicActivated = jest.fn();
      service.setOnPanicActivated(onPanicActivated);

      service.applySettingsControl(freshSettingsSnapshot('1', { sdkMetaInfo: { panic: 1705924217 } }));
      expect(onPanicActivated).toHaveBeenCalledTimes(1);
    });

    it('should not fire for stale DaCDN panic while already off', () => {
      const onPanicActivated = jest.fn();
      service.setOnPanicActivated(onPanicActivated);

      service.applyCollectControlPayload({ [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 2000 });
      service.applyCollectControlPayload({});
      onPanicActivated.mockClear();

      service.applyCollectControlPayload({ [SdkControlWireKeys.PANIC_MODE_TIMESTAMP]: 1000 });
      expect(service.isPanicModeActivated()).toBe(false);
      expect(onPanicActivated).not.toHaveBeenCalled();
    });
  });

  describe('tryStartRefresh / finishRefresh', () => {
    it('should allow only one in-flight forced refresh', () => {
      expect(service.tryStartRefresh()).toBe(true);
      expect(service.tryStartRefresh()).toBe(false);
      service.finishRefresh();
      expect(service.tryStartRefresh()).toBe(true);
    });

    it('should not log SDK_REENABLED when panic is still on', () => {
      let finishLogs = 0;
      service.applyCollectControlPayload({ panicMode: 9 });
      service.setLogManager({
        info: () => {
          finishLogs += 1;
        },
      } as any);
      expect(service.tryStartRefresh()).toBe(true);
      service.finishRefresh(true);
      expect(finishLogs).toBe(0);
      expect(service.isPanicModeActivated()).toBe(true);
    });
  });

  describe('tryStartPanicClearConfirmation / finishPanicClearConfirmation', () => {
    it('should allow only one in-flight panic clear confirmation ping', () => {
      expect(service.tryStartPanicClearConfirmation()).toBe(true);
      expect(service.tryStartPanicClearConfirmation()).toBe(false);
      service.finishPanicClearConfirmation();
      expect(service.tryStartPanicClearConfirmation()).toBe(true);
    });
  });

  describe('shouldApplySettingsSnapshot (TTS-3135)', () => {
    it('should accept first settings snapshot on init', () => {
      const result = service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1000'));
      expect(result).toBe(true);
    });

    it('should accept newer settings snapshot based on lastUpdatedOn', () => {
      service.applySettingsControl(freshSettingsSnapshot('1000'));

      const result = service.shouldApplySettingsSnapshot(freshSettingsSnapshot('2000'));
      expect(result).toBe(true);
    });

    it('should reject stale settings snapshot with older lastUpdatedOn', () => {
      service.applySettingsControl(freshSettingsSnapshot('2000'));

      const result = service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1500'));
      expect(result).toBe(false);
    });

    it('should reject settings snapshot with equal lastUpdatedOn (duplicate)', () => {
      service.applySettingsControl(freshSettingsSnapshot('2000'));

      const result = service.shouldApplySettingsSnapshot(freshSettingsSnapshot('2000'));
      expect(result).toBe(false);
    });

    it('should use version field when lastUpdatedOn is missing', () => {
      service.applySettingsControl({ version: '1705924217' } as Record<string, any>);

      const stale = service.shouldApplySettingsSnapshot({ version: '1705924000' } as Record<string, any>);
      const fresh = service.shouldApplySettingsSnapshot({ version: '1705925000' } as Record<string, any>);

      expect(stale).toBe(false);
      expect(fresh).toBe(true);
    });

    it('should reject settings with missing timestamp (both lastUpdatedOn and version)', () => {
      service.applySettingsControl(freshSettingsSnapshot('1000'));

      const result = service.shouldApplySettingsSnapshot({} as Record<string, any>);
      expect(result).toBe(false);
    });

    it('should reject settings with invalid timestamp (empty string)', () => {
      service.applySettingsControl(freshSettingsSnapshot('1000'));

      const result = service.shouldApplySettingsSnapshot(freshSettingsSnapshot(''));
      expect(result).toBe(false);
    });

    it('should prevent polling from applying stale cached settings', () => {
      // Scenario: Force refresh brings timestamp=2000, polling returns cached timestamp=1500
      service.applySettingsControl(
        freshSettingsSnapshot('2000', { sdkMetaInfo: { refresh: 2000 } }),
        SettingsControlApplyMode.APPLY,
      );
      expect(service.isPanicModeActivated()).toBe(false);

      // Simulate polling returning old cached settings
      const shouldApplyOld = service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1500'));
      expect(shouldApplyOld).toBe(false);

      // Newer settings should still be accepted
      const shouldApplyNewer = service.shouldApplySettingsSnapshot(freshSettingsSnapshot('3000'));
      expect(shouldApplyNewer).toBe(true);
    });

    it('should reject multiple old timestamps in sequence', () => {
      service.applySettingsControl(freshSettingsSnapshot('2000'));

      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1500'))).toBe(false);
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1200'))).toBe(false);
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1800'))).toBe(false);

      // Only newer timestamp should be accepted
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('3000'))).toBe(true);
    });

    it('should work correctly after force refresh', () => {
      // Init with timestamp=1000
      service.applySettingsControl(freshSettingsSnapshot('1000'));

      // Force refresh with timestamp=2000
      service.applySettingsControl(
        freshSettingsSnapshot('2000', { sdkMetaInfo: { refresh: 2000 } }),
        SettingsControlApplyMode.APPLY,
      );

      // Old settings from before force refresh should be rejected
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1500'))).toBe(false);
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1999'))).toBe(false);

      // Same timestamp should be rejected
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('2000'))).toBe(false);

      // Only newer settings should be accepted
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('2001'))).toBe(true);
    });

    it('should handle numeric timestamps correctly', () => {
      service.applySettingsControl(freshSettingsSnapshot(1705924217));

      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot(1705924000))).toBe(false);
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot(1705924217))).toBe(false);
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot(1705925000))).toBe(true);
    });

    it('should handle string timestamps correctly', () => {
      service.applySettingsControl(freshSettingsSnapshot('1705924217'));

      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1705924000'))).toBe(false);
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1705924217'))).toBe(false);
      expect(service.shouldApplySettingsSnapshot(freshSettingsSnapshot('1705925000'))).toBe(true);
    });

    it('should reject stale settings even with valid campaigns', () => {
      service.applySettingsControl(
        freshSettingsSnapshot('2000', {
          campaigns: [{ id: 'campaign-new' }],
        }),
      );

      // Old settings with campaigns should still be rejected
      const result = service.shouldApplySettingsSnapshot(
        freshSettingsSnapshot('1500', {
          campaigns: [{ id: 'campaign-old' }],
        }),
      );
      expect(result).toBe(false);
    });
  });
});
