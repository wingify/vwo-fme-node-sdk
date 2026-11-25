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
import { dynamic } from '../../../types/Common';
import { ServiceContainer } from '../../../services/ServiceContainer';
import { SurveyEventStore } from '../utils/SurveyEventStoreUtil';
/**
 * Evaluates Pulse survey DSL operands against SmartCode localStorage events.
 *
 * Displayed/Attempted (survey and question level) are boolean presence checks.
 * `QuestionSubmitted` matches the answer, taken from `responses[qId]` and unwrapping
 * `{ id, value }` objects so multi-select "other" text can still match.
 * `Completed`/`Closed`/`ReachedThankyou` fail closed — web does not drop them yet.
 */
export declare class SurveyEventOperandEvaluator {
  private readonly serviceContainer;
  private readonly surveyEventStore;
  /**
   * Creates an evaluator that matches Pulse survey DSL leaves against stored events.
   * @param serviceContainer - SDK service container (operand matching).
   * @param surveyEventStore - Store that lazily reads `_vwo_eventHist`.
   */
  constructor(serviceContainer: ServiceContainer, surveyEventStore: SurveyEventStore);
  /**
   * Returns true when `dslKey` is a Pulse survey event key.
   * @param dslKey - Segment leaf key.
   * @returns {boolean} True when the key parses as a Pulse survey event.
   */
  static isSurveyEventKey(dslKey: string): boolean;
  /**
   * Evaluates a survey-event operand when applicable.
   * @param subDsl - `{ dslKey: expectedValue }` operand.
   * @returns {boolean | null} True or false for a survey key, or null when it should be handled as a custom variable.
   */
  evaluate(subDsl: Record<string, dynamic>): boolean | null;
  /**
   * Collects answer candidate strings from stored events covered by this DSL leaf.
   * @param dslKey - Parsed survey DSL key.
   * @returns {string[]} Flattened answer candidates (ids and free-text values).
   */
  private findMatchingAnswerValues;
  /**
   * Stored events of this key's type whose survey/question ids the DSL leaf covers.
   * @param dslKey - Parsed survey DSL key.
   * @returns {SurveyEvent[]} Stored events in scope for this leaf.
   */
  private findCoveredEvents;
  /**
   * Builds a SurveyDslKey from a stored event so `covers` can compare ids.
   * @param event - One localStorage event.
   * @param dslKey - Leaf being evaluated, which fixes the event name and whether a `qId` is required.
   * @returns {SurveyDslKey | null} Parsed stored identity, or null when `sId` or a required `qId` is missing.
   */
  private toStoredSurveyDslKey;
  /**
   * Reads `responses[questionId]` and expands object entries into id + value strings.
   * @param submittedEvent - Stored submission.
   * @param questionId - Question id to read.
   * @returns {string[]} Answer candidate strings, or an empty array when the question has no responses.
   */
  private extractAnswerCandidates;
  /**
   * Compares a DSL expected value to one stored answer using existing operand matching.
   * @param expectedValue - Normalized DSL operand string.
   * @param storedValue - One answer candidate.
   * @returns {boolean} True when the stored answer matches the expected value.
   */
  private valuesMatch;
  /**
   * Insights-style JSON array strings such as `["1"]` can still appear as stored values.
   * @param expectedValue - DSL expected value.
   * @param storedValue - Stored answer string.
   * @returns {boolean} True when the expected value is one item in a JSON-array-shaped stored string.
   */
  private matchesJsonArrayString;
  /**
   * Checks whether a DSL leaf value is boolean true.
   * @param value - DSL leaf value.
   * @returns {boolean} True when the operand is boolean true.
   */
  private isBooleanTrue;
  /**
   * Reads a DSL leaf value as a boolean presence operand.
   * @param value - DSL leaf value.
   * @returns {boolean | null} The boolean operand, or null when the DSL sent something else.
   */
  private booleanOrNull;
  /**
   * Normalizes booleans/numbers to strings for operand comparison.
   * @param value - DSL leaf value.
   * @returns {string} The string form of the value, or an empty string when it is null or undefined.
   */
  private expectedValueAsString;
}
