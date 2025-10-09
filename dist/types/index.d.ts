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
import { LogLevelEnum } from './packages/logger/enums/LogLevelEnum';
import { Connector } from './packages/storage/Connector';
import { IVWOOptions } from './models/VWOOptionsModel';
import { IVWOClient } from './VWOClient';
import { IVWOContextModel } from './models/user/ContextModel';
import { Flag } from './api/GetFlag';
import { getUUID as getUUIDUtil } from './utils/UuidUtil';
export { init, onInit } from './VWO';
export { LogLevelEnum, Connector as StorageConnector };
export { IVWOOptions, IVWOClient, IVWOContextModel, Flag };
export { ClientStorageOptions } from './packages/storage/connectors/BrowserStorageConnector';
export { IRetryConfig } from './packages/network-layer/client/NetworkClient';
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
export declare const getUUID: typeof getUUIDUtil;
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
export declare const generateUUID: typeof getUUIDUtil;
