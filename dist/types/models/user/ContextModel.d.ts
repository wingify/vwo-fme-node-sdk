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
import { dynamic } from '../../types/Common';
import { ContextWingifyModel } from './ContextWingifyModel';
import { IWingifyOptions } from '../WingifyOptionsModel';
export interface IWingifyContextModel {
  id: string | number;
  userAgent?: string;
  ipAddress?: string;
  customVariables?: Record<string, any>;
  variationTargetingVariables?: Record<string, dynamic>;
  postSegmentationVariables?: string[];
  bucketingSeed?: string;
  sessionId?: number;
  platformVariables?: {
    webTestingCampaigns?: string | Record<string, string | number>;
  };
  isDevMode?: boolean;
}
export declare class ContextModel implements IWingifyContextModel {
  id: string | number;
  userAgent?: string;
  ipAddress?: string;
  customVariables?: Record<string, any>;
  variationTargetingVariables?: Record<string, dynamic>;
  postSegmentationVariables?: string[];
  bucketingSeed?: string;
  _wingify_uuid?: string;
  sessionId?: number;
  _wingify?: ContextWingifyModel;
  platformVariables?: {
    webTestingCampaigns?: string | Record<string, string | number>;
  };
  isDevMode?: boolean;
  modelFromDictionary(context: Record<string, any>, options: IWingifyOptions): this;
  getId(): string;
  getUserAgent(): string;
  getIpAddress(): string;
  getCustomVariables(): Record<string, any>;
  setCustomVariables(customVariables: Record<string, any>): void;
  getVariationTargetingVariables(): Record<string, dynamic>;
  setVariationTargetingVariables(variationTargetingVariables: Record<string, dynamic>): void;
  getVwo(): ContextWingifyModel;
  setVwo(_wingify: ContextWingifyModel): void;
  getPostSegmentationVariables(): string[];
  setPostSegmentationVariables(postSegmentationVariables: string[]): void;
  getUuid(): string;
  getSessionId(): number;
  getBucketingSeed(): string | undefined;
  getPlatformVariables(): {
    webTestingCampaigns?: string | Record<string, string | number>;
  };
  setPlatformVariables(platformVariables: { webTestingCampaigns?: string | Record<string, string | number> }): void;
  getIsDevMode(): boolean;
}
