[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/NetworkUtil](../README.md) / getTrackUserPayloadData

# Function: getTrackUserPayloadData()

> **getTrackUserPayloadData**(`settings`, `userId`, `eventName`, `campaignId`, `variationId`, `visitorUserAgent`, `ipAddress`): `Record`\<`string`, `any`\>

Builds payload to track the visitor.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

• **userId**: `string` \| `number`

• **eventName**: `string`

• **campaignId**: `number`

• **variationId**: `number`

• **visitorUserAgent**: `string`= `''`

• **ipAddress**: `string`= `''`

## Returns

`Record`\<`string`, `any`\>

track-user payload

## Source

utils/NetworkUtil.ts:193
