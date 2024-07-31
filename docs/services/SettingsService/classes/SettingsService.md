[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [services/SettingsService](../README.md) / SettingsService

# Class: SettingsService

## Implements

- `ISettingsService`

## Constructors

### new SettingsService()

> **new SettingsService**(`options`): [`SettingsService`](SettingsService.md)

#### Parameters

• **options**: `Record`\<`string`, `any`\>

#### Returns

[`SettingsService`](SettingsService.md)

#### Source

services/SettingsService.ts:51

## Properties

### accountId

> **accountId**: `number`

#### Source

services/SettingsService.ts:42

---

### expiry

> **expiry**: `number`

#### Source

services/SettingsService.ts:43

---

### hostname

> **hostname**: `string`

#### Source

services/SettingsService.ts:45

---

### isGatewayServiceProvided

> **isGatewayServiceProvided**: `boolean` = `false`

#### Source

services/SettingsService.ts:48

---

### networkTimeout

> **networkTimeout**: `number`

#### Source

services/SettingsService.ts:44

---

### port

> **port**: `number`

#### Source

services/SettingsService.ts:46

---

### protocol

> **protocol**: `string`

#### Source

services/SettingsService.ts:47

---

### sdkKey

> **sdkKey**: `string`

#### Implementation of

`ISettingsService.sdkKey`

#### Source

services/SettingsService.ts:41

---

### instance

> `static` `private` **instance**: [`SettingsService`](SettingsService.md)

#### Source

services/SettingsService.ts:49

## Accessors

### Instance

> `get` `static` **Instance**(): [`SettingsService`](SettingsService.md)

#### Returns

[`SettingsService`](SettingsService.md)

#### Source

services/SettingsService.ts:92

## Methods

### fetchSettings()

> **fetchSettings**(): `Promise`\<[`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)\>

#### Returns

`Promise`\<[`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)\>

#### Implementation of

`ISettingsService.fetchSettings`

#### Source

services/SettingsService.ts:137

---

### fetchSettingsAndCacheInStorage()

> `private` **fetchSettingsAndCacheInStorage**(): `any`

#### Returns

`any`

#### Source

services/SettingsService.ts:108

---

### getSettings()

> **getSettings**(`forceFetch`): `Promise`\<[`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)\>

#### Parameters

• **forceFetch**: `boolean`= `false`

#### Returns

`Promise`\<[`SettingsModel`](../../../models/settings/SettingsModel/classes/SettingsModel.md)\>

#### Implementation of

`ISettingsService.getSettings`

#### Source

services/SettingsService.ts:189

---

### setSettingsExpiry()

> `private` **setSettingsExpiry**(): `void`

#### Returns

`void`

#### Source

services/SettingsService.ts:96
