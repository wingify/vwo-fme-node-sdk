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
import { dynamic } from '../../types/Common';

export abstract class Connector {
  // abstract connect(_config: Record<string, dynamic>): this;

  abstract set(_key: string, _data: dynamic): void | Promise<dynamic>;

  abstract get(_key: string): this | Promise<dynamic>;

  // abstract getAll(): Record<string, dynamic> | Promise<Array<Record<string, dynamic>>>;

  // abstract getKeys(): string[] | Promise<dynamic>;

  // abstract has(_key: string): boolean | Promise<dynamic>;

  // abstract hasData(): boolean | Promise<dynamic>;

  // abstract update(_key: string, _data: dynamic, ttl: number): Promise<dynamic>;

  // abstract remove(_key: string): this | Promise<dynamic>;

  // abstract clear(): this | Promise<dynamic>;

  // abstract close(): this; // TODO: stop
}
