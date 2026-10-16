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

import { SdkControlWireKeys } from '../constants/SdkControlWireKeys';
import { dynamic } from '../types/Common';
import { isNull, isNumber, isObject, isString, isUndefined } from '../utils/DataTypeUtil';
import { LogManager } from '../packages/logger';
import { buildMessage } from '../utils/LogMessageUtil';
import { InfoLogMessagesEnum } from '../enums/log-messages';

export enum SettingsControlApplyMode {
  /** Init / explicit fetch: apply sdkMetaInfo panic and refresh from this snapshot. */
  APPLY = 'apply',
  /** Polling: confirm panic via collector ping; do not ping or extra-fetch for refresh. */
  POLLING = 'polling',
  /** Settings pull after ping: apply campaigns only; do not re-latch control from sdkMetaInfo. */
  POST_PING_FETCH = 'postPingFetch',
}

export interface ISettingsControlResult {
  isNewSettingsSnapshot: boolean;
  isPanicModeActivated: boolean;
  shouldTriggerForceRefresh: boolean;
  isRefreshFromPanicClear?: boolean;
  /** Polling (or APPLY panic-off while latched) should confirm via collector ping. */
  needsCollectPingConfirmation?: boolean;
}

//Resolved timestamp sources from `settings.sdkMetaInfo` only.
// Contains declarations and raw values read from `settings.sdkMetaInfo`.
interface IResolvedSettingsControlTimestamps {
  hasPanicTimestampDeclared: boolean;
  panicTimestampRaw: unknown;
  hasRefreshTimestampDeclared: boolean;
  refreshTimestampRaw: unknown;
}

//Coordinates panic-mode kill-switch and forced settings refresh from settings snapshots and DaCDN responses.
export class PanicModeForcedRefreshControlService {
  private isPanicModeActive: boolean = false;
  private lastPanicTimestamp: string = null;
  private lastForceRefreshTimestamp: string = null;
  private lastSettingsTimestamp: string = null;
  private isForcedSettingsRefreshInProgress: boolean = false;
  private isPanicClearConfirmationInProgress: boolean = false;
  private logManager: LogManager | null = null;
  private onPanicActivated: (() => void) | null = null;

  public setLogManager(logManager: LogManager): void {
    this.logManager = logManager;
  }

  /**
   * Called once when panic latches from off to on. Used to discard the batch queue immediately.
   */
  public setOnPanicActivated(handler: (() => void) | null): void {
    this.onPanicActivated = handler;
  }

