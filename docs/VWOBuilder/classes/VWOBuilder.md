[**vwo-fme-node-sdk**](../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../modules.md) / [VWOBuilder](../README.md) / VWOBuilder

# Class: VWOBuilder

## Implements

- [`IVWOBuilder`](../interfaces/IVWOBuilder.md)

## Constructors

### new VWOBuilder()

> **new VWOBuilder**(`options`): [`VWOBuilder`](VWOBuilder.md)

#### Parameters

• **options**: [`IVWOOptions`](../../models/VWOOptionsModel/interfaces/IVWOOptions.md)

#### Returns

[`VWOBuilder`](VWOBuilder.md)

#### Source

VWOBuilder.ts:71

## Properties

### isSettingsFetchInProgress

> **isSettingsFetchInProgress**: `boolean`

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`isSettingsFetchInProgress`](../interfaces/IVWOBuilder.md#issettingsfetchinprogress)

#### Source

VWOBuilder.ts:68

---

### logManager

> **logManager**: [`ILogManager`](../../packages/logger/interfaces/ILogManager.md)

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`logManager`](../interfaces/IVWOBuilder.md#logmanager)

#### Source

VWOBuilder.ts:66

---

### options

> `readonly` **options**: [`IVWOOptions`](../../models/VWOOptionsModel/interfaces/IVWOOptions.md)

#### Source

VWOBuilder.ts:60

---

### originalSettings

> **originalSettings**: [`dynamic`](../../types/Common/type-aliases/dynamic.md)

#### Source

VWOBuilder.ts:67

---

### sdkKey

> `readonly` **sdkKey**: `string`

#### Source

VWOBuilder.ts:59

---

### settingFileManager

> `private` **settingFileManager**: [`SettingsService`](../../services/SettingsService/classes/SettingsService.md)

#### Source

VWOBuilder.ts:62

---

### settings

> **settings**: [`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`settings`](../interfaces/IVWOBuilder.md#settings)

#### Source

VWOBuilder.ts:64

---

### storage

> **storage**: [`Storage`](../../packages/storage/Storage/classes/Storage.md)

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`storage`](../interfaces/IVWOBuilder.md#storage)

#### Source

VWOBuilder.ts:65

---

### vwoInstance

> **vwoInstance**: [`IVWOClient`](../../VWOClient/interfaces/IVWOClient.md)

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`vwoInstance`](../interfaces/IVWOBuilder.md#vwoinstance)

#### Source

VWOBuilder.ts:69

## Methods

### build()

> **build**(`settings`): [`IVWOClient`](../../VWOClient/interfaces/IVWOClient.md)

Builds a new VWOClient instance with the provided settings.

#### Parameters

• **settings**: [`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)

The settings for the VWOClient.

#### Returns

[`IVWOClient`](../../VWOClient/interfaces/IVWOClient.md)

The new VWOClient instance.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`build`](../interfaces/IVWOBuilder.md#build)

#### Source

VWOBuilder.ts:326

---

### checkAndPoll()

> **checkAndPoll**(): `void`

Checks and polls for settings updates at the provided interval.

#### Returns

`void`

#### Source

VWOBuilder.ts:335

---

### fetchSettings()

> **fetchSettings**(`force`?): `Promise`\<[`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)\>

Fetches settings asynchronously, ensuring no parallel fetches.

#### Parameters

• **force?**: `boolean`

Force fetch ignoring cache.

#### Returns

`Promise`\<[`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)\>

A promise that resolves to the fetched settings.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`fetchSettings`](../interfaces/IVWOBuilder.md#fetchsettings)

#### Source

VWOBuilder.ts:113

---

### getRandomUserId()

> **getRandomUserId**(): `string`

Generates a random user ID based on the provided API key.

#### Returns

`string`

The generated random user ID.

#### Source

VWOBuilder.ts:237

---

### getSettings()

> **getSettings**(`force`?): `Promise`\<[`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)\>

Gets the settings, fetching them if not cached or if forced.

#### Parameters

• **force?**: `boolean`

Force fetch ignoring cache.

#### Returns

`Promise`\<[`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)\>

A promise that resolves to the settings.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`getSettings`](../interfaces/IVWOBuilder.md#getsettings)

#### Source

VWOBuilder.ts:141

---

### initPolling()

> **initPolling**(): `this`

Initializes the polling with the provided poll interval.

#### Returns

`this`

The instance of this builder.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`initPolling`](../interfaces/IVWOBuilder.md#initpolling)

#### Source

VWOBuilder.ts:291

---

### setLogger()

> **setLogger**(): `this`

Sets the logger with the provided logger options.

#### Returns

`this`

The instance of this builder.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`setLogger`](../interfaces/IVWOBuilder.md#setlogger)

#### Source

VWOBuilder.ts:192

---

### setNetworkManager()

> **setNetworkManager**(): `this`

Sets the network manager with the provided client and development mode options.

#### Returns

`this`

The instance of this builder.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`setNetworkManager`](../interfaces/IVWOBuilder.md#setnetworkmanager)

#### Source

VWOBuilder.ts:79

---

### setSegmentation()

> **setSegmentation**(): `this`

Sets the segmentation evaluator with the provided segmentation options.

#### Returns

`this`

The instance of this builder.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`setSegmentation`](../interfaces/IVWOBuilder.md#setsegmentation)

#### Source

VWOBuilder.ts:98

---

### setSettingsService()

> **setSettingsService**(): `this`

Sets the settings manager with the provided options.

#### Returns

`this`

The instance of this builder.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`setSettingsService`](../interfaces/IVWOBuilder.md#setsettingsservice)

#### Source

VWOBuilder.ts:182

---

### setStorage()

> **setStorage**(): `this`

Sets the storage connector based on the provided storage options.

#### Returns

`this`

The instance of this builder.

#### Implementation of

[`IVWOBuilder`](../interfaces/IVWOBuilder.md).[`setStorage`](../interfaces/IVWOBuilder.md#setstorage)

#### Source

VWOBuilder.ts:166
