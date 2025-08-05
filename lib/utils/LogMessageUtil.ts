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
import { Constants } from '../constants';
import { EventEnum } from '../enums/EventEnum';
import { isFunction } from '../utils/DataTypeUtil';
import { getEventsBaseProperties, getMessagingEventPayload, sendEvent } from './NetworkUtil';

const nargs = /\{([0-9a-zA-Z_]+)\}/g;
const storedMessages = new Set<string>();

/**
 * Constructs a message by replacing placeholders in a template with corresponding values from a data object.
 *
 * @param {string} template - The message template containing placeholders in the format `{key}`.
 * @param {Record<string, any>} data - An object containing keys and values used to replace the placeholders in the template.
 * @returns {string} The constructed message with all placeholders replaced by their corresponding values from the data object.
 */
export function buildMessage(template: string, data: Record<string, any> = {}): string {
  try {
    return template.replace(nargs, (match, key, index) => {
      // Check for escaped placeholders
      if (template[index - 1] === '{' && template[index + match.length] === '}') {
        return key;
      }

      // Retrieve the value from the data object
      const value = data[key];

      // If the key does not exist or the value is null/undefined, return an empty string
      if (value === undefined || value === null) {
        return '';
      }

      // If the value is a function, evaluate it
      return isFunction(value) ? value() : value;
    });
  } catch (err) {
    return template; // Return the original template in case of an error
  }
}

/**
 * Sends a log message to VWO.
 * @param {string} message - The message to log.
 * @param {string} messageType - The type of message to log.
 * @param {string} eventName - The name of the event to log.
 */

export function sendLogToVWO(message: string, messageType: string) {
  if (typeof process.env != 'undefined' && process.env.TEST_ENV === 'true') {
    return;
  }

  let messageToSend = message;
  // if the message contains 'Retrying in', then remove the 'Retrying in' part, to avoid duplicate messages
  if (message.includes('Retrying in')) {
    messageToSend = message.split('Retrying')[0].trim();
  }
  messageToSend = messageToSend + '-' + Constants.SDK_NAME + '-' + Constants.SDK_VERSION;

  if (!storedMessages.has(messageToSend)) {
    // add the message to the set
    storedMessages.add(messageToSend);

    // create the query parameters
    const properties = getEventsBaseProperties(EventEnum.VWO_LOG_EVENT);

    // create the payload
    const payload = getMessagingEventPayload(messageType, message, EventEnum.VWO_LOG_EVENT);

    // Send the constructed payload via POST request
    // send eventName in parameters so that we can disable retry for this event
    sendEvent(properties, payload, EventEnum.VWO_LOG_EVENT).catch(() => {});
  }
}