  /**
   * Applies or defers panic / force-refresh from a settings snapshot.
   *
   * Contract:
   * - `APPLY` (init / explicit fetch): `sdkMetaInfo.panic` latches immediately unless the token is
   *   stale (`<= last`). A valid `sdkMetaInfo.refresh` on init extra-fetches (TTS-3149). Later
   *   snapshots extra-fetch only when the token is newer (TTS-3134). Panic-off while latched still
   *   pings. Do not log a polling-driven on/off until collector ping decides.
   * - `POLLING`: never apply panic/refresh from v2-settings. Panic currently ON + poll OFF → ping.
   *   Newer panic tokens → ping. Stale panic tokens → reject. Force-refresh does **not** ping
   *   and does **not** extra-fetch from polling.
   * - `POST_PING_FETCH`: record snapshot id only. Ping already decided control; do not re-latch.
   *
   * @param settings - Normalized settings document (expects `lastUpdatedOn` and optional `sdkMetaInfo`).
   * @param mode - How this snapshot was obtained.
   * @returns Snapshot metadata, current panic latch, and whether ping or extra fetch should run.
   */
  applySettingsControl(
    settings: Record<string, any>,
    mode: SettingsControlApplyMode = SettingsControlApplyMode.APPLY,
  ): ISettingsControlResult {
    const snapshotTimestamp = this.normalizeTimestamp(settings?.lastUpdatedOn ?? settings?.version);
    const result: ISettingsControlResult = {
      isNewSettingsSnapshot: false,
      isPanicModeActivated: this.isPanicModeActive,
      shouldTriggerForceRefresh: false,
    };

    if (!snapshotTimestamp) {
      return result;
    }

    // Reject stale or duplicate snapshots: once we've seen a newer timestamp,
    // never accept older ones (TTS-3135: prevents polling from applying older
    // settings after force-refresh has fetched newer ones).
    const isStaleOrDuplicateSnapshot = this.isStaleSettingsSnapshot(snapshotTimestamp);
    if (isStaleOrDuplicateSnapshot) {
      if (this.logManager) {
        this.logManager.info(
          `[SETTINGS_SNAPSHOT_STALE] Rejecting stale/duplicate settings snapshot. ` +
            `Incoming: ${snapshotTimestamp}, Last seen: ${this.lastSettingsTimestamp}`,
        );
      }
      result.isPanicModeActivated = this.isPanicModeActive;
      return result;
    }

    this.lastSettingsTimestamp = snapshotTimestamp;
    result.isNewSettingsSnapshot = true;

    if (mode === SettingsControlApplyMode.POLLING) {
      this.evaluatePollingControlSignals(this.resolveSettingsControlTimestamps(settings), result);
      result.isPanicModeActivated = this.isPanicModeActive;
      return result;
    }

    if (mode === SettingsControlApplyMode.POST_PING_FETCH) {
      result.isPanicModeActivated = this.isPanicModeActive;
      return result;
    }

    const resolvedTimestamps = this.resolveSettingsControlTimestamps(settings);
    this.applyPanicModeFromSettingsSdkMeta(resolvedTimestamps, result);
    this.applyForcedRefreshSignalFromSettingsSdkMeta(resolvedTimestamps, result);

    result.isPanicModeActivated = this.isPanicModeActive;
    return result;
  }

  /**
   * Applies panic / force-refresh from a DaCDN collect or batch-events JSON body.
   * Uses `panicMode` and `forceRefresh` keys from {@link SdkControlWireKeys}.
   *
   * @param data - Parsed JSON body from a successful collect/batch response (plain object only).
   * @returns Snapshot summary fields plus panic latch and whether forced refresh should run.
   */
  applyCollectControlPayload(data: unknown): ISettingsControlResult {
    const wasPanicModeActive = this.isPanicModeActive;
    const result: ISettingsControlResult = {
      isNewSettingsSnapshot: false,
      isPanicModeActivated: this.isPanicModeActive,
      shouldTriggerForceRefresh: false,
    };

    // If the data is not a plain object (e.g. primitive '1' or 'ok'), it means
    // there's no DA CDN control payload, which implies panic mode is OFF.
    if (!isObject(data as dynamic)) {
      if (wasPanicModeActive) {
        this.isPanicModeActive = false;
        result.shouldTriggerForceRefresh = true;
        result.isRefreshFromPanicClear = true;
        if (this.logManager) {
          this.logManager.info(buildMessage(InfoLogMessagesEnum.PANIC_MODE_CLEARED_VIA_RESPONSE));
        }
        result.isPanicModeActivated = false;
      }
      return result;
    }

    const typedData = data as Record<string, any>;
    // panicMode / forceRefresh per DaCDN contract (distinct keys from settings sdkMetaInfo).
    const hasPanicModeProperty = Object.prototype.hasOwnProperty.call(
      typedData,
      SdkControlWireKeys.PANIC_MODE_TIMESTAMP,
    );
    // Check if the data has a force refresh property.
    const hasForceRefreshProperty = Object.prototype.hasOwnProperty.call(
      typedData,
      SdkControlWireKeys.FORCE_REFRESH_TIMESTAMP,
    );

    // Collect echoes often carry only d payload, and batch replies expose ev;
    // if DaCDN omitted explicit control keys from these echoes, turn panic mode OFF.
    if (
      (Object.prototype.hasOwnProperty.call(typedData, 'd') || Object.prototype.hasOwnProperty.call(typedData, 'ev')) &&
      !hasPanicModeProperty &&
      !hasForceRefreshProperty
    ) {
      this.isPanicModeActive = false;
      if (wasPanicModeActive) {
        result.shouldTriggerForceRefresh = true;
        result.isRefreshFromPanicClear = true;
        if (this.logManager) {
          this.logManager.info(buildMessage(InfoLogMessagesEnum.PANIC_MODE_CLEARED_VIA_RESPONSE));
        }
      }
      result.isPanicModeActivated = false;
      return result;
    }

    this.applyPanicModeFromDaCdnPayload(typedData, hasPanicModeProperty, wasPanicModeActive);
    this.applyForcedRefreshSignalFromDaCdnPayload(typedData, hasForceRefreshProperty, result);

    if (wasPanicModeActive && !this.isPanicModeActive) {
      result.shouldTriggerForceRefresh = true;
      result.isRefreshFromPanicClear = true;
    }

    // Reflect latest panic latch into outbound summary for callers/tests.
    result.isPanicModeActivated = this.isPanicModeActive;
    return result;
  }

