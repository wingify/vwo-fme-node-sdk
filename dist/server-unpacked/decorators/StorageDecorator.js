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
exports.StorageDecorator = void 0;
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
var logger_1 = require("../packages/logger");
var StorageEnum_1 = require("../enums/StorageEnum");
var log_messages_1 = require("../enums/log-messages");
var LogMessageUtil_1 = require("../utils/LogMessageUtil");
var PromiseUtil_1 = require("../utils/PromiseUtil");
var StorageDecorator = /** @class */ (function () {
    function StorageDecorator() {
    }
    /**
     * Asynchronously retrieves a feature from storage based on the feature key and user.
     * @param featureKey The key of the feature to retrieve.
     * @param user The user object.
     * @param storageService The storage service instance.
     * @returns A promise that resolves to the retrieved feature or relevant status.
     */
    StorageDecorator.prototype.getFeatureFromStorage = function (featureKey, context, storageService) {
        return __awaiter(this, void 0, void 0, function () {
            var deferredObject;
            return __generator(this, function (_a) {
                deferredObject = new PromiseUtil_1.Deferred();
                storageService.getDataInStorage(featureKey, context).then(function (campaignMap) {
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
                return [2 /*return*/, deferredObject.promise];
            });
        });
    };
    /**
     * Sets data in storage based on the provided data object.
     * @param data The data to be stored, including feature key and user details.
     * @param storageService The storage service instance.
     * @returns A promise that resolves when the data is successfully stored.
     */
    StorageDecorator.prototype.setDataInStorage = function (data, storageService) {
        var deferredObject = new PromiseUtil_1.Deferred();
        var featureKey = data.featureKey, context = data.context, rolloutId = data.rolloutId, rolloutKey = data.rolloutKey, rolloutVariationId = data.rolloutVariationId, experimentId = data.experimentId, experimentKey = data.experimentKey, experimentVariationId = data.experimentVariationId;
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
            featureKey: featureKey,
            userId: context.id,
            rolloutId: rolloutId,
            rolloutKey: rolloutKey,
            rolloutVariationId: rolloutVariationId,
            experimentId: experimentId,
            experimentKey: experimentKey,
            experimentVariationId: experimentVariationId,
        });
        deferredObject.resolve(); // Resolve promise when data is successfully set
        return deferredObject.promise;
    };
    return StorageDecorator;
}());
exports.StorageDecorator = StorageDecorator;
//# sourceMappingURL=StorageDecorator.js.map