/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { Connector } from './Connector';

// TODO: move to file
// enum ConnectorEnum {
//   MEMORY = 'memory',
//   REDIS = 'redis'
// }

export class Storage {
  public connector: Connector | Record<any, any>; // RedisConnector |
  // public storageType: dynamic;

  constructor(connector: any) {
    if (connector?.prototype?.constructor?.toString()?.trim()?.substring(0, 5) === 'class') {
      this.connector = new connector();
    } else {
      this.connector = connector;
    }
  }

  public getConnector(): any {
    return this.connector;
  }
}
