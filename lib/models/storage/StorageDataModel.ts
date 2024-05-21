/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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

export class StorageDataModel {
  private featureKey: string;
  private context: ContextModel;
  private rolloutId: number;
  private rolloutKey: string;
  private rolloutVariationId: number;
  private experimentId: number;
  private experimentKey: string;
  private experimentVariationId: number;

  modelFromDictionary(storageData: StorageDataModel): this {
    this.featureKey = storageData.featureKey;
    this.context = storageData.context;
    this.rolloutId = storageData.rolloutId;
    this.rolloutKey = storageData.rolloutKey;
    this.rolloutVariationId = storageData.rolloutVariationId;
    this.experimentId = storageData.experimentId;
    this.experimentKey = storageData.experimentKey;
    this.experimentVariationId = storageData.experimentVariationId;
    return this;
  }

  getFeatureKey(): string {
    return this.featureKey;
  }

  getContext(): ContextModel {
    return this.context;
  }

  getRolloutId(): number {
    return this.rolloutId;
  }

  getRolloutKey(): string {
    return this.rolloutKey;
  }

  getRolloutVariationId(): number {
    return this.rolloutVariationId;
  }

  getExperimentId(): number {
    return this.experimentId;
  }

  getExperimentKey(): string {
    return this.experimentKey;
  }

  getExperimentVariationId(): number {
    return this.experimentVariationId;
  }

  setFeatureKey(featureKey: string): void {
    this.featureKey = featureKey;
  }

  setContext(context: ContextModel): void {
    this.context = context;
  }

  setRolloutId(rolloutId: number): void {
    this.rolloutId = rolloutId;
  }

  setRolloutKey(rolloutKey: string): void {
    this.rolloutKey = rolloutKey;
  }

  setRolloutVariationId(rolloutVariationId: number): void {
    this.rolloutVariationId = rolloutVariationId;
  }

  setExperimentId(experimentId: number): void {
    this.experimentId = experimentId;
  }

  setExperimentKey(experimentKey: string): void {
    this.experimentKey = experimentKey;
  }

  setExperimentVariationId(experimentVariationId: number): void {
    this.experimentVariationId = experimentVariationId;
  }
}
