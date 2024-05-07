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
