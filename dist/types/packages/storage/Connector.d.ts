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
/**
 * Interface representing the structure of settings data to be stored
 * @interface SettingsData
 */
export interface ISettingsData {
  settings: Record<string, any>;
  timestamp: number;
}
export declare abstract class Connector {
  protected ttl?: number;
  protected alwaysUseCachedSettings?: boolean;
  abstract set(data: dynamic): void | Promise<dynamic>;
  abstract get(featureKey: string, userId: string): this | Promise<dynamic>;
  getSettings?(accountId: number, sdkKey: string): Promise<ISettingsData>;
  setSettings?(data: ISettingsData): Promise<void>;
}
