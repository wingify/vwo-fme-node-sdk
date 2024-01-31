import { NetworkUtil } from "../utils/NetworkUtil";
import { eventExists } from "../utils/FunctionUtil";
import { EventEnum } from "../enums/EventEnum";
import { LogManager } from "../modules/logger";

interface ITrack {
    track(settings: any, eventName: string, context: any, eventProperties: any): Promise<Record<string, boolean>>;
}

export class TrackApi implements ITrack {
    async track(settings: any, eventName: string, context: any, eventProperties: any): Promise<Record<string, boolean>> {
        if (eventExists(eventName, settings)) {
            createImpressionForTrack(settings, eventName, context.user, eventProperties);
            return { [eventName]: true };
        }
        LogManager.Instance.error(`Event ${eventName} not found in any of the features`);
        return { [eventName]: false };
    }
}

const createImpressionForTrack = async (settings: any, eventName: string, user: any, eventProperties: any) => {
    const networkUtil = new NetworkUtil();
    const properties =networkUtil.getEventsBaseProperties(
      settings,
      eventName,
      user.userAgent,
      user.userIpAddress,
    );
    const payload = networkUtil.getTrackGoalPayloadData(
      settings,
      user.id,
      eventName,
      eventProperties
    );
    // console.log('track payload is ', JSON.stringify(payload));
    // networkUtil.sendPostApiRequest(properties, payload);
  }