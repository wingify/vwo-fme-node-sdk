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
export declare function isObject<T>(val: T): val is Record<any, dynamic> & Exclude<T, Array<dynamic> | FunctionType | RegExp | Promise<dynamic> | Date>;
/**
 * Checks if a value is an array.
 * @param val The value to check.
 * @returns True if the value is an array, false otherwise.
 */
export declare function isArray(val: dynamic): val is Array<dynamic>;
/**
 * Checks if a value is null.
 * @param val The value to check.
 * @returns True if the value is null, false otherwise.
 */
export declare function isNull(val: dynamic): val is null;
/**
 * Checks if a value is undefined.
 * @param val The value to check.
 * @returns True if the value is undefined, false otherwise.
 */
export declare function isUndefined(val: dynamic): val is undefined;
/**
 * Checks if a value is a number, including NaN.
 * @param val The value to check.
 * @returns True if the value is a number, false otherwise.
 */
export declare function isNumber(val: dynamic): val is number;
/**
 * Checks if a value is a string.
 * @param val The value to check.
 * @returns True if the value is a string, false otherwise.
 */
export declare function isString(val: dynamic): val is string;
/**
 * Checks if a value is a boolean.
 * @param val The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
export declare function isBoolean(val: dynamic): val is boolean;
/**
 * Checks if a value is a function.
 * @param val The value to check.
 * @returns True if the value is a function, false otherwise.
 */
export declare function isFunction(val: dynamic): val is FunctionType;
/**
 * Checks if a value is a Promise.
 * @param val The value to check.
 * @returns True if the value is a Promise, false otherwise.
 */
export declare function isPromise(val: dynamic): val is Promise<dynamic>;
/**
 * Determines the type of the given value using various type-checking utility functions.
 * @param val The value to determine the type of.
 * @returns A string representing the type of the value.
 */
export declare function getType(val: dynamic): string;
export {};
