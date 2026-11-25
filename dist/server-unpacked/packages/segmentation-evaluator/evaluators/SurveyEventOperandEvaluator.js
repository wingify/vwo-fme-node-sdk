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
exports.SurveyEventOperandEvaluator = void 0;
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var SurveyDslKeyPattern_1 = require("../constants/SurveyDslKeyPattern");
var SurveyEventNameEnum_1 = require("../enums/SurveyEventNameEnum");
var SegmentUtil_1 = require("../utils/SegmentUtil");
var SegmentOperandEvaluator_1 = require("./SegmentOperandEvaluator");
var SurveyDslKey_1 = require("./SurveyDslKey");
/**
 * Evaluates Pulse survey DSL operands against SmartCode localStorage events.
 *
 * Displayed/Attempted (survey and question level) are boolean presence checks.
 * `QuestionSubmitted` matches the answer, taken from `responses[qId]` and unwrapping
 * `{ id, value }` objects so multi-select "other" text can still match.
 * `Completed`/`Closed`/`ReachedThankyou` fail closed — web does not drop them yet.
 */
var SurveyEventOperandEvaluator = /** @class */ (function () {
    /**
     * Creates an evaluator that matches Pulse survey DSL leaves against stored events.
     * @param serviceContainer - SDK service container (operand matching).
     * @param surveyEventStore - Store that lazily reads `_vwo_eventHist`.
     */
    function SurveyEventOperandEvaluator(serviceContainer, surveyEventStore) {
        this.serviceContainer = serviceContainer;
        this.surveyEventStore = surveyEventStore;
    }
    /**
     * Returns true when `dslKey` is a Pulse survey event key.
     * @param dslKey - Segment leaf key.
     * @returns {boolean} True when the key parses as a Pulse survey event.
     */
    SurveyEventOperandEvaluator.isSurveyEventKey = function (dslKey) {
        return SurveyDslKey_1.SurveyDslKey.parse(dslKey) !== null;
    };
    /**
     * Evaluates a survey-event operand when applicable.
     * @param subDsl - `{ dslKey: expectedValue }` operand.
     * @returns {boolean | null} True or false for a survey key, or null when it should be handled as a custom variable.
     */
    SurveyEventOperandEvaluator.prototype.evaluate = function (subDsl) {
        var _this = this;
        var entry = (0, SegmentUtil_1.getKeyValue)(subDsl);
        if (!entry) {
            return null;
        }
        var parsedKey = SurveyDslKey_1.SurveyDslKey.parse(entry.key);
        if (!parsedKey) {
            return null;
        }
        // Presence events store no answer, so the operand is a boolean: true = happened, false = did not.
        if (parsedKey.isDisplayedOrAttempted) {
            var expectedPresence = this.booleanOrNull(entry.value);
            if (expectedPresence === null) {
                return false;
            }
            var eventHappened = this.findCoveredEvents(parsedKey).length > 0;
            return expectedPresence === eventHappened;
        }
        // Web does not drop Completed/Closed/ReachedThankyou yet, so they fail closed.
        if (parsedKey.eventName !== SurveyEventNameEnum_1.SurveyEventNameEnum.QUESTION_SUBMITTED) {
            return false;
        }
        var matchingAnswerValues = this.findMatchingAnswerValues(parsedKey);
        if (matchingAnswerValues.length === 0) {
            return false;
        }
        if (parsedKey.isAggregate && this.isBooleanTrue(entry.value)) {
            return true;
        }
        var expectedValue = this.expectedValueAsString(entry.value);
        return matchingAnswerValues.some(function (storedValue) { return _this.valuesMatch(expectedValue, storedValue); });
    };
    /**
     * Collects answer candidate strings from stored events covered by this DSL leaf.
     * @param dslKey - Parsed survey DSL key.
     * @returns {string[]} Flattened answer candidates (ids and free-text values).
     */
    SurveyEventOperandEvaluator.prototype.findMatchingAnswerValues = function (dslKey) {
        var _a;
        var answerValues = [];
        // find the covered events
        for (var _i = 0, _b = this.findCoveredEvents(dslKey); _i < _b.length; _i++) {
            var submittedEvent = _b[_i];
            // get the question id
            var questionId = (_a = dslKey.questionId) !== null && _a !== void 0 ? _a : (submittedEvent.qId != null ? String(submittedEvent.qId) : null);
            // extract the answer candidates
            answerValues.push.apply(answerValues, this.extractAnswerCandidates(submittedEvent, questionId));
        }
        return answerValues;
    };
    /**
     * Stored events of this key's type whose survey/question ids the DSL leaf covers.
     * @param dslKey - Parsed survey DSL key.
     * @returns {SurveyEvent[]} Stored events in scope for this leaf.
     */
    SurveyEventOperandEvaluator.prototype.findCoveredEvents = function (dslKey) {
        var _this = this;
        // get the events by type
        return this.surveyEventStore.getEventsByType(dslKey.storageEventType).filter(function (event) {
            // build the stored key
            var storedKey = _this.toStoredSurveyDslKey(event, dslKey);
            // check if the stored key covers the dsl key
            return storedKey !== null && dslKey.covers(storedKey);
        });
    };
    /**
     * Builds a SurveyDslKey from a stored event so `covers` can compare ids.
     * @param event - One localStorage event.
     * @param dslKey - Leaf being evaluated, which fixes the event name and whether a `qId` is required.
     * @returns {SurveyDslKey | null} Parsed stored identity, or null when `sId` or a required `qId` is missing.
     */
    SurveyEventOperandEvaluator.prototype.toStoredSurveyDslKey = function (event, dslKey) {
        if (event.sId == null) {
            return null;
        }
        // get the survey id
        var surveyId = String(event.sId);
        // get the event name
        var eventName = dslKey.eventName;
        if (!dslKey.isQuestionEvent) {
            return new SurveyDslKey_1.SurveyDslKey(surveyId, eventName, null, "".concat(surveyId, "_").concat(SurveyDslKeyPattern_1.SURVEY_EVENT_PREFIX).concat(eventName));
        }
        // get the question id
        if (event.qId == null) {
            return null;
        }
        var questionId = String(event.qId);
        return new SurveyDslKey_1.SurveyDslKey(surveyId, eventName, questionId, "".concat(surveyId, "_").concat(SurveyDslKeyPattern_1.SURVEY_EVENT_PREFIX).concat(eventName, "_").concat(questionId));
    };
    /**
     * Reads `responses[questionId]` and expands object entries into id + value strings.
     * @param submittedEvent - Stored submission.
     * @param questionId - Question id to read.
     * @returns {string[]} Answer candidate strings, or an empty array when the question has no responses.
     */
    SurveyEventOperandEvaluator.prototype.extractAnswerCandidates = function (submittedEvent, questionId) {
        var _a;
        var responses = submittedEvent.responses;
        // check if the responses are not null and the question id is not null
        if (!responses || !questionId) {
            // return an empty array
            return [];
        }
        // get the raw answers
        var rawAnswers = (_a = responses[questionId]) !== null && _a !== void 0 ? _a : responses[String(submittedEvent.qId)];
        // check if the raw answers are not an array
        if (!Array.isArray(rawAnswers)) {
            return [];
        }
        var answerCandidates = [];
        // iterate over the raw answers
        for (var _i = 0, rawAnswers_1 = rawAnswers; _i < rawAnswers_1.length; _i++) {
            var rawAnswer = rawAnswers_1[_i];
            // check if the raw answer is not null and is an object and is not an array
            if (rawAnswer !== null && typeof rawAnswer === 'object' && !Array.isArray(rawAnswer)) {
                var otherOption = rawAnswer;
                // check if the id is not null
                if (otherOption.id != null) {
                    // add the id to the answer candidates
                    answerCandidates.push(String(otherOption.id));
                }
                if (otherOption.value != null) {
                    answerCandidates.push(String(otherOption.value));
                }
                continue;
            }
            if (rawAnswer != null) {
                answerCandidates.push(String(rawAnswer));
            }
        }
        return answerCandidates;
    };
    /**
     * Compares a DSL expected value to one stored answer using existing operand matching.
     * @param expectedValue - Normalized DSL operand string.
     * @param storedValue - One answer candidate.
     * @returns {boolean} True when the stored answer matches the expected value.
     */
    SurveyEventOperandEvaluator.prototype.valuesMatch = function (expectedValue, storedValue) {
        var operandEvaluator = new SegmentOperandEvaluator_1.SegmentOperandEvaluator(this.serviceContainer);
        var _a = operandEvaluator.preProcessOperandValue(expectedValue), operandType = _a.operandType, operandValue = _a.operandValue;
        // check if the operand type and value match the stored value
        if (operandEvaluator.extractResult(operandType, operandValue, storedValue)) {
            return true;
        }
        if (storedValue.toLowerCase() === expectedValue.toLowerCase()) {
            return true;
        }
        return this.matchesJsonArrayString(expectedValue, storedValue);
    };
    /**
     * Insights-style JSON array strings such as `["1"]` can still appear as stored values.
     * @param expectedValue - DSL expected value.
     * @param storedValue - Stored answer string.
     * @returns {boolean} True when the expected value is one item in a JSON-array-shaped stored string.
     */
    SurveyEventOperandEvaluator.prototype.matchesJsonArrayString = function (expectedValue, storedValue) {
        if (!storedValue.startsWith('[') || !storedValue.endsWith(']')) {
            return false;
        }
        var normalizedExpected = expectedValue.trim().replace(/^"|"$/g, '');
        return storedValue
            .substring(1, storedValue.length - 1)
            .split(',')
            .some(function (item) { return item.trim().replace(/^"|"$/g, '').toLowerCase() === normalizedExpected.toLowerCase(); });
    };
    /**
     * Checks whether a DSL leaf value is boolean true.
     * @param value - DSL leaf value.
     * @returns {boolean} True when the operand is boolean true.
     */
    SurveyEventOperandEvaluator.prototype.isBooleanTrue = function (value) {
        return value === true;
    };
    /**
     * Reads a DSL leaf value as a boolean presence operand.
     * @param value - DSL leaf value.
     * @returns {boolean | null} The boolean operand, or null when the DSL sent something else.
     */
    SurveyEventOperandEvaluator.prototype.booleanOrNull = function (value) {
        return (0, DataTypeUtil_1.isBoolean)(value) ? value : null;
    };
    /**
     * Normalizes booleans/numbers to strings for operand comparison.
     * @param value - DSL leaf value.
     * @returns {string} The string form of the value, or an empty string when it is null or undefined.
     */
    SurveyEventOperandEvaluator.prototype.expectedValueAsString = function (value) {
        if ((0, DataTypeUtil_1.isNull)(value) || (0, DataTypeUtil_1.isUndefined)(value)) {
            return '';
        }
        return String(value);
    };
    return SurveyEventOperandEvaluator;
}());
exports.SurveyEventOperandEvaluator = SurveyEventOperandEvaluator;
//# sourceMappingURL=SurveyEventOperandEvaluator.js.map