// import { processSettings } from './utils/settingsUtil';
import { Storage } from './modules/storage';
import { LogManager } from './modules/logger';

import { FlagApi } from './api/GetFlag';
import { TrackApi } from './api/Track';

// import { VWOBuilder } from './VWOBuilder';
import { SettingsModel } from './models/SettingsModel';
import { DebugLogMessageEnum } from './enums/logMessages/DebugLogMessageEnum';

import { ErrorLogMessageEnum } from './enums/logMessages/ErrorLogMessageEnum';
import { VariableModel } from './models/VariableModel';
import { SettingsSchema } from './models/schemas/SettingsSchemaValidation';
import { dynamic } from './types/common';
// import { BatchEventsQueue } from './services/batchEventsQueue';

import { isString, isObject, getType, isBoolean, isNumber, isUndefined, isArray, isNull } from './utils/DataTypeUtil';
import { buildMessage } from './utils/LogMessageUtil';
import { addLInkedCampaignsToSettings } from './utils/FunctionUtil';
import { Deferred } from './utils/PromiseUtil';
import UrlService from './services/UrlService';
import { setVariationAllocation } from './utils/CampaignUtil';
import { CampaignModel } from './models/CampaignModel';

interface IVWOClient {
  // readonly apiKey: string;
  readonly options?: Record<string, dynamic>;
  settings: SettingsModel;
  // vwoProvider: VWOBuilder;

  // onceReady(): Promise<Record<string, dynamic>>;

  // getSettings(force: boolean): SettingsModel | Promise<SettingsModel>;

  getFlag(featureKey: string, context: any): Record<any, any>;
  getVariable(featureKey: string, variableSpecifier: dynamic, key?: string): Promise<VariableModel>;
  getVariables(featureKey: string): Promise<Array<VariableModel>>;
  track(eventName: string, context: any, eventProperties: Record<string, dynamic>): Promise<Record<string, boolean>>;

  // flushEvents(): Promise<Record<string, dynamic>>;

  // track(
  //   eventName: string,
  //   eventProperties: Record<string, dynamic>,
  //   campaignKey?: dynamic
  // ): Promise<Record<string, boolean>>;
  // push(dimensionKey: string, dimensionValue: string): void;
}

export class VWOClient implements IVWOClient {
  // readonly apiKey: string;

  settings: any;
  // user: User;
  storage: Storage;

  constructor(
    settings: any
    // userId: string,
    // properties: Record<string, dynamic>,
    // dimensions: DimensionModel
  ) {
    // this.vwoProvider = vwoProvider;
    // this.setUser(userId, properties, dimensions);

    // LogManager.Instance.debug(`VWO Client initialized with userId:${userId}`);
    this.settings = settings;
    UrlService.init({ collectionPrefix: this.settings.collectionPrefix });
    for (let i = 0; i < this.settings.campaigns.length; i++) {
      let campaign = this.settings.campaigns[i];
      campaign = new CampaignModel().modelFromDictionary(campaign);
      setVariationAllocation(campaign);
      this.settings.campaigns[i] = campaign;
    }
    addLInkedCampaignsToSettings(this.settings);
    LogManager.Instance.info('VWO Client initialized');
    return this;
  }
  options?: Record<string, dynamic>;

  /* onceReady(): Promise<SettingsModel> {
    try {
      const deferredObject = new Deferred();

      this.vwoProvider.getSettings(false).then(settings => {
        this.settings = cloneObject(settings);
        this.settings = processSettings(this.settings);

        LogManager.Instance.info('VWO Client ready for use');

        deferredObject.resolve(settings);
      });

      return deferredObject.promise;
    } catch (err) {
      LogManager.Instance.error('VWO Client failed to be ready');
    }
  } */

  /* setSettings(settings: Record<string, dynamic>): void {
    const apiName = 'setSettings';

    try {
      if (!isObject(settings)) {
        LogManager.Instance.debug(`settings passed to setSettings API is not of valid type. Got ${getType(settings)}`);
        throw new TypeError('TypeError: settings should be an object');
      }

      this.vwoProvider.setSettings(settings);
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err
        })
      );
    }
  } */

  /* getSettings(force = false): Promise<SettingsModel> {
    const apiName = 'getSettings';
    const deferredObject = new Deferred();

    try {
      if (!isBoolean(force)) {
        LogManager.Instance.debug(`force passed to getSettings API is not of valid type. Got ${getType(force)}`);
        throw new TypeError('TypeError: force should be a boolean');
      }

      this.vwoProvider.getSettings(force).then(() => {
        deferredObject.resolve(this.vwoProvider.originalSettings);
      });
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err
        })
      );

      deferredObject.resolve(null);
    }
    return deferredObject.promise;
  } */

  /* flushEvents(): Promise<Record<string, dynamic>> {
    const deferred = new Deferred();
    if (BatchEventsQueue.Instance.isBatchingQueueActivated()) {
      BatchEventsQueue.Instance.flushAndClearInterval();

      deferred.resolve({
        status: true,
        message: 'Batch call sent to VWO'
      });
    } else {
      deferred.resolve({
        status: false,
        message: 'No batchEvents config present in launch API'
      });
    }

    return deferred.promise;
  } */

