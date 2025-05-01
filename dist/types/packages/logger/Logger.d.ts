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
/**
 * Abstract class representing a logger.
 * This class provides the structure for logging mechanisms and should be extended by specific logger implementations.
 */
export declare abstract class Logger {
  /**
   * Logs a message at the trace level.
   * @param {string} message - The message to log.
   */
  abstract trace(message: string): void;
  /**
   * Logs a message at the debug level.
   * @param {string} message - The message to log.
   */
  abstract debug(message: string): void;
  /**
   * Logs a message at the info level.
   * @param {string} message - The message to log.
   */
  abstract info(message: string): void;
  /**
   * Logs a message at the warn level.
   * @param {string} message - The message to log.
   */
  abstract warn(message: string): void;
  /**
   * Logs a message at the error level.
   * @param {string} message - The message to log.
   */
  abstract error(message: string): void;
}
