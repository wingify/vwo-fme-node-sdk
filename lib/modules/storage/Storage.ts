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
