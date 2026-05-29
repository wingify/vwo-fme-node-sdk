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
import { WingifyBuilder } from './WingifyBuilder.js';
import { isObject, isString } from './utils/DataTypeUtil.js';
import { Deferred } from './utils/PromiseUtil.js';
import { InfoLogMessagesEnum, ErrorLogMessagesEnum } from './enums/log-messages/index.js';
import { buildMessage } from './utils/LogMessageUtil.js';
import { PlatformEnum } from './enums/PlatformEnum.js';
import { ApiEnum } from './enums/ApiEnum.js';
import { getFormattedErrorMessage } from './utils/FunctionUtil.js';
import { Constants } from './constants/index.js';
export class Wingify {
    /**
     * Constructor for the Wingify class.
     * Initializes a new instance of Wingify with the provided options.
     * @param {Record<string, dynamic>} options - Configuration options for the Wingify instance.
     * @returns The instance of Wingify.
     */
    constructor(options) {
        return Wingify.setInstance(options);
    }
    /**
     * Sets the singleton instance of Wingify.
     * Configures and builds the Wingify instance using the provided options.
     * @param {Record<string, dynamic>} options - Configuration options for setting up Wingify.
     * @returns A Promise resolving to the configured Wingify instance.
     */
    static setInstance(options) {
        const startTimeForInit = Date.now();
        const optionsWingifyBuilder = options?.wingifyBuilder || options?.vwoBuilder;
        this.wingifyBuilder = optionsWingifyBuilder || new WingifyBuilder(options);
        this.instance = this.wingifyBuilder
            .setLogger() // Sets up logging for debugging and monitoring.
            .setSettingsService() // Sets the settings service for configuration management.
            .setStorage() // Configures storage for data persistence.
            .setNetworkManager() // Configures network management for API communication.
            // .initBatching()        // Initializes batching for bulk data processing.
            .initPolling() // Starts polling mechanism for regular updates.
            .initBatching(); // Initializes usage statistics for the SDK.
        // .setAnalyticsCallback() // Sets up analytics callback for data analysis.
        this.wingifyBuilder.getSettingsService().startTimeForInit = startTimeForInit;
        if (options?.settings) {
            this.wingifyBuilder.getSettingsService().isSettingsProvidedInInit = true;
            return Promise.resolve(this.wingifyBuilder.build(options.settings));
        }
        return this.wingifyBuilder.getSettings().then((settings) => {
            return this.wingifyBuilder.build(settings); // Builds the Wingify instance with the fetched settings.
        });
    }
    /**
     * Gets the singleton instance of Wingify.
     * @returns The singleton instance of Wingify.
     */
    static get Instance() {
        return this.instance;
    }
}
let _global = {};
/**
 * Initializes a new instance of Wingify with the provided options.
 * @param options Configuration options for the Wingify instance.
 * @property {string} sdkKey - The SDK key for the Wingify account.
 * @property {string} accountId - The account ID for the Wingify account.
 * @property {GatewayServiceModel} gatewayService - The gateway service configuration.
 * @property {string} proxyUrl - (Browser only) Custom proxy URL to redirect all API calls. If provided, all GET and POST calls will be made to this URL instead of the default HOST_NAME.
 * @property {StorageService} storage - The storage configuration.
 * @returns
 */
export async function init(options) {
    const apiName = ApiEnum.INIT;
    const date = new Date().toISOString();
    try {
        const invalidErrorPrefix = `[ERROR]: ${Constants.LOG_PREFIX} ${date} `;
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
        const instance = new Wingify(options); // Creates a new Wingify instance with the validated options.
        _global = {
            vwoInitDeferred: new Deferred(),
            isSettingsFetched: false,
            instance: null,
        };
        return instance.then((_wingifyInstance) => {
            _global.isSettingsFetched = true;
            _global.instance = _wingifyInstance;
            _global.vwoInitDeferred.resolve(_wingifyInstance);
            return _wingifyInstance;
        });
    }
    catch (err) {
        const msg = buildMessage(ErrorLogMessagesEnum.EXECUTION_FAILED, {
            apiName,
            err: getFormattedErrorMessage(err),
        });
        console.info(`[INFO]: ${Constants.LOG_PREFIX} ${new Date().toISOString()} ${msg}`);
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
                _global.vwoInitDeferred.reject(new Error(Constants.SETTINGS_FETCH_ERROR));
            }, 5000);
        }
        return _global.vwoInitDeferred.promise;
    }
    catch (err) {
        const msg = buildMessage(ErrorLogMessagesEnum.EXECUTION_FAILED, {
            apiName,
            err: getFormattedErrorMessage(err),
        });
        console.info(`[INFO]: ${Constants.LOG_PREFIX} ${new Date().toISOString()} ${msg}`);
    }
}
//# sourceMappingURL=Wingify.js.map