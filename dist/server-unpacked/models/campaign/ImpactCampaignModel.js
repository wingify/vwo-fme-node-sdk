"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactCapmaignModel = void 0;
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
var ImpactCapmaignModel = /** @class */ (function () {
    function ImpactCapmaignModel() {
    }
    ImpactCapmaignModel.prototype.modelFromDictionary = function (impactCampaign) {
        this.type = impactCampaign.type;
        this.campaignId = impactCampaign.campaignId;
        return this;
    };
    ImpactCapmaignModel.prototype.getCampaignId = function () {
        return this.campaignId;
    };
    ImpactCapmaignModel.prototype.getType = function () {
        return this.type;
    };
    return ImpactCapmaignModel;
}());
exports.ImpactCapmaignModel = ImpactCapmaignModel;
//# sourceMappingURL=ImpactCampaignModel.js.map