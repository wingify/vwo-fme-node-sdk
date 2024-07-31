[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/RuleEvaluationUtil](../README.md) / evaluateRule

# Function: evaluateRule()

> **evaluateRule**(`settings`, `feature`, `campaign`, `context`, `evaluatedFeatureMap`, `megGroupWinnerCampaigns`, `storageService`, `decision`): `Promise`\<`Record`\<`string`, `any`\>\>

Evaluates the rules for a given campaign and feature based on the provided context.
This function checks for whitelisting and pre-segmentation conditions, and if applicable,
sends an impression for the variation shown.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings configuration for the evaluation.

• **feature**: [`FeatureModel`](../../../models/campaign/FeatureModel/classes/FeatureModel.md)

The feature being evaluated.

• **campaign**: [`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)

The campaign associated with the feature.

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

The user context for evaluation.

• **evaluatedFeatureMap**: `Map`\<`string`, `unknown`\>

A map of evaluated features.

• **megGroupWinnerCampaigns**: `Map`\<`number`, `number`\>

A map of MEG group winner campaigns.

• **storageService**: [`IStorageService`](../../../services/StorageService/interfaces/IStorageService.md)

The storage service for persistence.

• **decision**: `any`

The decision object that will be updated based on the evaluation.

## Returns

`Promise`\<`Record`\<`string`, `any`\>\>

A promise that resolves to a tuple containing the result of the pre-segmentation
and the whitelisted object, if any.

## Source

utils/RuleEvaluationUtil.ts:41
