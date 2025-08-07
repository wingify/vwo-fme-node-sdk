"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deferred = Deferred;
/**
 * Creates a Deferred object with properties for promise, resolve, and reject.
 * This allows manual control over the resolution and rejection of a promise.
 * @returns {Deferred} The Deferred object with promise, resolve, and reject methods.
 */
function Deferred() {
    // Create a new Promise and attach resolve and reject methods to the Deferred object
    this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve; // Method to resolve the promise
        this.reject = reject; // Method to reject the promise
    });
    return this; // Return the Deferred object with attached methods
}
//# sourceMappingURL=PromiseUtil.js.map