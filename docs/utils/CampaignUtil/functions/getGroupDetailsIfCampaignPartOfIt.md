[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/CampaignUtil](../README.md) / getGroupDetailsIfCampaignPartOfIt

# Function: getGroupDetailsIfCampaignPartOfIt()

> **getGroupDetailsIfCampaignPartOfIt**(`settings`, `campaignId`): `object` \| `object`

Determines if a campaign is part of a group.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings model containing group associations.

• **campaignId**: `any`

The ID of the campaign to check.

## Returns

`object` \| `object`

An object containing the group ID and name if the campaign is part of a group, otherwise an empty object.

## Source

utils/CampaignUtil.ts:160
