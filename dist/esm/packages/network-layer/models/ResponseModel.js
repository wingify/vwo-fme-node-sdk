import { getFormattedErrorMessage } from '../../../utils/FunctionUtil.js';
/**
 * Represents the response model for network operations.
 * This class encapsulates details about the HTTP response including status code, headers, data, and errors.
 */
export class ResponseModel {
    /**
     * Sets the status code of the response.
     * @param {number} statusCode - The HTTP status code
     */
    setStatusCode(statusCode) {
        this.statusCode = statusCode;
    }
    /**
     * Sets the headers of the response.
     * @param {Record<string, string>} headers - The headers of the response
     */
    setHeaders(headers) {
        this.headers = headers;
    }
    /**
     * Sets the data of the response.
     * @param {dynamic} data - The data payload of the response
     */
    setData(data) {
        this.data = data;
    }
    /**
     * Sets the error object of the response.
     * @param {dynamic} error - The error object if the request failed
     */
    setError(error) {
        this.error = getFormattedErrorMessage(error);
    }
    /**
     * Retrieves the headers of the response.
     * @returns {Record<string, string>} The headers of the response
     */
    getHeaders() {
        return this.headers;
    }
    /**
     * Retrieves the data payload of the response.
     * @returns {dynamic} The data payload of the response
     */
    getData() {
        return this.data;
    }
    /**
     * Retrieves the status code of the response.
     * @returns {number} The HTTP status code
     */
    getStatusCode() {
        return this.statusCode;
    }
    /**
     * Retrieves the error object of the response.
     * @returns {dynamic} The error object if the request failed
     */
    getError() {
        return this.error;
    }
    /**
     * Sets the total number of attempts made to send the request.
     * @param {number} totalAttempts - The total number of attempts made to send the request
     */
    setTotalAttempts(totalAttempts) {
        this.totalAttempts = totalAttempts;
    }
    /**
     * Retrieves the total number of attempts made to send the request.
     * @returns {number} The total number of attempts made to send the request
     */
    getTotalAttempts() {
        return this.totalAttempts;
    }
}
//# sourceMappingURL=ResponseModel.js.map