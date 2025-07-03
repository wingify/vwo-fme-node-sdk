import { dynamic } from '../../../types/Common';
import { IRetryConfig } from '../client/NetworkClient';
/**
 * Represents a model for HTTP requests.
 * This class encapsulates all necessary details such as URL, method, path, query parameters, body, headers,
 * scheme, port, and timeout settings.
 */
export declare class RequestModel {
  private url;
  private method;
  private scheme;
  private port;
  private path;
  private query;
  private timeout;
  private body;
  private headers;
  private retryConfig;
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
    method: string,
    path: string,
    query: Record<string, dynamic>,
    body: Record<string, dynamic>,
    headers: Record<string, string>,
    scheme: string,
    port: number,
    retryConfig?: IRetryConfig,
  );
  /**
   * Retrieves the HTTP method.
   * @returns The HTTP method as a string.
   */
  getMethod(): string;
  /**
   * Sets the HTTP method.
   * @param method The HTTP method to set.
   */
  setMethod(method: string): void;
  /**
   * Retrieves the body of the HTTP request.
   * @returns A record of key-value pairs representing the body content.
   */
  getBody(): Record<string, dynamic>;
  /**
   * Sets the body of the HTTP request.
   * @param body A record of key-value pairs representing the body content.
   */
  setBody(body: Record<string, dynamic>): void;
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
   * Sets the HTTP headers for the request.
   * @param headers A record of key-value pairs representing the HTTP headers.
   */
  setHeaders(headers: Record<string, string>): this;
  /**
   * Retrieves the HTTP headers of the request.
   * @returns A record of key-value pairs representing the HTTP headers.
   */
  getHeaders(): Record<string, string>;
  /**
   * Sets the timeout duration for the HTTP request.
   * @param timeout Timeout in milliseconds.
   */
  setTimeout(timeout: number): this;
  /**
   * Retrieves the timeout duration of the HTTP request.
   * @returns Timeout in milliseconds.
   */
  getTimeout(): number;
  /**
   * Retrieves the base URL of the HTTP request.
   * @returns The base URL as a string.
   */
  getUrl(): string;
  /**
   * Sets the base URL of the HTTP request.
   * @param url The base URL as a string.
   */
  setUrl(url: string): this;
  /**
   * Retrieves the scheme of the HTTP request.
   * @returns The scheme as a string.
   */
  getScheme(): string;
  /**
   * Sets the scheme of the HTTP request.
   * @param scheme The scheme to set (http or https).
   */
  setScheme(scheme: string): this;
  /**
   * Retrieves the port number of the HTTP request.
   * @returns The port number as an integer.
   */
  getPort(): number;
  /**
   * Sets the port number for the HTTP request.
   * @param port The port number to set.
   */
  setPort(port: number): this;
  /**
   * Retrieves the path of the HTTP request.
   * @returns The path as a string.
   */
  getPath(): string;
  /**
   * Sets the path of the HTTP request.
   * @param path The path to set.
   */
  setPath(path: string): this;
  /**
   * Retrieves the retry configuration.
   * @returns The retry configuration.
   */
  getRetryConfig(): IRetryConfig;
  /**
   * Sets the retry configuration.
   * @param retryConfig The retry configuration to set.
   */
  setRetryConfig(retryConfig: IRetryConfig): this;
  /**
   * Constructs the options for the HTTP request based on the current state of the model.
   * This method is used to prepare the request options for execution.
   * @returns A record containing all relevant options for the HTTP request.
   */
  getOptions(): Record<string, any>;
}
