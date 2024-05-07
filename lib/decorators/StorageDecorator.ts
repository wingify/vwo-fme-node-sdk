import { LogManager } from '../modules/logger';

import { StorageEnum } from '../enums/StorageEnum';
import { FeatureModel } from '../models/FeatureModel';
import { VariationModel } from '../models/VariationModel';
import { StorageService } from '../services/StorageService';

import { Deferred } from '../utils/PromiseUtil';

interface IStorageDecorator {
  setDataInStorage(data: Record<any, any>, storageService: StorageService): Promise<VariationModel>;
  getFeatureFromStorage(featureKey: FeatureModel, user: any, storageService: StorageService): Promise<any>;
}

export class StorageDecorator implements IStorageDecorator {
  async getFeatureFromStorage(featureKey: any, user: any, storageService: StorageService): Promise<any> {
    const deferredObject = new Deferred();
    storageService.getDataInStorage(featureKey, user).then((campaignMap: Record<any, any> | StorageEnum) => {
      switch (campaignMap) {
        case StorageEnum.STORAGE_UNDEFINED:
          deferredObject.resolve(null);
          break;
        case StorageEnum.NO_DATA_FOUND:
          deferredObject.resolve(null);
          break;
        case StorageEnum.INCORRECT_DATA:
          deferredObject.resolve(StorageEnum.INCORRECT_DATA);
          break;
        case StorageEnum.CAMPAIGN_PAUSED:
          deferredObject.resolve(null);
          break;
        case StorageEnum.VARIATION_NOT_FOUND:
          deferredObject.resolve(StorageEnum.VARIATION_NOT_FOUND);
          break;
        case StorageEnum.WHITELISTED_VARIATION:
          // handle this case with whitelisting.
          deferredObject.resolve(null);
          break;
        default:
          deferredObject.resolve(campaignMap);
      }
    });

    return deferredObject.promise;
  }

  setDataInStorage(data: Record<any, any>, storageService: StorageService): Promise<VariationModel> {
    const deferredObject = new Deferred();
    const {
      featureKey,
      user,
      rolloutId,
      rolloutKey,
      rolloutVariationId,
      experimentId,
      experimentKey,
      experimentVariationId,
    } = data;

    if (!featureKey) {
      LogManager.Instance.error(`Feature key is not valid. Not able to store data into storage`);
      deferredObject.reject();
      return;
    }
    if (!user.id) {
      LogManager.Instance.error(`User ID is not valid. Not able to store data into storage`);
      deferredObject.reject();
      return;
    }
    if (rolloutKey && !experimentKey && !rolloutVariationId) {
      LogManager.Instance.error(`Variation is not valid for Rollout rule passed. Not able to store data into storage`);
      deferredObject.reject();
      return;
    }
    if (experimentKey && !experimentVariationId) {
      LogManager.Instance.error(
        `Variation is not valid for Experiment rule passed. Not able to store data into storage`,
      );
      deferredObject.reject();
      return;
    }

    storageService.setDataInStorage({
      featureKey,
      user: user.id,
      rolloutId,
      rolloutKey,
      rolloutVariationId,
      experimentId,
      experimentKey,
      experimentVariationId,
    });

    deferredObject.resolve();

    return deferredObject.promise;
  }
}
