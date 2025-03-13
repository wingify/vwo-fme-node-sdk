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
exports.StorageService = void 0;
/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
var StorageEnum_1 = require("../enums/StorageEnum");
var storage_1 = require("../packages/storage");
var log_messages_1 = require("../enums/log-messages");
var logger_1 = require("../packages/logger");
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var PromiseUtil_1 = require("../utils/PromiseUtil");
var StorageService = /** @class */ (function () {
    function StorageService() {
        this.storageData = {};
    }
    /**
     * Retrieves data from storage based on the feature key and user ID.
     * @param featureKey The key to identify the feature data.
     * @param user The user object containing at least an ID.
     * @returns A promise that resolves to the data retrieved or an error/storage status enum.
     */
    StorageService.prototype.getDataInStorage = function (featureKey, context) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, storageInstance;
            return __generator(this, function (_a) {
                deferredObject = new PromiseUtil_1.Deferred();
                storageInstance = storage_1.Storage.Instance.getConnector();
                // Check if the storage instance is available
                if ((0, DataTypeUtil_1.isNull)(storageInstance) || (0, DataTypeUtil_1.isUndefined)(storageInstance)) {
                    deferredObject.resolve(StorageEnum_1.StorageEnum.STORAGE_UNDEFINED);
                }
                else {
                    storageInstance
                        .get(featureKey, context.getId())
                        .then(function (data) {
                        deferredObject.resolve(data);
                    })
                        .catch(function (err) {
                        logger_1.LogManager.Instance.error((0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum.STORED_DATA_ERROR, {
                            err: err,
                        }));
                        deferredObject.resolve(StorageEnum_1.StorageEnum.NO_DATA_FOUND);
                    });
                }
                return [2 /*return*/, deferredObject.promise];
            });
        });
    };
    /**
     * Stores data in the storage.
     * @param data The data to be stored as a record.
     * @returns A promise that resolves to true if data is successfully stored, otherwise false.
     */
    StorageService.prototype.setDataInStorage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject, storageInstance;
            return __generator(this, function (_a) {
                deferredObject = new PromiseUtil_1.Deferred();
                storageInstance = storage_1.Storage.Instance.getConnector();
                // Check if the storage instance is available
                if (storageInstance === null || storageInstance === undefined) {
                    deferredObject.resolve(false);
                }
                else {
                    storageInstance
                        .set(data)
                        .then(function () {
                        deferredObject.resolve(true);
                    })
                        .catch(function () {
                        deferredObject.resolve(false);
                    });
                }
                return [2 /*return*/, deferredObject.promise];
            });
        });
    };
    return StorageService;
}());
exports.StorageService = StorageService;
//# sourceMappingURL=StorageService.js.map