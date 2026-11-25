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
import { Storage } from './packages/storage';

import { Flag, FlagApi } from './api/GetFlag';
import { GetFlagsApi, resolveFlagKeys } from './api/GetFlags';
import { SetAttributeApi } from './api/SetAttribute';
import { TrackApi } from './api/TrackEvent';

import { DebugLogMessagesEnum, InfoLogMessagesEnum, ErrorLogMessagesEnum } from './enums/log-messages';
import { SettingsModel } from './models/settings/SettingsModel';

import { dynamic } from './types/Common';
import { SettingsSchema } from './models/schemas/SettingsSchemaValidation';
import { ContextModel } from './models/user/ContextModel';

import { getType, isObject, isString, isBoolean, isNumber } from './utils/DataTypeUtil';

import { buildMessage } from './utils/LogMessageUtil';
import { Deferred } from './utils/PromiseUtil';

import { IWingifyOptions } from './models/WingifyOptionsModel';
import { setSettingsAndAddCampaignsToRules } from './utils/SettingsUtil';
import { VariationModel } from './models/campaign/VariationModel';
import { ApiEnum } from './enums/ApiEnum';
import { AliasingUtil } from './utils/AliasingUtil';
import { getUserId } from './utils/UserIdUtil';
import { isArray } from './utils/DataTypeUtil';
import { getCurrentUnixTimestamp, getFormattedErrorMessage, getFeatureFromKey } from './utils/FunctionUtil';
import { ServiceContainer } from './services/ServiceContainer';
import { sendSdkInitEvent, sendSDKUsageStatsEvent } from './utils/SdkInitAndUsageStatsUtil';
import { UsageStatsUtil } from './utils/UsageStatsUtil';
import { StorageService } from './services/StorageService';
import { getUUID, isWebUuid } from './utils/UuidUtil';
import { SDKMetaUtil } from './utils/SDKMetaUtil';
import {
  featureHasPulseSurveyPreSegmentation,
  getVwoUuidFromCookie,
  resolvePulsePreSegmentationIdentity,
} from './utils/PulsePreSegmentationUtil';
import { shouldSkipUserApiDueToConsent } from './utils/ConsentUtil';
import { ServiceContainerRegistry } from './services/ServiceContainerRegistry';
import { sendPanicCollectHeartbeatRequest } from './utils/NetworkUtil';
import { EventEnum } from './enums/EventEnum';
import { SettingsControlApplyMode } from './services/PanicModeForcedRefreshControlService';

export interface IWingifyClient {
  readonly options?: IWingifyOptions;
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  isSettingsValid: boolean;
  settingsFetchTime: number | undefined;
  isAliasingEnabled: boolean;

  getFlag(featureKey: string, context: Record<string, any>): Promise<Flag>;
  getFlags(
    flagNames: string[] | null | undefined,
    context: Record<string, any>,
    shouldSendTrackingCalls?: boolean,
  ): Promise<Record<string, Flag>>;
  fetchFlags(flagNames: string[] | null | undefined, context: Record<string, any>): Promise<Record<string, Flag>>;
  trackEvent(
    eventName: string,
    context: Record<string, any>,
    eventProperties?: Record<string, dynamic>,
  ): Promise<Record<string, boolean>>;
  setAttribute(
    attributeKey: string,
    attributeValue: boolean | string | number,
    context: Record<string, any>,
  ): Promise<void>;
  setAttribute(attributes: Record<string, boolean | string | number>, context: Record<string, any>): Promise<void>;
  updateSettings(
    settings?: Record<string, any>,
    isViaWebhook?: boolean,
    isRefreshFromPanicClear?: boolean,
    controlApplyMode?: SettingsControlApplyMode,
  ): Promise<void>;
  flushEvents(): Promise<Record<string, any>>;
  shutdown(): Promise<void>;
  setAlias(context: Record<string, any> | string, aliasId: string): Promise<boolean>;
}

