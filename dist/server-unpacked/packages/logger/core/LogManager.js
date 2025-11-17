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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogManager = void 0;
var uuid_1 = require("uuid");
var Logger_1 = require("../Logger");
var ConsoleTransport_1 = require("../transports/ConsoleTransport");
var TransportManager_1 = require("./TransportManager");
var DataTypeUtil_1 = require("../../../utils/DataTypeUtil");
var LogLevelEnum_1 = require("../enums/LogLevelEnum");
var LogMessageUtil_1 = require("../../../utils/LogMessageUtil");
var DebuggerCategoryEnum_1 = require("../../../enums/DebuggerCategoryEnum");
var DebuggerServiceUtil_1 = require("../../../utils/DebuggerServiceUtil");
var log_messages_1 = require("../../../enums/log-messages");
var FunctionUtil_1 = require("../../../utils/FunctionUtil");
/**
 * LogManager class provides logging functionality with support for multiple transports.
 * It is designed as a singleton to ensure a single instance throughout the application.
 */
var LogManager = /** @class */ (function (_super) {
    __extends(LogManager, _super);
    /**
     * Constructor for LogManager.
     * @param {Record<string, any>} config - Configuration object for LogManager.
     */
    function LogManager(config) {
        var _this = _super.call(this) || this;
        _this.name = 'VWO Logger'; // Default logger name
        _this.requestId = (0, uuid_1.v4)(); // Unique request ID generated for each instance
        _this.level = LogLevelEnum_1.LogLevelEnum.ERROR; // Default logging level
        _this.prefix = 'VWO-SDK'; // Default prefix for log messages
        _this.config = config;
        if (config.isAlwaysNewInstance || !LogManager.instance) {
            LogManager.instance = _this;
            // Initialize configuration with defaults or provided values
            _this.config.name = config.name || _this.name;
            _this.config.requestId = config.requestId || _this.requestId;
            _this.config.level = config.level || _this.level;
            _this.config.prefix = config.prefix || _this.prefix;
            _this.config.dateTimeFormat = config.dateTimeFormat || _this.dateTimeFormat;
            _this.transportManager = new TransportManager_1.LogTransportManager(_this.config);
            _this.handleTransports();
        }
        return LogManager.instance;
    }
    LogManager.prototype.dateTimeFormat = function () {
        return new Date().toISOString(); // Default date-time format for log messages
    };
    Object.defineProperty(LogManager, "Instance", {
        /**
         * Provides access to the singleton instance of LogManager.
         * @returns {LogManager} The singleton instance.
         */
        get: function () {
            return LogManager.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Handles the initialization and setup of transports based on configuration.
     */
    LogManager.prototype.handleTransports = function () {
        var transports = this.config.transports;
        if (transports === null || transports === void 0 ? void 0 : transports.length) {
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
    };
    /**
     * Adds a single transport to the LogManager.
     * @param {Record<any, any>} transport - The transport object to add.
     */
    LogManager.prototype.addTransport = function (transport) {
        this.transportManager.addTransport(transport);
    };
    /**
     * Adds multiple transports to the LogManager.
     * @param {Array<Record<any, any>>} transports - The list of transport objects to add.
     */
    LogManager.prototype.addTransports = function (transports) {
        for (var i = 0; i < transports.length; i++) {
            this.addTransport(transports[i]);
        }
    };
    /**
     * Logs a trace message.
     * @param {string} message - The message to log at trace level.
     */
    LogManager.prototype.trace = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.TRACE, message);
    };
    /**
     * Logs a debug message.
     * @param {string} message - The message to log at debug level.
     */
    LogManager.prototype.debug = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.DEBUG, message);
    };
    /**
     * Logs an informational message.
     * @param {string} message - The message to log at info level.
     */
    LogManager.prototype.info = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.INFO, message);
    };
    /**
     * Logs a warning message.
     * @param {string} message - The message to log at warn level.
     */
    LogManager.prototype.warn = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.WARN, message);
    };
    /**
     * Logs an error message.
     * @param {string} message - The message to log at error level.
     */
    LogManager.prototype.error = function (message) {
        this.transportManager.log(LogLevelEnum_1.LogLevelEnum.ERROR, message);
    };
    /**
     * Middleware method that stores error in DebuggerService and logs it.
     * @param {boolean} shouldSendToVWO - Whether to send the error to VWO.
     * @param {string} category - The category of the error.
     */
    LogManager.prototype.errorLog = function (template, data, debugData, shouldSendToVWO) {
        if (data === void 0) { data = {}; }
        if (debugData === void 0) { debugData = {}; }
        if (shouldSendToVWO === void 0) { shouldSendToVWO = true; }
        try {
            var message = (0, LogMessageUtil_1.buildMessage)(log_messages_1.ErrorLogMessagesEnum[template], data);
            this.error(message);
            if (shouldSendToVWO) {
                var debugEventProps = __assign(__assign(__assign({}, debugData), data), { msg_t: template, msg: message, lt: LogLevelEnum_1.LogLevelEnum.ERROR.toString(), cg: DebuggerCategoryEnum_1.DebuggerCategoryEnum.ERROR });
                // send debug event to VWO
                (0, DebuggerServiceUtil_1.sendDebugEventToVWO)(debugEventProps);
            }
        }
        catch (err) {
            console.error('Got error while logging error' + (0, FunctionUtil_1.getFormattedErrorMessage)(err));
        }
    };
    return LogManager;
}(Logger_1.Logger));
exports.LogManager = LogManager;
//# sourceMappingURL=LogManager.js.map