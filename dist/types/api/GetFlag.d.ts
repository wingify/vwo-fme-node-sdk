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
import { FeatureModel } from '../models/campaign/FeatureModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { ContextModel } from '../models/user/ContextModel';
import IHooksService from '../services/HooksService';
interface IGetFlag {
  get(
    featureKey: string,
    settings: SettingsModel,
    context: ContextModel,
    hooksService: IHooksService,
  ): Promise<FeatureModel>;
}
export declare class FlagApi implements IGetFlag {
  get(
    featureKey: string,
    settings: SettingsModel,
    context: ContextModel,
    hooksService: IHooksService,
  ): Promise<FeatureModel>;
}
export {};
