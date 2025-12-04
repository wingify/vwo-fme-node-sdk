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
import { sendGetCall, sendPostCall } from '../../../utils/FetchUtil.js';
import { Deferred } from '../../../utils/PromiseUtil.js';
/**
 * Implements the NetworkClientInterface to handle network requests.
 */
export class NetworkServerLessClient {
    /**
     * Performs a GET request using the provided RequestModel.
     * @param {RequestModel} requestModel - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves to a ResponseModel.
     */
    GET(requestModel) {
        const deferred = new Deferred();
        sendGetCall(requestModel)
            .then((data) => {
            deferred.resolve(data);
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    /**
     * Performs a POST request using the provided RequestModel.
     * @param {RequestModel} request - The model containing request options.
     * @returns {Promise<ResponseModel>} A promise that resolves or rejects with a ResponseModel.
     */
    POST(request) {
        const deferred = new Deferred();
        sendPostCall(request)
            .then((data) => {
            deferred.resolve(data);
        })
            .catch((error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }
}
//# sourceMappingURL=NetworkServerLessClient.js.map