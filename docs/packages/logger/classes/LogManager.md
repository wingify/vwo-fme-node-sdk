[**vwo-fme-node-sdk**](../../../README.md) • **Docs**

---

[vwo-fme-node-sdk](../../../modules.md) / [packages/logger](../README.md) / LogManager

# Class: LogManager

LogManager class provides logging functionality with support for multiple transports.
It is designed as a singleton to ensure a single instance throughout the application.

## Extends

- [`Logger`](../Logger/classes/Logger.md)

## Implements

- [`ILogManager`](../interfaces/ILogManager.md)

## Constructors

### new LogManager()

> **new LogManager**(`config`?): [`LogManager`](LogManager.md)

Constructor for LogManager.

#### Parameters

• **config?**: `Record`\<`string`, `any`\>

Configuration object for LogManager.

#### Returns

[`LogManager`](LogManager.md)

#### Overrides

[`Logger`](../Logger/classes/Logger.md).[`constructor`](../Logger/classes/Logger.md#constructors)

#### Source

packages/logger/core/LogManager.ts:68

## Properties

### config

> **config**: `Record`\<`string`, `any`\>

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`config`](../interfaces/ILogManager.md#config)

#### Source

packages/logger/core/LogManager.ts:53

---

### level

> **level**: [`LogLevelEnum`](../../../index/enumerations/LogLevelEnum.md) = `LogLevelEnum.ERROR`

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`level`](../interfaces/ILogManager.md#level)

#### Source

packages/logger/core/LogManager.ts:56

---

### name

> **name**: `string` = `'VWO Logger'`

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`name`](../interfaces/ILogManager.md#name)

#### Source

packages/logger/core/LogManager.ts:54

---

### prefix

> **prefix**: `string` = `'VWO-SDK'`

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`prefix`](../interfaces/ILogManager.md#prefix)

#### Source

packages/logger/core/LogManager.ts:57

---

### requestId

> **requestId**: `any`

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`requestId`](../interfaces/ILogManager.md#requestid)

#### Source

packages/logger/core/LogManager.ts:55

---

### transport

> **transport**: `Record`\<`string`, `any`\>

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`transport`](../interfaces/ILogManager.md#transport)

#### Source

packages/logger/core/LogManager.ts:61

---

### transportManager

> **transportManager**: `LogTransportManager`

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`transportManager`](../interfaces/ILogManager.md#transportmanager)

#### Source

packages/logger/core/LogManager.ts:52

---

### transports

> **transports**: `Record`\<`string`, `any`\>[]

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`transports`](../interfaces/ILogManager.md#transports)

#### Source

packages/logger/core/LogManager.ts:62

---

### instance

> `static` `private` **instance**: [`LogManager`](LogManager.md)

#### Source

packages/logger/core/LogManager.ts:51

## Accessors

### Instance

> `get` `static` **Instance**(): [`LogManager`](LogManager.md)

Provides access to the singleton instance of LogManager.

#### Returns

[`LogManager`](LogManager.md)

The singleton instance.

#### Source

packages/logger/core/LogManager.ts:95

## Methods

### addTransport()

> **addTransport**(`transport`): `void`

Adds a single transport to the LogManager.

#### Parameters

• **transport**: `Record`\<`any`, `any`\>

The transport object to add.

#### Returns

`void`

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`addTransport`](../interfaces/ILogManager.md#addtransport)

#### Source

packages/logger/core/LogManager.ts:124

---

### addTransports()

> **addTransports**(`transports`): `void`

Adds multiple transports to the LogManager.

#### Parameters

• **transports**: `Record`\<`any`, `any`\>

The list of transport objects to add.

#### Returns

`void`

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`addTransports`](../interfaces/ILogManager.md#addtransports)

#### Source

packages/logger/core/LogManager.ts:132

---

### dateTimeFormat()

> **dateTimeFormat**(): `string`

#### Returns

`string`

#### Implementation of

[`ILogManager`](../interfaces/ILogManager.md).[`dateTimeFormat`](../interfaces/ILogManager.md#datetimeformat)

#### Source

packages/logger/core/LogManager.ts:58

---

### debug()

> **debug**(`message`): `void`

Logs a debug message.

#### Parameters

• **message**: `string`

The message to log at debug level.

#### Returns

`void`

#### Overrides

[`Logger`](../Logger/classes/Logger.md).[`debug`](../Logger/classes/Logger.md#debug)

#### Source

packages/logger/core/LogManager.ts:150

---

### error()

> **error**(`message`): `void`

Logs an error message.

#### Parameters

• **message**: `string`

The message to log at error level.

#### Returns

`void`

#### Overrides

[`Logger`](../Logger/classes/Logger.md).[`error`](../Logger/classes/Logger.md#error)

#### Source

packages/logger/core/LogManager.ts:174

---

### handleTransports()

> **handleTransports**(): `void`

Handles the initialization and setup of transports based on configuration.

#### Returns

`void`

#### Source

packages/logger/core/LogManager.ts:102

---

### info()

> **info**(`message`): `void`

Logs an informational message.

#### Parameters

• **message**: `string`

The message to log at info level.

#### Returns

`void`

#### Overrides

[`Logger`](../Logger/classes/Logger.md).[`info`](../Logger/classes/Logger.md#info)

#### Source

packages/logger/core/LogManager.ts:158

---

### trace()

> **trace**(`message`): `void`

Logs a trace message.

#### Parameters

• **message**: `string`

The message to log at trace level.

#### Returns

`void`

#### Overrides

[`Logger`](../Logger/classes/Logger.md).[`trace`](../Logger/classes/Logger.md#trace)

#### Source

packages/logger/core/LogManager.ts:142

---

### warn()

> **warn**(`message`): `void`

Logs a warning message.

#### Parameters

• **message**: `string`

The message to log at warn level.

#### Returns

`void`

#### Overrides

[`Logger`](../Logger/classes/Logger.md).[`warn`](../Logger/classes/Logger.md#warn)

#### Source

packages/logger/core/LogManager.ts:166
