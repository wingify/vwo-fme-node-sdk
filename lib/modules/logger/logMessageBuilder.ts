import { dynamic } from '../../types/common';
import { LogLevelEnum } from './enums/logLevelEnum';

interface ILogMessageBuilder {
  loggerConfig: Record<string, dynamic>;
  transportConfig: Record<string, dynamic>;
  prefix: string;
  dateTimeFormat: dynamic;

  formatMessage(level: string, message: string): string;
  getFormattedLevel(level: string): string;
  getFormattedDateTime(): string;
}

export class LogMessageBuilder implements ILogMessageBuilder {
  loggerConfig: Record<string, any>;
  transportConfig: Record<string, any>;
  prefix: string;
  dateTimeFormat: any;

  constructor(loggerConfig: Record<string, any>, transportConfig: Record<string, any>) {
    this.loggerConfig = loggerConfig;
    this.transportConfig = transportConfig;

    this.prefix = this.transportConfig.prefix || this.loggerConfig.prefix || '';
    this.dateTimeFormat = this.transportConfig.dateTimeFormat || this.loggerConfig.dateTimeFormat;
  }

  formatMessage(level: string, message: string): string {
    return `${this.getFormattedLevel(level)} ${this.prefix} ${this.getFormattedDateTime()} ${message}`;
  }

  getFormattedLevel(level: string): string {
    const upperCaseLevel = level.toUpperCase();
    const AnsiColorEnum = {
      BOLD: '\x1b[1m',
      CYAN: '\x1b[36m',
      GREEN: '\x1b[32m',
      LIGHTBLUE: '\x1b[94m',
      RED: '\x1b[31m',
      RESET: '\x1b[0m',
      WHITE: '\x1b[30m',
      YELLOW: '\x1b[33m'
    };

    const LogLevelColorInfoEnum = {
      [LogLevelEnum.TRACE]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.WHITE}${upperCaseLevel}${AnsiColorEnum.RESET}`,
      [LogLevelEnum.DEBUG]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.LIGHTBLUE}${upperCaseLevel} ${AnsiColorEnum.RESET}`,
      [LogLevelEnum.INFO]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.CYAN}${upperCaseLevel}  ${AnsiColorEnum.RESET}`,
      [LogLevelEnum.WARN]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.YELLOW}${upperCaseLevel}  ${AnsiColorEnum.RESET}`,
      [LogLevelEnum.ERROR]: `${AnsiColorEnum.BOLD}${AnsiColorEnum.RED}${upperCaseLevel} ${AnsiColorEnum.RESET}`
    };

    return LogLevelColorInfoEnum[level];
  }

  getFormattedDateTime(): string {
    return this.dateTimeFormat();
  }
}
