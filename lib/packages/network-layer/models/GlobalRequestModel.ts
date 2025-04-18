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
import { dynamic } from '../../../types/Common';

/**
 * Represents a model for global HTTP requests configuration.
 * This class encapsulates all necessary details such as URL, query parameters, body, headers,
 * timeout settings, and development mode flag.
 */
export class GlobalRequestModel {
  private url: string; // Base URL of the HTTP request
  private timeout = 3000; // Default timeout for the HTTP request in milliseconds
  private query: Record<string, dynamic>; // Query parameters for the HTTP request
  private body: Record<string, dynamic>; // Body of the HTTP request
  private headers: Record<string, string>; // HTTP headers
  private isDevelopmentMode: boolean; // Flag to indicate if the request is in development mode

  /**
   * Constructs an instance of the GlobalRequestModel.
   * @param url The base URL of the HTTP request.
   * @param query Query parameters as a record of key-value pairs.
   * @param body Body of the request as a record of key-value pairs.
   * @param headers HTTP headers as a record of key-value pairs.
   */
  constructor(
    url: string,
    query: Record<string, dynamic>,
    body: Record<string, dynamic>,
    headers: Record<string, any>,
  ) {
    this.url = url;
    this.query = query;
    this.body = body;
    this.headers = headers;
  }

  /**
   * Sets the query parameters for the HTTP request.
   * @param query A record of key-value pairs representing the query parameters.
   */
  setQuery(query: Record<string, dynamic>): void {
    this.query = query;
  }

  /**
   * Retrieves the query parameters of the HTTP request.
   * @returns A record of key-value pairs representing the query parameters.
   */
  getQuery(): Record<string, dynamic> {
    return this.query;
  }

  /**
   * Sets the body of the HTTP request.
   * @param body A record of key-value pairs representing the body content.
   */
  setBody(body: Record<string, dynamic>): void {
    this.body = body;
  }

  /**
   * Retrieves the body of the HTTP request.
   * @returns A record of key-value pairs representing the body content.
   */
  getBody(): Record<string, dynamic> {
    return this.body;
  }

  /**
   * Sets the base URL of the HTTP request.
   * @param url The base URL as a string.
   */
  setBaseUrl(url: string): void {
    this.url = url;
  }

  /**
   * Retrieves the base URL of the HTTP request.
   * @returns The base URL as a string.
   */
  getBaseUrl(): string {
    return this.url;
  }

  /**
   * Sets the timeout duration for the HTTP request.
   * @param timeout Timeout in milliseconds.
   */
  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  /**
   * Retrieves the timeout duration of the HTTP request.
   * @returns Timeout in milliseconds.
   */
  getTimeout(): number {
    return this.timeout;
  }

  /**
   * Sets the HTTP headers for the request.
   * @param headers A record of key-value pairs representing the HTTP headers.
   */
  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  /**
   * Retrieves the HTTP headers of the request.
   * @returns A record of key-value pairs representing the HTTP headers.
   */
  getHeaders(): Record<string, string> {
    return this.headers;
  }

  /**
   * Sets the development mode status for the request.
   * @param isDevelopmentMode Boolean flag indicating if the request is in development mode.
   */
  setDevelopmentMode(isDevelopmentMode: boolean): void {
    this.isDevelopmentMode = isDevelopmentMode;
  }

  /**
   * Retrieves the development mode status of the request.
   * @returns Boolean indicating if the request is in development mode.
   */
  getDevelopmentMode(): boolean {
    return this.isDevelopmentMode;
  }
}
