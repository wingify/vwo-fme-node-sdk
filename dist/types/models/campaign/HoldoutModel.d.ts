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
import { MetricModel } from './MetricModel';
export declare class HoldoutModel {
  private id;
  private segments?;
  private percentTraffic;
  private isGlobal;
  private featureIds;
  private m;
  private metrics;
  private isGatewayServiceRequired;
  private name;
  modelFromDictionary(data: any): HoldoutModel;
  getId(): number;
  getSegments(): Record<string, dynamic>;
  getPercentTraffic(): number;
  getIsGlobal(): boolean;
  getFeatureIds(): number[];
  getMetrics(): Array<MetricModel>;
  getIsGatewayServiceRequired(): boolean;
  setIsGatewayServiceRequired(isGatewayServiceRequired: boolean): void;
  getName(): string;
  setName(name: string): void;
}
