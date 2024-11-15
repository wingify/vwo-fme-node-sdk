import { Storage } from './packages/storage';
import { SettingsModel } from './models/settings/SettingsModel';
import { dynamic } from './types/Common';
import { IVWOOptions } from './models/VWOOptionsModel';
export interface IVWOClient {
  readonly options?: IVWOOptions;
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  getFlag(featureKey: string, context: Record<string, any>): Record<any, any>;
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
}
export declare class VWOClient implements IVWOClient {
  settings: SettingsModel;
  originalSettings: Record<any, any>;
  storage: Storage;
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
  getFlag(featureKey: string, context: Record<string, any>): Record<any, any>;
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
   * Sets an attribute for a user in the context provided.
   * This method validates the types of the inputs before proceeding with the API call.
   *
   * @param {string} attributeKey - The key of the attribute to set.
   * @param {string} attributeValue - The value of the attribute to set.
   * @param {ContextModel} context - The context in which the attribute should be set, must include a valid user ID.
   */
  setAttribute(
    attributeKey: string,
    attributeValue: boolean | string | number,
    context: Record<string, any>,
  ): Promise<void>;
}
