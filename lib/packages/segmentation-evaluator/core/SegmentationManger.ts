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
import { getFromGatewayService, getQueryParams } from '../../../utils/GatewayServiceUtil';
import { UrlEnum } from '../../../enums/UrlEnum';
import { LogManager } from '../../logger';
import { ContextModel } from '../../../models/user/ContextModel';
import { FeatureModel } from '../../../models/campaign/FeatureModel';
import { ContextVWOModel } from '../../../models/user/ContextVWOModel';
import { SettingsManager } from '../../../services/SettingsManager';
import { isUndefined } from '../../../utils/DataTypeUtil';

export class SegmentationManager {
  private static instance: SegmentationManager; // Singleton instance of SegmentationManager
  evaluator: SegmentEvaluator; // Holds the instance of SegmentEvaluator

  /**
   * Singleton pattern implementation for getting the instance of SegmentationManager.
   * @returns {SegmentationManager} The singleton instance.
   */
  static get Instance(): SegmentationManager {
    this.instance = this.instance || new SegmentationManager(); // Create new instance if it doesn't exist
    return this.instance;
  }

  /**
   * Attaches an evaluator to the manager, or creates a new one if none is provided.
   * @param {SegmentEvaluator} evaluator - Optional evaluator to attach.
   */
  attachEvaluator(evaluator?: SegmentEvaluator): void {
    this.evaluator = evaluator || new SegmentEvaluator(); // Use provided evaluator or create new one
  }

  /**
   * Sets the contextual data for the segmentation process.
   * @param {any} settings - The settings data.
   * @param {any} feature - The feature data including segmentation needs.
   * @param {any} context - The context data for the evaluation.
   */
  async setContextualData(settings: SettingsModel, feature: FeatureModel, context: ContextModel) {
    this.attachEvaluator(); // Ensure a fresh evaluator instance
    this.evaluator.settings = settings; // Set settings in evaluator
    this.evaluator.context = context; // Set context in evaluator
    this.evaluator.feature = feature; // Set feature in evaluator

    // if both user agent and ip is null then we should not get data from gateway service
    if (context?.getUserAgent() === null && context?.getIpAddress() === null) {
      return;
    }

    if (feature.getIsGatewayServiceRequired() === true) {
      if (
        SettingsManager.Instance.isGatewayServiceProvided &&
        (isUndefined(context.getVwo()) || context.getVwo() === null)
      ) {
        const queryParams = {};
        if (context?.getUserAgent()) {
          queryParams['userAgent'] = context.getUserAgent();
        }

        if (context?.getIpAddress()) {
          queryParams['ipAddress'] = context.getIpAddress();
        }
        try {
          const params = getQueryParams(queryParams);
          const _vwo = await getFromGatewayService(params, UrlEnum.GET_USER_DATA);
          context.setVwo(new ContextVWOModel().modelFromDictionary(_vwo));
        } catch (err) {
          LogManager.Instance.error(`Error in setting contextual data for segmentation. Got error: ${err.error}`);
        }
      }
    }
  }

  /**
   * Validates the segmentation against provided DSL and properties.
   * @param {Record<string, dynamic>} dsl - The segmentation DSL.
   * @param {Record<any, dynamic>} properties - The properties to validate against.
   * @param {SettingsModel} settings - The settings model.
   * @param {any} context - Optional context.
   * @returns {Promise<boolean>} True if segmentation is valid, otherwise false.
   */
  async validateSegmentation(dsl: Record<string, dynamic>, properties: Record<any, dynamic>): Promise<boolean> {
    return await this.evaluator.isSegmentationValid(dsl, properties); // Delegate to evaluator's method
  }
}
