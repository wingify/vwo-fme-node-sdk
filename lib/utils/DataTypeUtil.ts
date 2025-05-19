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
import { dynamic } from '../types/Common';

type FunctionType = (val: dynamic) => void;

/**
 * Checks if a value is an object excluding arrays, functions, regexes, promises, and dates.
 * @param val The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export function isObject<T>(
  val: T,
): val is Record<any, dynamic> & Exclude<T, Array<dynamic> | FunctionType | RegExp | Promise<dynamic> | Date> {
  // Using Object.prototype.toString to get a precise string representation of the value type
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Checks if a value is an array.
 * @param val The value to check.
 * @returns True if the value is an array, false otherwise.
 */
export function isArray(val: dynamic): val is Array<dynamic> {
  return Object.prototype.toString.call(val) === '[object Array]';
}

/**
 * Checks if a value is null.
 * @param val The value to check.
 * @returns True if the value is null, false otherwise.
 */
export function isNull(val: dynamic): val is null {
  return Object.prototype.toString.call(val) === '[object Null]';
}

/**
 * Checks if a value is undefined.
 * @param val The value to check.
 * @returns True if the value is undefined, false otherwise.
 */
export function isUndefined(val: dynamic): val is undefined {
  return Object.prototype.toString.call(val) === '[object Undefined]';
}

/**
 * Checks if a value is a number, including NaN.
 * @param val The value to check.
 * @returns True if the value is a number, false otherwise.
 */
export function isNumber(val: dynamic): val is number {
  // Note: NaN is also a number
  return Object.prototype.toString.call(val) === '[object Number]';
}

/**
 * Checks if a value is a string.
 * @param val The value to check.
 * @returns True if the value is a string, false otherwise.
 */
export function isString(val: dynamic): val is string {
  return Object.prototype.toString.call(val) === '[object String]';
}

/**
 * Checks if a value is a boolean.
 * @param val The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
export function isBoolean(val: dynamic): val is boolean {
  return Object.prototype.toString.call(val) === '[object Boolean]';
}

/**
 * Checks if a value is a function.
 * @param val The value to check.
 * @returns True if the value is a function, false otherwise.
 */
export function isFunction(val: dynamic): val is FunctionType {
  return Object.prototype.toString.call(val) === '[object Function]';
}

/**
 * Checks if a value is a Promise.
 * @param val The value to check.
 * @returns True if the value is a Promise, false otherwise.
 */
export function isPromise(val: dynamic): val is Promise<dynamic> {
  return Object.prototype.toString.call(val) === '[object Promise]';
}

/**
 * Determines the type of the given value using various type-checking utility functions.
 * @param val The value to determine the type of.
 * @returns A string representing the type of the value.
 */
export function getType(val: dynamic): string {
  // Check if the value is an Object (excluding arrays, functions, etc.)
  return isObject(val)
    ? 'Object'
    : // Check if the value is an Array
      isArray(val)
      ? 'Array'
      : // Check if the value is null
        isNull(val)
        ? 'Null'
        : // Check if the value is undefined
          isUndefined(val)
          ? 'Undefined'
          : // Check if the value is NaN (Not a Number)
            isNumber(val)
            ? 'Number'
            : // Check if the value is a String
              isString(val)
              ? 'String'
              : // Check if the value is a Boolean
                isBoolean(val)
                ? 'Boolean'
                : // Check if the value is a Function
                  isFunction(val)
                  ? 'Function'
                  : // Check if the value is a Promise
                    isPromise(val)
                    ? 'Promise'
                    : // If none of the above, return 'Unknown Type'
                      'Unknown Type';
}
