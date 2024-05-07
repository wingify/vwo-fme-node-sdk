import { VWOBuilder } from './VWOBuilder';
import { SettingsModel } from './models/SettingsModel';
import { dynamic } from './types/common';
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
