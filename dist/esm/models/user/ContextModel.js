"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextModel = void 0;
const ContextVWOModel_1 = require("./ContextVWOModel");
class ContextModel {
    modelFromDictionary(context) {
        this.id = context.id;
        this.userAgent = context.userAgent;
        this.ipAddress = context.ipAddress;
        // if sdk is running in js environment and userAgent is not given then we use navigator.userAgent
        // Check if sdk running in browser and not in edge/serverless environment
        if (typeof process.env === 'undefined' && typeof XMLHttpRequest !== 'undefined' && !context.userAgent) {
            this.userAgent = navigator.userAgent;
        }
        if (context?.customVariables) {
            this.customVariables = context.customVariables;
        }
        if (context?.variationTargetingVariables) {
            this.variationTargetingVariables = context.variationTargetingVariables;
        }
        if (context?._vwo) {
            this._vwo = new ContextVWOModel_1.ContextVWOModel().modelFromDictionary(context._vwo);
        }
        return this;
    }
    getId() {
        return this.id?.toString();
    }
    getUserAgent() {
        return this.userAgent;
    }
    getIpAddress() {
        return this.ipAddress;
    }
    getCustomVariables() {
        return this.customVariables;
    }
    setCustomVariables(customVariables) {
        this.customVariables = customVariables;
    }
    getVariationTargetingVariables() {
        return this.variationTargetingVariables;
    }
    setVariationTargetingVariables(variationTargetingVariables) {
        this.variationTargetingVariables = variationTargetingVariables;
    }
    getVwo() {
        return this._vwo;
    }
    setVwo(_vwo) {
        this._vwo = _vwo;
    }
}
exports.ContextModel = ContextModel;
//# sourceMappingURL=ContextModel.js.map