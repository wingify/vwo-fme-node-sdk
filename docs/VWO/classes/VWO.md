[**vwo-fme-node-sdk**](../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../modules.md) / [VWO](../README.md) / VWO

# Class: VWO

## Constructors

### new VWO()

> **new VWO**(`options`): [`VWO`](VWO.md)

Constructor for the VWO class.
Initializes a new instance of VWO with the provided options.

#### Parameters

• **options**: [`IVWOOptions`](../../models/VWOOptionsModel/interfaces/IVWOOptions.md)

Configuration options for the VWO instance.

#### Returns

[`VWO`](VWO.md)

The instance of VWO.

#### Source

VWO.ts:38

## Properties

### instance

> `static` `private` **instance**: [`dynamic`](../../types/Common/type-aliases/dynamic.md)

#### Source

VWO.ts:30

---

### vwoBuilder

> `static` `private` **vwoBuilder**: [`VWOBuilder`](../../VWOBuilder/classes/VWOBuilder.md)

#### Source

VWO.ts:29

## Accessors

### Instance

> `get` `static` **Instance**(): [`dynamic`](../../types/Common/type-aliases/dynamic.md)

Gets the singleton instance of VWO.

#### Returns

[`dynamic`](../../types/Common/type-aliases/dynamic.md)

The singleton instance of VWO.

#### Source

VWO.ts:71

## Methods

### setInstance()

> `static` `private` **setInstance**(`options`): `Promise`\<[`IVWOClient`](../../VWOClient/interfaces/IVWOClient.md)\>

Sets the singleton instance of VWO.
Configures and builds the VWO instance using the provided options.

#### Parameters

• **options**: [`IVWOOptions`](../../models/VWOOptionsModel/interfaces/IVWOOptions.md)

Configuration options for setting up VWO.

#### Returns

`Promise`\<[`IVWOClient`](../../VWOClient/interfaces/IVWOClient.md)\>

A Promise resolving to the configured VWO instance.

#### Source

VWO.ts:48
