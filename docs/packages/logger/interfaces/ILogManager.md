[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/logger](../README.md) / ILogManager

# Interface: ILogManager

Interface defining the structure and methods for LogManager.

## Properties

### config?

> `optional` **config**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

#### Source

packages/logger/core/LogManager.ts:32

---

### dateTimeFormat()?

> `optional` **dateTimeFormat**: () => `string`

#### Returns

`string`

#### Source

packages/logger/core/LogManager.ts:37

---

### level

> **level**: `string`

#### Source

packages/logger/core/LogManager.ts:35

---

### name?

> `optional` **name**: `string`

#### Source

packages/logger/core/LogManager.ts:33

---

### prefix?

> `optional` **prefix**: `string`

#### Source

packages/logger/core/LogManager.ts:36

---

### requestId?

> `optional` **requestId**: `string`

#### Source

packages/logger/core/LogManager.ts:34

---

### transport?

> `optional` **transport**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

#### Source

packages/logger/core/LogManager.ts:39

---

### transportManager?

> `optional` **transportManager**: `LogTransportManager`

#### Source

packages/logger/core/LogManager.ts:31

---

### transports?

> `optional` **transports**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>[]

#### Source

packages/logger/core/LogManager.ts:40

## Methods

### addTransport()?

> `optional` **addTransport**(`transportObject`): `void`

#### Parameters

• **transportObject**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>

#### Returns

`void`

#### Source

packages/logger/core/LogManager.ts:42

---

### addTransports()?

> `optional` **addTransports**(`transportsList`): `void`

#### Parameters

• **transportsList**: `Record`\<`string`, [`dynamic`](../../../types/Common/type-aliases/dynamic.md)\>[]

#### Returns

`void`

#### Source

packages/logger/core/LogManager.ts:43
