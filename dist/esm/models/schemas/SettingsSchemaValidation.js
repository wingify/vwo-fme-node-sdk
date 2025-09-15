"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsSchema = void 0;
/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
const superstruct_1 = require("superstruct");
class SettingsSchema {
    constructor() {
        this.initializeSchemas();
    }
    initializeSchemas() {
        this.campaignMetricSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            type: (0, superstruct_1.string)(),
            identifier: (0, superstruct_1.string)(),
            mca: (0, superstruct_1.optional)((0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()])),
            hasProps: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
            revenueProp: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        });
        this.variableObjectSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            type: (0, superstruct_1.string)(),
            key: (0, superstruct_1.string)(),
            value: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)(), (0, superstruct_1.boolean)(), (0, superstruct_1.object)()]),
        });
        this.campaignVariationSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            name: (0, superstruct_1.string)(),
            weight: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            segments: (0, superstruct_1.optional)((0, superstruct_1.object)()),
            variables: (0, superstruct_1.optional)((0, superstruct_1.array)(this.variableObjectSchema)),
            startRangeVariation: (0, superstruct_1.optional)((0, superstruct_1.number)()),
            endRangeVariation: (0, superstruct_1.optional)((0, superstruct_1.number)()),
            salt: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        });
        this.campaignObjectSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            type: (0, superstruct_1.string)(),
            key: (0, superstruct_1.string)(),
            percentTraffic: (0, superstruct_1.optional)((0, superstruct_1.number)()),
            status: (0, superstruct_1.string)(),
            variations: (0, superstruct_1.array)(this.campaignVariationSchema),
            segments: (0, superstruct_1.object)(),
            isForcedVariationEnabled: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
            isAlwaysCheckSegment: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
            name: (0, superstruct_1.string)(),
            salt: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        });
        this.ruleSchema = (0, superstruct_1.type)({
            type: (0, superstruct_1.string)(),
            ruleKey: (0, superstruct_1.string)(),
            campaignId: (0, superstruct_1.number)(),
            variationId: (0, superstruct_1.optional)((0, superstruct_1.number)()),
        });
        this.featureSchema = (0, superstruct_1.type)({
            id: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            key: (0, superstruct_1.string)(),
            status: (0, superstruct_1.string)(),
            name: (0, superstruct_1.string)(),
            type: (0, superstruct_1.string)(),
            metrics: (0, superstruct_1.array)(this.campaignMetricSchema),
            impactCampaign: (0, superstruct_1.optional)((0, superstruct_1.object)()),
            rules: (0, superstruct_1.optional)((0, superstruct_1.array)(this.ruleSchema)),
            variables: (0, superstruct_1.optional)((0, superstruct_1.array)(this.variableObjectSchema)),
        });
        this.settingsSchema = (0, superstruct_1.type)({
            sdkKey: (0, superstruct_1.optional)((0, superstruct_1.string)()),
            version: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            accountId: (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]),
            usageStatsAccountId: (0, superstruct_1.optional)((0, superstruct_1.number)()),
            features: (0, superstruct_1.optional)((0, superstruct_1.array)(this.featureSchema)),
            campaigns: (0, superstruct_1.array)(this.campaignObjectSchema),
            groups: (0, superstruct_1.optional)((0, superstruct_1.object)()),
            campaignGroups: (0, superstruct_1.optional)((0, superstruct_1.object)()),
            collectionPrefix: (0, superstruct_1.optional)((0, superstruct_1.string)()),
            sdkMetaInfo: (0, superstruct_1.optional)((0, superstruct_1.object)({ wasInitializedEarlier: (0, superstruct_1.optional)((0, superstruct_1.boolean)()) })),
            pollInterval: (0, superstruct_1.optional)((0, superstruct_1.number)()),
        });
    }
    isSettingsValid(settings) {
        if (!settings) {
            return false;
        }
        const [error] = (0, superstruct_1.validate)(settings, this.settingsSchema);
        return !error;
    }
}
exports.SettingsSchema = SettingsSchema;
//# sourceMappingURL=SettingsSchemaValidation.js.map