"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStorageConnector = void 0;
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
var constants_1 = require("../../../constants");
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var logger_1 = require("../../logger");
/**
 * A class that provides browser storage functionality for managing feature flags and experiments data
 * @class BrowserStorageConnector
 */
var BrowserStorageConnector = /** @class */ (function () {
    /**
     * Creates an instance of BrowserStorageConnector
     * @param {ClientStorageOptions} [options] - Configuration options for the storage connector
     * @param {string} [options.key] - Custom key for storage (defaults to Constants.DEFAULT_LOCAL_STORAGE_KEY)
     * @param {Storage} [options.provider] - Storage provider (defaults to window.localStorage)
     * @param {boolean} [options.isDisabled] - Whether storage operations should be disabled
     */
    function BrowserStorageConnector(options) {
        this.storageKey = (options === null || options === void 0 ? void 0 : options.key) || constants_1.Constants.DEFAULT_LOCAL_STORAGE_KEY;
        this.storage = (options === null || options === void 0 ? void 0 : options.provider) || window.localStorage;
        this.isDisabled = (options === null || options === void 0 ? void 0 : options.isDisabled) || false;
    }
    /**
     * Retrieves all stored data from the storage
     * @private
     * @returns {Record<string, StorageData>} Object containing all stored data
     */
    BrowserStorageConnector.prototype.getStoredData = function () {
        if (this.isDisabled)
            return {};
        try {
            var data = this.storage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        }
        catch (error) {
            logger_1.LogManager.Instance.error("Error reading from storage: ".concat(error));
            return {};
        }
    };
    /**
     * Saves data to the storage
     * @private
     * @param {Record<string, StorageData>} data - The data object to be stored
     */
    BrowserStorageConnector.prototype.storeData = function (data) {
        if (this.isDisabled)
            return;
        try {
            var serializedData = JSON.stringify(data);
            this.storage.setItem(this.storageKey, serializedData);
        }
        catch (error) {
            logger_1.LogManager.Instance.error("Error writing to storage: ".concat(error));
        }
    };
    /**
     * Stores feature flag or experiment data for a specific user
     * @public
     * @param {StorageData} data - The data to be stored, containing feature flag or experiment information
     * @returns {Promise<void>} A promise that resolves when the data is successfully stored
     */
    BrowserStorageConnector.prototype.set = function (data) {
        var deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve();
        }
        else {
            try {
                var storedData = this.getStoredData();
                var key = "".concat(data.featureKey, "_").concat(data.userId);
                storedData[key] = data;
                this.storeData(storedData);
                logger_1.LogManager.Instance.info("Stored data in storage for key: ".concat(key));
                deferredObject.resolve();
            }
            catch (error) {
                logger_1.LogManager.Instance.error("Error storing data: ".concat(error));
                deferredObject.reject(error);
            }
        }
        return deferredObject.promise;
    };
    /**
     * Retrieves stored feature flag or experiment data for a specific user
     * @public
     * @param {string} featureKey - The key of the feature flag or experiment
     * @param {string} userId - The ID of the user
     * @returns {Promise<StorageData | Record<string, any>>} A promise that resolves to the stored data or {} if not found
     */
    BrowserStorageConnector.prototype.get = function (featureKey, userId) {
        var _a;
        var deferredObject = new PromiseUtil_1.Deferred();
        if (this.isDisabled) {
            deferredObject.resolve({});
        }
        else {
            try {
                var storedData = this.getStoredData();
                var key = "".concat(featureKey, "_").concat(userId);
                var dataToReturn = (_a = storedData[key]) !== null && _a !== void 0 ? _a : {};
                logger_1.LogManager.Instance.info("Retrieved data from storage for key: ".concat(key));
                deferredObject.resolve(dataToReturn);
            }
            catch (error) {
                logger_1.LogManager.Instance.error("Error retrieving data: ".concat(error));
                deferredObject.resolve({});
            }
        }
        return deferredObject.promise;
    };
    return BrowserStorageConnector;
}());
exports.BrowserStorageConnector = BrowserStorageConnector;
//# sourceMappingURL=BrowserStorageConnector.js.map