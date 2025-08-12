"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogManager = void 0;
const uuid_1 = require("uuid");
const Logger_1 = require("../Logger");
const ConsoleTransport_1 = require("../transports/ConsoleTransport");
const TransportManager_1 = require("./TransportManager");
const DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
const LogLevelEnum_1 = require("../enums/LogLevelEnum");
const LogMessageUtil_1 = require("../../../utils/LogMessageUtil");
/**
 * LogManager class provides logging functionality with support for multiple transports.
 * It is designed as a singleton to ensure a single instance throughout the application.
 */
class LogManager extends Logger_1.Logger {
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
        this.requestId = (0, uuid_1.v4)(); // Unique request ID generated for each instance
        this.level = LogLevelEnum_1.LogLevelEnum.ERROR; // Default logging level
        this.prefix = 'VWO-SDK'; // Default prefix for log messages
        this.config = config;
        if (config.isAlwaysNewInstance || !LogManager.instance) {
            LogManager.instance = this;
            // Initialize configuration with defaults or provided values
            this.config.name = config.name || this.name;
            this.config.requestId = config.requestId || this.requestId;
            this.config.level = config.level || this.level;
            this.config.prefix = config.prefix || this.prefix;
            this.config.dateTimeFormat = config.dateTimeFormat || this.dateTimeFormat;
            this.transportManager = new TransportManager_1.LogTransportManager(this.config);
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
        else if (this.config.transport && (0, DataTypeUtil_1.isObject)(this.config.transport)) {
            this.addTransport(this.config.transport);
        }
        else {
            // if (this.config.defaultTransport)
            // Add default ConsoleTransport if no other transport is specified
            this.addTransport(new ConsoleTransport_1.ConsoleTransport({
                level: this.config.level,
            }));
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
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.TRACE, message);
    }
    /**
     * Logs a debug message.
     * @param {string} message - The message to log at debug level.
     */
    debug(message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
    }
    /**
     * Logs an informational message.
     * @param {string} message - The message to log at info level.
     */
    info(message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.INFO, message);
    }
    /**
     * Logs a warning message.
     * @param {string} message - The message to log at warn level.
     */
    warn(message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.WARN, message);
    }
    /**
     * Logs an error message.
     * @param {string} message - The message to log at error level.
     */
    error(message, extraData = {}) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.ERROR, message);
        (0, LogMessageUtil_1.sendLogToVWO)(message, LogLevelEnum_1.LogLevelEnum.ERROR, extraData);
    }
}
exports.LogManager = LogManager;
//# sourceMappingURL=LogManager.js.map