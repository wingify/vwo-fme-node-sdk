import { Logger } from '../Logger';
/**
 * ConsoleTransport class implements the Logger interface to provide logging functionality.
 * It outputs logs to the console based on the log level set in the configuration.
 */
export declare class ConsoleTransport implements Logger {
  config: Record<string, any>;
  level: string;
  /**
   * Constructor initializes the ConsoleTransport with a configuration object.
   * @param {Record<string, any>} config - Configuration settings for the logger, including 'level'.
   */
  constructor(config?: Record<string, any>);
  /**
   * Logs a trace message.
   * @param {string} message - The message to log.
   */
  trace(message: string): void;
  /**
   * Logs a debug message.
   * @param {string} message - The message to log.
   */
  debug(message: string): void;
  /**
   * Logs an informational message.
   * @param {string} message - The message to log.
   */
  info(message: string): void;
  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   */
  warn(message: string): void;
  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   */
  error(message: string): void;
  /**
   * Generic log function that logs messages to the console based on the log level.
   * @param {string} level - The log level under which the message should be logged.
   * @param {string} message - The message to log.
   */
  consoleLog(level: string, message: string): void;
}
