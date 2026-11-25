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
exports.SURVEY_DSL_KEY_PATTERN = exports.SURVEY_EVENT_PREFIX = void 0;
var SurveyEventNameEnum_1 = require("../enums/SurveyEventNameEnum");
/** Prefix shared by Pulse survey DSL keys and `_vwo_eventHist` event types. */
exports.SURVEY_EVENT_PREFIX = 'vwo_survey';
var SURVEY_EVENT_NAME_ALTERNATION = Object.values(SurveyEventNameEnum_1.SurveyEventNameEnum).join('|');
/**
 * Pulse survey DSL leaf: `{surveyId}_vwo_survey{Event}_{questionId}`.
 * Survey id and question id are optional.
 */
exports.SURVEY_DSL_KEY_PATTERN = new RegExp("^(?:(\\d+)_)?".concat(exports.SURVEY_EVENT_PREFIX, "(").concat(SURVEY_EVENT_NAME_ALTERNATION, ")(?:_(\\d+))?$"));
//# sourceMappingURL=SurveyDslKeyPattern.js.map