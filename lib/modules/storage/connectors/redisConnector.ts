/* import * as redis from 'redis';
import { Connector } from '../connector';
import { dynamic } from '../../../types/common';

import { Deferred } from '../../../utils/PromiseUtil';
import { isString } from '../../../utils/DataTypeUtil';

// TODO: error handling

export class RedisConnector extends Connector implements RedisConnectorInterface {
  data: Record<string, dynamic>;
  isDataFlowing: boolean;
  config: Record<string, dynamic>;
  client: redis.RedisClient;

  constructor(config: Record<string, dynamic>) {
    super();
    this.connect(config);
  }

  _isOperational(): boolean {
    return this.isDataFlowing;
  }

  validate(config: Record<string, dynamic>): boolean {
    if (!(config.host && config.port)) {
      return false;
    }

    return true;
  }

  connect(config: Record<string, dynamic>): this {
    this.config = config;
    this.isDataFlowing = true;

    if (!this.validate(config)) {
      // TODO: logging
      console.error('Redis configuration is wrong');
    } else {
      if (config.alreadyCreatedClient) {
        this.client = config.alreadyCreatedClient;
      } else {
        this.client = redis.createClient(config);
      }

      this.client.on('error', error => {
        console.error(error);
      });
      this.client.on('connect', () => console.log('Redis Connected'));
      this.client.on('reconnecting', () => console.log('Redis reconnecting'));
      this.client.on('end', () => console.log('Redis end'));
    }

    return this;
  }

  set(key: string, value: dynamic): Promise<dynamic> {
    const deferredObject = new Deferred();

    if (this._isOperational()) {
      // TODO: if type is string, then ok, otherwise strinigfy
      if (!isString(value)) {
        value = JSON.stringify(value);
      }

      if (this.config.ttl) {
        this.client.set([key, value, 'EX', this.config.ttl], (err: dynamic, result: dynamic) => {
          if (result) {
            deferredObject.resolve(result);
          } else {
            deferredObject.reject(err);
          }
        });
      } else {
        this.client.set([key, value], (err: dynamic, result: dynamic) => {
          if (result) {
            deferredObject.resolve(result);
          } else {
            deferredObject.reject(err);
          }
        });
      }
    } else {
      deferredObject.reject('redis is not operational');
    }

    return deferredObject.promise;
  }

  update(key: string, value: dynamic): Promise<dynamic> {
    return this.set(key, value);
  }

  get(key: string): Promise<dynamic> {
    const deferredObject = new Deferred();

    this.client.get(key, (_err: dynamic, value: dynamic) => {
      let res: Record<string, dynamic>;
      if (value) {
        try {
          res = JSON.parse(value);
          deferredObject.resolve(res);
        } catch (e) {
          // TODO: log error
          console.error(e);
          deferredObject.reject(e);
        }
      } else {
        deferredObject.reject(_err);
      }
    });

    return deferredObject.promise;
  }

  getAll(): this {
    // TODO:
    return this;
  }
  getKeys(): Promise<string> {
    const deferredObject = new Deferred();

    this.client.keys(`${this.config.prefix}*`, (_e, d) => deferredObject.resolve(d));

    return deferredObject.promise;
  }
  has(key: string): Promise<boolean> {
    const deferredObject = new Deferred();

    this.client.exists(key, (_e, d) => deferredObject.resolve(!!d));

    return deferredObject.promise;
  }

  hasData(): Promise<boolean> {
    const deferredObject = new Deferred();

    this.client.keys(`${this.config.prefix}*`, (_e, d) => deferredObject.resolve(!!d.length));

    return deferredObject.promise;
  }

  remove(key: string): Promise<boolean> {
    const deferredObject = new Deferred();

    this.client.del(key, () => {
      deferredObject.resolve(true);
    });

    return deferredObject.promise;
  }

  clear(): Promise<void> {
    const deferredObject = new Deferred();
    const removePrefixFromKeyPattern = new RegExp(this.config.prefix, 'ig');

    this.client.keys(`${this.config.prefix}*`, (e, keys) => {
      this.client.multi(keys.map(k => ['del', k.replace(removePrefixFromKeyPattern, '')])).exec(() => {
        // console.log(d);
        deferredObject.resolve();
      });
    });

    return deferredObject.promise;
  }

  close(): this {
    this.isDataFlowing = false;

    return this;
  }
}

interface RedisConnectorInterface {
  data: Record<string, dynamic>;
  isDataFlowing: boolean;
  config: Record<string, dynamic>;
}
 */
