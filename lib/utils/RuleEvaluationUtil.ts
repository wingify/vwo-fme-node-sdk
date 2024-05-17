import { CampaignModel } from "../models/campaign/CampaignModel";
import { FeatureModel } from "../models/campaign/FeatureModel";
import { SettingsModel } from "../models/settings/SettingsModel";
import { ContextModel } from "../models/user/ContextModel";
import { StorageService } from "../services/StorageService";
import { isObject } from "./DataTypeUtil";
import { checkWhitelistingAndPreSeg } from "./DecisionUtil";
import { createAndSendImpressionForVariationShown } from "./ImpressionUtil";

/**
 * Evaluate the rule
 * @param rule    rule to evaluate
 * @param user    user object
 * @returns
 */
export const evaluateRule = async (
  settings: SettingsModel,
  feature: FeatureModel,
  campaign: CampaignModel,
  context: ContextModel,
  evaluatedFeatureMap: Map<string, any>,
  megGroupWinnerCampaigns: Map<number, number>,
  storageService: StorageService,
  decision: any,
): Promise<[boolean, any]> => {
  // check for whitelisting and pre segmentation
  const [preSegmentationResult, whitelistedObject] = await checkWhitelistingAndPreSeg(
    settings,
    feature,
    campaign,
    context,
    evaluatedFeatureMap,
    megGroupWinnerCampaigns,
    storageService,
    decision,
  );

  // if pre segmentation result is true and whitelisted object is present, then send post call
  if (preSegmentationResult && isObject(whitelistedObject) && Object.keys(whitelistedObject).length > 0) {
    Object.assign(decision, {
      experimentId: campaign.getId(),
      experimentKey: campaign.getKey(),
      experimentVariationId: whitelistedObject.variationId,
    });

    createAndSendImpressionForVariationShown(
      settings,
      campaign.getId(),
      whitelistedObject.variation.id,
      context
    );
  }

  return [ preSegmentationResult, whitelistedObject ];
};
