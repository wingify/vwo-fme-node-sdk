import { Storage } from '../packages/storage/index.js';
import { LogManager } from '../packages/logger/index.js';
import { NetworkManager, RequestModel } from '../packages/network-layer/index.js';
import { Deferred } from '../utils/PromiseUtil.js';
import { Constants } from '../constants/index.js';
import { HTTPS_PROTOCOL, HTTP_PROTOCOL } from '../constants/Url.js';
import { HttpMethodEnum } from '../enums/HttpMethodEnum.js';
import { DebugLogMessagesEnum, InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { SettingsSchema } from '../models/schemas/SettingsSchemaValidation.js';
import { buildMessage } from '../utils/LogMessageUtil.js';
import { createNetWorkAndRetryDebugEvent, getSettingsPath } from '../utils/NetworkUtil.js';
import { sendDebugEventToVWO } from '../utils/DebuggerServiceUtil.js';
import { getFormattedErrorMessage } from '../utils/FunctionUtil.js';
import { ApiEnum } from '../enums/ApiEnum.js';
export class SettingsService {
    constructor(options) {
        this.isGatewayServiceProvided = false;
        this.settingsFetchTime = undefined; //time taken to fetch the settings
        this.isSettingsValid = false;
        this.proxyProvided = false;
        this.gatewayServiceConfig = {
            hostname: null,
            protocol: null,
            port: null,
        };
        this.sdkKey = options.sdkKey;
        this.accountId = options.accountId;
        this.expiry = options?.settings?.expiry || Constants.SETTINGS_EXPIRY;
        this.networkTimeout = options?.settings?.timeout || Constants.SETTINGS_TIMEOUT;
        // if sdk is running in browser environment then set isGatewayServiceProvided to true
        // when gatewayService is not provided then we dont update the url and let it point to dacdn by default
        // Check if sdk running in browser and not in edge/serverless environment
        if (typeof process === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
            this.isGatewayServiceProvided = true;
            // Handle proxyUrl for browser environment
            if (options?.proxyUrl) {
                this.proxyProvided = true;
                let parsedUrl;
                if (options.proxyUrl.startsWith(HTTP_PROTOCOL) || options.proxyUrl.startsWith(HTTPS_PROTOCOL)) {
                    parsedUrl = new URL(`${options.proxyUrl}`);
                }
                else {
                    parsedUrl = new URL(`${HTTPS_PROTOCOL}${options.proxyUrl}`);
                }
                this.hostname = parsedUrl.hostname;
                this.protocol = parsedUrl.protocol.replace(':', '');
                if (parsedUrl.port) {
                    this.port = parseInt(parsedUrl.port);
                }
            }
        }
        //if gateway is provided and proxy is not provided then only we will replace the hostname, protocol and port
        if (options?.gatewayService?.url) {
            let parsedUrl;
            this.isGatewayServiceProvided = true;
            if (options.gatewayService.url.startsWith(HTTP_PROTOCOL) ||
                options.gatewayService.url.startsWith(HTTPS_PROTOCOL)) {
                parsedUrl = new URL(`${options.gatewayService.url}`);
            }
            else if (options.gatewayService?.protocol) {
                parsedUrl = new URL(`${options.gatewayService.protocol}://${options.gatewayService.url}`);
            }
            else {
                parsedUrl = new URL(`${HTTPS_PROTOCOL}${options.gatewayService.url}`);
            }
            // dont replace the hostname, protocol and port if proxy is provided
            if (!this.proxyProvided) {
                this.hostname = parsedUrl.hostname;
                this.protocol = parsedUrl.protocol.replace(':', '');
                if (parsedUrl.port) {
                    this.port = parseInt(parsedUrl.port);
                }
                else if (options.gatewayService?.port) {
                    this.port = options.gatewayService.port;
                }
            }
            else {
                this.gatewayServiceConfig.hostname = parsedUrl.hostname;
                this.gatewayServiceConfig.protocol = parsedUrl.protocol.replace(':', '');
                if (parsedUrl.port) {
                    this.gatewayServiceConfig.port = parseInt(parsedUrl.port);
                }
                else if (options.gatewayService?.port) {
                    this.gatewayServiceConfig.port = options.gatewayService.port;
                }
            }
        }
        else {
            if (!this.proxyProvided) {
                this.hostname = Constants.HOST_NAME;
            }
        }
        // if (this.expiry > 0) {
        //   this.setSettingsExpiry();
        // }
        LogManager.Instance.debug(buildMessage(DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: 'Settings Manager',
        }));
        SettingsService.instance = this;
    }
    static get Instance() {
        return SettingsService.instance;
    }
    setSettingsExpiry() {
        const settingsTimeout = setTimeout(() => {
            this.fetchSettingsAndCacheInStorage().then(() => {
                clearTimeout(settingsTimeout);
                // again set the timer
                // NOTE: setInterval could be used but it will not consider the time required to fetch settings
                // This breaks the timer rythm and also sends more call than required
                this.setSettingsExpiry();
            });
        }, this.expiry);
    }
    async normalizeSettings(settings) {
        const normalizedSettings = { ...settings };
        if (!normalizedSettings.features || Object.keys(normalizedSettings.features).length === 0) {
            normalizedSettings.features = [];
        }
        if (!normalizedSettings.campaigns || Object.keys(normalizedSettings.campaigns).length === 0) {
            normalizedSettings.campaigns = [];
        }
        return normalizedSettings;
    }
    async handleBrowserEnvironment(storageConnector, deferredObject) {
        try {
            const cachedSettings = await storageConnector.getSettingsFromStorage(this.sdkKey, this.accountId);
            if (cachedSettings) {
                LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_FETCH_FROM_CACHE));
                deferredObject.resolve(cachedSettings);
            }
            else {
                LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_CACHE_MISS));
                const freshSettings = await this.fetchSettings();
                const normalizedSettings = await this.normalizeSettings(freshSettings);
                // set the settings in storage only if settings are valid
                this.isSettingsValid = new SettingsSchema().isSettingsValid(normalizedSettings);
                if (this.isSettingsValid) {
                    await storageConnector.setSettingsInStorage(normalizedSettings);
                }
                LogManager.Instance.info(buildMessage(InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
                deferredObject.resolve(normalizedSettings);
            }
        }
        catch (error) {
            LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: getFormattedErrorMessage(error),
            }, { an: Constants.BROWSER_STORAGE }, false);
            deferredObject.resolve(null);
        }
    }
    async handleServerEnvironment(deferredObject) {
        try {
            const settings = await this.fetchSettings();
            const normalizedSettings = await this.normalizeSettings(settings);
            deferredObject.resolve(normalizedSettings);
        }
        catch (error) {
            LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: getFormattedErrorMessage(error),
            }, { an: ApiEnum.INIT }, false);
            deferredObject.resolve(null);
        }
    }
    fetchSettingsAndCacheInStorage() {
        const deferredObject = new Deferred();
        const storageConnector = Storage.Instance.getConnector();
        if (typeof process === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
            this.handleBrowserEnvironment(storageConnector, deferredObject);
        }
        else {
            this.handleServerEnvironment(deferredObject);
        }
        return deferredObject.promise;
    }
    fetchSettings(isViaWebhook = false, apiName = ApiEnum.INIT) {
        const deferredObject = new Deferred();
        if (!this.sdkKey || !this.accountId) {
            deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
        }
        const networkInstance = NetworkManager.Instance;
        const options = getSettingsPath(this.sdkKey, this.accountId);
        const retryConfig = networkInstance.getRetryConfig();
        options.platform = Constants.PLATFORM;
        options.sn = Constants.SDK_NAME;
        options.sv = Constants.SDK_VERSION;
        options['api-version'] = Constants.API_VERSION;
        if (!networkInstance.getConfig().getDevelopmentMode()) {
            options.s = 'prod';
        }
        let path = Constants.SETTINGS_ENDPOINT;
        if (isViaWebhook) {
            path = Constants.WEBHOOK_SETTINGS_ENDPOINT;
        }
        try {
            //record the current timestamp
            const startTime = Date.now();
            const request = new RequestModel(this.hostname, HttpMethodEnum.GET, path, options, null, null, this.protocol, this.port, retryConfig);
            request.setTimeout(this.networkTimeout);
            networkInstance
                .get(request)
                .then((response) => {
                //record the timestamp when the response is received
                this.settingsFetchTime = Date.now() - startTime;
                // if attempt is more than 0
                if (response.getTotalAttempts() > 0) {
                    const debugEventProps = createNetWorkAndRetryDebugEvent(response, '', isViaWebhook ? ApiEnum.UPDATE_SETTINGS : apiName, path);
                    // send debug event
                    sendDebugEventToVWO(debugEventProps);
                }
                deferredObject.resolve(response.getData());
            })
                .catch((err) => {
                const debugEventProps = createNetWorkAndRetryDebugEvent(err, '', isViaWebhook ? ApiEnum.UPDATE_SETTINGS : apiName, path);
                // send debug event
                sendDebugEventToVWO(debugEventProps);
                deferredObject.reject(err);
            });
            return deferredObject.promise;
        }
        catch (err) {
            LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: getFormattedErrorMessage(err),
            }, { an: isViaWebhook ? ApiEnum.UPDATE_SETTINGS : apiName }, false);
            deferredObject.reject(err);
            return deferredObject.promise;
        }
    }
    getSettings(forceFetch = false) {
        const deferredObject = new Deferred();
        if (forceFetch) {
            this.fetchSettingsAndCacheInStorage().then((settings) => {
                deferredObject.resolve(settings);
            });
        }
        else {
            // const storageConnector = Storage.Instance.getConnector();
            // if (storageConnector) {
            //   storageConnector
            //     .get(Constants.SETTINGS)
            //     .then((storedSettings: dynamic) => {
            //       if (!isObject(storedSettings)) {
            //         this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
            //           const isSettingsValid = new SettingsSchema().isSettingsValid(fetchedSettings);
            //           if (isSettingsValid) {
            //             deferredObject.resolve(fetchedSettings);
            //           } else {
            //             deferredObject.reject(new Error('Settings are not valid. Failed schema validation.'));
            //           }
            //         });
            //       } else {
            //         deferredObject.resolve(storedSettings);
            //       }
            //     })
            //     .catch(() => {
            //       this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
            //         deferredObject.resolve(fetchedSettings);
            //       });
            //     });
            // } else {
            this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
                const isSettingsValid = new SettingsSchema().isSettingsValid(fetchedSettings);
                this.isSettingsValid = isSettingsValid;
                if (this.isSettingsValid) {
                    LogManager.Instance.info(InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
                    deferredObject.resolve(fetchedSettings);
                }
                else {
                    LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.INIT }, false);
                    deferredObject.resolve({});
                }
            });
        }
        return deferredObject.promise;
    }
}
//# sourceMappingURL=SettingsService.js.map