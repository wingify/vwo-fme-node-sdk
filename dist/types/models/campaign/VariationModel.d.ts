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
export declare class VariationModel {
    private i;
    private id;
    private type;
    private n;
    private key;
    private name;
    private ruleKey;
    private salt;
    private w;
    private weight;
    private startRangeVariation;
    private endRangeVariation;
    private variables;
    private variations;
    private seg;
    private segments;
    modelFromDictionary(variation: VariationModel): this;
    setStartRange(startRange: number): void;
    setEndRange(endRange: number): void;
    setWeight(weight: number): void;
    getId(): number;
    getKey(): string;
    getRuleKey(): string;
    getWeight(): number;
    getSegments(): Record<string, dynamic>;
    getStartRangeVariation(): number;
    getEndRangeVariation(): number;
    getVariables(): Array<VariableModel | Record<string, any>>;
    getVariations(): Array<VariationModel | Record<string, any>>;
    getType(): string;
    getSalt(): string;
}
