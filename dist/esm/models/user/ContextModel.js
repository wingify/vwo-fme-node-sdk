import { ContextWingifyModel } from './ContextWingifyModel.js';
import { getUUID } from '../../utils/UuidUtil.js';
import { getCurrentUnixTimestamp } from '../../utils/FunctionUtil.js';
export class ContextModel {
    modelFromDictionary(context, options) {
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
        if (context?._wingify || context?._vwo) {
            this._wingify = new ContextWingifyModel().modelFromDictionary(context._wingify || context._vwo);
        }
        if (context?.postSegmentationVariables) {
            this.postSegmentationVariables = context.postSegmentationVariables;
        }
        if (context?.bucketingSeed) {
            this.bucketingSeed = context.bucketingSeed;
        }
        if (context?.platformVariables) {
            this.platformVariables = { ...context.platformVariables };
        }
        if (context?.isDevMode) {
            this.isDevMode = context.isDevMode === true;
        }
        // Only an explicit false is stored. A missing field stays treated as consented.
        if (context?.hasConsented === false) {
            this.hasConsented = false;
        }
        // if uuid is provided in the context, use it, otherwise generate a new uuid
        this._wingify_uuid =
            context?.uuid ??
                getUUID(context?.id?.toString() ?? `${options?.accountId}_${options?.sdkKey}`, options?.accountId?.toString());
        // If sessionId is provided in the context, use it, otherwise generate a new one
        if (context?.sessionId) {
            this.sessionId = context.sessionId;
        }
        else {
            this.sessionId = getCurrentUnixTimestamp();
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
        return this._wingify;
    }
    setVwo(_wingify) {
        this._wingify = _wingify;
    }
    getPostSegmentationVariables() {
        return this.postSegmentationVariables;
    }
    setPostSegmentationVariables(postSegmentationVariables) {
        this.postSegmentationVariables = postSegmentationVariables;
    }
    getUuid() {
        return this._wingify_uuid;
    }
    getSessionId() {
        return this.sessionId;
    }
    getBucketingSeed() {
        return this.bucketingSeed?.toString();
    }
    getPlatformVariables() {
        return this.platformVariables;
    }
    setPlatformVariables(platformVariables) {
        this.platformVariables = platformVariables;
    }
    getIsDevMode() {
        return this.isDevMode === true;
    }
    /**
     * Whether the user has consented to data being sent to Wingify servers (true by default).
     *
     * @returns {boolean} False only when consent was explicitly denied.
     */
    getHasConsented() {
        // Undefined means the caller omitted consent, which is treated as allowed.
        return this.hasConsented !== false;
    }
}
//# sourceMappingURL=ContextModel.js.map