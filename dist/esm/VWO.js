"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VWO = void 0;
exports.init = init;
exports.onInit = onInit;
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
const VWOBuilder_1 = require("./VWOBuilder");
const DataTypeUtil_1 = require("./utils/DataTypeUtil");
const PromiseUtil_1 = require("./utils/PromiseUtil");
const EventUtil_1 = require("./utils/EventUtil");
const log_messages_1 = require("./enums/log-messages");
const LogMessageUtil_1 = require("./utils/LogMessageUtil");
const PlatformEnum_1 = require("./enums/PlatformEnum");
const ApiEnum_1 = require("./enums/ApiEnum");
const logger_1 = require("./packages/logger");
const SettingsSchemaValidation_1 = require("./models/schemas/SettingsSchemaValidation");
class VWO {
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
        this.vwoBuilder = optionsVWOBuilder || new VWOBuilder_1.VWOBuilder(options);
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
            const isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(options.settings);
            if (isSettingsValid) {
                logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
                const vwoClient = this.vwoBuilder.build(options.settings);
                vwoClient.isSettingsValid = true;
                vwoClient.settingsFetchTime = 0;
                return Promise.resolve(vwoClient);
            }
            else {
                logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.SETTINGS_SCHEMA_INVALID);
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
exports.VWO = VWO;
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
async function init(options) {
    const apiName = ApiEnum_1.ApiEnum.INIT;
    const date = new Date().toISOString();
    try {
        if (!(0, DataTypeUtil_1.isObject)(options)) {
            const msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_ERROR, {
                date,
            });
            console.error(msg); // Ensures options is an object.
        }
        if (!options?.sdkKey || !(0, DataTypeUtil_1.isString)(options?.sdkKey)) {
            const msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_SDK_KEY_ERROR, {
                date,
            });
            console.error(msg); // Validates sdkKey presence and type.
        }
        if (!options.accountId) {
            const msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_ACCOUNT_ID_ERROR, {
                date,
            });
            console.error(msg); // Validates accountId presence and type.
        }
        if (typeof process === 'undefined') {
            options.platform = PlatformEnum_1.PlatformEnum.CLIENT;
        }
        else {
            options.platform = PlatformEnum_1.PlatformEnum.SERVER;
        }
        let startTimeForInit = undefined;
        startTimeForInit = Date.now();
        const instance = new VWO(options); // Creates a new VWO instance with the validated options.
        _global = {
            vwoInitDeferred: new PromiseUtil_1.Deferred(),
            isSettingsFetched: false,
            instance: null,
        };
        return instance.then(async (_vwoInstance) => {
            const sdkInitTime = Date.now() - startTimeForInit;
            if (_vwoInstance.isSettingsValid && !_vwoInstance.originalSettings?.sdkMetaInfo?.wasInitializedEarlier) {
                //if shouldwaitForTrackingCalls is true, then wait for sendSdkInitEvent to complete
                if (_vwoInstance.options?.shouldWaitForTrackingCalls) {
                    await (0, EventUtil_1.sendSdkInitEvent)(_vwoInstance.settingsFetchTime, sdkInitTime);
                }
                else {
                    (0, EventUtil_1.sendSdkInitEvent)(_vwoInstance.settingsFetchTime, sdkInitTime);
                }
            }
            _global.isSettingsFetched = true;
            _global.instance = _vwoInstance;
            _global.vwoInitDeferred.resolve(_vwoInstance);
            return _vwoInstance;
        });
    }
    catch (err) {
        const msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
            apiName,
            err,
        });
        console.info(`[INFO]: VWO-SDK ${new Date().toISOString()} ${msg}`);
    }
}
async function onInit() {
    const apiName = ApiEnum_1.ApiEnum.ON_INIT;
    try {
        _global.vwoInitDeferred = new PromiseUtil_1.Deferred();
        const date = new Date().toISOString();
        // If settings are already fetched, resolve the promise
        if (_global.isSettingsFetched) {
            const msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.ON_INIT_ALREADY_RESOLVED, {
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
                const msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.ON_INIT_SETTINGS_FAILED, {
                    date,
                });
                console.error(msg);
                _global.vwoInitDeferred.reject(new Error('VWO settings could not be fetched'));
            }, 5000);
        }
        return _global.vwoInitDeferred.promise;
    }
    catch (err) {
        const msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
            apiName,
            err,
        });
        console.info(`[INFO]: VWO-SDK ${new Date().toISOString()} ${msg}`);
    }
}
//# sourceMappingURL=VWO.js.map