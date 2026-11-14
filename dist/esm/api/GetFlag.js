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
import { getCampaignKeyFromCampaignId, getVariationFromCampaignKey, isFeatureIdPresentInSettings, } from '../utils/CampaignUtil.js';
import { isObject, isArray } from '../utils/DataTypeUtil.js';
import { evaluateTrafficAndGetVariation } from '../utils/DecisionUtil.js';
import { getAllExperimentRules, getFeatureFromKey, getSpecificRulesBasedOnType } from '../utils/FunctionUtil.js';
import { buildMessage } from '../utils/LogMessageUtil.js';
import { Deferred } from '../utils/PromiseUtil.js';
import { evaluateRule } from '../utils/RuleEvaluationUtil.js';
import { extractDecisionKeys, sendDebugEventToWingify } from '../utils/DebuggerServiceUtil.js';
import { DebuggerCategoryEnum } from '../enums/DebuggerCategoryEnum.js';
import { Constants } from '../constants/index.js';
import { getActiveEventDispatchPolicy } from '../utils/EventDispatchPolicyUtil.js';
import { getCurrentGetFlagsBatchContext } from '../services/GetFlagsBatchContext.js';
import { getApplicableHoldouts, getMatchedHoldouts, sendNetworkCallsForNotInHoldouts } from '../utils/HoldoutUtil.js';
import { sendImpressionForVariationShown, sendImpressionForVariationShownInBatch } from '../utils/ImpressionUtil.js';
import { collectDeferredImpression, hasDeferredImpressionScope, runWithDeferredImpressionScope, takeDeferredImpressions, } from '../utils/DeferredImpressionCollector.js';
import { exposeFlagResult } from '../utils/ImpressionExposureUtil.js';
import { EventEnum } from '../enums/EventEnum.js';
import { createHoldoutPayload, getEventsBaseProperties, getTrackUserPayloadData, getTrackingUsagePayloadData, sendPostApiRequest, } from '../utils/NetworkUtil.js';
export class Flag {
    constructor(isEnabled, sessionId, uuid, variation) {
        this.deferredImpressionPayloads = [];
        this.hasImpressionBeenSent = false;
        this.enabled = isEnabled;
        this.variation = variation;
        this.sessionId = sessionId;
        this.uuid = uuid;
    }
    isEnabled() {
        return this.enabled;
    }
    getSessionId() {
        return this.sessionId;
    }
    getUUID() {
        return this.uuid;
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
    /**
     * Sends deferred variationShown impressions stashed during fetchFlags.
     * Idempotent: subsequent calls are no-ops after the stash is cleared.
     *
     * @returns {boolean} True when an impression was enqueued or sent, false otherwise.
     */
    async exposeResult() {
        // Transport and the second-call guard live in the util so Flag stays free of the network stack.
        return exposeFlagResult(this);
    }
    /**
     * Stores the dependencies needed to send deferred impressions from exposeResult().
     *
     * @internal
     * @param exposeDependencies - Service container, context, and feature key used when exposing.
     * @returns {void}
     */
    attachExposeDependencies(exposeDependencies) {
        // Keep this flag's enabled state, not whatever the caller passed in.
        this.exposeDependencies = { ...exposeDependencies, isEnabled: this.enabled };
    }
    /**
     * Returns the dependencies attached for exposeResult().
     *
     * @internal
     * @returns {ExposeDependencies | undefined} Expose dependencies, or undefined when none were attached (e.g. error flags).
     */
    getExposeDependencies() {
        return this.exposeDependencies;
    }
    /**
     * Appends deferred variationShown payloads collected during evaluation.
     *
     * @internal
     * @param deferredPayloads - Deferred impression payloads to hold until exposeResult().
     * @returns {void}
     */
    addDeferredImpressions(deferredPayloads) {
        // An empty list means this rule path produced nothing to expose later.
        if (!deferredPayloads?.length) {
            return;
        }
        this.deferredImpressionPayloads.push(...deferredPayloads);
    }
    /**
     * Returns all held impression payloads and clears the stash.
     *
     * @internal
     * @returns {any[]} Copy of the held impression payloads.
     */
    consumeDeferredImpressions() {
        // Copy before clearing so the caller still has the payloads after the stash is emptied.
        const consumedPayloads = this.deferredImpressionPayloads.slice();
        // Empty now so a second exposeResult cannot send the same payloads.
        this.deferredImpressionPayloads = [];
        return consumedPayloads;
    }
    /**
     * Marks impressions as sent and clears any held payloads, making exposeResult() a no-op.
     *
     * @internal
     * @returns {void}
     */
    markImpressionSent() {
        // Later exposeResult calls should no-op even if another payload is added.
        this.hasImpressionBeenSent = true;
        this.deferredImpressionPayloads = [];
    }
    /**
     * Returns whether impressions for this flag were already sent.
     *
     * @internal
     * @returns {boolean} True when impressions were sent during evaluation or by exposeResult().
     */
    isImpressionAlreadySent() {
        return this.hasImpressionBeenSent;
    }
    /**
     * Returns whether this flag still holds deferred impression payloads.
     *
     * @internal
     * @returns {boolean} True when at least one impression payload is waiting for exposeResult().
     */
    hasPendingImpressions() {
        return this.deferredImpressionPayloads.length > 0;
    }
}
export class FlagApi {
    /**
     * Attaches deferred impression stash + expose deps for Flag.exposeResult().
     *
     * @param flag - Evaluated flag to finalize.
     * @param serviceContainer - Shared SDK service container.
     * @param context - User context used for the evaluation.
     * @param featureKey - Feature key of the evaluated flag.
     * @param isImpressionDispatchEnabled - Whether impressions were dispatched during evaluation.
     * @returns {Flag} The same flag with expose deps and any deferred impressions attached.
     */
    static prepareFlagForExposeResult(flag, serviceContainer, context, featureKey, isImpressionDispatchEnabled) {
        // exposeResult needs the same client, user, and feature that produced this decision.
        flag.attachExposeDependencies({
            serviceContainer,
            context,
            featureKey,
            isEnabled: flag.isEnabled(),
        });
        const deferredPayloads = takeDeferredImpressions();
        if (deferredPayloads.length > 0) {
            // fetchFlags held these back so exposeResult can send them later.
            flag.addDeferredImpressions(deferredPayloads);
        }
        else if (isImpressionDispatchEnabled) {
            // Nothing left to expose: impressions already went out, or this decision had none.
            flag.markImpressionSent();
        }
        return flag;
    }
    /**
     * Evaluates a feature flag for a user inside a deferred-impression collection scope.
     *
     * @param featureKey - Feature key to evaluate.
     * @param context - User context for the evaluation.
     * @param serviceContainer - Shared SDK service container.
     * @returns {Promise<Flag>} The evaluated flag.
     */
    static async get(featureKey, context, serviceContainer) {
        // Keep this feature's deferred payloads separate from any parallel evaluation.
        return runWithDeferredImpressionScope(featureKey, () => FlagApi.evaluateFlag(featureKey, context, serviceContainer));
    }
    /**
     * Runs the full flag evaluation: stored decisions, holdouts, rollout and experiment rules,
     * impressions, MAU usage tracking, and storage writes.
     *
     * @param featureKey - Feature key to evaluate.
     * @param context - User context for the evaluation.
     * @param serviceContainer - Shared SDK service container.
     * @returns {Promise<Flag>} The evaluated flag, finalized for exposeResult().
     */
    static async evaluateFlag(featureKey, context, serviceContainer) {
        let isEnabled = false;
        let rolloutVariationToReturn = null;
        let experimentVariationToReturn = null;
        let shouldCheckForExperimentsRules = false;
        const passedRulesInformation = {}; // for storing and integration callback
        const deferredObject = new Deferred();
        const evaluatedFeatureMap = new Map();
        const notInHoldoutIds = [];
        const batchPayload = [];
        const isSettingsDevModeEnabled = serviceContainer.getSettings()?.getDevMode?.() === true;
        const isUserDevModeEnabled = context?.getIsDevMode?.() === true;
        const isDevModeForUser = isSettingsDevModeEnabled && isUserDevModeEnabled;
        const eventDispatchPolicy = getActiveEventDispatchPolicy(serviceContainer);
        const isTrackingSuppressed = !!(serviceContainer.getSuppressTrackingCalls() || getCurrentGetFlagsBatchContext()?.suppressTrackingCalls);
        // getFlags(shouldSendTrackingCalls: false) sets the legacy suppress flag and must not build impressions.
        // fetchFlags leaves that flag false and blocks dispatch via policy, so payloads are still built and deferred.
        const isImpressionDispatchEnabled = !isDevModeForUser && eventDispatchPolicy.shouldDispatchImpressions && !isTrackingSuppressed;
        const shouldFireImpressionEvents = !isDevModeForUser && !isTrackingSuppressed;
        // Check if usage tracking is enabled for this account.
        // isMAU is sent in settings only when the account has usage tracking enabled.
        const isTrackingUsageEnabled = serviceContainer.getSettings()?.getIsTrackingUsageEnabled?.() === true;
        // Track whether a primary variationShown event was already dispatched this evaluation.
        // If true, server already received a usage tracking qualifying event — skip our explicit usage tracking call
        // to avoid an unnecessary duplicate network round trip (server deduplicates on its end).
        let isVariationShownFired = false;
        // get feature object from feature key
        const feature = getFeatureFromKey(serviceContainer.getSettings(), featureKey);
        const decision = {
            featureName: feature?.getName(),
            featureId: feature?.getId(),
            featureKey: feature?.getKey(),
            userId: context?.getId(),
            api: ApiEnum.GET_FLAG,
            holdoutIDs: [],
            isPartOfHoldout: false,
            isHoldoutPresent: false,
            isUserPartOfCampaign: false,
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
        // if storedData has isInHoldoutId, then check if the settings stil contain atleast 1 holdoutGroup that is present in the storedData
        const storedIsInHoldoutId = storedData?.isInHoldoutId ?? storedData?.holdoutGroupId;
        const storedNotInHoldoutId = storedData?.notInHoldoutId ?? [];
        if (storedIsInHoldoutId && (isArray(storedIsInHoldoutId) ? storedIsInHoldoutId.length > 0 : true)) {
            // get all appicable holdouts for the feature
            const applicableHoldouts = getApplicableHoldouts(serviceContainer.getSettings(), feature.getId());
            if (applicableHoldouts.length > 0) {
                for (const holdout of applicableHoldouts) {
                    // if the holdout id is present in the storedData, then return the disabled flag
                    if (storedIsInHoldoutId.includes(holdout.getId())) {
                        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.STORED_HOLDOUT_DECISION_FOUND, {
                            featureKey,
                            userId: context.getId(),
                            holdoutId: storedIsInHoldoutId,
                        }));
                        // evaluate the new holdouts in settings file and send the impression for them
                        const { matchedHoldouts, notMatchedHoldouts, holdoutPayloads } = await getMatchedHoldouts(serviceContainer, feature, context, storedData);
                        // updatedHoldoutIds is the array of holdout ids for which user became part of the holdouts
                        const updatedHoldoutIds = [...storedIsInHoldoutId, ...matchedHoldouts.map((holdout) => holdout.getId())];
                        const updatedNotInHoldoutIds = [
                            ...storedNotInHoldoutId,
                            ...notMatchedHoldouts.map((holdout) => holdout.getId()),
                        ];
                        // store the updated holdout ids in storage and push the updated not in holdout ids to the notInHoldoutIds array
                        new StorageDecorator().setDataInStorage({
                            featureKey,
                            context,
                            isInHoldoutId: updatedHoldoutIds,
                            notInHoldoutId: updatedNotInHoldoutIds,
                        }, storageService, serviceContainer);
                        // send the impression for the new holdouts (only for holdouts newly added to settings
                        // that were not previously evaluated for this user)
                        if (shouldFireImpressionEvents) {
                            if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
                                for (const payload of holdoutPayloads) {
                                    sendImpressionForVariationShown(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                                }
                            }
                            else {
                                if (serviceContainer.getShouldWaitForTrackingCalls()) {
                                    await sendImpressionForVariationShownInBatch(serviceContainer, holdoutPayloads);
                                }
                                else {
                                    sendImpressionForVariationShownInBatch(serviceContainer, holdoutPayloads);
                                }
                            }
                        }
                        // Decision served from holdout storage cache.
                        // The cached holdout variationShown is NOT re-fired, so server has no usage tracking signal.
                        // Send usage tracking call before returning.
                        sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey); // fire-and-forget
                        // fetchFlags only: rebuild held impressions from the stored holdout so exposeResult()
                        // still has payloads after a reload. No-op for getFlag / getFlags.
                        if (shouldFireImpressionEvents) {
                            collectStoredDecisionImpressions(serviceContainer, feature, context, storedData, {
                                shouldIncludeExperiment: false,
                                shouldIncludeImpactCampaign: false,
                                isEnabled: false,
                            });
                        }
                        deferredObject.resolve(FlagApi.prepareFlagForExposeResult(new Flag(false, context.getSessionId(), context.getUuid(), new VariationModel()), serviceContainer, context, featureKey, isImpressionDispatchEnabled));
                        return deferredObject.promise;
                    }
                }
            }
        }
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
                        decision.isUserPartOfCampaign = true;
                        // network calls for holdouts that are newly added in settings and are not present in storage
                        await sendNetworkCallsForNotInHoldouts(serviceContainer, feature, context, decision, storedData, storageService);
                        // Experiment decision served from storage cache.
                        // variationShown is NOT re-fired for cached decisions, so server has no usage tracking signal.
                        // Send usage tracking call before returning.
                        sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey); // fire-and-forget
                        // fetchFlags only: rebuild held impressions from the stored experiment (plus rollout
                        // and impact, if present) so exposeResult() still has payloads after a reload.
                        // No-op for getFlag / getFlags.
                        if (shouldFireImpressionEvents) {
                            collectStoredDecisionImpressions(serviceContainer, feature, context, storedData, {
                                shouldIncludeExperiment: true,
                                shouldIncludeImpactCampaign: true,
                                isEnabled: true,
                            });
                        }
                        deferredObject.resolve(FlagApi.prepareFlagForExposeResult(new Flag(true, context.getSessionId(), context.getUuid(), variation), serviceContainer, context, featureKey, isImpressionDispatchEnabled));
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
                    decision.isUserPartOfCampaign = true;
                    serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_ROLLOUT_PASSED, {
                        userId: context.getId(),
                    }));
                    // network calls for holdouts that are newly added in settings and are not present in storage
                    // and return the updated not in holdout ids
                    const updatedNotInHoldoutIds = await sendNetworkCallsForNotInHoldouts(serviceContainer, feature, context, decision, storedData, storageService);
                    // push the updated not in holdout ids to the notInHoldoutIds array
                    notInHoldoutIds.push(...updatedNotInHoldoutIds);
                    // Rollout decision served from storage cache.
                    // variationShown is NOT re-fired for cached rollout decisions.
                    // Usage tracking call will be dispatched at the end if no other experiment rule matches.
                    isEnabled = true;
                    shouldCheckForExperimentsRules = true;
                    rolloutVariationToReturn = variation;
                    // fetchFlags only: rebuild the stored rollout (and previously stored holdouts).
                    // Experiment rules and the impact campaign are evaluated fresh below, so they are
                    // omitted here. No-op for getFlag / getFlags.
                    if (shouldFireImpressionEvents) {
                        collectStoredDecisionImpressions(serviceContainer, feature, context, storedData, {
                            shouldIncludeExperiment: false,
                            shouldIncludeImpactCampaign: false,
                            isEnabled: true,
                        });
                    }
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
            // Feature key not found in settings (flag is OFF or not yet created).
            // No variationShown possible. Send usage tracking call before rejecting.
            sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey); // fire-and-forget
            deferredObject.reject({});
            return deferredObject.promise;
        }
        await serviceContainer.getSegmentationManager().setContextualData(serviceContainer, feature, context);
        if (!isEnabled) {
            // Holdout group exclusion: if user falls into any holdout group for this feature, return disabled
            const { matchedHoldouts, notMatchedHoldouts, holdoutPayloads } = await getMatchedHoldouts(serviceContainer, feature, context, storedData);
            decision.isPartOfHoldout = matchedHoldouts !== null && matchedHoldouts.length > 0;
            if ((matchedHoldouts !== null && matchedHoldouts.length > 0) ||
                (notMatchedHoldouts !== null && notMatchedHoldouts.length > 0)) {
                decision.isHoldoutPresent = true;
            }
            if (matchedHoldouts !== null && matchedHoldouts.length > 0) {
                const qualifiedHoldoutNames = matchedHoldouts.map((holdout) => holdout.getName()).join(',');
                decision.holdoutIDs = matchedHoldouts.map((holdout) => holdout.getId());
                serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USER_IN_HOLDOUT_GROUP, {
                    userId: context.getId(),
                    holdoutGroupName: qualifiedHoldoutNames,
                    featureKey,
                }));
                // Store holdout decision in storage
                new StorageDecorator().setDataInStorage({
                    featureKey,
                    context,
                    isInHoldoutId: matchedHoldouts.map((holdout) => holdout.getId()),
                    notInHoldoutId: notMatchedHoldouts.map((holdout) => holdout.getId()),
                }, storageService, serviceContainer);
                decision['isEnabled'] = false;
                serviceContainer.getHooksService().set(decision);
                serviceContainer.getHooksService().execute(serviceContainer.getHooksService().get());
                if (shouldFireImpressionEvents) {
                    if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
                        for (const payload of holdoutPayloads) {
                            sendImpressionForVariationShown(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                        }
                    }
                    else {
                        if (serviceContainer.getShouldWaitForTrackingCalls()) {
                            await sendImpressionForVariationShownInBatch(serviceContainer, holdoutPayloads);
                        }
                        else {
                            sendImpressionForVariationShownInBatch(serviceContainer, holdoutPayloads);
                        }
                    }
                }
                // Holdout variationShown(variation=1) was fired above — server handles usage tracking.
                // No explicit usage tracking call needed here.
                deferredObject.resolve(FlagApi.prepareFlagForExposeResult(new Flag(false, context.getSessionId(), context.getUuid(), new VariationModel()), serviceContainer, context, featureKey, isImpressionDispatchEnabled));
                return deferredObject.promise;
            }
            else {
                serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USER_NOT_EXCLUDED_DUE_TO_HOLDOUT, {
                    featureKey,
                    userId: context.getId(),
                }));
                notInHoldoutIds.push(...notMatchedHoldouts.map((holdout) => holdout.getId()));
                if (shouldFireImpressionEvents) {
                    if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
                        for (const payload of holdoutPayloads) {
                            sendImpressionForVariationShown(serviceContainer, payload.d.event.props.id, payload.d.event.props.variation, context, featureKey, payload);
                        }
                    }
                    else {
                        batchPayload.push(...holdoutPayloads);
                    }
                    // Usage tracking optimization: holdout variationShown(variation=2) was dispatched above.
                    // server will handle usage tracking from that event. Mark flag so Point 4 skips our usage tracking call
                    // to avoid an unnecessary duplicate network round trip.
                    if (holdoutPayloads.length > 0 && isImpressionDispatchEnabled) {
                        isVariationShownFired = true;
                    }
                }
            }
        }
        const rollOutRules = getSpecificRulesBasedOnType(feature, CampaignTypeEnum.ROLLOUT); // get all rollout rules
        if (rollOutRules.length > 0 && !isEnabled) {
            const rolloutRulesToEvaluate = [];
            for (const rule of rollOutRules) {
                const evaluateRuleResult = await evaluateRule(serviceContainer, feature, rule, context, evaluatedFeatureMap, null, storageService, decision);
                const isForceUserApplicable = evaluateRuleResult[Constants.KEY_FORCED_USER_CHECK];
                const { whitelistedObject, updatedDecision, payload } = evaluateRuleResult;
                Object.assign(decision, updatedDecision);
                if (payload && isImpressionDispatchEnabled) {
                    isVariationShownFired = true;
                }
                if (isForceUserApplicable) {
                    // Forced IN: apply rollout experience and skip traffic
                    if (isObject(whitelistedObject) && Object.keys(whitelistedObject).length > 0) {
                        // set the flag to true if the whitelisted object is not null and has some variations
                        isEnabled = true;
                        shouldCheckForExperimentsRules = true;
                        rolloutVariationToReturn = whitelistedObject.variation;
                        decision['isUserPartOfCampaign'] = true;
                        // set the evaluated feature map with the rollout id, rollout key, and rollout variation id
                        evaluatedFeatureMap.set(featureKey, {
                            rolloutId: rule.getId(),
                            rolloutKey: rule.getKey(),
                            rolloutVariationId: whitelistedObject.variationId,
                        });
                        _updateIntegrationsDecisionObject(rule, whitelistedObject.variation, passedRulesInformation, decision);
                        // Track variation-shown for this forced rollout
                        if (!isDevModeForUser) {
                            if (serviceContainer.getShouldWaitForTrackingCalls()) {
                                // send impression for variation shown
                                if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                                    await sendImpressionForVariationShown(serviceContainer, rule.getId(), whitelistedObject.variationId, context, featureKey, payload);
                                }
                                else {
                                    if (payload != null) {
                                        // push payload to batch payload if gateway service is not provided
                                        batchPayload.push(payload);
                                    }
                                }
                            }
                            else {
                                // send impression for variation shown
                                if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                                    sendImpressionForVariationShown(serviceContainer, rule.getId(), whitelistedObject.variationId, context, featureKey, payload);
                                }
                                else {
                                    if (payload != null) {
                                        // push payload to batch payload if gateway service is not provided
                                        batchPayload.push(payload);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    // if pre segment passed, then break the loop and check the traffic allocation
                    rolloutRulesToEvaluate.push(rule);
                    if (serviceContainer.getShouldWaitForTrackingCalls()) {
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            await sendImpressionForVariationShown(serviceContainer, rule.getId(), rule.getVariations()[0]?.getId(), context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                    }
                    else {
                        if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                            sendImpressionForVariationShown(serviceContainer, rule.getId(), rule.getVariations()[0]?.getId(), context, featureKey, payload);
                        }
                        else {
                            if (payload != null) {
                                batchPayload.push(payload);
                            }
                        }
                    }
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
                const variation = evaluateTrafficAndGetVariation(serviceContainer, passedRolloutCampaign, context);
                if (isObject(variation) && Object.keys(variation).length > 0) {
                    isEnabled = true;
                    shouldCheckForExperimentsRules = true;
                    rolloutVariationToReturn = variation;
                    decision['isUserPartOfCampaign'] = true;
                    _updateIntegrationsDecisionObject(passedRolloutCampaign, variation, passedRulesInformation, decision);
                    if (shouldFireImpressionEvents) {
                        const payload = getTrackUserPayloadData(serviceContainer, EventEnum.VARIATION_SHOWN, passedRolloutCampaign.getId(), variation.getId(), context);
                        if (payload && isImpressionDispatchEnabled) {
                            isVariationShownFired = true;
                        }
                        if (serviceContainer.getShouldWaitForTrackingCalls()) {
                            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                                await sendImpressionForVariationShown(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey, payload);
                            }
                            else {
                                if (payload != null) {
                                    batchPayload.push(payload);
                                }
                            }
                        }
                        else {
                            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                                sendImpressionForVariationShown(serviceContainer, passedRolloutCampaign.getId(), variation.getId(), context, featureKey, payload);
                            }
                            else {
                                if (payload != null) {
                                    batchPayload.push(payload);
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (rollOutRules.length === 0) {
            serviceContainer
                .getLogManager()
                .debug(buildMessage(DebugLogMessagesEnum.EXPERIMENTS_EVALUATION_WHEN_NO_ROLLOUT_PRESENT));
            shouldCheckForExperimentsRules = true;
        }
        if (shouldCheckForExperimentsRules) {
            const experimentRulesToEvaluate = [];
            // if rollout rule is passed, get all ab and Personalize rules
            const experimentRules = getAllExperimentRules(feature);
            const megGroupWinnerCampaigns = new Map();
            for (const rule of experimentRules) {
                const { preSegmentationResult, whitelistedObject, updatedDecision, payload } = await evaluateRule(serviceContainer, feature, rule, context, evaluatedFeatureMap, megGroupWinnerCampaigns, storageService, decision);
                Object.assign(decision, updatedDecision);
                if (payload && isImpressionDispatchEnabled) {
                    isVariationShownFired = true;
                }
                if (preSegmentationResult) {
                    if (whitelistedObject === null) {
                        // whitelistedObject will be null if pre segment passed but whitelisting failed
                        experimentRulesToEvaluate.push(rule);
                    }
                    else {
                        isEnabled = true;
                        decision['isUserPartOfCampaign'] = true;
                        experimentVariationToReturn = whitelistedObject.variation;
                        Object.assign(passedRulesInformation, {
                            experimentId: rule.getId(),
                            experimentKey: rule.getKey(),
                            experimentVariationId: whitelistedObject.variationId,
                        });
                        if (shouldFireImpressionEvents) {
                            if (serviceContainer.getShouldWaitForTrackingCalls()) {
                                if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                                    await sendImpressionForVariationShown(serviceContainer, rule.getId(), whitelistedObject.variationId, context, featureKey, payload);
                                }
                                else {
                                    if (payload != null) {
                                        batchPayload.push(payload);
                                    }
                                }
                            }
                            else {
                                if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                                    sendImpressionForVariationShown(serviceContainer, rule.getId(), whitelistedObject.variationId, context, featureKey, payload);
                                }
                                else {
                                    if (payload != null) {
                                        batchPayload.push(payload);
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
                continue;
            }
            if (experimentRulesToEvaluate.length > 0) {
                const campaign = new CampaignModel().modelFromDictionary(experimentRulesToEvaluate[0]);
                const variation = evaluateTrafficAndGetVariation(serviceContainer, campaign, context);
                if (isObject(variation) && Object.keys(variation).length > 0) {
                    isEnabled = true;
                    decision['isUserPartOfCampaign'] = true;
                    experimentVariationToReturn = variation;
                    _updateIntegrationsDecisionObject(campaign, variation, passedRulesInformation, decision);
                    if (shouldFireImpressionEvents) {
                        const payload = getTrackUserPayloadData(serviceContainer, EventEnum.VARIATION_SHOWN, campaign.getId(), variation.getId(), context);
                        if (payload && isImpressionDispatchEnabled) {
                            isVariationShownFired = true;
                        }
                        if (serviceContainer.getShouldWaitForTrackingCalls()) {
                            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                                await sendImpressionForVariationShown(serviceContainer, campaign.getId(), variation.getId(), context, featureKey, payload);
                            }
                            else {
                                if (payload != null) {
                                    batchPayload.push(payload);
                                }
                            }
                        }
                        else {
                            if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                                sendImpressionForVariationShown(serviceContainer, campaign.getId(), variation.getId(), context, featureKey, payload);
                            }
                            else {
                                if (payload != null) {
                                    batchPayload.push(payload);
                                }
                            }
                        }
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
                notInHoldoutId: notInHoldoutIds,
            }, storageService, serviceContainer);
        }
        else {
            new StorageDecorator().setDataInStorage({
                featureKey,
                context,
                notInHoldoutId: notInHoldoutIds,
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
            sendDebugEventToWingify(serviceContainer, debugEventProps);
        }
        // Send data for Impact Campaign, if defined.
        // fetchFlags evaluates with impressions deferred; log only when the impression is sent now.
        if (feature.getImpactCampaign()?.getCampaignId()) {
            if (isImpressionDispatchEnabled) {
                serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.IMPACT_ANALYSIS, {
                    userId: context.getId(),
                    featureKey,
                    status: isEnabled ? 'enabled' : 'disabled',
                }));
            }
            if (shouldFireImpressionEvents) {
                const payload = getTrackUserPayloadData(serviceContainer, EventEnum.VARIATION_SHOWN, feature.getImpactCampaign()?.getCampaignId(), isEnabled ? 2 : 1, context);
                if (payload && isImpressionDispatchEnabled) {
                    isVariationShownFired = true;
                }
                if (serviceContainer.getShouldWaitForTrackingCalls()) {
                    if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                        await sendImpressionForVariationShown(serviceContainer, feature.getImpactCampaign()?.getCampaignId(), isEnabled ? 2 : 1, context, featureKey, payload);
                    }
                    else {
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                    }
                }
                else {
                    if (serviceContainer.getSettingsService().isGatewayServiceProvided && payload != null) {
                        sendImpressionForVariationShown(serviceContainer, feature.getImpactCampaign()?.getCampaignId(), isEnabled ? 2 : 1, context, featureKey, payload);
                    }
                    else {
                        if (payload != null) {
                            batchPayload.push(payload);
                        }
                    }
                }
            }
        }
        // Send usage tracking call when no primary variationShown event was dispatched.
        // If a primary variation=1/2 was fired, server already has the usage tracking signal — skipping the call
        // here avoids an unnecessary duplicate network round trip (server deduplicates anyway).
        if (!isVariationShownFired) {
            if (serviceContainer.getShouldWaitForTrackingCalls()) {
                await sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey, true);
            }
            else {
                sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey); // fire-and-forget
            }
        }
        const variationToReturn = experimentVariationToReturn ?? rolloutVariationToReturn;
        const variationModel = variationToReturn
            ? new VariationModel().modelFromDictionary(variationToReturn)
            : new VariationModel();
        // Flush before prepareFlagForExposeResult so fetchFlags stashes payloads for exposeResult().
        // The stash runs before any network call, so skipping the await still attaches them.
        // getFlag/getFlags wait for the HTTP dispatch only when shouldWaitForTrackingCalls is set.
        if (!serviceContainer.getSettingsService().isGatewayServiceProvided && batchPayload.length > 0) {
            if (shouldFireImpressionEvents) {
                if (serviceContainer.getShouldWaitForTrackingCalls()) {
                    await sendImpressionForVariationShownInBatch(serviceContainer, batchPayload);
                }
                else {
                    sendImpressionForVariationShownInBatch(serviceContainer, batchPayload);
                }
            }
        }
        deferredObject.resolve(FlagApi.prepareFlagForExposeResult(new Flag(isEnabled, context.getSessionId(), context.getUuid(), variationModel), serviceContainer, context, featureKey, isImpressionDispatchEnabled));
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
/**
 * Rebuilds variationShown payloads for a decision served from storage and collects them
 * for Flag.exposeResult().
 *
 * Only fetchFlags uses this. Impressions are deferred there, so a stored decision would
 * otherwise leave exposeResult() with nothing to send after a reload. getFlag / getFlags
 * dispatch impressions immediately, so this returns without collecting anything on those paths.
 *
 * Campaigns, variations, or holdouts that are no longer in settings are skipped.
 *
 * @param serviceContainer - Shared SDK service container.
 * @param feature - Feature being evaluated; used for holdouts and the impact campaign.
 * @param context - User context for the evaluation.
 * @param storedData - Decision previously written to storage for this user and feature.
 * @param options - Which stored campaigns to rebuild. Experiment and impact are omitted
 *   on the stored-rollout path because those are evaluated fresh afterwards.
 * @returns {void}
 */
function collectStoredDecisionImpressions(serviceContainer, feature, context, storedData, options) {
    // Immediate-dispatch APIs (getFlag / getFlags) must keep skipping stored-path impressions.
    if (getActiveEventDispatchPolicy(serviceContainer).shouldDispatchImpressions) {
        return;
    }
    // Without an active collector there is nowhere to hold the payloads until exposeResult().
    if (!hasDeferredImpressionScope() || !storedData || !feature) {
        return;
    }
    const settings = serviceContainer.getSettings();
    // Rebuild only holdouts already decided for this user. Holdouts added after the decision
    // was stored are collected by the existing holdout evaluation above.
    const storedInHoldoutIds = storedData.isInHoldoutId ?? storedData.holdoutGroupId ?? [];
    const storedNotInHoldoutIds = storedData.notInHoldoutId ?? [];
    for (const holdout of getApplicableHoldouts(settings, feature.getId())) {
        const holdoutId = holdout.getId();
        if (storedInHoldoutIds.includes(holdoutId)) {
            // This user was already decided into the holdout, so rebuild that impression for exposeResult.
            collectDeferredImpression(createHoldoutPayload(serviceContainer, EventEnum.VARIATION_SHOWN, holdoutId, Constants.VARIATION_IS_PART_OF_HOLDOUT, context, feature.getId()));
            // If the user is not in the holdout, collect the payload for the holdout not part of holdout event.
        }
        else if (storedNotInHoldoutIds.includes(holdoutId)) {
            collectDeferredImpression(createHoldoutPayload(serviceContainer, EventEnum.VARIATION_SHOWN, holdoutId, Constants.VARIATION_NOT_PART_OF_HOLDOUT, context, feature.getId()));
        }
    }
    // If the user is in the rollout, collect the payload for the rollout variation shown event.
    if (storedData.rolloutId && storedData.rolloutVariationId) {
        // Skip a stored rollout that was removed from settings.
        if (getCampaignKeyFromCampaignId(settings, storedData.rolloutId)) {
            collectDeferredImpression(getTrackUserPayloadData(serviceContainer, EventEnum.VARIATION_SHOWN, storedData.rolloutId, storedData.rolloutVariationId, context));
        }
    }
    // If the user is in the experiment, collect the payload for the experiment variation shown event.
    if (options.shouldIncludeExperiment && storedData.experimentId && storedData.experimentVariationId) {
        // Skip a stored experiment that was removed from settings.
        if (getCampaignKeyFromCampaignId(settings, storedData.experimentId)) {
            collectDeferredImpression(getTrackUserPayloadData(serviceContainer, EventEnum.VARIATION_SHOWN, storedData.experimentId, storedData.experimentVariationId, context));
        }
    }
    // If the user is in the impact campaign, collect the payload for the impact campaign variation shown event.
    const impactCampaignId = feature.getImpactCampaign()?.getCampaignId?.();
    if (options.shouldIncludeImpactCampaign && impactCampaignId) {
        collectDeferredImpression(getTrackUserPayloadData(serviceContainer, EventEnum.VARIATION_SHOWN, impactCampaignId, options.isEnabled ? 2 : 1, context));
    }
}
/**
 * Sends the usage tracking payload to server.
 * Called whenever a user is evaluated via getFlag() but no variationShown event is
 * dispatched by the SDK for that evaluation (decision from storage cache, flag=false, etc.).
 *
 * Routes through BatchEventsQueue when configured, otherwise fire-and-forget
 * (or awaited when shouldAwait is true).
 *
 * @param serviceContainer - The service container instance.
 * @param context - The user context model.
 * @param isTrackingUsageEnabled - Whether usage tracking is active for this account.
 * @param shouldFireImpressionEvents - Whether tracking/impression network calls should be dispatched.
 * @param featureKey - Feature key being evaluated, used for logging.
 * @param shouldAwait - When true, awaits the network call (for shouldWaitForTrackingCalls flows).
 * @returns {Promise<void>} Resolves once the usage tracking call is enqueued or sent.
 */
async function sendTrackingUsage(serviceContainer, context, isTrackingUsageEnabled, shouldFireImpressionEvents, featureKey, shouldAwait = false) {
    // Cover both the batch-worker policy and the legacy suppress flags used by getFlags.
    const eventDispatchPolicy = getActiveEventDispatchPolicy(serviceContainer);
    const isTrackingSuppressed = !!(serviceContainer.getSuppressTrackingCalls() || getCurrentGetFlagsBatchContext()?.suppressTrackingCalls);
    const isMAUSuppressed = !!(serviceContainer.getSuppressMAU() || getCurrentGetFlagsBatchContext()?.suppressMAU);
    // Account setting, the MAU toggle, and getFlags suppressMAU can each block this call.
    if (!isTrackingUsageEnabled || !eventDispatchPolicy.shouldDispatchUsageEvents || isMAUSuppressed)
        return;
    // Skip MAU in dev mode. Still send it for fetchFlags (policy blocks impressions) and for getFlags tracking suppression.
    if (!shouldFireImpressionEvents && eventDispatchPolicy.shouldDispatchImpressions && !isTrackingSuppressed)
        return;
    const trackingPayload = getTrackingUsagePayloadData(serviceContainer, context);
    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USAGE_TRACKING_CALL_SENT, {
        accountId: serviceContainer.getSettingsService().accountId.toString(),
        userId: context.getId(),
        featureKey,
    }));
    if (serviceContainer.getBatchEventsQueue()) {
        serviceContainer.getBatchEventsQueue().enqueue(trackingPayload);
    }
    else if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
        // Gateway is connected: must use the single-event /event/t endpoint.
        // /batch-events-v2 is not supported by the gateway and returns 404.
        const properties = getEventsBaseProperties(serviceContainer.getSettingsService(), EventEnum.USER_EVALUATED, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
        if (shouldAwait) {
            await sendPostApiRequest(serviceContainer, properties, trackingPayload, context.getId());
        }
        else {
            sendPostApiRequest(serviceContainer, properties, trackingPayload, context.getId()); // fire-and-forget
        }
    }
    else {
        // No gateway, no user-configured batch queue: use the SDK internal batch dispatcher.
        if (shouldAwait) {
            await sendImpressionForVariationShownInBatch(serviceContainer, [trackingPayload]);
        }
        else {
            sendImpressionForVariationShownInBatch(serviceContainer, [trackingPayload]); // fire-and-forget
        }
    }
}
//# sourceMappingURL=GetFlag.js.map