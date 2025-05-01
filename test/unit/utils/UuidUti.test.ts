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
import { getRandomUUID, generateUUID, getUUID } from '../../../lib/utils/UuidUtil';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
  v5: jest.fn(),
}));

describe('UuidUtil', () => {
  describe('getRandomUUID', () => {
    it('should generate a random UUID based on an API key', () => {
      const sdkKey = 'test-api-key';
      const fakeNamespace = 'fake-namespace';
      const fakeUUID = 'fake-uuid';
      (uuidv5 as jest.Mock).mockImplementationOnce(() => fakeNamespace);
      (uuidv5 as jest.Mock).mockImplementationOnce(() => fakeUUID);
      (uuidv4 as jest.Mock).mockReturnValue('random-uuid');

      const result = getRandomUUID(sdkKey);

      expect(uuidv5).toHaveBeenCalledWith(sdkKey, uuidv5.DNS);
      expect(uuidv4).toHaveBeenCalled();
      expect(uuidv5).toHaveBeenCalledWith('random-uuid', fakeNamespace);
      expect(result).toBe(fakeUUID);
    });
  });

  describe('generateUUID', () => {
    // This function is private and typically wouldn't be tested directly,
    // but you can test it through the public functions or expose it for testing.
    // Here's how you might test it if it were exposed:
    it('should return undefined if name or namespace is invalid', () => {
      const result = generateUUID('', 'valid-namespace');
      expect(result).toBeUndefined();
    });

    it('should generate a UUID v5 based on a name and a namespace', () => {
      const name = 'test-name';
      const namespace = 'test-namespace';
      const expectedUUID = 'expected-uuid';
      (uuidv5 as jest.Mock).mockReturnValue(expectedUUID);

      const result = generateUUID(name, namespace);

      expect(uuidv5).toHaveBeenCalledWith(name, namespace);
      expect(result).toBe(expectedUUID);
    });
  });

  describe('generateUUID', () => {
    it('should return undefined if name or namespace is invalid', () => {
      const result = generateUUID('', 'valid-namespace');
      expect(result).toBeUndefined();
    });
  });
});
