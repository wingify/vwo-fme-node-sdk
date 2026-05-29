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
import { IWingifyBuilder } from '../WingifyBuilder';
import { ILogManager } from '../packages/logger';
import { NetworkClientInterface } from '../packages/network-layer/client/NetworkClientInterface';
import { SegmentEvaluator } from '../packages/segmentation-evaluator';
import { Connector } from '../packages/storage/Connector';
import { IGatewayService } from './GatewayServiceModel';
import { BatchConfig } from '../services/BatchEventsQueue';
import { ClientStorageOptions } from '../packages/storage/connectors/BrowserStorageConnector';
import { IHttpsAgentConfig, IRetryConfig } from '../packages/network-layer/client/NetworkClient';
import { IEdgeConfig } from './edge/EdgeConfigModel';
import { IBrowserConfig } from './browser/BrowserConfigModel';
interface IIntegrationOptions {
  callback?: (properties: Record<string, any>) => void;
}
interface INetworkOptions {
  client?: NetworkClientInterface;
}
export interface ISdkMetaConfig {
  _vwo_sdkName?: string;
  _vwo_sdkVersion?: string;
  _wingify_sdkName?: string;
  _wingify_sdkVersion?: string;
}
export interface IWingifyOptions {
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
  wingifyBuilder?: IWingifyBuilder;
  vwoBuilder?: IWingifyBuilder;
  isUsageStatsDisabled?: boolean;
  _wingify_meta?: Record<any, any>;
  _vwo_meta?: Record<any, any>;
  clientStorage?: ClientStorageOptions;
  retryConfig?: IRetryConfig;
  httpsAgentConfig?: IHttpsAgentConfig;
  proxyUrl?: string;
  isAliasingEnabled?: boolean;
  edgeConfig?: IEdgeConfig;
  browserConfig?: IBrowserConfig;
  sdkMeta?: ISdkMetaConfig;
  isBatchingDisabled?: boolean;
}
export declare class WingifyOptionsModel implements IWingifyOptions {
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
  wingifyBuilder?: IWingifyBuilder;
  vwoBuilder?: IWingifyBuilder;
  isUsageStatsDisabled?: boolean;
  _vwo_meta?: Record<any, any>;
  _wingify_meta?: Record<any, any>;
  clientStorage?: ClientStorageOptions;
  retryConfig?: IRetryConfig;
  httpsAgentConfig?: IHttpsAgentConfig;
  proxyUrl?: string;
  edgeConfig?: IEdgeConfig;
  browserConfig?: IBrowserConfig;
  sdkMeta?: ISdkMetaConfig;
  isBatchingDisabled?: boolean;
  modelFromDictionary(options: WingifyOptionsModel): this;
  /**
   * Gets the flag indicating whether batching is disabled.
   * @returns The flag indicating whether batching is disabled.
   */
  getIsBatchingDisabled(): boolean;
  /**
   * Gets the HTTPS agent configuration.
   * @returns The HTTPS agent configuration.
   */
  getHttpsAgentConfig(): IHttpsAgentConfig;
  getAccountId(): string;
  getSdkKey(): string;
  getIsDevelopmentMode(): boolean;
  getStorageService(): Connector | Record<any, any>;
  getGatewayService(): IGatewayService;
  getPollInterval(): number;
  getLogger(): ILogManager;
  getSegmentation(): SegmentEvaluator;
  getNetwork(): INetworkOptions;
  getWingifyBuilder(): IWingifyBuilder;
  getSettings(): Record<any, any>;
  getIsUsageStatsDisabled(): boolean;
  getWingifyMeta(): Record<any, any>;
  getClientStorage(): ClientStorageOptions;
  getRetryConfig(): IRetryConfig;
  getProxyUrl(): string;
  getIsAliasingEnabled(): boolean;
  getEdgeConfig(): IEdgeConfig;
  getBrowserConfig(): IBrowserConfig;
  /**
   * Gets the SDK meta.
   * @returns The SDK meta.
   */
  getSdkMeta(): ISdkMetaConfig | undefined;
  /**
   * Gets the SDK name.
   * @returns The SDK name.
   */
  getSdkName(): string | undefined;
  /**
   * Gets the SDK version.
   * @returns The SDK version.
   */
  getVersion(): string | undefined;
}
export {};
