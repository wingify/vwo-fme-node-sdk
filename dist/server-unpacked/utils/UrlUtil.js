"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlUtil = void 0;
/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
var SettingsService_1 = require("../services/SettingsService");
var DataTypeUtil_1 = require("./DataTypeUtil");
exports.UrlUtil = {
    /**
     * Initializes the UrlUtil with optional collectionPrefix and gatewayServiceUrl.
     * If provided, these values are set after validation.
     * @param {string} [collectionPrefix] - Optional prefix for URL collections.
     * @returns {IUrlUtil} The instance of UrlUtil with updated properties.
     */
    init: function (_a) {
        var _b = _a === void 0 ? {} : _a, collectionPrefix = _b.collectionPrefix;
        // Set collectionPrefix if it is a valid string
        if (collectionPrefix && (0, DataTypeUtil_1.isString)(collectionPrefix)) {
            exports.UrlUtil.collectionPrefix = collectionPrefix;
        }
        return exports.UrlUtil;
    },
    /**
     * Retrieves the base URL.
     * If gatewayServiceUrl is set, it returns that; otherwise, it constructs the URL using baseUrl and collectionPrefix.
     * @returns {string} The base URL.
     */
    getBaseUrl: function () {
        var baseUrl = SettingsService_1.SettingsService.Instance.hostname;
        if (SettingsService_1.SettingsService.Instance.isGatewayServiceProvided) {
            return baseUrl;
        }
        // Construct URL with collectionPrefix if it exists
        if (exports.UrlUtil.collectionPrefix) {
            return "".concat(baseUrl, "/").concat(exports.UrlUtil.collectionPrefix);
        }
        // Return the default baseUrl if no specific URL components are set
        return baseUrl;
    },
};
//# sourceMappingURL=UrlUtil.js.map