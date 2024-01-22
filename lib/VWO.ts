import { VWOBuilder } from './VWOBuilder';
import { isObject, isString } from './utils/DataTypeUtil';
import { dynamic } from './types/common';

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
    
    return this.vwoBuilder.getSettings().then(settings => {
      return this.vwoBuilder.build(settings);
    })

    // return this.instance;
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

  const instance = await new VWO(options);

  return instance;
}
