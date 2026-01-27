"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogMessagesEnum = exports.InfoLogMessagesEnum = exports.DebugLogMessagesEnum = void 0;
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
var vwo_fme_sdk_log_messages_1 = __importDefault(require("vwo-fme-sdk-log-messages"));
var resolvedMessages = vwo_fme_sdk_log_messages_1.default.default || vwo_fme_sdk_log_messages_1.default;
var DebugLogMessagesEnum = resolvedMessages.debugMessages;
exports.DebugLogMessagesEnum = DebugLogMessagesEnum;
var InfoLogMessagesEnum = resolvedMessages.infoMessages;
exports.InfoLogMessagesEnum = InfoLogMessagesEnum;
var ErrorLogMessagesEnum = resolvedMessages.errorMessagesV2;
exports.ErrorLogMessagesEnum = ErrorLogMessagesEnum;
//# sourceMappingURL=index.js.map