[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/NetworkUtil](../README.md) / getTrackGoalPayloadData

# Function: getTrackGoalPayloadData()

> **getTrackGoalPayloadData**(`settings`, `userId`, `eventName`, `eventProperties`, `visitorUserAgent`?, `ipAddress`?): `Record`\<`string`, `any`\>

Constructs the payload data for tracking goals with custom event properties.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

Configuration settings.

• **userId**: `string` \| `number`

User identifier.

• **eventName**: `string`

Name of the event.

• **eventProperties**: `Record`\<`string`, `any`\>

Custom properties for the event.

• **visitorUserAgent?**: `string`= `''`

Visitor's user agent.

• **ipAddress?**: `string`= `''`

Visitor's IP address.

## Returns

`Record`\<`string`, `any`\>

- The constructed payload data.

## Source

utils/NetworkUtil.ts:229
