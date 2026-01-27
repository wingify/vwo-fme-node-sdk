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
import { Constants } from '../../constants/index.js';
/**
 * Model for the edge config.
 */
export class EdgeConfigModel {
    constructor() {
        this.shouldWaitForTrackingCalls = true;
    }
    /**
     * Models the edge config from a dictionary.
     * @param edgeConfigModel - The edge config dictionary.
     * @returns {this} - The edge config model.
     */
    modelFromDictionary(edgeConfigModel) {
        if (edgeConfigModel.shouldWaitForTrackingCalls) {
            this.shouldWaitForTrackingCalls = edgeConfigModel.shouldWaitForTrackingCalls;
        }
        if (edgeConfigModel.maxEventsToBatch) {
            this.maxEventsToBatch = edgeConfigModel.maxEventsToBatch;
        }
        else {
            this.maxEventsToBatch = Constants.MAX_EVENTS_PER_REQUEST;
        }
        return this;
    }
    /**
     * Checks if the SDK should wait for a network response.
     * @returns {boolean} - True if the SDK should wait for a network response, false otherwise.
     */
    getShouldWaitForTrackingCalls() {
        return this.shouldWaitForTrackingCalls;
    }
    /**
     * Gets the maximum number of events to batch.
     * @returns {number} - The maximum number of events to batch.
     */
    getMaxEventsToBatch() {
        return this.maxEventsToBatch;
    }
}
//# sourceMappingURL=EdgeConfigModel.js.map