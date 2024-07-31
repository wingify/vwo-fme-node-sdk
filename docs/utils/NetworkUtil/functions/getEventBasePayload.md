[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/NetworkUtil](../README.md) / \_getEventBasePayload

# Function: \_getEventBasePayload()

> **\_getEventBasePayload**(`settings`, `userId`, `eventName`, `visitorUserAgent`, `ipAddress`): `Record`\<`string`, `any`\>

Builds generic payload required by all the different tracking calls.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

settings file

• **userId**: `string` \| `number`

user id

• **eventName**: `string`

event name

• **visitorUserAgent**: `string`= `''`

• **ipAddress**: `string`= `''`

## Returns

`Record`\<`string`, `any`\>

properties

## Source

utils/NetworkUtil.ts:137
