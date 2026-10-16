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
/**
 * Wire-level JSON keys for panic / forced-settings-refresh timestamps.
 *
 * **Settings:** only **`sdkMetaInfo.panic`** and **`sdkMetaInfo.refresh`** are read.
 * **DaCDN** collect/batch bodies use **`panicMode`** and **`forceRefresh`**.
 */
export declare const SdkControlWireKeys: {
  readonly SETTINGS_SDK_META_PANIC_TIMESTAMP: 'panic';
  readonly SETTINGS_SDK_META_REFRESH_TIMESTAMP: 'refresh';
  readonly PANIC_MODE_TIMESTAMP: 'panicMode';
  readonly FORCE_REFRESH_TIMESTAMP: 'forceRefresh';
};
