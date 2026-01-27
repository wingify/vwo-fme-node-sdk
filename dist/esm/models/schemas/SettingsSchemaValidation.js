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
import { array, boolean, number, object, optional, string, type, union, validate } from 'superstruct';
export class SettingsSchema {
    constructor() {
        this.initializeSchemas();
    }
    initializeSchemas() {
        this.campaignMetricSchema = type({
            id: union([number(), string()]),
            type: string(),
            identifier: string(),
            mca: optional(union([number(), string()])),
            hasProps: optional(boolean()),
            revenueProp: optional(string()),
        });
        this.variableObjectSchema = type({
            id: union([number(), string()]),
            type: string(),
            key: string(),
            value: union([number(), string(), boolean(), object()]),
        });
        this.campaignVariationSchema = type({
            id: union([number(), string()]),
            name: string(),
            weight: union([number(), string()]),
            segments: optional(object()),
            variables: optional(array(this.variableObjectSchema)),
            startRangeVariation: optional(number()),
            endRangeVariation: optional(number()),
            salt: optional(string()),
        });
        this.campaignObjectSchema = type({
            id: union([number(), string()]),
            type: string(),
            key: string(),
            percentTraffic: optional(number()),
            status: string(),
            variations: array(this.campaignVariationSchema),
            segments: object(),
            isForcedVariationEnabled: optional(boolean()),
            isAlwaysCheckSegment: optional(boolean()),
            name: string(),
            salt: optional(string()),
        });
        this.ruleSchema = type({
            type: string(),
            ruleKey: string(),
            campaignId: number(),
            variationId: optional(number()),
        });
        this.featureSchema = type({
            id: union([number(), string()]),
            key: string(),
            status: string(),
            name: string(),
            type: string(),
            metrics: array(this.campaignMetricSchema),
            impactCampaign: optional(object()),
            rules: optional(array(this.ruleSchema)),
            variables: optional(array(this.variableObjectSchema)),
        });
        this.settingsSchema = type({
            sdkKey: optional(string()),
            version: union([number(), string()]),
            accountId: union([number(), string()]),
            usageStatsAccountId: optional(number()),
            features: optional(array(this.featureSchema)),
            campaigns: array(this.campaignObjectSchema),
            groups: optional(object()),
            campaignGroups: optional(object()),
            collectionPrefix: optional(string()),
            sdkMetaInfo: optional(object({ wasInitializedEarlier: optional(boolean()) })),
            pollInterval: optional(number()),
        });
    }
    isSettingsValid(settings) {
        if (!settings) {
            return false;
        }
        const [error] = validate(settings, this.settingsSchema);
        return !error;
    }
}
//# sourceMappingURL=SettingsSchemaValidation.js.map