"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
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
const StorageEnum_1 = require("../enums/StorageEnum");
const storage_1 = require("../packages/storage");
const logger_1 = require("../packages/logger");
const DataTypeUtil_1 = require("../utils/DataTypeUtil");
const PromiseUtil_1 = require("../utils/PromiseUtil");
const ApiEnum_1 = require("../enums/ApiEnum");
class StorageService {
    constructor() {
        this.storageData = {};
    }
    /**
     * Retrieves data from storage based on the feature key and user ID.
     * @param featureKey The key to identify the feature data.
     * @param user The user object containing at least an ID.
     * @returns A promise that resolves to the data retrieved or an error/storage status enum.
     */
    async getDataInStorage(featureKey, context) {
        const deferredObject = new PromiseUtil_1.Deferred();
        const storageInstance = storage_1.Storage.Instance.getConnector();
        // Check if the storage instance is available
        if ((0, DataTypeUtil_1.isNull)(storageInstance) || (0, DataTypeUtil_1.isUndefined)(storageInstance)) {
            deferredObject.resolve(StorageEnum_1.StorageEnum.STORAGE_UNDEFINED);
        }
        else {
            storageInstance
                .get(featureKey, context.getId())
                .then((data) => {
                deferredObject.resolve(data);
            })
                .catch((err) => {
                logger_1.LogManager.Instance.errorLog('ERROR_READING_STORED_DATA_IN_STORAGE', { err }, { an: ApiEnum_1.ApiEnum.GET_FLAG, uuid: context.getUuid(), sId: context.getSessionId() });
                deferredObject.resolve(StorageEnum_1.StorageEnum.NO_DATA_FOUND);
            });
        }
        return deferredObject.promise;
    }
    /**
     * Stores data in the storage.
     * @param data The data to be stored as a record.
     * @returns A promise that resolves to true if data is successfully stored, otherwise false.
     */
    async setDataInStorage(data) {
        const deferredObject = new PromiseUtil_1.Deferred();
        const storageInstance = storage_1.Storage.Instance.getConnector();
        // Check if the storage instance is available
        if (storageInstance === null || storageInstance === undefined) {
            deferredObject.resolve(false);
        }
        else {
            storageInstance
                .set(data)
                .then(() => {
                deferredObject.resolve(true);
            })
                .catch(() => {
                deferredObject.resolve(false);
            });
        }
        return deferredObject.promise;
    }
}
exports.StorageService = StorageService;
//# sourceMappingURL=StorageService.js.map