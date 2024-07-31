[**vwo-fme-node-sdk**](../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../modules.md) / [VWOBuilder](../README.md) / IVWOBuilder

# Interface: IVWOBuilder

## Properties

### isSettingsFetchInProgress

> **isSettingsFetchInProgress**: `boolean`

#### Source

VWOBuilder.ts:41

---

### logManager

> **logManager**: [`ILogManager`](../../packages/logger/interfaces/ILogManager.md)

#### Source

VWOBuilder.ts:40

---

### settings

> **settings**: [`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)

#### Source

VWOBuilder.ts:38

---

### storage

> **storage**: [`Storage`](../../packages/storage/Storage/classes/Storage.md)

#### Source

VWOBuilder.ts:39

---

### vwoInstance

> **vwoInstance**: [`IVWOClient`](../../VWOClient/interfaces/IVWOClient.md)

#### Source

VWOBuilder.ts:42

## Methods

### build()

> **build**(`settings`): [`IVWOClient`](../../VWOClient/interfaces/IVWOClient.md)

#### Parameters

• **settings**: [`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)

#### Returns

[`IVWOClient`](../../VWOClient/interfaces/IVWOClient.md)

#### Source

VWOBuilder.ts:44

---

### fetchSettings()

> **fetchSettings**(): `Promise`\<[`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)\>

#### Returns

`Promise`\<[`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)\>

#### Source

VWOBuilder.ts:46

---

### getSettings()

> **getSettings**(`force`): `Promise`\<[`dynamic`](../../types/Common/type-aliases/dynamic.md)\>

#### Parameters

• **force**: `boolean`

#### Returns

`Promise`\<[`dynamic`](../../types/Common/type-aliases/dynamic.md)\>

#### Source

VWOBuilder.ts:48

---

### initPolling()

> **initPolling**(): `this`

#### Returns

`this`

#### Source

VWOBuilder.ts:53

---

### setLogger()

> **setLogger**(): `this`

#### Returns

`this`

#### Source

VWOBuilder.ts:54

---

### setNetworkManager()

> **setNetworkManager**(): `this`

#### Returns

`this`

#### Source

VWOBuilder.ts:50

---

### setSegmentation()

> **setSegmentation**(): `this`

#### Returns

`this`

#### Source

VWOBuilder.ts:55

---

### setSettingsService()

> **setSettingsService**(): `this`

#### Returns

`this`

#### Source

VWOBuilder.ts:47

---

### setStorage()

> **setStorage**(): `this`

#### Returns

`this`

#### Source

VWOBuilder.ts:49
