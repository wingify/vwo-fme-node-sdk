[**vwo-fme-node-sdk**](../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../modules.md) / [VWOClient](../README.md) / IVWOClient

# Interface: IVWOClient

## Properties

### options?

> `optional` `readonly` **options**: [`IVWOOptions`](../../models/VWOOptionsModel/interfaces/IVWOOptions.md)

#### Source

VWOClient.ts:43

---

### settings

> **settings**: [`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)

#### Source

VWOClient.ts:44

## Methods

### getFlag()

> **getFlag**(`featureKey`, `context`): `Record`\<`any`, `any`\>

#### Parameters

• **featureKey**: `string`

• **context**: `Record`\<`string`, `any`\>

#### Returns

`Record`\<`any`, `any`\>

#### Source

VWOClient.ts:46

---

### setAttribute()

> **setAttribute**(`attributeKey`, `attributeValue`, `context`): `void`

#### Parameters

• **attributeKey**: `string`

• **attributeValue**: `string`

• **context**: `Record`\<`string`, `any`\>

#### Returns

`void`

#### Source

VWOClient.ts:52

---

### trackEvent()

> **trackEvent**(`eventName`, `eventProperties`, `context`): `Promise`\<`Record`\<`string`, `boolean`\>\>

#### Parameters

• **eventName**: `string`

• **eventProperties**: `Record`\<`string`, [`dynamic`](../../types/Common/type-aliases/dynamic.md)\>

• **context**: `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`Record`\<`string`, `boolean`\>\>

#### Source

VWOClient.ts:47
