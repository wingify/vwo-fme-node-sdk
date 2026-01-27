import { ContextModel } from '../models/user/ContextModel';
import { dynamic } from '../types/Common';
import { ServiceContainer } from '../services/ServiceContainer';
interface ITrack {
  /**
   * Tracks an event with given properties and context.
   * @param serviceContainer Service container.
   * @param eventName Name of the event to track.
   * @param context Contextual information like user details.
   * @param eventProperties Properties associated with the event.
   * @returns A promise that resolves to a record indicating the success or failure of the event tracking.
   */
  track(
    serviceContainer: ServiceContainer,
    eventName: string,
    context: ContextModel,
    eventProperties: Record<string, dynamic>,
  ): Promise<Record<string, boolean>>;
}
export declare class TrackApi implements ITrack {
  /**
   * Implementation of the track method to handle event tracking.
   * Checks if the event exists, creates an impression, and executes hooks.
   */
  track(
    serviceContainer: ServiceContainer,
    eventName: string,
    context: ContextModel,
    eventProperties: Record<string, dynamic>,
  ): Promise<Record<string, boolean>>;
}
export {};
