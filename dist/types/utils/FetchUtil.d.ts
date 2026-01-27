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
import { LogManager } from '../packages/logger';
import { ResponseModel } from '../packages/network-layer/models/ResponseModel';
import { RequestModel } from '../packages/network-layer/models/RequestModel';
export declare function sendGetCall(request: RequestModel, logManager: LogManager): Promise<ResponseModel>;
export declare function sendPostCall(request: RequestModel, logManager: LogManager): Promise<ResponseModel>;
