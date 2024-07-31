"use strict";
/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
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
exports.ResponseModel = exports.RequestModel = exports.GlobalRequestModel = exports.NetworkManager = exports.NetworkClient = void 0;
var NetworkClient;
if (typeof process.env === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    exports.NetworkClient = NetworkClient = require('./client/NetworkBrowserClient').NetworkBrowserClient;
}
else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    exports.NetworkClient = NetworkClient = require('./client/NetworkClient').NetworkClient;
}
var NetworkManager_1 = require("./manager/NetworkManager");
Object.defineProperty(exports, "NetworkManager", { enumerable: true, get: function () { return NetworkManager_1.NetworkManager; } });
var GlobalRequestModel_1 = require("./models/GlobalRequestModel");
Object.defineProperty(exports, "GlobalRequestModel", { enumerable: true, get: function () { return GlobalRequestModel_1.GlobalRequestModel; } });
var RequestModel_1 = require("./models/RequestModel");
Object.defineProperty(exports, "RequestModel", { enumerable: true, get: function () { return RequestModel_1.RequestModel; } });
var ResponseModel_1 = require("./models/ResponseModel");
Object.defineProperty(exports, "ResponseModel", { enumerable: true, get: function () { return ResponseModel_1.ResponseModel; } });
//# sourceMappingURL=index.js.map