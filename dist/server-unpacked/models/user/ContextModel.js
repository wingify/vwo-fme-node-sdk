"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextModel = void 0;
var ContextVWOModel_1 = require("./ContextVWOModel");
var ContextModel = /** @class */ (function () {
    function ContextModel() {
    }
    ContextModel.prototype.modelFromDictionary = function (context) {
        this.id = context.id;
        this.userAgent = context.userAgent;
        this.ipAddress = context.ipAddress;
        // if sdk is running in js environment and userAgent is not given then we use navigator.userAgent
        // Check if sdk running in browser and not in edge/serverless environment
        if (typeof process === 'undefined' && typeof XMLHttpRequest !== 'undefined' && !context.userAgent) {
            this.userAgent = navigator.userAgent;
        }
        if (context === null || context === void 0 ? void 0 : context.customVariables) {
            this.customVariables = context.customVariables;
        }
        if (context === null || context === void 0 ? void 0 : context.variationTargetingVariables) {
            this.variationTargetingVariables = context.variationTargetingVariables;
        }
        if (context === null || context === void 0 ? void 0 : context._vwo) {
            this._vwo = new ContextVWOModel_1.ContextVWOModel().modelFromDictionary(context._vwo);
        }
        if (context === null || context === void 0 ? void 0 : context.postSegmentationVariables) {
            this.postSegmentationVariables = context.postSegmentationVariables;
        }
        return this;
    };
    ContextModel.prototype.getId = function () {
        var _a;
        return (_a = this.id) === null || _a === void 0 ? void 0 : _a.toString();
    };
    ContextModel.prototype.getUserAgent = function () {
        return this.userAgent;
    };
    ContextModel.prototype.getIpAddress = function () {
        return this.ipAddress;
    };
    ContextModel.prototype.getCustomVariables = function () {
        return this.customVariables;
    };
    ContextModel.prototype.setCustomVariables = function (customVariables) {
        this.customVariables = customVariables;
    };
    ContextModel.prototype.getVariationTargetingVariables = function () {
        return this.variationTargetingVariables;
    };
    ContextModel.prototype.setVariationTargetingVariables = function (variationTargetingVariables) {
        this.variationTargetingVariables = variationTargetingVariables;
    };
    ContextModel.prototype.getVwo = function () {
        return this._vwo;
    };
    ContextModel.prototype.setVwo = function (_vwo) {
        this._vwo = _vwo;
    };
    ContextModel.prototype.getPostSegmentationVariables = function () {
        return this.postSegmentationVariables;
    };
    ContextModel.prototype.setPostSegmentationVariables = function (postSegmentationVariables) {
        this.postSegmentationVariables = postSegmentationVariables;
    };
    return ContextModel;
}());
exports.ContextModel = ContextModel;
//# sourceMappingURL=ContextModel.js.map