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

import { v4 as uuidv4 } from 'uuid';
import { dynamic } from '../../../types/Common';

import { Logger } from '../Logger';
import { LogTransportManager } from './TransportManager';

import { isObject } from '../../../utils/DataTypeUtil';
import { LogLevelEnum } from '../enums/LogLevelEnum';
import { buildMessage } from '../../../utils/LogMessageUtil';
import { DebuggerCategoryEnum } from '../../../enums/DebuggerCategoryEnum';
import { sendDebugEventToVWO } from '../../../utils/DebuggerServiceUtil';
import { ErrorLogMessagesEnum } from '../../../enums/log-messages';
import { getFormattedErrorMessage } from '../../../utils/FunctionUtil';
import { ServiceContainer } from '../../../services/ServiceContainer';

type LogTransport = {
  log: (level: string, message: string) => void;
};

/**
 * Interface defining the structure and methods for LogManager.
 */
export interface ILogManager {
  transportManager?: LogTransportManager;
  config?: Record<string, dynamic>;
  name?: string;
  requestId?: string;
  level: string;
  prefix?: string;
  shouldLogToStandardOutput?: boolean;
  dateTimeFormat?: () => string;

  transport?: LogTransport;
  transports?: Array<LogTransport>;

  addTransport?(transportObject: LogTransport): void;
  addTransports?(transportsList: Array<LogTransport>): void;
  errorLog?(
    template: string,
    data?: Record<string, any>,
    debugData?: Record<string, any>,
    shouldSendToVWO?: boolean,
  ): void;
}

/**
 * LogManager class provides logging functionality with support for multiple transports.
 * It is designed as a singleton to ensure a single instance throughout the application.
 */
export class LogManager extends Logger implements ILogManager {
  transportManager: LogTransportManager;
  config: Record<string, any>;
  name = 'VWO Logger'; // Default logger name
  requestId = uuidv4(); // Unique request ID generated for each instance
  level = LogLevelEnum.ERROR; // Default logging level
  prefix = 'VWO-SDK'; // Default prefix for log messages
  public dateTimeFormat(): string {
    return new Date().toISOString(); // Default date-time format for log messages
  }
  transport: LogTransport;
  transports: Array<LogTransport>;
  shouldLogToStandardOutput: boolean = false;
  serviceContainer: ServiceContainer;
  /**
   * Constructor for LogManager.
   * @param {Record<string, any>} config - Configuration object for LogManager.
   */
  constructor(config?: Record<string, any>) {
    super();

    this.config = config;

    // Initialize configuration with defaults or provided values
    this.config.name = config.name || this.name;
    this.config.requestId = config.requestId || this.requestId;
    this.config.level = config.level || this.level;
    this.config.prefix = config.prefix || this.prefix;
    this.config.dateTimeFormat = config.dateTimeFormat || this.dateTimeFormat;
    this.config.shouldLogToStandardOutput = config.shouldLogToStandardOutput || this.shouldLogToStandardOutput;
    this.transportManager = new LogTransportManager(this.config);

    this.handleTransports();
  }

  injectServiceContainer(serviceContainer: ServiceContainer): void {
    this.serviceContainer = serviceContainer;
  }

  /**
   * Handles the initialization and setup of transports based on configuration.
   */
  handleTransports(): void {
    const transports = this.config.transports;

    if (transports?.length) {
      this.addTransports(this.config.transports);
    } else if (this.config.transport && isObject(this.config.transport)) {
      this.addTransport(this.config.transport);
    }
  }

  /**
   * Adds a single transport to the LogManager.
   * @param {Record<any, any>} transport - The transport object to add.
   */
  addTransport(transport: Record<any, any>): void {
    this.transportManager.addTransport(transport);
  }

  /**
   * Adds multiple transports to the LogManager.
   * @param {Array<Record<any, any>>} transports - The list of transport objects to add.
   */
  addTransports(transports: Record<any, any>): void {
    for (let i = 0; i < transports.length; i++) {
      this.addTransport(transports[i]);
    }
  }

  /**
   * Logs a trace message.
   * @param {string} message - The message to log at trace level.
   */
  trace(message: string): void {
    this.transportManager.log(LogLevelEnum.TRACE, message);
  }

  /**
   * Logs a debug message.
   * @param {string} message - The message to log at debug level.
   */
  debug(message: string): void {
    this.transportManager.log(LogLevelEnum.DEBUG, message);
  }

  /**
   * Logs an informational message.
   * @param {string} message - The message to log at info level.
   */
  info(message: string): void {
    this.transportManager.log(LogLevelEnum.INFO, message);
  }

  /**
   * Logs a warning message.
   * @param {string} message - The message to log at warn level.
   */
  warn(message: string): void {
    this.transportManager.log(LogLevelEnum.WARN, message);
  }

  /**
   * Logs an error message.
   * @param {string} message - The message to log at error level.
   */
  error(message: string): void {
    this.transportManager.log(LogLevelEnum.ERROR, message);
  }

  /**
   * Middleware method that stores error in DebuggerService and logs it.
   * @param {boolean} shouldSendToVWO - Whether to send the error to VWO.
   * @param {string} category - The category of the error.
   */
  errorLog(
    template: string,
    data: Record<string, any> = {},
    debugData: Record<string, any> = {},
    shouldSendToVWO: boolean = true,
  ): void {
    try {
      const message = buildMessage(ErrorLogMessagesEnum[template], data);
      this.error(message);
      if (shouldSendToVWO) {
        const debugEventProps = {
          ...debugData,
          ...data,
          msg_t: template,
          msg: message,
          lt: LogLevelEnum.ERROR.toString(),
          cg: DebuggerCategoryEnum.ERROR,
        };
        // send debug event to VWO
        sendDebugEventToVWO(this.serviceContainer, debugEventProps);
      }
    } catch (err) {
      console.error('Got error while logging error' + getFormattedErrorMessage(err));
    }
  }
}
