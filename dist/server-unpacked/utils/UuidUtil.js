"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomUUID = getRandomUUID;
exports.getUUID = getUUID;
exports.generateUUID = generateUUID;
exports.isWebUuid = isWebUuid;
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
var Url_1 = require("../constants/Url");
var uuid_1 = require("uuid");
var uuid_2 = require("uuid");
/**
 * Generates a random UUID based on an API key.
 * @param sdkKey The API key used to generate a namespace for the UUID.
 * @returns A random UUID string.
 */
function getRandomUUID(sdkKey) {
    // Generate a namespace based on the API key using DNS namespace
    var namespace = (0, uuid_2.v5)(sdkKey, uuid_2.v5.DNS);
    // Generate a random UUID using the namespace derived from the API key
    var randomUUID = (0, uuid_2.v5)((0, uuid_1.v4)(), namespace);
    return randomUUID;
}
/**
 * Generates a UUID for a user based on their userId and accountId.
 * @param userId The user's ID.
 * @param accountId The account ID associated with the user.
 * @returns A UUID string formatted without dashes and in uppercase.
 */
function getUUID(userId, accountId) {
    var VWO_NAMESPACE = (0, uuid_2.v5)(Url_1.SEED_URL, uuid_2.v5.URL);
    // Convert userId and accountId to string to ensure proper type
    userId = String(userId);
    accountId = String(accountId);
    // Generate a namespace UUID based on the accountId
    var userIdNamespace = generateUUID(accountId, VWO_NAMESPACE);
    // Generate a UUID based on the userId and the previously generated namespace
    var uuidForUserIdAccountId = generateUUID(userId, userIdNamespace);
    // Remove all dashes from the UUID and convert it to uppercase
    var desiredUuid = uuidForUserIdAccountId === null || uuidForUserIdAccountId === void 0 ? void 0 : uuidForUserIdAccountId.replace(/-/gi, '').toUpperCase();
    return desiredUuid;
}
/**
 * Helper function to generate a UUID v5 based on a name and a namespace.
 * @param name The name from which to generate the UUID.
 * @param namespace The namespace used to generate the UUID.
 * @returns A UUID string or undefined if inputs are invalid.
 */
function generateUUID(name, namespace) {
    // Check for valid input to prevent errors
    if (!name || !namespace) {
        return;
    }
    // Generate and return the UUID v5
    return (0, uuid_2.v5)(name, namespace);
}
/**
 * Validates whether the given string is an web-generated UUID.
 * Performs a basic check that an incoming context.id looks like an web-generated ID:
 *   D or J + 32 hex chars = 33 chars total.
 *
 * @param id - The context ID string to validate (e.g. from context.id).
 * @returns True if id matches the web-generated UUID format (D or J followed by 32 hex chars); false otherwise.
 */
function isWebUuid(id) {
    if (typeof id !== 'string') {
        return false;
    }
    return /^[DJ][0-9A-Fa-f]{32}$/.test(id);
}
//# sourceMappingURL=UuidUtil.js.map