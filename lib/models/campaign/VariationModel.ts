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
import { dynamic } from '../../types/Common';
import { VariableModel } from './VariableModel';

export class VariationModel {
  private i: number;
  private id: number;
  private type: string;

  private n: string;
  private key: string;
  private name: string;
  private ruleKey: string;
  private salt: string;

  private w: number;
  private weight: number;

  private startRangeVariation: number;
  private endRangeVariation: number;
  private variables: Array<VariableModel> = [];
  private variations: Array<VariationModel> = [];

  private seg: Record<string, dynamic>;
  private segments: Record<string, dynamic>;

  modelFromDictionary(variation: VariationModel): this {
    this.id = variation.i || variation.id;
    this.key = variation.n || variation.key || variation.name;
    this.weight = variation.w || variation.weight;
    this.ruleKey = variation.ruleKey;
    this.salt = variation.salt;
    this.type = variation.type;
    this.setStartRange(variation.startRangeVariation);
    this.setEndRange(variation.endRangeVariation);
    if (variation.seg || variation.segments) {
      this.segments = variation.seg || variation.segments;
    }

    if (variation.variables) {
      if (variation.variables.constructor === {}.constructor) {
        this.variables = [];
      } else {
        const variableList: Array<VariableModel> = variation.variables;
        variableList.forEach((variable) => {
          this.variables.push(new VariableModel().modelFromDictionary(variable));
        });
      }
    }

    if (variation.variations) {
      if (variation.variations.constructor === {}.constructor) {
        this.variations = [];
      } else {
        const variationList: Array<VariationModel> = variation.variations;
        variationList.forEach((variation: any) => {
          this.variations.push(new VariationModel().modelFromDictionary(variation));
        });
      }
    }

    return this;
  }

  setStartRange(startRange: number): void {
    this.startRangeVariation = startRange;
  }

  setEndRange(endRange: number): void {
    this.endRangeVariation = endRange;
  }

  setWeight(weight: number): void {
    this.weight = weight;
  }

  getId(): number {
    return this.id;
  }

  getKey(): string {
    return this.key;
  }

  getRuleKey(): string {
    return this.ruleKey;
  }

  getWeight(): number {
    return this.weight;
  }

  getSegments(): Record<string, dynamic> {
    return this.segments;
  }

  getStartRangeVariation(): number {
    return this.startRangeVariation;
  }

  getEndRangeVariation(): number {
    return this.endRangeVariation;
  }

  getVariables(): Array<VariableModel> {
    return this.variables;
  }

  getVariations(): Array<VariationModel> {
    return this.variations;
  }

  getType(): string {
    return this.type;
  }

  getSalt(): string {
    return this.salt;
  }
}
