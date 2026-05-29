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
exports.ContextWingifyModel = void 0;
var ContextWingifyModel = /** @class */ (function () {
    function ContextWingifyModel() {
    }
    ContextWingifyModel.prototype.modelFromDictionary = function (context) {
        if (context === null || context === void 0 ? void 0 : context.location) {
            this.location = context.location;
        }
        if (context === null || context === void 0 ? void 0 : context.userAgent) {
            this.userAgent = context.userAgent;
        }
        return this;
    };
    ContextWingifyModel.prototype.getLocation = function () {
        return this.location;
    };
    ContextWingifyModel.prototype.getUaInfo = function () {
        return this.userAgent;
    };
    return ContextWingifyModel;
}());
exports.ContextWingifyModel = ContextWingifyModel;
//# sourceMappingURL=ContextWingifyModel.js.map