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
export declare class GlobalRequestModel {
    private url;
    private timeout;
    private query;
    private body;
    private headers;
    private isDevelopmentMode;
    /**
     * Constructs an instance of the GlobalRequestModel.
     * @param url The base URL of the HTTP request.
     * @param query Query parameters as a record of key-value pairs.
     * @param body Body of the request as a record of key-value pairs.
     * @param headers HTTP headers as a record of key-value pairs.
     */
    constructor(url: string, query: Record<string, dynamic>, body: Record<string, dynamic>, headers: Record<string, any>);
    /**
     * Sets the query parameters for the HTTP request.
     * @param query A record of key-value pairs representing the query parameters.
     */
    setQuery(query: Record<string, dynamic>): void;
    /**
     * Retrieves the query parameters of the HTTP request.
     * @returns A record of key-value pairs representing the query parameters.
     */
    getQuery(): Record<string, dynamic>;
    /**
     * Sets the body of the HTTP request.
     * @param body A record of key-value pairs representing the body content.
     */
    setBody(body: Record<string, dynamic>): void;
    /**
     * Retrieves the body of the HTTP request.
     * @returns A record of key-value pairs representing the body content.
     */
    getBody(): Record<string, dynamic>;
    /**
     * Sets the base URL of the HTTP request.
     * @param url The base URL as a string.
     */
    setBaseUrl(url: string): void;
    /**
     * Retrieves the base URL of the HTTP request.
     * @returns The base URL as a string.
     */
    getBaseUrl(): string;
    /**
     * Sets the timeout duration for the HTTP request.
     * @param timeout Timeout in milliseconds.
     */
    setTimeout(timeout: number): void;
    /**
     * Retrieves the timeout duration of the HTTP request.
     * @returns Timeout in milliseconds.
     */
    getTimeout(): number;
    /**
     * Sets the HTTP headers for the request.
     * @param headers A record of key-value pairs representing the HTTP headers.
     */
    setHeaders(headers: Record<string, string>): void;
    /**
     * Retrieves the HTTP headers of the request.
     * @returns A record of key-value pairs representing the HTTP headers.
     */
    getHeaders(): Record<string, string>;
    /**
     * Sets the development mode status for the request.
     * @param isDevelopmentMode Boolean flag indicating if the request is in development mode.
     */
    setDevelopmentMode(isDevelopmentMode: boolean): void;
    /**
     * Retrieves the development mode status of the request.
     * @returns Boolean indicating if the request is in development mode.
     */
    getDevelopmentMode(): boolean;
}
