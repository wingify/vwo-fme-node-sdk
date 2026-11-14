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
import { ApiEnum } from '../enums/ApiEnum.js';
import { InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { ServiceContainerRegistry } from '../services/ServiceContainerRegistry.js';
import { StorageService } from '../services/StorageService.js';
import { isNull, isUndefined } from './DataTypeUtil.js';
import { buildMessage } from './LogMessageUtil.js';
import { getFormattedErrorMessage } from './FunctionUtil.js';
/**
 * Returns true when the user has explicitly denied consent.
 *
 * @param context - User context object from a public API call.
 * @returns {boolean} True when hasConsented is false.
 */
export function isConsentDenied(context) {
    // Only an explicit false counts. A missing field means the user is treated as consented.
    return context?.hasConsented === false;
}
/**
 * Resolves the user id from context for storage operations.
 *
 * @param context - User context from a public API call.
 * @returns {string | null} String user id when present; null when id is missing or empty.
 */
function resolveStorageUserIdFromContext(context) {
    // Storage rows are keyed by user id, so a missing or blank id cannot be deleted.
    if (isUndefined(context?.id) || isNull(context?.id) || context?.id === '') {
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
async function removeStoredDecisionsForUserAcrossAllClients(userId) {
    // The same user can have decisions cached on each client initialized in this process.
    await Promise.all(ServiceContainerRegistry.getAll().map((registeredServiceContainer) => 
    // A null feature key tells the connector to drop every feature for this user.
    new StorageService(registeredServiceContainer).removeDataInStorage(null, userId)));
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
export function shouldSkipUserApiDueToConsent(context, apiName, serviceContainer) {
    // Consented users, and calls with no context, continue into the API.
    if (!isConsentDenied(context)) {
        return false;
    }
    serviceContainer.getLogManager().info(buildMessage(InfoLogMessagesEnum.USER_CONSENT_DENIED, { apiName }));
    // Without an id there is no storage row to delete, but the API is still skipped.
    const storageUserId = context ? resolveStorageUserIdFromContext(context) : null;
    if (storageUserId) {
        // Storage cleanup must not delay the no-op response. Failures are only logged.
        void removeStoredDecisionsForUserAcrossAllClients(storageUserId).catch((error) => {
            serviceContainer
                .getLogManager()
                .errorLog('ERROR_REMOVING_STORED_DATA_IN_STORAGE', { err: getFormattedErrorMessage(error) }, { an: ApiEnum.SET_HAS_CONSENTED }, false);
        });
    }
    return true;
}
//# sourceMappingURL=ConsentUtil.js.map