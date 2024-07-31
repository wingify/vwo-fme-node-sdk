[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [services/HooksService](../README.md) / default

# Class: default

## Implements

- [`IHooksService`](../interfaces/IHooksService.md)

## Constructors

### new default()

> **new default**(`options`): [`default`](default.md)

#### Parameters

• **options**: [`IVWOOptions`](../../../models/VWOOptionsModel/interfaces/IVWOOptions.md)

#### Returns

[`default`](default.md)

#### Source

services/HooksService.ts:29

## Properties

### callback()

> `private` **callback**: (`properties`) => `void`

#### Parameters

• **properties**: `Record`\<`string`, `any`\>

#### Returns

`void`

#### Source

services/HooksService.ts:25

---

### decision

> `private` **decision**: `Record`\<`string`, `any`\>

#### Source

services/HooksService.ts:27

---

### isCallBackFunction

> `private` **isCallBackFunction**: `boolean`

#### Source

services/HooksService.ts:26

## Methods

### execute()

> **execute**(`properties`): `void`

Executes the callback

#### Parameters

• **properties**: `Record`\<`string`, `any`\>

Properties from the callback

#### Returns

`void`

#### Implementation of

[`IHooksService`](../interfaces/IHooksService.md).[`execute`](../interfaces/IHooksService.md#execute)

#### Source

services/HooksService.ts:39

---

### get()

> **get**(): `Record`\<`string`, `any`\>

Retrieves the decision object

#### Returns

`Record`\<`string`, `any`\>

The decision object

#### Implementation of

[`IHooksService`](../interfaces/IHooksService.md).[`get`](../interfaces/IHooksService.md#get)

#### Source

services/HooksService.ts:59

---

### set()

> **set**(`properties`): `void`

Sets properties to the decision object

#### Parameters

• **properties**: `Record`\<`string`, `any`\>

Properties to set

#### Returns

`void`

#### Implementation of

[`IHooksService`](../interfaces/IHooksService.md).[`set`](../interfaces/IHooksService.md#set)

#### Source

services/HooksService.ts:49
