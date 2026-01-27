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
import { dynamic } from '../../types/Common';
import { LogLevelEnum } from './enums/LogLevelEnum';

const AnsiColorEnum = {
  BOLD: '\x1b[1m',
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  LIGHTBLUE: '\x1b[94m',
  RED: '\x1b[31m',
  RESET: '\x1b[0m',
  WHITE: '\x1b[30m',
  YELLOW: '\x1b[33m',
};
/**
 * Interface defining the structure for a log message builder.
 */
interface ILogMessageBuilder {
  loggerConfig: Record<string, dynamic>; // Configuration for the logger
  transportConfig: Record<string, dynamic>; // Configuration for the transport mechanism
  prefix: string; // Prefix to be added to each log message
  dateTimeFormat: dynamic; // Function or format for date and time in log messages

  formatMessage(level: string, message: string): string; // Method to format a log message
  getFormattedLevel(level: string): string; // Method to format the log level
  getFormattedDateTime(): string; // Method to get formatted date and time
}

/**
 * Implements the ILogMessageBuilder interface to provide a concrete log message builder.
 */
export class LogMessageBuilder implements ILogMessageBuilder {
  loggerConfig: Record<string, any>;
  transportConfig: Record<string, any>;
  prefix: string;
  dateTimeFormat: any;

  /**
   * Constructs a new LogMessageBuilder instance.
   * @param {Record<string, any>} loggerConfig - Configuration for the logger.
   * @param {Record<string, any>} transportConfig - Configuration for the transport mechanism.
   */
  constructor(loggerConfig: Record<string, any>, transportConfig: Record<string, any>) {
    this.loggerConfig = loggerConfig;
    this.transportConfig = transportConfig;

    // Set the prefix, defaulting to an empty string if not provided.
    this.prefix = this.transportConfig.prefix || this.loggerConfig.prefix || '';
    // Set the date and time format, defaulting to the logger's format if the transport's format is not provided.
    this.dateTimeFormat = this.transportConfig.dateTimeFormat || this.loggerConfig.dateTimeFormat;
  }

  /**
   * Formats a log message combining level, prefix, date/time, and the actual message.
   * @param {string} level - The log level.
   * @param {string} message - The message to log.
   * @returns {string} The formatted log message.
   */
  formatMessage(level: string, message: string): string {
    return `[${this.getFormattedLevel(level)}]: ${this.getFormattedPrefix(this.prefix)} ${this.getFormattedDateTime()} ${message}`;
  }

  getFormattedPrefix(prefix: string): string {
    if (this.loggerConfig.isAnsiColorEnabled) {
      return `${AnsiColorEnum.BOLD}${AnsiColorEnum.GREEN}${prefix}${AnsiColorEnum.RESET}`;
    }

    return `${prefix}`;
  }

  /**
   * Returns the formatted log level with appropriate coloring based on the log level.
   * @param {string} level - The log level.
   * @returns {string} The formatted log level.
   */
  getFormattedLevel(level: string): string {
    const upperCaseLevel = level.toUpperCase();
    let LogLevelColorInfoEnum;

    if (this.loggerConfig.isAnsiColorEnabled) {
      LogLevelColorInfoEnum = {
        [LogLevelEnum.TRACE]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.WHITE}${upperCaseLevel}${AnsiColorEnum.RESET}`,
        [LogLevelEnum.DEBUG]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.LIGHTBLUE}${upperCaseLevel}${AnsiColorEnum.RESET}`,
        [LogLevelEnum.INFO]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.CYAN}${upperCaseLevel}${AnsiColorEnum.RESET}`,
        [LogLevelEnum.WARN]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.YELLOW}${upperCaseLevel}${AnsiColorEnum.RESET}`,
        [LogLevelEnum.ERROR]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.RED}${upperCaseLevel}${AnsiColorEnum.RESET}`,
      };
    } else {
      LogLevelColorInfoEnum = {
        [LogLevelEnum.TRACE]: upperCaseLevel,
        [LogLevelEnum.DEBUG]: upperCaseLevel,
        [LogLevelEnum.INFO]: upperCaseLevel,
        [LogLevelEnum.WARN]: upperCaseLevel,
        [LogLevelEnum.ERROR]: upperCaseLevel,
      };
    }

    return LogLevelColorInfoEnum[level];
  }

  /**
   * Retrieves the current date and time formatted according to the specified format.
   * @returns {string} The formatted date and time.
   */
  getFormattedDateTime(): string {
    return this.dateTimeFormat();
  }
}
