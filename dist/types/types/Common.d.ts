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
/**
 * Defines a type `dynamic` which can be used to represent a variety of data types.
 * This type is flexible and can handle multiple types including primitive types,
 * complex objects, and collections.
 */
export type dynamic =
  | boolean
  | number
  | string
  | Date
  | void
  | undefined
  | null
  | Record<string, any>
  | Array<dynamicArray>
  | Map<string, dynamicArray>;
/**
 * Defines a type `dynamicArray` which is used within the `dynamic` type.
 * This type is intended for use in arrays and supports several basic data types and objects.
 */
export type dynamicArray = boolean | number | string | Record<string, any>;
