"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMessageBuilder = void 0;
var LogLevelEnum_1 = require("./enums/LogLevelEnum");
var AnsiColorEnum = {
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
 * Implements the ILogMessageBuilder interface to provide a concrete log message builder.
 */
var LogMessageBuilder = /** @class */ (function () {
    /**
     * Constructs a new LogMessageBuilder instance.
     * @param {Record<string, any>} loggerConfig - Configuration for the logger.
     * @param {Record<string, any>} transportConfig - Configuration for the transport mechanism.
     */
    function LogMessageBuilder(loggerConfig, transportConfig) {
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
    LogMessageBuilder.prototype.formatMessage = function (level, message) {
        return "[".concat(this.getFormattedLevel(level), "]: ").concat(this.getFormattedPrefix(this.prefix), " ").concat(this.getFormattedDateTime(), " ").concat(message);
    };
    LogMessageBuilder.prototype.getFormattedPrefix = function (prefix) {
        if (this.loggerConfig.isAnsiColorEnabled) {
            return "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.GREEN).concat(prefix).concat(AnsiColorEnum.RESET);
        }
        return "".concat(prefix);
    };
    /**
     * Returns the formatted log level with appropriate coloring based on the log level.
     * @param {string} level - The log level.
     * @returns {string} The formatted log level.
     */
    LogMessageBuilder.prototype.getFormattedLevel = function (level) {
        var _a, _b;
        var upperCaseLevel = level.toUpperCase();
        var LogLevelColorInfoEnum;
        if (this.loggerConfig.isAnsiColorEnabled) {
            LogLevelColorInfoEnum = (_a = {},
                _a[LogLevelEnum_1.LogLevelEnum.TRACE] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.WHITE).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a[LogLevelEnum_1.LogLevelEnum.DEBUG] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.LIGHTBLUE).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a[LogLevelEnum_1.LogLevelEnum.INFO] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.CYAN).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a[LogLevelEnum_1.LogLevelEnum.WARN] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.YELLOW).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a[LogLevelEnum_1.LogLevelEnum.ERROR] = "".concat(AnsiColorEnum.BOLD).concat(AnsiColorEnum.RED).concat(upperCaseLevel).concat(AnsiColorEnum.RESET),
                _a);
        }
        else {
            LogLevelColorInfoEnum = (_b = {},
                _b[LogLevelEnum_1.LogLevelEnum.TRACE] = upperCaseLevel,
                _b[LogLevelEnum_1.LogLevelEnum.DEBUG] = upperCaseLevel,
                _b[LogLevelEnum_1.LogLevelEnum.INFO] = upperCaseLevel,
                _b[LogLevelEnum_1.LogLevelEnum.WARN] = upperCaseLevel,
                _b[LogLevelEnum_1.LogLevelEnum.ERROR] = upperCaseLevel,
                _b);
        }
        return LogLevelColorInfoEnum[level];
    };
    /**
     * Retrieves the current date and time formatted according to the specified format.
     * @returns {string} The formatted date and time.
     */
    LogMessageBuilder.prototype.getFormattedDateTime = function () {
        return this.dateTimeFormat();
    };
    return LogMessageBuilder;
}());
exports.LogMessageBuilder = LogMessageBuilder;
//# sourceMappingURL=LogMessageBuilder.js.map