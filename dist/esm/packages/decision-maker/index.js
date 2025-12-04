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
import murmurhash from 'murmurhash';
const Hasher = murmurhash;
if (!Hasher.v3) {
    Hasher.v3 = Hasher;
}
const SEED_VALUE = 1; // Seed value for the hash function
export class DecisionMaker {
    /**
     * Generates a bucket value based on the hash value, maximum value, and an optional multiplier.
     *
     * @param {number} hashValue - The hash value used for calculation
     * @param {number} maxValue - The maximum value for bucket scaling
     * @param {number} [multiplier=1] - Optional multiplier to adjust the value
     * @returns {number} - The calculated bucket value
     */
    generateBucketValue(hashValue, maxValue, multiplier = 1) {
        // Calculate the ratio based on the hash value
        const ratio = hashValue / Math.pow(2, 32);
        // Calculate the multiplied value
        const multipliedValue = (maxValue * ratio + 1) * multiplier;
        // Round down to get the final value
        const value = Math.floor(multipliedValue);
        return value;
    }
    /**
     * Gets the bucket value for a user based on the hash key and maximum value.
     *
     * @param {string} hashKey - The hash key for the user
     * @param {number} [maxValue=100] - The maximum value for bucket scaling
     * @returns {number} - The calculated bucket value for the user
     */
    getBucketValueForUser(hashKey, maxValue = 100) {
        const hashValue = Hasher.v3(hashKey, SEED_VALUE); // Calculate the hash value
        const bucketValue = this.generateBucketValue(hashValue, maxValue); // Calculate the bucket value
        return bucketValue; // Return the calculated bucket value
    }
    /**
     * Calculates the bucket value for a given string with optional multiplier and maximum value.
     *
     * @param {string} str - The input string to calculate the bucket value for
     * @param {number} [multiplier=1] - Optional multiplier to adjust the value
     * @param {number} [maxValue=10000] - The maximum value for bucket scaling
     * @returns {number} - The calculated bucket value
     */
    calculateBucketValue(str, multiplier = 1, maxValue = 10000) {
        const hashValue = this.generateHashValue(str); // Generate the hash value for the input string
        return this.generateBucketValue(hashValue, maxValue, multiplier); // Generate and return the bucket value
    }
    /**
     * Generates the hash value for a given hash key using murmurHash v3.
     *
     * @param {string} hashKey - The hash key for which the hash value is generated
     * @returns {number} - The generated hash value
     */
    generateHashValue(hashKey) {
        return Hasher.v3(hashKey, SEED_VALUE); // Return the hash value generated using murmurHash
    }
}
//# sourceMappingURL=index.js.map