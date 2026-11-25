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
/**
 * Recognizes bare survey segment leaves and returns them for SurveyEventOperandEvaluator.
 *
 * Bare leaf examples (no `custom_variable` wrapper):
 * - `{ "vwo_surveyQuestionSubmitted": true }` — any survey
 * - `{ "252_vwo_surveyQuestionSubmitted": true }` — any question in a survey
 * - `{ "252_vwo_surveyQuestionSubmitted_1783": "wildcard(*…*)" }` — specific answer
 */
export declare class SurveySegmentDslAdapter {
  /**
   * Recognizes a single-field bare survey leaf.
   * @param dsl - A segmentation DSL node.
   * @returns {Record<string, dynamic> | null} The same node when it is a bare survey leaf, otherwise null.
   */
  static normalizeToSurveyOperand(dsl: Record<string, dynamic>): Record<string, dynamic> | null;
}
