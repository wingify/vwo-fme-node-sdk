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
import { init, onInit, LogLevelEnum, StorageConnector } from '../../lib/index';

test('Check is VWO is defined', () => {
  expect(init).toBeDefined();
  expect(onInit).toBeDefined();
  expect(LogLevelEnum).toBeDefined();
  expect(StorageConnector).toBeDefined();

  expect(typeof init).toBe('function');
  expect(typeof onInit).toBe('function');
  expect(typeof LogLevelEnum).toBe('object');
  expect(typeof StorageConnector).toBe('function');
});
