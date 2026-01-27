"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
var network_layer_1 = require("../packages/network-layer");
var PromiseUtil_1 = require("../utils/PromiseUtil");
var constants_1 = require("../constants");
var Url_1 = require("../constants/Url");
var HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
var log_messages_1 = require("../enums/log-messages");
var SettingsSchemaValidation_1 = require("../models/schemas/SettingsSchemaValidation");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var NetworkUtil_1 = require("../utils/NetworkUtil");
var DebuggerServiceUtil_1 = require("../utils/DebuggerServiceUtil");
var FunctionUtil_1 = require("../utils/FunctionUtil");
var ApiEnum_1 = require("../enums/ApiEnum");
var StorageService_1 = require("./StorageService");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var SettingsService = /** @class */ (function () {
    function SettingsService(options, logManager) {
        var _a, _b, _c, _d, _e, _f;
        this.isGatewayServiceProvided = false;
        this.settingsFetchTime = undefined; //time taken to fetch the settings
        this.isSettingsValid = false;
        this.proxyProvided = false;
        this.isStorageServiceProvided = false;
        this.isEdgeEnvironment = false;
        this.isSettingsProvidedInInit = false;
        this.startTimeForInit = undefined;
        this.gatewayServiceConfig = {
            hostname: null,
            protocol: null,
            port: null,
        };
        this.logManager = logManager;
        this.sdkKey = options.sdkKey;
        this.accountId = options.accountId;
        this.expiry = ((_a = options === null || options === void 0 ? void 0 : options.settings) === null || _a === void 0 ? void 0 : _a.expiry) || constants_1.Constants.SETTINGS_EXPIRY;
        this.networkTimeout = ((_b = options === null || options === void 0 ? void 0 : options.settings) === null || _b === void 0 ? void 0 : _b.timeout) || constants_1.Constants.SETTINGS_TIMEOUT;
        this.isStorageServiceProvided = (options === null || options === void 0 ? void 0 : options.isStorageServiceProvided) || false;
        if ((options === null || options === void 0 ? void 0 : options.edgeConfig) && Object.keys(options === null || options === void 0 ? void 0 : options.edgeConfig).length > 0) {
            this.isEdgeEnvironment = true;
        }
        // if sdk is running in browser environment then set isGatewayServiceProvided to true
        // when gatewayService is not provided then we dont update the url and let it point to dacdn by default
        // Check if sdk running in browser and not in edge/serverless environment
        if (typeof process === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
            this.isGatewayServiceProvided = true;
        }
        // Handle proxyUrl config
        if (options === null || options === void 0 ? void 0 : options.proxyUrl) {
            this.proxyProvided = true;
            var parsedUrl = void 0;
            if (options.proxyUrl.startsWith(Url_1.HTTP_PROTOCOL) || options.proxyUrl.startsWith(Url_1.HTTPS_PROTOCOL)) {
                parsedUrl = new URL("".concat(options.proxyUrl));
            }
            else {
                parsedUrl = new URL("".concat(Url_1.HTTPS_PROTOCOL).concat(options.proxyUrl));
            }
            this.hostname = parsedUrl.hostname;
            this.protocol = parsedUrl.protocol.replace(':', '');
            if (parsedUrl.port) {
                this.port = parseInt(parsedUrl.port);
            }
        }
        //if gateway is provided and proxy is not provided then only we will replace the hostname, protocol and port
        if ((_c = options === null || options === void 0 ? void 0 : options.gatewayService) === null || _c === void 0 ? void 0 : _c.url) {
            var parsedUrl = void 0;
            this.isGatewayServiceProvided = true;
            if (options.gatewayService.url.startsWith(Url_1.HTTP_PROTOCOL) ||
                options.gatewayService.url.startsWith(Url_1.HTTPS_PROTOCOL)) {
                parsedUrl = new URL("".concat(options.gatewayService.url));
            }
            else if ((_d = options.gatewayService) === null || _d === void 0 ? void 0 : _d.protocol) {
                parsedUrl = new URL("".concat(options.gatewayService.protocol, "://").concat(options.gatewayService.url));
            }
            else {
                parsedUrl = new URL("".concat(Url_1.HTTPS_PROTOCOL).concat(options.gatewayService.url));
            }
            // dont replace the hostname, protocol and port if proxy is provided
            if (!this.proxyProvided) {
                this.hostname = parsedUrl.hostname;
                this.protocol = parsedUrl.protocol.replace(':', '');
                if (parsedUrl.port) {
                    this.port = parseInt(parsedUrl.port);
                }
                else if ((_e = options.gatewayService) === null || _e === void 0 ? void 0 : _e.port) {
                    this.port = options.gatewayService.port;
                }
            }
            else {
                this.gatewayServiceConfig.hostname = parsedUrl.hostname;
                this.gatewayServiceConfig.protocol = parsedUrl.protocol.replace(':', '');
                if (parsedUrl.port) {
                    this.gatewayServiceConfig.port = parseInt(parsedUrl.port);
                }
                else if ((_f = options.gatewayService) === null || _f === void 0 ? void 0 : _f.port) {
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
        this.logManager.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: 'Settings Manager',
        }));
    }
    /**
     * Injects the service container into the settings service.
     * @param {ServiceContainer} serviceContainer - The service container to inject.
     */
    SettingsService.prototype.injectServiceContainer = function (serviceContainer) {
        this.serviceContainer = serviceContainer;
    };
    /**
     * Check if proxy is provided
     * @returns {boolean} - True if proxy is provided, false otherwise
     */
    SettingsService.prototype.isProxyProvided = function () {
        return this.proxyProvided;
    };
    /**
     * Normalize the settings
     * @param settings - The settings to normalize
     * @returns {Record<any, any>} - The normalized settings
     */
    SettingsService.prototype.normalizeSettings = function (settings) {
        var normalizedSettings = __assign({}, settings);
        if (!normalizedSettings.features || Object.keys(normalizedSettings.features).length === 0) {
            normalizedSettings.features = [];
        }
        if (!normalizedSettings.campaigns || Object.keys(normalizedSettings.campaigns).length === 0) {
            normalizedSettings.campaigns = [];
        }
        return normalizedSettings;
    };
    SettingsService.prototype.fetchSettings = function (isViaWebhook, apiName) {
        var _this = this;
        if (isViaWebhook === void 0) { isViaWebhook = false; }
        if (apiName === void 0) { apiName = ApiEnum_1.ApiEnum.INIT; }
        var deferredObject = new PromiseUtil_1.Deferred();
        if (!this.sdkKey || !this.accountId) {
            deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
        }
        var options = (0, NetworkUtil_1.getSettingsPath)(this.sdkKey, this.accountId);
        var retryConfig = this.serviceContainer.getNetworkManager().getRetryConfig();
        options.platform = constants_1.Constants.PLATFORM;
        options.sn = constants_1.Constants.SDK_NAME;
        options.sv = constants_1.Constants.SDK_VERSION;
        options['api-version'] = constants_1.Constants.API_VERSION;
        if (!this.serviceContainer.getNetworkManager().getConfig().getDevelopmentMode()) {
            options.s = 'prod';
        }
        var path = constants_1.Constants.SETTINGS_ENDPOINT;
        if (isViaWebhook) {
            path = constants_1.Constants.WEBHOOK_SETTINGS_ENDPOINT;
        }
        try {
            //record the current timestamp
            var startTime_1 = Date.now();
            var request = new network_layer_1.RequestModel(this.hostname, HttpMethodEnum_1.HttpMethodEnum.GET, path, options, null, null, this.protocol, this.port, retryConfig);
            request.setTimeout(this.networkTimeout);
            this.serviceContainer
                .getNetworkManager()
                .get(request)
                .then(function (response) {
                //record the timestamp when the response is received
                _this.settingsFetchTime = Date.now() - startTime_1;
                // if attempt is more than 0
                if (response.getTotalAttempts() > 0) {
                    var debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(response, '', isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName, path);
                    // send debug event
                    (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(_this.serviceContainer, debugEventProps);
                }
                deferredObject.resolve(response.getData());
            })
                .catch(function (err) {
                var debugEventProps = (0, NetworkUtil_1.createNetWorkAndRetryDebugEvent)(err, '', isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName, path);
                // send debug event
                (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(_this.serviceContainer, debugEventProps);
                deferredObject.reject(err);
            });
            return deferredObject.promise;
        }
        catch (err) {
            this.logManager.errorLog('ERROR_FETCHING_SETTINGS', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: isViaWebhook ? ApiEnum_1.ApiEnum.UPDATE_SETTINGS : apiName }, false);
            deferredObject.reject(err);
            return deferredObject.promise;
        }
    };
    /**
     * Gets the settings, fetching them if not cached from storage or server.
     s* @returns {Promise<Record<any, any>>} A promise that resolves to the settings.
     */
    SettingsService.prototype.getSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, storageService, cachedSettings, freshSettings, normalizedSettings, freshSettings, normalizedSettings, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deferredObject = new PromiseUtil_1.Deferred();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 14]);
                        if (!this.isStorageServiceProvided) return [3 /*break*/, 9];
                        storageService = new StorageService_1.StorageService(this.serviceContainer);
                        return [4 /*yield*/, storageService.getSettingsFromStorage(this.accountId, this.sdkKey, !this.isEdgeEnvironment)];
                    case 2:
                        cachedSettings = _a.sent();
                        if (!(cachedSettings && !(0, DataTypeUtil_1.isEmptyObject)(cachedSettings))) return [3 /*break*/, 3];
                        this.logManager.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_FROM_CACHE));
                        deferredObject.resolve(cachedSettings);
                        return [3 /*break*/, 8];
                    case 3:
                        // if no cached settings are found, fetch fresh settings from server
                        this.logManager.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_CACHE_MISS));
                        return [4 /*yield*/, this.fetchSettings()];
                    case 4:
                        freshSettings = _a.sent();
                        return [4 /*yield*/, this.normalizeSettings(freshSettings)];
                    case 5:
                        normalizedSettings = _a.sent();
                        // check if the settings are valid
                        this.isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings);
                        if (!this.isSettingsValid) return [3 /*break*/, 7];
                        // if settings are valid, set the settings in storage
                        this.logManager.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
                        return [4 /*yield*/, storageService.setSettingsInStorage(this.accountId, this.sdkKey, normalizedSettings)];
                    case 6:
                        _a.sent();
                        deferredObject.resolve(normalizedSettings);
                        return [3 /*break*/, 8];
                    case 7:
                        this.logManager.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.INIT }, false);
                        deferredObject.resolve({});
                        _a.label = 8;
                    case 8: return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, this.fetchSettings()];
                    case 10:
                        freshSettings = _a.sent();
                        return [4 /*yield*/, this.normalizeSettings(freshSettings)];
                    case 11:
                        normalizedSettings = _a.sent();
                        this.isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings);
                        if (this.isSettingsValid) {
                            this.logManager.info(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
                            deferredObject.resolve(normalizedSettings);
                        }
                        else {
                            this.logManager.errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.INIT }, false);
                            deferredObject.resolve({});
                        }
                        _a.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_1 = _a.sent();
                        this.logManager.errorLog('ERROR_FETCHING_SETTINGS', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(error_1),
                        }, { an: ApiEnum_1.ApiEnum.INIT }, false);
                        deferredObject.resolve({});
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    return SettingsService;
}());
exports.SettingsService = SettingsService;
//# sourceMappingURL=SettingsService.js.map