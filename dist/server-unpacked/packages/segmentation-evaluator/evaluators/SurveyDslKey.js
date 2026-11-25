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
exports.SurveyDslKey = void 0;
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var SurveyDslKeyPattern_1 = require("../constants/SurveyDslKeyPattern");
var SurveyEventNameEnum_1 = require("../enums/SurveyEventNameEnum");
/**
 * Parsed Pulse survey DSL leaf key.
 *
 * Dashboard "Any survey" / "Any question" omit the id. Stored web events always include ids.
 * `covers` maps an omitted id onto those stored events.
 *
 * Shapes: `{surveyId}_vwo_survey{Event}_{questionId}` with optional surveyId and questionId.
 */
var SurveyDslKey = /** @class */ (function () {
    /**
     * Creates a parsed Pulse survey DSL leaf key.
     * @param surveyId - Survey id (`sId`) or null for any survey.
     * @param eventName - Pulse survey event name.
     * @param questionId - Question id (`qId`) or null when not applicable / any question.
     * @param raw - Original DSL key string.
     */
    function SurveyDslKey(surveyId, eventName, questionId, raw) {
        this.surveyId = surveyId;
        this.eventName = eventName;
        this.questionId = questionId;
        this.raw = raw;
    }
    Object.defineProperty(SurveyDslKey.prototype, "isAggregate", {
        /**
         * True when this DSL leaf must scan per-id stored events.
         *
         * `vwo_surveyDisplayed` (no survey id) = any survey.
         * `255_vwo_surveyQuestionSubmitted` (Question* event, no question id) = any question.
         * `255_vwo_surveyDisplayed` is a specific survey, not aggregate.
         * @returns {boolean} True when the survey id is omitted, or a question event omits the question id.
         */
        get: function () {
            return (0, DataTypeUtil_1.isNull)(this.surveyId) || (this.isQuestionEvent && (0, DataTypeUtil_1.isNull)(this.questionId));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyDslKey.prototype, "isQuestionEvent", {
        /**
         * Question-scoped events carry a `qId`; survey-level ones never do.
         * @returns {boolean} True for question displayed, attempted, and submitted events.
         */
        get: function () {
            return (this.eventName === SurveyEventNameEnum_1.SurveyEventNameEnum.QUESTION_DISPLAYED ||
                this.eventName === SurveyEventNameEnum_1.SurveyEventNameEnum.QUESTION_ATTEMPTED ||
                this.eventName === SurveyEventNameEnum_1.SurveyEventNameEnum.QUESTION_SUBMITTED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyDslKey.prototype, "isDisplayedOrAttempted", {
        /**
         * True for events whose DSL value is a boolean presence check rather than an answer.
         * SmartCode only records that they happened, so `true` matches presence and `false` absence.
         * @returns {boolean} True for displayed and attempted events at survey or question level.
         */
        get: function () {
            return (this.eventName === SurveyEventNameEnum_1.SurveyEventNameEnum.DISPLAYED ||
                this.eventName === SurveyEventNameEnum_1.SurveyEventNameEnum.ATTEMPTED ||
                this.eventName === SurveyEventNameEnum_1.SurveyEventNameEnum.QUESTION_DISPLAYED ||
                this.eventName === SurveyEventNameEnum_1.SurveyEventNameEnum.QUESTION_ATTEMPTED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyDslKey.prototype, "storageEventType", {
        /**
         * Key this event is stored under inside `_vwo_eventHist`.
         * @returns {string} The storage key, for example `vwo_surveyDisplayed`.
         */
        get: function () {
            return "".concat(SurveyDslKeyPattern_1.SURVEY_EVENT_PREFIX).concat(this.eventName);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Whether a stored event identity satisfies this DSL leaf.
     *
     * Omitted survey/question id is a wildcard. A present id must match exactly.
     * @param stored - Parsed identity of a stored survey event.
     * @returns {boolean} True when the stored event is in scope for this leaf.
     */
    SurveyDslKey.prototype.covers = function (stored) {
        if (this.eventName !== stored.eventName) {
            return false;
        }
        if (!(0, DataTypeUtil_1.isNull)(this.surveyId) && this.surveyId !== stored.surveyId) {
            return false;
        }
        if (!(0, DataTypeUtil_1.isNull)(this.questionId) && this.questionId !== stored.questionId) {
            return false;
        }
        return true;
    };
    /**
     * Parses a DSL key. Returns null when the key is not a Pulse survey event.
     * @param dslKey - Segment leaf key from settings.
     * @returns {SurveyDslKey | null} Parsed key, or null when the key is not a Pulse survey event.
     */
    SurveyDslKey.parse = function (dslKey) {
        if (!(0, DataTypeUtil_1.isString)(dslKey)) {
            return null;
        }
        var match = SurveyDslKeyPattern_1.SURVEY_DSL_KEY_PATTERN.exec(dslKey);
        if (!match) {
            return null;
        }
        // Capture groups: 1 = optional survey id, 2 = event name, 3 = optional question id.
        var surveyId = match[1] || null;
        var eventName = Object.values(SurveyEventNameEnum_1.SurveyEventNameEnum).find(function (name) { return name === match[2]; });
        if (!eventName) {
            return null;
        }
        var questionId = match[3] || null;
        return new SurveyDslKey(surveyId, eventName, questionId, dslKey);
    };
    return SurveyDslKey;
}());
exports.SurveyDslKey = SurveyDslKey;
//# sourceMappingURL=SurveyDslKey.js.map