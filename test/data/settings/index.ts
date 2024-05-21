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
import { BASIC_ROLLOUT_SETTINGS } from './OnlyRolloutSettings';
import { BASIC_ROLLOUT_TESTING_RULE_SETTINGS } from './RolloutAndTestingSettings';
import { NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS } from './NoRolloutAndOnlyTestingSettings';
import { ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS } from './RolloutAndTestingSettingsWithPreSegment';
import { TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS } from './SettingsWithWhitelisting';
import { MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS } from './MegRandomAlgoCampaignSettings';
import { MEG_CAMPAIGN_ADVANCE_ALGO_SETTINGS } from './MegAdvanceAlgoCampaignSettings';

export {
  BASIC_ROLLOUT_SETTINGS,
  BASIC_ROLLOUT_TESTING_RULE_SETTINGS,
  NO_ROLLOUT_ONLY_TESTING_RULE_SETTINGS,
  ROLLOUT_TESTING_PRE_SEGMENT_RULE_SETTINGS,
  TESTING_WHITELISTING_SEGMENT_RULE_SETTINGS,
  MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS,
  MEG_CAMPAIGN_ADVANCE_ALGO_SETTINGS,
};
