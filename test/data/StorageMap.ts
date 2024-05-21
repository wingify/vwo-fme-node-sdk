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
type StorageData = {
  rolloutKey: string;
  rolloutVariationId: string;
  experimentKey: string;
  experimentVariationId: string;
};

type StorageMap = {
  storage: Record<string, StorageData>;
  get: (featureKey: string, userId: string) => Promise<StorageData>;
  set: (data: { featureKey: string; user: string } & StorageData) => Promise<void>;
};

const storageMap: StorageMap = {
  storage: {},

  // create a get function
  get: async function (featureKey: string, userId: string) {
    // create the full key
    const key = featureKey + '_' + userId;

    // Check if the key exists in the storage
    if (Object.prototype.hasOwnProperty.call(this.storage, key)) {
      return this.storage[key];
    }
    return null;
  },

  // create a set function
  set: async function (data: { featureKey: string; user: string } & StorageData) {
    // create a key
    const key = data.featureKey + '_' + data.user;

    // Set the data in the storage
    this.storage[key] = {
      rolloutKey: data.rolloutKey,
      rolloutVariationId: data.rolloutVariationId,
      experimentKey: data.experimentKey,
      experimentVariationId: data.experimentVariationId,
    };
  },
};

export default storageMap;
