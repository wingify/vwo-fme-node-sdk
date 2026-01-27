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

import { StorageEnum } from '../enums/StorageEnum';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { IStorageService } from '../services/StorageService';

import { ContextModel } from '../models/user/ContextModel';
import { Deferred } from '../utils/PromiseUtil';
import { ApiEnum } from '../enums/ApiEnum';
import { ServiceContainer } from '../services/ServiceContainer';

interface IStorageDecorator {
  /**
   * Sets data in storage.
   * @param data The data to be stored.
   * @param storageService The storage service instance.
   * @returns A promise that resolves to a VariationModel.
   */
  setDataInStorage(
    data: Record<any, any>,
    storageService: IStorageService,
    serviceContainer: ServiceContainer,
  ): Promise<VariationModel>;

  /**
   * Retrieves a feature from storage.
   * @param featureKey The key of the feature to retrieve.
   * @param user The user object.
   * @param storageService The storage service instance.
   * @returns A promise that resolves to the retrieved feature or relevant status.
   */
  getFeatureFromStorage(
    featureKey: FeatureModel,
    context: ContextModel,
    storageService: IStorageService,
    serviceContainer: ServiceContainer,
  ): Promise<any>;
}

export class StorageDecorator implements IStorageDecorator {
  /**
   * Asynchronously retrieves a feature from storage based on the feature key and user.
   * @param featureKey The key of the feature to retrieve.
   * @param user The user object.
   * @param storageService The storage service instance.
   * @returns A promise that resolves to the retrieved feature or relevant status.
   */
  async getFeatureFromStorage(
    featureKey: any,
    context: ContextModel,
    storageService: IStorageService,
    serviceContainer: ServiceContainer,
  ): Promise<any> {
    const deferredObject = new Deferred();
    storageService
      .getDataInStorage(featureKey, context, serviceContainer)
      .then((campaignMap: Record<any, any> | StorageEnum) => {
        switch (campaignMap) {
          case StorageEnum.STORAGE_UNDEFINED:
            deferredObject.resolve(null); // No storage defined
            break;
          case StorageEnum.NO_DATA_FOUND:
            deferredObject.resolve(null); // No data found in storage
            break;
          case StorageEnum.INCORRECT_DATA:
            deferredObject.resolve(StorageEnum.INCORRECT_DATA); // Incorrect data found
            break;
          case StorageEnum.CAMPAIGN_PAUSED:
            deferredObject.resolve(null); // Campaign is paused
            break;
          case StorageEnum.VARIATION_NOT_FOUND:
            deferredObject.resolve(StorageEnum.VARIATION_NOT_FOUND); // No variation found
            break;
          case StorageEnum.WHITELISTED_VARIATION:
            deferredObject.resolve(null); // Whitelisted variation, handle accordingly
            break;
          default:
            deferredObject.resolve(campaignMap); // Valid data found, resolve with it
        }
      });

    return deferredObject.promise;
  }

  /**
   * Sets data in storage based on the provided data object.
   * @param data The data to be stored, including feature key and user details.
   * @param storageService The storage service instance.
   * @returns A promise that resolves when the data is successfully stored.
   */
  setDataInStorage(
    data: Record<any, any>,
    storageService: IStorageService,
    serviceContainer: ServiceContainer,
  ): Promise<VariationModel> {
    const deferredObject = new Deferred();
    const {
      featureKey,
      featureId,
      context,
      rolloutId,
      rolloutKey,
      rolloutVariationId,
      experimentId,
      experimentKey,
      experimentVariationId,
    } = data;

    if (!featureKey) {
      serviceContainer.getLogManager().errorLog(
        'ERROR_STORING_DATA_IN_STORAGE',
        {
          key: 'featureKey',
        },
        { an: ApiEnum.GET_FLAG, uuid: context._vwo_uuid, sId: context._vwo_sessionId },
      );

      deferredObject.reject(); // Reject promise if feature key is invalid
      return;
    }
    if (!context.id) {
      serviceContainer.getLogManager().errorLog(
        'ERROR_STORING_DATA_IN_STORAGE',
        {
          key: 'Context or Context.id',
        },
        { an: ApiEnum.GET_FLAG, uuid: context._vwo_uuid, sId: context._vwo_sessionId },
      );

      deferredObject.reject(); // Reject promise if user ID is invalid
      return;
    }
    if (rolloutKey && !experimentKey && !rolloutVariationId) {
      serviceContainer.getLogManager().errorLog(
        'ERROR_STORING_DATA_IN_STORAGE',
        {
          key: 'Variation:(rolloutKey, experimentKey or rolloutVariationId)',
        },
        { an: ApiEnum.GET_FLAG, uuid: context._vwo_uuid, sId: context._vwo_sessionId },
      );

      deferredObject.reject(); // Reject promise if rollout variation is invalid
      return;
    }
    if (experimentKey && !experimentVariationId) {
      serviceContainer.getLogManager().errorLog(
        'ERROR_STORING_DATA_IN_STORAGE',
        {
          key: 'Variation:(experimentKey or rolloutVariationId)',
        },
        { an: ApiEnum.GET_FLAG, uuid: context._vwo_uuid, sId: context._vwo_sessionId },
      );

      deferredObject.reject(); // Reject promise if experiment variation is invalid
      return;
    }

    storageService.setDataInStorage(
      {
        featureKey,
        featureId,
        userId: context.id,
        rolloutId,
        rolloutKey,
        rolloutVariationId,
        experimentId,
        experimentKey,
        experimentVariationId,
      },
      serviceContainer,
    );

    deferredObject.resolve(); // Resolve promise when data is successfully set

    return deferredObject.promise;
  }
}
