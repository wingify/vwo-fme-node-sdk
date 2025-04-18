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
import { StorageEnum } from '../enums/StorageEnum';
import { ContextModel } from '../models/user/ContextModel';
import { Storage } from '../packages/storage';
import { dynamic } from '../types/Common';

import { ErrorLogMessagesEnum } from '../enums/log-messages';
import { LogManager } from '../packages/logger';
import { isNull, isUndefined } from '../utils/DataTypeUtil';
import { buildMessage } from '../utils/LogMessageUtil';
import { Deferred } from '../utils/PromiseUtil';

export interface IStorageService {
  getDataInStorage(featureKey: any, context: ContextModel): Promise<Record<any, any>>;
  setDataInStorage(data: Record<any, any>): Promise<void>;
}
export class StorageService implements IStorageService {
  private storageData: Record<string, dynamic> = {};

  /**
   * Retrieves data from storage based on the feature key and user ID.
   * @param featureKey The key to identify the feature data.
   * @param user The user object containing at least an ID.
   * @returns A promise that resolves to the data retrieved or an error/storage status enum.
   */
  async getDataInStorage(featureKey: any, context: ContextModel): Promise<Record<any, any>> {
    const deferredObject = new Deferred();
    const storageInstance = Storage.Instance.getConnector();

    // Check if the storage instance is available
    if (isNull(storageInstance) || isUndefined(storageInstance)) {
      deferredObject.resolve(StorageEnum.STORAGE_UNDEFINED);
    } else {
      storageInstance
        .get(featureKey, context.getId())
        .then((data: Record<string, any>) => {
          deferredObject.resolve(data);
        })
        .catch((err) => {
          LogManager.Instance.error(
            buildMessage(ErrorLogMessagesEnum.STORED_DATA_ERROR, {
              err,
            }),
          );

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
