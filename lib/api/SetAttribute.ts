/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
   * Sets multiple attributes for a user in a single network call.
   * @param settings Configuration settings.
   * @param attributes Key-value map of attributes.
   * @param context Context containing user information.
   */
  setAttribute(
    settings: SettingsModel,
    attributes: Record<string, boolean | string | number>,
    context: ContextModel,
  ): Promise<void>;
}

export class SetAttributeApi implements ISetAttribute {
  /**
   * Implementation of setAttributes to create an impression for multiple user attributes.
   * @param settings Configuration settings.
   * @param attributes Key-value map of attributes.
   * @param context Context containing user information.
   */
  async setAttribute(
    settings: SettingsModel,
    attributes: Record<string, boolean | string | number>,
    context: ContextModel,
  ): Promise<void> {
    if (getShouldWaitForTrackingCalls()) {
      await createImpressionForAttributes(settings, attributes, context);
    } else {
      createImpressionForAttributes(settings, attributes, context);
    }
  }
}

/**
 * Creates an impression for multiple user attributes and sends it to the server.
 * @param settings Configuration settings.
 * @param attributes Key-value map of attributes.
 * @param context Context containing user information.
 */
const createImpressionForAttributes = async (
  settings: SettingsModel,
  attributes: Record<string, boolean | string | number>,
  context: ContextModel,
) => {
  // Retrieve base properties for the event
  const properties = getEventsBaseProperties(
    EventEnum.VWO_SYNC_VISITOR_PROP,
    encodeURIComponent(context.getUserAgent()),
    context.getIpAddress(),
  );
  // Construct payload data for multiple attributes
  const payload = getAttributePayloadData(
    settings,
    context.getId(),
    EventEnum.VWO_SYNC_VISITOR_PROP,
    attributes,
    context.getUserAgent(),
    context.getIpAddress(),
  );

  // Send the constructed payload via POST request
  await sendPostApiRequest(properties, payload, context.getId());
};
