// import { APIDecorator } from '../decorators/apiDecorator';
import { FeatureModel } from '../models/FeatureModel';
import { SettingsModel } from '../models/SettingsModel';
import { CampaignModel } from '../models/CampaignModel';
// import { Campaign } from '../adapters/campaign';
// import { User } from './user';
import { dynamic } from '../types/common';
import { VariationModel } from '../models/VariationModel';
// import { VariationDecorator } from '../decorators/variationDecorator';
// import { checkForFeatureInSettings } from '../utils/FeatureUtil';
// import { StorageService } from '../services/storageService';

import { Deferred } from '../utils/PromiseUtil';
import { isNull, isUndefined } from '../utils/DataTypeUtil';

interface IGetFlag {
  get(
    featureKey: string,
    settings: SettingsModel,
    user: any
  ): Promise<FeatureModel>;
}

export class FlagApi implements IGetFlag {
  get(
    featureKey: string,
    settings: SettingsModel,
    user: any
  ): Promise<FeatureModel> {
    const deferredObject = new Deferred();

    deferredObject.resolve(null);

    return deferredObject.promise;
  }
}
