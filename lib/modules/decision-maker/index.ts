/**
 * Copyright 2019-2020 Wingify Software Pvt. Ltd.
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

const SEED_VALUE = 1;
const MAX_TRAFFIC_VALUE = 10000;

export class DecisionMaker {
  /**
   * Generates Bucket Value of the User by hashing the User ID by murmurHash
   * and scaling it down.
   *
   * @param {Number} hashValue the hashValue generated after hashing
   * @param {Number} maxValue the value up-to which hashValue needs to be scaled
   * @param {Number} multiplier multiplier in case the traffic allocation is less than 100
   *
   * @return {Number} bucket Value of the User
   */
  generateBucketValue(hashValue: number, maxValue: number, multiplier = 1): number {
    const ratio = hashValue / Math.pow(2, 32);
    const multipliedValue = (maxValue * ratio + 1) * multiplier;
    const value = Math.floor(multipliedValue);

    return value;
  }

  /**
   * Validates the User ID and generates Bucket Value of the User by hashing the userId by murmurHash and scaling it down.
   *
   * @param {String} userId the unique ID assigned to User
   *
   * @return {Number} the bucket Value allotted to User (between 1 to $this->$MAX_TRAFFIC_PERCENT)
   */
  getBucketValueForUser(hashKey: string, maxValue = 100): number {
    const hashValue = Hasher.v3(hashKey, SEED_VALUE);
    const bucketValue = this.generateBucketValue(hashValue, maxValue);
    return bucketValue;
  }

  calculateBucketValue(str: string, multiplier = 1, maxValue = 10000): number {
    const hashValue = this.generateHashValue(str);

    return this.generateBucketValue(hashValue, maxValue, multiplier);
  }

  generateHashValue(hashKey: string): number {
    return Hasher.v3(hashKey, SEED_VALUE);
  }
}
