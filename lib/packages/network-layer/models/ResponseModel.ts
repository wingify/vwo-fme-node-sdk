/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { dynamic } from '../../../types/Common';
import { getFormattedErrorMessage } from '../../../utils/FunctionUtil';
/**
 * Represents the response model for network operations.
 * This class encapsulates details about the HTTP response including status code, headers, data, and errors.
 */
export class ResponseModel {
  private statusCode: number; // HTTP status code of the response
  private error: string; // Error object if the request failed
  private headers: Record<string, string>; // Headers received in the response
  private data: dynamic; // Data payload of the response
  private totalAttempts: number; // Total number of attempts made to send the request

  /**
   * Sets the status code of the response.
   * @param {number} statusCode - The HTTP status code
   */
  setStatusCode(statusCode: number): void {
    this.statusCode = statusCode;
  }

  /**
   * Sets the headers of the response.
   * @param {Record<string, string>} headers - The headers of the response
   */
  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  /**
   * Sets the data of the response.
   * @param {dynamic} data - The data payload of the response
   */
  setData(data: dynamic): void {
    this.data = data;
  }

  /**
   * Sets the error object of the response.
   * @param {dynamic} error - The error object if the request failed
   */
  setError(error: dynamic): void {
    this.error = getFormattedErrorMessage(error);
  }

  /**
   * Retrieves the headers of the response.
   * @returns {Record<string, string>} The headers of the response
   */
  getHeaders(): Record<string, string> {
    return this.headers;
  }

  /**
   * Retrieves the data payload of the response.
   * @returns {dynamic} The data payload of the response
   */
  getData(): dynamic {
    return this.data;
  }

  /**
   * Retrieves the status code of the response.
   * @returns {number} The HTTP status code
   */
  getStatusCode(): number {
    return this.statusCode;
  }

  /**
   * Retrieves the error object of the response.
   * @returns {dynamic} The error object if the request failed
   */
  getError(): string {
    return this.error;
  }

  /**
   * Sets the total number of attempts made to send the request.
   * @param {number} totalAttempts - The total number of attempts made to send the request
   */
  setTotalAttempts(totalAttempts: number): void {
    this.totalAttempts = totalAttempts;
  }

  /**
   * Retrieves the total number of attempts made to send the request.
   * @returns {number} The total number of attempts made to send the request
   */
  getTotalAttempts(): number {
    return this.totalAttempts;
  }
}
