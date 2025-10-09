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
export declare class VariableModel<T = dynamic> {
    private val;
    private value;
    private type;
    private k;
    private key;
    private i;
    private id;
    constructor(id: number, type: string, key: string, value: T);
    static modelFromDictionary<T = unknown>(variable: VariableModel<T>): VariableModel<T>;
    setValue(value: T): void;
    setKey(key: string): void;
    setType(type: string): void;
    getId(): number;
    getValue(): dynamic;
    getType(): string;
    getKey(): string;
}
