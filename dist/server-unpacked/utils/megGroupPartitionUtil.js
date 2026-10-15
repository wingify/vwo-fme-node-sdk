"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeatureFlagBatches = getFeatureFlagBatches;
var CampaignUtil_1 = require("./CampaignUtil");
var DataTypeUtil_1 = require("./DataTypeUtil");
var MegUtil_1 = require("./MegUtil");
/**
 * Partitions requested keys into evaluation batches for getFlags().
 * MEG-linked keys share a batch; independent keys form single-key batches.
 *
 * @param requestedFeatureKeys - Distinct feature keys requested by the caller.
 * @param settings - Account settings used to resolve MEG group membership.
 * @returns Batches where MEG-linked keys share a batch and independent keys are alone.
 */
function getFeatureFlagBatches(requestedFeatureKeys, settings) {
    var _a, _b;
    if (!requestedFeatureKeys.length) {
        return [];
    }
    var evaluationBatches = [];
    // Tracks feature keys already placed into a batch.
    var assignedFeatureKeys = new Set();
    var _loop_1 = function (featureKey) {
        if (assignedFeatureKeys.has(featureKey)) {
            return "continue";
        }
        var megGroups = (0, CampaignUtil_1.findGroupsFeaturePartOf)(settings, featureKey);
        var rawMegGroupId = (_a = megGroups[0]) === null || _a === void 0 ? void 0 : _a.groupId;
        var megGroupId = rawMegGroupId != null ? Number(rawMegGroupId) : NaN;
        if (!(0, DataTypeUtil_1.isNaN)(megGroupId)) {
            var megGroupFeatureKeys_1 = (_b = (0, MegUtil_1.getFeatureKeysFromGroup)(settings, megGroupId).featureKeys) !== null && _b !== void 0 ? _b : [];
            var requestedMegFeatureKeys = requestedFeatureKeys.filter(function (requestedFeatureKey) {
                return megGroupFeatureKeys_1.includes(requestedFeatureKey) && !assignedFeatureKeys.has(requestedFeatureKey);
            });
            // Never drop a requested key when group lookup is empty or mismatched.
            var megBatchFeatureKeys = requestedMegFeatureKeys.length > 0 ? requestedMegFeatureKeys : [featureKey];
            // One batch per MEG group present in this request.
            evaluationBatches.push({ featureKeys: megBatchFeatureKeys });
            megBatchFeatureKeys.forEach(function (assignedFeatureKey) { return assignedFeatureKeys.add(assignedFeatureKey); });
            return "continue";
        }
        // Independent flags become their own parallelizable batch.
        evaluationBatches.push({ featureKeys: [featureKey] });
        assignedFeatureKeys.add(featureKey);
    };
    for (var _i = 0, requestedFeatureKeys_1 = requestedFeatureKeys; _i < requestedFeatureKeys_1.length; _i++) {
        var featureKey = requestedFeatureKeys_1[_i];
        _loop_1(featureKey);
    }
    return evaluationBatches;
}
//# sourceMappingURL=megGroupPartitionUtil.js.map