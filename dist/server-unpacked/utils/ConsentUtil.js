"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConsentDenied = isConsentDenied;
exports.shouldSkipUserApiDueToConsent = shouldSkipUserApiDueToConsent;
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
var ApiEnum_1 = require("../enums/ApiEnum");
var log_messages_1 = require("../enums/log-messages");
var ServiceContainerRegistry_1 = require("../services/ServiceContainerRegistry");
var StorageService_1 = require("../services/StorageService");
var DataTypeUtil_1 = require("./DataTypeUtil");
var LogMessageUtil_1 = require("./LogMessageUtil");
var FunctionUtil_1 = require("./FunctionUtil");
/**
 * Returns true when the user has explicitly denied consent.
 *
 * @param context - User context object from a public API call.
 * @returns {boolean} True when hasConsented is false.
 */
function isConsentDenied(context) {
    // Only an explicit false counts. A missing field means the user is treated as consented.
    return (context === null || context === void 0 ? void 0 : context.hasConsented) === false;
}
/**
 * Resolves the user id from context for storage operations.
 *
 * @param context - User context from a public API call.
 * @returns {string | null} String user id when present; null when id is missing or empty.
 */
function resolveStorageUserIdFromContext(context) {
    // Storage rows are keyed by user id, so a missing or blank id cannot be deleted.
    if ((0, DataTypeUtil_1.isUndefined)(context === null || context === void 0 ? void 0 : context.id) || (0, DataTypeUtil_1.isNull)(context === null || context === void 0 ? void 0 : context.id) || (context === null || context === void 0 ? void 0 : context.id) === '') {
        return null;
    }
    return String(context.id);
}
/**
 * Deletes stored flag decision data for one user on every initialized SDK client.
 *
 * @param userId - User whose stored decisions should be removed.
 * @returns {Promise<void>} Resolves when every registered client has finished the delete.
 */
function removeStoredDecisionsForUserAcrossAllClients(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // The same user can have decisions cached on each client initialized in this process.
                return [4 /*yield*/, Promise.all(ServiceContainerRegistry_1.ServiceContainerRegistry.getAll().map(function (registeredServiceContainer) {
                        // A null feature key tells the connector to drop every feature for this user.
                        return new StorageService_1.StorageService(registeredServiceContainer).removeDataInStorage(null, userId);
                    }))];
                case 1:
                    // The same user can have decisions cached on each client initialized in this process.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * When consent is denied, logs, optionally wipes stored decisions, and signals that the user API should not run.
 * Wipe runs on every denied call when context.id is set (connectors should treat remove as idempotent).
 *
 * @param context - User context object from a public API call.
 * @param apiName - Name of the API that would be skipped.
 * @param serviceContainer - Container used for logging.
 * @returns {boolean} True when the caller should no-op for this user.
 */
function shouldSkipUserApiDueToConsent(context, apiName, serviceContainer) {
    // Consented users, and calls with no context, continue into the API.
    if (!isConsentDenied(context)) {
        return false;
    }
    serviceContainer.getLogManager().info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.USER_CONSENT_DENIED, { apiName: apiName }));
    // Without an id there is no storage row to delete, but the API is still skipped.
    var storageUserId = context ? resolveStorageUserIdFromContext(context) : null;
    if (storageUserId) {
        // Storage cleanup must not delay the no-op response. Failures are only logged.
        void removeStoredDecisionsForUserAcrossAllClients(storageUserId).catch(function (error) {
            serviceContainer
                .getLogManager()
                .errorLog('ERROR_REMOVING_STORED_DATA_IN_STORAGE', { err: (0, FunctionUtil_1.getFormattedErrorMessage)(error) }, { an: ApiEnum_1.ApiEnum.SET_HAS_CONSENTED }, false);
        });
    }
    return true;
}
//# sourceMappingURL=ConsentUtil.js.map