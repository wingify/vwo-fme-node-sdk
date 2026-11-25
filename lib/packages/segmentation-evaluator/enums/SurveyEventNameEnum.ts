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

/** Event names that appear in Pulse survey DSL keys, after `vwo_survey`. */
export enum SurveyEventNameEnum {
  DISPLAYED = 'Displayed',
  ATTEMPTED = 'Attempted',
  COMPLETED = 'Completed',
  CLOSED = 'Closed',
  REACHED_THANKYOU = 'ReachedThankyou',
  QUESTION_DISPLAYED = 'QuestionDisplayed',
  QUESTION_ATTEMPTED = 'QuestionAttempted',
  QUESTION_SUBMITTED = 'QuestionSubmitted',
}
