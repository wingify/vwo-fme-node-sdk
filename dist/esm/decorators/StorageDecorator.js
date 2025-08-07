"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageDecorator = void 0;
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
const logger_1 = require("../packages/logger");
const StorageEnum_1 = require("../enums/StorageEnum");
const log_messages_1 = require("../enums/log-messages");
const LogMessageUtil_1 = require("../utils/LogMessageUtil");
const PromiseUtil_1 = require("../utils/PromiseUtil");
class StorageDecorator {
    /**
     * Asynchronously retrieves a feature from storage based on the feature key and user.
     * @param featureKey The key of the feature to retrieve.
     * @param user The user object.
     * @param storageService The storage service instance.
     * @returns A promise that resolves to the retrieved feature or relevant status.
     */
    async getFeatureFromStorage(featureKey, context, storageService) {
        const deferredObject = new PromiseUtil_1.Deferred();
        storageService.getDataInStorage(featureKey, context).then((campaignMap) => {
            switch (campaignMap) {
                case StorageEnum_1.StorageEnum.STORAGE_UNDEFINED:
                    deferredObject.resolve(null); // No storage defined
                    break;
                case StorageEnum_1.StorageEnum.NO_DATA_FOUND:
                    deferredObject.resolve(null); // No data found in storage
                    break;
                case StorageEnum_1.StorageEnum.INCORRECT_DATA:
                    deferredObject.resolve(StorageEnum_1.StorageEnum.INCORRECT_DATA); // Incorrect data found
                    break;
                case StorageEnum_1.StorageEnum.CAMPAIGN_PAUSED:
                    deferredObject.resolve(null); // Campaign is paused
                    break;
                case StorageEnum_1.StorageEnum.VARIATION_NOT_FOUND:
                    deferredObject.resolve(StorageEnum_1.StorageEnum.VARIATION_NOT_FOUND); // No variation found
                    break;
                case StorageEnum_1.StorageEnum.WHITELISTED_VARIATION:
                    deferredObject.resolve(null); // Whitelisted variation, handle accordingly
                    break;
                default:
                    deferredObject.resolve(campaignMap); // Valid data found, resolve with it
            }
        });
        return deferredObject.promise;
    }
    /**
     * Sets data in storage based on the provided data object.
     * @param data The data to be stored, including feature key and user details.
     * @param storageService The storage service instance.
     * @returns A promise that resolves when the data is successfully stored.
     */
    setDataInStorage(data, storageService) {
        const deferredObject = new PromiseUtil_1.Deferred();
        const { featureKey, context, rolloutId, rolloutKey, rolloutVariationId, experimentId, experimentKey, experimentVariationId, } = data;
        if (!featureKey) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORING_DATA_ERROR, {
                key: 'featureKey',
            }));
            deferredObject.reject(); // Reject promise if feature key is invalid
            return;
        }
        if (!context.id) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORING_DATA_ERROR, {
                key: 'Context or Context.id',
            }));
            deferredObject.reject(); // Reject promise if user ID is invalid
            return;
        }
        if (rolloutKey && !experimentKey && !rolloutVariationId) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORING_DATA_ERROR, {
                key: 'Variation:(rolloutKey, experimentKey or rolloutVariationId)',
            }));
            deferredObject.reject(); // Reject promise if rollout variation is invalid
            return;
        }
        if (experimentKey && !experimentVariationId) {
            logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORING_DATA_ERROR, {
                key: 'Variation:(experimentKey or rolloutVariationId)',
            }));
            deferredObject.reject(); // Reject promise if experiment variation is invalid
            return;
        }
        storageService.setDataInStorage({
            featureKey,
            userId: context.id,
            rolloutId,
            rolloutKey,
            rolloutVariationId,
            experimentId,
            experimentKey,
            experimentVariationId,
        });
        deferredObject.resolve(); // Resolve promise when data is successfully set
        return deferredObject.promise;
    }
}
exports.StorageDecorator = StorageDecorator;
//# sourceMappingURL=StorageDecorator.js.map