"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VWOBuilder = void 0;
const logger_1 = require("./packages/logger");
const network_layer_1 = require("./packages/network-layer");
const segmentation_evaluator_1 = require("./packages/segmentation-evaluator");
const storage_1 = require("./packages/storage");
const VWOClient_1 = require("./VWOClient");
const SettingsService_1 = require("./services/SettingsService");
const log_messages_1 = require("./enums/log-messages");
const DataTypeUtil_1 = require("./utils/DataTypeUtil");
const FunctionUtil_1 = require("./utils/FunctionUtil");
const LogMessageUtil_1 = require("./utils/LogMessageUtil");
const PromiseUtil_1 = require("./utils/PromiseUtil");
const SettingsUtil_1 = require("./utils/SettingsUtil");
const UuidUtil_1 = require("./utils/UuidUtil");
const BatchEventsQueue_1 = require("./services/BatchEventsQueue");
const BatchEventsDispatcher_1 = require("./utils/BatchEventsDispatcher");
const UsageStatsUtil_1 = require("./utils/UsageStatsUtil");
const constants_1 = require("./constants");
class VWOBuilder {
    constructor(options) {
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
    setNetworkManager() {
        const networkInstance = network_layer_1.NetworkManager.Instance;
        // Attach the network client from options
        networkInstance.attachClient(this.options?.network?.client, this.options?.retryConfig);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: `Network Layer`,
        }));
        // Set the development mode based on options
        networkInstance.getConfig().setDevelopmentMode(this.options?.isDevelopmentMode);
        return this;
    }
    initBatching() {
        if (this.options.batchEventData) {
            if (this.settingFileManager.isGatewayServiceProvided) {
                logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.GATEWAY_AND_BATCH_EVENTS_CONFIG_MISMATCH));
                return this;
            }
            if ((!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.eventsPerRequest) ||
                this.options.batchEventData.eventsPerRequest <= 0) &&
                (!(0, DataTypeUtil_1.isNumber)(this.options.batchEventData.requestTimeInterval) ||
                    this.options.batchEventData.requestTimeInterval <= 0)) {
                logger_1.LogManager.Instance.error('Invalid batch events config, should be an object, eventsPerRequest should be a number greater than 0 and requestTimeInterval should be a number greater than 0');
                return this;
            }
            this.batchEventsQueue = new BatchEventsQueue_1.BatchEventsQueue(Object.assign({}, this.options.batchEventData, {
                dispatcher: (events, callback) => BatchEventsDispatcher_1.BatchEventsDispatcher.dispatch({
                    ev: events,
                }, callback, Object.assign({}, {
                    a: this.options.accountId,
                    env: this.options.sdkKey,
                    sn: constants_1.Constants.SDK_NAME,
                    sv: constants_1.Constants.SDK_VERSION,
                })),
            }));
            this.batchEventsQueue.flushAndClearTimer.bind(this.batchEventsQueue);
        }
        return this;
    }
    /**
     * Sets the segmentation evaluator with the provided segmentation options.
     * @returns {this} The instance of this builder.
     */
    setSegmentation() {
        segmentation_evaluator_1.SegmentationManager.Instance.attachEvaluator(this.options?.segmentation);
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: `Segmentation Evaluator`,
        }));
        return this;
    }
    /**
     * Fetches settings asynchronously, ensuring no parallel fetches.
     * @param {boolean} [force=false] - Force fetch ignoring cache.
     * @returns {Promise<SettingsModel>} A promise that resolves to the fetched settings.
     */
    fetchSettings(force) {
        const deferredObject = new PromiseUtil_1.Deferred();
        // Check if a fetch operation is already in progress
        if (!this.isSettingsFetchInProgress) {
            this.isSettingsFetchInProgress = true;
            this.settingFileManager.getSettings(force).then((settings) => {
                this.isSettingsValid = this.settingFileManager.isSettingsValid;
                this.settingsFetchTime = this.settingFileManager.settingsFetchTime;
                // if force is false, update original settings, if true the request is from polling and no need to update original settings
                if (!force) {
                    this.originalSettings = settings;
                }
                this.isSettingsFetchInProgress = false;
                deferredObject.resolve(settings);
            });
            return deferredObject.promise;
        }
        else {
            deferredObject.resolve(this.originalSettings);
            return deferredObject.promise;
        }
    }
    /**
     * Gets the settings, fetching them if not cached or if forced.
     * @param {boolean} [force=false] - Force fetch ignoring cache.
     * @returns {Promise<SettingsModel>} A promise that resolves to the settings.
     */
    getSettings(force) {
        const deferredObject = new PromiseUtil_1.Deferred();
        try {
            // Use cached settings if available and not forced to fetch
            if (!force && this.settings) {
                logger_1.LogManager.Instance.info('Using already fetched and cached settings');
                deferredObject.resolve(this.settings);
            }
            else {
                // Fetch settings if not cached or forced
                this.fetchSettings(force).then((settings) => {
                    deferredObject.resolve(settings);
                });
            }
        }
        catch (err) {
            logger_1.LogManager.Instance.error('Failed to fetch settings. Error: ' + err);
            deferredObject.resolve({});
        }
        return deferredObject.promise;
    }
    /**
     * Sets the storage connector based on the provided storage options.
     * @returns {this} The instance of this builder.
     */
    setStorage() {
        if (this.options.storage) {
            // Attach the storage connector from options
            this.storage = storage_1.Storage.Instance.attachConnector(this.options.storage);
        }
        else if (typeof process === 'undefined' && typeof window !== 'undefined' && window.localStorage) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { BrowserStorageConnector } = require('./packages/storage/connectors/BrowserStorageConnector');
            // Pass clientStorage config to BrowserStorageConnector
            this.storage = storage_1.Storage.Instance.attachConnector(new BrowserStorageConnector({
                ...this.options.clientStorage,
                alwaysUseCachedSettings: this.options.clientStorage?.alwaysUseCachedSettings,
                ttl: this.options.clientStorage?.ttl,
            }));
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
                service: this.options?.clientStorage?.provider === sessionStorage ? `Session Storage` : `Local Storage`,
            }));
        }
        else {
            // Set storage to null if no storage options provided
            this.storage = null;
        }
        return this;
    }
    /**
     * Sets the settings manager with the provided options.
     * @returns {this} The instance of this builder.
     */
    setSettingsService() {
        this.settingFileManager = new SettingsService_1.SettingsService(this.options);
        return this;
    }
    /**
     * Sets the logger with the provided logger options.
     * @returns {this} The instance of this builder.
     */
    setLogger() {
        this.logManager = new logger_1.LogManager(this.options.logger || {});
        logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.SERVICE_INITIALIZED, {
            service: `Logger`,
        }));
        return this;
    }
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
    getRandomUserId() {
        const apiName = 'getRandomUserId';
        try {
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            return (0, UuidUtil_1.getRandomUUID)(this.options.sdkKey);
        }
        catch (err) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.API_THROW_ERROR, {
                apiName,
                err,
            }));
        }
    }
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
    initPolling() {
        const pollInterval = this.options.pollInterval;
        if (pollInterval != null && (0, DataTypeUtil_1.isNumber)(pollInterval) && pollInterval >= 1000) {
            this.isValidPollIntervalPassedFromInit = true;
            this.checkAndPoll();
        }
        else if (pollInterval != null) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.INIT_OPTIONS_INVALID, {
                key: 'pollInterval',
                correctType: 'number >= 1000',
            }));
        }
        return this;
    }
    /**
     * Initializes usage statistics for the SDK.
     * @returns {this} The instance of this builder.
     */
    initUsageStats() {
        if (this.options.isUsageStatsDisabled) {
            return this;
        }
        UsageStatsUtil_1.UsageStatsUtil.getInstance().setUsageStats(this.options);
        return this;
    }
    /**
     * Builds a new VWOClient instance with the provided settings.
     * @param {SettingsModel} settings - The settings for the VWOClient.
     * @returns {VWOClient} The new VWOClient instance.
     */
    build(settings) {
        this.vwoInstance = new VWOClient_1.VWOClient(settings, this.options);
        this.updatePollIntervalAndCheckAndPoll(settings, true);
        return this.vwoInstance;
    }
    /**
     * Checks and polls for settings updates at the provided interval.
     */
    checkAndPoll() {
        const poll = async () => {
            try {
                const latestSettings = await this.getSettings(true);
                if (latestSettings &&
                    Object.keys(latestSettings).length > 0 &&
                    JSON.stringify(latestSettings) !== JSON.stringify(this.originalSettings)) {
                    this.originalSettings = latestSettings;
                    const clonedSettings = (0, FunctionUtil_1.cloneObject)(latestSettings);
                    logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_SET_SETTINGS);
                    (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(clonedSettings, this.vwoInstance);
                    // Reinitialize the poll_interval value if there is a change in settings
                    this.updatePollIntervalAndCheckAndPoll(latestSettings, false);
                }
                else if (latestSettings) {
                    logger_1.LogManager.Instance.info(log_messages_1.InfoLogMessagesEnum.POLLING_NO_CHANGE_IN_SETTINGS);
                }
            }
            catch (ex) {
                logger_1.LogManager.Instance.error(log_messages_1.ErrorLogMessagesEnum.POLLING_FETCH_SETTINGS_FAILED + ': ' + ex);
            }
            finally {
                // Schedule next poll
                const interval = this.options.pollInterval ?? constants_1.Constants.POLLING_INTERVAL;
                setTimeout(poll, interval);
            }
        };
        // Start the polling after the given interval
        const interval = this.options.pollInterval ?? constants_1.Constants.POLLING_INTERVAL;
        setTimeout(poll, interval);
    }
    updatePollIntervalAndCheckAndPoll(settings, shouldCheckAndPoll) {
        if (!this.isValidPollIntervalPassedFromInit) {
            const pollInterval = settings?.pollInterval ?? constants_1.Constants.POLLING_INTERVAL;
            logger_1.LogManager.Instance.debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.USING_POLL_INTERVAL_FROM_SETTINGS, {
                source: settings?.pollInterval ? 'settings' : 'default',
                pollInterval: pollInterval.toString(),
            }));
            this.options.pollInterval = pollInterval;
        }
        if (shouldCheckAndPoll && !this.isValidPollIntervalPassedFromInit) {
            this.checkAndPoll();
        }
    }
}
exports.VWOBuilder = VWOBuilder;
//# sourceMappingURL=VWOBuilder.js.map