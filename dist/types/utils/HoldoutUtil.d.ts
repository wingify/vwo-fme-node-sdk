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
import { SettingsModel } from '../models/settings/SettingsModel';
import { HoldoutModel } from '../models/campaign/HoldoutModel';
import { ContextModel } from '../models/user/ContextModel';
import { FeatureModel } from '../models/campaign/FeatureModel';
import { IStorageService } from '../services/StorageService';
import { ServiceContainer } from '../services/ServiceContainer';
/**
 * Gets the applicable holdouts for a given feature ID.
 * @param settings - The settings object.
 * @param featureId - The feature ID.
 * @returns The applicable holdouts.
 */
export declare function getApplicableHoldouts(settings: SettingsModel, featureId: number): HoldoutModel[];
/**
 * Gets the matched holdout(s) for a given feature ID and context.
 * Evaluates all applicable holdouts, creates batched impressions for all of them,
 * and returns all matched holdouts (i.e. holdouts the user is part of).
 * @param settings - The settings object.
 * @param feature - The feature object.
 * @param context - The context object.
 * @returns The matched holdouts or null if no holdout is matched.
 */
export declare function getMatchedHoldouts(
  serviceContainer: ServiceContainer,
  feature: FeatureModel,
  context: ContextModel,
  storedData: any,
): Promise<{
  matchedHoldouts: HoldoutModel[];
  notMatchedHoldouts: HoldoutModel[];
  holdoutPayloads: any[];
} | null>;
/**
 * Sends network calls for not in holdouts that are applicable but not stored in storage.
 * @param serviceContainer - The service container.
 * @param feature - The feature model.
 * @param context - The context model.
 * @param storedData - The stored data.
 * @param storageService - The storage service.
 */
export declare function sendNetworkCallsForNotInHoldouts(
  serviceContainer: ServiceContainer,
  feature: FeatureModel,
  context: ContextModel,
  decision: any,
  storedData: any,
  storageService: IStorageService,
): Promise<Array<string | number>>;
