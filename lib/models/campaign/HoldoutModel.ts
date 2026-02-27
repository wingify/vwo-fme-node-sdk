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

export class HoldoutModel {
  private id: number;
  private segments?: Record<string, dynamic> = {};
  private percentTraffic: number;
  private isGlobal: boolean;
  private featureIds: number[] = [];
  private m: Array<MetricModel> = [];
  private metrics: Array<MetricModel> = [];
  private isGatewayServiceRequired: boolean = false;
  private name: string = '';

  modelFromDictionary(data: any): HoldoutModel {
    if (!data) {
      return this;
    }
    this.id = data.id;
    this.segments = data.segments || {};
    this.percentTraffic = data.percentTraffic || 0;
    this.isGlobal = !!data.isGlobal;
    this.featureIds = Array.isArray(data.featureIds) ? data.featureIds : [];
    this.name = data.name || '';
    if (data?.isGatewayServiceRequired) {
      this.isGatewayServiceRequired = data.isGatewayServiceRequired;
    }
    if ((data.m && data.m.constructor === {}.constructor) || data.metrics?.constructor === {}.constructor) {
      this.metrics = [];
    } else {
      const metricList: Array<MetricModel> = data.m || data.metrics;
      metricList?.forEach((metric) => {
        this.metrics.push(new MetricModel().modelFromDictionary(metric));
      });
    }

    return this;
  }

  getId(): number {
    return this.id;
  }

  getSegments(): Record<string, dynamic> {
    return this.segments || {};
  }

  getPercentTraffic(): number {
    return this.percentTraffic;
  }

  getIsGlobal(): boolean {
    return this.isGlobal;
  }

  getFeatureIds(): number[] {
    return this.featureIds;
  }

  getMetrics(): Array<MetricModel> {
    return this.metrics;
  }

  getIsGatewayServiceRequired(): boolean {
    return this.isGatewayServiceRequired;
  }

  setIsGatewayServiceRequired(isGatewayServiceRequired: boolean): void {
    this.isGatewayServiceRequired = isGatewayServiceRequired;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }
}
