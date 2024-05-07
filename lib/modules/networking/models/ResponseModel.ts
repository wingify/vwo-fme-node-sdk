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
import { dynamic } from '../../../types/Common';

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
