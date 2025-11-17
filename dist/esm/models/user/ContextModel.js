"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextModel = void 0;
const ContextVWOModel_1 = require("./ContextVWOModel");
const UuidUtil_1 = require("../../utils/UuidUtil");
const SettingsService_1 = require("../../services/SettingsService");
const FunctionUtil_1 = require("../../utils/FunctionUtil");
class ContextModel {
    modelFromDictionary(context) {
        this.id = context.id;
        this.userAgent = context.userAgent;
        this.ipAddress = context.ipAddress;
        // if sdk is running in js environment and userAgent is not given then we use navigator.userAgent
        // Check if sdk running in browser and not in edge/serverless environment
        if (typeof process === 'undefined' && typeof XMLHttpRequest !== 'undefined' && !context.userAgent) {
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
        if (context?.postSegmentationVariables) {
            this.postSegmentationVariables = context.postSegmentationVariables;
        }
        this._vwo_uuid = (0, UuidUtil_1.getUUID)(this.id.toString(), SettingsService_1.SettingsService.Instance.accountId.toString());
        this._vwo_sessionId = (0, FunctionUtil_1.getCurrentUnixTimestamp)();
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
    getPostSegmentationVariables() {
        return this.postSegmentationVariables;
    }
    setPostSegmentationVariables(postSegmentationVariables) {
        this.postSegmentationVariables = postSegmentationVariables;
    }
    getUuid() {
        return this._vwo_uuid;
    }
    getSessionId() {
        return this._vwo_sessionId;
    }
}
exports.ContextModel = ContextModel;
//# sourceMappingURL=ContextModel.js.map