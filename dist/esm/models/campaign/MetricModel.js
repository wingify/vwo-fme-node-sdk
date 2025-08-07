"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricModel = void 0;
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
class MetricModel {
    modelFromDictionary(metric) {
        this.identifier = metric.identifier || metric.key;
        this.id = metric.i || metric.id;
        this.type = metric.t || metric.type;
        return this;
    }
    getId() {
        return this.id;
    }
    getIdentifier() {
        return this.identifier;
    }
    getType() {
        return this.type;
    }
}
exports.MetricModel = MetricModel;
//# sourceMappingURL=MetricModel.js.map