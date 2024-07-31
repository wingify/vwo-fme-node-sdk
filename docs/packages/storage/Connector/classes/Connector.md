[**vwo-fme-node-sdk**](../../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../../modules.md) / [packages/storage/Connector](../README.md) / Connector

# Class: `abstract` Connector

## Constructors

### new Connector()

> **new Connector**(): [`Connector`](Connector.md)

#### Returns

[`Connector`](Connector.md)

## Methods

### get()

> `abstract` **get**(`_key`): `Promise`\<[`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\> \| [`Connector`](Connector.md)

#### Parameters

• **\_key**: `string`

#### Returns

`Promise`\<[`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\> \| [`Connector`](Connector.md)

#### Source

packages/storage/Connector.ts:23

---

### set()

> `abstract` **set**(`_key`, `_data`): `void` \| `Promise`\<[`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Parameters

• **\_key**: `string`

• **\_data**: [`dynamic`](../../../../types/Common/type-aliases/dynamic.md)

#### Returns

`void` \| `Promise`\<[`dynamic`](../../../../types/Common/type-aliases/dynamic.md)\>

#### Source

packages/storage/Connector.ts:21
