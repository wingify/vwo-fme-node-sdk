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

import { LogManager } from '../../../../lib/packages/logger/core/LogManager';
import { LogLevelEnum } from '../../../../lib/packages/logger/enums/LogLevelEnum';

describe('End-to-End Tests for Logger Module', () => {
  let logManager: LogManager;

  beforeAll(() => {});
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should log messages at different levels', () => {
    logManager = new LogManager({
      isAlwaysNewInstance: true,
      level: LogLevelEnum.DEBUG,
    });

    const spyDebug = jest.spyOn(console, 'debug');
    const spyInfo = jest.spyOn(console, 'info');
    const spyWarn = jest.spyOn(console, 'warn');
    // const spyTrace = jest.spyOn(console, 'trace');
    const spyError = jest.spyOn(console, 'error');

    LogManager.Instance.debug('This is a debug message');
    LogManager.Instance.info('This is an info message');
    LogManager.Instance.warn('This is a warn message');
    // LogManager.Instance.trace('This is a trace message');
    LogManager.Instance.error('This is an error message');

    expect(spyDebug).toHaveBeenCalledWith(expect.stringContaining('This is a debug message'));
    expect(spyInfo).toHaveBeenCalledWith(expect.stringContaining('This is an info message'));
    expect(spyWarn).toHaveBeenCalledWith(expect.stringContaining('This is a warn message'));
    // expect(spyTrace).toHaveBeenCalledWith(expect.stringContaining('This is a trace message'));
    expect(spyError).toHaveBeenCalledWith(expect.stringContaining('This is an error message'));
  });

  it('should check for prefix and datetime in log messages, if passed', () => {
    logManager = new LogManager({
      prefix: 'Test Prefix',
      isAlwaysNewInstance: true,
      dateTimeFormat: () => {
        return 123456789;
      },
      level: LogLevelEnum.DEBUG,
    });

    const spyDebug = jest.spyOn(console, 'debug');
    const spyInfo = jest.spyOn(console, 'info');
    const spyWarn = jest.spyOn(console, 'warn');
    // const spyTrace = jest.spyOn(console, 'trace');
    const spyError = jest.spyOn(console, 'error');

    LogManager.Instance.debug('This is a debug message');
    LogManager.Instance.info('This is an info message');
    LogManager.Instance.warn('This is a warn message');
    // LogManager.Instance.trace('This is a trace message');
    LogManager.Instance.error('This is an error message');

    expect(spyDebug).toHaveBeenCalledWith(expect.stringContaining('Test Prefix 123456789 This is a debug message'));
    expect(spyInfo).toHaveBeenCalledWith(expect.stringContaining('Test Prefix 123456789 This is an info message'));
    expect(spyWarn).toHaveBeenCalledWith(expect.stringContaining('Test Prefix 123456789 This is a warn message'));
    // expect(spyTrace).toHaveBeenCalledWith(expect.stringContaining('This is a trace message'));
    expect(spyError).toHaveBeenCalledWith(expect.stringContaining('Test Prefix 123456789 This is an error message'));
  });

  it('should log messages of the transport instead of default transport i.e. console', () => {
    logManager = new LogManager({
      // isAnsiColorEnabled: false,
      isAlwaysNewInstance: true,
      level: LogLevelEnum.DEBUG,
      transport: {
        debug: (msg) => console.log(msg),
        info: (msg) => console.log(msg),
        warn: (msg) => console.log(msg),
        error: (msg) => console.log(msg),
        trace: (msg) => console.log(msg),
      },
    });

    const spyLog = jest.spyOn(console, 'log');

    LogManager.Instance.debug('This is a debug message');
    LogManager.Instance.info('This is an info message');
    LogManager.Instance.warn('This is a warn message');
    LogManager.Instance.error('This is an error message');

    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('This is a debug message'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('This is an info message'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('This is a warn message'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('This is an error message'));
  });

  it('should handle multiple transports', () => {
    logManager = new LogManager({
      // isAnsiColorEnabled: false,
      isAlwaysNewInstance: true,
      level: LogLevelEnum.DEBUG,
      transports: [
        {
          debug: (msg) => console.log(msg),
          info: (msg) => console.log(msg),
          warn: (msg) => console.log(msg),
          error: (msg) => console.log(msg),
          trace: (msg) => console.log(msg),
        },
        {
          debug: (msg) => console.count(msg),
          info: (msg) => console.count(msg),
          warn: (msg) => console.count(msg),
          error: (msg) => console.count(msg),
          trace: (msg) => console.count(msg),
        },
      ],
    });

    const spyLog = jest.spyOn(console, 'log');
    const spyConsoleCount = jest.spyOn(console, 'count');

    LogManager.Instance.debug('This is a debug message');
    LogManager.Instance.info('This is an info message');
    LogManager.Instance.warn('This is a warn message');
    LogManager.Instance.error('This is an error message');

    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('This is a debug message'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('This is an info message'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('This is a warn message'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('This is an error message'));

    expect(spyConsoleCount).toHaveBeenCalledWith(expect.stringContaining('This is a debug message'));
    expect(spyConsoleCount).toHaveBeenCalledWith(expect.stringContaining('This is an info message'));
    expect(spyConsoleCount).toHaveBeenCalledWith(expect.stringContaining('This is a warn message'));
    expect(spyConsoleCount).toHaveBeenCalledWith(expect.stringContaining('This is an error message'));
  });

  it('should handle logHandler inside transport', () => {
    logManager = new LogManager({
      // isAnsiColorEnabled: false,
      isAlwaysNewInstance: true,
      level: LogLevelEnum.DEBUG,
      transport: {
        log: (level, msg) => console.log(level, msg),
      },
    });

    const spyLog = jest.spyOn(console, 'log');

    LogManager.Instance.debug('This is a debug message');
    LogManager.Instance.info('This is an info message');
    LogManager.Instance.warn('This is a warn message');
    LogManager.Instance.error('This is an error message');

    expect(spyLog).toHaveBeenCalledWith('debug', 'This is a debug message');
    expect(spyLog).toHaveBeenCalledWith('info', 'This is an info message');
    expect(spyLog).toHaveBeenCalledWith('warn', 'This is a warn message');
    expect(spyLog).toHaveBeenCalledWith('error', 'This is an error message');
  });
});
