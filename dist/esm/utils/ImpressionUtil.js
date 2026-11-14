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
import { getEventsBaseProperties, sendPostApiRequest } from './NetworkUtil.js';
import { EventEnum } from '../enums/EventEnum.js';
import { getCampaignKeyFromCampaignId, getCampaignTypeFromCampaignId } from './CampaignUtil.js';
import { getVariationNameFromCampaignIdAndVariationId } from './CampaignUtil.js';
import { Constants } from '../constants/index.js';
import { BatchEventsDispatcher } from './BatchEventsDispatcher.js';
import { SDKMetaUtil } from './SDKMetaUtil.js';
import { canDispatchEvent, getActiveEventDispatchPolicy } from './EventDispatchPolicyUtil.js';
import { collectDeferredImpression, hasDeferredImpressionScope } from './DeferredImpressionCollector.js';
import { getCurrentGetFlagsBatchContext } from '../services/GetFlagsBatchContext.js';
/**
 * Returns whether getFlags has asked to drop tracking calls.
 * Legacy suppress flags take precedence over the event dispatch policy so existing getFlags callers stay unchanged.
 *
 * @param serviceContainer - The service container instance.
 * @returns {boolean} True when impressions must be dropped and not deferred.
 */
function isTrackingSuppressed(serviceContainer) {
    // Either the shared container flag or the current batch worker can request the drop.
    return !!(serviceContainer.getSuppressTrackingCalls() || getCurrentGetFlagsBatchContext()?.suppressTrackingCalls);
}
/**
 * Creates and sends an impression for a variation shown event.
 * This function constructs the necessary properties and payload for the event
 * and uses the NetworkUtil to send a POST API request.
 *
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {number} campaignId - The ID of the campaign.
 * @param {number} variationId - The ID of the variation shown to the user.
 * @param {ContextModel} context - The user context model containing user-specific data.
 * @param {string} featureKey - The feature key the impression belongs to.
 * @param {any} payload - The variationShown payload; held for exposeResult() when impressions are deferred.
 * @returns {Promise<void>} Resolves when the impression is sent, stashed, or dropped.
 */
export const sendImpressionForVariationShown = async (serviceContainer, campaignId, variationId, context, featureKey, payload) => {
    // getFlags(shouldSendTrackingCalls: false) drops the impression. Do not stash it for exposeResult.
    if (isTrackingSuppressed(serviceContainer)) {
        return;
    }
    if (!getActiveEventDispatchPolicy(serviceContainer).shouldDispatchImpressions) {
        // fetchFlags / deferred mode: stash payload for Flag.exposeResult() instead of dropping it.
        if (hasDeferredImpressionScope()) {
            collectDeferredImpression(payload);
        }
        return;
    }
    // Get base properties for the event
    const properties = getEventsBaseProperties(serviceContainer.getSettingsService(), EventEnum.VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()), // Encode user agent to ensure URL safety
    context.getIpAddress());
    const campaignKeyWithFeatureName = getCampaignKeyFromCampaignId(serviceContainer.getSettings(), campaignId);
    const variationName = getVariationNameFromCampaignIdAndVariationId(serviceContainer.getSettings(), campaignId, variationId);
    let campaignKey = '';
    if (featureKey === campaignKeyWithFeatureName) {
        campaignKey = Constants.IMPACT_ANALYSIS;
    }
    else {
        campaignKey = campaignKeyWithFeatureName?.split(`${featureKey}_`)[1];
    }
    const campaignType = getCampaignTypeFromCampaignId(serviceContainer.getSettings(), campaignId);
    if (serviceContainer.getBatchEventsQueue()) {
        serviceContainer.getBatchEventsQueue().enqueue(payload);
    }
    else {
        // Send the constructed properties and payload as a POST request
        await sendPostApiRequest(serviceContainer, properties, payload, context.getId(), {}, { campaignKey, variationName, featureKey, campaignType });
    }
};
/**
 * Sends batched event payloads through the SDK batch pipeline.
 * Legacy getFlags suppression drops the whole batch. Otherwise payloads are filtered by the active event dispatch policy.
 *
 * @param serviceContainer - The service container instance.
 * @param payloads - Event payloads to send.
 * @returns {Promise<void>} Resolves when allowed payloads are enqueued, dispatched, or dropped.
 */
export const sendImpressionForVariationShownInBatch = async (serviceContainer, payloads) => {
    // getFlags(shouldSendTrackingCalls: false) drops the batch. Those impressions must not be deferred.
    if (isTrackingSuppressed(serviceContainer)) {
        return;
    }
    const eventDispatchPolicy = getActiveEventDispatchPolicy(serviceContainer);
    // fetchFlags blocks live impressions but still wants variationShown later via exposeResult.
    if (!eventDispatchPolicy.shouldDispatchImpressions && hasDeferredImpressionScope()) {
        for (const payload of payloads) {
            // Unnamed payloads in this batch are variationShown. Usage and debugger stay for the filter below.
            if (payload?.d?.event?.name === EventEnum.VARIATION_SHOWN || !payload?.d?.event?.name) {
                collectDeferredImpression(payload);
            }
        }
    }
    // Drop events the current policy does not allow, including impressions already stashed above.
    const payloadsToDispatch = payloads.filter((payload) => canDispatchEvent(eventDispatchPolicy, payload?.d?.event?.name));
    if (!payloadsToDispatch.length) {
        return;
    }
    // A user-configured queue sends on its own schedule, so enqueue and return.
    if (serviceContainer.getBatchEventsQueue()) {
        for (const payload of payloadsToDispatch) {
            serviceContainer.getBatchEventsQueue().enqueue(payload);
        }
        return;
    }
    await BatchEventsDispatcher.dispatch(serviceContainer, { ev: payloadsToDispatch }, () => { }, {
        a: serviceContainer.getSettingsService().accountId,
        env: serviceContainer.getSettingsService().sdkKey,
        sn: SDKMetaUtil.getInstance().getSdkName(),
        sv: SDKMetaUtil.getInstance().getVersion(),
    });
};
//# sourceMappingURL=ImpressionUtil.js.map