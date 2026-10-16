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
import PanicModeForcedRefreshControlService from './PanicModeForcedRefreshControlService.js';
import { getBatchScopedSegmentationManager } from './GetFlagsBatchContext.js';
import { InternalEventsThrottleService } from './InternalEventsThrottleService.js';
import { InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { buildMessage } from '../utils/LogMessageUtil.js';
/**
 * ServiceContainer is a class that contains all the services that are used in the SDK.
 */
export class ServiceContainer {
    constructor(options) {
        this.BatchEventsQueue = null;
        this.suppressTrackingCalls = false;
        this.suppressMAU = false;
        this.pollingStopCallback = null;
        this.forceRefreshHandler = null;
        this.internalEventsThrottleService = null;
        this.originalSettingsDocument = {};
        this.vwoOptions = options;
        this.HooksService = new HooksService(this.vwoOptions);
        this.SegmentationManager = new SegmentationManager();
        this.panicModeForcedRefreshControlService = new PanicModeForcedRefreshControlService();
        this.panicModeForcedRefreshControlService.setOnPanicActivated(() => {
            if (this.BatchEventsQueue) {
                const discardedCount = this.BatchEventsQueue.discardQueuedEvents();
                if (discardedCount > 0 && this.logManager) {
                    this.logManager.info(buildMessage(InfoLogMessagesEnum.EVENTS_DISCARDED_DUE_TO_PANIC_MODE, { count: discardedCount }));
                }
            }
        });
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
        if (this.panicModeForcedRefreshControlService) {
            this.panicModeForcedRefreshControlService.setLogManager(logManager);
        }
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
     * @returns IWingifyOptions
     */
    getWingifyOptions() {
        return this.vwoOptions;
    }
    /**
     *
     * @returns BatchEventsQueue or null if cleared (e.g. after shutdown)
     */
    getBatchEventsQueue() {
        return this.BatchEventsQueue;
    }
    /**
     * Sets the batch events queue. Pass null to clear (e.g. on shutdown).
     * @param batchEventsQueue - The batch events queue to set, or null to clear.
     */
    setBatchEventsQueue(batchEventsQueue) {
        this.BatchEventsQueue = batchEventsQueue;
    }
    /**
     *
     * @returns SegmentationManager
     */
    getSegmentationManager() {
        // Outside getFlags batch workers ALS is unset, so getFlag/trackEvent keep the shared manager.
        return getBatchScopedSegmentationManager() ?? this.SegmentationManager;
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
     * @param isGatewayPassed - If gateway is configured, return endpoint as-is.
     * @returns The updated endpoint with the collection prefix.
     */
    getUpdatedEndpointWithCollectionPrefix(endpoint, isGatewayPassed = false) {
        if (isGatewayPassed) {
            return endpoint;
        }
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
     * Returns the service that applies panic-mode and forced settings refresh from settings and DaCDN payloads.
     * @returns The panic / forced-refresh coordination service instance.
     */
    getPanicModeForcedRefreshControlService() {
        return this.panicModeForcedRefreshControlService;
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
    setSuppressTrackingCalls(value) {
        this.suppressTrackingCalls = value;
    }
    getSuppressTrackingCalls() {
        return this.suppressTrackingCalls;
    }
    setSuppressMAU(value) {
        this.suppressMAU = value;
    }
    getSuppressMAU() {
        return this.suppressMAU;
    }
    /**
     * Registers a callback to stop settings polling (called from WingifyBuilder when polling is started).
     * @param callback - Callback to run when polling should stop, or null to clear.
     */
    setPollingStopCallback(callback) {
        this.pollingStopCallback = callback;
    }
    /**
     * Stops settings polling if it was started. No-op if polling was not active.
     */
    stopPolling() {
        if (this.pollingStopCallback) {
            this.pollingStopCallback();
            this.pollingStopCallback = null;
        }
    }
    /**
     * Registers the callback used when a successful collect/batch response signals `forceRefresh`.
     * Wired by VWOClient to `updateSettings(undefined, true)` to avoid importing VWOClient from network utilities.
     *
     * @param handler - Async function to pull latest settings, or `null` to clear.
     */
    setForceRefreshHandler(handler) {
        this.forceRefreshHandler = handler;
    }
    /**
     * Returns the handler registered with `setForceRefreshHandler`, if any.
     *
     * @returns The registered handler, or `null` when none is set.
     */
    getForceRefreshHandler() {
        return this.forceRefreshHandler;
    }
    /**
     * Returns the internal-events throttle service for the current SDK instance.
     * @returns The lazily initialized internal-events throttle service.
     */
    getInternalEventsThrottleService() {
        if (!this.internalEventsThrottleService) {
            this.internalEventsThrottleService = new InternalEventsThrottleService(this);
        }
        return this.internalEventsThrottleService;
    }
    /**
     * Stores the raw settings document used for internal-event metadata lookups.
     * @param settingsDocument - The unnormalized settings document from the server or init options.
     */
    setOriginalSettingsDocument(settingsDocument) {
        this.originalSettingsDocument = settingsDocument ?? {};
    }
    /**
     * Returns the raw settings document used for internal-event metadata lookups.
     * @returns The stored settings document.
     */
    getOriginalSettingsDocument() {
        return this.originalSettingsDocument;
    }
}
//# sourceMappingURL=ServiceContainer.js.map