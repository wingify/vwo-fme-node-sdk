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

/** Prefix shared by Pulse survey DSL keys and `_vwo_eventHist` event types. */
export const SURVEY_EVENT_PREFIX = 'vwo_survey';

const SURVEY_EVENT_NAME_ALTERNATION = Object.values(SurveyEventNameEnum).join('|');

/**
 * Pulse survey DSL leaf: `{surveyId}_vwo_survey{Event}_{questionId}`.
 * Survey id and question id are optional.
 */
export const SURVEY_DSL_KEY_PATTERN = new RegExp(
  `^(?:(\\d+)_)?${SURVEY_EVENT_PREFIX}(${SURVEY_EVENT_NAME_ALTERNATION})(?:_(\\d+))?$`,
);
