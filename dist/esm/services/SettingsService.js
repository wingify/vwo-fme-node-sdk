"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const storage_1 = require("../packages/storage");
const logger_1 = require("../packages/logger");
const network_layer_1 = require("../packages/network-layer");
const PromiseUtil_1 = require("../utils/PromiseUtil");
const constants_1 = require("../constants");
const Url_1 = require("../constants/Url");
const HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
const log_messages_1 = require("../enums/log-messages");
const SettingsSchemaValidation_1 = require("../models/schemas/SettingsSchemaValidation");
const LogMessageUtil_1 = require("../utils/LogMessageUtil");
const NetworkUtil_1 = require("../utils/NetworkUtil");
const DebuggerCategoryEnum_1 = require("../enums/DebuggerCategoryEnum");
const DebuggerServiceUtil_1 = require("../utils/DebuggerServiceUtil");
const FunctionUtil_1 = require("../utils/FunctionUtil");
const ApiEnum_1 = require("../enums/ApiEnum");
class SettingsService {
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
        this.expiry = options?.settings?.expiry || constants_1.Constants.SETTINGS_EXPIRY;
        this.networkTimeout = options?.settings?.timeout || constants_1.Constants.SETTINGS_TIMEOUT;
        // if sdk is running in browser environment then set isGatewayServiceProvided to true
        // when gatewayService is not provided then we dont update the url and let it point to dacdn by default
        // Check if sdk running in browser and not in edge/serverless environment
        if (typeof process === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
            this.isGatewayServiceProvided = true;
            // Handle proxyUrl for browser environment
            if (options?.proxyUrl) {
                this.proxyProvided = true;
                let parsedUrl;
                if (options.proxyUrl.startsWith(Url_1.HTTP_PROTOCOL) || options.proxyUrl.startsWith(Url_1.HTTPS_PROTOCOL)) {
                    parsedUrl = new URL(`${options.proxyUrl}`);
                }
                else {
                    parsedUrl = new URL(`${Url_1.HTTPS_PROTOCOL}${options.proxyUrl}`);
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
            if (options.gatewayService.url.startsWith(Url_1.HTTP_PROTOCOL) ||
                options.gatewayService.url.startsWith(Url_1.HTTPS_PROTOCOL)) {
                parsedUrl = new URL(`${options.gatewayService.url}`);
            }
            else if (options.gatewayService?.protocol) {
                parsedUrl = new URL(`${options.gatewayService.protocol}://${options.gatewayService.url}`);
            }
            else {
                parsedUrl = new URL(`${Url_1.HTTPS_PROTOCOL}${options.gatewayService.url}`);
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
                this.hostname = constants_1.Constants.HOST_NAME;
            }
        }
        // if (this.expiry > 0) {
        //   this.setSettingsExpiry();
        // }
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
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
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_FROM_CACHE));
                deferredObject.resolve(cachedSettings);
            }
            else {
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_CACHE_MISS));
                const freshSettings = await this.fetchSettings();
                const normalizedSettings = await this.normalizeSettings(freshSettings);
                // set the settings in storage only if settings are valid
                this.isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings);
                if (this.isSettingsValid) {
                    await storageConnector.setSettingsInStorage(normalizedSettings);
                }
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
                deferredObject.resolve(normalizedSettings);
            }
        }
        catch (error) {
            logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
            }, { an: constants_1.Constants.BROWSER_STORAGE }, false);
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
            logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(error),
            }, { an: ApiEnum_1.ApiEnum.INIT }, false);
            deferredObject.resolve(null);
        }
    }
    fetchSettingsAndCacheInStorage() {
        const deferredObject = new PromiseUtil_1.Deferred();
        const storageConnector = storage_1.Storage.Instance.getConnector();
        if (typeof process === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
            this.handleBrowserEnvironment(storageConnector, deferredObject);
        }
        else {
            this.handleServerEnvironment(deferredObject);
        }
        return deferredObject.promise;
    }
    fetchSettings(isViaWebhook = false, apiName = ApiEnum_1.ApiEnum.INIT) {
        const deferredObject = new PromiseUtil_1.Deferred();
        if (!this.sdkKey || !this.accountId) {
            deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
        }
        const networkInstance = network_layer_1.NetworkManager.Instance;
        const options = (0, NetworkUtil_1.getSettingsPath)(this.sdkKey, this.accountId);
        const retryConfig = networkInstance.getRetryConfig();
        options.platform = constants_1.Constants.PLATFORM;
        options.sn = constants_1.Constants.SDK_NAME;
        options.sv = constants_1.Constants.SDK_VERSION;
        options['api-version'] = constants_1.Constants.API_VERSION;
        if (!networkInstance.getConfig().getDevelopmentMode()) {
            options.s = 'prod';
        }
        let path = constants_1.Constants.SETTINGS_ENDPOINT;
        if (isViaWebhook) {
            path = constants_1.Constants.WEBHOOK_SETTINGS_ENDPOINT;
        }
        try {
            //record the current timestamp
            const startTime = Date.now();
            const request = new network_layer_1.RequestModel(this.hostname, HttpMethodEnum_1.HttpMethodEnum.GET, path, options, null, null, this.protocol, this.port, retryConfig);
            request.setTimeout(this.networkTimeout);
            networkInstance
                .get(request)
                .then((response) => {
                //record the timestamp when the response is received
                this.settingsFetchTime = Date.now() - startTime;
                // if attempt is more than 0
                if (response.getTotalAttempts() > 0) {
                    // set category, if call got success then category is retry, otherwise network
                    let lt = logger_1.LogLevelEnum.INFO.toString();
                    let category = DebuggerCategoryEnum_1.DebuggerCategoryEnum.RETRY;
                    let msg_t = constants_1.Constants.NETWORK_CALL_SUCCESS_WITH_RETRIES;
                    let msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.NETWORK_CALL_SUCCESS_WITH_RETRIES, {
                        extraData: path,
                        attempts: response.getTotalAttempts(),
                        err: (0, FunctionUtil_1.getFormattedErrorMessage)(response.getError()),
                    });
                    if (response.getStatusCode() !== 200) {
                        category = DebuggerCategoryEnum_1.DebuggerCategoryEnum.NETWORK;
                        msg_t = constants_1.Constants.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES;
                        msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES, {
                            extraData: path,
                            attempts: response.getTotalAttempts(),
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(response.getError()),
                        });
                        lt = logger_1.LogLevelEnum.ERROR.toString();
                    }
                    const debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(request, response, '', isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName, category);
                    debugEventProps.msg_t = msg_t;
                    debugEventProps.lt = lt;
                    debugEventProps.msg = msg;
                    // send debug event
                    (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                }
                deferredObject.resolve(response.getData());
            })
                .catch((err) => {
                const debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(request, err, '', isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName, DebuggerCategoryEnum_1.DebuggerCategoryEnum.NETWORK);
                debugEventProps.msg_t = constants_1.Constants.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES;
                debugEventProps.msg = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES, {
                    extraData: path,
                    attempts: err.getTotalAttempts(),
                    err: (0, FunctionUtil_1.getFormattedErrorMessage)(err.getError()),
                });
                debugEventProps.lt = logger_1.LogLevelEnum.ERROR.toString();
                // send debug event
                (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
                deferredObject.reject(err);
            });
            return deferredObject.promise;
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName }, false);
            deferredObject.reject(err);
            return deferredObject.promise;
        }
    }
    getSettings(forceFetch = false) {
        const deferredObject = new PromiseUtil_1.Deferred();
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
                const isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(fetchedSettings);
                this.isSettingsValid = isSettingsValid;
                if (this.isSettingsValid) {
                    logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
                    deferredObject.resolve(fetchedSettings);
                }
                else {
                    logger_1.LogManager.Instance.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.INIT }, false);
                    deferredObject.resolve({});
                }
            });
        }
        return deferredObject.promise;
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=SettingsService.js.map