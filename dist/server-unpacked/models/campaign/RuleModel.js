"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleModel = void 0;
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
var RuleModel = /** @class */ (function () {
    function RuleModel() {
    }
    RuleModel.prototype.modelFromDictionary = function (rule) {
        this.type = rule.type;
        this.status = rule.status;
        this.variationId = rule.variationId;
        this.campaignId = rule.campaignId;
        this.ruleKey = rule.ruleKey;
        return this;
    };
    RuleModel.prototype.getCampaignId = function () {
        return this.campaignId;
    };
    RuleModel.prototype.getVariationId = function () {
        return this.variationId;
    };
    RuleModel.prototype.getStatus = function () {
        return this.status;
    };
    RuleModel.prototype.getType = function () {
        return this.type;
    };
    RuleModel.prototype.getRuleKey = function () {
        return this.ruleKey;
    };
    return RuleModel;
}());
exports.RuleModel = RuleModel;
//# sourceMappingURL=RuleModel.js.map