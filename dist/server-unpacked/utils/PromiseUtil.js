"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deferred = void 0;
/**
 * Creates a Deferred object with properties for promise, resolve, and reject.
 * This allows manual control over the resolution and rejection of a promise.
 * @returns {Deferred} The Deferred object with promise, resolve, and reject methods.
 */
function Deferred() {
    var _this = this;
    // Create a new Promise and attach resolve and reject methods to the Deferred object
    this.promise = new Promise(function (resolve, reject) {
        _this.resolve = resolve; // Method to resolve the promise
        _this.reject = reject; // Method to reject the promise
    });
    return this; // Return the Deferred object with attached methods
}
exports.Deferred = Deferred;
//# sourceMappingURL=PromiseUtil.js.map