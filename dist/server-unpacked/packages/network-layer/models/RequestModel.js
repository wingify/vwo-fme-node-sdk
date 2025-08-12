"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModel = void 0;
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
var HttpMethodEnum_1 = require("../../../enums/HttpMethodEnum");
var Url_1 = require("../../../constants/Url");
var constants_1 = require("../../../constants");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
/**
 * Represents a model for HTTP requests.
 * This class encapsulates all necessary details such as URL, method, path, query parameters, body, headers,
 * scheme, port, and timeout settings.
 */
var RequestModel = /** @class */ (function () {
    /**
     * Constructs an instance of the RequestModel.
     * @param url The base URL of the HTTP request.
     * @param method HTTP method, default is 'GET'.
     * @param path URL path.
     * @param query Query parameters as a record of key-value pairs.
     * @param body Body of the request as a record of key-value pairs.
     * @param headers HTTP headers as a record of key-value pairs.
     * @param scheme Protocol scheme, default is 'http'.
     * @param port Port number, default is 80.
     */
    function RequestModel(url, method, path, query, body, headers, scheme, port, retryConfig) {
        if (method === void 0) { method = HttpMethodEnum_1.HttpMethodEnum.GET; }
        if (scheme === void 0) { scheme = Url_1.HTTPS; }
        this.whiteListedKeys = ['eventName', 'uuid', 'campaignId', 'eventProperties'];
        this.url = url;
        this.method = method;
        this.path = path;
        this.query = query;
        this.body = body;
        this.headers = headers;
        this.scheme = scheme;
        this.port = port;
        this.retryConfig = retryConfig || constants_1.Constants.DEFAULT_RETRY_CONFIG;
    }
    /**
     * Retrieves the HTTP method.
     * @returns The HTTP method as a string.
     */
    RequestModel.prototype.getMethod = function () {
        return this.method;
    };
    /**
     * Sets the HTTP method.
     * @param method The HTTP method to set.
     */
    RequestModel.prototype.setMethod = function (method) {
        this.method = method;
    };
    /**
     * Retrieves the body of the HTTP request.
     * @returns A record of key-value pairs representing the body content.
     */
    RequestModel.prototype.getBody = function () {
        return this.body;
    };
    /**
     * Sets the body of the HTTP request.
     * @param body A record of key-value pairs representing the body content.
     */
    RequestModel.prototype.setBody = function (body) {
        this.body = body;
    };
    /**
     * Sets the query parameters for the HTTP request.
     * @param query A record of key-value pairs representing the query parameters.
     */
    RequestModel.prototype.setQuery = function (query) {
        this.query = query;
    };
    /**
     * Retrieves the query parameters of the HTTP request.
     * @returns A record of key-value pairs representing the query parameters.
     */
    RequestModel.prototype.getQuery = function () {
        return this.query;
    };
    /**
     * Sets the HTTP headers for the request.
     * @param headers A record of key-value pairs representing the HTTP headers.
     */
    RequestModel.prototype.setHeaders = function (headers) {
        this.headers = headers;
        return this;
    };
    /**
     * Retrieves the HTTP headers of the request.
     * @returns A record of key-value pairs representing the HTTP headers.
     */
    RequestModel.prototype.getHeaders = function () {
        return this.headers;
    };
    /**
     * Sets the timeout duration for the HTTP request.
     * @param timeout Timeout in milliseconds.
     */
    RequestModel.prototype.setTimeout = function (timeout) {
        this.timeout = timeout;
        return this;
    };
    /**
     * Retrieves the timeout duration of the HTTP request.
     * @returns Timeout in milliseconds.
     */
    RequestModel.prototype.getTimeout = function () {
        return this.timeout;
    };
    /**
     * Retrieves the base URL of the HTTP request.
     * @returns The base URL as a string.
     */
    RequestModel.prototype.getUrl = function () {
        return this.url;
    };
    /**
     * Sets the base URL of the HTTP request.
     * @param url The base URL as a string.
     */
    RequestModel.prototype.setUrl = function (url) {
        this.url = url;
        return this;
    };
    /**
     * Retrieves the scheme of the HTTP request.
     * @returns The scheme as a string.
     */
    RequestModel.prototype.getScheme = function () {
        return this.scheme;
    };
    /**
     * Sets the scheme of the HTTP request.
     * @param scheme The scheme to set (http or https).
     */
    RequestModel.prototype.setScheme = function (scheme) {
        this.scheme = scheme;
        return this;
    };
    /**
     * Retrieves the port number of the HTTP request.
     * @returns The port number as an integer.
     */
    RequestModel.prototype.getPort = function () {
        return this.port;
    };
    /**
     * Sets the port number for the HTTP request.
     * @param port The port number to set.
     */
    RequestModel.prototype.setPort = function (port) {
        this.port = port;
        return this;
    };
    /**
     * Retrieves the path of the HTTP request.
     * @returns The path as a string.
     */
    RequestModel.prototype.getPath = function () {
        return this.path;
    };
    /**
     * Sets the path of the HTTP request.
     * @param path The path to set.
     */
    RequestModel.prototype.setPath = function (path) {
        this.path = path;
        return this;
    };
    /**
     * Retrieves the retry configuration.
     * @returns The retry configuration.
     */
    RequestModel.prototype.getRetryConfig = function () {
        return __assign({}, this.retryConfig);
    };
    /**
     * Sets the retry configuration.
     * @param retryConfig The retry configuration to set.
     */
    RequestModel.prototype.setRetryConfig = function (retryConfig) {
        this.retryConfig = retryConfig;
        return this;
    };
    /**
     * Sets the event name.
     * @param eventName The event name to set.
     */
    RequestModel.prototype.setEventName = function (eventName) {
        this.eventName = eventName;
        return this;
    };
    /**
     * Retrieves the event name.
     * @returns The event name as a string.
     */
    RequestModel.prototype.getEventName = function () {
        return this.eventName;
    };
    /**
     * Sets the UUID.
     * @param uuid The UUID to set.
     */
    RequestModel.prototype.setUuid = function (uuid) {
        this.uuid = uuid;
        return this;
    };
    /**
     * Retrieves the UUID.
     * @returns The UUID as a string.
     */
    RequestModel.prototype.getUuid = function () {
        return this.uuid;
    };
    /**
     * Sets the campaign ID.
     * @param campaignId The campaign ID to set.
     */
    RequestModel.prototype.setCampaignId = function (campaignId) {
        this.campaignId = campaignId;
        return this;
    };
    /**
     * Retrieves the campaign ID.
     * @returns The campaign ID as a string.
     */
    RequestModel.prototype.getCampaignId = function () {
        return this.campaignId;
    };
    /**
     * Sets the event properties.
     * @param eventProperties The event properties to set.
     */
    RequestModel.prototype.setEventProperties = function (eventProperties) {
        this.eventProperties = eventProperties;
        return this;
    };
    /**
     * Retrieves the event properties.
    /**
     * Retrieves the event properties.
     * @returns The event properties.
     */
    RequestModel.prototype.getEventProperties = function () {
        return this.eventProperties;
    };
    /**
     * Constructs the options for the HTTP request based on the current state of the model.
     * This method is used to prepare the request options for execution.
     * @returns A record containing all relevant options for the HTTP request.
     */
    RequestModel.prototype.getOptions = function () {
        var queryParams = '';
        for (var key in this.query) {
            var queryString = "".concat(key, "=").concat(this.query[key], "&");
            queryParams += queryString;
        }
        var _a = this.url.split('/'), hostname = _a[0], collectionPrefix = _a[1];
        var options = {
            hostname: hostname, // if url is example.com/as01, hostname will be example.com
            agent: false,
        };
        if (this.scheme) {
            options.scheme = this.scheme;
        }
        if (this.port) {
            options.port = this.port;
        }
        if (this.headers) {
            options.headers = this.headers;
        }
        if (this.method) {
            options.method = this.method;
        }
        if (this.body) {
            var postBody = JSON.stringify(this.body);
            options.headers = options.headers || {};
            options.headers['Content-Type'] = 'application/json';
            if (typeof Buffer === 'undefined') {
                options.headers['Content-Length'] = new TextEncoder().encode(postBody).length;
            }
            else {
                options.headers['Content-Length'] = Buffer.byteLength(postBody);
            }
            options.body = this.body;
        }
        if (this.path) {
            if (queryParams !== '') {
                options.path = this.path + '?' + queryParams || '';
            }
            else {
                options.path = this.path;
            }
        }
        if (collectionPrefix) {
            options.path = "/".concat(collectionPrefix) + options.path;
        }
        if (this.timeout) {
            options.timeout = this.timeout;
        }
        if (options.path.charAt(options.path.length - 1) === '&') {
            options.path = options.path.substring(0, options.path.length - 1);
        }
        options.retryConfig = this.retryConfig;
        return options;
    };
    /**
     * Retrieves the extra information of the HTTP request.
     * @returns A record of key-value pairs representing the extra information.
     */
    RequestModel.prototype.getExtraInfo = function () {
        var _this = this;
        // return eventName, uuid, campaignId if they are not null and not undefined
        return Object.fromEntries(Object.entries(this).filter(function (_a) {
            var key = _a[0], value = _a[1];
            return !(0, DataTypeUtil_1.isNull)(value) && !(0, DataTypeUtil_1.isUndefined)(value) && _this.whiteListedKeys.includes(key);
        }));
    };
    return RequestModel;
}());
exports.RequestModel = RequestModel;
//# sourceMappingURL=RequestModel.js.map