"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkBrowserClient = void 0;
exports.setProxyUrl = setProxyUrl;
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
var XMLUtil_1 = require("../../../utils/XMLUtil");
var PromiseUtil_1 = require("../../../utils/PromiseUtil");
var ResponseModel_1 = require("../models/ResponseModel");
var logger_1 = require("../../logger");
var log_messages_1 = require("../../../enums/log-messages");
var LogMessageUtil_1 = require("../../../utils/LogMessageUtil");
/**
 * Proxy URL for browser network calls.
 * This allows all network requests to be redirected through a proxy server.
 */
var proxyUrl = undefined;
/**
 * Sets the proxy URL for all browser network calls.
 * This function is called from VWOBuilder when proxyUrl is provided in options.
 *
 * @param {string} proxyUrl - The proxy URL to use for all network requests
 */
function setProxyUrl(proxyUrlPassedInInit) {
    if (proxyUrlPassedInInit) {
        logger_1.LogManager.Instance.info((0, LogMessageUtil_1.buildMessage)(log_messages_1.InfoLogMessagesEnum.PROXY_URL_SET));
    }
    proxyUrl = proxyUrlPassedInInit;
}
/**
 * Rewrites the original URL to use the proxy server while preserving the path and query parameters.
 *
 * Example:
 * - Original URL: https://api.vwo.com/settings/123?param=value
 * - Proxy URL: https://my-proxy.com
 * - Result: https://my-proxy.com/settings/123?param=value
 *
 * @param {string} originalUrl - The original URL to be rewritten
 * @returns {string} The rewritten URL using the proxy, or the original URL if no proxy is set
 */
function rewriteUrlWithProxy(originalUrl) {
    if (!proxyUrl)
        return originalUrl;
    try {
        var original = new URL(originalUrl);
        var proxy = new URL(proxyUrl);
        proxy.pathname = original.pathname;
        proxy.search = original.search;
        return proxy.toString();
    }
    catch (_a) {
        return originalUrl;
    }
}
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
var NetworkBrowserClient = /** @class */ (function () {
    function NetworkBrowserClient() {
    }
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    NetworkBrowserClient.prototype.GET = function (requestModel) {
        var deferred = new PromiseUtil_1.Deferred();
        // Extract network options from the request model.
        var networkOptions = requestModel.getOptions();
        var responseModel = new ResponseModel_1.ResponseModel();
        // PROXY URL REWRITING: If proxy is set, rewrite the URL to route through the proxy
        // This affects ALL network calls in browser environment (settings, tracking, etc.)
        if (networkOptions.scheme && networkOptions.hostname && networkOptions.path) {
            var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
            if (networkOptions.port) {
                url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
            }
            networkOptions.url = rewriteUrlWithProxy(url);
        }
        (0, XMLUtil_1.sendGetCall)({
            networkOptions: networkOptions,
            successCallback: function (data) {
                responseModel.setData(data);
                deferred.resolve(responseModel);
            },
            errorCallback: function (error) {
                responseModel.setError(error);
                deferred.reject(responseModel);
            },
        });
        /*try {
          fetch(url)
              .then(res => {
                // Some endpoints return empty strings as the response body; treat
                // as raw text and handle potential JSON parsing errors below
                return res.text().then(text => {
                  let jsonData = {};
                  try {
                    jsonData = JSON.parse(text);
                  } catch (err) {
                    console.info(
                      `VWO-SDK - [INFO]: VWO didn't send JSON response which is expected: ${err}`
                    );
                  }
    
                  if (res.status === 200) {
                    responseModel.setData(jsonData);
                    deferred.resolve(responseModel);
                  } else {
                    let error = `VWO-SDK - [ERROR]: Request failed for fetching account settings. Got Status Code: ${
                      res.status
                    }`;
    
                    responseModel.setError(error);
                    deferred.reject(responseModel);
                  }
                });
              })
              .catch(err => {
                responseModel.setError(err);
                deferred.reject(responseModel);
              });
        } catch (err) {
          responseModel.setError(err);
          deferred.reject(responseModel);
        } */
        return deferred.promise;
    };
    /**
     * Performs a POST request using the provided RequestModel.
     * @param {RequestModel} request - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    NetworkBrowserClient.prototype.POST = function (request) {
        var deferred = new PromiseUtil_1.Deferred();
        var networkOptions = request.getOptions();
        var responseModel = new ResponseModel_1.ResponseModel();
        // PROXY URL REWRITING: If proxy is set, rewrite the URL to route through the proxy
        // This affects ALL network calls in browser environment (settings, tracking, etc.)
        if (networkOptions.scheme && networkOptions.hostname && networkOptions.path) {
            var url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname).concat(networkOptions.path);
            if (networkOptions.port) {
                url = "".concat(networkOptions.scheme, "://").concat(networkOptions.hostname, ":").concat(networkOptions.port).concat(networkOptions.path);
            }
            networkOptions.url = rewriteUrlWithProxy(url);
        }
        (0, XMLUtil_1.sendPostCall)({
            networkOptions: networkOptions,
            successCallback: function (data) {
                responseModel.setStatusCode(200);
                responseModel.setData(data);
                deferred.resolve(responseModel);
            },
            errorCallback: function (error) {
                responseModel.setStatusCode(400);
                responseModel.setError(error);
                deferred.reject(responseModel);
            },
        });
        /* try {
          const options: any = Object.assign(
            {},
            { method: HttpMethodEnum.POST },
            { body: networkOptions.body },
            { headers: networkOptions.headers }
          );
    
          fetch(url, options)
              .then(res => {
                // Some endpoints return empty strings as the response body; treat
                // as raw text and handle potential JSON parsing errors below
                return res.text().then(text => {
                  let jsonData = {};
                  try {
                    jsonData = JSON.parse(text);
                  } catch (err) {
                    console.info(
                      `VWO-SDK - [INFO]: VWO didn't send JSON response which is expected: ${err}`
                    );
                  }
    
                  if (res.status === 200) {
                    responseModel.setData(jsonData);
                    deferred.resolve(responseModel);
                  } else {
                    let error = `VWO-SDK - [ERROR]: Request failed for fetching account settings. Got Status Code: ${
                      res.status
                    }`;
    
                    responseModel.setError(error);
                    deferred.reject(responseModel);
                  }
                });
              })
              .catch(err => {
                responseModel.setError(err);
                deferred.reject(responseModel);
              });
        } catch (err) {
          responseModel.setError(err);
          deferred.reject(responseModel);
        } */
        return deferred.promise;
    };
    return NetworkBrowserClient;
}());
exports.NetworkBrowserClient = NetworkBrowserClient;
//# sourceMappingURL=NetworkBrowserClient.js.map