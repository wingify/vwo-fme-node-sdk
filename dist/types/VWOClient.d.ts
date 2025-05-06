import { Storage } from './packages/storage';
import { SettingsModel } from './models/settings/SettingsModel';
import { dynamic } from './types/Common';
import { IVWOOptions } from './models/VWOOptionsModel';
export interface IVWOClient {
  readonly options?: IVWOOptions;
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  getFlag(featureKey: string, context: Record<string, any>): Promise<Record<any, any>>;
  trackEvent(
    eventName: string,
    context: Record<string, any>,
    eventProperties: Record<string, dynamic>,
  ): Promise<Record<string, boolean>>;
  setAttribute(
    attributeKey: string,
    attributeValue: boolean | string | number,
    context: Record<string, any>,
  ): Promise<void>;
  setAttribute(attributes: Record<string, boolean | string | number>, context: Record<string, any>): Promise<void>;
  updateSettings(settings?: Record<string, any>, isViaWebhook?: boolean): Promise<void>;
  flushEvents(): Promise<Record<string, any>>;
}
export declare class VWOClient implements IVWOClient {
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  storage: Storage;
  vwoClientInstance: VWOClient;
  constructor(settings: Record<any, any>, options: IVWOOptions);
  options?: IVWOOptions;
  /**
   * Retrieves the value of a feature flag for a given feature key and context.
   * This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.
   *
   * @param {string} featureKey - The key of the feature to retrieve.
   * @param {ContextModel} context - The context in which the feature flag is being retrieved, must include a valid user ID.
   * @returns {Promise<Record<any, any>>} - A promise that resolves to the feature flag value.
   */
  getFlag(featureKey: string, context: Record<string, any>): Promise<Record<any, any>>;
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
}
