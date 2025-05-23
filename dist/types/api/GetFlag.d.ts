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
import { SettingsModel } from '../models/settings/SettingsModel';
import { VariationModel } from '../models/campaign/VariationModel';
import { ContextModel } from '../models/user/ContextModel';
import IHooksService from '../services/HooksService';
export declare class Flag {
  private readonly enabled;
  private variation;
  constructor(isEnabled: boolean, variation?: VariationModel | Record<string, any> | undefined);
  isEnabled(): boolean;
  getVariables(): Record<string, unknown>[];
  getVariable<T = unknown>(key: string): T | undefined;
  getVariable<T = unknown>(key: string, defaultValue: T): T;
}
export declare class FlagApi {
  static get(
    featureKey: string,
    settings: SettingsModel,
    context: ContextModel,
    hooksService: IHooksService,
  ): Promise<Flag>;
}
