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
exports.VWOBuilder = void 0;
var logger_1 = require("./packages/logger");
var network_layer_1 = require("./packages/network-layer");
var segmentation_evaluator_1 = require("./packages/segmentation-evaluator");
var storage_1 = require("./packages/storage");
var VWOClient_1 = require("./VWOClient");
var SettingsService_1 = require("./services/SettingsService");
var log_messages_1 = require("./enums/log-messages");
var DataTypeUtil_1 = require("./utils/DataTypeUtil");
var FunctionUtil_1 = require("./utils/FunctionUtil");
var LogMessageUtil_1 = require("./utils/LogMessageUtil");
var PromiseUtil_1 = require("./utils/PromiseUtil");
var SettingsUtil_1 = require("./utils/SettingsUtil");
var UuidUtil_1 = require("./utils/UuidUtil");
var BatchEventsQueue_1 = require("./services/BatchEventsQueue");
var BatchEventsDispatcher_1 = require("./utils/BatchEventsDispatcher");
var UsageStatsUtil_1 = require("./utils/UsageStatsUtil");
var constants_1 = require("./constants");
var ApiEnum_1 = require("./enums/ApiEnum");
var VWOBuilder = /** @class */ (function () {
    function VWOBuilder(options) {
        this.originalSettings = {};
        this.isValidPollIntervalPassedFromInit = false;
        this.isSettingsValid = false;
        this.settingsFetchTime = undefined;
        this.options = options;
    }
    /**
     * Sets the network manager with the provided client and development mode options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setNetworkManager = function () {
        var _a, _b, _c, _d, _e;
        var networkInstance = network_layer_1.NetworkManager.Instance;
        // Attach the network client from options
        networkInstance.attachClient((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.network) === null || _b === void 0 ? void 0 : _b.client, (_c = this.options) === null || _c === void 0 ? void 0 : _c.retryConfig, ((_d = this.options) === null || _d === void 0 ? void 0 : _d.shouldWaitForTrackingCalls) ? true : false);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: "Network Layer",
        }));
        // Set the development mode based on options
        networkInstance.getConfig().setDevelopmentMode((_e = this.options) === null || _e === void 0 ? void 0 : _e.isDevelopmentMode);
        return this;
    };
    VWOBuilder.prototype.initBatching = function () {
        var _this = this;
        if (this.options.batchEventData) {
            if (this.settingFileManager.isGatewayServiceProvided) {
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.GATEWAY_AND_BATCH_EVENTS_CONFIG_MISMATCH));
                return this;
            }
            if ((!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.eventsPerRequest) ||
                this.options.batchEventData.eventsPerRequest <= 0) &&
                (!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.requestTimeInterval) ||
                    this.options.batchEventData.requestTimeInterval <= 0)) {
                logger_1.LogManager.Instance.errorLog('INVALID_BATCH_EVENTS_CONFIG', {}, { an: ApiEnum_1.ApiEnum.INIT });
                return this;
            }
            this.batchEventsQueue = new BatchEventsQueue_1.BatchEventsQueue(Object.assign({}, this.options.batchEventData, {
                dispatcher: function (events, callback) {
                    return BatchEventsDispatcher_1.BatchEventsDispatcher.dispatch({
                        ev: events,
                    }, callback, Object.assign({}, {
                        a: _this.options.accountId,
                        env: _this.options.sdkKey,
                        sn: constants_1.Constants.SDK_NAME,
                        sv: constants_1.Constants.SDK_VERSION,
                    }));
                },
            }));
            this.batchEventsQueue.flushAndClearTimer.bind(this.batchEventsQueue);
        }
        return this;
    };
    /**
     * Sets the segmentation evaluator with the provided segmentation options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setSegmentation = function () {
        var _a;
        segmentation_evaluator_1.SegmentationManager.Instance.attachEvaluator((_a = this.options) === null || _a === void 0 ? void 0 : _a.segmentation);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: "Segmentation Evaluator",
        }));
        return this;
    };
    /**
     * Fetches settings asynchronously, ensuring no parallel fetches.
     * @param {boolean} [force=false] - Force fetch ignoring cache.
     * @returns {Promise<SettingsModel>} A promise that resolves to the fetched settings.
     */
    VWOBuilder.prototype.fetchSettings = function (force) {
        var _this = this;
        var deferredObject = new PromiseUtil_1.Deferred();
        // Check if a fetch operation is already in progress
        if (!this.isSettingsFetchInProgress) {
            this.isSettingsFetchInProgress = true;
            this.settingFileManager.getSettings(force).then(function (settings) {
                _this.isSettingsValid = _this.settingFileManager.isSettingsValid;
                _this.settingsFetchTime = _this.settingFileManager.settingsFetchTime;
                // if force is false, update original settings, if true the request is from polling and no need to update original settings
                if (!force) {
                    _this.originalSettings = settings;
                }
                _this.isSettingsFetchInProgress = false;
                deferredObject.resolve(settings);
            });
            return deferredObject.promise;
        }
        else {
            deferredObject.resolve(this.originalSettings);
            return deferredObject.promise;
        }
    };
    /**
     * Gets the settings, fetching them if not cached or if forced.
     * @param {boolean} [force=false] - Force fetch ignoring cache.
     * @returns {Promise<SettingsModel>} A promise that resolves to the settings.
     */
    VWOBuilder.prototype.getSettings = function (force) {
        var deferredObject = new PromiseUtil_1.Deferred();
        try {
            // Use cached settings if available and not forced to fetch
            if (!force && this.settings) {
                logger_1.LogManager.Instance.info('Using already fetched and cached settings');
                deferredObject.resolve(this.settings);
            }
            else {
                // Fetch settings if not cached or forced
                this.fetchSettings(force).then(function (settings) {
                    deferredObject.resolve(settings);
                });
            }
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS', {
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: force ? constants_1.Constants.POLLING : ApiEnum_1.ApiEnum.INIT }, false);
            deferredObject.resolve({});
        }
        return deferredObject.promise;
    };
    /**
     * Sets the storage connector based on the provided storage options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setStorage = function () {
        var _a, _b, _c, _d;
        if (this.options.storage) {
            // Attach the storage connector from options
            this.storage = storage_1.Storage.Instance.attachConnector(this.options.storage);
        }
        else if (typeof process === 'undefined' && typeof window !== 'undefined' && window.localStorage) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var BrowserStorageConnector = require('./packages/storage/connectors/BrowserStorageConnector').BrowserStorageConnector;
            // Pass clientStorage config to BrowserStorageConnector
            this.storage = storage_1.Storage.Instance.attachConnector(new BrowserStorageConnector(__assign(__assign({}, this.options.clientStorage), { alwaysUseCachedSettings: (_a = this.options.clientStorage) === null || _a === void 0 ? void 0 : _a.alwaysUseCachedSettings, ttl: (_b = this.options.clientStorage) === null || _b === void 0 ? void 0 : _b.ttl })));
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
                service: ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.clientStorage) === null || _d === void 0 ? void 0 : _d.provider) === sessionStorage ? "Session Storage" : "Local Storage",
            }));
        }
        else {
            // Set storage to null if no storage options provided
            this.storage = null;
        }
        return this;
    };
    /**
     * Sets the settings manager with the provided options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setSettingsService = function () {
        this.settingFileManager = new SettingsService_1.SettingsService(this.options);
        return this;
    };
    /**
     * Sets the logger with the provided logger options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setLogger = function () {
        this.logManager = new logger_1.LogManager(this.options.logger || {});
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: "Logger",
        }));
        return this;
    };
    /**
     * Sets the analytics callback with the provided analytics options.
     * @returns {this} The instance of this builder.
     */
    /* setAnalyticsCallback(): this {
      if (!isObject(this.options.analyticsEvent)) {
        // TODO: add logging here
        return this;
      }
  
      if (!isFunction(this.options.analyticsEvent.eventCallback)) {
        // TODO: add logging here
        return this;
      }
  
      if (
        this.options.analyticsEvent.isBatchingSupported &&
        !isBoolean(this.options.analyticsEvent.isBatchingSupported)
      ) {
        // TODO:- add logging here
        return this;
      }
  
      // AnalyticsEvent.Instance.attachCallback(
      //   this.options.analyticsEvent.eventCallback,
      //   this.options.analyticsEvent.isBatchingSupported
      // );
      return this;
    } */
    /**
     * Generates a random user ID based on the provided API key.
     * @returns {string} The generated random user ID.
     */
    VWOBuilder.prototype.getRandomUserId = function () {
        var apiName = 'getRandomUserId';
        try {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                apiName: apiName,
            }));
            return (0, UuidUtil_1.getRandomUUID)(this.options.sdkKey);
        }
        catch (err) {
            logger_1.LogManager.Instance.errorLog('EXECUTION_FAILED', {
                apiName: apiName,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            });
        }
    };
    /**
     * Initializes the batching with the provided batch events options.
     * @returns {this} The instance of this builder.
     */
    /* initBatching(): this {
      if (!isObject(this.options.batchEvents)) {
        // TODO:- add logging here
        return this;
      }
  
      if (
        isObject(this.options.batchEvents) &&
        (!(
          (isNumber(this.options.batchEvents.eventsPerRequest) &&
            this.options.batchEvents.eventsPerRequest > 0 &&
            this.options.batchEvents.eventsPerRequest <= Constants.MAX_EVENTS_PER_REQUEST) ||
          (isNumber(this.options.batchEvents.requestTimeInterval) && this.options.batchEvents.requestTimeInterval >= 1)
        ) ||
          !isFunction(this.options.batchEvents.flushCallback))
      ) {
        LogManager.Instance.error('Invalid batchEvents config');
        // throw new Error('Invalid batchEvents config');
        return this;
      }
  
      // BatchEventsQueue.Instance.setBatchConfig(this.options.batchEvents, this.options.sdkKey); // TODO
  
      return this;
    } */
    /**
     * Initializes the polling with the provided poll interval.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.initPolling = function () {
        var pollInterval = this.options.pollInterval;
        if (pollInterval != null && (0, DataTypeUtil_1.isNumber)(pollInterval) && pollInterval >= 1000) {
            this.isValidPollIntervalPassedFromInit = true;
            this.checkAndPoll();
        }
        else if (pollInterval != null) {
            logger_1.LogManager.Instance.errorLog('INVALID_POLLING_CONFIGURATION', {
                key: 'pollInterval',
                correctType: 'number >= 1000',
            }, { an: ApiEnum_1.ApiEnum.INIT });
        }
        return this;
    };
    /**
     * Initializes usage statistics for the SDK.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.initUsageStats = function () {
        if (this.options.isUsageStatsDisabled) {
            return this;
        }
        UsageStatsUtil_1.UsageStatsUtil.getInstance().setUsageStats(this.options);
        return this;
    };
    /**
     * Builds a new VWOClient instance with the provided settings.
     * @param {SettingsModel} settings - The settings for the VWOClient.
     * @returns {VWOClient} The new VWOClient instance.
     */
    VWOBuilder.prototype.build = function (settings) {
        this.vwoInstance = new VWOClient_1.VWOClient(settings, this.options);
        this.updatePollIntervalAndCheckAndPoll(settings, true);
        return this.vwoInstance;
    };
    /**
     * Checks and polls for settings updates at the provided interval.
     */
    VWOBuilder.prototype.checkAndPoll = function () {
        var _this = this;
        var _a;
        var poll = function () { return __awaiter(_this, void 0, void 0, function () {
            var latestSettings, clonedSettings, ex_1, interval_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, this.getSettings(true)];
                    case 1:
                        latestSettings = _b.sent();
                        if (latestSettings &&
                            Object.keys(latestSettings).length > 0 &&
                            JSON.stringify(latestSettings) !== JSON.stringify(this.originalSettings)) {
                            this.originalSettings = latestSettings;
                            clonedSettings = (0, FunctionUtil_1.cloneObject)(latestSettings);
                            logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_SET_SETTINGS);
                            (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(clonedSettings, this.vwoInstance);
                            // Reinitialize the poll_interval value if there is a change in settings
                            this.updatePollIntervalAndCheckAndPoll(latestSettings, false);
                        }
                        else if (latestSettings) {
                            logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_NO_CHANGE_IN_SETTINGS);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        ex_1 = _b.sent();
                        logger_1.LogManager.Instance.errorLog('ERROR_FETCHING_SETTINGS_WITH_POLLING', {
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(ex_1),
                        }, { an: constants_1.Constants.POLLING });
                        return [3 /*break*/, 4];
                    case 3:
                        interval_1 = (_a = this.options.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
                        setTimeout(poll, interval_1);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // Start the polling after the given interval
        var interval = (_a = this.options.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
        setTimeout(poll, interval);
    };
    VWOBuilder.prototype.updatePollIntervalAndCheckAndPoll = function (settings, shouldCheckAndPoll) {
        var _a;
        if (!this.isValidPollIntervalPassedFromInit) {
            var pollInterval = (_a = settings === null || settings === void 0 ? void 0 : settings.pollInterval) !== null && _a !== void 0 ? _a : constants_1.Constants.POLLING_INTERVAL;
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_POLL_INTERVAL_FROM_SETTINGS, {
                source: (settings === null || settings === void 0 ? void 0 : settings.pollInterval) ? 'settings' : 'default',
                pollInterval: pollInterval.toString(),
            }));
            this.options.pollInterval = pollInterval;
        }
        if (shouldCheckAndPoll && !this.isValidPollIntervalPassedFromInit) {
            this.checkAndPoll();
        }
    };
    return VWOBuilder;
}());
exports.VWOBuilder = VWOBuilder;
//# sourceMappingURL=VWOBuilder.js.map