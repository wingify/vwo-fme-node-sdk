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
import { isBoolean, isNull, isUndefined } from '../../../utils/DataTypeUtil.js';
import { SURVEY_EVENT_PREFIX } from '../constants/SurveyDslKeyPattern.js';
import { SurveyEventNameEnum } from '../enums/SurveyEventNameEnum.js';
import { getKeyValue } from '../utils/SegmentUtil.js';
import { SegmentOperandEvaluator } from './SegmentOperandEvaluator.js';
import { SurveyDslKey } from './SurveyDslKey.js';
/**
 * Evaluates Pulse survey DSL operands against SmartCode localStorage events.
 *
 * Displayed/Attempted (survey and question level) are boolean presence checks.
 * `QuestionSubmitted` matches the answer, taken from `responses[qId]` and unwrapping
 * `{ id, value }` objects so multi-select "other" text can still match.
 * `Completed`/`Closed`/`ReachedThankyou` fail closed — web does not drop them yet.
 */
export class SurveyEventOperandEvaluator {
    /**
     * Creates an evaluator that matches Pulse survey DSL leaves against stored events.
     * @param serviceContainer - SDK service container (operand matching).
     * @param surveyEventStore - Store that lazily reads `_vwo_eventHist`.
     */
    constructor(serviceContainer, surveyEventStore) {
        this.serviceContainer = serviceContainer;
        this.surveyEventStore = surveyEventStore;
    }
    /**
     * Returns true when `dslKey` is a Pulse survey event key.
     * @param dslKey - Segment leaf key.
     * @returns {boolean} True when the key parses as a Pulse survey event.
     */
    static isSurveyEventKey(dslKey) {
        return SurveyDslKey.parse(dslKey) !== null;
    }
    /**
     * Evaluates a survey-event operand when applicable.
     * @param subDsl - `{ dslKey: expectedValue }` operand.
     * @returns {boolean | null} True or false for a survey key, or null when it should be handled as a custom variable.
     */
    evaluate(subDsl) {
        const entry = getKeyValue(subDsl);
        if (!entry) {
            return null;
        }
        const parsedKey = SurveyDslKey.parse(entry.key);
        if (!parsedKey) {
            return null;
        }
        // Presence events store no answer, so the operand is a boolean: true = happened, false = did not.
        if (parsedKey.isDisplayedOrAttempted) {
            const expectedPresence = this.booleanOrNull(entry.value);
            if (expectedPresence === null) {
                return false;
            }
            const eventHappened = this.findCoveredEvents(parsedKey).length > 0;
            return expectedPresence === eventHappened;
        }
        // Web does not drop Completed/Closed/ReachedThankyou yet, so they fail closed.
        if (parsedKey.eventName !== SurveyEventNameEnum.QUESTION_SUBMITTED) {
            return false;
        }
        const matchingAnswerValues = this.findMatchingAnswerValues(parsedKey);
        if (matchingAnswerValues.length === 0) {
            return false;
        }
        if (parsedKey.isAggregate && this.isBooleanTrue(entry.value)) {
            return true;
        }
        const expectedValue = this.expectedValueAsString(entry.value);
        return matchingAnswerValues.some((storedValue) => this.valuesMatch(expectedValue, storedValue));
    }
    /**
     * Collects answer candidate strings from stored events covered by this DSL leaf.
     * @param dslKey - Parsed survey DSL key.
     * @returns {string[]} Flattened answer candidates (ids and free-text values).
     */
    findMatchingAnswerValues(dslKey) {
        const answerValues = [];
        // find the covered events
        for (const submittedEvent of this.findCoveredEvents(dslKey)) {
            // get the question id
            const questionId = dslKey.questionId ?? (submittedEvent.qId != null ? String(submittedEvent.qId) : null);
            // extract the answer candidates
            answerValues.push(...this.extractAnswerCandidates(submittedEvent, questionId));
        }
        return answerValues;
    }
    /**
     * Stored events of this key's type whose survey/question ids the DSL leaf covers.
     * @param dslKey - Parsed survey DSL key.
     * @returns {SurveyEvent[]} Stored events in scope for this leaf.
     */
    findCoveredEvents(dslKey) {
        // get the events by type
        return this.surveyEventStore.getEventsByType(dslKey.storageEventType).filter((event) => {
            // build the stored key
            const storedKey = this.toStoredSurveyDslKey(event, dslKey);
            // check if the stored key covers the dsl key
            return storedKey !== null && dslKey.covers(storedKey);
        });
    }
    /**
     * Builds a SurveyDslKey from a stored event so `covers` can compare ids.
     * @param event - One localStorage event.
     * @param dslKey - Leaf being evaluated, which fixes the event name and whether a `qId` is required.
     * @returns {SurveyDslKey | null} Parsed stored identity, or null when `sId` or a required `qId` is missing.
     */
    toStoredSurveyDslKey(event, dslKey) {
        if (event.sId == null) {
            return null;
        }
        // get the survey id
        const surveyId = String(event.sId);
        // get the event name
        const eventName = dslKey.eventName;
        if (!dslKey.isQuestionEvent) {
            return new SurveyDslKey(surveyId, eventName, null, `${surveyId}_${SURVEY_EVENT_PREFIX}${eventName}`);
        }
        // get the question id
        if (event.qId == null) {
            return null;
        }
        const questionId = String(event.qId);
        return new SurveyDslKey(surveyId, eventName, questionId, `${surveyId}_${SURVEY_EVENT_PREFIX}${eventName}_${questionId}`);
    }
    /**
     * Reads `responses[questionId]` and expands object entries into id + value strings.
     * @param submittedEvent - Stored submission.
     * @param questionId - Question id to read.
     * @returns {string[]} Answer candidate strings, or an empty array when the question has no responses.
     */
    extractAnswerCandidates(submittedEvent, questionId) {
        const responses = submittedEvent.responses;
        // check if the responses are not null and the question id is not null
        if (!responses || !questionId) {
            // return an empty array
            return [];
        }
        // get the raw answers
        const rawAnswers = responses[questionId] ?? responses[String(submittedEvent.qId)];
        // check if the raw answers are not an array
        if (!Array.isArray(rawAnswers)) {
            return [];
        }
        const answerCandidates = [];
        // iterate over the raw answers
        for (const rawAnswer of rawAnswers) {
            // check if the raw answer is not null and is an object and is not an array
            if (rawAnswer !== null && typeof rawAnswer === 'object' && !Array.isArray(rawAnswer)) {
                const otherOption = rawAnswer;
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
    }
    /**
     * Compares a DSL expected value to one stored answer using existing operand matching.
     * @param expectedValue - Normalized DSL operand string.
     * @param storedValue - One answer candidate.
     * @returns {boolean} True when the stored answer matches the expected value.
     */
    valuesMatch(expectedValue, storedValue) {
        const operandEvaluator = new SegmentOperandEvaluator(this.serviceContainer);
        const { operandType, operandValue } = operandEvaluator.preProcessOperandValue(expectedValue);
        // check if the operand type and value match the stored value
        if (operandEvaluator.extractResult(operandType, operandValue, storedValue)) {
            return true;
        }
        if (storedValue.toLowerCase() === expectedValue.toLowerCase()) {
            return true;
        }
        return this.matchesJsonArrayString(expectedValue, storedValue);
    }
    /**
     * Insights-style JSON array strings such as `["1"]` can still appear as stored values.
     * @param expectedValue - DSL expected value.
     * @param storedValue - Stored answer string.
     * @returns {boolean} True when the expected value is one item in a JSON-array-shaped stored string.
     */
    matchesJsonArrayString(expectedValue, storedValue) {
        if (!storedValue.startsWith('[') || !storedValue.endsWith(']')) {
            return false;
        }
        const normalizedExpected = expectedValue.trim().replace(/^"|"$/g, '');
        return storedValue
            .substring(1, storedValue.length - 1)
            .split(',')
            .some((item) => item.trim().replace(/^"|"$/g, '').toLowerCase() === normalizedExpected.toLowerCase());
    }
    /**
     * Checks whether a DSL leaf value is boolean true.
     * @param value - DSL leaf value.
     * @returns {boolean} True when the operand is boolean true.
     */
    isBooleanTrue(value) {
        return value === true;
    }
    /**
     * Reads a DSL leaf value as a boolean presence operand.
     * @param value - DSL leaf value.
     * @returns {boolean | null} The boolean operand, or null when the DSL sent something else.
     */
    booleanOrNull(value) {
        return isBoolean(value) ? value : null;
    }
    /**
     * Normalizes booleans/numbers to strings for operand comparison.
     * @param value - DSL leaf value.
     * @returns {string} The string form of the value, or an empty string when it is null or undefined.
     */
    expectedValueAsString(value) {
        if (isNull(value) || isUndefined(value)) {
            return '';
        }
        return String(value);
    }
}
//# sourceMappingURL=SurveyEventOperandEvaluator.js.map