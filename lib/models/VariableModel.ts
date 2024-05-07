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
