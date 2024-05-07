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
