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
import { getEventsBaseProperties, getSDKInitEventPayload, getSDKUsageStatsEventPayload, sendEvent, } from './NetworkUtil.js';
import { EventEnum } from '../enums/EventEnum.js';
/**
 * Sends an init called event to Wingify.
 * This event is triggered when the init function is called.
 * @param serviceContainer - The service container instance.
 */
export async function sendSdkInitEvent(serviceContainer) {
    const properties = getEventsBaseProperties(serviceContainer.getSettingsService(), EventEnum.INIT_CALLED);
    const payload = getSDKInitEventPayload(serviceContainer.getSettingsService(), EventEnum.INIT_CALLED);
    if (serviceContainer.getBatchEventsQueue()) {
        serviceContainer.getBatchEventsQueue().enqueue(payload);
        return;
    }
    await sendEvent(serviceContainer, properties, payload, EventEnum.INIT_CALLED).catch(() => { });
}
/**
 * Sends a usage stats event to Wingify.
 * This event is triggered when the SDK is initialized.
 * @param usageStatsAccountId - The account ID used for usage-stats reporting.
 * @param serviceContainer - The service container instance.
 * @param usageStatsUtil - The usage-stats payload builder.
 */
export async function sendSDKUsageStatsEvent(usageStatsAccountId, serviceContainer, usageStatsUtil, settingsFetchTime, sdkInitTime) {
    const initOptions = serviceContainer.getWingifyOptions();
    const properties = getEventsBaseProperties(serviceContainer.getSettingsService(), EventEnum.USAGE_STATS, null, null, true, usageStatsAccountId);
    const payload = getSDKUsageStatsEventPayload(serviceContainer.getSettingsService(), EventEnum.USAGE_STATS, usageStatsAccountId, usageStatsUtil, settingsFetchTime, sdkInitTime, initOptions);
    await sendEvent(serviceContainer, properties, payload, EventEnum.USAGE_STATS).catch(() => { });
}
//# sourceMappingURL=SdkInitAndUsageStatsUtil.js.map