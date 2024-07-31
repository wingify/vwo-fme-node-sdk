[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/DecisionUtil](../README.md) / checkWhitelistingAndPreSeg

# Function: checkWhitelistingAndPreSeg()

> **checkWhitelistingAndPreSeg**(`settings`, `feature`, `campaign`, `context`, `evaluatedFeatureMap`, `megGroupWinnerCampaigns`, `storageService`, `decision`): `Promise`\<[`boolean`, `any`]\>

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

• **feature**: [`FeatureModel`](../../../models/campaign/FeatureModel/classes/FeatureModel.md)

• **campaign**: [`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

• **evaluatedFeatureMap**: `Map`\<`string`, `any`\>

• **megGroupWinnerCampaigns**: `Map`\<`number`, `number`\>

• **storageService**: [`IStorageService`](../../../services/StorageService/interfaces/IStorageService.md)

• **decision**: `any`

## Returns

`Promise`\<[`boolean`, `any`]\>

## Source

utils/DecisionUtil.ts:42
