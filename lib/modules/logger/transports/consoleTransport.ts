import { Logger } from '../logger';
import { LogLevelEnum } from '../enums/logLevelEnum';
import { dynamic } from '../../../types/common';

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
