import { Flag, FlagApi } from './api/GetFlag.js';
import { GetFlagsApi } from './api/GetFlags.js';
import { SetAttributeApi } from './api/SetAttribute.js';
import { TrackApi } from './api/TrackEvent.js';
import { DebugLogMessagesEnum, InfoLogMessagesEnum, ErrorLogMessagesEnum } from './enums/log-messages/index.js';
import { SettingsSchema } from './models/schemas/SettingsSchemaValidation.js';
import { ContextModel } from './models/user/ContextModel.js';
import { getType, isObject, isString, isBoolean, isNumber } from './utils/DataTypeUtil.js';
import { buildMessage } from './utils/LogMessageUtil.js';
import { Deferred } from './utils/PromiseUtil.js';
import { setSettingsAndAddCampaignsToRules } from './utils/SettingsUtil.js';
import { VariationModel } from './models/campaign/VariationModel.js';
import { ApiEnum } from './enums/ApiEnum.js';
import { AliasingUtil } from './utils/AliasingUtil.js';
import { getUserId } from './utils/UserIdUtil.js';
import { isArray } from './utils/DataTypeUtil.js';
import { getCurrentUnixTimestamp, getFormattedErrorMessage } from './utils/FunctionUtil.js';
import { sendSdkInitEvent, sendSDKUsageStatsEvent } from './utils/SdkInitAndUsageStatsUtil.js';
import { UsageStatsUtil } from './utils/UsageStatsUtil.js';
import { StorageService } from './services/StorageService.js';
import { getUUID, isWebUuid } from './utils/UuidUtil.js';
import { SDKMetaUtil } from './utils/SDKMetaUtil.js';
import { sendPanicCollectHeartbeatRequest } from './utils/NetworkUtil.js';
import { EventEnum } from './enums/EventEnum.js';
import { SettingsControlApplyMode } from './services/PanicModeForcedRefreshControlService.js';
export class WingifyClient {
    /**
     * Constructor for the WingifyClient class.
     * @param settings - The settings to initialize the client with.
     * @param options - The options to initialize the client with.
     * @param logManager - The log manager to use for logging.
     * @param settingsService - The settings service to use for fetching settings.
     * @param networkManager - The network manager to use for making network requests.
     * @param storage - The storage to use for storing data.
     * @param batchEventsQueue - The batch events queue to use for batching events.
     */
    constructor(settings, options, serviceContainer) {
        this.isShutdown = false;
        try {
            this.options = options;
            this.serviceContainer = serviceContainer;
            const normalizedSettings = this.serviceContainer.getSettingsService().normalizeSettings(settings);
            this.isSettingsValid = new SettingsSchema().isSettingsValid(normalizedSettings);
            this.isAliasingEnabled = options.isAliasingEnabled || false;
            if (this.isSettingsValid && !this.serviceContainer.getSettingsService().isSettingsProvidedInInit) {
                this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
            }
            else if (!this.isSettingsValid && this.options.settings) {
                this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.INIT });
            }
            setSettingsAndAddCampaignsToRules(normalizedSettings, this, this.serviceContainer.getLogManager());
            this.serviceContainer.setSettings(this.settings);
            this.serviceContainer.setOriginalSettingsDocument(this.originalSettings);
            this.serviceContainer.injectServiceContainer(this.serviceContainer);
            this.serviceContainer.setShouldWaitForTrackingCalls(this.options.shouldWaitForTrackingCalls || false);
            this.serviceContainer.setForceRefreshHandler((isRefreshFromPanicClear) => this.updateSettings(undefined, true, isRefreshFromPanicClear, SettingsControlApplyMode.POST_PING_FETCH));
            this.handleSettingsControlFlags(normalizedSettings, SettingsControlApplyMode.APPLY);
            this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.CLIENT_INITIALIZED));
            this.wingifyClientInstance = this;
            const usageStatsUtil = new UsageStatsUtil(this.options);
            this.sendSdkInitAndUsageStatsEvents(usageStatsUtil);
            // initialize the sdk meta util
            new SDKMetaUtil(this.options);
            return this;
        }
        catch (err) {
            this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                apiName: ApiEnum.INIT,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.INIT }, false);
        }
    }
    /**
     * Sends the SDK init event and usage stats event
     * @param usageStatsUtil - The usage stats util to use for sending the usage stats event
     */
    async sendSdkInitAndUsageStatsEvents(usageStatsUtil) {
        try {
            // get settings fetch time
            let settingsFetchTime = this.serviceContainer.getSettingsService().settingsFetchTime;
            if (this.serviceContainer.getSettingsService().isSettingsProvidedInInit) {
                // if settings are provided in init, then settings fetch time is 0
                settingsFetchTime = 0;
            }
            // get sdk init time
            const sdkInitTime = Date.now() - this.serviceContainer.getSettingsService().startTimeForInit;
            const internalEventsThrottleService = this.serviceContainer.getInternalEventsThrottleService();
            const isPanicModeActivated = this.serviceContainer
                .getPanicModeForcedRefreshControlService()
                .isPanicModeActivated();
            if (this.isSettingsValid && internalEventsThrottleService.shouldSendSdkInitEvent(this.originalSettings)) {
                if (isPanicModeActivated) {
                    this.serviceContainer
                        .getLogManager()
                        .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: EventEnum.INIT_CALLED }));
                }
                else if (this.options.shouldWaitForTrackingCalls) {
                    await sendSdkInitEvent(this.serviceContainer);
                }
                else {
                    sendSdkInitEvent(this.serviceContainer);
                }
            }
            const usageStatsAccountId = this.originalSettings?.usageStatsAccountId;
            if (usageStatsAccountId &&
                internalEventsThrottleService.shouldSendUsageStatsEvent(this.originalSettings) &&
                !isPanicModeActivated) {
                if (this.options.shouldWaitForTrackingCalls) {
                    await sendSDKUsageStatsEvent(usageStatsAccountId, this.serviceContainer, usageStatsUtil, settingsFetchTime, sdkInitTime);
                }
                else {
                    sendSDKUsageStatsEvent(usageStatsAccountId, this.serviceContainer, usageStatsUtil, settingsFetchTime, sdkInitTime);
                }
            }
        }
        catch (err) {
            this.serviceContainer
                .getLogManager()
                .error(buildMessage(ErrorLogMessagesEnum.SDK_INIT_EVENT_FAILED, { err: getFormattedErrorMessage(err) }));
        }
    }
    /**
     * Retrieves the value of a feature flag for a given feature key and context.
     * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
     *
     * @param {string} featureKey - The key of the feature to retrieve.
     * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
     * @returns {Promise<Flag>} - A promise that resolves to the feature flag value.
     */
    async getFlag(featureKey, context) {
        const apiName = ApiEnum.GET_FLAG;
        const deferredObject = new Deferred();
        let uuid;
        try {
            this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            // get uuid from context
            uuid = this.getUUIDFromContext(context, apiName);
        }
        catch (err) {
            this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                apiName,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.GET_FLAG });
            // return error return schema with null uuid
            deferredObject.resolve(new Flag(false, context?.sessionId ?? getCurrentUnixTimestamp(), null, new VariationModel()));
            return deferredObject.promise;
        }
        const errorReturnSchema = new Flag(false, context?.sessionId ?? getCurrentUnixTimestamp(), uuid, new VariationModel());
        try {
            // Validate featureKey is a string
            if (!isString(featureKey)) {
                this.serviceContainer.getLogManager().errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'featureKey',
                    type: getType(featureKey),
                    correctType: 'string',
                }, { an: ApiEnum.GET_FLAG }, false);
                throw new TypeError('TypeError: featureKey should be a string, got ' + getType(featureKey));
            }
            // Validate settings are loaded and valid
            if (!this.isSettingsValid) {
                this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.GET_FLAG });
                throw new Error('TypeError: Invalid Settings');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
                this.serviceContainer.getLogManager().errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum.GET_FLAG }, false);
                throw new TypeError('TypeError: Invalid context');
            }
            if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
                this.serviceContainer
                    .getLogManager()
                    .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
                const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
                    id: String(context.id),
                    uuid,
                    sessionId: isNumber(context.sessionId) ? context.sessionId : undefined,
                });
                if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
                    await heartbeat.catch(() => undefined);
                }
                else {
                    void heartbeat.catch(() => undefined);
                }
                deferredObject.resolve(errorReturnSchema);
                return deferredObject.promise;
            }
            //getUserId from gateway service
            const userId = await getUserId(context.id, this.isAliasingEnabled, this.serviceContainer);
            // Create a copy of context to avoid modifying the original
            const contextCopy = { ...context };
            contextCopy.id = userId;
            // check if the userId changed after aliasing, by comparing the original userId with the new userId
            if (contextCopy.id !== context.id) {
                // if the userId changed, then we need to generate a new uuid
                contextCopy.uuid = this.getUUIDFromContext(contextCopy, apiName);
            }
            else {
                // if the userId didn't change, then we can use the existing uuid
                contextCopy.uuid = uuid;
            }
            // Validate bucketingSeed: must be a non-empty, non-whitespace-only string
            if ('bucketingSeed' in contextCopy) {
                const seed = contextCopy.bucketingSeed;
                if (seed === undefined ||
                    seed === null ||
                    isNumber(seed) ||
                    isObject(seed) ||
                    isArray(seed) ||
                    (isString(seed) && seed.trim().length === 0)) {
                    this.serviceContainer.getLogManager().errorLog('INVALID_BUCKETING_SEED', {
                        apiName,
                        type: getType(seed),
                    }, { an: ApiEnum.GET_FLAG }, false);
                    delete contextCopy.bucketingSeed;
                }
            }
            const contextModel = new ContextModel().modelFromDictionary(contextCopy, this.options);
            FlagApi.get(featureKey, contextModel, this.serviceContainer)
                .then((data) => {
                deferredObject.resolve(data);
            })
                .catch(() => {
                deferredObject.resolve(errorReturnSchema);
            });
        }
        catch (err) {
            this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                apiName,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.GET_FLAG });
            deferredObject.resolve(errorReturnSchema);
        }
        return deferredObject.promise;
    }
    /**
     * Evaluates multiple feature flags for a user and returns them keyed by feature key.
     *
     * @param flagNames - Feature keys to evaluate, or null/empty to evaluate all settings features.
     * @param context - User context; must include a valid user id.
     * @returns Evaluated flags keyed by feature key.
     */
    async getFlags(flagNames, context, shouldSendTrackingCalls = true) {
        const apiName = ApiEnum.GET_FLAGS;
        try {
            this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            const uuid = this.getUUIDFromContext(context, apiName);
            if (!this.isSettingsValid) {
                this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: apiName }, false);
                throw new Error('TypeError: Invalid Settings');
            }
            if (!context || !context.id) {
                this.serviceContainer.getLogManager().errorLog('INVALID_CONTEXT_PASSED', {}, { an: apiName }, false);
                throw new TypeError('TypeError: Invalid context');
            }
            // check if panic mode is activated
            if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
                // if panic mode is activated log that the api is blocked by panic mode
                this.serviceContainer
                    .getLogManager()
                    .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
                // send heartbeat to the server to collect the panic mode signal to check if the panic mode is still activated
                const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
                    id: String(context.id),
                    uuid,
                    sessionId: isNumber(context.sessionId) ? context.sessionId : undefined,
                });
                // if the shouldWaitForTrackingCalls is true, then we need to wait for the heartbeat to be resolved
                if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
                    await heartbeat.catch(() => undefined);
                }
                else {
                    void heartbeat.catch(() => undefined);
                }
                // return the disabled flags
                return this.buildDisabledFlags(flagNames, context);
            }
            const userId = await getUserId(context.id, this.isAliasingEnabled, this.serviceContainer);
            const baseContextCopy = { ...context };
            baseContextCopy.id = userId;
            if (baseContextCopy.id !== context.id) {
                baseContextCopy.uuid = this.getUUIDFromContext(baseContextCopy, apiName);
            }
            else {
                baseContextCopy.uuid = uuid;
            }
            if ('bucketingSeed' in baseContextCopy) {
                const seed = baseContextCopy.bucketingSeed;
                if (seed === undefined ||
                    seed === null ||
                    isNumber(seed) ||
                    isObject(seed) ||
                    isArray(seed) ||
                    (isString(seed) && seed.trim().length === 0)) {
                    this.serviceContainer.getLogManager().errorLog('INVALID_BUCKETING_SEED', {
                        apiName,
                        type: getType(seed),
                    }, { an: apiName }, false);
                    delete baseContextCopy.bucketingSeed;
                }
            }
            return await GetFlagsApi.get(flagNames, baseContextCopy, this.serviceContainer, this.options, shouldSendTrackingCalls);
        }
        catch (err) {
            this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                apiName,
                err: getFormattedErrorMessage(err),
            }, { an: apiName });
            return this.buildDisabledFlags(flagNames, context);
        }
    }
    /**
     * Builds disabled flags for the requested keys after validation or execution failure.
     *
     * @param flagNames - Requested feature keys from the caller.
     * @param context - Raw caller context used to populate flag metadata.
     * @returns Disabled flags keyed by requested feature key.
     */
    buildDisabledFlags(flagNames, context) {
        const keys = flagNames?.filter((key) => key?.trim()) ?? [];
        if (!keys.length) {
            return {};
        }
        const sessionId = context?.sessionId ?? getCurrentUnixTimestamp();
        const uuid = context?.uuid ?? '';
        const disabledFlag = new Flag(false, sessionId, uuid, new VariationModel());
        return Object.fromEntries(keys.map((key) => [key, disabledFlag]));
    }
    /**
     * Tracks an event with specified properties and context.
     * This method validates the types of the inputs and ensures the settings and user context are valid before proceeding.
     *
     * @param {string} eventName - The name of the event to track.
     * @param {ContextModel} context - The context in which the event is being tracked, must include a valid user ID.
     * @param {Record<string, dynamic>} eventProperties - The properties associated with the event.
     * @returns {Promise<Record<string, boolean>>} - A promise that resolves to the result of the tracking operation.
     */
    async trackEvent(eventName, context, eventProperties = {}) {
        const apiName = ApiEnum.TRACK_EVENT;
        const deferredObject = new Deferred();
        try {
            // Log the API call
            this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            // Validate eventName is a string
            if (!isString(eventName)) {
                this.serviceContainer.getLogManager().errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'eventName',
                    type: getType(eventName),
                    correctType: 'string',
                }, { an: ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: Event-name should be a string, got ' + getType(eventName));
            }
            // Validate eventProperties is an object
            if (!isObject(eventProperties)) {
                this.serviceContainer.getLogManager().errorLog('INVALID_PARAM', {
                    apiName,
                    key: 'eventProperties',
                    type: getType(eventProperties),
                    correctType: 'object',
                }, { an: ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: eventProperties should be an object, got ' + getType(eventProperties));
            }
            // Validate settings are loaded and valid
            if (!this.isSettingsValid) {
                this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.TRACK_EVENT });
                throw new Error('TypeError: Invalid Settings');
            }
            // Validate user ID is present in context
            if (!context || !context.id) {
                this.serviceContainer
                    .getLogManager()
                    .errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum.TRACK_EVENT }, false);
                throw new TypeError('TypeError: Invalid context');
            }
            //send heartbeat if panic mode is activated and early
            if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
                this.serviceContainer
                    .getLogManager()
                    .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
                const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
                    id: String(context.id),
                    uuid: this.getUUIDFromContext(context, apiName),
                    sessionId: isNumber(context.sessionId) ? context.sessionId : undefined,
                });
                if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
                    await heartbeat.catch(() => undefined);
                }
                else {
                    void heartbeat.catch(() => undefined);
                }
                deferredObject.resolve({ [eventName]: false });
                return deferredObject.promise;
            }
            //getUserId from gateway service
            const userId = await getUserId(context.id, this.isAliasingEnabled, this.serviceContainer);
            // Create a copy of context to avoid modifying the original
            const contextCopy = { ...context };
            contextCopy.id = userId;
            // set uuid in the context copy
            contextCopy.uuid = this.getUUIDFromContext(contextCopy, apiName);
            const contextModel = new ContextModel().modelFromDictionary(contextCopy, this.options);
            // Proceed with tracking the event
            new TrackApi()
                .track(this.serviceContainer, eventName, contextModel, eventProperties)
                .then((data) => {
                deferredObject.resolve(data);
            })
                .catch(() => {
                deferredObject.resolve({ [eventName]: false });
            });
        }
        catch (err) {
            // Log any errors encountered during the operation
            this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                apiName,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.TRACK_EVENT });
            deferredObject.resolve({ [eventName]: false });
        }
        return deferredObject.promise;
    }
    /**
     * Sets an attribute or multiple attributes for a user in the provided context.
     * This method validates the types of the inputs before proceeding with the API call.
     * There are two cases handled:
     * 1. When attributes are passed as a map (key-value pairs).
     * 2. When a single attribute (key-value) is passed.
     *
     * @param {string | Record<string, boolean | string | number>} attributeOrAttributes - Either a single attribute key (string) and value (boolean | string | number),
     *                                                                                        or a map of attributes with keys and values (boolean | string | number).
     * @param {boolean | string | number | Record<string, any>} [attributeValueOrContext] - The value for the attribute in case of a single attribute, or the context when multiple attributes are passed.
     * @param {Record<string, any>} [context] - The context which must include a valid user ID. This is required if multiple attributes are passed.
     */
    async setAttribute(attributeOrAttributes, attributeValueOrContext, context) {
        const apiName = ApiEnum.SET_ATTRIBUTE;
        try {
            if (isObject(attributeOrAttributes)) {
                // Log the API call
                this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                    apiName,
                }));
                if (Object.entries(attributeOrAttributes).length < 1) {
                    throw new TypeError('TypeError: Attributes should be an object containing at least 1 key-value pair');
                }
                // Case where multiple attributes are passed as a map
                const attributes = attributeOrAttributes; // Type assertion
                // Validate attributes is an object
                if (!isObject(attributes)) {
                    throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
                }
                // Validate that each attribute value is of a supported type
                Object.entries(attributes).forEach(([key, value]) => {
                    if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
                        throw new TypeError(`Invalid attribute type for key "${key}". Expected boolean, string or number, but got ${getType(value)}`);
                    }
                    // Reject arrays and objects explicitly
                    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                        throw new TypeError(`Invalid attribute value for key "${key}". Arrays and objects are not supported.`);
                    }
                });
                // If we have only two arguments (attributeMap and context)
                if (!context && attributeValueOrContext) {
                    context = attributeValueOrContext; // Assign context explicitly
                }
                // Validate user ID is present in context
                if (!context || !context.id) {
                    this.serviceContainer
                        .getLogManager()
                        .errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum.SET_ATTRIBUTE }, false);
                    throw new TypeError('TypeError: Invalid context');
                }
                //send heartbeat if panic mode is activated and early exit
                if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
                    this.serviceContainer
                        .getLogManager()
                        .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
                    const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
                        id: String(context.id),
                        uuid: this.getUUIDFromContext(context, apiName),
                        sessionId: isNumber(context.sessionId) ? context.sessionId : undefined,
                    });
                    if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
                        await heartbeat.catch(() => undefined);
                    }
                    else {
                        void heartbeat.catch(() => undefined);
                    }
                    return;
                }
                //getUserId from gateway service
                const userId = await getUserId(context.id, this.isAliasingEnabled, this.serviceContainer);
                // Create a copy of context to avoid modifying the original
                const contextCopy = { ...context };
                contextCopy.id = userId;
                // set uuid in the context copy
                contextCopy.uuid = this.getUUIDFromContext(contextCopy, apiName);
                const contextModel = new ContextModel().modelFromDictionary(contextCopy, this.options);
                // Proceed with setting the attributes if validation is successful
                await new SetAttributeApi().setAttribute(this.serviceContainer, attributes, contextModel);
            }
            else {
                // Case where a single attribute (key-value) is passed
                const attributeKey = attributeOrAttributes;
                const attributeValue = attributeValueOrContext;
                // Validate attributeKey is a string
                if (!isString(attributeKey)) {
                    throw new TypeError('attributeKey should be a string');
                }
                // Validate attributeValue is of valid type
                if (!isBoolean(attributeValue) && !isString(attributeValue) && !isNumber(attributeValue)) {
                    throw new TypeError('attributeValue should be a boolean, string, or number');
                }
                // Validate user ID is present in context
                if (!context || !context.id) {
                    throw new TypeError('Invalid context');
                }
                //send heartbeat if panic mode is activated and early exit
                if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
                    this.serviceContainer
                        .getLogManager()
                        .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
                    const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
                        id: String(context.id),
                        uuid: this.getUUIDFromContext(context, apiName),
                        sessionId: isNumber(context.sessionId) ? context.sessionId : undefined,
                    });
                    if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
                        await heartbeat.catch(() => undefined);
                    }
                    else {
                        void heartbeat.catch(() => undefined);
                    }
                    return;
                }
                //getUserId from gateway service
                const userId = await getUserId(context.id, this.isAliasingEnabled, this.serviceContainer);
                // Create a copy of context to avoid modifying the original
                const contextCopy = { ...context };
                contextCopy.id = userId;
                const contextModel = new ContextModel().modelFromDictionary(contextCopy, this.options);
                // Create a map from the single attribute key-value pair
                const attributeMap = { [attributeKey]: attributeValue };
                // Proceed with setting the attribute map if validation is successful
                await new SetAttributeApi().setAttribute(this.serviceContainer, attributeMap, contextModel);
            }
        }
        catch (err) {
            this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                apiName,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.SET_ATTRIBUTE });
        }
    }
    /**
     * Updates the settings by fetching the latest settings from the Wingify server.
     * @param settings - The settings to update.
     * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
     * @returns Promise<void>
     */
    async updateSettings(settings, isViaWebhook = true, isRefreshFromPanicClear = false, controlApplyMode) {
        const apiName = ApiEnum.UPDATE_SETTINGS;
        try {
            this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.API_CALLED, { apiName }));
            // fetch settings from the server or use the provided settings file if it's not empty
            const settingsToUpdate = !settings || Object.keys(settings).length === 0
                ? await this.serviceContainer.getSettingsService().fetchSettings(isViaWebhook, apiName)
                : settings;
            const normalizedSettings = this.serviceContainer.getSettingsService().normalizeSettings(settingsToUpdate);
            // validate settings schema
            if (!new SettingsSchema().isSettingsValid(normalizedSettings)) {
                throw new Error('TypeError: Invalid Settings schema');
            }
            // TTS-3135: Check if settings snapshot is stale BEFORE applying campaigns
            // Prevents polling from applying older cached settings after force-refresh fetched newer ones
            const panicService = this.serviceContainer.getPanicModeForcedRefreshControlService();
            if (!panicService.shouldApplySettingsSnapshot(normalizedSettings)) {
                this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SETTINGS_UPDATE_SKIPPED_STALE, {
                    timestamp: normalizedSettings?.lastUpdatedOn ?? normalizedSettings?.version,
                }));
                return; // Skip applying stale settings
            }
            // set the settings on the client instance
            setSettingsAndAddCampaignsToRules(normalizedSettings, this.wingifyClientInstance, this.serviceContainer.getLogManager());
            this.serviceContainer.setSettings(this.wingifyClientInstance.settings);
            this.serviceContainer.setOriginalSettingsDocument(this.wingifyClientInstance.originalSettings);
            this.serviceContainer.injectServiceContainer(this.serviceContainer);
            const resolvedControlApplyMode = controlApplyMode ??
                (settings && Object.keys(settings).length > 0 && !isViaWebhook
                    ? SettingsControlApplyMode.POLLING
                    : SettingsControlApplyMode.APPLY);
            this.handleSettingsControlFlags(normalizedSettings, resolvedControlApplyMode);
            if (!isRefreshFromPanicClear) {
                this.serviceContainer
                    .getLogManager()
                    .info(buildMessage(InfoLogMessagesEnum.SETTINGS_UPDATED, { apiName, isViaWebhook }));
            }
        }
        catch (err) {
            this.serviceContainer.getLogManager().errorLog('UPDATING_CLIENT_INSTANCE_FAILED_WHEN_WEBHOOK_TRIGGERED', {
                apiName,
                isViaWebhook,
                err: getFormattedErrorMessage(err),
            }, { an: ApiEnum.UPDATE_SETTINGS });
        }
    }
    /**
     * Flushes the events manually from the batch events queue
     */
    async flushEvents() {
        const apiName = ApiEnum.FLUSH_EVENTS;
        try {
            this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.API_CALLED, { apiName }));
            if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
                this.serviceContainer
                    .getLogManager()
                    .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
                return { status: 'error', events: [] };
            }
            if (!this.serviceContainer.getBatchEventsQueue()) {
                this.serviceContainer.getLogManager().errorLog('BATCHING_NOT_ENABLED', {}, { an: ApiEnum.FLUSH_EVENTS });
                return { status: 'error', events: [] };
            }
            const promises = [this.serviceContainer.getBatchEventsQueue().flushAndClearTimer()];
            if (this.options?.edgeConfig &&
                Object.keys(this.options.edgeConfig).length > 0 &&
                this.options?.accountId &&
                this.options?.sdkKey) {
                const storageService = new StorageService(this.serviceContainer);
                promises.push(storageService
                    .setFreshSettingsInStorage(parseInt(this.options.accountId), this.options.sdkKey)
                    .catch((error) => {
                    this.serviceContainer
                        .getLogManager()
                        .errorLog('ERROR_STORING_SETTINGS_IN_STORAGE', { err: getFormattedErrorMessage(error) }, { an: ApiEnum.FLUSH_EVENTS });
                    // by returning undefined, we are swallowing the error intentionally to avoid the promise from rejecting
                    return undefined;
                }));
            }
            const [flushResult] = await Promise.all(promises);
            return flushResult;
        }
        catch (err) {
            this.serviceContainer
                .getLogManager()
                .errorLog('EXECUTION_FAILED', { apiName, err: getFormattedErrorMessage(err) }, { an: ApiEnum.FLUSH_EVENTS });
            return { status: 'error', events: [] };
        }
    }
    /**
     * Sets alias for a given user ID
     * @param contextOrUserId - The context containing user ID or the user ID directly
     * @param aliasId - The alias identifier to set
     * @returns Promise<boolean> - Returns true if successful, false otherwise
     */
    async setAlias(contextOrUserId, aliasId) {
        const apiName = ApiEnum.SET_ALIAS;
        try {
            this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.API_CALLED, {
                apiName,
            }));
            if (!this.isAliasingEnabled) {
                this.serviceContainer.getLogManager().errorLog('ALIAS_CALLED_BUT_NOT_PASSED', {}, { an: ApiEnum.SET_ALIAS });
                return false;
            }
            if (!this.serviceContainer.getSettingsService().isGatewayServiceProvided) {
                this.serviceContainer.getLogManager().errorLog('INVALID_GATEWAY_URL', {}, { an: ApiEnum.SET_ALIAS });
                return false;
            }
            if (!aliasId) {
                throw new TypeError('TypeError: Invalid aliasId');
            }
            if (isArray(aliasId)) {
                throw new TypeError('TypeError: aliasId cannot be an array');
            }
            // trim aliasId before going forward
            aliasId = aliasId.trim();
            let userId;
            const rawUserId = typeof contextOrUserId === 'string' ? contextOrUserId.trim() : contextOrUserId.id.trim();
            //send heartbeat if panic mode is activated and early exit
            if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
                this.serviceContainer
                    .getLogManager()
                    .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
                const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
                    id: rawUserId,
                    uuid: this.getUUIDFromContext(typeof contextOrUserId === 'string' ? { id: rawUserId } : contextOrUserId, apiName),
                    sessionId: undefined,
                });
                if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
                    await heartbeat.catch(() => undefined);
                }
                else {
                    void heartbeat.catch(() => undefined);
                }
                return false;
            }
            if (typeof contextOrUserId === 'string') {
                // trim contextOrUserId before going forward
                contextOrUserId = contextOrUserId.trim();
                // Direct userId provided
                if (contextOrUserId === aliasId) {
                    throw new TypeError('UserId and aliasId cannot be the same.');
                }
                if (!contextOrUserId) {
                    throw new TypeError('TypeError: Invalid userId');
                }
                if (isArray(contextOrUserId)) {
                    throw new TypeError('TypeError: userId cannot be an array');
                }
                userId = contextOrUserId;
            }
            else {
                // Context object provided
                if (!contextOrUserId || !contextOrUserId.id) {
                    throw new TypeError('TypeError: Invalid context');
                }
                if (isArray(contextOrUserId.id)) {
                    throw new TypeError('TypeError: context.id cannot be an array');
                }
                // trim contextOrUserId.id before going forward
                contextOrUserId.id = contextOrUserId.id.trim();
                if (contextOrUserId.id === aliasId) {
                    throw new TypeError('UserId and aliasId cannot be the same.');
                }
                userId = contextOrUserId.id;
            }
            await AliasingUtil.setAlias(userId, aliasId, this.serviceContainer);
            return true;
        }
        catch (error) {
            this.serviceContainer
                .getLogManager()
                .errorLog('EXECUTION_FAILED', { apiName, err: getFormattedErrorMessage(error) }, { an: ApiEnum.SET_ALIAS });
            return false;
        }
    }
    /**
     * Generates a UUID from the context.id
     * @param context - The context to generate the UUID from
     * @param apiName - The name of the API calling this method
     * @returns The UUID generated from the context.id
     */
    getUUIDFromContext(context, apiName) {
        if (this.settings.getIsWebConnectivityEnabled() !== false) {
            // if web connectivity is enabled, check if context.id is a valid web UUID
            if (isWebUuid(context?.id)) {
                // if context.id is a valid web UUID, set it as uuid
                this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.WEB_UUID_FOUND, {
                    apiName,
                    uuid: context.id,
                }));
                return context.id;
            }
            else {
                // if context?.useIdForWeb is true and context.id is not a valid web UUID, throw error
                if (context?.useIdForWeb === true) {
                    throw new Error('UUID passed in context.id is not a valid UUID');
                }
                // if context?.useIdForWeb is false, fallback to server‑side UUID derivation
                return getUUID(context?.id?.toString() ?? `${this.options?.accountId}_${this.options?.sdkKey}`, this.options?.accountId?.toString());
            }
        }
        else {
            // if web connectivity is disabled, fallback to server‑side UUID derivation
            return getUUID(context?.id?.toString() ?? `${this.options?.accountId}_${this.options?.sdkKey}`, this.options?.accountId?.toString());
        }
    }
    /**
     * Shuts down the client: flushes pending batch events (and clears the batch timer) via flushEvents(),
     * then clears the batch queue so no further events are enqueued. Idempotent.
     */
    async shutdown() {
        try {
            this.serviceContainer
                .getLogManager()
                .debug(buildMessage(DebugLogMessagesEnum.API_CALLED, { apiName: ApiEnum.SHUTDOWN }));
            // check if the client is already shutdown
            if (this.isShutdown) {
                this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SHUTDOWN_ALREADY_COMPLETED));
                return;
            }
            // set the isShutdown flag to true to avoid multiple calls to shutdown
            this.isShutdown = true;
            this.serviceContainer.stopPolling();
            if (this.serviceContainer.getBatchEventsQueue()) {
                await this.flushEvents();
                this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SHUTDOWN_COMPLETED_WITH_FLUSH));
                this.serviceContainer.setBatchEventsQueue(null);
            }
            else {
                this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SHUTDOWN_COMPLETED_WITHOUT_FLUSH));
            }
        }
        catch (err) {
            this.serviceContainer
                .getLogManager()
                .errorLog('EXECUTION_FAILED', { apiName: ApiEnum.SHUTDOWN, err: getFormattedErrorMessage(err) }, { an: ApiEnum.SHUTDOWN });
        }
    }
    /**
     * Applies or defers sdkMetaInfo panic / refresh. Polling confirms panic on/off via collector ping
     * (stale panic rejected; logs only after ping). Force-refresh is not confirmed via ping from polling.
     *
     * @param settings - Normalized settings JSON (must include `lastUpdatedOn` for snapshot detection).
     * @param mode - How this snapshot was obtained.
     * @returns void
     */
    handleSettingsControlFlags(settings, mode = SettingsControlApplyMode.APPLY) {
        const panicModeForcedRefreshControl = this.serviceContainer.getPanicModeForcedRefreshControlService();
        const settingsSnapshotControlOutcome = panicModeForcedRefreshControl.applySettingsControl(settings, mode);
        if (settingsSnapshotControlOutcome.needsCollectPingConfirmation) {
            void this.confirmControlViaCollectPing();
        }
        if (!settingsSnapshotControlOutcome.shouldTriggerForceRefresh || !panicModeForcedRefreshControl.tryStartRefresh()) {
            return;
        }
        this.updateSettings(undefined, true, settingsSnapshotControlOutcome.isRefreshFromPanicClear, SettingsControlApplyMode.POST_PING_FETCH).finally(() => {
            panicModeForcedRefreshControl.finishRefresh(settingsSnapshotControlOutcome.isRefreshFromPanicClear);
        });
    }
    /**
     * Confirms panic with a control ping. DaCDN response is the source of truth.
     */
    async confirmControlViaCollectPing() {
        const panicModeForcedRefreshControl = this.serviceContainer.getPanicModeForcedRefreshControlService();
        if (!panicModeForcedRefreshControl.tryStartPanicClearConfirmation()) {
            return;
        }
        try {
            const settingsService = this.serviceContainer.getSettingsService();
            const userId = `${settingsService.accountId}_${settingsService.sdkKey}`;
            const uuid = getUUID(`${settingsService.accountId}_${settingsService.sdkKey}`, String(settingsService.accountId));
            await sendPanicCollectHeartbeatRequest(this.serviceContainer, { id: userId, uuid });
        }
        catch {
            // Fail-safe: keep current latch when confirmation ping fails.
        }
        finally {
            panicModeForcedRefreshControl.finishPanicClearConfirmation();
        }
    }
}
//# sourceMappingURL=WingifyClient.js.map