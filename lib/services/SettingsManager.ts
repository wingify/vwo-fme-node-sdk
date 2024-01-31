import { dynamic } from '../types/common';

import { Storage } from '../modules/storage';
import { NetworkManager, RequestModel, ResponseModel } from '../modules/networking';
import { LogManager } from '../modules/logger';

import { isObject } from '../utils/DataTypeUtil';
import { Deferred } from '../utils/PromiseUtil';

import { Constants } from '../constants';
import { NetworkUtil } from '../utils/NetworkUtil';
import { setVariationAllocation } from '../utils/CampaignUtil';
import { CampaignModel } from '../models/CampaignModel';

export class SettingsManager implements ISettingsManager {
  sdkKey: string;
  expiry: number;
  networkTimeout: number;

  constructor(options: Record<string, any>) {
    this.sdkKey = options.sdkKey;
    this.expiry = options?.settings?.expiry || Constants.SETTINGS_EXPIRY;
    this.networkTimeout = options?.settings?.timeout || Constants.SETTINGS_TIMEOUT;

    // if (this.expiry > 0) {
    //   this.setSettingsExpiry();
    // }
  }

  private setSettingsExpiry() {
    const settingsTimeout = setTimeout(() => {
      this.fetchSettingsAndCacheInStorage(true).then(() => {
        clearTimeout(settingsTimeout);
        // again set the timer
        // NOTE: setInterval could be used but it will not consider the time required to fetch settings
        // This breaks the timer rythm and also sends more call than required
        this.setSettingsExpiry();
      });
    }, this.expiry);
  }

  private fetchSettingsAndCacheInStorage(update = false) {
    const deferredObject = new Deferred();
    const storageConnector = Storage.Instance.getConnector();

    this.fetchSettings()
      .then(async (res) => {
        LogManager.Instance.info('Settings fetched successfully');

        const method = update ? 'update' : 'set';

        storageConnector[method](Constants.SETTINGS, res).then(() => {
          LogManager.Instance.info('Settings persisted in cache: memory');
          deferredObject.resolve(res);
        });
      })
      .catch((err) => {
        LogManager.Instance.error(`Settings could not be fetched: ${err}`);
        deferredObject.resolve(null);
      });

    return deferredObject.promise;
  }

  fetchSettings(): Promise<dynamic> {
    const deferredObject = new Deferred();

    if (!this.sdkKey) {
      // console.error('AccountId and sdkKey are required for fetching account settings. Aborting!');
      LogManager.Instance.error('sdkKey is required for fetching account settings. Aborting!');
      deferredObject.reject(new Error('sdkKey is required for fetching account settings. Aborting!'));
    }

    const networkInstance = NetworkManager.Instance;
    const options: Record<string, dynamic> = new NetworkUtil().getSettingsPath(this.sdkKey);
    options.platform = 'server';
    options['api-version'] = 1;
    if (!networkInstance.getConfig().getDevelopmentMode()) {
      options.s = 'prod';
    }

    const request: RequestModel = new RequestModel(
      Constants.HOST_NAME,
      'GET',
      Constants.SETTINTS_ENDPOINT,
      options,
      null,
      null,
      null,
    );
    request.setTimeout(this.networkTimeout);

    networkInstance
      .get(request)
      .then((response: ResponseModel) => {
        deferredObject.resolve(response.getData());
      })
      .catch((err: ResponseModel) => {
        deferredObject.reject(err);
      });

    return deferredObject.promise;
  }

  addLInkedCampaignsToSettings(settingsFile: any): void {
    // loop over all features
    for (const feature of settingsFile.features) {
      const { rules } = feature;
      const campaigns = settingsFile.campaigns;
      const rulesLinkedCampaign = [];

      // loop over all rules of a feature
      for (const rule of rules) {
        const { campaignId, variationId } = rule;
        if (campaignId) {
          // find the campaign with the given campaignId
          const campaign = campaigns.find((c) => c.id === campaignId);
          if (campaign) {
            // create a linked campaign object with the rule and campaign
            const linkedCampaign = { key: campaign.key, ...rule, ...campaign };

            if (variationId) {
              // find the variation with the given variationId
              const variation = campaign.variations.find((v) => v.id === variationId);
              if (variation) {
                // add the variation to the linked campaign
                linkedCampaign.variations = [variation];
              }
            }
            // add the linked campaign to the rulesLinkedCampaign array
            rulesLinkedCampaign.push(linkedCampaign);
          }
        }
      }
      feature.rulesLinkedCampaign = rulesLinkedCampaign;
    }
  }

  getSettings(forceFetch = false): Promise<dynamic> {
    const deferredObject = new Deferred();

    if (forceFetch) {
      this.fetchSettingsAndCacheInStorage().then((settings) => {
        deferredObject.resolve(settings);
      });
    } else {
      const storageConnector = Storage.Instance.getConnector();

      storageConnector
        .get(Constants.SETTINGS)
        .then((storedSettings: dynamic) => {
          if (!isObject(storedSettings)) {
            this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
              deferredObject.resolve(fetchedSettings);
            });
          } else {
            deferredObject.resolve(storedSettings);
          }
        })
        .catch(() => {
          this.fetchSettingsAndCacheInStorage().then((fetchedSettings) => {
            deferredObject.resolve(fetchedSettings);
          });
        });
    }

    return deferredObject.promise;
  }
}

interface ISettingsManager {
  sdkKey: string;

  getSettings(forceFetch: boolean): Promise<dynamic>;

  fetchSettings(): Promise<dynamic>;
}
