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
import { SettingsModel } from '../../models/settings/SettingsModel';
import { dynamic } from '../../types/Common';

/**
 * Interface for segmentation logic.
 * Provides a method to validate segmentation based on given parameters.
 */
export interface Segmentation {
  /**
   * Validates if the segmentation defined by the DSL is applicable given the properties and settings.
   *
   * @param dsl - The domain-specific language defining segmentation rules.
   * @param properties - The properties of the entity to be segmented.
   * @param settings - The settings model containing configuration details.
   * @returns {boolean | Promise<any>} - True if the segmentation is valid, otherwise false or a Promise resolving to any type.
   */
  isSegmentationValid(dsl: Record<string, dynamic>, properties: Record<string, dynamic>, settings: SettingsModel): boolean | Promise<any>;
}
