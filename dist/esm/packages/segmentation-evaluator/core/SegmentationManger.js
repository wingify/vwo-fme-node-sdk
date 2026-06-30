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
import { SegmentEvaluator } from '../evaluators/SegmentEvaluator.js';
import { getFromGatewayService, getQueryParams } from '../../../utils/GatewayServiceUtil.js';
import { UrlEnum } from '../../../enums/UrlEnum.js';
import { ContextWingifyModel } from '../../../models/user/ContextWingifyModel.js';
import { isObject, isUndefined } from '../../../utils/DataTypeUtil.js';
import { ApiEnum } from '../../../enums/ApiEnum.js';
import { getFormattedErrorMessage } from '../../../utils/FunctionUtil.js';
import { SegmentOperandEvaluator } from '../evaluators/SegmentOperandEvaluator.js';
import { SegmentOperatorValueEnum } from '../enums/SegmentOperatorValueEnum.js';
export class SegmentationManager {
    /**
     * Constructor for SegmentationManager.
     */
    constructor() {
        this.evaluator = new SegmentEvaluator();
    }
    /**
     * Sets the contextual data for the segmentation process.
     * @param {any} settings - The settings data.
     * @param {any} feature - The feature data including segmentation needs.
     * @param {any} context - The context data for the evaluation.
     */
    async setContextualData(serviceContainer, feature, context) {
        this.evaluator.serviceContainer = serviceContainer; // Set settings in evaluator
        this.evaluator.context = context; // Set context in evaluator
        this.evaluator.feature = feature; // Set feature in evaluator
        this.evaluator.segmentOperandEvaluator = new SegmentOperandEvaluator(serviceContainer);
        // if both user agent and ip is null then we should not get data from gateway service
        if (context?.getUserAgent() === null && context?.getIpAddress() === null) {
            return;
        }
        const settings = serviceContainer.getSettings();
        // Check if any holdout requires gateway service
        const holdouts = settings.getHoldouts() || [];
        const isGatewayServiceRequiredForHoldouts = holdouts.filter((holdout) => holdout.getIsGatewayServiceRequired() === true).length > 0;
        if (feature.getIsGatewayServiceRequired() === true || isGatewayServiceRequiredForHoldouts) {
            if (serviceContainer.getSettingsService().isGatewayServiceProvided &&
                (isUndefined(context.getVwo()) || context.getVwo() === null)) {
                const queryParams = {};
                if (context?.getUserAgent()) {
                    queryParams['userAgent'] = context.getUserAgent();
                }
                if (context?.getIpAddress()) {
                    queryParams['ipAddress'] = context.getIpAddress();
                }
                try {
                    const params = getQueryParams(queryParams);
                    const _wingify = await getFromGatewayService(serviceContainer, params, UrlEnum.GET_USER_DATA, context);
                    context.setVwo(new ContextWingifyModel().modelFromDictionary(_wingify));
                    this.evaluator.context = context;
                }
                catch (err) {
                    serviceContainer.getLogManager().errorLog('ERROR_SETTING_SEGMENTATION_CONTEXT', {
                        err: getFormattedErrorMessage(err),
                    }, { an: ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
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
    async validateSegmentation(dsl, properties) {
        // If the DSL contains any campaignVariation node but no webTestingCampaigns was provided, fail immediately.
        // This covers NOT/OR/AND wrappers too — there is no web testing data to evaluate against.
        if (this.hasCampaignVariationNode(dsl) && !this.evaluator.context?.getPlatformVariables()?.webTestingCampaigns) {
            return false;
        }
        return await this.evaluator.isSegmentationValid(dsl, properties);
    }
    /**
     * Recursively checks if any node in the DSL tree is a campaignVariation operand.
     * @param {Record<string, dynamic>} dsl - The segmentation DSL to check.
     * @returns {boolean} True if the DSL contains a campaignVariation node, otherwise false.
     */
    hasCampaignVariationNode(dsl) {
        if (!isObject(dsl))
            return false;
        for (const operator of Object.keys(dsl)) {
            if (operator === SegmentOperatorValueEnum.WEB_CAMPAIGN_VARIATION)
                return true;
            const operand = dsl[operator];
            if (Array.isArray(operand)) {
                for (const subDsl of operand) {
                    if (this.hasCampaignVariationNode(subDsl))
                        return true;
                }
            }
            else if (isObject(operand)) {
                if (this.hasCampaignVariationNode(operand))
                    return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=SegmentationManger.js.map