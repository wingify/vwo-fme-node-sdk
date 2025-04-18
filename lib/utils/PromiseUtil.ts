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

/**
 * Creates a Deferred object with properties for promise, resolve, and reject.
 * This allows manual control over the resolution and rejection of a promise.
 * @returns {Deferred} The Deferred object with promise, resolve, and reject methods.
 */
export function Deferred(): void {
  // Create a new Promise and attach resolve and reject methods to the Deferred object
  this.promise = new Promise((resolve: dynamic, reject: dynamic) => {
    this.resolve = resolve; // Method to resolve the promise
    this.reject = reject; // Method to reject the promise
  });

  return this; // Return the Deferred object with attached methods
}
