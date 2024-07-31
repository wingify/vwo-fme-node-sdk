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
import { SegmentEvaluator } from '../evaluators/SegmentEvaluator';
import { dynamic } from '../../../types/Common';
import { SettingsModel } from '../../../models/settings/SettingsModel';
import { ContextModel } from '../../../models/user/ContextModel';
import { FeatureModel } from '../../../models/campaign/FeatureModel';
export declare class SegmentationManager {
  private static instance;
  evaluator: SegmentEvaluator;
  /**
   * Singleton pattern implementation for getting the instance of SegmentationManager.
   * @returns {SegmentationManager} The singleton instance.
   */
  static get Instance(): SegmentationManager;
  /**
   * Attaches an evaluator to the manager, or creates a new one if none is provided.
   * @param {SegmentEvaluator} evaluator - Optional evaluator to attach.
   */
  attachEvaluator(evaluator?: SegmentEvaluator): void;
  /**
   * Sets the contextual data for the segmentation process.
   * @param {any} settings - The settings data.
   * @param {any} feature - The feature data including segmentation needs.
   * @param {any} context - The context data for the evaluation.
   */
  setContextualData(settings: SettingsModel, feature: FeatureModel, context: ContextModel): Promise<void>;
  /**
   * Validates the segmentation against provided DSL and properties.
   * @param {Record<string, dynamic>} dsl - The segmentation DSL.
   * @param {Record<any, dynamic>} properties - The properties to validate against.
   * @param {SettingsModel} settings - The settings model.
   * @param {any} context - Optional context.
   * @returns {Promise<boolean>} True if segmentation is valid, otherwise false.
   */
  validateSegmentation(dsl: Record<string, dynamic>, properties: Record<any, dynamic>): Promise<boolean>;
}
