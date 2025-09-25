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

import { IVWOBuilder } from '../VWOBuilder';
import { ILogManager } from '../packages/logger';
import { NetworkClientInterface } from '../packages/network-layer/client/NetworkClientInterface';
import { SegmentEvaluator } from '../packages/segmentation-evaluator';
import { Connector } from '../packages/storage/Connector';
import { IGatewayService } from './GatewayServiceModel';
import { BatchConfig } from '../services/BatchEventsQueue';
import { ClientStorageOptions } from '../packages/storage/connectors/BrowserStorageConnector';
import { IRetryConfig } from '../packages/network-layer/client/NetworkClient';
interface IIntegrationOptions {
  callback?: (properties: Record<string, any>) => void;
}

interface INetworkOptions {
  client?: NetworkClientInterface;
}

export interface IVWOOptions {
  accountId: string;
  sdkKey: string;
  isDevelopmentMode?: boolean;
  storage?: Connector | Record<any, any>;
  gatewayService?: IGatewayService;
  pollInterval?: number;
  logger?: ILogManager;
  segmentation?: SegmentEvaluator;
  integrations?: IIntegrationOptions;
  network?: INetworkOptions;
  platform?: string;
  shouldWaitForTrackingCalls?: boolean;
  settings?: Record<any, any>;
  batchEventData?: BatchConfig;
  vwoBuilder?: IVWOBuilder;
  isUsageStatsDisabled?: boolean;
  _vwo_meta?: Record<any, any>;
  clientStorage?: ClientStorageOptions;
  retryConfig?: IRetryConfig;
  proxyUrl?: string;
  isAliasingEnabled?: boolean;
}

export class VWOOptionsModel implements IVWOOptions {
  accountId: string;
  sdkKey: string;
  isDevelopmentMode?: boolean;
  storage?: Connector | Record<any, any>;
  gatewayService?: IGatewayService;
  pollInterval?: number;
  logger?: ILogManager;
  segmentation?: SegmentEvaluator;
  integrations?: IIntegrationOptions;
  network?: INetworkOptions;
  shouldWaitForTrackingCalls?: boolean;
  settings?: Record<any, any>;
  isAliasingEnabled?: boolean;
  vwoBuilder?: IVWOBuilder;
  isUsageStatsDisabled?: boolean;
  _vwo_meta?: Record<any, any>;
  clientStorage?: ClientStorageOptions;
  retryConfig?: IRetryConfig;
  proxyUrl?: string;
  modelFromDictionary(options: VWOOptionsModel): this {
    this.accountId = options.accountId;
    this.sdkKey = options.sdkKey;
    this.vwoBuilder = options.vwoBuilder;

    if (options?.shouldWaitForTrackingCalls) {
      this.shouldWaitForTrackingCalls = options.shouldWaitForTrackingCalls;
    }
    if (options?.isDevelopmentMode) {
      this.isDevelopmentMode = options.isDevelopmentMode;
    }
    if (options?.storage) {
      this.storage = options.storage;
    }
    if (options?.gatewayService) {
      this.gatewayService = options.gatewayService;
    }
    if (options?.pollInterval) {
      this.pollInterval = options.pollInterval;
    }
    if (options?.logger) {
      this.logger = options.logger;
    }
    if (options?.segmentation) {
      this.segmentation = options.segmentation;
    }
    if (options?.integrations) {
      this.integrations = options.integrations;
    }
    if (options?.network) {
      this.network = options.network;
    }

    if (options?.settings) {
      this.settings = options.settings;
    }

    if (options?.isUsageStatsDisabled) {
      this.isUsageStatsDisabled = options.isUsageStatsDisabled;
    }

    if (options?._vwo_meta) {
      this._vwo_meta = options._vwo_meta;
    }

    if (options?.clientStorage) {
      this.clientStorage = options.clientStorage;
    }

    if (options?.retryConfig) {
      this.retryConfig = options.retryConfig;
    }

    if (options?.proxyUrl) {
      this.proxyUrl = options.proxyUrl;
    }

    if (options?.isAliasingEnabled) {
      this.isAliasingEnabled = options.isAliasingEnabled;
    }

    return this;
  }

  getAccountId(): string {
    return this.accountId;
  }

  getSdkKey(): string {
    return this.sdkKey;
  }

  getIsDevelopmentMode(): boolean {
    return this.isDevelopmentMode;
  }

  getStorageService(): Connector | Record<any, any> {
    return this.storage;
  }

  getGatewayService(): IGatewayService {
    return this.gatewayService;
  }

  getPollInterval(): number {
    return this.pollInterval;
  }

  getLogger(): ILogManager {
    return this.logger;
  }

  getSegmentation(): SegmentEvaluator {
    return this.segmentation;
  }

  getNetwork(): INetworkOptions {
    return this.network;
  }

  getVWOBuilder(): IVWOBuilder {
    return this.vwoBuilder;
  }

  getSettings(): Record<any, any> {
    return this.settings;
  }

  getIsUsageStatsDisabled(): boolean {
    return this.isUsageStatsDisabled;
  }

  getVWOMeta(): Record<any, any> {
    return this._vwo_meta;
  }

  getClientStorage(): ClientStorageOptions {
    return this.clientStorage;
  }

  getRetryConfig(): IRetryConfig {
    return this.retryConfig;
  }

  getProxyUrl(): string {
    return this.proxyUrl;
  }

  getIsAliasingEnabled(): boolean {
    return this.isAliasingEnabled;
  }
}
