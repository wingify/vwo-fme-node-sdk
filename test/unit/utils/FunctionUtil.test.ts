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
import { CampaignTypeEnum } from '../../../lib/enums/CampaignTypeEnum';
import {
  cloneObject,
  getCurrentUnixTimestamp,
  getSpecificRulesBasedOnType,
  getAllAbAndPersonaliseRules,
  addLinkedCampaignsToSettings
} from '../../../lib/utils/FunctionUtil';

describe('cloneObject', () => {
  it('should deeply clone an object', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: [3, 4, { e: 5 }]
      }
    };
    const clonedObj = cloneObject(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj.b).not.toBe(obj.b);
    expect(clonedObj.b.d).not.toBe(obj.b.d);
    expect(clonedObj.b.d[2]).not.toBe(obj.b.d[2]);
  });

  it('should return null for null input', () => {
    expect(cloneObject(null)).toBeNull();
  });

  it('should return undefined for undefined input', () => {
    expect(cloneObject(undefined)).toBeUndefined();
  });
});

describe('getCurrentUnixTimestamp', () => {
  it('should return the current Unix timestamp in seconds', () => {
    const mockDate = new Date(2023, 0, 1, 0, 0, 0); // January 1, 2023, 00:00:00
    const expectedTimestamp = Math.ceil(mockDate.getTime() / 1000);
    jest.useFakeTimers().setSystemTime(mockDate);

    const timestamp = getCurrentUnixTimestamp();
    expect(timestamp).toBe(expectedTimestamp);

    jest.useRealTimers();
  });
});

describe('getSpecificRulesBasedOnType', () => {
  it('should return an empty array if no linked campaigns are found', () => {
    const settings = {
      features: [{
        key: 'feature1',
        // no rulesLinkedCampaign property
      }]
    };
    const result = getSpecificRulesBasedOnType(settings, 'feature1');
    expect(result).toEqual([]);
  });

  it('should filter rules by type if type is specified and is a string', () => {
    const settings = {
      features: [{
        key: 'feature1',
        rulesLinkedCampaign: [
          { type: CampaignTypeEnum.AB, id: 1 },
          { type: CampaignTypeEnum.PERSONALIZE, id: 2 }
        ]
      }]
    };
    const result = getSpecificRulesBasedOnType(settings, 'feature1', CampaignTypeEnum.AB);
    expect(result).toEqual([{ type: CampaignTypeEnum.AB, id: 1 }]);
  });

  it('should return all linked campaigns if no type is specified', () => {
    const settings = {
      features: [{
        key: 'feature1',
        rulesLinkedCampaign: [
          { type: CampaignTypeEnum.AB, id: 1 },
          { type: CampaignTypeEnum.PERSONALIZE, id: 2 }
        ]
      }]
    };
    const result = getSpecificRulesBasedOnType(settings, 'feature1');
    expect(result).toEqual([
      { type: CampaignTypeEnum.AB, id: 1 },
      { type: CampaignTypeEnum.PERSONALIZE, id: 2 }
    ]);
  });
});

describe('getAllAbAndPersonaliseRules', () => {
  it('should return only AB and Personalize rules from the feature', () => {
    // Mock settings and featureKey
    const settings: any = {
      features: [
        {
          key: 'feature1',
          rulesLinkedCampaign: [
            { type: CampaignTypeEnum.AB, name: 'Rule 1' },
            { type: CampaignTypeEnum.PERSONALIZE, name: 'Rule 2' },
            { type: 'OTHER', name: 'Rule 3' }
          ]
        }
      ]
    };
    const featureKey = 'feature1';

    // Call the function
    const result = getAllAbAndPersonaliseRules(settings, featureKey);

    // Define expected result
    const expected = [
      { type: CampaignTypeEnum.AB, name: 'Rule 1' },
      { type: CampaignTypeEnum.PERSONALIZE, name: 'Rule 2' }
    ];

    // Assert the result
    expect(result).toEqual(expected);
  });

  it('should return an empty array if no matching rules are found', () => {
    const settings = {
      features: [
        {
          key: 'feature1',
          rulesLinkedCampaign: [
            { type: 'OTHER', name: 'Rule 1' }
          ]
        }
      ]
    };
    const featureKey = 'feature1';

    // Call the function
    const result = getAllAbAndPersonaliseRules(settings, featureKey);

    // Assert the result
    expect(result).toEqual([]);
  });

  it('should return an empty array if the feature does not exist', () => {
    const settings = {
      features: []
    };
    const featureKey = 'nonexistent';

    // Call the function
    const result = getAllAbAndPersonaliseRules(settings, featureKey);

    // Assert the result
    expect(result).toEqual([]);
  });
});

describe('addLinkedCampaignsToSettings', () => {
  it('should correctly link campaigns to features based on rules', () => {
    const settings: any = {
      campaigns: [
        { id: 1, key: 'campaign1', variations: [{ id: 101, name: 'Variation A' }] },
        { id: 2, key: 'campaign2', variations: [{ id: 102, name: 'Variation B' }] }
      ],
      features: [
        {
          rules: [
            { campaignId: 1, variationId: 101 },
            { campaignId: 2, variationId: 102 }
          ]
        }
      ]
    };

    addLinkedCampaignsToSettings(settings);

    expect(settings.features[0].rulesLinkedCampaign).toHaveLength(2);
    expect(settings.features[0].rulesLinkedCampaign[0]).toEqual({
      key: 'campaign1',
      campaignId: 1,
      id: 1,
      variationId: 101,
      variations: [{ id: 101, name: 'Variation A' }]
    });
    expect(settings.features[0].rulesLinkedCampaign[1]).toEqual({
      key: 'campaign2',
      campaignId: 2,
      id: 2,
      variationId: 102,
      variations: [{ id: 102, name: 'Variation B' }]
    });
  });

  it('should handle cases where no valid campaign is found for a rule', () => {
    const settings: any = {
      campaigns: [
        { id: 1, key: 'campaign1', variations: [{ id: 101, name: 'Variation A' }] }
      ],
      features: [
        {
          rules: [
            { campaignId: 1, variationId: 101 },
            { campaignId: 999, variationId: 999 } // Invalid campaign and variation
          ]
        }
      ]
    };

    addLinkedCampaignsToSettings(settings);

    expect(settings.features[0].rulesLinkedCampaign).toHaveLength(1);
    expect(settings.features[0].rulesLinkedCampaign[0]).toEqual({
      key: 'campaign1',
      campaignId: 1,
      id: 1,
      variationId: 101,
      variations: [{ id: 101, name: 'Variation A' }]
    });
  });
});
