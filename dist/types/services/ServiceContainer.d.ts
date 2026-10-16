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
import { IWingifyOptions } from '../models/WingifyOptionsModel';
import { SettingsService } from './SettingsService';
import HooksService from './HooksService';
import { NetworkManager } from '../packages/network-layer/manager/NetworkManager';
import { LogManager } from '../packages/logger';
import { Storage } from '../packages/storage';
import PanicModeForcedRefreshControlService from './PanicModeForcedRefreshControlService';
import { InternalEventsThrottleService } from './InternalEventsThrottleService';
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
  private suppressTrackingCalls;
  private suppressMAU;
  private pollingStopCallback;
  private forceRefreshHandler;
  private panicModeForcedRefreshControlService;
  private internalEventsThrottleService;
  private originalSettingsDocument;
  constructor(options: IWingifyOptions);
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
   * @returns IWingifyOptions
   */
  getWingifyOptions(): IWingifyOptions;
  /**
   *
   * @returns BatchEventsQueue or null if cleared (e.g. after shutdown)
   */
  getBatchEventsQueue(): BatchEventsQueue | null;
  /**
   * Sets the batch events queue. Pass null to clear (e.g. on shutdown).
   * @param batchEventsQueue - The batch events queue to set, or null to clear.
   */
  setBatchEventsQueue(batchEventsQueue: BatchEventsQueue | null): void;
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
   * @param isGatewayPassed - If gateway is configured, return endpoint as-is.
   * @returns The updated endpoint with the collection prefix.
   */
  getUpdatedEndpointWithCollectionPrefix(endpoint: string, isGatewayPassed?: boolean): string;
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
   * Returns the service that applies panic-mode and forced settings refresh from settings and DaCDN payloads.
   * @returns The panic / forced-refresh coordination service instance.
   */
  getPanicModeForcedRefreshControlService(): PanicModeForcedRefreshControlService;
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
  setSuppressTrackingCalls(value: boolean): void;
  getSuppressTrackingCalls(): boolean;
  setSuppressMAU(value: boolean): void;
  getSuppressMAU(): boolean;
  /**
   * Registers a callback to stop settings polling (called from WingifyBuilder when polling is started).
   * @param callback - Callback to run when polling should stop, or null to clear.
   */
  setPollingStopCallback(callback: (() => void) | null): void;
  /**
   * Stops settings polling if it was started. No-op if polling was not active.
   */
  stopPolling(): void;
  /**
   * Registers the callback used when a successful collect/batch response signals `forceRefresh`.
   * Wired by VWOClient to `updateSettings(undefined, true)` to avoid importing VWOClient from network utilities.
   *
   * @param handler - Async function to pull latest settings, or `null` to clear.
   */
  setForceRefreshHandler(handler: ((isRefreshFromPanicClear?: boolean) => Promise<void>) | null): void;
  /**
   * Returns the handler registered with `setForceRefreshHandler`, if any.
   *
   * @returns The registered handler, or `null` when none is set.
   */
  getForceRefreshHandler(): ((isRefreshFromPanicClear?: boolean) => Promise<void>) | null;
  /**
   * Returns the internal-events throttle service for the current SDK instance.
   * @returns The lazily initialized internal-events throttle service.
   */
  getInternalEventsThrottleService(): InternalEventsThrottleService;
  /**
   * Stores the raw settings document used for internal-event metadata lookups.
   * @param settingsDocument - The unnormalized settings document from the server or init options.
   */
  setOriginalSettingsDocument(settingsDocument: Record<string, any>): void;
  /**
   * Returns the raw settings document used for internal-event metadata lookups.
   * @returns The stored settings document.
   */
  getOriginalSettingsDocument(): Record<string, any>;
}
