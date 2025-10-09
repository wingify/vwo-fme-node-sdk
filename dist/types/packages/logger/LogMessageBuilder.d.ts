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
import { dynamic } from '../../types/Common';
/**
 * Interface defining the structure for a log message builder.
 */
interface ILogMessageBuilder {
    loggerConfig: Record<string, dynamic>;
    transportConfig: Record<string, dynamic>;
    prefix: string;
    dateTimeFormat: dynamic;
    formatMessage(level: string, message: string): string;
    getFormattedLevel(level: string): string;
    getFormattedDateTime(): string;
}
/**
 * Implements the ILogMessageBuilder interface to provide a concrete log message builder.
 */
export declare class LogMessageBuilder implements ILogMessageBuilder {
    loggerConfig: Record<string, any>;
    transportConfig: Record<string, any>;
    prefix: string;
    dateTimeFormat: any;
    /**
     * Constructs a new LogMessageBuilder instance.
     * @param {Record<string, any>} loggerConfig - Configuration for the logger.
     * @param {Record<string, any>} transportConfig - Configuration for the transport mechanism.
     */
    constructor(loggerConfig: Record<string, any>, transportConfig: Record<string, any>);
    /**
     * Formats a log message combining level, prefix, date/time, and the actual message.
     * @param {string} level - The log level.
     * @param {string} message - The message to log.
     * @returns {string} The formatted log message.
     */
    formatMessage(level: string, message: string): string;
    getFormattedPrefix(prefix: string): string;
    /**
     * Returns the formatted log level with appropriate coloring based on the log level.
     * @param {string} level - The log level.
     * @returns {string} The formatted log level.
     */
    getFormattedLevel(level: string): string;
    /**
     * Retrieves the current date and time formatted according to the specified format.
     * @returns {string} The formatted date and time.
     */
    getFormattedDateTime(): string;
}
export {};
