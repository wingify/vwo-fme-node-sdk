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
import { dynamic } from './types/Common';
import { ILogManager } from './packages/logger';
import { Storage } from './packages/storage';
import { IVWOClient } from './VWOClient';
import { IVWOOptions } from './models/VWOOptionsModel';
import { BatchEventsQueue } from './services/BatchEventsQueue';
export interface IVWOBuilder {
  settings: Record<any, any>;
  storage: Storage;
  logManager: ILogManager;
  isSettingsFetchInProgress: boolean;
  vwoInstance: IVWOClient;
  build(settings: Record<any, any>): IVWOClient;
  fetchSettings(): Promise<Record<any, any>>;
  setSettingsService(): this;
  getSettings(force: boolean): Promise<Record<any, any>>;
  setStorage(): this;
  setNetworkManager(): this;
  initPolling(): this;
  setLogger(): this;
  setSegmentation(): this;
}
export declare class VWOBuilder implements IVWOBuilder {
  readonly sdkKey: string;
  readonly options: IVWOOptions;
  private settingFileManager;
  settings: Record<any, any>;
  storage: Storage;
  logManager: ILogManager;
  originalSettings: dynamic;
  isSettingsFetchInProgress: boolean;
  vwoInstance: IVWOClient;
  batchEventsQueue: BatchEventsQueue;
  constructor(options: IVWOOptions);
  /**
   * Sets the network manager with the provided client and development mode options.
   * @returns {this} The instance of this builder.
   */
  setNetworkManager(): this;
  initBatching(): this;
  /**
   * Sets the segmentation evaluator with the provided segmentation options.
   * @returns {this} The instance of this builder.
   */
  setSegmentation(): this;
  /**
   * Fetches settings asynchronously, ensuring no parallel fetches.
   * @param {boolean} [force=false] - Force fetch ignoring cache.
   * @returns {Promise<SettingsModel>} A promise that resolves to the fetched settings.
   */
  fetchSettings(force?: boolean): Promise<Record<any, any>>;
  /**
   * Gets the settings, fetching them if not cached or if forced.
   * @param {boolean} [force=false] - Force fetch ignoring cache.
   * @returns {Promise<SettingsModel>} A promise that resolves to the settings.
   */
  getSettings(force?: boolean): Promise<Record<any, any>>;
  /**
   * Sets the storage connector based on the provided storage options.
   * @returns {this} The instance of this builder.
   */
  setStorage(): this;
  /**
   * Sets the settings manager with the provided options.
   * @returns {this} The instance of this builder.
   */
  setSettingsService(): this;
  /**
   * Sets the logger with the provided logger options.
   * @returns {this} The instance of this builder.
   */
  setLogger(): this;
  /**
   * Sets the analytics callback with the provided analytics options.
   * @returns {this} The instance of this builder.
   */
  /**
   * Generates a random user ID based on the provided API key.
   * @returns {string} The generated random user ID.
   */
  getRandomUserId(): string;
  /**
   * Initializes the batching with the provided batch events options.
   * @returns {this} The instance of this builder.
   */
  /**
   * Initializes the polling with the provided poll interval.
   * @returns {this} The instance of this builder.
   */
  initPolling(): this;
  /**
   * Builds a new VWOClient instance with the provided settings.
   * @param {SettingsModel} settings - The settings for the VWOClient.
   * @returns {VWOClient} The new VWOClient instance.
   */
  build(settings: Record<any, any>): IVWOClient;
  /**
   * Checks and polls for settings updates at the provided interval.
   */
  checkAndPoll(): void;
}
