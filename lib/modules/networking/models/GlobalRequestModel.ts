import { dynamic } from '../../../types/Common';

export class GlobalRequestModel {
  private url: string;
  private timeout = 3000;
  private query: Record<string, dynamic>;
  private body: Record<string, dynamic>;
  private headers: Record<string, string>;
  private isDevelopmentMode: boolean;

  constructor(
    url: string,
    query: Record<string, dynamic>,
    body: Record<string, dynamic>,
    headers: Record<string, any>
  ) {
    this.url = url;
    this.query = query;
    this.body = body;
    this.headers = headers;
  }
  setQuery(query: Record<string, dynamic>): void {
    this.query = query;
  }

  getQuery(): Record<string, dynamic> {
    return this.query;
  }

  setBody(body: Record<string, dynamic>): void {
    this.body = body;
  }

  getBody(): Record<string, dynamic> {
    return this.body;
  }

  setBaseUrl(url: string): void {
    this.url = url;
  }

  getBaseUrl(): string {
    return this.url;
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  getTimeout(): number {
    return this.timeout;
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  getHeaders(): Record<string, string> {
    return this.headers;
  }

  setDevelopmentMode(isDevelopmentMode: boolean): void {
    this.isDevelopmentMode = isDevelopmentMode;
  }

  getDevelopmentMode(): boolean {
    return this.isDevelopmentMode;
  }
}
