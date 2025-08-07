"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGetCall = sendGetCall;
exports.sendPostCall = sendPostCall;
const HttpMethodEnum_1 = require("../enums/HttpMethodEnum");
const FunctionUtil_1 = require("./FunctionUtil");
function sendGetCall(networkOptions) {
    return sendRequest(HttpMethodEnum_1.HttpMethodEnum.GET, networkOptions);
}
function sendPostCall(networkOptions) {
    return sendRequest(HttpMethodEnum_1.HttpMethodEnum.POST, networkOptions);
}
/**
 * Sends a request to the server using the Fetch API.
 * @param method - The HTTP method to use for the request.
 * @param networkOptions - The options for the request.
 * @returns A Promise that resolves to the response data.
 */
function sendRequest(method, networkOptions) {
    const url = `${networkOptions.scheme}://${networkOptions.hostname}${networkOptions.path}`;
    return new Promise((resolve, reject) => {
        if (method === HttpMethodEnum_1.HttpMethodEnum.POST) {
            networkOptions.body = JSON.stringify(networkOptions.body);
        }
        fetch(url, networkOptions)
            .then((res) => {
            // Some endpoints return empty strings as the response body; treat
            // as raw text and handle potential JSON parsing errors below
            return res.text().then((text) => {
                let jsonData = {};
                try {
                    if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
                        jsonData = JSON.parse(text);
                    }
                    else {
                        jsonData = text;
                    }
                }
                catch (err) {
                    console.info(`VWO-SDK - [INFO]: ${(0, FunctionUtil_1.getCurrentTime)()} VWO didn't send JSON response which is expected: ${err}`);
                }
                if (res.status === 200) {
                    resolve(jsonData);
                }
                else {
                    let errorMessage = '';
                    if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
                        errorMessage = `VWO-SDK - [ERROR]: ${(0, FunctionUtil_1.getCurrentTime)()} Request failed for fetching account settings. Got Status Code: ${res.status}`;
                    }
                    else if (method === HttpMethodEnum_1.HttpMethodEnum.POST) {
                        errorMessage = `VWO-SDK - [ERROR]: ${(0, FunctionUtil_1.getCurrentTime)()} Request failed while making a POST request. Got Status Code: ${res.status}`;
                    }
                    console.error(errorMessage);
                    reject(errorMessage);
                }
            });
        })
            .catch((err) => {
            let errorMessage = '';
            if (method === HttpMethodEnum_1.HttpMethodEnum.GET) {
                errorMessage = `VWO-SDK - [ERROR]: ${(0, FunctionUtil_1.getCurrentTime)()} GET request failed for fetching account settings. Error: ${err}`;
            }
            else if (method === HttpMethodEnum_1.HttpMethodEnum.POST) {
                errorMessage = `VWO-SDK - [ERROR]: ${(0, FunctionUtil_1.getCurrentTime)()} POST request failed while sending data. Error: ${err}`;
            }
            console.error(errorMessage);
            reject(errorMessage);
        });
    });
}
//# sourceMappingURL=FetchUtil.js.map