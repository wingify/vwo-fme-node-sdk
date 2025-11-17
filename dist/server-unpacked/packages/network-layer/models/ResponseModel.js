"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModel = void 0;
var FunctionUtil_1 = require("../../../utils/FunctionUtil");
/**
 * Represents the response model for network operations.
 * This class encapsulates details about the HTTP response including status code, headers, data, and errors.
 */
var ResponseModel = /** @class */ (function () {
    function ResponseModel() {
    }
    /**
     * Sets the status code of the response.
     * @param {number} statusCode - The HTTP status code
     */
    ResponseModel.prototype.setStatusCode = function (statusCode) {
        this.statusCode = statusCode;
    };
    /**
     * Sets the headers of the response.
     * @param {Record<string, string>} headers - The headers of the response
     */
    ResponseModel.prototype.setHeaders = function (headers) {
        this.headers = headers;
    };
    /**
     * Sets the data of the response.
     * @param {dynamic} data - The data payload of the response
     */
    ResponseModel.prototype.setData = function (data) {
        this.data = data;
    };
    /**
     * Sets the error object of the response.
     * @param {dynamic} error - The error object if the request failed
     */
    ResponseModel.prototype.setError = function (error) {
        this.error = (0, FunctionUtil_1.getFormattedErrorMessage)(error);
    };
    /**
     * Retrieves the headers of the response.
     * @returns {Record<string, string>} The headers of the response
     */
    ResponseModel.prototype.getHeaders = function () {
        return this.headers;
    };
    /**
     * Retrieves the data payload of the response.
     * @returns {dynamic} The data payload of the response
     */
    ResponseModel.prototype.getData = function () {
        return this.data;
    };
    /**
     * Retrieves the status code of the response.
     * @returns {number} The HTTP status code
     */
    ResponseModel.prototype.getStatusCode = function () {
        return this.statusCode;
    };
    /**
     * Retrieves the error object of the response.
     * @returns {dynamic} The error object if the request failed
     */
    ResponseModel.prototype.getError = function () {
        return this.error;
    };
    /**
     * Sets the total number of attempts made to send the request.
     * @param {number} totalAttempts - The total number of attempts made to send the request
     */
    ResponseModel.prototype.setTotalAttempts = function (totalAttempts) {
        this.totalAttempts = totalAttempts;
    };
    /**
     * Retrieves the total number of attempts made to send the request.
     * @returns {number} The total number of attempts made to send the request
     */
    ResponseModel.prototype.getTotalAttempts = function () {
        return this.totalAttempts;
    };
    return ResponseModel;
}());
exports.ResponseModel = ResponseModel;
//# sourceMappingURL=ResponseModel.js.map