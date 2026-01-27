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
import { StorageDecorator } from '../decorators/StorageDecorator.js';
import { ApiEnum } from '../enums/ApiEnum.js';
import { CampaignTypeEnum } from '../enums/CampaignTypeEnum.js';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { CampaignModel } from '../models/campaign/CampaignModel.js';
import { VariableModel } from '../models/campaign/VariableModel.js';
import { VariationModel } from '../models/campaign/VariationModel.js';
import { LogLevelEnum } from '../packages/logger/index.js';
import { StorageService } from '../services/StorageService.js';
import { getVariationFromCampaignKey } from '../utils/CampaignUtil.js';
import { isObject } from '../utils/DataTypeUtil.js';
import { evaluateTrafficAndGetVariation } from '../utils/DecisionUtil.js';
import { getAllExperimentRules, getFeatureFromKey, getSpecificRulesBasedOnType } from '../utils/FunctionUtil.js';
import { createAndSendImpressionForVariationShown } from '../utils/ImpressionUtil.js';
import { buildMessage } from '../utils/LogMessageUtil.js';
import { Deferred } from '../utils/PromiseUtil.js';
import { evaluateRule } from '../utils/RuleEvaluationUtil.js';
import { extractDecisionKeys, sendDebugEventToVWO } from '../utils/DebuggerServiceUtil.js';
import { DebuggerCategoryEnum } from '../enums/DebuggerCategoryEnum.js';
import { Constants } from '../constants/index.js';
import { isFeatureIdPresentInSettings } from '../utils/CampaignUtil.js';
export class Flag {
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
            .find((variable) => VariableModel.modelFromDictionary(variable).getKey() === key)
            ?.getValue();
        return value !== undefined ? value : defaultValue;
    }
}
export class FlagApi {
    static async get(featureKey, context, serviceContainer) {
        let isEnabled = false;
        let rolloutVariationToReturn = null;
        let experimentVariationToReturn = null;
        let shouldCheckForExperimentsRules = false;
        const passedRulesInformation = {}; // for storing and integration callback
        const deferredObject = new Deferred();
        const evaluatedFeatureMap = new Map();
        // get feature object from feature key
        const feature = getFeatureFromKey(serviceContainer.getSettings(), featureKey);
        const decision = {
            featureName: feature?.getName(),
            featureId: feature?.getId(),
            featureKey: feature?.getKey(),
            userId: context?.getId(),
            api: ApiEnum.GET_FLAG,
        };
        // create debug event props
        const debugEventProps = {
            an: ApiEnum.GET_FLAG,
            uuid: context.getUuid(),
            fk: feature?.getKey(),
            sId: context.getSessionId(),
        };
        const storageService = new StorageService(serviceContainer);
        const storedData = await new StorageDecorator().getFeatureFromStorage(featureKey, context, storageService, serviceContainer);
        if (storedData?.featureId && isFeatureIdPresentInSettings(serviceContainer.getSettings(), storedData.featureId)) {
            if (storedData?.experimentVariationId) {
                if (storedData.experimentKey) {
                    const variation = getVariationFromCampaignKey(serviceContainer.getSettings(), storedData.experimentKey, storedData.experimentVariationId);
                    if (variation) {
                        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
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
                const variation = getVariationFromCampaignKey(serviceContainer.getSettings(), storedData.rolloutKey, storedData.rolloutVariationId);
                if (variation) {
                    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.STORED_VARIATION_FOUND, {
                        variationKey: variation.getKey(),
                        userId: context.getId(),
                        experimentType: 'rollout',
                        experimentKey: storedData.rolloutKey,
                    }));
                    serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED, {
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
        }
        if (!isObject(feature) || feature === undefined) {
            serviceContainer.getLogManager().errorLog('FEATURE_NOT_FOUND', {
                featureKey,
            }, debugEventProps);
            deferredObject.reject({});
            return deferredObject.promise;
        }
        // TODO: remove await from here, need not wait for gateway service at the time of calling getFlag
        await serviceContainer.getSegmentationManager().setContextualData(serviceContainer, feature, context);
        const rollOutRules = getSpecificRulesBasedOnType(feature, CampaignTypeEnum.ROLLOUT); // get all rollout rules
        if (rollOutRules.length > 0 && !isEnabled) {
            const rolloutRulesToEvaluate = [];
            for (const rule of rollOutRules) {
                const { preSegmentationResult, updatedDecision } = await evaluateRule(serviceContainer, feature, rule, context, evaluatedFeatureMap, null, storageService, decision);
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
                const passedRolloutCampaign = new CampaignModel().modelFromDictionary(rolloutRulesToEvaluate[0]);
                const variation = evaluateTrafficAndGetVariation(serviceContainer, passedRolloutCampaign, context.getId());
                if (isObject(variation) && Object.keys(variation).length > 0) {
                    isEnabled = true;
                    shouldCheckForExperimentsRules = true;
                    rolloutVariationToReturn = variation;
                    _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);
                    if (serviceContainer.getShouldWaitForTrackingCalls()) {
                        await createAndSendImpressionForVariationShown(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey);
                    }
                    else {
                        createAndSendImpressionForVariationShown(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey);
                    }
                }
            }
        }
        else if (rollOutRules.length === 0) {
            serviceContainer.getLogManager().debug(DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT);
            shouldCheckForExperimentsRules = true;
        }
        if (shouldCheckForExperimentsRules) {
            const experimentRulesToEvaluate = [];
            // if rollout rule is passed, get all ab and Personalize rules
            const experimentRules = getAllExperimentRules(feature);
            const megGroupWinnerCampaigns = new Map();
            for (const rule of experimentRules) {
                const { preSegmentationResult, whitelistedObject, updatedDecision } = await evaluateRule(serviceContainer, feature, rule, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision);
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
                const campaign = new CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
                const variation = evaluateTrafficAndGetVariation(serviceContainer, campaign, context.getId());
                if (isObject(variation) && Object.keys(variation).length > 0) {
                    isEnabled = true;
                    experimentVariationToReturn = variation;
                    _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
                    if (serviceContainer.getShouldWaitForTrackingCalls()) {
                        await createAndSendImpressionForVariationShown(serviceContainer, campaign.getId(), variation.getId(), context, featureKey);
                    }
                    else {
                        createAndSendImpressionForVariationShown(serviceContainer, campaign.getId(), variation.getId(), context, featureKey);
                    }
                }
            }
        }
        // If flag is enabled, store it in data
        if (isEnabled) {
            // set storage data
            new StorageDecorator().setDataInStorage({
                featureKey,
                featureId: feature.getId(),
                context,
                ...passedRulesInformation,
            }, storageService, serviceContainer);
        }
        // call integration callback, if defined
        serviceContainer.getHooksService().set(decision);
        serviceContainer.getHooksService().execute(serviceContainer.getHooksService().get());
        // send debug event, if debugger is enabled
        if (feature.getIsDebuggerEnabled()) {
            debugEventProps.cg = DebuggerCategoryEnum.DECISION;
            debugEventProps.lt = LogLevelEnum.INFO.toString();
            debugEventProps.msg_t = Constants.FLAG_DECISION_GIVEN;
            // update debug event props with decision keys
            _updateDebugEventProps(debugEventProps, decision);
            // send debug event
            sendDebugEventToVWO(serviceContainer, debugEventProps);
        }
        // Send data for Impact Campaign, if defined
        if (feature.getImpactCampaign()?.getCampaignId()) {
            serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.IMPACT_ANALYSIS, {
                userId: context.getId(),
                featureKey,
                status: isEnabled ? 'enabled' : 'disabled',
            }));
            if (serviceContainer.getShouldWaitForTrackingCalls()) {
                await createAndSendImpressionForVariationShown(serviceContainer, feature.getImpactCampaign()?.getCampaignId(), isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
                context, featureKey);
            }
            else {
                createAndSendImpressionForVariationShown(serviceContainer, feature.getImpactCampaign()?.getCampaignId(), isEnabled ? 2 : 1, // 2 is for Variation(flag enabled), 1 is for Control(flag disabled)
                context, featureKey);
            }
        }
        deferredObject.resolve(new Flag(isEnabled, new VariationModel().modelFromDictionary(experimentVariationToReturn ?? rolloutVariationToReturn)));
        return deferredObject.promise;
    }
}
// Not PRIVATE methods but helper methods. If need be, move them to some util file to be reused by other API(s)
function _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision) {
    if (campaign.getType() === CampaignTypeEnum.ROLLOUT) {
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
/**
 * Update debug event props with decision keys
 * @param debugEventProps - Debug event props
 * @param decision - Decision
 */
function _updateDebugEventProps(debugEventProps, decision) {
    const decisionKeys = extractDecisionKeys(decision);
    let message = `Flag decision given for feature:${decision.featureKey}.`;
    if (decision.rolloutKey && decision.rolloutVariationId) {
        message += ` Got rollout:${decision.rolloutKey.substring((decision.featureKey + '_').length)} with variation:${decision.rolloutVariationId}`;
    }
    if (decision.experimentKey && decision.experimentVariationId) {
        message += ` and experiment:${decision.experimentKey.substring((decision.featureKey + '_').length)} with variation:${decision.experimentVariationId}`;
    }
    debugEventProps.msg = message;
    Object.assign(debugEventProps, decisionKeys);
}
//# sourceMappingURL=GetFlag.js.map