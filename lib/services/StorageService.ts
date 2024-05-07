import { StorageEnum } from '../enums/StorageEnum';
import { Storage } from '../modules/storage';
import { dynamic } from '../types/Common';

import { isNull, isUndefined } from '../utils/DataTypeUtil';
import { Deferred } from '../utils/PromiseUtil';

export class StorageService {
  private storageData: Record<string, dynamic> = {};

  async getDataInStorage(featureKey: any, user: any): Promise<Record<any, any>> {
    const deferredObject = new Deferred();
    const storageInstance = Storage.Instance.getConnector();

    if (isNull(storageInstance) || isUndefined(storageInstance)) {
      deferredObject.resolve(StorageEnum.STORAGE_UNDEFINED);
    } else {
      storageInstance
        .get(featureKey, user.id)
        .then((data: Record<string, any>) => {
          deferredObject.resolve(data);
        })
        .catch((err) => {
          console.log('Error in getting data from storage', err);
          // TODO:- Add logging here
          deferredObject.resolve(StorageEnum.NO_DATA_FOUND);
        });
    }

    return deferredObject.promise;
  }

  setDataInStorage(data: Record<any, any>): Promise<void> {
    const deferredObject = new Deferred();

    const storageInstance = Storage.Instance.getConnector();
    if (storageInstance === null || storageInstance === undefined) {
      deferredObject.resolve(false);
    } else {
      storageInstance
        .set(data)
        .then(() => {
          deferredObject.resolve(true);
        })
        .catch(() => {
          deferredObject.resolve(false);
        });
    }

    return deferredObject.promise;
  }
}
