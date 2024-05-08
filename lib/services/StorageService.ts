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
import { StorageEnum } from '../enums/StorageEnum';
import { Storage } from '../modules/storage';
import { dynamic } from '../types/Common';

import { isNull, isUndefined } from '../utils/DataTypeUtil';
import { Deferred } from '../utils/PromiseUtil';

export class StorageService {
  private storageData: Record<string, dynamic> = {};

  /**
   * Retrieves data from storage based on the feature key and user ID.
   * @param featureKey The key to identify the feature data.
   * @param user The user object containing at least an ID.
   * @returns A promise that resolves to the data retrieved or an error/storage status enum.
   */
  async getDataInStorage(featureKey: any, user: any): Promise<Record<any, any>> {
    const deferredObject = new Deferred();
    const storageInstance = Storage.Instance.getConnector();

    // Check if the storage instance is available
    if (isNull(storageInstance) || isUndefined(storageInstance)) {
      deferredObject.resolve(StorageEnum.STORAGE_UNDEFINED);
    } else {
      storageInstance
        .get(featureKey, user.id)
        .then((data: Record<string, any>) => {
          deferredObject.resolve(data);
        })
        .catch((err) => {
          console.log('Error in getting data from storage', err);
          // TODO:- Add logging here
          deferredObject.resolve(StorageEnum.NO_DATA_FOUND);
        });
    }

    return deferredObject.promise;
  }

  /**
   * Stores data in the storage.
   * @param data The data to be stored as a record.
   * @returns A promise that resolves to true if data is successfully stored, otherwise false.
   */
  async setDataInStorage(data: Record<any, any>): Promise<void> {
    const deferredObject = new Deferred();

    const storageInstance = Storage.Instance.getConnector();
    // Check if the storage instance is available
    if (storageInstance === null || storageInstance === undefined) {
      deferredObject.resolve(false);
    } else {
      storageInstance
        .set(data)
        .then(() => {
          deferredObject.resolve(true);
        })
        .catch(() => {
          deferredObject.resolve(false);
        });
    }

    return deferredObject.promise;
  }
}
