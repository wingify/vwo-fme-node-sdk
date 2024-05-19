/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
import { LogLevelEnum } from '../enums/LogLevelEnum';
import { Logger } from '../Logger';

/**
 * ConsoleTransport class implements the Logger interface to provide logging functionality.
 * It outputs logs to the console based on the log level set in the configuration.
 */
export class ConsoleTransport implements Logger {
  config: Record<string, any>; // Configuration object for the logger
  level: string; // Current log level

  /**
   * Constructor initializes the ConsoleTransport with a configuration object.
   * @param {Record<string, any>} config - Configuration settings for the logger, including 'level'.
   */
  constructor(config: Record<string, any> = {}) {
    this.config = config; // Store the configuration
    this.level = this.config.level; // Set the logging level from the configuration
  }

  /**
   * Logs a trace message.
   * @param {string} message - The message to log.
   */
  trace(message: string): void {
    this.log(LogLevelEnum.TRACE, message);
  }

  /**
   * Logs a debug message.
   * @param {string} message - The message to log.
   */
  debug(message: string): void {
    this.log(LogLevelEnum.DEBUG, message);
  }

  /**
   * Logs an informational message.
   * @param {string} message - The message to log.
   */
  info(message: string): void {
    this.log(LogLevelEnum.INFO, message);
  }

  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   */
  warn(message: string): void {
    this.log(LogLevelEnum.WARN, message);
  }

  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   */
  error(message: string): void {
    this.log(LogLevelEnum.ERROR, message);
  }

  /**
   * Generic log function that logs messages to the console based on the log level.
   * @param {string} level - The log level under which the message should be logged.
   * @param {string} message - The message to log.
   */
  log(level: string, message: string): void {
    console[level](message); // Use console's logging function dynamically based on the level
  }
}
