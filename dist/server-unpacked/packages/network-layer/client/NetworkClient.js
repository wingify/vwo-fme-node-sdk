"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkClient = void 0;
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
var http = require("http");
var https = require("https");
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var Url_1 = require("../../../constants/Url");
var ResponseModel_1 = require("../models/ResponseModel");
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkClient = /** @class */ (function () {
    function NetworkClient() {
    }
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    NetworkClient.prototype.GET = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        // Extract network options from the request model.
        var networkOptions = requestModel.getOptions();
        var responseModel = new ResponseModel_1.ResponseModel();
        try {
            // Choose HTTP or HTTPS client based on the scheme.
            var httpClient = networkOptions.scheme === Url_1.HTTPS ? https : http;
            // Perform the HTTP GET request.
            var req = httpClient.get(networkOptions, function (res) {
                responseModel.setStatusCode(res.statusCode);
                var contentType = res.headers['content-type'];
                var error;
                var rawData = '';
                // Check for expected content-type.
                if (!/^application\/json/.test(contentType)) {
                    error = "Invalid content-type.\nExpected application/json but received ".concat(contentType);
                }
                if (error) {
                    // Log error and consume response data to free up memory.
                    res.resume();
                    responseModel.setError(error);
                    deferred.reject(responseModel);
                }
                res.setEncoding('utf8');
                // Collect data chunks.
                res.on('data', function (chunk) {
                    rawData += chunk;
                });
                // Handle the end of the response.
                res.on('end', function () {
                    try {
                        var parsedData = JSON.parse(rawData);
                        // Check for successful response status.
                        if (responseModel.getStatusCode() !== 200) {
                            var error_1 = "Request failed. Got Status Code: ".concat(responseModel.getStatusCode(), " and message: ").concat(rawData);
                            responseModel.setError(error_1);
                            deferred.reject(responseModel);
                            return;
                        }
                        responseModel.setData(parsedData);
                        deferred.resolve(responseModel);
                    }
                    catch (err) {
                        responseModel.setError(err);
                        deferred.reject(responseModel);
                    }
                });
            });
            // Handle request timeout.
            req.on('timeout', function () {
                responseModel.setError(new Error('timeout'));
                deferred.reject(responseModel);
            });
            req.on('error', function (err) {
                responseModel.setError(err);
                deferred.reject(responseModel);
            });
        }
        catch (err) {
            responseModel.setError(err);
            deferred.reject(responseModel);
        }
        return deferred.promise;
    };
    /**
     * Performs a POST request using the provided RequestModel.
     * @param {RequestModel} request - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    NetworkClient.prototype.POST = function (request) {
        var deferred = new PromiseUtil_1.Deferred();
        var networkOptions = request.getOptions();
        var responseModel = new ResponseModel_1.ResponseModel();
        try {
            // Choose HTTP or HTTPS client based on the scheme.
            var httpClient = networkOptions.scheme === Url_1.HTTPS ? https : http;
            // Perform the HTTP POST request.
            var req = httpClient.request(networkOptions, function (res) {
                var rawData = '';
                res.setEncoding('utf8');
                // Collect data chunks.
                res.on('data', function (chunk) {
                    rawData += chunk;
                });
                // Handle the end of the response.
                res.on('end', function () {
                    if (res.statusCode === 200) {
                        responseModel.setData(request.getBody());
                        deferred.resolve(responseModel);
                    }
                    else if (res.statusCode === 413) {
                        var parsedData = JSON.parse(rawData);
                        responseModel.setError(parsedData.error);
                        responseModel.setData(request.getBody());
                        deferred.reject(responseModel);
                    }
                    else {
                        var parsedData = JSON.parse(rawData);
                        responseModel.setError(parsedData.message);
                        responseModel.setData(request.getBody());
                        deferred.reject(responseModel);
                    }
                });
            });
            // Handle request timeout.
            req.on('timeout', function () {
                responseModel.setError(new Error('timeout'));
                responseModel.setData(request.getBody());
                deferred.reject(responseModel);
            });
            // Write data to the request body and end the request.
            req.write(JSON.stringify(networkOptions.body));
            req.end();
        }
        catch (err) {
            responseModel.setError(err);
            responseModel.setData(request.getBody());
            deferred.reject(responseModel);
        }
        return deferred.promise;
    };
    return NetworkClient;
}());
exports.NetworkClient = NetworkClient;
//# sourceMappingURL=NetworkClient.js.map