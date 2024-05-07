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
import { eventExists } from '../utils/FunctionUtil';
import { NetworkUtil } from '../utils/NetworkUtil';

interface ITrack {
  track(
    settings: any,
    eventName: string,
    eventProperties: any,
    context: any,
    hookManager: HooksManager,
  ): Promise<Record<string, boolean>>;
}

export class TrackApi implements ITrack {
  async track(
    settings: any,
    eventName: string,
    eventProperties: any,
    context: any,
    hookManager: HooksManager,
  ): Promise<Record<string, boolean>> {
    if (eventExists(eventName, settings)) {
      // create impression for track
      createImpressionForTrack(settings, eventName, context.user, eventProperties);
      // integeration callback for track
      hookManager.set({ eventName: eventName, api: ApiEnum.TRACK });
      hookManager.execute(hookManager.get());
      return { [eventName]: true };
    }
    LogManager.Instance.error(`Event ${eventName} not found in any of the features`);
    return { [eventName]: false };
  }
}

const createImpressionForTrack = async (settings: any, eventName: string, user: any, eventProperties: any) => {
  const networkUtil = new NetworkUtil();
  const properties = networkUtil.getEventsBaseProperties(settings, eventName, user.userAgent, user.ipAddress);
  const payload = networkUtil.getTrackGoalPayloadData(
    settings,
    user.id,
    eventName,
    eventProperties,
    user.userAgent,
    user.ipAddress,
  );
  // console.log('track payload is ', JSON.stringify(payload));
  networkUtil.sendPostApiRequest(properties, payload);
};
