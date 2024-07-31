[**vwo-fme-node-sdk**](../../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../../modules.md) / [packages/logger/Logger](../README.md) / Logger

# Class: `abstract` Logger

Abstract class representing a logger.
This class provides the structure for logging mechanisms and should be extended by specific logger implementations.

## Extended by

- [`LogManager`](../../classes/LogManager.md)

## Constructors

### new Logger()

> **new Logger**(): [`Logger`](Logger.md)

#### Returns

[`Logger`](Logger.md)

## Methods

### debug()

> `abstract` **debug**(`message`): `void`

Logs a message at the debug level.

#### Parameters

• **message**: `string`

The message to log.

#### Returns

`void`

#### Source

packages/logger/Logger.ts:31

---

### error()

> `abstract` **error**(`message`): `void`

Logs a message at the error level.

#### Parameters

• **message**: `string`

The message to log.

#### Returns

`void`

#### Source

packages/logger/Logger.ts:49

---

### info()

> `abstract` **info**(`message`): `void`

Logs a message at the info level.

#### Parameters

• **message**: `string`

The message to log.

#### Returns

`void`

#### Source

packages/logger/Logger.ts:37

---

### trace()

> `abstract` **trace**(`message`): `void`

Logs a message at the trace level.

#### Parameters

• **message**: `string`

The message to log.

#### Returns

`void`

#### Source

packages/logger/Logger.ts:25

---

### warn()

> `abstract` **warn**(`message`): `void`

Logs a message at the warn level.

#### Parameters

• **message**: `string`

The message to log.

#### Returns

`void`

#### Source

packages/logger/Logger.ts:43
