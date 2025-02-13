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
import { ContextModel } from '../models/user/ContextModel';
import { SettingsModel } from '../models/settings/SettingsModel';
interface ISetAttribute {
  /**
   * Sets multiple attributes for a user in a single network call.
   * @param settings Configuration settings.
   * @param attributes Key-value map of attributes.
   * @param context Context containing user information.
   */
  setAttribute(
    settings: SettingsModel,
    attributes: Record<string, boolean | string | number>,
    context: ContextModel,
  ): Promise<void>;
}
export declare class SetAttributeApi implements ISetAttribute {
  /**
   * Implementation of setAttributes to create an impression for multiple user attributes.
   * @param settings Configuration settings.
   * @param attributes Key-value map of attributes.
   * @param context Context containing user information.
   */
  setAttribute(
    settings: SettingsModel,
    attributes: Record<string, boolean | string | number>,
    context: ContextModel,
  ): Promise<void>;
}
export {};
