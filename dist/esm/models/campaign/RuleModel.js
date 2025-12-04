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
export class RuleModel {
    modelFromDictionary(rule) {
        this.type = rule.type;
        this.status = rule.status;
        this.variationId = rule.variationId;
        this.campaignId = rule.campaignId;
        this.ruleKey = rule.ruleKey;
        return this;
    }
    getCampaignId() {
        return this.campaignId;
    }
    getVariationId() {
        return this.variationId;
    }
    getStatus() {
        return this.status;
    }
    getType() {
        return this.type;
    }
    getRuleKey() {
        return this.ruleKey;
    }
}
//# sourceMappingURL=RuleModel.js.map