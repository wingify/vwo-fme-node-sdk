"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataTypeUtil_1 = require("../utils/DataTypeUtil");
var GetFlagsBatchContext_1 = require("./GetFlagsBatchContext");
var HooksService = /** @class */ (function () {
    function HooksService(options) {
        var _a;
        this.callback = (_a = options.integrations) === null || _a === void 0 ? void 0 : _a.callback;
        this.isCallBackFunction = (0, DataTypeUtil_1.isFunction)(this.callback);
        this.decision = {};
    }
    /**
     * Executes the callback
     * @param {Record<string, any>} properties Properties from the callback
     */
    HooksService.prototype.execute = function (properties) {
        if (this.isCallBackFunction) {
            this.callback(properties);
        }
    };
    /**
     * Sets properties to the decision object
     * @param {Record<string, any>} properties Properties to set
     */
    HooksService.prototype.set = function (properties) {
        if (!this.isCallBackFunction) {
            return;
        }
        var activeGetFlagsBatchContext = (0, GetFlagsBatchContext_1.getCurrentGetFlagsBatchContext)();
        if (activeGetFlagsBatchContext) {
            // Route integrations payload to the active getFlags batch worker.
            activeGetFlagsBatchContext.hooksDecision = properties;
            return;
        }
        // Default shared decision for single getFlag calls.
        this.decision = properties;
    };
    /**
     * Retrieves the decision object
     * @returns {Record<string, any>} The decision object
     */
    HooksService.prototype.get = function () {
        var _a;
        var activeGetFlagsBatchContext = (0, GetFlagsBatchContext_1.getCurrentGetFlagsBatchContext)();
        if (activeGetFlagsBatchContext) {
            // Read batch-scoped decision while getFlags is evaluating.
            return (_a = activeGetFlagsBatchContext.hooksDecision) !== null && _a !== void 0 ? _a : {};
        }
        return this.decision;
    };
    return HooksService;
}());
exports.default = HooksService;
//# sourceMappingURL=HooksService.js.map