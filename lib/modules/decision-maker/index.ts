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

import * as Hasher from 'murmurhash';

const SEED_VALUE = 1; // Seed value for the hash function
const MAX_TRAFFIC_VALUE = 10000; // Maximum traffic value used as a default scale

export class DecisionMaker {
  /**
   * Generates a bucket value for a user by hashing the user ID with murmurHash
   * and scaling it down to a specified maximum value.
   *
   * @param {Number} hashValue - The hash value generated after hashing
   * @param {Number} maxValue - The maximum value up to which the hash value needs to be scaled
   * @param {Number} multiplier - Multiplier to adjust the scale in case the traffic allocation is less than 100
   * @return {Number} - The bucket value of the user
   */
  generateBucketValue(hashValue: number, maxValue: number, multiplier = 1): number {
    const ratio = hashValue / Math.pow(2, 32); // Calculate the ratio of the hash value to the maximum hash value
    const multipliedValue = (maxValue * ratio + 1) * multiplier; // Apply the multiplier after scaling the hash value
    const value = Math.floor(multipliedValue); // Floor the value to get an integer bucket value

    return value;
  }

  /**
   * Validates the user ID and generates a bucket value for the user by hashing the user ID with murmurHash
   * and scaling it down.
   *
   * @param {String} userId - The unique ID assigned to the user
   * @param {Number} maxValue - The maximum value for bucket scaling (default is 100)
   * @return {Number} - The bucket value allotted to the user (between 1 and maxValue)
   */
  getBucketValueForUser(hashKey: string, maxValue = 100): number {
    const hashValue = Hasher.v3(hashKey, SEED_VALUE); // Generate the hash value using murmurHash
    const bucketValue = this.generateBucketValue(hashValue, maxValue); // Generate the bucket value using the hash value
    return bucketValue;
  }

  /**
   * Calculates the bucket value for a given string and optional multiplier and maximum value.
   *
   * @param {String} str - The string to hash
   * @param {Number} multiplier - Multiplier to adjust the scale (default is 1)
   * @param {Number} maxValue - Maximum value for bucket scaling (default is 10000)
   * @return {Number} - The calculated bucket value
   */
  calculateBucketValue(str: string, multiplier = 1, maxValue = 10000): number {
    const hashValue = this.generateHashValue(str); // Generate the hash value for the string

    return this.generateBucketValue(hashValue, maxValue, multiplier); // Generate and return the bucket value
  }

  /**
   * Generates a hash value for a given key using murmurHash.
   *
   * @param {String} hashKey - The key to hash
   * @return {Number} - The generated hash value
   */
  generateHashValue(hashKey: string): number {
    return Hasher.v3(hashKey, SEED_VALUE); // Return the hash value generated using murmurHash
  }
}
