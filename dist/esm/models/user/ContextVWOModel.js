"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextVWOModel = void 0;
class ContextVWOModel {
    modelFromDictionary(context) {
        if (context?.location) {
            this.location = context.location;
        }
        if (context?.userAgent) {
            this.userAgent = context.userAgent;
        }
        return this;
    }
    getLocation() {
        return this.location;
    }
    getUaInfo() {
        return this.userAgent;
    }
}
exports.ContextVWOModel = ContextVWOModel;
//# sourceMappingURL=ContextVWOModel.js.map