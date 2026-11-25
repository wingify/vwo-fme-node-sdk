"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyEventStore = exports.SURVEY_EVENT_HISTORY_LAST_SESSION_KEY = exports.SURVEY_EVENT_HISTORY_SESSION_KEY = exports.SURVEY_EVENT_HISTORY_PRIMARY_KEY = void 0;
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
/** Primary SmartCode event-history key. */
exports.SURVEY_EVENT_HISTORY_PRIMARY_KEY = '_vwo_eventHist';
/** Fallback when the primary key is missing. */
exports.SURVEY_EVENT_HISTORY_SESSION_KEY = '_vwo_eventHistSession';
/** Fallback when primary and session keys are missing. */
exports.SURVEY_EVENT_HISTORY_LAST_SESSION_KEY = '_vwo_eventHistLastSession';
/**
 * Reads Pulse survey events from SmartCode localStorage.
 *
 * Fallback order (never merged): `_vwo_eventHist` → `_vwo_eventHistSession` → `_vwo_eventHistLastSession`.
 * Results are memoized until {@link resetCache} so one `getFlag` parses history at most once,
 * however many event types and leaves it evaluates.
 */
var SurveyEventStore = /** @class */ (function () {
    /**
     * Creates a store that reads Pulse survey events from SmartCode localStorage.
     * @param storageProvider - Optional injectable storage (tests). Defaults to `window.localStorage`.
     */
    function SurveyEventStore(storageProvider) {
        this.cachedHistory = null;
        this.hasReadHistory = false;
        this.cachedEventsByType = new Map();
        this.storageProvider = storageProvider !== null && storageProvider !== void 0 ? storageProvider : null;
    }
    /**
     * Clears the per-call memo so the next read hits storage again.
     * @returns {void} Nothing. The next read loads history from storage again.
     */
    SurveyEventStore.prototype.resetCache = function () {
        this.cachedHistory = null;
        this.hasReadHistory = false;
        this.cachedEventsByType.clear();
    };
    /**
     * Returns stored events for one SmartCode event type, or an empty array when unavailable.
     * @param eventType - Event-history key, e.g. `vwo_surveyDisplayed`.
     * @returns {SurveyEvent[]} Events of that type, memoized until {@link resetCache}.
     */
    SurveyEventStore.prototype.getEventsByType = function (eventType) {
        var cachedEvents = this.cachedEventsByType.get(eventType);
        if (cachedEvents) {
            return cachedEvents;
        }
        var events = this.readEventsByType(eventType);
        this.cachedEventsByType.set(eventType, events);
        return events;
    };
    /**
     * Reads the first present history key. Does not merge fallbacks.
     * @returns {string | null} Raw JSON string, or null when storage is missing or every history key is empty.
     */
    SurveyEventStore.prototype.readRawHistory = function () {
        var storage = this.getStorage();
        if (!storage) {
            return null;
        }
        return (storage.getItem(exports.SURVEY_EVENT_HISTORY_PRIMARY_KEY) ||
            storage.getItem(exports.SURVEY_EVENT_HISTORY_SESSION_KEY) ||
            storage.getItem(exports.SURVEY_EVENT_HISTORY_LAST_SESSION_KEY) ||
            null);
    };
    /**
     * Resolves the storage used to read SmartCode event history.
     * @returns {SurveyEventStorageProvider | null} Injected provider, or `window.localStorage` on the client, otherwise null.
     */
    SurveyEventStore.prototype.getStorage = function () {
        if (this.storageProvider) {
            return this.storageProvider;
        }
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage;
        }
        return null;
    };
    /**
     * Pulls one event type out of the parsed history.
     * @param eventType - Event-history key to pull out of the parsed history.
     * @returns {SurveyEvent[]} Object entries of that type, or an empty array when the type is missing or not an array.
     */
    SurveyEventStore.prototype.readEventsByType = function (eventType) {
        var _a;
        var events = (_a = this.getHistory()) === null || _a === void 0 ? void 0 : _a[eventType];
        if (!(0, DataTypeUtil_1.isArray)(events)) {
            return [];
        }
        return events.filter(function (event) { return (0, DataTypeUtil_1.isObject)(event); });
    };
    /**
     * Parses the event history once per {@link resetCache} cycle, however many types are read.
     * @returns {Record<string, unknown> | null} Parsed history object, or null when absent or malformed.
     */
    SurveyEventStore.prototype.getHistory = function () {
        if (this.hasReadHistory) {
            return this.cachedHistory;
        }
        this.hasReadHistory = true;
        this.cachedHistory = this.parseHistory(this.readRawHistory());
        return this.cachedHistory;
    };
    /**
     * Parses the SmartCode event-history JSON string.
     * @param rawHistory - JSON string of the SmartCode event-history object.
     * @returns {Record<string, unknown> | null} The parsed history object, or null when the string is empty, not an object, or invalid JSON.
     */
    SurveyEventStore.prototype.parseHistory = function (rawHistory) {
        if (!rawHistory) {
            return null;
        }
        try {
            var parsedHistory = JSON.parse(rawHistory);
            if (!(0, DataTypeUtil_1.isObject)(parsedHistory)) {
                return null;
            }
            return parsedHistory;
        }
        catch (_a) {
            return null;
        }
    };
    return SurveyEventStore;
}());
exports.SurveyEventStore = SurveyEventStore;
//# sourceMappingURL=SurveyEventStoreUtil.js.map