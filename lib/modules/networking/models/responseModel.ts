import { dynamic } from '../../../types/common';

export class ResponseModel {
  private statusCode: number;
  private error: dynamic;
  private headers: Record<string, string>;
  private data: dynamic;

  setStatusCode(statusCode: number): void {
    this.statusCode = statusCode;
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  setData(data: dynamic): void {
    this.data = data;
  }

  setError(error: dynamic): void {
    this.error = error;
  }

  getHeaders(): Record<string, string> {
    return this.headers;
  }

  getData(): dynamic {
    return this.data;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getError(): dynamic {
    return this.error;
  }
}
