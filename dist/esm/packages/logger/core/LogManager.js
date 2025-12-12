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
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../Logger.js';
import { LogTransportManager } from './TransportManager.js';
import { isObject } from '../../../utils/DataTypeUtil.js';
import { LogLevelEnum } from '../enums/LogLevelEnum.js';
import { buildMessage } from '../../../utils/LogMessageUtil.js';
import { DebuggerCategoryEnum } from '../../../enums/DebuggerCategoryEnum.js';
import { sendDebugEventToVWO } from '../../../utils/DebuggerServiceUtil.js';
import { ErrorLogMessagesEnum } from '../../../enums/log-messages/index.js';
import { getFormattedErrorMessage } from '../../../utils/FunctionUtil.js';
/**
 * LogManager class provides logging functionality with support for multiple transports.
 * It is designed as a singleton to ensure a single instance throughout the application.
 */
export class LogManager extends Logger {
    dateTimeFormat() {
        return new Date().toISOString(); // Default date-time format for log messages
    }
    /**
     * Constructor for LogManager.
     * @param {Record<string, any>} config - Configuration object for LogManager.
     */
    constructor(config) {
        super();
        this.name = 'VWO Logger'; // Default logger name
        this.requestId = uuidv4(); // Unique request ID generated for each instance
        this.level = LogLevelEnum.ERROR; // Default logging level
        this.prefix = 'VWO-SDK'; // Default prefix for log messages
        this.shouldLogToStandardOutput = false;
        this.config = config;
        if (config.isAlwaysNewInstance || !LogManager.instance) {
            LogManager.instance = this;
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
        return LogManager.instance;
    }
    /**
     * Provides access to the singleton instance of LogManager.
     * @returns {LogManager} The singleton instance.
     */
    static get Instance() {
        return LogManager.instance;
    }
    /**
     * Handles the initialization and setup of transports based on configuration.
     */
    handleTransports() {
        const transports = this.config.transports;
        if (transports?.length) {
            this.addTransports(this.config.transports);
        }
        else if (this.config.transport && isObject(this.config.transport)) {
            this.addTransport(this.config.transport);
        }
    }
    /**
     * Adds a single transport to the LogManager.
     * @param {Record<any, any>} transport - The transport object to add.
     */
    addTransport(transport) {
        this.transportManager.addTransport(transport);
    }
    /**
     * Adds multiple transports to the LogManager.
     * @param {Array<Record<any, any>>} transports - The list of transport objects to add.
     */
    addTransports(transports) {
        for (let i = 0; i < transports.length; i++) {
            this.addTransport(transports[i]);
        }
    }
    /**
     * Logs a trace message.
     * @param {string} message - The message to log at trace level.
     */
    trace(message) {
        this.transportManager.log(LogLevelEnum.TRACE, message);
    }
    /**
     * Logs a debug message.
     * @param {string} message - The message to log at debug level.
     */
    debug(message) {
        this.transportManager.log(LogLevelEnum.DEBUG, message);
    }
    /**
     * Logs an informational message.
     * @param {string} message - The message to log at info level.
     */
    info(message) {
        this.transportManager.log(LogLevelEnum.INFO, message);
    }
    /**
     * Logs a warning message.
     * @param {string} message - The message to log at warn level.
     */
    warn(message) {
        this.transportManager.log(LogLevelEnum.WARN, message);
    }
    /**
     * Logs an error message.
     * @param {string} message - The message to log at error level.
     */
    error(message) {
        this.transportManager.log(LogLevelEnum.ERROR, message);
    }
    /**
     * Middleware method that stores error in DebuggerService and logs it.
     * @param {boolean} shouldSendToVWO - Whether to send the error to VWO.
     * @param {string} category - The category of the error.
     */
    errorLog(template, data = {}, debugData = {}, shouldSendToVWO = true) {
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
                sendDebugEventToVWO(debugEventProps);
            }
        }
        catch (err) {
            console.error('Got error while logging error' + getFormattedErrorMessage(err));
        }
    }
}
//# sourceMappingURL=LogManager.js.map