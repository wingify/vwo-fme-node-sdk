"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataTypeUtil_1 = require("../utils/DataTypeUtil");
class HooksService {
    constructor(options) {
        this.callback = options.integrations?.callback;
        this.isCallBackFunction = (0, DataTypeUtil_1.isFunction)(this.callback);
        this.decision = {};
    }
    /**
     * Executes the callback
     * @param {Record<string, any>} properties Properties from the callback
     */
    execute(properties) {
        if (this.isCallBackFunction) {
            this.callback(properties);
        }
    }
    /**
     * Sets properties to the decision object
     * @param {Record<string, any>} properties Properties to set
     */
    set(properties) {
        if (this.isCallBackFunction) {
            this.decision = properties;
        }
    }
    /**
     * Retrieves the decision object
     * @returns {Record<string, any>} The decision object
     */
    get() {
        return this.decision;
    }
}
exports.default = HooksService;
//# sourceMappingURL=HooksService.js.map