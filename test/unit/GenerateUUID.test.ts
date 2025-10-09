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

import { generateUUID } from '../../lib/index';

describe('GenerateUUID API', () => {
  describe('generateUUID', () => {
    it('should generate a UUID for valid userId and accountId', () => {
      const userId = '688baae58a1be6020a11ec1b';
      const accountId = '1150103';
      
      const uuid = generateUUID(userId, accountId);
      
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(32); // UUID without dashes should be 32 characters
      expect(uuid).toMatch(/^[A-F0-9]+$/); // Should be uppercase hex without dashes
    });

    it('should generate the same UUID for the same userId and accountId', () => {
      const userId = 'user123';
      const accountId = 'account456';
      
      const uuid1 = generateUUID(userId, accountId);
      const uuid2 = generateUUID(userId, accountId);
      
      expect(uuid1).toBe(uuid2);
    });

    it('should generate different UUIDs for different userIds', () => {
      const accountId = 'account456';
      
      const uuid1 = generateUUID('user123', accountId);
      const uuid2 = generateUUID('user456', accountId);
      
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate different UUIDs for different accountIds', () => {
      const userId = 'user123';
      
      const uuid1 = generateUUID(userId, 'account123');
      const uuid2 = generateUUID(userId, 'account456');
      
      expect(uuid1).not.toBe(uuid2);
    });

    it('should throw TypeError for invalid userId', () => {
      expect(() => {
        generateUUID(null as any, 'account456');
      }).toThrow(TypeError);
      
      expect(() => {
        generateUUID(123 as any, 'account456');
      }).toThrow(TypeError);
    });

    it('should throw TypeError for invalid accountId', () => {
      expect(() => {
        generateUUID('user123', null as any);
      }).toThrow(TypeError);
      
      expect(() => {
        generateUUID('user123', 123 as any);
      }).toThrow(TypeError);
    });
  });


});
