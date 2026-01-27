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
export var StorageEnum;
(function (StorageEnum) {
    StorageEnum[StorageEnum["STORAGE_UNDEFINED"] = 0] = "STORAGE_UNDEFINED";
    StorageEnum[StorageEnum["INCORRECT_DATA"] = 1] = "INCORRECT_DATA";
    StorageEnum[StorageEnum["NO_DATA_FOUND"] = 2] = "NO_DATA_FOUND";
    StorageEnum[StorageEnum["CAMPAIGN_PAUSED"] = 3] = "CAMPAIGN_PAUSED";
    StorageEnum[StorageEnum["VARIATION_NOT_FOUND"] = 4] = "VARIATION_NOT_FOUND";
    StorageEnum[StorageEnum["WHITELISTED_VARIATION"] = 5] = "WHITELISTED_VARIATION";
})(StorageEnum || (StorageEnum = {}));
//# sourceMappingURL=StorageEnum.js.map