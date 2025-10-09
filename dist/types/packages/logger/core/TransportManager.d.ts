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
import { Logger } from '../Logger';
export declare enum LogLevelNumberEnum {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4
}
interface IlogTransport extends Logger {
    transports: Array<Record<string, dynamic>>;
    config: Record<string, dynamic>;
    shouldLog(transportLevel: string, configLevel: string): boolean;
    log(level: string, message: string): void;
}
/**
 * Manages logging transports and delegates logging messages to them based on configuration.
 * Implements the IlogTransport interface.
 */
export declare class LogTransportManager implements IlogTransport {
    transports: Array<Record<string, any>>;
    config: Record<string, any>;
    /**
     * Initializes the manager with a configuration object.
     * @param {Record<string, any>} config - Configuration settings for the log manager.
     */
    constructor(config: Record<string, any>);
    /**
     * Adds a new transport to the manager.
     * @param {Record<string, any>} transport - The transport object to be added.
     */
    addTransport(transport: Record<string, any>): void;
    /**
     * Determines if the log should be processed based on the transport and configuration levels.
     * @param {string} transportLevel - The log level set for the transport.
     * @param {string} configLevel - The log level set in the configuration.
     * @returns {boolean} - Returns true if the log level is appropriate for logging, false otherwise.
     */
    shouldLog(transportLevel: string, configLevel: string): boolean;
    /**
     * Logs a message at TRACE level.
     * @param {string} message - The message to log.
     */
    trace(message: string): void;
    /**
     * Logs a message at DEBUG level.
     * @param {string} message - The message to log.
     */
    debug(message: string): void;
    /**
     * Logs a message at INFO level.
     * @param {string} message - The message to log.
     */
    info(message: string): void;
    /**
     * Logs a message at WARN level.
     * @param {string} message - The message to log.
     */
    warn(message: string): void;
    /**
     * Logs a message at ERROR level.
     * @param {string} message - The message to log.
     */
    error(message: string): void;
    /**
     * Delegates the logging of messages to the appropriate transports.
     * @param {string} level - The level at which to log the message.
     * @param {string} message - The message to log.
     */
    log(level: string, message: string): void;
}
export {};
