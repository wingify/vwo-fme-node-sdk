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
exports.WingifyClient = void 0;
var GetFlag_1 = require("./api/GetFlag");
var GetFlags_1 = require("./api/GetFlags");
var SetAttribute_1 = require("./api/SetAttribute");
var TrackEvent_1 = require("./api/TrackEvent");
var log_messages_1 = require("./enums/log-messages");
var SettingsSchemaValidation_1 = require("./models/schemas/SettingsSchemaValidation");
var ContextModel_1 = require("./models/user/ContextModel");
var DataTypeUtil_1 = require("./utils/DataTypeUtil");
var LogMessageUtil_1 = require("./utils/LogMessageUtil");
var PromiseUtil_1 = require("./utils/PromiseUtil");
var SettingsUtil_1 = require("./utils/SettingsUtil");
var VariationModel_1 = require("./models/campaign/VariationModel");
var ApiEnum_1 = require("./enums/ApiEnum");
var AliasingUtil_1 = require("./utils/AliasingUtil");
var UserIdUtil_1 = require("./utils/UserIdUtil");
var DataTypeUtil_2 = require("./utils/DataTypeUtil");
var FunctionUtil_1 = require("./utils/FunctionUtil");
var SdkInitAndUsageStatsUtil_1 = require("./utils/SdkInitAndUsageStatsUtil");
var UsageStatsUtil_1 = require("./utils/UsageStatsUtil");
var StorageService_1 = require("./services/StorageService");
var UuidUtil_1 = require("./utils/UuidUtil");
var SDKMetaUtil_1 = require("./utils/SDKMetaUtil");
var NetworkUtil_1 = require("./utils/NetworkUtil");
var EventEnum_1 = require("./enums/EventEnum");
var PanicModeForcedRefreshControlService_1 = require("./services/PanicModeForcedRefreshControlService");
var WingifyClient = /** @class */ (function () {
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
    function WingifyClient(settings, options, serviceContainer) {
        var _this = this;
        this.isShutdown = false;
        try {
            this.options = options;
            this.serviceContainer = serviceContainer;
            var normalizedSettings = this.serviceContainer.getSettingsService().normalizeSettings(settings);
            this.isSettingsValid = new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings);
            this.isAliasingEnabled = options.isAliasingEnabled || false;
            if (this.isSettingsValid && !this.serviceContainer.getSettingsService().isSettingsProvidedInInit) {
                this.serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
            }
            else if (!this.isSettingsValid && this.options.settings) {
                this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.INIT });
            }
            (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(normalizedSettings, this, this.serviceContainer.getLogManager());
            this.serviceContainer.setSettings(this.settings);
            this.serviceContainer.setOriginalSettingsDocument(this.originalSettings);
            this.serviceContainer.injectServiceContainer(this.serviceContainer);
            this.serviceContainer.setShouldWaitForTrackingCalls(this.options.shouldWaitForTrackingCalls || false);
            this.serviceContainer.setForceRefreshHandler(function (isRefreshFromPanicClear) {
                return _this.updateSettings(undefined, true, isRefreshFromPanicClear, PanicModeForcedRefreshControlService_1.SettingsControlApplyMode.POST_PING_FETCH);
            });
            this.handleSettingsControlFlags(normalizedSettings, PanicModeForcedRefreshControlService_1.SettingsControlApplyMode.APPLY);
            this.serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.CLIENT_INITIALIZED));
            this.wingifyClientInstance = this;
            var usageStatsUtil = new UsageStatsUtil_1.UsageStatsUtil(this.options);
            this.sendSdkInitAndUsageStatsEvents(usageStatsUtil);
            // initialize the sdk meta util
            new SDKMetaUtil_1.SDKMetaUtil(this.options);
            return this;
        }
        catch (err) {
            this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                apiName: ApiEnum_1.ApiEnum.INIT,
                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
            }, { an: ApiEnum_1.ApiEnum.INIT }, false);
        }
    }
    /**
     * Sends the SDK init event and usage stats event
     * @param usageStatsUtil - The usage stats util to use for sending the usage stats event
     */
    WingifyClient.prototype.sendSdkInitAndUsageStatsEvents = function (usageStatsUtil) {
        return __awaiter(this, void 0, void 0, function () {
            var settingsFetchTime, sdkInitTime, internalEventsThrottleService, isPanicModeActivated, usageStatsAccountId, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        settingsFetchTime = this.serviceContainer.getSettingsService().settingsFetchTime;
                        if (this.serviceContainer.getSettingsService().isSettingsProvidedInInit) {
                            // if settings are provided in init, then settings fetch time is 0
                            settingsFetchTime = 0;
                        }
                        sdkInitTime = Date.now() - this.serviceContainer.getSettingsService().startTimeForInit;
                        internalEventsThrottleService = this.serviceContainer.getInternalEventsThrottleService();
                        isPanicModeActivated = this.serviceContainer
                            .getPanicModeForcedRefreshControlService()
                            .isPanicModeActivated();
                        if (!(this.isSettingsValid && internalEventsThrottleService.shouldSendSdkInitEvent(this.originalSettings))) return [3 /*break*/, 4];
                        if (!isPanicModeActivated) return [3 /*break*/, 1];
                        this.serviceContainer
                            .getLogManager()
                            .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: EventEnum_1.EventEnum.INIT_CALLED }));
                        return [3 /*break*/, 4];
                    case 1:
                        if (!this.options.shouldWaitForTrackingCalls) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, SdkInitAndUsageStatsUtil_1.sendSdkInitEvent)(this.serviceContainer)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        (0, SdkInitAndUsageStatsUtil_1.sendSdkInitEvent)(this.serviceContainer);
                        _b.label = 4;
                    case 4:
                        usageStatsAccountId = (_a = this.originalSettings) === null || _a === void 0 ? void 0 : _a.usageStatsAccountId;
                        if (!(usageStatsAccountId &&
                            internalEventsThrottleService.shouldSendUsageStatsEvent(this.originalSettings) &&
                            !isPanicModeActivated)) return [3 /*break*/, 7];
                        if (!this.options.shouldWaitForTrackingCalls) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, SdkInitAndUsageStatsUtil_1.sendSDKUsageStatsEvent)(usageStatsAccountId, this.serviceContainer, usageStatsUtil, settingsFetchTime, sdkInitTime)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        (0, SdkInitAndUsageStatsUtil_1.sendSDKUsageStatsEvent)(usageStatsAccountId, this.serviceContainer, usageStatsUtil, settingsFetchTime, sdkInitTime);
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _b.sent();
                        this.serviceContainer
                            .getLogManager()
                            .error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.SDK_INIT_EVENT_FAILED, { err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_1) }));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the value of a feature flag for a given feature key and context.
     * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
     *
     * @param {string} featureKey - The key of the feature to retrieve.
     * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
     * @returns {Promise<Flag>} - A promise that resolves to the feature flag value.
     */
    WingifyClient.prototype.getFlag = function (featureKey, context) {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, deferredObject, uuid, errorReturnSchema, heartbeat, userId, contextCopy, seed, contextModel, err_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.GET_FLAG;
                        deferredObject = new PromiseUtil_1.Deferred();
                        try {
                            this.serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                                apiName: apiName,
                            }));
                            // get uuid from context
                            uuid = this.getUUIDFromContext(context, apiName);
                        }
                        catch (err) {
                            this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                                apiName: apiName,
                                err: (0, FunctionUtil_1.getFormattedErrorMessage)(err),
                            }, { an: ApiEnum_1.ApiEnum.GET_FLAG });
                            // return error return schema with null uuid
                            deferredObject.resolve(new GetFlag_1.Flag(false, (_a = context === null || context === void 0 ? void 0 : context.sessionId) !== null && _a !== void 0 ? _a : (0, FunctionUtil_1.getCurrentUnixTimestamp)(), null, new VariationModel_1.VariationModel()));
                            return [2 /*return*/, deferredObject.promise];
                        }
                        errorReturnSchema = new GetFlag_1.Flag(false, (_b = context === null || context === void 0 ? void 0 : context.sessionId) !== null && _b !== void 0 ? _b : (0, FunctionUtil_1.getCurrentUnixTimestamp)(), uuid, new VariationModel_1.VariationModel());
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        // Validate featureKey is a string
                        if (!(0, DataTypeUtil_1.isString)(featureKey)) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_PARAM', {
                                apiName: apiName,
                                key: 'featureKey',
                                type: (0, DataTypeUtil_1.getType)(featureKey),
                                correctType: 'string',
                            }, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                            throw new TypeError('TypeError: featureKey should be a string, got ' + (0, DataTypeUtil_1.getType)(featureKey));
                        }
                        // Validate settings are loaded and valid
                        if (!this.isSettingsValid) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG });
                            throw new Error('TypeError: Invalid Settings');
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                            throw new TypeError('TypeError: Invalid context');
                        }
                        if (!this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) return [3 /*break*/, 5];
                        this.serviceContainer
                            .getLogManager()
                            .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: apiName }));
                        heartbeat = (0, NetworkUtil_1.sendPanicCollectHeartbeatRequest)(this.serviceContainer, {
                            id: String(context.id),
                            uuid: uuid,
                            sessionId: (0, DataTypeUtil_1.isNumber)(context.sessionId) ? context.sessionId : undefined,
                        });
                        if (!this.serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 3];
                        return [4 /*yield*/, heartbeat.catch(function () { return undefined; })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        void heartbeat.catch(function () { return undefined; });
                        _c.label = 4;
                    case 4:
                        deferredObject.resolve(errorReturnSchema);
                        return [2 /*return*/, deferredObject.promise];
                    case 5: return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled, this.serviceContainer)];
                    case 6:
                        userId = _c.sent();
                        contextCopy = __assign({}, context);
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
                            seed = contextCopy.bucketingSeed;
                            if (seed === undefined ||
                                seed === null ||
                                (0, DataTypeUtil_1.isNumber)(seed) ||
                                (0, DataTypeUtil_1.isObject)(seed) ||
                                (0, DataTypeUtil_2.isArray)(seed) ||
                                ((0, DataTypeUtil_1.isString)(seed) && seed.trim().length === 0)) {
                                this.serviceContainer.getLogManager().errorLog('INVALID_BUCKETING_SEED', {
                                    apiName: apiName,
                                    type: (0, DataTypeUtil_1.getType)(seed),
                                }, { an: ApiEnum_1.ApiEnum.GET_FLAG }, false);
                                delete contextCopy.bucketingSeed;
                            }
                        }
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(contextCopy, this.options);
                        GetFlag_1.FlagApi.get(featureKey, contextModel, this.serviceContainer)
                            .then(function (data) {
                            deferredObject.resolve(data);
                        })
                            .catch(function () {
                            deferredObject.resolve(errorReturnSchema);
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _c.sent();
                        this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                            apiName: apiName,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_2),
                        }, { an: ApiEnum_1.ApiEnum.GET_FLAG });
                        deferredObject.resolve(errorReturnSchema);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
    /**
     * Evaluates multiple feature flags for a user and returns them keyed by feature key.
     *
     * @param flagNames - Feature keys to evaluate, or null/empty to evaluate all settings features.
     * @param context - User context; must include a valid user id.
     * @returns Evaluated flags keyed by feature key.
     */
    WingifyClient.prototype.getFlags = function (flagNames_1, context_1) {
        return __awaiter(this, arguments, void 0, function (flagNames, context, shouldSendTrackingCalls) {
            var apiName, uuid, heartbeat, userId, baseContextCopy, seed, err_3;
            if (shouldSendTrackingCalls === void 0) { shouldSendTrackingCalls = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.GET_FLAGS;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        this.serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        uuid = this.getUUIDFromContext(context, apiName);
                        if (!this.isSettingsValid) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: apiName }, false);
                            throw new Error('TypeError: Invalid Settings');
                        }
                        if (!context || !context.id) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_CONTEXT_PASSED', {}, { an: apiName }, false);
                            throw new TypeError('TypeError: Invalid context');
                        }
                        if (!this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) return [3 /*break*/, 5];
                        // if panic mode is activated log that the api is blocked by panic mode
                        this.serviceContainer
                            .getLogManager()
                            .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: apiName }));
                        heartbeat = (0, NetworkUtil_1.sendPanicCollectHeartbeatRequest)(this.serviceContainer, {
                            id: String(context.id),
                            uuid: uuid,
                            sessionId: (0, DataTypeUtil_1.isNumber)(context.sessionId) ? context.sessionId : undefined,
                        });
                        if (!this.serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 3];
                        return [4 /*yield*/, heartbeat.catch(function () { return undefined; })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        void heartbeat.catch(function () { return undefined; });
                        _a.label = 4;
                    case 4: 
                    // return the disabled flags
                    return [2 /*return*/, this.buildDisabledFlags(flagNames, context)];
                    case 5: return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled, this.serviceContainer)];
                    case 6:
                        userId = _a.sent();
                        baseContextCopy = __assign({}, context);
                        baseContextCopy.id = userId;
                        if (baseContextCopy.id !== context.id) {
                            baseContextCopy.uuid = this.getUUIDFromContext(baseContextCopy, apiName);
                        }
                        else {
                            baseContextCopy.uuid = uuid;
                        }
                        if ('bucketingSeed' in baseContextCopy) {
                            seed = baseContextCopy.bucketingSeed;
                            if (seed === undefined ||
                                seed === null ||
                                (0, DataTypeUtil_1.isNumber)(seed) ||
                                (0, DataTypeUtil_1.isObject)(seed) ||
                                (0, DataTypeUtil_2.isArray)(seed) ||
                                ((0, DataTypeUtil_1.isString)(seed) && seed.trim().length === 0)) {
                                this.serviceContainer.getLogManager().errorLog('INVALID_BUCKETING_SEED', {
                                    apiName: apiName,
                                    type: (0, DataTypeUtil_1.getType)(seed),
                                }, { an: apiName }, false);
                                delete baseContextCopy.bucketingSeed;
                            }
                        }
                        return [4 /*yield*/, GetFlags_1.GetFlagsApi.get(flagNames, baseContextCopy, this.serviceContainer, this.options, shouldSendTrackingCalls)];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8:
                        err_3 = _a.sent();
                        this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                            apiName: apiName,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_3),
                        }, { an: apiName });
                        return [2 /*return*/, this.buildDisabledFlags(flagNames, context)];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Builds disabled flags for the requested keys after validation or execution failure.
     *
     * @param flagNames - Requested feature keys from the caller.
     * @param context - Raw caller context used to populate flag metadata.
     * @returns Disabled flags keyed by requested feature key.
     */
    WingifyClient.prototype.buildDisabledFlags = function (flagNames, context) {
        var _a, _b, _c;
        var keys = (_a = flagNames === null || flagNames === void 0 ? void 0 : flagNames.filter(function (key) { return key === null || key === void 0 ? void 0 : key.trim(); })) !== null && _a !== void 0 ? _a : [];
        if (!keys.length) {
            return {};
        }
        var sessionId = (_b = context === null || context === void 0 ? void 0 : context.sessionId) !== null && _b !== void 0 ? _b : (0, FunctionUtil_1.getCurrentUnixTimestamp)();
        var uuid = (_c = context === null || context === void 0 ? void 0 : context.uuid) !== null && _c !== void 0 ? _c : '';
        var disabledFlag = new GetFlag_1.Flag(false, sessionId, uuid, new VariationModel_1.VariationModel());
        return Object.fromEntries(keys.map(function (key) { return [key, disabledFlag]; }));
    };
    /**
     * Tracks an event with specified properties and context.
     * This method validates the types of the inputs and ensures the settings and user context are valid before proceeding.
     *
     * @param {string} eventName - The name of the event to track.
     * @param {ContextModel} context - The context in which the event is being tracked, must include a valid user ID.
     * @param {Record<string, dynamic>} eventProperties - The properties associated with the event.
     * @returns {Promise<Record<string, boolean>>} - A promise that resolves to the result of the tracking operation.
     */
    WingifyClient.prototype.trackEvent = function (eventName_1, context_1) {
        return __awaiter(this, arguments, void 0, function (eventName, context, eventProperties) {
            var apiName, deferredObject, heartbeat, userId, contextCopy, contextModel, err_4;
            var _a, _b;
            if (eventProperties === void 0) { eventProperties = {}; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.TRACK_EVENT;
                        deferredObject = new PromiseUtil_1.Deferred();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        // Log the API call
                        this.serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        // Validate eventName is a string
                        if (!(0, DataTypeUtil_1.isString)(eventName)) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_PARAM', {
                                apiName: apiName,
                                key: 'eventName',
                                type: (0, DataTypeUtil_1.getType)(eventName),
                                correctType: 'string',
                            }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                            throw new TypeError('TypeError: Event-name should be a string, got ' + (0, DataTypeUtil_1.getType)(eventName));
                        }
                        // Validate eventProperties is an object
                        if (!(0, DataTypeUtil_1.isObject)(eventProperties)) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_PARAM', {
                                apiName: apiName,
                                key: 'eventProperties',
                                type: (0, DataTypeUtil_1.getType)(eventProperties),
                                correctType: 'object',
                            }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                            throw new TypeError('TypeError: eventProperties should be an object, got ' + (0, DataTypeUtil_1.getType)(eventProperties));
                        }
                        // Validate settings are loaded and valid
                        if (!this.isSettingsValid) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum_1.ApiEnum.TRACK_EVENT });
                            throw new Error('TypeError: Invalid Settings');
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            this.serviceContainer
                                .getLogManager()
                                .errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.TRACK_EVENT }, false);
                            throw new TypeError('TypeError: Invalid context');
                        }
                        if (!this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) return [3 /*break*/, 5];
                        this.serviceContainer
                            .getLogManager()
                            .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: apiName }));
                        heartbeat = (0, NetworkUtil_1.sendPanicCollectHeartbeatRequest)(this.serviceContainer, {
                            id: String(context.id),
                            uuid: this.getUUIDFromContext(context, apiName),
                            sessionId: (0, DataTypeUtil_1.isNumber)(context.sessionId) ? context.sessionId : undefined,
                        });
                        if (!this.serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 3];
                        return [4 /*yield*/, heartbeat.catch(function () { return undefined; })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        void heartbeat.catch(function () { return undefined; });
                        _c.label = 4;
                    case 4:
                        deferredObject.resolve((_a = {}, _a[eventName] = false, _a));
                        return [2 /*return*/, deferredObject.promise];
                    case 5: return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled, this.serviceContainer)];
                    case 6:
                        userId = _c.sent();
                        contextCopy = __assign({}, context);
                        contextCopy.id = userId;
                        // set uuid in the context copy
                        contextCopy.uuid = this.getUUIDFromContext(contextCopy, apiName);
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(contextCopy, this.options);
                        // Proceed with tracking the event
                        new TrackEvent_1.TrackApi()
                            .track(this.serviceContainer, eventName, contextModel, eventProperties)
                            .then(function (data) {
                            deferredObject.resolve(data);
                        })
                            .catch(function () {
                            var _a;
                            deferredObject.resolve((_a = {}, _a[eventName] = false, _a));
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        err_4 = _c.sent();
                        // Log any errors encountered during the operation
                        this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                            apiName: apiName,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_4),
                        }, { an: ApiEnum_1.ApiEnum.TRACK_EVENT });
                        deferredObject.resolve((_b = {}, _b[eventName] = false, _b));
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, deferredObject.promise];
                }
            });
        });
    };
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
    WingifyClient.prototype.setAttribute = function (attributeOrAttributes, attributeValueOrContext, context) {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, attributes, heartbeat, userId, contextCopy, contextModel, attributeKey, attributeValue, heartbeat, userId, contextCopy, contextModel, attributeMap, err_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.SET_ATTRIBUTE;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 16, , 17]);
                        if (!(0, DataTypeUtil_1.isObject)(attributeOrAttributes)) return [3 /*break*/, 8];
                        // Log the API call
                        this.serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        if (Object.entries(attributeOrAttributes).length < 1) {
                            throw new TypeError('TypeError: Attributes should be an object containing at least 1 key-value pair');
                        }
                        attributes = attributeOrAttributes;
                        // Validate attributes is an object
                        if (!(0, DataTypeUtil_1.isObject)(attributes)) {
                            throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
                        }
                        // Validate that each attribute value is of a supported type
                        Object.entries(attributes).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
                                throw new TypeError("Invalid attribute type for key \"".concat(key, "\". Expected boolean, string or number, but got ").concat((0, DataTypeUtil_1.getType)(value)));
                            }
                            // Reject arrays and objects explicitly
                            if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                                throw new TypeError("Invalid attribute value for key \"".concat(key, "\". Arrays and objects are not supported."));
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
                                .errorLog('INVALID_CONTEXT_PASSED', {}, { an: ApiEnum_1.ApiEnum.SET_ATTRIBUTE }, false);
                            throw new TypeError('TypeError: Invalid context');
                        }
                        if (!this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) return [3 /*break*/, 5];
                        this.serviceContainer
                            .getLogManager()
                            .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: apiName }));
                        heartbeat = (0, NetworkUtil_1.sendPanicCollectHeartbeatRequest)(this.serviceContainer, {
                            id: String(context.id),
                            uuid: this.getUUIDFromContext(context, apiName),
                            sessionId: (0, DataTypeUtil_1.isNumber)(context.sessionId) ? context.sessionId : undefined,
                        });
                        if (!this.serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 3];
                        return [4 /*yield*/, heartbeat.catch(function () { return undefined; })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        void heartbeat.catch(function () { return undefined; });
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                    case 5: return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled, this.serviceContainer)];
                    case 6:
                        userId = _b.sent();
                        contextCopy = __assign({}, context);
                        contextCopy.id = userId;
                        // set uuid in the context copy
                        contextCopy.uuid = this.getUUIDFromContext(contextCopy, apiName);
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(contextCopy, this.options);
                        // Proceed with setting the attributes if validation is successful
                        return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.serviceContainer, attributes, contextModel)];
                    case 7:
                        // Proceed with setting the attributes if validation is successful
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 8:
                        attributeKey = attributeOrAttributes;
                        attributeValue = attributeValueOrContext;
                        // Validate attributeKey is a string
                        if (!(0, DataTypeUtil_1.isString)(attributeKey)) {
                            throw new TypeError('attributeKey should be a string');
                        }
                        // Validate attributeValue is of valid type
                        if (!(0, DataTypeUtil_1.isBoolean)(attributeValue) && !(0, DataTypeUtil_1.isString)(attributeValue) && !(0, DataTypeUtil_1.isNumber)(attributeValue)) {
                            throw new TypeError('attributeValue should be a boolean, string, or number');
                        }
                        // Validate user ID is present in context
                        if (!context || !context.id) {
                            throw new TypeError('Invalid context');
                        }
                        if (!this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) return [3 /*break*/, 12];
                        this.serviceContainer
                            .getLogManager()
                            .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: apiName }));
                        heartbeat = (0, NetworkUtil_1.sendPanicCollectHeartbeatRequest)(this.serviceContainer, {
                            id: String(context.id),
                            uuid: this.getUUIDFromContext(context, apiName),
                            sessionId: (0, DataTypeUtil_1.isNumber)(context.sessionId) ? context.sessionId : undefined,
                        });
                        if (!this.serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 10];
                        return [4 /*yield*/, heartbeat.catch(function () { return undefined; })];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        void heartbeat.catch(function () { return undefined; });
                        _b.label = 11;
                    case 11: return [2 /*return*/];
                    case 12: return [4 /*yield*/, (0, UserIdUtil_1.getUserId)(context.id, this.isAliasingEnabled, this.serviceContainer)];
                    case 13:
                        userId = _b.sent();
                        contextCopy = __assign({}, context);
                        contextCopy.id = userId;
                        contextModel = new ContextModel_1.ContextModel().modelFromDictionary(contextCopy, this.options);
                        attributeMap = (_a = {}, _a[attributeKey] = attributeValue, _a);
                        // Proceed with setting the attribute map if validation is successful
                        return [4 /*yield*/, new SetAttribute_1.SetAttributeApi().setAttribute(this.serviceContainer, attributeMap, contextModel)];
                    case 14:
                        // Proceed with setting the attribute map if validation is successful
                        _b.sent();
                        _b.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        err_5 = _b.sent();
                        this.serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                            apiName: apiName,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_5),
                        }, { an: ApiEnum_1.ApiEnum.SET_ATTRIBUTE });
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the settings by fetching the latest settings from the Wingify server.
     * @param settings - The settings to update.
     * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
     * @returns Promise<void>
     */
    WingifyClient.prototype.updateSettings = function (settings_1) {
        return __awaiter(this, arguments, void 0, function (settings, isViaWebhook, isRefreshFromPanicClear, controlApplyMode) {
            var apiName, settingsToUpdate, _a, normalizedSettings, panicService, resolvedControlApplyMode, err_6;
            var _b;
            if (isViaWebhook === void 0) { isViaWebhook = true; }
            if (isRefreshFromPanicClear === void 0) { isRefreshFromPanicClear = false; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.UPDATE_SETTINGS;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        this.serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName: apiName }));
                        if (!(!settings || Object.keys(settings).length === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.serviceContainer.getSettingsService().fetchSettings(isViaWebhook, apiName)];
                    case 2:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = settings;
                        _c.label = 4;
                    case 4:
                        settingsToUpdate = _a;
                        normalizedSettings = this.serviceContainer.getSettingsService().normalizeSettings(settingsToUpdate);
                        // validate settings schema
                        if (!new SettingsSchemaValidation_1.SettingsSchema().isSettingsValid(normalizedSettings)) {
                            throw new Error('TypeError: Invalid Settings schema');
                        }
                        panicService = this.serviceContainer.getPanicModeForcedRefreshControlService();
                        if (!panicService.shouldApplySettingsSnapshot(normalizedSettings)) {
                            this.serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_UPDATE_SKIPPED_STALE, {
                                timestamp: (_b = normalizedSettings === null || normalizedSettings === void 0 ? void 0 : normalizedSettings.lastUpdatedOn) !== null && _b !== void 0 ? _b : normalizedSettings === null || normalizedSettings === void 0 ? void 0 : normalizedSettings.version,
                            }));
                            return [2 /*return*/]; // Skip applying stale settings
                        }
                        // set the settings on the client instance
                        (0, SettingsUtil_1.setSettingsAndAddCampaignsToRules)(normalizedSettings, this.wingifyClientInstance, this.serviceContainer.getLogManager());
                        this.serviceContainer.setSettings(this.wingifyClientInstance.settings);
                        this.serviceContainer.setOriginalSettingsDocument(this.wingifyClientInstance.originalSettings);
                        this.serviceContainer.injectServiceContainer(this.serviceContainer);
                        resolvedControlApplyMode = controlApplyMode !== null && controlApplyMode !== void 0 ? controlApplyMode : (settings && Object.keys(settings).length > 0 && !isViaWebhook
                            ? PanicModeForcedRefreshControlService_1.SettingsControlApplyMode.POLLING
                            : PanicModeForcedRefreshControlService_1.SettingsControlApplyMode.APPLY);
                        this.handleSettingsControlFlags(normalizedSettings, resolvedControlApplyMode);
                        if (!isRefreshFromPanicClear) {
                            this.serviceContainer
                                .getLogManager()
                                .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SETTINGS_UPDATED, { apiName: apiName, isViaWebhook: isViaWebhook }));
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        err_6 = _c.sent();
                        this.serviceContainer.getLogManager().errorLog('UPDATING_CLIENT_INSTANCE_FAILED_WHEN_WEBHOOK_TRIGGERED', {
                            apiName: apiName,
                            isViaWebhook: isViaWebhook,
                            err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_6),
                        }, { an: ApiEnum_1.ApiEnum.UPDATE_SETTINGS });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Flushes the events manually from the batch events queue
     */
    WingifyClient.prototype.flushEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, promises, storageService, flushResult, err_7;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.FLUSH_EVENTS;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        this.serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName: apiName }));
                        if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
                            this.serviceContainer
                                .getLogManager()
                                .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: apiName }));
                            return [2 /*return*/, { status: 'error', events: [] }];
                        }
                        if (!this.serviceContainer.getBatchEventsQueue()) {
                            this.serviceContainer.getLogManager().errorLog('BATCHING_NOT_ENABLED', {}, { an: ApiEnum_1.ApiEnum.FLUSH_EVENTS });
                            return [2 /*return*/, { status: 'error', events: [] }];
                        }
                        promises = [this.serviceContainer.getBatchEventsQueue().flushAndClearTimer()];
                        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.edgeConfig) &&
                            Object.keys(this.options.edgeConfig).length > 0 &&
                            ((_b = this.options) === null || _b === void 0 ? void 0 : _b.accountId) &&
                            ((_c = this.options) === null || _c === void 0 ? void 0 : _c.sdkKey)) {
                            storageService = new StorageService_1.StorageService(this.serviceContainer);
                            promises.push(storageService
                                .setFreshSettingsInStorage(parseInt(this.options.accountId), this.options.sdkKey)
                                .catch(function (error) {
                                _this.serviceContainer
                                    .getLogManager()
                                    .errorLog('ERROR_STORING_SETTINGS_IN_STORAGE', { err: (0, FunctionUtil_1.getFormattedErrorMessage)(error) }, { an: ApiEnum_1.ApiEnum.FLUSH_EVENTS });
                                // by returning undefined, we are swallowing the error intentionally to avoid the promise from rejecting
                                return undefined;
                            }));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        flushResult = (_d.sent())[0];
                        return [2 /*return*/, flushResult];
                    case 3:
                        err_7 = _d.sent();
                        this.serviceContainer
                            .getLogManager()
                            .errorLog('EXECUTION_FAILED', { apiName: apiName, err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_7) }, { an: ApiEnum_1.ApiEnum.FLUSH_EVENTS });
                        return [2 /*return*/, { status: 'error', events: [] }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets alias for a given user ID
     * @param contextOrUserId - The context containing user ID or the user ID directly
     * @param aliasId - The alias identifier to set
     * @returns Promise<boolean> - Returns true if successful, false otherwise
     */
    WingifyClient.prototype.setAlias = function (contextOrUserId, aliasId) {
        return __awaiter(this, void 0, void 0, function () {
            var apiName, userId, rawUserId, heartbeat, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiName = ApiEnum_1.ApiEnum.SET_ALIAS;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        this.serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, {
                            apiName: apiName,
                        }));
                        if (!this.isAliasingEnabled) {
                            this.serviceContainer.getLogManager().errorLog('ALIAS_CALLED_BUT_NOT_PASSED', {}, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
                            return [2 /*return*/, false];
                        }
                        if (!this.serviceContainer.getSettingsService().isGatewayServiceProvided) {
                            this.serviceContainer.getLogManager().errorLog('INVALID_GATEWAY_URL', {}, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
                            return [2 /*return*/, false];
                        }
                        if (!aliasId) {
                            throw new TypeError('TypeError: Invalid aliasId');
                        }
                        if ((0, DataTypeUtil_2.isArray)(aliasId)) {
                            throw new TypeError('TypeError: aliasId cannot be an array');
                        }
                        // trim aliasId before going forward
                        aliasId = aliasId.trim();
                        userId = void 0;
                        rawUserId = typeof contextOrUserId === 'string' ? contextOrUserId.trim() : contextOrUserId.id.trim();
                        if (!this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) return [3 /*break*/, 5];
                        this.serviceContainer
                            .getLogManager()
                            .info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName: apiName }));
                        heartbeat = (0, NetworkUtil_1.sendPanicCollectHeartbeatRequest)(this.serviceContainer, {
                            id: rawUserId,
                            uuid: this.getUUIDFromContext(typeof contextOrUserId === 'string' ? { id: rawUserId } : contextOrUserId, apiName),
                            sessionId: undefined,
                        });
                        if (!this.serviceContainer.getShouldWaitForTrackingCalls()) return [3 /*break*/, 3];
                        return [4 /*yield*/, heartbeat.catch(function () { return undefined; })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        void heartbeat.catch(function () { return undefined; });
                        _a.label = 4;
                    case 4: return [2 /*return*/, false];
                    case 5:
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
                            if ((0, DataTypeUtil_2.isArray)(contextOrUserId)) {
                                throw new TypeError('TypeError: userId cannot be an array');
                            }
                            userId = contextOrUserId;
                        }
                        else {
                            // Context object provided
                            if (!contextOrUserId || !contextOrUserId.id) {
                                throw new TypeError('TypeError: Invalid context');
                            }
                            if ((0, DataTypeUtil_2.isArray)(contextOrUserId.id)) {
                                throw new TypeError('TypeError: context.id cannot be an array');
                            }
                            // trim contextOrUserId.id before going forward
                            contextOrUserId.id = contextOrUserId.id.trim();
                            if (contextOrUserId.id === aliasId) {
                                throw new TypeError('UserId and aliasId cannot be the same.');
                            }
                            userId = contextOrUserId.id;
                        }
                        return [4 /*yield*/, AliasingUtil_1.AliasingUtil.setAlias(userId, aliasId, this.serviceContainer)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7:
                        error_1 = _a.sent();
                        this.serviceContainer
                            .getLogManager()
                            .errorLog('EXECUTION_FAILED', { apiName: apiName, err: (0, FunctionUtil_1.getFormattedErrorMessage)(error_1) }, { an: ApiEnum_1.ApiEnum.SET_ALIAS });
                        return [2 /*return*/, false];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates a UUID from the context.id
     * @param context - The context to generate the UUID from
     * @param apiName - The name of the API calling this method
     * @returns The UUID generated from the context.id
     */
    WingifyClient.prototype.getUUIDFromContext = function (context, apiName) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (this.settings.getIsWebConnectivityEnabled() !== false) {
            // if web connectivity is enabled, check if context.id is a valid web UUID
            if ((0, UuidUtil_1.isWebUuid)(context === null || context === void 0 ? void 0 : context.id)) {
                // if context.id is a valid web UUID, set it as uuid
                this.serviceContainer.getLogManager().debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.WEB_UUID_FOUND, {
                    apiName: apiName,
                    uuid: context.id,
                }));
                return context.id;
            }
            else {
                // if context?.useIdForWeb is true and context.id is not a valid web UUID, throw error
                if ((context === null || context === void 0 ? void 0 : context.useIdForWeb) === true) {
                    throw new Error('UUID passed in context.id is not a valid UUID');
                }
                // if context?.useIdForWeb is false, fallback to server‑side UUID derivation
                return (0, UuidUtil_1.getUUID)((_b = (_a = context === null || context === void 0 ? void 0 : context.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "".concat((_c = this.options) === null || _c === void 0 ? void 0 : _c.accountId, "_").concat((_d = this.options) === null || _d === void 0 ? void 0 : _d.sdkKey), (_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.accountId) === null || _f === void 0 ? void 0 : _f.toString());
            }
        }
        else {
            // if web connectivity is disabled, fallback to server‑side UUID derivation
            return (0, UuidUtil_1.getUUID)((_h = (_g = context === null || context === void 0 ? void 0 : context.id) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : "".concat((_j = this.options) === null || _j === void 0 ? void 0 : _j.accountId, "_").concat((_k = this.options) === null || _k === void 0 ? void 0 : _k.sdkKey), (_m = (_l = this.options) === null || _l === void 0 ? void 0 : _l.accountId) === null || _m === void 0 ? void 0 : _m.toString());
        }
    };
    /**
     * Shuts down the client: flushes pending batch events (and clears the batch timer) via flushEvents(),
     * then clears the batch queue so no further events are enqueued. Idempotent.
     */
    WingifyClient.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this.serviceContainer
                            .getLogManager()
                            .debug((0, LogMessageUtil_1.buildMessage)(log_messages_1.DebugLogMessagesEnum.API_CALLED, { apiName: ApiEnum_1.ApiEnum.SHUTDOWN }));
                        // check if the client is already shutdown
                        if (this.isShutdown) {
                            this.serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SHUTDOWN_ALREADY_COMPLETED));
                            return [2 /*return*/];
                        }
                        // set the isShutdown flag to true to avoid multiple calls to shutdown
                        this.isShutdown = true;
                        this.serviceContainer.stopPolling();
                        if (!this.serviceContainer.getBatchEventsQueue()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.flushEvents()];
                    case 1:
                        _a.sent();
                        this.serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SHUTDOWN_COMPLETED_WITH_FLUSH));
                        this.serviceContainer.setBatchEventsQueue(null);
                        return [3 /*break*/, 3];
                    case 2:
                        this.serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.SHUTDOWN_COMPLETED_WITHOUT_FLUSH));
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_8 = _a.sent();
                        this.serviceContainer
                            .getLogManager()
                            .errorLog('EXECUTION_FAILED', { apiName: ApiEnum_1.ApiEnum.SHUTDOWN, err: (0, FunctionUtil_1.getFormattedErrorMessage)(err_8) }, { an: ApiEnum_1.ApiEnum.SHUTDOWN });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Applies or defers sdkMetaInfo panic / refresh. Polling confirms panic on/off via collector ping
     * (stale panic rejected; logs only after ping). Force-refresh is not confirmed via ping from polling.
     *
     * @param settings - Normalized settings JSON (must include `lastUpdatedOn` for snapshot detection).
     * @param mode - How this snapshot was obtained.
     * @returns void
     */
    WingifyClient.prototype.handleSettingsControlFlags = function (settings, mode) {
        if (mode === void 0) { mode = PanicModeForcedRefreshControlService_1.SettingsControlApplyMode.APPLY; }
        var panicModeForcedRefreshControl = this.serviceContainer.getPanicModeForcedRefreshControlService();
        var settingsSnapshotControlOutcome = panicModeForcedRefreshControl.applySettingsControl(settings, mode);
        if (settingsSnapshotControlOutcome.needsCollectPingConfirmation) {
            void this.confirmControlViaCollectPing();
        }
        if (!settingsSnapshotControlOutcome.shouldTriggerForceRefresh || !panicModeForcedRefreshControl.tryStartRefresh()) {
            return;
        }
        this.updateSettings(undefined, true, settingsSnapshotControlOutcome.isRefreshFromPanicClear, PanicModeForcedRefreshControlService_1.SettingsControlApplyMode.POST_PING_FETCH).finally(function () {
            panicModeForcedRefreshControl.finishRefresh(settingsSnapshotControlOutcome.isRefreshFromPanicClear);
        });
    };
    /**
     * Confirms panic with a control ping. DaCDN response is the source of truth.
     */
    WingifyClient.prototype.confirmControlViaCollectPing = function () {
        return __awaiter(this, void 0, void 0, function () {
            var panicModeForcedRefreshControl, settingsService, userId, uuid, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        panicModeForcedRefreshControl = this.serviceContainer.getPanicModeForcedRefreshControlService();
                        if (!panicModeForcedRefreshControl.tryStartPanicClearConfirmation()) {
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        settingsService = this.serviceContainer.getSettingsService();
                        userId = "".concat(settingsService.accountId, "_").concat(settingsService.sdkKey);
                        uuid = (0, UuidUtil_1.getUUID)("".concat(settingsService.accountId, "_").concat(settingsService.sdkKey), String(settingsService.accountId));
                        return [4 /*yield*/, (0, NetworkUtil_1.sendPanicCollectHeartbeatRequest)(this.serviceContainer, { id: userId, uuid: uuid })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        panicModeForcedRefreshControl.finishPanicClearConfirmation();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return WingifyClient;
}());
exports.WingifyClient = WingifyClient;
//# sourceMappingURL=WingifyClient.js.map