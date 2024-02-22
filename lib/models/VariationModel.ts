import { dynamic } from '../types/common';
import { VariableModel } from './VariableModel';

export class VariationModel {
  private i: number;
  private id: number;

  private n: string;
  private key: string;
  private name: string;

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
}
