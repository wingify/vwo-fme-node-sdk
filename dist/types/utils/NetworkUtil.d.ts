import { ResponseModel } from '../packages/network-layer';
import { SettingsService } from '../services/SettingsService';
import { dynamic } from '../types/Common';
import { UsageStatsUtil } from './UsageStatsUtil';
import { ContextModel } from '../models/user/ContextModel';
import { ServiceContainer } from '../services/ServiceContainer';
/**
 * Constructs the settings path with API key and account ID.
 * @param {string} sdkKey - The API key.
 * @param {any} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The settings path including API key, random number, and account ID.
 */
export declare function getSettingsPath(sdkKey: string, accountId: string | number): Record<string, dynamic>;
/**
 * Constructs the tracking path for an event.
 * @param {string} event - The event type.
 * @param {string} accountId - The account identifier.
 * @param {string} userId - The user identifier.
 * @returns {Record<string, dynamic>} - The tracking path for the event.
 */
export declare function getTrackEventPath(event: string, accountId: string, userId: string): Record<string, dynamic>;
/**
 * Builds generic properties for different tracking calls required by VWO servers.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param {String} eventName
 * @param {String} visitorUserAgent - The visitor user agent.
 * @param {String} ipAddress - The visitor IP address.
 * @param {Boolean} isUsageStatsEvent - Whether the event is a usage stats event.
 * @param {Number} usageStatsAccountId - The usage stats account ID.
 * @returns {Record<string, any>} - The properties for the event.
 */
export declare function getEventsBaseProperties(
  settingsService: SettingsService,
  eventName: string,
  visitorUserAgent?: string,
  ipAddress?: string,
  isUsageStatsEvent?: boolean,
  usageStatsAccountId?: number,
): Record<string, any>;
/**
 * Builds generic payload required by all the different tracking calls.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param {String} userId     user id
 * @param {String} eventName  event name
 * @param {String} visitorUserAgent - The visitor user agent.
 * @param {String} ipAddress - The visitor IP address.
 * @param {Boolean} isUsageStatsEvent - Whether the event is a usage stats event.
 * @param {Number} usageStatsAccountId - The usage stats account ID.
 * @param {Boolean} shouldGenerateUUID - Whether to generate a UUID.
 * @returns {Record<string, any>} - The payload for the event.
 */
export declare function _getEventBasePayload(
  settingsService: SettingsService,
  userId: string | number,
  eventName: string,
  visitorUserAgent?: string,
  ipAddress?: string,
  isUsageStatsEvent?: boolean,
  usageStatsAccountId?: number,
  shouldGenerateUUID?: boolean,
): Record<string, any>;
/**
 * Builds payload to track the visitor.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {String} eventName - The name of the event.
 * @param {Number} campaignId - The campaign ID.
 * @param {Number} variationId - The variation ID.
 * @param {ContextModel} context - The context model instance.
 * @returns {Record<string, any>} - The payload for the event.
 */
export declare function getTrackUserPayloadData(
  serviceContainer: ServiceContainer,
  eventName: string,
  campaignId: number,
  variationId: number,
  context: ContextModel,
): Record<string, any>;
/**
 * Constructs the payload data for tracking goals with custom event properties.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {any} userId - User identifier.
 * @param {string} eventName - Name of the event.
 * @param {any} eventProperties - Custom properties for the event.
 * @param {string} [visitorUserAgent=''] - Visitor's user agent.
 * @param {string} [ipAddress=''] - Visitor's IP address.
 * @returns {any} - The constructed payload data.
 */
export declare function getTrackGoalPayloadData(
  serviceContainer: ServiceContainer,
  userId: string | number,
  eventName: string,
  eventProperties: Record<string, any>,
  visitorUserAgent?: string,
  ipAddress?: string,
  sessionId?: number,
): Record<string, any>;
/**
 * Constructs the payload data for syncing multiple visitor attributes.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {string | number} userId - User ID.
 * @param {string} eventName - Event name.
 * @param {Record<string, any>} attributes - Key-value map of attributes.
 * @param {string} [visitorUserAgent=''] - Visitor's User-Agent (optional).
 * @param {string} [ipAddress=''] - Visitor's IP Address (optional).
 * @returns {Record<string, any>} - Payload object to be sent in the request.
 */
export declare function getAttributePayloadData(
  serviceContainer: ServiceContainer,
  userId: string | number,
  eventName: string,
  attributes: Record<string, any>,
  visitorUserAgent?: string,
  ipAddress?: string,
  sessionId?: number,
): Record<string, any>;
/**
 * Sends a POST API request with the specified properties and payload.
 * @param {ServiceContainer} serviceContainer - The service container instance.
 * @param {any} properties - Properties for the request.
 * @param {any} payload - Payload for the request.
 * @param {string} userId - User ID.
 */
export declare function sendPostApiRequest(
  serviceContainer: ServiceContainer,
  properties: any,
  payload: any,
  userId: string,
  eventProperties?: any,
  campaignInfo?: any,
): Promise<void>;
/**
 * Constructs the payload for a messaging event.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param messageType - The type of the message.
 * @param message - The message to send.
 * @param eventName - The name of the event.
 * @returns The constructed payload.
 */
export declare function getMessagingEventPayload(
  settingsService: SettingsService,
  messageType: string,
  message: string,
  eventName: string,
  extraData?: any,
): Record<string, any>;
/**
 * Constructs the payload for init called event.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
export declare function getSDKInitEventPayload(
  settingsService: SettingsService,
  eventName: string,
  settingsFetchTime?: number,
  sdkInitTime?: number,
): Record<string, any>;
/**
 * Constructs the payload for sdk usage stats event.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param eventName - The name of the event.
 * @param settingsFetchTime - Time taken to fetch settings in milliseconds.
 * @param sdkInitTime - Time taken to initialize the SDK in milliseconds.
 * @returns The constructed payload with required fields.
 */
export declare function getSDKUsageStatsEventPayload(
  settingsService: SettingsService,
  eventName: string,
  usageStatsAccountId: number,
  usageStatsUtil: UsageStatsUtil,
): Record<string, any>;
/**
 * Constructs the payload for debugger event.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param eventProps - The properties for the event.
 * @returns The constructed payload.
 */
export declare function getDebuggerEventPayload(
  settingsService: SettingsService,
  eventProps?: Record<string, any>,
): Record<string, any>;
/**
 * Sends an event to VWO (generic event sender).
 * @param {NetworkManager} networkManager - The network manager instance.
 * @param {SettingsService} settingsService - The settings service instance.
 * @param properties - Query parameters for the request.
 * @param payload - The payload for the request.
 * @param eventName - The name of the event to send.
 * @returns A promise that resolves to the response from the server.
 */
export declare function sendEvent(
  serviceContainer: ServiceContainer,
  properties: Record<string, any>,
  payload: Record<string, any>,
  eventName: string,
): Promise<any>;
/**
 * Creates a network and retry debug event.
 * @param response The response model.
 * @param payload The payload for the request.
 * @param apiName The name of the API.
 * @param extraData Extra data for the message.
 * @param isBatchingDebugEvent Whether the debug event was triggered due to batching.
 * @returns The debug event properties.
 */
export declare function createNetWorkAndRetryDebugEvent(
  response: ResponseModel,
  payload: any,
  apiName: string,
  extraData: string,
): Record<string, any>;
