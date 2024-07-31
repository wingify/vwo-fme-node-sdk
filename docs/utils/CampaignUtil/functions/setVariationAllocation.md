[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/CampaignUtil](../README.md) / setVariationAllocation

# Function: setVariationAllocation()

> **setVariationAllocation**(`campaign`): `void`

Sets the variation allocation for a given campaign based on its type.
If the campaign type is ROLLOUT or PERSONALIZE, it handles the campaign using `_handleRolloutCampaign`.
Otherwise, it assigns range values to each variation in the campaign.

## Parameters

• **campaign**: [`CampaignModel`](../../../models/campaign/CampaignModel/classes/CampaignModel.md)

The campaign for which to set the variation allocation.

## Returns

`void`

## Source

utils/CampaignUtil.ts:31
