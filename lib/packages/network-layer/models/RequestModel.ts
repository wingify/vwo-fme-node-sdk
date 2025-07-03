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
import { HttpMethodEnum } from '../../../enums/HttpMethodEnum';
import { dynamic } from '../../../types/Common';
import { HTTPS } from '../../../constants/Url';
import { IRetryConfig } from '../client/NetworkClient';
import { Constants } from '../../../constants';

/**
 * Represents a model for HTTP requests.
 * This class encapsulates all necessary details such as URL, method, path, query parameters, body, headers,
 * scheme, port, and timeout settings.
 */
export class RequestModel {
  private url: string; // Base URL of the HTTP request
  private method: string; // HTTP method (GET, POST, etc.)
  private scheme: string; // Protocol scheme (http, https)
  private port: number; // Port number
  private path: string; // Path of the URL
  private query: Record<string, dynamic>; // Query parameters
  private timeout: number; // Timeout for the HTTP request in milliseconds
  private body: Record<string, dynamic>; // Body of the HTTP request
  private headers: Record<string, string>; // HTTP headers
  private retryConfig: IRetryConfig; // Retry configuration
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
  constructor(
    url: string,
    method: string = HttpMethodEnum.GET,
    path: string,
    query: Record<string, dynamic>,
    body: Record<string, dynamic>,
    headers: Record<string, string>,
    scheme: string = HTTPS,
    port: number,
    retryConfig?: IRetryConfig,
  ) {
    this.url = url;
    this.method = method;
    this.path = path;
    this.query = query;
    this.body = body;
    this.headers = headers;
    this.scheme = scheme;
    this.port = port;
    this.retryConfig = retryConfig || Constants.DEFAULT_RETRY_CONFIG;
  }

  /**
   * Retrieves the HTTP method.
   * @returns The HTTP method as a string.
   */
  getMethod(): string {
    return this.method;
  }

  /**
   * Sets the HTTP method.
   * @param method The HTTP method to set.
   */
  setMethod(method: string): void {
    this.method = method;
  }

  /**
   * Retrieves the body of the HTTP request.
   * @returns A record of key-value pairs representing the body content.
   */
  getBody(): Record<string, dynamic> {
    return this.body;
  }

  /**
   * Sets the body of the HTTP request.
   * @param body A record of key-value pairs representing the body content.
   */
  setBody(body: Record<string, dynamic>): void {
    this.body = body;
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
   * Sets the HTTP headers for the request.
   * @param headers A record of key-value pairs representing the HTTP headers.
   */
  setHeaders(headers: Record<string, string>): this {
    this.headers = headers;
    return this;
  }

  /**
   * Retrieves the HTTP headers of the request.
   * @returns A record of key-value pairs representing the HTTP headers.
   */
  getHeaders(): Record<string, string> {
    return this.headers;
  }

  /**
   * Sets the timeout duration for the HTTP request.
   * @param timeout Timeout in milliseconds.
   */
  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  /**
   * Retrieves the timeout duration of the HTTP request.
   * @returns Timeout in milliseconds.
   */
  getTimeout(): number {
    return this.timeout;
  }

  /**
   * Retrieves the base URL of the HTTP request.
   * @returns The base URL as a string.
   */
  getUrl(): string {
    return this.url;
  }

  /**
   * Sets the base URL of the HTTP request.
   * @param url The base URL as a string.
   */
  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  /**
   * Retrieves the scheme of the HTTP request.
   * @returns The scheme as a string.
   */
  getScheme(): string {
    return this.scheme;
  }

  /**
   * Sets the scheme of the HTTP request.
   * @param scheme The scheme to set (http or https).
   */
  setScheme(scheme: string): this {
    this.scheme = scheme;
    return this;
  }

  /**
   * Retrieves the port number of the HTTP request.
   * @returns The port number as an integer.
   */
  getPort(): number {
    return this.port;
  }

  /**
   * Sets the port number for the HTTP request.
   * @param port The port number to set.
   */
  setPort(port: number): this {
    this.port = port;
    return this;
  }

  /**
   * Retrieves the path of the HTTP request.
   * @returns The path as a string.
   */
  getPath(): string {
    return this.path;
  }

  /**
   * Sets the path of the HTTP request.
   * @param path The path to set.
   */
  setPath(path: string): this {
    this.path = path;
    return this;
  }

  /**
   * Retrieves the retry configuration.
   * @returns The retry configuration.
   */
  getRetryConfig(): IRetryConfig {
    return { ...this.retryConfig };
  }

  /**
   * Sets the retry configuration.
   * @param retryConfig The retry configuration to set.
   */
  setRetryConfig(retryConfig: IRetryConfig): this {
    this.retryConfig = retryConfig;
    return this;
  }

  /**
   * Constructs the options for the HTTP request based on the current state of the model.
   * This method is used to prepare the request options for execution.
   * @returns A record containing all relevant options for the HTTP request.
   */
  getOptions(): Record<string, any> {
    let queryParams = '';
    for (const key in this.query) {
      const queryString = `${key}=${this.query[key]}&`;
      queryParams += queryString;
    }

    const [hostname, collectionPrefix] = this.url.split('/');
    const options: Record<string, any> = {
      hostname, // if url is example.com/as01, hostname will be example.com
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
      const postBody = JSON.stringify(this.body);
      options.headers = options.headers || {};
      options.headers['Content-Type'] = 'application/json';

      if (typeof Buffer === 'undefined') {
        options.headers['Content-Length'] = new TextEncoder().encode(postBody).length;
      } else {
        options.headers['Content-Length'] = Buffer.byteLength(postBody);
      }
      options.body = this.body;
    }

    if (this.path) {
      if (queryParams !== '') {
        options.path = this.path + '?' + queryParams || '';
      } else {
        options.path = this.path;
      }
    }

    if (collectionPrefix) {
      options.path = `/${collectionPrefix}` + options.path;
    }
    if (this.timeout) {
      options.timeout = this.timeout;
    }
    if (options.path.charAt(options.path.length - 1) === '&') {
      options.path = options.path.substring(0, options.path.length - 1);
    }

    options.retryConfig = this.retryConfig;
    return options;
  }
}
