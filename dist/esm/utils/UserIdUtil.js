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
exports.getUserId = getUserId;
const AliasingUtil_1 = require("./AliasingUtil");
const SettingsService_1 = require("../services/SettingsService");
const log_messages_1 = require("../enums/log-messages");
const logger_1 = require("../packages/logger");
const LogMessageUtil_1 = require("./LogMessageUtil");
async function getUserId(userId, isAliasingEnabled) {
    if (isAliasingEnabled) {
        if (SettingsService_1.SettingsService.Instance.isGatewayServiceProvided) {
            // lets call getAlias here and return the alias id
            const alias = await AliasingUtil_1.AliasingUtil.getAlias(userId);
            // Backend returns array of results, find the matching one
            const result = alias.find((item) => item.aliasId === userId);
            logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.ALIAS_ENABLED, { userId: result?.userId }));
            return result?.userId || userId;
        }
        else {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.GATEWAY_URL_ERROR));
            return userId;
        }
    }
    else {
        return userId;
    }
}
//# sourceMappingURL=UserIdUtil.js.map