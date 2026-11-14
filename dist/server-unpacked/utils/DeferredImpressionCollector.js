"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWithDeferredImpressionScope = runWithDeferredImpressionScope;
exports.collectDeferredImpression = collectDeferredImpression;
exports.takeDeferredImpressions = takeDeferredImpressions;
exports.hasDeferredImpressionScope = hasDeferredImpressionScope;
var DataTypeUtil_1 = require("./DataTypeUtil");
var deferredImpressionAsyncLocalStorage = null;
var fallbackScopeStack = [];
/**
 * Initializes AsyncLocalStorage on Node so parallel flag evaluations keep separate scopes.
 *
 * @returns {typeof deferredImpressionAsyncLocalStorage} AsyncLocalStorage wrapper when running on Node, otherwise null.
 */
function initDeferredImpressionAsyncLocalStorage() {
    var _a;
    // Browser bundles have no Node process. typeof is required because reading an undeclared process throws.
    if (typeof process === 'undefined' || !((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node)) {
        return null;
    }
    try {
        // Load async_hooks only on Node so the browser bundle does not depend on it.
        var AsyncLocalStorage = eval('require')('async_hooks').AsyncLocalStorage;
        var asyncLocalStorage_1 = new AsyncLocalStorage();
        return {
            run: function (scope, callback) { return asyncLocalStorage_1.run(scope, callback); },
            getStore: function () { return asyncLocalStorage_1.getStore(); },
        };
    }
    catch (_b) {
        // Runtimes without async_hooks keep using the fallback stack.
        return null;
    }
}
deferredImpressionAsyncLocalStorage = initDeferredImpressionAsyncLocalStorage();
/**
 * Returns the deferred-impression scope of the current evaluation.
 *
 * @returns {DeferredImpressionScope | undefined} Active scope from AsyncLocalStorage, or the top of the fallback stack.
 */
function getActiveDeferredImpressionScope() {
    var _a;
    // Prefer the Node scope. The stack is only used when AsyncLocalStorage is unavailable.
    return (_a = deferredImpressionAsyncLocalStorage === null || deferredImpressionAsyncLocalStorage === void 0 ? void 0 : deferredImpressionAsyncLocalStorage.getStore()) !== null && _a !== void 0 ? _a : fallbackScopeStack[fallbackScopeStack.length - 1];
}
/**
 * Checks whether a value is a promise or thenable.
 *
 * @param value - Value to check.
 * @returns {boolean} True when the value has a callable `then`.
 */
function isPromiseLike(value) {
    // Thenables must keep the scope alive until they settle. Plain return values do not.
    return !!value && (0, DataTypeUtil_1.isFunction)(value.then);
}
/**
 * Runs flag evaluation inside a deferred-impression collection scope.
 * Supports async callbacks (scope stays active until the promise settles).
 *
 * @param featureKey - Feature key being evaluated.
 * @param flagEvaluationCallback - Evaluation callback to run inside the scope.
 * @returns {T} The callback result.
 */
function runWithDeferredImpressionScope(featureKey, flagEvaluationCallback) {
    // Each evaluation gets its own bucket so parallel flags cannot mix payloads.
    var scope = { payloads: [], featureKey: featureKey };
    // On Node the scope follows the async call stack, including across awaits.
    if (deferredImpressionAsyncLocalStorage) {
        return deferredImpressionAsyncLocalStorage.run(scope, flagEvaluationCallback);
    }
    // Browser has no AsyncLocalStorage, so a stack stands in for the current evaluation.
    fallbackScopeStack.push(scope);
    try {
        var callbackResult = flagEvaluationCallback();
        // Leave the scope in place until the promise settles, or an await would lose it.
        if (isPromiseLike(callbackResult)) {
            return Promise.resolve(callbackResult).finally(function () {
                // Pop only this scope, so a nested evaluation that is still on top stays put.
                if (fallbackScopeStack[fallbackScopeStack.length - 1] === scope) {
                    fallbackScopeStack.pop();
                }
            });
        }
        fallbackScopeStack.pop();
        return callbackResult;
    }
    catch (error) {
        // A sync throw must not leave a stale scope for the next evaluation.
        fallbackScopeStack.pop();
        throw error;
    }
}
/**
 * Collects a variationShown payload when impressions are deferred (fetchFlags).
 *
 * @param payload - Impression payload to hold in the active scope.
 * @returns {void}
 */
function collectDeferredImpression(payload) {
    // Empty payloads are ignored so exposeResult does not try to send them later.
    if (!payload) {
        return;
    }
    var scope = getActiveDeferredImpressionScope();
    // Outside a deferred evaluation there is nowhere to hold the payload.
    if (scope) {
        scope.payloads.push(payload);
    }
}
/**
 * Returns (and clears) payloads collected in the active evaluation scope.
 *
 * @returns {any[]} Collected payloads, or an empty array when no scope is active.
 */
function takeDeferredImpressions() {
    var scope = getActiveDeferredImpressionScope();
    // No active evaluation means nothing was collected for exposeResult.
    if (!scope) {
        return [];
    }
    // Copy first so the caller still has the payloads after the scope is cleared.
    var payloads = scope.payloads.slice();
    // Clear in place so a second read in the same evaluation cannot duplicate them.
    scope.payloads.length = 0;
    return payloads;
}
/**
 * Returns whether an active deferred-impression scope exists.
 *
 * @returns {boolean} True when called during a flag evaluation.
 */
function hasDeferredImpressionScope() {
    return !!getActiveDeferredImpressionScope();
}
//# sourceMappingURL=DeferredImpressionCollector.js.map