"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyValue = getKeyValue;
exports.matchWithRegex = matchWithRegex;
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
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
/**
 * Extracts the first key-value pair from the provided object.
 * @param {Record<string, any>} obj - The object from which to extract the key-value pair.
 * @returns {Record<string, any> | undefined} An object containing the first key and value, or undefined if input is not an object.
 */
function getKeyValue(obj) {
    // Check if the input is a valid object using isObject utility function
    if (!(0, DataTypeUtil_1.isObject)(obj)) {
        return;
    }
    // Extract the first key from the object
    var key = Object.keys(obj)[0];
    // Retrieve the value associated with the first key
    var value = obj[key];
    // Return an object containing the key and value
    return {
        key: key,
        value: value,
    };
}
/**
 * Matches a string against a regular expression and returns the match result.
 * @param {string} string - The string to match against the regex.
 * @param {string} regex - The regex pattern as a string.
 * @returns {RegExpMatchArray | null} The results of the regex match, or null if an error occurs.
 */
function matchWithRegex(string, regex) {
    try {
        // Attempt to match the string with the regex
        return string.match(new RegExp(regex));
    }
    catch (err) {
        // Return null if an error occurs during regex matching
        return null;
    }
}
//# sourceMappingURL=SegmentUtil.js.map