import { dynamic } from '../../types/common';

export abstract class Connector {
  abstract connect(_config: Record<string, dynamic>): this;

  abstract set(_key: string, _data: dynamic, ttl: number): Promise<dynamic>;

  abstract get(_key: string): this | Promise<dynamic>;

  abstract getAll(): Record<string, dynamic> | Promise<Array<Record<string, dynamic>>>;

  abstract getKeys(): string[] | Promise<dynamic>;

  abstract has(_key: string): boolean | Promise<dynamic>;

  abstract hasData(): boolean | Promise<dynamic>;

  abstract update(_key: string, _data: dynamic, ttl: number): Promise<dynamic>;

  abstract remove(_key: string): this | Promise<dynamic>;

  abstract clear(): this | Promise<dynamic>;

  abstract close(): this; // TODO: stop
}
