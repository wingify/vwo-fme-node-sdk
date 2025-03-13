"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMessage = buildMessage;
exports.sendLogToVWO = sendLogToVWO;
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
var constants_1 = require("../constants");
var EventEnum_1 = require("../enums/EventEnum");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var NetworkUtil_1 = require("./NetworkUtil");
var nargs = /\{([0-9a-zA-Z_]+)\}/g;
var storedMessages = new Set();
/**
 * Constructs a message by replacing placeholders in a template with corresponding values from a data object.
 *
 * @param {string} template - The message template containing placeholders in the format `{key}`.
 * @param {Record<string, any>} data - An object containing keys and values used to replace the placeholders in the template.
 * @returns {string} The constructed message with all placeholders replaced by their corresponding values from the data object.
 */
function buildMessage(template, data) {
    if (data === void 0) { data = {}; }
    try {
        return template.replace(nargs, function (match, key, index) {
            // Check for escaped placeholders
            if (template[index - 1] === '{' && template[index + match.length] === '}') {
                return key;
            }
            // Retrieve the value from the data object
            var value = data[key];
            // If the key does not exist or the value is null/undefined, return an empty string
            if (value === undefined || value === null) {
                return '';
            }
            // If the value is a function, evaluate it
            return (0, DataTypeUtil_1.isFunction)(value) ? value() : value;
        });
    }
    catch (err) {
        return template; // Return the original template in case of an error
    }
}
/**
 * Sends a log message to VWO.
 * @param {string} message - The message to log.
 * @param {string} messageType - The type of message to log.
 */
function sendLogToVWO(message, messageType) {
    if (process.env.TEST_ENV === 'true') {
        return;
    }
    var messageToSend = message + '-' + constants_1.Constants.SDK_NAME + '-' + constants_1.Constants.SDK_VERSION;
    if (!storedMessages.has(messageToSend)) {
        // add the message to the set
        storedMessages.add(messageToSend);
        // create the query parameters
        var properties = (0, NetworkUtil_1.getEventsBaseProperties)(EventEnum_1.EventEnum.VWO_LOG_EVENT);
        // create the payload
        var payload = (0, NetworkUtil_1.getMessagingEventPayload)(messageType, message, EventEnum_1.EventEnum.VWO_LOG_EVENT);
        // Send the constructed payload via POST request
        (0, NetworkUtil_1.sendMessagingEvent)(properties, payload);
    }
}
//# sourceMappingURL=LogMessageUtil.js.map