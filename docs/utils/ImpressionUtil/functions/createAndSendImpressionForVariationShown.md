[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/ImpressionUtil](../README.md) / createAndSendImpressionForVariationShown

# Function: createAndSendImpressionForVariationShown()

> **createAndSendImpressionForVariationShown**(`settings`, `campaignId`, `variationId`, `context`): `void`

Creates and sends an impression for a variation shown event.
This function constructs the necessary properties and payload for the event
and uses the NetworkUtil to send a POST API request.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings model containing configuration.

• **campaignId**: `number`

The ID of the campaign.

• **variationId**: `number`

The ID of the variation shown to the user.

• **context**: [`ContextModel`](../../../models/user/ContextModel/classes/ContextModel.md)

The user context model containing user-specific data.

## Returns

`void`

## Source

utils/ImpressionUtil.ts:32
