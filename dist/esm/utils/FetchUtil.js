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
import { HttpMethodEnum } from '../enums/HttpMethodEnum.js';
import { getFormattedErrorMessage } from './FunctionUtil.js';
import { buildMessage } from './LogMessageUtil.js';
import { DebugLogMessagesEnum, ErrorLogMessagesEnum } from '../enums/log-messages/index.js';
import { EventEnum } from '../enums/EventEnum.js';
import { ResponseModel } from '../packages/network-layer/models/ResponseModel.js';
// Cache the fetch function to avoid re-importing on every request
let cachedFetch = null;
let fetchPromise = null;
/**
 * Gets the fetch function to use, checking for global fetch first, then falling back to node-fetch.
 * @returns The fetch function to use
 */
async function getFetch(logManager) {
    // Return cached fetch if available
    if (cachedFetch) {
        return cachedFetch;
    }
    // If a fetch initialization is already in progress, wait for it
    if (fetchPromise) {
        return fetchPromise;
    }
    // Initialize fetch
    fetchPromise = (async () => {
        // Check if fetch is available globally (Node.js 18+, browsers, etc.)
        if (typeof fetch !== 'undefined') {
            logManager.debug(buildMessage(DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                api: 'Global fetch',
                process: typeof process === 'undefined' ? 'undefined' : 'defined',
            }));
            cachedFetch = fetch;
            return fetch;
        }
        // Fallback to node-fetch for older Node.js versions
        try {
            logManager.debug(buildMessage(DebugLogMessagesEnum.USING_API_WITH_PROCESS, {
                api: 'Node-fetch',
                process: typeof process === 'undefined' ? 'undefined' : 'defined',
            }));
            // Use dynamic import with a constructed string to prevent webpack from statically analyzing it
            // This ensures node-fetch is only loaded at runtime if needed
            const nodeFetchModule = 'node-' + 'fetch';
            const nodeFetch = await import(nodeFetchModule);
            const fetchFn = (nodeFetch.default || nodeFetch);
            cachedFetch = fetchFn;
            return fetchFn;
        }
        catch (error) {
            logManager.error(buildMessage(ErrorLogMessagesEnum.ERROR_INITIALIZING_FETCH, {
                error: getFormattedErrorMessage(error),
            }));
        }
    })();
    return fetchPromise;
}
export function sendGetCall(request, logManager) {
    return sendRequest(HttpMethodEnum.GET, request, logManager);
}
export function sendPostCall(request, logManager) {
    return sendRequest(HttpMethodEnum.POST, request, logManager);
}
/**
 * Sends a request to the server using the Fetch API.
 * @param method - The HTTP method to use for the request.
 * @param request - The request model.
 * @returns A Promise that resolves to the response data.
 */
async function sendRequest(method, request, logManager) {
    const responseModel = new ResponseModel();
    const networkOptions = request.getOptions();
    let url = `${networkOptions.scheme}://${networkOptions.hostname}${networkOptions.path}`;
    if (networkOptions.port) {
        url = `${networkOptions.scheme}://${networkOptions.hostname}:${networkOptions.port}${networkOptions.path}`;
    }
    let retryCount = 0;
    try {
        const fetchFn = await getFetch(logManager);
        const retryConfig = request.getRetryConfig();
        const shouldRetry = retryConfig.shouldRetry;
        const maxRetries = retryConfig.maxRetries;
        if (method === HttpMethodEnum.POST) {
            networkOptions.body = JSON.stringify(networkOptions.body);
        }
        const executeRequest = () => {
            return new Promise((resolve, reject) => {
                fetchFn(url, networkOptions)
                    .then((res) => {
                    // Some endpoints return empty strings as the response body; treat
                    // as raw text and handle potential JSON parsing errors below
                    return res.text().then((text) => {
                        responseModel.setStatusCode(res.status);
                        if (retryCount > 0) {
                            responseModel.setTotalAttempts(retryCount);
                            responseModel.setError(request.getLastError());
                        }
                        try {
                            if (method === HttpMethodEnum.GET) {
                                responseModel.setData(JSON.parse(text));
                            }
                            else {
                                responseModel.setData(text);
                            }
                        }
                        catch (err) {
                            responseModel.setError(getFormattedErrorMessage(err));
                            reject(responseModel);
                        }
                        if (res.status === 200) {
                            resolve(responseModel);
                        }
                        else if (res.status === 400) {
                            responseModel.setError(getFormattedErrorMessage(res.statusText));
                            responseModel.setTotalAttempts(retryCount);
                            reject(responseModel);
                        }
                        else {
                            handleError(`${res.statusText}, status: ${res.status}`, resolve, reject);
                        }
                    });
                })
                    .catch((err) => {
                    let errorMessage = getFormattedErrorMessage(err);
                    // incase of no internet connection, error will have cause property which is the error message
                    if (err && err.cause) {
                        errorMessage = `${errorMessage} ${err.cause}`;
                    }
                    handleError(errorMessage, resolve, reject);
                });
            });
        };
        const handleError = (error, resolve, reject) => {
            const endpoint = String(networkOptions.path || url).split('?')[0];
            if (shouldRetry && retryCount < maxRetries) {
                const delay = retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, retryCount) * 1000; // Exponential backoff
                retryCount++;
                logManager.errorLog('ATTEMPTING_RETRY_FOR_FAILED_NETWORK_CALL', {
                    endPoint: endpoint,
                    err: getFormattedErrorMessage(error),
                    delay: delay / 1000,
                    attempt: retryCount,
                    maxRetries: maxRetries,
                }, {}, false);
                request.setLastError(getFormattedErrorMessage(error));
                setTimeout(() => {
                    executeRequest().then(resolve).catch(reject);
                }, delay);
            }
            else {
                if (!String(networkOptions.path).includes(EventEnum.VWO_DEBUGGER_EVENT)) {
                    logManager.errorLog('NETWORK_CALL_FAILURE_AFTER_MAX_RETRIES', {
                        extraData: endpoint,
                        attempts: retryCount,
                        err: getFormattedErrorMessage(error),
                    }, {}, false);
                }
                responseModel.setError(getFormattedErrorMessage(error));
                responseModel.setTotalAttempts(retryCount);
                reject(responseModel);
            }
        };
        return executeRequest();
    }
    catch (err) {
        responseModel.setError(getFormattedErrorMessage(err));
        responseModel.setTotalAttempts(retryCount);
        throw responseModel;
    }
}
//# sourceMappingURL=FetchUtil.js.map