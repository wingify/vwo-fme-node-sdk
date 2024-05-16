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
import { dynamic } from "../../types/Common";
import { ContextVWOModel } from "./ContextVWOModel";

export class ContextModel {
    private id: string | number;
    private userAgent?: string;
    private ipAddress?: string;
    private customVariables?: Record<string, any>;
    private variationTargetingVariables?: Record<string, dynamic>;
    private _vwo?: ContextVWOModel;
  
    modelFromDictionary(context: ContextModel): this {
      this.id = context.id;
      this.userAgent = context.userAgent;
      this.ipAddress = context.ipAddress;
      if (context?.customVariables) {
        this.customVariables = context.customVariables;
      }
      if (context?.variationTargetingVariables) {
        this.variationTargetingVariables = context.variationTargetingVariables;
      }
      if (context?._vwo) {
        this._vwo = context._vwo;
      }
      return this;
    }

    getId(): string | number {
        return this.id;
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

    getVariationTargetingVariables(): Record<string, dynamic> {
        return this.variationTargetingVariables;
    }

    getVwo(): ContextVWOModel {
        return this._vwo;
    }

    setCustomVariables(customVariables: Record<string, any>): void {
        this.customVariables = customVariables;
    }

    setVariationTargetingVariables(variationTargetingVariables: Record<string, dynamic>): void {
        this.variationTargetingVariables = variationTargetingVariables;
    }

    setVwo(_vwo: ContextVWOModel): void {
        this._vwo = _vwo;
    }
  }
  