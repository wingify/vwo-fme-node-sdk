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
import { IVWOOptions } from '../models/VWOOptionsModel';
import { isFunction } from '../utils/DataTypeUtil';

export interface IHooksService {
  execute(properties: Record<string, any>): void;
  set(properties: Record<string, any>): void;
  get(): Record<string, any>;
}
class HooksService implements IHooksService {
  private callback: ((properties: Record<string, any>) => void) | undefined;
  private isCallBackFunction: boolean;
  private decision: Record<string, any>;

  constructor(options: IVWOOptions) {
    this.callback = options.integrations?.callback;
    this.isCallBackFunction = isFunction(this.callback);
    this.decision = {};
  }

  /**
   * Executes the callback
   * @param {Record<string, any>} properties Properties from the callback
   */
  execute(properties: Record<string, any>): void {
    if (this.isCallBackFunction) {
      this.callback(properties);
    }
  }

  /**
   * Sets properties to the decision object
   * @param {Record<string, any>} properties Properties to set
   */
  set(properties: Record<string, any>): void {
    if (this.isCallBackFunction) {
      this.decision = properties;
    }
  }

  /**
   * Retrieves the decision object
   * @returns {Record<string, any>} The decision object
   */
  get(): Record<string, any> {
    return this.decision;
  }
}

export default HooksService;
