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
import { RequestModel } from '../packages/network-layer/index.js';
import { HttpMethodEnum } from '../enums/HttpMethodEnum.js';
import { UrlEnum } from '../enums/UrlEnum.js';
import { buildMessage } from '../utils/LogMessageUtil.js';
import { InfoLogMessagesEnum } from '../enums/log-messages/index.js';
import { isString } from '../utils/DataTypeUtil.js';
import { Deferred } from './PromiseUtil.js';
import { getFormattedErrorMessage } from './FunctionUtil.js';
import { Constants } from '../constants/index.js';
import { sendDebugEventToVWO } from './DebuggerServiceUtil.js';
import { createNetWorkAndRetryDebugEvent } from './NetworkUtil.js';
import { EventEnum } from '../enums/EventEnum.js';
export class BatchEventsDispatcher {
    static async dispatch(serviceContainer, payload, flushCallback, queryParams) {
        return await this.sendPostApiRequest(serviceContainer, queryParams, payload, flushCallback);
    }
    /**
     * Sends a POST request to the server.
     * @param properties - The properties of the request.
     * @param payload - The payload of the request.
     * @returns A promise that resolves to a void.
     */
    static async sendPostApiRequest(serviceContainer, properties, payload, flushCallback) {
        const deferred = new Deferred();
        const retryConfig = serviceContainer.getNetworkManager().getRetryConfig();
        const headers = {};
        headers['Authorization'] = serviceContainer.getSettingsService().sdkKey;
        const request = new RequestModel(serviceContainer.getSettingsService().hostname, HttpMethodEnum.POST, serviceContainer.getUpdatedEndpointWithCollectionPrefix(UrlEnum.BATCH_EVENTS), properties, payload, headers, serviceContainer.getSettingsService().protocol, serviceContainer.getSettingsService().port, retryConfig);
        const { variationShownCount, setAttributeCount, customEventCount } = this.extractEventCounts(payload);
        let extraData = `${Constants.BATCH_EVENTS} having `;
        if (variationShownCount > 0) {
            extraData += `getFlag events: ${variationShownCount}, `;
        }
        if (customEventCount > 0) {
            extraData += `conversion events: ${customEventCount}, `;
        }
        if (setAttributeCount > 0) {
            extraData += `setAttribute events: ${setAttributeCount}, `;
        }
        try {
            serviceContainer
                .getNetworkManager()
                .post(request)
                .then((response) => {
                if (response.getTotalAttempts() > 0) {
                    const debugEventProps = createNetWorkAndRetryDebugEvent(response, '', Constants.BATCH_EVENTS, extraData);
                    // send debug event
                    sendDebugEventToVWO(serviceContainer, debugEventProps);
                }
                const batchApiResult = this.handleBatchResponse(serviceContainer.getLogManager(), UrlEnum.BATCH_EVENTS, payload, properties, null, response, flushCallback);
                deferred.resolve(batchApiResult);
            })
                .catch((err) => {
                const debugEventProps = createNetWorkAndRetryDebugEvent(err, '', Constants.BATCH_EVENTS, extraData);
                // send debug event
                sendDebugEventToVWO(serviceContainer, debugEventProps);
                const batchApiResult = this.handleBatchResponse(serviceContainer.getLogManager(), UrlEnum.BATCH_EVENTS, payload, properties, null, err, flushCallback);
                deferred.resolve(batchApiResult);
            });
            return deferred.promise;
        }
        catch (error) {
            serviceContainer.getLogManager().errorLog('EXECUTION_FAILED', {
                apiName: Constants.BATCH_EVENTS,
                err: getFormattedErrorMessage(error),
            }, { an: Constants.BATCH_EVENTS });
            deferred.resolve({ status: 'error', events: payload });
            return deferred.promise;
        }
    }
    /**
     * Handles the response from batch events API call
     * @param properties - Request properties containing events
     * @param queryParams - Query parameters from the request
     * @param error - Error object if request failed
     * @param res - Response object from the API
     * @param rawData - Raw response data
     * @param callback - Callback function to handle the result
     */
    static handleBatchResponse(logManager, endPoint, payload, queryParams, err, res, callback) {
        const eventsPerRequest = payload.ev.length;
        const accountId = queryParams.a;
        let error = err ? err : res?.getError();
        if (error && !(error instanceof Error)) {
            if (isString(error)) {
                error = new Error(error);
            }
            else if (error instanceof Object) {
                error = new Error(JSON.stringify(error));
            }
        }
        if (error) {
            logManager.info(buildMessage(InfoLogMessagesEnum.IMPRESSION_BATCH_FAILED));
            logManager.errorLog('NETWORK_CALL_FAILED', {
                method: HttpMethodEnum.POST,
                err: error.message,
            }, {}, false);
            callback(error, payload);
            return { status: 'error', events: payload };
        }
        const statusCode = res?.getStatusCode();
        if (statusCode === 200) {
            logManager.info(buildMessage(InfoLogMessagesEnum.IMPRESSION_BATCH_SUCCESS, {
                accountId,
                endPoint,
            }));
            callback(null, payload);
            return { status: 'success', events: payload };
        }
        if (statusCode === 413) {
            logManager.errorLog('CONFIG_BATCH_EVENT_LIMIT_EXCEEDED', {
                accountId,
                endPoint,
                eventsPerRequest,
            }, {}, false);
            logManager.errorLog('NETWORK_CALL_FAILED', {
                method: HttpMethodEnum.POST,
                err: error.message,
            }, {}, false);
            callback(error, payload);
            return { status: 'error', events: payload };
        }
        logManager.errorLog('IMPRESSION_BATCH_FAILED', {}, {}, false);
        logManager.errorLog('NETWORK_CALL_FAILED', {
            method: HttpMethodEnum.POST,
            err: error.message,
        }, {}, false);
        callback(error, payload);
        return { status: 'error', events: payload };
    }
    static extractEventCounts(payload) {
        const counts = { variationShownCount: 0, setAttributeCount: 0, customEventCount: 0 };
        const standardEventNames = new Set(Object.values(EventEnum));
        const events = payload?.ev ?? [];
        for (const entry of events) {
            const name = entry?.d?.event?.name;
            if (!name) {
                continue;
            }
            if (name === EventEnum.VWO_VARIATION_SHOWN) {
                counts.variationShownCount += 1;
                continue;
            }
            if (name === EventEnum.VWO_SYNC_VISITOR_PROP) {
                counts.setAttributeCount += 1;
                continue;
            }
            if (!standardEventNames.has(name)) {
                counts.customEventCount += 1;
            }
        }
        return counts;
    }
}
export default BatchEventsDispatcher;
//# sourceMappingURL=BatchEventsDispatcher.js.map