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
import { VWOBuilder } from './VWOBuilder';
import { SettingsModel } from './models/SettingsModel';
import { dynamic } from './types/Common';
import { isObject, isString } from './utils/DataTypeUtil';

export class VWO {
  private static vwoBuilder: VWOBuilder;
  private static instance: dynamic;

  constructor(options: Record<string, dynamic> = {}) {
    return VWO.setInstance(options);
  }

  private static setInstance(options: Record<string, dynamic>) {
    this.vwoBuilder = new VWOBuilder(options);
    this.instance = this.vwoBuilder
      .setSettingsManager()
      .setStorage()
      .setLogger()
      .setNetworkManager()
      .setSegmentation()
      .initBatching()
      .initPolling()
      // .getSettings()
      // .setAnalyticsCallback()

    return this.vwoBuilder.getSettings().then((settings: SettingsModel) => {
      return this.vwoBuilder.build(settings);
    })
  }

  static get Instance(): dynamic {
    return this.instance;
  }
}

export async function init(options: Record<string, dynamic> = {}) {
  if (!isObject(options)) {
    throw new Error('Options should be of type object.');
  }

  if (!options.sdkKey || !isString(options.sdkKey)) {
    throw new Error('Please provide the sdkKey in the options and should be a of type string');
  }

  if (!options.accountId) {
    throw new Error('Please provide VWO account ID in the options and should be a of type string|number');
  }

  const instance = await new VWO(options);

  return instance;
}
