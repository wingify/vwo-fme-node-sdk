"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = exports.getUUID = exports.Flag = exports.StorageConnector = exports.LogLevelEnum = exports.onInit = exports.init = void 0;
var LogLevelEnum_1 = require("./packages/logger/enums/LogLevelEnum");
Object.defineProperty(exports, "LogLevelEnum", { enumerable: true, get: function () { return LogLevelEnum_1.LogLevelEnum; } });
var Connector_1 = require("./packages/storage/Connector");
Object.defineProperty(exports, "StorageConnector", { enumerable: true, get: function () { return Connector_1.Connector; } });
var GetFlag_1 = require("./api/GetFlag");
Object.defineProperty(exports, "Flag", { enumerable: true, get: function () { return GetFlag_1.Flag; } });
var UuidUtil_1 = require("./utils/UuidUtil");
var VWO_1 = require("./VWO");
Object.defineProperty(exports, "init", { enumerable: true, get: function () { return VWO_1.init; } });
Object.defineProperty(exports, "onInit", { enumerable: true, get: function () { return VWO_1.onInit; } });
/**
 * Generates a UUID for a user based on their userId and accountId.
 * This function can be called without initializing the VWO client.
 *
 * @param userId The user's ID.
 * @param accountId The account ID associated with the user.
 * @returns A UUID string formatted without dashes and in uppercase.
 *
 * @example
 * ```javascript
 * import { getUUID } from 'vwo-fme-node-sdk';
 *
 * const userId = 'user123';
 * const accountId = 'account456';
 * const uuid = getUUID(userId, accountId);
 * console.log(uuid); // Output: "A1B2C3D4E5F6..."
 * ```
 */
exports.getUUID = UuidUtil_1.getUUID;
/**
 * Alias for getUUID - generates a UUID for a user based on their userId and accountId.
 * This function can be called without initializing the VWO client.
 *
 * @param userId The user's ID.
 * @param accountId The account ID associated with the user.
 * @returns A UUID string formatted without dashes and in uppercase.
 *
 * @example
 * ```javascript
 * import { generateUUID } from 'vwo-fme-node-sdk';
 *
 * const userId = 'user123';
 * const accountId = 'account456';
 * const uuid = generateUUID(userId, accountId);
 * console.log(uuid); // Output: "A1B2C3D4E5F6..."
 * ```
 */
exports.generateUUID = UuidUtil_1.getUUID;
//# sourceMappingURL=index.js.map