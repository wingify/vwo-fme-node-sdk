/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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

/**
 * Defines a type `dynamic` which can be used to represent a variety of data types.
 * This type is flexible and can handle multiple types including primitive types,
 * complex objects, and collections.
 */
export type dynamic =
  | boolean // Represents a boolean value
  | number // Represents a numeric value
  | string // Represents a string value
  | Date // Represents a date object
  | void // Represents the absence of a value
  | undefined // Represents an undefined value
  | null // Represents a null value
  | Record<string, any> // Represents an object with string keys and any type of values
  | Array<dynamicArray> // Represents an array of `dynamicArray` type
  | Map<string, dynamicArray>; // Represents a map with string keys and `dynamicArray` type values

/**
 * Defines a type `dynamicArray` which is used within the `dynamic` type.
 * This type is intended for use in arrays and supports several basic data types and objects.
 */
export type dynamicArray =
  | boolean // Represents a boolean value
  | number // Represents a numeric value
  | string // Represents a string value
  | Record<string, any>; // Represents an object with string keys and any type of values
