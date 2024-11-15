/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
  vwoBuilder?: IVWOBuilder;
}
export declare class VWOOptionsModel implements IVWOOptions {
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
  vwoBuilder?: IVWOBuilder;
  modelFromDictionary(options: VWOOptionsModel): this;
  getAccountId(): string;
  getSdkKey(): string;
  getIsDevelopmentMode(): boolean;
  getStorageService(): Connector | Record<any, any>;
  getGatewayService(): IGatewayService;
  getPollInterval(): number;
  getLogger(): ILogManager;
  getSegmentation(): SegmentEvaluator;
  getNetwork(): INetworkOptions;
  getVWOBuilder(): IVWOBuilder;
  getSettings(): Record<any, any>;
}
export {};
