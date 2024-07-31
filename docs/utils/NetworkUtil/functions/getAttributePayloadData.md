[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [utils/NetworkUtil](../README.md) / getAttributePayloadData

# Function: getAttributePayloadData()

> **getAttributePayloadData**(`settings`, `userId`, `eventName`, `attributeKey`, `attributeValue`, `visitorUserAgent`?, `ipAddress`?): `Record`\<`string`, `any`\>

Constructs the payload data for syncing visitor attributes.

## Parameters

• **settings**: [`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)

Configuration settings.

• **userId**: `string` \| `number`

User identifier.

• **eventName**: `string`

Name of the event.

• **attributeKey**: `string`

Key of the attribute to sync.

• **attributeValue**: [`dynamic`](../../../types/Common/type-aliases/dynamic.md)

Value of the attribute.

• **visitorUserAgent?**: `string`= `''`

Visitor's user agent.

• **ipAddress?**: `string`= `''`

Visitor's IP address.

## Returns

`Record`\<`string`, `any`\>

- The constructed payload data.

## Source

utils/NetworkUtil.ts:271
