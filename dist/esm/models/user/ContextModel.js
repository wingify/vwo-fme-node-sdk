import { ContextVWOModel } from './ContextVWOModel.js';
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
        if (context?._vwo) {
            this._vwo = new ContextVWOModel().modelFromDictionary(context._vwo);
        }
        if (context?.postSegmentationVariables) {
            this.postSegmentationVariables = context.postSegmentationVariables;
        }
        // if uuid is provided in the context, use it, otherwise generate a new uuid
        this._vwo_uuid =
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
        return this.sessionId;
    }
}
//# sourceMappingURL=ContextModel.js.map