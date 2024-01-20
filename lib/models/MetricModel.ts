import { dynamic } from '../types/common';

export class MetricModel {
  private key: string;
  private identifier: string;

  private i: number;
  private id: number;

  private t: string;
  private type: string;

  modelFromDictionary(metric: MetricModel): this {
    this.key = metric.identifier || metric.key;
    this.id = metric.i || metric.id;
    this.type = metric.t || metric.type;
    return this;
  }

  getId(): number {
    return this.id;
  }

  getKey(): string {
    return this.key;
  }

  getType(): string {
    return this.type;
  }
}
