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

import { VWOBuilder } from "../VWOBuilder";
import { StorageService } from "../services/StorageService";
import { GatewayServiceModel } from "./GatewayServiceModel";

export interface IVWOOptions {
    accountId: string;
    sdkKey: string;
    storageService?: StorageService;
    gatewayService?: GatewayServiceModel;
    vwoBuilder?: VWOBuilder;
}

export class VWOOptionsModel implements IVWOOptions{
    accountId: string;
    sdkKey: string;
    storageService?: StorageService;
    gatewayService?: GatewayServiceModel;
    vwoBuilder?: VWOBuilder;

    modelFromDictionary(options: VWOOptionsModel): this {
        this.accountId = options.accountId;
        this.sdkKey = options.sdkKey;
        this.vwoBuilder = options.vwoBuilder;
        if (options?.storageService) {
            this.storageService = options.storageService;
        }
        if (options?.gatewayService) {
            this.gatewayService = options.gatewayService;
        }
        return this;
    }

    getAccountId(): string {
        return this.accountId;
    }

    getSdkKey(): string {
        return this.sdkKey;
    }

    getStorageService(): StorageService {
        return this.storageService;
    }

    getGatewayService(): GatewayServiceModel {
        return this.gatewayService;
    }

    getVWOBuilder(): VWOBuilder {
        return this.vwoBuilder;
    }
  }
  