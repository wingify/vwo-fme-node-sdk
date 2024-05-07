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
// import { MemoryConnector } from './connectors'; // RedisConnector
import { dynamic } from '../../types/Common';
// import { Connector } from './Connector';

// TODO: move to file
enum ConnectorEnum {
  MEMORY = 'memory',
  REDIS = 'redis'
}

export class Storage {
  public static instance: Storage;
  public connector: any; // RedisConnector |
  public storageType: dynamic;

  public attachConnector(connector: any): any {
    this.storageType = connector?.name;

    this.connector = new connector();
    // switch (connector.name) {
      // case ConnectorEnum.FILE:
      //   this.connector = new FileConnector(connector.config);
      //   break;
      // case ConnectorEnum.REDIS:
      //   this.connector = new RedisConnector(connector.config);
      //   break;
      // case ConnectorEnum.MEMORY:
      //   this.connector = new MemoryConnector(connector.config);
      //   break;
    // }

    return this.connector;
  }

  public static get Instance(): Storage {
    this.instance = this.instance || new Storage();

    return this.instance;
  }

  public get config(): Record<string, dynamic> {
    return this.connector.config;
  }

  public getConnector(): any { // RedisConnector |
    return this.connector;
  }
}
