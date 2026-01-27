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
import { SegmentationManager } from '../packages/segmentation-evaluator/core/SegmentationManger';
import { BatchEventsQueue } from './BatchEventsQueue';
import { IVWOOptions } from '../models/VWOOptionsModel';
import { SettingsService } from './SettingsService';
import HooksService from './HooksService';
import { NetworkManager } from '../packages/network-layer/manager/NetworkManager';
import { LogManager } from '../packages/logger';
import { Storage } from '../packages/storage';
/**
 * ServiceContainer is a class that contains all the services that are used in the SDK.
 */
export declare class ServiceContainer {
  private logManager;
  private SettingsService;
  private HooksService;
  private vwoOptions;
  private BatchEventsQueue;
  private SegmentationManager;
  private SettingsModel;
  private NetworkManager;
  private Storage;
  private shouldWaitForTrackingCalls;
  constructor(options: IVWOOptions);
  /**
   *
   * @returns ILogManager
   */
  getLogManager(): LogManager;
  /**
   * Sets the log manager.
   * @param logManager - The log manager to set.
   */
  setLogManager(logManager: LogManager): void;
  /**
   *
   * @returns SettingsService
   */
  getSettingsService(): SettingsService;
  /**
   * Sets the settings service.
   * @param settingsService - The settings service to set.
   */
  setSettingsService(settingsService: SettingsService): void;
  /**
   *
   * @returns HooksService
   */
  getHooksService(): HooksService;
  /**
   *
   * @returns IVWOOptions
   */
  getVWOOptions(): IVWOOptions;
  /**
   *
   * @returns BatchEventsQueue
   */
  getBatchEventsQueue(): BatchEventsQueue;
  /**
   * Sets the batch events queue.
   * @param batchEventsQueue - The batch events queue to set.
   */
  setBatchEventsQueue(batchEventsQueue: BatchEventsQueue): void;
  /**
   *
   * @returns SegmentationManager
   */
  getSegmentationManager(): SegmentationManager;
  /**
   *
   * @returns SettingsModel
   */
  getSettings(): SettingsModel;
  /**
   * Sets the settings model.
   * @param settings - The settings model to set.
   */
  setSettings(settings: SettingsModel): void;
  /**
   * Updates the endpoint with the collection prefix.
   * @param endpoint - The endpoint to update.
   * @returns The updated endpoint with the collection prefix.
   */
  getUpdatedEndpointWithCollectionPrefix(endpoint: string): string;
  /**
   *
   * @returns NetworkManager
   */
  getNetworkManager(): NetworkManager;
  /**
   * Sets the network manager.
   * @param networkManager - The network manager to set.
   */
  setNetworkManager(networkManager: NetworkManager): void;
  /**
   *
   * @returns Storage
   */
  getStorageConnector(): any;
  /**
   * Sets the storage.
   * @param storage - The storage to set.
   */
  setStorage(storage: Storage): void;
  /**
   * Injects the service container into the services.
   * @param serviceContainer - The service container to inject.
   */
  injectServiceContainer(serviceContainer: ServiceContainer): void;
  /**
   * Sets the value to determine if the SDK should wait for a network response.
   * @param value - The value to set.
   */
  setShouldWaitForTrackingCalls(value: boolean): void;
  /**
   * Gets the value to determine if the SDK should wait for a network response.
   * @returns The value to determine if the SDK should wait for a network response.
   */
  getShouldWaitForTrackingCalls(): boolean;
}
