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

import { dynamic } from '../../../types/Common';
import { LogLevelEnum } from '../enums/LogLevelEnum';
import { LogMessageBuilder } from '../LogMessageBuilder';
import { Logger } from '../Logger';

enum LogLevelNumberEnum {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4
}

interface IlogTransport extends Logger {
  transports: Array<Record<string, dynamic>>;
  config: Record<string, dynamic>;

  shouldLog(transportLevel: string, configLevel: string): boolean;
  log(level: string, message: string): void;
}
export class LogTransportManager implements IlogTransport {
  transports: Array<Record<string, any>>;
  config: Record<string, any>;

  constructor(config: Record<string, any>) {
    this.transports = [];
    this.config = config;
  }

  addTransport(transport: Record<string, any>): void {
    this.transports.push(transport);
  }

  shouldLog(transportLevel: string, configLevel: string): boolean {
    transportLevel = transportLevel || configLevel || this.config.level;

    const targetLevel = LogLevelNumberEnum[transportLevel.toUpperCase()];
    const desiredLevel = LogLevelNumberEnum[(configLevel || this.config.level).toUpperCase()];

    return targetLevel >= desiredLevel;
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
    for (let i = 0; i < this.transports.length; i++) {
      const logMessageBuilder = new LogMessageBuilder(this.config, this.transports[i]);
      const formattedMessage = logMessageBuilder.formatMessage(level, message);
      if (this.shouldLog(level, this.transports[i].level)) {
        if (this.transports[i].logHandler) {
          this.transports[i].logHandler(formattedMessage, level);
        } else {
          this.transports[i][level](formattedMessage, level);
        }
      }
    }
  }
}