  /**
   * Returns whether panic mode is currently active.
   *
   * @returns `true` when panic mode is latched on, `false` otherwise.
   */
  isPanicModeActivated(): boolean {
    return this.isPanicModeActive;
  }

  /**
   * Atomically checks and acquires the forced-refresh mutex.
   * Sets `isForcedSettingsRefreshInProgress` to `true` only when not already held.
   *
   * @returns `true` if the lock was successfully acquired, `false` if a refresh is already in progress.
   */
  tryStartRefresh(): boolean {
    if (this.isForcedSettingsRefreshInProgress) {
      return false;
    }
    this.isForcedSettingsRefreshInProgress = true;
    return true;
  }

  /**
   * Releases the forced-refresh mutex after `updateSettings` completes or aborts.
   * Logs `SDK_REENABLED` only when panic is still off (ping is source of truth; post-ping
   * settings fetch must not re-latch and must not also log disable).
   *
   * @param isRefreshFromPanicClear - Whether this refresh was triggered by a panic-mode clear event.
   * @returns void
   */
  finishRefresh(isRefreshFromPanicClear: boolean = false): void {
    if (this.isForcedSettingsRefreshInProgress && this.logManager) {
      if (isRefreshFromPanicClear) {
        // Only claim the SDK is enabled when the post-refresh snapshot did not re-latch panic.
        if (!this.isPanicModeActive) {
          this.logManager.info(buildMessage(InfoLogMessagesEnum.SDK_REENABLED));
        }
      } else {
        this.logManager.info(buildMessage(InfoLogMessagesEnum.FORCE_REFRESH_COMPLETED));
      }
    }
    this.isForcedSettingsRefreshInProgress = false;
  }

  /**
   * Atomically checks and acquires the panic-clear confirmation mutex (control ping in flight).
   *
   * @returns `true` if confirmation may proceed, `false` if one is already in progress.
   */
  tryStartPanicClearConfirmation(): boolean {
    if (this.isPanicClearConfirmationInProgress) {
      return false;
    }
    this.isPanicClearConfirmationInProgress = true;
    return true;
  }

  /**
   * Releases the panic-clear confirmation mutex after the control ping completes or aborts.
   *
   * @returns void
   */
  finishPanicClearConfirmation(): void {
    this.isPanicClearConfirmationInProgress = false;
  }

