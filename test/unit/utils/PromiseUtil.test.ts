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
import { Deferred } from '../../../lib/utils/PromiseUtil';

describe('Deferred', () => {
  let deferred: any;

  beforeEach(() => {
    deferred = new Deferred();
  });

  test('should create a Deferred object with a promise', () => {
    expect(deferred.promise).toBeInstanceOf(Promise);
  });

  test('should resolve the promise when resolve is called', async () => {
    const expectedResult = 'resolved value';
    setTimeout(() => deferred.resolve(expectedResult), 100);
    await expect(deferred.promise).resolves.toBe(expectedResult);
  });

  test('should reject the promise when reject is called', async () => {
    const expectedError = new Error('rejected');
    setTimeout(() => deferred.reject(expectedError), 100);
    await expect(deferred.promise).rejects.toThrow(expectedError);
  });
});
