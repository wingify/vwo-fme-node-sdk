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
exports.HoldoutModel = void 0;
var MetricModel_1 = require("./MetricModel");
var HoldoutModel = /** @class */ (function () {
    function HoldoutModel() {
        this.segments = {};
        this.featureIds = [];
        this.m = [];
        this.metrics = [];
        this.isGatewayServiceRequired = false;
        this.name = '';
    }
    HoldoutModel.prototype.modelFromDictionary = function (data) {
        var _this = this;
        var _a;
        if (!data) {
            return this;
        }
        this.id = data.id;
        this.segments = data.segments || {};
        this.percentTraffic = data.percentTraffic || 0;
        this.isGlobal = !!data.isGlobal;
        this.featureIds = Array.isArray(data.featureIds) ? data.featureIds : [];
        this.name = data.name || '';
        if (data === null || data === void 0 ? void 0 : data.isGatewayServiceRequired) {
            this.isGatewayServiceRequired = data.isGatewayServiceRequired;
        }
        if ((data.m && data.m.constructor === {}.constructor) || ((_a = data.metrics) === null || _a === void 0 ? void 0 : _a.constructor) === {}.constructor) {
            this.metrics = [];
        }
        else {
            var metricList = data.m || data.metrics;
            metricList === null || metricList === void 0 ? void 0 : metricList.forEach(function (metric) {
                _this.metrics.push(new MetricModel_1.MetricModel().modelFromDictionary(metric));
            });
        }
        return this;
    };
    HoldoutModel.prototype.getId = function () {
        return this.id;
    };
    HoldoutModel.prototype.getSegments = function () {
        return this.segments || {};
    };
    HoldoutModel.prototype.getPercentTraffic = function () {
        return this.percentTraffic;
    };
    HoldoutModel.prototype.getIsGlobal = function () {
        return this.isGlobal;
    };
    HoldoutModel.prototype.getFeatureIds = function () {
        return this.featureIds;
    };
    HoldoutModel.prototype.getMetrics = function () {
        return this.metrics;
    };
    HoldoutModel.prototype.getIsGatewayServiceRequired = function () {
        return this.isGatewayServiceRequired;
    };
    HoldoutModel.prototype.setIsGatewayServiceRequired = function (isGatewayServiceRequired) {
        this.isGatewayServiceRequired = isGatewayServiceRequired;
    };
    HoldoutModel.prototype.getName = function () {
        return this.name;
    };
    HoldoutModel.prototype.setName = function (name) {
        this.name = name;
    };
    return HoldoutModel;
}());
exports.HoldoutModel = HoldoutModel;
//# sourceMappingURL=HoldoutModel.js.map