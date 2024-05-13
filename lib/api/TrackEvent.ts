/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
import { ApiEnum } from '../enums/ApiEnum';
import { LogManager } from '../modules/logger';
import HooksManager from '../services/HooksManager';
import { doesEventBelongToAnyFeature } from '../utils/FunctionUtil';
import { NetworkUtil } from '../utils/NetworkUtil';

interface ITrack {
  /**
   * Tracks an event with given properties and context.
   * @param settings Configuration settings for the tracking.
   * @param eventName Name of the event to track.
   * @param eventProperties Properties associated with the event.
   * @param context Contextual information like user details.
   * @param hookManager Manager for handling hooks and callbacks.
   * @returns A promise that resolves to a record indicating the success or failure of the event tracking.
   */
  track(
    settings: any,
    eventName: string,
    eventProperties: any,
    context: any,
    hookManager: HooksManager,
  ): Promise<Record<string, boolean>>;
}

export class TrackApi implements ITrack {
  /**
   * Implementation of the track method to handle event tracking.
   * Checks if the event exists, creates an impression, and executes hooks.
   */
  async track(
    settings: any,
    eventName: string,
    eventProperties: any,
    context: any,
    hookManager: HooksManager,
  ): Promise<Record<string, boolean>> {
    if (doesEventBelongToAnyFeature(eventName, settings)) {
      // Create an impression for the track event
      createImpressionForTrack(settings, eventName, context, eventProperties);
      // Set and execute integration callback for the track event
      hookManager.set({ eventName: eventName, api: ApiEnum.TRACK });
      hookManager.execute(hookManager.get());
      return { [eventName]: true };
    }
    // Log an error if the event does not exist
    LogManager.Instance.error(`Event ${eventName} not found in any of the features`);
    return { [eventName]: false };
  }
}

/**
 * Creates an impression for a track event and sends it via a POST API request.
 * @param settings Configuration settings for the tracking.
 * @param eventName Name of the event to track.
 * @param user User details.
 * @param eventProperties Properties associated with the event.
 */
const createImpressionForTrack = async (settings: any, eventName: string, user: any, eventProperties: any) => {
  const networkUtil = new NetworkUtil();
  // Get base properties for the event
  const properties = networkUtil.getEventsBaseProperties(settings, eventName, user.userAgent, user.ipAddress);
  // Prepare the payload for the track goal
  const payload = networkUtil.getTrackGoalPayloadData(
    settings,
    user.id,
    eventName,
    eventProperties,
    user.userAgent,
    user.ipAddress,
  );
  // Send the prepared payload via POST API request
  networkUtil.sendPostApiRequest(properties, payload);
};
