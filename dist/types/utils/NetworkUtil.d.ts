import { SettingsModel } from '../models/settings/SettingsModel';
import { dynamic } from '../types/Common';
/**
 * Constructs base properties for bulk operations.
 * @param {string} accountId - The account identifier.
 * @param {string} userId - The user identifier.
 * @returns {Record<string, dynamic>} - The base properties including session ID and UUID.
 */
export declare function getBasePropertiesForBulk(accountId: string, userId: string): Record<string, dynamic>;
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
 * Constructs query parameters for event batching.
 * @param {string} accountId - The account identifier.
 * @returns {Record<string, dynamic>} - The query parameters for event batching.
 */
export declare function getEventBatchingQueryParams(accountId: string): Record<string, dynamic>;
/**
 * Builds generic properties for different tracking calls required by VWO servers.
 * @param {Object} configObj
 * @param {String} eventName
 * @returns properties
 */
export declare function getEventsBaseProperties(
  setting: SettingsModel,
  eventName: string,
  visitorUserAgent?: string,
  ipAddress?: string,
): Record<string, any>;
/**
 * Builds generic payload required by all the different tracking calls.
 * @param {Object} settings   settings file
 * @param {String} userId     user id
 * @param {String} eventName  event name
 * @returns properties
 */
export declare function _getEventBasePayload(
  settings: SettingsModel,
  userId: string | number,
  eventName: string,
  visitorUserAgent?: string,
  ipAddress?: string,
): Record<string, any>;
/**
 * Builds payload to track the visitor.
 * @param {Object} configObj
 * @param {String} userId
 * @param {String} eventName
 * @param {String} campaignId
 * @param {Number} variationId
 * @returns track-user payload
 */
export declare function getTrackUserPayloadData(
  settings: SettingsModel,
  userId: string | number,
  eventName: string,
  campaignId: number,
  variationId: number,
  visitorUserAgent?: string,
  ipAddress?: string,
): Record<string, any>;
/**
 * Constructs the payload data for tracking goals with custom event properties.
 * @param {any} settings - Configuration settings.
 * @param {any} userId - User identifier.
 * @param {string} eventName - Name of the event.
 * @param {any} eventProperties - Custom properties for the event.
 * @param {string} [visitorUserAgent=''] - Visitor's user agent.
 * @param {string} [ipAddress=''] - Visitor's IP address.
 * @returns {any} - The constructed payload data.
 */
export declare function getTrackGoalPayloadData(
  settings: SettingsModel,
  userId: string | number,
  eventName: string,
  eventProperties: Record<string, any>,
  visitorUserAgent?: string,
  ipAddress?: string,
): Record<string, any>;
/**
 * Constructs the payload data for syncing visitor attributes.
 * @param {any} settings - Configuration settings.
 * @param {any} userId - User identifier.
 * @param {string} eventName - Name of the event.
 * @param {any} attributeKey - Key of the attribute to sync.
 * @param {any} attributeValue - Value of the attribute.
 * @param {string} [visitorUserAgent=''] - Visitor's user agent.
 * @param {string} [ipAddress=''] - Visitor's IP address.
 * @returns {any} - The constructed payload data.
 */
export declare function getAttributePayloadData(
  settings: SettingsModel,
  userId: string | number,
  eventName: string,
  attributeKey: string,
  attributeValue: dynamic,
  visitorUserAgent?: string,
  ipAddress?: string,
): Record<string, any>;
/**
 * Sends a POST API request with the specified properties and payload.
 * @param {any} properties - Properties for the request.
 * @param {any} payload - Payload for the request.
 */
export declare function sendPostApiRequest(properties: any, payload: any): void;
/**
 * Sends a GET API request to the specified endpoint with the given properties.
 * @param {any} properties - Properties for the request.
 * @param {any} endpoint - Endpoint for the GET request.
 * @returns {Promise<any>} - The response from the GET request.
 */
export declare function sendGetApiRequest(properties: any, endpoint: any): Promise<any>;
