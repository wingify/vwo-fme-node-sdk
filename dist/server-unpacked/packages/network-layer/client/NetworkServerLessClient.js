"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkServerLessClient = void 0;
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
var FetchUtil_1 = require("../../../utils/FetchUtil");
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var ResponseModel_1 = require("../models/ResponseModel");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkServerLessClient = /** @class */ (function () {
    function NetworkServerLessClient() {
    }
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    NetworkServerLessClient.prototype.GET = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        // Extract network options from the request model.
        var networkOptions = requestModel.getOptions();
        var responseModel = new ResponseModel_1.ResponseModel();
        (0, FetchUtil_1.sendGetCall)(networkOptions)
            .then(function (data) {
            responseModel.setData(data);
            deferred.resolve(responseModel);
        })
            .catch(function (error) {
            responseModel.setError(error);
            deferred.reject(responseModel);
        });
        return deferred.promise;
    };
    /**
     * Performs a POST request using the provided RequestModel.
     * @param {RequestModel} request - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    NetworkServerLessClient.prototype.POST = function (request) {
        var deferred = new PromiseUtil_1.Deferred();
        var networkOptions = request.getOptions();
        var responseModel = new ResponseModel_1.ResponseModel();
        (0, FetchUtil_1.sendPostCall)(networkOptions)
            .then(function (data) {
            responseModel.setData(data);
            deferred.resolve(responseModel);
        })
            .catch(function (error) {
            responseModel.setError(error);
            deferred.reject(responseModel);
        });
        return deferred.promise;
    };
    return NetworkServerLessClient;
}());
exports.NetworkServerLessClient = NetworkServerLessClient;
//# sourceMappingURL=NetworkServerLessClient.js.map