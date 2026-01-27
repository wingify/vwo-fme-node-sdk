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
import { FeatureModel } from '../models/campaign/FeatureModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { IStorageService } from '../services/StorageService';
import { ContextModel } from '../models/user/ContextModel';
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
export declare class StorageDecorator implements IStorageDecorator {
  /**
   * Asynchronously retrieves a feature from storage based on the feature key and user.
   * @param featureKey The key of the feature to retrieve.
   * @param user The user object.
   * @param storageService The storage service instance.
   * @returns A promise that resolves to the retrieved feature or relevant status.
   */
  getFeatureFromStorage(
    featureKey: any,
    context: ContextModel,
    storageService: IStorageService,
    serviceContainer: ServiceContainer,
  ): Promise<any>;
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
  ): Promise<VariationModel>;
}
export {};
