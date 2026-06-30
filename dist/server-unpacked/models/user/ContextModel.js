"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextModel = void 0;
var ContextWingifyModel_1 = require("./ContextWingifyModel");
var UuidUtil_1 = require("../../utils/UuidUtil");
var FunctionUtil_1 = require("../../utils/FunctionUtil");
var ContextModel = /** @class */ (function () {
    function ContextModel() {
    }
    ContextModel.prototype.modelFromDictionary = function (context, options) {
        var _a, _b, _c, _d;
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
        if ((context === null || context === void 0 ? void 0 : context._wingify) || (context === null || context === void 0 ? void 0 : context._vwo)) {
            this._wingify = new ContextWingifyModel_1.ContextWingifyModel().modelFromDictionary(context._wingify || context._vwo);
        }
        if (context === null || context === void 0 ? void 0 : context.postSegmentationVariables) {
            this.postSegmentationVariables = context.postSegmentationVariables;
        }
        if (context === null || context === void 0 ? void 0 : context.bucketingSeed) {
            this.bucketingSeed = context.bucketingSeed;
        }
        if (context === null || context === void 0 ? void 0 : context.platformVariables) {
            this.platformVariables = __assign({}, context.platformVariables);
        }
        if (context === null || context === void 0 ? void 0 : context.isDevMode) {
            this.isDevMode = context.isDevMode === true;
        }
        // if uuid is provided in the context, use it, otherwise generate a new uuid
        this._wingify_uuid =
            (_a = context === null || context === void 0 ? void 0 : context.uuid) !== null && _a !== void 0 ? _a : (0, UuidUtil_1.getUUID)((_c = (_b = context === null || context === void 0 ? void 0 : context.id) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "".concat(options === null || options === void 0 ? void 0 : options.accountId, "_").concat(options === null || options === void 0 ? void 0 : options.sdkKey), (_d = options === null || options === void 0 ? void 0 : options.accountId) === null || _d === void 0 ? void 0 : _d.toString());
        // If sessionId is provided in the context, use it, otherwise generate a new one
        if (context === null || context === void 0 ? void 0 : context.sessionId) {
            this.sessionId = context.sessionId;
        }
        else {
            this.sessionId = (0, FunctionUtil_1.getCurrentUnixTimestamp)();
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
        return this._wingify;
    };
    ContextModel.prototype.setVwo = function (_wingify) {
        this._wingify = _wingify;
    };
    ContextModel.prototype.getPostSegmentationVariables = function () {
        return this.postSegmentationVariables;
    };
    ContextModel.prototype.setPostSegmentationVariables = function (postSegmentationVariables) {
        this.postSegmentationVariables = postSegmentationVariables;
    };
    ContextModel.prototype.getUuid = function () {
        return this._wingify_uuid;
    };
    ContextModel.prototype.getSessionId = function () {
        return this.sessionId;
    };
    ContextModel.prototype.getBucketingSeed = function () {
        var _a;
        return (_a = this.bucketingSeed) === null || _a === void 0 ? void 0 : _a.toString();
    };
    ContextModel.prototype.getPlatformVariables = function () {
        return this.platformVariables;
    };
    ContextModel.prototype.setPlatformVariables = function (platformVariables) {
        this.platformVariables = platformVariables;
    };
    ContextModel.prototype.getIsDevMode = function () {
        return this.isDevMode === true;
    };
    return ContextModel;
}());
exports.ContextModel = ContextModel;
//# sourceMappingURL=ContextModel.js.map