import { setVariationAllocation } from '../utils/CampaignUtil';
import { SettingsModel } from '../models/SettingsModel';
import { CampaignModel } from '../models/CampaignModel';
import { dynamic } from '../types/Common';
import { FeatureModel } from '../models/FeatureModel';

export function processSettings(settings: SettingsModel): SettingsModel {
  const parsedSettings: SettingsModel = new SettingsModel(settings);
  const features: Array<FeatureModel> = parsedSettings?.getFeatures();
  // features.forEach((feature: FeatureModel) => {
  //   feature.getCampaigns().forEach((campaign: CampaignModel) => {
  //     campaign.setFeatureDetails(feature.getId(), feature.getKey());
  //     setVariationAllocation(campaign.getVariations(), feature.getVariables());
  //   });
  // });

  return parsedSettings;
}
