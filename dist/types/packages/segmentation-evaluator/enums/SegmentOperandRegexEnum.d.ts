/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
export declare enum SegmentOperandRegexEnum {
  LOWER = '^lower',
  LOWER_MATCH = '^lower\\((.*)\\)',
  WILDCARD = '^wildcard',
  WILDCARD_MATCH = '^wildcard\\((.*)\\)',
  REGEX = '^regex',
  REGEX_MATCH = '^regex\\((.*)\\)',
  STARTING_STAR = '^\\*',
  ENDING_STAR = '\\*$',
  GREATER_THAN_MATCH = '^gt\\((\\d+\\.?\\d*|\\.\\d+)\\)',
  GREATER_THAN_EQUAL_TO_MATCH = '^gte\\((\\d+\\.?\\d*|\\.\\d+)\\)',
  LESS_THAN_MATCH = '^lt\\((\\d+\\.?\\d*|\\.\\d+)\\)',
  LESS_THAN_EQUAL_TO_MATCH = '^lte\\((\\d+\\.?\\d*|\\.\\d+)\\)',
}
