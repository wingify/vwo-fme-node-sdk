"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceContainer = void 0;
var SegmentationManger_1 = require("../packages/segmentation-evaluator/core/SegmentationManger");
var HooksService_1 = __importDefault(require("./HooksService"));
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
/**
 * ServiceContainer is a class that contains all the services that are used in the SDK.
 */
var ServiceContainer = /** @class */ (function () {
    function ServiceContainer(options) {
        this.vwoOptions = options;
        this.HooksService = new HooksService_1.default(this.vwoOptions);
        this.SegmentationManager = new SegmentationManger_1.SegmentationManager();
    }
    /**
     *
     * @returns ILogManager
     */
    ServiceContainer.prototype.getLogManager = function () {
        return this.logManager;
    };
    /**
     * Sets the log manager.
     * @param logManager - The log manager to set.
     */
    ServiceContainer.prototype.setLogManager = function (logManager) {
        this.logManager = logManager;
    };
    /**
     *
     * @returns SettingsService
     */
    ServiceContainer.prototype.getSettingsService = function () {
        return this.SettingsService;
    };
    /**
     * Sets the settings service.
     * @param settingsService - The settings service to set.
     */
    ServiceContainer.prototype.setSettingsService = function (settingsService) {
        this.SettingsService = settingsService;
    };
    /**
     *
     * @returns HooksService
     */
    ServiceContainer.prototype.getHooksService = function () {
        return this.HooksService;
    };
    /**
     *
     * @returns IVWOOptions
     */
    ServiceContainer.prototype.getVWOOptions = function () {
        return this.vwoOptions;
    };
    /**
     *
     * @returns BatchEventsQueue
     */
    ServiceContainer.prototype.getBatchEventsQueue = function () {
        return this.BatchEventsQueue;
    };
    /**
     * Sets the batch events queue.
     * @param batchEventsQueue - The batch events queue to set.
     */
    ServiceContainer.prototype.setBatchEventsQueue = function (batchEventsQueue) {
        this.BatchEventsQueue = batchEventsQueue;
    };
    /**
     *
     * @returns SegmentationManager
     */
    ServiceContainer.prototype.getSegmentationManager = function () {
        return this.SegmentationManager;
    };
    /**
     *
     * @returns SettingsModel
     */
    ServiceContainer.prototype.getSettings = function () {
        return this.SettingsModel;
    };
    /**
     * Sets the settings model.
     * @param settings - The settings model to set.
     */
    ServiceContainer.prototype.setSettings = function (settings) {
        this.SettingsModel = settings;
    };
    /**
     * Updates the endpoint with the collection prefix.
     * @param endpoint - The endpoint to update.
     * @returns The updated endpoint with the collection prefix.
     */
    ServiceContainer.prototype.getUpdatedEndpointWithCollectionPrefix = function (endpoint) {
        if (this.SettingsModel) {
            if (endpoint && this.SettingsModel.getCollectionPrefix() && (0, DataTypeUtil_1.isString)(this.SettingsModel.getCollectionPrefix())) {
                return "/".concat(this.SettingsModel.getCollectionPrefix()).concat(endpoint);
            }
        }
        return endpoint;
    };
    /**
     *
     * @returns NetworkManager
     */
    ServiceContainer.prototype.getNetworkManager = function () {
        return this.NetworkManager;
    };
    /**
     * Sets the network manager.
     * @param networkManager - The network manager to set.
     */
    ServiceContainer.prototype.setNetworkManager = function (networkManager) {
        this.NetworkManager = networkManager;
    };
    /**
     *
     * @returns Storage
     */
    ServiceContainer.prototype.getStorageConnector = function () {
        if (this.Storage) {
            return this.Storage.getConnector();
        }
        return null;
    };
    /**
     * Sets the storage.
     * @param storage - The storage to set.
     */
    ServiceContainer.prototype.setStorage = function (storage) {
        this.Storage = storage;
    };
    /**
     * Injects the service container into the services.
     * @param serviceContainer - The service container to inject.
     */
    ServiceContainer.prototype.injectServiceContainer = function (serviceContainer) {
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
    };
    /**
     * Sets the value to determine if the SDK should wait for a network response.
     * @param value - The value to set.
     */
    ServiceContainer.prototype.setShouldWaitForTrackingCalls = function (value) {
        this.shouldWaitForTrackingCalls = value;
    };
    /**
     * Gets the value to determine if the SDK should wait for a network response.
     * @returns The value to determine if the SDK should wait for a network response.
     */
    ServiceContainer.prototype.getShouldWaitForTrackingCalls = function () {
        return this.shouldWaitForTrackingCalls;
    };
    return ServiceContainer;
}());
exports.ServiceContainer = ServiceContainer;
//# sourceMappingURL=ServiceContainer.js.map