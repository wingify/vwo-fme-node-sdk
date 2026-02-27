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
import { MetricModel } from './MetricModel.js';
export class HoldoutModel {
    constructor() {
        this.segments = {};
        this.featureIds = [];
        this.m = [];
        this.metrics = [];
        this.isGatewayServiceRequired = false;
        this.name = '';
    }
    modelFromDictionary(data) {
        if (!data) {
            return this;
        }
        this.id = data.id;
        this.segments = data.segments || {};
        this.percentTraffic = data.percentTraffic || 0;
        this.isGlobal = !!data.isGlobal;
        this.featureIds = Array.isArray(data.featureIds) ? data.featureIds : [];
        this.name = data.name || '';
        if (data?.isGatewayServiceRequired) {
            this.isGatewayServiceRequired = data.isGatewayServiceRequired;
        }
        if ((data.m && data.m.constructor === {}.constructor) || data.metrics?.constructor === {}.constructor) {
            this.metrics = [];
        }
        else {
            const metricList = data.m || data.metrics;
            metricList?.forEach((metric) => {
                this.metrics.push(new MetricModel().modelFromDictionary(metric));
            });
        }
        return this;
    }
    getId() {
        return this.id;
    }
    getSegments() {
        return this.segments || {};
    }
    getPercentTraffic() {
        return this.percentTraffic;
    }
    getIsGlobal() {
        return this.isGlobal;
    }
    getFeatureIds() {
        return this.featureIds;
    }
    getMetrics() {
        return this.metrics;
    }
    getIsGatewayServiceRequired() {
        return this.isGatewayServiceRequired;
    }
    setIsGatewayServiceRequired(isGatewayServiceRequired) {
        this.isGatewayServiceRequired = isGatewayServiceRequired;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
}
//# sourceMappingURL=HoldoutModel.js.map