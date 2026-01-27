/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';

export interface NetworkClientInterface {
  /**
   * Sends a GET request to the server.
   * @param request - The RequestModel containing the URL and parameters for the GET request.
   * @returns A Promise that resolves to a ResponseModel containing the response data.
   */
  GET(request: RequestModel): Promise<ResponseModel>;

  /**
   * Sends a POST request to the server.
   * @param request - The RequestModel containing the URL, headers, and body of the POST request.
   * @returns A Promise that resolves to a ResponseModel containing the response data.
   */
  POST(request: RequestModel): Promise<ResponseModel>;
}
