[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/FunctionUtil](../README.md) / getSpecificRulesBasedOnType

# Function: getSpecificRulesBasedOnType()

> **getSpecificRulesBasedOnType**(`feature`, `type`): [`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)[]

Retrieves specific rules based on the type from a feature.

## Parameters

• **feature**: [`FeatureModel`](../../../models/campaign/FeatureModel/classes/FeatureModel.md)

The key of the feature.

• **type**: [`CampaignTypeEnum`](../../../enums/CampaignTypeEnum/enumerations/CampaignTypeEnum.md)= `null`

The type of the rules to retrieve.

## Returns

[`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)[]

An array of rules that match the type.

## Source

utils/FunctionUtil.ts:71
