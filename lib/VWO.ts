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

  /**
   * Constructor for the VWO class.
   * Initializes a new instance of VWO with the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for the VWO instance.
   * @returns The instance of VWO.
   */
  constructor(options: Record<string, dynamic> = {}) {
    return VWO.setInstance(options);
  }

  /**
   * Sets the singleton instance of VWO.
   * Configures and builds the VWO instance using the provided options.
   * @param {Record<string, dynamic>} options - Configuration options for setting up VWO.
   * @returns A Promise resolving to the configured VWO instance.
   */
  private static setInstance(options: Record<string, dynamic>) {
    const optionsVWOBuilder: any = options?.vwoBuilder;
    this.vwoBuilder = optionsVWOBuilder || new VWOBuilder(options);

    this.instance = this.vwoBuilder
      .setSettingsManager()  // Sets the settings manager for configuration management.
      .setStorage()          // Configures storage for data persistence.
      .setLogger()           // Sets up logging for debugging and monitoring.
      .setNetworkManager()   // Configures network management for API communication.
      .setSegmentation()     // Sets up segmentation for targeted functionality.
      .initBatching()        // Initializes batching for bulk data processing.
      .initPolling()         // Starts polling mechanism for regular updates.
      // .getSettings()       // Fetches settings from a remote source.
      // .setAnalyticsCallback() // Sets up analytics callback for data analysis.

    return this.vwoBuilder.getSettings().then((settings: SettingsModel) => {
      return this.vwoBuilder.build(settings); // Builds the VWO instance with the fetched settings.
    })
  }

  /**
   * Gets the singleton instance of VWO.
   * @returns The singleton instance of VWO.
   */
  static get Instance(): dynamic {
    return this.instance;
  }
}

/**
 * Initializes a VWO instance with the provided options.
 * Validates the options and creates a new VWO instance.
 * @param {Record<string, dynamic>} options - Configuration options for initializing VWO.
 * @returns A Promise resolving to the initialized VWO instance.
 */
export async function init(options: Record<string, dynamic> = {}) {
  if (!isObject(options)) {
    throw new Error('Options should be of type object.'); // Ensures options is an object.
  }

  if (!options.sdkKey || !isString(options.sdkKey)) {
    throw new Error('Please provide the sdkKey in the options and should be a of type string'); // Validates sdkKey presence and type.
  }

  if (!options.accountId) {
    throw new Error('Please provide VWO account ID in the options and should be a of type string|number'); // Validates accountId presence and type.
  }

  const instance = await new VWO(options); // Creates a new VWO instance with the validated options.

  return instance;
}
