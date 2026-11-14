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
import { BatchEventsDispatcher } from './BatchEventsDispatcher.js';
import { getEventsBaseProperties, sendPostApiRequest } from './NetworkUtil.js';
import { EventEnum } from '../enums/EventEnum.js';
import { SDKMetaUtil } from './SDKMetaUtil.js';
import { getCampaignKeyFromCampaignId, getCampaignTypeFromCampaignId, getVariationNameFromCampaignIdAndVariationId, } from './CampaignUtil.js';
import { Constants } from '../constants/index.js';
import { InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { buildMessage } from './LogMessageUtil.js';
/**
 * Sends deferred variationShown payloads, bypassing the fetchFlags dispatch policy.
 * Uses the same transport paths as normal impression sending.
 *
 * @param serviceContainer - Shared SDK service container.
 * @param context - User context from the original evaluation.
 * @param featureKey - Feature key the payloads belong to.
 * @param payloads - Deferred variationShown payloads to send.
 * @returns {boolean} True when payloads were enqueued or sent, false when there was nothing to send.
 */
export async function sendDeferredVariationShownPayloads(serviceContainer, context, featureKey, payloads) {
    // Nothing was held back, so exposeResult should report that it did not send.
    if (!payloads?.length) {
        return false;
    }
    // A user-configured queue delivers on its own schedule. Enqueueing counts as a successful expose.
    if (serviceContainer.getBatchEventsQueue()) {
        for (const payload of payloads) {
            serviceContainer.getBatchEventsQueue().enqueue(payload);
        }
        serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.DEFERRED_EXPOSE_ENQUEUED, {
            count: payloads.length.toString(),
            featureKey,
        }));
        return true;
    }
    // Gateway accepts only the single-event endpoint, so each payload is posted on its own.
    if (serviceContainer.getSettingsService().isGatewayServiceProvided) {
        for (const payload of payloads) {
            const campaignId = payload?.d?.event?.props?.id;
            const variationId = payload?.d?.event?.props?.variation;
            const properties = getEventsBaseProperties(serviceContainer.getSettingsService(), EventEnum.VARIATION_SHOWN, encodeURIComponent(context.getUserAgent()), context.getIpAddress());
            // Campaign and variation names are needed for the gateway log metadata.
            const campaignKeyWithFeatureName = getCampaignKeyFromCampaignId(serviceContainer.getSettings(), campaignId);
            const variationName = getVariationNameFromCampaignIdAndVariationId(serviceContainer.getSettings(), campaignId, variationId);
            // Impact analysis uses a fixed key. Rule campaigns drop the feature prefix from the stored key.
            let campaignKey = '';
            if (featureKey === campaignKeyWithFeatureName) {
                campaignKey = Constants.IMPACT_ANALYSIS;
            }
            else {
                campaignKey = campaignKeyWithFeatureName?.split(`${featureKey}_`)[1];
            }
            const campaignType = getCampaignTypeFromCampaignId(serviceContainer.getSettings(), campaignId);
            // Block on the post only when the client asked to wait for tracking calls.
            if (serviceContainer.getShouldWaitForTrackingCalls()) {
                await sendPostApiRequest(serviceContainer, properties, payload, context.getId(), {}, { campaignKey, variationName, featureKey, campaignType });
            }
            else {
                sendPostApiRequest(serviceContainer, properties, payload, context.getId(), {}, { campaignKey, variationName, featureKey, campaignType });
            }
        }
        return true;
    }
    // No gateway and no user queue: send the held payloads through the SDK batch endpoint.
    if (serviceContainer.getShouldWaitForTrackingCalls()) {
        await BatchEventsDispatcher.dispatch(serviceContainer, { ev: payloads }, () => { }, {
            a: serviceContainer.getSettingsService().accountId,
            env: serviceContainer.getSettingsService().sdkKey,
            sn: SDKMetaUtil.getInstance().getSdkName(),
            sv: SDKMetaUtil.getInstance().getVersion(),
        });
    }
    else {
        // Fire-and-forget when the client does not wait on tracking calls.
        BatchEventsDispatcher.dispatch(serviceContainer, { ev: payloads }, () => { }, {
            a: serviceContainer.getSettingsService().accountId,
            env: serviceContainer.getSettingsService().sdkKey,
            sn: SDKMetaUtil.getInstance().getSdkName(),
            sv: SDKMetaUtil.getInstance().getVersion(),
        });
    }
    return true;
}
/**
 * Enqueues deferred variationShown impressions for a Flag result (Android-style exposeResult).
 * Idempotent: second call is a no-op after stash is cleared / marked sent.
 *
 * @param flag - Flag holding deferred impressions and expose deps.
 * @returns {boolean} True when impressions were enqueued or sent, false otherwise.
 */
export async function exposeFlagResult(flag) {
    // A later exposeResult call must not send the same impressions again.
    if (flag.isImpressionAlreadySent()) {
        return false;
    }
    // Read and clear the stash before sending so a second call cannot duplicate it.
    const exposeDependencies = flag.getExposeDependencies();
    const payloads = flag.consumeDeferredImpressions();
    // Error flags and evaluations that produced no impression have nothing to send.
    if (!exposeDependencies || !payloads.length) {
        return false;
    }
    const isSent = await sendDeferredVariationShownPayloads(exposeDependencies.serviceContainer, exposeDependencies.context, exposeDependencies.featureKey, payloads);
    // Mark sent only after transport accepted the payloads.
    if (isSent) {
        flag.markImpressionSent();
    }
    return isSent;
}
//# sourceMappingURL=ImpressionExposureUtil.js.map