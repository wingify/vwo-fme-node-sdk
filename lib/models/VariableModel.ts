import { dynamic } from '../types/Common';

export class VariableModel {
  private val: dynamic;
  private value: dynamic;

  private type: string;

  private k: string;
  private key: string;

  private i: number;
  private id: number;

  modelFromDictionary(variable: VariableModel): this {
    this.value = variable.val || variable.value;
    this.type = variable.type;
    this.key = variable.k || variable.key;
    this.id = variable.i || variable.id;

    return this;
  }

  setValue(value: dynamic): void {
    this.value = value;
  }

  setKey(key: string): void {
    this.key = key;
  }

  setType(type: string): void {
    this.type = type;
  }

  getId(): number {
    return this.id;
  }

  getValue(): dynamic {
    return this.value;
  }

  getType(): string {
    return this.type;
  }

  getKey(): string {
    return this.key;
  }
}