  /* setUser(
    userId: string,
    properties: Record<string, dynamic> = {},
    config: DimensionModel = {
      dimensions: []
    }
  ): User {
    const apiName = 'setUser';
    try {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName
        })
      );

      if (!isString(userId)) {
        LogManager.Instance.debug(`userId passed to createClient API is not of valid type. Got ${getType(userId)}`);
        throw new TypeError('TypeError: userId should be a string');
      }

      if (!isObject(properties)) {
        LogManager.Instance.debug(
          `user-properties passed to createClient API is not of valid type. Got ${getType(properties)}`
        );
        throw new TypeError('TypeError: user-properties should be an object');
      }

      if (!isObject(config)) {
        LogManager.Instance.debug(
          `user-properties-config passed to createClient API is not of valid type. Got ${getType(config)}`
        );
        throw new TypeError('TypeError: user-properties-config should be an object');
      }

      this.user = new User().setUser(userId, properties, config);

      return this.user;
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err
        })
      );

      return null;
    }
  }

  getUser(): User {
    const apiName = 'getUser';

    try {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName
        })
      );

      return this.user.getUser();
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err
        })
      );

      return null;
    }
  } */

  getFlag(featureKey: string, context: any): Record<any, any> {
    const apiName = 'getFlag';
    const deferredObject = new Deferred();

    try {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      if (!isString(featureKey)) {
        LogManager.Instance.debug(
          `featureKey passed to ${apiName} API is not of valid type. Got ${getType(featureKey)}`,
        );
        throw new TypeError('TypeError: variableSpecifier should be a string');
      }

      if (!this.settings) {
        //|| !new SettingsSchema().isSettingsValid(this.settings)) {
        LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
        throw new Error('Invalid Settings');
      }

      new FlagApi().get(featureKey, this.settings, context.user).then((data: any) => {
        deferredObject.resolve(data);
      });

      return deferredObject.promise;
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );

      return deferredObject.resolve({});
    }
  }

  getVariable(variableSpecifier: dynamic, key?: string, featureKey = ''): Promise<VariableModel> {
    const apiName = 'getVariable';
    const deferredObject = new Deferred();

    try {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      if (!(isString(variableSpecifier) || isNumber(variableSpecifier))) {
        LogManager.Instance.debug(
          `variableSpecifier passed to getVariable API is not of valid type. Got ${getType(variableSpecifier)}`,
        );
        throw new TypeError('TypeError: variableSpecifier should be a string|number');
      }

      if (!this.settings || !new SettingsSchema().isSettingsValid(this.settings)) {
        LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
        throw new Error('Invalid Settings');
      }

      // new VariableApi()
      //   .get(featureKey, variableSpecifier, key || null, this.settings, this.user.getUser())
      //   .then((variable: VariableModel) => {
      //     deferredObject.resolve(variable);
      //   });

      return deferredObject.promise;
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );

      return deferredObject.resolve(null);
    }
  }

  getVariables(featureKey = ''): Promise<Array<VariableModel>> {
    const apiName = 'getVariables';
    const deferredObject = new Deferred();

    try {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      if (!this.settings || !new SettingsSchema().isSettingsValid(this.settings)) {
        LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
        throw new Error('Invalid Settings');
      }

      // new VariableApi().getAll(featureKey, this.settings, this.user.getUser()).then(variableList => {
      //   deferredObject.resolve(variableList);
      // });

      return deferredObject.promise;
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );

      return deferredObject.resolve([]);
    }
  }

  track(
    eventName: string,
    context: any,
    eventProperties: Record<string, dynamic> = {},
  ): Promise<Record<string, boolean>> {
    const apiName = 'track';
    try {
      LogManager.Instance.debug(
        buildMessage(DebugLogMessageEnum.API_CALLED, {
          apiName,
        }),
      );

      if (!isString(eventName)) {
        LogManager.Instance.debug(`eventName passed to track API is not of valid type. Got ${getType(eventName)}`);
        throw new TypeError('TypeError: eventName should be a string');
      }

      if (!isObject(eventProperties)) {
        LogManager.Instance.debug(
          `eventProperties passed to track API is not of valid type. Got ${getType(eventProperties)}`,
        );
        // throw new TypeError('TypeError: eventProperties should be an object');
      }

      if (!this.settings) {
        // || !new SettingsSchema().isSettingsValid(this.settings)) {
        LogManager.Instance.debug(`settings are not valid. Got ${getType(this.settings)}`);
        throw new Error('Invalid Settings');
      }

      return new TrackApi().track(this.settings, eventName, context, eventProperties);
    } catch (err) {
      LogManager.Instance.error(
        buildMessage(ErrorLogMessageEnum.API_THROW_ERROR, {
          apiName,
          err,
        }),
      );
    }
  }
}
