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
import { SegmentationManager } from '../packages/segmentation-evaluator/core/SegmentationManger.js';
import HooksService from './HooksService.js';
import { isString } from '../utils/DataTypeUtil.js';
/**
 * ServiceContainer is a class that contains all the services that are used in the SDK.
 */
export class ServiceContainer {
    constructor(options) {
        this.vwoOptions = options;
        this.HooksService = new HooksService(this.vwoOptions);
        this.SegmentationManager = new SegmentationManager();
    }
    /**
     *
     * @returns ILogManager
     */
    getLogManager() {
        return this.logManager;
    }
    /**
     * Sets the log manager.
     * @param logManager - The log manager to set.
     */
    setLogManager(logManager) {
        this.logManager = logManager;
    }
    /**
     *
     * @returns SettingsService
     */
    getSettingsService() {
        return this.SettingsService;
    }
    /**
     * Sets the settings service.
     * @param settingsService - The settings service to set.
     */
    setSettingsService(settingsService) {
        this.SettingsService = settingsService;
    }
    /**
     *
     * @returns HooksService
     */
    getHooksService() {
        return this.HooksService;
    }
    /**
     *
     * @returns IVWOOptions
     */
    getVWOOptions() {
        return this.vwoOptions;
    }
    /**
     *
     * @returns BatchEventsQueue
     */
    getBatchEventsQueue() {
        return this.BatchEventsQueue;
    }
    /**
     * Sets the batch events queue.
     * @param batchEventsQueue - The batch events queue to set.
     */
    setBatchEventsQueue(batchEventsQueue) {
        this.BatchEventsQueue = batchEventsQueue;
    }
    /**
     *
     * @returns SegmentationManager
     */
    getSegmentationManager() {
        return this.SegmentationManager;
    }
    /**
     *
     * @returns SettingsModel
     */
    getSettings() {
        return this.SettingsModel;
    }
    /**
     * Sets the settings model.
     * @param settings - The settings model to set.
     */
    setSettings(settings) {
        this.SettingsModel = settings;
    }
    /**
     * Updates the endpoint with the collection prefix.
     * @param endpoint - The endpoint to update.
     * @returns The updated endpoint with the collection prefix.
     */
    getUpdatedEndpointWithCollectionPrefix(endpoint) {
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
    getNetworkManager() {
        return this.NetworkManager;
    }
    /**
     * Sets the network manager.
     * @param networkManager - The network manager to set.
     */
    setNetworkManager(networkManager) {
        this.NetworkManager = networkManager;
    }
    /**
     *
     * @returns Storage
     */
    getStorageConnector() {
        if (this.Storage) {
            return this.Storage.getConnector();
        }
        return null;
    }
    /**
     * Sets the storage.
     * @param storage - The storage to set.
     */
    setStorage(storage) {
        this.Storage = storage;
    }
    /**
     * Injects the service container into the services.
     * @param serviceContainer - The service container to inject.
     */
    injectServiceContainer(serviceContainer) {
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
    setShouldWaitForTrackingCalls(value) {
        this.shouldWaitForTrackingCalls = value;
    }
    /**
     * Gets the value to determine if the SDK should wait for a network response.
     * @returns The value to determine if the SDK should wait for a network response.
     */
    getShouldWaitForTrackingCalls() {
        return this.shouldWaitForTrackingCalls;
    }
}
//# sourceMappingURL=ServiceContainer.js.map