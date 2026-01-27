"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogTransportManager = exports.LogLevelNumberEnum = void 0;
var LogLevelEnum_1 = require("../enums/LogLevelEnum");
var LogMessageBuilder_1 = require("../LogMessageBuilder");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var ConsoleTransport_1 = require("../transports/ConsoleTransport");
var LogLevelNumberEnum;
(function (LogLevelNumberEnum) {
    LogLevelNumberEnum[LogLevelNumberEnum["TRACE"] = 0] = "TRACE";
    LogLevelNumberEnum[LogLevelNumberEnum["DEBUG"] = 1] = "DEBUG";
    LogLevelNumberEnum[LogLevelNumberEnum["INFO"] = 2] = "INFO";
    LogLevelNumberEnum[LogLevelNumberEnum["WARN"] = 3] = "WARN";
    LogLevelNumberEnum[LogLevelNumberEnum["ERROR"] = 4] = "ERROR";
})(LogLevelNumberEnum || (exports.LogLevelNumberEnum = LogLevelNumberEnum = {}));
/**
 * Manages logging transports and delegates logging messages to them based on configuration.
 * Implements the IlogTransport interface.
 */
var LogTransportManager = /** @class */ (function () {
    /**
     * Initializes the manager with a configuration object.
     * @param {Record<string, any>} config - Configuration settings for the log manager.
     */
    function LogTransportManager(config) {
        this.transports = [];
        this.config = config;
        this.consoleTransport = new ConsoleTransport_1.ConsoleTransport({
            level: config.level,
        });
    }
    /**
     * Adds a new transport to the manager.
     * @param {Record<string, any>} transport - The transport object to be added.
     */
    LogTransportManager.prototype.addTransport = function (transport) {
        this.transports.push(transport);
    };
    /**
     * Determines if the log should be processed based on the transport and configuration levels.
     * @param {string} transportLevel - The log level set for the transport.
     * @param {string} configLevel - The log level set in the configuration.
     * @returns {boolean} - Returns true if the log level is appropriate for logging, false otherwise.
     */
    LogTransportManager.prototype.shouldLog = function (transportLevel, configLevel) {
        // Default to the most specific level available
        // transportLevel = transportLevel || configLevel || this.config.level;
        var targetLevel = LogLevelNumberEnum[transportLevel.toUpperCase()];
        var desiredLevel = LogLevelNumberEnum[(configLevel || this.config.level).toUpperCase()];
        return targetLevel >= desiredLevel;
    };
    /**
     * Logs a message at TRACE level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.trace = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.TRACE, message);
    };
    /**
     * Logs a message at DEBUG level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.debug = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
    };
    /**
     * Logs a message at INFO level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.info = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.INFO, message);
    };
    /**
     * Logs a message at WARN level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.warn = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.WARN, message);
    };
    /**
     * Logs a message at ERROR level.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.error = function (message) {
        this.log(LogLevelEnum_1.LogLevelEnum.ERROR, message);
    };
    /**
     * Delegates the logging of messages to the appropriate transports.
     * @param {string} level - The level at which to log the message.
     * @param {string} message - The message to log.
     */
    LogTransportManager.prototype.log = function (level, message) {
        var logMessageBuilder = new LogMessageBuilder_1.LogMessageBuilder(this.config, this.consoleTransport);
        var formattedMessage = logMessageBuilder.formatMessage(level, message);
        // handling console log
        // always log to console if config.level is set
        if (this.config.level) {
            if (this.transports.length === 0 || (this.transports.length > 0 && this.config.shouldLogToStandardOutput)) {
                if (this.shouldLog(level, this.config.level)) {
                    this.consoleTransport[level](formattedMessage);
                }
            }
        }
        // handling transports
        // log to transports -- use transport level if set, otherwise use config.level (in shouldLog function)
        for (var i = 0; i < this.transports.length; i++) {
            if (this.shouldLog(level, this.transports[i].level)) {
                if (this.transports[i].log && (0, DataTypeUtil_1.isFunction)(this.transports[i].log)) {
                    // Use custom log handler if available
                    this.transports[i].log(level, message);
                }
            }
        }
    };
    return LogTransportManager;
}());
exports.LogTransportManager = LogTransportManager;
//# sourceMappingURL=TransportManager.js.map