"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMessageBuilder = void 0;
const LogLevelEnum_1 = require("./enums/LogLevelEnum");
const AnsiColorEnum = {
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
class LogMessageBuilder {
    /**
     * Constructs a new LogMessageBuilder instance.
     * @param {Record<string, any>} loggerConfig - Configuration for the logger.
     * @param {Record<string, any>} transportConfig - Configuration for the transport mechanism.
     */
    constructor(loggerConfig, transportConfig) {
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
    formatMessage(level, message) {
        return `[${this.getFormattedLevel(level)}]: ${this.getFormattedPrefix(this.prefix)} ${this.getFormattedDateTime()} ${message}`;
    }
    getFormattedPrefix(prefix) {
        if (this.loggerConfig.isAnsiColorEnabled) {
            return `${AnsiColorEnum.BOLD}${AnsiColorEnum.GREEN}${prefix}${AnsiColorEnum.RESET}`;
        }
        return `${prefix}`;
    }
    /**
     * Returns the formatted log level with appropriate coloring based on the log level.
     * @param {string} level - The log level.
     * @returns {string} The formatted log level.
     */
    getFormattedLevel(level) {
        const upperCaseLevel = level.toUpperCase();
        let LogLevelColorInfoEnum;
        if (this.loggerConfig.isAnsiColorEnabled) {
            LogLevelColorInfoEnum = {
                [LogLevelEnum_1.LogLevelEnum.TRACE]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.WHITE}${upperCaseLevel}${AnsiColorEnum.RESET}`,
                [LogLevelEnum_1.LogLevelEnum.DEBUG]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.LIGHTBLUE}${upperCaseLevel}${AnsiColorEnum.RESET}`,
                [LogLevelEnum_1.LogLevelEnum.INFO]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.CYAN}${upperCaseLevel}${AnsiColorEnum.RESET}`,
                [LogLevelEnum_1.LogLevelEnum.WARN]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.YELLOW}${upperCaseLevel}${AnsiColorEnum.RESET}`,
                [LogLevelEnum_1.LogLevelEnum.ERROR]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.RED}${upperCaseLevel}${AnsiColorEnum.RESET}`,
            };
        }
        else {
            LogLevelColorInfoEnum = {
                [LogLevelEnum_1.LogLevelEnum.TRACE]: upperCaseLevel,
                [LogLevelEnum_1.LogLevelEnum.DEBUG]: upperCaseLevel,
                [LogLevelEnum_1.LogLevelEnum.INFO]: upperCaseLevel,
                [LogLevelEnum_1.LogLevelEnum.WARN]: upperCaseLevel,
                [LogLevelEnum_1.LogLevelEnum.ERROR]: upperCaseLevel,
            };
        }
        return LogLevelColorInfoEnum[level];
    }
    /**
     * Retrieves the current date and time formatted according to the specified format.
     * @returns {string} The formatted date and time.
     */
    getFormattedDateTime() {
        return this.dateTimeFormat();
    }
}
exports.LogMessageBuilder = LogMessageBuilder;
//# sourceMappingURL=LogMessageBuilder.js.map