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
import { Flag } from './api/GetFlag';
import { SettingsModel } from './models/settings/SettingsModel';
import { dynamic } from './types/Common';
import { IVWOOptions } from './models/VWOOptionsModel';
import { ServiceContainer } from './services/ServiceContainer';
export interface IVWOClient {
  readonly options?: IVWOOptions;
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  isSettingsValid: boolean;
  settingsFetchTime: number | undefined;
  isAliasingEnabled: boolean;
  getFlag(featureKey: string, context: Record<string, any>): Promise<Flag>;
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
  updateSettings(settings?: Record<string, any>, isViaWebhook?: boolean): Promise<void>;
  flushEvents(): Promise<Record<string, any>>;
  setAlias(context: Record<string, any> | string, aliasId: string): Promise<boolean>;
}
export declare class VWOClient implements IVWOClient {
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  storage: Storage;
  vwoClientInstance: VWOClient;
  isSettingsValid: boolean;
  settingsFetchTime: number | undefined;
  isAliasingEnabled: boolean;
  serviceContainer: ServiceContainer;
  options?: IVWOOptions;
  /**
   * Constructor for the VWOClient class.
   * @param settings - The settings to initialize the client with.
   * @param options - The options to initialize the client with.
   * @param logManager - The log manager to use for logging.
   * @param settingsService - The settings service to use for fetching settings.
   * @param networkManager - The network manager to use for making network requests.
   * @param storage - The storage to use for storing data.
   * @param batchEventsQueue - The batch events queue to use for batching events.
   */
  constructor(settings: Record<any, any>, options: IVWOOptions, serviceContainer: ServiceContainer);
  /**
   * Sends the SDK init event and usage stats event
   * @param usageStatsUtil - The usage stats util to use for sending the usage stats event
   */
  private sendSdkInitAndUsageStatsEvents;
  /**
   * Retrieves the value of a feature flag for a given feature key and context.
   * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
   *
   * @param {string} featureKey - The key of the feature to retrieve.
   * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
   * @returns {Promise<Flag>} - A promise that resolves to the feature flag value.
   */
  getFlag(featureKey: string, context: Record<string, any>): Promise<Flag>;
  /**
   * Tracks an event with specified properties and context.
   * This method validates the types of the inputs and ensures the settings and user context are valid before proceeding.
   *
   * @param {string} eventName - The name of the event to track.
   * @param {ContextModel} context - The context in which the event is being tracked, must include a valid user ID.
   * @param {Record<string, dynamic>} eventProperties - The properties associated with the event.
   * @returns {Promise<Record<string, boolean>>} - A promise that resolves to the result of the tracking operation.
   */
  trackEvent(
    eventName: string,
    context: Record<string, any>,
    eventProperties?: Record<string, dynamic>,
  ): Promise<Record<string, boolean>>;
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
  setAttribute(
    attributeOrAttributes: string | Record<string, boolean | string | number>,
    attributeValueOrContext?: boolean | string | number | Record<string, any>,
    context?: Record<string, any>,
  ): Promise<void>;
  /**
   * Updates the settings by fetching the latest settings from the VWO server.
   * @param settings - The settings to update.
   * @param isViaWebhook - Whether to fetch the settings from the webhook endpoint.
   * @returns Promise<void>
   */
  updateSettings(settings?: Record<string, any>, isViaWebhook?: boolean): Promise<void>;
  /**
   * Flushes the events manually from the batch events queue
   */
  flushEvents(): Promise<Record<string, any>>;
  /**
   * Sets alias for a given user ID
   * @param contextOrUserId - The context containing user ID or the user ID directly
   * @param aliasId - The alias identifier to set
   * @returns Promise<boolean> - Returns true if successful, false otherwise
   */
  setAlias(contextOrUserId: Record<string, any> | string, aliasId: string): Promise<boolean>;
}
