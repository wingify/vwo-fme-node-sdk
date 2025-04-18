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
export class MetricModel {
  private key: string;
  private identifier: string;

  private i: number;
  private id: number;

  private t: string;
  private type: string;

  modelFromDictionary(metric: MetricModel): this {
    this.identifier = metric.identifier || metric.key;
    this.id = metric.i || metric.id;
    this.type = metric.t || metric.type;
    return this;
  }

  getId(): number {
    return this.id;
  }

  getIdentifier(): string {
    return this.identifier;
  }

  getType(): string {
    return this.type;
  }
}
