[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/CampaignUtil](../README.md) / getVariationFromCampaignKey

# Function: getVariationFromCampaignKey()

> **getVariationFromCampaignKey**(`settings`, `campaignKey`, `variationId`): [`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

Retrieves a variation by its ID within a specific campaign identified by its key.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings model containing all campaigns.

• **campaignKey**: `string`

The key of the campaign.

• **variationId**: `number`

The ID of the variation to retrieve.

## Returns

[`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

The found variation model or null if not found.

## Source

utils/CampaignUtil.ts:119
