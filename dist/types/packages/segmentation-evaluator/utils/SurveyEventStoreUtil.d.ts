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
/** Primary SmartCode event-history key. */
export declare const SURVEY_EVENT_HISTORY_PRIMARY_KEY = '_vwo_eventHist';
/** Fallback when the primary key is missing. */
export declare const SURVEY_EVENT_HISTORY_SESSION_KEY = '_vwo_eventHistSession';
/** Fallback when primary and session keys are missing. */
export declare const SURVEY_EVENT_HISTORY_LAST_SESSION_KEY = '_vwo_eventHistLastSession';
/**
 * Minimal storage interface so tests can inject a mock instead of window.localStorage.
 */
export interface SurveyEventStorageProvider {
  /**
   * Reads one stored value by key.
   * @param key - Storage key.
   * @returns {string | null} The stored string, or null when the key is missing.
   */
  getItem(key: string): string | null;
}
/**
 * One survey entry from SmartCode localStorage. Survey-level events carry only `sId`;
 * question-level ones also carry `qId`, and submissions add `responses`.
 */
export interface SurveyEvent {
  sId?: string | number;
  qId?: string | number;
  responses?: Record<string, unknown>;
  type?: string;
  [key: string]: unknown;
}
/**
 * Reads Pulse survey events from SmartCode localStorage.
 *
 * Fallback order (never merged): `_vwo_eventHist` → `_vwo_eventHistSession` → `_vwo_eventHistLastSession`.
 * Results are memoized until {@link resetCache} so one `getFlag` parses history at most once,
 * however many event types and leaves it evaluates.
 */
export declare class SurveyEventStore {
  private cachedHistory;
  private hasReadHistory;
  private readonly cachedEventsByType;
  private readonly storageProvider;
  /**
   * Creates a store that reads Pulse survey events from SmartCode localStorage.
   * @param storageProvider - Optional injectable storage (tests). Defaults to `window.localStorage`.
   */
  constructor(storageProvider?: SurveyEventStorageProvider | null);
  /**
   * Clears the per-call memo so the next read hits storage again.
   * @returns {void} Nothing. The next read loads history from storage again.
   */
  resetCache(): void;
  /**
   * Returns stored events for one SmartCode event type, or an empty array when unavailable.
   * @param eventType - Event-history key, e.g. `vwo_surveyDisplayed`.
   * @returns {SurveyEvent[]} Events of that type, memoized until {@link resetCache}.
   */
  getEventsByType(eventType: string): SurveyEvent[];
  /**
   * Reads the first present history key. Does not merge fallbacks.
   * @returns {string | null} Raw JSON string, or null when storage is missing or every history key is empty.
   */
  private readRawHistory;
  /**
   * Resolves the storage used to read SmartCode event history.
   * @returns {SurveyEventStorageProvider | null} Injected provider, or `window.localStorage` on the client, otherwise null.
   */
  private getStorage;
  /**
   * Pulls one event type out of the parsed history.
   * @param eventType - Event-history key to pull out of the parsed history.
   * @returns {SurveyEvent[]} Object entries of that type, or an empty array when the type is missing or not an array.
   */
  private readEventsByType;
  /**
   * Parses the event history once per {@link resetCache} cycle, however many types are read.
   * @returns {Record<string, unknown> | null} Parsed history object, or null when absent or malformed.
   */
  private getHistory;
  /**
   * Parses the SmartCode event-history JSON string.
   * @param rawHistory - JSON string of the SmartCode event-history object.
   * @returns {Record<string, unknown> | null} The parsed history object, or null when the string is empty, not an object, or invalid JSON.
   */
  private parseHistory;
}