  /**
   * Updates panic latch from settings `sdkMetaInfo.panic` when declared on this snapshot.
   * When panic is on and this snapshot signals off, defer clearing until DaCDN confirms via control ping.
   *
   * @param resolved - Declarations/raw values read from `settings.sdkMetaInfo`.
   * @param result - Mutable result bag; may set `needsCollectPingConfirmation`.
   * @returns void
   */
  private applyPanicModeFromSettingsSdkMeta(
    resolved: IResolvedSettingsControlTimestamps,
    result: ISettingsControlResult,
  ): void {
    const wasPanicModeActive = this.isPanicModeActive;

    if (!resolved.hasPanicTimestampDeclared) {
      if (wasPanicModeActive) {
        result.needsCollectPingConfirmation = true;
        return;
      }
      this.isPanicModeActive = false;
      return;
    }

    const normalizedPanicTimestamp = this.normalizeTimestamp(resolved.panicTimestampRaw);
    if (normalizedPanicTimestamp) {
      if (this.isStaleControlTimestamp(normalizedPanicTimestamp, this.lastPanicTimestamp)) {
        return;
      }
      this.isPanicModeActive = true;
      if (wasPanicModeActive && this.lastPanicTimestamp !== normalizedPanicTimestamp && this.logManager) {
        this.logManager.info(
          buildMessage(InfoLogMessagesEnum.PANIC_MODE_TIMESTAMP_UPDATED, { panicTs: normalizedPanicTimestamp }),
        );
      }
      this.lastPanicTimestamp = normalizedPanicTimestamp;
      if (!wasPanicModeActive && this.logManager) {
        this.logManager.info(
          buildMessage(InfoLogMessagesEnum.PANIC_MODE_ACTIVATED, { panicTs: normalizedPanicTimestamp }),
        );
      }
      this.notifyPanicActivated(wasPanicModeActive);
    } else if (wasPanicModeActive) {
      result.needsCollectPingConfirmation = true;
    } else {
      this.isPanicModeActive = false;
    }
  }

  /**
   * Triggers forced-refresh when settings `sdkMetaInfo.refresh` is a valid, non-stale token.
   * Init APPLY with a refresh timestamp extra-fetches (TTS-3149). Same/older tokens are ignored
   * (TTS-3134).
   *
   * @param resolved - Declarations/raw values read from `settings.sdkMetaInfo`.
   * @param result - Mutable result bag updated when refresh should extra-fetch.
   * @returns void
   */
  private applyForcedRefreshSignalFromSettingsSdkMeta(
    resolved: IResolvedSettingsControlTimestamps,
    result: ISettingsControlResult,
  ): void {
    if (!resolved.hasRefreshTimestampDeclared) {
      return;
    }
    // Normalize the refresh timestamp.
    const normalizedRefreshTimestamp = this.normalizeTimestamp(resolved.refreshTimestampRaw);
    if (!normalizedRefreshTimestamp) {
      return;
    }

    // Same or older than last seen: do not extra-fetch (TTS-3134, matches DaCDN panicMode).
    if (this.isStaleControlTimestamp(normalizedRefreshTimestamp, this.lastForceRefreshTimestamp)) {
      return;
    }
    this.lastForceRefreshTimestamp = normalizedRefreshTimestamp;
    result.shouldTriggerForceRefresh = true;
    if (this.logManager) {
      this.logManager.info(
        buildMessage(InfoLogMessagesEnum.FORCE_REFRESH_TRIGGERED, {
          source: 'settings',
          refreshTs: normalizedRefreshTimestamp,
        }),
      );
    }
  }

  /**
   * Updates panic latch from DaCDN `panicMode` when present on this payload.
   *
   * @param data - Parsed DaCDN control payload (plain object).
   * @param hasPanicModeProperty - Whether `panicMode` is an own property on `data`.
   * @param wasPanicModeActive - Previous state of the panic mode latch.
   * @returns void
   */
  private applyPanicModeFromDaCdnPayload(
    data: Record<string, any>,
    hasPanicModeProperty: boolean,
    wasPanicModeActive: boolean,
  ): void {
    if (!hasPanicModeProperty) {
      this.isPanicModeActive = false;
      if (wasPanicModeActive && this.logManager) {
        this.logManager.info(buildMessage(InfoLogMessagesEnum.PANIC_MODE_CLEARED_VIA_RESPONSE));
      }
      return;
    }
    // Normalize the panic timestamp.
    const normalizedPanicTimestamp = this.normalizeTimestamp(data[SdkControlWireKeys.PANIC_MODE_TIMESTAMP]);
    // Set the panic mode active if the normalized panic timestamp is not null.
    if (normalizedPanicTimestamp) {
      if (this.isStaleControlTimestamp(normalizedPanicTimestamp, this.lastPanicTimestamp)) {
        return; // Ignore stale panic timestamp payload
      }
      this.isPanicModeActive = true;
      if (wasPanicModeActive && this.logManager) {
        this.logManager.info(
          buildMessage(InfoLogMessagesEnum.PANIC_MODE_TIMESTAMP_UPDATED, { panicTs: normalizedPanicTimestamp }),
        );
      }
      this.lastPanicTimestamp = normalizedPanicTimestamp;
      if (!wasPanicModeActive && this.logManager) {
        this.logManager.info(
          buildMessage(InfoLogMessagesEnum.PANIC_MODE_ACTIVATED, { panicTs: normalizedPanicTimestamp }),
        );
      }
      this.notifyPanicActivated(wasPanicModeActive);
    } else {
      this.isPanicModeActive = false;
      if (wasPanicModeActive && this.logManager) {
        this.logManager.info(buildMessage(InfoLogMessagesEnum.PANIC_MODE_CLEARED_VIA_RESPONSE));
      }
    }
  }

