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
export class RuleModel {
  private status: boolean;
  private variationId: number;
  private campaignId: number;
  private type: string;

  modelFromDictionary(rule: RuleModel): this {
    this.type = rule.type;
    this.status = rule.status;
    this.variationId = rule.variationId;
    this.campaignId = rule.campaignId;
    return this;
  }

  getCampaignId(): number {
    return this.campaignId;
  }

  getVariationId(): number {
    return this.variationId;
  }

  getStatus(): boolean {
    return this.status;
  }

  getType(): string {
    return this.type;
  }
}
