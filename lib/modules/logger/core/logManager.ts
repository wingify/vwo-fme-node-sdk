import { v4 as uuidv4 } from 'uuid';
import { dynamic } from '../../../types/common';

import { Logger } from '../logger';
import { LogTransportManager } from './transportManager';
import { ConsoleTransport } from '../transports/consoleTransport';

import { isObject } from '../../../utils/DataTypeUtil';
import { LogLevelEnum } from '../enums/logLevelEnum';

interface ILogManager {
  transportManager: LogTransportManager;
  config: Record<string, dynamic>;
  name: string;
  requestId: string;
  level: string;
  prefix: string;
  dateTimeFormat: () => string;

  transport: Record<string, dynamic>;
  transports: Array<Record<string, dynamic>>;

  addTransport(transportObject: Record<string, dynamic>): void;
  addTransports(transportsList: Array<Record<string, dynamic>>): void;
}

export class LogManager extends Logger implements ILogManager {
  private static instance: LogManager;
  transportManager: LogTransportManager;
  config: Record<string, any>;
  name = 'VWO Logger';
  requestId = uuidv4();
  level = LogLevelEnum.ERROR;
  prefix = 'VWO-SDK';
  public dateTimeFormat(): string {
    return new Date().toISOString();
  }
  transport: Record<string, any>;
  transports: Array<Record<string, any>>;

  constructor(config?: Record<string, any>) {
    super();

    this.config = config;

    if (!LogManager.instance) {
      LogManager.instance = this;

      this.config.name = config.name || this.name;
      this.config.requestId = config.requestId || this.requestId;
      this.config.level = config.level || this.level;
      this.config.prefix = config.prefix || this.prefix;
      this.config.dateTimeFormat = config.dateTimeFormat || this.dateTimeFormat;

      this.transportManager = new LogTransportManager(this.config);

      this.handleTransports();
    }

    return LogManager.instance;
  }

  static get Instance(): LogManager {
    return LogManager.instance;
  }

  handleTransports(): void {
    const transports = this.config.transports;

    if (transports?.length) {
      this.addTransports(this.config.transports);
    } else if (this.config.transport && isObject(this.config.transport)) {
      this.addTransport(this.config.transport);
    } else if (this.config.defaultTransport) {
      // default
      this.addTransport(
        new ConsoleTransport({
          level: this.config.level
        })
      );
    }
  }

  addTransport(transport: Record<any, any>): void {
    this.transportManager.addTransport(transport);
  }

  addTransports(transports: Record<any, any>): void {
    for (let i = 0; i < transports.length; i++) {
      this.addTransport(transports[i]);
    }
  }

  trace(message: string): void {
    this.transportManager.log(LogLevelEnum.TRACE, message);
  }

  debug(message: string): void {
    this.transportManager.log(LogLevelEnum.DEBUG, message);
  }

  info(message: string): void {
    this.transportManager.log(LogLevelEnum.INFO, message);
  }

  warn(message: string): void {
    this.transportManager.log(LogLevelEnum.WARN, message);
  }

  error(message: string): void {
    this.transportManager.log(LogLevelEnum.ERROR, message);
  }
}
