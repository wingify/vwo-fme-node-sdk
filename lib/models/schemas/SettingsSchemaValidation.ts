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
import { Struct, array, boolean, number, object, optional, string, union, validate } from 'superstruct';
import { dynamic } from '../../types/Common';
import { SettingsModel } from '../settings/SettingsModel';

export class SettingsSchema {
  private campaignMetricSchema: Struct<dynamic>;
  private variableObjectSchema: Struct<dynamic>;
  private campaignVariationSchema: Struct<dynamic>;
  private campaignObjectSchema: Struct<dynamic>;
  private settingsSchema: Struct<dynamic>;
  private featureSchema: Struct<dynamic>;
  private ruleSchema: Struct<dynamic>;

  constructor() {
    this.initializeSchemas();
  }

  private initializeSchemas(): void {
    this.campaignMetricSchema = object({
      id: union([number(), string()]),
      type: string(),
      identifier: string(),
      mca: optional(union([number(), string()])),
      hasProps: optional(boolean())
    });

    this.variableObjectSchema = object({
      id: union([number(), string()]),
      type: string(),
      key: string(),
      value: union([number(), string(), boolean(), object() ])
    });

    this.campaignVariationSchema = object({
      id: union([number(), string()]),
      name: string(),
      weight: union([number(), string()]),
      segments: optional(object()),
      variables: optional(array(this.variableObjectSchema)),
      startRangeVariation: optional(number()),
      endRangeVariation: optional(number())
    });

    this.campaignObjectSchema = object({
      id: union([number(), string()]),
      type: string(),
      key: string(),
      percentTraffic: optional(number()),
      status: string(),
      variations: array(this.campaignVariationSchema),
      segments: object(),
      isForcedVariationEnabled: optional(boolean())
    });

    this.ruleSchema = object({
      type: string(),
      ruleKey: string(),
      campaignId: number(),
      variationId: optional(number())
    });

    this.featureSchema = object({
      id: union([number(), string()]),
      key: string(),
      status: string(),
      name: string(),
      type: string(),
      metrics: array(this.campaignMetricSchema),
      impactCampaign: optional(object()),
      rules: optional(array(this.ruleSchema)),
      variables: optional(array(this.variableObjectSchema))
    });

    this.settingsSchema = object({
      sdkKey: optional(string()),
      version: union([number(), string()]),
      accountId: union([number(), string()]),
      features: optional(array(this.featureSchema)),
      campaigns: array(this.campaignObjectSchema),
      groups: optional(object()),
      campaignGroups: optional(object()),
      // remove these once DACDN is ready
      isNB: optional(boolean()),
      isNBv2: optional(boolean()),
    });
  }

  isSettingsValid(settings: any | SettingsModel): boolean {
    if (!settings) {
      return false;
    }

    const [error] = validate(settings, this.settingsSchema);

    return !error;
  }
}
