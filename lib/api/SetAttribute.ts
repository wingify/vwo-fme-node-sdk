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
import { ContextModel } from '../models/user/ContextModel';
import { EventEnum } from '../enums/EventEnum';
import {
  getEventsBaseProperties,
  getAttributePayloadData,
  sendPostApiRequest,
  getShouldWaitForTrackingCalls,
} from '../utils/NetworkUtil';
import { SettingsModel } from '../models/settings/SettingsModel';

interface ISetAttribute {
  /**
   * Sets an attribute for a user.
   * @param settings Configuration settings.
   * @param attributeKey The key of the attribute to set.
   * @param attributeValue The value of the attribute.
   * @param context Context containing user information.
   */
  setAttribute(
    settings: SettingsModel,
    attributeKey: string,
    attributeValue: any,
    context: ContextModel,
  ): Promise<void>;
}

export class SetAttributeApi implements ISetAttribute {
  /**
   * Implementation of setAttribute to create an impression for a user attribute.
   * @param settings Configuration settings.
   * @param attributeKey The key of the attribute to set.
   * @param attributeValue The value of the attribute.
   * @param context Context containing user information.
   */
  async setAttribute(
    settings: SettingsModel,
    attributeKey: string,
    attributeValue: any,
    context: ContextModel,
  ): Promise<void> {
    if (getShouldWaitForTrackingCalls()) {
      await createImpressionForAttribute(settings, attributeKey, attributeValue, context);
    } else {
      createImpressionForAttribute(settings, attributeKey, attributeValue, context);
    }
  }
}

/**
 * Creates an impression for a user attribute and sends it to the server.
 * @param settings Configuration settings.
 * @param attributeKey The key of the attribute.
 * @param attributeValue The value of the attribute.
 * @param user User details.
 */
const createImpressionForAttribute = async (
  settings: SettingsModel,
  attributeKey: string,
  attributeValue: any,
  context: ContextModel,
) => {
  // Retrieve base properties for the event
  const properties = getEventsBaseProperties(
    settings,
    EventEnum.VWO_SYNC_VISITOR_PROP,
    encodeURIComponent(context.getUserAgent()),
    context.getIpAddress(),
  );
  // Construct payload data for the attribute
  const payload = getAttributePayloadData(
    settings,
    context.getId(),
    EventEnum.VWO_SYNC_VISITOR_PROP,
    attributeKey,
    attributeValue,
    context.getUserAgent(),
    context.getIpAddress(),
  );

  // Send the constructed payload via POST request
  await sendPostApiRequest(properties, payload);
};
