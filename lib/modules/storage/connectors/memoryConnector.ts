import { Connector } from '../connector';
import { Deferred } from '../../../utils/PromiseUtil';
import { dynamic } from '../../../types/common';

export class MemoryConnector extends Connector implements MemoryConnectorInterface {
  data: Map<string, dynamic>;
  isDataFlowing: boolean;
  config: Record<string, dynamic>;

  constructor(config: Record<string, dynamic> = {}) {
    super();
    this.connect(config);
  }
  _isOperational(): boolean {
    return this.isDataFlowing;
  }
  connect(config: Record<string, dynamic>): this {
    this.config = config;
    this.data = new Map<string, dynamic>();
    this.isDataFlowing = true;

    return this;
  }
  set(key: string, value: dynamic): Promise<this> {
    const deferredObject = new Deferred();

    if (this._isOperational()) {
      this.data.set(key, value);
      deferredObject.resolve(this);
    }

    return deferredObject.promise;
  }

  update(key: string, value: dynamic): Promise<this> {
    return this.set(key, value);
  }

  get(key: string): Promise<dynamic> {
    const deferredObject = new Deferred();
    this.has(key).then((keyExists: boolean) => {
      if (keyExists) {
        deferredObject.resolve(this.data.get(key));
      } else {
        deferredObject.reject(null);
      }
    });

    return deferredObject.promise;
  }

  getAll(): Promise<Array<Record<string, dynamic>>> {
    const deferredObject = new Deferred();
    const allData = {};

    for (const item in this.data) {
      allData[item[0]] = item[1];
    }

    deferredObject.resolve(allData);

    return deferredObject.promise;
  }

  getKeys(): Array<string> {
    return Object.keys(this.data);
  }

  has(key: string): Promise<boolean> {
    const deferredObject = new Deferred();

    deferredObject.resolve(this.data.has(key));

    return deferredObject.promise;
  }

  hasData(): boolean {
    const deferredObject = new Deferred();

    deferredObject.resolve(!!this.data.size);

    return deferredObject.promise;
  }

  remove(key: string): Promise<this> {
    const deferredObject = new Deferred();

    this.data.delete(key);
    deferredObject.resolve(this);

    return deferredObject.promise;
  }

  clear(): Promise<this> {
    const deferredObject = new Deferred();

    this.data.clear();

    deferredObject.resolve(this);

    return deferredObject.promise;
  }

  close(): this {
    this.isDataFlowing = false;

    return this;
  }
}

interface MemoryConnectorInterface {
  data: Map<string, dynamic>;
  isDataFlowing: boolean;
  config: Record<string, dynamic>;
}
