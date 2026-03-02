"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDKMetaUtil = void 0;
var constants_1 = require("../constants");
/**
 * Singleton utility to manage SDK name and version.
 *
 * Usage:
 *   SDKMetaUtil.init(options); // typically during SDK init
 *   const sdkMetaUtil = SDKMetaUtil.getInstance();
 *   const name = sdkMetaUtil.getSdkName();
 *   const version = sdkMetaUtil.getVersion();
 */
var SDKMetaUtil = /** @class */ (function () {
    function SDKMetaUtil(options) {
        var _a, _b;
        var sdkMeta = options === null || options === void 0 ? void 0 : options.sdkMeta;
        this.sdkName = (_a = sdkMeta === null || sdkMeta === void 0 ? void 0 : sdkMeta._vwo_sdkName) !== null && _a !== void 0 ? _a : constants_1.Constants.SDK_NAME;
        this.version = (_b = sdkMeta === null || sdkMeta === void 0 ? void 0 : sdkMeta._vwo_sdkVersion) !== null && _b !== void 0 ? _b : constants_1.Constants.SDK_VERSION;
        SDKMetaUtil.instance = this;
    }
    /**
     * Returns the singleton instance. If not initialized, it initializes it with default constants for sdkName and version.
     * @returns The singleton instance.
     */
    SDKMetaUtil.getInstance = function () {
        if (!SDKMetaUtil.instance) {
            SDKMetaUtil.instance = new SDKMetaUtil(null);
        }
        return SDKMetaUtil.instance;
    };
    SDKMetaUtil.prototype.getSdkName = function () {
        return this.sdkName;
    };
    SDKMetaUtil.prototype.getVersion = function () {
        return this.version;
    };
    SDKMetaUtil.prototype.getMeta = function () {
        return {
            sdkName: this.sdkName,
            version: this.version,
        };
    };
    SDKMetaUtil.instance = null;
    return SDKMetaUtil;
}());
exports.SDKMetaUtil = SDKMetaUtil;
//# sourceMappingURL=SDKMetaUtil.js.map