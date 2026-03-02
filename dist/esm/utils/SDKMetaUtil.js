/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Constants } from '../constants/index.js';
/**
 * Singleton utility to manage SDK name and version.
 *
 * Usage:
 *   SDKMetaUtil.init(options); // typically during SDK init
 *   const sdkMetaUtil = SDKMetaUtil.getInstance();
 *   const name = sdkMetaUtil.getSdkName();
 *   const version = sdkMetaUtil.getVersion();
 */
export class SDKMetaUtil {
    constructor(options) {
        const sdkMeta = options?.sdkMeta;
        this.sdkName = sdkMeta?._vwo_sdkName ?? Constants.SDK_NAME;
        this.version = sdkMeta?._vwo_sdkVersion ?? Constants.SDK_VERSION;
        SDKMetaUtil.instance = this;
    }
    /**
     * Returns the singleton instance. If not initialized, it initializes it with default constants for sdkName and version.
     * @returns The singleton instance.
     */
    static getInstance() {
        if (!SDKMetaUtil.instance) {
            SDKMetaUtil.instance = new SDKMetaUtil(null);
        }
        return SDKMetaUtil.instance;
    }
    getSdkName() {
        return this.sdkName;
    }
    getVersion() {
        return this.version;
    }
    getMeta() {
        return {
            sdkName: this.sdkName,
            version: this.version,
        };
    }
}
SDKMetaUtil.instance = null;
//# sourceMappingURL=SDKMetaUtil.js.map