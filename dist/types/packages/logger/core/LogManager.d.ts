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
import { Logger } from '../Logger';
import { LogTransportManager } from './TransportManager';
import { LogLevelEnum } from '../enums/LogLevelEnum';
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
export declare class LogManager extends Logger implements ILogManager {
  transportManager: LogTransportManager;
  config: Record<string, any>;
  name: string;
  requestId: any;
  level: LogLevelEnum;
  prefix: string;
  dateTimeFormat(): string;
  transport: LogTransport;
  transports: Array<LogTransport>;
  shouldLogToStandardOutput: boolean;
  serviceContainer: ServiceContainer;
  /**
   * Constructor for LogManager.
   * @param {Record<string, any>} config - Configuration object for LogManager.
   */
  constructor(config?: Record<string, any>);
  injectServiceContainer(serviceContainer: ServiceContainer): void;
  /**
   * Handles the initialization and setup of transports based on configuration.
   */
  handleTransports(): void;
  /**
   * Adds a single transport to the LogManager.
   * @param {Record<any, any>} transport - The transport object to add.
   */
  addTransport(transport: Record<any, any>): void;
  /**
   * Adds multiple transports to the LogManager.
   * @param {Array<Record<any, any>>} transports - The list of transport objects to add.
   */
  addTransports(transports: Record<any, any>): void;
  /**
   * Logs a trace message.
   * @param {string} message - The message to log at trace level.
   */
  trace(message: string): void;
  /**
   * Logs a debug message.
   * @param {string} message - The message to log at debug level.
   */
  debug(message: string): void;
  /**
   * Logs an informational message.
   * @param {string} message - The message to log at info level.
   */
  info(message: string): void;
  /**
   * Logs a warning message.
   * @param {string} message - The message to log at warn level.
   */
  warn(message: string): void;
  /**
   * Logs an error message.
   * @param {string} message - The message to log at error level.
   */
  error(message: string): void;
  /**
   * Middleware method that stores error in DebuggerService and logs it.
   * @param {boolean} shouldSendToVWO - Whether to send the error to VWO.
   * @param {string} category - The category of the error.
   */
  errorLog(
    template: string,
    data?: Record<string, any>,
    debugData?: Record<string, any>,
    shouldSendToVWO?: boolean,
  ): void;
}
export {};
