import { SettingsModel } from '../models/settings/SettingsModel';
import { ContextModel } from '../models/user/ContextModel';
import IHooksService from '../services/HooksService';
import { dynamic } from '../types/Common';
interface ITrack {
    /**
     * Tracks an event with given properties and context.
     * @param settings Configuration settings for the tracking.
     * @param eventName Name of the event to track.
     * @param context Contextual information like user details.
     * @param eventProperties Properties associated with the event.
     * @param hooksService Manager for handling hooks and callbacks.
     * @returns A promise that resolves to a record indicating the success or failure of the event tracking.
     */
    track(settings: SettingsModel, eventName: string, context: ContextModel, eventProperties: Record<string, dynamic>, hooksService: IHooksService): Promise<Record<string, boolean>>;
}
export declare class TrackApi implements ITrack {
    /**
     * Implementation of the track method to handle event tracking.
     * Checks if the event exists, creates an impression, and executes hooks.
     */
    track(settings: SettingsModel, eventName: string, context: ContextModel, eventProperties: Record<string, dynamic>, hooksService: IHooksService): Promise<Record<string, boolean>>;
}
export {};
