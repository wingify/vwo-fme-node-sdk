"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalRequestModel = void 0;
var constants_1 = require("../../../constants");
/**
 * Represents a model for global HTTP requests configuration.
 * This class encapsulates all necessary details such as URL, query parameters, body, headers,
 * timeout settings, and development mode flag.
 */
var GlobalRequestModel = /** @class */ (function () {
    /**
     * Constructs an instance of the GlobalRequestModel.
     * @param url The base URL of the HTTP request.
     * @param query Query parameters as a record of key-value pairs.
     * @param body Body of the request as a record of key-value pairs.
     * @param headers HTTP headers as a record of key-value pairs.
     */
    function GlobalRequestModel(url, query, body, headers) {
        this.timeout = constants_1.Constants.EVENTS_CALL_TIMEOUT; // Default timeout for the HTTP request in milliseconds
        this.url = url;
        this.query = query;
        this.body = body;
        this.headers = headers;
    }
    /**
     * Sets the query parameters for the HTTP request.
     * @param query A record of key-value pairs representing the query parameters.
     */
    GlobalRequestModel.prototype.setQuery = function (query) {
        this.query = query;
    };
    /**
     * Retrieves the query parameters of the HTTP request.
     * @returns A record of key-value pairs representing the query parameters.
     */
    GlobalRequestModel.prototype.getQuery = function () {
        return this.query;
    };
    /**
     * Sets the body of the HTTP request.
     * @param body A record of key-value pairs representing the body content.
     */
    GlobalRequestModel.prototype.setBody = function (body) {
        this.body = body;
    };
    /**
     * Retrieves the body of the HTTP request.
     * @returns A record of key-value pairs representing the body content.
     */
    GlobalRequestModel.prototype.getBody = function () {
        return this.body;
    };
    /**
     * Sets the base URL of the HTTP request.
     * @param url The base URL as a string.
     */
    GlobalRequestModel.prototype.setBaseUrl = function (url) {
        this.url = url;
    };
    /**
     * Retrieves the base URL of the HTTP request.
     * @returns The base URL as a string.
     */
    GlobalRequestModel.prototype.getBaseUrl = function () {
        return this.url;
    };
    /**
     * Sets the timeout duration for the HTTP request.
     * @param timeout Timeout in milliseconds.
     */
    GlobalRequestModel.prototype.setTimeout = function (timeout) {
        this.timeout = timeout;
    };
    /**
     * Retrieves the timeout duration of the HTTP request.
     * @returns Timeout in milliseconds.
     */
    GlobalRequestModel.prototype.getTimeout = function () {
        return this.timeout;
    };
    /**
     * Sets the HTTP headers for the request.
     * @param headers A record of key-value pairs representing the HTTP headers.
     */
    GlobalRequestModel.prototype.setHeaders = function (headers) {
        this.headers = headers;
    };
    /**
     * Retrieves the HTTP headers of the request.
     * @returns A record of key-value pairs representing the HTTP headers.
     */
    GlobalRequestModel.prototype.getHeaders = function () {
        return this.headers;
    };
    /**
     * Sets the development mode status for the request.
     * @param isDevelopmentMode Boolean flag indicating if the request is in development mode.
     */
    GlobalRequestModel.prototype.setDevelopmentMode = function (isDevelopmentMode) {
        this.isDevelopmentMode = isDevelopmentMode;
    };
    /**
     * Retrieves the development mode status of the request.
     * @returns Boolean indicating if the request is in development mode.
     */
    GlobalRequestModel.prototype.getDevelopmentMode = function () {
        return this.isDevelopmentMode;
    };
    return GlobalRequestModel;
}());
exports.GlobalRequestModel = GlobalRequestModel;
//# sourceMappingURL=GlobalRequestModel.js.map