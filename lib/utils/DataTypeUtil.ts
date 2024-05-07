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
import { dynamic } from '../types/Common';

type FunctionType = (val: dynamic) => void;

export function isObject<T>(
  val: T,
): val is Record<any, dynamic> & Exclude<T, Array<dynamic> | FunctionType | RegExp | Promise<dynamic> | Date> {
  return Object.prototype.toString.call(val) === '[object Object]';
}

export function isArray(val: dynamic): val is Array<dynamic> {
  return Object.prototype.toString.call(val) === '[object Array]';
}

export function isNull(val: dynamic): val is null {
  return Object.prototype.toString.call(val) === '[object Null]';
}

export function isUndefined(val: dynamic): val is undefined {
  return Object.prototype.toString.call(val) === '[object Undefined]';
}

export function isDefined<T>(val: T): val is NonNullable<T> {
  return !isUndefined(val) && !isNull(val);
}

export function isNumber(val: dynamic): val is number {
  // Note: NaN is also a number
  return Object.prototype.toString.call(val) === '[object Number]';
}

export function isString(val: dynamic): val is string {
  return Object.prototype.toString.call(val) === '[object String]';
}

export function isBoolean(val: dynamic): val is boolean {
  return Object.prototype.toString.call(val) === '[object Boolean]';
}

export function isNaN(val: dynamic): val is number {
  // eslint-disable-next-line no-self-compare
  return val !== val;
}

export function isDate(val: dynamic): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]';
}

export function isFunction(val: dynamic): val is FunctionType {
  return Object.prototype.toString.call(val) === '[object Function]';
}

export function isRegex(val: dynamic): val is RegExp {
  return Object.prototype.toString.call(val) === '[object RegExp]';
}

export function isPromise(val: dynamic): val is Promise<dynamic> {
  return Object.prototype.toString.call(val) === '[object Promise]';
}

export function getType(val: dynamic): string {
  return isObject(val)
    ? 'Object'
    : isArray(val)
      ? 'Array'
      : isNull(val)
        ? 'Null'
        : isUndefined(val)
          ? 'Undefined'
          : isNaN(val)
            ? 'NaN'
            : isNumber(val)
              ? 'Number'
              : isString(val)
                ? 'String'
                : isBoolean(val)
                  ? 'Boolean'
                  : isDate(val)
                    ? 'Date'
                    : isRegex(val)
                      ? 'Regex'
                      : isFunction(val)
                        ? 'Function'
                        : isPromise(val)
                          ? 'Promise'
                          : 'Unknown Type';
}
