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
import { VWOBuilder } from './VWOBuilder.js';
import { isObject, isString } from './utils/DataTypeUtil.js';
import { Deferred } from './utils/PromiseUtil.js';
import { sendSdkInitEvent, sendSDKUsageStatsEvent } from './utils/SdkInitAndUsageStatsUtil.js';
import { InfoLogMessagesEnum, ErrorLogMessagesEnum } from './enums/log-messages/index.js';
import { buildMessage } from './utils/LogMessageUtil.js';
import { PlatformEnum } from './enums/PlatformEnum.js';
import { ApiEnum } from './enums/ApiEnum.js';
import { LogManager } from './packages/logger/index.js';
import { SettingsSchema } from './models/schemas/SettingsSchemaValidation.js';
export class VWO {
    /**
     * Constructor for the VWO class.
     * Initializes a new instance of VWO with the provided options.
     * @param {Record<string, dynamic>} options - Configuration options for the VWO instance.
     * @returns The instance of VWO.
     */
    constructor(options) {
        return VWO.setInstance(options);
    }
    /**
     * Sets the singleton instance of VWO.
     * Configures and builds the VWO instance using the provided options.
     * @param {Record<string, dynamic>} options - Configuration options for setting up VWO.
     * @returns A Promise resolving to the configured VWO instance.
     */
    static setInstance(options) {
        const optionsVWOBuilder = options?.vwoBuilder;
        this.vwoBuilder = optionsVWOBuilder || new VWOBuilder(options);
        this.instance = this.vwoBuilder
            .setLogger() // Sets up logging for debugging and monitoring.
            .setSettingsService() // Sets the settings service for configuration management.
            .setStorage() // Configures storage for data persistence.
            .setNetworkManager() // Configures network management for API communication.
            .setSegmentation() // Sets up segmentation for targeted functionality.
            // .initBatching()        // Initializes batching for bulk data processing.
            .initPolling() // Starts polling mechanism for regular updates.
            .initBatching()
            .initUsageStats(); // Initializes usage statistics for the SDK.
        // .setAnalyticsCallback() // Sets up analytics callback for data analysis.
        if (options?.settings) {
            const isSettingsValid = new SettingsSchema().isSettingsValid(options.settings);
            if (isSettingsValid) {
                LogManager.Instance.info(InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
                const vwoClient = this.vwoBuilder.build(options.settings);
                vwoClient.isSettingsValid = true;
                vwoClient.settingsFetchTime = 0;
                return Promise.resolve(vwoClient);
            }
            else {
                LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.INIT });
                const vwoClient = this.vwoBuilder.build({});
                vwoClient.isSettingsValid = false;
                vwoClient.settingsFetchTime = 0;
                return Promise.resolve(vwoClient);
            }
        }
        return this.vwoBuilder.getSettings().then((settings) => {
            const vwoClient = this.vwoBuilder.build(settings);
            // Attach to instance for logging
            vwoClient.isSettingsValid = this.vwoBuilder.isSettingsValid;
            vwoClient.settingsFetchTime = this.vwoBuilder.settingsFetchTime;
            this.settings = settings;
            return vwoClient;
        });
    }
    /**
     * Gets the singleton instance of VWO.
     * @returns The singleton instance of VWO.
     */
    static get Instance() {
        return this.instance;
    }
}
let _global = {};
/**
 * Initializes a new instance of VWO with the provided options.
 * @param options Configuration options for the VWO instance.
 * @property {string} sdkKey - The SDK key for the VWO account.
 * @property {string} accountId - The account ID for the VWO account.
 * @property {GatewayServiceModel} gatewayService - The gateway service configuration.
 * @property {string} proxyUrl - (Browser only) Custom proxy URL to redirect all API calls. If provided, all GET and POST calls will be made to this URL instead of the default HOST_NAME.
 * @property {StorageService} storage - The storage configuration.
 * @returns
 */
