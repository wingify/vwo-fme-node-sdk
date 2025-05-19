"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
exports.isArray = isArray;
exports.isNull = isNull;
exports.isUndefined = isUndefined;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isPromise = isPromise;
exports.getType = getType;
/**
 * Checks if a value is an object excluding arrays, functions, regexes, promises, and dates.
 * @param val The value to check.
 * @returns True if the value is an object, false otherwise.
 */
function isObject(val) {
    // Using Object.prototype.toString to get a precise string representation of the value type
    return Object.prototype.toString.call(val) === '[object Object]';
}
/**
 * Checks if a value is an array.
 * @param val The value to check.
 * @returns True if the value is an array, false otherwise.
 */
function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
}
/**
 * Checks if a value is null.
 * @param val The value to check.
 * @returns True if the value is null, false otherwise.
 */
function isNull(val) {
    return Object.prototype.toString.call(val) === '[object Null]';
}
/**
 * Checks if a value is undefined.
 * @param val The value to check.
 * @returns True if the value is undefined, false otherwise.
 */
function isUndefined(val) {
    return Object.prototype.toString.call(val) === '[object Undefined]';
}
/**
 * Checks if a value is a number, including NaN.
 * @param val The value to check.
 * @returns True if the value is a number, false otherwise.
 */
function isNumber(val) {
    // Note: NaN is also a number
    return Object.prototype.toString.call(val) === '[object Number]';
}
/**
 * Checks if a value is a string.
 * @param val The value to check.
 * @returns True if the value is a string, false otherwise.
 */
function isString(val) {
    return Object.prototype.toString.call(val) === '[object String]';
}
/**
 * Checks if a value is a boolean.
 * @param val The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
function isBoolean(val) {
    return Object.prototype.toString.call(val) === '[object Boolean]';
}
/**
 * Checks if a value is a function.
 * @param val The value to check.
 * @returns True if the value is a function, false otherwise.
 */
function isFunction(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
}
/**
 * Checks if a value is a Promise.
 * @param val The value to check.
 * @returns True if the value is a Promise, false otherwise.
 */
function isPromise(val) {
    return Object.prototype.toString.call(val) === '[object Promise]';
}
/**
 * Determines the type of the given value using various type-checking utility functions.
 * @param val The value to determine the type of.
 * @returns A string representing the type of the value.
 */
function getType(val) {
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
//# sourceMappingURL=DataTypeUtil.js.map