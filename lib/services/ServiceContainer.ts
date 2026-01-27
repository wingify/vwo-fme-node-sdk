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
import { isString } from '../utils/DataTypeUtil';
import { NetworkManager } from '../packages/network-layer/manager/NetworkManager';
import { LogManager } from '../packages/logger';
import { Storage } from '../packages/storage';

/**
 * ServiceContainer is a class that contains all the services that are used in the SDK.
 */
export class ServiceContainer {
  private logManager: LogManager;
  private SettingsService: SettingsService;
  private HooksService: HooksService;
  private vwoOptions: IVWOOptions;
  private BatchEventsQueue: BatchEventsQueue;
  private SegmentationManager: SegmentationManager;
  private SettingsModel: SettingsModel;
  private NetworkManager: NetworkManager;
  private Storage: Storage;
  private shouldWaitForTrackingCalls: boolean;

  constructor(options: IVWOOptions) {
    this.vwoOptions = options;
    this.HooksService = new HooksService(this.vwoOptions);
    this.SegmentationManager = new SegmentationManager();
  }

  /**
   *
   * @returns ILogManager
   */
  public getLogManager(): LogManager {
    return this.logManager;
  }

  /**
   * Sets the log manager.
   * @param logManager - The log manager to set.
   */
  public setLogManager(logManager: LogManager): void {
    this.logManager = logManager;
  }

  /**
   *
   * @returns SettingsService
   */
  public getSettingsService(): SettingsService {
    return this.SettingsService;
  }

  /**
   * Sets the settings service.
   * @param settingsService - The settings service to set.
   */
  public setSettingsService(settingsService: SettingsService): void {
    this.SettingsService = settingsService;
  }

  /**
   *
   * @returns HooksService
   */
  public getHooksService(): HooksService {
    return this.HooksService;
  }

  /**
   *
   * @returns IVWOOptions
   */
  public getVWOOptions(): IVWOOptions {
    return this.vwoOptions;
  }

  /**
   *
   * @returns BatchEventsQueue
   */
  public getBatchEventsQueue(): BatchEventsQueue {
    return this.BatchEventsQueue;
  }

  /**
   * Sets the batch events queue.
   * @param batchEventsQueue - The batch events queue to set.
   */
  public setBatchEventsQueue(batchEventsQueue: BatchEventsQueue): void {
    this.BatchEventsQueue = batchEventsQueue;
  }

  /**
   *
   * @returns SegmentationManager
   */
  public getSegmentationManager(): SegmentationManager {
    return this.SegmentationManager;
  }

  /**
   *
   * @returns SettingsModel
   */
  public getSettings(): SettingsModel {
    return this.SettingsModel;
  }

  /**
   * Sets the settings model.
   * @param settings - The settings model to set.
   */
  public setSettings(settings: SettingsModel): void {
    this.SettingsModel = settings;
  }

  /**
   * Updates the endpoint with the collection prefix.
   * @param endpoint - The endpoint to update.
   * @returns The updated endpoint with the collection prefix.
   */
  public getUpdatedEndpointWithCollectionPrefix(endpoint: string): string {
    if (this.SettingsModel) {
      if (endpoint && this.SettingsModel.getCollectionPrefix() && isString(this.SettingsModel.getCollectionPrefix())) {
        return `/${this.SettingsModel.getCollectionPrefix()}${endpoint}`;
      }
    }
    return endpoint;
  }

  /**
   *
   * @returns NetworkManager
   */
  public getNetworkManager(): NetworkManager {
    return this.NetworkManager;
  }

  /**
   * Sets the network manager.
   * @param networkManager - The network manager to set.
   */
  public setNetworkManager(networkManager: NetworkManager): void {
    this.NetworkManager = networkManager;
  }

  /**
   *
   * @returns Storage
   */
  public getStorageConnector(): any {
    if (this.Storage) {
      return this.Storage.getConnector();
    }
    return null;
  }

  /**
   * Sets the storage.
   * @param storage - The storage to set.
   */
  public setStorage(storage: Storage): void {
    this.Storage = storage;
  }

  /**
   * Injects the service container into the services.
   * @param serviceContainer - The service container to inject.
   */
  public injectServiceContainer(serviceContainer: ServiceContainer): void {
    if (this.SettingsService) {
      this.SettingsService.injectServiceContainer(serviceContainer);
    }
    if (this.NetworkManager) {
      this.NetworkManager.injectServiceContainer(serviceContainer);
    }
    if (this.BatchEventsQueue) {
      this.BatchEventsQueue.injectServiceContainer(serviceContainer);
    }
    if (this.logManager) {
      this.logManager.injectServiceContainer(serviceContainer);
    }
  }

  /**
   * Sets the value to determine if the SDK should wait for a network response.
   * @param value - The value to set.
   */
  public setShouldWaitForTrackingCalls(value: boolean): void {
    this.shouldWaitForTrackingCalls = value;
  }

  /**
   * Gets the value to determine if the SDK should wait for a network response.
   * @returns The value to determine if the SDK should wait for a network response.
   */
  public getShouldWaitForTrackingCalls(): boolean {
    return this.shouldWaitForTrackingCalls;
  }
}
