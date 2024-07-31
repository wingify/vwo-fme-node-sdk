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
import { dynamic } from '../types/Common';
import { SettingsModel } from '../models/settings/SettingsModel';
interface ISettingsService {
  sdkKey: string;
  getSettings(forceFetch: boolean): Promise<dynamic>;
  fetchSettings(): Promise<dynamic>;
}
export declare class SettingsService implements ISettingsService {
  sdkKey: string;
  accountId: number;
  expiry: number;
  networkTimeout: number;
  hostname: string;
  port: number;
  protocol: string;
  isGatewayServiceProvided: boolean;
  private static instance;
  constructor(options: Record<string, any>);
  static get Instance(): SettingsService;
  private setSettingsExpiry;
  private fetchSettingsAndCacheInStorage;
  fetchSettings(): Promise<SettingsModel>;
  getSettings(forceFetch?: boolean): Promise<SettingsModel>;
}
export {};
