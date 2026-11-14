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
import { getUUID } from '../../utils/UuidUtil';
import { getCurrentUnixTimestamp } from '../../utils/FunctionUtil';
import { IWingifyOptions } from '../WingifyOptionsModel';

// Interface definition
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
  /** When false, user-facing APIs no-op for this user. Default is consented when omitted. */
  hasConsented?: boolean;
}
export class ContextModel implements IWingifyContextModel {
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
  hasConsented?: boolean;

  modelFromDictionary(context: Record<string, any>, options: IWingifyOptions): this {
    this.id = context.id;
    this.userAgent = context.userAgent;
    this.ipAddress = context.ipAddress;
    // if sdk is running in js environment and userAgent is not given then we use navigator.userAgent
    // Check if sdk running in browser and not in edge/serverless environment
    if (typeof process === 'undefined' && typeof XMLHttpRequest !== 'undefined' && !context.userAgent) {
      this.userAgent = navigator.userAgent;
    }

    if (context?.customVariables) {
      this.customVariables = context.customVariables;
    }
    if (context?.variationTargetingVariables) {
      this.variationTargetingVariables = context.variationTargetingVariables;
    }
    if (context?._wingify || context?._vwo) {
      this._wingify = new ContextWingifyModel().modelFromDictionary(context._wingify || context._vwo);
    }
    if (context?.postSegmentationVariables) {
      this.postSegmentationVariables = context.postSegmentationVariables;
    }
    if (context?.bucketingSeed) {
      this.bucketingSeed = context.bucketingSeed;
    }
    if (context?.platformVariables) {
      this.platformVariables = { ...context.platformVariables };
    }

    if (context?.isDevMode) {
      this.isDevMode = context.isDevMode === true;
    }

    // Only an explicit false is stored. A missing field stays treated as consented.
    if (context?.hasConsented === false) {
      this.hasConsented = false;
    }

    // if uuid is provided in the context, use it, otherwise generate a new uuid
    this._wingify_uuid =
      context?.uuid ??
      getUUID(context?.id?.toString() ?? `${options?.accountId}_${options?.sdkKey}`, options?.accountId?.toString());

    // If sessionId is provided in the context, use it, otherwise generate a new one
    if (context?.sessionId) {
      this.sessionId = context.sessionId;
    } else {
      this.sessionId = getCurrentUnixTimestamp();
    }
    return this;
  }

  getId(): string {
    return this.id?.toString();
  }

  getUserAgent(): string {
    return this.userAgent;
  }

  getIpAddress(): string {
    return this.ipAddress;
  }

  getCustomVariables(): Record<string, any> {
    return this.customVariables;
  }

  setCustomVariables(customVariables: Record<string, any>): void {
    this.customVariables = customVariables;
  }

  getVariationTargetingVariables(): Record<string, dynamic> {
    return this.variationTargetingVariables;
  }

  setVariationTargetingVariables(variationTargetingVariables: Record<string, dynamic>): void {
    this.variationTargetingVariables = variationTargetingVariables;
  }

  getVwo(): ContextWingifyModel {
    return this._wingify;
  }

  setVwo(_wingify: ContextWingifyModel): void {
    this._wingify = _wingify;
  }

  getPostSegmentationVariables(): string[] {
    return this.postSegmentationVariables;
  }

  setPostSegmentationVariables(postSegmentationVariables: string[]): void {
    this.postSegmentationVariables = postSegmentationVariables;
  }

  getUuid(): string {
    return this._wingify_uuid;
  }

  getSessionId(): number {
    return this.sessionId;
  }

  getBucketingSeed(): string | undefined {
    return this.bucketingSeed?.toString();
  }

  getPlatformVariables(): {
    webTestingCampaigns?: string | Record<string, string | number>;
  } {
    return this.platformVariables;
  }

  setPlatformVariables(platformVariables: { webTestingCampaigns?: string | Record<string, string | number> }): void {
    this.platformVariables = platformVariables;
  }

  getIsDevMode(): boolean {
    return this.isDevMode === true;
  }

  /**
   * Whether the user has consented to data being sent to Wingify servers (true by default).
   *
   * @returns {boolean} False only when consent was explicitly denied.
   */
  getHasConsented(): boolean {
    // Undefined means the caller omitted consent, which is treated as allowed.
    return this.hasConsented !== false;
  }
}