export async function init(options) {
    const apiName = ApiEnum.INIT;
    const date = new Date().toISOString();
    try {
        const invalidErrorPrefix = `[ERROR]: VWO-SDK ${date} `;
        if (!isObject(options)) {
            const msg = invalidErrorPrefix + buildMessage(ErrorLogMessagesEnum.INVALID_OPTIONS);
            console.error(msg); // Ensures options is an object.
        }
        if (!options?.sdkKey || !isString(options?.sdkKey)) {
            const msg = invalidErrorPrefix + buildMessage(ErrorLogMessagesEnum.INVALID_SDK_KEY_IN_OPTIONS);
            console.error(msg); // Validates sdkKey presence and type.
        }
        if (!options.accountId) {
            const msg = invalidErrorPrefix + buildMessage(ErrorLogMessagesEnum.INVALID_ACCOUNT_ID_IN_OPTIONS);
            console.error(msg); // Validates accountId presence and type.
        }
        if (options.isAliasingEnabled && !options.gatewayService) {
            const msg = invalidErrorPrefix +
                buildMessage(ErrorLogMessagesEnum.INVALID_GATEWAY_URL, {
                    date,
                });
            console.error(msg); // Validates gatewayService presence and type.
        }
        if (typeof process === 'undefined') {
            options.platform = PlatformEnum.CLIENT;
        }
        else {
            options.platform = PlatformEnum.SERVER;
        }
        let startTimeForInit = undefined;
        startTimeForInit = Date.now();
        const instance = new VWO(options); // Creates a new VWO instance with the validated options.
        _global = {
            vwoInitDeferred: new Deferred(),
            isSettingsFetched: false,
            instance: null,
        };
        return instance.then(async (_vwoInstance) => {
            const sdkInitTime = Date.now() - startTimeForInit;
            // send sdk init event
            if (_vwoInstance.isSettingsValid && !_vwoInstance.originalSettings?.sdkMetaInfo?.wasInitializedEarlier) {
                //if shouldwaitForTrackingCalls is true, then wait for sendSdkInitEvent to complete
                if (_vwoInstance.options?.shouldWaitForTrackingCalls) {
                    await sendSdkInitEvent(_vwoInstance.settingsFetchTime, sdkInitTime);
                }
                else {
                    sendSdkInitEvent(_vwoInstance.settingsFetchTime, sdkInitTime);
                }
            }
            // send sdk usage stats event
            // get usage stats account id from settings
            const usageStatsAccountId = _vwoInstance.originalSettings?.usageStatsAccountId;
            if (usageStatsAccountId) {
                if (_vwoInstance.options?.shouldWaitForTrackingCalls) {
                    await sendSDKUsageStatsEvent(usageStatsAccountId);
                }
                else {
                    sendSDKUsageStatsEvent(usageStatsAccountId);
                }
            }
            _global.isSettingsFetched = true;
            _global.instance = _vwoInstance;
            _global.vwoInitDeferred.resolve(_vwoInstance);
            return _vwoInstance;
        });
    }
    catch (err) {
        const msg = buildMessage(ErrorLogMessagesEnum.EXECUTION_FAILED, {
            apiName,
            err,
        });
        console.info(`[INFO]: VWO-SDK ${new Date().toISOString()} ${msg}`);
    }
}
export async function onInit() {
    const apiName = ApiEnum.ON_INIT;
    try {
        _global.vwoInitDeferred = new Deferred();
        const date = new Date().toISOString();
        // If settings are already fetched, resolve the promise
        if (_global.isSettingsFetched) {
            const msg = buildMessage(InfoLogMessagesEnum.ON_INIT_ALREADY_RESOLVED, {
                date,
                apiName,
            });
            console.info(msg);
            _global.vwoInitDeferred.resolve(_global.instance);
        }
        else {
            // wait for five seconds, else reject the promise
            setTimeout(() => {
                if (_global.isSettingsFetched) {
                    return;
                }
                const msg = buildMessage(InfoLogMessagesEnum.ON_INIT_SETTINGS_FAILED, {
                    date,
                });
                console.error(msg);
                _global.vwoInitDeferred.reject(new Error('VWO settings could not be fetched'));
            }, 5000);
        }
        return _global.vwoInitDeferred.promise;
    }
    catch (err) {
        const msg = buildMessage(ErrorLogMessagesEnum.EXECUTION_FAILED, {
            apiName,
            err,
        });
        console.info(`[INFO]: VWO-SDK ${new Date().toISOString()} ${msg}`);
    }
}
//# sourceMappingURL=VWO.js.map