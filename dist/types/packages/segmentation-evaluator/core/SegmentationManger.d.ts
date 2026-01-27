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
import { SegmentEvaluator } from '../evaluators/SegmentEvaluator';
import { dynamic } from '../../../types/Common';
import { ContextModel } from '../../../models/user/ContextModel';
import { FeatureModel } from '../../../models/campaign/FeatureModel';
import { ServiceContainer } from '../../../services/ServiceContainer';
export declare class SegmentationManager {
  evaluator: SegmentEvaluator;
  /**
   * Constructor for SegmentationManager.
   */
  constructor();
  /**
   * Sets the contextual data for the segmentation process.
   * @param {any} settings - The settings data.
   * @param {any} feature - The feature data including segmentation needs.
   * @param {any} context - The context data for the evaluation.
   */
  setContextualData(serviceContainer: ServiceContainer, feature: FeatureModel, context: ContextModel): Promise<void>;
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
