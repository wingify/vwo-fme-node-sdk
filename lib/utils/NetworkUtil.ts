import { getUUID } from './UuidUtil';
import { getRandomNumber, getCurrentUnixTimestamp } from './FunctionUtil';

import { dynamic } from '../types/common';
import { Constants } from '../constants';


export class NetworkUtil {
  getBasePropertiesForBulk(accountId: string, userId: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      sId: getCurrentUnixTimestamp(),
      u: getUUID(userId, accountId)
    };
    return path;
  }

  getSettingsPath(apikey: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      i: `${apikey}`,
      r: Math.random()
    };
    return path;
  }

  getTrackEventPath(event: string, accountId: string, userId: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      event_type: event,
      account_id: accountId,
      uId: userId,
      u: getUUID(userId, accountId),
      sdk: Constants.SDK_NAME,
      'sdk-v': Constants.SDK_VERSION,
      random: getRandomNumber(),
      ap: Constants.AP,
      sId: getCurrentUnixTimestamp(),
      ed: JSON.stringify({ p: 'server' })
    };

    return path;
  }

  getEventBatchingQueryParams(accountId: string): Record<string, dynamic> {
    const path: Record<string, dynamic> = {
      a: accountId,
      sd: Constants.SDK_NAME,
      sv: Constants.SDK_VERSION
    };

    return path;
  }
}
