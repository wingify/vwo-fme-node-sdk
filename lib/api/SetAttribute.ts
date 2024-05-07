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