export class WingifyClient implements IWingifyClient {
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  storage: Storage;
  wingifyClientInstance: WingifyClient;
  isSettingsValid: boolean;
  settingsFetchTime: number | undefined;
  isAliasingEnabled: boolean;
  serviceContainer: ServiceContainer;
  options?: IWingifyOptions;
  private isShutdown: boolean = false;

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
  constructor(settings: Record<any, any>, options: IWingifyOptions, serviceContainer: ServiceContainer) {
    try {
      this.options = options;
      this.serviceContainer = serviceContainer;
      const normalizedSettings = this.serviceContainer.getSettingsService().normalizeSettings(settings);
      this.isSettingsValid = new SettingsSchema().isSettingsValid(normalizedSettings);
      this.isAliasingEnabled = options.isAliasingEnabled || false;
      if (this.isSettingsValid && !this.serviceContainer.getSettingsService().isSettingsProvidedInInit) {
        this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SETTINGS_FETCH_SUCCESS));
      } else if (!this.isSettingsValid && this.options.settings) {
        this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.INIT });
      }
      setSettingsAndAddCampaignsToRules(normalizedSettings, this, this.serviceContainer.getLogManager());
      this.serviceContainer.setSettings(this.settings);
      this.serviceContainer.setOriginalSettingsDocument(this.originalSettings);
      this.serviceContainer.injectServiceContainer(this.serviceContainer);
      this.serviceContainer.setShouldWaitForTrackingCalls(this.options.shouldWaitForTrackingCalls || false);
      // Register so consent-denied user APIs can clear storage on every live client in this process.
      ServiceContainerRegistry.register(this.serviceContainer);
      this.serviceContainer.setForceRefreshHandler((isRefreshFromPanicClear?: boolean) =>
        this.updateSettings(undefined, true, isRefreshFromPanicClear, SettingsControlApplyMode.POST_PING_FETCH),
      );
      this.handleSettingsControlFlags(normalizedSettings, SettingsControlApplyMode.APPLY);

      this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.CLIENT_INITIALIZED));
      this.wingifyClientInstance = this;
      const usageStatsUtil = new UsageStatsUtil(this.options);
      this.sendSdkInitAndUsageStatsEvents(usageStatsUtil);
      // initialize the sdk meta util
      new SDKMetaUtil(this.options);
      return this;
    } catch (err) {
      this.serviceContainer.getLogManager().errorLog(
        'EXECUTION_FAILED',
        {
          apiName: ApiEnum.INIT,
          err: getFormattedErrorMessage(err),
        },
        { an: ApiEnum.INIT },
        false,
      );
    }
  }

  /**
   * Sends the SDK init event and usage stats event
   * @param usageStatsUtil - The usage stats util to use for sending the usage stats event
   */
  private async sendSdkInitAndUsageStatsEvents(usageStatsUtil: UsageStatsUtil) {
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
        } else if (this.options.shouldWaitForTrackingCalls) {
          await sendSdkInitEvent(this.serviceContainer);
        } else {
          sendSdkInitEvent(this.serviceContainer);
        }
      }

      const usageStatsAccountId = this.originalSettings?.usageStatsAccountId;
      if (
        usageStatsAccountId &&
        internalEventsThrottleService.shouldSendUsageStatsEvent(this.originalSettings) &&
        !isPanicModeActivated
      ) {
        if (this.options.shouldWaitForTrackingCalls) {
          await sendSDKUsageStatsEvent(
            usageStatsAccountId,
            this.serviceContainer,
            usageStatsUtil,
            settingsFetchTime,
            sdkInitTime,
          );
        } else {
          sendSDKUsageStatsEvent(
            usageStatsAccountId,
            this.serviceContainer,
            usageStatsUtil,
            settingsFetchTime,
            sdkInitTime,
          );
        }
      }
    } catch (err) {
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
  async getFlag(featureKey: string, context: Record<string, any>): Promise<Flag> {
    const apiName = ApiEnum.GET_FLAG;
    const deferredObject = new Deferred();
    let uuid: string;
    try {
      this.serviceContainer.getLogManager().debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );
      // Denied consent must not evaluate the flag or send data for this user.
      if (shouldSkipUserApiDueToConsent(context, apiName, this.serviceContainer)) {
        // Callers still receive a flag object, with the feature turned off.
        return new Flag(false, context?.sessionId ?? getCurrentUnixTimestamp(), null, new VariationModel());
      }
      // get uuid from context
      uuid = this.getUUIDFromContext(context, apiName);
    } catch (err) {
      this.serviceContainer.getLogManager().errorLog(
        'EXECUTION_FAILED',
        {
          apiName,
          err: getFormattedErrorMessage(err),
        },
        { an: ApiEnum.GET_FLAG },
      );
      // return error return schema with null uuid
      deferredObject.resolve(
        new Flag(false, context?.sessionId ?? getCurrentUnixTimestamp(), null, new VariationModel()),
      );
      return deferredObject.promise;
    }
    const errorReturnSchema = new Flag(
      false,
      context?.sessionId ?? getCurrentUnixTimestamp(),
      uuid,
      new VariationModel(),
    );

    try {
      // Validate featureKey is a string
      if (!isString(featureKey)) {
        this.serviceContainer.getLogManager().errorLog(
          'INVALID_PARAM',
          {
            apiName,
            key: 'featureKey',
            type: getType(featureKey),
            correctType: 'string',
          },
          { an: ApiEnum.GET_FLAG },
          false,
        );

        throw new TypeError('TypeError: featureKey should be a string, got ' + getType(featureKey));
      }

      // Validate settings are loaded and valid
      if (!this.isSettingsValid) {
        this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.GET_FLAG });
        throw new Error('TypeError: Invalid Settings');
      }
      // check if the feature has pulse survey pre-segmentation and apply it to the context
      const contextForEvaluation = this.applyPulsePreSegmentationIdentity(featureKey, context, apiName);
      // get the uuid from the context
      uuid = this.getUUIDFromContext(contextForEvaluation, apiName);

      // Validate user ID is present in context
      if (!contextForEvaluation || !contextForEvaluation.id) {
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
        } else {
          void heartbeat.catch(() => undefined);
        }
        deferredObject.resolve(errorReturnSchema);
        return deferredObject.promise;
      }

      //getUserId from gateway service
      const userId = await getUserId(contextForEvaluation.id, this.isAliasingEnabled, this.serviceContainer);
      // Create a copy of context to avoid modifying the original
      const contextCopy = { ...contextForEvaluation };
      contextCopy.id = userId;

      // check if the userId changed after aliasing, by comparing the original userId with the new userId
      if (contextCopy.id !== contextForEvaluation.id) {
        // if the userId changed, then we need to generate a new uuid
        contextCopy.uuid = this.getUUIDFromContext(contextCopy, apiName);
      } else {
        // if the userId didn't change, then we can use the existing uuid
        contextCopy.uuid = uuid;
      }

      // Validate bucketingSeed: must be a non-empty, non-whitespace-only string
      if ('bucketingSeed' in contextCopy) {
        const seed = contextCopy.bucketingSeed;
        if (
          seed === undefined ||
          seed === null ||
          isNumber(seed) ||
          isObject(seed) ||
          isArray(seed) ||
          (isString(seed) && (seed as string).trim().length === 0)
        ) {
          this.serviceContainer.getLogManager().errorLog(
            'INVALID_BUCKETING_SEED',
            {
              apiName,
              type: getType(seed),
            },
            { an: ApiEnum.GET_FLAG },
            false,
          );
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
    } catch (err) {
      this.serviceContainer.getLogManager().errorLog(
        'EXECUTION_FAILED',
        {
          apiName,
          err: getFormattedErrorMessage(err),
        },
        { an: ApiEnum.GET_FLAG },
      );

      deferredObject.resolve(errorReturnSchema);
    }

    return deferredObject.promise;
  }

  /**
   * Evaluates multiple feature flags for a user and returns them keyed by feature key.
   *
   * @param flagNames - Feature keys to evaluate, or null/empty to evaluate all settings features.
   * @param context - User context; must include a valid user id.
   * @param shouldSendTrackingCalls - When false, drops impression and debugger calls instead of deferring them.
   * @returns {Promise<Record<string, Flag>>} Evaluated flags keyed by feature key.
   */
  async getFlags(
    flagNames: string[] | null | undefined,
    context: Record<string, any>,
    shouldSendTrackingCalls = true,
  ): Promise<Record<string, Flag>> {
    // Legacy third argument drops impressions. fetchFlags defers them instead.
    return this.evaluateFlags(flagNames, context, ApiEnum.GET_FLAGS, shouldSendTrackingCalls, true, true);
  }

  /**
   * Evaluates multiple feature flags without sending impression or debugger calls.
   * MAU usage tracking (`vwo_feTrackUsage`) is still sent when enabled for the account.
   * Call `Flag.exposeResult()` later to send deferred `vwo_variationShown` impressions.
   *
   * @param flagNames - Feature keys to evaluate, or null/empty to evaluate all settings features.
   * @param context - User context; must include a valid user id.
   * @returns {Promise<Record<string, Flag>>} Evaluated flags keyed by feature key.
   */
  async fetchFlags(
    flagNames: string[] | null | undefined,
    context: Record<string, any>,
  ): Promise<Record<string, Flag>> {
    // Block live impressions, keep MAU on, and defer variationShown for exposeResult.
    return this.evaluateFlags(flagNames, context, ApiEnum.FETCH_FLAGS, false, true, false);
  }

  /**
   * Shared validation and evaluation path for getFlags and fetchFlags.
   *
   * @param flagNames - Feature keys to evaluate, or null/empty to evaluate all settings features.
   * @param context - User context; must include a valid user id.
   * @param apiName - API name used for logging and debug metadata.
   * @param shouldSendTrackingCalls - When false, suppresses impression and debugger network calls.
   * @param shouldSendMAU - When false, suppresses MAU usage tracking calls.
   * @param shouldApplyLegacySuppression - When true, getFlags drops impressions. fetchFlags passes false so they are deferred.
   * @returns {Promise<Record<string, Flag>>} Evaluated flags keyed by feature key.
   */
  private async evaluateFlags(
    flagNames: string[] | null | undefined,
    context: Record<string, any>,
    apiName: ApiEnum,
    shouldSendTrackingCalls: boolean,
    shouldSendMAU: boolean,
    shouldApplyLegacySuppression: boolean,
  ): Promise<Record<string, Flag>> {
    try {
      this.serviceContainer.getLogManager().debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );
      // Denied consent skips evaluation and returns the same disabled shape as a failed call.
      if (shouldSkipUserApiDueToConsent(context, apiName, this.serviceContainer)) {
        // Use settings keys when the caller asked for every flag, so the map is not empty.
        const featureKeys = this.isSettingsValid ? resolveFlagKeys(flagNames, this.settings) : flagNames;
        return this.buildDisabledFlags(featureKeys, context);
      }

      // Computed before later throws so error metadata can still identify the user.
      const uuid = this.getUUIDFromContext(context, apiName);

      if (!this.isSettingsValid) {
        this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: apiName }, false);
        throw new Error('TypeError: Invalid Settings');
      }

      if (!context || !context.id) {
        this.serviceContainer.getLogManager().errorLog('INVALID_CONTEXT_PASSED', {}, { an: apiName }, false);
        throw new TypeError('TypeError: Invalid context');
      }

      // Panic mode blocks decisions and only pings collect to see if the mode is still on.
      if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
        this.serviceContainer
          .getLogManager()
          .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
        const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
          id: String(context.id),
          uuid,
          sessionId: isNumber(context.sessionId) ? context.sessionId : undefined,
        });
        // Block on the ping only when the client is configured to wait for tracking calls.
        if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
          await heartbeat.catch(() => undefined);
        } else {
          void heartbeat.catch(() => undefined);
        }
        // Callers still get one disabled flag per requested key.
        return this.buildDisabledFlags(flagNames, context);
      }

      // Alias resolution can replace the id, so copy context before evaluation mutates it.
      const userId = await getUserId(context.id, this.isAliasingEnabled, this.serviceContainer);
      const baseContextCopy = { ...context };
      baseContextCopy.id = userId;

      // A replaced id needs a new uuid. The original uuid stays when the id did not change.
      if (baseContextCopy.id !== context.id) {
        baseContextCopy.uuid = this.getUUIDFromContext(baseContextCopy, apiName);
      } else {
        baseContextCopy.uuid = uuid;
      }

      if ('bucketingSeed' in baseContextCopy) {
        const seed = baseContextCopy.bucketingSeed;
        if (
          seed === undefined ||
          seed === null ||
          isNumber(seed) ||
          isObject(seed) ||
          isArray(seed) ||
          (isString(seed) && (seed as string).trim().length === 0)
        ) {
          this.serviceContainer.getLogManager().errorLog(
            'INVALID_BUCKETING_SEED',
            {
              apiName,
              type: getType(seed),
            },
            { an: apiName },
            false,
          );
          delete baseContextCopy.bucketingSeed;
        }
      }

      return await GetFlagsApi.get(
        flagNames,
        baseContextCopy,
        this.serviceContainer,
        this.options,
        shouldSendTrackingCalls,
        shouldSendMAU,
        shouldApplyLegacySuppression,
      );
    } catch (err) {
      this.serviceContainer.getLogManager().errorLog(
        'EXECUTION_FAILED',
        {
          apiName,
          err: getFormattedErrorMessage(err),
        },
        { an: apiName },
      );

      // Callers always receive a map, even when validation or evaluation throws.
      return this.buildDisabledFlags(flagNames, context);
    }
  }

  /**
   * Builds disabled flags for the requested keys after validation or execution failure.
   *
   * @param flagNames - Requested feature keys from the caller.
   * @param context - Raw caller context used to populate flag metadata.
   * @returns {Record<string, Flag>} Disabled flags keyed by requested feature key.
   */
  private buildDisabledFlags(
    flagNames: string[] | null | undefined,
    context: Record<string, any>,
  ): Record<string, Flag> {
    // Drop blank keys so the map only contains flags the caller can look up.
    const featureKeys = flagNames?.filter((featureKey) => featureKey?.trim()) ?? [];
    if (!featureKeys.length) {
      return {};
    }

    // One shared disabled flag is enough because nothing here is mutated per key.
    const sessionId = context?.sessionId ?? getCurrentUnixTimestamp();
    const uuid = context?.uuid ?? '';
    const disabledFlag = new Flag(false, sessionId, uuid, new VariationModel());

    return Object.fromEntries(featureKeys.map((featureKey) => [featureKey, disabledFlag]));
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
  async trackEvent(
    eventName: string,
    context: Record<string, any>,
    eventProperties: Record<string, dynamic> = {},
  ): Promise<Record<string, boolean>> {
    const apiName = ApiEnum.TRACK_EVENT;
    const deferredObject = new Deferred();

    try {
      // Log the API call
      this.serviceContainer.getLogManager().debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );
      // Denied consent skips the event and reports it as not tracked.
      if (shouldSkipUserApiDueToConsent(context, apiName, this.serviceContainer)) {
        return { [eventName]: false };
      }

      // Validate eventName is a string
      if (!isString(eventName)) {
        this.serviceContainer.getLogManager().errorLog(
          'INVALID_PARAM',
          {
            apiName,
            key: 'eventName',
            type: getType(eventName),
            correctType: 'string',
          },
          { an: ApiEnum.TRACK_EVENT },
          false,
        );

        throw new TypeError('TypeError: Event-name should be a string, got ' + getType(eventName));
      }

      // Validate eventProperties is an object
      if (!isObject(eventProperties)) {
        this.serviceContainer.getLogManager().errorLog(
          'INVALID_PARAM',
          {
            apiName,
            key: 'eventProperties',
            type: getType(eventProperties),
            correctType: 'object',
          },
          { an: ApiEnum.TRACK_EVENT },
          false,
        );

        throw new TypeError('TypeError: eventProperties should be an object, got ' + getType(eventProperties));
      }

      // Validate settings are loaded and valid
      if (!this.isSettingsValid) {
        this.serviceContainer.getLogManager().errorLog('INVALID_SETTINGS_SCHEMA', {}, { an: ApiEnum.TRACK_EVENT });
        throw new Error('TypeError: Invalid Settings');
      }

      // When Pulse pre-seg is on, adopt `_vwo_uuid` as context.id when the caller omitted id
      const contextForEvaluation = this.applyPulseCookieIdentity(context, apiName);

      // Validate user ID is present in context
      if (!contextForEvaluation || !contextForEvaluation.id) {
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
          id: String(contextForEvaluation.id),
          uuid: this.getUUIDFromContext(contextForEvaluation, apiName),
          sessionId: isNumber(contextForEvaluation.sessionId) ? contextForEvaluation.sessionId : undefined,
        });
        if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
          await heartbeat.catch(() => undefined);
        } else {
          void heartbeat.catch(() => undefined);
        }
        deferredObject.resolve({ [eventName]: false });
        return deferredObject.promise;
      }

      //getUserId from gateway service
      const userId = await getUserId(contextForEvaluation.id, this.isAliasingEnabled, this.serviceContainer);
      // Create a copy of context to avoid modifying the original
      const contextCopy = { ...contextForEvaluation };
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
    } catch (err) {
      // Log any errors encountered during the operation
      this.serviceContainer.getLogManager().errorLog(
        'EXECUTION_FAILED',
        {
          apiName,
          err: getFormattedErrorMessage(err),
        },
        { an: ApiEnum.TRACK_EVENT },
      );

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
  async setAttribute(
    attributeOrAttributes: string | Record<string, boolean | string | number>,
    attributeValueOrContext?: boolean | string | number | Record<string, any>,
    context?: Record<string, any>,
  ): Promise<void> {
    const apiName = ApiEnum.SET_ATTRIBUTE;

    try {
      // Map form puts context in the third argument. Single-attribute form puts it in the second.
      const contextForConsentCheck = isObject(attributeOrAttributes)
        ? (context ?? (attributeValueOrContext as Record<string, any>))
        : context;
      // Denied consent skips the attribute write and clears stored decisions for this user.
      if (shouldSkipUserApiDueToConsent(contextForConsentCheck, apiName, this.serviceContainer)) {
        return;
      }

      if (isObject(attributeOrAttributes)) {
        // Log the API call
        this.serviceContainer.getLogManager().debug(
          buildMessage(DebugLogMessagesEnum.API_CALLED, {
            apiName,
          }),
        );

        if (Object.entries(attributeOrAttributes).length < 1) {
          throw new TypeError('TypeError: Attributes should be an object containing at least 1 key-value pair');
        }

        // Case where multiple attributes are passed as a map
        const attributes = attributeOrAttributes as Record<string, boolean | string | number>; // Type assertion

        // Validate attributes is an object
        if (!isObject(attributes)) {
          throw new TypeError('TypeError: attributes should be an object containing key-value pairs');
        }

        // Validate that each attribute value is of a supported type
        Object.entries(attributes).forEach(([key, value]) => {
          if (typeof value !== 'boolean' && typeof value !== 'string' && typeof value !== 'number') {
            throw new TypeError(
              `Invalid attribute type for key "${key}". Expected boolean, string or number, but got ${getType(value)}`,
            );
          }

          // Reject arrays and objects explicitly
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            throw new TypeError(`Invalid attribute value for key "${key}". Arrays and objects are not supported.`);
          }
        });

        // If we have only two arguments (attributeMap and context)
        if (!context && attributeValueOrContext) {
          context = attributeValueOrContext as Record<string, any>; // Assign context explicitly
        }

        // When Pulse pre-seg is on, adopt `_vwo_uuid` as context.id when the caller omitted id
        const contextForEvaluation = this.applyPulseCookieIdentity(context, apiName);

        // Validate user ID is present in context
        if (!contextForEvaluation || !contextForEvaluation.id) {
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
            id: String(contextForEvaluation.id),
            uuid: this.getUUIDFromContext(contextForEvaluation, apiName),
            sessionId: isNumber(contextForEvaluation.sessionId) ? contextForEvaluation.sessionId : undefined,
          });
          if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
            await heartbeat.catch(() => undefined);
          } else {
            void heartbeat.catch(() => undefined);
          }
          return;
        }

        //getUserId from gateway service
        const userId = await getUserId(contextForEvaluation.id, this.isAliasingEnabled, this.serviceContainer);
        // Create a copy of context to avoid modifying the original
        const contextCopy = { ...contextForEvaluation };
        contextCopy.id = userId;
        // set uuid in the context copy
        contextCopy.uuid = this.getUUIDFromContext(contextCopy, apiName);

        const contextModel = new ContextModel().modelFromDictionary(contextCopy, this.options);
        // Proceed with setting the attributes if validation is successful
        await new SetAttributeApi().setAttribute(this.serviceContainer, attributes, contextModel);
      } else {
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

        // When Pulse pre-seg is on, adopt `_vwo_uuid` as context.id when the caller omitted id
        const contextForEvaluation = this.applyPulseCookieIdentity(context, apiName);

        // Validate user ID is present in context
        if (!contextForEvaluation || !contextForEvaluation.id) {
          throw new TypeError('Invalid context');
        }

        //send heartbeat if panic mode is activated and early exit
        if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
          this.serviceContainer
            .getLogManager()
            .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
          const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
            id: String(contextForEvaluation.id),
            uuid: this.getUUIDFromContext(contextForEvaluation, apiName),
            sessionId: isNumber(contextForEvaluation.sessionId) ? contextForEvaluation.sessionId : undefined,
          });
          if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
            await heartbeat.catch(() => undefined);
          } else {
            void heartbeat.catch(() => undefined);
          }
          return;
        }

        //getUserId from gateway service
        const userId = await getUserId(contextForEvaluation.id, this.isAliasingEnabled, this.serviceContainer);
        // Create a copy of context to avoid modifying the original
        const contextCopy = { ...contextForEvaluation };
        contextCopy.id = userId;
        // Keep web uuid aligned with trackEvent and bulk setAttribute when id is a SmartCode visitor
        contextCopy.uuid = this.getUUIDFromContext(contextCopy, apiName);

        const contextModel = new ContextModel().modelFromDictionary(contextCopy, this.options);

        // Create a map from the single attribute key-value pair
        const attributeMap = { [attributeKey]: attributeValue };

        // Proceed with setting the attribute map if validation is successful
        await new SetAttributeApi().setAttribute(this.serviceContainer, attributeMap, contextModel);
      }
    } catch (err) {
      this.serviceContainer.getLogManager().errorLog(
        'EXECUTION_FAILED',
        {
          apiName,
          err: getFormattedErrorMessage(err),
        },
        { an: ApiEnum.SET_ATTRIBUTE },
      );
    }
  }

  /**
   * Updates the settings by fetching the latest settings from the Wingify server.
   * @param settings - The settings to update.
   * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
   * @returns Promise<void>
   */
  async updateSettings(
    settings?: Record<string, any>,
    isViaWebhook = true,
    isRefreshFromPanicClear = false,
    controlApplyMode?: SettingsControlApplyMode,
  ): Promise<void> {
    const apiName = ApiEnum.UPDATE_SETTINGS;
    try {
      this.serviceContainer.getLogManager().debug(buildMessage(DebugLogMessagesEnum.API_CALLED, { apiName }));
      // fetch settings from the server or use the provided settings file if it's not empty
      const settingsToUpdate =
        !settings || Object.keys(settings).length === 0
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
        this.serviceContainer.getLogManager().info(
          buildMessage(InfoLogMessagesEnum.SETTINGS_UPDATE_SKIPPED_STALE, {
            timestamp: normalizedSettings?.lastUpdatedOn ?? normalizedSettings?.version,
          }),
        );
        return; // Skip applying stale settings
      }

      // set the settings on the client instance
      setSettingsAndAddCampaignsToRules(
        normalizedSettings,
        this.wingifyClientInstance,
        this.serviceContainer.getLogManager(),
      );
      this.serviceContainer.setSettings(this.wingifyClientInstance.settings);
      this.serviceContainer.setOriginalSettingsDocument(this.wingifyClientInstance.originalSettings);
      this.serviceContainer.injectServiceContainer(this.serviceContainer);
      const resolvedControlApplyMode =
        controlApplyMode ??
        (settings && Object.keys(settings).length > 0 && !isViaWebhook
          ? SettingsControlApplyMode.POLLING
          : SettingsControlApplyMode.APPLY);
      this.handleSettingsControlFlags(normalizedSettings, resolvedControlApplyMode);
      if (!isRefreshFromPanicClear) {
        this.serviceContainer
          .getLogManager()
          .info(buildMessage(InfoLogMessagesEnum.SETTINGS_UPDATED, { apiName, isViaWebhook }));
      }
    } catch (err) {
      this.serviceContainer.getLogManager().errorLog(
        'UPDATING_CLIENT_INSTANCE_FAILED_WHEN_WEBHOOK_TRIGGERED',
        {
          apiName,
          isViaWebhook,
          err: getFormattedErrorMessage(err),
        },
        { an: ApiEnum.UPDATE_SETTINGS },
      );
    }
  }

  /**
   * Flushes the events manually from the batch events queue
   */
  async flushEvents(): Promise<Record<string, any>> {
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

      const promises: Promise<any>[] = [this.serviceContainer.getBatchEventsQueue().flushAndClearTimer()];

      if (
        this.options?.edgeConfig &&
        Object.keys(this.options.edgeConfig).length > 0 &&
        this.options?.accountId &&
        this.options?.sdkKey
      ) {
        const storageService = new StorageService(this.serviceContainer);
        promises.push(
          storageService
            .setFreshSettingsInStorage(parseInt(this.options.accountId), this.options.sdkKey)
            .catch((error) => {
              this.serviceContainer
                .getLogManager()
                .errorLog(
                  'ERROR_STORING_SETTINGS_IN_STORAGE',
                  { err: getFormattedErrorMessage(error) },
                  { an: ApiEnum.FLUSH_EVENTS },
                );
              // by returning undefined, we are swallowing the error intentionally to avoid the promise from rejecting
              return undefined;
            }),
        );
      }

      const [flushResult] = await Promise.all(promises);
      return flushResult;
    } catch (err) {
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
  async setAlias(contextOrUserId: Record<string, any> | string, aliasId: string): Promise<boolean> {
    const apiName = ApiEnum.SET_ALIAS;
    try {
      this.serviceContainer.getLogManager().debug(
        buildMessage(DebugLogMessagesEnum.API_CALLED, {
          apiName,
        }),
      );
      // A raw user id string has no consent field. Only a context object can deny consent.
      if (
        !isString(contextOrUserId) &&
        shouldSkipUserApiDueToConsent(contextOrUserId, apiName, this.serviceContainer)
      ) {
        return false;
      }

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

      let userId: string;
      const rawUserId = typeof contextOrUserId === 'string' ? contextOrUserId.trim() : contextOrUserId.id.trim();
      //send heartbeat if panic mode is activated and early exit
      if (this.serviceContainer.getPanicModeForcedRefreshControlService().isPanicModeActivated()) {
        this.serviceContainer
          .getLogManager()
          .info(buildMessage(InfoLogMessagesEnum.API_BLOCKED_BY_PANIC_MODE, { apiName }));
        const heartbeat = sendPanicCollectHeartbeatRequest(this.serviceContainer, {
          id: rawUserId,
          uuid: this.getUUIDFromContext(
            typeof contextOrUserId === 'string' ? { id: rawUserId } : contextOrUserId,
            apiName,
          ),
          sessionId: undefined,
        });
        if (this.serviceContainer.getShouldWaitForTrackingCalls()) {
          await heartbeat.catch(() => undefined);
        } else {
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
      } else {
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
    } catch (error) {
      this.serviceContainer
        .getLogManager()
        .errorLog('EXECUTION_FAILED', { apiName, err: getFormattedErrorMessage(error) }, { an: ApiEnum.SET_ALIAS });
      return false;
    }
  }

  /**
   * Applies the Pulse identity rules when Pulse pre-seg is enabled and the feature uses survey segments.
   * @param featureKey - Feature being evaluated.
   * @param context - Original getFlag context.
   * @param apiName - Calling API name for UUID derivation logs.
   * @returns {Record<string, any>} Context to continue evaluation with (may use `_vwo_uuid` as id).
   */
  private applyPulsePreSegmentationIdentity(
    featureKey: string,
    context: Record<string, any>,
    apiName: string,
  ): Record<string, any> {
    // Pulse identity is inactive unless the init flag is on
    const isPulsePreSegmentEnabled = this.serviceContainer.getWingifyOptions()?.isPulsePreSegmentEnabled === true;
    if (!isPulsePreSegmentEnabled) {
      return isObject(context) ? { ...context } : {};
    }
    // getFlag only adopts the cookie when this feature's rules use Pulse survey segments
    const feature = getFeatureFromKey(this.serviceContainer.getSettings(), featureKey);
    const hasPulseSurveyPreSegmentation = featureHasPulseSurveyPreSegmentation(
      feature,
      this.serviceContainer.getSettings(),
    );
    if (!hasPulseSurveyPreSegmentation) {
      return isObject(context) ? { ...context } : {};
    }
    return this.applyPulseCookieIdentity(context, apiName);
  }

  /**
   * Applies SmartCode `_vwo_uuid` cookie identity when Pulse pre-segmentation is enabled at init.
   * Shared by getFlag (after feature gate), trackEvent, and setAttribute.
   *
   * @param context - Caller context; may omit `id` when the cookie should identify the visitor.
   * @param apiName - Calling API name for UUID derivation when comparing ids.
   * @returns {Record<string, any>} Context to evaluate with (may set `id` from the cookie).
   */
  private applyPulseCookieIdentity(context: Record<string, any> | undefined, apiName: string): Record<string, any> {
    const isPulsePreSegmentEnabled = this.serviceContainer.getWingifyOptions()?.isPulsePreSegmentEnabled === true;
    // Leave context unchanged when Pulse pre-seg is disabled at init
    if (!isPulsePreSegmentEnabled) {
      return isObject(context) ? { ...context } : {};
    }
    const pulseVisitorUuid = getVwoUuidFromCookie();
    let convertedUserUuid: string | null = null;
    if (context?.id) {
      try {
        // Compare the caller's id to the cookie using the same uuid rules as getFlag
        convertedUserUuid = this.getUUIDFromContext(context, apiName);
      } catch {
        convertedUserUuid = null;
      }
    }
    return resolvePulsePreSegmentationIdentity(context, pulseVisitorUuid, convertedUserUuid, (message) =>
      this.serviceContainer.getLogManager().error(message),
    );
  }

  /**
   * Generates a UUID from the context.id
   * @param context - The context to generate the UUID from
   * @param apiName - The name of the API calling this method
   * @returns The UUID generated from the context.id
   */
  private getUUIDFromContext(context: Record<string, any>, apiName: string): string {
    if (this.settings.getIsWebConnectivityEnabled() !== false) {
      // if web connectivity is enabled, check if context.id is a valid web UUID
      if (isWebUuid(context?.id)) {
        // if context.id is a valid web UUID, set it as uuid
        this.serviceContainer.getLogManager().debug(
          buildMessage(DebugLogMessagesEnum.WEB_UUID_FOUND, {
            apiName,
            uuid: context.id,
          }),
        );
        return context.id;
      } else {
        // if context?.useIdForWeb is true and context.id is not a valid web UUID, throw error
        if (context?.useIdForWeb === true) {
          throw new Error('UUID passed in context.id is not a valid UUID');
        }
        // if context?.useIdForWeb is false, fallback to server‑side UUID derivation
        return getUUID(
          context?.id?.toString() ?? `${this.options?.accountId}_${this.options?.sdkKey}`,
          this.options?.accountId?.toString(),
        );
      }
    } else {
      // if web connectivity is disabled, fallback to server‑side UUID derivation
      return getUUID(
        context?.id?.toString() ?? `${this.options?.accountId}_${this.options?.sdkKey}`,
        this.options?.accountId?.toString(),
      );
    }
  }

  /**
   * Shuts down the client: flushes pending batch events (and clears the batch timer) via flushEvents(),
   * then clears the batch queue so no further events are enqueued. Idempotent.
   */
  async shutdown(): Promise<void> {
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
      ServiceContainerRegistry.unregister(this.serviceContainer);
      this.serviceContainer.stopPolling();
      if (this.serviceContainer.getBatchEventsQueue()) {
        await this.flushEvents();
        this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SHUTDOWN_COMPLETED_WITH_FLUSH));
        this.serviceContainer.setBatchEventsQueue(null);
      } else {
        this.serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.SHUTDOWN_COMPLETED_WITHOUT_FLUSH));
      }
    } catch (err) {
      this.serviceContainer
        .getLogManager()
        .errorLog(
          'EXECUTION_FAILED',
          { apiName: ApiEnum.SHUTDOWN, err: getFormattedErrorMessage(err) },
          { an: ApiEnum.SHUTDOWN },
        );
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
  private handleSettingsControlFlags(
    settings: Record<string, any>,
    mode: SettingsControlApplyMode = SettingsControlApplyMode.APPLY,
  ): void {
    const panicModeForcedRefreshControl = this.serviceContainer.getPanicModeForcedRefreshControlService();
    const settingsSnapshotControlOutcome = panicModeForcedRefreshControl.applySettingsControl(settings, mode);

    if (settingsSnapshotControlOutcome.needsCollectPingConfirmation) {
      void this.confirmControlViaCollectPing();
    }

    if (!settingsSnapshotControlOutcome.shouldTriggerForceRefresh || !panicModeForcedRefreshControl.tryStartRefresh()) {
      return;
    }

    this.updateSettings(
      undefined,
      true,
      settingsSnapshotControlOutcome.isRefreshFromPanicClear,
      SettingsControlApplyMode.POST_PING_FETCH,
    ).finally(() => {
      panicModeForcedRefreshControl.finishRefresh(settingsSnapshotControlOutcome.isRefreshFromPanicClear);
    });
  }

  /**
   * Confirms panic with a control ping. DaCDN response is the source of truth.
   */
  private async confirmControlViaCollectPing(): Promise<void> {
    const panicModeForcedRefreshControl = this.serviceContainer.getPanicModeForcedRefreshControlService();
    if (!panicModeForcedRefreshControl.tryStartPanicClearConfirmation()) {
      return;
    }

    try {
      const settingsService = this.serviceContainer.getSettingsService();
      const userId = `${settingsService.accountId}_${settingsService.sdkKey}`;
      const uuid = getUUID(`${settingsService.accountId}_${settingsService.sdkKey}`, String(settingsService.accountId));

      await sendPanicCollectHeartbeatRequest(this.serviceContainer, { id: userId, uuid });
    } catch {
      // Fail-safe: keep current latch when confirmation ping fails.
    } finally {
      panicModeForcedRefreshControl.finishPanicClearConfirmation();
    }
  }
}
