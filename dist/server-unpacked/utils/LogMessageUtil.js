"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMessage = buildMessage;
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
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var nargs = /\{([0-9a-zA-Z_]+)\}/g;
/**
 * Constructs a message by replacing placeholders in a template with corresponding values from a data object.
 *
 * @param {string} template - The message template containing placeholders in the format `{key}`.
 * @param {Record<string, any>} data - An object containing keys and values used to replace the placeholders in the template.
 * @returns {string} The constructed message with all placeholders replaced by their corresponding values from the data object.
 */
function buildMessage(template, data) {
    if (template === void 0) { template = ''; }
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
//# sourceMappingURL=LogMessageUtil.js.map