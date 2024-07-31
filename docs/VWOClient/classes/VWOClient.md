[**vwo-fme-node-sdk**](../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../modules.md) / [VWOClient](../README.md) / VWOClient

# Class: VWOClient

## Implements

- [`IVWOClient`](../interfaces/IVWOClient.md)

## Constructors

### new VWOClient()

> **new VWOClient**(`settings`, `options`): [`VWOClient`](VWOClient.md)

#### Parameters

• **settings**: [`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)

• **options**: [`IVWOOptions`](../../models/VWOOptionsModel/interfaces/IVWOOptions.md)

#### Returns

[`VWOClient`](VWOClient.md)

#### Source

VWOClient.ts:60

## Properties

### options?

> `optional` **options**: [`IVWOOptions`](../../models/VWOOptionsModel/interfaces/IVWOOptions.md)

#### Implementation of

[`IVWOClient`](../interfaces/IVWOClient.md).[`options`](../interfaces/IVWOClient.md#options)

#### Source

VWOClient.ts:72

---

### originalSettings

> **originalSettings**: `Record`\<`any`, `any`\>

#### Source

VWOClient.ts:57

---

### settings

> **settings**: [`SettingsModel`](../../models/settings/SettingsModel/classes/SettingsModel.md)

#### Implementation of

[`IVWOClient`](../interfaces/IVWOClient.md).[`settings`](../interfaces/IVWOClient.md#settings)

#### Source

VWOClient.ts:56

---

### storage

> **storage**: [`Storage`](../../packages/storage/Storage/classes/Storage.md)

#### Source

VWOClient.ts:58

## Methods

### getFlag()

> **getFlag**(`featureKey`, `context`): `Record`\<`any`, `any`\>

Retrieves the value of a feature flag for a given feature key and context.
This method validates the feature key and context, ensures the settings are valid, and then uses the FlagApi to get the flag value.

#### Parameters

• **featureKey**: `string`

The key of the feature to retrieve.

• **context**: `Record`\<`string`, `any`\>

The context in which the feature flag is being retrieved, must include a valid user ID.

#### Returns

`Record`\<`any`, `any`\>

- A promise that resolves to the feature flag value.

#### Implementation of

[`IVWOClient`](../interfaces/IVWOClient.md).[`getFlag`](../interfaces/IVWOClient.md#getflag)

#### Source

VWOClient.ts:81

---

### setAttribute()

> **setAttribute**(`attributeKey`, `attributeValue`, `context`): `void`

Sets an attribute for a user in the context provided.
This method validates the types of the inputs before proceeding with the API call.

#### Parameters

• **attributeKey**: `string`

The key of the attribute to set.

• **attributeValue**: `string`

The value of the attribute to set.

• **context**: `Record`\<`string`, `any`\>

The context in which the attribute should be set, must include a valid user ID.

#### Returns

`void`

#### Implementation of

[`IVWOClient`](../interfaces/IVWOClient.md).[`setAttribute`](../interfaces/IVWOClient.md#setattribute)

#### Source

VWOClient.ts:250

---

### trackEvent()

> **trackEvent**(`eventName`, `eventProperties`, `context`): `Promise`\<`Record`\<`string`, `boolean`\>\>

Tracks an event with specified properties and context.
This method validates the types of the inputs and ensures the settings and user context are valid before proceeding.

#### Parameters

• **eventName**: `string`

The name of the event to track.

• **eventProperties**: `Record`\<`string`, [`dynamic`](../../types/Common/type-aliases/dynamic.md)\>= `{}`

The properties associated with the event.

• **context**: `Record`\<`string`, `any`\>

The context in which the event is being tracked, must include a valid user ID.

#### Returns

`Promise`\<`Record`\<`string`, `boolean`\>\>

- A promise that resolves to the result of the tracking operation.

#### Implementation of

[`IVWOClient`](../interfaces/IVWOClient.md).[`trackEvent`](../interfaces/IVWOClient.md#trackevent)

#### Source

VWOClient.ts:158
