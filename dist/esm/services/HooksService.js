import { isFunction } from '../utils/DataTypeUtil.js';
import { getCurrentGetFlagsBatchContext } from './GetFlagsBatchContext.js';
class HooksService {
    constructor(options) {
        this.callback = options.integrations?.callback;
        this.isCallBackFunction = isFunction(this.callback);
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
        if (!this.isCallBackFunction) {
            return;
        }
        const activeGetFlagsBatchContext = getCurrentGetFlagsBatchContext();
        if (activeGetFlagsBatchContext) {
            // Route integrations payload to the active getFlags batch worker.
            activeGetFlagsBatchContext.hooksDecision = properties;
            return;
        }
        // Default shared decision for single getFlag calls.
        this.decision = properties;
    }
    /**
     * Retrieves the decision object
     * @returns {Record<string, any>} The decision object
     */
    get() {
        const activeGetFlagsBatchContext = getCurrentGetFlagsBatchContext();
        if (activeGetFlagsBatchContext) {
            // Read batch-scoped decision while getFlags is evaluating.
            return activeGetFlagsBatchContext.hooksDecision ?? {};
        }
        return this.decision;
    }
}
export default HooksService;
//# sourceMappingURL=HooksService.js.map