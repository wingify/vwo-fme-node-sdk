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
import { SurveyEventNameEnum } from '../enums/SurveyEventNameEnum';
/**
 * Parsed Pulse survey DSL leaf key.
 *
 * Dashboard "Any survey" / "Any question" omit the id. Stored web events always include ids.
 * `covers` maps an omitted id onto those stored events.
 *
 * Shapes: `{surveyId}_vwo_survey{Event}_{questionId}` with optional surveyId and questionId.
 */
export declare class SurveyDslKey {
  readonly surveyId: string | null;
  readonly eventName: SurveyEventNameEnum;
  readonly questionId: string | null;
  readonly raw: string;
  /**
   * Creates a parsed Pulse survey DSL leaf key.
   * @param surveyId - Survey id (`sId`) or null for any survey.
   * @param eventName - Pulse survey event name.
   * @param questionId - Question id (`qId`) or null when not applicable / any question.
   * @param raw - Original DSL key string.
   */
  constructor(surveyId: string | null, eventName: SurveyEventNameEnum, questionId: string | null, raw: string);
  /**
   * True when this DSL leaf must scan per-id stored events.
   *
   * `vwo_surveyDisplayed` (no survey id) = any survey.
   * `255_vwo_surveyQuestionSubmitted` (Question* event, no question id) = any question.
   * `255_vwo_surveyDisplayed` is a specific survey, not aggregate.
   * @returns {boolean} True when the survey id is omitted, or a question event omits the question id.
   */
  get isAggregate(): boolean;
  /**
   * Question-scoped events carry a `qId`; survey-level ones never do.
   * @returns {boolean} True for question displayed, attempted, and submitted events.
   */
  get isQuestionEvent(): boolean;
  /**
   * True for events whose DSL value is a boolean presence check rather than an answer.
   * SmartCode only records that they happened, so `true` matches presence and `false` absence.
   * @returns {boolean} True for displayed and attempted events at survey or question level.
   */
  get isDisplayedOrAttempted(): boolean;
  /**
   * Key this event is stored under inside `_vwo_eventHist`.
   * @returns {string} The storage key, for example `vwo_surveyDisplayed`.
   */
  get storageEventType(): string;
  /**
   * Whether a stored event identity satisfies this DSL leaf.
   *
   * Omitted survey/question id is a wildcard. A present id must match exactly.
   * @param stored - Parsed identity of a stored survey event.
   * @returns {boolean} True when the stored event is in scope for this leaf.
   */
  covers(stored: SurveyDslKey): boolean;
  /**
   * Parses a DSL key. Returns null when the key is not a Pulse survey event.
   * @param dslKey - Segment leaf key from settings.
   * @returns {SurveyDslKey | null} Parsed key, or null when the key is not a Pulse survey event.
   */
  static parse(dslKey: string): SurveyDslKey | null;
}
