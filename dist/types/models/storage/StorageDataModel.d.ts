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
import { ContextModel } from '../user/ContextModel';
export declare class StorageDataModel {
    private featureKey;
    private context;
    private rolloutId;
    private rolloutKey;
    private rolloutVariationId;
    private experimentId;
    private experimentKey;
    private experimentVariationId;
    modelFromDictionary(storageData: StorageDataModel): this;
    getFeatureKey(): string;
    getContext(): ContextModel;
    getRolloutId(): number;
    getRolloutKey(): string;
    getRolloutVariationId(): number;
    getExperimentId(): number;
    getExperimentKey(): string;
    getExperimentVariationId(): number;
    setFeatureKey(featureKey: string): void;
    setContext(context: ContextModel): void;
    setRolloutId(rolloutId: number): void;
    setRolloutKey(rolloutKey: string): void;
    setRolloutVariationId(rolloutVariationId: number): void;
    setExperimentId(experimentId: number): void;
    setExperimentKey(experimentKey: string): void;
    setExperimentVariationId(experimentVariationId: number): void;
}
