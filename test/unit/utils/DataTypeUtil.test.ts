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
import {
  isObject,
  isArray,
  isNull,
  isUndefined,
  isNumber,
  isString,
  isBoolean,
  isFunction,
  isPromise,
  getType,
} from '../../../lib/utils/DataTypeUtil';

describe('DataTypeUtil', () => {
  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBeTruthy();
      expect(isObject({ a: 1 })).toBeTruthy();
    });

    it('should return false for non-objects', () => {
      expect(isObject([])).toBeFalsy();
      expect(isObject(123)).toBeFalsy();
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBeTruthy();
      expect(isArray([1, 2, 3])).toBeTruthy();
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBeFalsy();
      expect(isArray('string')).toBeFalsy();
    });
  });

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBeTruthy();
    });

    it('should return false for non-null', () => {
      expect(isNull(undefined)).toBeFalsy();
      expect(isNull({})).toBeFalsy();
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBeTruthy();
    });

    it('should return false for defined values', () => {
      expect(isUndefined(null)).toBeFalsy();
      expect(isUndefined({})).toBeFalsy();
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(123)).toBeTruthy();
      expect(isNumber(-123)).toBeTruthy();
      expect(isNumber(NaN)).toBeTruthy(); // Includes NaN
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBeFalsy();
      expect(isNumber({})).toBeFalsy();
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('text')).toBeTruthy();
      expect(isString('')).toBeTruthy();
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBeFalsy();
      expect(isString(true)).toBeFalsy();
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBeTruthy();
      expect(isBoolean(false)).toBeTruthy();
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean('true')).toBeFalsy();
      expect(isBoolean(1)).toBeFalsy();
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBeTruthy();
      expect(isFunction(function () {})).toBeTruthy();
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBeFalsy();
      expect(isFunction(123)).toBeFalsy();
    });
  });

  describe('isPromise', () => {
    it('should return true for promises', () => {
      expect(isPromise(Promise.resolve())).toBeTruthy();
      expect(isPromise(new Promise(() => {}))).toBeTruthy();
    });

    it('should return false for non-promises', () => {
      expect(isPromise(() => {})).toBeFalsy();
      expect(isPromise({})).toBeFalsy();
    });
  });

  describe('getType', () => {
    it('should correctly identify the type of various values', () => {
      expect(getType({})).toEqual('Object');
      expect(getType([])).toEqual('Array');
      expect(getType(null)).toEqual('Null');
      expect(getType(undefined)).toEqual('Undefined');
      expect(getType(123)).toEqual('Number');
      expect(getType('text')).toEqual('String');
      expect(getType(true)).toEqual('Boolean');
      expect(getType(() => {})).toEqual('Function');
      expect(getType(Promise.resolve())).toEqual('Promise');
    });
  });
});
