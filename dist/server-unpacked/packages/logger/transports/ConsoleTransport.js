"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleTransport = void 0;
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
var LogLevelEnum_1 = require("../enums/LogLevelEnum");
/**
 * ConsoleTransport class implements the Logger interface to provide logging functionality.
 * It outputs logs to the console based on the log level set in the configuration.
 */
var ConsoleTransport = /** @class */ (function () {
    /**
     * Constructor initializes the ConsoleTransport with a configuration object.
     * @param {Record<string, any>} config - Configuration settings for the logger, including 'level'.
     */
    function ConsoleTransport(config) {
        if (config === void 0) { config = {}; }
        this.config = config; // Store the configuration
        this.level = this.config.level; // Set the logging level from the configuration
    }
    /**
     * Logs a trace message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.trace = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.TRACE, message);
    };
    /**
     * Logs a debug message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.debug = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
    };
    /**
     * Logs an informational message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.info = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.INFO, message);
    };
    /**
     * Logs a warning message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.warn = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.WARN, message);
    };
    /**
     * Logs an error message.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.error = function (message) {
        this.consoleLog(LogLevelEnum_1.LogLevelEnum.ERROR, message);
    };
    /**
     * Generic log function that logs messages to the console based on the log level.
     * @param {string} level - The log level under which the message should be logged.
     * @param {string} message - The message to log.
     */
    ConsoleTransport.prototype.consoleLog = function (level, message) {
        console[level](message); // Use console's logging function dynamically based on the level
    };
    return ConsoleTransport;
}());
exports.ConsoleTransport = ConsoleTransport;
//# sourceMappingURL=ConsoleTransport.js.map