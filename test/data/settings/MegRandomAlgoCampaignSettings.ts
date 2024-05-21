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
export const MEG_CAMPAIGN_RANDOM_ALGO_SETTINGS = {
  features: [
    {
      key: 'feature1',
      name: 'Feature1',
      metrics: [
        {
          id: 1,
          type: 'REVENUE_TRACKING',
          identifier: 'custom1',
          mca: -1,
        },
      ],
      rules: [
        {
          variationId: 1,
          type: 'FLAG_ROLLOUT',
          campaignId: 1,
          ruleKey: 'rolloutRule1',
        },
        {
          campaignId: 2,
          type: 'FLAG_TESTING',
          ruleKey: 'testingRule1',
        },
        {
          variationId: 2,
          campaignId: 3,
          type: 'FLAG_PERSONALIZE',
          ruleKey: 'personalizeRule1',
        },
        {
          campaignId: 4,
          type: 'FLAG_TESTING',
          ruleKey: 'testingRule2',
        },
        {
          campaignId: 5,
          type: 'FLAG_TESTING',
          ruleKey: 'testingRule3',
        },
      ],
      type: 'FEATURE_FLAG',
      impactCampaign: {},
      id: 1,
      status: 'ON',
    },
  ],
  groups: {
    '1': {
      campaigns: [2, 3, 5],
      name: 'Group 1',
    },
  },
  campaignGroups: {
    '2': 1,
    '3': 1,
    '5': 1,
  },
  version: 1,
  accountId: 12345,
  sdkKey: '000000000000_MASKED_000000000000',
  campaigns: [
    {
      key: 'feature1_rolloutRule1',
      id: 1,
      segments: {},
      isForcedVariationEnabled: false,
      variations: [
        {
          variables: [
            {
              key: 'int',
              id: 1,
              value: 10,
              type: 'integer',
            },
            {
              key: 'float',
              id: 2,
              value: 20.01,
              type: 'double',
            },
            {
              key: 'string',
              id: 3,
              value: 'rollout1',
              type: 'string',
            },
            {
              key: 'boolean',
              id: 4,
              value: false,
              type: 'boolean',
            },
            {
              key: 'json',
              id: 5,
              value: {
                campaign: 'rollout1',
              },
              type: 'json',
            },
          ],
          id: 1,
          segments: {},
          weight: 100,
          name: 'Rollout-rule-1',
        },
      ],
      type: 'FLAG_ROLLOUT',
      status: 'RUNNING',
    },
    {
      key: 'feature1_testingRule1',
      id: 2,
      segments: {
        or: [
          {
            custom_variable: {
              price: '100',
            },
          },
        ],
      },
      isForcedVariationEnabled: false,
      variations: [
        {
          weight: 50,
          id: 1,
          variables: [
            {
              key: 'int',
              id: 1,
              value: 10,
              type: 'integer',
            },
            {
              key: 'float',
              id: 2,
              value: 20.01,
              type: 'double',
            },
            {
              key: 'string',
              id: 3,
              value: 'testing1',
              type: 'string',
            },
            {
              key: 'boolean',
              id: 4,
              value: false,
              type: 'boolean',
            },
            {
              key: 'json',
              id: 5,
              value: {
                campaign: 'testing1',
              },
              type: 'json',
            },
          ],
          name: 'Default',
        },
        {
          weight: 50,
          id: 2,
          variables: [
            {
              key: 'int',
              id: 1,
              value: 11,
              type: 'integer',
            },
            {
              key: 'float',
              id: 2,
              value: 20.02,
              type: 'double',
            },
            {
              key: 'string',
              id: 3,
              value: 'testing1_variation',
              type: 'string',
            },
            {
              key: 'boolean',
              id: 4,
              value: true,
              type: 'boolean',
            },
            {
              key: 'json',
              id: 5,
              value: {
                campaign: 'testing1_variation',
              },
              type: 'json',
            },
          ],
          name: 'Variation-1',
        },
      ],
      percentTraffic: 100,
      type: 'FLAG_TESTING',
      status: 'RUNNING',
    },
    {
      key: 'feature1_personalizeRule1',
      id: 3,
      isForcedVariationEnabled: false,
      variations: [
        {
          weight: 100,
          id: 1,
          variables: [
            {
              key: 'int',
              id: 1,
              value: 11,
              type: 'integer',
            },
            {
              key: 'float',
              id: 2,
              value: 20.02,
              type: 'double',
            },
            {
              key: 'string',
              id: 3,
              value: 'personalizeRule1_variation',
              type: 'string',
            },
            {
              key: 'boolean',
              id: 4,
              value: true,
              type: 'boolean',
            },
            {
              key: 'json',
              id: 5,
              value: {
                campaign: 'personalizeRule1_variation',
              },
              type: 'json',
            },
          ],
          segments: {
            or: [
              {
                custom_variable: {
                  name: 'personalise',
                },
              },
            ],
          },
          name: 'Personalize-rule-1',
        },
      ],
      segments: {},
      type: 'FLAG_PERSONALIZE',
      status: 'RUNNING',
    },
    {
      key: 'feature1_testingRule2',
      id: 4,
      segments: {
        or: [
          {
            custom_variable: {
              firstname: 'testingRule2',
            },
          },
        ],
      },
      isForcedVariationEnabled: false,
      variations: [
        {
          weight: 50,
          id: 1,
          variables: [
            {
              key: 'int',
              id: 1,
              value: 10,
              type: 'integer',
            },
            {
              key: 'float',
              id: 2,
              value: 20.01,
              type: 'double',
            },
            {
              key: 'string',
              id: 3,
              value: 'testing2',
              type: 'string',
            },
            {
              key: 'boolean',
              id: 4,
              value: false,
              type: 'boolean',
            },
            {
              key: 'json',
              id: 5,
              value: {
                campaign: 'testing2',
              },
              type: 'json',
            },
          ],
          name: 'Default',
        },
        {
          weight: 50,
          id: 2,
          variables: [
            {
              key: 'int',
              id: 1,
              value: 11,
              type: 'integer',
            },
            {
              key: 'float',
              id: 2,
              value: 20.02,
              type: 'double',
            },
            {
              key: 'string',
              id: 3,
              value: 'testing2_variation',
              type: 'string',
            },
            {
              key: 'boolean',
              id: 4,
              value: true,
              type: 'boolean',
            },
            {
              key: 'json',
              id: 5,
              value: {
                campaign: 'testing2_variation',
              },
              type: 'json',
            },
          ],
          name: 'Variation-1',
        },
      ],
      percentTraffic: 100,
      type: 'FLAG_TESTING',
      status: 'RUNNING',
    },
    {
      key: 'feature1_testingRule3',
      id: 5,
      segments: {
        or: [
          {
            custom_variable: {
              lastname: 'vwo',
            },
          },
        ],
      },
      isForcedVariationEnabled: false,
      variations: [
        {
          weight: 50,
          id: 1,
          variables: [
            {
              key: 'int',
              id: 1,
              value: 10,
              type: 'integer',
            },
            {
              key: 'float',
              id: 2,
              value: 20.01,
              type: 'double',
            },
            {
              key: 'string',
              id: 3,
              value: 'testing3',
              type: 'string',
            },
            {
              key: 'boolean',
              id: 4,
              value: false,
              type: 'boolean',
            },
            {
              key: 'json',
              id: 5,
              value: {
                campaign: 'testing3',
              },
              type: 'json',
            },
          ],
          name: 'Default',
        },
        {
          weight: 50,
          id: 2,
          variables: [
            {
              key: 'int',
              id: 1,
              value: 11,
              type: 'integer',
            },
            {
              key: 'float',
              id: 2,
              value: 20.02,
              type: 'double',
            },
            {
              key: 'string',
              id: 3,
              value: 'testing3_variation',
              type: 'string',
            },
            {
              key: 'boolean',
              id: 4,
              value: true,
              type: 'boolean',
            },
            {
              key: 'json',
              id: 5,
              value: {
                campaign: 'testing3_variation',
              },
              type: 'json',
            },
          ],
          name: 'Variation-1',
        },
      ],
      percentTraffic: 100,
      type: 'FLAG_TESTING',
      status: 'RUNNING',
    },
  ],
};
