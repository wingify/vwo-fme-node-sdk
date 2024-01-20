import { dynamic } from '../../../types/common';

const HTTP = 'http';

export class RequestModel {
  private url: string;
  private scheme: string;
  private port: number;
  private path: string;
  private query: Record<string, dynamic>;
  private timeout: number;
  private body: Record<string, dynamic>;
  private headers: Record<string, string>;

  constructor(
    url: string,
    path: string,
    query: Record<string, dynamic>,
    body: Record<string, dynamic>,
    headers: Record<string, string>,
    scheme: string = HTTP
  ) {
    this.url = url;
    this.path = path;
    this.query = query;
    this.body = body;
    this.headers = headers;
    this.scheme = scheme;
    this.port = 3000; // TODO: remove
  }

  getBody(): Record<string, dynamic> {
    return this.body;
  }

  setBody(body: Record<string, dynamic>): void {
    this.body = body;
  }

  setQuery(query: Record<string, dynamic>): void {
    this.query = query;
  }

  getQuery(): Record<string, dynamic> {
    return this.query;
  }

  setHeaders(headers: Record<string, string>): this {
    this.headers = headers;
    return this;
  }

  getHeaders(): Record<string, string> {
    return this.headers;
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  getTimeout(): number {
    return this.timeout;
  }

  getUrl(): string {
    return this.url;
  }

  setUrl(host: string): this {
    this.url = host;
    return this;
  }

  getScheme(): string {
    return this.scheme;
  }

  setScheme(scheme: string): this {
    this.scheme = scheme;
    return this;
  }

  getPort(): number {
    return this.port;
  }

  setPort(port: number): this {
    this.port = port;
    return this;
  }

  getPath(): string {
    return this.path;
  }

  setPath(path: string): this {
    this.path = path;
    return this;
  }

  getOptions(): Record<string, any> {
    let queryParams = '';
    for (const key in this.query) {
      const queryString = `${key}=${this.query[key]}&`;
      queryParams += queryString;
    }
    const options: Record<string, any> = {
      hostname: this.url,
      agent: false
    };

    if (this.scheme) {
      options.scheme = this.scheme;
    }
    if (this.port) {
      options.port = this.port;
    }
    if (this.headers) {
      options.headers = this.headers;
    }
    if (this.path) {
      if (queryParams !== '') {
        options.path = this.path + '?' + queryParams || '';
      } else {
        options.path = this.path;
      }
    }
    if (this.timeout) {
      options.timeout = this.timeout;
    }
    if (options.path.charAt(options.path.length - 1) === '&') {
      options.path = options.path.substring(0, options.path.length - 1);
    }

    return options;
  }
}
