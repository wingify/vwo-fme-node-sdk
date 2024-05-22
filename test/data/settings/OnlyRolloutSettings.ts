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
export const BASIC_ROLLOUT_SETTINGS = {
  accountId: 123456,
  sdkKey: '000000000000_MASKED_000000000000',
  version: 1,
  features: [
    {
      status: 'ON',
      name: 'Feature1',
      impactCampaign: {},
      rules: [
        {
          ruleKey: 'rolloutRule1',
          type: 'FLAG_ROLLOUT',
          variationId: 1,
          campaignId: 1,
        },
      ],
      type: 'FEATURE_FLAG',
      metrics: [
        {
          identifier: 'custom1',
          mca: -1,
          id: 1,
          type: 'REVENUE_TRACKING',
        },
      ],
      id: 1,
      key: 'feature1',
    },
  ],
  campaigns: [
    {
      status: 'RUNNING',
      variations: [
        {
          variables: [
            {
              value: 10,
              type: 'integer',
              id: 1,
              key: 'int',
            },
            {
              value: 20.01,
              type: 'double',
              id: 2,
              key: 'float',
            },
            {
              value: 'test',
              type: 'string',
              id: 3,
              key: 'string',
            },
            {
              value: false,
              type: 'boolean',
              id: 4,
              key: 'boolean',
            },
            {
              value: { name: 'VWO' },
              type: 'json',
              id: 5,
              key: 'json',
            },
          ],
          name: 'Rollout-rule-1',
          segments: {},
          id: 1,
          weight: 100,
        },
      ],
      segments: {},
      type: 'FLAG_ROLLOUT',
      isForcedVariationEnabled: false,
      id: 1,
      key: 'feature1_rolloutRule1',
      name: 'feature1_rolloutRule1',
    },
  ],
};
