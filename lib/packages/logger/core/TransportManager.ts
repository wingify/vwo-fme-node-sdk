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

import { dynamic } from '../../../types/Common';
import { LogLevelEnum } from '../enums/LogLevelEnum';
import { LogMessageBuilder } from '../LogMessageBuilder';
import { Logger } from '../Logger';

enum LogLevelNumberEnum {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4
}

interface IlogTransport extends Logger {
  transports: Array<Record<string, dynamic>>;
  config: Record<string, dynamic>;

  // Determines if a message should be logged based on the transport and configuration levels
  shouldLog(transportLevel: string, configLevel: string): boolean;
  // Logs a message at a specified level
  log(level: string, message: string): void;
}

/**
 * Manages logging transports and delegates logging messages to them based on configuration.
 * Implements the IlogTransport interface.
 */
export class LogTransportManager implements IlogTransport {
  transports: Array<Record<string, any>>;
  config: Record<string, any>;

  /**
   * Initializes the manager with a configuration object.
   * @param {Record<string, any>} config - Configuration settings for the log manager.
   */
  constructor(config: Record<string, any>) {
    this.transports = [];
    this.config = config;
  }

  /**
   * Adds a new transport to the manager.
   * @param {Record<string, any>} transport - The transport object to be added.
   */
  addTransport(transport: Record<string, any>): void {
    this.transports.push(transport);
  }

  /**
   * Determines if the log should be processed based on the transport and configuration levels.
   * @param {string} transportLevel - The log level set for the transport.
   * @param {string} configLevel - The log level set in the configuration.
   * @returns {boolean} - Returns true if the log level is appropriate for logging, false otherwise.
   */
  shouldLog(transportLevel: string, configLevel: string): boolean {
    // Default to the most specific level available
    transportLevel = transportLevel || configLevel || this.config.level;

    const targetLevel = LogLevelNumberEnum[transportLevel.toUpperCase()];
    const desiredLevel = LogLevelNumberEnum[(configLevel || this.config.level).toUpperCase()];

    return targetLevel >= desiredLevel;
  }

  /**
   * Logs a message at TRACE level.
   * @param {string} message - The message to log.
   */
  trace(message: string): void {
    this.log(LogLevelEnum.TRACE, message);
  }

  /**
   * Logs a message at DEBUG level.
   * @param {string} message - The message to log.
   */
  debug(message: string): void {
    this.log(LogLevelEnum.DEBUG, message);
  }

  /**
   * Logs a message at INFO level.
   * @param {string} message - The message to log.
   */
  info(message: string): void {
    this.log(LogLevelEnum.INFO, message);
  }

  /**
   * Logs a message at WARN level.
   * @param {string} message - The message to log.
   */
  warn(message: string): void {
    this.log(LogLevelEnum.WARN, message);
  }

  /**
   * Logs a message at ERROR level.
   * @param {string} message - The message to log.
   */
  error(message: string): void {
    this.log(LogLevelEnum.ERROR, message);
  }

  /**
   * Delegates the logging of messages to the appropriate transports.
   * @param {string} level - The level at which to log the message.
   * @param {string} message - The message to log.
   */
  log(level: string, message: string): void {
    for (let i = 0; i < this.transports.length; i++) {
      const logMessageBuilder = new LogMessageBuilder(this.config, this.transports[i]);
      const formattedMessage = logMessageBuilder.formatMessage(level, message);
      if (this.shouldLog(level, this.transports[i].level)) {
        if (this.transports[i].logHandler) {
          // Use custom log handler if available
          this.transports[i].logHandler(formattedMessage, level);
        } else {
          // Otherwise, use the default log method
          this.transports[i][level](formattedMessage, level);
        }
      }
    }
  }
}
