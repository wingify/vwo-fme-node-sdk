import { SettingsModel } from "../models/settings/SettingsModel";
import { NetworkUtil } from "./NetworkUtil";
import { ContextModel } from "../models/user/ContextModel";
import { EventEnum } from "../enums/EventEnum";

export const createAndSendImpressionForVariationShown = (
  settings: SettingsModel,
  campaignId: number,
  variationId: number,
  context: ContextModel,
) => {
  const networkUtil = new NetworkUtil();
  const properties = networkUtil.getEventsBaseProperties(
    settings,
    EventEnum.VWO_VARIATION_SHOWN,
    encodeURIComponent(context.getUserAgent()),
    context.getIpAddress(),
  );
  const payload = networkUtil.getTrackUserPayloadData(
    settings,
    context.getId(),
    EventEnum.VWO_VARIATION_SHOWN,
    campaignId,
    variationId,
    context.getUserAgent(),
    context.getIpAddress(),
  );

  networkUtil.sendPostApiRequest(properties, payload);
};