  /**
   * Sets forced-refresh hint when DaCDN `forceRefresh` token is **newer** than last seen.
   *
   * @param data - Parsed DaCDN control payload (plain object).
   * @param hasForceRefreshProperty - Whether `forceRefresh` is an own property on `data`.
   * @param result - Mutable result bag; may set `shouldTriggerForceRefresh` when token advances.
   * @returns void
   */
  private applyForcedRefreshSignalFromDaCdnPayload(
    data: Record<string, any>,
    hasForceRefreshProperty: boolean,
    result: ISettingsControlResult,
  ): void {
    if (!hasForceRefreshProperty) {
      return;
    }

    const normalizedForceRefreshTimestamp = this.normalizeTimestamp(data[SdkControlWireKeys.FORCE_REFRESH_TIMESTAMP]);
    if (!normalizedForceRefreshTimestamp) {
      return;
    }

    // Same or older than last seen: ignore (TTS-3134, matches DaCDN panicMode stale check).
    if (this.isStaleControlTimestamp(normalizedForceRefreshTimestamp, this.lastForceRefreshTimestamp)) {
      return;
    }

    this.lastForceRefreshTimestamp = normalizedForceRefreshTimestamp;
    result.shouldTriggerForceRefresh = true;
    if (this.logManager) {
      this.logManager.info(
        buildMessage(InfoLogMessagesEnum.FORCE_REFRESH_TRIGGERED, {
          source: 'network response',
          refreshTs: normalizedForceRefreshTimestamp,
        }),
      );
    }
  }

  /**
   * Polling never latches or extra-fetches from sdkMetaInfo. Collector ping is only for panic:
   * newer panic token, or panic currently ON + poll OFF. Force-refresh is ignored here (no ping).
   * Logs happen only when the ping payload is applied.
   */
  private evaluatePollingControlSignals(
    resolved: IResolvedSettingsControlTimestamps,
    result: ISettingsControlResult,
  ): void {
    const panicTimestamp = resolved.hasPanicTimestampDeclared
      ? this.normalizeTimestamp(resolved.panicTimestampRaw)
      : null;

    if (panicTimestamp) {
      if (!this.isStaleControlTimestamp(panicTimestamp, this.lastPanicTimestamp)) {
        result.needsCollectPingConfirmation = true;
      }
      return;
    }

    if (this.isPanicModeActive) {
      result.needsCollectPingConfirmation = true;
    }
  }

  /**
   * Same/older than last seen is stale. First token (`last` unset) is never stale.
   */
  private isStaleControlTimestamp(candidate: string, lastSeen: string | null): boolean {
    return lastSeen !== null && candidate <= lastSeen;
  }

