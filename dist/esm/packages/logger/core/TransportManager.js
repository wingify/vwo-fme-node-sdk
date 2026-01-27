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
import { LogLevelEnum } from '../enums/LogLevelEnum.js';
import { LogMessageBuilder } from '../LogMessageBuilder.js';
import { isFunction } from '../../../utils/DataTypeUtil.js';
import { ConsoleTransport } from '../transports/ConsoleTransport.js';
export var LogLevelNumberEnum;
(function (LogLevelNumberEnum) {
    LogLevelNumberEnum[LogLevelNumberEnum["TRACE"] = 0] = "TRACE";
    LogLevelNumberEnum[LogLevelNumberEnum["DEBUG"] = 1] = "DEBUG";
    LogLevelNumberEnum[LogLevelNumberEnum["INFO"] = 2] = "INFO";
    LogLevelNumberEnum[LogLevelNumberEnum["WARN"] = 3] = "WARN";
    LogLevelNumberEnum[LogLevelNumberEnum["ERROR"] = 4] = "ERROR";
})(LogLevelNumberEnum || (LogLevelNumberEnum = {}));
/**
 * Manages logging transports and delegates logging messages to them based on configuration.
 * Implements the IlogTransport interface.
 */
export class LogTransportManager {
    /**
     * Initializes the manager with a configuration object.
     * @param {Record<string, any>} config - Configuration settings for the log manager.
     */
    constructor(config) {
        this.transports = [];
        this.config = config;
        this.consoleTransport = new ConsoleTransport({
            level: config.level,
        });
    }
    /**
     * Adds a new transport to the manager.
     * @param {Record<string, any>} transport - The transport object to be added.
     */
    addTransport(transport) {
        this.transports.push(transport);
    }
    /**
     * Determines if the log should be processed based on the transport and configuration levels.
     * @param {string} transportLevel - The log level set for the transport.
     * @param {string} configLevel - The log level set in the configuration.
     * @returns {boolean} - Returns true if the log level is appropriate for logging, false otherwise.
     */
    shouldLog(transportLevel, configLevel) {
        // Default to the most specific level available
        // transportLevel = transportLevel || configLevel || this.config.level;
        const targetLevel = LogLevelNumberEnum[transportLevel.toUpperCase()];
        const desiredLevel = LogLevelNumberEnum[(configLevel || this.config.level).toUpperCase()];
        return targetLevel >= desiredLevel;
    }
    /**
     * Logs a message at TRACE level.
     * @param {string} message - The message to log.
     */
    trace(message) {
        this.log(LogLevelEnum.TRACE, message);
    }
    /**
     * Logs a message at DEBUG level.
     * @param {string} message - The message to log.
     */
    debug(message) {
        this.log(LogLevelEnum.DEBUG, message);
    }
    /**
     * Logs a message at INFO level.
     * @param {string} message - The message to log.
     */
    info(message) {
        this.log(LogLevelEnum.INFO, message);
    }
    /**
     * Logs a message at WARN level.
     * @param {string} message - The message to log.
     */
    warn(message) {
        this.log(LogLevelEnum.WARN, message);
    }
    /**
     * Logs a message at ERROR level.
     * @param {string} message - The message to log.
     */
    error(message) {
        this.log(LogLevelEnum.ERROR, message);
    }
    /**
     * Delegates the logging of messages to the appropriate transports.
     * @param {string} level - The level at which to log the message.
     * @param {string} message - The message to log.
     */
    log(level, message) {
        const logMessageBuilder = new LogMessageBuilder(this.config, this.consoleTransport);
        const formattedMessage = logMessageBuilder.formatMessage(level, message);
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
        for (let i = 0; i < this.transports.length; i++) {
            if (this.shouldLog(level, this.transports[i].level)) {
                if (this.transports[i].log && isFunction(this.transports[i].log)) {
                    // Use custom log handler if available
                    this.transports[i].log(level, message);
                }
            }
        }
    }
}
//# sourceMappingURL=TransportManager.js.map