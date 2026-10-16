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
import { LogManager } from '../packages/logger';
export declare enum SettingsControlApplyMode {
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
export declare class PanicModeForcedRefreshControlService {
  private isPanicModeActive;
  private lastPanicTimestamp;
  private lastForceRefreshTimestamp;
  private lastSettingsTimestamp;
  private isForcedSettingsRefreshInProgress;
  private isPanicClearConfirmationInProgress;
  private logManager;
  private onPanicActivated;
  setLogManager(logManager: LogManager): void;
  /**
   * Called once when panic latches from off to on. Used to discard the batch queue immediately.
   */
  setOnPanicActivated(handler: (() => void) | null): void;
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
  applySettingsControl(settings: Record<string, any>, mode?: SettingsControlApplyMode): ISettingsControlResult;
  /**
   * Applies panic / force-refresh from a DaCDN collect or batch-events JSON body.
   * Uses `panicMode` and `forceRefresh` keys from {@link SdkControlWireKeys}.
   *
   * @param data - Parsed JSON body from a successful collect/batch response (plain object only).
   * @returns Snapshot summary fields plus panic latch and whether forced refresh should run.
   */
  applyCollectControlPayload(data: unknown): ISettingsControlResult;
  /**
   * Returns whether panic mode is currently active.
   *
   * @returns `true` when panic mode is latched on, `false` otherwise.
   */
  isPanicModeActivated(): boolean;
  /**
   * Atomically checks and acquires the forced-refresh mutex.
   * Sets `isForcedSettingsRefreshInProgress` to `true` only when not already held.
   *
   * @returns `true` if the lock was successfully acquired, `false` if a refresh is already in progress.
   */
  tryStartRefresh(): boolean;
  /**
   * Releases the forced-refresh mutex after `updateSettings` completes or aborts.
   * Logs `SDK_REENABLED` only when panic is still off (ping is source of truth; post-ping
   * settings fetch must not re-latch and must not also log disable).
   *
   * @param isRefreshFromPanicClear - Whether this refresh was triggered by a panic-mode clear event.
   * @returns void
   */
  finishRefresh(isRefreshFromPanicClear?: boolean): void;
  /**
   * Atomically checks and acquires the panic-clear confirmation mutex (control ping in flight).
   *
   * @returns `true` if confirmation may proceed, `false` if one is already in progress.
   */
  tryStartPanicClearConfirmation(): boolean;
  /**
   * Releases the panic-clear confirmation mutex after the control ping completes or aborts.
   *
   * @returns void
   */
  finishPanicClearConfirmation(): void;
  /**
   * Updates panic latch from settings `sdkMetaInfo.panic` when declared on this snapshot.
   * When panic is on and this snapshot signals off, defer clearing until DaCDN confirms via control ping.
   *
   * @param resolved - Declarations/raw values read from `settings.sdkMetaInfo`.
   * @param result - Mutable result bag; may set `needsCollectPingConfirmation`.
   * @returns void
   */
  private applyPanicModeFromSettingsSdkMeta;
  /**
   * Triggers forced-refresh when settings `sdkMetaInfo.refresh` is a valid, non-stale token.
   * Init APPLY with a refresh timestamp extra-fetches (TTS-3149). Same/older tokens are ignored
   * (TTS-3134).
   *
   * @param resolved - Declarations/raw values read from `settings.sdkMetaInfo`.
   * @param result - Mutable result bag updated when refresh should extra-fetch.
   * @returns void
   */
  private applyForcedRefreshSignalFromSettingsSdkMeta;
  /**
   * Updates panic latch from DaCDN `panicMode` when present on this payload.
   *
   * @param data - Parsed DaCDN control payload (plain object).
   * @param hasPanicModeProperty - Whether `panicMode` is an own property on `data`.
   * @param wasPanicModeActive - Previous state of the panic mode latch.
   * @returns void
   */
  private applyPanicModeFromDaCdnPayload;
  /**
   * Sets forced-refresh hint when DaCDN `forceRefresh` token is **newer** than last seen.
   *
   * @param data - Parsed DaCDN control payload (plain object).
   * @param hasForceRefreshProperty - Whether `forceRefresh` is an own property on `data`.
   * @param result - Mutable result bag; may set `shouldTriggerForceRefresh` when token advances.
   * @returns void
   */
  private applyForcedRefreshSignalFromDaCdnPayload;
  /**
   * Polling never latches or extra-fetches from sdkMetaInfo. Collector ping is only for panic:
   * newer panic token, or panic currently ON + poll OFF. Force-refresh is ignored here (no ping).
   * Logs happen only when the ping payload is applied.
   */
  private evaluatePollingControlSignals;
  /**
   * Same/older than last seen is stale. First token (`last` unset) is never stale.
   */
  private isStaleControlTimestamp;
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
  shouldApplySettingsSnapshot(settings: Record<string, any>): boolean;
  /**
   * Checks if incoming settings snapshot timestamp is stale (older or equal to last seen).
   * Prevents race condition where polling applies older settings after force-refresh fetched newer ones (TTS-3135).
   *
   * @param incomingTimestamp - The timestamp from the incoming settings snapshot.
   * @returns `true` if the snapshot is stale or duplicate, `false` if it's newer.
   */
  private isStaleSettingsSnapshot;
  /**
   * Coerces panic/refresh tokens to a comparable string; rejects empty and unsupported shapes.
   *
   * @param value - Raw panic or refresh token from settings or DaCDN (number, string, nullish, etc.).
   * @returns Trimmed non-empty string token, or `null` if unusable.
   */
  private normalizeTimestamp;
  /**
   * Reads control timestamps from `sdkMetaInfo` only (plain object); ignores legacy settings root keys.
   *
   * @param settings - Settings document containing optional `sdkMetaInfo`.
   * @returns Declared panic/refresh keys and raw values under `sdkMetaInfo` only.
   */
  private resolveSettingsControlTimestamps;
  /**
   * Fires the discard-queue hook only on the off → on latch, not on later timestamp bumps.
   *
   * @param wasPanicModeActive - Latch state before this payload was applied.
   * @returns void
   */
  private notifyPanicActivated;
}
export default PanicModeForcedRefreshControlService;