  /**
   * Public API to check if a settings snapshot should be applied or rejected as stale.
   * Prevents race condition where polling applies older settings after force-refresh fetched newer ones (TTS-3135).
   *
   * This should be called in WingifyClient.updateSettings() BEFORE applying campaigns, and in
   * WingifyBuilder.checkAndPoll() BEFORE calling updateSettings().
   *
   * @param settings - Settings document with lastUpdatedOn or version timestamp.
   * @returns `true` if settings should be applied (newer or first), `false` if stale/duplicate (should skip).
   */
  public shouldApplySettingsSnapshot(settings: Record<string, any>): boolean {
    const snapshotTimestamp = this.normalizeTimestamp(settings?.lastUpdatedOn ?? settings?.version);
    if (!snapshotTimestamp) {
      return false; // Invalid timestamp, reject
    }
    return !this.isStaleSettingsSnapshot(snapshotTimestamp);
  }

  /**
   * Checks if incoming settings snapshot timestamp is stale (older or equal to last seen).
   * Prevents race condition where polling applies older settings after force-refresh fetched newer ones (TTS-3135).
   *
   * @param incomingTimestamp - The timestamp from the incoming settings snapshot.
   * @returns `true` if the snapshot is stale or duplicate, `false` if it's newer.
   */
  private isStaleSettingsSnapshot(incomingTimestamp: string): boolean {
    return this.lastSettingsTimestamp !== null && incomingTimestamp <= this.lastSettingsTimestamp;
  }

  /**
   * Coerces panic/refresh tokens to a comparable string; rejects empty and unsupported shapes.
   *
   * @param value - Raw panic or refresh token from settings or DaCDN (number, string, nullish, etc.).
   * @returns Trimmed non-empty string token, or `null` if unusable.
   */
  private normalizeTimestamp(value: any): string | null {
    if (isUndefined(value) || isNull(value)) {
      return null;
    }

    if (isNumber(value) && Number.isFinite(value)) {
      return value.toString();
    }

    if (isString(value)) {
      const trimmedToken = value.trim();
      return trimmedToken.length > 0 ? trimmedToken : null;
    }

    return null;
  }

  /**
   * Reads control timestamps from `sdkMetaInfo` only (plain object); ignores legacy settings root keys.
   *
   * @param settings - Settings document containing optional `sdkMetaInfo`.
   * @returns Declared panic/refresh keys and raw values under `sdkMetaInfo` only.
   */
  private resolveSettingsControlTimestamps(settings: Record<string, any>): IResolvedSettingsControlTimestamps {
    // Read the sdkMetaInfo object from the settings.
    const sdkMetaRoot = settings?.sdkMetaInfo;
    const sdkMetaInfo: Record<string, any> =
      sdkMetaRoot !== undefined && sdkMetaRoot !== null && isObject(sdkMetaRoot as dynamic)
        ? (sdkMetaRoot as Record<string, any>)
        : {};

    // Check if the sdkMetaInfo object has a panic timestamp property.
    const hasPanicTimestampDeclared = Object.prototype.hasOwnProperty.call(
      sdkMetaInfo,
      SdkControlWireKeys.SETTINGS_SDK_META_PANIC_TIMESTAMP,
    );
    // Check if the sdkMetaInfo object has a refresh timestamp property.
    const hasRefreshTimestampDeclared = Object.prototype.hasOwnProperty.call(
      sdkMetaInfo,
      SdkControlWireKeys.SETTINGS_SDK_META_REFRESH_TIMESTAMP,
    );

    // Return the resolved settings control timestamps.
    return {
      hasPanicTimestampDeclared,
      panicTimestampRaw: sdkMetaInfo[SdkControlWireKeys.SETTINGS_SDK_META_PANIC_TIMESTAMP],
      hasRefreshTimestampDeclared,
      refreshTimestampRaw: sdkMetaInfo[SdkControlWireKeys.SETTINGS_SDK_META_REFRESH_TIMESTAMP],
    };
  }

  /**
   * Fires the discard-queue hook only on the off → on latch, not on later timestamp bumps.
   *
   * @param wasPanicModeActive - Latch state before this payload was applied.
   * @returns void
   */
  private notifyPanicActivated(wasPanicModeActive: boolean): void {
    if (wasPanicModeActive || !this.isPanicModeActive) {
      return;
    }
    this.onPanicActivated?.();
  }
}

export default PanicModeForcedRefreshControlService;
