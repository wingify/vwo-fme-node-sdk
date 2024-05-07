import { EventEnum } from '../enums/EventEnum';
import { NetworkUtil } from '../utils/NetworkUtil';

interface ISetAttribute {
  setAttribute(settings: any, attributeKey: string, attributeValue: any, context: any): void;
}

export class SetAttributeApi implements ISetAttribute {
  setAttribute(settings: any, attributeKey: string, attributeValue: any, context: any): void {
    createImpressionForAttribute(settings, attributeKey, attributeValue, context.user);
  }
}

const createImpressionForAttribute = async (settings: any, attributeKey: string, attributeValue: any, user: any) => {
  const networkUtil = new NetworkUtil();
  const properties = networkUtil.getEventsBaseProperties(
    settings,
    EventEnum.VWO_SYNC_VISITOR_PROP,
    user.userAgent,
    user.ipAddress,
  );
  const payload = networkUtil.getAttributePayloadData(
    settings,
    user.id,
    EventEnum.VWO_SYNC_VISITOR_PROP,
    attributeKey,
    attributeValue,
    user.userAgent,
    user.ipAddress,
  );
  // console.log(' payload is ', JSON.stringify(payload));
  networkUtil.sendPostApiRequest(properties, payload);
};
