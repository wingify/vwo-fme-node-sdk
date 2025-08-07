"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagApi = exports.Flag = void 0;
const StorageDecorator_1 = require("../decorators/StorageDecorator");
const ApiEnum_1 = require("../enums/ApiEnum");
const CampaignTypeEnum_1 = require("../enums/CampaignTypeEnum");
const log_messages_1 = require("../enums/log-messages");
const CampaignModel_1 = require("../models/campaign/CampaignModel");
const VariableModel_1 = require("../models/campaign/VariableModel");
const VariationModel_1 = require("../models/campaign/VariationModel");
const logger_1 = require("../packages/logger");
const segmentation_evaluator_1 = require("../packages/segmentation-evaluator");
const StorageService_1 = require("../services/StorageService");
const CampaignUtil_1 = require("../utils/CampaignUtil");
const DataTypeUtil_1 = require("../utils/DataTypeUtil");
const DecisionUtil_1 = require("../utils/DecisionUtil");
const FunctionUtil_1 = require("../utils/FunctionUtil");
const ImpressionUtil_1 = require("../utils/ImpressionUtil");
const LogMessageUtil_1 = require("../utils/LogMessageUtil");
const PromiseUtil_1 = require("../utils/PromiseUtil");
const RuleEvaluationUtil_1 = require("../utils/RuleEvaluationUtil");
const NetworkUtil_1 = require("../utils/NetworkUtil");
class Flag {
    constructor(isEnabled, variation) {
        this.enabled = isEnabled;
        this.variation = variation;
    }
    isEnabled() {
        return this.enabled;
    }
    getVariables() {
        return this.variation?.getVariables() || [];
    }
    getVariable(key, defaultValue) {
        const value = this.variation
            ?.getVariables()
            .find((variable) => VariableModel_1.VariableModel.modelFromDictionary(variable).getKey() === key)
            ?.getValue();
        return value !== undefined ? value : defaultValue;
    }
}
exports.Flag = Flag;
class FlagApi {
    static async get(featureKey, settings, context, hooksService) {
        let isEnabled = false;
        let rolloutVariationToReturn = null;
        let experimentVariationToReturn = null;
        let shouldCheckForExperimentsRules = false;
        const passedRulesInformation = {}; // for storing and integration callback
        const deferredObject = new PromiseUtil_1.Deferred();
        const evaluatedFeatureMap = new Map();
        // get feature object from feature key
        const feature = (0, FunctionUtil_1.getFeatureFromKey)(settings, featureKey);
        const decision = {
            featureName: feature?.getName(),
            featureId: feature?.getId(),
            featureKey: feature?.getKey(),
            userId: context?.getId(),
            api: ApiEnum_1.ApiEnum.GET_FLAG,
        };
        const storageService = new StorageService_1.StorageService();
        const storedData = await new StorageDecorator_1.StorageDecorator().getFeatureFromStorage(featureKey, context, storageService);
        if (storedData?.experimentVariationId) {
            if (storedData.experimentKey) {
                const variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.experimentKey, storedData.experimentVariationId);
                if (variation) {
                    logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                        variationKey: variation.getKey(),
                        userId: context.getId(),
                        experimentType: 'experiment',
                        experimentKey: storedData.experimentKey,
                    }));
                    deferredObject.resolve(new Flag(true, variation));
                    return deferredObject.promise;
                }
            }
        }
        else if (storedData?.rolloutKey && storedData?.rolloutId) {
            const variation = (0, CampaignUtil_1.getVariationFromCampaignKey)(settings, storedData.rolloutKey, storedData.rolloutVariationId);
            if (variation) {
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                    variationKey: variation.getKey(),
                    userId: context.getId(),
                    experimentType: 'rollout',
                    experimentKey: storedData.rolloutKey,
                }));
                logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED, {
                    userId: context.getId(),
                }));
                isEnabled = true;
                shouldCheckForExperimentsRules = true;
                rolloutVariationToReturn = variation;
                const featureInfo = {
                    rolloutId: storedData.rolloutId,
                    rolloutKey: storedData.rolloutKey,
                    rolloutVariationId: storedData.rolloutVariationId,
                };
                evaluatedFeatureMap.set(featureKey, featureInfo);
                Object.assign(passedRulesInformation, featureInfo);
            }
        }
        if (!(0, DataTypeUtil_1.isObject)(feature) || feature === undefined) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.FEATURE_NOT_FOUND, {
                featureKey,
            }));
            deferredObject.reject({});
            return deferredObject.promise;
        }
        // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
        await segmentation_evaluator_1.SegmentationManager.Instance.setContextualData(settings, feature, context);
        const rollOutRules = (0, FunctionUtil_1.getSpecificRulesBasedOnType)(feature, CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT); // get all rollout rules
        if (rollOutRules.length > 0 && !isEnabled) {
            const rolloutRulesToEvaluate = [];
            for (const rule of rollOutRules) {
                const { preSegmentationResult, updatedDecision } = await (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, null, storageService, decision);
                Object.assign(decision, updatedDecision);
                if (preSegmentationResult) {
                    // if pre segment passed, then break the loop and check the traffic allocation
                    rolloutRulesToEvaluate.push(rule);
                    evaluatedFeatureMap.set(featureKey, {
                        rolloutId: rule.getId(),
                        rolloutKey: rule.getKey(),
                        rolloutVariationId: rule.getVariations()[0]?.getId(),
                    });
                    break;
                }
                continue; // if rule does not satisfy, then check for other ROLLOUT rules
            }
            if (rolloutRulesToEvaluate.length > 0) {
                const passedRolloutCampaign = new CampaignModel_1.CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
                const variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, passedRolloutCampaign, context.getId());
                if ((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0) {
                    isEnabled = true;
                    shouldCheckForExperimentsRules = true;
                    rolloutVariationToReturn = variation;
                    _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);
                    if ((0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) {
                        await (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, passedRolloutCampaign.getId(), variation.getId(), context);
                    }
                    else {
                        (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, passedRolloutCampaign.getId(), variation.getId(), context);
                    }
                }
            }
        }
        else if (rollOutRules.length === 0) {
            logger_1.LogManager.Instance.debug(log_messages_1.DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT);
            shouldCheckForExperimentsRules = true;
        }
        if (shouldCheckForExperimentsRules) {
            const experimentRulesToEvaluate = [];
            // if rollout rule is passed, get all ab and Personalize rules
            const experimentRules = (0, FunctionUtil_1.getAllExperimentRules)(feature);
            const megGroupWinnerCampaigns = new Map();
            for (const rule of experimentRules) {
                const { preSegmentationResult, whitelistedObject, updatedDecision } = await (0, RuleEvaluationUtil_1.evaluateRule)(settings, feature, rule, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision);
                Object.assign(decision, updatedDecision);
                if (preSegmentationResult) {
                    if (whitelistedObject === null) {
                        // whitelistedObject will be null if pre segment passed but whitelisting failed
                        experimentRulesToEvaluate.push(rule);
                    }
                    else {
                        isEnabled = true;
                        experimentVariationToReturn = whitelistedObject.variation;
                        Object.assign(passedRulesInformation, {
                            experimentId: rule.getId(),
                            experimentKey: rule.getKey(),
                            experimentVariationId: whitelistedObject.variationId,
                        });
                    }
                    break;
                }
                continue;
            }
            if (experimentRulesToEvaluate.length > 0) {
                const campaign = new CampaignModel_1.CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
                const variation = (0, DecisionUtil_1.evaluateTrafficAndGetVariation)(settings, campaign, context.getId());
                if ((0, DataTypeUtil_1.isObject)(variation) && Object.keys(variation).length > 0) {
                    isEnabled = true;
                    experimentVariationToReturn = variation;
                    _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
                    if ((0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) {
                        await (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), variation.getId(), context);
                    }
                    else {
                        (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, campaign.getId(), variation.getId(), context);
                    }
                }
            }
        }
        // If flag is enabled, store it in data
        if (isEnabled) {
            // set storage data
            new StorageDecorator_1.StorageDecorator().setDataInStorage({
                featureKey,
                context,
                ...passedRulesInformation,
            }, storageService);
        }
        // call integration callback, if defined
        hooksService.set(decision);
        hooksService.execute(hooksService.get());
        // Send data for Impact Campaign, if defined
        if (feature.getImpactCampaign()?.getCampaignId()) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.IMPACT_ANALYSIS, {
                userId: context.getId(),
                featureKey,
                status: isEnabled ? 'enabled' : 'disabled',
            }));
            if ((0, NetworkUtil_1.getShouldWaitForTrackingCalls)()) {
                await (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, feature.getImpactCampaign()?.getCampaignId(), isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
                context);
            }
            else {
                (0, ImpressionUtil_1.createAndSendImpressionForVariationShown)(settings, feature.getImpactCampaign()?.getCampaignId(), isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
                context);
            }
        }
        deferredObject.resolve(new Flag(isEnabled, new VariationModel_1.VariationModel().modelFromDictionary(experimentVariationToReturn ?? rolloutVariationToReturn)));
        return deferredObject.promise;
    }
}
exports.FlagApi = FlagApi;
// Not PRIVATE methods but helper methods. If need be, move them to some util file to be reused by other API(s)
function _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision) {
    if (campaign.getType() === CampaignTypeEnum_1.CampaignTypeEnum.ROLLOUT) {
        Object.assign(passedRulesInformation, {
            rolloutId: campaign.getId(),
            rolloutKey: campaign.getKey(),
            rolloutVariationId: variation.getId(),
        });
    }
    else {
        Object.assign(passedRulesInformation, {
            experimentId: campaign.getId(),
            experimentKey: campaign.getKey(),
            experimentVariationId: variation.getId(),
        });
    }
    Object.assign(decision, passedRulesInformation);
}
//# sourceMappingURL=GetFlag.js.map