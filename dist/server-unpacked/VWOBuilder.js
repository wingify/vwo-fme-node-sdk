"use strict";
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
var VWOBuilder = /** @class */ (function () {
    function VWOBuilder(options) {
        this.options = options;
    }
    /**
     * Sets the network manager with the provided client and development mode options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setNetworkManager = function () {
        var _a, _b, _c;
        var networkInstance = network_layer_1.NetworkManager.Instance;
        // Attach the network client from options
        networkInstance.attachClient((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.network) === null || _b === void 0 ? void 0 : _b.client);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: "Network Layer",
        }));
        // Set the development mode based on options
        networkInstance.getConfig().setDevelopmentMode((_c = this.options) === null || _c === void 0 ? void 0 : _c.isDevelopmentMode);
        return this;
    };
    VWOBuilder.prototype.initBatching = function () {
        var _this = this;
        if (this.settingFileManager.isGatewayServiceProvided) {
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.GATEWAY_AND_BATCH_EVENTS_CONFIG_MISMATCH));
            return this;
        }
        if (this.options.batchEventData) {
            // Skip batching initialization if neither eventsPerRequest nor requestTimeInterval are valid numbers greater than 0
            if ((!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.eventsPerRequest) ||
                this.options.batchEventData.eventsPerRequest <= 0) &&
                (!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.requestTimeInterval) ||
                    this.options.batchEventData.requestTimeInterval <= 0)) {
                logger_1.LogManager.Instance.error('Invalid batch events config, should be an object, eventsPerRequest should be a number greater than 0 and requestTimeInterval should be a number greater than 0');
                return this;
            }
            this.batchEventsQueue = new BatchEventsQueue_1.BatchEventsQueue(Object.assign({}, this.options.batchEventData, {
                dispatcher: function (events, callback) {
                    return BatchEventsDispatcher_1.BatchEventsDispatcher.dispatch({
                        ev: events,
                    }, callback, Object.assign({}, {
                        a: _this.options.accountId,
                        env: _this.options.sdkKey,
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
            // Avoid parallel fetches by recursively calling fetchSettings
            return this.fetchSettings(force);
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
            logger_1.LogManager.Instance.error('Failed to fetch settings. Error: ' + err);
            deferredObject.resolve({});
        }
        return deferredObject.promise;
    };
    /**
     * Sets the storage connector based on the provided storage options.
     * @returns {this} The instance of this builder.
     */
    VWOBuilder.prototype.setStorage = function () {
        if (this.options.storage) {
            // Attach the storage connector from options
            this.storage = storage_1.Storage.Instance.attachConnector(this.options.storage);
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
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
                apiName: apiName,
                err: err,
            }));
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
        if (!this.options.pollInterval) {
            return this;
        }
        if (this.options.pollInterval && !(0, DataTypeUtil_1.isNumber)(this.options.pollInterval)) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_INVALID, {
                key: 'pollInterval',
                correctType: 'number',
            }));
            return this;
        }
        if (this.options.pollInterval && this.options.pollInterval < 1000) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_INVALID, {
                key: 'pollInterval',
                correctType: 'number',
            }));
            return this;
        }
        this.checkAndPoll();
        return this;
    };
    /**
     * Builds a new VWOClient instance with the provided settings.
     * @param {SettingsModel} settings - The settings for the VWOClient.
     * @returns {VWOClient} The new VWOClient instance.
     */
    VWOBuilder.prototype.build = function (settings) {
        this.vwoInstance = new VWOClient_1.VWOClient(settings, this.options);
        return this.vwoInstance;
    };
    /**
     * Checks and polls for settings updates at the provided interval.
     */
    VWOBuilder.prototype.checkAndPoll = function () {
        var _this = this;
        var pollingInterval = this.options.pollInterval;
        setInterval(function () {
            _this.getSettings(true)
                .then(function (latestSettings) {
                var lastSettings = JSON.stringify(_this.originalSettings);
                var stringifiedLatestSettings = JSON.stringify(latestSettings);
                if (stringifiedLatestSettings !== lastSettings) {
                    _this.originalSettings = latestSettings;
                    var clonedSettings = (0, FunctionUtil_1.cloneObject)(latestSettings);
                    logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_SET_SETTINGS);
                    (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(clonedSettings, _this.vwoInstance);
                }
                else {
                    logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_NO_CHANGE_IN_SETTINGS);
                }
            })
                .catch(function () {
                logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.POLLING_FETCH_SETTINGS_FAILED);
            });
        }, pollingInterval);
    };
    return VWOBuilder;
}());
exports.VWOBuilder = VWOBuilder;
//# sourceMappingURL=VWOBuilder.js.map