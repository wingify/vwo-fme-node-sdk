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
var storage_1 = require("../packages/storage");
var logger_1 = require("../packages/logger");
var network_layer_1 = require("../packages/network-layer");
var PromiseUtil_1 = require("../utils/PromiseUtil");
var constants_1 = require("../constants");
var Url_1 = require("../constants/Url");
var HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
var log_messages_1 = require("../enums/log-messages");
var SettingsSchemaValidation_1 = require("../models/schemas/SettingsSchemaValidation");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var NetworkUtil_1 = require("../utils/NetworkUtil");
var SettingsService = /** @class */ (function () {
    function SettingsService(options) {
        var _a, _b, _c, _d, _e, _f;
        this.isGatewayServiceProvided = false;
        this.proxyProvided = false;
        this.gatewayServiceConfig = {
            hostname: null,
            protocol: null,
            port: null,
        };
        this.sdkKey = options.sdkKey;
        this.accountId = options.accountId;
        this.expiry = ((_a = options === null || options === void 0 ? void 0 : options.settings) === null || _a === void 0 ? void 0 : _a.expiry) || constants_1.Constants.SETTINGS_EXPIRY;
        this.networkTimeout = ((_b = options === null || options === void 0 ? void 0 : options.settings) === null || _b === void 0 ? void 0 : _b.timeout) || constants_1.Constants.SETTINGS_TIMEOUT;
        // if sdk is running in browser environment then set isGatewayServiceProvided to true
        // when gatewayService is not provided then we dont update the url and let it point to dacdn by default
        // Check if sdk running in browser and not in edge/serverless environment
        if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
            this.isGatewayServiceProvided = true;
            // Handle proxyUrl for browser environment
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
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: 'Settings Manager',
        }));
        SettingsService.instance = this;
    }
    Object.defineProperty(SettingsService, "Instance", {
        get: function () {
            return SettingsService.instance;
        },
        enumerable: false,
        configurable: true
    });
    SettingsService.prototype.setSettingsExpiry = function () {
        var _this = this;
        var settingsTimeout = setTimeout(function () {
            _this.fetchSettingsAndCacheInStorage().then(function () {
                clearTimeout(settingsTimeout);
                // again set the timer
                // NOTE: setInterval could be used but it will not consider the time required to fetch settings
                // This breaks the timer rythm and also sends more call than required
                _this.setSettingsExpiry();
            });
        }, this.expiry);
    };
    SettingsService.prototype.normalizeSettings = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedSettings;
            return __generator(this, function (_a) {
                normalizedSettings = __assign({}, settings);
                if (!normalizedSettings.features || Object.keys(normalizedSettings.features).length === 0) {
                    normalizedSettings.features = [];
                }
                if (!normalizedSettings.campaigns || Object.keys(normalizedSettings.campaigns).length === 0) {
                    normalizedSettings.campaigns = [];
                }
                return [2 /*return*/, normalizedSettings];
            });
        });
    };
    SettingsService.prototype.handleBrowserEnvironment = function (storageConnector, deferredObject) {
        return __awaiter(this, void 0, void 0, function () {
            var cachedSettings, freshSettings, normalizedSettings, isSettingsValid, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, storageConnector.getSettingsFromStorage(this.sdkKey, this.accountId)];
                    case 1:
                        cachedSettings = _a.sent();
                        if (cachedSettings) {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_FROM_CACHE));
                            deferredObject.resolve(cachedSettings);
                        }
                        else {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_CACHE_MISS));
                        }
                        return [4 /*yield*/, this.fetchSettings()];
                    case 2:
                        freshSettings = _a.sent();
                        return [4 /*yield*/, this.normalizeSettings(freshSettings)];
                    case 3:
                        normalizedSettings = _a.sent();
                        isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings);
                        if (!isSettingsValid) return [3 /*break*/, 5];
                        return [4 /*yield*/, storageConnector.setSettingsInStorage(normalizedSettings)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (cachedSettings) {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_BACKGROUND_UPDATE));
                        }
                        else {
                            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
                            deferredObject.resolve(normalizedSettings);
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
                            err: JSON.stringify(error_1),
                        }));
                        deferredObject.resolve(null);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SettingsService.prototype.handleServerEnvironment = function (deferredObject) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, normalizedSettings, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.fetchSettings()];
                    case 1:
                        settings = _a.sent();
                        return [4 /*yield*/, this.normalizeSettings(settings)];
                    case 2:
                        normalizedSettings = _a.sent();
                        deferredObject.resolve(normalizedSettings);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
                            err: JSON.stringify(error_2),
                        }));
                        deferredObject.resolve(null);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SettingsService.prototype.fetchSettingsAndCacheInStorage = function () {
        var deferredObject = new PromiseUtil_1.Deferred();
        var storageConnector = storage_1.Storage.Instance.getConnector();
        if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined') {
            this.handleBrowserEnvironment(storageConnector, deferredObject);
        }
        else {
            this.handleServerEnvironment(deferredObject);
        }
        return deferredObject.promise;
    };
    SettingsService.prototype.fetchSettings = function (isViaWebhook) {
        if (isViaWebhook === void 0) { isViaWebhook = false; }
        var deferredObject = new PromiseUtil_1.Deferred();
        if (!this.sdkKey || !this.accountId) {
            deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
        }
        var networkInstance = network_layer_1.NetworkManager.Instance;
        var options = (0, NetworkUtil_1.getSettingsPath)(this.sdkKey, this.accountId);
        var retryConfig = networkInstance.getRetryConfig();
        options.platform = constants_1.Constants.PLATFORM;
        options['api-version'] = constants_1.Constants.API_VERSION;
        if (!networkInstance.getConfig().getDevelopmentMode()) {
            options.s = 'prod';
        }
        var path = constants_1.Constants.SETTINTS_ENDPOINT;
        if (isViaWebhook) {
            path = constants_1.Constants.WEBHOOK_SETTINTS_ENDPOINT;
        }
        try {
            var request = new network_layer_1.RequestModel(this.hostname, HttpMethodEnum_1.HttpMethodEnum.GET, path, options, null, null, this.protocol, this.port, retryConfig);
            request.setTimeout(this.networkTimeout);
            networkInstance
                .get(request)
                .then(function (response) {
                deferredObject.resolve(response.getData());
            })
                .catch(function (err) {
                deferredObject.reject(err);
            });
            return deferredObject.promise;
        }
        catch (err) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SETTINGS_FETCH_ERROR, {
                err: JSON.stringify(err),
            }));
            deferredObject.reject(err);
            return deferredObject.promise;
        }
    };
    SettingsService.prototype.getSettings = function (forceFetch) {
        if (forceFetch === void 0) { forceFetch = false; }
        var deferredObject = new PromiseUtil_1.Deferred();
        if (forceFetch) {
            this.fetchSettingsAndCacheInStorage().then(function (settings) {
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
            this.fetchSettingsAndCacheInStorage().then(function (fetchedSettings) {
                var isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(fetchedSettings);
                if (isSettingsValid) {
                    logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS);
                    deferredObject.resolve(fetchedSettings);
                }
                else {
                    logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.SETTINGS_SCHEMA_INVALID);
                    deferredObject.resolve({});
                }
            });
            // }
        }
        return deferredObject.promise;
    };
    return SettingsService;
}());
exports.SettingsService = SettingsService;
//# sourceMappingURL=SettingsService.js.map