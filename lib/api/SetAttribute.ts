/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { getEventsBaseProperties, getAttributePayloadData, sendPostApiRequest } from '../utils/NetworkUtil';
import { ServiceContainer } from '../services/ServiceContainer';

interface ISetAttribute {
  /**
   * Sets multiple attributes for a user in a single network call.
   * @param serviceContainer Service container.
   * @param attributes Key-value map of attributes.
   * @param context Context containing user information.
   */
  setAttribute(
    serviceContainer: ServiceContainer,
    attributes: Record<string, boolean | string | number>,
    context: ContextModel,
  ): Promise<void>;
}

export class SetAttributeApi implements ISetAttribute {
  /**
   * Implementation of setAttributes to create an impression for multiple user attributes.
   * @param serviceContainer Service container.
   * @param attributes Key-value map of attributes.
   * @param context Context containing user information.
   */
  async setAttribute(
    serviceContainer: ServiceContainer,
    attributes: Record<string, boolean | string | number>,
    context: ContextModel,
  ): Promise<void> {
    if (serviceContainer.getShouldWaitForTrackingCalls()) {
      await createImpressionForAttributes(serviceContainer, attributes, context);
    } else {
      createImpressionForAttributes(serviceContainer, attributes, context);
    }
  }
}

/**
 * Creates an impression for multiple user attributes and sends it to the server.
 * @param serviceContainer Service container.
 * @param attributes Key-value map of attributes.
 * @param context Context containing user information.
 */
const createImpressionForAttributes = async (
  serviceContainer: ServiceContainer,
  attributes: Record<string, boolean | string | number>,
  context: ContextModel,
) => {
  // Retrieve base properties for the event
  const properties = getEventsBaseProperties(
    serviceContainer.getSettingsService(),
    EventEnum.VWO_SYNC_VISITOR_PROP,
    encodeURIComponent(context.getUserAgent()),
    context.getIpAddress(),
  );
  // Construct payload data for multiple attributes
  const payload = getAttributePayloadData(serviceContainer, EventEnum.VWO_SYNC_VISITOR_PROP, attributes, context);

  if (serviceContainer.getBatchEventsQueue()) {
    serviceContainer.getBatchEventsQueue().enqueue(payload);
  } else {
    // Send the constructed payload via POST request
    await sendPostApiRequest(serviceContainer, properties, payload, context.getId());
  }
};
