/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
import { LogLevelEnum } from '../enums/LogLevelEnum';
import { Logger } from '../Logger';

export class ConsoleTransport implements Logger {
  config: Record<string, any>;
  level: string;

  constructor(config: Record<string, any> = {}) {
    this.config = config;
    this.level = this.config.level;
  }

  trace(message: string): void {
    this.log(LogLevelEnum.TRACE, message);
  }

  debug(message: string): void {
    this.log(LogLevelEnum.DEBUG, message);
  }

  info(message: string): void {
    this.log(LogLevelEnum.INFO, message);
  }

  warn(message: string): void {
    this.log(LogLevelEnum.WARN, message);
  }

  error(message: string): void {
    this.log(LogLevelEnum.ERROR, message);
  }

  log(level: string, message: string): void {
    console[level](message);
  }
}
