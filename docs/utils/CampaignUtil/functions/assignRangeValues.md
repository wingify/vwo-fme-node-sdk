[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/CampaignUtil](../README.md) / assignRangeValues

# Function: assignRangeValues()

> **assignRangeValues**(`data`, `currentAllocation`): `number`

Assigns start and end range values to a variation based on its weight.

## Parameters

• **data**: [`VariationModel`](../../../models/campaign/VariationModel/classes/VariationModel.md)

The variation model to assign range values.

• **currentAllocation**: `number`

The current allocation value before this variation.

## Returns

`number`

The step factor calculated from the variation's weight.

## Source

utils/CampaignUtil.ts:62
