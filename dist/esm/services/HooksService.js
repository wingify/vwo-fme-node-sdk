import { isFunction } from '../utils/DataTypeUtil.js';
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
export default HooksService;
//# sourceMappingURL=HooksService.js.map