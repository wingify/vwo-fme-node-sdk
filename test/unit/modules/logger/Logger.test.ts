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

import { LogManager } from '../../../../lib/modules/logger/core/LogManager';
import { LogLevelEnum } from '../../../../lib/modules/logger/enums/LogLevelEnum';

describe('End-to-End Tests for Logger Module', () => {
  let logManager: LogManager;

  beforeAll(() => {
    // Initialize LogManager or mock it if necessary
    logManager = new LogManager({
      defaultTransport: true,
      level: LogLevelEnum.DEBUG
    });
  });

  test('should log messages at different levels', () => {
    const spyDebug = jest.spyOn(LogManager.Instance, 'debug');
    const spyInfo = jest.spyOn(LogManager.Instance, 'info');
    const spyWarn = jest.spyOn(LogManager.Instance, 'warn');
    const spyTrace = jest.spyOn(LogManager.Instance, 'trace');
    const spyError = jest.spyOn(LogManager.Instance, 'error');

    LogManager.Instance.debug('This is a debug message');
    LogManager.Instance.info('This is an info message');
    LogManager.Instance.warn('This is a warn message');
    LogManager.Instance.trace('This is a trace message');
    LogManager.Instance.error('This is an error message');

    expect(spyDebug).toHaveBeenCalledWith('This is a debug message');
    expect(spyInfo).toHaveBeenCalledWith('This is an info message');
    expect(spyWarn).toHaveBeenCalledWith('This is a warn message');
    expect(spyTrace).toHaveBeenCalledWith('This is a trace message');
    expect(spyError).toHaveBeenCalledWith('This is an error message');
  });

  // Add more tests as needed to cover all functionalities
});
