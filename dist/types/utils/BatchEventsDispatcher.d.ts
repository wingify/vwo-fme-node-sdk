/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
import { dynamic } from '../types/Common';
export declare class BatchEventsDispatcher {
    static dispatch(payload: Record<string, any>, flushCallback: (error: Error | null, data: Record<string, any>) => void, queryParams: Record<string, dynamic>): Promise<Record<string, any>>;
    /**
     * Sends a POST request to the server.
     * @param properties - The properties of the request.
     * @param payload - The payload of the request.
     * @returns A promise that resolves to a void.
     */
    private static sendPostApiRequest;
    /**
     * Handles the response from batch events API call
     * @param properties - Request properties containing events
     * @param queryParams - Query parameters from the request
     * @param error - Error object if request failed
     * @param res - Response object from the API
     * @param rawData - Raw response data
     * @param callback - Callback function to handle the result
     */
    private static handleBatchResponse;
}
export default BatchEventsDispatcher;
